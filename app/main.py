from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.agent_routes import router
from app.config.settings import settings
from app.infrastructure.observability.logger import configure_logging, get_logger, log_event

configure_logging()
logger = get_logger(__name__)

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Production-ready demo backend for an AI project intelligence agent.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.environment,
        "llm_provider": settings.llm_provider,
        "vector_provider": settings.vector_provider,
    }


app.include_router(router)
log_event(logger, "sprintpilot_api_configured", service=settings.app_name, environment=settings.environment)
