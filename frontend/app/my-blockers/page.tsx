import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function MyBlockersPage() {
  return <div className="space-y-6 reveal-up"><Card className="p-7"><Badge>My Blockers</Badge><h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">What is stopping your work?</h1><p className="mt-4 max-w-3xl text-base leading-8 text-muted">One active blocker is tied to your highest-priority ticket.</p></Card><Card className="p-6"><div className="flex gap-3"><AlertTriangle className="mt-1 h-5 w-5 text-amber-600" /><div><CardTitle>TICK-231 is blocked by missing Payments API spec</CardTitle><CardDescription>Owner needed: Jordan Kim. The blocker has been stale for 6 days.</CardDescription></div></div><div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">Suggested next action: Ping Jordan Kim today. If no response, proceed with mock-spec fallback and update the ticket.</div><Button className="mt-5">Copy Slack follow-up</Button></Card></div>;
}
