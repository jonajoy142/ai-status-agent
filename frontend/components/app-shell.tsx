"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Brain,
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
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { useAuth, type DemoRole } from "@/components/auth-provider";
import { getNavForRole, type NavItem } from "@/lib/nav-configs";
import { getDashboardRoute } from "@/lib/role-router";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const icons = {
  activity: Activity,
  "alert-circle": AlertCircle,
  "alert-triangle": AlertTriangle,
  "bar-chart-2": BarChart2,
  brain: Brain,
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

const ROLES: Array<{ role: DemoRole; badge: string; label: string }> = [
  { role: "founder", badge: "Founder", label: "Founder / CEO" },
  { role: "product_manager", badge: "PM", label: "Product Manager" },
  { role: "engineering_manager", badge: "EM", label: "Engineering Manager" },
  { role: "engineer", badge: "Dev", label: "Developer" },
  { role: "viewer", badge: "Viewer", label: "Viewer" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, roleLabel, loginAs, isLoggedIn, logout } = useAuth();

  const isPublicPage = ["/demo", "/login", "/register", "/pricing", "/auth/callback"].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // European SaaS Public Shell (Clean White & Slate)
  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased">
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/demo" className="flex items-center gap-2.5">
              <Logo size="md" />
              <span className="hidden sm:inline-block rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                Engineering RAG
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
              <Link href="/demo#xai-architecture" className="hover:text-blue-700 transition flex items-center gap-1.5 text-blue-700 font-bold">
                <Brain className="h-3.5 w-3.5 text-blue-600" />
                <span>Explainable AI (XAI)</span>
              </Link>
              <Link href="/demo#problem" className="hover:text-slate-900 transition">The Problem</Link>
              <Link href="/demo#role-matrix" className="hover:text-slate-900 transition">Role Lens</Link>
              <Link href="/demo#sandbox" className="hover:text-slate-900 transition">Live Demo</Link>
              <Link href="/evaluations" className="hover:text-slate-900 transition">Evaluations</Link>
              <Link href="/pricing" className="hover:text-slate-900 transition">Pricing</Link>
            </nav>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link
                  href={getDashboardRoute(user.role)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition"
                >
                  Open Workspace <ArrowRight className="h-3 w-3" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/demo#sandbox"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition"
                  >
                    Live Demo <ArrowRight className="h-3 w-3" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200/80 bg-white py-8 text-xs text-slate-500">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">SprintPilot.AI</span> — AI Operating Briefs for Engineering Leaders
            </div>
            <div className="flex gap-5 text-slate-600">
              <Link href="/demo#rag-architecture" className="hover:text-slate-900">Architecture</Link>
              <Link href="/pricing" className="hover:text-slate-900">Security & GDPR</Link>
              <Link href="/login" className="hover:text-slate-900">Demo Login</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Inside Workspace: Clean, spacious European Enterprise UI
  const nav = getNavForRole(user.role);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased">
      {/* Top Global Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/demo" className="flex items-center gap-2">
              <Logo size="sm" />
            </Link>

            <div className="hidden lg:flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs text-slate-700 font-medium">
              <span className="text-slate-500">Workspace:</span>
              <span>Acme Commerce (Sprint 14)</span>
            </div>
          </div>

          {/* Clean Role Switcher */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 border border-slate-200/80 p-0.5">
            {ROLES.map((r) => {
              const isActive = r.role === user.role;
              return (
                <button
                  key={r.role}
                  onClick={() => {
                    loginAs(r.role);
                    router.push(getDashboardRoute(r.role));
                  }}
                  title={r.label}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition",
                    isActive
                      ? "bg-white text-slate-900 font-semibold shadow-sm border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {r.badge}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1 text-[11px] text-emerald-800 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>RAG Active (14 chunks)</span>
            </div>

            <Link
              href="/agent-run"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition"
            >
              <Search className="h-3 w-3" />
              <span>Ask RAG</span>
            </Link>

            <button
              onClick={() => void logout()}
              title="Sign out"
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto flex flex-1 w-full max-w-7xl">
        {/* Sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 border-r border-slate-200/80 bg-white px-3 py-5 overflow-y-auto lg:block">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 mb-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active View</p>
            <p className="mt-0.5 text-xs font-bold text-slate-900">{roleLabel}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
          </div>

          <div className="space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Navigation</p>
            {nav.map((item) => (
              <SidebarLink key={item.href} item={item} active={isActive(pathname, item.href)} />
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Platform</p>
            <SidebarLink
              item={{ label: "Knowledge Base", icon: "layers", href: "/knowledge-base" }}
              active={isActive(pathname, "/knowledge-base")}
            />
            <SidebarLink
              item={{ label: "XAI & Evaluations", icon: "brain", href: "/evaluations" }}
              active={isActive(pathname, "/evaluations")}
            />
            <SidebarLink
              item={{ label: "Connectors", icon: "plug", href: "/connectors" }}
              active={isActive(pathname, "/connectors")}
            />
            <SidebarLink
              item={{ label: "Settings", icon: "layout", href: "/settings" }}
              active={isActive(pathname, "/settings")}
            />
          </div>
        </aside>

        {/* Content Canvas */}
        <div className="min-w-0 flex-1">
          {/* Mobile bar */}
          <div className="border-b border-slate-200 bg-white p-2 lg:hidden overflow-x-auto flex gap-1">
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
        "group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition",
        active
          ? "bg-slate-100 text-slate-900 font-semibold"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <span className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600")} />
        {item.label}
      </span>
      {item.badge ? (
        <span
          className={cn(
            "rounded px-1.5 py-0.2 text-[10px] font-semibold",
            active ? "bg-slate-200 text-slate-900" : "bg-slate-100 text-slate-500"
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
        active ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:bg-slate-100"
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
