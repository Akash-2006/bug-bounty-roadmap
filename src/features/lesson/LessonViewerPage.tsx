import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Check,
  CircleCheck,
  Clock,
  FileText,
  Loader2,
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
import { cn } from "@/lib/utils";
import { useCurriculum } from "@/data/queries/use-curricula";
import { useNode, useNodes } from "@/data/queries/use-nodes";
import {
  useNodeProgress,
  useToggleComplete,
} from "@/data/queries/use-progress";
import {
  useNodeBookmark,
  useToggleBookmark,
} from "@/data/queries/use-annotations";
import { FlashcardsSection } from "@/features/lesson/components/flashcards-section";
import { NoteCard } from "@/features/lesson/components/note-card";
import { QuizSection } from "@/features/lesson/components/quiz-section";
import { AssignmentsSection } from "@/features/lesson/components/assignments-section";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function LessonViewerPage() {
  const { curriculumId, nodeId } = useParams();
  const { data: curriculum } = useCurriculum(curriculumId);
  const { data: node, isLoading } = useNode(nodeId);
  const { data: allNodes } = useNodes(curriculumId);
  const { data: progress } = useNodeProgress(nodeId);
  const { data: bookmark } = useNodeBookmark(nodeId);
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId) ?? undefined;
  const toggle = useToggleComplete(workspaceId);
  const toggleBookmark = useToggleBookmark(node);

  const isComplete = progress?.status === "completed";
  const isBookmarked = Boolean(bookmark);

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
        <div className="flex items-center gap-2">
          <Button
            variant={isBookmarked ? "default" : "outline"}
            size="icon"
            onClick={() => toggleBookmark.mutate()}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark className={cn(isBookmarked && "fill-current")} />
          </Button>
          <Button asChild>
            <Link to={editHref}>
              <Pencil /> Edit
            </Link>
          </Button>
        </div>
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

          <QuizSection node={node} />

          <AssignmentsSection node={node} />

          <FlashcardsSection node={node} />
        </article>

        {/* Metadata rail */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card className={cn(isComplete && "border-success/50 bg-success/5")}>
            <CardContent className="space-y-3 p-4">
              {isComplete && (
                <div className="flex items-center gap-1.5 text-sm font-medium text-success">
                  <CircleCheck className="size-4" /> Completed
                </div>
              )}
              <Button
                className="w-full"
                variant={isComplete ? "outline" : "default"}
                onClick={() =>
                  node && toggle.mutate({ node, complete: !isComplete })
                }
                disabled={toggle.isPending}
              >
                {toggle.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Check />
                )}
                {isComplete ? "Mark as not done" : "Mark complete"}
              </Button>
              {node.xp > 0 && !isComplete && (
                <p className="text-center text-xs text-muted-foreground">
                  Earn {node.xp} XP on completion
                </p>
              )}
            </CardContent>
          </Card>

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

          <NoteCard node={node} />
        </aside>
      </div>
    </div>
  );
}
