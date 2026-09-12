import React, { useState, useMemo } from 'react';
import { Application, ApplicationStatus, Opportunity, formatOpportunityType } from '@skillbridge/shared';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Clock, 
  Search,
  Filter,
  ArrowUpDown,
  Building2,
  GraduationCap,
  Sparkles,
  UserCheck,
  Eye,
  MessageSquareQuote,
  Calendar,
  Layers,
  SlidersHorizontal
} from 'lucide-react';
import { CandidateDetailModal } from './CandidateDetailModal';
import { StatusChangeModal } from './StatusChangeModal';

interface ApplicantsTabProps {
  applications: Application[];
  opportunities?: Opportunity[];
  onUpdateStatus?: (applicationId: string, newStatus: ApplicationStatus, recruiterNotes: string) => Promise<void> | void;
}

export const ApplicantsTab: React.FC<ApplicantsTabProps> = ({
  applications,
  opportunities = [],
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [opportunityFilter, setOpportunityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'newest' | 'readiness'>('match');

  // Modals state
  const [detailCandidate, setDetailCandidate] = useState<Application | null>(null);
  const [statusChangeCandidate, setStatusChangeCandidate] = useState<Application | null>(null);

  // Status Counts
  const counts = {
    all: applications.length,
    Applied: applications.filter(a => a.status === 'Applied').length,
    Shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    Interview: applications.filter(a => a.status === 'Interview').length,
    Selected: applications.filter(a => a.status === 'Selected').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  // Filtered & Sorted Candidates
  const filteredAndSorted = useMemo(() => {
    return applications
      .filter((app) => {
        // Status Filter
        if (statusFilter !== 'all' && app.status !== statusFilter) {
          return false;
        }

        // Opportunity Filter
        if (opportunityFilter !== 'all' && app.opportunityId !== opportunityFilter) {
          return false;
        }

        // Search Query
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = (app.studentName || '').toLowerCase().includes(q);
          const matchCollege = (app.studentCollege || '').toLowerCase().includes(q);
          const matchTitle = (app.opportunity?.title || '').toLowerCase().includes(q);
          const matchEmail = (app.studentEmail || '').toLowerCase().includes(q);
          if (!matchName && !matchCollege && !matchTitle && !matchEmail) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          const scoreA = a.matchPercentage || a.matchScore || 0;
          const scoreB = b.matchPercentage || b.matchScore || 0;
          return scoreB - scoreA;
        }
        if (sortBy === 'newest') {
          return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
        }
        if (sortBy === 'readiness') {
          return (b.studentRoleReadiness || 0) - (a.studentRoleReadiness || 0);
        }
        return 0;
      });
  }, [applications, statusFilter, opportunityFilter, searchTerm, sortBy]);

  const handleConfirmStatusChange = async (appId: string, newStatus: ApplicationStatus, notes: string) => {
    if (onUpdateStatus) {
      await onUpdateStatus(appId, newStatus, notes);
    }
  };

  const getStatusBadgeClass = (status: ApplicationStatus) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Interview':
        return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
      case 'Shortlisted':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Applied':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-white/10';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-white/10">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25 text-[10px] font-extrabold uppercase mb-1">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>Shortlisting &amp; Evaluation Pipeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Candidate Applications</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Review pre-assessed candidates matched against your competency matrices across partner colleges.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start lg:self-auto">
          <div className="px-4 py-2 rounded-2xl glass-panel text-center">
            <div className="text-lg font-black text-white">{applications.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Candidates</div>
          </div>
          <div className="px-4 py-2 rounded-2xl glass-panel text-center">
            <div className="text-lg font-black text-emerald-400">{counts.Shortlisted + counts.Interview}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">In Pipeline</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name, college, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-950/80 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500/50"
            />
          </div>

          {/* Opportunity Filter */}
          <div className="sm:col-span-4">
            <select
              value={opportunityFilter}
              onChange={(e) => setOpportunityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950/80 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500/50"
            >
              <option value="all">All Your Postings ({opportunities.length || 'All'})</option>
              {opportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950/80 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500/50"
            >
              <option value="match">Highest Smart Match</option>
              <option value="newest">Recently Applied</option>
              <option value="readiness">Highest Role Readiness</option>
            </select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
          <span className="text-[11px] text-slate-400 font-semibold mr-1">Status:</span>
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
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-glow-violet border border-violet-400/30'
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
      </div>

      {/* Applicants Card List */}
      {filteredAndSorted.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto border border-white/10">
          <Users className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Applicants Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No candidate applications match your selected filters. Try clearing status or opportunity filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setOpportunityFilter('all');
            }}
            className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-glow-violet"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSorted.map((app) => {
            const matchScore = app.matchPercentage || app.matchScore || 85;
            const badgeColor =
              matchScore >= 90
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : matchScore >= 75
                ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30';

            return (
              <div
                key={app.id}
                className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4 hover:border-violet-500/30 transition-all shadow-md"
              >
                {/* Header: Candidate info & target opportunity */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center text-white text-base font-black shadow-glow-violet flex-shrink-0">
                      {app.studentName?.charAt(0) || 'A'}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-white">{app.studentName || 'Alex Rivera'}</h3>
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                          {app.studentCollege || 'Apex Institute of Technology'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Applied for: <strong className="text-white">{app.opportunity?.title || 'Frontend React Intern'}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Badges: Readiness, Smart Match, Status */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{app.studentRoleReadiness || 88}% Readiness</span>
                    </span>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-black border flex items-center space-x-1 ${badgeColor}`}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{matchScore}% Match</span>
                    </span>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Matched vs Missing Skills chips */}
                <div className="p-3.5 rounded-xl bg-navy-950/60 border border-white/5 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-emerald-400 mr-1">Verified Strengths:</span>
                    {app.matchedSkills.map((sk) => (
                      <span key={sk} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-semibold">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>

                  {app.missingSkills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/5">
                      <span className="text-[11px] font-semibold text-amber-400 mr-1">Skills to Develop:</span>
                      {app.missingSkills.map((sk) => (
                        <span key={sk} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold">
                          △ {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recruiter Private Note (if present) */}
                {app.recruiterNotes && (
                  <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/20 text-xs text-violet-200 flex items-start space-x-2">
                    <MessageSquareQuote className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                    <span className="italic font-medium">"{app.recruiterNotes}"</span>
                  </div>
                )}

                {/* Footer Controls: Applied Date & Action Buttons */}
                <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3 text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </span>
                    {app.studentEmail && (
                      <span className="hidden sm:inline text-slate-500">• {app.studentEmail}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setDetailCandidate(app)}
                      className="px-3.5 py-1.5 rounded-xl glass-panel text-slate-200 hover:text-white border border-white/10 hover:border-violet-500/30 transition-all font-semibold flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>Review Profile</span>
                    </button>

                    <button
                      onClick={() => setStatusChangeCandidate(app)}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold shadow-glow-violet transition-all flex items-center space-x-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Update Status</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Candidate Detail Modal */}
      {detailCandidate && (
        <CandidateDetailModal
          application={detailCandidate}
          isOpen={Boolean(detailCandidate)}
          onClose={() => setDetailCandidate(null)}
          onOpenStatusModal={(app) => setStatusChangeCandidate(app)}
        />
      )}

      {/* Status Change Confirmation Modal */}
      {statusChangeCandidate && (
        <StatusChangeModal
          application={statusChangeCandidate}
          isOpen={Boolean(statusChangeCandidate)}
          onClose={() => setStatusChangeCandidate(null)}
          onConfirmStatusChange={handleConfirmStatusChange}
        />
      )}

    </div>
  );
};