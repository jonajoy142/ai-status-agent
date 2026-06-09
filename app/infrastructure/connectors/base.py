from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any


@dataclass
class SyncResult:
    connector: str
    workspace_id: str
    started_at: datetime
    completed_at: datetime
    items_synced: dict[str, int] = field(default_factory=dict)
    errors: list[str] = field(default_factory=list)
    status: str = "success"

    @classmethod
    def completed(cls, connector: str, workspace_id: str, items_synced: dict[str, int], errors: list[str] | None = None) -> "SyncResult":
        now = datetime.now(timezone.utc)
        errors = errors or []
        return cls(connector=connector, workspace_id=workspace_id, started_at=now, completed_at=now, items_synced=items_synced, errors=errors, status="success" if not errors else "partial")


class BaseConnector(ABC):
    name: str
    version: str = "1.0"

    @abstractmethod
    async def test_connection(self, config: dict[str, Any]) -> dict[str, Any]: ...

    @abstractmethod
    async def sync(self, workspace_id: str, config: dict[str, Any]) -> SyncResult: ...

    @abstractmethod
    async def get_projects(self, config: dict[str, Any]) -> list[dict[str, Any]]: ...
