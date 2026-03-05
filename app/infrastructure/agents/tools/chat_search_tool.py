from app.infrastructure.rag.retrieval.retriever import retrieve


def search_slack(query: str):
    return retrieve(query, source="slack")