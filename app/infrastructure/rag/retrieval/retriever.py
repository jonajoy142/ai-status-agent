from app.infrastructure.rag.vector_store.chroma_store import get_vector_store


def retrieve(query: str):

    db = get_vector_store()

    results = db.similarity_search(query, k=4)

    return [doc.page_content for doc in results]