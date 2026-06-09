import { Target } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const priorities = [
  { name: "Checkout Launch", status: "At Risk", tone: "bad", eta: "June 18, 2026", owner: "Backend Platform Team", impact: "Blocks Q2 revenue target. 2,000 users waiting." },
  { name: "AI Reporting Automation", status: "Delayed", tone: "warn", eta: "June 22, 2026", owner: "Agentic AI Team", impact: "Delays internal PM adoption." },
  { name: "Customer Onboarding Revamp", status: "On Track", tone: "good", eta: "June 18, 2026", owner: "Full Stack Team", impact: "Reduces onboarding drop-off by roughly 35%." },
  { name: "Pricing Engine Upgrade", status: "On Track", tone: "good", eta: "June 25, 2026", owner: "Algorithm Team", impact: "Enables dynamic pricing for enterprise tier." },
];

export default function PrioritiesPage() {
  return <div className="space-y-6 reveal-up"><Card className="p-7"><Badge>Business Priorities</Badge><h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">What business outcomes are moving?</h1><p className="mt-4 max-w-3xl text-base leading-8 text-muted">Initiatives translated from sprint activity into founder-readable execution status.</p></Card><section className="grid gap-5 md:grid-cols-2">{priorities.map((priority) => <Card key={priority.name} className="p-6"><div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50"><Target className="h-5 w-5 text-sky-600" /></div><StatusBadge label={priority.status} tone={priority.tone as "good" | "warn" | "bad"} /></div><CardTitle className="mt-5">{priority.name}</CardTitle><CardDescription>{priority.impact}</CardDescription><div className="mt-5 grid gap-3 sm:grid-cols-2"><Info label="ETA" value={priority.eta} /><Info label="Owner" value={priority.owner} /></div></Card>)}</section></div>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</p><p className="mt-2 text-sm font-semibold text-slate-950">{value}</p></div>; }
