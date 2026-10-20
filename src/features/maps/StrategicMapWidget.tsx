import React from 'react';
import { MapPin, Navigation, Compass, Globe, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { STRATEGIC_MAP_NODES } from './maps.constants';
import { AudioManager } from '../../systems/AudioManager';

export const StrategicMapWidget: React.FC = () => {
  const setActiveView = useAppStore((s) => s.setActiveView);
  const addLog = useAppStore((s) => s.addLog);

  const handleOpenMap = (nodeId?: string) => {
    setActiveView('STRATEGIC_MAP');
    AudioManager.playKeyClick();
    if (nodeId) {
      addLog('RADAR', `Switched to Strategic Google Map focused on node: ${nodeId}`, 'info');
    }
  };

  return (
    <div className="relative glass-panel rounded-xl p-5 border border-[#dfb15b]/30 shadow-xl overflow-hidden flex flex-col justify-between">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#dfb15b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#dfb15b]/20">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#dfb15b]/10 border border-[#dfb15b]/30">
            <MapPin className="w-4 h-4 text-[#ffd978]" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider text-[#ffd978] uppercase">
              Google Maps // Geo-Strategic Theater
            </h3>
            <p className="text-[10px] font-mono text-gray-400">
              Photogrammetric Satellite & Vector Tracking Network
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenMap()}
          className="px-2.5 py-1 text-[11px] font-mono font-bold text-black bg-[#ffd978] hover:bg-[#dfb15b] rounded transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
        >
          <span>FULL MAP</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Core Node Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
        {STRATEGIC_MAP_NODES.slice(0, 4).map((node) => (
          <div
            key={node.id}
            onClick={() => handleOpenMap(node.id)}
            className="p-2.5 rounded-lg bg-black/40 border border-gray-800/80 hover:border-[#dfb15b]/50 cursor-pointer transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-between mb-1">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: node.color }} 
              />
              <span className="text-[9px] font-mono text-gray-500 group-hover:text-[#ffd978]">
                {node.codeName}
              </span>
            </div>
            <div className="text-[11px] font-bold text-gray-200 truncate group-hover:text-[#ffd978]">
              {node.name.replace('SOVEREIGN', '').trim()}
            </div>
            <div className="text-[9px] font-mono text-gray-400 mt-1">
              {node.latitude.toFixed(2)}°N, {node.longitude.toFixed(2)}°E
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info & Quick Jump */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-800/80 text-[10px] font-mono text-gray-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" /> 7 Strategic Anchors
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <Zap className="w-3 h-3" /> 6 Geodesic Arcs
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveView('WORLD_GLOBE');
              AudioManager.playKeyClick();
            }}
            className="text-[10px] font-mono text-gray-400 hover:text-[#ffd978] flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3 h-3" /> 3D Globe View
          </button>
        </div>
      </div>
    </div>
  );
};
