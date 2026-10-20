import React from 'react';
import { useCommandStore } from '../../store/useCommandStore';
import { MetricCounters } from './MetricCounters';
import { MukaabScene } from '../mukaab/MukaabScene';
import { WorldGlobeWidget } from './WorldGlobeWidget';
import { DriveWidget } from './DriveWidget';
import { StrategicMapWidget } from '../maps/StrategicMapWidget';
import { AudioManager } from '../../systems/AudioManager';
import { PHI } from '../../types';
import { 
  Box, 
  Radio, 
  Dna, 
  FlaskConical, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Activity,
  Layers
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { 
    setActiveView, 
    totems, 
    toggleTotem, 
    executeGlobalPulse, 
    metrics, 
    selectedProteinAccession,
    telemetryLogs 
  } = useCommandStore();

  const totemList = Object.values(totems);

  return (
    <div className="space-y-6">
      {/* 1. Sovereign Telemetry Counters Strip */}
      <MetricCounters />

      {/* 2. Main Visual Centerpiece: 3D Mukaab Scene */}
      <div className="relative">
        <MukaabScene />
      </div>

      {/* 3. Global Geospatial Telemetry: 3D World Globe Widget */}
      <div className="relative">
        <WorldGlobeWidget />
      </div>

      {/* 3. Dual Tactical Modules: Radar & Bioscience Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module A: Strategic Radar Preview Card */}
        <div className="glass-panel-cyan rounded-xl p-5 border border-[#00f0ff]/30 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#00f0ff]/20">
              <div className="flex items-center space-x-2">
                <Radio className="w-5 h-5 text-[#00f0ff] animate-pulse" />
                <div>
                  <h3 className="font-sovereign text-base font-bold text-white tracking-wider">
                    STRATEGIC RADAR & SURVEILLANCE
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400">
                    60 FPS TACTICAL TARGET DISCOVERY
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveView('STRATEGIC_RADAR')}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 border border-[#00f0ff]/40 text-[#00f0ff] font-mono text-xs cursor-pointer transition-colors"
              >
                <span>EXPAND RADAR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">TRACKED SECTOR:</span>
                <span className="text-white font-bold">AL-MURABBA 100KM RADIUS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">TARGETS LOCKED:</span>
                <span className="text-emerald-400 font-bold">5 ACTIVE BLIPS (1 BIO-ANOMALY)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">PHOSPHOR REFRESH:</span>
                <span className="text-[#00f0ff] font-bold">HARDWARE ACCELERATED (DPR 2.0)</span>
              </div>
            </div>

            <p className="mt-3 text-xs font-mono text-slate-400 leading-relaxed">
              Real-time polar sweep tracks sovereign relays, allied laboratories, and perimeter biological anomalies. Integrates azimuth bearings with elevation telemetry.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#00f0ff]/20 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500">BEARING 000° - 360° TRUE</span>
            <button
              onClick={() => setActiveView('STRATEGIC_RADAR')}
              className="text-xs font-mono font-bold text-[#00f0ff] hover:underline flex items-center space-x-1"
            >
              <span>Launch Tactical Radar Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Module B: Bioscience Division & AlphaFold Preview */}
        <div className="glass-panel rounded-xl p-5 border border-[#dfb15b]/30 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#dfb15b]/20">
              <div className="flex items-center space-x-2">
                <Dna className="w-5 h-5 text-[#ffd978] animate-pulse" />
                <div>
                  <h3 className="font-sovereign text-base font-bold text-white tracking-wider">
                    ALPHAFOLD 3D & CHEMICAL DEFENSE
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400">
                    DEEPMIND SCIENCE SKILL INTEGRATION
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveView('BIOSCIENCE_STRUCTURES')}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#dfb15b]/20 hover:bg-[#dfb15b]/30 border border-[#dfb15b]/40 text-[#ffd978] font-mono text-xs cursor-pointer transition-colors"
              >
                <span>OPEN VIEWER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ACTIVE TARGET:</span>
                <span className="text-[#ffd978] font-bold">TP53 [{selectedProteinAccession}]</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">PREDICTION ENGINE:</span>
                <span className="text-[#00f0ff] font-bold">AlphaFold DB v6 (mmCIF)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">CONFIDENCE ENCODING:</span>
                <span className="text-emerald-400 font-bold">4-Band pLDDT Scale (&gt;90 Blue)</span>
              </div>
            </div>

            <p className="mt-3 text-xs font-mono text-slate-400 leading-relaxed">
              Explore 3D macromolecular structures with 3Dmol.js WebGL rendering, residue-level pLDDT confidence coloring, and PubChem small-molecule countermeasure screening with Lipinski compliance rules.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#dfb15b]/20 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500">200M+ AFDB PROTEINS</span>
            <button
              onClick={() => setActiveView('BIOSCIENCE_STRUCTURES')}
              className="text-xs font-mono font-bold text-[#ffd978] hover:underline flex items-center space-x-1"
            >
              <span>Explore Molecular Structures</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Strategic Geolocation (Google Maps) & Sovereign Cloud Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrategicMapWidget />
        <DriveWidget />
      </div>

      {/* 5. Totemic Network Strip */}
      <div className="glass-panel rounded-xl p-5 border border-[#dfb15b]/30 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#ffd978]" />
            <h3 className="font-sovereign text-sm font-bold text-white tracking-wider">
              7 SOVEREIGN TOTEM NODES STATUS STRIP
            </h3>
          </div>
          <button
            onClick={() => setActiveView('TOTEMIC_NETWORK')}
            className="text-xs font-mono text-[#ffd978] hover:underline flex items-center space-x-1"
          >
            <span>Configure Totems</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
          {totemList.map((t) => (
            <div
              key={t.id}
              onClick={() => toggleTotem(t.id)}
              className={`p-3 rounded-lg border text-center transition-all cursor-pointer font-mono ${
                t.isActive
                  ? 'bg-[#dfb15b]/15 border-[#dfb15b] text-[#ffd978] shadow-[0_0_10px_rgba(223,177,91,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] text-slate-400 font-bold">NODE {t.id}</div>
              <div className="font-sovereign text-sm font-bold mt-0.5 truncate">{t.name}</div>
              <div className="text-[11px] text-[#00f0ff] mt-1 font-bold">{t.frequencyHz} Hz</div>
              <div className="mt-2 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase inline-block bg-slate-950/80">
                {t.isActive ? 'ONLINE' : 'OFFLINE'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
