from app.domain.models.agent_run import SourceCitation
from app.infrastructure.demo.operating_data import WORK_ITEMS
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

EMPTY_INPUT_SCHEMA = {"type": "object", "properties": {}}


def _serialize_sources(sources: list[SourceCitation]) -> list[dict]:
    return [source.model_dump(mode="json") for source in sources]


def _search_work_items(query: str, source: str | None = None) -> list[dict]:
    lowered = query.lower()
    matches = []
    for item in WORK_ITEMS:
        haystack = " ".join([item.external_id, item.title, item.description, item.assignee, item.status, item.priority, item.epic]).lower()
        if source and item.source.lower() != source.lower():
            continue
        if any(token in haystack for token in lowered.split()) or not lowered.strip():
            matches.append(item.model_dump(mode="json"))
    return matches[:8]


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

    registry.register(
        ToolDescriptor(name="jira.search_issues", description="Mock Jira issue search; production version will call Jira search API.", input_schema=SEARCH_INPUT_SCHEMA, tags=["jira", "mock"], auth_required=True),
        lambda query, k=5: _search_work_items(query, source="Jira")[:k],
    )
    registry.register(
        ToolDescriptor(name="jira.get_issue", description="Mock Jira issue lookup by external issue key.", input_schema={"type": "object", "properties": {"issue_key": {"type": "string"}}, "required": ["issue_key"]}, tags=["jira", "mock"], auth_required=True),
        lambda issue_key: [item.model_dump(mode="json") for item in WORK_ITEMS if item.external_id == issue_key],
    )
    registry.register(
        ToolDescriptor(name="jira.get_comments", description="Mock Jira comment lookup; production version will call Jira comments API.", input_schema={"type": "object", "properties": {"issue_key": {"type": "string"}}, "required": ["issue_key"]}, tags=["jira", "mock"], auth_required=True),
        lambda issue_key: [{"issue_key": issue_key, "author": "Maya", "body": "Needs final owner update before weekly brief."}],
    )
    registry.register(
        ToolDescriptor(name="jira.sync_project", description="Mock Jira project sync; production version will import projects, issues, and comments.", input_schema=EMPTY_INPUT_SCHEMA, tags=["jira", "sync", "mock"], auth_required=True, timeout_seconds=30),
        lambda: {"status": "completed", "records_synced": 18},
    )
    registry.register(
        ToolDescriptor(name="github.search_prs", description="Mock GitHub PR search for implementation and review status.", input_schema=SEARCH_INPUT_SCHEMA, tags=["github", "mock"], auth_required=True),
        lambda query, k=5: [{"number": 42, "title": "Fix checkout session refresh", "status": "review_requested", "owner": "Isha"}],
    )
    registry.register(
        ToolDescriptor(name="github.get_pr_status", description="Mock GitHub PR status lookup.", input_schema={"type": "object", "properties": {"pr_number": {"type": "integer"}}, "required": ["pr_number"]}, tags=["github", "mock"], auth_required=True),
        lambda pr_number: {"pr_number": pr_number, "checks": "passing", "review": "requested"},
    )
    registry.register(
        ToolDescriptor(name="slack.search_messages", description="Mock Slack message search for recent updates and blockers.", input_schema=SEARCH_INPUT_SCHEMA, tags=["slack", "mock"], auth_required=True),
        lambda query, k=5: _serialize_sources(retrieve_documents(query, source="slack", k=k)),
    )
    registry.register(
        ToolDescriptor(name="confluence.search_pages", description="Mock Confluence page search for project documentation.", input_schema=SEARCH_INPUT_SCHEMA, tags=["confluence", "mock"], auth_required=True),
        lambda query, k=5: _serialize_sources(retrieve_documents(query, source="docs", k=k)),
    )
    registry.register(
        ToolDescriptor(name="notion.search_docs", description="Mock Notion document search for plans and meeting notes.", input_schema=SEARCH_INPUT_SCHEMA, tags=["notion", "mock"], auth_required=True),
        lambda query, k=5: _serialize_sources(retrieve_documents(query, source="docs", k=k)),
    )

    return registry
