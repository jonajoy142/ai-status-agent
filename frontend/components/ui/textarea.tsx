import * as React from "react";

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full resize-none rounded-2xl border border-border bg-white/90 px-4 py-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500/70 focus:ring-4 focus:ring-blue-500/10 dark:bg-slate-950/60",
        className,
      )}
      {...props}
    />
  );
}
