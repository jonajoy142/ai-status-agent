import logging
from langchain_ollama import ChatOllama
from langgraph.graph import StateGraph, END
from typing import TypedDict

from app.infrastructure.agents.tools.ticket_search_tool import search_tickets
from app.infrastructure.agents.tools.chat_search_tool import search_slack
from app.infrastructure.agents.tools.doc_search_tool import search_docs
from app.config.settings import settings


logger = logging.getLogger(__name__)


class AgentState(TypedDict):
    question: str
    context: str
    answer: str


llm = ChatOllama(model=settings.llm_model)


def retrieve_context(state: AgentState):

    q = state["question"]

    logger.info("Agent retrieving context")
    logger.info(f"Searching tickets for: {q}")

    tickets = search_tickets(q)

    logger.info("Searching slack messages")

    slack = search_slack(q)

    logger.info("Searching documentation")

    docs = search_docs(q)

    context = f"""
Tickets:
{tickets}

Slack:
{slack}

Docs:
{docs}
"""

    logger.info("Context retrieval complete")

    return {"context": context}


def generate_answer(state: AgentState):

    logger.info("Generating final answer")

    prompt = f"""
Answer the question using the context.

Context:
{state['context']}

Question:
{state['question']}
"""

    response = llm.invoke(prompt)

    logger.info("LLM response generated")

    return {"answer": response.content}


class StatusAgent:

    def __init__(self):

        logger.info("Initializing LangGraph agent")

        graph = StateGraph(AgentState)

        graph.add_node("retrieve", retrieve_context)
        graph.add_node("generate", generate_answer)

        graph.set_entry_point("retrieve")

        graph.add_edge("retrieve", "generate")
        graph.add_edge("generate", END)

        self.app = graph.compile()

    def run(self, question: str):

        logger.info(f"Agent received question: {question}")

        result = self.app.invoke({"question": question})

        logger.info("Agent finished execution")

        return result["answer"]