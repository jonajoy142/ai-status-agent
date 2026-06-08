import { Card } from "@/components/ui/card";

export function MetricCard({ label, value, detail, trend }: { label: string; value: string; detail: string; trend?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        {trend ? <span className="rounded-full bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-100">{trend}</span> : null}
      </div>
      <p className="mt-4 font-display text-3xl font-semibold tracking-[-0.045em]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </Card>
  );
}
