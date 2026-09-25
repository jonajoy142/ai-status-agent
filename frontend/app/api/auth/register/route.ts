import { NextResponse } from "next/server";
import { type DemoRole } from "@/components/auth-provider";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, full_name, role = "founder" } = body;

    const user = {
      id: `u-${Date.now()}`,
      name: full_name || "Enterprise Leader",
      email: email || "leader@company.com",
      role: (role || "founder") as DemoRole,
      title: `${(role || "Founder").toUpperCase()} / Lead`,
    };

    const payload = {
      access_token: `demo-jwt-token-${Date.now()}-${user.id}`,
      token_type: "bearer",
      user,
      role: user.role,
      workspace_id: "ws-demo-checkout",
    };

    const response = NextResponse.json(payload);
    response.cookies.set("sprintpilot_session", "1", { path: "/", maxAge: 2592000, sameSite: "lax" });
    return response;
  } catch (error) {
    return NextResponse.json({ detail: "Registration failed", error: String(error) }, { status: 400 });
  }
}
