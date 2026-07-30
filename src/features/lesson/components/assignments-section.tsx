import { useState } from "react";
import { CalendarClock, ClipboardList, Loader2, Plus, Trash2, Zap } from "lucide-react";

import { nextStatus } from "@/core/schemas/assignment";
import type { CurriculumNode } from "@/core/schemas/node";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useCreateAssignment,
  useDeleteAssignment,
  useNodeAssignments,
  useSetAssignmentStatus,
} from "@/data/queries/use-assignments";
import { StatusButton } from "@/features/assignments/components/status-button";

/** Inline assignment authoring + list for a lesson. */
export function AssignmentsSection({ node }: { node: CurriculumNode }) {
  const { data: assignments } = useNodeAssignments(node.id);
  const create = useCreateAssignment(node);
  const setStatus = useSetAssignmentStatus(node);
  const remove = useDeleteAssignment(node);

  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [xp, setXp] = useState(100);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await create.mutateAsync({
      title: title.trim(),
      dueAt: due ? new Date(due).getTime() : null,
      xp: Number(xp) || 0,
    });
    setTitle("");
    setDue("");
    setXp(100);
  }

  return (
    <section className="mt-10 space-y-3">
      <div className="flex items-center gap-2">
        <ClipboardList className="size-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold tracking-tight">Assignments</h2>
        {assignments && assignments.length > 0 && (
          <span className="text-sm text-muted-foreground">
            ({assignments.length})
          </span>
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Assignment title"
              className="flex-1"
            />
            <Input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="sm:w-40"
              aria-label="Due date"
            />
            <Input
              type="number"
              min={0}
              value={xp}
              onChange={(e) => setXp(Number(e.target.value))}
              className="sm:w-24"
              aria-label="XP"
            />
            <Button type="submit" disabled={!title.trim() || create.isPending}>
              {create.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {assignments && assignments.length > 0 && (
        <div className="space-y-2">
          {assignments.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2"
            >
              <StatusButton
                status={a.status}
                onCycle={() =>
                  setStatus.mutate({ id: a.id, status: nextStatus(a.status) })
                }
              />
              <span
                className={cnDone(a.status === "done")}
              >
                {a.title}
              </span>
              <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  onClick={() => remove.mutate(a.id)}
                  aria-label="Delete assignment"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function cnDone(done: boolean): string {
  return done
    ? "min-w-0 flex-1 truncate text-sm text-muted-foreground line-through"
    : "min-w-0 flex-1 truncate text-sm font-medium";
}
