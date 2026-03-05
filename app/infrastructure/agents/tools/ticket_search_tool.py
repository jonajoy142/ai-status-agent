from app.infrastructure.rag.retrieval.retriever import retrieve

def search_tickets(query: str):
    """
    Search ticket related information
    """
    return retrieve(query)