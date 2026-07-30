import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Layers, Workflow } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurriculum } from "@/data/queries/use-curricula";

export function CurriculumOverviewPage() {
  const { curriculumId } = useParams();
  const { data: curriculum, isLoading } = useCurriculum(curriculumId);

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
        <div className="flex items-center gap-2 pt-1">
          <Badge variant="secondary" className="gap-1">
            <Layers className="size-3" />
            {curriculum.scheme.name}
          </Badge>
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

      <EmptyState
        icon={Workflow}
        title="Structure coming next"
        description="The tree explorer and builder for adding modules, weeks, and lessons ships in the next slice."
      />
    </div>
  );
}
