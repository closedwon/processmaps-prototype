import { SHAPES } from './shapes';

export function Palette() {
  const onDragStart = (event: React.DragEvent, type: string) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="palette">
      <div className="palette__title">HubSpot shapes</div>
      {SHAPES.map((s) => (
        <div
          key={s.type}
          className="palette__item"
          draggable
          onDragStart={(e) => onDragStart(e, s.type)}
        >
          <span className="palette__icon" style={{ color: s.color }}>{s.icon}</span>
          {s.label}
        </div>
      ))}
      <div className="palette__hint">Drag onto the canvas, or drag a connection out to empty space to add a linked shape. Click a shape, then use its toolbar to recolour. Double-click text to rename.</div>
    </aside>
  );
}
