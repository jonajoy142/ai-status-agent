import { FileText, MessagesSquare, PackageCheck, Rows3, Ticket } from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const sources = [
  { icon: Ticket, name: "Jira-style tickets", count: "5", chunks: "5 chunks", status: "Indexed", detail: "Status, owners, priority, latest updates, and risk fields." },
  { icon: MessagesSquare, name: "Team updates", count: "6", chunks: "6 chunks", status: "Indexed", detail: "Engineering chat updates from payments, checkout, release, and eng leads." },
  { icon: FileText, name: "Project docs", count: "1", chunks: "2 chunks", status: "Indexed", detail: "Sprint goals, launch criteria, known risks, and report template." },
];

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6 reveal-up">
      <Card className="p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge>Knowledge Base</Badge>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">Project context indexed for agent retrieval.</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
              StatusPilot starts with a local demo corpus and is structured to plug into Jira, Slack, GitHub, Linear, Confluence, or Notion through MCP-ready tools.
            </p>
          </div>
          <StatusBadge label="Vector store ready" tone="good" />
        </div>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Documents" value="12" detail="Tickets, updates, docs" trend="indexed" />
        <MetricCard label="Chunks" value="13" detail="Searchable context units" trend="ready" />
        <MetricCard label="Metadata fields" value="7" detail="source, title, id, owner, status, priority, score" />
        <MetricCard label="Ingestion status" value="100%" detail="Demo workspace synced" trend="healthy" />
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {sources.map((source) => {
          const Icon = source.icon;
          return (
            <Card key={source.name}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-slate-50 dark:bg-slate-950">
                  <Icon className="h-5 w-5 text-muted" />
                </div>
                <StatusBadge label={source.status} tone="good" />
              </div>
              <CardTitle className="mt-5">{source.name}</CardTitle>
              <div className="mt-4 flex items-center gap-2">
                <Badge>{source.count} docs</Badge>
                <Badge>{source.chunks}</Badge>
              </div>
              <CardDescription>{source.detail}</CardDescription>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Ingestion pipeline</CardTitle>
            <PackageCheck className="h-5 w-5 text-muted" />
          </div>
          <div className="mt-5 space-y-3">
            {["Load source documents", "Attach metadata", "Chunk content", "Index for retrieval", "Return citations"].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-xl border border-border bg-slate-50/70 p-3 dark:bg-slate-950/40">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">{index + 1}</span>
                <p className="text-sm font-medium">{step}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Source metadata preview</CardTitle>
            <Rows3 className="h-5 w-5 text-muted" />
          </div>
          <div className="mt-5 overflow-hidden rounded-xl border border-border">
            {[
              ["PAY-231", "tickets", "Rahul", "In Progress", "High"],
              ["AUTH-118", "tickets", "Isha", "In Review", "High"],
              ["slack-6", "chat", "Payments", "Update", "Medium"],
              ["project-phoenix-brief", "docs", "Platform", "Active", "Medium"],
            ].map((row) => (
              <div key={row[0]} className="grid grid-cols-5 gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0">
                {row.map((cell) => <span key={cell} className="truncate text-muted">{cell}</span>)}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
