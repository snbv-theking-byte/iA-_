import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Download, 
  FileText, 
  Trash2, 
  Calendar, 
  HardDrive, 
  Info,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import type { DriveFile } from '../../services/googleDriveService';
import { downloadFileContent } from '../../services/googleDriveService';

interface FilePreviewModalProps {
  file: DriveFile | null;
  token: string | null;
  onClose: () => void;
  onRequestTrash: (file: DriveFile) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  token,
  onClose,
  onRequestTrash
}) => {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!file || !token) {
      setContent(null);
      return;
    }

    // Only load preview content for text/code/json/doc files
    const isTextReadable = 
      file.mimeType.startsWith('text/') ||
      file.mimeType.includes('json') ||
      file.mimeType.includes('javascript') ||
      file.mimeType.includes('typescript') ||
      file.mimeType.includes('document') ||
      file.mimeType.includes('markdown');

    if (isTextReadable) {
      setIsLoading(true);
      setError(null);
      downloadFileContent(token, file)
        .then((text) => {
          setContent(text);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('File preview is not available directly or format is binary.');
          setIsLoading(false);
        });
    } else {
      setContent(null);
      setIsLoading(false);
    }
  }, [file, token]);

  if (!file) return null;

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedSize = file.size 
    ? `${(parseInt(file.size, 10) / (1024 * 1024)).toFixed(2)} MB (${parseInt(file.size, 10).toLocaleString()} bytes)`
    : 'Unknown / Virtual Doc';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl rounded-xl border border-[#dfb15b]/40 bg-[#07090e] shadow-[0_0_40px_rgba(223,177,91,0.2)] flex flex-col max-h-[88vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#0d1117]">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2 rounded bg-[#dfb15b]/10 text-[#ffd978] border border-[#dfb15b]/30">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="font-bold font-mono text-sm sm:text-base text-white truncate" title={file.name}>
                {file.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono truncate">
                {file.mimeType}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {file.webViewLink && (
              <a
                href={file.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[#00f0ff] hover:text-white transition-colors"
                title="Open in Google Drive"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* File Metadata Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-black/40 border-b border-slate-800/80 text-xs font-mono">
          <div className="flex items-center space-x-2 text-slate-400">
            <HardDrive className="w-4 h-4 text-[#ffd978]" />
            <div className="truncate">
              <div className="text-[10px] text-slate-500">SIZE</div>
              <div className="text-slate-200 truncate">{formattedSize}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Calendar className="w-4 h-4 text-[#00f0ff]" />
            <div className="truncate">
              <div className="text-[10px] text-slate-500">MODIFIED</div>
              <div className="text-slate-200 truncate">{new Date(file.modifiedTime).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Info className="w-4 h-4 text-emerald-400" />
            <div className="truncate">
              <div className="text-[10px] text-slate-500">FILE ID</div>
              <div className="text-slate-200 truncate" title={file.id}>{file.id.slice(0, 8)}...</div>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => onRequestTrash(file)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs transition-colors cursor-pointer"
              title="Delete or Move to Trash"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Trash</span>
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs bg-[#05070a]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#dfb15b]" />
              <span>Loading encrypted drive stream...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded border border-slate-800 bg-slate-900/50 text-slate-400 text-center">
              <p>{error}</p>
              {file.webViewLink && (
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center space-x-1 text-[#00f0ff] hover:underline"
                >
                  <span>Open directly in Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              )}
            </div>
          ) : content !== null ? (
            <div className="relative">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>DOCUMENT PREVIEW</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>
              <pre className="p-3 bg-black/70 rounded-lg border border-slate-800/80 text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[45vh]">
                {content}
              </pre>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              <p className="mb-3">Binary or media asset. Use Google Drive web viewer to inspect.</p>
              {file.webViewLink && (
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded bg-[#dfb15b]/20 hover:bg-[#dfb15b]/30 text-[#ffd978] border border-[#dfb15b]/40 font-mono text-xs font-semibold"
                >
                  <span>Launch Google Drive Viewer</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#0d1117] flex justify-between items-center text-xs font-mono text-slate-400">
          <span>Google Drive v3 API Verified</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
