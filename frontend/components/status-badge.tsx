import { CheckCircle2, CircleDot, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const variants = {
  good: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  warn: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  bad: "bg-red-50 text-red-700 ring-1 ring-red-100",
  neutral: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
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
