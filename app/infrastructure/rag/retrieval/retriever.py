import math
import re
from functools import lru_cache
from typing import Any

from app.config.settings import settings
from app.domain.models.agent_run import SourceCitation
from app.infrastructure.rag.ingestion.loader import load_documents
from app.infrastructure.rag.vector_store.chroma_store import get_vector_store

TOKEN_PATTERN = re.compile(r"[a-zA-Z0-9][a-zA-Z0-9_-]+")


def _tokenize(text: str) -> list[str]:
    return [token.lower() for token in TOKEN_PATTERN.findall(text)]


@lru_cache(maxsize=1)
def _local_corpus() -> tuple[dict[str, Any], ...]:
    return tuple(load_documents())


def _score(query: str, text: str, metadata: dict[str, Any]) -> float:
    query_terms = _tokenize(query)
    if not query_terms:
        return 0.0

    searchable = " ".join([text, " ".join(str(v) for v in metadata.values())])
    doc_terms = _tokenize(searchable)
    if not doc_terms:
        return 0.0

    query_counts = {term: query_terms.count(term) for term in set(query_terms)}
    doc_counts = {term: doc_terms.count(term) for term in set(doc_terms)}
    dot = sum(query_counts.get(term, 0) * doc_counts.get(term, 0) for term in query_counts)
    query_norm = math.sqrt(sum(value * value for value in query_counts.values()))
    doc_norm = math.sqrt(sum(value * value for value in doc_counts.values()))
    if query_norm == 0 or doc_norm == 0:
        return 0.0

    exact_bonus = 0.15 if query.lower() in searchable.lower() else 0.0
    return round((dot / (query_norm * doc_norm)) + exact_bonus, 4)


def _local_retrieve(query: str, source: str | None = None, k: int = 6) -> list[SourceCitation]:
    results: list[SourceCitation] = []
    for doc in _local_corpus():
        metadata = dict(doc.get("metadata", {}))
        if source and metadata.get("source") != source:
            continue

        text = str(doc.get("text", ""))
        score = _score(query, text, metadata)
        if score <= 0:
            continue

        results.append(
            SourceCitation(
                source=str(metadata.get("source", "unknown")),
                title=str(metadata.get("title", metadata.get("id", "Untitled source"))),
                content=text,
                score=score,
                metadata=metadata,
            )
        )

    return sorted(results, key=lambda item: item.score, reverse=True)[:k]


def _chroma_retrieve(query: str, source: str | None = None, k: int = 6) -> list[SourceCitation]:
    db = get_vector_store()
    filter_query = {"source": source} if source else None
    docs = db.similarity_search_with_score(query, k=k, filter=filter_query)

    results: list[SourceCitation] = []
    for doc, distance in docs:
        metadata = dict(doc.metadata or {})
        results.append(
            SourceCitation(
                source=str(metadata.get("source", "unknown")),
                title=str(metadata.get("title", metadata.get("id", "Untitled source"))),
                content=doc.page_content,
                score=round(float(1 / (1 + distance)), 4),
                metadata=metadata,
            )
        )
    return results


def retrieve_documents(query: str, source: str | None = None, k: int = 6) -> list[SourceCitation]:
    if settings.vector_provider == "chroma":
        try:
            results = _chroma_retrieve(query, source=source, k=k)
            if results:
                return results
        except Exception:
            pass

    return _local_retrieve(query, source=source, k=k)


def retrieve(query: str, source: str | None = None):
    return [doc.content for doc in retrieve_documents(query, source=source)]
