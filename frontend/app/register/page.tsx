"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth, type DemoRole } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getDashboardRoute } from "@/lib/role-router";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("Demo Founder");
  const [email, setEmail] = useState("new-founder@demo.sprintpilot.ai");
  const [password, setPassword] = useState("demo123");
  const [role, setRole] = useState<DemoRole>("founder");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      await register(email, password, fullName, role);
      router.push(getDashboardRoute(role));
    } catch {
      setError("Could not create account. Try a different email.");
    }
  }

  return (
    <div className="mx-auto max-w-xl reveal-up">
      <Card className="p-8">
        <CardTitle className="text-4xl">Create a SprintPilot workspace</CardTitle>
        <CardDescription>Registers a user, creates a workspace, assigns a role, and issues access/refresh tokens.</CardDescription>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Full name" required />
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Email" required />
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Password" required />
          <select value={role} onChange={(event) => setRole(event.target.value as DemoRole)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm">
            <option value="founder">Founder / CEO</option>
            <option value="product_manager">Product Manager</option>
            <option value="engineering_manager">Engineering Manager</option>
            <option value="engineer">Developer</option>
            <option value="viewer">Viewer</option>
          </select>
          {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          <Button className="h-12 w-full">Create workspace</Button>
        </form>
      </Card>
    </div>
  );
}
