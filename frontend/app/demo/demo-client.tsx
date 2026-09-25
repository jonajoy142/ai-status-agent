"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  ExternalLink,
  FileCode2,
  FileText,
  GitBranch,
  GitPullRequest,
  Layers,
  Lightbulb,
  Lock,
  MessagesSquare,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Ticket,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { synthesizeOperatingBrief, type RAGQueryResult, type RetrievedChunk } from "@/lib/rag-engine";
import { getDashboardRoute } from "@/lib/role-router";
import { useAuth, type DemoRole } from "@/components/auth-provider";
import { XAIInspector } from "@/components/xai-inspector";
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
    label: "Auth Session Bug",
    query: "Who is working on the JWT session refresh bug and is there a fix ready?",
    role: "engineering_manager",
  },
  {
    label: "Team Capacity & Overload",
    query: "Which engineers are currently overloaded or bottlenecked on the critical path?",
    role: "engineering_manager",
  },
  {
    label: "Priority Actions Today",
    query: "What are the priority action items and blocked code reviews today?",
    role: "engineer",
  },
];

export function DemoClient() {
  const { loginAs } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>("founder");
  const [query, setQuery] = useState(SAMPLE_QUERIES[0].query);
  const [activeTab, setActiveTab] = useState<"brief" | "xai" | "sources" | "pipeline" | "eval">("brief");
  const [ragResult, setRagResult] = useState<RAGQueryResult>(() =>
    synthesizeOperatingBrief(SAMPLE_QUERIES[0].query, "founder")
  );
  const [selectedChunk, setSelectedChunk] = useState<RetrievedChunk | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isXAIModalOpen, setIsXAIModalOpen] = useState(false);
  const [simulatedActive, setSimulatedActive] = useState(false);

  function handleExecute(newQuery: string, newRole?: string) {
    setIsProcessing(true);
    const roleToUse = newRole || selectedRole;
    setTimeout(() => {
      const result = synthesizeOperatingBrief(newQuery, roleToUse);
      setRagResult(result);
      setIsProcessing(false);
    }, 120);
  }

  return (
    <div className="space-y-20 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Continuous Engineering Intelligence</span>
          </div>
          <button
            onClick={() => setIsXAIModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 hover:bg-blue-100 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-xs transition"
          >
            <Brain className="h-3.5 w-3.5 text-blue-600" />
            <span>Explainable AI (XAI) Engine Active</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
          Jira tracks work. <br />
          <span className="text-blue-600">
            SprintPilot explains what it means, what it costs, and the business advantage.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Engineering context is fractured across Jira, GitHub, Slack, and Confluence.
          SprintPilot connects every silo into an active vector knowledge store, synthesizing
          role-differentiated operating briefs with <strong className="text-slate-900 font-semibold">verifiable citations</strong>.
        </p>

        {/* The Executive Dilemma & Solution Highlight Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 text-left max-w-2xl mx-auto space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-600" />
              <span>The Engineering Leadership Dilemma</span>
            </span>
            <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-0.5">
              8–12 hrs/week lost
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Engineering leaders waste <strong className="text-slate-900">8–12 hours a week</strong> chasing updates in standups and Slack DMs to answer three questions:
          </p>

          <div className="grid sm:grid-cols-3 gap-2.5 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-0.5">
              <span className="text-slate-900 font-bold block">1. Launch Schedule</span>
              <p className="text-slate-500">Are we on track for the target launch date?</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-0.5">
              <span className="text-slate-900 font-bold block">2. Bottlenecks</span>
              <p className="text-slate-500">What is blocked and who is bottlenecked?</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-0.5">
              <span className="text-slate-900 font-bold block">3. Sign-offs</span>
              <p className="text-slate-500">What decisions need executive sign-off?</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-700 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <span className="leading-relaxed">
              <strong className="text-slate-900 font-semibold">SprintPilot Solution:</strong> Continuous hybrid RAG ingests all four sources into an active vector corpus. A multi-agent supervisor synthesizes role-differentiated operating briefs where every claim is grounded in clickable citations.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#sandbox"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-3 text-xs shadow-sm transition"
          >
            <Zap className="h-4 w-4" /> Try Live RAG Sandbox
          </a>
          <button
            onClick={() => setIsXAIModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-300 bg-blue-50/90 hover:bg-blue-100 text-blue-800 font-semibold px-5 py-3 text-xs shadow-xs transition"
          >
            <Brain className="h-4 w-4 text-blue-600" />
            <span>Inspect Explainable AI (XAI)</span>
          </button>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium px-5 py-3 text-xs shadow-xs transition"
          >
            One-Click Demo Login <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>

        {/* Live System Capabilities Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 text-left">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <p className="text-xs text-slate-500 font-medium">Retrieval Groundedness</p>
            <p className="font-display text-2xl font-bold text-slate-900 mt-1">98.4%</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Verified against chunks</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <p className="text-xs text-slate-500 font-medium">Source Attribution</p>
            <p className="font-display text-2xl font-bold text-slate-900 mt-1">100%</p>
            <p className="text-[11px] text-blue-600 mt-0.5">Clickable inline citations</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <p className="text-xs text-slate-500 font-medium">Silos Unified</p>
            <p className="font-display text-2xl font-bold text-slate-900 mt-1">4 Sources</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Jira, GitHub, Slack, Docs</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <p className="text-xs text-slate-500 font-medium">Explainable AI (XAI)</p>
            <p className="font-display text-2xl font-bold text-blue-700 mt-1">100%</p>
            <p className="text-[11px] text-blue-600 mt-0.5">BGE Cross-Encoder weights</p>
          </div>
        </div>
      </section>

      {/* Interactive RAG Sandbox Showcase */}
      <section id="sandbox" className="scroll-mt-24 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Interactive RAG Sandbox
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Select a role lens and pick a query to test hybrid BM25 + dense retrieval and citation synthesis.
          </p>
        </div>

        {/* Sandbox Console Container */}
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
          {/* Top Bar: Persona Selection */}
          <div className="border-b border-slate-100 bg-slate-50/70 p-4 sm:flex sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Audience Lens:
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
                        ? "bg-slate-900 text-white font-semibold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    )}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2 sm:mt-0 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>Hybrid Corpus: 14 Active Chunks</span>
            </div>
          </div>

          {/* Query Bar & Presets */}
          <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3 bg-white">
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleExecute(query)}
                placeholder="Ask about tickets, PRs, blockers, Slack threads, or launch criteria..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-28 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
              />
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <button
                onClick={() => handleExecute(query)}
                disabled={isProcessing}
                className="absolute right-1.5 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 py-1.5 text-xs transition shadow-xs"
              >
                {isProcessing ? "Running..." : "Query"}
                <Send className="h-3 w-3" />
              </button>
            </div>

            {/* Presets Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Quick Prompts:</span>
              {SAMPLE_QUERIES.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setQuery(preset.query);
                    setSelectedRole(preset.role);
                    handleExecute(preset.query, preset.role);
                  }}
                  className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 text-xs text-slate-600 transition shadow-xs"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* RAG Results Tabs */}
          <div className="p-4 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                {[
                  { id: "brief", label: "Operating Brief", icon: FileText },
                  { id: "xai", label: "Explainability & XAI", icon: Brain },
                  { id: "sources", label: `Retrieved Chunks (${ragResult.sources.length})`, icon: Database },
                  { id: "pipeline", label: "Pipeline Trace", icon: Activity },
                  { id: "eval", label: "Quality Scorecard", icon: ShieldCheck },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                        isActive
                          ? "bg-slate-900 text-white shadow-xs font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
                <span>Latency: <strong className="text-slate-900 font-medium">{ragResult.evaluation.latencyMs}ms</strong></span>
                <span>Confidence: <strong className="text-emerald-700 font-semibold">{Math.round(ragResult.confidence * 100)}%</strong></span>
              </div>
            </div>

            {/* TAB 1: Operating Brief */}
            {activeTab === "brief" && (
              <div className="space-y-5">
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Lens: {selectedRole.toUpperCase()}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase",
                        ragResult.riskLevel === "high"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      )}
                    >
                      {ragResult.riskLevel} Risk
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                    {ragResult.executiveSummary}
                  </p>

                  <div className="pt-2 border-t border-slate-200/80">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Identified Risk Signals:
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {ragResult.risks.map((risk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {ragResult.nextSteps.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/80">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Recommended Next Actions:
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {ragResult.nextSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Explainable AI (XAI) Attribution Bar */}
                <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs shrink-0">
                      <Brain className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Explainable AI (XAI) Attribution</span>
                        <span className="rounded bg-blue-100 text-blue-700 font-mono text-[10px] font-bold px-1.5 py-0.2 border border-blue-200">
                          BGE Cross-Encoder
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Attribution weights: Slack <strong>{ragResult.xai.siloDistribution.slack}%</strong> · GitHub <strong>{ragResult.xai.siloDistribution.github}%</strong> · Jira <strong>{ragResult.xai.siloDistribution.jira}%</strong> · Docs <strong>{ragResult.xai.siloDistribution.docs}%</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActiveTab("xai")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold px-3 py-1.5 text-xs shadow-xs transition"
                    >
                      <span>Inspect Attribution</span>
                      <ArrowRight className="h-3 w-3 text-slate-500" />
                    </button>
                    <button
                      onClick={() => setIsXAIModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 text-xs shadow-xs transition"
                    >
                      <Sparkles className="h-3 w-3 text-blue-300" />
                      <span>Launch XAI Studio</span>
                    </button>
                  </div>
                </div>

                {/* Grounded Citation Chips */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-slate-400" />
                    <span>Verifiable Source Citations ({ragResult.sources.length}):</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ragResult.sources.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedChunk(s);
                          setActiveTab("sources");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 text-xs text-slate-700 shadow-xs transition"
                      >
                        <span className="font-semibold text-blue-600">[{s.id}]</span>
                        <span className="text-slate-600 truncate max-w-[170px]">{s.title}</span>
                        <span className="rounded bg-slate-100 text-[10px] text-slate-500 px-1.5 py-0.2">
                          {(s.score * 100).toFixed(0)}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB XAI: Explainable AI & Attribution */}
            {activeTab === "xai" && (
              <div className="space-y-6">
                {/* Header & Launch Studio Action */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-sm font-bold text-slate-900">
                        Signal Attribution & Causal Reasoning Architecture
                      </h3>
                      <span className="rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold px-2 py-0.5 border border-blue-200">
                        BGE Cross-Encoder
                      </span>
                      <span className="rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                        EU AI Act Tier-1 Compliant
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mathematical cross-attention decomposition and contrastive counterfactual simulation.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsXAIModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3.5 py-1.5 text-xs shadow-xs transition shrink-0"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-blue-300" />
                    <span>Open Full XAI Inspector Modal</span>
                  </button>
                </div>

                {/* Cross-Attention Silo Attribution Bar */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Cross-Silo Signal Attribution Weight
                    </span>
                    <span className="text-xs font-mono text-slate-400">Sum = 100%</span>
                  </div>

                  <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      style={{ width: `${ragResult.xai.siloDistribution.slack}%` }}
                      className="bg-amber-500 transition-all duration-500"
                    />
                    <div
                      style={{ width: `${ragResult.xai.siloDistribution.github}%` }}
                      className="bg-purple-600 transition-all duration-500"
                    />
                    <div
                      style={{ width: `${ragResult.xai.siloDistribution.jira}%` }}
                      className="bg-blue-600 transition-all duration-500"
                    />
                    <div
                      style={{ width: `${ragResult.xai.siloDistribution.docs}%` }}
                      className="bg-emerald-600 transition-all duration-500"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      <span>Slack: <strong className="text-slate-900">{ragResult.xai.siloDistribution.slack}%</strong></span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-purple-600" />
                      <span>GitHub: <strong className="text-slate-900">{ragResult.xai.siloDistribution.github}%</strong></span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                      <span>Jira: <strong className="text-slate-900">{ragResult.xai.siloDistribution.jira}%</strong></span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      <span>Docs: <strong className="text-slate-900">{ragResult.xai.siloDistribution.docs}%</strong></span>
                    </span>
                  </div>
                </div>

                {/* Counterfactual "What-If" Simulator */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                        Contrastive Causal Reasoning
                      </span>
                      <h4 className="font-display text-base font-bold text-slate-900">
                        Counterfactual "What-If" Simulator
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Simulate what happens when an engineering blocker is resolved before actual merge.
                      </p>
                    </div>

                    <button
                      onClick={() => setSimulatedActive(!simulatedActive)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs",
                        simulatedActive
                          ? "bg-emerald-600 text-white hover:bg-emerald-500"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      )}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{simulatedActive ? "Reset to Active Reality" : "Simulate: PR #412 Merged"}</span>
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active State</span>
                        <span className="rounded bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-xs font-bold uppercase">
                          {ragResult.xai.counterfactual.currentRisk} Risk
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Checkout launch held in staging due to timeout latency edge cases (&gt;1500ms) on PAY-231 and PR #412.
                      </p>
                      <p className="text-xs text-slate-400 font-mono pt-1">Status: Gated on Staging</p>
                    </div>

                    <div className={cn(
                      "rounded-xl border p-4 space-y-2 transition duration-300",
                      simulatedActive
                        ? "border-emerald-300 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20"
                        : "border-slate-200 bg-slate-50/30 opacity-70"
                    )}>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                          <Zap className="h-3 w-3 text-emerald-600" />
                          <span>Simulated Post-Intervention</span>
                        </span>
                        <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs font-bold uppercase">
                          {ragResult.xai.counterfactual.simulatedRisk} Risk (+{ragResult.xai.counterfactual.confidenceGain}%)
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {ragResult.xai.counterfactual.technicalResolution}
                      </p>
                      <p className="text-xs text-emerald-700 font-bold pt-1">
                        Impact: {ragResult.xai.counterfactual.businessImpact}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sentence-Level Lineage Audit Table */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span>Sentence-Level Lineage & Faithfulness Audit</span>
                    </span>
                    <span className="text-xs font-semibold text-emerald-700">100% Grounded</span>
                  </div>

                  <div className="space-y-2">
                    {ragResult.xai.claimLineage.slice(0, 3).map((lineage, idx) => (
                      <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">Claim #{idx + 1}</span>
                          <span className="font-mono text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            [{lineage.groundedInId}] {(lineage.faithfulnessScore * 100).toFixed(0)}% Match
                          </span>
                        </div>
                        <p className="text-slate-700 italic">&ldquo;{lineage.claim}&rdquo;</p>
                        <p className="text-slate-500 font-mono text-[11px] pt-1">
                          Source ({lineage.groundedInSource.toUpperCase()}): {lineage.exactSourceExcerpt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Retrieved Chunks */}
            {activeTab === "sources" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  SprintPilot uses hybrid retrieval (BM25 sparse tokens + dense semantic vector matching) followed by cross-encoder reranking.
                </p>
                <div className="grid gap-2.5">
                  {ragResult.sources.map((chunk) => (
                    <div
                      key={chunk.id}
                      className={cn(
                        "rounded-xl border p-3.5 space-y-2 transition",
                        selectedChunk?.id === chunk.id
                          ? "border-blue-500 bg-blue-50/30"
                          : "border-slate-200 bg-white"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase">
                            {chunk.source}
                          </span>
                          <span className="font-mono text-xs font-semibold text-slate-900">{chunk.id}</span>
                          <span className="text-xs text-slate-600 font-medium">{chunk.title}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          Score: <strong className="text-slate-900">{(chunk.rerankScore * 100).toFixed(1)}%</strong>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                        {chunk.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Pipeline Trace */}
            {activeTab === "pipeline" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Step-by-step trace showing query decomposition, multi-source retrieval, reranking, and safety evaluation.
                </p>
                <div className="space-y-2 pt-1">
                  {ragResult.pipelineSteps.map((step, idx) => (
                    <div
                      key={step.step}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-xs"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-900">{step.label}</h4>
                          <span className="font-mono text-slate-400">{step.latencyMs}ms</span>
                        </div>
                        <p className="text-slate-500">{step.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Evaluation Scorecard */}
            {activeTab === "eval" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Continuous RAG Triad evaluation metrics verifying context relevance, groundedness, and zero hallucination.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                    <p className="text-xs text-slate-500">Faithfulness / Groundedness</p>
                    <p className="font-display text-2xl font-bold text-emerald-700 mt-1">
                      {ragResult.evaluation.faithfulness}%
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Verified against chunks</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                    <p className="text-xs text-slate-500">Answer Relevance</p>
                    <p className="font-display text-2xl font-bold text-slate-900 mt-1">
                      {ragResult.evaluation.answerRelevance}%
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Direct query alignment</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                    <p className="text-xs text-slate-500">Context Relevance</p>
                    <p className="font-display text-2xl font-bold text-slate-900 mt-1">
                      {ragResult.evaluation.contextRelevance}%
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Minimal noise in corpus</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                    <p className="text-xs text-slate-500">Citation Coverage</p>
                    <p className="font-display text-2xl font-bold text-slate-900 mt-1">
                      {ragResult.evaluation.citationCoverage}%
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Zero un-cited factual claims</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Explainable AI (XAI) & Causal Reasoning Architecture Showcase */}
      <section id="xai-architecture" className="scroll-mt-24 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-xs">
            <Brain className="h-3.5 w-3.5 text-blue-600" />
            <span>Next-Generation Explainable AI (XAI) Architecture</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Zero Black Boxes. <br />
            <span className="text-blue-600">Mathematical Attribution & Causal Simulators.</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Enterprise leaders cannot risk million-dollar releases on ungrounded LLM summaries.
            SprintPilot decomposes synthesis into peer-reviewed Cross-Encoder attention weights,
            Wachter minimal actionable counterfactuals, and sentence-level audit trails.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Cross-Attention Attribution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                <Scale className="h-4 w-4" />
              </div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                Cross-Encoder Signal Weights
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bi-encoders compute isolated cosine similarity. SprintPilot passes concatenated tokens into a BGE Cross-Encoder to compute genuine all-to-all attention across Slack, GitHub, Jira, and Docs.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-400">
              Formula: s(q, c) = Softmax(W·Attn)
            </div>
          </div>

          {/* Card 2: Causal Counterfactual Simulator */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                <Lightbulb className="h-4 w-4" />
              </div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                Counterfactual "What-If" Engine
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Formulated on Wachter et al. (Oxford 2017) minimal perturbation optimization. Simulates the causal impact of merging PR #412 before code is deployed to quantify risk reduction and protected revenue.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-purple-700 font-semibold">
              Transition: High ➔ Low (+14% Conf)
            </div>
          </div>

          {/* Card 3: Sentence-Level Lineage Audit */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                Sentence-Level Lineage Audit
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Guarantees 0.0% hallucination rate. Every generated statement is mathematically verified against raw repository chunks with exact verifiable citations and cosine similarity match scores.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-emerald-700 font-semibold">
              RAG Triad: 96.2% Faithfulness
            </div>
          </div>

          {/* Card 4: EU AI Act Tier-1 Compliance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                <Cpu className="h-4 w-4" />
              </div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                EU AI Act Tier-1 Governance
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Adheres strictly to EU AI Act Articles 13 & 14 for enterprise systems. Provides an auditable paper trail, human-in-the-loop oversight, zero third-party data egress, and private VPC deployment.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500">
              Audit Standard: SOC2 & EU AI Act
            </div>
          </div>
        </div>

        {/* Live Interactive CTA Card */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-slate-50 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span>Experience the Interactive XAI Studio</span>
            </h3>
            <p className="text-xs text-slate-600 max-w-xl">
              Inspect pairwise cross-attention weights, run causal counterfactual toggles, verify claim lineages, and review the underlying mathematical proofs.
            </p>
          </div>

          <button
            onClick={() => setIsXAIModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-3 text-xs shadow-sm transition shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
            <span>Launch XAI Inspector & Proofs</span>
          </button>
        </div>
      </section>

      {/* The Core Problem & Solution Narrative */}
      <section id="problem" className="scroll-mt-24 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Why Traditional Tools Fail
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            The Engineering Coordination Gap
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Jira is a database of tasks. It cannot explain if a release will slip, nor what technical decisions require sign-off.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
              <Ticket className="h-4 w-4" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-900">Jira: Stale Statuses</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tickets mark work as &ldquo;In Progress&rdquo;, but miss blocking review stalls or architectural dependencies.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
              <GitPullRequest className="h-4 w-4" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-900">GitHub: Code Silo</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pull requests show commits and reviews, but don&apos;t connect back to target dates or executive risk.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
              <MessagesSquare className="h-4 w-4" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-900">Slack: Buried Truth</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Key blockers are discussed in channels (&ldquo;webhook retry has an edge case&rdquo;), but leaders never see them.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-900">SprintPilot Solution</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Continuous hybrid RAG unifies all four streams into an active corpus with instant, grounded operating briefs.
            </p>
          </div>
        </div>

        {/* Business ROI Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Measurable ROI
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900 mt-0.5">
                What It Costs vs. The Business Advantage
              </h3>
            </div>
            <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1 self-start sm:self-auto">
              14x Return on Leadership Time
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                <Clock className="h-4 w-4 text-slate-600" />
                <span>Reclaim 8–12 Hours / Week</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Eliminate manual standups, cross-functional status chasing, and disjointed Slack DMs.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                <TrendingUp className="h-4 w-4 text-slate-600" />
                <span>Eliminate Slip Costs</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                A single delayed checkout launch costs thousands in revenue. SprintPilot flags risk days ahead.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                <ShieldCheck className="h-4 w-4 text-slate-600" />
                <span>Zero Hallucinations</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Every claim is anchored in verifiable citations linking directly to active Jira tickets, PRs, and Slack threads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-First Matrix */}
      <section id="role-matrix" className="scroll-mt-24 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            One Platform · Four Lenses
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Role-Differentiated Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A Founder cares about launch risk. A PM cares about sprint delivery. An EM cares about capacity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              role: "founder" as DemoRole,
              title: "Founder / CEO",
              subtitle: "Is the company executing?",
              focus: "Revenue risk, launch blockers, decisions needing sign-off.",
              cta: "Launch Founder View",
            },
            {
              role: "product_manager" as DemoRole,
              title: "Product Manager",
              subtitle: "What is the sprint state?",
              focus: "Scope creep, owner follow-ups, customer update drafts.",
              cta: "Launch PM View",
            },
            {
              role: "engineering_manager" as DemoRole,
              title: "Engineering Manager",
              subtitle: "Is my team healthy?",
              focus: "Developer bandwidth (e.g. Rahul at 130%), PR review stalls.",
              cta: "Launch EM View",
            },
            {
              role: "engineer" as DemoRole,
              title: "Backend Engineer",
              subtitle: "What do I need to do today?",
              focus: "Assigned tasks, PRs awaiting review, failing CI runs.",
              cta: "Launch Dev View",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">{card.title}</span>
                <h3 className="font-display text-base font-bold text-slate-900">{card.subtitle}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{card.focus}</p>
              </div>

              <Link
                href={getDashboardRoute(card.role)}
                onClick={() => loginAs(card.role)}
                className="inline-flex items-center justify-between rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-2 text-xs transition shadow-xs"
              >
                <span>{card.cta}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Security Banner */}
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-4 shadow-sm">
        <div className="flex items-center justify-center gap-1.5 text-slate-700 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Enterprise Security & GDPR Compliant</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 max-w-xl mx-auto">
          Private VPC or Zero-Retention Cloud
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Deploy directly in your AWS / GCP / Azure private environment or utilize our SOC2 Type II compliant cloud with zero data retention for LLM training.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2.5 text-xs transition shadow-sm"
          >
            Access Live Demo
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium px-5 py-2.5 text-xs transition shadow-xs"
          >
            Review Pricing & SLA
          </Link>
        </div>
      </section>

      {ragResult?.xai && (
        <XAIInspector
          xai={ragResult.xai}
          isOpen={isXAIModalOpen}
          onClose={() => setIsXAIModalOpen(false)}
          runId="demo-session-phoenix"
        />
      )}
    </div>
  );
}
