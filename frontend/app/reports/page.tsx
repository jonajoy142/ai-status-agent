import Link from "next/link";
import { ArrowRight, FileBadge, ListChecks, Radar } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const reportText = "Checkout launch is progressing with medium risk. Stripe gateway work is in progress, observability is live, and the remaining launch concern is retry-safe payment handling plus auth session stability.";

export default function ReportsPage() {
  return (
    <div className="space-y-6 reveal-up">
      <Card className="grid gap-6 p-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <Badge>Reports</Badge>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">Project reports your team can actually use.</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
            Generate sprint summaries, risk summaries, and action items from source-backed agent runs. Designed to replace manual Jira status rollups, not to look like a toy chatbot.
          </p>
        </div>
        <Link href="/agent-run">
          <Button>
            Generate report <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </Card>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          { icon: FileBadge, title: "Sprint summary", text: "What changed, who owns it, and what is ready for leadership review." },
          { icon: Radar, title: "Risk summary", text: "Blockers, severity, source evidence, and recommended escalation paths." },
          { icon: ListChecks, title: "Action items", text: "Next steps assigned from agent-generated project intelligence." },
        ].map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title}>
              <Icon className="h-5 w-5 text-muted" />
              <CardTitle className="mt-5">{section.title}</CardTitle>
              <CardDescription>{section.text}</CardDescription>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Card className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Report preview</CardTitle>
              <CardDescription>Checkout launch readiness · generated today</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge label="Medium risk" tone="warn" />
              <CopyButton text={reportText} label="Copy" />
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-border bg-slate-50/70 p-5 dark:bg-slate-950/40">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted">Executive summary</p>
            <p className="mt-4 text-base leading-8">{reportText}</p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ["Active work", "PAY-231, AUTH-118, REL-077"],
              ["Owners", "Rahul, Isha, Nora"],
              ["Next step", "Run staging validation"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border p-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
                <p className="mt-2 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Generated reports</CardTitle>
          <div className="mt-5 space-y-3">
            {[
              ["Checkout launch readiness", "Medium risk", "Today"],
              ["Sprint 14 summary", "On track", "Yesterday"],
              ["Release notes automation", "Needs review", "Jun 6"],
            ].map(([title, status, date]) => (
              <div key={title} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{title}</p>
                  <span className="text-xs text-muted">{date}</span>
                </div>
                <div className="mt-3"><Badge>{status}</Badge></div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
