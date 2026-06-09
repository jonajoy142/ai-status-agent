import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, GitPullRequest } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const tasks = [
  { id: "TICK-231", title: "Fix retry logic in payments module", status: "In Progress", estimate: "4h", blocker: "Waiting on Payments API spec from Jordan", ai: "Ping Jordan and proceed with mock-spec fallback if no response today." },
  { id: "TICK-245", title: "Update API docs", status: "Todo", estimate: "2h", blocker: null, ai: "Start after retry logic is validated." },
  { id: "REL-077", title: "Clean report citation formatting", status: "Todo", estimate: "1h", blocker: null, ai: "Use TICK-231 and PR #241 as source examples." },
];

export default function DeveloperDashboardPage() {
  return (
    <div className="space-y-7 reveal-up">
      <Card className="grid gap-6 p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <Badge className="bg-sky-50 text-sky-700 ring-1 ring-sky-100">My tasks</Badge>
          <h1 className="mt-5 font-display text-5xl font-semibold tracking-[-0.06em]">Good morning, Alex.</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">Your focus today is payment retry logic, PR review follow-up, and keeping your blocker visible.</p>
        </div>
        <Link href="/my-blockers"><Button className="h-12 px-5">View My Tasks <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
      </Card>

      <Card className="p-6">
        <CardTitle>Your focus today</CardTitle>
        <CardDescription>Three tasks, ordered by launch impact.</CardDescription>
        <div className="mt-5 space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-2xl bg-slate-50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  {task.blocker ? <AlertTriangle className="mt-1 h-5 w-5 text-amber-600" /> : <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600" />}
                  <div><p className="font-mono text-xs text-muted">{task.id}</p><p className="mt-1 font-medium text-slate-950">{task.title}</p><p className="mt-2 text-sm text-muted">Status: {task.status} · Est: {task.estimate}</p></div>
                </div>
                <StatusBadge label={task.blocker ? "Blocked" : "Ready"} tone={task.blocker ? "warn" : "good"} />
              </div>
              {task.blocker ? <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Blocked: {task.blocker}</p> : null}
              <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm leading-6 text-slate-700 ring-1 ring-slate-200">AI says: {task.ai}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2"><GitPullRequest className="h-5 w-5 text-sky-600" /><CardTitle>My PRs</CardTitle></div>
        <div className="mt-5 rounded-2xl bg-slate-50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium text-slate-950">PR #241 - Add payment retry logic</p><p className="mt-1 text-sm text-muted">Awaiting review for 4 days · Reviewer: Marcus Rivera</p></div><div className="flex gap-2"><Button>Ping reviewer</Button><Link href="/my-prs" className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200">View PR</Link></div></div>
        </div>
      </Card>
    </div>
  );
}
