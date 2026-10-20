import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppState } from "./store.types";
import { createRadarSlice } from "./slices/radarSlice";
import { createMukaabSlice } from "./slices/mukaabSlice";
import { createTelemetrySlice } from "./slices/telemetrySlice";
import { createSettingsSlice } from "./slices/settingsSlice";
import { createTotemSlice } from "./slices/totemSlice";
import { createBioSlice } from "./slices/bioSlice";

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createRadarSlice(...a),
      ...createMukaabSlice(...a),
      ...createTelemetrySlice(...a),
      ...createSettingsSlice(...a),
      ...createTotemSlice(...a),
      ...createBioSlice(...a),
    }),
    {
      name: "snbv-command-core-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        crtFilterEnabled: state.crtFilterEnabled,
        audioEnabled: state.audioEnabled,
        audioVolume: state.audioVolume,
        selectedNode: state.selectedNode,
        selectedTotemId: state.selectedTotemId,
        selectedProteinAccession: state.selectedProteinAccession,
      }),
    }
  )
);
