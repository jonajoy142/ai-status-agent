from __future__ import annotations

from abc import ABC, abstractmethod
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Any

from app.infrastructure.rag.retrieval.retriever import _score


@dataclass
class VectorDocument:
    id: str
    content: str
    metadata: dict[str, Any] = field(default_factory=dict)


class VectorStoreBackend(ABC):
    @abstractmethod
    async def ingest(self, documents: list[dict[str, Any]], workspace_id: str, collection: str = "reports") -> None: ...

    @abstractmethod
    async def search(self, query: str, workspace_id: str, collection: str = "reports", k: int = 5) -> list[dict[str, Any]]: ...


class LocalWorkspaceVectorStore(VectorStoreBackend):
    """Deterministic local vector-store fallback with per-workspace isolation.

    It preserves the same interface used by Chroma/Qdrant while avoiding external
    services in demo deployments.
    """

    def __init__(self) -> None:
        self._collections: dict[str, list[VectorDocument]] = defaultdict(list)

    def _collection_name(self, workspace_id: str, collection: str) -> str:
        return f"ws_{workspace_id}_{collection}"

    async def ingest(self, documents: list[dict[str, Any]], workspace_id: str, collection: str = "reports") -> None:
        key = self._collection_name(workspace_id, collection)
        current = {doc.id: doc for doc in self._collections[key]}
        for document in documents:
            doc = VectorDocument(id=str(document["id"]), content=str(document["content"]), metadata=dict(document.get("metadata", {})))
            current[doc.id] = doc
        self._collections[key] = list(current.values())

    async def search(self, query: str, workspace_id: str, collection: str = "reports", k: int = 5) -> list[dict[str, Any]]:
        key = self._collection_name(workspace_id, collection)
        scored = []
        for doc in self._collections.get(key, []):
            score = _score(query, doc.content, doc.metadata)
            if score > 0:
                scored.append({"id": doc.id, "content": doc.content, "metadata": doc.metadata, "relevance_score": score, "distance": round(1 - min(score, 1), 4)})
        return sorted(scored, key=lambda item: item["relevance_score"], reverse=True)[:k]


class ChromaWorkspaceVectorStore(LocalWorkspaceVectorStore):
    """Chroma-compatible placeholder.

    The class intentionally inherits the local fallback in demo mode. Production
    can replace methods with chromadb.HttpClient while keeping the same interface.
    """


_local_store = LocalWorkspaceVectorStore()
_chroma_store = ChromaWorkspaceVectorStore()


def get_workspace_vector_store(backend: str = "local") -> VectorStoreBackend:
    if backend == "chromadb":
        return _chroma_store
    if backend == "qdrant":
        return _local_store
    return _local_store
