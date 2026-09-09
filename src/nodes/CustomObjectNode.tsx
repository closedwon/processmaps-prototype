import { Handle, Position } from '@xyflow/react';
import { EditableText } from '../EditableText';
import { ShapeToolbar } from '../ShapeToolbar';
import { useShapeUpdate } from '../useShapeControls';

export type CustomObjectNodeData = {
  label: string;
  property: string;
  accentColor?: string;
};

export function CustomObjectNode({ id, data, selected }: { id: string; data: CustomObjectNodeData; selected?: boolean }) {
  const update = useShapeUpdate(id);
  const color = data.accentColor ?? '#5B5F68';
  const tint = `color-mix(in srgb, ${color} 16%, white)`;

  return (
    <div className="hs-node custom-object-node">
      <ShapeToolbar selected={!!selected} color={color} onColor={(c) => update({ accentColor: c })} />
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <div className="hs-node__icon" style={{ background: tint, color, borderRadius: 4 }}>◆</div>
      <div className="hs-node__body">
        <div className="hs-node__title">
          <EditableText value={data.label} onChange={(v) => update({ label: v })} />
        </div>
        <span className="hs-node__meta">{data.property}</span>
      </div>
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  );
}
