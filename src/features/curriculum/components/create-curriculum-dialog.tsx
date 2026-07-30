import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { BUILTIN_SCHEMES, DEFAULT_SCHEME_KEY } from "@/core/hierarchy/schemes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCurriculum } from "@/data/queries/use-curricula";

interface CreateCurriculumDialogProps {
  workspaceId: string | undefined;
}

/** Dialog to create a new curriculum, choosing a hierarchy scheme. */
export function CreateCurriculumDialog({
  workspaceId,
}: CreateCurriculumDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [schemeKey, setSchemeKey] = useState(DEFAULT_SCHEME_KEY);

  const create = useCreateCurriculum(workspaceId);
  const canSubmit = title.trim().length > 0 && Boolean(workspaceId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    await create.mutateAsync({
      title: title.trim(),
      summary: summary.trim() || undefined,
      schemeKey,
    });
    setTitle("");
    setSummary("");
    setSchemeKey(DEFAULT_SCHEME_KEY);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> New curriculum
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create a curriculum</DialogTitle>
            <DialogDescription>
              A curriculum is your own structured learning universe. Pick a
              hierarchy to start — you can customize it later.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="cur-title">Title</Label>
            <Input
              id="cur-title"
              autoFocus
              placeholder="e.g. Bug Bounty, Three.js, Spanish"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cur-summary">Summary (optional)</Label>
            <Input
              id="cur-summary"
              placeholder="What is this curriculum about?"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cur-scheme">Hierarchy</Label>
            <select
              id="cur-scheme"
              value={schemeKey}
              onChange={(e) => setSchemeKey(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {BUILTIN_SCHEMES.map((scheme) => (
                <option key={scheme.key} value={scheme.key}>
                  {scheme.name}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit || create.isPending}>
              {create.isPending && <Loader2 className="animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
