from typing import Any

from app.infrastructure.connectors.base import BaseConnector, SyncResult
from app.infrastructure.demo.operating_data import PULL_REQUESTS


class GitHubConnector(BaseConnector):
    name = "github"

    async def test_connection(self, config: dict[str, Any]) -> dict[str, Any]:
        if not config.get("token") or not config.get("repo"):
            return {"status": "mock", "message": "Missing token or repo. Demo mode will use seeded PR data."}
        return {"status": "connected", "repo": config["repo"]}

    async def sync(self, workspace_id: str, config: dict[str, Any]) -> SyncResult:
        return SyncResult.completed(connector=self.name, workspace_id=workspace_id, items_synced={"pull_requests": len(PULL_REQUESTS), "reviews": 9})

    async def get_projects(self, config: dict[str, Any]) -> list[dict[str, Any]]:
        return [{"repo": config.get("repo", "demo/sprintpilot"), "provider": "github"}]

    async def get_open_prs(self, config: dict[str, Any]) -> list[dict[str, Any]]:
        return [pr.model_dump(mode="json") for pr in PULL_REQUESTS]

    async def detect_stale_prs(self, config: dict[str, Any], stale_days: int = 2) -> list[dict[str, Any]]:
        return [pr.model_dump(mode="json") for pr in PULL_REQUESTS if pr.waiting_days >= stale_days]
