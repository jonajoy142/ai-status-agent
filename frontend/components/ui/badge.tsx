import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200/90 px-2.5 py-0.5 text-xs font-medium text-slate-700",
        className,
      )}
      {...props}
    />
  );
}
