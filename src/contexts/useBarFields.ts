import { useEffect } from 'react';
import { setBarFields, type BarField } from '../utils/barStore';

// Pages put their own live values into the status bar; the defaults come back on unmount.
export function useBarFields(fields: BarField[]): void {
  const key = JSON.stringify(fields);

  useEffect(() => {
    setBarFields(JSON.parse(key) as BarField[]);
  }, [key]);

  useEffect(() => () => setBarFields(null), []);
}
