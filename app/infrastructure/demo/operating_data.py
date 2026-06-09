from datetime import datetime, timezone

from app.domain.models.operating import (
    BusinessPriority,
    Connector,
    DashboardOverview,
    Decision,
    Evaluation,
    PullRequest,
    Report,
    Risk,
    SyncRun,
    Team,
    User,
    WeeklyReportRequest,
    WeeklyReportOutput,
    WorkItem,
)

USERS = [
    User(id="u-founder", name="Ananya Rao", email="founder@demo.sprintpilot.ai", role="founder", title="Founder / CEO"),
    User(id="u-pm", name="Maya Menon", email="pm@demo.sprintpilot.ai", role="product_manager", title="Product Manager"),
    User(id="u-em", name="Dev Shah", email="em@demo.sprintpilot.ai", role="engineering_manager", title="Engineering Manager"),
    User(id="u-eng", name="Alex Torres", email="dev@demo.sprintpilot.ai", role="engineer", title="Backend Engineer"),
    User(id="u-viewer", name="Nora Lee", email="viewer@demo.sprintpilot.ai", role="viewer", title="Viewer"),
]

TEAMS = [
    Team(id="team-full-stack", name="Full Stack Team", lead="Sarah Chen", members=["Sarah Chen", "Marcus Rivera", "Jordan Kim"], capacity=105, completed=44, blocked_items=3, risk_level="medium", delivery_confidence=72, business_priority="Customer Onboarding Revamp"),
    Team(id="team-agentic-ai", name="Agentic AI Team", lead="Dr. Priya Nair", members=["Dr. Priya Nair", "Alex Torres", "Sam Okonkwo"], capacity=90, completed=38, blocked_items=1, risk_level="low", delivery_confidence=85, business_priority="AI Reporting Automation"),
    Team(id="team-platform", name="Backend Platform Team", lead="Jordan Kim", members=["Jordan Kim", "Chris Nakamura", "Fatima Al-Rashid"], capacity=80, completed=25, blocked_items=5, risk_level="high", delivery_confidence=55, business_priority="Checkout Launch"),
    Team(id="team-pricing", name="Algorithm / Pricing Team", lead="Dr. Elena Vasquez", members=["Dr. Elena Vasquez", "Raj Patel"], capacity=60, completed=32, blocked_items=0, risk_level="low", delivery_confidence=88, business_priority="Pricing Engine Upgrade"),
]

BUSINESS_PRIORITIES = [
    BusinessPriority(id="priority-checkout", name="Checkout Launch", status="at_risk", eta="June 18, 2026", owner="Backend Platform Team", impacted_teams=["Backend Platform", "Full Stack"], risk_summary="Payments API dependency blocked 6 days", business_impact="Blocks Q2 revenue target. 2,000 users waiting."),
    BusinessPriority(id="priority-ai-reporting", name="AI Reporting Automation", status="delayed", eta="June 22, 2026", owner="Agentic AI Team", impacted_teams=["Agentic AI"], risk_summary="4-day delay due to evaluation pipeline rework", business_impact="Delays internal PM adoption. Low external impact."),
    BusinessPriority(id="priority-onboarding", name="Customer Onboarding Revamp", status="on_track", eta="June 18, 2026", owner="Full Stack Team", impacted_teams=["Full Stack"], risk_summary="None", business_impact="Reduces onboarding drop-off by roughly 35%."),
    BusinessPriority(id="priority-pricing", name="Pricing Engine Upgrade", status="on_track", eta="June 25, 2026", owner="Algorithm / Pricing Team", impacted_teams=["Algorithm / Pricing"], risk_summary="None", business_impact="Enables dynamic pricing for enterprise tier."),
]

WORK_ITEMS = [
    WorkItem(id="wi-1", external_id="TICK-231", title="Fix retry logic in payments module", description="Retry-safe order updates for payment intent failures and webhook replay.", status="In Progress", priority="High", assignee="Alex Torres", reporter="Maya Menon", sprint="Sprint 24", epic="Checkout Modernization", labels=["payments", "checkout", "launch"], due_date="2026-06-14", source="Jira", source_url="https://jira.example.com/browse/TICK-231", risk_level="critical", blocker_reason="Payments API spec has not been delivered by the vendor.", stale_score=76, business_impact="Checkout launch readiness and Q2 revenue target depend on reliable payment retry behavior.", suggested_next_action="Escalate Payments API spec to CTO and implement mock spec fallback by June 10.", updated_at="2026-06-03"),
    WorkItem(id="wi-2", external_id="AUTH-118", title="Session refresh reliability", description="Fix token refresh race condition during long checkout sessions.", status="In Review", priority="High", assignee="Isha Rao", reporter="Dev Shah", sprint="Sprint 24", epic="Checkout Modernization", labels=["auth", "checkout"], due_date="2026-06-12", source="Jira", source_url="https://jira.example.com/browse/AUTH-118", risk_level="medium", blocker_reason=None, stale_score=18, business_impact="Failed checkout sessions can reduce conversion and delay launch sign-off.", suggested_next_action="Review regression tests and merge if staging remains stable.", updated_at="2026-06-05"),
    WorkItem(id="wi-3", external_id="OBS-042", title="Checkout metrics dashboard", description="Payment funnel metrics, webhook failure alerts, and latency dashboard.", status="Done", priority="Medium", assignee="Dev Shah", reporter="Maya Menon", sprint="Sprint 24", epic="Launch Readiness", labels=["metrics", "alerts"], due_date="2026-06-06", source="Jira", source_url="https://jira.example.com/browse/OBS-042", risk_level="low", blocker_reason=None, stale_score=4, business_impact="Improves incident response during launch week.", suggested_next_action="Use dashboard during launch readiness review.", updated_at="2026-06-05"),
    WorkItem(id="wi-4", external_id="REL-077", title="Release notes automation", description="Generate release notes from merged tickets and sprint summaries.", status="In Progress", priority="Medium", assignee="Nora Lee", reporter="Maya Menon", sprint="Sprint 24", epic="Stakeholder Comms", labels=["release-notes", "reporting"], due_date="2026-06-13", source="Jira", source_url="https://jira.example.com/browse/REL-077", risk_level="low", blocker_reason="Citation cleanup required before external use.", stale_score=41, business_impact="Leadership updates need source-backed summaries.", suggested_next_action="Clean citation formatting and validate one generated release draft.", updated_at="2026-06-04"),
    WorkItem(id="wi-5", external_id="PAY-245", title="Refund processing support", description="Implement refund API and admin support workflow.", status="Todo", priority="Medium", assignee="Maya Menon", reporter="Dr. Priya Nair", sprint="Sprint 25", epic="Payments Platform", labels=["refunds", "admin"], due_date="2026-06-20", source="Jira", source_url="https://jira.example.com/browse/PAY-245", risk_level="low", blocker_reason="Depends on TICK-231 stabilization.", stale_score=15, business_impact="Important for support readiness after checkout launch.", suggested_next_action="Start implementation after payment retry behavior is signed off.", updated_at="2026-06-03"),
]

PULL_REQUESTS = [
    PullRequest(id="pr-241", number=241, title="Add payment retry logic", status="Awaiting review", author="Alex Torres", reviewer="Marcus Rivera", waiting_days=4, blocks="Checkout Launch", source_url="https://github.example.com/org/app/pull/241"),
    PullRequest(id="pr-238", number=238, title="Auth token refresh", status="Changes requested", author="Isha Rao", reviewer="Sarah Chen", waiting_days=3, blocks="Customer Onboarding", source_url="https://github.example.com/org/app/pull/238"),
    PullRequest(id="pr-246", number=246, title="Report citation formatter", status="Open", author="Nora Lee", reviewer="Dr. Priya Nair", waiting_days=1, blocks="AI Reporting Automation", source_url="https://github.example.com/org/app/pull/246"),
]

RISKS = [
    Risk(id="risk-1", title="Payments API dependency blocked", level="critical", owner="Jordan Kim", status="Open", business_impact="Checkout launch may slip 1-2 weeks and push Q2 revenue recognition.", evidence=["TICK-231 blocked since June 3", "Vendor API spec missing", "PR #241 waiting on review"], recommended_action="Escalate to CTO and approve mock-spec fallback today.", source_url="https://jira.example.com/browse/TICK-231"),
    Risk(id="risk-2", title="Backend Team at 130% planned capacity", level="high", owner="Sarah Chen", status="Open", business_impact="Three projects depend on an overloaded team, increasing delivery and burnout risk.", evidence=["Sarah Chen carrying 52 of 40 planned points", "Full Stack Team has 3 blocked items"], recommended_action="Reassign two non-critical tickets to Marcus Rivera.", source_url="https://jira.example.com/sprint/24"),
    Risk(id="risk-3", title="8 tickets stale for over 10 days", level="medium", owner="Maya Menon", status="Monitoring", business_impact="Sprint predictability is degrading across three teams.", evidence=["TICK-198", "TICK-202", "TICK-207", "TICK-211", "TICK-215", "TICK-218", "TICK-222", "TICK-225"], recommended_action="PM should review stale tickets in the next standup and reassign or close stale work.", source_url="https://jira.example.com/issues/?jql=stale"),
]

DECISIONS = [
    Decision(id="decision-1", title="Reduce scope for Checkout v1", owner="Jordan Kim", due_date="2026-06-11", context="Payments API is blocked and launch is in 9 days. Full scope is not achievable without a decision.", impact_if_delayed="Each day of delay creates about $4,000 in deferred revenue.", options=[{"label": "Reduce scope", "description": "Ship without retry logic. Add in v1.1.", "tradeoff": "Faster launch, lower reliability"}, {"label": "Delay launch", "description": "Wait for API spec. Full feature launch.", "tradeoff": "1-2 week delay, higher quality"}], source_url="https://jira.example.com/browse/TICK-231"),
    Decision(id="decision-2", title="Approve contractor budget for API review", owner="Founder", due_date="2026-06-10", context="External contractor can unblock API spec review in 2 days. Cost: $800.", impact_if_delayed="Every day blocked costs about $500 in idle team time.", options=[{"label": "Approve", "description": "Hire contractor and unblock team.", "tradeoff": "$800 spend, 2-day unblock"}, {"label": "Reject", "description": "Wait for vendor response.", "tradeoff": "Free, but unknown delay"}], source_url="https://slack.example.com/archives/payments/p171785"),
    Decision(id="decision-3", title="Make release notes internal-only this week", owner="Maya Menon", due_date="2026-06-12", context="External release notes require stronger citation cleanup.", impact_if_delayed="Customer-facing comms may contain weak source attribution.", options=["Internal-only", "External with manual review", "Delay release notes"], source_url="https://jira.example.com/browse/REL-077"),
]

REPORTS = [
    Report(id="report-founder-weekly", type="Weekly Founder Brief", title="Checkout launch operating brief", summary="Checkout Launch is at risk. The Payments API dependency has been blocked for 6 days. If unresolved by June 12, launch will likely slip 1-2 weeks and affect the Q2 revenue target.", shipped_work=["Checkout metrics dashboard shipped", "Stripe webhook verification passed in staging"], blocked_work=["Payment retry logic blocked by missing API spec", "PR #241 waiting on review"], risks=["Payments API dependency", "Backend capacity", "Stale sprint work"], decisions_needed=["Reduce Checkout v1 scope", "Approve contractor budget", "Internal-only release notes"], action_items=["Escalate Payments API today", "Approve or reject contractor budget", "Move two tickets off Sarah Chen"], citations=["TICK-231", "PR #241", "Sprint 24 allocation"], confidence_score=82, generated_at="2026-06-09T09:00:00Z"),
    Report(id="report-pm-sprint", type="Product Sprint Update", title="Sprint 24 product update", summary="Sprint 24 is 42% complete with 12 days remaining. Seven tickets are blocked, twelve are stale, and three epics are at risk. Payments and auth remain the critical path.", shipped_work=["Checkout metrics dashboard", "Webhook verification"], blocked_work=["TICK-231 payment retry logic", "REL-077 citation cleanup"], risks=["Checkout Launch", "AI Reporting Automation"], decisions_needed=["Launch scope", "Contractor budget"], action_items=["Follow up with Jordan", "Review stale tickets", "Generate founder brief"], citations=["TICK-231", "AUTH-118", "REL-077"], confidence_score=88, generated_at="2026-06-08T16:30:00Z"),
]

CONNECTORS = [
    Connector(id="jira", name="Jira", status="mock", auth_type="OAuth / API token", last_synced_at="2026-06-09T09:10:00Z", scopes=["read:issues", "read:comments", "read:projects"], env_vars=["JIRA_BASE_URL", "JIRA_EMAIL", "JIRA_API_TOKEN", "JIRA_PROJECT_KEY"]),
    Connector(id="github", name="GitHub", status="mock", auth_type="GitHub App / token", last_synced_at="2026-06-09T08:45:00Z", scopes=["repo:read", "pull_requests:read"], env_vars=["GITHUB_TOKEN", "GITHUB_REPO"]),
    Connector(id="slack", name="Slack", status="mock", auth_type="OAuth", last_synced_at="2026-06-09T09:05:00Z", scopes=["search:read", "channels:history"], env_vars=["SLACK_BOT_TOKEN", "SLACK_CHANNEL_IDS"]),
    Connector(id="confluence", name="Confluence", status="not_connected", auth_type="OAuth", scopes=["read:pages"], env_vars=["CONFLUENCE_BASE_URL", "CONFLUENCE_API_TOKEN"]),
    Connector(id="notion", name="Notion", status="not_connected", auth_type="OAuth", scopes=["read:content"], env_vars=["NOTION_TOKEN"]),
    Connector(id="linear", name="Linear", status="not_connected", auth_type="OAuth", scopes=["read:issues"], env_vars=["LINEAR_API_KEY"]),
]

EVALUATIONS = [
    Evaluation(id="eval-1", name="Sources checked", score=94, status="pass", latency_ms=640, token_usage=1700, cost_estimate_usd=0.012),
    Evaluation(id="eval-2", name="Claims verified", score=96, status="pass", latency_ms=520, token_usage=1200, cost_estimate_usd=0.009),
    Evaluation(id="eval-3", name="Source relevance", score=91, status="pass", latency_ms=430, token_usage=900, cost_estimate_usd=0.006),
    Evaluation(id="eval-4", name="Citation accuracy", score=89, status="warn", latency_ms=580, token_usage=1400, cost_estimate_usd=0.01),
]

ROLE_HEADLINES = {
    "founder": "Execution is moderate: Checkout Launch needs a decision this week.",
    "product_manager": "Sprint 24 is 42% complete with blocked work concentrated in checkout.",
    "pm": "Sprint 24 is 42% complete with blocked work concentrated in checkout.",
    "engineering_manager": "Delivery confidence is constrained by PR review delay and platform dependency risk.",
    "engineer": "Your focus today is payment retry logic, PR follow-up, and blocker escalation.",
    "developer": "Your focus today is payment retry logic, PR follow-up, and blocker escalation.",
    "viewer": "Latest reports are ready for read-only review.",
}


def normalize_role(role: str) -> str:
    if role == "pm":
        return "product_manager"
    if role == "developer":
        return "engineer"
    return role if role in ROLE_HEADLINES else "founder"


def dashboard_for_role(role: str) -> DashboardOverview:
    normalized_role = normalize_role(role)
    return DashboardOverview(
        role=normalized_role,  # type: ignore[arg-type]
        headline=ROLE_HEADLINES[normalized_role],
        sprint_health=78 if normalized_role == "founder" else 72,
        open_risks=len(RISKS),
        blocked_work=7,
        decisions_needed=len(DECISIONS),
        business_impact="Checkout Launch is the highest-priority revenue workflow this sprint.",
        weekly_brief_preview=REPORTS[0].summary,
        suggested_next_actions=[risk.recommended_action for risk in RISKS[:3]],
        latest_changes=[
            "Payments API spec remained blocked for a sixth day",
            "Checkout metrics became available for launch review",
            "Auth token refresh moved into review",
            "AI report citation pipeline needs one cleanup pass",
        ],
        owner_workload={"Sarah Chen": 52, "Marcus Rivera": 33, "Alex Torres": 28, "Jordan Kim": 18},
    )


def role_dashboard_detail(role: str) -> dict:
    normalized_role = normalize_role(role)
    base = dashboard_for_role(normalized_role).model_dump(mode="json")
    if normalized_role == "founder":
        return {**base, "execution_health": 78, "business_priorities": [priority.model_dump(mode="json") for priority in BUSINESS_PRIORITIES], "top_risks": [risk.model_dump(mode="json") for risk in RISKS[:3]], "decisions_needed_items": [decision.model_dump(mode="json") for decision in DECISIONS], "recommended_actions": ["Decide Checkout v1 scope today", "Approve or reject contractor budget", "Move non-critical work off Full Stack Team"]}
    if normalized_role == "product_manager":
        return {**base, "sprint": {"name": "Sprint 24", "period": "June 3-17", "days_remaining": 12, "percent_complete": 42, "goal_points": 68, "release_readiness": 68}, "blocked_tickets": [item.model_dump(mode="json") for item in WORK_ITEMS if item.blocker_reason], "stale_tickets": [item.model_dump(mode="json") for item in WORK_ITEMS if item.stale_score >= 30], "overloaded_owners": [{"owner": "Sarah Chen", "ticket_count": 8, "load": "130%"}, {"owner": "Alex Torres", "ticket_count": 5, "load": "93%"}], "epics": [{"name": priority.name, "status": priority.status, "owner": priority.owner} for priority in BUSINESS_PRIORITIES]}
    if normalized_role == "engineering_manager":
        return {**base, "team_capacity": [team.model_dump(mode="json") for team in TEAMS], "pr_delays": [pr.model_dump(mode="json") for pr in PULL_REQUESTS if pr.waiting_days >= 2], "blocked_engineers": [{"name": item.assignee, "blocker": item.blocker_reason, "ticket": item.external_id} for item in WORK_ITEMS if item.blocker_reason], "delivery_confidence": [{"project": team.business_priority, "score": team.delivery_confidence, "team": team.name} for team in TEAMS]}
    if normalized_role == "engineer":
        my_items = [item for item in WORK_ITEMS if item.assignee in {"Alex Torres", "Rahul"}]
        return {**base, "my_tasks": [item.model_dump(mode="json") for item in my_items], "my_blockers": [item.model_dump(mode="json") for item in my_items if item.blocker_reason], "my_prs": [pr.model_dump(mode="json") for pr in PULL_REQUESTS if pr.author == "Alex Torres"], "suggested_actions": [item.suggested_next_action for item in my_items]}
    return {**base, "reports": [report.model_dump(mode="json") for report in REPORTS]}


def weekly_report_for_audience(request: WeeklyReportRequest) -> WeeklyReportOutput:
    audience = normalize_role(request.audience)
    generated_at = datetime.now(timezone.utc).isoformat()
    if audience == "founder":
        summary = "Checkout Launch is at risk. The Payments API dependency has been blocked for 6 days. If unresolved by June 12, launch will likely slip 1-2 weeks and affect the Q2 revenue target."
        actions = ["Approve reduced Checkout v1 scope or delay launch by June 11.", "Approve contractor budget for API review.", "Reassign two non-critical Full Stack tickets this week."]
    elif audience == "engineering_manager":
        summary = "PR #241 is blocking TICK-231. Marcus Rivera has not reviewed it in 4 days. Alex Torres remains blocked on vendor API spec clarity and needs a concrete fallback plan."
        actions = ["Flag PR #241 in standup.", "Ask Marcus Rivera for same-day review.", "Create mock API spec fallback for Alex Torres."]
    elif audience == "engineer":
        summary = "Your ticket TICK-231 is blocked by the missing Payments API spec. The fastest next step is to ping Jordan Kim and proceed with the mock-spec fallback if no answer arrives today."
        actions = ["Ping Jordan Kim for the API spec.", "Update TICK-231 with current blocker evidence.", "Ask Marcus Rivera to review PR #241."]
    else:
        summary = "Sprint 24 is 42% complete with 12 days remaining. Seven tickets are blocked, twelve are stale, and three epics are at risk. TICK-231 is the main checkout risk."
        actions = ["Escalate TICK-231 to Jordan Kim.", "Review stale tickets in standup.", "Generate founder brief after scope decision."]
    return WeeklyReportOutput(
        id=f"weekly-{audience}-demo",
        title="Weekly Execution Brief - June 9, 2026",
        audience=audience,
        sprint_id="sprint-24",
        generated_at=generated_at,
        executive_summary=summary,
        what_shipped=[{"title": "Checkout metrics dashboard", "business_impact": "Launch team can monitor funnel and webhook failures.", "source": "OBS-042"}, {"title": "Webhook verification", "business_impact": "Payment flow has passed staging verification.", "source": "TICK-231"}],
        what_slipped=[{"title": "Payment retry logic", "reason": "Payments API spec missing", "business_impact": "Checkout Launch may slip 1-2 weeks."}],
        top_risks=[{"risk": risk.title, "severity": risk.level, "action": risk.recommended_action, "owner": risk.owner} for risk in RISKS],
        decisions_needed=[{"decision": decision.title, "context": decision.context, "cost_of_delay": decision.impact_if_delayed, "owner": decision.owner} for decision in DECISIONS],
        team_health=[{"team_name": team.name, "planned_points": team.capacity, "completed_points": team.completed, "blocked_items": team.blocked_items, "delivery_confidence": team.delivery_confidence} for team in TEAMS],
        business_impact=[{"priority_name": priority.name, "status": priority.status, "eta": priority.eta, "owner": priority.owner, "business_impact_summary": priority.business_impact} for priority in BUSINESS_PRIORITIES],
        action_items=actions,
        confidence_score=0.82 if audience == "founder" else 0.88,
        citations=[
            {"text": "TICK-231", "source_url": "https://jira.example.com/browse/TICK-231", "source_type": "jira"},
            {"text": "PR #241", "source_url": "https://github.example.com/org/app/pull/241", "source_type": "github"},
            {"text": "Sprint 24 allocation", "source_url": "https://jira.example.com/sprint/24", "source_type": "jira"},
            {"text": "OBS-042", "source_url": "https://jira.example.com/browse/OBS-042", "source_type": "jira"},
            {"text": "AUTH-118", "source_url": "https://jira.example.com/browse/AUTH-118", "source_type": "jira"},
            {"text": "REL-077", "source_url": "https://jira.example.com/browse/REL-077", "source_type": "jira"},
            {"text": "Payments channel escalation", "source_url": "https://slack.example.com/archives/payments/p171785", "source_type": "slack"},
            {"text": "Checkout launch criteria", "source_url": "https://docs.example.com/checkout-launch", "source_type": "docs"},
        ],
        token_usage=1840,
    )


def sync_connector(connector_id: str) -> SyncRun:
    known = {connector.id for connector in CONNECTORS}
    return SyncRun(id=f"sync-{connector_id}-demo", connector_id=connector_id, status="completed" if connector_id in known else "error", records_synced=47 if connector_id in {"jira", "github"} else 18 if connector_id in known else 0, error=None if connector_id in known else "Unknown connector")
