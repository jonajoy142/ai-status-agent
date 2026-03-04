from app.infrastructure.rag.ingestion.loader import load_documents
from app.infrastructure.rag.ingestion.chunker import chunk_documents
from app.infrastructure.rag.vector_store.chroma_store import get_vector_store


def run_ingestion():
    print("Loading documents...")
    docs = load_documents()

    print(f"Loaded {len(docs)} documents")

    print("Chunking documents...")
    chunks = chunk_documents(docs)

    print(f"Created {len(chunks)} chunks")

    print("Saving embeddings...")

    db = get_vector_store()

    db.add_texts(chunks)

    # db.persist()

    print("RAG ingestion complete.")


if __name__ == "__main__":
    run_ingestion()