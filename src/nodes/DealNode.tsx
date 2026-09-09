import { Handle, Position } from '@xyflow/react';
import { EditableText } from '../EditableText';
import { ShapeToolbar } from '../ShapeToolbar';
import { useShapeUpdate } from '../useShapeControls';

export type DealNodeData = {
  pipeline: string;
  stage: string;
  amount: string;
  closed?: 'won' | 'lost';
  accentColor?: string;
};

export function DealNode({ id, data, selected }: { id: string; data: DealNodeData; selected?: boolean }) {
  const update = useShapeUpdate(id);
  const color = data.accentColor ?? (data.closed === 'won' ? '#1C6B45' : data.closed === 'lost' ? '#8A2B1F' : '#C1440E');
  const tint = `color-mix(in srgb, ${color} 16%, white)`;

  return (
    <div className="hs-node deal-node">
      <ShapeToolbar selected={!!selected} color={color} onColor={(c) => update({ accentColor: c })} />
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <div className="hs-node__icon" style={{ background: tint, color }}>$</div>
      <div className="hs-node__body">
        <div className="hs-node__title">
          <EditableText value={data.pipeline} onChange={(v) => update({ pipeline: v })} />
        </div>
        <div className="hs-node__row">
          <span className="chip" style={{ background: tint, color }}>{data.stage}</span>
          <span className="hs-node__meta">{data.amount}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  );
}
