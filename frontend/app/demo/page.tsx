import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function DemoPage() {
  return (
    <div className="space-y-10 reveal-up">
      <section className="mx-auto max-w-5xl py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100"><Sparkles className="h-5 w-5" /></div>
        <h1 className="mt-7 font-display text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">Jira tracks work. SprintPilot explains what it means.</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">AI operating briefs for founders, PMs, and engineering leaders who need execution clarity without reading every ticket, PR, and Slack thread.</p>
        <div className="mt-8 flex justify-center gap-3"><Link href="/"><Button>Open demo workspace <ArrowRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/pricing" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-slate-200">View pricing</Link></div>
      </section>
      <section className="grid gap-5 md:grid-cols-3">
        {[
          ["Founder brief", "See track status, risks, business impact, and decisions needed."],
          ["PM sprint update", "Find stale tickets, owner follow-ups, blockers, and weekly update drafts."],
          ["Engineering view", "Identify overloaded owners, PR delays, dependency risks, and next actions."],
        ].map(([title, text]) => <Card key={title}><CheckCircle2 className="h-5 w-5 text-sky-600" /><CardTitle className="mt-5">{title}</CardTitle><CardDescription>{text}</CardDescription></Card>)}
      </section>
    </div>
  );
}
