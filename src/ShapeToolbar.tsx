import { NodeToolbar, Position } from '@xyflow/react';

const SWATCHES = ['#C1440E', '#1B3A63', '#1C6B45', '#8A2B1F', '#5B5F68'];

export function ShapeToolbar({
  selected,
  color,
  onColor,
}: {
  selected: boolean;
  color: string;
  onColor: (c: string) => void;
}) {
  return (
    <NodeToolbar isVisible={selected} position={Position.Top} className="shape-toolbar nodrag">
      {SWATCHES.map((c) => (
        <button
          key={c}
          type="button"
          className={`swatch ${c === color ? 'is-active' : ''}`}
          style={{ background: c }}
          onClick={() => onColor(c)}
          aria-label={`Set colour ${c}`}
        />
      ))}
    </NodeToolbar>
  );
}
