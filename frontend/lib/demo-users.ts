export type DemoRole = "founder" | "product_manager" | "engineering_manager" | "engineer" | "viewer";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  title: string;
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: "u-founder",
    name: "Ananya Rao",
    email: "founder@demo.sprintpilot.ai",
    role: "founder",
    title: "Founder / CEO",
  },
  {
    id: "u-pm",
    name: "Maya Menon",
    email: "pm@demo.sprintpilot.ai",
    role: "product_manager",
    title: "Product Manager",
  },
  {
    id: "u-em",
    name: "Dev Shah",
    email: "em@demo.sprintpilot.ai",
    role: "engineering_manager",
    title: "Engineering Manager",
  },
  {
    id: "u-eng",
    name: "Alex Torres",
    email: "dev@demo.sprintpilot.ai",
    role: "engineer",
    title: "Backend Engineer",
  },
  {
    id: "u-viewer",
    name: "Nora Lee",
    email: "viewer@demo.sprintpilot.ai",
    role: "viewer",
    title: "Viewer",
  },
];

export const ROLE_LABELS: Record<DemoRole, string> = {
  founder: "Founder",
  product_manager: "Product Manager",
  engineering_manager: "Engineering Manager",
  engineer: "Engineer",
  viewer: "Viewer",
};

export function getUserByEmail(email?: string): DemoUser {
  if (!email) return DEMO_USERS[0];
  const normalized = email.trim().toLowerCase();
  const matched = DEMO_USERS.find((u) => u.email.toLowerCase() === normalized);
  if (matched) return matched;

  // Derive role and name from custom email
  const namePart = email.split("@")[0] || "User";
  const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
  return {
    id: `u-${Date.now().toString(36)}`,
    name: formattedName,
    email: email.trim(),
    role: "founder",
    title: "Executive Leader",
  };
}

export function getUserByRole(role?: string): DemoUser {
  const matched = DEMO_USERS.find((u) => u.role === role);
  return matched || DEMO_USERS[0];
}
