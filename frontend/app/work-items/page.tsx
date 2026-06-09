"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { apiGet, type WorkItemDto } from "@/lib/api";
import { workItems as fallbackItems } from "@/lib/demo-data";

export default function WorkItemsPage() {
  const [items, setItems] = useState<WorkItemDto[] | null>(null);

  useEffect(() => {
    apiGet<{ work_items: WorkItemDto[] }>("/work-items").then((data) => setItems(data.work_items)).catch(() => setItems(null));
  }, []);

  const rows = items || fallbackItems.map((item) => ({ id: item.id, external_id: item.id, title: item.title, status: item.status, priority: item.priority, assignee: item.assignee, sprint: item.sprint, source: item.source, risk_level: item.risk.toLowerCase() as "low" | "medium" | "high", stale_score: item.stale, business_impact: item.impact, suggested_next_action: item.next }));

  return (
    <div className="space-y-6 reveal-up">
      <Card className="p-8"><CardTitle className="text-4xl">Work Items</CardTitle><CardDescription>AI-enriched task view across Jira, ClickUp, GitHub, and future connectors.</CardDescription></Card>
      <Card className="p-4"><div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"><Search className="h-4 w-4 text-muted" /><span className="text-sm text-muted">Search by ticket, owner, blocker, business impact, or suggested next action</span></div></Card>
      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr_0.8fr_1fr] gap-4 border-b border-border bg-slate-50 px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-muted"><span>Work</span><span>Status</span><span>Owner</span><span>Risk</span><span>Stale</span><span>Next action</span></div>
        {rows.map((item) => <div key={item.id} className="grid grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr_0.8fr_1fr] gap-4 border-b border-border px-5 py-4 text-sm last:border-b-0"><div><p className="font-medium text-slate-900">{item.external_id}: {item.title}</p><p className="mt-1 text-xs text-muted">{item.source} · {item.business_impact}</p></div><Badge>{item.status}</Badge><span>{item.assignee}</span><StatusBadge label={item.risk_level} tone={item.risk_level === "medium" ? "warn" : item.risk_level === "high" ? "bad" : "good"} /><span>{item.stale_score}</span><span className="inline-flex items-start gap-2 text-slate-700">{item.suggested_next_action}<ArrowUpRight className="mt-0.5 h-3.5 w-3.5 text-muted" /></span></div>)}
      </Card>
    </div>
  );
}
