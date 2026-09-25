import { NextResponse } from "next/server";
import { getCorpus } from "@/lib/rag-engine";

export async function GET() {
  const corpus = getCorpus();
  const summary = {
    totalDocuments: corpus.length,
    bySource: {
      jira: corpus.filter((d) => d.source === "jira").length,
      github: corpus.filter((d) => d.source === "github").length,
      slack: corpus.filter((d) => d.source === "slack").length,
      docs: corpus.filter((d) => d.source === "docs").length,
    },
    documents: corpus,
  };
  return NextResponse.json(summary);
}
