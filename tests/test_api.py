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
