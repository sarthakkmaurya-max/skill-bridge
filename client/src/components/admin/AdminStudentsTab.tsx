import React, { useState } from 'react';
import { AdminStudentSummary } from '@skillbridge/shared';
import { 
  Search, 
  Filter, 
  GraduationCap, 
  User, 
  Award, 
  FolderGit2, 
  FileText, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { AdminStudentDetailModal } from './AdminStudentDetailModal';

interface AdminStudentsTabProps {
  students: AdminStudentSummary[];
}

export const AdminStudentsTab: React.FC<AdminStudentsTabProps> = ({ students }) => {
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [readinessFilter, setReadinessFilter] = useState<'all' | 'ready' | 'proficient' | 'developing'>('all');
  const [selectedStudent, setSelectedStudent] = useState<AdminStudentSummary | null>(null);

  const branches = [
    'all',
    'Computer Science & Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Electronics & Communication',
  ];

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch = 
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.targetRole.toLowerCase().includes(q);

    const matchesBranch = branchFilter === 'all' || s.branch === branchFilter;

    let matchesReadiness = true;
    if (readinessFilter === 'ready') matchesReadiness = s.roleReadinessScore >= 85;
    else if (readinessFilter === 'proficient') matchesReadiness = s.roleReadinessScore >= 75 && s.roleReadinessScore < 85;
    else if (readinessFilter === 'developing') matchesReadiness = s.roleReadinessScore < 75;

    return matchesSearch && matchesBranch && matchesReadiness;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <span>Student Roster &amp; Role Readiness Directory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor individual placement profiles, verified projects, and career benchmarks
          </p>
        </div>
        <span className="text-xs font-semibold text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 self-start sm:self-auto">
          {filtered.length} Students Displayed
        </span>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, email, target role..."
              className="w-full pl-10 pr-3.5 py-2 rounded-xl glass-input text-xs text-white"
            />
          </div>

          {/* Branch Filter */}
          <div className="w-full md:w-64">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-slate-200 bg-navy-950"
            >
              <option value="all">All Departments / Branches</option>
              {branches.filter(b => b !== 'all').map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Readiness Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Readiness Tier:</span>
          </span>
          {[
            { key: 'all', label: 'All Students' },
            { key: 'ready', label: 'Placement Ready (≥85%)' },
            { key: 'proficient', label: 'Proficient (75%–84%)' },
            { key: 'developing', label: 'Developing (<75%)' },
          ].map((pill) => (
            <button
              key={pill.key}
              onClick={() => setReadinessFilter(pill.key as any)}
              className={`px-3 py-1 rounded-lg transition-all text-xs font-semibold ${
                readinessFilter === pill.key
                  ? 'bg-emerald-600 text-white shadow-glow-emerald'
                  : 'glass-panel hover:border-white/20 text-slate-300'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-navy-900/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Student &amp; Email</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Target Role</th>
                <th className="py-3 px-4 text-center">Readiness</th>
                <th className="py-3 px-4 text-center">Verified Credentials</th>
                <th className="py-3 px-4 text-center">Placement</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No students match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((st) => (
                  <tr key={st.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black text-xs">
                          {st.name.charAt(0)}
                        </div>
                        <div>
                          <div>{st.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{st.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="truncate block max-w-[160px]">{st.branch}</span>
                      <span className="text-[10px] text-slate-500">Batch {st.graduationYear}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-blue-400 font-medium">{st.targetRole}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full font-bold text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {st.roleReadinessScore}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center space-x-2 text-[11px]">
                        <span className="flex items-center space-x-1 text-slate-300" title="Verified Projects">
                          <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>{st.verifiedProjectsCount}</span>
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center space-x-1 text-slate-300" title="Verified Certifications">
                          <Award className="w-3.5 h-3.5 text-violet-400" />
                          <span>{st.verifiedCertsCount}</span>
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        st.placementStatus === 'Placed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : st.placementStatus === 'In Process'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {st.placementStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(st)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all inline-flex items-center space-x-1"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminStudentDetailModal
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        student={selectedStudent}
      />

    </div>
  );
};
