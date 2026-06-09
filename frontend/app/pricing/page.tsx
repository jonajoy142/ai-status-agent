import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const tiers = [
  { name: "Free", price: "$0", description: "For trying SprintPilot with sample data.", features: ["1 workspace", "Sample data", "5 reports/month", "Demo role switching"] },
  { name: "Startup", price: "$49", description: "For small teams using Jira/GitHub.", features: ["Jira/GitHub connectors", "3 projects", "50 reports/month", "Weekly briefs"] },
  { name: "Growth", price: "$149", description: "For teams needing workflow intelligence across tools.", features: ["Slack/Confluence/Notion", "Unlimited projects", "Risk Center", "Evaluations", "Team roles"] },
  { name: "Enterprise", price: "Custom", description: "For security-conscious engineering orgs.", features: ["SSO", "Audit logs", "Data retention", "Private deployment", "SOC2/ISO-ready controls"] },
];

export default function PricingPage() {
  return (
    <div className="space-y-8 reveal-up">
      <section className="mx-auto max-w-4xl text-center">
        <h1 className="font-display text-5xl font-semibold tracking-[-0.06em]">
          Pricing for engineering teams that hate status chasing.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-muted">
          Checkout is intentionally a placeholder for Phase 1. A payment service abstraction can later support Cashfree sandbox or Stripe.
        </p>
      </section>

      <section className="grid items-stretch gap-5 lg:grid-cols-4">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`flex h-full min-h-[31rem] flex-col p-6 ${tier.name === "Startup" ? "ring-2 ring-sky-200" : ""}`}
          >
            <CardTitle>{tier.name}</CardTitle>
            <p className="mt-5 text-4xl font-semibold tracking-[-0.05em]">{tier.price}</p>
            <CardDescription className="min-h-[3rem]">{tier.description}</CardDescription>

            <div className="mt-6 space-y-3">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <Button className="h-12 w-full">{tier.price === "Custom" ? "Contact sales" : "Start demo"}</Button>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
