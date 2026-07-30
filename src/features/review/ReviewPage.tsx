import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, RotateCcw, Sparkles } from "lucide-react";

import { previewInterval, type ReviewGrade } from "@/core/srs/sm2";
import type { Flashcard } from "@/core/schemas/flashcard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useDueFlashcards,
  useReviewFlashcard,
} from "@/data/queries/use-flashcards";
import { useWorkspaceStore } from "@/stores/workspace-store";

const GRADES: {
  grade: ReviewGrade;
  label: string;
  className: string;
}[] = [
  { grade: "again", label: "Again", className: "border-destructive/50 text-destructive hover:bg-destructive/10" },
  { grade: "hard", label: "Hard", className: "border-warning/50 text-warning hover:bg-warning/10" },
  { grade: "good", label: "Good", className: "border-primary/50 text-primary hover:bg-primary/10" },
  { grade: "easy", label: "Easy", className: "border-success/50 text-success hover:bg-success/10" },
];

export function ReviewPage() {
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId) ?? undefined;
  const { data: due, isLoading } = useDueFlashcards(workspaceId);
  const review = useReviewFlashcard();

  // Snapshot the queue once so grading doesn't reshuffle the list mid-session.
  const [queue, setQueue] = useState<Flashcard[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (due && queue === null) setQueue(due);
  }, [due, queue]);

  if (isLoading || queue === null) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-10">
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const finished = index >= queue.length;
  const current = queue[index];

  function grade(g: ReviewGrade) {
    if (!current) return;
    review.mutate({ id: current.id, grade: g });
    setDone((d) => d + 1);
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  function restart() {
    setQueue(null);
    setIndex(0);
    setDone(0);
    setRevealed(false);
  }

  if (queue.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-success/15 text-success">
          <PartyPopper className="size-7" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            All caught up!
          </h1>
          <p className="text-sm text-muted-foreground">
            No flashcards are due for review. Add cards from any lesson.
          </p>
        </div>
        <Button asChild>
          <Link to="/curricula">Browse curricula</Link>
        </Button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Sparkles className="size-7" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Session complete
          </h1>
          <p className="text-sm text-muted-foreground">
            You reviewed {done} card{done === 1 ? "" : "s"}. Come back when more
            are due.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={restart}>
            <RotateCcw /> Check again
          </Button>
          <Button asChild>
            <Link to="/">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Review</span>
        <span>
          {index + 1} / {queue.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          <Card className="min-h-[240px]">
            <CardContent className="flex min-h-[240px] flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {revealed ? "Answer" : "Question"}
              </p>
              <p className="text-xl font-medium">
                {revealed ? current.back : current.front}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6">
        {!revealed ? (
          <Button className="w-full" size="lg" onClick={() => setRevealed(true)}>
            Show answer
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {GRADES.map(({ grade: g, label, className }) => (
              <Button
                key={g}
                variant="outline"
                className={cn("h-auto flex-col gap-0.5 py-2", className)}
                onClick={() => grade(g)}
              >
                <span className="font-medium">{label}</span>
                <span className="text-[10px] opacity-70">
                  {previewInterval(current, g)}
                </span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
