from langchain_ollama import ChatOllama

reranker_llm = ChatOllama(model="llama3")


def rerank(query: str, docs: list[str]):

    if not docs:
        return docs

    docs_text = "\n".join([f"{i}: {doc}" for i, doc in enumerate(docs)])

    prompt = f"""
Select the 3 most relevant documents for the query.

Query:
{query}

Documents:
{docs_text}

Return ONLY the document numbers separated by commas.
Example: 0,2,3
"""

    response = reranker_llm.invoke(prompt).content.strip()

    try:
        indexes = [int(i) for i in response.split(",")]
        return [docs[i] for i in indexes if i < len(docs)]
    except:
        return docs[:3]