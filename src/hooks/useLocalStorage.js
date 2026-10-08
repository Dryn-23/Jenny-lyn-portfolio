/**
 * useLocalStorage.js — tiny persistent-state hook.
 * Used so projects you add through the UI survive a page refresh.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const initialRef = useRef(initialValue);

  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialRef.current;
    } catch {
      return initialRef.current;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked (private mode) — the app keeps working in memory */
    }
  }, [key, value]);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    setValue(initialRef.current);
  }, [key]);

  return [value, setValue, reset];
}
