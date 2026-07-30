import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Download, Loader2, User } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useImportPublished,
  usePublishedCurricula,
} from "@/data/queries/use-publish";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function ExplorePage() {
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId) ?? undefined;
  const { data, isLoading } = usePublishedCurricula();
  const importPublished = useImportPublished(workspaceId);
  const navigate = useNavigate();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleAdd(id: string) {
    setPendingId(id);
    try {
      await importPublished.mutateAsync(id);
      setAddedId(id);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Explore</h1>
        <p className="text-sm text-muted-foreground">
          Curricula shared by the community. Add any of them to your account.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="Nothing shared yet"
          description="Be the first — open one of your curricula and tap Share."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((pub) => {
            const added = addedId === pub.id;
            return (
              <Card key={pub.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{pub.title}</h3>
                    <p className="line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
                      {pub.summary || "No description."}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="inline-flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                      <User className="size-3.5 shrink-0" />
                      <span className="truncate">
                        {pub.author_email ?? "Anonymous"}
                      </span>
                    </span>
                    <Button
                      size="sm"
                      variant={added ? "secondary" : "default"}
                      onClick={() =>
                        added ? navigate("/curricula") : handleAdd(pub.id)
                      }
                      disabled={pendingId === pub.id}
                    >
                      {pendingId === pub.id ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Download />
                      )}
                      {added ? "View in Curricula" : "Add"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
