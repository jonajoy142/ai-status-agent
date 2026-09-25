import { NextResponse } from "next/server";
import { synthesizeOperatingBrief, type SourceType } from "@/lib/rag-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { query = "What is the checkout launch status and risk?", role = "founder", source } = body;

    const result = synthesizeOperatingBrief(query, role, source as SourceType | undefined);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ detail: "RAG query failed", error: String(error) }, { status: 500 });
  }
}
