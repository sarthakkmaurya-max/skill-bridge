import React, { useState } from 'react';
import { Opportunity, OpportunityMatchResult, formatOpportunityType } from '@skillbridge/shared';
import { 
  X, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Briefcase,
  Send,
  Building2
} from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: Opportunity;
  matchResult: OpportunityMatchResult;
  isOpen: boolean;
  onClose: () => void;
  onApplyPlaceholder?: () => void;
  isAlreadyApplied?: boolean;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  matchResult,
  isOpen,
  onClose,
  onApplyPlaceholder,
  isAlreadyApplied = false,
}) => {
  if (!isOpen) return null;

  const handleApplyClick = () => {
    if (onApplyPlaceholder) {
      onApplyPlaceholder();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-card border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Company & Type */}
        <div className="space-y-2 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {formatOpportunityType(opportunity.type)}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {opportunity.workMode || 'Hybrid'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">{opportunity.title}</h2>
          <div className="flex items-center space-x-2 text-sm text-slate-300 font-semibold">
            <Building2 className="w-4 h-4 text-violet-400" />
            <span>{opportunity.company}</span>
          </div>
        </div>

        {/* Smart Skill-Match Engine Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/70 to-violet-950/70 border border-blue-500/30 space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-300">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Smart Competency Alignment Score</span>
            </div>
            <span className="text-xl font-black gradient-text">
              {matchResult.matchPercentage}% Match
            </span>
          </div>

          {/* Match Score Bar */}
          <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-700"
              style={{ width: `${matchResult.matchPercentage}%` }}
            />
          </div>

          {/* Actionable recommendation */}
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {matchResult.recommendation}
          </p>

          {/* Matched vs Missing Skills breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Matched Strengths ({matchResult.matchedSkills.length})</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {matchResult.matchedSkills.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[10px] font-semibold">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-amber-400 flex items-center space-x-1 mb-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Skills to Strengthen ({matchResult.missingSkills.length})</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {matchResult.missingSkills.length > 0 ? (
                  matchResult.missingSkills.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[10px] font-semibold">
                      △ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-400 italic">None! All requirements satisfied.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-navy-950/60 border border-white/5 text-xs text-slate-300">
          <div>
            <span className="text-slate-500 block text-[10px]">Stipend / Package</span>
            <div className="font-bold text-white mt-0.5 flex items-center space-x-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>{opportunity.stipendOrSalary}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Location</span>
            <div className="font-bold text-white mt-0.5 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate">{opportunity.location}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Duration</span>
            <div className="font-bold text-white mt-0.5 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{opportunity.duration || 'Flexible'}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Application Deadline</span>
            <div className="font-bold text-white mt-0.5 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
              <span>{new Date(opportunity.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Eligibility & Openings */}
        <div className="space-y-1.5 text-xs">
          <span className="font-semibold text-white">Target Eligibility:</span>
          <p className="text-slate-300 leading-relaxed bg-navy-950/40 p-3 rounded-xl border border-white/5">
            {opportunity.eligibility} • Openings: <strong className="text-white">{opportunity.openingsCount || 1} candidates</strong>
          </p>
        </div>

        {/* Full Role Description */}
        <div className="space-y-1.5 text-xs">
          <span className="font-semibold text-white">Role Overview &amp; Learning Scope:</span>
          <p className="text-slate-300 leading-relaxed bg-navy-950/40 p-3.5 rounded-xl border border-white/5 whitespace-pre-line">
            {opportunity.description}
          </p>
        </div>
        {/* Modal Action Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold"
          >
            Close
          </button>

          <button
            onClick={handleApplyClick}
            disabled={isAlreadyApplied}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              isAlreadyApplied
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-glow-blue'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isAlreadyApplied ? 'Already Applied ✓' : 'Apply Now'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};