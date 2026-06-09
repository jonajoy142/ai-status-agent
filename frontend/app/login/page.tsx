"use client";

import Link from "next/link";
import { ArrowRight, LogOut } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const { users, user, loginAs, logout, isLoggedIn } = useAuth();
  return (
    <div className="mx-auto max-w-4xl space-y-6 reveal-up">
      <Card className="p-8"><CardTitle className="text-4xl">Demo login and role switching</CardTitle><CardDescription>Phase 1 uses lightweight mock auth for a clean portfolio demo. Swap this for Clerk, Supabase Auth, or NextAuth in production.</CardDescription></Card>
      <div className="grid gap-4 md:grid-cols-2">
        {users.map((candidate) => (
          <Card key={candidate.id} className={candidate.role === user.role && isLoggedIn ? "ring-2 ring-sky-200" : ""}>
            <p className="text-sm text-muted">{candidate.title}</p><CardTitle className="mt-2">{candidate.name}</CardTitle><CardDescription>{candidate.email}</CardDescription>
            <Button className="mt-5" onClick={() => loginAs(candidate.role)}>Login as {candidate.title}<ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Card>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><p className="text-sm text-muted">Current state: {isLoggedIn ? `Logged in as ${user.title}` : "Logged out"}</p><button onClick={logout} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium ring-1 ring-slate-200"><LogOut className="h-4 w-4" /> Logout</button></div>
      <Link href="/" className="inline-flex text-sm font-semibold text-sky-700">Return to dashboard</Link>
    </div>
  );
}
