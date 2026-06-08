from fastapi import APIRouter
from pydantic import BaseModel

from app.application.dto.agent_request import AgentRunRequest
from app.application.services.status_service import StatusService
from app.config.settings import settings
from app.infrastructure.agents.tracing import get_trace
from app.infrastructure.rag.ingestion.loader import load_documents

router = APIRouter()
service = StatusService()


class QueryRequest(BaseModel):
    question: str


@router.post("/query")
def query_agent(req: QueryRequest):
    result = service.get_status(req.question)
    return {"result": result}


@router.post("/agent/run")
def run_agent(req: AgentRunRequest):
    return service.run(question=req.question, session_id=req.session_id)


@router.get("/agent/tools")
def list_tools():
    return {"tools": [tool.model_dump(mode="json") for tool in service.list_tools()]}


@router.get("/trace")
def get_agent_trace(run_id: str | None = None):
    return {"trace": get_trace(run_id)}


@router.get("/knowledge/sources")
def knowledge_sources():
    docs = load_documents()
    sources: dict[str, dict] = {}
    for doc in docs:
        metadata = doc["metadata"]
        source = metadata.get("source", "unknown")
        if source not in sources:
            sources[source] = {"source": source, "documents": 0, "titles": []}
        sources[source]["documents"] += 1
        sources[source]["titles"].append(metadata.get("title", metadata.get("id", "Untitled")))
    return {"sources": list(sources.values())}


@router.get("/reports/demo")
def demo_report():
    return service.run("What is the current checkout launch status and risk?")


@router.get("/settings")
def public_settings():
    return {
        "app_name": settings.app_name,
        "environment": settings.environment,
        "llm_provider": settings.llm_provider,
        "vector_provider": settings.vector_provider,
        "mcp_ready": True,
        "deployment_targets": ["Vercel", "Railway", "Render", "Qdrant Cloud"],
    }
