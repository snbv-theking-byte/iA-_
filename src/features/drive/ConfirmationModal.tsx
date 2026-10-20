import React from 'react';
import { AlertTriangle, Trash2, Edit3, X, ShieldAlert } from 'lucide-react';

export type ConfirmationActionType = 'trash' | 'delete' | 'overwrite' | 'rename';

interface ConfirmationModalProps {
  isOpen: boolean;
  actionType: ConfirmationActionType;
  itemName: string;
  itemCount?: number;
  details?: string;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  actionType,
  itemName,
  itemCount = 1,
  details,
  isProcessing = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const isPermanent = actionType === 'delete';

  const title = 
    actionType === 'delete' ? 'Permanently Delete from Google Drive' :
    actionType === 'trash' ? 'Move to Google Drive Trash' :
    actionType === 'overwrite' ? 'Overwrite File on Google Drive' : 'Confirm Action';

  const actionButtonText = 
    actionType === 'delete' ? (isProcessing ? 'Deleting Permanently...' : 'Confirm Permanent Deletion') :
    actionType === 'trash' ? (isProcessing ? 'Moving to Trash...' : 'Confirm Move to Trash') :
    actionType === 'overwrite' ? (isProcessing ? 'Overwriting...' : 'Confirm Overwrite') : 
    (isProcessing ? 'Processing...' : 'Confirm');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className={`w-full max-w-lg rounded-xl border ${
          isPermanent ? 'border-rose-500/60 shadow-[0_0_30px_rgba(244,63,94,0.3)]' : 'border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
        } bg-[#0b0e14] p-6 text-slate-100 relative`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-lg ${isPermanent ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {isPermanent ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-lg font-mono text-white tracking-wide">
                {title}
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                MANDATORY SECURITY CONFIRMATION
              </span>
            </div>
          </div>
          <button 
            onClick={onCancel}
            disabled={isProcessing}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4 font-mono text-sm">
          <p className="text-slate-300">
            {isPermanent ? (
              <span className="text-rose-300 font-semibold">
                WARNING: This action is irreversible. The following file will be permanently removed from your Google Drive:
              </span>
            ) : (
              <span>
                Please confirm that you want to perform this operation on your Google Drive:
              </span>
            )}
          </p>

          <div className="p-3.5 rounded-lg bg-black/50 border border-slate-800 font-mono text-xs break-all">
            <div className="text-slate-400 mb-1 text-[10px] uppercase tracking-wider">Target Item:</div>
            <div className="font-bold text-[#ffd978]">{itemName}</div>
            {itemCount > 1 && (
              <div className="text-slate-400 mt-1">Total items affected: {itemCount}</div>
            )}
          </div>

          {details && (
            <p className="text-xs text-slate-400 leading-relaxed">
              {details}
            </p>
          )}

          <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            Notice: No modifications are performed without explicit consent in accordance with Google Workspace Security governance.
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 border-t border-slate-800 pt-4 font-mono">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-5 py-2 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
              isPermanent 
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                : 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
            }`}
          >
            {isPermanent ? <Trash2 className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{actionButtonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
