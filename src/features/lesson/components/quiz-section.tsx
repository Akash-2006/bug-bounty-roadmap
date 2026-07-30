import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, HelpCircle, Loader2, Play, Plus, Trash2 } from "lucide-react";

import type { CurriculumNode } from "@/core/schemas/node";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  useCreateQuizQuestion,
  useDeleteQuizQuestion,
  useQuizQuestions,
} from "@/data/queries/use-quiz";

interface QuizSectionProps {
  node: CurriculumNode;
}

const EMPTY_OPTIONS = ["", "", "", ""];

/** Inline quiz authoring + list for a lesson, with a link to take the quiz. */
export function QuizSection({ node }: QuizSectionProps) {
  const { data: questions } = useQuizQuestions(node.id);
  const create = useCreateQuizQuestion(node);
  const remove = useDeleteQuizQuestion(node.id);

  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState<string[]>(EMPTY_OPTIONS);
  const [correct, setCorrect] = useState(0);
  const [explanation, setExplanation] = useState("");

  const filledCount = options.filter((o) => o.trim()).length;
  const canAdd = prompt.trim() && filledCount >= 2 && options[correct].trim();

  function setOption(i: number, value: string) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? value : o)));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!canAdd) return;
    // Keep only non-empty options and remap the correct index.
    const kept = options
      .map((value, idx) => ({ value: value.trim(), idx }))
      .filter((o) => o.value);
    const answerIndex = kept.findIndex((o) => o.idx === correct);
    await create.mutateAsync({
      prompt: prompt.trim(),
      options: kept.map((o) => o.value),
      answerIndex: Math.max(0, answerIndex),
      explanation: explanation.trim() || undefined,
    });
    setPrompt("");
    setOptions(EMPTY_OPTIONS);
    setCorrect(0);
    setExplanation("");
  }

  return (
    <section className="mt-10 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold tracking-tight">Quiz</h2>
          {questions && questions.length > 0 && (
            <span className="text-sm text-muted-foreground">
              ({questions.length})
            </span>
          )}
        </div>
        {questions && questions.length > 0 && (
          <Button size="sm" asChild>
            <Link to={`/curricula/${node.curriculumId}/n/${node.id}/quiz`}>
              <Play /> Take quiz
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="space-y-3 p-4">
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="q-prompt">Question</Label>
              <Input
                id="q-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. What does a camera define?"
              />
            </div>
            <div className="space-y-2">
              <Label>Options (mark the correct one)</Label>
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCorrect(i)}
                    aria-label={`Mark option ${i + 1} correct`}
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                      correct === i
                        ? "border-success bg-success text-success-foreground"
                        : "hover:border-success",
                    )}
                  >
                    {correct === i && <Check className="size-3.5" />}
                  </button>
                  <Input
                    value={opt}
                    onChange={(e) => setOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}${i > 1 ? " (optional)" : ""}`}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-exp">Explanation (optional)</Label>
              <Input
                id="q-exp"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Shown after answering"
              />
            </div>
            <Button type="submit" disabled={!canAdd || create.isPending}>
              {create.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Plus />
              )}
              Add question
            </Button>
          </form>
        </CardContent>
      </Card>

      {questions && questions.length > 0 && (
        <div className="space-y-2">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className="flex items-center gap-3 rounded-lg border px-3 py-2"
            >
              <span className="text-xs text-muted-foreground">{i + 1}.</span>
              <p className="min-w-0 flex-1 truncate text-sm">{q.prompt}</p>
              <span className="shrink-0 text-xs text-muted-foreground">
                {q.options.length} options
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => remove.mutate(q.id)}
                aria-label="Delete question"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
