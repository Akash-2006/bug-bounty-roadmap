import { Link } from "react-router-dom";
import { Bookmark, FileText } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookmarks } from "@/data/queries/use-annotations";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function BookmarksPage() {
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId) ?? undefined;
  const { data, isLoading } = useBookmarks(workspaceId);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-8 sm:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Bookmarks</h1>
        <p className="text-sm text-muted-foreground">
          Lessons you've pinned for quick access.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Open a lesson and tap the bookmark button to pin it here."
        />
      ) : (
        <div className="divide-y rounded-xl border">
          {data.map((b) => (
            <Link
              key={b.id}
              to={b.path}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
            >
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{b.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {b.curriculumTitle}
                </p>
              </div>
              <Bookmark className="size-4 shrink-0 fill-current text-primary" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
