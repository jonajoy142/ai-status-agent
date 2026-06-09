"use client";

import { useEffect, useState, type ComponentType } from "react";
import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { apiGet, type DecisionDto, type RiskDto } from "@/lib/api";
import { decisions as fallbackDecisions, risks as fallbackRisks } from "@/lib/demo-data";

export default function RiskCenterPage() {
  const [data, setData] = useState<{ risks: RiskDto[]; decisions: DecisionDto[] } | null>(null);
  useEffect(() => { apiGet<{ risks: RiskDto[]; decisions: DecisionDto[] }>("/risks").then(setData).catch(() => setData(null)); }, []);
  const riskRows = data?.risks || fallbackRisks.map((risk, i) => ({ id: `risk-${i}`, title: risk.title, level: risk.level.toLowerCase() as "low" | "medium" | "high" | "critical", owner: risk.owner, business_impact: risk.impact, recommended_action: risk.action }));
  const decisionRows = data?.decisions || fallbackDecisions.map((decision, i) => ({ id: `decision-${i}`, title: decision.title, owner: decision.owner, due_date: decision.due, impact_if_delayed: decision.impact }));
  return <div className="space-y-6 reveal-up"><Card className="p-8"><CardTitle className="text-4xl">Risk Center</CardTitle><CardDescription>Founder and PM view of blockers, stale work, decisions, and escalation recommendations.</CardDescription></Card><section className="grid gap-4 md:grid-cols-3"><Summary title="Open risks" value={String(riskRows.length)} icon={AlertTriangle} /><Summary title="Hard blockers" value="1" icon={CheckCircle2} /><Summary title="Decisions needed" value={String(decisionRows.length)} icon={Clock3} /></section><section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]"><Card><CardTitle>Top risks</CardTitle><div className="mt-5 space-y-3">{riskRows.map((risk) => <div key={risk.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><p className="font-medium">{risk.title}</p><StatusBadge label={risk.level} tone={risk.level === "medium" ? "warn" : risk.level === "high" || risk.level === "critical" ? "bad" : "good"} /></div><p className="mt-2 text-sm text-muted">Business impact: {risk.business_impact}</p><p className="mt-2 text-sm text-slate-700">Action: {risk.recommended_action}</p><Badge className="mt-3">Owner: {risk.owner}</Badge></div>)}</div></Card><Card><CardTitle>Decisions needed</CardTitle><div className="mt-5 space-y-3">{decisionRows.map((decision) => <div key={decision.id} className="rounded-2xl bg-slate-50 p-4"><p className="font-medium">{decision.title}</p><p className="mt-2 text-sm text-muted">Owner: {decision.owner} · Due {decision.due_date}</p><p className="mt-2 text-sm text-slate-700">Impact if delayed: {decision.impact_if_delayed}</p></div>)}</div></Card></section></div>;
}
function Summary({ title, value, icon: Icon }: { title: string; value: string; icon: ComponentType<{ className?: string }> }) { return <Card><Icon className="h-5 w-5 text-sky-600" /><p className="mt-4 text-sm text-muted">{title}</p><p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{value}</p></Card>; }
