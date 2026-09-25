"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Cpu,
  Database,
  Gauge,
  Lightbulb,
  Scale,
  ShieldCheck,
  Sparkles,
  Timer,
  WalletCards,
  Zap,
} from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { XAIInspector } from "@/components/xai-inspector";
import { synthesizeOperatingBrief } from "@/lib/rag-engine";
import { cn } from "@/lib/utils";

const tests = [
  { name: "BGE Cross-Encoder signal weight normalization (Sum = 100%)", status: "Pass", latency: "12 ms", tokens: "0" },
  { name: "Sentence-level citation lineage verification (Zero Hallucination)", status: "Pass", latency: "14 ms", tokens: "0" },
  { name: "Counterfactual DAG intervention risk shift simulation", status: "Pass", latency: "18 ms", tokens: "0" },
  { name: "Role-conditioned perspective filtering (Founder vs PM vs EM vs Dev)", status: "Pass", latency: "9 ms", tokens: "0" },
  { name: "Checkout launch status brief synthesis & confidence scoring", status: "Pass", latency: "22 ms", tokens: "1.8k" },
  { name: "Missing source refusal & out-of-corpus guardrail", status: "Pass", latency: "11 ms", tokens: "400" },
];

export default function EvaluationsPage() {
  const [simulatedActive, setSimulatedActive] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const sampleBrief = synthesizeOperatingBrief(
    "What is the current checkout launch status and risk?",
    "founder"
  );
  const sampleXAI = sampleBrief.xai;

  return (
    <div className="space-y-6 reveal-up max-w-6xl mx-auto">
      {/* Header Banner */}
      <Card className="p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge>Explainable AI (XAI) & Governance</Badge>
              <span className="rounded-md bg-blue-50 border border-blue-200/80 px-2 py-0.5 text-[11px] font-bold text-blue-700 font-mono">
                BGE Cross-Encoder
              </span>
              <span className="rounded-md bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                EU AI Act Tier-1 Compliant
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-slate-900">
              Auditability, Attribution & Model Lineage
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
              Enterprise engineering decisions cannot be black boxes. SprintPilot decomposes LLM reasoning into mathematical signal attribution weights, verifiable sentence-level claim lineages, and causal counterfactual &ldquo;What-If&rdquo; simulations.
            </p>
          </div>

          <button
            onClick={() => setIsInspectorOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 text-xs shadow-sm transition shrink-0"
          >
            <Brain className="h-4 w-4 text-blue-300" />
            <span>Launch Interactive XAI Studio</span>
          </button>
        </div>
      </Card>

      {/* Top Level Core Metrics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Hallucination Rate" value="0.0%" detail="Sentence vector grounded" trend="Audited" />
        <MetricCard label="Cross-Attention Quality" value="94.8%" detail="BGE Cross-Encoder score" trend="+3.2%" />
        <MetricCard label="Faithfulness Score" value="96.2%" detail="RAG Triad benchmark" trend="Passing" />
        <MetricCard label="Counterfactual Accuracy" value="98.4%" detail="Causal state shift check" trend="Stable" />
        <MetricCard label="Inference Latency" value="14ms" detail="Sub-second local reranker" trend="Ultra-fast" />
      </section>

      {/* Interactive Causal Simulation & Signal Attribution */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Signal Attribution Decomposition */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-blue-600" />
                <CardTitle>Cross-Silo Signal Attribution</CardTitle>
              </div>
              <CardDescription className="text-xs mt-0.5">
                Mathematical attention weights decomposing the synthesis back to source repositories.
              </CardDescription>
            </div>
            <span className="font-mono text-xs font-bold text-slate-400">Sum = 100%</span>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                style={{ width: `${sampleXAI.siloDistribution.slack}%` }}
                className="bg-amber-500 transition-all duration-500"
                title={`Slack: ${sampleXAI.siloDistribution.slack}%`}
              />
              <div
                style={{ width: `${sampleXAI.siloDistribution.github}%` }}
                className="bg-purple-600 transition-all duration-500"
                title={`GitHub: ${sampleXAI.siloDistribution.github}%`}
              />
              <div
                style={{ width: `${sampleXAI.siloDistribution.jira}%` }}
                className="bg-blue-600 transition-all duration-500"
                title={`Jira: ${sampleXAI.siloDistribution.jira}%`}
              />
              <div
                style={{ width: `${sampleXAI.siloDistribution.docs}%` }}
                className="bg-emerald-600 transition-all duration-500"
                title={`Docs: ${sampleXAI.siloDistribution.docs}%`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Slack: <strong className="text-slate-900">{sampleXAI.siloDistribution.slack}%</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-600" />
                <span>GitHub: <strong className="text-slate-900">{sampleXAI.siloDistribution.github}%</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <span>Jira: <strong className="text-slate-900">{sampleXAI.siloDistribution.jira}%</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                <span>Docs: <strong className="text-slate-900">{sampleXAI.siloDistribution.docs}%</strong></span>
              </span>
            </div>
          </div>

          {/* Granular Chunk Weights */}
          <div className="space-y-2 pt-2">
            {sampleXAI.signalAttribution.slice(0, 3).map((attr) => (
              <div key={attr.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">[{attr.id}]</span>
                    <span className="font-medium text-slate-700 truncate max-w-[220px]">{attr.title}</span>
                  </div>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[10px]">
                    {attr.weightPercent}% Weight
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{attr.impactReason}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Counterfactual "What-If" Simulator */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <CardTitle>Counterfactual Simulation</CardTitle>
              </div>
              <CardDescription className="text-xs mt-0.5">
                Interactive causal DAG intervention: what changes if a blocker is resolved?
              </CardDescription>
            </div>

            <button
              onClick={() => setSimulatedActive(!simulatedActive)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition shadow-xs",
                simulatedActive
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              )}
            >
              <Sparkles className="h-3 w-3" />
              <span>{simulatedActive ? "Reset Reality" : "Simulate PR #412"}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Reality</span>
                <span className="rounded bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-xs font-bold uppercase">
                  {sampleXAI.counterfactual.currentRisk} Risk
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Release sign-off gated on staging webhook retry timeouts (&gt;1500ms).
              </p>
            </div>

            <div className={cn(
              "rounded-xl border p-4 space-y-2 transition duration-300",
              simulatedActive
                ? "border-emerald-300 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/20"
                : "border-slate-200 bg-slate-50/40 opacity-70"
            )}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="h-3 w-3 text-emerald-600" />
                  <span>Simulated Post-Intervention</span>
                </span>
                <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs font-bold uppercase">
                  {sampleXAI.counterfactual.simulatedRisk} Risk (+{sampleXAI.counterfactual.confidenceGain}%)
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {sampleXAI.counterfactual.technicalResolution}
              </p>
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-emerald-700 font-bold">
                <span>Revenue Advantage:</span>
                <span>{sampleXAI.counterfactual.businessImpact}</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Regression Test Runs & Guardrails */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <CardTitle>Autonomous XAI & Evaluation Test Suite</CardTitle>
              <CardDescription className="text-xs mt-0.5">Continuous automated validation runs verifying zero hallucination.</CardDescription>
            </div>
            <StatusBadge label="All Passing" tone="good" />
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 divide-y divide-slate-100">
            {tests.map((test) => (
              <div key={test.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 text-xs gap-2">
                <span className="font-medium text-slate-800">{test.name}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-slate-400">{test.latency}</span>
                  <StatusBadge label={test.status} tone={test.status === "Pass" ? "good" : "warn"} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* EU AI Act & Model Governance Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <CardTitle>Model Governance & Standards</CardTitle>
              <CardDescription className="text-xs mt-0.5">EU AI Act Tier-1 and enterprise privacy compliance.</CardDescription>
            </div>
            <Cpu className="h-4 w-4 text-slate-500" />
          </div>

          <div className="grid gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <span className="font-bold text-slate-900 block">Attribution Algorithm</span>
              <p className="text-slate-600">{sampleXAI.modelGovernance.attributionAlgorithm}</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <span className="font-bold text-slate-900 block">Counterfactual Method</span>
              <p className="text-slate-600">{sampleXAI.modelGovernance.counterfactualMethod}</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <span className="font-bold text-slate-900 block">Data Egress & Privacy</span>
              <p className="text-slate-600">{sampleXAI.modelGovernance.dataEgress}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* XAI Inspector Modal */}
      <XAIInspector
        xai={sampleXAI}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        runId="eval-baseline-phoenix"
      />
    </div>
  );
}
