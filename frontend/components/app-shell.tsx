import Link from "next/link";
import { BarChart3, Bot, FileText, FlaskConical, LibraryBig, Settings, Waypoints } from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/agent-run", label: "Agent Run", icon: Bot },
  { href: "/knowledge-base", label: "Knowledge Base", icon: LibraryBig },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/evaluations", label: "Evaluations", icon: FlaskConical },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="noise min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm">
              <Waypoints className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-base font-semibold tracking-[-0.02em]">StatusPilot AI</p>
              <p className="text-xs text-muted">Multi-agent project intelligence for engineering teams</p>
            </div>
          </Link>
          <nav className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card/85 p-1 shadow-sm">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-900"
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
