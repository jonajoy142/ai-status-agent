export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export type AgentRunResponse = {
  run_id: string;
  session_id: string;
  question: string;
  answer: string;
  report: {
    executive_summary: string;
    status: {
      summary: string;
      active_work: string[];
      owners: string[];
      confidence: number;
    };
    risks: {
      risk_level: "low" | "medium" | "high";
      risks: string[];
      recommendations: string[];
    };
    next_steps: string[];
    generated_at: string;
  };
  sources: Array<{
    source: string;
    title: string;
    content: string;
    score: number;
    metadata: Record<string, unknown>;
  }>;
  tool_calls: Array<{
    tool_name: string;
    agent: string;
    input: Record<string, unknown>;
    output_preview: string;
    latency_ms: number;
    success: boolean;
  }>;
  trace: Array<{
    run_id: string;
    step: string;
    agent: string;
    message: string;
    timestamp: string;
    metadata: Record<string, unknown>;
  }>;
};

export const sampleAgentRun: AgentRunResponse = {
  run_id: "demo-run-9f42c1",
  session_id: "local-demo",
  question: "What is the current checkout launch status and risk?",
  answer:
    "Checkout launch is progressing with medium risk. Payment gateway work is in progress, observability is live, and the remaining launch concern is retry-safe payment handling plus one auth stability review.",
  report: {
    executive_summary:
      "Checkout launch is progressing, but should remain in medium-risk status until payment retry behavior and session refresh reliability pass one more staging validation. The most important active work is Stripe gateway integration, auth refresh reliability, and release-note source cleanup.",
    status: {
      summary: "Relevant ticket, chat, and project-doc evidence indicates the launch is moving but not ready for final sign-off.",
      active_work: [
        "PAY-231: Implement Stripe payment gateway - In Progress (Rahul)",
        "AUTH-118: Session refresh reliability - In Review (Isha)",
        "REL-077: Release notes automation - In Progress (Nora)",
      ],
      owners: ["Rahul", "Isha", "Nora"],
      confidence: 0.91,
    },
    risks: {
      risk_level: "medium",
      risks: [
        "Payment retry behavior needs one more staging pass.",
        "Session refresh instability can affect checkout conversion if AUTH-118 is not merged.",
      ],
      recommendations: [
        "Run a focused staging pass for webhook retry and idempotent order updates.",
        "Keep AUTH-118 visible in the launch-readiness review.",
        "Use source-backed release notes for leadership updates.",
      ],
    },
    next_steps: [
      "Validate Stripe retry behavior in staging.",
      "Review AUTH-118 regression tests.",
      "Generate a stakeholder report after the next sync.",
    ],
    generated_at: new Date().toISOString(),
  },
  sources: [
    {
      source: "tickets",
      title: "Implement Stripe payment gateway",
      content: "PAY-231 is in progress. Webhook verification is complete; retry-safe order updates remain under validation.",
      score: 0.94,
      metadata: { id: "PAY-231", owner: "Rahul", priority: "High" },
    },
    {
      source: "slack",
      title: "Payments channel update",
      content: "Rahul: Main launch risk is payment retry behavior. No blocker yet, but we need one more staging pass before release sign-off.",
      score: 0.9,
      metadata: { id: "slack-6" },
    },
    {
      source: "docs",
      title: "Project Phoenix Engineering Brief",
      content: "Release can proceed when payment intent creation, webhook verification, retry-safe order updates, and checkout session stability pass staging validation.",
      score: 0.87,
      metadata: { id: "project-phoenix-brief" },
    },
  ],
  tool_calls: [
    { tool_name: "project.search_tickets", agent: "status", input: { query: "checkout launch status" }, output_preview: "Found PAY-231, AUTH-118, REL-077", latency_ms: 18, success: true },
    { tool_name: "project.search_chat", agent: "risk", input: { query: "checkout risk blocker" }, output_preview: "Found payment retry and auth stability signals", latency_ms: 15, success: true },
    { tool_name: "project.search_docs", agent: "documentation", input: { query: "launch criteria" }, output_preview: "Found launch criteria and stakeholder template", latency_ms: 11, success: true },
  ],
  trace: [
    { run_id: "demo-run-9f42c1", step: "plan", agent: "supervisor", message: "Planned status, risk, and documentation workflow.", timestamp: new Date().toISOString(), metadata: {} },
    { run_id: "demo-run-9f42c1", step: "retrieve", agent: "status", message: "Retrieved ticket and document evidence.", timestamp: new Date().toISOString(), metadata: {} },
    { run_id: "demo-run-9f42c1", step: "rank_risks", agent: "risk", message: "Ranked launch risk signals as medium severity.", timestamp: new Date().toISOString(), metadata: {} },
    { run_id: "demo-run-9f42c1", step: "generate", agent: "documentation", message: "Generated structured source-backed report.", timestamp: new Date().toISOString(), metadata: {} },
  ],
};

export async function runAgent(question: string): Promise<AgentRunResponse> {
  const response = await fetch(`${API_BASE_URL}/agent/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, session_id: "sprintpilot-demo" }),
  });

  if (!response.ok) {
    throw new Error(`Agent run failed with status ${response.status}`);
  }

  return response.json();
}
