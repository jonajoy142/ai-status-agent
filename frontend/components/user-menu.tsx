"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";

import { useAuth, type DemoRole } from "@/components/auth-provider";
import { getDashboardRoute } from "@/lib/role-router";
import { cn } from "@/lib/utils";

const roleOptions: Array<{ label: string; value: DemoRole }> = [
  { label: "Founder", value: "founder" },
  { label: "PM", value: "product_manager" },
  { label: "EM", value: "engineering_manager" },
  { label: "Engineer", value: "engineer" },
  { label: "Viewer", value: "viewer" },
];

export function UserMenu({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { user, roleLabel, loginAs, logout, isLoggedIn } = useAuth();

  function changeRole(role: DemoRole) {
    loginAs(role);
    router.push(getDashboardRoute(role));
  }

  return (
    <div className={cn("flex items-center gap-2", compact && "w-full")}> 
      <select
        aria-label="Demo role"
        value={user.role}
        onChange={(event) => changeRole(event.target.value as DemoRole)}
        className={cn(
          "rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 outline-none transition hover:bg-slate-50 focus:ring-sky-200",
          compact && "min-w-0 flex-1",
        )}
      >
        {roleOptions.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
      </select>
      <Link href="/login" className={cn("items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50", compact ? "hidden" : "hidden md:flex")}>
        <UserRound className="h-4 w-4" />
        {isLoggedIn ? roleLabel : "Login"}
      </Link>
      {isLoggedIn ? (
        <button onClick={logout} className="rounded-xl bg-white p-2 text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-50" aria-label="Logout">
          <LogOut className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
