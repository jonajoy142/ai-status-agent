from app.infrastructure.rag.retrieval.retriever import retrieve


def search_tickets(query: str):
    return retrieve(query, source="tickets")