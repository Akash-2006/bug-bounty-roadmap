import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  FileText,
  FolderTree,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { buildTree, canHaveChildren, childLevelKey } from "@/core/tree";
import type { Curriculum } from "@/core/schemas/curriculum";
import type { HierarchyScheme } from "@/core/schemas/hierarchy";
import type { CurriculumNode } from "@/core/schemas/node";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useCreateNode,
  useDeleteNode,
  useNodes,
  useReorderNode,
  useUpdateNode,
} from "@/data/queries/use-nodes";
import {
  NodeFormDialog,
  type NodeFormValues,
} from "@/features/curriculum/components/node-form-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NodeTreeProps {
  curriculum: Curriculum;
  workspaceId: string | undefined;
}

type DialogState =
  | { mode: "add"; parentId: string | null; levelKey: string; levelLabel: string }
  | { mode: "rename"; node: CurriculumNode }
  | null;

function levelLabel(scheme: HierarchyScheme, levelKey: string): string {
  return scheme.levels.find((l) => l.key === levelKey)?.singular ?? "Item";
}

export function NodeTree({ curriculum, workspaceId }: NodeTreeProps) {
  const { data: nodes, isLoading } = useNodes(curriculum.id);
  const create = useCreateNode(workspaceId, curriculum.id);
  const update = useUpdateNode(curriculum.id);
  const reorder = useReorderNode(curriculum.id);
  const remove = useDeleteNode(curriculum.id);

  const [dialog, setDialog] = useState<DialogState>(null);
  const [deleteTarget, setDeleteTarget] = useState<CurriculumNode | null>(null);

  const scheme = curriculum.scheme;
  const rootLevel = scheme.levels[0];
  const tree = buildTree(nodes ?? []);

  async function handleSubmit(values: NodeFormValues) {
    if (!dialog) return;
    if (dialog.mode === "add") {
      await create.mutateAsync({
        parentId: dialog.parentId,
        levelKey: dialog.levelKey,
        title: values.title,
        summary: values.summary || undefined,
      });
    } else {
      await update.mutateAsync({
        id: dialog.node.id,
        patch: { title: values.title, summary: values.summary || undefined },
      });
    }
    setDialog(null);
  }

  function openAddChild(node: CurriculumNode) {
    const childKey = childLevelKey(scheme, node.levelKey);
    if (!childKey) return;
    setDialog({
      mode: "add",
      parentId: node.id,
      levelKey: childKey,
      levelLabel: levelLabel(scheme, childKey),
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <FolderTree className="size-5 text-muted-foreground" />
          Structure
        </h2>
        <Button
          size="sm"
          onClick={() =>
            setDialog({
              mode: "add",
              parentId: null,
              levelKey: rootLevel.key,
              levelLabel: rootLevel.singular,
            })
          }
        >
          <Plus /> Add {rootLevel.singular}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-lg" />
          ))}
        </div>
      ) : tree.length === 0 ? (
        <EmptyState
          icon={FolderTree}
          title={`No ${rootLevel.plural.toLowerCase()} yet`}
          description={`Add your first ${rootLevel.singular.toLowerCase()} to start building this curriculum.`}
          action={
            <Button
              onClick={() =>
                setDialog({
                  mode: "add",
                  parentId: null,
                  levelKey: rootLevel.key,
                  levelLabel: rootLevel.singular,
                })
              }
            >
              <Plus /> Add {rootLevel.singular}
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border bg-card p-2">
          {tree.map((item, i) => (
            <NodeTreeItem
              key={item.node.id}
              treeNode={item}
              scheme={scheme}
              curriculumId={curriculum.id}
              siblingCount={tree.length}
              index={i}
              onAddChild={openAddChild}
              onRename={(node) => setDialog({ mode: "rename", node })}
              onDelete={(node) => setDeleteTarget(node)}
              onReorder={(id, direction) =>
                reorder.mutate({ id, direction })
              }
            />
          ))}
        </div>
      )}

      {/* Add / rename dialog */}
      <NodeFormDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        heading={
          dialog?.mode === "add"
            ? `Add ${dialog.levelLabel}`
            : `Rename ${dialog ? levelLabel(scheme, dialog.node.levelKey) : ""}`
        }
        submitLabel={dialog?.mode === "add" ? "Add" : "Save"}
        initialTitle={dialog?.mode === "rename" ? dialog.node.title : ""}
        initialSummary={
          dialog?.mode === "rename" ? (dialog.node.summary ?? "") : ""
        }
        submitting={create.isPending || update.isPending}
        onSubmit={handleSubmit}
      />

      {/* Delete confirmation */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete “{deleteTarget?.title}”?</DialogTitle>
            <DialogDescription>
              This removes the item and everything nested inside it. This cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (deleteTarget) {
                  await remove.mutateAsync(deleteTarget.id);
                }
                setDeleteTarget(null);
              }}
              disabled={remove.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface NodeTreeItemProps {
  treeNode: ReturnType<typeof buildTree>[number];
  scheme: HierarchyScheme;
  curriculumId: string;
  siblingCount: number;
  index: number;
  onAddChild: (node: CurriculumNode) => void;
  onRename: (node: CurriculumNode) => void;
  onDelete: (node: CurriculumNode) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
}

function NodeTreeItem({
  treeNode,
  scheme,
  curriculumId,
  siblingCount,
  index,
  onAddChild,
  onRename,
  onDelete,
  onReorder,
}: NodeTreeItemProps) {
  const { node, depth, children } = treeNode;
  const [expanded, setExpanded] = useState(true);

  const hasChildren = children.length > 0;
  const allowsChildren = canHaveChildren(scheme, node.levelKey);
  const label = levelLabel(scheme, node.levelKey);
  const childKey = childLevelKey(scheme, node.levelKey);
  const isLeaf = !allowsChildren;

  return (
    <div>
      <div
        className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-accent/50"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        <button
          type="button"
          onClick={() => hasChildren && setExpanded((v) => !v)}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground",
            !hasChildren && "invisible",
          )}
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          <ChevronRight
            className={cn(
              "size-4 transition-transform",
              expanded && "rotate-90",
            )}
          />
        </button>

        {isLeaf ? (
          <FileText className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <FolderTree className="size-4 shrink-0 text-muted-foreground" />
        )}

        <Link
          to={`/curricula/${curriculumId}/n/${node.id}`}
          className="min-w-0 flex-1 truncate text-sm font-medium hover:text-primary hover:underline"
        >
          {node.title}
        </Link>

        <Badge
          variant="outline"
          className="hidden shrink-0 text-[10px] sm:inline-flex"
        >
          {label}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
              aria-label="Node actions"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {childKey && (
              <DropdownMenuItem onSelect={() => onAddChild(node)}>
                <Plus /> Add {levelLabel(scheme, childKey)}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={() => onRename(node)}>
              <Pencil /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={index === 0}
              onSelect={() => onReorder(node.id, "up")}
            >
              Move up
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={index === siblingCount - 1}
              onSelect={() => onReorder(node.id, "down")}
            >
              Move down
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onDelete(node)}
            >
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasChildren && expanded && (
        <div>
          {children.map((child, i) => (
            <NodeTreeItem
              key={child.node.id}
              treeNode={child}
              scheme={scheme}
              curriculumId={curriculumId}
              siblingCount={children.length}
              index={i}
              onAddChild={onAddChild}
              onRename={onRename}
              onDelete={onDelete}
              onReorder={onReorder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
