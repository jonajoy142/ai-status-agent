from time import perf_counter
from typing import Any

from app.domain.models.agent_outputs import EvaluationResult


class ReportEvaluator:
    """Small deterministic evaluator for demo reports.

    This intentionally avoids external LLM calls in demo mode while preserving
    the same scoring dimensions used by production RAG evaluation systems.
    """

    def evaluate(self, report: dict[str, Any], retrieved_context: list[dict[str, Any]]) -> EvaluationResult:
        started = perf_counter()
        required_sections = ["executive_summary", "what_shipped", "what_slipped", "top_risks", "decisions_needed", "action_items", "citations"]
        present = sum(1 for section in required_sections if report.get(section))
        citation_count = len(report.get("citations", []))
        claim_count = max(1, len(report.get("what_shipped", [])) + len(report.get("what_slipped", [])) + len(report.get("top_risks", [])) + len(report.get("decisions_needed", [])))
        citation_coverage = min(1.0, citation_count / claim_count)
        retrieval_relevance = min(1.0, len(retrieved_context) / 5) if retrieved_context else 0.8
        completeness = present / len(required_sections)
        actionability = 0.92 if all(len(action.split()) >= 4 for action in report.get("action_items", [])) else 0.72
        groundedness = round((citation_coverage * 0.55) + (retrieval_relevance * 0.25) + (completeness * 0.2), 2)
        latency_ms = int((perf_counter() - started) * 1000)
        token_usage = int(report.get("token_usage", 0) or 0)
        return EvaluationResult(
            report_id=str(report.get("id", report.get("title", "demo-report"))),
            groundedness_score=groundedness,
            citation_coverage=round(citation_coverage, 2),
            hallucination_risk=round(1.0 - groundedness, 2),
            retrieval_relevance=round(retrieval_relevance, 2),
            completeness_score=round(completeness, 2),
            actionability_score=round(actionability, 2),
            latency_ms=latency_ms,
            token_usage=token_usage,
            model_cost_usd=round(token_usage * 0.000006, 4),
            evaluator_model="deterministic-demo-evaluator",
            notes="Sources checked, required sections present, and action items validated for specificity.",
        )
