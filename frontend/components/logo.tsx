import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  withText?: boolean;
  textClassName?: string;
}

const sizeClasses = {
  xs: "h-6 w-6",
  sm: "h-7 w-7",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export function LogoMark({ className, size = "md" }: { className?: string; size?: "xs" | "sm" | "md" | "lg" }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-sm border border-slate-800/80 shrink-0 overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full p-1"
      >
        <defs>
          <linearGradient id="sp-blue-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="sp-white-grad" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* Outer subtle guide arc */}
        <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="2 3" />

        {/* Interlocking Delta Chevron 1: Forward Pilot Wing (Vibrant Cobalt) */}
        <path
          d="M8 8.5L24 16L8 23.5L12.5 16L8 8.5Z"
          fill="url(#sp-blue-grad)"
        />

        {/* Interlocking Delta Chevron 2: Agile Velocity Loop (Crisp White/Silver) */}
        <path
          d="M13 11.5L22 16L13 20.5L15.5 16L13 11.5Z"
          fill="url(#sp-white-grad)"
          opacity="0.95"
        />

        {/* Center Navigation Apex Dot */}
        <circle cx="23.5" cy="16" r="1.5" fill="#60a5fa" />
      </svg>
    </div>
  );
}

export function Logo({
  className,
  size = "md",
  withText = true,
  textClassName,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {withText && (
        <div className="flex items-baseline gap-1.5">
          <span className={cn("font-display text-base font-bold text-slate-900 tracking-tight", textClassName)}>
            SprintPilot
          </span>
          <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200/60 rounded px-1 py-0.2">
            AI
          </span>
        </div>
      )}
    </div>
  );
}
