import React from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  Maximize2,
  AlertCircle
} from 'lucide-react';
import { downloadDocument, isPdfDocument, isImageDocument } from '../../lib/storage';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl?: string;
  documentName?: string;
  documentSize?: string;
  uploadedAt?: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentUrl,
  documentName = 'Candidate_Resume.pdf',
  documentSize,
  uploadedAt,
}) => {
  if (!isOpen || !documentUrl) return null;

  const isPdf = isPdfDocument(documentUrl, documentName);
  const isImg = isImageDocument(documentUrl, documentName);

  const handleDownload = () => {
    downloadDocument(documentUrl, documentName);
  };

  const handleOpenExternal = () => {
    window.open(documentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl h-[88vh] flex flex-col rounded-3xl glass-card border border-white/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-navy-900/60 flex-shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {documentName}
                </h3>
                <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Document</span>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                {documentSize && <span>{documentSize}</span>}
                {uploadedAt && <span>• Uploaded {new Date(uploadedAt).toLocaleDateString()}</span>}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-semibold shadow-glow-blue flex items-center space-x-1.5 transition-all"
              title="Download file to computer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={handleOpenExternal}
              className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white transition-colors"
              title="Open in new window"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Viewer Canvas */}
        <div className="relative z-10 flex-1 w-full bg-navy-950/90 overflow-hidden flex items-center justify-center p-2 sm:p-4">
          {isPdf ? (
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-inner flex flex-col">
              <iframe
                src={`${documentUrl}#toolbar=1&navpanes=0`}
                title={documentName}
                className="w-full h-full rounded-2xl"
              />
              <noscript>
                <div className="p-4 text-center text-xs text-slate-400">
                  JavaScript is required to preview PDF. Please use the Download button.
                </div>
              </noscript>
            </div>
          ) : isImg ? (
            <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
              <img
                src={documentUrl}
                alt={documentName}
                className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
              />
            </div>
          ) : (
            <div className="p-8 max-w-md text-center space-y-4 glass-card rounded-2xl border border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{documentName}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  This document type is best viewed in your native desktop application.
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold shadow-glow-blue flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download &amp; Open Document</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="relative z-10 px-5 py-2.5 bg-navy-900/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 flex-shrink-0">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SkillBridge Document Vault • Tamper-evident secure storage</span>
          </span>
          <button
            onClick={handleDownload}
            className="text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
          >
            <span>Save copy</span>
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
