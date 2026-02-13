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

      return id;
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
