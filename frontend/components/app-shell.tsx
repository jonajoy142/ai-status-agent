"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart2,
  CheckSquare,
  FileText,
  GitBranch,
  GitPullRequest,
  Layers,
  LayoutDashboard,
  List,
  Plug,
  Settings,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { UserMenu } from "@/components/user-menu";
import { getNavForRole, type NavItem } from "@/lib/nav-configs";
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
  target: Target,
  users: Users,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, roleLabel } = useAuth();
  const nav = getNavForRole(user.role);

  return (
    <div className="noise min-h-screen bg-slate-50/60">
      <div className="mx-auto flex min-h-screen max-w-[90rem]">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200/80 bg-white/90 px-4 py-5 backdrop-blur-xl lg:block">
          <Link href="/demo" className="flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-slate-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-base font-semibold tracking-[-0.02em]">SprintPilot.AI</p>
              <p className="text-xs text-muted">AI operating briefs</p>
            </div>
          </Link>

          <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Current role</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{roleLabel}</p>
            <p className="mt-1 truncate text-xs text-muted">{user.email}</p>
          </div>

          <nav className="mt-5 space-y-1">
            {nav.map((item) => <SidebarLink key={item.href} item={item} active={isActive(pathname, item.href)} />)}
          </nav>

          <div className="absolute inset-x-4 bottom-5 space-y-2 border-t border-slate-200 pt-4">
            <SidebarLink item={{ label: "Settings", icon: "layout", href: "/settings" }} active={isActive(pathname, "/settings")} settings />
            <UserMenu compact />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-white/86 backdrop-blur-xl lg:hidden">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <Link href="/demo" className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-display text-base font-semibold tracking-[-0.02em]">SprintPilot.AI</p>
                    <p className="text-xs text-muted">{roleLabel}</p>
                  </div>
                </Link>
                <UserMenu compact />
              </div>
              <nav className="mt-4 flex gap-1 overflow-x-auto rounded-xl bg-slate-100/80 p-1">
                {nav.map((item) => <MobileLink key={item.href} item={item} active={isActive(pathname, item.href)} />)}
              </nav>
            </div>
          </header>

          <main className="px-4 py-8 sm:px-6 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ item, active, settings = false }: { item: NavItem; active: boolean; settings?: boolean }) {
  const Icon = settings ? Settings : icons[item.icon as keyof typeof icons] || LayoutDashboard;
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition",
        active ? "bg-sky-50 text-sky-800 ring-1 ring-sky-100" : "hover:bg-slate-50 hover:text-slate-950",
      )}
    >
      <span className="flex items-center gap-3">
        <Icon className={cn("h-4 w-4", active ? "text-sky-700" : "text-slate-400 group-hover:text-slate-600")} />
        {item.label}
      </span>
      {item.badge ? <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500 ring-1 ring-slate-200">{item.badge}</span> : null}
    </Link>
  );
}

function MobileLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = icons[item.icon as keyof typeof icons] || LayoutDashboard;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
        active ? "bg-white text-sky-800 shadow-sm" : "text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-sm",
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/dashboard/founder") return pathname === href || pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
