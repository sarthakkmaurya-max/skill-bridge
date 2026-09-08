import React from 'react';
import { Briefcase, Building2, Sparkles, Clock, MessageSquareQuote } from 'lucide-react';

export default function ApplicationsTab({ applications, onExplore }) {
  const statusColors = {
    Applied: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    Shortlisted: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    Interview: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    Selected: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-xs shadow-emerald-500/20',
    Rejected: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  };

  if (applications.length === 0) {
    return (
      <div className="bg-[#0e1e38]/70 backdrop-blur-xl rounded-3xl border border-white/10 p-12 sm:p-16 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-400 mx-auto flex items-center justify-center">
          <Briefcase className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="font-bold text-lg text-white">No applications yet</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          Apply to matching internships and jobs to track your hiring pipeline in real time.
        </p>
        <button
          onClick={onExplore}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all inline-flex items-center gap-2"
        >
          Explore Opportunities
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {applications.map((app) => (
        <div
          key={app._id}
          className="bg-[#0e1e38]/75 backdrop-blur-xl rounded-3xl border border-white/10 p-5 sm:p-6 shadow-xl space-y-4 hover:border-white/20 transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  {app.opportunity?.company || 'Company'}
                </span>
                <span>•</span>
                <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                {app.opportunity?.title || 'Position'}
              </h3>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/[0.04] text-slate-300 border border-white/10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Match: {app.matchScore}%
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${statusColors[app.status] || 'bg-white/[0.05] text-slate-300 border-white/10'}`}>
                {app.status}
              </span>
            </div>
          </div>

          {/* Luminous Stepper */}
          <div className="pt-2">
            <div className="grid grid-cols-4 gap-2 text-center">
              {['Applied', 'Shortlisted', 'Interview', 'Selected'].map((step, idx) => {
                const statuses = ['Applied', 'Shortlisted', 'Interview', 'Selected'];
                const cur = statuses.indexOf(app.status);
                const isPassed = cur >= idx && app.status !== 'Rejected';
                const isCur = app.status === step;

                return (
                  <div key={step} className="space-y-1.5">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        app.status === 'Rejected'
                          ? 'bg-rose-500/30 border border-rose-500/40'
                          : isPassed
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                          : 'bg-white/10 border border-white/5'
                      }`}
                    />
                    <span
                      className={`text-[11px] font-bold block transition-colors ${
                        isCur
                          ? 'text-white'
                          : isPassed
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comment history */}
          {app.statusHistory && app.statusHistory.length > 0 && (
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
              <MessageSquareQuote className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200">Latest recruiter update: </span>
                <span className="text-slate-400">
                  {app.statusHistory[app.statusHistory.length - 1].comment || `Status updated to ${app.status}`}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}