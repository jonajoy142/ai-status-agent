import { CheckCircle2, CircleDot, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const variants = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  warn: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  bad: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  neutral: "border-border bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
};

const icons = {
  good: CheckCircle2,
  warn: CircleDot,
  bad: XCircle,
  neutral: CircleDot,
};

export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: keyof typeof variants }) {
  const Icon = icons[tone];
  return (
    <Badge className={cn("font-medium", variants[tone])}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}
