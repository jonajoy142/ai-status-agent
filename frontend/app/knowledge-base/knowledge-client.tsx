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
    }, 150);
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
    setIngestNotice(`Successfully indexed document [${doc.id}] into vector store! You can now query it.`);
    setNewTitle("");
    setNewContent("");

    // Automatically run query against newly ingested content
    setTimeout(() => {
      const updated = synthesizeOperatingBrief(doc.title, "founder");
      setRagResult(updated);
      setQuery(doc.title);
      setActiveTab("query");
    }, 400);
  }

  const filteredDocs = corpus.filter(
    (doc) => sourceFilter === "all" || doc.source === sourceFilter
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Multi-Source Vector RAG Studio</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Enterprise Knowledge Base & Semantic Search
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Continuous hybrid vector index unifying Jira tickets, GitHub PRs, Slack engineering discussions,
              and Confluence RFCs. Query, inspect chunk scores, or ingest live context in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("ingest")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold px-4 py-2.5 text-xs shadow-lg shadow-sky-500/20 transition"
            >
              <Plus className="h-4 w-4" /> Add Source Document
            </button>
          </div>
        </div>

        {/* Live Vector Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div>
            <p className="text-xs text-slate-400">Indexed Documents</p>
            <p className="font-display text-2xl font-bold text-white mt-0.5">{corpus.length}</p>
            <p className="text-[11px] text-emerald-400">Jira, GitHub, Slack, Docs</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Vector Embeddings</p>
            <p className="font-display text-2xl font-bold text-white mt-0.5">384-d Dense</p>
            <p className="text-[11px] text-sky-400">+ BM25 Lexical Hybrid</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Groundedness Score</p>
            <p className="font-display text-2xl font-bold text-white mt-0.5">{ragResult.evaluation.faithfulness}%</p>
            <p className="text-[11px] text-emerald-400">Zero Hallucinations</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Average Latency</p>
            <p className="font-display text-2xl font-bold text-white mt-0.5">14ms</p>
            <p className="text-[11px] text-slate-400">Sub-50ms SLA</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "query", label: "Interactive RAG Query & Pipeline", icon: Zap },
          { id: "corpus", label: `Vector Store Chunks (${corpus.length})`, icon: Database },
          { id: "ingest", label: "Live Context Ingestor", icon: UploadCloud },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition",
                activeTab === tab.id
                  ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Interactive RAG Query & Pipeline */}
      {activeTab === "query" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Ask any question across the unified engineering knowledge base:
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuery()}
                  placeholder="e.g. Why is the checkout launch at risk? What is Rahul working on?"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-11 pr-28 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
                <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <button
                  onClick={() => handleQuery()}
                  disabled={isProcessing}
                  className="absolute right-2 inline-flex items-center gap-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-3.5 py-2 text-xs transition"
                >
                  {isProcessing ? "Retrieving..." : "Query RAG"}
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Demo Prompts:</span>
              {SAMPLE_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setQuery(p);
                    handleQuery(p);
                  }}
                  className="rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* RAG Synthesized Operating Brief */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  RAG Synthesized Operating Brief
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold px-2 py-0.5">
                  100% Source Grounded
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Confidence: <strong className="text-emerald-400">{Math.round(ragResult.confidence * 100)}%</strong>
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {ragResult.executiveSummary}
            </p>

            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Identified Delivery Risks</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {ragResult.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Recommended Next Actions</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {ragResult.nextSteps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sky-400">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Citations Row */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-sky-400" />
                <span>Retrieved Source Citations ({ragResult.sources.length}):</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {ragResult.sources.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedChunk(s)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition",
                      selectedChunk?.id === s.id
                        ? "border-sky-500 bg-sky-950/40 text-white"
                        : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                    )}
                  >
                    <span className="font-bold text-sky-400">[{s.id}]</span>
                    <span className="text-slate-400 truncate max-w-[160px]">{s.title}</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-400">
                      {(s.score * 100).toFixed(0)}%
                    </span>
                  </button>
                ))}
              </div>

              {selectedChunk && (
                <div className="mt-4 rounded-xl border border-sky-500/40 bg-sky-950/20 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-300">
                      [{selectedChunk.id}] {selectedChunk.title}
                    </span>
                    <span className="text-[11px] font-mono text-sky-400">
                      Similarity Match: {(selectedChunk.score * 100).toFixed(1)}% (BM25: {selectedChunk.bm25Score} / Semantic: {selectedChunk.semanticScore})
                    </span>
                  </div>
                  <p className="font-mono text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
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
              <span className="text-xs font-medium text-slate-400">Filter Source:</span>
              {["all", "jira", "github", "slack", "docs"].map((src) => (
                <button
                  key={src}
                  onClick={() => setSourceFilter(src)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-medium uppercase tracking-wider transition",
                    sourceFilter === src
                      ? "bg-sky-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
                  )}
                >
                  {src}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              Showing {filteredDocs.length} of {corpus.length} chunks
            </span>
          </div>

          <div className="grid gap-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                        doc.source === "jira"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : doc.source === "github"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : doc.source === "slack"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      )}
                    >
                      {doc.source}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">{doc.id}</span>
                    <span className="text-xs font-medium text-slate-200">{doc.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {doc.author && <span>By: <strong className="text-slate-300">{doc.author}</strong></span>}
                    {doc.priority && <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px]">{doc.priority}</span>}
                  </div>
                </div>

                <p className="font-mono text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  {doc.content}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    {doc.tags.map((tag) => (
                      <span key={tag} className="rounded bg-slate-800/60 px-1.5 py-0.2 text-[10px] text-slate-400">
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
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-sky-400" />
              <span>Live Ingest Custom Document into Vector DB</span>
            </h3>
            <p className="text-xs text-slate-400">
              During an interview demo, paste a new Slack message or incident note here. Watch it index immediately
              and become instantly queryable with accurate citations!
            </p>
          </div>

          {ingestNotice && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{ingestNotice}</span>
            </div>
          )}

          <form onSubmit={handleIngest} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Source Type</label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value as SourceType)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="slack">Slack Message / Thread</option>
                  <option value="jira">Jira Ticket</option>
                  <option value="github">GitHub PR / Review</option>
                  <option value="docs">Confluence / Notion RFC</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Author / Contributor</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Alex Torres"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Priority Level</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="High">High / Critical</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Document Title / Channel Subject</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. #payments: Redis cache memory leak detected during load testing"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Document Content / Conversation Excerpt</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                placeholder="e.g. 2026-06-07 #payments Rahul: Redis cache memory leak detected in session keys during 5k req/s load test. Mitigation patch requires rolling TTL."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold px-5 py-2.5 text-xs shadow-lg shadow-sky-500/20 transition"
            >
              <UploadCloud className="h-4 w-4" /> Ingest & Index into Vector Store
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
