import { Handle, Position } from '@xyflow/react';
import { EditableText } from '../EditableText';
import { ShapeToolbar } from '../ShapeToolbar';
import { useShapeUpdate } from '../useShapeControls';

export type PipelineNodeData = {
  name: string;
  stages: string[]; // open stages followed by exactly two fixed stages: [...open, Closed Won, Closed Lost]
  activeStage?: string;
  accentColor?: string;
};

const WON_COLOR = '#1C6B45';
const LOST_COLOR = '#8A2B1F';
const MIN_OPEN_STAGES = 1;

export function PipelineNode({ id, data, selected }: { id: string; data: PipelineNodeData; selected?: boolean }) {
  const update = useShapeUpdate(id);
  const color = data.accentColor ?? '#1B3A63';
  const tint = `color-mix(in srgb, ${color} 16%, white)`;
  const openCount = data.stages.length - 2;

  const renameStage = (index: number, value: string) => {
    const next = [...data.stages];
    next[index] = value;
    update({ stages: next, activeStage: data.activeStage === data.stages[index] ? value : data.activeStage });
  };

  const addStage = () => {
    const insertAt = data.stages.length - 2;
    const next = [...data.stages];
    next.splice(insertAt, 0, `Stage ${insertAt + 1}`);
    update({ stages: next });
  };

  const removeStage = (index: number) => {
    if (openCount <= MIN_OPEN_STAGES) return;
    const next = data.stages.filter((_, i) => i !== index);
    update({
      stages: next,
      activeStage: data.activeStage === data.stages[index] ? undefined : data.activeStage,
    });
  };

  return (
    <div className="pipeline-node">
      <ShapeToolbar selected={!!selected} color={color} onColor={(c) => update({ accentColor: c })} />
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <div className="pipeline-node__title">
        <EditableText value={data.name} onChange={(v) => update({ name: v })} />
      </div>
      <div className="pipeline-node__track">
        {data.stages.map((stage, i) => {
          const isWon = i === data.stages.length - 2;
          const isLost = i === data.stages.length - 1;
          const isClosed = isWon || isLost;
          const active = stage === data.activeStage;
          const stageColor = isWon ? WON_COLOR : isLost ? LOST_COLOR : color;
          const stageTint = isClosed
            ? `color-mix(in srgb, ${stageColor} 16%, white)`
            : tint;

          return (
            <div
              key={i}
              className={`pipeline-node__stage ${isClosed ? 'is-closed' : ''}`}
              style={{ background: active && !isClosed ? color : stageTint, color: active && !isClosed ? '#fff' : stageColor }}
            >
              {!isClosed && openCount > MIN_OPEN_STAGES && (
                <button
                  type="button"
                  className="pipeline-node__stage-remove nodrag"
                  onClick={() => removeStage(i)}
                  aria-label={`Remove ${stage}`}
                >
                  ×
                </button>
              )}
              <EditableText
                value={stage}
                onChange={(v) => renameStage(i, v)}
                className="pipeline-node__stage-text"
              />
              <Handle
                type="source"
                position={Position.Bottom}
                id={`stage-${i}`}
                style={{ left: `${((i + 0.5) / data.stages.length) * 100}%` }}
              />
            </div>
          );
        })}
        <button type="button" className="pipeline-node__add-stage nodrag" onClick={addStage} aria-label="Add stage">
          +
        </button>
      </div>
    </div>
  );
}
