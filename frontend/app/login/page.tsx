"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Github, KeyRound, LogOut, Mail, Sparkles, UserCheck } from "lucide-react";
import { FormEvent, useState } from "react";

import { useAuth, type DemoRole } from "@/components/auth-provider";
import { getDashboardRoute } from "@/lib/role-router";
import { cn } from "@/lib/utils";

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
      const matched = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
      router.push(getDashboardRoute(matched?.role || "founder"));
    } catch {
      // Fallback to demo login
      const matched = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
      loginAs(matched?.role || "founder");
      router.push(getDashboardRoute(matched?.role || "founder"));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleQuickRoleSelect(role: DemoRole) {
    loginAs(role);
    router.push(getDashboardRoute(role));
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 px-3 py-1 text-xs font-semibold text-sky-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>SprintPilot Enterprise Portal</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
          Sign In to Your Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Select any pre-configured enterprise role for an instant portfolio walkthrough, or sign in with your demo credentials.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
        {/* Left: One-Click Role Selector (Best for interview demo!) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-sky-400" />
              <span>One-Click Role Selection (Recommended for Demo)</span>
            </h2>
            <span className="text-xs text-emerald-400 font-medium">Instant Access</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {users.map((candidate) => {
              const isSelected = candidate.role === user.role && isLoggedIn;
              return (
                <div
                  key={candidate.id}
                  onClick={() => handleQuickRoleSelect(candidate.role)}
                  className={cn(
                    "cursor-pointer rounded-2xl border p-5 transition flex flex-col justify-between space-y-3 group",
                    isSelected
                      ? "border-sky-500 bg-sky-950/20 ring-1 ring-sky-500/30"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-sky-400">{candidate.title}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-sky-400" />}
                    </div>
                    <h3 className="font-display text-base font-bold text-white group-hover:text-sky-300 transition">
                      {candidate.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">{candidate.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickRoleSelect(candidate.role);
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 group-hover:bg-sky-500 group-hover:text-slate-950 text-slate-200 font-semibold py-2 text-xs transition"
                  >
                    <span>Login as {candidate.title}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {isLoggedIn && (
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-3.5 text-xs text-slate-300">
              <span>Current session: <strong className="text-white">{user.name} ({user.title})</strong></span>
              <button
                onClick={() => void logout()}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-red-400 font-medium transition"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Right: Email/Password Form */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-white">Manual Sign In</h2>
            <p className="text-xs text-slate-400">
              Demo mode enabled. Password for all demo accounts is <code className="text-sky-300">demo123</code>.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                required
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold py-3 text-sm shadow-lg shadow-sky-500/20 transition"
            >
              {isSubmitting ? "Authenticating..." : "Sign In to SprintPilot"}
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] font-medium text-slate-500 absolute">OR</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQuickRoleSelect("founder")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 transition"
            >
              <Mail className="h-3.5 w-3.5 text-sky-400" />
              <span>Demo Founder</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickRoleSelect("engineering_manager")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 transition"
            >
              <Github className="h-3.5 w-3.5 text-purple-400" />
              <span>Demo EM</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
