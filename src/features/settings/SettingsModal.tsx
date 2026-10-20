import React from 'react';
import { useCommandStore } from '../../store/useCommandStore';
import { ThemePreset } from '../../types';
import { AudioManager } from '../../systems/AudioManager';
import { Settings, X, Volume2, Tv, Sparkles, Monitor, RotateCcw, Shield } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { 
    settingsOpen, 
    setSettingsOpen, 
    preferences, 
    setTheme, 
    setAudioEnabled, 
    setAudioVolume, 
    toggleCRT,
    resetAll 
  } = useCommandStore();

  if (!settingsOpen) return null;

  const themes: { id: ThemePreset; label: string; accent: string; desc: string }[] = [
    { id: 'sovereign-gold', label: 'SOVEREIGN GOLD', accent: 'border-[#dfb15b] text-[#ffd978]', desc: 'Sovereign command palette with warm imperial gold & obsidian' },
    { id: 'cyber-cyan', label: 'CYBER CYAN', accent: 'border-[#00f0ff] text-[#00f0ff]', desc: 'High-frequency telemetry & bioscience holographic interface' },
    { id: 'royal-crimson', label: 'ROYAL CRIMSON', accent: 'border-[#ff3366] text-rose-400', desc: 'Tactical alert and pathogen bio-containment state' },
    { id: 'night-ops', label: 'NIGHT OPS', accent: 'border-slate-500 text-slate-300', desc: 'Low-emission stealth tactical console for zero light bleed' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="w-full max-w-xl bg-[#07090e] border border-[#dfb15b]/40 rounded-xl shadow-2xl overflow-hidden glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-[#dfb15b]/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-[#dfb15b]" />
            <h2 className="font-sovereign text-base font-bold text-white tracking-wider">
              COMMAND CORE & BIOSCIENCE PREFERENCES
            </h2>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-6 font-mono text-xs max-h-[75vh] overflow-y-auto">
          {/* 1. Theme Presets */}
          <div>
            <div className="text-[11px] font-bold text-[#ffd978] mb-3 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SOVEREIGN THEME PRESET</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    preferences.theme === t.id
                      ? `${t.accent} bg-slate-900 shadow-md font-bold ring-1 ring-white/20`
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{t.label}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Audio System */}
          <div className="pt-4 border-t border-slate-800">
            <div className="text-[11px] font-bold text-[#ffd978] mb-3 flex items-center space-x-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>PROCEDURAL WEB AUDIO SYNTHESIZER</span>
            </div>

            <div className="space-y-4 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Audio Synthesizer Engine</div>
                  <div className="text-[10px] text-slate-400">Generate real-time procedural frequencies and blips</div>
                </div>
                <button
                  onClick={() => setAudioEnabled(!preferences.audioEnabled)}
                  className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                    preferences.audioEnabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {preferences.audioEnabled ? 'ENABLED' : 'MUTED'}
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Master Volume Gain:</span>
                  <span className="text-[#00f0ff] font-bold">{Math.round(preferences.audioVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={preferences.audioVolume}
                  onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                  disabled={!preferences.audioEnabled}
                  className="w-full accent-[#dfb15b] cursor-pointer disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          {/* 3. Display & CRT Simulation */}
          <div className="pt-4 border-t border-slate-800">
            <div className="text-[11px] font-bold text-[#ffd978] mb-3 flex items-center space-x-1.5">
              <Tv className="w-3.5 h-3.5" />
              <span>DISPLAY & OPTICAL SIMULATION</span>
            </div>

            <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-lg border border-slate-800">
              <div>
                <div className="font-bold text-white">CRT Phosphor Scanline Filter</div>
                <div className="text-[10px] text-slate-400">Hardware-accelerated military HUD scanline overlay</div>
              </div>
              <button
                onClick={toggleCRT}
                className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                  preferences.crtFilterActive
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {preferences.crtFilterActive ? 'ACTIVE' : 'OFF'}
              </button>
            </div>
          </div>

          {/* 4. Local Persistence Reset */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-300">Reset Local Configuration</div>
              <div className="text-[10px] text-slate-500">Purges localStorage and reloads default state</div>
            </div>
            <button
              onClick={() => {
                if (confirm('Reset all sovereign settings and restore default command matrix?')) {
                  resetAll();
                }
              }}
              className="px-3 py-1.5 rounded bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-400 font-bold transition-colors cursor-pointer flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTORE DEFAULTS</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 px-6 bg-[#05060a] border-t border-slate-800 text-[11px] font-mono text-slate-500 text-right">
          KINGDOM OF MURABBA™ ARCHITECTURAL SPECIFICATION 2026.10
        </div>
      </div>
    </div>
  );
};
