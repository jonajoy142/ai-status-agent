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
