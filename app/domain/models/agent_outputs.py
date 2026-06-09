from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class RiskSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Citation(BaseModel):
    text: str
    source_url: str
    source_type: str


class RiskOutputItem(BaseModel):
    id: str
    title: str
    description: str
    severity: RiskSeverity
    impacted_business_priority: str
    impacted_team: str
    evidence: str
    suggested_action: str
    owner: str
    source_citations: list[Citation] = Field(default_factory=list)


class DecisionOutputItem(BaseModel):
    title: str
    context: str
    options: list[dict[str, str]] = Field(default_factory=list)
    impact_if_delayed: str
    owner: str
    due_date: str | None = None
    source_citations: list[Citation] = Field(default_factory=list)


class WorkItemInsight(BaseModel):
    ticket_id: str
    title: str
    status: str
    owner: str
    stale_days: int
    risk_level: RiskSeverity
    blocker_reason: str | None = None
    suggested_action: str
    source_url: str


class TeamHealth(BaseModel):
    team_name: str
    planned_points: int
    completed_points: int
    blocked_items: int
    delivery_confidence: float = Field(ge=0.0, le=1.0)
    risk_level: RiskSeverity
    business_priority_affected: str
    overloaded_members: list[str] = Field(default_factory=list)


class BusinessImpact(BaseModel):
    priority_name: str
    status: str
    eta: str
    owner: str
    business_impact_summary: str
    risks: list[RiskOutputItem] = Field(default_factory=list)


class SprintStatusOutput(BaseModel):
    sprint_id: str
    percent_complete: int
    days_remaining: int
    goal_points: int
    blocked_count: int
    stale_count: int
    work_items: list[WorkItemInsight] = Field(default_factory=list)


class WeeklyReportStructuredOutput(BaseModel):
    title: str
    audience: str
    sprint_id: str
    generated_at: str
    executive_summary: str
    what_shipped: list[dict[str, Any]] = Field(default_factory=list)
    what_slipped: list[dict[str, Any]] = Field(default_factory=list)
    top_risks: list[RiskOutputItem] = Field(default_factory=list)
    decisions_needed: list[DecisionOutputItem] = Field(default_factory=list)
    team_health: list[TeamHealth] = Field(default_factory=list)
    business_impact: list[BusinessImpact] = Field(default_factory=list)
    action_items: list[str] = Field(default_factory=list)
    confidence_score: float = Field(ge=0.0, le=1.0)
    citations: list[Citation] = Field(default_factory=list)
    token_usage: int = 0
    model: str = "demo-structured-generator"


class EvaluationResult(BaseModel):
    report_id: str
    groundedness_score: float = Field(ge=0.0, le=1.0)
    citation_coverage: float = Field(ge=0.0, le=1.0)
    hallucination_risk: float = Field(ge=0.0, le=1.0)
    retrieval_relevance: float = Field(ge=0.0, le=1.0)
    completeness_score: float = Field(ge=0.0, le=1.0)
    actionability_score: float = Field(ge=0.0, le=1.0)
    latency_ms: int
    token_usage: int
    model_cost_usd: float
    evaluator_model: str
    notes: str


class AgentTrace(BaseModel):
    run_id: str
    workspace_id: str
    audience: str
    started_at: str
    completed_at: str
    agents_called: list[str]
    tool_calls: list[dict[str, Any]] = Field(default_factory=list)
    total_tokens: int
    total_latency_ms: int
    status: str
    errors: list[str] = Field(default_factory=list)
