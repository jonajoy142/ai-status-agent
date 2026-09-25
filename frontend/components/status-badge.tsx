import { CheckCircle2, CircleDot, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const variants = {
  good: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  warn: "bg-amber-50 text-amber-700 border-amber-200/80",
  bad: "bg-red-50 text-red-700 border-red-200/80",
  neutral: "bg-slate-100 text-slate-700 border-slate-200/80",
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
      <Icon className="h-3 w-3 shrink-0" />
      <span>{label}</span>
    </Badge>
  );
}
