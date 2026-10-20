import React from 'react';
import { Globe, ArrowRight, Compass, Radio, Shield, Zap } from 'lucide-react';
import WorldGlobe from '../world/WorldGlobe';
import { useCommandStore } from '../../store/useCommandStore';
import { useAppStore } from '../../store/useAppStore';
import { WORLD_NODES } from '../world/worldUtils';
import { eventBus } from '../../systems/eventBus';

export const WorldGlobeWidget: React.FC = () => {
  const { setActiveView } = useCommandStore();
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);

  const selectedNode = WORLD_NODES.find((n) => n.id === selectedNodeId) ?? WORLD_NODES[0];

  const handleFocusNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    eventBus.emit("world:node:selected", {
      id: nodeId,
      source: "dashboardWidget",
      timestamp: Date.now(),
    });
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-[#dfb15b]/30 shadow-2xl flex flex-col justify-between relative overflow-hidden">
      {/* Decorative cyber grid accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#dfb15b]/10 to-transparent pointer-events-none" />

      <div>
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-3 border-b border-[#dfb15b]/20">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-[#dfb15b]/15 border border-[#dfb15b]/30 text-[#ffd978]">
              <Globe className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-sovereign text-base font-bold text-white tracking-wider">
                  GLOBAL SPATIAL TELEMETRY (3D GLOBE)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#dfb15b]/20 text-[#ffd978] border border-[#dfb15b]/30">
                  THREE.JS WEBGL
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                REAL-TIME GEODESIC SPHERE &bull; CARTESIAN MAPPING
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveView('WORLD_GLOBE')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#dfb15b]/20 hover:bg-[#dfb15b]/30 border border-[#dfb15b]/40 text-[#ffd978] font-mono text-xs cursor-pointer transition-colors"
            >
              <span>FULLSCREEN ORBIT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tactical Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-1">
            <div className="text-slate-400 text-[10px] flex items-center space-x-1">
              <Compass className="w-3 h-3 text-[#00f0ff]" />
              <span>LOCKED COORDINATES</span>
            </div>
            <div className="text-[#00f0ff] font-bold truncate">
              {selectedNode.latitude.toFixed(4)}° N, {selectedNode.longitude.toFixed(4)}° E
            </div>
            <div className="text-[10px] text-slate-500">{selectedNode.name}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-1">
            <div className="text-slate-400 text-[10px] flex items-center space-x-1">
              <Radio className="w-3 h-3 text-[#ffd978]" />
              <span>ACTIVE ARCS</span>
            </div>
            <div className="text-[#ffd978] font-bold">
              3 VECTOR TRAJECTORIES
            </div>
            <div className="text-[10px] text-slate-500">RIYADH &harr; CAIRO &bull; LON &bull; VAT</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-1">
            <div className="text-slate-400 text-[10px] flex items-center space-x-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>SOVEREIGN CLASSIFICATION</span>
            </div>
            <div className="text-emerald-400 font-bold truncate">
              {selectedNode.classification}
            </div>
            <div className="text-[10px] text-slate-500">{selectedNode.status.toUpperCase()} STATUS</div>
          </div>
        </div>

        {/* Live 3D Globe Interactive Canvas */}
        <div className="w-full h-[400px] rounded-lg overflow-hidden border border-slate-800/80 bg-slate-950/90 relative">
          <WorldGlobe />
        </div>

        {/* Node Target Quick Selector Strip */}
        <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Zap className="w-3.5 h-3.5 text-[#ffd978]" />
            <span>QUICK FOCUS:</span>
            {WORLD_NODES.map((n) => (
              <button
                key={n.id}
                onClick={() => handleFocusNode(n.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                  n.id === selectedNode.id
                    ? 'bg-[#dfb15b] text-slate-950 font-bold shadow-[0_0_8px_rgba(223,177,91,0.5)]'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                {n.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <span className="text-[10px] font-mono text-slate-500">
            RADAR-LINKED SYNCHRONIZATION ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
};
