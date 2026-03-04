from fastapi import APIRouter
from pydantic import BaseModel
from app.application.services.status_service import StatusService

router = APIRouter()

service = StatusService()


class QueryRequest(BaseModel):
    question: str


@router.post("/query")
def query_agent(req: QueryRequest):

    result = service.get_status(req.question)

    return {"result": result}