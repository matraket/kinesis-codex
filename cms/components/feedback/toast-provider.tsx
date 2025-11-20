'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

interface Toast {
  id: string;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const target = document.getElementById('toast-root');
    setContainer(target);
  }, []);

  const push = useCallback((toast: Omit<Toast, 'id'>) => {
    setToasts((current) => [...current, { id: crypto.randomUUID(), ...toast }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ toasts, push, dismiss }), [dismiss, push, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {container
        ? createPortal(
            <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className="rounded-xl bg-slate-900/90 px-4 py-3 text-sm text-white shadow-lg backdrop-blur"
                  role="status"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{toast.title}</p>
                      {toast.description && <p className="text-slate-200">{toast.description}</p>}
                    </div>
                    <button
                      aria-label="Cerrar"
                      onClick={() => dismiss(toast.id)}
                      className="rounded-full p-1 hover:bg-slate-800"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>,
            container
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast debe ser utilizado dentro de ToastProvider');
  }
  return ctx;
}
