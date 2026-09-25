import { NextResponse } from "next/server";
import { ingestDocument, getCorpus, type SourceType } from "@/lib/rag-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, source = "slack", title, content, author, priority = "Medium", status = "Active", tags = [] } = body;

    if (!title || !content) {
      return NextResponse.json({ detail: "Title and content are required for RAG ingestion" }, { status: 400 });
    }

    const docId = id || `${source.toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newDoc = ingestDocument({
      id: docId,
      source: source as SourceType,
      title,
      content,
      author: author || "Team Member",
      priority,
      status,
      tags: Array.isArray(tags) ? tags : [String(tags)],
    });

    const totalCorpus = getCorpus();
    return NextResponse.json({
      success: true,
      message: `Document ${newDoc.id} indexed into vector store.`,
      document: newDoc,
      totalIndexed: totalCorpus.length,
    });
  } catch (error) {
    return NextResponse.json({ detail: "Document ingestion failed", error: String(error) }, { status: 500 });
  }
}
