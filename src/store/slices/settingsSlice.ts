import type { StateCreator } from "zustand";
import type { AppState, SettingsSlice, ThemePreset } from "../store.types";
import type { ModuleView } from "../../types";
import { AudioManager } from "../../systems/AudioManager";

export const createSettingsSlice: StateCreator<AppState, [], [], SettingsSlice> = (set, get) => ({
  theme: "sovereign-gold",
  crtFilterEnabled: true,
  audioEnabled: true,
  audioVolume: 0.7,
  activeView: "COMMAND_CORE",
  commandPaletteOpen: false,
  settingsOpen: false,

  setTheme: (theme: ThemePreset) => {
    set({ theme });
    AudioManager.playKeyClick();
    get().addLog("SYSTEM", `Visual sovereign theme updated to: [${theme.toUpperCase()}]`, "info");
  },

  toggleCrtFilter: () => {
    AudioManager.playKeyClick();
    set((state) => ({ crtFilterEnabled: !state.crtFilterEnabled }));
  },

  toggleAudio: () => {
    const next = !get().audioEnabled;
    AudioManager.setEnabled(next);
    set({ audioEnabled: next });
    get().addLog("SYSTEM", `Procedural Web Audio synthesis: ${next ? "ACTIVE" : "MUTED"}`, "info");
  },

  setAudioVolume: (volume: number) => {
    AudioManager.setVolume(volume);
    set({ audioVolume: volume });
  },

  setActiveView: (view: ModuleView) => {
    AudioManager.playKeyClick();
    set({ activeView: view });
    get().addLog("SYSTEM", `Navigation: Switched to module [${view}]`, "info");
  },

  setCommandPaletteOpen: (open: boolean) => {
    if (open) AudioManager.playKeyClick();
    set({ commandPaletteOpen: open });
  },

  setSettingsOpen: (open: boolean) => {
    if (open) AudioManager.playKeyClick();
    set({ settingsOpen: open });
  },
});
