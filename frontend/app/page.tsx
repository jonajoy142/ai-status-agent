import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Database, FileText, GitBranch, Radar } from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const traces = [
  { agent: "supervisor", step: "planned workflow", time: "14s ago" },
  { agent: "status", step: "searched project.search_tickets", time: "12s ago" },
  { agent: "risk", step: "ranked blocker signals", time: "10s ago" },
  { agent: "documentation", step: "generated report", time: "8s ago" },
];

const reports = [
  { title: "Checkout launch readiness", status: "Medium risk", owner: "Payments", time: "Today" },
  { title: "Sprint 14 stakeholder update", status: "On track", owner: "Platform", time: "Yesterday" },
  { title: "Release notes automation", status: "Needs citations", owner: "DevEx", time: "Jun 6" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 reveal-up">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="relative overflow-hidden p-7 sm:p-8">
          <div className="absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-blue-500/10 blur-2xl sm:block" />
          <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-950 dark:bg-blue-950 dark:text-blue-300">
            Built for Jira-connected engineering workflows
          </Badge>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Status updates, risks, and reports from your engineering systems.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            StatusPilot AI sits on top of tickets, docs, and team updates to generate source-backed project intelligence for engineering leads.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/agent-run">
              <Button>
                Run Agent <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/reports" className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-100 dark:hover:bg-slate-900">
              View reports
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <CardTitle>System status</CardTitle>
            <StatusBadge label="Online" tone="good" />
          </div>
          <div className="mt-6 space-y-4">
            {[
              ["Agent API", "Healthy", "good"],
              ["Vector retrieval", "Local index", "good"],
              ["MCP tools", "3 enabled", "good"],
              ["Jira connector", "Ready later", "neutral"],
            ].map(([label, value, tone]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-border bg-slate-50/70 px-4 py-3 dark:bg-slate-950/40">
                <span className="text-sm text-muted">{label}</span>
                <StatusBadge label={value} tone={tone as "good" | "neutral"} />
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Total agent runs" value="128" detail="Demo workspace activity" trend="+18%" />
        <MetricCard label="Latest reports" value="12" detail="Generated this sprint" trend="4 today" />
        <MetricCard label="Open risks" value="3" detail="1 medium, 2 low" trend="stable" />
        <MetricCard label="KB documents" value="12" detail="Tickets, docs, chat" trend="indexed" />
        <MetricCard label="Eval score" value="92%" detail="Faithfulness baseline" trend="pass" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Latest status reports</CardTitle>
              <CardDescription>Generated project updates ready for review or export.</CardDescription>
            </div>
            <FileText className="h-5 w-5 text-muted" />
          </div>
          <div className="mt-5 space-y-3">
            {reports.map((report) => (
              <div key={report.title} className="rounded-xl border border-border bg-card p-4 transition hover:border-slate-300 dark:hover:border-slate-700">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium">{report.title}</p>
                  <span className="text-xs text-muted">{report.time}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge>{report.owner}</Badge>
                  <Badge>{report.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Recent traces</CardTitle>
              <CardDescription>Agent execution path for the latest report run.</CardDescription>
            </div>
            <GitBranch className="h-5 w-5 text-muted" />
          </div>
          <div className="mt-5 space-y-3">
            {traces.map((trace, index) => (
              <div key={`${trace.agent}-${trace.step}`} className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-3 rounded-xl border border-border bg-slate-50/70 p-3 dark:bg-slate-950/40">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">{index + 1}</span>
                <div>
                  <p className="text-sm font-medium">{trace.step}</p>
                  <p className="text-xs text-muted">{trace.agent} agent</p>
                </div>
                <span className="text-xs text-muted">{trace.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { icon: Bot, title: "Agent orchestration", text: "Supervisor routes work to status, risk, and documentation agents." },
          { icon: Database, title: "Knowledge layer", text: "Ticket, chat, and document evidence with metadata and citations." },
          { icon: Radar, title: "Risk intelligence", text: "Highlights blocker signals before sprint updates drift." },
          { icon: CheckCircle2, title: "Eval-ready outputs", text: "Structured reports expose confidence, traces, and quality scoring." },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="p-5">
              <Icon className="h-5 w-5 text-muted" />
              <p className="mt-4 font-medium">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
