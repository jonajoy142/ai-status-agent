from langchain_chroma import Chroma
from app.infrastructure.rag.embeddings.embedding_provider import get_embeddings
from app.config.settings import settings


def get_vector_store():
    embeddings = get_embeddings()

    return Chroma(
        persist_directory=settings.vector_db_path,
        embedding_function=embeddings
    )