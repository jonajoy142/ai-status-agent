from typing import Annotated, Literal, NotRequired, TypedDict
import operator

from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    workspace_id: str
    role: Literal["founder", "pm", "em", "developer", "product_manager", "engineering_manager", "engineer", "viewer"]
    query: str
    report_type: Literal["weekly", "daily", "risk", "decision"]
    supervisor_plan: list[str]
    supervisor_reasoning: str
    current_step: int
    jira_tickets: list[dict]
    github_prs: list[dict]
    slack_signals: list[dict]
    vector_results: list[dict]
    retrieval_query_used: str
    status_summary: dict
    risks_detected: list[dict]
    decisions_surfaced: list[dict]
    business_impact: dict
    recommended_actions: list[dict]
    tool_calls_log: Annotated[list[dict], operator.add]
    agent_trace: Annotated[list[dict], operator.add]
    report_draft: str
    report_final: str
    role_adapted_report: str
    report_structured: NotRequired[dict]
    evaluation_result: dict
    regeneration_count: int
    evaluation_flags: list[str]
    should_terminate: bool
    error_state: str | None
    messages: Annotated[list, add_messages]
