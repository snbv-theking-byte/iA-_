import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Folder, 
  FolderPlus, 
  FileText, 
  Upload, 
  RefreshCw, 
  Search, 
  Trash2, 
  ExternalLink, 
  HardDrive, 
  ShieldCheck, 
  FileSpreadsheet, 
  FileCode, 
  File, 
  LogOut, 
  Eye, 
  Plus, 
  Layers, 
  Sparkles,
  Database,
  ChevronRight,
  FolderOpen,
  AlertCircle,
  FileDown
} from 'lucide-react';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken,
  setCachedAccessToken 
} from '../../services/googleAuth';
import { 
  listFiles, 
  createFolder, 
  uploadFile, 
  uploadJsonData, 
  trashFile, 
  permanentlyDeleteFile,
  renameFile,
  getDriveAbout,
  type DriveFile, 
  type DriveAboutInfo 
} from '../../services/googleDriveService';
import { ConfirmationModal, type ConfirmationActionType } from './ConfirmationModal';
import { FilePreviewModal } from './FilePreviewModal';
import { useAppStore } from '../../store/useAppStore';
import { useCommandStore } from '../../store/useCommandStore';
import type { User } from 'firebase/auth';

interface BreadcrumbItem {
  id: string;
  name: string;
}

export const SovereignDrive: React.FC = () => {
  const store = useAppStore();
  const commandStore = useCommandStore();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Drive state
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [aboutInfo, setAboutInfo] = useState<DriveAboutInfo | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: 'root', name: 'My Drive' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Modals & Actions
  const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Destructive Confirmation Modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmTargetFile, setConfirmTargetFile] = useState<DriveFile | null>(null);
  const [confirmActionType, setConfirmActionType] = useState<ConfirmationActionType>('trash');
  const [isProcessingDestructive, setIsProcessingDestructive] = useState(false);

  // Rename prompt
  const [renamingFile, setRenamingFile] = useState<DriveFile | null>(null);
  const [renameInputValue, setRenameInputValue] = useState('');

  // Show status notification banner
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setStatusNotification({ message, type });
    setTimeout(() => {
      setStatusNotification((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  }, []);

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setAuthError(null);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch Drive Files when token or currentFolder changes
  const fetchDriveContents = useCallback(async () => {
    if (!token) return;

    setIsLoadingFiles(true);
    try {
      const result = await listFiles(token, {
        folderId: currentFolderId,
        searchQuery: searchQuery.trim() || undefined
      });
      setFiles(result.files || []);

      // Also fetch Drive Quota
      try {
        const about = await getDriveAbout(token);
        setAboutInfo(about);
      } catch (aboutErr) {
        console.warn('Could not retrieve Drive about info:', aboutErr);
      }
    } catch (err: any) {
      console.error('Error fetching drive files:', err);
      showToast(err.message || 'Failed to load Google Drive contents', 'error');
    } finally {
      setIsLoadingFiles(false);
    }
  }, [token, currentFolderId, searchQuery, showToast]);

  useEffect(() => {
    if (token) {
      fetchDriveContents();
    }
  }, [token, fetchDriveContents]);

  // Handle Google Sign-in
  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        showToast(`Connected as ${result.user.displayName || result.user.email}`, 'success');
        store.addLog("SYSTEM", `Google Drive successfully authenticated for [${result.user.email}]`, "sovereign");
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setAuthError(err.message || 'Authentication with Google failed. Please verify credentials.');
      showToast('Sign-in failed', 'error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle Sign-out
  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setFiles([]);
      setAboutInfo(null);
      showToast('Signed out of Google Drive', 'info');
      store.addLog("SYSTEM", "Signed out of Google Workspace session.", "info");
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // Folder navigation
  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setSearchQuery('');
    setBreadcrumbs((prev) => [...prev, { id: folderId, name: folderName }]);
  };

  const navigateBreadcrumb = (index: number) => {
    const target = breadcrumbs[index];
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    setCurrentFolderId(target.id);
    setSearchQuery('');
  };

  // Create new folder
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      const created = await createFolder(token, newFolderName.trim(), currentFolderId);
      showToast(`Created folder "${created.name}"`, 'success');
      store.addLog("SYSTEM", `Created Google Drive folder: [${created.name}]`, "info");
      setNewFolderName('');
      setNewFolderOpen(false);
      fetchDriveContents();
    } catch (err: any) {
      console.error('Failed to create folder:', err);
      showToast(err.message || 'Folder creation failed', 'error');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Upload local file from device
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!token || !selected) return;

    showToast(`Uploading ${selected.name}...`, 'info');
    try {
      await uploadFile(
        token, 
        selected, 
        selected.name, 
        selected.type || 'application/octet-stream', 
        currentFolderId
      );
      showToast(`Uploaded "${selected.name}" to Google Drive`, 'success');
      store.addLog("SYSTEM", `Uploaded file to Google Drive: [${selected.name}]`, "info");
      fetchDriveContents();
    } catch (err: any) {
      console.error('Upload failed:', err);
      showToast(err.message || 'File upload failed', 'error');
    } finally {
      event.target.value = '';
    }
  };

  // Export Live Sovereign Mission Report to Drive
  const handleExportMissionReport = async () => {
    if (!token) return;

    showToast('Compiling sovereign intelligence report...', 'info');

    const reportTimestamp = new Date().toISOString();
    const filename = `SNBV_SOVEREIGN_INTEL_REPORT_${Date.now()}.json`;

    const reportPayload = {
      title: "KINGDOM OF MURABBA™ | SNBV™ SOVEREIGN MISSION TELEMETRY",
      classification: "SOVEREIGN HIGH-INTELLIGENCE // RESTRICTED",
      generatedAt: reportTimestamp,
      systemMetrics: store.metrics,
      mukaabCore: {
        status: store.coreStatus,
        wireframeMode: store.wireframeMode,
        pulseCount: store.pulseCount
      },
      radarTelemetry: {
        totalNodes: store.radarNodes.length,
        selectedNode: store.selectedNode,
        isPaused: store.isRadarPaused,
        sweepSpeed: store.radarSweepSpeed
      },
      totemicNetwork: {
        activeTotems: Object.values(store.totems).filter(t => t.isActive).map(t => ({
          id: t.id,
          name: t.name,
          designation: t.designation,
          pulseIntensity: t.pulseIntensity
        }))
      },
      bioscienceDivision: {
        selectedProteinAccession: store.selectedProteinAccession,
        selectedProteinMeta: store.selectedProteinMeta,
        selectedCompound: store.selectedCompound
      },
      recentTelemetryLogs: store.logs.slice(-25)
    };

    try {
      const uploaded = await uploadJsonData(token, filename, reportPayload, currentFolderId);
      showToast(`Exported Mission Report: "${uploaded.name}"`, 'success');
      store.addLog("SECURITY", `Archived Sovereign Mission Report to Google Drive: [${uploaded.name}]`, "sovereign");
      fetchDriveContents();
    } catch (err: any) {
      console.error('Export report failed:', err);
      showToast(err.message || 'Failed to export mission report', 'error');
    }
  };

  // Request Confirmation for Destructive Action
  const handlePromptTrash = (file: DriveFile) => {
    setConfirmTargetFile(file);
    setConfirmActionType('trash');
    setConfirmModalOpen(true);
  };

  const handlePromptPermanentDelete = (file: DriveFile) => {
    setConfirmTargetFile(file);
    setConfirmActionType('delete');
    setConfirmModalOpen(true);
  };

  // Execute Destructive Action after User Confirmation
  const handleExecuteConfirmedAction = async () => {
    if (!token || !confirmTargetFile) return;

    setIsProcessingDestructive(true);
    try {
      if (confirmActionType === 'trash') {
        await trashFile(token, confirmTargetFile.id);
        showToast(`Moved "${confirmTargetFile.name}" to Google Drive Trash`, 'info');
        store.addLog("SYSTEM", `Moved file to Google Drive Trash: [${confirmTargetFile.name}]`, "warning");
      } else if (confirmActionType === 'delete') {
        await permanentlyDeleteFile(token, confirmTargetFile.id);
        showToast(`Permanently deleted "${confirmTargetFile.name}"`, 'info');
        store.addLog("SECURITY", `Permanently removed file from Google Drive: [${confirmTargetFile.name}]`, "critical");
      }

      setConfirmModalOpen(false);
      setConfirmTargetFile(null);
      if (previewFile?.id === confirmTargetFile.id) {
        setPreviewFile(null);
      }
      fetchDriveContents();
    } catch (err: any) {
      console.error('Destructive action failed:', err);
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setIsProcessingDestructive(false);
    }
  };

  // Rename File handler
  const handleExecuteRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !renamingFile || !renameInputValue.trim()) return;

    try {
      const updated = await renameFile(token, renamingFile.id, renameInputValue.trim());
      showToast(`Renamed to "${updated.name}"`, 'success');
      setRenamingFile(null);
      setRenameInputValue('');
      fetchDriveContents();
    } catch (err: any) {
      showToast(err.message || 'Rename failed', 'error');
    }
  };

  // Filtered files
  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      if (filterType === 'all') return true;
      if (filterType === 'folders') return f.mimeType === 'application/vnd.google-apps.folder';
      if (filterType === 'docs') return f.mimeType.includes('document') || f.mimeType.includes('text');
      if (filterType === 'sheets') return f.mimeType.includes('spreadsheet') || f.mimeType.includes('csv');
      if (filterType === 'reports') return f.name.includes('SOVEREIGN') || f.name.includes('REPORT') || f.mimeType.includes('json');
      return true;
    });
  }, [files, filterType]);

  // Compute storage percentage
  const storagePercentage = useMemo(() => {
    if (!aboutInfo?.storageQuota?.limit || !aboutInfo?.storageQuota?.usage) return null;
    const limit = parseInt(aboutInfo.storageQuota.limit, 10);
    const usage = parseInt(aboutInfo.storageQuota.usage, 10);
    if (!limit || isNaN(limit) || isNaN(usage)) return null;
    return Math.min(100, Math.round((usage / limit) * 100));
  }, [aboutInfo]);

  // File Icon Helper
  const getFileIcon = (file: DriveFile) => {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-5 h-5 text-[#ffd978]" />;
    }
    if (file.mimeType.includes('spreadsheet') || file.mimeType.includes('csv')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    }
    if (file.mimeType.includes('json') || file.mimeType.includes('code') || file.name.endsWith('.json')) {
      return <FileCode className="w-5 h-5 text-[#00f0ff]" />;
    }
    if (file.mimeType.includes('document') || file.mimeType.includes('pdf') || file.mimeType.includes('text')) {
      return <FileText className="w-5 h-5 text-sky-400" />;
    }
    return <File className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 font-mono text-slate-200">
      {/* Toast Banner */}
      {statusNotification && (
        <div 
          className={`px-4 py-2.5 rounded-lg border text-xs flex items-center justify-between shadow-lg animate-fadeIn ${
            statusNotification.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200' :
            statusNotification.type === 'error' ? 'bg-rose-950/80 border-rose-500/50 text-rose-200' :
            'bg-[#0d1522] border-[#dfb15b]/40 text-[#ffd978]'
          }`}
        >
          <span>{statusNotification.message}</span>
          <button 
            onClick={() => setStatusNotification(null)}
            className="text-xs opacity-75 hover:opacity-100 ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-[#0b0e14]/90 border border-[#dfb15b]/30 rounded-xl p-5 shadow-[0_0_30px_rgba(223,177,91,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-[#dfb15b]/10 border border-[#dfb15b] flex items-center justify-center text-[#ffd978] shadow-[0_0_15px_rgba(223,177,91,0.25)]">
            <HardDrive className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold font-sovereign text-[#ffd978] tracking-wider">
                SOVEREIGN DRIVE VAULT
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 font-bold">
                GOOGLE WORKSPACE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure Cloud Telemetry, Archival Intelligence & Sovereign Asset Repository
            </p>
          </div>
        </div>

        {/* User Auth Status / Action */}
        {user ? (
          <div className="flex items-center space-x-4 bg-black/40 border border-slate-800 p-2.5 rounded-lg">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'Google User'} 
                className="w-9 h-9 rounded-full border border-[#dfb15b]/60" 
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#dfb15b]/20 border border-[#dfb15b]/40 flex items-center justify-center text-[#ffd978] font-bold text-sm">
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="text-left text-xs">
              <div className="font-bold text-slate-100 truncate max-w-[180px]">
                {user.displayName || 'Authenticated Officer'}
              </div>
              <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                {user.email}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 border border-slate-700 transition-colors cursor-pointer"
              title="Sign Out of Google Drive"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-right">
            <span className="text-xs text-amber-400 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
              <span>Authentication required</span>
            </span>
          </div>
        )}
      </div>

      {/* Main Drive View */}
      {!user ? (
        /* Sign-In Presentation Card (Google Standard UI) */
        <div className="bg-[#0b0e14]/90 border border-[#dfb15b]/30 rounded-xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#dfb15b]/10 border border-[#dfb15b]/40 flex items-center justify-center text-[#ffd978] shadow-[0_0_25px_rgba(223,177,91,0.25)]">
            <Database className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold font-sovereign text-[#ffd978]">
              Connect Sovereign Google Drive
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              Authenticate with Google Workspace to securely browse, archive, and synchronize mission telemetry, AlphaFold structural predictions, and tactical logs directly to Google Drive, with explicit permission from your account.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-black/40 border border-slate-800 text-left text-xs space-y-2 text-slate-400">
            <div className="text-[#ffd978] font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Enabled Sovereign Capabilities</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Direct file and directory tree exploration inside Google Drive</li>
              <li>One-click Sovereign Mission Intelligence snapshot archive (.JSON)</li>
              <li>Encrypted telemetry upload and local intelligence synchronization</li>
              <li>Safe file inspection, download, and mandatory confirmation before any deletions</li>
            </ul>
          </div>

          {authError && (
            <div className="p-3 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              {authError}
            </div>
          )}

          {/* Official Google Material Sign-In Button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="group relative inline-flex items-center justify-center space-x-3 px-6 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all shadow-[0_4px_16px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)] cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {/* Google G SVG */}
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>{isAuthenticating ? 'Connecting to Google...' : 'Sign in with Google'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Authenticated File Explorer */
        <div className="space-y-4">
          {/* Storage Bar & Actions Toolbar */}
          <div className="bg-[#0b0e14]/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Storage Quota Bar */}
            <div className="flex-1 max-w-sm">
              <div className="flex justify-between items-center text-xs mb-1.5 text-slate-400">
                <span className="flex items-center space-x-1">
                  <HardDrive className="w-3.5 h-3.5 text-[#dfb15b]" />
                  <span>Google Drive Quota</span>
                </span>
                <span className="text-slate-200 font-bold">
                  {storagePercentage !== null ? `${storagePercentage}% Used` : 'Standard'}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    (storagePercentage || 0) > 85 ? 'bg-rose-500' : 'bg-gradient-to-r from-[#dfb15b] to-[#00f0ff]'
                  }`}
                  style={{ width: `${storagePercentage || 10}%` }}
                />
              </div>
            </div>

            {/* Tactical Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* New Folder */}
              <button
                onClick={() => setNewFolderOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5 text-[#ffd978]" />
                <span>New Folder</span>
              </button>

              {/* Upload Local File */}
              <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold tracking-wider transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>Upload File</span>
                <input 
                  type="file" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>

              {/* Export Live Sovereign Mission Report */}
              <button
                onClick={handleExportMissionReport}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#dfb15b] bg-[#dfb15b]/15 hover:bg-[#dfb15b]/25 text-[#ffd978] text-xs font-bold tracking-wider transition-all shadow-[0_0_12px_rgba(223,177,91,0.2)] cursor-pointer"
                title="Export current SNBV Mission Telemetry & Bioscience snapshot directly to Drive"
              >
                <FileDown className="w-3.5 h-3.5 text-[#ffd978]" />
                <span>Export Intel Report</span>
              </button>

              {/* Refresh */}
              <button
                onClick={fetchDriveContents}
                disabled={isLoadingFiles}
                className="p-2 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                title="Refresh Google Drive files"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin text-[#dfb15b]' : ''}`} />
              </button>
            </div>
          </div>

          {/* New Folder Inline Form Modal */}
          {newFolderOpen && (
            <div className="bg-[#0f141d] border border-[#dfb15b]/40 rounded-xl p-4 animate-fadeIn">
              <form onSubmit={handleCreateFolder} className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full flex items-center space-x-2">
                  <FolderPlus className="w-5 h-5 text-[#ffd978]" />
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name (e.g. Murabba Telemetry Archive)..."
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-[#dfb15b]"
                    autoFocus
                  />
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => { setNewFolderOpen(false); setNewFolderName(''); }}
                    className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingFolder || !newFolderName.trim()}
                    className="px-4 py-2 rounded-lg bg-[#dfb15b] hover:bg-[#ffd978] text-slate-950 font-bold text-xs cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingFolder ? 'Creating...' : 'Create Folder'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Inline Rename Form */}
          {renamingFile && (
            <div className="bg-[#0f141d] border border-amber-500/40 rounded-xl p-4 animate-fadeIn">
              <form onSubmit={handleExecuteRename} className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full flex items-center space-x-2">
                  <span className="text-xs text-amber-400 font-bold">RENAME:</span>
                  <input
                    type="text"
                    value={renameInputValue}
                    onChange={(e) => setRenameInputValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setRenamingFile(null)}
                    className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!renameInputValue.trim()}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer disabled:opacity-50"
                  >
                    Save Name
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search, Filter & Breadcrumbs Navigation */}
          <div className="bg-[#0b0e14]/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Breadcrumb Trail */}
              <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-mono pb-1 scrollbar-none">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={crumb.id}>
                    {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />}
                    <button
                      onClick={() => navigateBreadcrumb(idx)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors whitespace-nowrap ${
                        idx === breadcrumbs.length - 1
                          ? 'bg-[#dfb15b]/15 text-[#ffd978] font-bold border border-[#dfb15b]/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      {idx === 0 ? <HardDrive className="w-3 h-3 mr-1" /> : <Folder className="w-3 h-3 mr-1" />}
                      <span>{crumb.name}</span>
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files in Drive..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-slate-200 text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-[#dfb15b]"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80 text-xs overflow-x-auto">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Filter:</span>
              {[
                { id: 'all', label: 'All Files' },
                { id: 'folders', label: 'Folders' },
                { id: 'reports', label: 'Intel Reports & JSON' },
                { id: 'docs', label: 'Documents' },
                { id: 'sheets', label: 'Spreadsheets' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setFilterType(pill.id)}
                  className={`px-2.5 py-0.5 rounded text-[11px] transition-colors whitespace-nowrap cursor-pointer ${
                    filterType === pill.id
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 font-bold'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Files Table / Grid */}
          <div className="bg-[#0b0e14]/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {isLoadingFiles ? (
              <div className="p-16 flex flex-col items-center justify-center space-y-3 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin text-[#dfb15b]" />
                <span className="text-xs">Synchronizing with Google Drive v3...</span>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="p-16 text-center space-y-3 text-slate-500">
                <FolderOpen className="w-12 h-12 mx-auto text-slate-700" />
                <p className="text-sm text-slate-400">No files found in this folder</p>
                <p className="text-xs text-slate-600">
                  {searchQuery ? 'Try clearing your search query' : 'Upload files or export a Sovereign Mission Report to populate your drive.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0f141d] border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Name</th>
                      <th className="py-3 px-4 font-semibold hidden sm:table-cell">Type</th>
                      <th className="py-3 px-4 font-semibold hidden md:table-cell">Size</th>
                      <th className="py-3 px-4 font-semibold hidden lg:table-cell">Modified</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredFiles.map((file) => {
                      const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                      const formattedSize = file.size 
                        ? `${(parseInt(file.size, 10) / 1024).toFixed(1)} KB`
                        : isFolder ? '--' : 'Doc';

                      return (
                        <tr 
                          key={file.id} 
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          {/* Name Column */}
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-1.5 rounded bg-black/40 border border-slate-800 group-hover:border-slate-700">
                                {getFileIcon(file)}
                              </div>
                              <div className="truncate max-w-[220px] sm:max-w-xs md:max-w-md">
                                {isFolder ? (
                                  <button
                                    onClick={() => navigateToFolder(file.id, file.name)}
                                    className="font-bold text-slate-100 hover:text-[#ffd978] transition-colors truncate block text-left cursor-pointer"
                                    title={file.name}
                                  >
                                    {file.name}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setPreviewFile(file)}
                                    className="text-slate-200 hover:text-[#00f0ff] transition-colors truncate block text-left cursor-pointer"
                                    title={file.name}
                                  >
                                    {file.name}
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* MIME Type */}
                          <td className="py-3 px-4 text-slate-400 hidden sm:table-cell truncate max-w-[120px]">
                            {isFolder ? 'Folder' : file.mimeType.split('.').pop()?.split('/').pop()}
                          </td>

                          {/* Size */}
                          <td className="py-3 px-4 text-slate-400 hidden md:table-cell">
                            {formattedSize}
                          </td>

                          {/* Modified Date */}
                          <td className="py-3 px-4 text-slate-400 hidden lg:table-cell">
                            {new Date(file.modifiedTime).toLocaleDateString()}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              {/* Open / Preview */}
                              {!isFolder ? (
                                <button
                                  onClick={() => setPreviewFile(file)}
                                  className="p-1.5 rounded hover:bg-slate-700/80 text-slate-400 hover:text-[#00f0ff] transition-colors cursor-pointer"
                                  title="Inspect / Preview File"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => navigateToFolder(file.id, file.name)}
                                  className="p-1.5 rounded hover:bg-slate-700/80 text-slate-400 hover:text-[#ffd978] transition-colors cursor-pointer"
                                  title="Open Folder"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Open External Web Link */}
                              {file.webViewLink && (
                                <a
                                  href={file.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors"
                                  title="Open in Google Drive Web"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {/* Rename */}
                              <button
                                onClick={() => {
                                  setRenamingFile(file);
                                  setRenameInputValue(file.name);
                                }}
                                className="p-1.5 rounded hover:bg-slate-700/80 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                                title="Rename File"
                              >
                                <span className="text-[10px] font-bold">REN</span>
                              </button>

                              {/* Trash (Prompts Mandatory Confirmation) */}
                              <button
                                onClick={() => handlePromptTrash(file)}
                                className="p-1.5 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Move to Trash (Requires Confirmation)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Preview Drawer / Modal */}
      <FilePreviewModal
        file={previewFile}
        token={token}
        onClose={() => setPreviewFile(null)}
        onRequestTrash={(file) => handlePromptTrash(file)}
      />

      {/* Mandatory User Confirmation Modal for Destructive Operations */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        actionType={confirmActionType}
        itemName={confirmTargetFile?.name || 'Selected Item'}
        details={
          confirmActionType === 'trash'
            ? 'The file will be moved to your Google Drive Trash folder and can be restored later.'
            : 'The file will be permanently expunged from Google Drive and cannot be recovered.'
        }
        isProcessing={isProcessingDestructive}
        onConfirm={handleExecuteConfirmedAction}
        onCancel={() => {
          setConfirmModalOpen(false);
          setConfirmTargetFile(null);
        }}
      />
    </div>
  );
};
