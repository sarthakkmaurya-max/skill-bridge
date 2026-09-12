import React, { useState } from 'react';
import { Application, ApplicationStatus } from '@skillbridge/shared';
import { Search, FileText, CheckCircle2, Clock, AlertCircle, Building2, User } from 'lucide-react';

interface AdminApplicationsTabProps {
  applications: Application[];
}

export const AdminApplicationsTab: React.FC<AdminApplicationsTabProps> = ({ applications }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = applications.filter((app) => {
    const q = search.toLowerCase();
    const title = app.opportunity?.title?.toLowerCase() || '';
    const company = app.opportunity?.company?.toLowerCase() || '';
    const student = app.studentName?.toLowerCase() || '';
    const matchesSearch = title.includes(q) || company.includes(q) || student.includes(q);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses: { key: string; label: string; count: number }[] = [
    { key: 'all', label: 'All Applications', count: applications.length },
    { key: 'Applied', label: 'Applied', count: applications.filter(a => a.status === 'Applied').length },
    { key: 'Shortlisted', label: 'Shortlisted', count: applications.filter(a => a.status === 'Shortlisted').length },
    { key: 'Interview', label: 'Interview', count: applications.filter(a => a.status === 'Interview').length },
    { key: 'Selected', label: 'Selected / Placed', count: applications.filter(a => a.status === 'Selected').length },
    { key: 'Rejected', label: 'Rejected', count: applications.filter(a => a.status === 'Rejected').length },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <span>Campus Recruitment &amp; Application Funnel</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit student submissions, employer screening progression, and interview scheduling
          </p>
        </div>
        <span className="text-xs font-semibold text-teal-400 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 self-start sm:self-auto">
          {filtered.length} Applications Shown
        </span>
      </div>

      {/* Filter and Status Pills */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student candidate name, opportunity, or hiring company..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl glass-input text-xs text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {statuses.map((pill) => (
            <button
              key={pill.key}
              onClick={() => setStatusFilter(pill.key)}
              className={`px-3 py-1 rounded-lg transition-all text-xs font-semibold flex items-center space-x-1.5 ${
                statusFilter === pill.key
                  ? 'bg-teal-600 text-white shadow-glow-teal'
                  : 'glass-panel hover:border-white/20 text-slate-300'
              }`}
            >
              <span>{pill.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === pill.key ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {pill.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-navy-900/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Candidate Student</th>
                <th className="py-3 px-4">Applied Opportunity</th>
                <th className="py-3 px-4 text-center">Match %</th>
                <th className="py-3 px-4 text-center">Stage</th>
                <th className="py-3 px-4">Recruiter Status Notes</th>
                <th className="py-3 px-4 text-right">Applied Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No applications match the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <div>
                          <div>{app.studentName || 'Alex Rivera'}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{app.studentEmail || 'alex.rivera@apex.edu'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{app.opportunity?.title || 'Engineering Role'}</div>
                      <div className="text-[11px] text-violet-400 flex items-center space-x-1">
                        <Building2 className="w-3 h-3" />
                        <span>{app.opportunity?.company || 'Recruiter'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-blue-400">
                      {app.matchPercentage || app.matchScore}%
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        app.status === 'Selected'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : app.status === 'Interview'
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                          : app.status === 'Shortlisted'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : app.status === 'Applied'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {app.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs text-[11px] text-slate-300 truncate">
                      {app.recruiterNotes ? (
                        <span className="text-slate-300">"{app.recruiterNotes}"</span>
                      ) : (
                        <span className="text-slate-500 italic">Under recruiter review</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-400 text-[11px]">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
