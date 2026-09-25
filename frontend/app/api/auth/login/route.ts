import { NextResponse } from "next/server";
import { demoUsers, type DemoRole } from "@/components/auth-provider";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    // Check if we should forward to external backend if configured and available
    const externalApi = process.env.FASTAPI_BACKEND_URL;
    if (externalApi) {
      try {
        const response = await fetch(`${externalApi}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
          const data = await response.json();
          const res = NextResponse.json(data);
          res.cookies.set("sprintpilot_session", "1", { path: "/", maxAge: 2592000, sameSite: "lax" });
          return res;
        }
      } catch {
        // Fall back to enterprise demo auth
      }
    }

    // Match demo user or fallback to founder
    const user = demoUsers.find((u) => u.email.toLowerCase() === (email || "").toLowerCase()) || {
      id: "u-custom",
      name: email ? email.split("@")[0] : "Demo Leader",
      email: email || "founder@demo.sprintpilot.ai",
      role: "founder" as DemoRole,
      title: "Founder / CEO",
    };

    const payload = {
      access_token: `demo-jwt-token-${Date.now()}-${user.id}`,
      token_type: "bearer",
      user,
      role: user.role,
      workspace_id: "ws-demo-checkout",
    };

    const response = NextResponse.json(payload);
    response.cookies.set("sprintpilot_session", "1", {
      path: "/",
      maxAge: 2592000,
      sameSite: "lax",
    });
    return response;
  } catch (error) {
    return NextResponse.json({ detail: "Authentication failed", error: String(error) }, { status: 400 });
  }
}
