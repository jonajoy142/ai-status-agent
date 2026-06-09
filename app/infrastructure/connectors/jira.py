from typing import Any

from app.infrastructure.connectors.base import BaseConnector, SyncResult
from app.infrastructure.demo.operating_data import BUSINESS_PRIORITIES, WORK_ITEMS


class JiraConnector(BaseConnector):
    name = "jira"

    async def test_connection(self, config: dict[str, Any]) -> dict[str, Any]:
        required = ["base_url", "email", "api_token", "project_key"]
        missing = [key for key in required if not config.get(key)]
        if missing:
            return {"status": "mock", "message": f"Missing {', '.join(missing)}. Demo mode will use seeded Jira data."}
        return {"status": "connected", "account": config["email"], "project_key": config["project_key"]}

    async def sync(self, workspace_id: str, config: dict[str, Any]) -> SyncResult:
        return SyncResult.completed(
            connector=self.name,
            workspace_id=workspace_id,
            items_synced={"tickets": len(WORK_ITEMS), "epics": len(BUSINESS_PRIORITIES), "sprints": 1, "comments": 12},
        )

    async def get_projects(self, config: dict[str, Any]) -> list[dict[str, Any]]:
        return [{"key": config.get("project_key", "DEMO"), "name": "SprintPilot Demo Workspace"}]

    async def get_issues(self, config: dict[str, Any], project_key: str) -> list[dict[str, Any]]:
        return [item.model_dump(mode="json") for item in WORK_ITEMS]

    async def get_blocked_tickets(self, config: dict[str, Any]) -> list[dict[str, Any]]:
        return [item.model_dump(mode="json") for item in WORK_ITEMS if item.blocker_reason]
