import React from 'react';
import { 
  Shield, 
  Radio, 
  Box, 
  Globe,
  MapPin,
  HardDrive,
  Dna, 
  FlaskConical, 
  Terminal, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Tv, 
  Settings, 
  Command,
  Activity
} from 'lucide-react';
import { useCommandStore } from '../../store/useCommandStore';
import { ModuleView, PHI } from '../../types';

export const HeaderNav: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    preferences, 
    setAudioEnabled, 
    toggleCRT, 
    setCommandPaletteOpen, 
    setSettingsOpen,
    executeGlobalPulse,
    metrics
  } = useCommandStore();

  const navItems: { id: ModuleView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'COMMAND_CORE', label: 'COMMAND CORE', icon: <Shield className="w-4 h-4 text-[#dfb15b]" /> },
    { id: 'MUKAAB_NEXUS', label: 'MUKAAB NEXUS', icon: <Box className="w-4 h-4 text-[#ffd978]" /> },
    { id: 'STRATEGIC_RADAR', label: 'STRATEGIC RADAR', icon: <Radio className="w-4 h-4 text-[#00f0ff]" /> },
    { id: 'WORLD_GLOBE', label: '3D GLOBE', icon: <Globe className="w-4 h-4 text-[#ffd978]" /> },
    { id: 'STRATEGIC_MAP', label: 'TACTICAL MAP', icon: <MapPin className="w-4 h-4 text-[#ffd978]" />, badge: 'GMP' },
    { id: 'SOVEREIGN_DRIVE', label: 'SOVEREIGN DRIVE', icon: <HardDrive className="w-4 h-4 text-[#ffd978]" />, badge: 'CLOUD' },
    { id: 'BIOSCIENCE_STRUCTURES', label: 'ALPHAFOLD 3D', icon: <Dna className="w-4 h-4 text-[#00f0ff]" />, badge: 'SCIENCE' },
    { id: 'CHEMICAL_DEFENSE', label: 'CHEMICAL SCOUT', icon: <FlaskConical className="w-4 h-4 text-[#ffe600]" /> },
    { id: 'TOTEMIC_NETWORK', label: 'TOTEMIC NETWORK', icon: <Sparkles className="w-4 h-4 text-[#dfb15b]" /> },
    { id: 'TELEMETRY_LOGS', label: 'TELEMETRY', icon: <Terminal className="w-4 h-4 text-[#94a3b8]" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#07090e]/90 backdrop-blur-xl border-b border-[#dfb15b]/25 shadow-2xl">
      {/* Top Telemetry Ticker */}
      <div className="bg-[#05060a] px-4 py-1 flex items-center justify-between text-xs border-b border-[#dfb15b]/10 font-mono tracking-wider text-slate-400">
        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-1 text-[#dfb15b]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#dfb15b] animate-ping" />
            <span className="font-bold">SNBV™ CORE ONLINE</span>
          </span>
          <span className="hidden sm:inline">
            RESONANCE RATIO: <span className="text-[#ffd978] font-bold">Φ = {PHI.toFixed(6)}</span>
          </span>
          <span className="hidden md:inline">
            ACTIVE NODES: <span className="text-[#00f0ff] font-bold">{metrics.activeNodes} / 7</span>
          </span>
          <span className="hidden lg:inline">
            BIO-DEFENSE: <span className="text-emerald-400 font-bold">{metrics.bioThreatLevel}</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-slate-400">
            SYSTEM STATUS: 
            <span className={`ml-1 font-bold ${
              metrics.systemStatus === 'OPTIMAL' ? 'text-emerald-400' :
              metrics.systemStatus === 'BIO_SCAN' ? 'text-[#00f0ff]' :
              metrics.systemStatus === 'DEGRADED' ? 'text-amber-400' : 'text-rose-500'
            }`}>
              [{metrics.systemStatus}]
            </span>
          </span>
          <button 
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden sm:flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Open Command Palette (Ctrl+K)"
          >
            <Command className="w-3 h-3 text-[#dfb15b]" />
            <span className="text-[10px]">CTRL+K</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Sovereign Brand */}
        <div 
          onClick={() => setActiveView('COMMAND_CORE')}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded border border-[#dfb15b] bg-[#dfb15b]/10 flex items-center justify-center relative overflow-hidden group-hover:border-[#ffd978] transition-colors shadow-[0_0_15px_rgba(223,177,91,0.25)]">
            <span className="font-sovereign text-[#ffd978] text-xl font-bold tracking-tighter">م</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#ffd978]/10 to-transparent animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-sovereign text-sm sm:text-base font-black tracking-widest text-[#ffd978] glow-gold">
                KINGDOM OF MURABBA™
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#dfb15b]/20 text-[#ffd978] font-mono border border-[#dfb15b]/40">
                SNBV™
              </span>
            </div>
            <div className="text-[10px] tracking-widest text-slate-400 font-mono flex items-center space-x-2">
              <span>COMMAND CORE</span>
              <span>//</span>
              <span className="text-[#00f0ff]">BIOSCIENCE DIVISION</span>
            </div>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Global Resonance Pulse Button */}
          <button
            onClick={executeGlobalPulse}
            className="relative px-3 py-1.5 rounded border border-[#dfb15b] bg-gradient-to-r from-[#dfb15b]/20 to-[#ffd978]/20 hover:from-[#dfb15b]/30 hover:to-[#ffd978]/30 text-[#ffd978] font-bold text-xs font-mono tracking-wider transition-all duration-200 shadow-[0_0_12px_rgba(223,177,91,0.25)] hover:shadow-[0_0_20px_rgba(223,177,91,0.5)] cursor-pointer active:scale-95 flex items-center space-x-1.5"
            title="Execute Global Resonance Pulse across Totemic Network"
          >
            <Activity className="w-3.5 h-3.5 text-[#ffd978] animate-pulse" />
            <span className="hidden sm:inline">GLOBAL PULSE</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={() => setAudioEnabled(!preferences.audioEnabled)}
            className={`p-2 rounded border transition-colors cursor-pointer ${
              preferences.audioEnabled 
                ? 'border-[#dfb15b]/50 bg-[#dfb15b]/15 text-[#ffd978]' 
                : 'border-slate-800 bg-slate-900/80 text-slate-500'
            }`}
            title={preferences.audioEnabled ? 'Mute Procedural Synthesizer' : 'Enable Procedural Synthesizer'}
          >
            {preferences.audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* CRT Scanline Toggle */}
          <button
            onClick={toggleCRT}
            className={`p-2 rounded border transition-colors cursor-pointer ${
              preferences.crtFilterActive 
                ? 'border-[#00f0ff]/50 bg-[#00f0ff]/15 text-[#00f0ff]' 
                : 'border-slate-800 bg-slate-900/80 text-slate-500'
            }`}
            title="Toggle CRT Scanline HUD Simulation"
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Settings Modal Toggle */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Open Console Preferences"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto pb-1 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center space-x-2 px-3 py-2 text-xs font-mono tracking-wider rounded-t transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-b-2 border-[#dfb15b] bg-[#dfb15b]/10 text-[#ffd978] font-bold shadow-[inset_0_-2px_0_0_#dfb15b]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
