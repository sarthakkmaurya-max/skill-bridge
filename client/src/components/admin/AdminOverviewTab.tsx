import React from 'react';
import { 
  AdminKpiMetrics, 
  AdminVerificationItem, 
  AdminStudentSummary, 
  Opportunity 
} from '@skillbridge/shared';
import { 
  Users, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  GraduationCap 
} from 'lucide-react';

interface AdminOverviewTabProps {
  kpis: AdminKpiMetrics;
  pendingVerifications: AdminVerificationItem[];
  students: AdminStudentSummary[];
  opportunities: Opportunity[];
  onNavigateTab: (tab: 'overview' | 'students' | 'opportunities' | 'applications' | 'verifications' | 'analytics') => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  kpis,
  pendingVerifications,
  students,
  opportunities,
  onNavigateTab,
}) => {
  const kpiCards = [
    { label: 'Total Enrolled Students', value: kpis.totalStudents, icon: <Users className="w-5 h-5 text-blue-400" />, bg: 'from-blue-500/10 to-indigo-500/10', border: 'border-blue-500/20' },
    { label: 'Active Recruitment Drives', value: kpis.activeOpportunities, icon: <Briefcase className="w-5 h-5 text-violet-400" />, bg: 'from-violet-500/10 to-purple-500/10', border: 'border-violet-500/20' },
    { label: 'Applications Submitted', value: kpis.totalApplications, icon: <FileText className="w-5 h-5 text-teal-400" />, bg: 'from-teal-500/10 to-emerald-500/10', border: 'border-teal-500/20' },
    { label: 'Placement Ready (≥75%)', value: kpis.placementReadyStudents, icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, bg: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-500/20' },
    { label: 'Candidates Selected', value: kpis.selectedCandidates, icon: <CheckCircle2 className="w-5 h-5 text-amber-400" />, bg: 'from-amber-500/10 to-orange-500/10', border: 'border-amber-500/20' },
    { label: 'Average Role Readiness', value: `${kpis.averageRoleReadiness}%`, icon: <TrendingUp className="w-5 h-5 text-indigo-400" />, bg: 'from-indigo-500/10 to-blue-500/10', border: 'border-indigo-500/20' },
  ];

  const pendingCount = pendingVerifications.filter(v => v.status === 'Pending').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* College Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-xl bg-gradient-to-r from-emerald-950/40 via-navy-900 to-navy-950">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus Career Placement Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Institutional Placement &amp; Skill <span className="gradient-text">Command Center</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Monitoring industry readiness, corporate hiring pipelines, and student project verification for the 2026 graduating batch.
            </p>
          </div>

          <div className="flex flex-col items-end space-y-2 flex-shrink-0">
            <button
              onClick={() => onNavigateTab('verifications')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-glow-emerald flex items-center space-x-2 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Verify Queue ({pendingCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-slate-400">
              Campus Accreditation: AICTE Tier-1 Accredited
            </span>
          </div>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpiCards.map((kpi, idx) => (
          <div
            key={idx}
            className={`glass-panel p-4 rounded-2xl border ${kpi.border} bg-gradient-to-b ${kpi.bg} space-y-2 flex flex-col justify-between`}
          >
            <div className="w-8 h-8 rounded-lg bg-navy-950/60 border border-white/10 flex items-center justify-center">
              {kpi.icon}
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">{kpi.value}</div>
              <div className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Placement Velocity & Cohort Milestone Progress */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">2026 Batch Placement Conversion Velocity</h3>
            <p className="text-xs text-slate-400 mt-0.5">72 offers confirmed out of 110 placement-seeking candidates</p>
          </div>
          <span className="text-sm font-black gradient-text">65.5% Target Achieved</span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 h-full rounded-full transition-all duration-500"
            style={{ width: '65.5%' }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-navy-950/60 border border-white/5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Highest Package</span>
            <strong className="text-white text-sm">₹85,000 / mo</strong>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Flipkart SDE Intern</span>
          </div>
          <div className="p-3 rounded-xl bg-navy-950/60 border border-white/5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Average CTC / Stipend</span>
            <strong className="text-white text-sm">₹45,000 / mo</strong>
            <span className="text-[10px] text-blue-400 block mt-0.5">Cloud &amp; Fintech Sector</span>
          </div>
          <div className="p-3 rounded-xl bg-navy-950/60 border border-white/5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Shortlist Rate</span>
            <strong className="text-white text-sm">59.2%</strong>
            <span className="text-[10px] text-teal-400 block mt-0.5">Application to Interview</span>
          </div>
          <div className="p-3 rounded-xl bg-navy-950/60 border border-white/5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Pending Verifications</span>
            <strong className="text-amber-400 text-sm">{pendingCount} Submissions</strong>
            <span className="text-[10px] text-slate-400 block mt-0.5">Awaiting Admin Sign-off</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Pending Verifications & Top Candidate Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Verifications Quick List */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">Pending Verification Queue</h3>
              </div>
              <button
                onClick={() => onNavigateTab('verifications')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
              >
                <span>View All ({pendingVerifications.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingVerifications.slice(0, 3).map((item) => (
                <div key={item.id} className="glass-panel p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="space-y-0.5 max-w-[280px]">
                    <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                    <p className="text-[11px] text-slate-400 truncate">
                      {item.studentName} • {item.studentBranch}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {item.type.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('verifications')}
            className="w-full py-2.5 rounded-xl border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 text-xs font-bold transition-all text-center"
          >
            Review &amp; Approve Pending Credentials
          </button>
        </div>

        {/* Top Talent Highlights */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">High-Readiness Candidates</h3>
              </div>
              <button
                onClick={() => onNavigateTab('students')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
              >
                <span>Student Directory</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {students.slice(0, 3).map((st) => (
                <div key={st.id} className="glass-panel p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <h5 className="text-xs font-bold text-white">{st.name}</h5>
                      <span className="text-[10px] text-slate-400">• {st.branch.split('&')[0]}</span>
                    </div>
                    <p className="text-[11px] text-blue-400">{st.targetRole}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black gradient-text">{st.roleReadinessScore}%</span>
                    <span className="text-[10px] text-slate-400 block">Readiness</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('analytics')}
            className="w-full py-2.5 rounded-xl border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 text-xs font-bold transition-all text-center"
          >
            Inspect Cohort Skill Gaps &amp; Demand Analytics
          </button>
        </div>

      </div>

    </div>
  );
};
