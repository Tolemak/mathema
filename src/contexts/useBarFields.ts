import { useEffect } from 'react';
import { setBarFields, type BarField } from '../utils/barStore';

export function useBarFields(fields: BarField[]): void {
  const key = JSON.stringify(fields);

  useEffect(() => {
    setBarFields(JSON.parse(key) as BarField[]);
  }, [key]);

  useEffect(() => () => setBarFields(null), []);
}
