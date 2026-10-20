import type { RadarNode } from "../features/radar/radar.types";
import type { 
  TotemId, 
  TotemNode, 
  ModuleView, 
  AlphaFoldPredictionMeta, 
  ChemicalCompound, 
  SystemMetrics 
} from "../types";

export type CoreStatus = "nominal" | "warning" | "overcharge";
export type ThemePreset = "sovereign-gold" | "cyber-cyan" | "royal-crimson" | "night-ops";

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  category: "RADAR" | "MUKAAB" | "SYSTEM" | "SECURITY" | "BIO";
  message: string;
  level: "info" | "warning" | "critical" | "sovereign";
  source?: string;
  payload?: Record<string, unknown>;
}

export interface RadarSlice {
  selectedNode: RadarNode | null;
  selectedNodeId: string | null;
  setSelectedNode: (node: RadarNode | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  radarNodes: RadarNode[];
  isRadarPaused: boolean;
  toggleRadarPause: () => void;
  radarSweepSpeed: number;
  setRadarSweepSpeed: (speed: number) => void;
}

export interface MukaabSlice {
  coreStatus: CoreStatus;
  setCoreStatus: (status: CoreStatus) => void;
  wireframeMode: boolean;
  toggleWireframe: () => void;
  pulseCount: number;
  executeGlobalPulse: () => void;
}

export interface TelemetrySlice {
  logs: TelemetryEvent[];
  addLog: (
    category: TelemetryEvent["category"],
    message: string,
    level?: TelemetryEvent["level"]
  ) => void;
  clearLogs: () => void;
  metrics: SystemMetrics;
  tickUptime: (deltaMs: number) => void;
}

export interface SettingsSlice {
  theme: ThemePreset;
  setTheme: (theme: ThemePreset) => void;
  crtFilterEnabled: boolean;
  toggleCrtFilter: () => void;
  audioEnabled: boolean;
  toggleAudio: () => void;
  audioVolume: number;
  setAudioVolume: (volume: number) => void;
  globeAutoRotate: boolean;
  setGlobeAutoRotate: (enabled: boolean) => void;
  toggleGlobeAutoRotate: () => void;
  activeView: ModuleView;
  setActiveView: (view: ModuleView) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
}

export interface TotemSlice {
  totems: Record<TotemId, TotemNode>;
  selectedTotemId: TotemId;
  toggleTotem: (id: TotemId) => void;
}

export interface BioSlice {
  selectedProteinAccession: string;
  selectedProteinMeta: AlphaFoldPredictionMeta | null;
  selectedCompound: ChemicalCompound | null;
  isBioScanning: boolean;
  setSelectedProtein: (accession: string, meta?: AlphaFoldPredictionMeta) => void;
  setSelectedCompound: (compound: ChemicalCompound) => void;
  setBioScanning: (scanning: boolean) => void;
}

export type AppState = RadarSlice &
  MukaabSlice &
  TelemetrySlice &
  SettingsSlice &
  TotemSlice &
  BioSlice;
