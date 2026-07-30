import { Link } from "react-router-dom";
import { NotebookPen } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotes } from "@/data/queries/use-annotations";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function NotesPage() {
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId) ?? undefined;
  const { data, isLoading } = useNotes(workspaceId);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-8 sm:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
        <p className="text-sm text-muted-foreground">
          Your personal notes across all lessons.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="No notes yet"
          description="Open a lesson and write in the notes panel to see it here."
        />
      ) : (
        <div className="space-y-3">
          {data.map((n) => (
            <Link key={n.id} to={n.path} className="block">
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="space-y-1.5 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{n.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {n.curriculumTitle}
                    </span>
                  </div>
                  <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
                    {n.body}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
