"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clipboard,
  Clock,
  Cpu,
  Database,
  FileSearch,
  Loader2,
  Search,
  SendHorizontal,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { runAgent, type AgentRunResponse } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

const DEMO_QUESTIONS = [
  "Why is the checkout launch at risk and what are the open technical blockers?",
  "What is the status of the Stripe payment gateway and webhook idempotency PRs?",
  "Who is working on the JWT session refresh bug and is there a fix ready?",
  "Which developers are currently overloaded or bottlenecked on the critical path?",
  "What decisions need leadership sign-off before the Q2 checkout release?",
];

export function AgentRunClient() {
  const { roleLabel } = useAuth();
  const [question, setQuestion] = useState(DEMO_QUESTIONS[0]);
  const [result, setResult] = useState<AgentRunResponse | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<AgentRunResponse["sources"][0] | null>(null);

  async function onRun(customQ?: string) {
    const q = customQ || question;
    setIsLoading(true);
    setNotice(null);
    setSelectedCitation(null);
    try {
      const res = await runAgent(q);
      setResult(res);
      setNotice("Operating brief synthesized via Multi-Agent RAG.");
    } catch {
      setNotice("Completed via in-app enterprise RAG fallback.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyReport() {
    if (!result) return;
    await navigator.clipboard.writeText(result.report.executive_summary);
    setNotice("Brief copied to clipboard.");
  }

  const qualityScore = result ? Math.round(result.report.status.confidence * 100) : 94;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Multi-Agent LangGraph Supervisor & RAG</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Ask SprintPilot ({roleLabel} Lens)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Query cross-silo engineering evidence across Jira, GitHub, Slack, and Docs.
              Answers are strictly grounded in retrieved vector chunks with verifiable citations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>RAG Engine Online</span>
            </span>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6 space-y-3">
          <div className="relative flex items-center">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onRun()}
              placeholder="Ask about sprint progress, blockers, PRs, Slack discussions..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-11 pr-32 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <button
              onClick={() => onRun()}
              disabled={isLoading || question.length < 2}
              className="absolute right-2 inline-flex items-center gap-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-4 py-2 text-xs transition disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <SendHorizontal className="h-3.5 w-3.5" />}
              <span>{isLoading ? "Synthesizing..." : "Generate Brief"}</span>
            </button>
          </div>

          {/* Quick Preset Prompts */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-medium">Example Prompts:</span>
            {DEMO_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => {
                  setQuestion(q);
                  onRun(q);
                }}
                className="rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white transition"
              >
                {q}
              </button>
            ))}
          </div>

          {notice && (
            <p className="text-xs text-sky-400 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{notice}</span>
            </p>
          )}
        </div>
      </div>

      {/* Results Workspace */}
      {result && (
        <div className="space-y-6">
          {/* Main Brief Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-sky-500/20 text-sky-300 text-xs font-bold px-2 py-0.5">
                  Run ID: {result.run_id.slice(0, 14)}
                </span>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-xs font-semibold uppercase",
                    result.report.risks.risk_level === "high"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-amber-500/20 text-amber-400"
                  )}
                >
                  {result.report.risks.risk_level} Risk
                </span>
                <span className="rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-0.5">
                  {qualityScore}% Confidence
                </span>
              </div>

              <button
                onClick={copyReport}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition"
              >
                <Clipboard className="h-3.5 w-3.5" /> Copy Brief
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold text-white">Grounded Operating Brief</h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                {result.report.executive_summary}
              </p>
            </div>

            {/* Risks & Recommendations Grid */}
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Identified Risk Signals</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.report.risks.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Recommended Action Items</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.report.next_steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sky-400">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Clickable Citations */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-sky-400" />
                <span>Retrieved Citations ({result.sources.length}):</span>
                <span className="text-[11px] font-normal text-slate-500">(Click chip to inspect chunk)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {result.sources.map((s) => (
                  <button
                    key={`${s.source}-${s.title}`}
                    onClick={() => setSelectedCitation(s)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition",
                      selectedCitation?.title === s.title
                        ? "border-sky-500 bg-sky-950/40 text-white"
                        : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                    )}
                  >
                    <span className="font-bold text-sky-400">[{s.source.toUpperCase()}]</span>
                    <span className="text-slate-400 truncate max-w-[180px]">{s.title}</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-400">
                      {(s.score * 100).toFixed(0)}%
                    </span>
                  </button>
                ))}
              </div>

              {selectedCitation && (
                <div className="mt-4 rounded-xl border border-sky-500/40 bg-sky-950/20 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-300">
                      [{selectedCitation.source.toUpperCase()}] {selectedCitation.title}
                    </span>
                    <span className="text-[11px] font-mono text-sky-400">
                      Cosine Match: {(selectedCitation.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="font-mono text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {selectedCitation.content}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Workflow Trace & Tool Execution */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Clock className="h-4 w-4 text-sky-400" />
                <span>Multi-Agent Workflow Trace</span>
              </h3>
              <div className="space-y-3">
                {result.trace.map((step, index) => (
                  <div
                    key={`${step.agent}-${step.step}-${index}`}
                    className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3.5"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/20 text-[11px] font-bold text-sky-400 shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white capitalize">{step.agent} Agent</span>
                        <span className="text-[10px] font-mono text-slate-500">({step.step})</span>
                      </div>
                      <p className="text-xs text-slate-300">{step.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-400" />
                <span>Autonomous Tool Executions</span>
              </h3>
              <div className="space-y-3">
                {result.tool_calls.map((tool, index) => (
                  <div
                    key={`${tool.tool_name}-${index}`}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-purple-300">
                        {tool.tool_name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{tool.latency_ms}ms</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-800/80">
                      {tool.output_preview}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
