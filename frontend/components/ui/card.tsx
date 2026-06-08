import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card/95 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-colors dark:bg-card/90",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("font-display text-lg font-semibold tracking-[-0.02em]", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-2 text-sm leading-6 text-muted", className)} {...props} />;
}
