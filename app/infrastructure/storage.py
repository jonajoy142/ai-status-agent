import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from pydantic import BaseModel

from app.config.settings import settings
from app.infrastructure.demo import operating_data

KIND_SEEDS: dict[str, list[BaseModel]] = {
    "users": operating_data.USERS,
    "work_items": operating_data.WORK_ITEMS,
    "risks": operating_data.RISKS,
    "decisions": operating_data.DECISIONS,
    "reports": operating_data.REPORTS,
    "connectors": operating_data.CONNECTORS,
    "evaluations": operating_data.EVALUATIONS,
}


class SprintPilotStore:
    def __init__(self, path: str | None = None) -> None:
        self.path = Path(path or settings.database_path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._initialized = False

    def connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.path)
        conn.row_factory = sqlite3.Row
        return conn

    def initialize(self) -> None:
        if self._initialized:
            return
        with self.connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS records (
                    kind TEXT NOT NULL,
                    id TEXT NOT NULL,
                    payload TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    PRIMARY KEY (kind, id)
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS sync_runs (
                    id TEXT PRIMARY KEY,
                    connector_id TEXT NOT NULL,
                    payload TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id TEXT PRIMARY KEY,
                    actor TEXT NOT NULL,
                    action TEXT NOT NULL,
                    target TEXT NOT NULL,
                    payload TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )
            for kind, items in KIND_SEEDS.items():
                current = conn.execute("SELECT COUNT(*) AS count FROM records WHERE kind = ?", (kind,)).fetchone()["count"]
                if current == 0:
                    for item in items:
                        self._upsert_with_conn(conn, kind, item.id, item.model_dump(mode="json"))
        self._initialized = True

    def list_records(self, kind: str) -> list[dict[str, Any]]:
        self.initialize()
        with self.connect() as conn:
            rows = conn.execute("SELECT payload FROM records WHERE kind = ? ORDER BY id", (kind,)).fetchall()
        return [json.loads(row["payload"]) for row in rows]

    def get_record(self, kind: str, record_id: str) -> dict[str, Any] | None:
        self.initialize()
        with self.connect() as conn:
            row = conn.execute("SELECT payload FROM records WHERE kind = ? AND id = ?", (kind, record_id)).fetchone()
        return json.loads(row["payload"]) if row else None

    def upsert_record(self, kind: str, record_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        self.initialize()
        with self.connect() as conn:
            self._upsert_with_conn(conn, kind, record_id, payload)
        return payload

    def create_sync_run(self, connector_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        self.initialize()
        created_at = now_iso()
        sync_id = str(payload.get("id") or f"sync-{connector_id}-{created_at}")
        payload = {**payload, "id": sync_id, "connector_id": connector_id}
        with self.connect() as conn:
            conn.execute(
                "INSERT OR REPLACE INTO sync_runs (id, connector_id, payload, created_at) VALUES (?, ?, ?, ?)",
                (sync_id, connector_id, json.dumps(payload), created_at),
            )
        return payload

    def list_sync_runs(self, connector_id: str | None = None) -> list[dict[str, Any]]:
        self.initialize()
        with self.connect() as conn:
            if connector_id:
                rows = conn.execute("SELECT payload FROM sync_runs WHERE connector_id = ? ORDER BY created_at DESC", (connector_id,)).fetchall()
            else:
                rows = conn.execute("SELECT payload FROM sync_runs ORDER BY created_at DESC").fetchall()
        return [json.loads(row["payload"]) for row in rows]

    def audit(self, actor: str, action: str, target: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        self.initialize()
        created_at = now_iso()
        audit_id = f"audit-{created_at}-{action}"
        record = {"id": audit_id, "actor": actor, "action": action, "target": target, "payload": payload or {}, "created_at": created_at}
        with self.connect() as conn:
            conn.execute(
                "INSERT OR REPLACE INTO audit_logs (id, actor, action, target, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                (audit_id, actor, action, target, json.dumps(record["payload"]), created_at),
            )
        return record

    def list_audit_logs(self) -> list[dict[str, Any]]:
        self.initialize()
        with self.connect() as conn:
            rows = conn.execute("SELECT id, actor, action, target, payload, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 100").fetchall()
        return [{"id": row["id"], "actor": row["actor"], "action": row["action"], "target": row["target"], "payload": json.loads(row["payload"]), "created_at": row["created_at"]} for row in rows]

    def _upsert_with_conn(self, conn: sqlite3.Connection, kind: str, record_id: str, payload: dict[str, Any]) -> None:
        conn.execute(
            "INSERT OR REPLACE INTO records (kind, id, payload, updated_at) VALUES (?, ?, ?, ?)",
            (kind, record_id, json.dumps(payload), now_iso()),
        )


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


store = SprintPilotStore()
