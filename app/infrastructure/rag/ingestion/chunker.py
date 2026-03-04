from langchain_text_splitters import RecursiveCharacterTextSplitter

def chunk_documents(docs):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    chunks = []

    for d in docs:
        chunks.extend(splitter.split_text(d))

    return chunks