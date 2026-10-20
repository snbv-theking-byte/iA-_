import type { StateCreator } from "zustand";
import type { AppState, TelemetrySlice, TelemetryEvent } from "../store.types";
import { PHI } from "../../types";

export const createTelemetrySlice: StateCreator<AppState, [], [], TelemetrySlice> = (set) => ({
  logs: [
    {
      id: "INIT-001",
      timestamp: new Date().toLocaleTimeString(),
      category: "SYSTEM",
      message: "KINGDOM OF MURABBA™ Command Core online. Golden Ratio Φ = 1.618034 active.",
      level: "sovereign",
      source: "KERNEL",
    },
    {
      id: "INIT-002",
      timestamp: new Date().toLocaleTimeString(),
      category: "BIO",
      message: "DeepMind Science Skill activated. AlphaFold DB v6 and PubChem pipelines linked.",
      level: "info",
      source: "BIOSCIENCE",
    },
    {
      id: "INIT-003",
      timestamp: new Date().toLocaleTimeString(),
      category: "RADAR",
      message: "Tactical HiDPI radar array initialized. 7 sovereign beacons synchronized.",
      level: "info",
      source: "RADAR_CORE",
    },
  ],

  metrics: {
    uptimeMs: 144000,
    pulseCount: 1618,
    eventCount: 3,
    activeNodes: 4,
    resonanceRatio: PHI,
    systemStatus: "OPTIMAL",
    bioThreatLevel: "NOMINAL",
    totalCompoundsScanned: 48,
  },

  addLog: (category, message, level = "info") => {
    const newEvent: TelemetryEvent = {
      id: `EVT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString(),
      category,
      message,
      level,
      source: category,
    };

    set((state) => ({
      logs: [newEvent, ...state.logs.slice(0, 99)],
      metrics: {
        ...state.metrics,
        eventCount: state.metrics.eventCount + 1,
      },
    }));
  },

  clearLogs: () => {
    set({ logs: [] });
  },

  tickUptime: (deltaMs: number) => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        uptimeMs: state.metrics.uptimeMs + deltaMs,
      },
    }));
  },
});
