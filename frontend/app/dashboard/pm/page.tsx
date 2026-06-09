import Link from "next/link";
import { ArrowRight, FileText, Filter, Wand2 } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { workItems } from "@/lib/demo-data";

const stats = [
  { label: "Blocked tickets", value: "7", tone: "bad" },
  { label: "Stale tickets", value: "12", tone: "warn" },
  { label: "At-risk epics", value: "3", tone: "warn" },
  { label: "Release readiness", value: "68%", tone: "warn" },
];

export default function PMDashboardPage() {
  return (
    <div className="space-y-7 reveal-up">
      <Card className="p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge className="bg-sky-50 text-sky-700 ring-1 ring-sky-100">Sprint dashboard</Badge>
            <h1 className="mt-5 font-display text-5xl font-semibold tracking-[-0.06em]">What needs my attention this sprint?</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted">Sprint 24 is 42% complete with 12 days remaining. Checkout is the critical path and the weekly leadership update is ready to generate.</p>
          </div>
          <Link href="/report/weekly"><Button className="h-12 px-5">Generate Weekly Report <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-between text-sm font-medium text-slate-700"><span>Sprint 24 - June 3-17</span><span>Goal: 68 points</span></div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[42%] rounded-full bg-sky-500" /></div>
          <p className="mt-3 text-sm text-muted">42% complete · 12 days remaining</p>
        </div>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => <Card key={stat.label} className="p-5"><StatusBadge label={stat.label} tone={stat.tone as "warn" | "bad"} /><p className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">{stat.value}</p></Card>)}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><CardTitle>Work items needing follow-up</CardTitle><CardDescription>Filter by owner, status, risk, or sprint before generating the weekly update.</CardDescription></div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium ring-1 ring-slate-200"><Filter className="h-4 w-4" /> Filter</button>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[0.75fr_1.4fr_0.7fr_0.7fr_0.6fr_1.1fr] bg-slate-50 px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-muted">
              <span>Ticket</span><span>Title</span><span>Owner</span><span>Status</span><span>Risk</span><span>Suggested action</span>
            </div>
            {workItems.slice(0, 5).map((item) => (
              <div key={item.id} className="grid grid-cols-[0.75fr_1.4fr_0.7fr_0.7fr_0.6fr_1.1fr] gap-3 border-t border-slate-100 px-4 py-4 text-sm">
                <span className="font-mono text-xs text-slate-500">{item.id}</span>
                <span className="font-medium text-slate-950">{item.title}</span>
                <span className="text-muted">{item.assignee}</span>
                <span className="text-muted">{item.status}</span>
                <span><StatusBadge label={item.risk} tone={item.risk === "High" ? "bad" : item.risk === "Medium" ? "warn" : "good"} /></span>
                <span className="text-muted">{item.next}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-sky-600" /><CardTitle>Weekly Report</CardTitle></div>
          <CardDescription>Audience and content controls for a stakeholder-ready update.</CardDescription>
          <div className="mt-5 space-y-4">
            {[["Audience", "Founder / CEO"], ["Sprint", "Current Sprint"], ["Include", "Risks, decisions, citations, business impact"]].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</p><p className="mt-2 text-sm font-semibold text-slate-950">{value}</p></div>
            ))}
            <Link href="/report/weekly"><Button className="h-12 w-full"><Wand2 className="mr-2 h-4 w-4" /> Generate Report</Button></Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
