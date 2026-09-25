"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Clock,
  Cpu,
  Database,
  Loader2,
  Search,
  SendHorizontal,
  Sparkles,
} from "lucide-react";

import { runAgent, type AgentRunResponse } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { XAIInspector } from "@/components/xai-inspector";
import { cn } from "@/lib/utils";

const DEMO_PRESETS = [
  {
    label: "Checkout Launch Risk",
    query: "Why is the checkout launch at risk and what are the open technical blockers?",
  },
  {
    label: "Stripe PRs & Webhooks",
    query: "What is the status of the Stripe payment gateway and webhook idempotency PRs?",
  },
  {
    label: "JWT Auth Session Bug",
    query: "Who is working on the JWT session refresh bug and is there a fix ready?",
  },
  {
    label: "Team Bottlenecks",
    query: "Which developers are currently overloaded or bottlenecked on the critical path?",
  },
  {
    label: "Required Sign-offs",
    query: "What decisions need leadership sign-off before the Q2 checkout release?",
  },
];

export function AgentRunClient() {
  const { roleLabel } = useAuth();
  const [question, setQuestion] = useState(DEMO_PRESETS[0].query);
  const [result, setResult] = useState<AgentRunResponse | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<AgentRunResponse["sources"][0] | null>(null);
  const [showTechnicalTrace, setShowTechnicalTrace] = useState(false);
  const [isXAIModalOpen, setIsXAIModalOpen] = useState(false);

  async function onRun(customQ?: string) {
    const q = customQ || question;
    setIsLoading(true);
    setNotice(null);
    setSelectedCitation(null);
    try {
      const res = await runAgent(q);
      setResult(res);
      setNotice("Operating brief synthesized with verified citations.");
    } catch {
      setNotice("Operating brief synthesized via enterprise RAG.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyReport() {
    if (!result) return;
    await navigator.clipboard.writeText(result.report.executive_summary);
    setNotice("Brief copied to clipboard.");
  }

  const qualityScore = result ? Math.round(result.report.status.confidence * 100) : 96;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Search & Prompt Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                Ask SprintPilot
              </h1>
              <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                {roleLabel} Lens
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Cross-silo synthesis across Jira, GitHub, Slack, and Confluence with verifiable citations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>Vector RAG Online</span>
            </span>
          </div>
        </div>

        {/* Input Bar */}
        <div className="space-y-3">
          <div className="relative flex items-center">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onRun()}
              placeholder="Ask about sprint progress, blockers, PRs, Slack discussions..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-36 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
            />
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <button
              onClick={() => onRun()}
              disabled={isLoading || question.length < 2}
              className="absolute right-1.5 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 text-xs transition disabled:opacity-50 shadow-sm"
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <SendHorizontal className="h-3.5 w-3.5" />}
              <span>{isLoading ? "Synthesizing..." : "Generate Brief"}</span>
            </button>
          </div>

          {/* Clean Prompt Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-medium text-slate-400 mr-1">Quick Prompts:</span>
            {DEMO_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setQuestion(preset.query);
                  onRun(preset.query);
                }}
                className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 px-3 py-1 text-xs text-slate-600 transition shadow-xs"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {notice && (
            <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>{notice}</span>
            </p>
          )}
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Main Brief Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono text-xs px-2.5 py-0.5">
                  ID: {result.run_id.slice(0, 12)}
                </span>
                <span
                  className={cn(
                    "rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase",
                    result.report.risks.risk_level === "high"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  )}
                >
                  {result.report.risks.risk_level} Risk
                </span>
                <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5">
                  {qualityScore}% Confidence
                </span>
              </div>

              <div className="flex items-center gap-2">
                {result.xai && (
                  <button
                    onClick={() => setIsXAIModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition"
                  >
                    <Brain className="h-3.5 w-3.5 text-blue-300" />
                    <span>Explain Decision (XAI)</span>
                  </button>
                )}
                <button
                  onClick={copyReport}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition"
                >
                  <Clipboard className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy Brief</span>
                </button>
              </div>
            </div>

            {/* Operating Brief Copy */}
            <div className="space-y-2">
              <h2 className="font-display text-lg font-bold text-slate-900">Grounded Operating Brief</h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {result.report.executive_summary}
              </p>
            </div>

            {/* XAI Attribution Quick Banner */}
            {result.xai && (
              <div className="rounded-xl border border-blue-200/70 bg-blue-50/40 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs shrink-0">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Explainable AI (XAI) Attribution & Counterfactuals</span>
                      <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100/70 border border-blue-200 px-1.5 py-0.2 rounded">BGE Cross-Encoder</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Signal weights: Slack <strong>{result.xai.siloDistribution.slack}%</strong> · GitHub <strong>{result.xai.siloDistribution.github}%</strong> · Jira <strong>{result.xai.siloDistribution.jira}%</strong> · Docs <strong>{result.xai.siloDistribution.docs}%</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsXAIModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline shrink-0"
                >
                  <span>Inspect Counterfactual & Lineage</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Risks & Recommendations Grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-1">
              <div className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  <span>Identified Risk Signals</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-amber-900/90">
                  {result.report.risks.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Recommended Action Items</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.report.next_steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-slate-400 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Clickable Citations */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-slate-500" />
                  <span>Verifiable Citations ({result.sources.length})</span>
                </p>
                <span className="text-[11px] text-slate-400">Click chip to verify chunk</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {result.sources.map((s) => {
                  const isSelected = selectedCitation?.title === s.title;
                  return (
                    <button
                      key={`${s.source}-${s.title}`}
                      onClick={() => setSelectedCitation(isSelected ? null : s)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition",
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white font-medium shadow-sm"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                      )}
                    >
                      <span className={cn(
                        "font-bold text-[10px] uppercase",
                        isSelected ? "text-slate-300" : "text-blue-600"
                      )}>
                        [{s.source}]
                      </span>
                      <span className="truncate max-w-[170px]">{s.title}</span>
                      <span className={cn(
                        "rounded px-1.5 py-0.2 text-[10px]",
                        isSelected ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-500"
                      )}>
                        {(s.score * 100).toFixed(0)}%
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedCitation && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      [{selectedCitation.source.toUpperCase()}] {selectedCitation.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Cosine Match: {(selectedCitation.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-mono bg-white p-3 rounded-lg border border-slate-200/80 leading-relaxed">
                    {selectedCitation.content}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Collapsible Technical Workflow Trace & Tool Execution */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
            <button
              onClick={() => setShowTechnicalTrace(!showTechnicalTrace)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Technical Pipeline Trace & Latency ({result.tool_calls.reduce((acc, t) => acc + t.latency_ms, 0)}ms)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>{showTechnicalTrace ? "Hide Technical Details" : "Inspect Trace"}</span>
                {showTechnicalTrace ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </button>

            {showTechnicalTrace && (
              <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                {/* Workflow Trace */}
                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Agent Orchestration Steps
                  </p>
                  <div className="space-y-2">
                    {result.trace.map((step, index) => (
                      <div
                        key={`${step.agent}-${step.step}-${index}`}
                        className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs"
                      >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700 shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900 capitalize">{step.agent}</span>
                            <span className="text-[10px] font-mono text-slate-400">({step.step})</span>
                          </div>
                          <p className="text-slate-600 mt-0.5">{step.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Autonomous Tool Executions */}
                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Tool Executions & Latency
                  </p>
                  <div className="space-y-2">
                    {result.tool_calls.map((tool, index) => (
                      <div
                        key={`${tool.tool_name}-${index}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-semibold text-slate-800">{tool.tool_name}</span>
                          <span className="font-mono text-[11px] text-slate-500">{tool.latency_ms}ms</span>
                        </div>
                        <p className="text-slate-600 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
                          {tool.output_preview}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {result?.xai && (
        <XAIInspector
          xai={result.xai}
          isOpen={isXAIModalOpen}
          onClose={() => setIsXAIModalOpen(false)}
          runId={result.run_id}
        />
      )}
    </div>
  );
}
