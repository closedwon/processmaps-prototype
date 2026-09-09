import { Handle, Position } from '@xyflow/react';

export type ActivityNodeData = {
  kind: 'Call' | 'Email' | 'Meeting';
  outcome: string;
};

const ICONS: Record<ActivityNodeData['kind'], string> = {
  Call: '☎',
  Email: '✉',
  Meeting: '◆',
};

export function ActivityNode({ data }: { data: ActivityNodeData }) {
  return (
    <div className="hs-node activity-node">
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <div className="hs-node__icon activity-node__icon">{ICONS[data.kind]}</div>
      <div className="hs-node__body">
        <div className="hs-node__title">{data.kind}</div>
        <div className="hs-node__meta">{data.outcome}</div>
      </div>
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  );
}
