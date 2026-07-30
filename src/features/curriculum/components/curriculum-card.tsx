import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  Loader2,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Curriculum } from "@/core/schemas/curriculum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  useDeleteCurriculum,
  useUpdateCurriculum,
} from "@/data/queries/use-curricula";

interface CurriculumCardProps {
  curriculum: Curriculum;
  workspaceId: string | undefined;
}

export function CurriculumCard({
  curriculum,
  workspaceId,
}: CurriculumCardProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [title, setTitle] = useState(curriculum.title);

  const update = useUpdateCurriculum(workspaceId);
  const remove = useDeleteCurriculum(workspaceId);

  const levelCount = curriculum.scheme.levels.length;

  async function handleRename(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await update.mutateAsync({ id: curriculum.id, patch: { title: title.trim() } });
    setRenameOpen(false);
  }

  async function handleDelete() {
    await remove.mutateAsync(curriculum.id);
    setDeleteOpen(false);
  }

  return (
    <>
      <Card className="group relative transition-colors hover:border-primary/40">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <Link to={`/curricula/${curriculum.id}`} className="min-w-0 flex-1">
            <CardTitle className="truncate text-base group-hover:text-primary">
              {curriculum.title}
            </CardTitle>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-mr-2 -mt-1 size-8 shrink-0"
                aria-label="Curriculum actions"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  setTitle(curriculum.title);
                  setRenameOpen(true);
                }}
              >
                <Pencil /> Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setDeleteOpen(true)}
              >
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <Link to={`/curricula/${curriculum.id}`} className="block space-y-3">
            <p className="line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
              {curriculum.summary || "No summary yet."}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Layers className="size-3" />
                {levelCount} levels
              </Badge>
              <span className="truncate text-xs text-muted-foreground">
                {curriculum.scheme.levels.map((l) => l.singular).join(" › ")}
              </span>
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* Rename dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleRename} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Rename curriculum</DialogTitle>
            </DialogHeader>
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setRenameOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={update.isPending}>
                {update.isPending && <Loader2 className="animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete “{curriculum.title}”?</DialogTitle>
            <DialogDescription>
              This permanently deletes the curriculum and all of its content.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={remove.isPending}
            >
              {remove.isPending && <Loader2 className="animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
