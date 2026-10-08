/**
 * Toast.jsx — tiny toast system (context + viewport) for save/delete feedback.
 *   const toast = useToast(); toast('Project added 🌿', 'success');
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Check, Info } from './Icons.jsx';
import './Toast.css';

const ToastContext = createContext(() => {});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const idRef = useRef(0);

  const toast = useCallback((message, tone = 'success') => {
    const id = (idRef.current += 1);
    setItems((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const value = useMemo(() => toast, [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`toast toast--${t.tone}`}>
            <span className="toast__icon" aria-hidden="true">
              {t.tone === 'success' ? <Check size={15} /> : <Info size={15} />}
            </span>
            <p>{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
