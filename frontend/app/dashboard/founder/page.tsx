import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ChevronRight, Circle, Clock, Users } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const priorities = [
  { name: "Customer Onboarding", status: "On Track", tone: "good", eta: "June 18", owner: "Sarah Chen", impact: "Reduces onboarding drop-off by roughly 35%." },
  { name: "AI Reporting Automation", status: "Delayed 4 days", tone: "warn", eta: "June 22", owner: "Dr. Priya Nair", impact: "Delays internal PM adoption; low external impact." },
  { name: "Checkout Launch", status: "At Risk", tone: "bad", eta: "TBD", owner: "Platform Team", impact: "Blocks Q2 revenue target; 2,000 users waiting." },
];

const risks = [
  { title: "Payments API dependency blocked 6 days", impact: "Checkout Launch", owner: "Jordan Kim", action: "Escalate now", tone: "bad" },
  { title: "Backend team at 130% planned capacity", impact: "3 projects", owner: "Sarah Chen", action: "Review team", tone: "warn" },
  { title: "8 tickets stale for over 10 days", impact: "Sprint predictability", owner: "Maya Menon", action: "Review work", tone: "warn" },
];

const decisions = [
  { title: "Reduce scope for Checkout v1", due: "Today", detail: "Ship without retry logic or delay launch." },
  { title: "Approve contractor budget", due: "June 10", detail: "$800 spend can unblock API review in 2 days." },
  { title: "Delay release by 1 week?", due: "Awaiting PM + CTO", detail: "Decision needed if API spec is not delivered." },
];

export default function FounderDashboardPage() {
  return (
    <div className="space-y-7 reveal-up">
      <Card className="overflow-hidden border-0 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.07)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <Badge className="bg-sky-50 text-sky-700 ring-1 ring-sky-100">Founder overview</Badge>
            <h1 className="mt-5 font-display text-5xl font-semibold tracking-[-0.06em]">Is the company executing?</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted">Execution health is moderate. Two priorities are at risk and three decisions need leadership input this week.</p>
          </div>
          <Link href="/report/weekly"><Button className="h-12 px-5">Generate My Weekly Brief <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[18rem_1fr] lg:items-center">
          <div>
            <p className="font-display text-7xl font-semibold tracking-[-0.08em]">78%</p>
            <p className="mt-2 text-sm font-medium text-amber-700">Moderate execution health</p>
          </div>
          <div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[78%] rounded-full bg-sky-500" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MiniStat label="Priorities at risk" value="2" />
              <MiniStat label="Decisions pending" value="3" />
              <MiniStat label="Cost of delay" value="$4k/day" />
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-5 lg:grid-cols-3">
        {priorities.map((priority) => (
          <Card key={priority.name} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-100"><BriefcaseBusiness className="h-5 w-5 text-slate-500" /></div>
              <StatusBadge label={priority.status} tone={priority.tone as "good" | "warn" | "bad"} />
            </div>
            <CardTitle className="mt-5 text-xl">{priority.name}</CardTitle>
            <CardDescription>{priority.impact}</CardDescription>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniStat label="ETA" value={priority.eta} />
              <MiniStat label="Owner" value={priority.owner} />
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div><CardTitle>Top risks</CardTitle><CardDescription>Plain-English risks that can change company execution this week.</CardDescription></div>
            <Link href="/risks" className="text-sm font-semibold text-sky-700">View all</Link>
          </div>
          <div className="mt-5 divide-y divide-slate-100">
            {risks.map((risk) => (
              <div key={risk.title} className="grid gap-4 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="flex gap-3">
                  <Circle className={`mt-1 h-3 w-3 fill-current ${risk.tone === "bad" ? "text-red-500" : "text-amber-500"}`} />
                  <div><p className="font-medium text-slate-950">{risk.title}</p><p className="mt-1 text-sm text-muted">Impacts: {risk.impact} · Owner: {risk.owner}</p></div>
                </div>
                <Button className="h-10 px-4">{risk.action}</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between"><CardTitle>Decisions needed</CardTitle><Badge>3</Badge></div>
          <div className="mt-5 space-y-3">
            {decisions.map((decision) => (
              <Link key={decision.title} href="/decisions" className="block rounded-2xl bg-slate-50 p-4 transition hover:bg-sky-50">
                <div className="flex items-start justify-between gap-3"><p className="font-medium text-slate-950">{decision.title}</p><ChevronRight className="h-4 w-4 text-slate-400" /></div>
                <p className="mt-2 text-sm leading-6 text-muted">{decision.detail}</p>
                <p className="mt-3 flex items-center gap-1 text-xs font-medium text-amber-700"><Clock className="h-3.5 w-3.5" /> Due: {decision.due}</p>
              </Link>
            ))}
          </div>
          <Link href="/report/weekly" className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Generate weekly brief</Link>
        </Card>
      </section>

      <Card className="p-6">
        <div className="flex items-center gap-2"><Users className="h-5 w-5 text-sky-600" /><CardTitle>Recommended leadership actions</CardTitle></div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            "Decide whether Checkout v1 ships with reduced scope.",
            "Approve or reject contractor budget for API review.",
            "Move non-critical work away from the overloaded Full Stack team.",
          ].map((action) => <div key={action} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{action}</div>)}
        </div>
      </Card>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</p><p className="mt-2 text-sm font-semibold text-slate-950">{value}</p></div>;
}
