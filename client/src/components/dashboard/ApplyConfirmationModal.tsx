import React, { useState } from 'react';
import { Opportunity, OpportunityMatchResult, formatOpportunityType } from '@skillbridge/shared';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  MapPin, 
  DollarSign, 
  Send, 
  Loader2, 
  ShieldCheck,
  FileText
} from 'lucide-react';

interface ApplyConfirmationModalProps {
  opportunity: Opportunity | null;
  matchResult: OpportunityMatchResult | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmApply: (opportunity: Opportunity, message: string) => Promise<void> | void;
  isAlreadyApplied?: boolean;
}

export const ApplyConfirmationModal: React.FC<ApplyConfirmationModalProps> = ({
  opportunity,
  matchResult,
  isOpen,
  onClose,
  onConfirmApply,
  isAlreadyApplied = false,
}) => {
  const [message, setMessage] = useState(
    'I am excited to apply for this role and look forward to demonstrating my competencies.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !opportunity) return null;

  const matchScore = matchResult?.matchPercentage || 85;
  const matchedSkills = matchResult?.matchedSkills || opportunity.requiredSkills.slice(0, 3);
  const missingSkills = matchResult?.missingSkills || opportunity.requiredSkills.slice(3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAlreadyApplied || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onConfirmApply(opportunity, message);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl glass-card border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corner glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pr-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25 text-[10px] font-extrabold uppercase">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Direct Campus Application</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Confirm Your Application
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Review your verified competency alignment score before sending your verified portfolio to the recruiter.
          </p>
        </div>

        {/* Opportunity Card Summary */}
        <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/10 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white">{opportunity.title}</h3>
              <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-violet-400" />
                <span>{opportunity.company}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {formatOpportunityType(opportunity.type)}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {opportunity.workMode || 'Hybrid'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 border-t border-white/5">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{opportunity.location}</span>
            </span>
            <span className="flex items-center space-x-1 text-emerald-300 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>{opportunity.stipendOrSalary}</span>
            </span>
          </div>
        </div>

        {/* Competency Alignment Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/70 to-violet-950/70 border border-blue-500/30 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Your Current Skill Match</span>
            </span>
            <span className="text-lg font-black gradient-text">{matchScore}% Match</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${matchScore}%` }}
            />
          </div>

          {/* Matched vs Missing Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-white/10">
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Matched Skills ({matchedSkills.length})</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {matchedSkills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[10px] font-semibold"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-amber-400 flex items-center space-x-1 mb-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Skills to Strengthen ({missingSkills.length})</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {missingSkills.length > 0 ? (
                  missingSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[10px] font-semibold"
                    >
                      △ {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-400 italic">None! All requirements met.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Short Statement / Note */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Candidate Note for Recruiter (Optional)</span>
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Briefly state your motivation, availability, or portfolio highlights..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 resize-none"
            />
          </div>

          {/* Already Applied Warning */}
          {isAlreadyApplied && (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span>You have already applied to this opportunity. Each student may apply only once.</span>
            </div>
          )}

          {/* Footer Controls */}
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
              disabled={isAlreadyApplied || isSubmitting}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                isAlreadyApplied
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-glow-blue'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : isAlreadyApplied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Already Applied</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm &amp; Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
