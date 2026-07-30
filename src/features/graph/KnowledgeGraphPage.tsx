import { useCallback, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Background,
  Controls,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  MarkerType,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ArrowLeft, Network } from "lucide-react";

import { layoutTree } from "@/core/graph/layout";
import { buildTree } from "@/core/tree";
import type { EdgeType } from "@/core/schemas/node";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurriculum } from "@/data/queries/use-curricula";
import { useEdges, useCreateEdge, useDeleteEdge } from "@/data/queries/use-edges";
import { useNodes } from "@/data/queries/use-nodes";
import { useWorkspaceProgress } from "@/data/queries/use-progress";
import {
  LessonGraphNode,
  type LessonNodeData,
} from "@/features/graph/components/lesson-node";
import { useThemeStore } from "@/stores/theme-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

const EDGE_STYLES: Record<EdgeType, { color: string; dashed?: boolean }> = {
  prerequisite: { color: "hsl(38 92% 55%)" },
  related: { color: "hsl(199 89% 55%)", dashed: true },
  unlocks: { color: "hsl(142 65% 50%)" },
  resource: { color: "hsl(243 75% 66%)", dashed: true },
};

export function KnowledgeGraphPage() {
  const { curriculumId } = useParams();
  const navigate = useNavigate();
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId) ?? undefined;
  const theme = useThemeStore((s) => s.theme);

  const { data: curriculum } = useCurriculum(curriculumId);
  const { data: nodeData, isLoading } = useNodes(curriculumId);
  const { data: edgeData } = useEdges(curriculumId);
  const { data: progress } = useWorkspaceProgress(workspaceId);

  const createEdge = useCreateEdge(workspaceId, curriculumId);
  const deleteEdge = useDeleteEdge(curriculumId);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<LessonNodeData>>(
    [],
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const nodeTypes = useMemo<NodeTypes>(
    () => ({ lesson: LessonGraphNode as unknown as NodeTypes[string] }),
    [],
  );

  // Rebuild the flow whenever the underlying data changes.
  useEffect(() => {
    if (!nodeData || !curriculum) return;

    const completed = new Set(
      (progress ?? [])
        .filter((p) => p.status === "completed")
        .map((p) => p.entityId),
    );
    const levelLabel = new Map(
      curriculum.scheme.levels.map((l) => [l.key, l.singular]),
    );
    const childCount = new Map<string, number>();
    for (const n of nodeData) {
      if (n.parentId)
        childCount.set(n.parentId, (childCount.get(n.parentId) ?? 0) + 1);
    }

    const positions = layoutTree(buildTree(nodeData));

    const flowNodes: Node<LessonNodeData>[] = nodeData.map((n) => ({
      id: n.id,
      type: "lesson",
      position: positions.get(n.id) ?? { x: 0, y: 0 },
      data: {
        label: n.title,
        levelLabel: levelLabel.get(n.levelKey) ?? "Item",
        completed: completed.has(n.id),
        isLeaf: (childCount.get(n.id) ?? 0) === 0,
      },
    }));
    setNodes(flowNodes);

    const nodeIds = new Set(nodeData.map((n) => n.id));

    // Containment edges (the hierarchy) — subtle, not deletable.
    const containment: Edge[] = nodeData
      .filter((n) => n.parentId && nodeIds.has(n.parentId))
      .map((n) => ({
        id: `c-${n.id}`,
        source: n.parentId as string,
        target: n.id,
        type: "smoothstep",
        deletable: false,
        selectable: false,
        style: { stroke: "hsl(var(--graph-edge))", strokeWidth: 1.5 },
      }));

    // Semantic edges (prerequisite / related / unlocks) — colored, deletable.
    const semantic: Edge[] = (edgeData ?? [])
      .filter((e) => nodeIds.has(e.fromNodeId) && nodeIds.has(e.toNodeId))
      .map((e) => {
        const s = EDGE_STYLES[e.type];
        return {
          id: e.id,
          source: e.fromNodeId,
          target: e.toNodeId,
          label: e.type,
          animated: !s.dashed,
          markerEnd: { type: MarkerType.ArrowClosed, color: s.color },
          style: {
            stroke: s.color,
            strokeWidth: 2,
            strokeDasharray: s.dashed ? "5 4" : undefined,
          },
          labelStyle: { fill: s.color, fontSize: 11, fontWeight: 600 },
          data: { kind: "semantic" },
        } satisfies Edge;
      });

    setEdges([...containment, ...semantic]);
  }, [nodeData, edgeData, progress, curriculum, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      createEdge.mutate({
        from: connection.source,
        to: connection.target,
        type: "prerequisite",
      });
    },
    [createEdge],
  );

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      for (const e of deleted) {
        if (e.data && (e.data as { kind?: string }).kind === "semantic") {
          deleteEdge.mutate(e.id);
        }
      }
    },
    [deleteEdge],
  );

  const onNodeDoubleClick = useCallback(
    (_: unknown, node: Node) => {
      navigate(`/curricula/${curriculumId}/n/${node.id}`);
    },
    [navigate, curriculumId],
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-[70vh] w-full rounded-xl" />
      </div>
    );
  }

  if (!nodeData || nodeData.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16">
        <EmptyState
          icon={Network}
          title="Nothing to graph yet"
          description="Add lessons to this curriculum, then connect prerequisites here."
          action={
            <Button asChild>
              <Link to={`/curricula/${curriculumId}`}>Back to curriculum</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        colorMode={theme === "light" ? "light" : "dark"}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} className="!bg-background" />
        <Controls className="!rounded-lg !border !bg-card !shadow-sm" />
        <MiniMap
          pannable
          zoomable
          className="!rounded-lg !border !bg-card"
          nodeColor="hsl(var(--primary))"
        />
        <Panel position="top-left">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/curricula/${curriculumId}`}>
                <ArrowLeft /> {curriculum?.title ?? "Curriculum"}
              </Link>
            </Button>
          </div>
        </Panel>
        <Panel position="top-right">
          <div className="space-y-1 rounded-lg border bg-card/90 p-3 text-xs shadow-sm backdrop-blur">
            <p className="font-medium">Knowledge graph</p>
            <p className="text-muted-foreground">
              Drag a node's right dot to another to add a prerequisite.
            </p>
            <p className="text-muted-foreground">
              Select an edge and press Delete to remove it.
            </p>
            <p className="text-muted-foreground">Double-click a node to open.</p>
            <div className="mt-1 flex flex-wrap gap-2 pt-1">
              <Legend color="hsl(38 92% 55%)" label="prerequisite" />
              <Legend color="hsl(199 89% 55%)" label="related" />
              <Legend color="hsl(142 65% 50%)" label="unlocks" />
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="inline-block h-0.5 w-4 rounded"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}
