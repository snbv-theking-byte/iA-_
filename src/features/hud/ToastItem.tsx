import React, { useEffect } from "react";
import { Info, AlertTriangle, AlertOctagon, X } from "lucide-react";
import type { ToastNotification } from "./hud.types";
import styles from "./hud.module.css";

interface Props {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

export const ToastItem: React.FC<Props> = ({ toast, onDismiss }) => {
  const duration = toast.durationMs ?? 4500;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  const getLevelStyle = () => {
    switch (toast.level) {
      case "critical":
        return styles.toastCritical;
      case "warning":
        return styles.toastWarning;
      case "info":
      default:
        return styles.toastInfo;
    }
  };

  const getIcon = () => {
    switch (toast.level) {
      case "critical":
        return <AlertOctagon className="w-4 h-4 text-[#ff3366]" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-[#ffd978]" />;
      case "info":
      default:
        return <Info className="w-4 h-4 text-[#00f0ff]" />;
    }
  };

  return (
    <div className={`${styles.toastItem} ${getLevelStyle()}`} role="alert">
      <div className={styles.toastIcon}>{getIcon()}</div>
      
      <div className={styles.toastBody}>
        <div className={styles.toastHeader}>
          <span className={styles.toastTitle}>{toast.title}</span>
          <span className={styles.toastTime}>{toast.timestamp}</span>
        </div>
        <p className={styles.toastMessage}>{toast.message}</p>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className={styles.toastClose}
        aria-label="Dismiss Notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div
        className={styles.progressBar}
        style={{
          animationDuration: `${duration}ms`,
          backgroundColor:
            toast.level === "critical"
              ? "var(--accent-crimson, #ff3366)"
              : toast.level === "warning"
              ? "var(--accent-bright, #ffd978)"
              : "var(--accent-cyan, #00f0ff)"
        }}
      />
    </div>
  );
};
