import json

from app.domain.models.agent_run import RiskInsight, SourceCitation, ToolCallRecord
from app.infrastructure.mcp.tool_registry import ToolRegistry
from app.infrastructure.observability.tracing import trace_store

RISK_TERMS = ("risk", "blocker", "blocking", "delay", "issue", "unstable", "depends", "dependency", "failure", "retry")


class RiskAgent:
    name = "risk"

    def analyze(self, question: str, registry: ToolRegistry, run_id: str) -> tuple[RiskInsight, list[SourceCitation], list[ToolCallRecord]]:
        trace_store.add(run_id, "agent_start", "Risk agent searching for blockers, launch risks, and escalation signals.", agent=self.name)

        tool_calls: list[ToolCallRecord] = []
        sources: list[SourceCitation] = []
        query = f"{question} risk blocker dependency launch issue retry failure"

        for tool_name in ["project.search_tickets", "project.search_chat", "project.search_docs"]:
            result = registry.execute(tool_name, agent=self.name, query=query, k=5)
            tool_calls.append(result.record)
            sources.extend(SourceCitation.model_validate(item) for item in result.output)

        risks = self._risks(sources)
        risk_level = self._risk_level(risks)
        recommendations = self._recommendations(risks)

        trace_store.add(
            run_id,
            "agent_complete",
            f"Risk agent identified {len(risks)} risk signals with {risk_level} severity.",
            agent=self.name,
            metadata={"risk_level": risk_level, "risks": len(risks)},
        )

        return RiskInsight(risk_level=risk_level, risks=risks, recommendations=recommendations), sources, tool_calls

    def _risks(self, sources: list[SourceCitation]) -> list[str]:
        risks: list[str] = []
        for source in sources:
            text = source.content
            if source.source == "tickets":
                try:
                    ticket = json.loads(text)
                    risk = ticket.get("risk")
                    if risk:
                        risks.append(f"{ticket.get('id', 'Ticket')}: {risk}")
                    continue
                except json.JSONDecodeError:
                    pass

            for sentence in text.replace("\n", " ").split("."):
                if any(term in sentence.lower() for term in RISK_TERMS):
                    cleaned = sentence.strip()
                    if cleaned:
                        risks.append(cleaned)

        deduped = list(dict.fromkeys(risks))
        return deduped[:6]

    def _risk_level(self, risks: list[str]) -> str:
        joined = " ".join(risks).lower()
        if "blocker" in joined or "high" in joined:
            return "high"
        if "medium" in joined or "unstable" in joined or "retry" in joined or len(risks) >= 3:
            return "medium"
        return "low"

    def _recommendations(self, risks: list[str]) -> list[str]:
        if not risks:
            return ["Continue monitoring ticket and chat updates for emerging risks."]
        return [
            "Run one final staging validation pass focused on the highest-risk workflow.",
            "Keep owner-level accountability visible in the next stakeholder update.",
            "Use source-backed release notes so leadership can distinguish facts from interpretation.",
        ]
