import React, { useState, useEffect } from 'react';
import { Certification } from '@skillbridge/shared';
import { X, Award, ExternalLink } from 'lucide-react';
import { FileUploadZone } from '../common/FileUploadZone';

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cert: Partial<Certification>) => Promise<void> | void;
  initialCert?: Certification | null;
}

export const CertificationModal: React.FC<CertificationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCert,
}) => {
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialCert) {
      setTitle(initialCert.title || '');
      setIssuer(initialCert.issuer || '');
      setIssueDate(initialCert.issueDate ? initialCert.issueDate.split('T')[0] : '');
      setCredentialUrl(initialCert.credentialUrl || '');
      setFileUrl(initialCert.fileUrl || '');
      setFileName(initialCert.fileName || '');
      setFileSize(initialCert.fileSize || '');
    } else {
      setTitle('');
      setIssuer('');
      setIssueDate(new Date().toISOString().split('T')[0]);
      setCredentialUrl('');
      setFileUrl('');
      setFileName('');
      setFileSize('');
    }
    setError(null);
  }, [initialCert, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter certification title');
      return;
    }
    if (!issuer.trim()) {
      setError('Please enter certificate issuer');
      return;
    }
    if (!issueDate) {
      setError('Please select issue date');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onSave({
        id: initialCert?.id,
        title: title.trim(),
        issuer: issuer.trim(),
        issueDate,
        credentialUrl: credentialUrl.trim(),
        fileUrl: fileUrl.trim(),
        fileName: fileName.trim(),
        fileSize: fileSize.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save certificate');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl glass-card border border-white/15 p-6 sm:p-7 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {initialCert ? 'Edit Certification' : 'Add Professional Credential'}
            </h3>
            <p className="text-xs text-slate-400">
              Submit verified credentials for campus authentication.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Certificate Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AWS Certified Solutions Architect"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Issuing Organization <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. Amazon Web Services"
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Issue Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>
          </div>

          {/* Certificate File Upload Zone */}
          <FileUploadZone
            label="Upload Certificate Proof (PDF / Image)"
            folder="certificates"
            value={fileUrl}
            fileName={fileName}
            fileSize={fileSize}
            onChange={(res) => {
              if (res) {
                setFileUrl(res.url);
                setFileName(res.fileName);
                setFileSize(res.fileSize);
              } else {
                setFileUrl('');
                setFileName('');
                setFileSize('');
              }
            }}
            helperText="Upload certificate copy (.pdf, .png, .jpg) up to 10 MB for admin verification."
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Online Verification Link (Optional)</span>
            </label>
            <input
              type="url"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              placeholder="https://verify.issuer.org/cert/..."
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
            />
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-violet transition-all"
            >
              {saving ? 'Saving...' : initialCert ? 'Update Certificate' : 'Submit Credential'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
