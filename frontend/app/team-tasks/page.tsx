import { Users } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { workItems } from "@/lib/demo-data";

export default function TeamTasksPage() {
  return <div className="space-y-6 reveal-up"><Card className="p-7"><Badge>Team Tasks</Badge><h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">Nearby work that affects your tasks.</h1><p className="mt-4 max-w-3xl text-base leading-8 text-muted">Useful context for dependencies without turning the developer view into a manager dashboard.</p></Card><div className="grid gap-4 md:grid-cols-2">{workItems.slice(0, 4).map((item) => <Card key={item.id} className="p-5"><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><Users className="mt-1 h-5 w-5 text-sky-600" /><div><p className="font-mono text-xs text-muted">{item.id}</p><CardTitle className="mt-1">{item.title}</CardTitle><CardDescription>{item.assignee} · {item.status}</CardDescription></div></div><StatusBadge label={item.risk} tone={item.risk === "Medium" ? "warn" : "good"} /></div></Card>)}</div></div>;
}
