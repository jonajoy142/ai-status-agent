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
  const { users, user, loginAs, login, logout, isLoggedIn } = useAuth();
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
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <div className="text-center max-w-lg mx-auto space-y-2">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
          Sign In to SprintPilot
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Select any pre-configured enterprise role for an instant portfolio walkthrough.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
        {/* Left: One-Click Role Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-slate-600" />
              <span>One-Click Role Selection (Demo)</span>
            </h2>
            <span className="text-xs text-emerald-700 font-medium">Instant Access</span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {users.map((candidate) => {
              const isSelected = candidate.role === user.role && isLoggedIn;
              return (
                <div
                  key={candidate.id}
                  onClick={() => handleQuickRoleSelect(candidate.role)}
                  className={cn(
                    "cursor-pointer rounded-xl border p-4 transition flex flex-col justify-between space-y-3 bg-white shadow-xs group",
                    isSelected
                      ? "border-blue-600 ring-1 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  )}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-blue-600">{candidate.title}</span>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />}
                    </div>
                    <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
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
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 font-medium py-1.5 text-xs transition"
                  >
                    <span>View as {candidate.title}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {isLoggedIn && (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-xs">
              <span>Current session: <strong className="text-slate-900">{user.name} ({user.title})</strong></span>
              <button
                onClick={() => void logout()}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-rose-600 font-medium transition"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Right: Email/Password Form */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 space-y-5 shadow-sm">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-slate-900">Sign In with Credentials</h2>
            <p className="text-xs text-slate-500">
              Password for all demo accounts is <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">demo123</code>.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
                required
              />
            </div>

            {error && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 text-xs shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-100 w-full" />
            <span className="bg-white px-3 text-[11px] font-medium text-slate-400 absolute">OR QUICK LOGIN</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickRoleSelect("founder")}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 py-2 text-xs font-medium text-slate-700 shadow-xs transition"
            >
              <Mail className="h-3 w-3 text-slate-500" />
              <span>Founder Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickRoleSelect("engineering_manager")}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 py-2 text-xs font-medium text-slate-700 shadow-xs transition"
            >
              <Github className="h-3 w-3 text-slate-500" />
              <span>EM Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
