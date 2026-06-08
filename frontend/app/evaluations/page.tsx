import { Activity, CheckCircle2, Gauge, ShieldCheck, Timer, WalletCards } from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const tests = [
  { name: "Checkout launch status answer", status: "Pass", latency: "642 ms", tokens: "1.8k" },
  { name: "Risk summary faithfulness", status: "Pass", latency: "711 ms", tokens: "2.1k" },
  { name: "Missing source refusal", status: "Pass", latency: "388 ms", tokens: "900" },
  { name: "Action item extraction", status: "Warn", latency: "524 ms", tokens: "1.2k" },
];

export default function EvaluationsPage() {
  return (
    <div className="space-y-6 reveal-up">
      <Card className="p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge>Evaluations</Badge>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">Quality checks for agent-generated status reports.</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
              Lightweight evaluation UI for faithfulness, retrieval quality, hallucination risk, latency, token usage, and pass/fail regression checks.
            </p>
          </div>
          <StatusBadge label="Baseline passing" tone="good" />
        </div>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Hallucination score" value="4%" detail="Lower is better" trend="pass" />
        <MetricCard label="Retrieval quality" value="91%" detail="Top-k source relevance" trend="+3%" />
        <MetricCard label="Faithfulness" value="94%" detail="Answer grounded in sources" trend="pass" />
        <MetricCard label="Latency" value="680ms" detail="Median local run" trend="demo" />
        <MetricCard label="Token usage" value="1.6k" detail="Avg per report" trend="tracked" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardTitle>Evaluation scorecards</CardTitle>
          <div className="mt-5 grid gap-3">
            {[
              { icon: ShieldCheck, label: "Answer faithfulness", score: "94", tone: "good" },
              { icon: Gauge, label: "Retrieval relevance", score: "91", tone: "good" },
              { icon: Activity, label: "Agent trace completeness", score: "100", tone: "good" },
              { icon: Timer, label: "Latency target", score: "86", tone: "warn" },
              { icon: WalletCards, label: "Token budget", score: "89", tone: "good" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-xl border border-border bg-slate-50/70 p-3 dark:bg-slate-950/40">
                  <Icon className="h-4 w-4 text-muted" />
                  <p className="text-sm font-medium">{item.label}</p>
                  <StatusBadge label={`${item.score}%`} tone={item.tone as "good" | "warn"} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardTitle>Regression test runs</CardTitle>
          <CardDescription>Sample UI now; can be wired to pytest/RAG evals later.</CardDescription>
          <div className="mt-5 overflow-hidden rounded-xl border border-border">
            {tests.map((test) => (
              <div key={test.name} className="grid gap-3 border-b border-border p-4 last:border-b-0 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
                <p className="text-sm font-medium">{test.name}</p>
                <StatusBadge label={test.status} tone={test.status === "Pass" ? "good" : "warn"} />
                <span className="text-sm text-muted">{test.latency}</span>
                <span className="text-sm text-muted">{test.tokens}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Pass/fail criteria</CardTitle>
            <CardDescription>What the product should enforce before reports become automated.</CardDescription>
          </div>
          <CheckCircle2 className="h-5 w-5 text-muted" />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {["Every claim must map to at least one retrieved source.", "Risk level must include source-backed rationale.", "Reports should include owner, status, and next action when evidence exists."].map((item) => (
            <div key={item} className="rounded-xl border border-border bg-card p-4 text-sm leading-6 text-muted">{item}</div>
          ))}
        </div>
      </Card>
    </div>
  );
}
