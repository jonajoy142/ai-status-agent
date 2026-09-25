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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Executive Overview Hero Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span>Founder & Executive Lens</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Is the company executing?
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Execution health is <strong className="text-amber-700">moderate (82%)</strong>. Core Stripe integration is passing in staging, but launch sign-off is gated on payment retry handling and the 3DS session refresh review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/agent-run">
              <Button className="h-9 px-4 text-xs">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Ask RAG Agent
              </Button>
            </Link>
            <Link
              href="/report/weekly"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium h-9 px-3.5 text-xs shadow-xs transition"
            >
              Weekly Brief <ArrowRight className="ml-1 h-3 w-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Health Gauge & Mini Stats */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[14rem_1fr] lg:items-center pt-5 border-t border-slate-100">
          <div>
            <p className="font-display text-5xl font-bold tracking-tight text-slate-900">82%</p>
            <p className="mt-1 text-xs font-semibold text-amber-700">Moderate Execution Health</p>
            <p className="text-[11px] text-slate-400 mt-0.5">2 critical path items need sign-off</p>
          </div>

          <div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[82%] rounded-full bg-slate-900" />
            </div>
            <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <MiniStat label="Priorities" value="3 Active" />
              <MiniStat label="Risks" value="3 Tracked" />
              <MiniStat label="Decisions" value="3 Due" />
              <MiniStat label="Cost of Delay" value="$4,200/day" />
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Priorities */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Strategic Company Priorities
          </h2>
          <Link href="/priorities" className="text-xs font-medium text-blue-600 hover:text-blue-500">
            View All Priorities →
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {priorities.map((priority) => (
            <div
              key={priority.name}
              className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <BriefcaseBusiness className="h-4 w-4" />
                </div>
                <StatusBadge label={priority.status} tone={priority.tone as "good" | "warn" | "bad"} />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-display text-base font-bold text-slate-900">{priority.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{priority.impact}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">ETA</span>
                  <span className="font-semibold text-slate-800">{priority.eta}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Owner</span>
                  <span className="font-semibold text-slate-800">{priority.owner}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Risks & Decisions Grid */}
      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Risks */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900">Execution Risks Radar</h2>
              <p className="text-xs text-slate-500">Synthesized from Jira, GitHub, and Slack.</p>
            </div>
            <Link href="/risks" className="text-xs font-medium text-blue-600 hover:text-blue-500">
              View All (3)
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {risks.map((risk) => (
              <div key={risk.title} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-start gap-2.5">
                  <Circle className={`mt-1 h-2.5 w-2.5 shrink-0 fill-current ${risk.tone === "bad" ? "text-rose-600" : "text-amber-600"}`} />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900">{risk.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Impacts: <span className="text-slate-700">{risk.impact}</span> · Owner: <span className="text-slate-700">{risk.owner}</span>
                    </p>
                  </div>
                </div>
                <Link
                  href="/agent-run"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs transition shrink-0"
                >
                  {risk.action}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Decisions Needed */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900">Decisions Needed</h2>
            <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              3 Pending
            </span>
          </div>

          <div className="space-y-2.5">
            {decisions.map((decision) => (
              <Link
                key={decision.title}
                href="/decisions"
                className="block rounded-xl border border-slate-200 bg-slate-50/60 p-3 hover:bg-slate-50 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900">{decision.title}</p>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </div>
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{decision.detail}</p>
                <p className="mt-1.5 text-[11px] font-medium text-amber-700 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Due: {decision.due}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Actions */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-600" />
          <h2 className="font-display text-sm font-bold text-slate-900">Recommended Executive Actions</h2>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {[
            "Approve launch sign-off contingent on PR #412 passing retry validation.",
            "Confirm deferral of Refund API (PAY-245) to Sprint 15 with Maya Menon.",
            "Protect Rahul Verma's bandwidth from non-essential meetings to ensure launch delivery.",
          ].map((action, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 leading-relaxed flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
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
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-0.5 text-xs sm:text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}
