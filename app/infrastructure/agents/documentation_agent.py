from app.domain.models.agent_run import ProjectReport, RiskInsight, SourceCitation, StatusInsight
from app.infrastructure.llm.provider import llm_provider
from app.infrastructure.observability.tracing import trace_store


class DocumentationAgent:
    name = "documentation"

    def generate(
        self,
        question: str,
        status: StatusInsight,
        risks: RiskInsight,
        sources: list[SourceCitation],
        run_id: str,
    ) -> tuple[str, ProjectReport]:
        trace_store.add(run_id, "agent_start", "Documentation agent synthesizing stakeholder-ready report.", agent=self.name)

        executive_summary = self._llm_summary(question, status, risks, sources) or self._deterministic_summary(status, risks)
        next_steps = self._next_steps(risks)
        report = ProjectReport(
            executive_summary=executive_summary,
            status=status,
            risks=risks,
            next_steps=next_steps,
        )
        answer = self._answer(report, sources)

        trace_store.add(
            run_id,
            "agent_complete",
            "Documentation agent generated a structured report with source attribution.",
            agent=self.name,
            metadata={"source_count": len(sources)},
        )
        return answer, report

    def _llm_summary(self, question: str, status: StatusInsight, risks: RiskInsight, sources: list[SourceCitation]) -> str | None:
        context = "\n".join(f"- [{source.source}] {source.title}: {source.content[:400]}" for source in sources[:8])
        prompt = f"""
Write a concise executive project update for an engineering leadership audience.

Question: {question}
Status: {status.model_dump()}
Risks: {risks.model_dump()}
Evidence:
{context}

Rules:
- 2 to 4 sentences.
- Be factual and source-grounded.
- Do not invent dates, owners, or statuses.
"""
        return llm_provider.generate(prompt)

    def _deterministic_summary(self, status: StatusInsight, risks: RiskInsight) -> str:
        if risks.risk_level == "high":
            risk_sentence = "There are high-priority risks that need immediate owner attention before launch."
        elif risks.risk_level == "medium":
            risk_sentence = "The main risks are manageable but should stay visible until staging validation is complete."
        else:
            risk_sentence = "Current risk is low based on the available project evidence."
        return f"{status.summary} {risk_sentence}"

    def _next_steps(self, risks: RiskInsight) -> list[str]:
        if risks.recommendations:
            return risks.recommendations
        return ["Refresh the knowledge base after the next sprint update."]

    def _answer(self, report: ProjectReport, sources: list[SourceCitation]) -> str:
        source_labels = ", ".join(f"{source.source}:{source.title}" for source in sources[:4]) or "no sources"
        return (
            f"{report.executive_summary}\n\n"
            f"Risk level: {report.risks.risk_level}.\n"
            f"Active work: {len(report.status.active_work)} item(s).\n"
            f"Top sources: {source_labels}."
        )
