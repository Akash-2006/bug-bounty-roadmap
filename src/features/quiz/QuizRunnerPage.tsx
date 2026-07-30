import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, HelpCircle, RotateCcw, X, Zap } from "lucide-react";

import type { QuizResult } from "@/data/services/quiz-service";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useNode } from "@/data/queries/use-nodes";
import { useQuizQuestions, useSubmitQuiz } from "@/data/queries/use-quiz";

export function QuizRunnerPage() {
  const { curriculumId, nodeId } = useParams();
  const { data: node, isLoading } = useNode(nodeId);
  const { data: questions } = useQuizQuestions(nodeId);
  const submit = useSubmitQuiz(node);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const lessonHref = `/curricula/${curriculumId}/n/${nodeId}`;

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!node || !questions || questions.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <EmptyState
          icon={HelpCircle}
          title="No quiz here yet"
          description="Add questions to this lesson to build a quiz."
          action={
            <Button asChild>
              <Link to={lessonHref}>Back to lesson</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  async function handleSubmit() {
    if (!questions) return;
    const res = await submit.mutateAsync({ questions, answers });
    setResult(res);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function retry() {
    setAnswers({});
    setResult(null);
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-4 py-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to={lessonHref}>
            <ArrowLeft /> {node.title}
          </Link>
        </Button>
      </div>

      {result && (
        <Card
          className={cn(
            result.passed
              ? "border-success/50 bg-success/5"
              : "border-warning/50 bg-warning/5",
          )}
        >
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-lg font-semibold">
                {result.passed ? "Passed!" : "Keep practicing"}
              </p>
              <p className="text-sm text-muted-foreground">
                {result.correct} / {result.total} correct (
                {Math.round(result.ratio * 100)}%)
              </p>
            </div>
            <div className="flex items-center gap-3">
              {result.xpAwarded > 0 && (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-warning">
                  <Zap className="size-4" />+{result.xpAwarded} XP
                </span>
              )}
              <Button variant="outline" size="sm" onClick={retry}>
                <RotateCcw /> Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {questions.map((q, qi) => {
          const selected = answers[q.id];
          return (
            <Card key={q.id}>
              <CardContent className="space-y-3 p-5">
                <p className="font-medium">
                  {qi + 1}. {q.prompt}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = selected === oi;
                    const isCorrect = q.answerIndex === oi;
                    const showResult = result !== null;
                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={showResult}
                        onClick={() =>
                          setAnswers((a) => ({ ...a, [q.id]: oi }))
                        }
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                          !showResult &&
                            (isSelected
                              ? "border-primary bg-accent"
                              : "hover:bg-accent/50"),
                          showResult &&
                            isCorrect &&
                            "border-success/60 bg-success/10",
                          showResult &&
                            isSelected &&
                            !isCorrect &&
                            "border-destructive/60 bg-destructive/10",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                            isSelected && !showResult && "border-primary",
                          )}
                        >
                          {showResult && isCorrect && (
                            <Check className="size-3.5 text-success" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <X className="size-3.5 text-destructive" />
                          )}
                          {!showResult && String.fromCharCode(65 + oi)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {result && q.explanation && (
                  <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                    {q.explanation}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!result && (
        <Button
          className="w-full"
          size="lg"
          disabled={!allAnswered || submit.isPending}
          onClick={handleSubmit}
        >
          {allAnswered
            ? "Submit answers"
            : `Answer all ${questions.length} questions`}
        </Button>
      )}
    </div>
  );
}
