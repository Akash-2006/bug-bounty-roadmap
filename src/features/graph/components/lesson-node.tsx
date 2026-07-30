import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { CircleCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export interface LessonNodeData {
  label: string;
  levelLabel: string;
  completed: boolean;
  isLeaf: boolean;
  [key: string]: unknown;
}

/**
 * A curriculum node rendered in the knowledge graph. Left handle = incoming
 * (prerequisites), right handle = outgoing. Double-click opens the lesson.
 */
export const LessonGraphNode = memo(function LessonGraphNode({
  data,
}: {
  data: LessonNodeData;
}) {
  return (
    <div
      className={cn(
        "flex w-[200px] items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-sm transition-colors",
        data.completed
          ? "border-success/60"
          : data.isLeaf
            ? "border-border"
            : "border-primary/40 bg-accent/40",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!size-2 !border !border-background !bg-muted-foreground"
      />
      {data.completed && (
        <CircleCheck className="size-4 shrink-0 text-success" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{data.label}</p>
        <p className="truncate text-[10px] uppercase tracking-wide text-muted-foreground">
          {data.levelLabel}
        </p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!size-2 !border !border-background !bg-primary"
      />
    </div>
  );
});
