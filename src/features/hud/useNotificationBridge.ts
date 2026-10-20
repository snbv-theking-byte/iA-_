import { useEffect } from "react";
import { eventBus } from "../../systems/eventBus";
import type { ToastNotification } from "./hud.types";

export function useNotificationBridge(
  onAddToast: (toast: Omit<ToastNotification, "id" | "timestamp">) => void
) {
  useEffect(() => {
    // 1. Radar node selected
    const unsubRadar = eventBus.on("radar:node:selected", (node) => {
      onAddToast({
        title: `SECTOR LOCK: ${node.name}`,
        message: `Coordinates: ${node.coordinates} | Threat Level: ${node.threatLevel}`,
        level: node.status === "critical" ? "critical" : node.status === "warning" ? "warning" : "info",
        category: "RADAR",
        durationMs: 4000
      });
    });

    // 2. Global Radar Pulse
    const unsubPulse = eventBus.on("radar:pulse:executed", (data) => {
      onAddToast({
        title: "STRATEGIC PULSE BROADCAST",
        message: `Origin ${data.origin} dispatched sovereign frequency sweep.`,
        level: "info",
        category: "RADAR",
        durationMs: 3000
      });
    });

    // 3. Mukaab Core Status Transition
    const unsubMukaab = eventBus.on("mukaab:status:changed", (data) => {
      onAddToast({
        title: `MUKAAB NEXUS: ${data.current.toUpperCase()}`,
        message: `Core state transitioned from ${data.previous} to ${data.current}.`,
        level: data.current === "overcharge" ? "critical" : data.current === "warning" ? "warning" : "info",
        category: "MUKAAB",
        durationMs: 4500
      });
    });

    // 4. Totem Toggled
    const unsubTotem = eventBus.on("totem:toggled", (data) => {
      onAddToast({
        title: `TOTEM ${data.id.toUpperCase()}`,
        message: `Resonance node is now ${data.active ? "ENGAGED" : "DORMANT"}.`,
        level: "info",
        category: "TOTEM",
        durationMs: 3000
      });
    });

    // 5. Theme Changed
    const unsubTheme = eventBus.on("system:theme:changed", (data) => {
      onAddToast({
        title: "COLOR MATRIX RECONFIGURED",
        message: `Active theme preset updated to ${data.theme.replace("-", " ").toUpperCase()}.`,
        level: "info",
        category: "SYSTEM",
        durationMs: 2500
      });
    });

    // 6. Command Executed
    const unsubCommand = eventBus.on("command:executed", (data) => {
      onAddToast({
        title: `COMMAND EXECUTED`,
        message: `[${data.commandId}] ${data.title}`,
        level: "info",
        category: "COMMAND",
        durationMs: 2500
      });
    });

    // 7. Telemetry Log added (only warn/error levels to prevent toast spam)
    const unsubTelemetry = eventBus.on("telemetry:log:added", (data) => {
      if (data.level === "CRITICAL" || data.level === "WARNING") {
        onAddToast({
          title: `TELEMETRY ${data.level}`,
          message: data.message,
          level: data.level === "CRITICAL" ? "critical" : "warning",
          category: data.category,
          durationMs: 5000
        });
      }
    });

    return () => {
      unsubRadar();
      unsubPulse();
      unsubMukaab();
      unsubTotem();
      unsubTheme();
      unsubCommand();
      unsubTelemetry();
    };
  }, [onAddToast]);
}
