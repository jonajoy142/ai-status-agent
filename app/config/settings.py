from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    vector_db_path: str = "vector_db"
    embedding_model: str = "nomic-embed-text"
    llm_model: str = "llama3"


settings = Settings()