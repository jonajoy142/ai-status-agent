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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span>Developer Lens</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Good morning, Alex.
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your focus today is staging validation for <strong className="text-slate-900 font-semibold">PAY-231</strong>, reviewing Isha&apos;s Redis mutex patch (<strong className="text-blue-600 font-semibold">PR #398</strong>), and keeping your blockers resolved.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/agent-run">
              <Button className="h-9 px-4 text-xs">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Ask RAG Agent
              </Button>
            </Link>
            <Link
              href="/my-blockers"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium h-9 px-3.5 text-xs shadow-xs transition"
            >
              My Blockers <ArrowRight className="ml-1 h-3 w-3 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Focus Tasks */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-4 shadow-sm">
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">Your Focus Items Today</h2>
          <p className="text-xs text-slate-500">Ranked by launch path criticality and dependency chain.</p>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  {task.blocker ? (
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-600">{task.id}</span>
                    <h3 className="text-sm font-semibold text-slate-900 mt-0.5">{task.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Status: {task.status} · Estimate: {task.estimate}</p>
                  </div>
                </div>
                <StatusBadge label={task.blocker ? "Watch" : "Ready"} tone={task.blocker ? "warn" : "good"} />
              </div>

              {task.blocker && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
                  <strong>Dependency Watch:</strong> {task.blocker}
                </div>
              )}

              <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-600 flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span><strong>Execution Context:</strong> {task.ai}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRs Section */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-3.5 shadow-sm">
        <div className="flex items-center gap-2">
          <GitPullRequest className="h-4 w-4 text-slate-700" />
          <h2 className="font-display text-base font-bold text-slate-900">Active Pull Requests</h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600">PR #412</span>
              <span className="text-xs font-semibold text-slate-900">feat(payments): Stripe webhook idempotent handler & exponential backoff</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Author: Rahul Verma · Reviewer: Dev Shah · Closes PAY-231
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/my-prs"
              className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-1.5 text-xs transition shadow-xs"
            >
              Inspect PR
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
