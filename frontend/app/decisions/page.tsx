import { GitBranch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const decisions = [
  { title: "Reduce scope for Checkout v1", due: "June 11", owner: "Jordan Kim", context: "Payments API blocked. Full launch scope is not achievable without a decision.", impact: "$4,000/day deferred revenue", options: ["Reduce scope", "Delay launch"] },
  { title: "Approve contractor budget for API review", due: "June 10", owner: "Founder", context: "External contractor can unblock API spec review in 2 days.", impact: "$500/day idle team time", options: ["Approve", "Reject"] },
  { title: "Make release notes internal-only this week", due: "June 12", owner: "Maya Menon", context: "External release notes need stronger citation cleanup.", impact: "Risk of weak customer-facing attribution", options: ["Internal-only", "Manual external review"] },
];

export default function DecisionsPage() {
  return <div className="space-y-6 reveal-up"><Card className="p-7"><Badge>Decision Queue</Badge><h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">Decisions needed to keep execution moving.</h1><p className="mt-4 max-w-3xl text-base leading-8 text-muted">Each item includes context, options, tradeoffs, owner, and cost of delay.</p></Card><div className="space-y-4">{decisions.map((decision) => <Card key={decision.title} className="p-6"><div className="grid gap-5 lg:grid-cols-[1fr_auto]"><div><div className="flex items-center gap-2"><GitBranch className="h-5 w-5 text-sky-600" /><CardTitle>{decision.title}</CardTitle></div><CardDescription>{decision.context}</CardDescription><div className="mt-4 flex flex-wrap gap-2">{decision.options.map((option) => <Badge key={option}>{option}</Badge>)}</div></div><div className="grid gap-3 sm:grid-cols-3 lg:w-96 lg:grid-cols-1"><Info label="Owner" value={decision.owner} /><Info label="Due" value={decision.due} /><Info label="Cost of delay" value={decision.impact} /></div></div><Button className="mt-5">Prepare recommendation</Button></Card>)}</div></div>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</p><p className="mt-2 text-sm font-semibold text-slate-950">{value}</p></div>; }
