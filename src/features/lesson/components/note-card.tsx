import { useEffect, useState } from "react";
import { Check, Loader2, NotebookPen } from "lucide-react";

import type { CurriculumNode } from "@/core/schemas/node";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNodeNote, useSaveNote } from "@/data/queries/use-annotations";

/** A personal free-form note for the current lesson (rail card). */
export function NoteCard({ node }: { node: CurriculumNode }) {
  const { data: note } = useNodeNote(node.id);
  const save = useSaveNote(node);
  const [body, setBody] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (note !== undefined && !loaded) {
      setBody(note?.body ?? "");
      setLoaded(true);
    }
  }, [note, loaded]);

  const dirty = loaded && body !== (note?.body ?? "");

  async function handleSave() {
    await save.mutateAsync(body);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <NotebookPen className="size-4 text-muted-foreground" />
          My notes
        </div>
        <textarea
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setSaved(false);
          }}
          placeholder="Jot down your own notes for this lesson…"
          rows={5}
          className="w-full resize-y rounded-md border border-input bg-background p-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button
          size="sm"
          className="w-full"
          variant={dirty ? "default" : "outline"}
          onClick={handleSave}
          disabled={!dirty || save.isPending}
        >
          {save.isPending ? (
            <Loader2 className="animate-spin" />
          ) : saved ? (
            <Check />
          ) : null}
          {saved ? "Saved" : "Save note"}
        </Button>
      </CardContent>
    </Card>
  );
}
