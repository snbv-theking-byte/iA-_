import type { StateCreator } from "zustand";
import type { AppState, MukaabSlice, CoreStatus } from "../store.types";
import { AudioManager } from "../../systems/AudioManager";
import { EventBus } from "../../systems/EventBus";

export const createMukaabSlice: StateCreator<AppState, [], [], MukaabSlice> = (set, get) => ({
  coreStatus: "nominal",
  wireframeMode: false,
  pulseCount: 1618,

  setCoreStatus: (status: CoreStatus) => {
    set({ coreStatus: status });
    if (status === "overcharge") {
      AudioManager.playAlert();
    } else {
      AudioManager.playKeyClick();
    }
    get().addLog(
      "MUKAAB",
      `Nexus Core status transitioned to: [${status.toUpperCase()}]`,
      status === "warning" ? "warning" : status === "overcharge" ? "critical" : "info"
    );
  },

  toggleWireframe: () => {
    set((state) => ({ wireframeMode: !state.wireframeMode }));
    AudioManager.playKeyClick();
  },

  executeGlobalPulse: () => {
    AudioManager.playGlobalPulse();

    set((state) => {
      const nextPulse = state.pulseCount + 1;
      const nextRatio = Number((state.metrics.resonanceRatio * 1.0001).toFixed(6));
      return {
        pulseCount: nextPulse,
        metrics: {
          ...state.metrics,
          pulseCount: nextPulse,
          resonanceRatio: nextRatio,
        },
      };
    });

    EventBus.emit("system:pulse", { timestamp: Date.now() });

    get().addLog(
      "MUKAAB",
      `GLOBAL RESONANCE PULSE EMITTED. Sequence #${get().pulseCount} • Harmonic Φ = ${get().metrics.resonanceRatio}`,
      "sovereign"
    );
  },
});
