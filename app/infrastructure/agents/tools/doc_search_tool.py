from app.infrastructure.rag.retrieval.retriever import retrieve

def search_docs(query: str):
    """
    Search internal documentation
    """
    return retrieve(query)