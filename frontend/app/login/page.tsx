"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Github, KeyRound, LogOut, Mail } from "lucide-react";
import { FormEvent, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getDashboardRoute } from "@/lib/role-router";

export default function LoginPage() {
  const router = useRouter();
  const { users, user, loginAs, login, loginWithOAuth, logout, isLoggedIn } = useAuth();
  const [email, setEmail] = useState("founder@demo.sprintpilot.ai");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      const matched = users.find((candidate) => candidate.email === email);
      router.push(getDashboardRoute(matched?.role || "founder"));
    } catch {
      setError("Invalid email or password. Demo password is demo123.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 reveal-up lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="h-fit p-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100"><KeyRound className="h-5 w-5" /></div>
        <CardTitle className="mt-6 text-4xl">Sign in to SprintPilot</CardTitle>
        <CardDescription>Email/password auth is wired to the FastAPI backend. Google and GitHub OAuth routes are demo-safe and can be connected with provider credentials.</CardDescription>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button onClick={() => loginWithOAuth("google")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold ring-1 ring-slate-200 transition hover:bg-slate-50"><Mail className="h-4 w-4" /> Continue with Google</button>
          <button onClick={() => loginWithOAuth("github")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold ring-1 ring-slate-200 transition hover:bg-slate-50"><Github className="h-4 w-4" /> Continue with GitHub</button>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-muted"><div className="h-px flex-1 bg-slate-200" />or<div className="h-px flex-1 bg-slate-200" /></div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-200 focus:ring-4 focus:ring-sky-50" required />
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-200 focus:ring-4 focus:ring-sky-50" required />
          {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          <Button disabled={isSubmitting} className="h-12 w-full">{isSubmitting ? "Signing in..." : "Sign in"}</Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">No account? <Link href="/register" className="font-semibold text-sky-700">Sign up</Link></p>
      </Card>

      <div className="space-y-6">
        <Card className="p-8">
          <CardTitle className="text-3xl">Or choose a demo role</CardTitle>
          <CardDescription>Role switching remains available for fast portfolio demos.</CardDescription>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {users.map((candidate) => (
            <Card key={candidate.id} className={candidate.role === user.role && isLoggedIn ? "ring-2 ring-sky-200" : ""}>
              <p className="text-sm text-muted">{candidate.title}</p>
              <CardTitle className="mt-2">{candidate.name}</CardTitle>
              <CardDescription>{candidate.email}</CardDescription>
              <Button className="mt-5 w-full" onClick={() => { loginAs(candidate.role); router.push(getDashboardRoute(candidate.role)); }}>
                Login as {candidate.title}<ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">Current state: {isLoggedIn ? `Logged in as ${user.title}` : "Logged out"}</p>
          <button onClick={() => void logout()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium ring-1 ring-slate-200"><LogOut className="h-4 w-4" /> Logout</button>
        </div>
      </div>
    </div>
  );
}
