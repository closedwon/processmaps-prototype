import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Panel,
  ConnectionMode,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type OnConnectStart,
  type OnConnectEnd,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './flow.css';

import { CompanyNode } from './nodes/CompanyNode';
import { DealNode } from './nodes/DealNode';
import { ActivityNode } from './nodes/ActivityNode';
import { DecisionNode } from './nodes/DecisionNode';
import { PipelineNode } from './nodes/PipelineNode';
import { ContactNode } from './nodes/ContactNode';
import { CustomObjectNode } from './nodes/CustomObjectNode';
import { Palette } from './Palette';
import { QuickAddMenu } from './QuickAddMenu';
import { TabBar } from './TabBar';
import { DEFAULT_DATA } from './shapes';
import { layoutElements, type Direction } from './layout';

const nodeTypes = {
  company: CompanyNode,
  deal: DealNode,
  activity: ActivityNode,
  decision: DecisionNode,
  pipeline: PipelineNode,
  contact: ContactNode,
  customObject: CustomObjectNode,
};

const initialNodes: Node[] = [
  { id: 'company-1', type: 'company', position: { x: 380, y: 0 }, data: { name: 'Acme Manufacturing', domain: 'acme.io', industry: 'Manufacturing' } },
  { id: 'pipeline-1', type: 'pipeline', position: { x: 350, y: 120 }, data: { name: 'New Business Pipeline', stages: ['Discovery', 'Demo', 'Proposal', 'Closed Won', 'Closed Lost'], activeStage: 'Discovery' } },
  { id: 'deal-discovery', type: 'deal', position: { x: 380, y: 260 }, data: { pipeline: 'New Business', stage: 'Discovery', amount: '£8,000' } },
  { id: 'call-1', type: 'activity', position: { x: 400, y: 390 }, data: { kind: 'Call', outcome: 'Discovery call booked' } },
  { id: 'decision-budget', type: 'decision', position: { x: 390, y: 500 }, data: { question: 'Budget confirmed?' } },
  { id: 'deal-demo', type: 'deal', position: { x: 380, y: 640 }, data: { pipeline: 'New Business', stage: 'Demo', amount: '£8,000' } },
  { id: 'deal-lost-1', type: 'deal', position: { x: 700, y: 505 }, data: { pipeline: 'New Business', stage: 'Closed Lost', amount: '£0', closed: 'lost' } },
  { id: 'contact-1', type: 'contact', position: { x: 700, y: 260 }, data: { name: 'Jamie Ellis', lifecycle: 'Opportunity' } },
  { id: 'custom-1', type: 'customObject', position: { x: 700, y: 130 }, data: { label: 'Site Survey', property: 'Status: Scheduled' } },
  { id: 'meeting-1', type: 'activity', position: { x: 400, y: 760 }, data: { kind: 'Meeting', outcome: 'Demo delivered' } },
  { id: 'decision-champion', type: 'decision', position: { x: 390, y: 870 }, data: { question: 'Champion identified?' } },
  { id: 'deal-proposal', type: 'deal', position: { x: 380, y: 1010 }, data: { pipeline: 'New Business', stage: 'Proposal', amount: '£8,000' } },
  { id: 'deal-lost-2', type: 'deal', position: { x: 700, y: 875 }, data: { pipeline: 'New Business', stage: 'Closed Lost', amount: '£0', closed: 'lost' } },
  { id: 'decision-signed', type: 'decision', position: { x: 390, y: 1130 }, data: { question: 'Signed?' } },
  { id: 'deal-won', type: 'deal', position: { x: 230, y: 1260 }, data: { pipeline: 'New Business', stage: 'Closed Won', amount: '£8,000', closed: 'won' } },
  { id: 'deal-lost-3', type: 'deal', position: { x: 600, y: 1260 }, data: { pipeline: 'New Business', stage: 'Closed Lost', amount: '£0', closed: 'lost' } },
];

const initialEdges: Edge[] = [
  { id: 'e0', source: 'company-1', sourceHandle: 'bottom', target: 'pipeline-1', targetHandle: 'top' },
  { id: 'e1', source: 'pipeline-1', sourceHandle: 'stage-0', target: 'deal-discovery', targetHandle: 'top' },
  { id: 'e2', source: 'deal-discovery', sourceHandle: 'bottom', target: 'call-1', targetHandle: 'top' },
  { id: 'e3', source: 'call-1', sourceHandle: 'bottom', target: 'decision-budget', targetHandle: 'top' },
  { id: 'e4', source: 'decision-budget', sourceHandle: 'bottom', target: 'deal-demo', targetHandle: 'top', label: 'Yes' },
  { id: 'e5', source: 'decision-budget', sourceHandle: 'right', target: 'deal-lost-1', targetHandle: 'left', label: 'No' },
  { id: 'e6', source: 'deal-demo', sourceHandle: 'bottom', target: 'meeting-1', targetHandle: 'top' },
  { id: 'e7', source: 'meeting-1', sourceHandle: 'bottom', target: 'decision-champion', targetHandle: 'top' },
  { id: 'e8', source: 'decision-champion', sourceHandle: 'bottom', target: 'deal-proposal', targetHandle: 'top', label: 'Yes' },
  { id: 'e9', source: 'decision-champion', sourceHandle: 'right', target: 'deal-lost-2', targetHandle: 'left', label: 'No' },
  { id: 'e10', source: 'deal-proposal', sourceHandle: 'bottom', target: 'decision-signed', targetHandle: 'top' },
  { id: 'e11', source: 'decision-signed', sourceHandle: 'bottom', target: 'deal-won', targetHandle: 'top', label: 'Yes' },
  { id: 'e12', source: 'decision-signed', sourceHandle: 'right', target: 'deal-lost-3', targetHandle: 'left', label: 'No' },
  { id: 'e13', source: 'deal-discovery', sourceHandle: 'right', target: 'contact-1', targetHandle: 'left' },
  { id: 'e14', source: 'deal-discovery', sourceHandle: 'right', target: 'custom-1', targetHandle: 'left' },
  { id: 'e15', source: 'pipeline-1', sourceHandle: 'stage-3', target: 'deal-won', targetHandle: 'left', label: 'Closed Won stage' },
];

let dropId = 0;
let boardId = 1;

type QuickAdd = { sourceNodeId: string; sourceHandleId: string | null; screenX: number; screenY: number };
type Board = { id: string; name: string; nodes: Node[]; edges: Edge[] };

const initialBoards: Board[] = [{ id: 'board-1', name: 'New Business', nodes: initialNodes, edges: initialEdges }];

// True when this app is loaded inside someone else's page (e.g. the HubSpot
// card's iframe modal) rather than visited directly — in that context this is
// a read-only view, so the editing chrome (the shape palette) has no purpose.
const isEmbedded = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true; // cross-origin access to window.top was blocked — definitely embedded
  }
})();

function FlowCanvas() {
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [activeBoardId, setActiveBoardId] = useState(initialBoards[0].id);
  const [direction, setDirection] = useState<Direction>('TB');
  const [quickAdd, setQuickAdd] = useState<QuickAdd | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const connectingRef = useRef<{ nodeId: string; handleId: string | null } | null>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();

  const activeBoard = boards.find((b) => b.id === activeBoardId) ?? boards[0];
  const nodes = activeBoard.nodes;
  const edges = activeBoard.edges;

  const setNodes = useCallback(
    (updater: Node[] | ((nds: Node[]) => Node[])) => {
      setBoards((bs) =>
        bs.map((b) =>
          b.id === activeBoardId
            ? { ...b, nodes: typeof updater === 'function' ? (updater as (n: Node[]) => Node[])(b.nodes) : updater }
            : b,
        ),
      );
    },
    [activeBoardId],
  );
  const setEdges = useCallback(
    (updater: Edge[] | ((eds: Edge[]) => Edge[])) => {
      setBoards((bs) =>
        bs.map((b) =>
          b.id === activeBoardId
            ? { ...b, edges: typeof updater === 'function' ? (updater as (e: Edge[]) => Edge[])(b.edges) : updater }
            : b,
        ),
      );
    },
    [activeBoardId],
  );

  const selectBoard = useCallback(
    (id: string) => {
      setActiveBoardId(id);
      window.requestAnimationFrame(() => fitView({ padding: 0.2, duration: 200 }));
    },
    [fitView],
  );

  const addBoard = useCallback(() => {
    boardId += 1;
    const newId = `board-${boardId}`;
    setBoards((bs) => bs.concat({ id: newId, name: `Page ${bs.length + 1}`, nodes: [], edges: [] }));
    setActiveBoardId(newId);
  }, []);

  const renameBoard = useCallback((id: string, name: string) => {
    setBoards((bs) => bs.map((b) => (b.id === id ? { ...b, name } : b)));
  }, []);

  const deleteBoard = useCallback(
    (id: string) => {
      if (boards.length <= 1) return;
      const next = boards.filter((b) => b.id !== id);
      setBoards(next);
      if (activeBoardId === id) setActiveBoardId(next[0].id);
    },
    [boards, activeBoardId],
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const onConnectStart: OnConnectStart = useCallback((_event, params) => {
    connectingRef.current = params.nodeId ? { nodeId: params.nodeId, handleId: params.handleId } : null;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback((event) => {
    const info = connectingRef.current;
    connectingRef.current = null;
    if (!info) return;

    const target = event.target as HTMLElement;
    const droppedOnPane = target?.classList?.contains('react-flow__pane');
    if (!droppedOnPane) return;

    const point = 'changedTouches' in event ? event.changedTouches[0] : (event as MouseEvent);
    setQuickAdd({
      sourceNodeId: info.nodeId,
      sourceHandleId: info.handleId,
      screenX: point.clientX,
      screenY: point.clientY,
    });
  }, []);

  const handleQuickAddPick = useCallback(
    (type: string) => {
      if (!quickAdd || !DEFAULT_DATA[type]) return;
      const position = screenToFlowPosition({ x: quickAdd.screenX, y: quickAdd.screenY });
      dropId += 1;
      const newId = `${type}-drop-${dropId}`;
      setNodes((nds) => nds.concat({ id: newId, type, position, data: { ...DEFAULT_DATA[type] } }));
      setEdges((eds) =>
        eds.concat({
          id: `e-quick-${dropId}`,
          source: quickAdd.sourceNodeId,
          sourceHandle: quickAdd.sourceHandleId ?? undefined,
          target: newId,
          targetHandle: 'top',
        }),
      );
      setQuickAdd(null);
    },
    [quickAdd, screenToFlowPosition, setNodes, setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !DEFAULT_DATA[type]) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      dropId += 1;
      setNodes((nds) =>
        nds.concat({
          id: `${type}-drop-${dropId}`,
          type,
          position,
          data: { ...DEFAULT_DATA[type] },
        }),
      );
    },
    [screenToFlowPosition, setNodes],
  );

  const applyLayout = useCallback(
    (dir: Direction) => {
      const { nodes: laidOutNodes, edges: laidOutEdges } = layoutElements(nodes, edges, dir);
      setNodes(laidOutNodes);
      setEdges(laidOutEdges);
      setDirection(dir);
      window.requestAnimationFrame(() => fitView({ padding: 0.2, duration: 300 }));
    },
    [nodes, edges, fitView, setNodes, setEdges],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      <TabBar
        boards={boards}
        activeId={activeBoardId}
        onSelect={selectBoard}
        onRename={renameBoard}
        onAdd={addBoard}
        onDelete={deleteBoard}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {!isEmbedded && <Palette />}
        <div className="canvas-wrap" ref={wrapperRef} onDrop={onDrop} onDragOver={onDragOver}>
          <div className="test-banner">
            Process Map — spike test · @xyflow/react
          </div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            nodeTypes={nodeTypes}
            connectionRadius={40}
            connectionMode={ConnectionMode.Loose}
            fitView
            fitViewOptions={{ padding: 0.2 }}
          >
            <Background gap={20} color="#DBD9D2" />
            <Controls />
            <MiniMap pannable zoomable nodeColor={() => '#C1440E'} />
            <Panel position="top-right" className="layout-panel">
              <button
                type="button"
                className={`layout-panel__btn ${direction === 'TB' ? 'is-active' : ''}`}
                onClick={() => applyLayout('TB')}
              >
                ↓ Vertical
              </button>
              <button
                type="button"
                className={`layout-panel__btn ${direction === 'LR' ? 'is-active' : ''}`}
                onClick={() => applyLayout('LR')}
              >
                → Horizontal
              </button>
            </Panel>
          </ReactFlow>
          {quickAdd && wrapperRef.current && (
            <QuickAddMenu
              x={quickAdd.screenX - wrapperRef.current.getBoundingClientRect().left}
              y={quickAdd.screenY - wrapperRef.current.getBoundingClientRect().top}
              onPick={handleQuickAddPick}
              onDismiss={() => setQuickAdd(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
