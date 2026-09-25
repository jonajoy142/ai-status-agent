"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart2,
  CheckSquare,
  Database,
  FileText,
  GitBranch,
  GitPullRequest,
  Layers,
  LayoutDashboard,
  List,
  LogOut,
  Plug,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { useAuth, type DemoRole } from "@/components/auth-provider";
import { UserMenu } from "@/components/user-menu";
import { getNavForRole, type NavItem } from "@/lib/nav-configs";
import { getDashboardRoute } from "@/lib/role-router";
import { cn } from "@/lib/utils";

const icons = {
  activity: Activity,
  "alert-circle": AlertCircle,
  "alert-triangle": AlertTriangle,
  "bar-chart-2": BarChart2,
  "check-square": CheckSquare,
  "file-text": FileText,
  "git-branch": GitBranch,
  "git-pull-request": GitPullRequest,
  layers: Layers,
  layout: LayoutDashboard,
  list: List,
  plug: Plug,
  sparkles: Sparkles,
  target: Target,
  users: Users,
};

const ROLES: Array<{ role: DemoRole; label: string; badge: string; color: string }> = [
  { role: "founder", label: "Founder / CEO", badge: "Founder", color: "bg-amber-500/10 text-amber-700 ring-amber-500/30" },
  { role: "product_manager", label: "Product Manager", badge: "PM", color: "bg-blue-500/10 text-blue-700 ring-blue-500/30" },
  { role: "engineering_manager", label: "Engineering Manager", badge: "EM", color: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30" },
  { role: "engineer", label: "Developer", badge: "Dev", color: "bg-purple-500/10 text-purple-700 ring-purple-500/30" },
  { role: "viewer", label: "Viewer", badge: "Viewer", color: "bg-slate-500/10 text-slate-700 ring-slate-500/30" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, roleLabel, loginAs, isLoggedIn, logout } = useAuth();

  const isPublicPage = ["/demo", "/login", "/register", "/pricing", "/auth/callback"].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If on public/auth/marketing pages, show enterprise public shell (NO internal sidebar clutter!)
  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-sky-500/30">
        <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/demo" className="flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-500 text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base font-bold tracking-tight text-white flex items-center gap-2">
                  SprintPilot<span className="text-sky-400">.AI</span>
                  <span className="rounded-full bg-sky-950 border border-sky-800/60 px-2 py-0.2 text-[10px] font-semibold text-sky-300">
                    ENTERPRISE RAG
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 tracking-wide">AI Operating Briefs for Engineering</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link href="/demo#problem" className="hover:text-white transition">The Problem</Link>
              <Link href="/demo#rag-architecture" className="hover:text-white transition">RAG Architecture</Link>
              <Link href="/demo#role-matrix" className="hover:text-white transition">Role Matrix</Link>
              <Link href="/demo#sandbox" className="hover:text-white transition">Live Sandbox</Link>
              <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
            </nav>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link
                  href={getDashboardRoute(user.role)}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 px-4 py-2 text-xs font-semibold shadow-lg shadow-sky-500/25 transition"
                >
                  Open Workspace <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-xs font-semibold text-slate-300 hover:text-white transition px-3 py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 px-4 py-2 text-xs font-bold shadow-lg shadow-sky-500/20 transition"
                  >
                    Launch Live Demo <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-900 bg-slate-950/60 py-10 text-xs text-slate-500">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-400" />
              <span className="font-semibold text-slate-300">SprintPilot.AI</span> — Enterprise Multi-Agent Operating Intelligence
            </div>
            <div className="flex gap-6 text-slate-400">
              <Link href="/demo#rag-architecture" className="hover:text-white transition">Hybrid RAG Engine</Link>
              <Link href="/pricing" className="hover:text-white transition">Enterprise SLA</Link>
              <Link href="/login" className="hover:text-white transition">Demo Access</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Inside authenticated workspace: Enterprise AppShell
  const nav = getNavForRole(user.role);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Enterprise Global Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/demo" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-500 text-white shadow-md shadow-sky-500/20">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="font-display text-sm font-bold tracking-tight text-white hidden sm:inline">
                SprintPilot<span className="text-sky-400">.AI</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs">
              <span className="text-slate-400">Workspace:</span>
              <span className="font-semibold text-slate-200">Acme Commerce (Phoenix Sprint 14)</span>
            </div>
          </div>

          {/* Interactive Role Switcher Pill Container */}
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-900/90 border border-slate-800 p-1">
            <span className="hidden xl:inline text-[11px] font-medium text-slate-400 px-2 uppercase tracking-wider">
              Role Lens:
            </span>
            {ROLES.map((r) => {
              const isActive = r.role === user.role;
              return (
                <button
                  key={r.role}
                  onClick={() => {
                    loginAs(r.role);
                    router.push(getDashboardRoute(r.role));
                  }}
                  title={`Switch view to ${r.label}`}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition",
                    isActive
                      ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  )}
                >
                  <span>{r.badge}</span>
                </button>
              );
            })}
          </div>

          {/* System Pulse Status & Action */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-lg bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 text-[11px] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Vector RAG Active (14 chunks)</span>
            </div>

            <Link
              href="/agent-run"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white transition"
            >
              <Search className="h-3.5 w-3.5 text-sky-400" />
              <span>Ask RAG</span>
            </Link>

            <button
              onClick={() => void logout()}
              title="Sign out of demo"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace with Sidebar */}
      <div className="mx-auto flex flex-1 w-full max-w-[94rem]">
        {/* Sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/95 px-3 py-5 overflow-y-auto lg:block">
          <div className="rounded-xl border border-slate-800/90 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Role</p>
              <span className="rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-semibold px-2 py-0.5">Active</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-white">{roleLabel}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>

          <div className="mt-6">
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Navigation</p>
            <nav className="mt-2 space-y-1">
              {nav.map((item) => (
                <SidebarLink key={item.href} item={item} active={isActive(pathname, item.href)} />
              ))}
            </nav>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Enterprise Studio</p>
            <SidebarLink
              item={{ label: "Knowledge Base & RAG", icon: "layers", href: "/knowledge-base", badge: "Studio" }}
              active={isActive(pathname, "/knowledge-base")}
            />
            <SidebarLink
              item={{ label: "Connectors Hub", icon: "plug", href: "/connectors" }}
              active={isActive(pathname, "/connectors")}
            />
            <SidebarLink
              item={{ label: "Traces & Metrics", icon: "bar-chart-2", href: "/evaluations" }}
              active={isActive(pathname, "/evaluations")}
            />
            <SidebarLink
              item={{ label: "Settings", icon: "layout", href: "/settings" }}
              active={isActive(pathname, "/settings")}
            />
          </div>
        </aside>

        {/* Dynamic Main Workspace Content */}
        <div className="min-w-0 flex-1">
          {/* Mobile subnav */}
          <div className="border-b border-slate-800/80 bg-slate-900/50 p-2 lg:hidden overflow-x-auto flex gap-1">
            {nav.map((item) => (
              <MobileLink key={item.href} item={item} active={isActive(pathname, item.href)} />
            ))}
          </div>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = icons[item.icon as keyof typeof icons] || LayoutDashboard;
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition",
        active
          ? "bg-sky-500/10 text-sky-300 font-semibold border border-sky-500/30"
          : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
      )}
    >
      <span className="flex items-center gap-2.5">
        <Icon className={cn("h-4 w-4", active ? "text-sky-400" : "text-slate-500 group-hover:text-slate-300")} />
        {item.label}
      </span>
      {item.badge ? (
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
            active ? "bg-sky-500/20 text-sky-200" : "bg-slate-800 text-slate-400"
          )}
        >
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

function MobileLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = icons[item.icon as keyof typeof icons] || LayoutDashboard;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
        active ? "bg-sky-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white hover:bg-slate-800"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {item.label}
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/dashboard/founder") return pathname === href || pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
