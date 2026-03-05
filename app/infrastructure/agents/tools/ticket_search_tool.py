from app.infrastructure.rag.retrieval.retriever import retrieve


def search_tickets(query: str):

    results = retrieve(query, source="tickets")

    formatted = []

    for r in results:
        formatted.append(f"""
Ticket Information:
{r}
""")

    return "\n".join(formatted)