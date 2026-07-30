import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Eye, Loader2, PencilLine } from "lucide-react";

import type { DifficultyLevel } from "@/core/schemas/base";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useNode, useUpdateNode } from "@/data/queries/use-nodes";

const DIFFICULTIES: DifficultyLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
];

interface FormState {
  title: string;
  summary: string;
  body: string;
  difficulty: DifficultyLevel | "";
  estimatedMinutes: number;
  xp: number;
  tags: string;
  objectives: string;
}

export function LessonEditorPage() {
  const { curriculumId, nodeId } = useParams();
  const { data: node, isLoading } = useNode(nodeId);
  const update = useUpdateNode(curriculumId);

  const [form, setForm] = useState<FormState | null>(null);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [saved, setSaved] = useState(false);

  // Initialize the form once the node loads.
  useEffect(() => {
    if (node && form === null) {
      setForm({
        title: node.title,
        summary: node.summary ?? "",
        body: node.body,
        difficulty: node.difficulty ?? "",
        estimatedMinutes: node.estimatedMinutes ?? 0,
        xp: node.xp,
        tags: node.tags.join(", "),
        objectives: node.objectives.join("\n"),
      });
    }
  }, [node, form]);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    setSaved(false);
  }

  async function handleSave() {
    if (!form || !nodeId) return;
    await update.mutateAsync({
      id: nodeId,
      patch: {
        title: form.title.trim() || "Untitled",
        summary: form.summary.trim() || undefined,
        body: form.body,
        difficulty: form.difficulty || undefined,
        estimatedMinutes: Number(form.estimatedMinutes) || 0,
        xp: Number(form.xp) || 0,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        objectives: form.objectives
          .split("\n")
          .map((o) => o.trim())
          .filter(Boolean),
      },
    });
    setSaved(true);
  }

  if (isLoading || !form) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-8">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const viewerHref = `/curricula/${curriculumId}/n/${nodeId}`;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Editor toolbar */}
      <div className="flex items-center gap-2 border-b px-4 py-2.5">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to={viewerHref}>
            <ArrowLeft /> Back
          </Link>
        </Button>
        <span className="truncate text-sm font-medium text-muted-foreground">
          Editing: {form.title || "Untitled"}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobilePreview((v) => !v)}
          >
            {mobilePreview ? <PencilLine /> : <Eye />}
            {mobilePreview ? "Edit" : "Preview"}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={update.isPending}>
            {update.isPending ? (
              <Loader2 className="animate-spin" />
            ) : saved ? (
              <Check />
            ) : null}
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      {/* Split panes */}
      <div className="grid min-h-0 flex-1 lg:grid-cols-2">
        {/* Editor pane */}
        <div
          className={cn(
            "min-h-0 overflow-y-auto border-r",
            mobilePreview && "hidden lg:block",
          )}
        >
          <div className="space-y-4 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="f-title">Title</Label>
                <Input
                  id="f-title"
                  value={form.title}
                  onChange={(e) => patch("title", e.target.value)}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="f-summary">Summary</Label>
                <Input
                  id="f-summary"
                  value={form.summary}
                  onChange={(e) => patch("summary", e.target.value)}
                  placeholder="One-line description"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="f-difficulty">Difficulty</Label>
                <select
                  id="f-difficulty"
                  value={form.difficulty}
                  onChange={(e) =>
                    patch("difficulty", e.target.value as FormState["difficulty"])
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">—</option>
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="f-min">Minutes</Label>
                  <Input
                    id="f-min"
                    type="number"
                    min={0}
                    value={form.estimatedMinutes}
                    onChange={(e) =>
                      patch("estimatedMinutes", Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="f-xp">XP</Label>
                  <Input
                    id="f-xp"
                    type="number"
                    min={0}
                    value={form.xp}
                    onChange={(e) => patch("xp", Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="f-tags">Tags (comma separated)</Label>
                <Input
                  id="f-tags"
                  value={form.tags}
                  onChange={(e) => patch("tags", e.target.value)}
                  placeholder="http, owasp, recon"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="f-obj">Objectives (one per line)</Label>
                <textarea
                  id="f-obj"
                  value={form.objectives}
                  onChange={(e) => patch("objectives", e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="f-body">Content (Markdown)</Label>
              <textarea
                id="f-body"
                value={form.body}
                onChange={(e) => patch("body", e.target.value)}
                spellCheck={false}
                placeholder={"# Heading\n\nWrite Markdown here. Use ```mermaid for diagrams and ```js for code."}
                className="min-h-[50vh] w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-sm leading-relaxed shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Preview pane */}
        <div
          className={cn(
            "min-h-0 overflow-y-auto bg-muted/20",
            !mobilePreview && "hidden lg:block",
          )}
        >
          <div className="p-6">
            {form.body.trim() ? (
              <MarkdownRenderer content={form.body} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Preview appears here as you type.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
