"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { API_BASE_URL } from "@/lib/api";

export type DemoRole = "founder" | "product_manager" | "engineering_manager" | "engineer" | "viewer";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  title: string;
};

export const demoUsers: DemoUser[] = [
  { id: "u-founder", name: "Ananya Rao", email: "founder@demo.sprintpilot.ai", role: "founder", title: "Founder / CEO" },
  { id: "u-pm", name: "Maya Menon", email: "pm@demo.sprintpilot.ai", role: "product_manager", title: "Product Manager" },
  { id: "u-em", name: "Dev Shah", email: "em@demo.sprintpilot.ai", role: "engineering_manager", title: "Engineering Manager" },
  { id: "u-eng", name: "Alex Torres", email: "dev@demo.sprintpilot.ai", role: "engineer", title: "Backend Engineer" },
  { id: "u-viewer", name: "Nora Lee", email: "viewer@demo.sprintpilot.ai", role: "viewer", title: "Viewer" },
];

const labels: Record<DemoRole, string> = {
  founder: "Founder",
  product_manager: "Product Manager",
  engineering_manager: "Engineering Manager",
  engineer: "Engineer",
  viewer: "Viewer",
};

type AuthPayload = {
  access_token: string;
  user: DemoUser;
  role: DemoRole;
  workspace_id: string;
};

type AuthContextValue = {
  user: DemoUser;
  users: DemoUser[];
  isLoggedIn: boolean;
  roleLabel: string;
  accessToken: string | null;
  workspaceId: string | null;
  loginAs: (role: DemoRole) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role?: DemoRole) => Promise<void>;
  loginWithOAuth: (provider: "google" | "github") => void;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser>(demoUsers[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>("ws-demo");

  useEffect(() => {
    const storedRole = window.localStorage.getItem("sprintpilot.role") as DemoRole | null;
    const storedLogin = window.localStorage.getItem("sprintpilot.loggedIn");
    const storedToken = window.localStorage.getItem("sprintpilot.accessToken");
    const storedWorkspace = window.localStorage.getItem("sprintpilot.workspaceId");
    const nextUser = demoUsers.find((candidate) => candidate.role === storedRole) || demoUsers[0];
    setUser(nextUser);
    setIsLoggedIn(storedLogin !== "false");
    setAccessToken(storedToken);
    setWorkspaceId(storedWorkspace || "ws-demo");
    if (storedLogin !== "false") setSessionCookie();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    users: demoUsers,
    isLoggedIn,
    roleLabel: labels[user.role],
    accessToken,
    workspaceId,
    loginAs: (role: DemoRole) => {
      const nextUser = demoUsers.find((candidate) => candidate.role === role) || demoUsers[0];
      applySession({ user: nextUser, role, workspace_id: "ws-demo", access_token: accessToken || "demo-local-token" }, setUser, setIsLoggedIn, setAccessToken, setWorkspaceId);
    },
    login: async (email: string, password: string) => {
      const payload = await authFetch<AuthPayload>("/api/auth/login", { email, password });
      applySession(payload, setUser, setIsLoggedIn, setAccessToken, setWorkspaceId);
    },
    register: async (email: string, password: string, fullName: string, role: DemoRole = "viewer") => {
      const payload = await authFetch<AuthPayload>("/api/auth/register", { email, password, full_name: fullName, role });
      applySession(payload, setUser, setIsLoggedIn, setAccessToken, setWorkspaceId);
    },
    loginWithOAuth: (provider: "google" | "github") => {
      window.location.href = `${API_BASE_URL}/api/auth/oauth/${provider}`;
    },
    refreshToken: async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, { method: "POST", credentials: "include" });
      if (!response.ok) throw new Error("Refresh failed");
      const payload = await response.json() as AuthPayload;
      applySession(payload, setUser, setIsLoggedIn, setAccessToken, setWorkspaceId);
    },
    logout: async () => {
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
      } catch {
        // Local demo logout should still work if backend is offline.
      }
      setIsLoggedIn(false);
      setAccessToken(null);
      window.localStorage.setItem("sprintpilot.loggedIn", "false");
      window.localStorage.removeItem("sprintpilot.accessToken");
      clearSessionCookie();
    },
  }), [accessToken, isLoggedIn, user, workspaceId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

async function authFetch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Authentication failed");
  }
  return response.json();
}

function applySession(
  payload: AuthPayload,
  setUser: (user: DemoUser) => void,
  setIsLoggedIn: (value: boolean) => void,
  setAccessToken: (value: string | null) => void,
  setWorkspaceId: (value: string | null) => void,
) {
  const nextUser = normalizeUser(payload.user, payload.role);
  setUser(nextUser);
  setIsLoggedIn(true);
  setAccessToken(payload.access_token);
  setWorkspaceId(payload.workspace_id);
  window.localStorage.setItem("sprintpilot.role", nextUser.role);
  window.localStorage.setItem("sprintpilot.loggedIn", "true");
  window.localStorage.setItem("sprintpilot.accessToken", payload.access_token);
  window.localStorage.setItem("sprintpilot.workspaceId", payload.workspace_id);
  setSessionCookie();
}

function normalizeUser(user: DemoUser, role: DemoRole): DemoUser {
  return { ...user, role, title: user.title || labels[role] };
}

function setSessionCookie() {
  document.cookie = "sprintpilot_session=1; path=/; max-age=2592000; SameSite=Lax";
}

function clearSessionCookie() {
  document.cookie = "sprintpilot_session=; path=/; max-age=0; SameSite=Lax";
}
