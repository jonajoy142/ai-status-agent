from app.infrastructure.rag.retrieval.retriever import retrieve

def search_slack(query: str):
    """
    Search Slack conversation history
    """
    return retrieve(query)