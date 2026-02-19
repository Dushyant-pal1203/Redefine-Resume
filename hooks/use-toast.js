"use client";

import * as React from "react";

const ToastContext = React.createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const dismiss = React.useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = React.useCallback(
    ({ title, description, variant = "default", duration = 5000, action }) => {
      const id = ++toastId;

      setToasts((prev) => [
        ...prev,
        { id, title, description, variant, duration, action },
      ]);

      // Auto-dismiss
      if (duration !== Infinity) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function Toaster() {
  const { toasts, dismiss } = React.useContext(ToastContext) || { toasts: [] };

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            p-4 rounded-lg shadow-lg max-w-md animate-slide-up
            ${toast.variant === "destructive" ? "bg-red-600 text-white" : "bg-gray-800 text-white border border-gray-700"}
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {toast.title && <h3 className="font-semibold">{toast.title}</h3>}
              {toast.description && (
                <p className="text-sm opacity-90 mt-1">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-4 text-white/60 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    // Return a dummy toast function instead of throwing
    // This allows components to work even if ToastProvider is not yet available
    return {
      toast: ({ title, description, variant }) => {
        console.log("Toast (fallback):", { title, description, variant });
      },
      dismiss: () => {},
      toasts: [],
    };
  }
  return context;
}
