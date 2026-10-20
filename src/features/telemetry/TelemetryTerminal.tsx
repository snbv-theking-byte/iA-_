import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AudioManager } from '../../systems/AudioManager';
import { 
  Terminal, 
  Download, 
  Trash2, 
  Search, 
  ArrowDownCircle, 
  Filter, 
  ShieldCheck, 
  Dna,
  Command,
  Keyboard
} from 'lucide-react';
import type { TelemetryEvent } from '../../store/store.types';

export const TelemetryTerminal: React.FC = () => {
  const logs = useAppStore((state) => state.logs);
  const clearLogs = useAppStore((state) => state.clearLogs);
  const addLog = useAppStore((state) => state.addLog);

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to top on new prepended log if enabled
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll]);

  // Global Keyboard Shortcuts (Ctrl+L / Cmd+L to clear, '/' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+L or Cmd+L to clear logs
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        AudioManager.playKeyClick();
        clearLogs();
        addLog("SYSTEM", "Terminal logs cleared via [Ctrl+L]", "info");
      }

      // '/' to focus search input (if not already focused on an input)
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearLogs, addLog]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSeverity = 
        filterSeverity === 'ALL' || 
        log.level.toUpperCase() === filterSeverity.toUpperCase() ||
        (filterSeverity === 'SOVEREIGN' && log.level === 'sovereign') ||
        (filterSeverity === 'BIO' && log.category === 'BIO');

      const matchQuery = 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchSeverity && matchQuery;
    });
  }, [logs, filterSeverity, searchQuery]);

  // Export logs to TXT file with safe delayed URL.revokeObjectURL
  const handleExportTxt = () => {
    AudioManager.playKeyClick();
    const content = logs.map(l => 
      `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.category}] (${l.id}) ${l.message}`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KINGDOM_OF_MURABBA_TELEMETRY_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Safely delay revoking object URL to avoid race conditions across browsers
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const getSeverityBadge = (level: TelemetryEvent['level'], category: TelemetryEvent['category']) => {
    if (level === 'sovereign') return 'bg-[#dfb15b]/20 text-[#ffd978] border-[#dfb15b]/40';
    if (level === 'critical') return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    if (level === 'warning') return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    if (category === 'BIO') return 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/40';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 shadow-2xl flex flex-col h-[640px]">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-[#dfb15b]" />
          <div>
            <h2 className="font-sovereign text-base font-bold text-white tracking-wider">
              SOVEREIGN TELEMETRY & AUDIT TERMINAL
            </h2>
            <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-2">
              <span>REAL-TIME KERNEL & BIOSCIENCE EVENT LOGGING</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{logs.length} BUFFERED</span>
            </div>
          </div>
        </div>

        {/* Action Buttons & Shortcut Badges */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-3 py-1.5 rounded border transition-colors cursor-pointer flex items-center space-x-1 ${
              autoScroll ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span>AUTO-SCROLL: {autoScroll ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleExportTxt}
            className="px-3 py-1.5 rounded border border-[#dfb15b]/50 bg-[#dfb15b]/15 text-[#ffd978] hover:bg-[#dfb15b]/25 transition-colors cursor-pointer flex items-center space-x-1"
            title="Export complete telemetry audit trail to TXT"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT TXT</span>
          </button>

          <button
            onClick={() => {
              AudioManager.playKeyClick();
              clearLogs();
            }}
            className="px-3 py-1.5 rounded border border-rose-500/40 bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 transition-colors cursor-pointer flex items-center space-x-1"
            title="Clear in-memory event buffer (Ctrl+L)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono ml-1">
              ^L
            </span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar with '/' Shortcut */}
      <div className="py-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs border-b border-slate-800/80">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {['ALL', 'SOVEREIGN', 'BIO', 'WARNING', 'CRITICAL', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                filterSeverity.toUpperCase() === sev
                  ? 'bg-[#dfb15b]/25 text-[#ffd978] border border-[#dfb15b] font-bold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs... (Press '/' to focus)"
            className="w-full bg-[#05070c] border border-slate-800 rounded pl-8 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#dfb15b] focus:ring-1 focus:ring-[#dfb15b] transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 bg-slate-900 px-1 py-0.2 rounded border border-slate-800 pointer-events-none">
            /
          </kbd>
        </div>
      </div>

      {/* Event Logs Stream */}
      <div
        ref={logContainerRef}
        className="flex-1 overflow-y-auto mt-2 space-y-2 pr-1 font-mono text-xs scrollbar-thin"
      >
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded bg-[#05070c]/90 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start sm:items-center space-x-2.5">
                <span className="text-slate-500 text-[10px] whitespace-nowrap mt-0.5 sm:mt-0 font-mono">
                  [{log.timestamp}]
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border font-bold uppercase whitespace-nowrap ${getSeverityBadge(log.level, log.category)}`}>
                  {log.level}
                </span>
                <span className="text-[#00f0ff] font-bold whitespace-nowrap text-[11px]">
                  [{log.category}]
                </span>
                <span className="text-slate-200 text-xs">
                  {log.message}
                </span>
              </div>

              <span className="text-[10px] text-slate-600 font-mono shrink-0 self-end sm:self-auto">
                {log.id}
              </span>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs">
            No telemetry records match the current filter criteria.
          </div>
        )}
      </div>

      {/* Terminal Footer with Shortcut Cheat Sheet */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500">
        <div className="flex items-center space-x-4">
          <span><kbd className="bg-slate-900 px-1 rounded text-slate-400">Ctrl+L</kbd> Clear Logs</span>
          <span><kbd className="bg-slate-900 px-1 rounded text-slate-400">/</kbd> Quick Search</span>
          <span><kbd className="bg-slate-900 px-1 rounded text-slate-400">Ctrl+K</kbd> Command Palette</span>
        </div>
        <span className="text-[#dfb15b]/80">SNBV™ TELEMETRY PROTOCOL V2</span>
      </div>
    </div>
  );
};
