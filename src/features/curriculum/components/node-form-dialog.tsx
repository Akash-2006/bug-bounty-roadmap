import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface NodeFormValues {
  title: string;
  summary: string;
}

interface NodeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heading: string;
  submitLabel: string;
  initialTitle?: string;
  initialSummary?: string;
  submitting?: boolean;
  onSubmit: (values: NodeFormValues) => void | Promise<void>;
}

/** Shared create/rename dialog for curriculum nodes. */
export function NodeFormDialog({
  open,
  onOpenChange,
  heading,
  submitLabel,
  initialTitle = "",
  initialSummary = "",
  submitting = false,
  onSubmit,
}: NodeFormDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [summary, setSummary] = useState(initialSummary);

  // Reset fields whenever the dialog (re)opens.
  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setSummary(initialSummary);
    }
  }, [open, initialTitle, initialSummary]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await onSubmit({ title: title.trim(), summary: summary.trim() });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{heading}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="node-title">Title</Label>
            <Input
              id="node-title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Introduction"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="node-summary">Summary (optional)</Label>
            <Input
              id="node-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A short description"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
