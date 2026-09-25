import { CheckCircle2, CircleDot, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const variants = {
  good: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  warn: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
  bad: "bg-red-500/10 text-red-400 border border-red-500/30",
  neutral: "bg-slate-800 text-slate-300 border border-slate-700",
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
