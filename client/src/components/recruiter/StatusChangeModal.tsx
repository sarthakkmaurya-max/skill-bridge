import React, { useState, useEffect } from 'react';
import { Application, ApplicationStatus } from '@skillbridge/shared';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  UserCheck, 
  Loader2,
  Sparkles
} from 'lucide-react';

interface StatusChangeModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmStatusChange: (applicationId: string, newStatus: ApplicationStatus, recruiterNotes: string) => Promise<void> | void;
}

const STATUS_PRESETS: Record<ApplicationStatus, string[]> = {
  Applied: [
    'Application placed under preliminary batch review.',
    'Waiting for university semester transcript verification.'
  ],
  Shortlisted: [
    'Pre-screen passed with distinction. Shortlisted for technical round.',
    'Verified competency benchmark met. Portfolio forwarded to engineering lead.'
  ],
  Interview: [
    'Round 1 technical discussion scheduled with UI/Platform leads.',
    'Invited to 45-minute live pair coding evaluation.'
  ],
  Selected: [
    'Congratulations! Final decision approved for offer issuance.',
    'Selected for placement cohort. Formal offer letter generated.'
  ],
  Rejected: [
    'Review concluded. Not advancing for this specific opening. Encouraged to reapply.',
    'Competency gap in advanced frameworks. Better suited for foundational track.'
  ]
};

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  application,
  isOpen,
  onClose,
  onConfirmStatusChange,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('Shortlisted');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (application) {
      setSelectedStatus(application.status);
      setNotes(application.recruiterNotes || '');
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmStatusChange(application.id, selectedStatus, notes);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyPreset = (presetText: string) => {
    setNotes(presetText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-3xl glass-card border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25 text-[10px] font-extrabold uppercase">
            <UserCheck className="w-3 h-3 text-violet-400" />
            <span>Recruiter Candidate Decision</span>
          </div>
          <h2 className="text-xl font-black text-white">
            Update Candidate Status
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Changing status for <strong className="text-white">{application.studentName}</strong> applying for{' '}
            <span className="text-violet-300">{application.opportunity?.title || 'Role'}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white">Select New Application Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'] as ApplicationStatus[]).map((status) => {
                const isSelected = selectedStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? status === 'Selected'
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-glow-emerald'
                          : status === 'Interview'
                          ? 'bg-violet-600 text-white border-violet-400 shadow-glow-violet'
                          : status === 'Shortlisted'
                          ? 'bg-blue-600 text-white border-blue-400'
                          : status === 'Rejected'
                          ? 'bg-rose-600 text-white border-rose-400'
                          : 'bg-sky-600 text-white border-sky-400'
                        : 'bg-navy-950/60 text-slate-400 hover:text-white border-white/5'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Presets for Selected Status */}
          {STATUS_PRESETS[selectedStatus] && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Quick Preset Templates:
              </span>
              <div className="flex flex-col gap-1.5">
                {STATUS_PRESETS[selectedStatus].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-left p-2 rounded-lg bg-navy-950/40 hover:bg-white/5 border border-white/5 text-[11px] text-slate-300 transition-colors"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recruiter Note Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white flex items-center space-x-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
              <span>Private Recruiter Note / Candidate Feedback</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add feedback, interview timing, technical observations, or candidate notes..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500/50 resize-none"
            />
          </div>

          {/* Confirmation Warning Notice */}
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-200 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-violet-400" />
            <span>
              This will update the candidate's real-time journey stage in their student dashboard.
            </span>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-glow-violet transition-all flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Status Change</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
