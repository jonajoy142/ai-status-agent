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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Engineering Manager Health & Capacity</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Who is blocked and can we still deliver?
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Delivery confidence is <strong className="text-emerald-400">82%</strong>. No hard system-down blockers exist, but lead payment engineer Rahul Verma is allocated at 130% workload and PR #398 is awaiting final security sign-off.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/agent-run">
              <Button className="h-11 px-5">
                <Sparkles className="mr-2 h-4 w-4" /> Ask RAG Agent
              </Button>
            </Link>
            <Link
              href="/teams"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold h-11 px-4 text-xs transition"
            >
              View Team Health <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Team Capacity Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-sky-400" />
            <h2 className="font-display text-lg font-bold text-white">Sprint 14 Team Bandwidth & Allocation</h2>
          </div>
          <span className="text-xs text-slate-400">Target capacity: 35 pts/engineer</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Engineer</th>
                <th className="p-3">Planned Pts</th>
                <th className="p-3">Allocated Pts</th>
                <th className="p-3">Load Factor</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {capacity.map((row) => (
                <tr key={row.engineer} className="hover:bg-slate-900/80 transition">
                  <td className="p-3 font-semibold text-white">{row.engineer}</td>
                  <td className="p-3 text-slate-400">{row.planned} pts</td>
                  <td className="p-3 text-slate-300 font-medium">{row.actual} pts</td>
                  <td className="p-3 font-mono font-bold text-slate-200">{row.load}</td>
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
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <GitPullRequest className="h-5 w-5 text-purple-400" />
            <h2 className="font-display text-lg font-bold text-white">PRs Awaiting Code Review</h2>
          </div>
          <div className="space-y-3">
            {prs.map((pr) => (
              <div key={pr.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">{pr.id}</span>
                  <StatusBadge label={pr.waiting} tone="warn" />
                </div>
                <p className="text-xs font-medium text-white">{pr.title}</p>
                <p className="text-[11px] text-slate-400">
                  Author: <span className="text-slate-300">{pr.author}</span> · Assigned Reviewer: <span className="text-slate-300">{pr.reviewer}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-white">Delivery Confidence Radar</h2>
          <div className="space-y-4">
            {[
              ["Checkout Modernization v1.0", 82, "good"],
              ["Customer Onboarding Flows", 88, "good"],
              ["Observability & Alerting", 100, "good"],
            ].map(([name, score, tone]) => (
              <div key={name as string} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{name}</span>
                  <span className="font-mono font-bold text-sky-400">{score}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500"
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
