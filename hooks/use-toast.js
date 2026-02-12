"use client";

import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = ({
    title,
    description,
    action,
    className,
    variant = "default",
  }) => {
    const id = Date.now();

    // In a real app, you'd integrate with a toast library
    // For now, we'll just console.log and use alert
    console.log(`🍞 Toast: ${title} - ${description}`);

    // Show browser notification
    if (title || description) {
      const message = `${title}\n${description}`;

      if (variant === "destructive") {
        alert(`❌ ${message}`);
      } else {
        alert(`✅ ${message}`);
      }
    }

    setToasts((prev) => [
      ...prev,
      { id, title, description, action, className, variant },
    ]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5001);
  };

  return { toast, toasts };
}
