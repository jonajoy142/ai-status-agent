from fastapi import FastAPI
from app.api.routes.agent_routes import router

app = FastAPI()

app.include_router(router)