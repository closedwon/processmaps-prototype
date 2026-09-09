import { EditableText } from './EditableText';

export type Board = { id: string; name: string; nodes: unknown[]; edges: unknown[] };

export function TabBar({
  boards,
  activeId,
  onSelect,
  onRename,
  onAdd,
  onDelete,
}: {
  boards: Board[];
  activeId: string;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="tab-bar">
      {boards.map((b) => (
        <div
          key={b.id}
          className={`tab-bar__tab ${b.id === activeId ? 'is-active' : ''}`}
          onClick={() => onSelect(b.id)}
        >
          <EditableText value={b.name} onChange={(v) => onRename(b.id, v)} />
          {boards.length > 1 && (
            <button
              type="button"
              className="tab-bar__close"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(b.id);
              }}
              aria-label={`Delete ${b.name}`}
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button type="button" className="tab-bar__add" onClick={onAdd} aria-label="Add page">
        +
      </button>
    </div>
  );
}
