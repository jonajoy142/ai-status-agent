import { Users } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const teams = [
  { name: "Full Stack Team", lead: "Sarah Chen", capacity: 105, completed: 44, blocked: 3, confidence: 72, risk: "Medium" },
  { name: "Agentic AI Team", lead: "Dr. Priya Nair", capacity: 90, completed: 38, blocked: 1, confidence: 85, risk: "Low" },
  { name: "Backend Platform Team", lead: "Jordan Kim", capacity: 80, completed: 25, blocked: 5, confidence: 55, risk: "High" },
  { name: "Algorithm / Pricing Team", lead: "Dr. Elena Vasquez", capacity: 60, completed: 32, blocked: 0, confidence: 88, risk: "Low" },
];

export default function TeamsPage() {
  return <div className="space-y-6 reveal-up"><Card className="p-7"><Badge>Team Health</Badge><h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">Capacity, blockers, and delivery confidence by team.</h1><p className="mt-4 max-w-3xl text-base leading-8 text-muted">Built for leaders who need to see where execution risk is coming from without opening every ticket.</p></Card><section className="grid gap-5 md:grid-cols-2">{teams.map((team) => <Card key={team.name} className="p-6"><div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50"><Users className="h-5 w-5 text-sky-600" /></div><StatusBadge label={`${team.confidence}% confidence`} tone={team.confidence < 60 ? "bad" : team.confidence < 80 ? "warn" : "good"} /></div><CardTitle className="mt-5">{team.name}</CardTitle><CardDescription>Lead: {team.lead}</CardDescription><div className="mt-5 grid gap-3 sm:grid-cols-3"><Info label="Capacity" value={`${team.completed}/${team.capacity} pts`} /><Info label="Blocked" value={String(team.blocked)} /><Info label="Risk" value={team.risk} /></div></Card>)}</section></div>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</p><p className="mt-2 text-sm font-semibold text-slate-950">{value}</p></div>; }
