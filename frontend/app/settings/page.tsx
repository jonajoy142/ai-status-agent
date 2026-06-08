import { Cloud, EyeOff, KeyRound, Network, PlugZap, Server } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const settings = [
  { icon: Server, label: "Backend", value: "FastAPI", detail: "Railway or Render-ready with /health endpoint.", status: "Healthy" },
  { icon: Cloud, label: "Frontend", value: "Next.js", detail: "Vercel-ready via NEXT_PUBLIC_API_BASE_URL.", status: "Ready" },
  { icon: Network, label: "Vector DB", value: "Local / Qdrant-ready", detail: "Local scorer now; Qdrant Cloud can sit behind the retrieval interface.", status: "Local" },
  { icon: PlugZap, label: "MCP tools", value: "3 enabled", detail: "Tickets, chat updates, and project docs exposed as tool descriptors.", status: "Enabled" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 reveal-up">
      <Card className="p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge>Settings</Badge>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">Provider configuration for a deployable AI SaaS.</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
              Keep Phase 1 simple: reliable demo defaults, clear provider switches, and integration placeholders that make future Jira/Slack/GitHub support obvious.
            </p>
          </div>
          <StatusBadge label="Production demo ready" tone="good" />
        </div>
      </Card>

      <section className="grid gap-5 md:grid-cols-2">
        {settings.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-slate-50 dark:bg-slate-950">
                  <Icon className="h-5 w-5 text-muted" />
                </div>
                <StatusBadge label={item.status} tone="good" />
              </div>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-muted">{item.label}</p>
              <CardTitle className="mt-2">{item.value}</CardTitle>
              <CardDescription>{item.detail}</CardDescription>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardTitle>Model and retrieval providers</CardTitle>
          <div className="mt-5 space-y-3">
            {[
              ["LLM_PROVIDER", "demo", "Reliable public fallback"],
              ["OPENAI_MODEL", "gpt-4.1-mini", "Optional hosted generation"],
              ["VECTOR_PROVIDER", "local", "Chroma/Qdrant-ready boundary"],
              ["CORS_ORIGINS", "localhost / Vercel URL", "Frontend access control"],
            ].map(([key, value, detail]) => (
              <div key={key} className="rounded-xl border border-border bg-slate-50/70 p-4 dark:bg-slate-950/40">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{key}</p>
                  <Badge>{value}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted">{detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>API keys</CardTitle>
            <EyeOff className="h-5 w-5 text-muted" />
          </div>
          <CardDescription>Placeholder UI for hosted provider keys. Values should stay server-side.</CardDescription>
          <div className="mt-5 space-y-3">
            {[
              ["OpenAI API key", "Optional"],
              ["Qdrant API key", "Future"],
              ["Langfuse keys", "Future observability"],
              ["Jira OAuth", "Future MCP connector"],
            ].map(([label, status]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-4 w-4 text-muted" />
                  <p className="text-sm font-medium">{label}</p>
                </div>
                <Badge>{status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
