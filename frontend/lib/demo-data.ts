import type { DemoRole } from "@/components/auth-provider";

export const roleDashboard: Record<DemoRole, {
  headline: string;
  subhead: string;
  cards: Array<{ label: string; value: string; detail: string; trend?: string }>;
  attention: string[];
}> = {
  founder: {
    headline: "Mostly on track, but checkout launch needs one final validation pass.",
    subhead: "Founder view focuses on business impact, risks, decisions, and the latest leadership brief.",
    cards: [
      { label: "Sprint health", value: "83%", detail: "Launch can proceed after focused validation.", trend: "mostly on track" },
      { label: "Open risks", value: "3", detail: "Two medium risks affect launch confidence.", trend: "watch" },
      { label: "Decisions needed", value: "2", detail: "Launch sign-off and release-note audience.", trend: "this week" },
      { label: "Business impact", value: "High", detail: "Checkout launch is the revenue-critical workflow.", trend: "priority" },
    ],
    attention: ["Approve checkout launch after final staging pass.", "Keep AUTH-118 visible until review closes.", "Decide whether release notes stay internal this week."],
  },
  product_manager: {
    headline: "Sprint 14 is moving, with two owner follow-ups and one release-note polish item.",
    subhead: "PM view focuses on stale tickets, blockers, owner follow-ups, release notes, and weekly updates.",
    cards: [
      { label: "Sprint progress", value: "72%", detail: "Core checkout work is progressing.", trend: "active" },
      { label: "Stale tickets", value: "2", detail: "PAY-231 and REL-077 need updates.", trend: "follow up" },
      { label: "Owner follow-ups", value: "3", detail: "Rahul, Isha, Nora.", trend: "today" },
      { label: "Release notes", value: "Draft", detail: "Needs citation cleanup.", trend: "review" },
    ],
    attention: ["Follow up with Rahul on retry validation.", "Check Isha's AUTH-118 review status.", "Clean citations before external release notes."],
  },
  engineering_manager: {
    headline: "No hard blockers, but payment retry validation and auth review remain delivery risks.",
    subhead: "Engineering manager view focuses on blocked engineers, PR delays, owner workload, and dependencies.",
    cards: [
      { label: "Blocked engineers", value: "0", detail: "No owner is fully blocked.", trend: "clear" },
      { label: "PR delays", value: "1", detail: "AUTH-118 review needs attention.", trend: "review" },
      { label: "Owner workload", value: "Rahul", detail: "Highest load on payment launch path.", trend: "watch" },
      { label: "Delivery confidence", value: "82%", detail: "Improves after staging pass.", trend: "+6%" },
    ],
    attention: ["Protect Rahul's focus for PAY-231 validation.", "Unblock AUTH-118 review.", "Confirm dependency between PAY-231 and PAY-245."],
  },
  engineer: {
    headline: "Your highest-impact work is PAY-231 validation and closing retry-safe order updates.",
    subhead: "Engineer view focuses on assigned work, blockers, stale tasks, and suggested next actions.",
    cards: [
      { label: "Assigned work", value: "3", detail: "Two launch-path tasks.", trend: "active" },
      { label: "Blockers", value: "0", detail: "No hard blockers assigned to you.", trend: "clear" },
      { label: "Stale score", value: "32", detail: "PAY-231 needs fresh update.", trend: "update" },
      { label: "Next action", value: "1", detail: "Run retry validation.", trend: "today" },
    ],
    attention: ["Run staging retry validation.", "Update PAY-231 with latest evidence.", "Share launch-readiness status in payments channel."],
  },
  viewer: {
    headline: "Checkout launch is mostly on track with medium risk and clear next actions.",
    subhead: "Viewer mode shows read-only execution health, risks, and brief preview.",
    cards: [
      { label: "Sprint health", value: "83%", detail: "Mostly on track.", trend: "read-only" },
      { label: "Open risks", value: "3", detail: "One launch-path item needs attention.", trend: "watch" },
      { label: "Latest brief", value: "Ready", detail: "Founder brief generated today.", trend: "fresh" },
      { label: "Decisions", value: "2", detail: "Leadership input required.", trend: "this week" },
    ],
    attention: ["Review launch-readiness brief.", "Watch payment retry validation.", "Track AUTH-118 review closure."],
  },
};

export const workItems = [
  { id: "PAY-231", title: "Implement Stripe payment gateway", status: "In Progress", priority: "High", assignee: "Rahul", sprint: "Sprint 14", risk: "Medium", stale: 32, impact: "Checkout launch readiness", next: "Run staging retry validation", source: "Jira" },
  { id: "AUTH-118", title: "Session refresh reliability", status: "In Review", priority: "High", assignee: "Isha", sprint: "Sprint 14", risk: "Medium", stale: 18, impact: "Checkout conversion stability", next: "Close regression review", source: "Jira" },
  { id: "OBS-042", title: "Checkout metrics dashboard", status: "Done", priority: "Medium", assignee: "Dev", sprint: "Sprint 14", risk: "Low", stale: 4, impact: "Launch incident response", next: "Use in launch review", source: "Jira" },
  { id: "REL-077", title: "Release notes automation", status: "In Progress", priority: "Medium", assignee: "Nora", sprint: "Sprint 14", risk: "Low", stale: 41, impact: "Leadership and customer comms", next: "Clean source citations", source: "ClickUp" },
  { id: "PAY-245", title: "Refund processing support", status: "Todo", priority: "Medium", assignee: "Maya", sprint: "Sprint 15", risk: "Low", stale: 15, impact: "Post-launch support readiness", next: "Start after PAY-231 sign-off", source: "Jira" },
];

export const risks = [
  { title: "Payment retry behavior not fully validated", level: "Medium", owner: "Rahul", impact: "Can delay checkout launch sign-off", action: "Run focused staging pass" },
  { title: "Auth refresh instability could affect checkout conversion", level: "Medium", owner: "Isha", impact: "Long checkout sessions may fail", action: "Prioritize review and regression coverage" },
  { title: "Release notes need source citation cleanup", level: "Low", owner: "Nora", impact: "External updates need stronger evidence", action: "Validate one release note draft" },
];

export const decisions = [
  { title: "Approve checkout launch after final staging pass?", owner: "Founder / PM", due: "Jun 13", impact: "Launch window may slip by one sprint" },
  { title: "Should release notes be internal-only this week?", owner: "Maya", due: "Jun 12", impact: "External comms may contain weak citations" },
];

export const connectors = [
  { name: "Jira", status: "Mock connected", auth: "OAuth / API token", lastSync: "Today 09:10", env: "JIRA_BASE_URL, JIRA_API_TOKEN" },
  { name: "Slack", status: "Mock connected", auth: "OAuth", lastSync: "Today 09:05", env: "SLACK_BOT_TOKEN" },
  { name: "GitHub", status: "Mock connected", auth: "GitHub App", lastSync: "Today 08:45", env: "GITHUB_APP_ID" },
  { name: "Confluence", status: "Ready to connect", auth: "OAuth", lastSync: "Not synced", env: "CONFLUENCE_API_TOKEN" },
  { name: "Notion", status: "Ready to connect", auth: "OAuth", lastSync: "Not synced", env: "NOTION_TOKEN" },
  { name: "Linear", status: "Ready to connect", auth: "API key", lastSync: "Not synced", env: "LINEAR_API_KEY" },
];

export const reports = [
  { type: "Weekly Founder Brief", title: "Checkout launch operating brief", confidence: 91, summary: "Checkout launch is mostly on track, with medium risk until payment retry behavior and auth stability pass final validation." },
  { type: "Product Sprint Update", title: "Sprint 14 product update", confidence: 88, summary: "Payments and auth remain the critical path. Reporting automation is useful internally but needs polish before external use." },
  { type: "Engineering Manager Update", title: "Delivery confidence update", confidence: 86, summary: "No hard blockers, but review throughput and retry validation should stay visible." },
  { type: "Release Notes Draft", title: "Checkout modernization release notes", confidence: 82, summary: "Draft is usable internally and needs citation cleanup before external sharing." },
  { type: "Slack-ready Summary", title: "Weekly #eng-leads update", confidence: 90, summary: "Short update with shipped work, risks, and next actions for leadership channel." },
  { type: "Risk Report", title: "Launch risk report", confidence: 89, summary: "Three risks need monitoring; no hard blockers currently exist." },
];
