import type { DemoRole } from "@/components/auth-provider";

export const roleDashboardRoute: Record<DemoRole, string> = {
  founder: "/dashboard/founder",
  product_manager: "/dashboard/pm",
  engineering_manager: "/dashboard/em",
  engineer: "/dashboard/developer",
  viewer: "/reports",
};

export function getDashboardRoute(role: DemoRole) {
  return roleDashboardRoute[role] || "/dashboard/founder";
}
