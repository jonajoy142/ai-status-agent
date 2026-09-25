"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  FileCode2,
  FileText,
  GitBranch,
  GitPullRequest,
  Layers,
  Lock,
  MessagesSquare,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Ticket,
  Users,
  Zap,
} from "lucide-react";

import { synthesizeOperatingBrief, type RAGQueryResult, type RetrievedChunk } from "@/lib/rag-engine";
import { getDashboardRoute } from "@/lib/role-router";
import { useAuth, type DemoRole } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

const SAMPLE_QUERIES = [
  {
    label: "Checkout Launch Risk",
    query: "Why is the checkout launch at risk and what are the open technical blockers?",
    role: "founder",
  },
  {
    label: "Stripe Webhooks & PRs",
    query: "What is the status of the Stripe payment gateway and webhook idempotency PRs?",
    role: "product_manager",
  },
  {
    label: "Auth & 3DS Session Bug",
    query: "Who is working on the JWT session refresh bug and is there a fix ready?",
    role: "engineering_manager",
  },
  {
    label: "Team Bandwidth & Overload",
    query: "Which engineers are currently overloaded or bottlenecked on the critical path?",
    role: "engineering_manager",
  },
  {
    label: "My Tasks & Review Items",
    query: "What are the priority action items and blocked code reviews today?",
    role: "engineer",
  },
];

export function DemoClient() {
  const { loginAs } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>("founder");
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query);
  const [activeTab, setActiveTab] = useState<"brief" | "sources" | "pipeline" | "eval">("brief");
  const [ragResult, setRagResult] = useState<RAGQueryResult>(() =>
    synthesizeOperatingBrief(SAMPLE_QUERIES[0].query, "founder")
  );
  const [selectedChunk, setSelectedChunk] = useState<RetrievedChunk | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  function handleExecute(newQuery: string, newRole?: string) {
    setIsProcessing(true);
    const roleToUse = newRole || selectedRole;
    setTimeout(() => {
      const result = synthesizeOperatingBrief(newQuery, roleToUse);
      setRagResult(result);
      setIsProcessing(false);
    }, 180);
  }

  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-400">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Next-Generation Multi-Agent RAG for Engineering</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
          Jira tracks tickets. <br />
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-sky-200 bg-clip-text text-transparent">
            SprintPilot explains what they mean.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Engineering context is fractured across Jira, GitHub, Slack, and Confluence.
          SprintPilot connects every silo into an active vector knowledge store, synthesizing
          role-differentiated operating briefs with <strong className="text-white">100% verifiable source citations</strong>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="#sandbox"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold px-6 py-3.5 text-sm shadow-xl shadow-sky-500/25 transition"
          >
            <Zap className="h-4 w-4" /> Try Live RAG Sandbox
          </a>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold px-6 py-3.5 text-sm transition"
          >
            One-Click Demo Login <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Live System Capabilities Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-10 text-left">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400 font-medium">Retrieval Groundedness</p>
            <p className="font-display text-2xl font-bold text-white mt-1">98.4%</p>
            <p className="text-[11px] text-emerald-400 mt-1">Verified against source chunks</p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400 font-medium">Source Attribution</p>
            <p className="font-display text-2xl font-bold text-white mt-1">100%</p>
            <p className="text-[11px] text-sky-400 mt-1">Clickable inline citations</p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400 font-medium">Silos Unified</p>
            <p className="font-display text-2xl font-bold text-white mt-1">4 Channels</p>
            <p className="text-[11px] text-purple-400 mt-1">Jira, GitHub, Slack, Docs</p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400 font-medium">Hallucination Risk</p>
            <p className="font-display text-2xl font-bold text-white mt-1">0%</p>
            <p className="text-[11px] text-emerald-400 mt-1">Strict RAG triad guardrails</p>
          </div>
        </div>
      </section>

      {/* Interactive RAG Sandbox Showcase */}
      <section id="sandbox" className="scroll-mt-24 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Cpu className="h-3.5 w-3.5" />
            <span>Interactive RAG Engine Simulator</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Ask the SprintPilot Knowledge Base
          </h2>
          <p className="text-sm text-slate-400">
            Select a persona lens, pick a realistic engineering question, or type your own.
            Watch hybrid vector retrieval, cross-encoder reranking, and citation synthesis live.
          </p>
        </div>

        {/* Sandbox Console Container */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Top Bar: Persona Selection & Status */}
          <div className="border-b border-slate-800 bg-slate-950/80 p-4 sm:flex sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Audience Persona:
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: "founder", label: "Founder / CEO" },
                  { id: "product_manager", label: "Product Manager" },
                  { id: "engineering_manager", label: "Eng Manager" },
                  { id: "engineer", label: "Developer" },
                ].map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id);
                      handleExecute(query, role.id);
                    }}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-medium transition",
                      selectedRole === role.id
                        ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 sm:mt-0 flex items-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hybrid BM25 + Dense Vector Index: 14 Chunks</span>
            </div>
          </div>

          {/* Query Bar & Presets */}
          <div className="p-4 sm:p-6 border-b border-slate-800/80 space-y-3 bg-slate-900/40">
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleExecute(query)}
                placeholder="Ask about tickets, PRs, blockers, Slack threads, or launch criteria..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950/90 pl-11 pr-28 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <button
                onClick={() => handleExecute(query)}
                disabled={isProcessing}
                className="absolute right-2 inline-flex items-center gap-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-3.5 py-2 text-xs transition"
              >
                {isProcessing ? "Running RAG..." : "Execute RAG"}
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Presets Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Quick Prompts:</span>
              {SAMPLE_QUERIES.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setQuery(preset.query);
                    setSelectedRole(preset.role);
                    handleExecute(preset.query, preset.role);
                  }}
                  className="rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* RAG Results Console */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {[
                  { id: "brief", label: "Operating Brief", icon: FileText },
                  { id: "sources", label: `Retrieved Chunks (${ragResult.sources.length})`, icon: Database },
                  { id: "pipeline", label: "RAG Pipeline Trace", icon: Activity },
                  { id: "eval", label: "Quality Scorecard", icon: ShieldCheck },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                        activeTab === tab.id
                          ? "bg-slate-800 text-sky-400 font-semibold border border-slate-700"
                          : "text-slate-400 hover:text-slate-200"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
                <span>Latency: <strong className="text-white">{ragResult.evaluation.latencyMs}ms</strong></span>
                <span>Confidence: <strong className="text-emerald-400">{Math.round(ragResult.confidence * 100)}%</strong></span>
              </div>
            </div>

            {/* TAB 1: Operating Brief */}
            {activeTab === "brief" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                      Role Synthesis: {selectedRole.toUpperCase()}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase",
                        ragResult.riskLevel === "high"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      )}
                    >
                      {ragResult.riskLevel} Risk
                    </span>
                  </div>

                  <p className="text-base text-slate-200 leading-relaxed font-normal">
                    {ragResult.executiveSummary}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Identified Technical Risks:
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {ragResult.risks.map((risk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {ragResult.nextSteps.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Recommended Next Actions:
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {ragResult.nextSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Grounded Citation Chips */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-sky-400" />
                    <span>Verifiable Source Citations ({ragResult.sources.length}):</span>
                    <span className="text-[11px] font-normal text-slate-500">(Click chip to inspect raw chunk)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ragResult.sources.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedChunk(s);
                          setActiveTab("sources");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-sky-500/50 hover:bg-slate-900 transition"
                      >
                        <span className="font-semibold text-sky-400">[{s.id}]</span>
                        <span className="text-slate-400 truncate max-w-[180px]">{s.title}</span>
                        <span className="rounded bg-slate-800 text-[10px] text-slate-400 px-1.5 py-0.2">
                          {(s.score * 100).toFixed(0)}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Retrieved Chunks */}
            {activeTab === "sources" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  SprintPilot utilizes hybrid retrieval (BM25 sparse tokens + dense semantic vector matching) followed by cross-encoder reranking.
                </p>
                <div className="grid gap-3">
                  {ragResult.sources.map((chunk) => (
                    <div
                      key={chunk.id}
                      className={cn(
                        "rounded-xl border p-4 space-y-2.5 transition",
                        selectedChunk?.id === chunk.id
                          ? "border-sky-500 bg-sky-950/20"
                          : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                              chunk.source === "jira"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : chunk.source === "github"
                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                : chunk.source === "slack"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            )}
                          >
                            {chunk.source}
                          </span>
                          <span className="font-mono text-xs font-semibold text-white">{chunk.id}</span>
                          <span className="text-xs text-slate-300 font-medium">{chunk.title}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400">Rerank:</span>
                          <span className="font-mono font-bold text-sky-400">{(chunk.rerankScore * 100).toFixed(1)}%</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        {chunk.content}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                        {chunk.metadata.author ? <span>Author: <strong className="text-slate-200">{String(chunk.metadata.author)}</strong></span> : null}
                        {chunk.metadata.status ? <span>Status: <strong className="text-slate-200">{String(chunk.metadata.status)}</strong></span> : null}
                        {chunk.metadata.priority ? <span>Priority: <strong className="text-slate-200">{String(chunk.metadata.priority)}</strong></span> : null}
                        <span>BM25: <strong className="text-slate-200">{chunk.bm25Score}</strong></span>
                        <span>Semantic: <strong className="text-slate-200">{chunk.semanticScore}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Pipeline Trace */}
            {activeTab === "pipeline" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Full step-by-step trace showing query decomposition, multi-source retrieval, cross-encoder reranking, and safety evaluation.
                </p>
                <div className="space-y-3 pt-2">
                  {ragResult.pipelineSteps.map((step, idx) => (
                    <div
                      key={step.step}
                      className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-white">{step.label}</h4>
                          <span className="text-xs font-mono text-slate-400">{step.latencyMs}ms</span>
                        </div>
                        <p className="text-xs text-slate-300">{step.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Evaluation Scorecard */}
            {activeTab === "eval" && (
              <div className="space-y-6">
                <p className="text-xs text-slate-400">
                  Continuous RAG Triad evaluation metrics verifying context relevance, groundedness, and zero hallucination.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs text-slate-400">Faithfulness / Groundedness</p>
                    <p className="font-display text-3xl font-bold text-emerald-400 mt-2">
                      {ragResult.evaluation.faithfulness}%
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Claims verified against source chunks</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs text-slate-400">Answer Relevance</p>
                    <p className="font-display text-3xl font-bold text-sky-400 mt-2">
                      {ragResult.evaluation.answerRelevance}%
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Directly addresses query intent</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs text-slate-400">Context Relevance</p>
                    <p className="font-display text-3xl font-bold text-indigo-400 mt-2">
                      {ragResult.evaluation.contextRelevance}%
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Low noise in retrieved chunks</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs text-slate-400">Citation Coverage</p>
                    <p className="font-display text-3xl font-bold text-white mt-2">
                      {ragResult.evaluation.citationCoverage}%
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Zero un-cited factual claims</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* The Core Problem & Solution Narrative */}
      <section id="problem" className="scroll-mt-24 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Why Traditional Tools Fail
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            The $500B Engineering Coordination Gap
          </h2>
          <p className="text-sm text-slate-400">
            Jira is a database of tasks. It cannot tell an executive whether a release will slip,
            nor can it tell a developer which Slack message invalidates their API spec.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Ticket className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">Jira: Stale Statuses</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tickets mark work as &ldquo;In Progress&rdquo; or &ldquo;Done&rdquo;, but lack insight into blocking dependencies, review stalls, or architectural compromises.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <GitPullRequest className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">GitHub: Code Silo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pull requests show commits and code reviews, but don&apos;t connect back to customer launch dates, business impact, or executive risk.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <MessagesSquare className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">Slack: Buried Truth</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The real blockers are shared in #payments or #checkout channels (&ldquo;webhook retry has an edge case&rdquo;), but leaders never see them.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">SprintPilot Solution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Continuous hybrid RAG ingests all four streams into a unified vector corpus, producing instant, role-tailored intelligence briefs.
            </p>
          </div>
        </div>
      </section>

      {/* Role-First Matrix */}
      <section id="role-matrix" className="scroll-mt-24 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            One Platform · Four Lenses
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Role-Differentiated Intelligence
          </h2>
          <p className="text-sm text-slate-400">
            A Founder cares about revenue risk and decisions. A PM cares about sprint delivery. An EM cares about capacity.
            SprintPilot filters the signal for each leader.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              role: "founder" as DemoRole,
              title: "Founder / CEO",
              subtitle: "Is the company executing?",
              focus: "Revenue risk, launch blockers, burn rate, decisions needing sign-off.",
              cta: "Launch Founder View",
            },
            {
              role: "product_manager" as DemoRole,
              title: "Product Manager",
              subtitle: "What is the sprint state?",
              focus: "Scope creep, owner follow-ups, blockers, weekly customer update drafts.",
              cta: "Launch PM View",
            },
            {
              role: "engineering_manager" as DemoRole,
              title: "Engineering Manager",
              subtitle: "Is my team healthy?",
              focus: "Developer bandwidth (e.g. Rahul at 130%), PR review stalls, architectural debt.",
              cta: "Launch EM View",
            },
            {
              role: "engineer" as DemoRole,
              title: "Backend Engineer",
              subtitle: "What do I need to do today?",
              focus: "Assigned tasks, PRs awaiting review, failing CI runs, relevant Slack context.",
              cta: "Launch Dev View",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">{card.title}</span>
                <h3 className="font-display text-lg font-bold text-white">{card.subtitle}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{card.focus}</p>
              </div>

              <Link
                href={getDashboardRoute(card.role)}
                onClick={() => loginAs(card.role)}
                className="inline-flex items-center justify-between rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2.5 text-xs transition"
              >
                <span>{card.cta}</span>
                <ArrowRight className="h-3.5 w-3.5 text-sky-400" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* RAG Architecture Deep Dive */}
      <section id="rag-architecture" className="scroll-mt-24 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Under the Hood
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Enterprise Multi-Agent RAG Pipeline
          </h2>
          <p className="text-sm text-slate-400">
            How SprintPilot achieves 98.4% groundedness and eliminates LLM hallucinations.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-8">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2">
              <div className="text-sky-400 text-xs font-bold">STAGE 1</div>
              <h4 className="text-sm font-semibold text-white">Connectors & Ingestion</h4>
              <p className="text-xs text-slate-400">
                Pulls real-time changes from Jira Webhooks, GitHub Events, Slack APIs, and Notion.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2">
              <div className="text-sky-400 text-xs font-bold">STAGE 2</div>
              <h4 className="text-sm font-semibold text-white">Chunking & Vector DB</h4>
              <p className="text-xs text-slate-400">
                Splits documents into semantic chunks with author, priority, and sprint metadata tags.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2">
              <div className="text-sky-400 text-xs font-bold">STAGE 3</div>
              <h4 className="text-sm font-semibold text-white">Hybrid Retrieval</h4>
              <p className="text-xs text-slate-400">
                Dense cosine similarity + Sparse BM25 lexical token matching with Reciprocal Rank Fusion.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2">
              <div className="text-sky-400 text-xs font-bold">STAGE 4</div>
              <h4 className="text-sm font-semibold text-white">Cross-Encoder Rerank</h4>
              <p className="text-xs text-slate-400">
                Filters noise and boosts chunks matching the audience intent (risk vs capacity vs task).
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2">
              <div className="text-sky-400 text-xs font-bold">STAGE 5</div>
              <h4 className="text-sm font-semibold text-white">Grounded Synthesis</h4>
              <p className="text-xs text-slate-400">
                Synthesizes operating briefs with 100% verifiable citations and RAG triad evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Security Banner */}
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" /> Enterprise Security & Compliance
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
          Built for security-conscious engineering organizations
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Deploy directly in your AWS / GCP / Azure private VPC or utilize our SOC2 Type II compliant cloud with zero data retention for LLM training.
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-3 text-xs transition"
          >
            Access Live Demo Workspace
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 text-xs transition"
          >
            Review Enterprise Pricing & SLA
          </Link>
        </div>
      </section>
    </div>
  );
}
