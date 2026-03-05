from app.infrastructure.rag.vector_store.chroma_store import get_vector_store
from app.infrastructure.rag.embeddings.cache import get_cached_embedding
from app.infrastructure.rag.retrieval.reranker import rerank


def retrieve(query: str, source: str | None = None):

    db = get_vector_store()

    # -----------------------------
    # Embedding with cache
    # -----------------------------
    embedding = get_cached_embedding(
        query,
        db._embedding_function.embed_query
    )

    # -----------------------------
    # Vector Search
    # -----------------------------
    if source:
        results = db.similarity_search_by_vector(
            embedding,
            k=8,
            filter={"source": source}
        )
    else:
        results = db.similarity_search_by_vector(
            embedding,
            k=8
        )

    docs = [doc.page_content for doc in results]

    # -----------------------------
    # Rerank documents
    # -----------------------------
    reranked_docs = rerank(query, docs)

    return reranked_docs