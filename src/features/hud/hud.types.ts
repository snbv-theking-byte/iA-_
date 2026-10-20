export type ToastLevel = "info" | "warning" | "critical";

export interface ToastNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  level: ToastLevel;
  category?: string;
  durationMs?: number;
}

export interface MetricCardData {
  id: string;
  label: string;
  value: string | number;
  subValue?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  status: "nominal" | "warning" | "critical";
  accentColor?: string;
}
