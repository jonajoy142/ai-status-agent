import Link from "next/link";
import { ArrowRight, GitPullRequest, Users } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const capacity = [
  { engineer: "Sarah Chen", planned: 40, actual: 52, load: "130%", status: "Overloaded", tone: "bad" },
  { engineer: "Marcus Rivera", planned: 35, actual: 33, load: "94%", status: "On Track", tone: "good" },
  { engineer: "Alex Torres", planned: 30, actual: 28, load: "93%", status: "Blocked", tone: "warn" },
  { engineer: "Jordan Kim", planned: 25, actual: 18, load: "72%", status: "Dependency owner", tone: "warn" },
];

const prs = [
  { id: "PR #241", title: "Add payment retry logic", waiting: "4 days", reviewer: "Marcus Rivera", blocks: "Checkout Launch" },
  { id: "PR #238", title: "Auth token refresh", waiting: "3 days", reviewer: "Sarah Chen", blocks: "Customer Onboarding" },
];

export default function EngineeringManagerDashboardPage() {
  return (
    <div className="space-y-7 reveal-up">
      <Card className="grid gap-6 p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <Badge className="bg-sky-50 text-sky-700 ring-1 ring-sky-100">Team overview</Badge>
          <h1 className="mt-5 font-display text-5xl font-semibold tracking-[-0.06em]">Who is blocked and can we still deliver?</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted">Delivery confidence is constrained by review delays, a missing Payments API spec, and uneven team capacity.</p>
        </div>
        <Link href="/teams"><Button className="h-12 px-5">View Team Health <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2"><Users className="h-5 w-5 text-sky-600" /><CardTitle>Team Capacity - Sprint 24</CardTitle></div>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-muted"><tr><th className="px-4 py-3">Engineer</th><th>Planned</th><th>Actual</th><th>Load</th><th>Status</th></tr></thead>
            <tbody>
              {capacity.map((row) => <tr key={row.engineer} className="border-t border-slate-100"><td className="px-4 py-4 font-medium text-slate-950">{row.engineer}</td><td>{row.planned} pts</td><td>{row.actual} pts</td><td>{row.load}</td><td><StatusBadge label={row.status} tone={row.tone as "good" | "warn" | "bad"} /></td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="p-6">
          <div className="flex items-center gap-2"><GitPullRequest className="h-5 w-5 text-sky-600" /><CardTitle>PRs awaiting review</CardTitle></div>
          <CardDescription>Review delays over two days that are blocking delivery.</CardDescription>
          <div className="mt-5 space-y-3">
            {prs.map((pr) => <div key={pr.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><p className="font-medium text-slate-950">{pr.id} - {pr.title}</p><StatusBadge label={pr.waiting} tone="warn" /></div><p className="mt-2 text-sm text-muted">Reviewer: {pr.reviewer} · Blocks: {pr.blocks}</p></div>)}
          </div>
        </Card>
        <Card className="p-6">
          <CardTitle>Delivery confidence</CardTitle>
          <div className="mt-5 space-y-4">
            {[["Checkout Launch", 55, "bad"], ["AI Reporting Automation", 85, "good"], ["Customer Onboarding", 72, "warn"]].map(([name, score, tone]) => (
              <div key={name as string}>
                <div className="flex items-center justify-between text-sm"><span className="font-medium text-slate-950">{name}</span><StatusBadge label={`${score}%`} tone={tone as "good" | "warn" | "bad"} /></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky-500" style={{ width: `${score}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
