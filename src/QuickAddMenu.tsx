import { SHAPES } from './shapes';

export function QuickAddMenu({
  x,
  y,
  onPick,
  onDismiss,
}: {
  x: number;
  y: number;
  onPick: (type: string) => void;
  onDismiss: () => void;
}) {
  return (
    <>
      <div className="quick-add-backdrop" onClick={onDismiss} />
      <div className="quick-add-menu" style={{ left: x, top: y }}>
        <div className="quick-add-menu__title">Add connected shape</div>
        {SHAPES.map((s) => (
          <button
            key={s.type}
            type="button"
            className="quick-add-menu__item"
            onClick={() => onPick(s.type)}
          >
            <span style={{ color: s.color }}>{s.icon}</span> {s.label}
          </button>
        ))}
      </div>
    </>
  );
}
