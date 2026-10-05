import type { Sensitivity } from './model';
export function preview(sensitivity: Sensitivity, text: string, context: 'collection' | 'notification') {
  if(context==='notification'||sensitivity!=='ordinary') return 'Something shared between you';
  return text;
}
export function externalProcessingAllowed(sensitivity: Sensitivity) { return sensitivity === 'ordinary'; }
export function responsePayload(state: string, answer: string) { return state === 'answered' ? answer.trim() : null; }
