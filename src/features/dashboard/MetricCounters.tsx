import React from 'react';
import { useCommandStore } from '../../store/useCommandStore';
import { PHI } from '../../types';
import { Activity, Clock, Shield, Sparkles, Terminal, Dna, FlaskConical } from 'lucide-react';

export const MetricCounters: React.FC = () => {
  const { metrics } = useCommandStore();

  // Format Uptime (hh:mm:ss)
  const formatUptime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const cards = [
    {
      label: 'ACTIVE TOTEM NODES',
      value: `${metrics.activeNodes} / 7`,
      sub: 'Resonant Nodes Online',
      icon: <Sparkles className="w-5 h-5 text-[#ffd978]" />,
      color: 'text-[#ffd978]',
      border: 'border-[#dfb15b]/30',
    },
    {
      label: 'RESONANCE RATIO',
      value: `Φ = ${metrics.resonanceRatio.toFixed(6)}`,
      sub: 'Golden Ratio Harmonic',
      icon: <Activity className="w-5 h-5 text-[#00f0ff]" />,
      color: 'text-[#00f0ff]',
      border: 'border-[#00f0ff]/30',
    },
    {
      label: 'TOTAL PULSE CYCLES',
      value: `#${metrics.pulseCount}`,
      sub: 'Harmonic Sequences Emitted',
      icon: <Activity className="w-5 h-5 text-[#dfb15b]" />,
      color: 'text-[#dfb15b]',
      border: 'border-[#dfb15b]/30',
    },
    {
      label: 'SYSTEM UPTIME',
      value: formatUptime(metrics.uptimeMs),
      sub: 'Continuous Operation',
      icon: <Clock className="w-5 h-5 text-emerald-400" />,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
    },
    {
      label: 'TELEMETRY EVENTS',
      value: `${metrics.eventCount}`,
      sub: 'Logged Core Incidents',
      icon: <Terminal className="w-5 h-5 text-slate-300" />,
      color: 'text-slate-100',
      border: 'border-slate-700',
    },
    {
      label: 'BIO-DEFENSE STATUS',
      value: metrics.bioThreatLevel,
      sub: `${metrics.totalCompoundsScanned} Compounds Scanned`,
      icon: <Dna className="w-5 h-5 text-emerald-400" />,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`glass-panel rounded-xl p-3 sm:p-4 border ${c.border} shadow-lg flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider">
              {c.label}
            </span>
            {c.icon}
          </div>
          <div className="mt-2">
            <div className={`text-base sm:text-xl font-bold font-mono tracking-tight ${c.color}`}>
              {c.value}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate">
              {c.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
