import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, ChevronRight, Circle, Clock, Sparkles, TrendingUp, Users } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const priorities = [
  { name: "Checkout Modernization (v1.0)", status: "At Risk", tone: "bad", eta: "June 18", owner: "Platform Team", impact: "Blocks Q2 commercial launch; 2,000 customers awaiting." },
  { name: "Customer Onboarding Redesign", status: "On Track", tone: "good", eta: "June 22", owner: "Sarah Chen", impact: "Expected to reduce self-serve drop-off by 35%." },
  { name: "Observability & Alerting SLA", status: "Shipped", tone: "good", eta: "Live", owner: "Dev Shah", impact: "P99 checkout latency monitoring active in staging." },
];

const risks = [
  { title: "Payment retry behavior under latency (>1500ms)", impact: "Checkout Launch", owner: "Rahul Verma", action: "Run Staging Pass", tone: "bad" },
  { title: "JWT token refresh race condition during 3DS redirects", impact: "Checkout Conversion", owner: "Isha Patel", action: "Review PR #398", tone: "warn" },
  { title: "Lead payment engineer allocated at 130% workload", impact: "Sprint 14 Velocity", owner: "Dev Shah", action: "Rebalance Load", tone: "warn" },
];

const decisions = [
  { title: "Approve Checkout v1.0 Launch Window?", due: "Friday", detail: "Authorize launch sign-off once PR #412 retry validation passes staging." },
  { title: "Defer Refund API (PAY-245) to Sprint 15?", due: "Today", detail: "Protect primary payment gateway launch date by deferring post-checkout scope." },
  { title: "Merge Redis auth mutex lock patch?", due: "Tomorrow", detail: "Approve PR #398 to eliminate 4.2% session drops during bank OTP challenges." },
];

export default function FounderDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Executive Overview Hero Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Founder & Executive Operating Brief</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Is the company executing?
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Execution health is <strong className="text-amber-400">moderate (82%)</strong>. Core Stripe integration is passing in staging, but launch sign-off is gated on payment retry handling and the 3DS session refresh review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/agent-run">
              <Button className="h-11 px-5">
                <Sparkles className="mr-2 h-4 w-4" /> Ask RAG Agent
              </Button>
            </Link>
            <Link
              href="/report/weekly"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold h-11 px-4 text-xs transition"
            >
              Generate Weekly Brief <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Health Gauge & Mini Stats */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[16rem_1fr] lg:items-center pt-6 border-t border-slate-800/80">
          <div>
            <p className="font-display text-6xl font-bold tracking-tight text-white">82%</p>
            <p className="mt-1 text-xs font-semibold text-amber-400">Moderate Execution Health</p>
            <p className="text-[11px] text-slate-400 mt-0.5">2 critical path items need sign-off</p>
          </div>

          <div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-sky-500 to-indigo-500" />
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MiniStat label="Priorities Tracked" value="3 Active" />
              <MiniStat label="Open Risks" value="3 Watch" />
              <MiniStat label="Decisions Due" value="3 This Week" />
              <MiniStat label="Cost of Delay" value="$4,200/day" />
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Priorities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Strategic Company Priorities
          </h2>
          <Link href="/priorities" className="text-xs font-semibold text-sky-400 hover:text-sky-300">
            View All Priorities →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {priorities.map((priority) => (
            <div
              key={priority.name}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
                  <BriefcaseBusiness className="h-5 w-5 text-sky-400" />
                </div>
                <StatusBadge label={priority.status} tone={priority.tone as "good" | "warn" | "bad"} />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-white">{priority.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{priority.impact}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Target ETA</span>
                  <span className="font-semibold text-slate-200">{priority.eta}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Owner</span>
                  <span className="font-semibold text-slate-200">{priority.owner}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Risks & Decisions Grid */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Risks */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-white">Execution Risks Radar</h2>
              <p className="text-xs text-slate-400">Plain-English risks synthesized from Jira, GitHub, and Slack.</p>
            </div>
            <Link href="/risks" className="text-xs font-semibold text-sky-400 hover:text-sky-300">
              View All (3)
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80">
            {risks.map((risk) => (
              <div key={risk.title} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Circle className={`mt-1 h-3 w-3 shrink-0 fill-current ${risk.tone === "bad" ? "text-red-400" : "text-amber-400"}`} />
                  <div>
                    <p className="text-sm font-semibold text-white">{risk.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Impacts: <span className="text-slate-300">{risk.impact}</span> · Owner: <span className="text-slate-300">{risk.owner}</span>
                    </p>
                  </div>
                </div>
                <Link
                  href="/agent-run"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition shrink-0"
                >
                  {risk.action}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Decisions Needed */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">Decisions Needed</h2>
            <Badge className="bg-sky-500/20 text-sky-300">3 Pending</Badge>
          </div>

          <div className="space-y-3">
            {decisions.map((decision) => (
              <Link
                key={decision.title}
                href="/decisions"
                className="block rounded-xl border border-slate-800 bg-slate-950 p-4 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-bold text-white">{decision.title}</p>
                  <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
                </div>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{decision.detail}</p>
                <p className="mt-2 text-[11px] font-medium text-amber-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Due: {decision.due}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Actions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-sky-400" />
          <h2 className="font-display text-base font-bold text-white">Recommended Executive Actions</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            "Approve launch sign-off contingent on PR #412 passing retry validation.",
            "Confirm deferral of Refund API (PAY-245) to Sprint 15 with Maya Menon.",
            "Protect Rahul Verma's bandwidth from non-essential meetings to ensure launch delivery.",
          ].map((action, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-xs sm:text-sm font-bold text-white">{value}</p>
    </div>
  );
}
