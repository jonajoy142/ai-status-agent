from __future__ import annotations

import inspect
from collections.abc import Awaitable, Callable
from datetime import datetime, timezone
from typing import Any

from pydantic import BaseModel, Field

from app.infrastructure.demo.operating_data import PULL_REQUESTS, TEAMS, WORK_ITEMS, weekly_report_for_audience
from app.domain.models.operating import WeeklyReportRequest
from app.infrastructure.rag.retrieval.retriever import retrieve_documents

ToolFn = Callable[..., Awaitable[Any]]


class AgenticToolDescriptor(BaseModel):
    name: str
    description: str
    parameters: dict[str, str] = Field(default_factory=dict)
    tags: list[str] = Field(default_factory=list)
    requires_workspace: bool = True


class AgenticToolRegistry:
    def __init__(self) -> None:
        self._tools: dict[str, tuple[AgenticToolDescriptor, ToolFn]] = {}

    def register(self, descriptor: AgenticToolDescriptor):
        def decorator(fn: ToolFn) -> ToolFn:
            self._tools[descriptor.name] = (descriptor, fn)
            return fn
        return decorator

    def get_tool_descriptions_for_llm(self, tags: list[str] | None = None) -> str:
        tools = self._filtered(tags)
        return "\n".join([f"- {descriptor.name}: {descriptor.description} | params: {list(descriptor.parameters.keys())}" for descriptor, _ in tools])

    def list_tools(self, tags: list[str] | None = None) -> list[AgenticToolDescriptor]:
        return [descriptor for descriptor, _ in self._filtered(tags)]

    async def execute(self, tool_name: str, params: dict[str, Any], state: dict[str, Any]) -> tuple[Any, dict[str, Any]]:
        if tool_name not in self._tools:
            raise KeyError(f"Unknown tool: {tool_name}")
        descriptor, fn = self._tools[tool_name]
        accepted = inspect.signature(fn).parameters
        clean_params = {key: value for key, value in params.items() if key in accepted}
        result = await fn(**clean_params)
        log_entry = {
            "tool": tool_name,
            "params": clean_params,
            "result_summary": str(result)[:240],
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "tags": descriptor.tags,
            "agent": state.get("_active_agent", "unknown"),
        }
        return result, log_entry

    def _filtered(self, tags: list[str] | None = None) -> list[tuple[AgenticToolDescriptor, ToolFn]]:
        tools = list(self._tools.values())
        if tags:
            tools = [(descriptor, fn) for descriptor, fn in tools if any(tag in descriptor.tags for tag in tags)]
        return tools


registry = AgenticToolRegistry()


@registry.register(AgenticToolDescriptor(name="jira.get_sprint_tickets", description="Fetch all tickets in the active sprint for a workspace. Use when you need ticket status, assignments, or blockers.", parameters={"workspace_id": "str", "sprint_id": "str | None"}, tags=["jira", "retrieval"]))
async def get_sprint_tickets(workspace_id: str, sprint_id: str | None = None) -> list[dict]:
    return [item.model_dump(mode="json") for item in WORK_ITEMS if item.sprint == "Sprint 24"]


@registry.register(AgenticToolDescriptor(name="jira.get_blocked_tickets", description="Fetch only blocked tickets. Use when risk agent needs to identify blockers specifically.", parameters={"workspace_id": "str", "days_stale": "int"}, tags=["jira", "risk"]))
async def get_blocked_tickets(workspace_id: str, days_stale: int = 3) -> list[dict]:
    return [item.model_dump(mode="json") for item in WORK_ITEMS if item.blocker_reason or item.stale_score >= days_stale * 10]


@registry.register(AgenticToolDescriptor(name="github.get_stale_prs", description="Fetch PRs open more than N days without review. Use when identifying delivery risk from review bottlenecks.", parameters={"workspace_id": "str", "stale_days": "int"}, tags=["github", "risk"]))
async def get_stale_prs(workspace_id: str, stale_days: int = 4) -> list[dict]:
    return [pr.model_dump(mode="json") for pr in PULL_REQUESTS if pr.waiting_days >= stale_days]


@registry.register(AgenticToolDescriptor(name="slack.search_messages", description="Search Slack for messages about a specific topic or ticket. Use when you need qualitative signal about why something is blocked.", parameters={"workspace_id": "str", "query": "str", "days_back": "int"}, tags=["slack", "retrieval", "risk"]))
async def search_slack_messages(workspace_id: str, query: str, days_back: int = 7) -> list[dict]:
    return [source.model_dump(mode="json") for source in retrieve_documents(query, source="slack", k=5)]


@registry.register(AgenticToolDescriptor(name="vector.semantic_search", description="Search ChromaDB-compatible vector store for semantically similar reports, decisions, and project context. Use when historical pattern matching is needed.", parameters={"workspace_id": "str", "query": "str", "k": "int", "collection": "str"}, tags=["retrieval", "rag"]))
async def vector_semantic_search(workspace_id: str, query: str, k: int = 5, collection: str = "reports") -> list[dict]:
    return [source.model_dump(mode="json") for source in retrieve_documents(query, k=k)]


@registry.register(AgenticToolDescriptor(name="analysis.detect_capacity_overload", description="Analyse ticket assignments and identify engineers assigned more than their capacity threshold.", parameters={"workspace_id": "str", "threshold_percent": "int"}, tags=["analysis", "risk"]))
async def detect_capacity_overload(workspace_id: str, threshold_percent: int = 120) -> list[dict]:
    overloaded = []
    for team in TEAMS:
        load = round((team.completed / max(1, team.capacity)) * 100)
        if load >= threshold_percent or team.risk_level in {"high", "critical"}:
            overloaded.append({"team": team.name, "lead": team.lead, "load_percent": load, "risk_level": team.risk_level, "business_priority": team.business_priority})
    overloaded.append({"engineer": "Sarah Chen", "load_percent": 130, "risk_level": "high", "business_priority": "Customer Onboarding Revamp"})
    return overloaded


@registry.register(AgenticToolDescriptor(name="analysis.compute_sprint_health", description="Compute sprint completion percentage, velocity trend, and confidence score from ticket data.", parameters={"workspace_id": "str"}, tags=["analysis"]))
async def compute_sprint_health(workspace_id: str) -> dict:
    done = len([item for item in WORK_ITEMS if item.status.lower() == "done"])
    total = len(WORK_ITEMS)
    return {"completion_pct": round((done / total) * 100), "velocity_trend": "behind", "confidence_score": 0.72, "blocked_count": len([item for item in WORK_ITEMS if item.blocker_reason])}


@registry.register(AgenticToolDescriptor(name="reports.generate_role_brief", description="Generate the role-adapted weekly brief from current agent state.", parameters={"workspace_id": "str", "role": "str"}, tags=["report", "analysis"]))
async def generate_role_brief(workspace_id: str, role: str = "founder") -> dict:
    return weekly_report_for_audience(WeeklyReportRequest(audience=role)).model_dump(mode="json")
