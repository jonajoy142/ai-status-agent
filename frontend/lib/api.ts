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
  const agenticResponse = await fetch(`${API_BASE_URL}/agentic/run`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify({ query: question, role: currentRole(), workspace_id: currentWorkspaceId() }),
  });

  if (agenticResponse.ok) {
    return mapAgenticRun(await agenticResponse.json(), question);
  }

  const response = await fetch(`${API_BASE_URL}/agent/run`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify({ question, session_id: "sprintpilot-demo" }),
  });

  if (!response.ok) {
    throw new Error(`Agent run failed with status ${response.status}`);
  }

  return response.json();
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store", headers: authHeaders(), credentials: "include" });
  if (!response.ok) {
    throw new Error(`GET ${path} failed with status ${response.status}`);
  }
  return response.json();
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`POST ${path} failed with status ${response.status}`);
  }
  return response.json();
}

function authHeaders(): HeadersInit {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("sprintpilot.accessToken");
    if (token && token !== "demo-local-token") {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
}

function currentRole() {
  if (typeof window === "undefined") return "founder";
  const role = window.localStorage.getItem("sprintpilot.role");
  if (role === "product_manager") return "pm";
  if (role === "engineering_manager") return "em";
  if (role === "engineer") return "developer";
  return role || "founder";
}

function currentWorkspaceId() {
  if (typeof window === "undefined") return "demo-workspace";
  return window.localStorage.getItem("sprintpilot.workspaceId") || "demo-workspace";
}

function mapAgenticRun(payload: {
  run_id: string;
  state: {
    query: string;
    report_final?: string;
    report_draft?: string;
    report_structured?: {
      executive_summary?: string;
      action_items?: string[];
      confidence_score?: number;
    };
    status_summary?: Record<string, unknown>;
    risks_detected?: Array<Record<string, unknown>>;
    vector_results?: Array<Record<string, unknown>>;
    tool_calls_log?: Array<Record<string, unknown>>;
    agent_trace?: Array<Record<string, unknown>>;
    evaluation_result?: Record<string, unknown>;
  };
}, question: string): AgentRunResponse {
  const state = payload.state;
  const structured = state.report_structured || {};
  const risks = state.risks_detected || [];
  const highestRisk = risks.some((risk) => risk.severity === "critical") ? "high" : risks.some((risk) => risk.severity === "high") ? "high" : risks.length ? "medium" : "low";
  const confidence = typeof structured.confidence_score === "number" ? structured.confidence_score : 0.82;

  return {
    run_id: payload.run_id,
    session_id: "agentic-graph",
    question,
    answer: state.report_final || structured.executive_summary || state.report_draft || "SprintPilot generated an agentic execution brief.",
    report: {
      executive_summary: structured.executive_summary || state.report_draft || "Execution brief generated from agentic workflow.",
      status: {
        summary: `Sprint health: ${String(state.status_summary?.completion_pct || 42)}% complete. Dynamic supervisor plan executed with ${state.tool_calls_log?.length || 0} tool calls.`,
        active_work: risks.slice(0, 3).map((risk) => String(risk.title || risk.type || "Execution risk")),
        owners: Array.from(new Set(risks.map((risk) => String(risk.owner || "Unknown")))),
        confidence,
      },
      risks: {
        risk_level: highestRisk as "low" | "medium" | "high",
        risks: risks.map((risk) => String(risk.title || risk.type || "Risk detected")),
        recommendations: structured.action_items || [],
      },
      next_steps: structured.action_items || [],
      generated_at: new Date().toISOString(),
    },
    sources: (state.vector_results || []).map((source, index) => {
      const metadata = asRecord(source.metadata);
      return {
        source: String(source.source || metadata.source || "retrieval"),
        title: String(source.title || metadata.title || `Source ${index + 1}`),
        content: String(source.content || ""),
        score: Number(source.score || source.relevance_score || 0.8),
        metadata,
      };
    }),
    tool_calls: (state.tool_calls_log || []).map((tool) => ({
      tool_name: String(tool.tool || "tool"),
      agent: String(tool.agent || "agent"),
      input: (tool.params || {}) as Record<string, unknown>,
      output_preview: String(tool.result_summary || ""),
      latency_ms: 0,
      success: true,
    })),
    trace: (state.agent_trace || []).map((step, index) => ({
      run_id: payload.run_id,
      step: String(step.agent || `step-${index + 1}`),
      agent: String(step.agent || "agent"),
      message: String(step.message || "Agent step completed."),
      timestamp: String(step.timestamp || new Date().toISOString()),
      metadata: (step.metadata || {}) as Record<string, unknown>,
    })),
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export type WorkItemDto = {
  id: string;
  external_id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  sprint: string;
  source: string;
  risk_level: "low" | "medium" | "high" | "critical";
  stale_score: number;
  business_impact: string;
  suggested_next_action: string;
};

export type RiskDto = {
  id: string;
  title: string;
  level: "low" | "medium" | "high" | "critical";
  owner: string;
  business_impact: string;
  recommended_action: string;
};

export type DecisionDto = {
  id: string;
  title: string;
  owner: string;
  due_date: string;
  impact_if_delayed: string;
};

export type ReportDto = {
  id: string;
  type: string;
  title: string;
  summary: string;
  confidence_score: number;
  shipped_work: string[];
  blocked_work: string[];
  risks: string[];
  decisions_needed: string[];
  action_items: string[];
  citations: string[];
};

export type ConnectorDto = {
  id: string;
  name: string;
  status: string;
  auth_type: string;
  last_synced_at?: string | null;
  scopes: string[];
  env_vars: string[];
};

export type DashboardDto = {
  role: string;
  headline: string;
  sprint_health: number;
  open_risks: number;
  blocked_work: number;
  decisions_needed: number;
  business_impact: string;
  weekly_brief_preview: string;
  suggested_next_actions: string[];
  latest_changes: string[];
  owner_workload: Record<string, number>;
};
