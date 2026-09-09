import { Handle, Position } from '@xyflow/react';

export type DecisionNodeData = {
  question: string;
};

export function DecisionNode({ data }: { data: DecisionNodeData }) {
  return (
    <div className="decision-node">
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <div className="decision-node__diamond">
        <span>{data.question}</span>
      </div>
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  );
}
