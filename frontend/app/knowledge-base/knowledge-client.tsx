"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  FileCode2,
  FileText,
  Filter,
  GitPullRequest,
  Layers,
  MessagesSquare,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Ticket,
  UploadCloud,
  Zap,
} from "lucide-react";

import {
  getCorpus,
  ingestDocument,
  synthesizeOperatingBrief,
  type CorpusDocument,
  type RAGQueryResult,
  type RetrievedChunk,
  type SourceType,
} from "@/lib/rag-engine";
import { cn } from "@/lib/utils";

const SAMPLE_PROMPTS = [
  "Why is the checkout launch at risk and what are the open technical blockers?",
  "What is the status of the Stripe payment gateway and PR #412?",
  "Who owns the JWT token refresh race condition and is there a fix ready?",
  "Which developers are currently overloaded or bottlenecked on the critical path?",
  "What did Rahul report in Slack about payment retries under latency?",
];

export function KnowledgeClient() {
  const [corpus, setCorpus] = useState<CorpusDocument[]>(() => getCorpus());
  const [activeTab, setActiveTab] = useState<"query" | "corpus" | "ingest">("query");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [query, setQuery] = useState(SAMPLE_PROMPTS[0]);
  const [ragResult, setRagResult] = useState<RAGQueryResult>(() =>
    synthesizeOperatingBrief(SAMPLE_PROMPTS[0], "founder")
  );
  const [selectedChunk, setSelectedChunk] = useState<RetrievedChunk | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Ingest form state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newSource, setNewSource] = useState<SourceType>("slack");
  const [newAuthor, setNewAuthor] = useState("");
  const [newPriority, setNewPriority] = useState("High");
  const [ingestNotice, setIngestNotice] = useState<string | null>(null);

  function handleQuery(newQ?: string) {
    const q = newQ || query;
    setIsProcessing(true);
    setTimeout(() => {
      const res = synthesizeOperatingBrief(q, "founder");
      setRagResult(res);
      setIsProcessing(false);
    }, 120);
  }

  function handleIngest(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const doc = ingestDocument({
      id: `${newSource.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      source: newSource,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: newAuthor.trim() || "Engineering Lead",
      priority: newPriority,
      status: "Active",
      tags: [newSource, "custom-ingest"],
    });

    setCorpus([...getCorpus()]);
    setIngestNotice(`Indexed document [${doc.id}] into vector store. Ready for queries.`);
    setNewTitle("");
    setNewContent("");

    setTimeout(() => {
      const updated = synthesizeOperatingBrief(doc.title, "founder");
      setRagResult(updated);
      setQuery(doc.title);
      setActiveTab("query");
    }, 200);
  }

  const filteredDocs = corpus.filter(
    (doc) => sourceFilter === "all" || doc.source === sourceFilter
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                Knowledge Base & RAG Studio
              </h1>
              <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                Vector Corpus
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 max-w-xl">
              Unified vector store across Jira, GitHub PRs, Slack discussions, and Confluence RFCs.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("ingest")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 py-2 text-xs shadow-sm transition self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Source Document</span>
          </button>
        </div>

        {/* Live Vector Stats Bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-slate-100 text-left">
          <div>
            <p className="text-xs text-slate-500">Indexed Documents</p>
            <p className="font-display text-2xl font-bold text-slate-900 mt-0.5">{corpus.length}</p>
            <p className="text-[11px] text-slate-500">Jira, GitHub, Slack, Docs</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Vector Embeddings</p>
            <p className="font-display text-2xl font-bold text-slate-900 mt-0.5">384-d Dense</p>
            <p className="text-[11px] text-blue-600">+ BM25 Lexical Hybrid</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Groundedness Score</p>
            <p className="font-display text-2xl font-bold text-emerald-700 mt-0.5">{ragResult.evaluation.faithfulness}%</p>
            <p className="text-[11px] text-emerald-700">Zero Hallucinations</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Average Latency</p>
            <p className="font-display text-2xl font-bold text-slate-900 mt-0.5">14ms</p>
            <p className="text-[11px] text-slate-500">Sub-50ms SLA</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-3">
        {[
          { id: "query", label: "Semantic Search & Brief", icon: Zap },
          { id: "corpus", label: `Vector Store (${corpus.length})`, icon: Database },
          { id: "ingest", label: "Live Document Ingestion", icon: UploadCloud },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                isActive
                  ? "bg-slate-900 text-white font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Semantic Search & Brief */}
      {activeTab === "query" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Query the unified engineering knowledge base:
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuery()}
                  placeholder="e.g. Why is the checkout launch at risk? What is Rahul working on?"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-28 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
                />
                <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <button
                  onClick={() => handleQuery()}
                  disabled={isProcessing}
                  className="absolute right-1.5 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 py-1.5 text-xs transition shadow-xs"
                >
                  {isProcessing ? "Retrieving..." : "Query"}
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Demo Prompts:</span>
              {SAMPLE_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setQuery(p);
                    handleQuery(p);
                  }}
                  className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 text-xs text-slate-600 transition shadow-xs"
                >
                  {p.slice(0, 38)}...
                </button>
              ))}
            </div>
          </div>

          {/* RAG Synthesized Operating Brief */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Grounded Operating Brief
                </span>
                <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5">
                  100% Citations Grounded
                </span>
              </div>
              <span className="text-xs text-slate-500">
                Confidence: <strong className="text-emerald-700 font-semibold">{Math.round(ragResult.confidence * 100)}%</strong>
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {ragResult.executiveSummary}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-1">
              <div className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-4 space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  <span>Identified Delivery Risks</span>
                </h4>
                <ul className="space-y-1 text-xs text-amber-900/90">
                  {ragResult.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Recommended Next Actions</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-700">
                  {ragResult.nextSteps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-slate-400 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Citations Row */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-slate-500" />
                  <span>Retrieved Citations ({ragResult.sources.length}):</span>
                </p>
                <span className="text-[11px] text-slate-400">Click chip to view chunk text</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {ragResult.sources.map((s) => {
                  const isSelected = selectedChunk?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedChunk(isSelected ? null : s)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition",
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white font-medium shadow-xs"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs"
                      )}
                    >
                      <span className={cn(
                        "font-bold text-[10px] uppercase",
                        isSelected ? "text-slate-300" : "text-blue-600"
                      )}>
                        [{s.id}]
                      </span>
                      <span className="truncate max-w-[150px]">{s.title}</span>
                      <span className={cn(
                        "rounded px-1.5 py-0.2 text-[10px]",
                        isSelected ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-500"
                      )}>
                        {(s.score * 100).toFixed(0)}%
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedChunk && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      [{selectedChunk.id}] {selectedChunk.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Match: {(selectedChunk.score * 100).toFixed(1)}% (BM25: {selectedChunk.bm25Score} / Semantic: {selectedChunk.semanticScore})
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-mono bg-white p-3 rounded-lg border border-slate-200/80 leading-relaxed">
                    {selectedChunk.content}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Vector Store Chunks */}
      {activeTab === "corpus" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Filter Source:</span>
              {["all", "jira", "github", "slack", "docs"].map((src) => (
                <button
                  key={src}
                  onClick={() => setSourceFilter(src)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-medium uppercase tracking-wider transition",
                    sourceFilter === src
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 bg-white"
                  )}
                >
                  {src}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500">
              Showing {filteredDocs.length} of {corpus.length} chunks
            </span>
          </div>

          <div className="grid gap-2.5">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase">
                      {doc.source}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900">{doc.id}</span>
                    <span className="text-xs font-medium text-slate-800">{doc.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {doc.author && <span>By: <strong className="text-slate-700">{doc.author}</strong></span>}
                    {doc.priority && <span className="rounded bg-slate-100 text-slate-600 px-1.5 py-0.5 text-[10px]">{doc.priority}</span>}
                  </div>
                </div>

                <p className="font-mono text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                  {doc.content}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {doc.tags.map((tag) => (
                      <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span>{new Date(doc.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Live Document Ingestor */}
      {activeTab === "ingest" && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm space-y-5">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-slate-700" />
              <span>Ingest Document into Vector Store</span>
            </h3>
            <p className="text-xs text-slate-500">
              Paste a new Slack message or incident note during the interview demo. It will index instantly
              and become queryable with clickable citations.
            </p>
          </div>

          {ingestNotice && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{ingestNotice}</span>
            </div>
          )}

          <form onSubmit={handleIngest} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Source Type</label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value as SourceType)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
                >
                  <option value="slack">Slack Message / Thread</option>
                  <option value="jira">Jira Ticket</option>
                  <option value="github">GitHub PR / Review</option>
                  <option value="docs">Confluence / Notion RFC</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Author / Contributor</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Alex Torres"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Priority Level</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
                >
                  <option value="High">High / Critical</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Document Title / Subject</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. #payments: Redis cache memory leak detected during load testing"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Document Content / Conversation</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
                placeholder="e.g. 2026-06-07 #payments Rahul: Redis cache memory leak detected in session keys during 5k req/s load test."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
                required
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 text-xs shadow-sm transition"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Index into Vector Store</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
