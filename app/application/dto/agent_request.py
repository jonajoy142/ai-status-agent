from pydantic import BaseModel, Field


class AgentRunRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=1000)
    session_id: str = Field(default="demo-session", max_length=120)
