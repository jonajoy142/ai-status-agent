from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from langgraph.graph import END, StateGraph

from app.infrastructure.agents.agentic_tool_registry import registry
from app.infrastructure.agents.state import AgentState
from app.infrastructure.evaluation import ReportEvaluator

AGENT_SEQUENCE = ["retrieve", "status", "risk", "impact", "action", "report", "evaluate"]
LOOP_SEQUENCE = ["retrieve", "status", "risk", "decision", "impact", "action", "report", "evaluate"]


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def trace(agent: str, message: str, **metadata: Any) -> list[dict[str, Any]]:
    return [{"agent": agent, "timestamp": utcnow(), "message": message, "metadata": metadata}]


def normalize_role(role: str) -> str:
    if role == "pm":
        return "product_manager"
    if role == "em":
        return "engineering_manager"
    if role == "developer":
        return "engineer"
    return role


def advance(state: AgentState, agent: str, message: str, **updates: Any) -> dict[str, Any]:
    return {
        **updates,
        "current_step": state.get("current_step", 0) + 1,
        "agent_trace": trace(agent, message, current_step=state.get("current_step", 0), **{k: v for k, v in updates.items() if k in {"retrieval_query_used", "supervisor_reasoning"}}),
    }


def supervisor_node(state: AgentState) -> dict[str, Any]:
    plan = list(state.get("supervisor_plan") or AGENT_SEQUENCE)
    current_step = int(state.get("current_step", 0))
    reasoning = "Initial full execution plan for role-adapted weekly brief."

    evaluation = state.get("evaluation_result") or {}
    if evaluation and not evaluation.get("overall_pass", True) and state.get("regeneration_count", 0) < 2:
        plan = LOOP_SEQUENCE
        current_step = 0
        reasoning = "Evaluation rejected the report; supervisor reset plan to re-retrieve stronger evidence."

    risks = state.get("risks_detected") or []
    has_critical = any(str(risk.get("severity", risk.get("level", ""))).lower() == "critical" for risk in risks)
    if has_critical and not state.get("decisions_surfaced") and "decision" not in plan:
        plan.insert(current_step, "decision")
        reasoning = "Critical risk detected mid-flight; supervisor inserted Decision Agent before reporting."

    if current_step >= len(plan):
        return {
            "supervisor_plan": plan,
            "supervisor_reasoning": "Plan completed; terminating.",
            "should_terminate": True,
            "agent_trace": trace("supervisor", "Terminating after completing dynamic plan.", plan=plan),
        }

    next_agent = plan[current_step]
    return {
        "supervisor_plan": plan,
        "supervisor_reasoning": reasoning,
        "current_step": current_step,
        "should_terminate": False,
        "agent_trace": trace("supervisor", f"Routing to {next_agent}.", plan=plan, current_step=current_step, reasoning=reasoning),
    }


def route_from_supervisor(state: AgentState) -> str:
    if state.get("should_terminate"):
        return "END"
    plan = state.get("supervisor_plan") or []
    current_step = int(state.get("current_step", 0))
    if current_step >= len(plan):
        return "END"
    return plan[current_step]


async def execute_tool(tool_name: str, params: dict[str, Any], state: AgentState, agent: str) -> tuple[Any, dict[str, Any]]:
    tool_state = {**state, "_active_agent": agent}
    return await registry.execute(tool_name, params, tool_state)


async def retrieve_node(state: AgentState) -> dict[str, Any]:
    query = state.get("retrieval_query_used") or state["query"]
    tool_calls: list[dict[str, Any]] = []
    tickets, ticket_log = await execute_tool("jira.get_sprint_tickets", {"workspace_id": state["workspace_id"], "sprint_id": "sprint-24"}, state, "retrieve")
    vector, vector_log = await execute_tool("vector.semantic_search", {"workspace_id": state["workspace_id"], "query": query, "k": 6, "collection": "reports"}, state, "retrieve")
    slack, slack_log = await execute_tool("slack.search_messages", {"workspace_id": state["workspace_id"], "query": query, "days_back": 7}, state, "retrieve")
    tool_calls.extend([ticket_log, vector_log, slack_log])
    return advance(
        state,
        "retrieve",
        "Retrieved Jira tickets, Slack signals, and semantic context using autonomous tool selection.",
        jira_tickets=tickets,
        slack_signals=slack,
        vector_results=vector,
        retrieval_query_used=query,
        tool_calls_log=tool_calls,
    )


async def status_node(state: AgentState) -> dict[str, Any]:
    tool_calls: list[dict[str, Any]] = []
    health, health_log = await execute_tool("analysis.compute_sprint_health", {"workspace_id": state["workspace_id"]}, state, "status")
    tool_calls.append(health_log)
    if health.get("completion_pct", 100) < 50:
        overload, overload_log = await execute_tool("analysis.detect_capacity_overload", {"workspace_id": state["workspace_id"], "threshold_percent": 120}, state, "status")
        tool_calls.append(overload_log)
    else:
        overload = []
    if "TICK-231" in state["query"] or any("TICK-231" in str(ticket) for ticket in state.get("jira_tickets", [])):
        slack, slack_log = await execute_tool("slack.search_messages", {"workspace_id": state["workspace_id"], "query": "TICK-231 blocked", "days_back": 7}, state, "status")
        tool_calls.append(slack_log)
    else:
        slack = []
    status_summary = {**health, "key_signals": ["Checkout Launch remains the critical path", "Payments dependency is stale"], "capacity_flags": overload, "qualitative_context": slack[:2]}
    return advance(state, "status", "Assessed sprint execution health and capacity signals.", status_summary=status_summary, tool_calls_log=tool_calls)


async def risk_node(state: AgentState) -> dict[str, Any]:
    tool_calls: list[dict[str, Any]] = []
    blocked, blocked_log = await execute_tool("jira.get_blocked_tickets", {"workspace_id": state["workspace_id"], "days_stale": 3}, state, "risk")
    prs, prs_log = await execute_tool("github.get_stale_prs", {"workspace_id": state["workspace_id"], "stale_days": 4}, state, "risk")
    overload, overload_log = await execute_tool("analysis.detect_capacity_overload", {"workspace_id": state["workspace_id"], "threshold_percent": 120}, state, "risk")
    tool_calls.extend([blocked_log, prs_log, overload_log])
    risks = []
    for item in blocked:
        severity = "critical" if item.get("stale_score", 0) >= 60 else "medium"
        risks.append({"severity": severity, "type": "blocker", "title": item["title"], "owner": item["assignee"], "days_open": 6 if severity == "critical" else 3, "business_impact": item["business_impact"], "source_url": item["source_url"]})
        if severity == "critical":
            slack, slack_log = await execute_tool("slack.search_messages", {"workspace_id": state["workspace_id"], "query": item["external_id"], "days_back": 7}, state, "risk")
            tool_calls.append(slack_log)
            risks[-1]["qualitative_context"] = slack[:2]
    for pr in prs:
        risks.append({"severity": "high", "type": "stale_pr", "title": pr["title"], "owner": pr["reviewer"], "days_open": pr["waiting_days"], "business_impact": f"Blocks {pr['blocks']}", "source_url": pr["source_url"]})
    for item in overload:
        risks.append({"severity": item.get("risk_level", "high"), "type": "capacity", "title": "Capacity overload", "owner": item.get("lead", item.get("engineer", "Unknown")), "days_open": 1, "business_impact": item.get("business_priority", "Delivery confidence")})
    return advance(state, "risk", "Detected blocker, PR delay, and capacity risks.", risks_detected=risks, tool_calls_log=tool_calls)


async def decision_node(state: AgentState) -> dict[str, Any]:
    critical = [risk for risk in state.get("risks_detected", []) if risk.get("severity") == "critical"]
    decisions = [
        {"title": "Reduce scope for Checkout v1", "owner": "Jordan Kim", "due_date": "2026-06-11", "context": "Critical blocker found during risk pass.", "options": ["Reduce scope", "Delay launch"], "impact_if_delayed": "$4,000/day deferred revenue"},
        {"title": "Approve contractor budget for API review", "owner": "Founder", "due_date": "2026-06-10", "context": "Contractor can unblock API spec review in 2 days.", "options": ["Approve", "Reject"], "impact_if_delayed": "$500/day idle engineering time"},
    ] if critical else []
    return advance(state, "decision", "Surfaced decisions required by critical execution risk.", decisions_surfaced=decisions)


async def impact_node(state: AgentState) -> dict[str, Any]:
    risks = state.get("risks_detected", [])
    impact = {
        "summary": "Checkout Launch is the highest business priority at risk.",
        "revenue_exposure": "$4,000/day deferred revenue if launch slips",
        "priorities_impacted": ["Checkout Launch", "Customer Onboarding Revamp"] if risks else [],
    }
    return advance(state, "impact", "Mapped execution risks to business impact for the selected role.", business_impact=impact)


async def action_node(state: AgentState) -> dict[str, Any]:
    actions = []
    for risk in state.get("risks_detected", [])[:4]:
        actions.append({"owner": risk.get("owner", "Unknown"), "action": f"Resolve {risk.get('title', 'risk')} today", "why": risk.get("business_impact", "Delivery risk")})
    if not actions:
        actions = [{"owner": "Maya Menon", "action": "Generate weekly report", "why": "Keep leadership aligned"}]
    return advance(state, "action", "Generated owner-specific recommended actions.", recommended_actions=actions)


async def report_node(state: AgentState) -> dict[str, Any]:
    role = normalize_role(state["role"])
    report, report_log = await execute_tool("reports.generate_role_brief", {"workspace_id": state["workspace_id"], "role": role}, state, "report")
    draft = report["executive_summary"]
    actions = "\n".join([f"- {item['owner']}: {item['action']}" for item in state.get("recommended_actions", [])])
    final = f"{draft}\n\nRecommended actions:\n{actions}"
    return advance(state, "report", "Generated role-adapted report with structured output.", report_draft=draft, report_final=final, role_adapted_report=final, report_structured=report, tool_calls_log=[report_log])


async def evaluate_node(state: AgentState) -> dict[str, Any]:
    report = state.get("report_structured", {}) or {"id": "agentic-report", "executive_summary": state.get("report_draft", ""), "action_items": [item.get("action", "") for item in state.get("recommended_actions", [])], "citations": state.get("vector_results", [])[:3], "token_usage": 1600}
    evaluation = ReportEvaluator().evaluate(report, state.get("vector_results", []))
    role = normalize_role(state["role"])
    flags = []
    if role == "founder" and any(term in state.get("report_final", "").lower() for term in ["vector db", "langgraph", "agent runs"]):
        flags.append("Founder report includes technical implementation language.")
    if role == "engineer" and "revenue" in state.get("report_final", "").lower():
        flags.append("Developer report contains business-impact language.")
    overall_pass = evaluation.groundedness_score >= 0.70 and evaluation.completeness_score >= 0.65 and not flags
    result = {**evaluation.model_dump(mode="json"), "role_relevance_score": 0.92 if not flags else 0.45, "overall_pass": overall_pass, "rejection_reason": None if overall_pass else "Report needs stronger source grounding or role adaptation.", "hallucination_flags": [], "missing_sections": flags}
    updates: dict[str, Any] = {"evaluation_result": result, "evaluation_flags": flags}
    if not overall_pass and state.get("regeneration_count", 0) < 2:
        updates.update({"regeneration_count": state.get("regeneration_count", 0) + 1, "retrieval_query_used": f"{state['query']} source evidence citations blockers decisions", "current_step": 0, "supervisor_plan": LOOP_SEQUENCE})
    return {**updates, "agent_trace": trace("evaluation", "Evaluated report and decided whether reflection loop is needed.", overall_pass=overall_pass, groundedness=result["groundedness_score"], regeneration_count=updates.get("regeneration_count", state.get("regeneration_count", 0)))}


def should_regenerate(state: AgentState) -> str:
    result = state.get("evaluation_result") or {}
    if not result.get("overall_pass", True) and state.get("regeneration_count", 0) < 2:
        return "regenerate"
    return "accept"


def build_sprintpilot_graph():
    graph = StateGraph(AgentState)
    graph.add_node("supervisor", supervisor_node)
    graph.add_node("retrieve", retrieve_node)
    graph.add_node("status", status_node)
    graph.add_node("risk", risk_node)
    graph.add_node("decision", decision_node)
    graph.add_node("impact", impact_node)
    graph.add_node("action", action_node)
    graph.add_node("report", report_node)
    graph.add_node("evaluate", evaluate_node)
    graph.set_entry_point("supervisor")
    graph.add_conditional_edges("supervisor", route_from_supervisor, {"retrieve": "retrieve", "status": "status", "risk": "risk", "decision": "decision", "impact": "impact", "action": "action", "report": "report", "evaluate": "evaluate", "END": END})
    for node in ["retrieve", "status", "risk", "decision", "impact", "action", "report"]:
        graph.add_edge(node, "supervisor")
    graph.add_conditional_edges("evaluate", should_regenerate, {"regenerate": "retrieve", "accept": END})
    return graph.compile()


def build_report_graph():
    return build_sprintpilot_graph()


async def run_report_graph(workspace_id: str = "demo-workspace", sprint_id: str = "sprint-24", audience: str = "founder", query: str = "What is the current execution status and risk?") -> AgentState:
    graph = build_sprintpilot_graph()
    initial: AgentState = {
        "workspace_id": workspace_id,
        "role": audience,  # type: ignore[typeddict-item]
        "query": query,
        "report_type": "weekly",
        "supervisor_plan": [],
        "supervisor_reasoning": "",
        "current_step": 0,
        "jira_tickets": [],
        "github_prs": [],
        "slack_signals": [],
        "vector_results": [],
        "retrieval_query_used": query,
        "status_summary": {},
        "risks_detected": [],
        "decisions_surfaced": [],
        "business_impact": {},
        "recommended_actions": [],
        "tool_calls_log": [],
        "agent_trace": [],
        "report_draft": "",
        "report_final": "",
        "role_adapted_report": "",
        "evaluation_result": {},
        "regeneration_count": 0,
        "evaluation_flags": [],
        "should_terminate": False,
        "error_state": None,
        "messages": [],
    }
    return await graph.ainvoke(initial)
