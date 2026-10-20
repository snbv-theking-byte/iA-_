import React, { useState, useCallback } from "react";
import { ToastItem } from "./ToastItem";
import { useNotificationBridge } from "./useNotificationBridge";
import type { ToastNotification } from "./hud.types";
import styles from "./hud.module.css";

export const NotificationCenter: React.FC = () => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback(
    (item: Omit<ToastNotification, "id" | "timestamp">) => {
      const newToast: ToastNotification = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      };

      // Limit to 5 simultaneous active toasts
      setToasts((prev) => [newToast, ...prev].slice(0, 5));
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Hook into the global type-safe EventBus
  useNotificationBridge(addToast);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer} aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};
