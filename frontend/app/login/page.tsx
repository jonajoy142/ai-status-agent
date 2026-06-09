"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getDashboardRoute } from "@/lib/role-router";

export default function LoginPage() {
  const router = useRouter();
  const { users, user, loginAs, logout, isLoggedIn } = useAuth();

  return (
    <div className="mx-auto max-w-5xl space-y-6 reveal-up">
      <Card className="p-8">
        <CardTitle className="text-4xl">Choose your SprintPilot role</CardTitle>
        <CardDescription>Demo auth stores the selected role locally and routes each user to a different product experience. Production can swap this for NextAuth, Clerk, or Supabase Auth.</CardDescription>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
        <button onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium ring-1 ring-slate-200"><LogOut className="h-4 w-4" /> Logout</button>
      </div>
      <Link href="/role-select" className="inline-flex text-sm font-semibold text-sky-700">Open role selector</Link>
    </div>
  );
}
