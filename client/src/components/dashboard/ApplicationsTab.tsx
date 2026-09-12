import React, { useState } from 'react';
import { Application, ApplicationStatus, formatOpportunityType } from '@skillbridge/shared';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  Send, 
  Search, 
  SlidersHorizontal,
  XCircle,
  ExternalLink,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

interface ApplicationsTabProps {
  applications: Application[];
  onExploreOpportunities?: () => void;
}

const TIMELINE_STEPS = [
  { key: 'Applied', label: 'Applied', description: 'Application submitted' },
  { key: 'Shortlisted', label: 'Shortlisted', description: 'Passed screening' },
  { key: 'Interview', label: 'Interview', description: 'Rounds in progress' },
  { key: 'Selected', label: 'Selected', description: 'Offer extended' },
];

export const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ 
  applications,
  onExploreOpportunities,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Counts by status
  const counts = {
    all: applications.length,
    Applied: applications.filter(a => a.status === 'Applied').length,
    Shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    Interview: applications.filter(a => a.status === 'Interview').length,
    Selected: applications.filter(a => a.status === 'Selected').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  // Filter applications
  const filtered = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    if (!matchesStatus) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = app.opportunity?.title?.toLowerCase().includes(q);
      const matchComp = app.opportunity?.company?.toLowerCase().includes(q);
      const matchStatus = app.status.toLowerCase().includes(q);
      return matchTitle || matchComp || matchStatus;
    }

    return true;
  });

  const getStepIndex = (status: ApplicationStatus): number => {
    switch (status) {
      case 'Applied': return 0;
      case 'Shortlisted': return 1;
      case 'Interview': return 2;
      case 'Selected': return 3;
      case 'Rejected': return -1;
      default: return 0;
    }
  };

  const getStatusBadgeStyle = (status: ApplicationStatus) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-emerald';
      case 'Interview':
        return 'bg-violet-500/20 text-violet-300 border-violet-500/40 shadow-glow-violet';
      case 'Shortlisted':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Applied':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-white/10';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-white/10">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25 text-[10px] font-extrabold uppercase mb-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Placement &amp; Internship Pipeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Application Journey</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Monitor the live recruitment review, screening stages, and interview progress for your verified submissions.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <div className="px-4 py-2 rounded-2xl glass-panel text-center">
            <div className="text-lg font-black gradient-text">{applications.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Submissions</div>
          </div>
          <div className="px-4 py-2 rounded-2xl glass-panel text-center">
            <div className="text-lg font-black text-emerald-400">{counts.Shortlisted + counts.Interview + counts.Selected}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">In Progress</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { key: 'all', label: 'All', count: counts.all },
              { key: 'Applied', label: 'Applied', count: counts.Applied },
              { key: 'Shortlisted', label: 'Shortlisted', count: counts.Shortlisted },
              { key: 'Interview', label: 'Interview', count: counts.Interview },
              { key: 'Selected', label: 'Selected', count: counts.Selected },
              { key: 'Rejected', label: 'Rejected', count: counts.Rejected },
            ].map((item) => {
              const isActive = statusFilter === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setStatusFilter(item.key as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-glow-blue border border-blue-400/30'
                      : 'bg-navy-950/60 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-navy-950/80 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto border border-white/10">
          <FileText className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Applications Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {applications.length === 0
              ? 'You have not submitted any applications yet. Explore curated positions matching your role readiness scores.'
              : 'No applications match your selected filter criteria. Try resetting the status filter.'}
          </p>
          {onExploreOpportunities && (
            <button
              onClick={onExploreOpportunities}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-glow-blue"
            >
              Browse Opportunities
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const currentStepIdx = getStepIndex(app.status);
            const isRejected = app.status === 'Rejected';
            const matchScore = app.matchPercentage || app.matchScore || 85;

            return (
              <div
                key={app.id}
                className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 space-y-5 hover:border-blue-500/30 transition-all shadow-md"
              >
                {/* Top Row: Title, Company, Status, Match Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {formatOpportunityType(app.opportunity?.type)}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {app.opportunity?.workMode || 'Hybrid'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {app.opportunity?.title || 'Engineering Internship Position'}
                    </h3>

                    <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-violet-400" />
                      <span>{app.opportunity?.company || 'Industry Partner'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{matchScore}% Match</span>
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black border ${getStatusBadgeStyle(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Application Journey Timeline */}
                <div className="p-4 sm:p-5 rounded-2xl bg-navy-950/70 border border-white/5 space-y-3">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Application Journey Status:
                  </div>

                  {isRejected ? (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>
                        Application review concluded. Not moving forward for this specific cohort. We recommend reviewing your skill gaps and applying to other open positions!
                      </span>
                    </div>
                  ) : (
                    <div className="relative pt-2 pb-1">
                      {/* Horizontal progress track line */}
                      <div className="absolute top-6 left-6 right-6 h-1 bg-slate-800 rounded-full hidden sm:block -translate-y-1/2 z-0">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, (currentStepIdx / (TIMELINE_STEPS.length - 1)) * 100)
                            )}%`,
                          }}
                        />
                      </div>

                      {/* Timeline Steps Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
                        {TIMELINE_STEPS.map((step, idx) => {
                          const isComplete = currentStepIdx > idx;
                          const isCurrent = currentStepIdx === idx;
                          const isUpcoming = currentStepIdx < idx;

                          return (
                            <div
                              key={step.key}
                              className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all ${
                                isCurrent
                                  ? 'bg-blue-950/80 border-blue-500/50 shadow-md ring-1 ring-blue-500/30'
                                  : isComplete
                                  ? 'bg-navy-900/60 border-emerald-500/30 text-emerald-300'
                                  : 'bg-navy-950/40 border-white/5 opacity-60'
                              }`}
                            >
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mb-1.5 transition-all ${
                                  isCurrent
                                    ? 'bg-blue-600 text-white animate-pulse shadow-glow-blue'
                                    : isComplete
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {isComplete ? '✓' : idx + 1}
                              </div>

                              <span className="text-xs font-bold text-white">{step.label}</span>
                              <span className="text-[10px] text-slate-400 mt-0.5">
                                {isCurrent
                                  ? 'Active Step'
                                  : isComplete
                                  ? 'Completed'
                                  : 'Pending Review'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Recruiter Notes (Displayed when available) */}
                {(app.recruiterNotes || app.notes) && (
                  <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/25 space-y-1.5 animate-fadeIn">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-violet-300">
                      <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                      <span>Recruiter Feedback &amp; Review Note</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium italic">
                      "{app.recruiterNotes || app.notes}"
                    </p>
                  </div>
                )}

                {/* Metadata Footer: Applied Date, Location, Stipend, Duration */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-400 pt-2 border-t border-white/5">
                  <div className="flex items-center space-x-1 truncate">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center space-x-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{app.opportunity?.location || 'Bengaluru'}</span>
                  </div>

                  <div className="flex items-center space-x-1 truncate text-emerald-300 font-medium">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{app.opportunity?.stipendOrSalary || '₹45,000 / month'}</span>
                  </div>

                  <div className="flex items-center space-x-1 truncate">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{app.opportunity?.duration || '6 Months'}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};