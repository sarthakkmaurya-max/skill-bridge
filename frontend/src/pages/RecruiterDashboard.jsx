import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { 
  Briefcase, 
  Users, 
  Plus, 
  Trash2, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Clock, 
  ArrowUpDown, 
  CheckCircle2, 
  XCircle, 
  Filter,
  FileText,
  Building2,
  X
} from 'lucide-react';

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'candidates'
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal for new opportunity
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    type: 'Internship',
    location: '',
    stipendOrSalary: '',
    duration: '3 Months',
    deadline: '',
    description: '',
    requiredSkills: '',
    eligibility: '',
  });

  const loadListings = async () => {
    setLoading(true);
    try {
      const res = await api.getMyListings();
      if (res.success) {
        setOpportunities(res.opportunities || []);
        if (res.opportunities && res.opportunities.length > 0 && !selectedOppId) {
          setSelectedOppId(res.opportunities[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplicants = async (oppId) => {
    if (!oppId) return;
    try {
      const res = await api.getOpportunityApplicants(oppId, {
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      if (res.success) {
        setApplicants(res.applications || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  useEffect(() => {
    if (selectedOppId) {
      loadApplicants(selectedOppId);
    }
  }, [selectedOppId, statusFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createOpportunity({
        ...form,
        requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      if (res.success) {
        setShowCreateModal(false);
        setForm({
          title: '',
          company: '',
          type: 'Internship',
          location: '',
          stipendOrSalary: '',
          duration: '3 Months',
          deadline: '',
          description: '',
          requiredSkills: '',
          eligibility: '',
        });
        loadListings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      await api.deleteOpportunity(id);
      loadListings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await api.updateApplicationStatus(appId, {
        status: newStatus,
        comment: `Candidate moved to ${newStatus}`,
      });
      if (res.success) {
        setApplicants(applicants.map((a) => a._id === appId ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'listings', label: 'My Posted Opportunities', icon: Briefcase, count: opportunities.length },
    { id: 'candidates', label: 'Candidate Pipeline & Match Ranking', icon: Users },
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
                      layoutId="activeRecruiterTab"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/25 to-violet-600/25 border border-blue-500/40 shadow-sm shadow-blue-500/20"
                    />
                  )}

                  <Icon className={`w-4 h-4 relative z-10 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="relative z-10 font-semibold">{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                        isActive
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
              Loading Recruiter Portal...
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
              {/* TAB 1: LISTINGS */}
              {activeTab === 'listings' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Manage Job & Internship Listings
                      </h1>
                      <p className="text-xs text-slate-400 mt-1">
                        Post new opportunities and review recruitment pipelines
                      </p>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all w-fit"
                    >
                      <Plus className="w-4 h-4" /> Post New Opportunity
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {opportunities.map((opp) => (
                      <div
                        key={opp._id}
                        className="bg-[#0e1e38]/70 hover:bg-[#0e1e38]/90 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-blue-500/40 p-5 sm:p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              opp.type === 'Internship'
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                            }`}>
                              {opp.type}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Deadline: {new Date(opp.deadline).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{opp.title}</h3>
                          <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-blue-400" />
                            {opp.company} • {opp.location}
                          </p>

                          <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-300">
                            <span className="flex items-center gap-1 font-bold text-emerald-400">
                              <DollarSign className="w-3.5 h-3.5" /> {opp.stipendOrSalary}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Clock className="w-3.5 h-3.5" /> {opp.duration}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">{opp.description}</p>

                          <div className="flex flex-wrap gap-1.5 mt-3.5">
                            {(opp.requiredSkills || []).map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-slate-300 text-[10px] font-medium"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
                          <button
                            onClick={() => {
                              setSelectedOppId(opp._id);
                              setActiveTab('candidates');
                            }}
                            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-blue-300 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Users className="w-3.5 h-3.5 text-blue-400" /> View Applicants
                          </button>
                          <button
                            onClick={() => handleDelete(opp._id)}
                            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-white/[0.05] rounded-xl transition-colors"
                            aria-label="Delete opportunity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: CANDIDATE PIPELINE & RANKING */}
              {activeTab === 'candidates' && (
                <div className="space-y-6">
                  {/* Header / Selector */}
                  <div className="bg-[#0e1e38]/75 backdrop-blur-xl rounded-2xl border border-white/10 p-3 sm:p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-slate-300 shrink-0">Active Listing:</label>
                      <select
                        value={selectedOppId}
                        onChange={(e) => setSelectedOppId(e.target.value)}
                        className="px-3 py-2 bg-[#0c1830] border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {opportunities.map((o) => (
                          <option key={o._id} value={o._id}>{o.title} ({o.company})</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-[#0c1830] border border-white/10 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="all">All Stages</option>
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* Candidates List Sorted by Match Score */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-2">
                      <span className="flex items-center gap-1.5">
                        <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" /> Candidates Ranked by Match Score (Highest First)
                      </span>
                      <span>Total Applicants: {applicants.length}</span>
                    </div>

                    {applicants.length === 0 ? (
                      <div className="bg-[#0e1e38]/70 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center text-xs text-slate-400 shadow-xl">
                        No candidate applications found for this listing.
                      </div>
                    ) : (
                      applicants.map((app) => (
                        <div
                          key={app._id}
                          className="bg-[#0e1e38]/75 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/20 p-5 sm:p-6 shadow-xl space-y-4 transition-all"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Student Info */}
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-base font-bold text-white">{app.student?.name}</h4>
                                <span className="text-xs text-slate-400">({app.student?.email})</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {app.studentProfile?.branch || 'Undergraduate'} • {app.student?.college || 'University'}
                              </p>
                            </div>

                            {/* Match Score & Status Changer */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 border ${
                                app.matchScore >= 75
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-xs shadow-emerald-500/20'
                                  : app.matchScore >= 50
                                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                  : 'bg-white/[0.05] text-slate-300 border-white/10'
                              }`}>
                                <Sparkles className="w-3.5 h-3.5" />
                                Match: {app.matchScore}%
                              </div>

                              <select
                                value={app.status}
                                onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                                className="px-3 py-1.5 bg-[#0c1830] border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                              >
                                <option value="Applied">Applied</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Interview">Interview</option>
                                <option value="Selected">Selected</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>
                          </div>

                          {/* Skills Matched / Missing */}
                          <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2 text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Matched Skills:</span>
                              {(app.matchedSkills || []).map((s, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[10px] font-bold"
                                >
                                  ✓ {s}
                                </span>
                              ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Missing Skills:</span>
                              {(app.missingSkills || []).length > 0 ? (
                                app.missingSkills.map((s, i) => (
                                  <span
                                    key={i}
                                    className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-medium"
                                  >
                                    - {s}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-emerald-400 font-semibold">100% of required skills present</span>
                              )}
                            </div>

                            {app.notes && (
                              <p className="text-[11px] text-slate-300 italic pt-2 border-t border-white/10">
                                Applicant Note: "{app.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* CREATE MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0c1933] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 text-white max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base sm:text-lg text-white">Post Job / Internship</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Opportunity Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Frontend Engineering Intern"
                    className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company</label>
                    <input
                      type="text"
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="TechCorp Labs"
                      className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full p-2.5 bg-[#0c1830] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Internship">Internship</option>
                      <option value="Job">Job</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="Remote or City"
                      className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Stipend / Salary</label>
                    <input
                      type="text"
                      required
                      value={form.stipendOrSalary}
                      onChange={(e) => setForm({ ...form, stipendOrSalary: e.target.value })}
                      placeholder="₹30,000 / mo or ₹12 LPA"
                      className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      placeholder="6 Months / Full Time"
                      className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Deadline</label>
                    <input
                      type="date"
                      required
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skills (comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={form.requiredSkills}
                    onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
                    placeholder="React, JavaScript, Git, Tailwind CSS"
                    className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe job responsibilities and project scope..."
                    className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all"
                  >
                    Create Opportunity
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}