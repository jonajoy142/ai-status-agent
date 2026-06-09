from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


Role = Literal["founder", "product_manager", "pm", "engineering_manager", "engineer", "developer", "viewer"]
RiskLevel = Literal["low", "medium", "high", "critical"]
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


class Team(BaseModel):
    id: str
    name: str
    lead: str
    members: list[str]
    capacity: int
    completed: int
    blocked_items: int
    risk_level: RiskLevel
    delivery_confidence: int
    business_priority: str


class BusinessPriority(BaseModel):
    id: str
    name: str
    status: Literal["on_track", "delayed", "at_risk"]
    eta: str
    owner: str
    impacted_teams: list[str] = Field(default_factory=list)
    risk_summary: str
    business_impact: str


class PullRequest(BaseModel):
    id: str
    number: int
    title: str
    status: str
    author: str
    reviewer: str
    waiting_days: int
    blocks: str
    source_url: str


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
    context: str = ""
    options: list[str | dict[str, str]] = Field(default_factory=list)
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


class WeeklyReportRequest(BaseModel):
    project: str = "Project Phoenix"
    sprint: str = "Sprint 24"
    audience: Literal["founder", "product_manager", "pm", "engineering_manager", "developer", "external"] = "founder"
    include_risks: bool = True
    include_decisions: bool = True
    include_citations: bool = True
    include_business_impact: bool = True
    include_team_workload: bool = True


class WeeklyReportOutput(BaseModel):
    id: str
    title: str
    audience: str
    sprint_id: str
    generated_at: str
    executive_summary: str
    what_shipped: list[dict[str, str]]
    what_slipped: list[dict[str, str]]
    top_risks: list[dict[str, str]]
    decisions_needed: list[dict[str, str]]
    team_health: list[dict[str, str | int]]
    business_impact: list[dict[str, str]]
    action_items: list[str]
    confidence_score: float = Field(ge=0.0, le=1.0)
    citations: list[dict[str, str]]
    token_usage: int
    model: str = "demo-structured-generator"


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
