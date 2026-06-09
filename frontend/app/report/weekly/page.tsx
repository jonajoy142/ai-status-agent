"use client";

import { useMemo, useState } from "react";
import { Clipboard, FileText, Loader2, Wand2 } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { apiPost } from "@/lib/api";

const audiences = [
  { label: "Founder / CEO", value: "founder" },
  { label: "Product Manager", value: "product_manager" },
  { label: "Engineering Manager", value: "engineering_manager" },
  { label: "Developer", value: "developer" },
] as const;

const fallbackReport: WeeklyReport = {
  id: "weekly-founder-demo",
  title: "Weekly Execution Brief - June 9, 2026",
  audience: "founder",
  sprint_id: "sprint-24",
  generated_at: "2026-06-09T09:00:00Z",
  executive_summary: "Checkout Launch is at risk. The Payments API dependency has been blocked for 6 days. If unresolved by June 12, launch will likely slip 1-2 weeks and affect the Q2 revenue target.",
  what_shipped: [{ title: "Checkout metrics dashboard", business_impact: "Launch team can monitor funnel and webhook failures.", source: "OBS-042" }],
  what_slipped: [{ title: "Payment retry logic", reason: "Payments API spec missing", business_impact: "Checkout Launch may slip 1-2 weeks." }],
  top_risks: [{ risk: "Payments API dependency blocked", severity: "critical", action: "Escalate to CTO and approve mock-spec fallback today.", owner: "Jordan Kim" }],
  decisions_needed: [{ decision: "Reduce scope for Checkout v1", context: "Full scope is not achievable without API spec.", cost_of_delay: "$4,000/day deferred revenue", owner: "Jordan Kim" }],
  team_health: [{ team_name: "Backend Platform Team", planned_points: 80, completed_points: 25, blocked_items: 5, delivery_confidence: 55 }],
  business_impact: [{ priority_name: "Checkout Launch", status: "at_risk", eta: "June 18, 2026", owner: "Backend Platform Team", business_impact_summary: "Blocks Q2 revenue target. 2,000 users waiting." }],
  action_items: ["Approve reduced Checkout v1 scope or delay launch by June 11.", "Approve contractor budget for API review.", "Reassign two non-critical Full Stack tickets this week."],
  confidence_score: 0.82,
  citations: [{ text: "TICK-231", source_url: "https://jira.example.com/browse/TICK-231", source_type: "jira" }],
  token_usage: 1840,
  model: "demo-structured-generator",
};

type WeeklyReport = {
  id: string;
  title: string;
  audience: string;
  sprint_id: string;
  generated_at: string;
  executive_summary: string;
  what_shipped: Array<Record<string, string>>;
  what_slipped: Array<Record<string, string>>;
  top_risks: Array<Record<string, string>>;
  decisions_needed: Array<Record<string, string>>;
  team_health: Array<Record<string, string | number>>;
  business_impact: Array<Record<string, string>>;
  action_items: string[];
  confidence_score: number;
  citations: Array<Record<string, string>>;
  token_usage: number;
  model: string;
};

export default function WeeklyReportPage() {
  const [audience, setAudience] = useState<(typeof audiences)[number]["value"]>("founder");
  const [report, setReport] = useState<WeeklyReport>(fallbackReport);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const reportText = useMemo(() => [
    report.title,
    "",
    report.executive_summary,
    "",
    "Action items:",
    ...report.action_items.map((item) => `- ${item}`),
    "",
    "Sources:",
    ...report.citations.map((source) => `- ${source.text}: ${source.source_url}`),
  ].join("\n"), [report]);

  async function generate() {
    setIsGenerating(true);
    setNotice(null);
    try {
      const next = await apiPost<WeeklyReport>("/reports/weekly/generate", { audience, project: "Project Phoenix", sprint: "Sprint 24" });
      setReport(next);
      setNotice("Report generated with audience-specific language.");
    } catch {
      setReport({ ...fallbackReport, audience });
      setNotice("Backend unavailable. Showing demo report output.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.36fr_0.64fr] reveal-up">
      <Card className="h-fit p-6">
        <Badge className="bg-sky-50 text-sky-700 ring-1 ring-sky-100">Weekly Report</Badge>
        <CardTitle className="mt-5 text-3xl">Generate an operating brief</CardTitle>
        <CardDescription>The same sprint data is rewritten for the selected audience.</CardDescription>
        <div className="mt-6 space-y-5">
          <Field label="Project" value="Project Phoenix" />
          <Field label="Sprint / Period" value="Sprint 24 (Jun 3-17)" />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Audience</p>
            <div className="mt-3 space-y-2">
              {audiences.map((item) => (
                <label key={item.value} className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50">
                  <input type="radio" name="audience" checked={audience === item.value} onChange={() => setAudience(item.value)} />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Include</p>
            <div className="mt-3 grid gap-2">
              {["What shipped", "What slipped", "Risks and blockers", "Business impact", "Decisions needed", "Team workload", "Action items", "Source citations"].map((item) => <label key={item} className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked readOnly /> {item}</label>)}
            </div>
          </div>
          <Button onClick={generate} disabled={isGenerating} className="h-12 w-full">
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate Report
          </Button>
          {notice ? <p className="rounded-xl bg-slate-50 p-3 text-sm text-muted">{notice}</p> : null}
        </div>
      </Card>

      <Card className="p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div><Badge>{audiences.find((item) => item.value === audience)?.label}</Badge><h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em]">{report.title}</h1></div>
          <div className="flex items-center gap-2"><StatusBadge label={`${Math.round(report.confidence_score * 100)}% confidence`} tone="good" /><CopyButton text={reportText} label="Copy" /></div>
        </div>

        <Section title="Executive Summary"><p className="text-base leading-8 text-slate-800">{report.executive_summary}</p></Section>
        <TwoColumn title="What shipped" rows={report.what_shipped} primaryKey="title" secondaryKey="business_impact" />
        <TwoColumn title="What slipped" rows={report.what_slipped} primaryKey="title" secondaryKey="reason" />
        <TwoColumn title="Top risks" rows={report.top_risks} primaryKey="risk" secondaryKey="action" />
        <TwoColumn title="Decisions needed" rows={report.decisions_needed} primaryKey="decision" secondaryKey="cost_of_delay" />
        <Section title="Action items"><div className="space-y-2">{report.action_items.map((item) => <div key={item} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{item}</div>)}</div></Section>
        <Section title="Sources"><div className="flex flex-wrap gap-2">{report.citations.map((source) => <a key={source.source_url} href={source.source_url} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"><FileText className="h-3.5 w-3.5" />{source.text}</a>)}</div></Section>
        <div className="mt-6 flex items-center gap-2 text-sm text-muted"><Clipboard className="h-4 w-4" /> {report.token_usage.toLocaleString()} tokens · {report.model}</div>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</p><p className="mt-2 text-sm font-semibold text-slate-950">{value}</p></div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-8 border-t border-slate-100 pt-6"><h2 className="font-display text-xl font-semibold tracking-[-0.03em]">{title}</h2><div className="mt-4">{children}</div></section>;
}

function TwoColumn({ title, rows, primaryKey, secondaryKey }: { title: string; rows: Array<Record<string, string>>; primaryKey: string; secondaryKey: string }) {
  return <Section title={title}><div className="space-y-3">{rows.map((row) => <div key={row[primaryKey]} className="rounded-2xl bg-slate-50 p-4"><p className="font-medium text-slate-950">{row[primaryKey]}</p><p className="mt-2 text-sm leading-6 text-muted">{row[secondaryKey]}</p></div>)}</div></Section>;
}
