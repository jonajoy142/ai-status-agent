from fastapi import APIRouter
from pydantic import BaseModel
from app.application.services.status_service import StatusService
from app.infrastructure.agents.tracing import get_trace, clear_trace
router = APIRouter()

service = StatusService()


class QueryRequest(BaseModel):
    question: str


@router.post("/query")
def query_agent(req: QueryRequest):

    result = service.get_status(req.question)

    return {"result": result}


@router.get("/trace")
def get_agent_trace():

    trace = get_trace()

    return {"trace": trace}