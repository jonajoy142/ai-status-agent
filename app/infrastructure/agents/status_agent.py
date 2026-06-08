import json
from typing import Any

from app.domain.models.agent_run import SourceCitation, StatusInsight, ToolCallRecord
from app.infrastructure.mcp.tool_registry import ToolRegistry
from app.infrastructure.observability.tracing import trace_store


class StatusAgent:
    name = "status"

    def analyze(self, question: str, registry: ToolRegistry, run_id: str) -> tuple[StatusInsight, list[SourceCitation], list[ToolCallRecord]]:
        trace_store.add(run_id, "agent_start", "Status agent retrieving tickets, docs, and chat evidence.", agent=self.name)

        tool_calls: list[ToolCallRecord] = []
        sources: list[SourceCitation] = []
        query = f"{question} status owner sprint latest update"

        for tool_name in ["project.search_tickets", "project.search_docs", "project.search_chat"]:
            result = registry.execute(tool_name, agent=self.name, query=query, k=5)
            tool_calls.append(result.record)
            sources.extend(SourceCitation.model_validate(item) for item in result.output)

        active_work = self._active_work(sources)
        owners = sorted({source.metadata.get("owner") for source in sources if source.metadata.get("owner")})
        confidence = min(0.95, round(0.55 + (len(sources) * 0.05), 2))
        summary = self._summary(active_work, sources)

        trace_store.add(
            run_id,
            "agent_complete",
            f"Status agent found {len(active_work)} active work items across {len(sources)} sources.",
            agent=self.name,
            metadata={"sources": len(sources), "active_work": len(active_work)},
        )

        return StatusInsight(summary=summary, active_work=active_work, owners=owners, confidence=confidence), sources, tool_calls

    def _active_work(self, sources: list[SourceCitation]) -> list[str]:
        items: list[str] = []
        for source in sources:
            if source.source != "tickets":
                continue
            try:
                ticket: dict[str, Any] = json.loads(source.content)
            except json.JSONDecodeError:
                continue
            items.append(
                f"{ticket.get('id', 'Ticket')}: {ticket.get('title', 'Untitled')} - {ticket.get('status', 'Unknown')} ({ticket.get('assignee', 'Unassigned')})"
            )
        return items[:5]

    def _summary(self, active_work: list[str], sources: list[SourceCitation]) -> str:
        if active_work:
            return f"The project is active with {len(active_work)} relevant work items. The strongest evidence comes from tickets, chat updates, and the engineering brief."
        if sources:
            return "Relevant project context was found, but no matching ticket-level work item was identified."
        return "No matching project evidence was found in the current knowledge base."
