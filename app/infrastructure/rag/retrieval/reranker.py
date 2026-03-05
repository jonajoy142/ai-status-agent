from langchain_ollama import ChatOllama

reranker_llm = ChatOllama(model="llama3.2")


def rerank(query: str, docs: list[str]):

    if not docs:
        return docs

    prompt = f"""
You are ranking documents by relevance.

Query:
{query}

Documents:
{docs}

Return the 3 most relevant documents.
"""

    response = reranker_llm.invoke(prompt)

    text = response.content

    return text