from datetime import datetime, timezone
from typing import Any, Literal
from uuid import uuid4

from pydantic import BaseModel, Field


AgentName = Literal["supervisor", "status", "risk", "documentation"]


class SourceCitation(BaseModel):
    source: str
    title: str
    content: str
    score: float = 0.0
    metadata: dict[str, Any] = Field(default_factory=dict)


class ToolCallRecord(BaseModel):
    tool_name: str
    agent: AgentName | str
    input: dict[str, Any] = Field(default_factory=dict)
    output_preview: str = ""
    latency_ms: float = 0.0
    success: bool = True


class TraceStep(BaseModel):
    run_id: str
    step: str
    agent: AgentName | str = "supervisor"
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: dict[str, Any] = Field(default_factory=dict)


class StatusInsight(BaseModel):
    summary: str
    active_work: list[str] = Field(default_factory=list)
    owners: list[str] = Field(default_factory=list)
    confidence: float = 0.0


class RiskInsight(BaseModel):
    risk_level: Literal["low", "medium", "high"] = "low"
    risks: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)


class ProjectReport(BaseModel):
    title: str = "SprintPilot.AI Report"
    executive_summary: str
    status: StatusInsight
    risks: RiskInsight
    next_steps: list[str] = Field(default_factory=list)
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AgentRunResponse(BaseModel):
    run_id: str = Field(default_factory=lambda: str(uuid4()))
    session_id: str = "demo-session"
    question: str
    answer: str
    report: ProjectReport
    sources: list[SourceCitation] = Field(default_factory=list)
    tool_calls: list[ToolCallRecord] = Field(default_factory=list)
    trace: list[TraceStep] = Field(default_factory=list)
