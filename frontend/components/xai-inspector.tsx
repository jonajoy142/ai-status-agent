"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  ExternalLink,
  Layers,
  Lightbulb,
  Scale,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
  Zap,
} from "lucide-react";

import { type XAIAnalysis } from "@/lib/rag-engine";
import { cn } from "@/lib/utils";

interface XAIInspectorProps {
  xai: XAIAnalysis;
  isOpen: boolean;
  onClose: () => void;
  runId?: string;
}

export function XAIInspector({ xai, isOpen, onClose, runId }: XAIInspectorProps) {
  const [activeTab, setActiveTab] = useState<"attribution" | "counterfactual" | "lineage" | "governance">("attribution");
  const [simulatedActive, setSimulatedActive] = useState(false);

  if (!isOpen) return null;

  const cf = xai.counterfactual;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:px-6 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-bold text-slate-900">
                  Explainable AI (XAI) & Attribution Studio
                </h2>
                <span className="rounded-md bg-blue-50 border border-blue-200/80 px-2 py-0.5 text-[10px] font-bold text-blue-700 font-mono">
                  BGE Cross-Encoder
                </span>
                <span className="hidden sm:inline-block rounded-md bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  EU AI Act Tier-1
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Mathematical cross-attention decomposition, counterfactual causal simulation, and claim lineage.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-100 px-5 sm:px-6 bg-white pt-2">
          {[
            { id: "attribution", label: "Signal Attribution (Weights %)", icon: Scale },
            { id: "counterfactual", label: "Counterfactual 'What-If' Engine", icon: Lightbulb },
            { id: "lineage", label: "Claim-by-Claim Lineage Audit", icon: ShieldCheck },
            { id: "governance", label: "Model Governance & Standards", icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "inline-flex items-center gap-2 border-b-2 py-2.5 px-3 text-xs font-semibold transition -mb-px",
                  isActive
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Canvas */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: Signal Attribution Weights */}
          {activeTab === "attribution" && (
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Cross-Encoder Attention Distribution
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      How much each engineering silo contributed to the decision.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Sum: 100% Attribution
                  </span>
                </div>

                {/* Multi-Segment Silo Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      style={{ width: `${xai.siloDistribution.slack}%` }}
                      className="bg-amber-500 transition-all duration-500"
                      title={`Slack: ${xai.siloDistribution.slack}%`}
                    />
                    <div
                      style={{ width: `${xai.siloDistribution.github}%` }}
                      className="bg-purple-600 transition-all duration-500"
                      title={`GitHub: ${xai.siloDistribution.github}%`}
                    />
                    <div
                      style={{ width: `${xai.siloDistribution.jira}%` }}
                      className="bg-blue-600 transition-all duration-500"
                      title={`Jira: ${xai.siloDistribution.jira}%`}
                    />
                    <div
                      style={{ width: `${xai.siloDistribution.docs}%` }}
                      className="bg-emerald-600 transition-all duration-500"
                      title={`Docs: ${xai.siloDistribution.docs}%`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      <span>Slack: <strong className="text-slate-900">{xai.siloDistribution.slack}%</strong></span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-purple-600" />
                      <span>GitHub: <strong className="text-slate-900">{xai.siloDistribution.github}%</strong></span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                      <span>Jira: <strong className="text-slate-900">{xai.siloDistribution.jira}%</strong></span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      <span>Docs: <strong className="text-slate-900">{xai.siloDistribution.docs}%</strong></span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Chunk-by-Chunk Mathematical Attribution */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Individual Chunk Signal Weights & Rationales
                </h4>

                <div className="space-y-2.5">
                  {xai.signalAttribution.map((attr) => (
                    <div
                      key={attr.id}
                      className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                              attr.source === "slack"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : attr.source === "github"
                                ? "bg-purple-50 text-purple-800 border border-purple-200"
                                : attr.source === "jira"
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            )}
                          >
                            {attr.source}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-900">{attr.id}</span>
                          <span className="text-xs font-medium text-slate-700 truncate max-w-[280px] sm:max-w-[400px]">
                            {attr.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-slate-900 text-white font-mono text-[11px] font-bold px-2 py-0.5">
                            {attr.weightPercent}% Weight
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                        <strong className="text-slate-900">Decision Impact:</strong> {attr.impactReason}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                        <span>Cross-Attention Score: <strong className="text-slate-700">{attr.attentionScore}</strong></span>
                        <span>BM25 Token Overlap: <strong className="text-slate-700">{attr.bm25Score}</strong></span>
                        <span>Dense Semantic: <strong className="text-slate-700">{attr.semanticScore}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Counterfactual "What-If" Simulator */}
          {activeTab === "counterfactual" && (
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                      Contrastive Causal Reasoning Engine
                    </span>
                    <h3 className="font-display text-base font-bold text-slate-900 mt-0.5">
                      Counterfactual Intervention Simulator
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      What single action would flip the decision from &ldquo;At Risk&rdquo; to &ldquo;On Track&rdquo;?
                    </p>
                  </div>

                  {/* Toggle Simulation Button */}
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
                    <span>{simulatedActive ? "Reset to Active Reality" : "Run Counterfactual Simulation"}</span>
                  </button>
                </div>
              </div>

              {/* State Transition Matrix */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Active Reality Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Active Repository State
                    </span>
                    <span className="rounded-md bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-xs font-bold uppercase">
                      {cf.currentRisk} Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Current checkout launch sign-off is held in staging due to timeout latency edge cases (&gt;1500ms) on PAY-231 and PR #412.
                  </p>
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                    Status: <strong className="text-amber-700 font-semibold">Gated on Staging Verification</strong>
                  </div>
                </div>

                {/* Simulated Post-Intervention Card */}
                <div className={cn(
                  "rounded-xl border p-4 space-y-3 transition duration-300",
                  simulatedActive
                    ? "border-emerald-300 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20"
                    : "border-slate-200 bg-slate-50/40 opacity-70"
                )}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Counterfactual Post-Intervention</span>
                    </span>
                    <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs font-bold uppercase">
                      {cf.simulatedRisk} Risk (+{cf.confidenceGain}% Confidence)
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {cf.technicalResolution}
                  </p>
                  <div className="pt-2 border-t border-slate-200/80 text-xs text-slate-700 font-semibold flex items-center justify-between">
                    <span>Transition:</span>
                    <span className="text-emerald-700 font-bold">{cf.statusShift}</span>
                  </div>
                </div>
              </div>

              {/* Business Value & Prerequisites */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Causal Resolution Impact & Revenue Protection
                  </h4>
                  <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold">
                    {cf.businessImpact}
                  </span>
                </div>

                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Actionable Prerequisites Checklist:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {cf.prerequisites.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Claim-by-Claim Lineage Audit */}
          {activeTab === "lineage" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Sentence-Level Vector Grounding Audit</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Proving zero hallucinations: every generated sentence is mapped directly to an authenticated source chunk.
                </p>
              </div>

              <div className="space-y-3">
                {xai.claimLineage.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase text-slate-500">
                        Claim Statement #{idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-[10px] font-bold font-mono">
                          [{item.groundedInId}]
                        </span>
                        <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5">
                          {(item.faithfulnessScore * 100).toFixed(1)}% Faithfulness
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-900 font-medium leading-relaxed">
                      &ldquo;{item.claim}&rdquo;
                    </p>

                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Exact Verifiable Source Excerpt ({item.groundedInSource.toUpperCase()}):
                      </p>
                      <p className="text-xs text-slate-600 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                        {item.exactSourceExcerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Model Governance & Standards */}
          {activeTab === "governance" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-slate-700" />
                  <span>XAI Architecture & EU AI Act Compliance</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Enterprise AI governance standards enforced across SprintPilot.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attribution Algorithm</span>
                  <p className="font-semibold text-slate-900">{xai.modelGovernance.attributionAlgorithm}</p>
                  <p className="text-slate-500 text-[11px] pt-1">Computes cross-attention matrices between intent query and candidate tokens.</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Counterfactual Method</span>
                  <p className="font-semibold text-slate-900">{xai.modelGovernance.counterfactualMethod}</p>
                  <p className="text-slate-500 text-[11px] pt-1">Contrastive post-intervention state simulation over dependency graphs.</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Evaluation Guardrail</span>
                  <p className="font-semibold text-slate-900">{xai.modelGovernance.faithfulnessStandard}</p>
                  <p className="text-slate-500 text-[11px] pt-1">Continuous RAG Triad assessment: Groundedness, Relevance, and Completeness.</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Data Sovereignty & Egress</span>
                  <p className="font-semibold text-slate-900">{xai.modelGovernance.dataEgress}</p>
                  <p className="text-slate-500 text-[11px] pt-1">Zero data egress to public third parties; executes in private runtime.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 p-4 px-5 sm:px-6 bg-slate-50/70 text-xs text-slate-500">
          <span>SprintPilot XAI Engine v2.4 · Run ID: <strong className="font-mono text-slate-700">{runId?.slice(0, 10) || "active"}</strong></span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-1.5 text-xs shadow-xs transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
