"use client";

import { useState, type ReactNode } from "react";
import { Activity, CheckCircle2, Clipboard, Clock, FileSearch, Loader2, SendHorizontal, Sparkles } from "lucide-react";

import { runAgent, sampleAgentRun, type AgentRunResponse } from "@/lib/api";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const EXAMPLE = "What is the current checkout launch status and risk?";

export function AgentRunClient() {
  const [question, setQuestion] = useState(EXAMPLE);
  const [result, setResult] = useState<AgentRunResponse | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onRun() {
    setIsLoading(true);
    setNotice(null);
    try {
      setResult(await runAgent(question));
      setNotice("Agent run completed.");
    } catch {
      setResult({ ...sampleAgentRun, question });
      setNotice("Backend unavailable. Showing sample StatusPilot run data.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyReport() {
    const text = result?.report.executive_summary || sampleAgentRun.report.executive_summary;
    await navigator.clipboard.writeText(text);
    setNotice("Report copied to clipboard.");
  }

  const activeResult = result;
  const qualityScore = activeResult ? Math.round(activeResult.report.status.confidence * 100) : 91;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
      <Card className="h-fit p-6">
        <div className="flex items-center justify-between gap-3">
          <Badge>Agent workspace</Badge>
          <StatusBadge label="MCP tools ready" tone="good" />
        </div>
        <CardTitle className="mt-5 text-3xl">Ask StatusPilot about a project</CardTitle>
        <CardDescription>
          Run a supervisor workflow across status, risk, and report agents. Built to sit on top of Jira-like project systems.
        </CardDescription>
        <div className="mt-6 space-y-4">
          <Textarea value={question} onChange={(event) => setQuestion(event.target.value)} />
          <Button onClick={onRun} disabled={isLoading || question.length < 2} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SendHorizontal className="mr-2 h-4 w-4" />}
            Run Agent
          </Button>
          <button type="button" onClick={() => setQuestion(EXAMPLE)} className="text-sm font-medium text-muted transition hover:text-foreground">
            Use sample query
          </button>
          {notice ? <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted">{notice}</p> : null}
        </div>
      </Card>

      <div className="space-y-6">
        {isLoading ? (
          <LoadingState />
        ) : activeResult ? (
          <>
            <Card className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Run {activeResult.run_id.slice(0, 10)}</Badge>
                  <StatusBadge label={`${activeResult.report.risks.risk_level} risk`} tone={activeResult.report.risks.risk_level === "high" ? "bad" : "warn"} />
                  <StatusBadge label={`${qualityScore}% confidence`} tone="good" />
                </div>
                <button onClick={copyReport} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-slate-900">
                  <Clipboard className="h-4 w-4" /> Copy report
                </button>
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em]">Generated report</h2>
              <p className="mt-4 text-base leading-8 text-muted">{activeResult.report.executive_summary}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <ScoreCard label="Quality score" value={`${qualityScore}%`} detail="Grounded answer confidence" />
                <ScoreCard label="Sources" value={`${activeResult.sources.length}`} detail="Retrieved citations" />
                <ScoreCard label="Latency" value={`${Math.round(activeResult.tool_calls.reduce((sum, tool) => sum + tool.latency_ms, 0))} ms`} detail="Tool execution time" />
              </div>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="Agent execution timeline" icon={<Clock className="h-5 w-5 text-muted" />}>
                <div className="space-y-3">
                  {activeResult.trace.map((step, index) => (
                    <div key={`${step.agent}-${step.step}-${index}`} className="grid grid-cols-[1.5rem_1fr] gap-3 rounded-xl border border-border bg-slate-50/70 p-3 dark:bg-slate-950/40">
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">{index + 1}</span>
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium">{step.step}</p>
                          <Badge>{step.agent}</Badge>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-muted">{step.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Tool calls" icon={<Activity className="h-5 w-5 text-muted" />}>
                <div className="space-y-3">
                  {activeResult.tool_calls.map((tool, index) => (
                    <div key={`${tool.tool_name}-${index}`} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{tool.tool_name}</p>
                        <StatusBadge label={tool.success ? "success" : "failed"} tone={tool.success ? "good" : "bad"} />
                      </div>
                      <p className="mt-1 text-xs text-muted">{tool.agent} agent · {tool.latency_ms} ms</p>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{tool.output_preview}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="Retrieved sources" icon={<FileSearch className="h-5 w-5 text-muted" />}>
                <div className="space-y-3">
                  {activeResult.sources.slice(0, 5).map((source) => (
                    <div key={`${source.source}-${source.title}`} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{source.title}</p>
                        <Badge>{source.source}</Badge>
                      </div>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{source.content}</p>
                      <p className="mt-3 text-xs text-muted">Score {Math.round(source.score * 100)}%</p>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Action items" icon={<CheckCircle2 className="h-5 w-5 text-muted" />}>
                <div className="space-y-3">
                  {activeResult.report.next_steps.map((item) => (
                    <div key={item} className="rounded-xl border border-border bg-slate-50/70 p-4 text-sm leading-6 text-muted dark:bg-slate-950/40">
                      {item}
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </>
        ) : (
          <Card className="flex min-h-[34rem] items-center justify-center text-center">
            <div className="max-w-md">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em]">Run a project intelligence query</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Ask about sprint status, launch risk, blockers, owners, or action items. If the API is offline, the page falls back to sample data.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function ScoreCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-border bg-slate-50/70 p-4 dark:bg-slate-950/40">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{value}</p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-3">
        <CardTitle>{title}</CardTitle>
        {icon}
      </div>
      {children}
    </Card>
  );
}

function LoadingState() {
  return (
    <Card className="space-y-5 p-6">
      <div className="flex items-center gap-3 text-sm font-medium text-muted">
        <Loader2 className="h-4 w-4 animate-spin" /> Running supervisor workflow
      </div>
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </Card>
  );
}
