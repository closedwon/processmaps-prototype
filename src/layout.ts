import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';

export type Direction = 'TB' | 'LR';

const NODE_SIZE: Record<string, [number, number]> = {
  pipeline: [280, 70],
  decision: [140, 140],
};
const DEFAULT_SIZE: [number, number] = [210, 62];

function sizeOf(node: Node): [number, number] {
  return NODE_SIZE[node.type ?? ''] ?? DEFAULT_SIZE;
}

export function layoutElements(nodes: Node[], edges: Edge[], direction: Direction) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 70, ranksep: 100 });

  nodes.forEach((n) => {
    const [width, height] = sizeOf(n);
    g.setNode(n.id, { width, height });
  });
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  const laidOutNodes = nodes.map((n) => {
    const [width, height] = sizeOf(n);
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - width / 2, y: pos.y - height / 2 } };
  });

  // Branch edges (Yes/No off a decision) keep their bottom/right handles regardless
  // of direction — those are branch semantics, not flow direction. Only the plain,
  // unlabeled "next step" edges follow the chosen direction.
  const laidOutEdges = edges.map((e) => {
    if (e.label) return e;
    return {
      ...e,
      sourceHandle: direction === 'LR' ? 'right' : 'bottom',
      targetHandle: direction === 'LR' ? 'left' : 'top',
    };
  });

  return { nodes: laidOutNodes, edges: laidOutEdges };
}
