import type { StateCreator } from "zustand";
import type { AppState, RadarSlice } from "../store.types";
import type { RadarNode } from "../../features/radar/radar.types";
import { RADAR_NODES } from "../../features/radar/radar.constants";
import { AudioManager } from "../../systems/AudioManager";

export const createRadarSlice: StateCreator<AppState, [], [], RadarSlice> = (set, get) => ({
  selectedNode: RADAR_NODES[0],
  selectedNodeId: "riyadh",
  radarNodes: RADAR_NODES,
  isRadarPaused: false,
  radarSweepSpeed: 1,

  setSelectedNode: (node: RadarNode | null) => {
    set({ selectedNode: node, selectedNodeId: node ? node.id : null });
    if (node) {
      AudioManager.playRadarPing();
      get().addLog(
        "RADAR",
        `Target node locked: ${node.name} [Class: ${node.classification}] Coordinates: ${node.coordinates}`,
        node.status === "warning" ? "warning" : "info"
      );
    }
  },

  setSelectedNodeId: (id: string | null) => {
    const node = id ? RADAR_NODES.find((n) => n.id === id) ?? null : null;
    set({ selectedNodeId: id, selectedNode: node });
    if (node) {
      AudioManager.playRadarPing();
      get().addLog(
        "RADAR",
        `Target locked: ${node.name} [${node.classification}]`,
        node.status === "warning" ? "warning" : "info"
      );
    }
  },

  toggleRadarPause: () => {
    set((state) => ({ isRadarPaused: !state.isRadarPaused }));
  },

  setRadarSweepSpeed: (speed: number) => {
    set({ radarSweepSpeed: speed });
  },
});
