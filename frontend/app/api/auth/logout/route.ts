import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true, logged_out: true });
  response.cookies.delete("sprintpilot_session");
  response.cookies.delete("refresh_token");
  return response;
}
