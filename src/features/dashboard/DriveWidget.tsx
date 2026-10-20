import React, { useState, useEffect } from 'react';
import { HardDrive, Cloud, ArrowRight, ShieldCheck, Database, FileDown, CheckCircle2 } from 'lucide-react';
import { useCommandStore } from '../../store/useCommandStore';
import { useAppStore } from '../../store/useAppStore';
import { initAuth, getAccessToken } from '../../services/googleAuth';
import { uploadJsonData, getDriveAbout, type DriveAboutInfo } from '../../services/googleDriveService';
import type { User } from 'firebase/auth';

export const DriveWidget: React.FC = () => {
  const { setActiveView } = useCommandStore();
  const store = useAppStore();

  const [user, setUser] = useState<User | null>(null);
  const [aboutInfo, setAboutInfo] = useState<DriveAboutInfo | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [lastExportStatus, setLastExportStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsub = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        getDriveAbout(token)
          .then(setAboutInfo)
          .catch(() => {});
      },
      () => {
        setUser(null);
        setAboutInfo(null);
      }
    );
    return () => unsub();
  }, []);

  const handleQuickExport = async () => {
    const token = await getAccessToken();
    if (!token) {
      setActiveView('SOVEREIGN_DRIVE');
      return;
    }

    setIsExporting(true);
    try {
      const filename = `MURABBA_CORE_TELEMETRY_${Date.now()}.json`;
      const payload = {
        title: "MURABBA COMMAND CORE TELEMETRY SNAPSHOT",
        timestamp: new Date().toISOString(),
        metrics: store.metrics,
        coreStatus: store.coreStatus,
        activeRadarNode: store.selectedNode,
        totalLogs: store.logs.length
      };

      await uploadJsonData(token, filename, payload);
      setLastExportStatus(`Archived ${filename.slice(0, 20)}...`);
      store.addLog("SYSTEM", `Quick telemetry snapshot archived to Google Drive.`, "sovereign");
      setTimeout(() => setLastExportStatus(null), 4000);
    } catch (err: any) {
      console.error(err);
      setLastExportStatus('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-[#0b0e14]/90 border border-[#dfb15b]/25 rounded-xl p-5 shadow-[0_0_25px_rgba(223,177,91,0.12)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#dfb15b]/5 rounded-full blur-2xl group-hover:bg-[#dfb15b]/10 transition-colors pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-[#dfb15b]/10 border border-[#dfb15b]/40 text-[#ffd978]">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold font-sovereign text-sm text-[#ffd978] tracking-wider">
              GOOGLE DRIVE VAULT
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              SOVEREIGN CLOUD ARCHIVAL & TELEMETRY
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
          user 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          {user ? 'CONNECTED' : 'OFFLINE'}
        </span>
      </div>

      {/* Content */}
      <div className="py-4 space-y-3 font-mono text-xs">
        {user ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 text-[11px]">Authenticated Account:</span>
              <span className="font-bold text-[#ffd978] truncate max-w-[180px]">{user.email}</span>
            </div>
            {aboutInfo?.storageQuota?.limit && aboutInfo?.storageQuota?.usage && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Storage Used:</span>
                  <span>
                    {(parseInt(aboutInfo.storageQuota.usage, 10) / (1024 * 1024 * 1024)).toFixed(1)} GB / 
                    {(parseInt(aboutInfo.storageQuota.limit, 10) / (1024 * 1024 * 1024)).toFixed(0)} GB
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-[#dfb15b] h-full rounded-full" 
                    style={{ 
                      width: `${Math.min(100, Math.round((parseInt(aboutInfo.storageQuota.usage, 10) / parseInt(aboutInfo.storageQuota.limit, 10)) * 100))}%` 
                    }} 
                  />
                </div>
              </div>
            )}
            {lastExportStatus && (
              <div className="flex items-center space-x-1.5 text-emerald-400 text-[11px] bg-emerald-950/40 p-1.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lastExportStatus}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Link your Google Workspace Drive to archive mission-critical telemetry, AlphaFold structural predictions, and sovereign intelligence reports.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 font-mono">
        {user && (
          <button
            onClick={handleQuickExport}
            disabled={isExporting}
            className="flex items-center space-x-1 px-3 py-1.5 rounded bg-[#dfb15b]/15 hover:bg-[#dfb15b]/25 text-[#ffd978] border border-[#dfb15b]/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Archiving...' : 'Quick Sync'}</span>
          </button>
        )}
        <button
          onClick={() => setActiveView('SOVEREIGN_DRIVE')}
          className="flex items-center space-x-1.5 ml-auto px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
        >
          <span>{user ? 'Open Drive Vault' : 'Connect Drive'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#dfb15b]" />
        </button>
      </div>
    </div>
  );
};
