import * as React from "react";

import { cn } from "@/lib/utils";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200",
        className,
      )}
      {...props}
    />
  );
}
