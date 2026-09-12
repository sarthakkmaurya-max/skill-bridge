import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Link as LinkIcon, 
  FileCheck,
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { 
  uploadDocumentFile, 
  formatFileSize, 
  isPdfDocument, 
  isImageDocument,
  ALLOWED_EXTENSIONS
} from '../../lib/storage';

interface FileUploadZoneProps {
  value?: string;
  fileName?: string;
  fileSize?: string;
  onChange: (result: {
    url: string;
    fileName: string;
    fileSize: string;
    fileType?: string;
    uploadedAt?: string;
  } | null) => void;
  folder?: 'resumes' | 'certificates' | 'projects';
  userId?: string;
  label?: string;
  accept?: string;
  allowUrlInput?: boolean;
  helperText?: string;
  compact?: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  value,
  fileName,
  fileSize,
  onChange,
  folder = 'resumes',
  userId = 'demo',
  label = 'Upload Document',
  accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg',
  allowUrlInput = true,
  helperText = 'Supported formats: PDF, Word (.docx), or Images up to 10 MB',
  compact = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [manualUrl, setManualUrl] = useState(value && !value.startsWith('data:') ? value : '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setErrorMsg(null);
    setUploading(true);
    setUploadProgress(10);

    try {
      const result = await uploadDocumentFile(file, {
        folder,
        userId,
        onProgress: (pct) => setUploadProgress(pct),
      });

      onChange({
        url: result.url,
        fileName: result.fileName,
        fileSize: result.fileSize,
        fileType: result.fileType,
        uploadedAt: result.uploadedAt,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'File upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
    // reset input value so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyManualUrl = () => {
    if (!manualUrl.trim()) return;
    const inferredName = manualUrl.split('/').pop()?.split('?')[0] || `${folder}_document.pdf`;
    onChange({
      url: manualUrl.trim(),
      fileName: inferredName,
      fileSize: 'External Cloud Link',
      fileType: 'link',
      uploadedAt: new Date().toISOString(),
    });
  };

  const handleClear = () => {
    onChange(null);
    setManualUrl('');
    setErrorMsg(null);
  };

  const isPdf = isPdfDocument(value, fileName);
  const isImg = isImageDocument(value, fileName);

  return (
    <div className="space-y-2">
      {/* Label and Mode Toggle Bar */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
          <span>{label}</span>
          {value && (
            <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-medium">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Attached</span>
            </span>
          )}
        </label>

        {allowUrlInput && !value && (
          <div className="flex items-center space-x-1 text-[11px]">
            <button
              type="button"
              onClick={() => setInputMode('upload')}
              className={`px-2 py-0.5 rounded transition-colors ${
                inputMode === 'upload'
                  ? 'bg-blue-500/20 text-blue-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upload File
            </button>
            <span className="text-slate-600">|</span>
            <button
              type="button"
              onClick={() => setInputMode('url')}
              className={`px-2 py-0.5 rounded transition-colors ${
                inputMode === 'url'
                  ? 'bg-blue-500/20 text-blue-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Paste Link
            </button>
          </div>
        )}
      </div>

      {/* Error Message Toast */}
      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setErrorMsg(null)}
            className="text-red-400 hover:text-red-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Case 1: An uploaded document is already attached */}
      {value ? (
        <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-white/15 flex items-center justify-between gap-3 shadow-md hover:border-white/25 transition-all">
          <div className="flex items-center space-x-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isPdf 
                ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                : isImg
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                : 'bg-blue-500/15 border border-blue-500/30 text-blue-400'
            }`}>
              <FileText className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                  {fileName || value.split('/').pop()?.split('?')[0] || 'Uploaded Document'}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase bg-white/10 text-slate-300">
                  {isPdf ? 'PDF' : isImg ? 'IMAGE' : 'DOC'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                {fileSize && <span>{fileSize}</span>}
                <span className="text-emerald-400 flex items-center space-x-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Ready for recruiters</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold glass-panel hover:border-white/30 text-slate-200 transition-all flex items-center space-x-1"
              title="Replace this document"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Replace</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Remove document"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : inputMode === 'url' ? (
        /* Case 2: Manual URL input mode */
        <div className="space-y-2 p-3 rounded-2xl bg-navy-950/60 border border-white/10">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://drive.google.com/file/... or https://your-portfolio.com/resume.pdf"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-navy-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyManualUrl}
              disabled={!manualUrl.trim()}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white shadow-glow-blue transition-all"
            >
              Attach
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Make sure your Google Drive or cloud link is set to "Anyone with the link can view".
          </p>
        </div>
      ) : (
        /* Case 3: Drag and Drop Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-5 sm:p-6 text-center group ${
            isDragging
              ? 'border-blue-400 bg-blue-500/15 shadow-glow-blue scale-[1.01]'
              : 'border-white/15 hover:border-blue-500/40 bg-navy-950/40 hover:bg-navy-900/40'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isDragging
                ? 'bg-blue-500 text-white shadow-glow-blue scale-110'
                : 'bg-white/5 border border-white/10 text-blue-400 group-hover:scale-105 group-hover:border-blue-500/30'
            }`}>
              {uploading ? (
                <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-white">
                {uploading ? (
                  <span>Processing &amp; Uploading Document... {uploadProgress}%</span>
                ) : (
                  <>
                    <span className="text-blue-400 underline underline-offset-2">Click to browse</span> or drag and drop your file
                  </>
                )}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>
            </div>
          </div>

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};
