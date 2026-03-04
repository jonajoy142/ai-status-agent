from langchain_ollama import OllamaEmbeddings
from app.config.settings import settings


def get_embeddings():
    return OllamaEmbeddings(
        model=settings.embedding_model
    )