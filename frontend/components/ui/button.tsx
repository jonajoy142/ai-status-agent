import * as React from "react";

import { cn } from "@/lib/utils";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-sm transition active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
