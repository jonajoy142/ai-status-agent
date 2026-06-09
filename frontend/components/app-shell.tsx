import Link from "next/link";
import { BarChart3, Bot, Cable, FileText, FlaskConical, LibraryBig, ListChecks, ShieldAlert, Sparkles, Tag } from "lucide-react";

import { UserMenu } from "@/components/user-menu";

const nav = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/work-items", label: "Work Items", icon: ListChecks },
  { href: "/risk-center", label: "Risk Center", icon: ShieldAlert },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/agent-run", label: "Agent Run", icon: Bot },
  { href: "/knowledge-base", label: "Knowledge", icon: LibraryBig },
  { href: "/connectors", label: "Connectors", icon: Cable },
  { href: "/evaluations", label: "Evaluations", icon: FlaskConical },
  { href: "/pricing", label: "Pricing", icon: Tag },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="noise min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-white/84 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/demo" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="font-display text-base font-semibold tracking-[-0.02em]">SprintPilot.AI</p>
                <p className="text-xs text-muted">AI operating briefs for engineering execution</p>
              </div>
            </Link>
            <UserMenu />
          </div>
          <nav className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100/80 p-1">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
