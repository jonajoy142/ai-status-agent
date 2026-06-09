"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type DemoRole = "founder" | "product_manager" | "engineering_manager" | "engineer" | "viewer";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  title: string;
};

export const demoUsers: DemoUser[] = [
  { id: "u-founder", name: "Ananya Rao", email: "founder@sprintpilot.ai", role: "founder", title: "Founder / CEO" },
  { id: "u-pm", name: "Maya Menon", email: "pm@sprintpilot.ai", role: "product_manager", title: "Product Manager" },
  { id: "u-em", name: "Dev Shah", email: "em@sprintpilot.ai", role: "engineering_manager", title: "Engineering Manager" },
  { id: "u-eng", name: "Rahul Iyer", email: "engineer@sprintpilot.ai", role: "engineer", title: "Backend Engineer" },
  { id: "u-viewer", name: "Nora Lee", email: "viewer@sprintpilot.ai", role: "viewer", title: "Viewer" },
];

const labels: Record<DemoRole, string> = {
  founder: "Founder",
  product_manager: "Product Manager",
  engineering_manager: "Engineering Manager",
  engineer: "Engineer",
  viewer: "Viewer",
};

type AuthContextValue = {
  user: DemoUser;
  users: DemoUser[];
  isLoggedIn: boolean;
  roleLabel: string;
  loginAs: (role: DemoRole) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser>(demoUsers[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const storedRole = window.localStorage.getItem("sprintpilot.role") as DemoRole | null;
    const storedLogin = window.localStorage.getItem("sprintpilot.loggedIn");
    const nextUser = demoUsers.find((candidate) => candidate.role === storedRole) || demoUsers[0];
    setUser(nextUser);
    setIsLoggedIn(storedLogin !== "false");
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    users: demoUsers,
    isLoggedIn,
    roleLabel: labels[user.role],
    loginAs: (role: DemoRole) => {
      const nextUser = demoUsers.find((candidate) => candidate.role === role) || demoUsers[0];
      setUser(nextUser);
      setIsLoggedIn(true);
      window.localStorage.setItem("sprintpilot.role", role);
      window.localStorage.setItem("sprintpilot.loggedIn", "true");
    },
    logout: () => {
      setIsLoggedIn(false);
      window.localStorage.setItem("sprintpilot.loggedIn", "false");
    },
  }), [isLoggedIn, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
