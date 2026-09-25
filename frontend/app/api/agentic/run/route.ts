import { NextResponse } from "next/server";
import { synthesizeOperatingBrief } from "@/lib/rag-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const query = body.query || body.question || "What is the checkout launch status and risk?";
    const role = (request.headers.get("x-demo-role") || body.role || "founder").toLowerCase();
    const runId = `agentic-${Date.now().toString(36)}`;

    const rag = synthesizeOperatingBrief(query, role);

    const state = {
      workspace_id: body.workspace_id || "demo-workspace",
      role,
      query,
      sources: rag.sources,
      executive_summary: rag.executiveSummary,
      status: {
        summary: rag.statusSummary,
        active_work: rag.activeWork,
        owners: rag.owners,
        confidence: rag.confidence,
      },
      risks: {
        risk_level: rag.riskLevel,
        risks: rag.risks,
        recommendations: rag.recommendations,
      },
      next_steps: rag.nextSteps,
      evaluation_result: {
        overall_pass: true,
        faithfulness: rag.evaluation.faithfulness,
        answer_relevance: rag.evaluation.answerRelevance,
        citation_coverage: rag.evaluation.citationCoverage,
      },
    };

    const events = rag.pipelineSteps.map((p, idx) => ({
      event_type: "node_executed",
      node: p.step,
      label: p.label,
      details: p.details,
      latency_ms: p.latencyMs,
      timestamp: new Date(Date.now() - (rag.pipelineSteps.length - idx) * 10).toISOString(),
    }));

    return NextResponse.json({
      run_id: runId,
      workspace_id: body.workspace_id || "demo-workspace",
      status: "completed",
      state,
      events,
    });
  } catch (error) {
    return NextResponse.json({ detail: "Agentic run failed", error: String(error) }, { status: 500 });
  }
}
