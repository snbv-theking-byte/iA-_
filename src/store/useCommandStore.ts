/**
 * KINGDOM OF MURABBA™ | SNBV™ COMMAND CORE & BIOSCIENCE STORE
 * Compatibility Bridge to Unified Modular useAppStore
 */

import { useAppStore } from './useAppStore';
import type { 
  TotemId, 
  ModuleView, 
  AlphaFoldPredictionMeta, 
  ChemicalCompound, 
  UserPreferences,
  TelemetryEvent as LegacyTelemetryEvent
} from '../types';

export const useCommandStore = () => {
  const store = useAppStore();

  const preferences: UserPreferences = {
    theme: store.theme,
    audioEnabled: store.audioEnabled,
    audioVolume: store.audioVolume,
    crtFilterActive: store.crtFilterEnabled,
    reducedMotion: false,
    highDpiRadar: true,
    radarSweepSpeed: store.radarSweepSpeed,
  };

  // Bridge legacy log format to new TelemetryEvent
  const legacyLogs: LegacyTelemetryEvent[] = store.logs.map((l) => ({
    id: l.id,
    timestamp: Date.now(),
    severity: l.level === 'critical' ? 'CRITICAL' : 
              l.level === 'warning' ? 'WARN' : 
              l.level === 'sovereign' ? 'SOVEREIGN' : 
              l.category === 'BIO' ? 'BIO' : 'INFO',
    source: l.category,
    message: l.message,
  }));

  return {
    // Navigation & UI
    activeView: store.activeView,
    setActiveView: store.setActiveView,
    commandPaletteOpen: store.commandPaletteOpen,
    setCommandPaletteOpen: store.setCommandPaletteOpen,
    settingsOpen: store.settingsOpen,
    setSettingsOpen: store.setSettingsOpen,
    globeAutoRotate: store.globeAutoRotate,
    setGlobeAutoRotate: store.setGlobeAutoRotate,
    toggleGlobeAutoRotate: store.toggleGlobeAutoRotate,

    // Mukaab & Pulse
    coreStatus: store.coreStatus,
    setCoreStatus: store.setCoreStatus,
    wireframeMode: store.wireframeMode,
    toggleWireframe: store.toggleWireframe,
    executeGlobalPulse: store.executeGlobalPulse,

    // Metrics & Logs
    metrics: store.metrics,
    telemetryLogs: legacyLogs,
    appendLog: (entry: { severity: string; source: string; message: string }) => {
      const category = entry.source.includes('BIO') ? 'BIO' : 
                       entry.source.includes('RADAR') ? 'RADAR' : 
                       entry.source.includes('MUKAAB') ? 'MUKAAB' : 'SYSTEM';
      const level = entry.severity === 'SOVEREIGN' ? 'sovereign' :
                    entry.severity === 'CRITICAL' ? 'critical' :
                    entry.severity === 'WARN' ? 'warning' : 'info';
      store.addLog(category, entry.message, level);
    },
    clearLogs: store.clearLogs,
    tickUptime: store.tickUptime,

    // Radar & Nodes
    selectedRadarTargetId: store.selectedNode?.id || null,
    setSelectedRadarTarget: (id: string | null) => {
      const found = store.radarNodes.find((n) => n.id === id) || null;
      store.setSelectedNode(found);
    },
    radarTargets: store.radarNodes.map((n) => ({
      id: n.id,
      bearingDeg: Math.round(n.x * 360),
      distancePct: Math.hypot(n.x - 0.5, n.y - 0.5) * 2,
      label: n.name,
      classification: (n.classification.includes('AlphaFold') || n.status === 'critical') ? 'BIO_ENTITY' :
                      n.id === 'murabba-prime' ? 'SOVEREIGN' : 'ALLIED',
      elevationAngle: 12,
      signalStrength: 95,
      notes: n.description || '',
    })),
    setRadarSweepSpeed: store.setRadarSweepSpeed,

    // Totemic Network
    totems: store.totems,
    selectedTotemId: store.selectedTotemId,
    toggleTotem: store.toggleTotem,

    // Bioscience
    selectedProteinAccession: store.selectedProteinAccession,
    selectedProteinMeta: store.selectedProteinMeta,
    selectedCompound: store.selectedCompound,
    isBioScanning: store.isBioScanning,
    setSelectedProtein: store.setSelectedProtein,
    setSelectedCompound: store.setSelectedCompound,
    setBioScanning: store.setBioScanning,

    // Preferences & Settings
    preferences,
    setTheme: store.setTheme,
    toggleCRT: store.toggleCrtFilter,
    setAudioEnabled: (enabled: boolean) => {
      if (store.audioEnabled !== enabled) {
        store.toggleAudio();
      }
    },
    setAudioVolume: store.setAudioVolume,
    resetAll: () => {
      localStorage.removeItem('snbv-command-core-storage');
      window.location.reload();
    },
  };
};

// Also attach getState for non-React contexts
(useCommandStore as any).getState = () => {
  const store = useAppStore.getState();
  return {
    preferences: {
      theme: store.theme,
      audioEnabled: store.audioEnabled,
      audioVolume: store.audioVolume,
      crtFilterActive: store.crtFilterEnabled,
      reducedMotion: false,
      highDpiRadar: true,
      radarSweepSpeed: store.radarSweepSpeed,
    },
    selectedNode: store.selectedNode,
    metrics: store.metrics,
  };
};

export { useAppStore };
