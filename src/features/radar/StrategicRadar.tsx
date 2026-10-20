import React, { useEffect, useRef, useState } from "react";
import { RADAR_NODES } from "./radar.constants";
import { RadarEngine } from "./RadarCanvas";
import { RadarTooltip } from "./RadarTooltip";
import type { RadarNode, HoveredNodeInfo } from "./radar.types";
import { useAppStore } from "../../store/useAppStore";
import { AudioManager } from "../../systems/AudioManager";
import { Radio, Crosshair, Pause, Play, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";
import styles from "./radar.module.css";

interface StrategicRadarProps {
  onNodeSelect?: (node: RadarNode) => void;
}

export default function StrategicRadar({ onNodeSelect }: StrategicRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RadarEngine | null>(null);

  const selectedNode = useAppStore((state) => state.selectedNode);
  const setSelectedNode = useAppStore((state) => state.setSelectedNode);

  const [hoverInfo, setHoverInfo] = useState<HoveredNodeInfo | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new RadarEngine(
      canvasRef.current,
      RADAR_NODES,
      (info) => setHoverInfo(info),
      (node) => {
        setSelectedNode(node);
        if (onNodeSelect) onNodeSelect(node);
      }
    );

    engine.setSelectedNodeId(selectedNode?.id || null);
    engine.start();
    engineRef.current = engine;

    return () => {
      engine.stop();
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setSelectedNodeId(selectedNode?.id || null);
    }
  }, [selectedNode]);

  const togglePause = () => {
    const next = !isPaused;
    setIsPaused(next);
    if (engineRef.current) {
      engineRef.current.setPaused(next);
    }
  };

  const toggleSpeed = () => {
    const nextSpeed = speedMultiplier === 1 ? 2 : speedMultiplier === 2 ? 0.5 : 1;
    setSpeedMultiplier(nextSpeed);
    if (engineRef.current) {
      engineRef.current.setSweepSpeed(0.015 * nextSpeed);
    }
  };

  const handleQuickSelect = (node: RadarNode) => {
    setSelectedNode(node);
    if (onNodeSelect) onNodeSelect(node);
  };

  return (
    <div className="space-y-6">
      {/* Main Radar Widget Wrapper */}
      <div className={styles.radarWrapper}>
        {/* Top Telemetry Header */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <span className={styles.phiSymbol}>Φ</span>
            <div className="flex items-center space-x-2">
              <span className={styles.title}>SOVEREIGN RADAR TELEMETRY V2</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#dfb15b]/20 text-[#ffd978] border border-[#dfb15b]/40 font-mono">
                HiDPI 60 FPS
              </span>
            </div>
          </div>

          <div className={styles.headerControls}>
            {selectedNode && (
              <div className={styles.activeSelection}>
                LOCKED: <span style={{ color: selectedNode.color, fontWeight: 'bold' }}>{selectedNode.name}</span>
              </div>
            )}

            <button
              onClick={togglePause}
              className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isPaused ? "Resume Sweep" : "Pause Sweep"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <button
              onClick={toggleSpeed}
              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-[#00f0ff] text-[10px] font-mono cursor-pointer transition-colors"
              title="Toggle Sweep Speed"
            >
              {speedMultiplier}X
            </button>
          </div>
        </div>

        {/* Main Radar Canvas & Tooltip Container */}
        <div className={styles.canvasContainer}>
          <canvas ref={canvasRef} className={styles.canvas} />
          <RadarTooltip info={hoverInfo} />
        </div>

        {/* Footer System Telemetry Overlay */}
        <div className={styles.footer}>
          <span>SWEEP: {(0.015 * speedMultiplier).toFixed(3)} RAD/F</span>
          <span>GRID: GOLDEN RATIO Φ = 1.618034</span>
          <span>ACTIVE CONTACTS: {RADAR_NODES.length}</span>
        </div>
      </div>

      {/* Target Inspector & Sovereign Node Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Locked Node Detailed Intel */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-5 border border-[#dfb15b]/30 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#dfb15b]/20 font-mono">
              <div className="flex items-center space-x-2">
                <Crosshair className="w-4 h-4 text-[#ffd978]" />
                <span className="font-sovereign text-sm font-bold text-[#ffd978]">
                  TARGET TELEMETRY DOSSIER
                </span>
              </div>
              {selectedNode && (
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                  selectedNode.threatLevel === 'ALPHA' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                  selectedNode.threatLevel === 'BRAVO' ? 'bg-[#dfb15b]/20 text-[#ffd978] border-[#dfb15b]/40' :
                  selectedNode.threatLevel === 'CHARLIE' ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/40' :
                  'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}>
                  THREAT: {selectedNode.threatLevel}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="mt-4 space-y-4 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">DESIGNATION</div>
                  <div className="text-base font-bold text-white mt-0.5 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: selectedNode.color }} />
                    <span>{selectedNode.name}</span>
                  </div>
                  <div className="text-[11px] text-[#00f0ff] mt-0.5">
                    CLASS: {selectedNode.classification}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-400">COORDINATES</div>
                    <div className="text-xs font-bold text-slate-200 mt-0.5 truncate">{selectedNode.coordinates}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">STATUS</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5 uppercase">{selectedNode.status}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">NORMALIZED GRID</div>
                    <div className="text-xs font-bold text-slate-300 mt-0.5">X:{selectedNode.x} Y:{selectedNode.y}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">BEARING RES</div>
                    <div className="text-xs font-bold text-[#ffd978] mt-0.5">LOCKED</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 mb-1">STRATEGIC ASSESSMENT</div>
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-[#dfb15b]/20 text-slate-300 text-xs leading-relaxed">
                    {selectedNode.description || "Telemetry beacon operating under nominal parameters."}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs font-mono text-slate-500">
                Click a radar blip to lock target telemetry.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>SOVEREIGN COMMAND GRID</span>
            <span className="text-[#dfb15b]">SNBV™ RADAR CORE</span>
          </div>
        </div>

        {/* Right Column: Node Matrix Selection Table */}
        <div className="lg:col-span-7 glass-panel rounded-xl p-5 border border-[#dfb15b]/30 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#dfb15b]/20 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-[#00f0ff]" />
                <span className="font-sovereign text-sm font-bold text-white">
                  ALL MONITORED RADAR CONTACTS ({RADAR_NODES.length})
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                CLICK TO LOCK AZIMUTH
              </span>
            </div>

            <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1 font-mono text-xs">
              {RADAR_NODES.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => handleQuickSelect(node)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#dfb15b]/20 border-[#dfb15b] shadow-md'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ background: node.color, boxShadow: `0 0 8px ${node.color}` }}
                      />
                      <div>
                        <div className="font-bold text-white flex items-center space-x-2">
                          <span>{node.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">[{node.classification}]</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{node.coordinates}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        node.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        node.status === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {node.status}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {node.threatLevel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>HIGH-DPI SUBPIXEL COLLISION DETECTION</span>
            <span className="text-[#00f0ff]">60 FPS ENGINE LOOP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-export for convenience
export { StrategicRadar };
