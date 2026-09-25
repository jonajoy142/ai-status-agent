import { NextResponse } from "next/server";
import { type DemoRole } from "@/lib/demo-users";

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

    const response = NextResponse.json(payload, { status: 200 });
    response.cookies.set("sprintpilot_session", "1", { path: "/", maxAge: 2592000, sameSite: "lax" });
    return response;
  } catch (error) {
    const fallbackUser = {
      id: `u-demo`,
      name: "Enterprise Leader",
      email: "leader@company.com",
      role: "founder" as DemoRole,
      title: "Founder / CEO",
    };
    const payload = {
      access_token: `demo-jwt-token-${Date.now()}-fallback`,
      token_type: "bearer",
      user: fallbackUser,
      role: "founder",
      workspace_id: "ws-demo-checkout",
    };
    const response = NextResponse.json(payload, { status: 200 });
    response.cookies.set("sprintpilot_session", "1", { path: "/", maxAge: 2592000, sameSite: "lax" });
    return response;
  }
}
