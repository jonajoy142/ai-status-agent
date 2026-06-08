from uuid import uuid4

from app.domain.models.agent_run import AgentRunResponse, SourceCitation
from app.infrastructure.agents.documentation_agent import DocumentationAgent
from app.infrastructure.agents.risk_agent import RiskAgent
from app.infrastructure.agents.status_agent import StatusAgent
from app.infrastructure.mcp.project_tools import build_project_tool_registry
from app.infrastructure.observability.tracing import trace_store


class SupervisorAgent:
    name = "supervisor"

    def __init__(self) -> None:
        self.registry = build_project_tool_registry()
        self.status_agent = StatusAgent()
        self.risk_agent = RiskAgent()
        self.documentation_agent = DocumentationAgent()

    def run(self, question: str, session_id: str = "demo-session") -> AgentRunResponse:
        run_id = str(uuid4())
        trace_store.add(run_id, "run_start", "Supervisor received question and planned a multi-agent workflow.", agent=self.name)
        trace_store.add(
            run_id,
            "plan",
            "Plan: retrieve status evidence, inspect risk signals, synthesize report, return citations.",
            agent=self.name,
        )

        status, status_sources, status_tool_calls = self.status_agent.analyze(question, self.registry, run_id)
        risks, risk_sources, risk_tool_calls = self.risk_agent.analyze(question, self.registry, run_id)
        sources = self._dedupe_sources(status_sources + risk_sources)
        answer, report = self.documentation_agent.generate(question, status, risks, sources, run_id)

        trace_store.add(run_id, "run_complete", "Supervisor aggregated agent outputs into the final response.", agent=self.name)

        return AgentRunResponse(
            run_id=run_id,
            session_id=session_id,
            question=question,
            answer=answer,
            report=report,
            sources=sources[:10],
            tool_calls=status_tool_calls + risk_tool_calls,
            trace=trace_store.get(run_id),
        )

    def tools(self):
        return self.registry.list_tools()

    def _dedupe_sources(self, sources: list[SourceCitation]) -> list[SourceCitation]:
        deduped: dict[str, SourceCitation] = {}
        for source in sorted(sources, key=lambda item: item.score, reverse=True):
            key = f"{source.source}:{source.metadata.get('id', source.title)}"
            deduped.setdefault(key, source)
        return list(deduped.values())
