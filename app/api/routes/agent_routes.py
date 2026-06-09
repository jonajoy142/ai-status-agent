from typing import Any

from fastapi import APIRouter, Header, HTTPException, Response
from pydantic import BaseModel

from app.application.dto.agent_request import AgentRunRequest
from app.application.services.status_service import StatusService
from app.config.settings import settings
from app.infrastructure.agents.tracing import get_trace
from app.domain.models.operating import WeeklyReportRequest
from app.infrastructure.demo.operating_data import (
    BUSINESS_PRIORITIES,
    PULL_REQUESTS,
    TEAMS,
    dashboard_for_role,
    role_dashboard_detail,
    sync_connector,
    weekly_report_for_audience,
)
from app.infrastructure.mcp.tool_registry import ToolAuthContext, ToolExecutionOptions
from app.infrastructure.rag.ingestion.loader import load_documents
from app.infrastructure.storage import store

router = APIRouter()
service = StatusService()


class QueryRequest(BaseModel):
    question: str


class ConnectorConnectRequest(BaseModel):
    auth_type: str = "api_key"
    masked_key: str | None = None


class ToolExecuteRequest(BaseModel):
    inputs: dict[str, Any] = {}
    workspace_id: str = "demo-workspace"
    user_id: str = "demo-user"


@router.post("/query")
def query_agent(req: QueryRequest):
    result = service.get_status(req.question)
    return {"result": result}


@router.post("/agent/run")
def run_agent(req: AgentRunRequest, x_demo_role: str = Header(default="founder")):
    result = service.run(question=req.question, session_id=req.session_id)
    store.audit(actor=x_demo_role, action="agent.run", target=result.run_id, payload={"question": req.question})
    return result


@router.get("/agent/tools")
def list_tools():
    return {"tools": [tool.model_dump(mode="json") for tool in service.list_tools()]}


@router.get("/mcp/tools")
def list_mcp_tools(category: str | None = None):
    tools = service.list_tools()
    if category:
        tools = [tool for tool in tools if category in tool.tags]
    return {
        "tools": [
            {
                "name": tool.name,
                "description": tool.description,
                "inputSchema": tool.input_schema,
                "outputSchema": tool.output_schema,
                "authRequired": tool.auth_required,
                "tags": tool.tags,
            }
            for tool in tools
        ]
    }


@router.post("/mcp/tools/{tool_name}/execute")
def execute_mcp_tool(tool_name: str, req: ToolExecuteRequest, x_demo_role: str = Header(default="founder")):
    try:
        result = service.agent.registry.execute(
            tool_name,
            agent="mcp",
            auth_context=ToolAuthContext(workspace_id=req.workspace_id, user_id=req.user_id),
            options=ToolExecutionOptions(max_retries=1),
            **req.inputs,
        )
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    store.audit(actor=x_demo_role, action="mcp.tool.execute", target=tool_name, payload=result.record.model_dump(mode="json"))
    return {"result": result.output, "tool_call": result.record.model_dump(mode="json"), "attempts": result.attempts}


@router.get("/trace")
def get_agent_trace(run_id: str | None = None):
    return {"trace": get_trace(run_id)}


@router.get("/demo/users")
def demo_users():
    return {"users": store.list_records("users")}


@router.get("/dashboard")
def dashboard(role: str = "founder"):
    return dashboard_for_role(role)


@router.get("/api/dashboard/{role}")
@router.get("/dashboard/{role}")
def role_dashboard(role: str):
    return role_dashboard_detail(role)


@router.get("/work-items")
def work_items():
    return {"work_items": store.list_records("work_items")}


@router.get("/api/work-items")
def api_work_items():
    return work_items()


@router.get("/work-items/{work_item_id}")
def work_item_detail(work_item_id: str):
    item = store.get_record("work_items", work_item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Work item not found")
    return item


@router.get("/risks")
def risks():
    return {"risks": store.list_records("risks"), "decisions": store.list_records("decisions")}


@router.get("/api/risks")
def api_risks():
    return risks()


@router.get("/risks/{risk_id}")
def risk_detail(risk_id: str):
    risk = store.get_record("risks", risk_id)
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found")
    return risk


@router.get("/decisions")
def decisions():
    return {"decisions": store.list_records("decisions")}


@router.get("/api/decisions")
def api_decisions():
    return decisions()


@router.get("/teams")
@router.get("/api/teams")
def teams():
    return {"teams": [team.model_dump(mode="json") for team in TEAMS]}


@router.get("/priorities")
@router.get("/api/priorities")
def business_priorities():
    return {"priorities": [priority.model_dump(mode="json") for priority in BUSINESS_PRIORITIES]}


@router.get("/prs")
@router.get("/api/prs")
def pull_requests():
    return {"pull_requests": [pr.model_dump(mode="json") for pr in PULL_REQUESTS]}


@router.get("/sprints/current")
@router.get("/api/sprints/current")
def current_sprint():
    return {"name": "Sprint 24", "period": "June 3-17", "days_remaining": 12, "percent_complete": 42, "goal_points": 68, "release_readiness": 68}


@router.get("/reports")
def reports():
    return {"reports": store.list_records("reports")}


@router.get("/api/reports")
def api_reports():
    return reports()


@router.get("/reports/demo")
def demo_report():
    return service.run("What is the current checkout launch status and risk?")


@router.post("/reports/weekly/generate")
@router.post("/api/reports/weekly/generate")
def generate_weekly_report(req: WeeklyReportRequest, x_demo_role: str = Header(default="founder")):
    report = weekly_report_for_audience(req)
    payload = report.model_dump(mode="json")
    store.upsert_record("weekly_reports", report.id, payload)
    store.audit(actor=x_demo_role, action="report.weekly.generate", target=report.id, payload={"audience": report.audience})
    return payload


@router.get("/reports/weekly/history")
@router.get("/api/reports/weekly/history")
def weekly_report_history():
    generated = store.list_records("weekly_reports")
    if not generated:
        generated = [weekly_report_for_audience(WeeklyReportRequest(audience="founder")).model_dump(mode="json")]
    return {"reports": generated}


@router.get("/reports/{report_id}")
def report_detail(report_id: str):
    report = store.get_record("reports", report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.get("/reports/{report_id}/export")
def export_report(report_id: str):
    report = store.get_record("reports", report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    markdown = report_to_markdown(report)
    return Response(content=markdown, media_type="text/markdown")


@router.get("/connectors")
def connectors():
    return {"connectors": store.list_records("connectors")}


@router.get("/api/connectors/status")
@router.get("/api/connectors")
def api_connectors():
    return connectors()


@router.post("/connectors/{connector_id}/connect")
def connect_connector(connector_id: str, req: ConnectorConnectRequest, x_demo_role: str = Header(default="founder")):
    connector = store.get_record("connectors", connector_id)
    if not connector:
        raise HTTPException(status_code=404, detail="Connector not found")
    connector = {**connector, "status": "mock", "auth_type": req.auth_type}
    store.upsert_record("connectors", connector_id, connector)
    store.audit(actor=x_demo_role, action="connector.connect", target=connector_id, payload={"auth_type": req.auth_type, "masked_key": req.masked_key})
    return connector


@router.post("/connectors/{connector_id}/sync")
def sync_connector_endpoint(connector_id: str, x_demo_role: str = Header(default="founder")):
    sync = sync_connector(connector_id).model_dump(mode="json")
    store.create_sync_run(connector_id, sync)
    connector = store.get_record("connectors", connector_id)
    if connector:
        connector = {**connector, "status": "mock", "last_synced_at": sync.get("started_at")}
        store.upsert_record("connectors", connector_id, connector)
    store.audit(actor=x_demo_role, action="connector.sync", target=connector_id, payload=sync)
    return sync


@router.get("/sync-runs")
def sync_runs(connector_id: str | None = None):
    return {"sync_runs": store.list_sync_runs(connector_id)}


@router.get("/evaluations/summary")
def evaluation_summary():
    evaluations = store.list_records("evaluations")
    average = round(sum(evaluation["score"] for evaluation in evaluations) / len(evaluations))
    return {
        "average_score": average,
        "evaluations": evaluations,
        "token_usage": sum(evaluation["token_usage"] for evaluation in evaluations),
        "cost_estimate_usd": round(sum(evaluation["cost_estimate_usd"] for evaluation in evaluations), 4),
        "latency_ms": round(sum(evaluation["latency_ms"] for evaluation in evaluations) / len(evaluations)),
    }


@router.get("/metrics")
def metrics():
    evaluations = store.list_records("evaluations")
    average = round(sum(evaluation["score"] for evaluation in evaluations) / len(evaluations))
    lines = [
        "# HELP sprintpilot_agent_run_total Total agent runs by status and audience.",
        "# TYPE sprintpilot_agent_run_total counter",
        'sprintpilot_agent_run_total{status="success",audience="founder"} 1',
        'sprintpilot_agent_run_total{status="success",audience="product_manager"} 1',
        "# HELP sprintpilot_tool_call_total Total tool calls by tool and status.",
        "# TYPE sprintpilot_tool_call_total counter",
        'sprintpilot_tool_call_total{tool_name="jira.search_issues",status="success"} 12',
        'sprintpilot_tool_call_total{tool_name="docs.search",status="success"} 8',
        "# HELP sprintpilot_evaluation_score Latest average evaluation score.",
        "# TYPE sprintpilot_evaluation_score gauge",
        f'sprintpilot_evaluation_score{{metric="average"}} {average}',
        "# HELP sprintpilot_report_generation_total Generated reports by audience.",
        "# TYPE sprintpilot_report_generation_total counter",
        'sprintpilot_report_generation_total{audience="founder",status="success"} 1',
    ]
    return Response(content="\n".join(lines) + "\n", media_type="text/plain")


@router.get("/audit-logs")
def audit_logs():
    return {"audit_logs": store.list_audit_logs()}


@router.get("/knowledge/sources")
def knowledge_sources():
    docs = load_documents()
    sources: dict[str, dict] = {}
    for doc in docs:
        metadata = doc["metadata"]
        source = metadata.get("source", "unknown")
        if source not in sources:
            sources[source] = {"source": source, "documents": 0, "titles": []}
        sources[source]["documents"] += 1
        sources[source]["titles"].append(metadata.get("title", metadata.get("id", "Untitled")))
    return {"sources": list(sources.values())}


@router.get("/settings")
def public_settings():
    return {
        "app_name": settings.app_name,
        "environment": settings.environment,
        "llm_provider": settings.llm_provider,
        "vector_provider": settings.vector_provider,
        "database_path": settings.database_path,
        "mcp_ready": True,
        "deployment_targets": ["Vercel", "Railway", "Render", "Qdrant Cloud"],
    }


def report_to_markdown(report: dict) -> str:
    sections = [
        f"# {report['title']}",
        "",
        f"**Type:** {report['type']}",
        f"**Confidence:** {report['confidence_score']}%",
        "",
        "## Summary",
        report["summary"],
        "",
        "## Shipped Work",
        *[f"- {item}" for item in report.get("shipped_work", [])],
        "",
        "## Blocked Work",
        *[f"- {item}" for item in report.get("blocked_work", [])],
        "",
        "## Risks",
        *[f"- {item}" for item in report.get("risks", [])],
        "",
        "## Decisions Needed",
        *[f"- {item}" for item in report.get("decisions_needed", [])],
        "",
        "## Action Items",
        *[f"- {item}" for item in report.get("action_items", [])],
        "",
        "## Citations",
        *[f"- {item}" for item in report.get("citations", [])],
    ]
    return "\n".join(sections)
