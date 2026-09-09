import { useReactFlow } from '@xyflow/react';

export function useShapeUpdate(id: string) {
  const { setNodes } = useReactFlow();
  return (patch: Record<string, unknown>) => {
    setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)));
  };
}
