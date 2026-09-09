import { Handle, Position } from '@xyflow/react';
import { EditableText } from '../EditableText';
import { ShapeToolbar } from '../ShapeToolbar';
import { useShapeUpdate } from '../useShapeControls';

export type ContactNodeData = {
  name: string;
  lifecycle: string;
  accentColor?: string;
};

export function ContactNode({ id, data, selected }: { id: string; data: ContactNodeData; selected?: boolean }) {
  const update = useShapeUpdate(id);
  const color = data.accentColor ?? '#1B3A63';
  const tint = `color-mix(in srgb, ${color} 16%, white)`;

  return (
    <div className="hs-node contact-node">
      <ShapeToolbar selected={!!selected} color={color} onColor={(c) => update({ accentColor: c })} />
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <div className="hs-node__icon" style={{ background: tint, color }}>P</div>
      <div className="hs-node__body">
        <div className="hs-node__title">
          <EditableText value={data.name} onChange={(v) => update({ name: v })} />
        </div>
        <span className="chip" style={{ background: tint, color }}>{data.lifecycle}</span>
      </div>
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  );
}
