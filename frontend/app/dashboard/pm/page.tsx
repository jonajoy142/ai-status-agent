import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Filter, Sparkles, Wand2 } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { workItems } from "@/lib/demo-data";

const stats = [
  { label: "Blocked tickets", value: "2", tone: "bad" },
  { label: "Stale tickets", value: "4", tone: "warn" },
  { label: "Critical Path", value: "PAY-231", tone: "warn" },
  { label: "Release Readiness", value: "78%", tone: "good" },
];

export default function PMDashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span>Product Manager Lens</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Sprint 14 Delivery State
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sprint 14 is 72% complete with 5 days remaining. Core checkout modernization is on track, but two owner follow-ups are required: retry validation (Rahul) and session auth review (Isha).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/agent-run">
              <Button className="h-9 px-4 text-xs">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Ask RAG Agent
              </Button>
            </Link>
            <Link
              href="/report/weekly"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium h-9 px-3.5 text-xs shadow-xs transition"
            >
              Weekly Report <ArrowRight className="ml-1 h-3 w-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Sprint Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <span>Checkout Modernization (Sprint 14)</span>
            <span>Progress: 72% of 68 Story Points</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[72%] rounded-full bg-slate-900" />
          </div>
          <p className="text-[11px] text-slate-400">5 days remaining · Target release date: June 18</p>
        </div>
      </div>

      {/* KPI Stats */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5 shadow-xs">
            <StatusBadge label={stat.label} tone={stat.tone as "good" | "warn" | "bad"} />
            <p className="font-display text-2xl font-bold text-slate-900 pt-1">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Work items & follow-ups */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">Work Items Needing Owner Follow-up</h2>
            <p className="text-xs text-slate-500">Active tickets on the critical path requiring PM confirmation.</p>
          </div>
          <Link href="/work-items" className="text-xs font-medium text-blue-600 hover:text-blue-500">
            View All Work Items →
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">Ticket</th>
                <th className="p-3">Title</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Status</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Action Item</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {workItems.slice(0, 5).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono text-blue-600 font-semibold">{item.id}</td>
                  <td className="p-3 font-medium text-slate-900">{item.title}</td>
                  <td className="p-3 text-slate-600">{item.assignee}</td>
                  <td className="p-3 text-slate-600">{item.status}</td>
                  <td className="p-3">
                    <StatusBadge
                      label={item.risk}
                      tone={item.risk === "High" ? "bad" : item.risk === "Medium" ? "warn" : "good"}
                    />
                  </td>
                  <td className="p-3 text-slate-500">{item.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
