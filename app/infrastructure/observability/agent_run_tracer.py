from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4


class AgentRunTracer:
    def __init__(self) -> None:
        self._events_by_workspace: dict[str, list[dict[str, Any]]] = defaultdict(list)
        self._events_by_run: dict[str, list[dict[str, Any]]] = defaultdict(list)

    def new_run_id(self) -> str:
        return f"ar-{uuid4()}"

    async def emit(self, run_id: str, workspace_id: str, event_type: str, agent: str, data: dict[str, Any]) -> dict[str, Any]:
        event = {
            "run_id": run_id,
            "workspace_id": workspace_id,
            "event_type": event_type,
            "agent": agent,
            "data": data,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        self._events_by_workspace[workspace_id].append(event)
        self._events_by_run[run_id].append(event)
        return event

    async def emit_state_trace(self, run_id: str, workspace_id: str, state: dict[str, Any]) -> list[dict[str, Any]]:
        events = []
        for step in state.get("agent_trace", []):
            events.append(await self.emit(run_id, workspace_id, "agent_complete", step.get("agent", "agent"), step))
        for tool in state.get("tool_calls_log", []):
            events.append(await self.emit(run_id, workspace_id, "tool_call", tool.get("agent", "tool"), tool))
        if state.get("evaluation_result"):
            events.append(await self.emit(run_id, workspace_id, "evaluation", "evaluation", state["evaluation_result"]))
        if state.get("regeneration_count", 0) > 0:
            events.append(await self.emit(run_id, workspace_id, "loop_back", "supervisor", {"regeneration_count": state["regeneration_count"]}))
        return events

    def list_events(self, workspace_id: str | None = None, run_id: str | None = None) -> list[dict[str, Any]]:
        if run_id:
            return self._events_by_run.get(run_id, [])
        if workspace_id:
            return self._events_by_workspace.get(workspace_id, [])[-200:]
        events: list[dict[str, Any]] = []
        for workspace_events in self._events_by_workspace.values():
            events.extend(workspace_events)
        return events[-200:]


agent_run_tracer = AgentRunTracer()
