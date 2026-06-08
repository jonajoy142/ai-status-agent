import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({ label, value, detail, trend }: { label: string; value: string; detail: string; trend?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
        {trend ? <span className={cn("rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300")}>{trend}</span> : null}
      </div>
      <p className="mt-4 font-display text-3xl font-semibold tracking-[-0.04em]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </Card>
  );
}
