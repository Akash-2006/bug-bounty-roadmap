import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Layers,
  Loader2,
  Network,
  Workflow,
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurriculum } from "@/data/queries/use-curricula";
import { useExportCurriculumMarkdown } from "@/data/queries/use-io";
import { NodeTree } from "@/features/curriculum/components/node-tree";
import { ShareButton } from "@/features/curriculum/components/share-button";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function CurriculumOverviewPage() {
  const { curriculumId } = useParams();
  const { data: curriculum, isLoading } = useCurriculum(curriculumId);
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId) ?? undefined;
  const exportMd = useExportCurriculumMarkdown();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!curriculum) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16">
        <EmptyState
          icon={Workflow}
          title="Curriculum not found"
          description="It may have been deleted."
          action={
            <Button asChild>
              <Link to="/curricula">Back to curricula</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/curricula">
            <ArrowLeft /> All curricula
          </Link>
        </Button>
      </div>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {curriculum.title}
        </h1>
        {curriculum.summary && (
          <p className="max-w-2xl text-muted-foreground">{curriculum.summary}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="secondary" className="gap-1">
            <Layers className="size-3" />
            {curriculum.scheme.name}
          </Badge>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/curricula/${curriculum.id}/graph`}>
              <Network /> Graph
            </Link>
          </Button>
          <ShareButton curriculumId={curriculum.id} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportMd.mutate(curriculum.id)}
            disabled={exportMd.isPending}
          >
            {exportMd.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Download />
            )}
            Export Markdown
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hierarchy</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          {curriculum.scheme.levels.map((level, i) => (
            <div key={level.key} className="flex items-center gap-2">
              <span className="rounded-md border bg-secondary px-2.5 py-1 text-sm font-medium">
                {level.singular}
              </span>
              {i < curriculum.scheme.levels.length - 1 && (
                <span className="text-muted-foreground">›</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <NodeTree curriculum={curriculum} workspaceId={workspaceId} />
    </div>
  );
}
