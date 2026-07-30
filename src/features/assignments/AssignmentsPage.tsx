import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, ClipboardList, Zap } from "lucide-react";

import { nextStatus, type AssignmentStatus } from "@/core/schemas/assignment";
import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useAssignments,
  useSetAssignmentStatus,
} from "@/data/queries/use-assignments";
import { StatusButton } from "@/features/assignments/components/status-button";
import { useWorkspaceStore } from "@/stores/workspace-store";

type Filter = "all" | AssignmentStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
];

export function AssignmentsPage() {
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId) ?? undefined;
  const { data, isLoading } = useAssignments(workspaceId);
  const setStatus = useSetAssignmentStatus(null, workspaceId);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = (data ?? []).filter(
    (a) => filter === "all" || a.status === filter,
  );

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-8 sm:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
        <p className="text-sm text-muted-foreground">
          Track tasks across all your lessons. Click a status to advance it.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => {
          const count =
            f.key === "all"
              ? (data?.length ?? 0)
              : (data?.filter((a) => a.status === f.key).length ?? 0);
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                filter === f.key
                  ? "border-primary bg-accent text-accent-foreground"
                  : "hover:bg-accent/50",
              )}
            >
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={
            data && data.length > 0 ? "Nothing here" : "No assignments yet"
          }
          description={
            data && data.length > 0
              ? "No assignments match this filter."
              : "Open a lesson and add an assignment to track it here."
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex flex-wrap items-center gap-3 p-4">
                <StatusButton
                  status={a.status}
                  onCycle={() =>
                    setStatus.mutate({
                      id: a.id,
                      status: nextStatus(a.status),
                    })
                  }
                />
                <Link to={a.path} className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-medium hover:text-primary",
                      a.status === "done" &&
                        "text-muted-foreground line-through",
                    )}
                  >
                    {a.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.nodeTitle} · {a.curriculumTitle}
                  </p>
                </Link>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {a.dueAt && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="size-3.5" />
                      {new Date(a.dueAt).toLocaleDateString()}
                    </span>
                  )}
                  {a.xp > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Zap className="size-3.5 text-warning" />
                      {a.xp}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
