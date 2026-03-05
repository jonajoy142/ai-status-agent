from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_documents(docs):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    chunks = []

    for doc in docs:

        text = doc["text"]
        metadata = doc["metadata"]

        split_texts = splitter.split_text(text)

        for chunk in split_texts:
            chunks.append({
                "text": chunk,
                "metadata": metadata
            })

    return chunks