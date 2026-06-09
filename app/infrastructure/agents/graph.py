from __future__ import annotations

import operator
from datetime import datetime, timezone
from typing import Annotated, Any, NotRequired, TypedDict

from langgraph.graph import END, StateGraph

from app.domain.models.operating import WeeklyReportRequest
from app.infrastructure.demo.operating_data import (
    DECISIONS,
    PULL_REQUESTS,
    RISKS,
    TEAMS,
    WORK_ITEMS,
    weekly_report_for_audience,
)
from app.infrastructure.evaluation import ReportEvaluator
from app.infrastructure.mcp.project_tools import build_project_tool_registry


class AgentState(TypedDict):
    workspace_id: str
    sprint_id: str
    audience: str
    raw_tickets: NotRequired[list[dict[str, Any]]]
    raw_prs: NotRequired[list[dict[str, Any]]]
    raw_slack_messages: NotRequired[list[dict[str, Any]]]
    retrieved_context: NotRequired[list[dict[str, Any]]]
    sprint_status: NotRequired[dict[str, Any]]
    risks: NotRequired[list[dict[str, Any]]]
    decisions: NotRequired[list[dict[str, Any]]]
    business_impact: NotRequired[dict[str, Any]]
    report_draft: NotRequired[str]
    report_structured: NotRequired[dict[str, Any]]
    evaluation_result: NotRequired[dict[str, Any]]
    citations: NotRequired[list[dict[str, Any]]]
    confidence_score: NotRequired[float]
    tool_calls: Annotated[list[dict[str, Any]], operator.add]
    agent_trace: Annotated[list[dict[str, Any]], operator.add]
    errors: Annotated[list[str], operator.add]


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def trace(agent: str, message: str, **metadata: Any) -> list[dict[str, Any]]:
    return [{"agent": agent, "timestamp": utcnow(), "message": message, "metadata": metadata}]


def supervisor_node(state: AgentState) -> dict[str, Any]:
    workflow = ["ingest", "retrieve", "status", "risk", "decisions", "impact", "report", "evaluate"]
    return {"agent_trace": trace("supervisor", "Planned full weekly-report pipeline.", workflow=workflow, audience=state["audience"]), "tool_calls": [], "errors": []}


def ingest_node(state: AgentState) -> dict[str, Any]:
    tickets = [item.model_dump(mode="json") for item in WORK_ITEMS]
    prs = [pr.model_dump(mode="json") for pr in PULL_REQUESTS]
    return {"raw_tickets": tickets, "raw_prs": prs, "agent_trace": trace("ingest", "Loaded tickets and PRs from connector abstraction.", tickets=len(tickets), prs=len(prs))}


def retrieval_node(state: AgentState) -> dict[str, Any]:
    registry = build_project_tool_registry()
    result = registry.execute("project.search_docs", agent="retrieval", query="checkout launch risks decisions", k=5)
    return {"retrieved_context": result.output, "tool_calls": [result.record.model_dump(mode="json")], "agent_trace": trace("retrieval", "Retrieved source context with citation metadata.", sources=len(result.output))}


def status_agent_node(state: AgentState) -> dict[str, Any]:
    tickets = state.get("raw_tickets", [])
    blocked = [ticket for ticket in tickets if ticket.get("blocker_reason")]
    stale = [ticket for ticket in tickets if int(ticket.get("stale_score", 0)) >= 30]
    status = {"sprint_id": state["sprint_id"], "percent_complete": 42, "days_remaining": 12, "goal_points": 68, "blocked_count": len(blocked), "stale_count": len(stale)}
    return {"sprint_status": status, "agent_trace": trace("status_agent", "Computed sprint progress, blocked work, and stale tickets.", **status)}


def risk_agent_node(state: AgentState) -> dict[str, Any]:
    risks = [risk.model_dump(mode="json") for risk in RISKS]
    return {"risks": risks, "agent_trace": trace("risk_agent", "Ranked delivery and business risks.", risks_found=len(risks))}


def decision_agent_node(state: AgentState) -> dict[str, Any]:
    decisions = [decision.model_dump(mode="json") for decision in DECISIONS]
    return {"decisions": decisions, "agent_trace": trace("decision_agent", "Extracted pending decisions and cost of delay.", decisions=len(decisions))}


def business_impact_node(state: AgentState) -> dict[str, Any]:
    impact = {"teams": [team.model_dump(mode="json") for team in TEAMS], "summary": "Checkout Launch is the main business priority at risk."}
    return {"business_impact": impact, "agent_trace": trace("business_impact_agent", "Mapped execution risks to business priorities.", teams=len(TEAMS))}


def report_agent_node(state: AgentState) -> dict[str, Any]:
    report = weekly_report_for_audience(WeeklyReportRequest(audience=state["audience"]))
    payload = report.model_dump(mode="json")
    return {"report_draft": report.executive_summary, "report_structured": payload, "citations": payload["citations"], "confidence_score": report.confidence_score, "agent_trace": trace("report_agent", "Generated audience-aware structured weekly report.", audience=state["audience"], confidence=report.confidence_score)}


def evaluation_node(state: AgentState) -> dict[str, Any]:
    report = state.get("report_structured", {})
    retrieved = state.get("retrieved_context", [])
    evaluation = ReportEvaluator().evaluate(report, retrieved)
    return {"evaluation_result": evaluation.model_dump(mode="json"), "agent_trace": trace("evaluation_agent", "Evaluated report groundedness, citations, completeness, and actionability.", groundedness=evaluation.groundedness_score)}


def build_report_graph():
    graph = StateGraph(AgentState)
    graph.add_node("supervisor", supervisor_node)
    graph.add_node("ingest", ingest_node)
    graph.add_node("retrieve", retrieval_node)
    graph.add_node("status", status_agent_node)
    graph.add_node("risk", risk_agent_node)
    graph.add_node("decisions", decision_agent_node)
    graph.add_node("impact", business_impact_node)
    graph.add_node("report", report_agent_node)
    graph.add_node("evaluate", evaluation_node)
    graph.set_entry_point("supervisor")
    graph.add_edge("supervisor", "ingest")
    graph.add_edge("ingest", "retrieve")
    graph.add_edge("retrieve", "status")
    graph.add_edge("status", "risk")
    graph.add_edge("risk", "decisions")
    graph.add_edge("decisions", "impact")
    graph.add_edge("impact", "report")
    graph.add_edge("report", "evaluate")
    graph.add_edge("evaluate", END)
    return graph.compile()


async def run_report_graph(workspace_id: str = "demo-workspace", sprint_id: str = "sprint-24", audience: str = "founder") -> AgentState:
    graph = build_report_graph()
    initial: AgentState = {"workspace_id": workspace_id, "sprint_id": sprint_id, "audience": audience, "tool_calls": [], "agent_trace": [], "errors": []}
    return await graph.ainvoke(initial)
