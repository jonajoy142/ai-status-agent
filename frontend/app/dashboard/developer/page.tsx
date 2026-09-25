import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, GitPullRequest, Sparkles } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const tasks = [
  { id: "PAY-231", title: "Validate Stripe webhook retry & exponential backoff in staging", status: "In Progress", estimate: "4h", blocker: "Simulating upstream network timeout latency", ai: "Run PR #412 integration test suite with mock Stripe webhook chaos script." },
  { id: "PERF-309", title: "Patch Redis connection pool & rolling TTL for cart sessions", status: "In Progress", estimate: "2h", blocker: null, ai: "Review load-test telemetry; verify latency drop under 5,000 req/s simulated load." },
  { id: "REL-077", title: "Audit citation links in release notes markdown generator", status: "Todo", estimate: "1.5h", blocker: null, ai: "Ground all release notes against merged PR and Jira issue IDs." },
];

export default function DeveloperDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Developer Execution Brief</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Good morning, Alex.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Your focus today is staging validation for <strong className="text-white">PAY-231</strong>, reviewing Isha&apos;s Redis mutex patch (<strong className="text-sky-400">PR #398</strong>), and keeping your blockers unblocked.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/agent-run">
              <Button className="h-11 px-5">
                <Sparkles className="mr-2 h-4 w-4" /> Ask RAG Agent
              </Button>
            </Link>
            <Link
              href="/my-blockers"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold h-11 px-4 text-xs transition"
            >
              View My Blockers <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Focus Tasks */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-white">Your Focus Items Today</h2>
          <p className="text-xs text-slate-400">Ranked by launch path criticality and dependency chain.</p>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  {task.blocker ? (
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-mono text-xs font-bold text-sky-400">{task.id}</span>
                    <h3 className="text-sm font-semibold text-white mt-0.5">{task.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">Status: {task.status} · Estimate: {task.estimate}</p>
                  </div>
                </div>
                <StatusBadge label={task.blocker ? "Watch" : "Ready"} tone={task.blocker ? "warn" : "good"} />
              </div>

              {task.blocker && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                  <strong>Dependency Watch:</strong> {task.blocker}
                </div>
              )}

              <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-300 flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span><strong>AI Execution Tip:</strong> {task.ai}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRs Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <GitPullRequest className="h-5 w-5 text-purple-400" />
          <h2 className="font-display text-lg font-bold text-white">Active Pull Requests</h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-purple-400">PR #412</span>
              <span className="text-xs font-semibold text-white">feat(payments): Stripe webhook idempotent handler & exponential backoff</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Author: Rahul Verma · Waiting on review from Dev Shah · Closes PAY-231
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/my-prs"
              className="rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-1.5 text-xs transition"
            >
              Inspect PR
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
