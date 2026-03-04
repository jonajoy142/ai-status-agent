from langchain_ollama import ChatOllama
from app.config.settings import settings
from app.infrastructure.rag.retrieval.retriever import retrieve


class StatusAgent:

    def __init__(self):

        self.llm = ChatOllama(
            model=settings.llm_model,
            temperature=0
        )

    def run(self, question: str):

        context = retrieve(question)

        prompt = f"""
You are a project assistant.

Context:
{context}

Question:
{question}

Answer clearly.
"""

        return self.llm.invoke(prompt).content