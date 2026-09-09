export type ShapeDef = { type: string; label: string; icon: string; color: string };

export const SHAPES: ShapeDef[] = [
  { type: 'pipeline', label: 'Pipeline', icon: '≡', color: '#1B3A63' },
  { type: 'deal', label: 'Deal', icon: '$', color: '#C1440E' },
  { type: 'company', label: 'Company', icon: 'C', color: '#1B3A63' },
  { type: 'contact', label: 'Contact', icon: 'P', color: '#1B3A63' },
  { type: 'customObject', label: 'Custom object', icon: '◆', color: '#5B5F68' },
  { type: 'activity', label: 'Activity', icon: '☎', color: '#5B5F68' },
  { type: 'decision', label: 'Decision', icon: '◇', color: '#1B3A63' },
];

export const DEFAULT_DATA: Record<string, Record<string, unknown>> = {
  pipeline: { name: 'New Pipeline', stages: ['Stage 1', 'Closed Won', 'Closed Lost'], activeStage: 'Stage 1' },
  deal: { pipeline: 'New Business', stage: 'Stage 1', amount: '£0' },
  company: { name: 'New Company', domain: 'example.com', industry: 'Industry' },
  contact: { name: 'New Contact', lifecycle: 'Lead' },
  customObject: { label: 'Custom Object', property: 'Property' },
  activity: { kind: 'Call', outcome: 'Outcome' },
  decision: { question: 'Condition?' },
};
