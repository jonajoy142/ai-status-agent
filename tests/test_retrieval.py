from app.infrastructure.rag.retrieval.retriever import retrieve_documents


def test_local_retrieval_returns_citations():
    results = retrieve_documents("checkout payment launch risk", k=3)

    assert results
    assert results[0].source in {"tickets", "slack", "docs"}
    assert results[0].title
    assert results[0].content
    assert results[0].score > 0
