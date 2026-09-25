import Link from "next/link";
import { ArrowRight, CheckCircle2, GitPullRequest, Sparkles, Users } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const capacity = [
  { engineer: "Rahul Verma", planned: 40, actual: 52, load: "130%", status: "Overloaded", tone: "bad" },
  { engineer: "Isha Patel", planned: 35, actual: 34, load: "97%", status: "On Track", tone: "good" },
  { engineer: "Alex Torres", planned: 30, actual: 29, load: "96%", status: "On Track", tone: "good" },
  { engineer: "Dev Shah", planned: 25, actual: 20, load: "80%", status: "Available", tone: "good" },
];

const prs = [
  { id: "PR #412", title: "Stripe webhook idempotency & exponential backoff", waiting: "2 days", author: "Rahul Verma", reviewer: "Dev Shah", blocks: "PAY-231" },
  { id: "PR #398", title: "Atomic Redis mutex lock for token refresh", waiting: "3 days", author: "Isha Patel", reviewer: "Alex Torres", blocks: "AUTH-118" },
];

export default function EngineeringManagerDashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span>Engineering Manager Lens</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Team Capacity & Delivery Health
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Delivery confidence is <strong className="text-emerald-700">82%</strong>. No hard system-down blockers exist, but lead payment engineer Rahul Verma is allocated at 130% workload and PR #398 is awaiting final security sign-off.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/agent-run">
              <Button className="h-9 px-4 text-xs">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Ask RAG Agent
              </Button>
            </Link>
            <Link
              href="/teams"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium h-9 px-3.5 text-xs shadow-xs transition"
            >
              Team Health <ArrowRight className="ml-1 h-3 w-3 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Team Capacity Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-700" />
            <h2 className="font-display text-base font-bold text-slate-900">Sprint 14 Team Bandwidth & Allocation</h2>
          </div>
          <span className="text-xs text-slate-500">Target capacity: 35 pts/engineer</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">Engineer</th>
                <th className="p-3">Planned Pts</th>
                <th className="p-3">Allocated Pts</th>
                <th className="p-3">Load Factor</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {capacity.map((row) => (
                <tr key={row.engineer} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-semibold text-slate-900">{row.engineer}</td>
                  <td className="p-3 text-slate-500">{row.planned} pts</td>
                  <td className="p-3 text-slate-700 font-medium">{row.actual} pts</td>
                  <td className="p-3 font-mono font-bold text-slate-900">{row.load}</td>
                  <td className="p-3">
                    <StatusBadge label={row.status} tone={row.tone as "good" | "warn" | "bad"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRs and Delivery Confidence */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-3.5 shadow-sm">
          <div className="flex items-center gap-2">
            <GitPullRequest className="h-4 w-4 text-slate-700" />
            <h2 className="font-display text-base font-bold text-slate-900">PRs Awaiting Code Review</h2>
          </div>
          <div className="space-y-2.5">
            {prs.map((pr) => (
              <div key={pr.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600">{pr.id}</span>
                  <StatusBadge label={pr.waiting} tone="warn" />
                </div>
                <p className="text-xs font-medium text-slate-900">{pr.title}</p>
                <p className="text-[11px] text-slate-500">
                  Author: <span className="text-slate-700">{pr.author}</span> · Reviewer: <span className="text-slate-700">{pr.reviewer}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-3.5 shadow-sm">
          <h2 className="font-display text-base font-bold text-slate-900">Delivery Confidence Radar</h2>
          <div className="space-y-3.5 pt-1">
            {[
              ["Checkout Modernization v1.0", 82],
              ["Customer Onboarding Flows", 88],
              ["Observability & Alerting", 100],
            ].map(([name, score]) => (
              <div key={name as string} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{name}</span>
                  <span className="font-mono font-bold text-slate-900">{score}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-900"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
