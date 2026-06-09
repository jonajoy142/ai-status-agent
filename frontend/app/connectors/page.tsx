"use client";

import { useEffect, useState } from "react";
import { Cable, RefreshCw } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { apiGet, apiPost, type ConnectorDto } from "@/lib/api";
import { connectors as fallbackConnectors } from "@/lib/demo-data";

export default function ConnectorsPage() {
  const [connectors, setConnectors] = useState<ConnectorDto[] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => { apiGet<{ connectors: ConnectorDto[] }>("/connectors").then((data) => setConnectors(data.connectors)).catch(() => setConnectors(null)); }, []);
  const rows = connectors || fallbackConnectors.map((connector) => ({ id: connector.name.toLowerCase(), name: connector.name, status: connector.status, auth_type: connector.auth, last_synced_at: connector.lastSync, scopes: [], env_vars: connector.env.split(", ") }));
  async function sync(id: string) { try { await apiPost(`/connectors/${id}/sync`); setNotice(`${id} sync completed.`); } catch { setNotice("Backend unavailable. Showing mock connector state."); } }

  return <div className="space-y-6 reveal-up"><Card className="border-0 bg-gradient-to-br from-white to-sky-50/70 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]"><Badge className="bg-sky-50 text-sky-700 ring-1 ring-sky-100">Connector Hub</Badge><h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em]">Connect the systems where execution actually happens.</h1><p className="mt-4 max-w-3xl text-base leading-8 text-muted">Phase 1 uses realistic mock connectors. Production credentials are wired through environment variables and OAuth/API-key adapters later.</p>{notice ? <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">{notice}</p> : null}</Card><section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{rows.map((connector) => { const connected = connector.status.includes("connected") || connector.status === "mock"; return <Card key={connector.id}><div className="flex items-start justify-between gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200"><Cable className="h-5 w-5 text-sky-600" /></div><StatusBadge label={connector.status} tone={connected ? "good" : "neutral"} /></div><CardTitle className="mt-5">{connector.name}</CardTitle><CardDescription>{connector.auth_type}</CardDescription><div className="mt-4 space-y-2 text-sm text-muted"><p>Last sync: {connector.last_synced_at || "Not synced"}</p><p>Env: {connector.env_vars.join(", ") || "Configured later"}</p></div><Button onClick={() => sync(connector.id)} className="mt-5 w-full bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"><RefreshCw className="mr-2 h-4 w-4" /> {connected ? "Sync now" : `Connect ${connector.name}`}</Button></Card>; })}</section></div>;
}
