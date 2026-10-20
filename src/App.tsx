/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KINGDOM OF MURABBA™ | SNBV™ COMMAND CORE & BIOSCIENCE DIVISION
 * Master Component Wrapper & Unified Command Center Architecture
 */

import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { useCommandStore } from './store/useCommandStore';
import { HeaderNav } from './features/dashboard/HeaderNav';
import { DashboardOverview } from './features/dashboard/DashboardOverview';
import { MukaabScene } from './features/mukaab/MukaabScene';
import StrategicRadar from './features/radar/StrategicRadar';
import { ProteinStructureViewer } from './features/science/ProteinStructureViewer';
import { ChemicalDefenseScout } from './features/science/ChemicalDefenseScout';
import { TotemMatrix } from './features/totems/TotemMatrix';
import { TelemetryTerminal } from './features/telemetry/TelemetryTerminal';
import { CommandPalette } from './features/commandPalette/CommandPalette';
import { SettingsModal } from './features/settings/SettingsModal';
import { CRTOverlay } from './features/settings/CRTOverlay';
import { useThemeSync } from './features/settings/useThemeSync';
import { useAudioSync } from './features/audio/useAudioSync';
import { NotificationCenter } from './features/hud';
import { WorldGlobe } from './features/world';
import { SovereignDrive } from './features/drive';
import { TacticalMap } from './features/maps';
import { PHI } from './types';

export default function App() {
  // Activate event-driven audio synchronization across store and telemetry
  useAudioSync();

  // Activate dynamic theme CSS custom properties synchronization on document root
  useThemeSync();

  const activeView = useAppStore((state) => state.activeView);
  const theme = useAppStore((state) => state.theme);
  const tickUptime = useAppStore((state) => state.tickUptime);

  // Uptime tick loop (every 1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      tickUptime(1000);
    }, 1000);
    return () => clearInterval(timer);
  }, [tickUptime]);

  // Render Active Sub-Module View
  const renderView = () => {
    switch (activeView) {
      case 'COMMAND_CORE':
        return <DashboardOverview />;
      case 'MUKAAB_NEXUS':
        return <MukaabScene />;
      case 'STRATEGIC_RADAR':
        return <StrategicRadar />;
      case 'WORLD_GLOBE':
        return (
          <div className="h-[calc(100vh-140px)] w-full p-2">
            <WorldGlobe />
          </div>
        );
      case 'STRATEGIC_MAP':
        return (
          <div className="h-[calc(100vh-140px)] w-full">
            <TacticalMap />
          </div>
        );
      case 'SOVEREIGN_DRIVE':
        return <SovereignDrive />;
      case 'BIOSCIENCE_STRUCTURES':
        return <ProteinStructureViewer />;
      case 'CHEMICAL_DEFENSE':
        return <ChemicalDefenseScout />;
      case 'TOTEMIC_NETWORK':
        return <TotemMatrix />;
      case 'TELEMETRY_LOGS':
        return <TelemetryTerminal />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div 
      className={`min-h-screen flex flex-col relative transition-colors duration-300 theme-${theme}`}
      style={{
        backgroundColor: "var(--bg-primary, #07090e)",
        color: "var(--text-primary, #f0f6fc)"
      }}
    >
      {/* Hardware-accelerated CRT scanline and flicker simulation */}
      <CRTOverlay />

      {/* Sovereign Header Navigation */}
      <HeaderNav />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderView()}
      </main>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Global Settings Modal */}
      <SettingsModal />

      {/* Global Event-Driven HUD Notification Center */}
      <NotificationCenter />

      {/* Sovereign Footer */}
      <footer className="border-t border-slate-900/80 bg-[#05060a] py-4 text-center font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>KINGDOM OF MURABBA™ • SNBV™ COMMAND CORE & BIOSCIENCE DIVISION</span>
          <span className="text-[#dfb15b] font-bold">Φ = {PHI.toFixed(6)} • ALPHA FOLD DB v6 • PUBCHEM PUG REST</span>
          <span>SOVEREIGN ARCHITECTURAL MONUMENT 2026</span>
        </div>
      </footer>
    </div>
  );
}
