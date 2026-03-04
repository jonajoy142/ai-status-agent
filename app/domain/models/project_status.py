from pydantic import BaseModel
from typing import List


class ProjectStatus(BaseModel):
    feature: str
    status: str
    assignee: str | None = None
    updates: List[str]
    risks: List[str]