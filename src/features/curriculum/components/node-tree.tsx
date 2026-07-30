import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  CircleCheck,
  FileText,
  FolderTree,
  GripVertical,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { buildTree, canHaveChildren, childLevelKey } from "@/core/tree";
import { compareOrder, orderBetween } from "@/core/ordering";
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
  useSetNodeOrder,
  useUpdateNode,
} from "@/data/queries/use-nodes";
import { useWorkspaceProgress } from "@/data/queries/use-progress";
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
  const { data: progress } = useWorkspaceProgress(workspaceId);
  const create = useCreateNode(workspaceId, curriculum.id);
  const update = useUpdateNode(curriculum.id);
  const reorder = useReorderNode(curriculum.id);
  const setOrder = useSetNodeOrder(curriculum.id);
  const remove = useDeleteNode(curriculum.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const completedIds = new Set(
    (progress ?? [])
      .filter((p) => p.status === "completed")
      .map((p) => p.entityId),
  );

  const [dialog, setDialog] = useState<DialogState>(null);
  const [deleteTarget, setDeleteTarget] = useState<CurriculumNode | null>(null);

  const scheme = curriculum.scheme;
  const rootLevel = scheme.levels[0];
  const allNodes = nodes ?? [];
  const tree = buildTree(allNodes);

  /** Reorder within a sibling group via fractional indexing (no re-parenting). */
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const byId = new Map(allNodes.map((n) => [n.id, n]));
    const a = byId.get(String(active.id));
    const o = byId.get(String(over.id));
    if (!a || !o || a.parentId !== o.parentId) return;

    const siblings = allNodes
      .filter((n) => n.parentId === a.parentId)
      .sort((x, y) => compareOrder(x.order, y.order))
      .map((n) => n.id);
    const oldIndex = siblings.indexOf(a.id);
    const newIndex = siblings.indexOf(o.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(siblings, oldIndex, newIndex);
    const pos = reordered.indexOf(a.id);
    const prev = pos > 0 ? byId.get(reordered[pos - 1])?.order ?? null : null;
    const next =
      pos < reordered.length - 1
        ? byId.get(reordered[pos + 1])?.order ?? null
        : null;
    setOrder.mutate({ id: a.id, order: orderBetween(prev, next) });
  }

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="rounded-xl border bg-card p-2">
            <SortableContext
              items={tree.map((t) => t.node.id)}
              strategy={verticalListSortingStrategy}
            >
              {tree.map((item, i) => (
                <NodeTreeItem
                  key={item.node.id}
                  treeNode={item}
                  scheme={scheme}
                  curriculumId={curriculum.id}
                  completedIds={completedIds}
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
            </SortableContext>
          </div>
        </DndContext>
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
  completedIds: Set<string>;
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
  completedIds,
  siblingCount,
  index,
  onAddChild,
  onRename,
  onDelete,
  onReorder,
}: NodeTreeItemProps) {
  const { node, depth, children } = treeNode;
  const [expanded, setExpanded] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasChildren = children.length > 0;
  const allowsChildren = canHaveChildren(scheme, node.levelKey);
  const label = levelLabel(scheme, node.levelKey);
  const childKey = childLevelKey(scheme, node.levelKey);
  const isLeaf = !allowsChildren;

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && "z-10")}>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-accent/50",
          isDragging && "bg-accent shadow-sm",
        )}
        style={{ paddingLeft: `${depth * 20 + 4}px` }}
      >
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex size-5 shrink-0 cursor-grab touch-none items-center justify-center rounded text-muted-foreground/50 opacity-0 hover:text-muted-foreground group-hover:opacity-100 active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="size-4" />
        </button>
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
          completedIds.has(node.id) ? (
            <CircleCheck className="size-4 shrink-0 text-success" />
          ) : (
            <FileText className="size-4 shrink-0 text-muted-foreground" />
          )
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
          <SortableContext
            items={children.map((c) => c.node.id)}
            strategy={verticalListSortingStrategy}
          >
            {children.map((child, i) => (
              <NodeTreeItem
                key={child.node.id}
                treeNode={child}
                scheme={scheme}
                curriculumId={curriculumId}
                completedIds={completedIds}
                siblingCount={children.length}
                index={i}
                onAddChild={onAddChild}
                onRename={onRename}
                onDelete={onDelete}
                onReorder={onReorder}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}
