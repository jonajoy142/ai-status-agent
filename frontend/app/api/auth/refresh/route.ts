import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true, refreshed: true });
  response.cookies.set("sprintpilot_session", "1", { path: "/", maxAge: 2592000, sameSite: "lax" });
  return response;
}
