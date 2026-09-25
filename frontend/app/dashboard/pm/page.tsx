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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Product Manager Delivery Intelligence</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              What needs PM attention this sprint?
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Sprint 14 is 72% complete with 5 days remaining. Core checkout modernization is on track, but two owner follow-ups are required: retry validation (Rahul) and session auth review (Isha).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/agent-run">
              <Button className="h-11 px-5">
                <Sparkles className="mr-2 h-4 w-4" /> Ask RAG Agent
              </Button>
            </Link>
            <Link
              href="/report/weekly"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold h-11 px-4 text-xs transition"
            >
              Generate Weekly Report <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Sprint Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300">
            <span>Sprint 14 - Checkout Modernization</span>
            <span>Progress: 72% of 68 Story Points</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[72%] rounded-full bg-sky-500" />
          </div>
          <p className="text-[11px] text-slate-400">5 days remaining · Target release date: June 18</p>
        </div>
      </div>

      {/* KPI Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <StatusBadge label={stat.label} tone={stat.tone as "good" | "warn" | "bad"} />
            <p className="font-display text-3xl font-bold text-white pt-2">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Work items & follow-ups */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-white">Work Items Needing Owner Follow-up</h2>
            <p className="text-xs text-slate-400">Active tickets on the critical path requiring PM confirmation.</p>
          </div>
          <Link href="/work-items" className="text-xs font-semibold text-sky-400 hover:text-sky-300">
            View All Work Items →
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Ticket</th>
                <th className="p-3">Title</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Status</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Action Item</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {workItems.slice(0, 5).map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/80 transition">
                  <td className="p-3 font-mono text-sky-400 font-semibold">{item.id}</td>
                  <td className="p-3 font-medium text-white">{item.title}</td>
                  <td className="p-3 text-slate-400">{item.assignee}</td>
                  <td className="p-3">{item.status}</td>
                  <td className="p-3">
                    <StatusBadge
                      label={item.risk}
                      tone={item.risk === "High" ? "bad" : item.risk === "Medium" ? "warn" : "good"}
                    />
                  </td>
                  <td className="p-3 text-slate-400">{item.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
