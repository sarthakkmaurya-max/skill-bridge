import React from 'react';
import { AssessmentResult, Opportunity, Application } from '@skillbridge/shared';
import { Sparkles, Briefcase, RotateCcw } from 'lucide-react';

interface OverviewTabProps {
  studentName: string;
  latestAssessment: AssessmentResult | null;
  opportunities: Opportunity[];
  applications: Application[];
  onGoToAssessment: (retake?: boolean) => void;
  onGoToOpportunities: () => void;
  onQuickApply: (opportunity: Opportunity) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  studentName,
  latestAssessment,
  opportunities,
  applications,
  onGoToAssessment,
  onGoToOpportunities,
  onQuickApply,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Student Welcome Header Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Career Passport</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {studentName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your real-time role readiness indicates high placement alignment for <strong className="text-white">{latestAssessment?.recommendedRole || 'Frontend Engineering'}</strong>.
          </p>
        </div>

        {/* Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 rounded-xl bg-navy-950/60 border border-white/5">
            <div className="text-[11px] text-slate-400">Readiness Score</div>
            <div className="text-2xl font-black text-white mt-1">
              {latestAssessment?.percentage || 88}%
            </div>
          </div>
          <div className="p-3 rounded-xl bg-navy-950/60 border border-white/5">
            <div className="text-[11px] text-slate-400">Target Role</div>
            <div className="text-sm font-bold text-blue-400 mt-1 truncate">
              {latestAssessment?.recommendedRole?.split(' ')[0] || 'Frontend'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-navy-950/60 border border-white/5">
            <div className="text-[11px] text-slate-400">Matched Jobs</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {opportunities.length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-navy-950/60 border border-white/5">
            <div className="text-[11px] text-slate-400">Applications</div>
            <div className="text-2xl font-black text-violet-400 mt-1">
              {applications.length}
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Status Preview Card */}
      {latestAssessment && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Latest Assessment Summary</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Completed on {new Date(latestAssessment.completedAt).toLocaleDateString()} • {latestAssessment.totalScore} of {latestAssessment.maxScore} points
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onGoToAssessment(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-blue transition-all"
              >
                View Full Results
              </button>
              <button
                onClick={() => onGoToAssessment(true)}
                className="px-3.5 py-2 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-slate-200 flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">AI Rule-Based Guidance: </strong>
              {latestAssessment.recommendationMessage}
            </div>
          </div>
        </div>
      )}

      {/* Top Curated Opportunities Spotlight */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>Top Priority Openings For You</span>
          </h3>
          <button
            onClick={onGoToOpportunities}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            View all ({opportunities.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.slice(0, 2).map((opp) => {
            const isApplied = applications.some((a) => a.opportunityId === opp.id);
            return (
              <div key={opp.id} className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{opp.title}</h4>
                    <span className="text-xs text-slate-400">{opp.company}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    88% Match
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {opp.requiredSkills.map((sk: string) => (
                    <span key={sk} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-300">
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{opp.stipendOrSalary}</span>
                  <button
                    onClick={() => onQuickApply(opp)}
                    disabled={isApplied}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                      isApplied
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue'
                    }`}
                  >
                    {isApplied ? 'Applied ✓' : 'Quick Apply'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};