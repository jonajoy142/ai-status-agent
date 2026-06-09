from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "SprintPilot.AI"
    environment: str = "local"
    cors_origins: str = "http://localhost:3000"

    database_path: str = "data/sprintpilot.db"
    vector_db_path: str = "vector_db"
    vector_provider: str = "local"
    embedding_model: str = "nomic-embed-text"

    llm_provider: str = "demo"
    llm_model: str = "llama3"
    openai_api_key: str | None = Field(default=None, validation_alias="OPENAI_API_KEY")
    openai_model: str = "gpt-4.1-mini"

    enable_langfuse: bool = False
    langfuse_public_key: str | None = None
    langfuse_secret_key: str | None = None
    langfuse_host: str = "https://cloud.langfuse.com"

    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
