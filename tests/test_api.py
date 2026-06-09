from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_agent_run_returns_structured_report():
    response = client.post(
        "/agent/run",
        json={"question": "What is the checkout launch status and risk?", "session_id": "test-session"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["run_id"]
    assert payload["report"]["executive_summary"]
    assert payload["sources"]
    assert payload["tool_calls"]
    assert payload["trace"]


def test_tool_discovery_is_mcp_ready():
    response = client.get("/agent/tools")

    assert response.status_code == 200
    tools = response.json()["tools"]
    assert {tool["name"] for tool in tools} >= {
        "project.search_tickets",
        "project.search_chat",
        "project.search_docs",
    }
    assert all(tool["mcp_compatible"] for tool in tools)


def test_knowledge_sources_include_project_data():
    response = client.get("/knowledge/sources")

    assert response.status_code == 200
    sources = {source["source"]: source for source in response.json()["sources"]}
    assert sources["tickets"]["documents"] >= 1
    assert sources["slack"]["documents"] >= 1
    assert sources["docs"]["documents"] >= 1


def test_operating_product_endpoints_return_demo_data():
    dashboard = client.get("/dashboard?role=founder")
    work_items = client.get("/work-items")
    risks = client.get("/risks")
    connectors = client.get("/connectors")
    evaluations = client.get("/evaluations/summary")

    assert dashboard.status_code == 200
    assert dashboard.json()["sprint_health"] >= 1
    assert work_items.status_code == 200
    assert work_items.json()["work_items"]
    assert risks.status_code == 200
    assert risks.json()["risks"]
    assert connectors.status_code == 200
    assert connectors.json()["connectors"]
    assert evaluations.status_code == 200
    assert evaluations.json()["average_score"] >= 1


def test_mcp_ready_external_tool_descriptors_are_discoverable():
    response = client.get("/agent/tools")

    tool_names = {tool["name"] for tool in response.json()["tools"]}
    assert {
        "jira.search_issues",
        "jira.get_issue",
        "jira.get_comments",
        "jira.sync_project",
        "github.search_prs",
        "github.get_pr_status",
        "slack.search_messages",
        "confluence.search_pages",
        "notion.search_docs",
    }.issubset(tool_names)


def test_role_specific_dashboard_endpoint_shapes():
    founder = client.get("/api/dashboard/founder")
    pm = client.get("/api/dashboard/product_manager")
    em = client.get("/api/dashboard/engineering_manager")
    engineer = client.get("/api/dashboard/developer")

    assert founder.status_code == 200
    assert founder.json()["business_priorities"]
    assert founder.json()["decisions_needed_items"]
    assert pm.status_code == 200
    assert pm.json()["sprint"]["percent_complete"] == 42
    assert pm.json()["blocked_tickets"]
    assert em.status_code == 200
    assert em.json()["team_capacity"]
    assert em.json()["pr_delays"]
    assert engineer.status_code == 200
    assert engineer.json()["my_tasks"]


def test_weekly_report_generation_is_audience_aware():
    founder = client.post("/api/reports/weekly/generate", json={"audience": "founder"})
    em = client.post("/api/reports/weekly/generate", json={"audience": "engineering_manager"})

    assert founder.status_code == 200
    assert em.status_code == 200
    assert founder.json()["audience"] == "founder"
    assert em.json()["audience"] == "engineering_manager"
    assert "revenue" in founder.json()["executive_summary"].lower()
    assert "pr #241" in em.json()["executive_summary"].lower()


def test_mcp_endpoint_can_execute_registered_tool():
    response = client.post("/mcp/tools/jira.search_blocked/execute", json={"inputs": {}})

    assert response.status_code == 200
    payload = response.json()
    assert payload["tool_call"]["tool_name"] == "jira.search_blocked"
    assert payload["result"]


def test_metrics_endpoint_exposes_prometheus_text():
    response = client.get("/metrics")

    assert response.status_code == 200
    assert "sprintpilot_agent_run_total" in response.text
    assert "sprintpilot_evaluation_score" in response.text


def test_auth_login_refresh_and_me_flow():
    login = client.post("/api/auth/login", json={"email": "founder@demo.sprintpilot.ai", "password": "demo123"})

    assert login.status_code == 200
    payload = login.json()
    assert payload["access_token"]
    assert payload["role"] == "founder"

    me = client.get("/api/users/me", headers={"Authorization": f"Bearer {payload['access_token']}"})
    assert me.status_code == 200
    assert me.json()["workspace_id"] == "ws-demo"

    refresh = client.post("/api/auth/refresh")
    assert refresh.status_code == 200
    assert refresh.json()["access_token"]


def test_agentic_graph_endpoint_dynamic_trace():
    response = client.post(
        "/api/agentic/run",
        json={"workspace_id": "demo-workspace", "role": "founder", "query": "What is blocked for checkout launch?"},
    )

    assert response.status_code == 200
    payload = response.json()
    state = payload["state"]
    assert payload["run_id"]
    assert "decision" in state["supervisor_plan"]
    assert state["decisions_surfaced"]
    assert state["tool_calls_log"]
    assert state["evaluation_result"]
