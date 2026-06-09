from __future__ import annotations

import asyncio
from typing import Any

from app.config.settings import settings
from app.infrastructure.demo.operating_data import PULL_REQUESTS, WORK_ITEMS
from app.infrastructure.rag.vector_store.workspace_store import get_workspace_vector_store


class WorkspaceIngestionPipeline:
    def __init__(self, workspace_id: str) -> None:
        self.workspace_id = workspace_id
        self.vector_store = get_workspace_vector_store(settings.vector_backend)

    async def ingest_all(self) -> dict[str, int]:
        results = await asyncio.gather(self._ingest_jira(), self._ingest_github(), self._ingest_slack())
        return {"tickets": results[0], "pull_requests": results[1], "slack_messages": results[2]}

    async def _ingest_jira(self) -> int:
        documents = [
            {
                "id": f"jira_{ticket.external_id}_{ticket.updated_at}",
                "content": f"Ticket {ticket.external_id}: {ticket.title}\nStatus: {ticket.status}\nAssignee: {ticket.assignee}\nDescription: {ticket.description}\nBlocker: {ticket.blocker_reason or 'None'}",
                "metadata": {"source": "jira", "ticket_id": ticket.external_id, "status": ticket.status, "workspace_id": self.workspace_id, "source_url": ticket.source_url},
            }
            for ticket in WORK_ITEMS
        ]
        await self.vector_store.ingest(documents, self.workspace_id, collection="tickets")
        await self.vector_store.ingest(documents, self.workspace_id, collection="reports")
        return len(documents)

    async def _ingest_github(self) -> int:
        documents = [
            {
                "id": f"github_pr_{pr.number}",
                "content": f"PR #{pr.number}: {pr.title}\nStatus: {pr.status}\nReviewer: {pr.reviewer}\nWaiting days: {pr.waiting_days}\nBlocks: {pr.blocks}",
                "metadata": {"source": "github", "pr_number": pr.number, "workspace_id": self.workspace_id, "source_url": pr.source_url},
            }
            for pr in PULL_REQUESTS
        ]
        await self.vector_store.ingest(documents, self.workspace_id, collection="pull_requests")
        await self.vector_store.ingest(documents, self.workspace_id, collection="reports")
        return len(documents)

    async def _ingest_slack(self) -> int:
        messages = [
            {"ts": "1717850001", "channel": "payments", "text": "TICK-231 is blocked by missing Payments API spec. Jordan owns vendor follow-up."},
            {"ts": "1717850002", "channel": "eng-leads", "text": "Sarah Chen is at 130% planned capacity. Reassign non-critical work this sprint."},
            {"ts": "1717850003", "channel": "product", "text": "Checkout Launch needs scope decision by June 11 to protect the launch window."},
        ]
        chunks = self._chunk_messages(messages)
        await self.vector_store.ingest(chunks, self.workspace_id, collection="slack")
        await self.vector_store.ingest(chunks, self.workspace_id, collection="reports")
        return len(chunks)

    def _chunk_messages(self, messages: list[dict[str, Any]], window: int = 512, overlap: int = 64) -> list[dict[str, Any]]:
        chunks = []
        step = max(1, window - overlap)
        for message in messages:
            text = message["text"]
            for index in range(0, len(text), step):
                chunk = text[index:index + window]
                chunks.append({"id": f"slack_{message['ts']}_{index}", "content": chunk, "metadata": {"source": "slack", "channel": message["channel"], "ts": message["ts"], "workspace_id": self.workspace_id}})
        return chunks


class IngestionScheduler:
    """APScheduler-ready boundary without requiring the dependency in demo mode."""

    def __init__(self) -> None:
        self.interval_minutes = 30

    async def run_once(self, workspace_ids: list[str]) -> dict[str, dict[str, int]]:
        results = await asyncio.gather(*[WorkspaceIngestionPipeline(workspace_id).ingest_all() for workspace_id in workspace_ids])
        return dict(zip(workspace_ids, results, strict=True))
