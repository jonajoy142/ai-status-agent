import Link from "next/link";
import { ArrowRight, Bell, CalendarDays, CheckCircle2, CircleAlert, GitPullRequest, TrendingUp } from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const changes = [
  { title: "Stripe webhook verification passed in staging", owner: "Rahul", time: "Mon" },
  { title: "Auth refresh fix moved to review", owner: "Isha", time: "Tue" },
  { title: "Checkout metrics became available", owner: "Dev", time: "Wed" },
  { title: "Release note citations still need cleanup", owner: "Nora", time: "Fri" },
];

const attention = [
  "Payment retry behavior needs one more staging pass before launch sign-off.",
  "AUTH-118 should remain visible because checkout sessions depend on it.",
  "Release notes are useful internally but not yet ready for external stakeholders.",
];

export default function DashboardPage() {
  return (
    <div className="space-y-7 reveal-up">
      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-white to-sky-50/70 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-10">
          <Badge className="bg-sky-50 text-sky-700 ring-1 ring-sky-100">Weekly operating view</Badge>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
            Are we on track? What needs attention? What changed this week?
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            SprintPilot.AI turns tickets, docs, and team updates into a concise operating brief for founders, product leads, and engineering managers.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/agent-run">
              <Button>
                Run weekly brief <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/reports" className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-50">
              Open latest report
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <CardTitle>Launch outlook</CardTitle>
            <StatusBadge label="Mostly on track" tone="warn" />
          </div>
          <p className="mt-5 font-display text-4xl font-semibold tracking-[-0.045em]">83%</p>
          <p className="mt-2 text-sm leading-6 text-muted">Confidence based on ticket progress, recent updates, and launch criteria.</p>
          <div className="mt-6 space-y-3">
            {[
              ["Payment work", "In progress", "warn"],
              ["Auth stability", "In review", "warn"],
              ["Launch metrics", "Ready", "good"],
            ].map(([label, value, tone]) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-sm text-muted">{label}</span>
                <StatusBadge label={value} tone={tone as "good" | "warn"} />
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Are we on track?" value="Mostly" detail="Launch can proceed after one focused staging pass." trend="83%" />
        <MetricCard label="What is blocked?" value="0" detail="No hard blockers; 2 watch items need owner attention." trend="clear" />
        <MetricCard label="Needs attention" value="3" detail="Retry handling, auth stability, release-note citations." trend="this week" />
        <MetricCard label="Changed this week" value="4" detail="Key updates across payments, auth, metrics, release notes." trend="fresh" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>What should I pay attention to?</CardTitle>
              <CardDescription>Ranked items for the next product or leadership sync.</CardDescription>
            </div>
            <Bell className="h-5 w-5 text-sky-600" />
          </div>
          <div className="mt-5 space-y-3">
            {attention.map((item, index) => (
              <div key={item} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-700 ring-1 ring-slate-200">{index + 1}</span>
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>What changed this week?</CardTitle>
              <CardDescription>Important movement distilled from project evidence.</CardDescription>
            </div>
            <CalendarDays className="h-5 w-5 text-sky-600" />
          </div>
          <div className="mt-5 space-y-3">
            {changes.map((change) => (
              <div key={change.title} className="grid grid-cols-[1fr_auto] gap-4 rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">{change.title}</p>
                  <p className="mt-1 text-xs text-muted">Owner: {change.owner}</p>
                </div>
                <Badge>{change.time}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Card className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Latest status report</CardTitle>
              <CardDescription>Executive-ready summary generated from project context.</CardDescription>
            </div>
            <StatusBadge label="Medium risk" tone="warn" />
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="text-base leading-8 text-slate-800">
              Checkout launch is progressing, but should remain in medium-risk status until payment retry behavior and session refresh reliability pass one more staging validation.
            </p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ["Owners", "Rahul, Isha, Nora"],
              ["Next decision", "Launch sign-off"],
              ["Recommended action", "Run staging pass"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <CardTitle>Signals behind the brief</CardTitle>
          <CardDescription>High-level evidence categories, not implementation internals.</CardDescription>
          <div className="mt-5 grid gap-3">
            {[
              { icon: GitPullRequest, title: "Ticket movement", text: "Payment and auth work advanced this week." },
              { icon: CircleAlert, title: "Risk signal", text: "Retry behavior still needs validation." },
              { icon: CheckCircle2, title: "Done signal", text: "Launch metrics are now visible." },
              { icon: TrendingUp, title: "Confidence trend", text: "Status improved from last week." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="grid grid-cols-[2rem_1fr] gap-3 rounded-2xl bg-slate-50 p-4">
                  <Icon className="mt-0.5 h-4 w-4 text-sky-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </div>
  );
}
