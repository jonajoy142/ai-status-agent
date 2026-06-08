from app.domain.models.agent_run import SourceCitation
from app.infrastructure.mcp.tool_registry import ToolDescriptor, ToolRegistry
from app.infrastructure.rag.retrieval.retriever import retrieve_documents


SEARCH_INPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "query": {"type": "string"},
        "k": {"type": "integer", "default": 5},
    },
    "required": ["query"],
}


def _serialize_sources(sources: list[SourceCitation]) -> list[dict]:
    return [source.model_dump(mode="json") for source in sources]


def build_project_tool_registry() -> ToolRegistry:
    registry = ToolRegistry()

    registry.register(
        ToolDescriptor(
            name="project.search_tickets",
            description="Search engineering tickets for status, owners, priorities, and risks.",
            input_schema=SEARCH_INPUT_SCHEMA,
            output_schema={"type": "array", "items": {"type": "object"}},
            tags=["rag", "tickets", "project-intelligence"],
        ),
        lambda query, k=5: _serialize_sources(retrieve_documents(query, source="tickets", k=k)),
    )

    registry.register(
        ToolDescriptor(
            name="project.search_chat",
            description="Search engineering chat updates for recent team context and blockers.",
            input_schema=SEARCH_INPUT_SCHEMA,
            output_schema={"type": "array", "items": {"type": "object"}},
            tags=["rag", "chat", "updates"],
        ),
        lambda query, k=5: _serialize_sources(retrieve_documents(query, source="slack", k=k)),
    )

    registry.register(
        ToolDescriptor(
            name="project.search_docs",
            description="Search project documentation for launch criteria, goals, and known risks.",
            input_schema=SEARCH_INPUT_SCHEMA,
            output_schema={"type": "array", "items": {"type": "object"}},
            tags=["rag", "docs", "knowledge-base"],
        ),
        lambda query, k=5: _serialize_sources(retrieve_documents(query, source="docs", k=k)),
    )

    return registry
