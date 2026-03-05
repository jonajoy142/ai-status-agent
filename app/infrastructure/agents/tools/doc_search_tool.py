from app.infrastructure.rag.retrieval.retriever import retrieve


def search_docs(query: str):
    return retrieve(query, source="docs")