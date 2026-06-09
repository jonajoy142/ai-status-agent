import { GitPullRequest } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function MyPRsPage() {
  return <div className="space-y-6 reveal-up"><Card className="p-7"><Badge>My PRs</Badge><h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">PRs waiting on review.</h1><p className="mt-4 max-w-3xl text-base leading-8 text-muted">Developer view shows what needs action today, not team-wide reporting noise.</p></Card><Card className="p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><GitPullRequest className="mt-1 h-5 w-5 text-sky-600" /><div><CardTitle>PR #241 - Add payment retry logic</CardTitle><CardDescription>Awaiting review for 4 days · Reviewer: Marcus Rivera · Blocks Checkout Launch</CardDescription></div></div><StatusBadge label="Needs follow-up" tone="warn" /></div><Button className="mt-5">Ping reviewer</Button></Card></div>;
}
