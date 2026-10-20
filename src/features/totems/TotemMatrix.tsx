import React from 'react';
import { useCommandStore } from '../../store/useCommandStore';
import { TotemId } from '../../types';
import { AudioManager } from '../../systems/AudioManager';
import { Sparkles, Radio, Power, Volume2, ShieldAlert } from 'lucide-react';

export const TotemMatrix: React.FC = () => {
  const { totems, toggleTotem, selectedTotemId } = useCommandStore();

  const totemList = Object.values(totems);

  const handleAudition = (e: React.MouseEvent, freq: number) => {
    e.stopPropagation();
    AudioManager.playTotemTone(freq);
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="glass-panel rounded-xl p-5 border border-[#dfb15b]/30 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#ffd978] animate-pulse" />
            <h2 className="font-sovereign text-lg font-bold text-[#ffd978] tracking-wider">
              TOTEMIC RESONANCE NETWORK (NODES A - G)
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-300 mt-1 max-w-2xl leading-relaxed">
            The 7 sovereign totemic nodes align spatial architecture with biomolecular harmonics. Each node broadcasts a distinct procedural Solfeggio frequency to maintain systemic coherence and cellular homeostasis.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-[#dfb15b]/30">
            <span className="text-slate-400">ACTIVE RESONANCE:</span>{' '}
            <strong className="text-emerald-400">
              {totemList.filter(t => t.isActive).length} / 7 NODES
            </strong>
          </div>
        </div>
      </div>

      {/* 7 Totem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {totemList.map((totem) => {
          const isSelected = selectedTotemId === totem.id;
          return (
            <div
              key={totem.id}
              onClick={() => toggleTotem(totem.id as TotemId)}
              className={`relative glass-panel rounded-xl p-5 border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
                totem.isActive
                  ? 'border-[#dfb15b] shadow-[0_0_20px_rgba(223,177,91,0.2)] bg-[#dfb15b]/10'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 opacity-75 hover:opacity-100'
              } ${isSelected ? 'ring-2 ring-[#ffd978]' : ''}`}
            >
              {/* Top Node Indicator & Arabic Glyph */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${
                      totem.isActive ? 'bg-[#ffd978] animate-ping' : 'bg-slate-700'
                    }`} />
                    <span className="font-mono font-bold text-xs text-slate-400">
                      NODE {totem.id}
                    </span>
                  </div>

                  <span className="font-sovereign text-xl font-bold text-[#ffd978]">
                    {totem.arabicName}
                  </span>
                </div>

                {/* Name & Designation */}
                <div className="mt-3">
                  <h3 className="font-sovereign text-base font-bold text-white group-hover:text-[#ffd978] transition-colors">
                    {totem.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5 leading-snug">
                    {totem.designation}
                  </div>
                </div>

                {/* Frequency & Bio Resonance */}
                <div className="mt-4 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 font-mono text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">HARMONIC TONE:</span>
                    <span className="text-[#00f0ff] font-bold">{totem.frequencyHz} Hz</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">BIO-BAND:</span>
                    <span className="text-emerald-400 text-[10px] text-right truncate ml-2">
                      {totem.bioResonanceBand}
                    </span>
                  </div>
                </div>

                {/* Symbolic Attribute */}
                <div className="mt-3 text-[11px] font-mono text-slate-300 italic">
                  &ldquo;{totem.symbolicAttribute}&rdquo;
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
                {/* Audio Audition Button */}
                <button
                  type="button"
                  onClick={(e) => handleAudition(e, totem.frequencyHz)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 flex items-center space-x-1 transition-colors cursor-pointer"
                  title="Audition Procedural Tone"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>AUDITION</span>
                </button>

                {/* Activation Switch Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTotem(totem.id as TotemId);
                  }}
                  className={`px-3 py-1 rounded font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    totem.isActive
                      ? 'bg-[#dfb15b]/30 text-[#ffd978] border border-[#dfb15b]'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{totem.isActive ? 'ONLINE' : 'OFFLINE'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
