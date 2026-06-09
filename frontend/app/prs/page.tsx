import { GitPullRequest } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const prs = [
  { id: "PR #241", title: "Add payment retry logic", waiting: 4, reviewer: "Marcus Rivera", blocks: "Checkout Launch" },
  { id: "PR #238", title: "Auth token refresh", waiting: 3, reviewer: "Sarah Chen", blocks: "Customer Onboarding" },
  { id: "PR #246", title: "Report citation formatter", waiting: 1, reviewer: "Dr. Priya Nair", blocks: "AI Reporting Automation" },
];

export default function PRsPage() {
  return <div className="space-y-6 reveal-up"><Card className="p-7"><Badge>PRs & Reviews</Badge><h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">Review delays that can affect delivery.</h1><p className="mt-4 max-w-3xl text-base leading-8 text-muted">PRs are framed by what they block, not just by repository activity.</p></Card><div className="space-y-3">{prs.map((pr) => <Card key={pr.id} className="p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><GitPullRequest className="mt-1 h-5 w-5 text-sky-600" /><div><CardTitle>{pr.id} - {pr.title}</CardTitle><CardDescription>Reviewer: {pr.reviewer} · Blocks: {pr.blocks}</CardDescription></div></div><StatusBadge label={`${pr.waiting} days waiting`} tone={pr.waiting >= 3 ? "warn" : "good"} /></div></Card>)}</div></div>;
}
