import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { 
  BarChart3, 
  ShieldCheck, 
  Users, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  TrendingUp, 
  AlertTriangle,
  Layers,
  Search,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'verifications', 'directory'
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState(null);
  const [verifications, setVerifications] = useState({ certificates: [], projects: [] });
  const [users, setUsers] = useState([]);
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, verifsRes, usersRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminVerifications(),
        api.getAdminUsers(),
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes);
      if (verifsRes.success) setVerifications(verifsRes);
      if (usersRes.success) setUsers(usersRes.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (type, id, status) => {
    try {
      const res = await api.updateVerificationStatus(type, id, { status });
      if (res.success) {
        const key = type === 'certificate' ? 'certificates' : 'projects';
        setVerifications({
          ...verifications,
          [key]: verifications[key].map((item) => item._id === id ? { ...item, verificationStatus: status } : item),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = !userRoleFilter || u.role === userRoleFilter;
    const matchSearch = !userSearch ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.college && u.college.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.company && u.company.toLowerCase().includes(userSearch.toLowerCase()));
    return matchRole && matchSearch;
  });

  const pendingCount = (verifications.certificates || []).filter((c) => c.verificationStatus === 'pending').length +
    (verifications.projects || []).filter((p) => p.verificationStatus === 'pending').length;

  const tabs = [
    { id: 'analytics', label: 'Placement & Skill Analytics', icon: BarChart3 },
    { id: 'verifications', label: 'Portfolio Verification Hub', icon: ShieldCheck, count: pendingCount, countAlert: true },
    { id: 'directory', label: 'User Directory', icon: Users, count: users.length },
  ];

  return (
    <div className="min-h-screen bg-[#081225] text-slate-100 relative overflow-hidden pb-24 selection:bg-blue-500/30 selection:text-white">
      {/* Ambient background glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute top-10 left-1/4 w-[650px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-violet-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-20 left-1/3 w-[450px] h-[450px] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Sticky Subnav */}
      <div className="bg-[#081225]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 sticky top-16 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 py-2 px-3.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Sliding active pill indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeAdminTab"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/25 to-violet-600/25 border border-blue-500/40 shadow-sm shadow-blue-500/20"
                    />
                  )}

                  <Icon className={`w-4 h-4 relative z-10 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="relative z-10 font-semibold">{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                        tab.countAlert && tab.count > 0
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : isActive
                          ? 'bg-blue-500/25 text-blue-200 border border-blue-400/40'
                          : 'bg-white/[0.06] text-slate-400 border border-white/10'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 rounded-full blur-md bg-blue-500/20" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wide">
              Loading College Admin Portal...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* TAB 1: ANALYTICS OVERVIEW */}
              {activeTab === 'analytics' && (
                <div className="space-y-7">
                  {/* 5 Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                      { label: 'Total Students', value: analytics?.stats?.totalStudents || 0, icon: GraduationCap, color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
                      { label: 'Active Opportunities', value: analytics?.stats?.activeOpportunities || 0, icon: Briefcase, color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30' },
                      { label: 'Total Applications', value: analytics?.stats?.totalApplications || 0, icon: Layers, color: 'text-violet-400 bg-violet-500/15 border-violet-500/30' },
                      { label: 'Selected / Hired', value: analytics?.stats?.selectedCandidates || 0, icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
                      { label: 'Pending Verifications', value: analytics?.stats?.pendingVerifications || pendingCount, icon: Clock, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
                    ].map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={i}
                          className="bg-[#0e1e38]/70 hover:bg-[#0e1e38]/90 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                            <span className={`p-2 rounded-xl border ${stat.color}`}>
                              <Icon className="w-4 h-4" />
                            </span>
                          </div>
                          <p className="text-2xl sm:text-3xl font-black text-white">{stat.value}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Placement Readiness Averages */}
                  <div className="bg-[#0e1e38]/75 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white">Average Placement Readiness Across Campus</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Aggregated from student profile benchmarks and 10-question skill assessments</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 border border-blue-500/20 text-blue-300 w-fit">
                        Live Cohort Metrics
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
                      {[
                        { role: 'Frontend Developer', pct: analytics?.placementReadinessAverage?.frontend || 65, color: 'from-blue-500 to-indigo-500' },
                        { role: 'Data Analyst', pct: analytics?.placementReadinessAverage?.dataAnalyst || 70, color: 'from-emerald-400 to-teal-500' },
                        { role: 'Backend Developer', pct: analytics?.placementReadinessAverage?.backend || 65, color: 'from-violet-500 to-purple-500' },
                      ].map((item) => (
                        <div key={item.role} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                          <div className="flex justify-between items-center font-bold text-xs">
                            <span className="text-slate-200">{item.role}</span>
                            <span className="text-emerald-400 text-sm font-extrabold">{item.pct}%</span>
                          </div>
                          <div className="w-full bg-white/5 border border-white/10 h-2.5 rounded-full overflow-hidden p-0.5">
                            <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Industry Demand vs Academia Gaps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Most Requested Industry Skills */}
                    <div className="bg-[#0e1e38]/75 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">Most Requested Industry Skills</h3>
                          <p className="text-xs text-slate-400">Skills sought across recruiter job descriptions</p>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-1">
                        {(analytics?.mostRequestedIndustrySkills || []).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                            <div className="flex items-center gap-2.5 font-bold text-slate-200">
                              <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[10px] flex items-center justify-center font-bold">
                                {idx + 1}
                              </span>
                              <span>{item.skill}</span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                              {item.count} Listings
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Missing Skills Among Students */}
                    <div className="bg-[#0e1e38]/75 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">Top Missing Skills (Curriculum Gaps)</h3>
                          <p className="text-xs text-slate-400">Most common skill gaps identified during application matching</p>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-1">
                        {(analytics?.topMissingSkills || []).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                            <div className="flex items-center gap-2.5 font-bold text-slate-200">
                              <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[10px] flex items-center justify-center font-bold">
                                {idx + 1}
                              </span>
                              <span>{item.skill}</span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-extrabold border border-amber-500/30">
                              {item.count} Missing Gap
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PORTFOLIO VERIFICATION HUB */}
              {activeTab === 'verifications' && (
                <div className="space-y-8">
                  {/* Certificates Section */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">Student Certificates for Verification</h2>
                      <p className="text-xs text-slate-400">Approving an item issues an official Verified Badge on the student portfolio</p>
                    </div>

                    <div className="bg-[#0e1e38]/75 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-xl">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10 text-xs text-left">
                          <thead className="bg-white/[0.04] font-bold text-slate-400 uppercase tracking-wider">
                            <tr>
                              <th className="px-5 py-3.5">Student</th>
                              <th className="px-5 py-3.5">Certificate Title</th>
                              <th className="px-5 py-3.5">Issuer</th>
                              <th className="px-5 py-3.5">Credential</th>
                              <th className="px-5 py-3.5">Status</th>
                              <th className="px-5 py-3.5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-medium">
                            {(verifications.certificates || []).map((c) => (
                              <tr key={c._id} className="hover:bg-white/[0.03] transition-colors">
                                <td className="px-5 py-4">
                                  <p className="font-bold text-white">{c.student?.name}</p>
                                  <p className="text-[11px] text-slate-400">{c.student?.email}</p>
                                </td>
                                <td className="px-5 py-4 font-semibold text-slate-200">{c.title}</td>
                                <td className="px-5 py-4 text-slate-400">{c.issuer}</td>
                                <td className="px-5 py-4">
                                  {c.credentialUrl ? (
                                    <a
                                      href={c.credentialUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-semibold"
                                    >
                                      Link <ExternalLink className="w-3 h-3" />
                                    </a>
                                  ) : <span className="text-slate-500">—</span>}
                                </td>
                                <td className="px-5 py-4">
                                  {c.verificationStatus === 'verified' ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                      Verified Badge
                                    </span>
                                  ) : c.verificationStatus === 'rejected' ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                                      Rejected
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                      Pending Review
                                    </span>
                                  )}
                                </td>
                                <td className="px-5 py-4 text-right space-x-2">
                                  {c.verificationStatus !== 'verified' && (
                                    <button
                                      onClick={() => handleVerify('certificate', c._id, 'verified')}
                                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-bold shadow-sm shadow-emerald-500/20 transition-all"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {c.verificationStatus !== 'rejected' && (
                                    <button
                                      onClick={() => handleVerify('certificate', c._id, 'rejected')}
                                      className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 hover:text-rose-300 border border-white/10 text-slate-400 text-[11px] font-bold transition-all"
                                    >
                                      Reject
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Projects Section */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">Student Projects for Verification</h2>
                      <p className="text-xs text-slate-400">Verify code authenticity and live deployments</p>
                    </div>

                    <div className="bg-[#0e1e38]/75 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-xl">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10 text-xs text-left">
                          <thead className="bg-white/[0.04] font-bold text-slate-400 uppercase tracking-wider">
                            <tr>
                              <th className="px-5 py-3.5">Student</th>
                              <th className="px-5 py-3.5">Project Title</th>
                              <th className="px-5 py-3.5">Technologies</th>
                              <th className="px-5 py-3.5">Repository</th>
                              <th className="px-5 py-3.5">Status</th>
                              <th className="px-5 py-3.5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-medium">
                            {(verifications.projects || []).map((p) => (
                              <tr key={p._id} className="hover:bg-white/[0.03] transition-colors">
                                <td className="px-5 py-4">
                                  <p className="font-bold text-white">{p.student?.name}</p>
                                  <p className="text-[11px] text-slate-400">{p.student?.email}</p>
                                </td>
                                <td className="px-5 py-4">
                                  <p className="font-semibold text-slate-200">{p.title}</p>
                                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{p.description}</p>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="flex flex-wrap gap-1 max-w-xs">
                                    {(p.technologies || []).map((t, idx) => (
                                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-[10px] text-slate-300">
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-5 py-4">
                                  {p.repoUrl ? (
                                    <a
                                      href={p.repoUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-semibold"
                                    >
                                      Repo <ExternalLink className="w-3 h-3" />
                                    </a>
                                  ) : <span className="text-slate-500">—</span>}
                                </td>
                                <td className="px-5 py-4">
                                  {p.verificationStatus === 'verified' ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                      Verified Badge
                                    </span>
                                  ) : p.verificationStatus === 'rejected' ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                                      Rejected
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                      Pending Review
                                    </span>
                                  )}
                                </td>
                                <td className="px-5 py-4 text-right space-x-2">
                                  {p.verificationStatus !== 'verified' && (
                                    <button
                                      onClick={() => handleVerify('project', p._id, 'verified')}
                                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-bold shadow-sm shadow-emerald-500/20 transition-all"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {p.verificationStatus !== 'rejected' && (
                                    <button
                                      onClick={() => handleVerify('project', p._id, 'rejected')}
                                      className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 hover:text-rose-300 border border-white/10 text-slate-400 text-[11px] font-bold transition-all"
                                    >
                                      Reject
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: USER DIRECTORY */}
              {activeTab === 'directory' && (
                <div className="space-y-6">
                  <div className="bg-[#0e1e38]/75 backdrop-blur-xl rounded-2xl border border-white/10 p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="Search users by name, email, college, company..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="px-3 py-2 bg-[#0c1830] border border-white/10 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500 w-full sm:w-auto cursor-pointer"
                    >
                      <option value="">All Roles</option>
                      <option value="student">Students</option>
                      <option value="recruiter">Recruiters</option>
                      <option value="admin">College Admins</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredUsers.map((u) => (
                      <div
                        key={u._id}
                        className="bg-[#0e1e38]/70 hover:bg-[#0e1e38]/90 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-blue-500/40 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-start gap-3.5"
                      >
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 border ${
                          u.role === 'student' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                          u.role === 'recruiter' ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' :
                          'bg-purple-500/15 text-purple-300 border-purple-500/30'
                        }`}>
                          {u.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-xs sm:text-sm text-white truncate">{u.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                              u.role === 'student' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                              u.role === 'recruiter' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
                              'bg-purple-500/10 text-purple-300 border-purple-500/20'
                            }`}>
                              {u.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{u.email}</p>
                          <p className="text-[11px] text-slate-300 mt-1.5 font-medium truncate">
                            {u.college || u.company || 'Institute of Advanced Technology'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}