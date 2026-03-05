from app.infrastructure.rag.vector_store.chroma_store import get_vector_store


def retrieve(query: str, source: str | None = None):

    db = get_vector_store()

    if source:
        results = db.similarity_search(
            query,
            k=3,
            filter={"source": source}
        )
    else:
        results = db.similarity_search(query, k=3)

    return [doc.page_content for doc in results]