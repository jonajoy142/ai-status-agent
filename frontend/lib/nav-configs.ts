import type { DemoRole } from "@/components/auth-provider";

export type NavItem = {
  label: string;
  icon: string;
  href: string;
  badge?: string;
};

export const FOUNDER_NAV: NavItem[] = [
  { label: "Overview", icon: "layout", href: "/dashboard/founder" },
  { label: "Ask SprintPilot", icon: "sparkles", href: "/agent-run", badge: "AI RAG" },
  { label: "Weekly Brief", icon: "file-text", href: "/report/weekly" },
  { label: "Business Priorities", icon: "target", href: "/priorities" },
  { label: "Risks Radar", icon: "alert-triangle", href: "/risks", badge: "3" },
  { label: "Decisions Log", icon: "git-branch", href: "/decisions", badge: "3" },
  { label: "Knowledge Base", icon: "layers", href: "/knowledge-base" },
  { label: "Team Health", icon: "users", href: "/teams" },
];

export const PM_NAV: NavItem[] = [
  { label: "Sprint Dashboard", icon: "activity", href: "/dashboard/pm" },
  { label: "Ask SprintPilot", icon: "sparkles", href: "/agent-run", badge: "AI RAG" },
  { label: "Weekly Report", icon: "file-text", href: "/report/weekly" },
  { label: "Work Items", icon: "list", href: "/work-items" },
  { label: "Epics & Priorities", icon: "target", href: "/priorities" },
  { label: "Risk Center", icon: "alert-triangle", href: "/risks", badge: "3" },
  { label: "Decisions", icon: "git-branch", href: "/decisions", badge: "3" },
  { label: "Knowledge Base", icon: "layers", href: "/knowledge-base" },
  { label: "Connectors", icon: "plug", href: "/connectors" },
];

export const EM_NAV: NavItem[] = [
  { label: "Team Overview", icon: "users", href: "/dashboard/em" },
  { label: "Ask SprintPilot", icon: "sparkles", href: "/agent-run", badge: "AI RAG" },
  { label: "Work Items", icon: "list", href: "/work-items" },
  { label: "PRs & Reviews", icon: "git-pull-request", href: "/prs" },
  { label: "Risks Radar", icon: "alert-triangle", href: "/risks", badge: "3" },
  { label: "Delivery Confidence", icon: "bar-chart-2", href: "/delivery" },
  { label: "Knowledge Base", icon: "layers", href: "/knowledge-base" },
  { label: "Reports Archive", icon: "file-text", href: "/reports" },
];

export const DEV_NAV: NavItem[] = [
  { label: "My Tasks", icon: "check-square", href: "/dashboard/developer" },
  { label: "Ask SprintPilot", icon: "sparkles", href: "/agent-run", badge: "AI RAG" },
  { label: "My PRs", icon: "git-pull-request", href: "/my-prs" },
  { label: "My Blockers", icon: "alert-circle", href: "/my-blockers" },
  { label: "Team Tasks", icon: "users", href: "/team-tasks" },
  { label: "Knowledge Base", icon: "layers", href: "/knowledge-base" },
];

export const VIEWER_NAV: NavItem[] = [
  { label: "Reports Archive", icon: "file-text", href: "/reports" },
  { label: "Ask SprintPilot", icon: "sparkles", href: "/agent-run", badge: "AI RAG" },
  { label: "Risks Radar", icon: "alert-triangle", href: "/risks" },
  { label: "Weekly Brief", icon: "file-text", href: "/report/weekly" },
  { label: "Knowledge Base", icon: "layers", href: "/knowledge-base" },
];

export function getNavForRole(role: DemoRole): NavItem[] {
  if (role === "founder") return FOUNDER_NAV;
  if (role === "product_manager") return PM_NAV;
  if (role === "engineering_manager") return EM_NAV;
  if (role === "engineer") return DEV_NAV;
  return VIEWER_NAV;
}
