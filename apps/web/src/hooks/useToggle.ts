import { useState, useCallback } from 'react';

export function useToggle(initial = false) {
  const [state, setState] = useState(initial);
  
  const toggle = useCallback(() => setState((prev) => !prev), []);
  const setOpen = useCallback(() => setState(true), []);
  const setClosed = useCallback(() => setState(false), []);

  return [state, toggle, setOpen, setClosed] as const;
}