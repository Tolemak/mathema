export interface BarField {
  label: string;
  value: string;
  tone?: 'accent' | 'warn' | 'error';
}

type Listener = () => void;

let current: BarField[] | null = null;
const listeners = new Set<Listener>();

export function setBarFields(fields: BarField[] | null): void {
  current = fields;
  listeners.forEach((listener) => listener());
}

export function getBarFields(): BarField[] | null {
  return current;
}

export function subscribeBarFields(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
