from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


Role = Literal["founder", "product_manager", "engineering_manager", "engineer", "viewer"]
RiskLevel = Literal["low", "medium", "high"]
ConnectorStatus = Literal["connected", "mock", "not_connected", "error"]


class User(BaseModel):
    id: str
    name: str
    email: str
    role: Role
    title: str


class Workspace(BaseModel):
    id: str
    name: str
    plan: str = "Startup"


class Project(BaseModel):
    id: str
    name: str
    status: str
    health_score: int
    business_priority: str


class Epic(BaseModel):
    id: str
    title: str
    project_id: str
    status: str


class Sprint(BaseModel):
    id: str
    name: str
    goal: str
    start_date: str
    end_date: str
    health_score: int


class Comment(BaseModel):
    id: str
    work_item_id: str
    author: str
    body: str
    created_at: str
    source_url: str | None = None


class WorkItem(BaseModel):
    id: str
    external_id: str
    title: str
    description: str
    status: str
    priority: str
    assignee: str
    reporter: str
    sprint: str
    epic: str
    labels: list[str] = Field(default_factory=list)
    due_date: str | None = None
    source: str
    source_url: str
    risk_level: RiskLevel
    blocker_reason: str | None = None
    stale_score: int
    business_impact: str
    suggested_next_action: str
    updated_at: str


class Risk(BaseModel):
    id: str
    title: str
    level: RiskLevel
    owner: str
    status: str
    business_impact: str
    evidence: list[str] = Field(default_factory=list)
    recommended_action: str
    source_url: str | None = None


class Blocker(BaseModel):
    id: str
    work_item_id: str
    reason: str
    owner: str
    age_days: int
    recommended_action: str


class Decision(BaseModel):
    id: str
    title: str
    owner: str
    due_date: str
    impact_if_delayed: str
    options: list[str] = Field(default_factory=list)
    source_url: str | None = None


class Report(BaseModel):
    id: str
    type: str
    title: str
    summary: str
    shipped_work: list[str] = Field(default_factory=list)
    blocked_work: list[str] = Field(default_factory=list)
    risks: list[str] = Field(default_factory=list)
    decisions_needed: list[str] = Field(default_factory=list)
    action_items: list[str] = Field(default_factory=list)
    citations: list[str] = Field(default_factory=list)
    confidence_score: int
    generated_at: str


class Connector(BaseModel):
    id: str
    name: str
    status: ConnectorStatus
    auth_type: str
    last_synced_at: str | None = None
    scopes: list[str] = Field(default_factory=list)
    env_vars: list[str] = Field(default_factory=list)


class SyncRun(BaseModel):
    id: str
    connector_id: str
    status: str
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    records_synced: int = 0
    error: str | None = None


class Evaluation(BaseModel):
    id: str
    name: str
    score: int
    status: str
    latency_ms: int
    token_usage: int
    cost_estimate_usd: float


class DashboardOverview(BaseModel):
    role: Role
    headline: str
    sprint_health: int
    open_risks: int
    blocked_work: int
    decisions_needed: int
    business_impact: str
    weekly_brief_preview: str
    suggested_next_actions: list[str]
    latest_changes: list[str]
    owner_workload: dict[str, int]
