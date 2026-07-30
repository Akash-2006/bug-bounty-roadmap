import { useState } from "react";
import { Layers, Loader2, Plus, Trash2 } from "lucide-react";

import type { CurriculumNode } from "@/core/schemas/node";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useCreateFlashcard,
  useDeleteFlashcard,
  useFlashcards,
} from "@/data/queries/use-flashcards";

interface FlashcardsSectionProps {
  node: CurriculumNode;
}

/** Inline flashcard authoring + list for a lesson. */
export function FlashcardsSection({ node }: FlashcardsSectionProps) {
  const { data: cards } = useFlashcards(node.id);
  const create = useCreateFlashcard(node);
  const remove = useDeleteFlashcard();

  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const canAdd = front.trim() && back.trim();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!canAdd) return;
    await create.mutateAsync({ front: front.trim(), back: back.trim() });
    setFront("");
    setBack("");
  }

  return (
    <section className="mt-10 space-y-3">
      <div className="flex items-center gap-2">
        <Layers className="size-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold tracking-tight">Flashcards</h2>
        {cards && cards.length > 0 && (
          <span className="text-sm text-muted-foreground">({cards.length})</span>
        )}
      </div>

      <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={front}
          onChange={(e) => setFront(e.target.value)}
          placeholder="Front (question)"
        />
        <Input
          value={back}
          onChange={(e) => setBack(e.target.value)}
          placeholder="Back (answer)"
        />
        <Button type="submit" disabled={!canAdd || create.isPending}>
          {create.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
          Add
        </Button>
      </form>

      {cards && cards.length > 0 && (
        <div className="space-y-2">
          {cards.map((card) => (
            <Card key={card.id}>
              <CardContent className="flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{card.front}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {card.back}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {card.reps === 0 ? "new" : `${card.reps} reps`}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => remove.mutate(card.id)}
                  aria-label="Delete flashcard"
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
