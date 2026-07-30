import { cn } from "@/lib/utils"
import type { Severity } from "@/types/curriculum"

const SEVERITY_META: Record<Severity, { label: string; text: string; bg: string }> = {
  critical: { label: "Critical", text: "text-critical", bg: "bg-critical-bg" },
  high: { label: "High", text: "text-high", bg: "bg-high-bg" },
  medium: { label: "Medium", text: "text-medium", bg: "bg-medium-bg" },
  low: { label: "Low", text: "text-low", bg: "bg-low-bg" },
  info: { label: "Info", text: "text-info", bg: "bg-info-bg" },
}

export function SeverityBadge({
  severity,
  className,
}: {
  severity: Severity
  className?: string
}) {
  const meta = SEVERITY_META[severity]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium font-mono uppercase tracking-wide",
        meta.bg,
        meta.text,
        className
      )}
    >
      {meta.label}
    </span>
  )
}
