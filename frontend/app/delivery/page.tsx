import { BarChart2 } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const rows = [["Checkout Launch", 55, "Backend Platform Team"], ["AI Reporting Automation", 85, "Agentic AI Team"], ["Customer Onboarding Revamp", 72, "Full Stack Team"], ["Pricing Engine Upgrade", 88, "Algorithm Team"]] as const;

export default function DeliveryPage() {
  return <div className="space-y-6 reveal-up"><Card className="p-7"><Badge>Delivery Confidence</Badge><h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">Can each priority land on time?</h1><p className="mt-4 max-w-3xl text-base leading-8 text-muted">Confidence combines progress, blockers, PR delays, owner capacity, and decision latency.</p></Card><Card className="p-6"><div className="space-y-5">{rows.map(([name, score, team]) => <div key={name}><div className="flex items-center justify-between"><div className="flex items-center gap-2"><BarChart2 className="h-4 w-4 text-sky-600" /><p className="font-medium text-slate-950">{name}</p></div><StatusBadge label={`${score}%`} tone={score < 60 ? "bad" : score < 80 ? "warn" : "good"} /></div><p className="mt-1 text-sm text-muted">Owner: {team}</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky-500" style={{ width: `${score}%` }} /></div></div>)}</div></Card></div>;
}
