import type { DemoRole } from "@/components/auth-provider";

export type NavItem = {
  label: string;
  icon: string;
  href: string;
  badge?: string;
};

export const FOUNDER_NAV: NavItem[] = [
  { label: "Overview", icon: "layout", href: "/dashboard/founder" },
  { label: "Weekly Brief", icon: "file-text", href: "/report/weekly" },
  { label: "Business Priorities", icon: "target", href: "/priorities" },
  { label: "Risks", icon: "alert-triangle", href: "/risks", badge: "3" },
  { label: "Decisions", icon: "git-branch", href: "/decisions", badge: "3" },
  { label: "Team Health", icon: "users", href: "/teams" },
];

export const PM_NAV: NavItem[] = [
  { label: "Sprint Dashboard", icon: "activity", href: "/dashboard/pm" },
  { label: "Weekly Report", icon: "file-text", href: "/report/weekly" },
  { label: "Work Items", icon: "list", href: "/work-items" },
  { label: "Epics", icon: "layers", href: "/priorities" },
  { label: "Risk Center", icon: "alert-triangle", href: "/risks", badge: "3" },
  { label: "Decisions", icon: "git-branch", href: "/decisions", badge: "3" },
  { label: "Connectors", icon: "plug", href: "/connectors" },
];

export const EM_NAV: NavItem[] = [
  { label: "Team Overview", icon: "users", href: "/dashboard/em" },
  { label: "Work Items", icon: "list", href: "/work-items" },
  { label: "PRs & Reviews", icon: "git-pull-request", href: "/prs" },
  { label: "Risks", icon: "alert-triangle", href: "/risks", badge: "3" },
  { label: "Delivery Confidence", icon: "bar-chart-2", href: "/delivery" },
  { label: "Reports", icon: "file-text", href: "/reports" },
];

export const DEV_NAV: NavItem[] = [
  { label: "My Tasks", icon: "check-square", href: "/dashboard/developer" },
  { label: "My PRs", icon: "git-pull-request", href: "/my-prs" },
  { label: "My Blockers", icon: "alert-circle", href: "/my-blockers" },
  { label: "Team Tasks", icon: "users", href: "/team-tasks" },
];

export const VIEWER_NAV: NavItem[] = [
  { label: "Reports", icon: "file-text", href: "/reports" },
  { label: "Risks", icon: "alert-triangle", href: "/risks" },
  { label: "Weekly Brief", icon: "file-text", href: "/report/weekly" },
];

export function getNavForRole(role: DemoRole): NavItem[] {
  if (role === "founder") return FOUNDER_NAV;
  if (role === "product_manager") return PM_NAV;
  if (role === "engineering_manager") return EM_NAV;
  if (role === "engineer") return DEV_NAV;
  return VIEWER_NAV;
}
