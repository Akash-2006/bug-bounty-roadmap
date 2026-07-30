import { Circle, CircleCheck, CircleDot } from "lucide-react";

import type { AssignmentStatus } from "@/core/schemas/assignment";
import { cn } from "@/lib/utils";

export const STATUS_META: Record<
  AssignmentStatus,
  { label: string; className: string; Icon: typeof Circle }
> = {
  todo: {
    label: "To do",
    className: "text-muted-foreground",
    Icon: Circle,
  },
  in_progress: {
    label: "In progress",
    className: "text-info",
    Icon: CircleDot,
  },
  done: {
    label: "Done",
    className: "text-success",
    Icon: CircleCheck,
  },
};

interface StatusButtonProps {
  status: AssignmentStatus;
  onCycle: () => void;
  className?: string;
}

/** A pill that displays an assignment status and cycles it on click. */
export function StatusButton({ status, onCycle, className }: StatusButtonProps) {
  const meta = STATUS_META[status];
  const Icon = meta.Icon;
  return (
    <button
      type="button"
      onClick={onCycle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent/50",
        meta.className,
        className,
      )}
    >
      <Icon className="size-3.5" />
      {meta.label}
    </button>
  );
}
