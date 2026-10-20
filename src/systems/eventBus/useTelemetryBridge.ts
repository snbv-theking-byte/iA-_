import { useEffect } from "react";
import { eventBus } from "./index";
import { useAppStore } from "../../store/useAppStore";

export function useTelemetryBridge() {
  const addLog = useAppStore((state) => state.addLog);

  useEffect(() => {
    const unsub1 = eventBus.on("radar:node:selected", (node) => {
      addLog(
        "RADAR",
        `Target lock acquired: ${node.name} [${node.coordinates}]`,
        node.status === "warning" ? "warning" : "info"
      );
    });

    const unsub2 = eventBus.on("mukaab:status:changed", ({ current }) => {
      addLog(
        "MUKAAB",
        `Core status transitioned to: ${current.toUpperCase()}`,
        current === "warning" ? "warning" : current === "overcharge" ? "critical" : "info"
      );
    });

    const unsub3 = eventBus.on("radar:pulse:executed", () => {
      addLog("RADAR", "Tactical radar sweep pulse executed across sector.", "info");
    });

    const unsub4 = eventBus.on("system:pulse", ({ timestamp }) => {
      addLog(
        "SYSTEM",
        `Global resonance pulse sequence synchronized at ${new Date(timestamp).toLocaleTimeString()}`,
        "sovereign"
      );
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  }, [addLog]);
}
