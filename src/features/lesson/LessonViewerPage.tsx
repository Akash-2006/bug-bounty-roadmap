import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  FileText,
  Pencil,
  Zap,
} from "lucide-react";

import { compareOrder } from "@/core/ordering";
import { DifficultyPill } from "@/components/common/difficulty-pill";
import { EmptyState } from "@/components/common/empty-state";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurriculum } from "@/data/queries/use-curricula";
import { useNode, useNodes } from "@/data/queries/use-nodes";

export function LessonViewerPage() {
  const { curriculumId, nodeId } = useParams();
  const { data: curriculum } = useCurriculum(curriculumId);
  const { data: node, isLoading } = useNode(nodeId);
  const { data: allNodes } = useNodes(curriculumId);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!node) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16">
        <EmptyState
          icon={FileText}
          title="Lesson not found"
          action={
            <Button asChild>
              <Link to={`/curricula/${curriculumId}`}>Back to curriculum</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const levelLabel =
    curriculum?.scheme.levels.find((l) => l.key === node.levelKey)?.singular ??
    "Item";

  const children = (allNodes ?? [])
    .filter((n) => n.parentId === node.id)
    .sort((a, b) => compareOrder(a.order, b.order));

  const editHref = `/curricula/${curriculumId}/n/${node.id}/edit`;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to={`/curricula/${curriculumId}`}>
            <ArrowLeft /> {curriculum?.title ?? "Curriculum"}
          </Link>
        </Button>
        <Button asChild>
          <Link to={editHref}>
            <Pencil /> Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
        <article className="min-w-0">
          <header className="mb-6 space-y-3">
            <Badge variant="outline" className="text-[10px]">
              {levelLabel}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">{node.title}</h1>
            {node.summary && (
              <p className="text-lg text-muted-foreground">{node.summary}</p>
            )}
          </header>

          {node.objectives.length > 0 && (
            <Card className="mb-6 border-primary/30 bg-accent/40">
              <CardContent className="p-5">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Learning objectives
                </h2>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {node.objectives.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {node.body.trim() ? (
            <MarkdownRenderer content={node.body} />
          ) : (
            <EmptyState
              icon={FileText}
              title="No content yet"
              description="Open the editor to write this lesson in Markdown — with Mermaid diagrams and code highlighting."
              action={
                <Button asChild>
                  <Link to={editHref}>
                    <Pencil /> Start writing
                  </Link>
                </Button>
              }
            />
          )}

          {children.length > 0 && (
            <section className="mt-8 space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Contents
              </h2>
              <div className="divide-y rounded-lg border">
                {children.map((child) => (
                  <Link
                    key={child.id}
                    to={`/curricula/${curriculumId}/n/${child.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-accent/50"
                  >
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{child.title}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Metadata rail */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardContent className="space-y-3 p-4 text-sm">
              {node.difficulty && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Difficulty</span>
                  <DifficultyPill difficulty={node.difficulty} />
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-3.5" /> Est. time
                </span>
                <span>{node.estimatedMinutes ?? 0} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Zap className="size-3.5" /> XP
                </span>
                <span>{node.xp}</span>
              </div>
            </CardContent>
          </Card>

          {node.tags.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {node.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
