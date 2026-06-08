import { Cloud, EyeOff, KeyRound, Network, PlugZap, Server, SlidersHorizontal } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const productSettings = [
  { label: "Workspace", value: "Project Phoenix", detail: "Default demo workspace for weekly operating briefs." },
  { label: "Brief cadence", value: "Weekly", detail: "Generate a founder/PM-ready update from project activity." },
  { label: "Audience", value: "Founders + PMs", detail: "Prioritize track status, blockers, attention items, and weekly changes." },
  { label: "Report style", value: "Concise", detail: "Executive visibility with source-backed details available on demand." },
];

const developerSettings = [
  { icon: Server, label: "Agent API", value: "FastAPI", detail: "Railway or Render-ready with /health endpoint.", status: "Healthy" },
  { icon: Cloud, label: "Frontend", value: "Next.js", detail: "Vercel-ready via NEXT_PUBLIC_API_BASE_URL.", status: "Ready" },
  { icon: Network, label: "Vector DB", value: "Local / Qdrant-ready", detail: "Local scorer now; Qdrant Cloud can sit behind the retrieval interface.", status: "Local" },
  { icon: PlugZap, label: "MCP tools", value: "3 enabled", detail: "Tickets, chat updates, and project docs exposed as tool descriptors.", status: "Enabled" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-7 reveal-up">
      <Card className="border-0 bg-gradient-to-br from-white to-sky-50/70 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <Badge className="bg-sky-50 text-sky-700 ring-1 ring-sky-100">Settings</Badge>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">Configure the operating brief experience.</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
          Keep the product surface focused on founder and PM workflows. Technical provider details are available below in Developer Mode.
        </p>
      </Card>

      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {productSettings.map((item) => (
          <Card key={item.label}>
            <p className="text-sm font-medium text-muted">{item.label}</p>
            <CardTitle className="mt-3">{item.value}</CardTitle>
            <CardDescription>{item.detail}</CardDescription>
          </Card>
        ))}
      </section>

      <Card className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-sky-600" />
              <CardTitle>Developer Mode</CardTitle>
            </div>
            <CardDescription>Infrastructure and integration details for deployment, debugging, and future Jira/Slack/GitHub connectors.</CardDescription>
          </div>
          <StatusBadge label="Advanced" tone="neutral" />
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {developerSettings.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                    <Icon className="h-5 w-5 text-slate-500" />
                  </div>
                  <StatusBadge label={item.status} tone="good" />
                </div>
                <p className="mt-5 text-sm font-medium text-muted">{item.label}</p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.02em]">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardTitle>Provider environment</CardTitle>
          <CardDescription>Server-side configuration for deployment.</CardDescription>
          <div className="mt-5 space-y-3">
            {[
              ["LLM_PROVIDER", "demo", "Reliable public fallback"],
              ["OPENAI_MODEL", "gpt-4.1-mini", "Optional hosted generation"],
              ["VECTOR_PROVIDER", "local", "Qdrant-ready boundary"],
              ["CORS_ORIGINS", "Vercel URL", "Frontend access control"],
            ].map(([key, value, detail]) => (
              <div key={key} className="rounded-2xl bg-slate-50 p-4">
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
          <CardDescription>Placeholder UI for provider keys. Values should stay server-side.</CardDescription>
          <div className="mt-5 space-y-3">
            {[
              ["OpenAI API key", "Optional"],
              ["Qdrant API key", "Future"],
              ["Langfuse keys", "Future"],
              ["Jira OAuth", "Future connector"],
            ].map(([label, status]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
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
