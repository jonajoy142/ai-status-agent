from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "SprintPilot.AI"
    environment: str = "local"
    cors_origins: str = "http://localhost:3000"
    frontend_url: str = "http://localhost:3000"
    secret_key: str = "dev-secret-change-me-min-64-chars-sprintpilot-local"

    database_path: str = "data/sprintpilot.db"
    vector_db_path: str = "vector_db"
    vector_provider: str = "local"
    vector_backend: str = "local"
    chroma_host: str = "localhost"
    chroma_port: int = 8001
    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: str | None = None
    embedding_model: str = "nomic-embed-text"

    llm_provider: str = "demo"
    llm_model: str = "llama3"
    openai_api_key: str | None = Field(default=None, validation_alias="OPENAI_API_KEY")
    openai_model: str = "gpt-4.1-mini"

    jwt_secret: str = "dev-jwt-secret-change-me-min-64-chars-sprintpilot-local"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 30

    google_client_id: str | None = None
    google_client_secret: str | None = None
    google_redirect_uri: str = "http://localhost:8000/api/auth/oauth/google/callback"
    github_client_id: str | None = None
    github_client_secret: str | None = None
    github_redirect_uri: str = "http://localhost:8000/api/auth/oauth/github/callback"

    enable_langfuse: bool = False
    langfuse_public_key: str | None = None
    langfuse_secret_key: str | None = None
    langfuse_host: str = "https://cloud.langfuse.com"

    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
