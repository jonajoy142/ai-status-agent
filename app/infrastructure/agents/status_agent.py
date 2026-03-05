import logging
from typing import TypedDict, Optional

from langchain_ollama import ChatOllama
from langgraph.graph import StateGraph, END

from app.infrastructure.agents.tools.ticket_search_tool import search_tickets
from app.infrastructure.agents.tools.chat_search_tool import search_slack
from app.infrastructure.agents.tools.doc_search_tool import search_docs
from app.config.settings import settings


logger = logging.getLogger(__name__)


# ---------------------------
# Agent State
# ---------------------------
class AgentState(TypedDict):
    question: str
    rewritten_query: str
    decision: str
    observation: str
    answer: str
    step: int


# ---------------------------
# LLM
# ---------------------------
llm = ChatOllama(
    model=settings.llm_model,
    temperature=0
)


# ---------------------------
# Query Rewrite
# ---------------------------
def rewrite_query(state: AgentState):

    question = state["question"]

    logger.info("Rewriting query for retrieval")

    prompt = f"""
    Rewrite the user question as a short search query for engineering project data.

    Rules:
    - Maximum 10 words
    - No explanations
    - No quotes

    Examples:

    User: payment issue??
    Query: payment feature issue status

    User: refund api done?
    Query: refund API implementation status

    User: stripe working?
    Query: stripe payment gateway integration status

    Question:
    {question}
    """

    rewritten = llm.invoke(prompt).content.strip()

    logger.info(f"Rewritten query: {rewritten}")

    return {
        "rewritten_query": rewritten,
        "step": 0
    }


# ---------------------------
# Reasoning Step
# ---------------------------
def agent_reason(state: AgentState):

    logger.info("Agent reasoning step")

    prompt = f"""
You are an AI engineering assistant.

Available tools:
search_tickets
search_slack
search_docs

You can also return:
final_answer

Rules:
- Do not repeat the same tool many times.
- After gathering enough information return final_answer.

Question:
{state['question']}

Observation:
{state.get('observation','')}

Return ONLY one of:

search_tickets
search_slack
search_docs
final_answer
"""

    decision = llm.invoke(prompt).content.lower().strip()

    logger.info(f"Agent decision: {decision}")

    return {"decision": decision}


# ---------------------------
# Tool Execution
# ---------------------------
def execute_tool(state: AgentState):

    query = state["rewritten_query"]
    decision = state["decision"]
    step = state.get("step", 0) + 1

    logger.info(f"Executing tool (step {step})")

    if "tickets" in decision:
        results = search_tickets(query)

    elif "slack" in decision:
        results = search_slack(query)

    elif "docs" in decision:
        results = search_docs(query)

    else:
        results = []

    observation = "\n".join(results) if isinstance(results, list) else str(results)

    logger.info("Tool observation collected")

    return {
        "observation": observation,
        "step": step
    }


# ---------------------------
# Generate Final Answer
# ---------------------------
def generate_answer(state: AgentState):

    logger.info("Generating final answer")

    prompt = f"""
You are an AI project assistant.

Use the observation to answer the question.

Observation:
{state.get('observation','')}

Question:
{state['question']}

Provide a concise engineering project status summary.
"""

    response = llm.invoke(prompt)

    logger.info("Final answer generated")

    return {"answer": response.content}


# ---------------------------
# Router
# ---------------------------
def router(state: AgentState):

    step = state.get("step", 0)
    decision = state["decision"]

    if step >= 3:
        logger.info("Max reasoning steps reached → generating answer")
        return "generate"

    if "final" in decision:
        return "generate"

    return "tool"


# ---------------------------
# Agent Class
# ---------------------------
class StatusAgent:

    def __init__(self):

        logger.info("Initializing ReAct LangGraph agent")

        graph = StateGraph(AgentState)

        graph.add_node("rewrite", rewrite_query)
        graph.add_node("reason", agent_reason)
        graph.add_node("tool", execute_tool)
        graph.add_node("generate", generate_answer)

        graph.set_entry_point("rewrite")

        graph.add_edge("rewrite", "reason")

        graph.add_conditional_edges(
            "reason",
            router,
            {
                "tool": "tool",
                "generate": "generate"
            }
        )

        graph.add_edge("tool", "reason")
        graph.add_edge("generate", END)

        self.app = graph.compile()

    def run(self, question: str):

        logger.info(f"Agent received question: {question}")

        result = self.app.invoke({
            "question": question
        })

        logger.info("Agent finished execution")

        return result["answer"]