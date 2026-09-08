import React, { useState } from 'react';
import { api } from '../../services/api';
import { 
  Search, Filter, MapPin, Building2, DollarSign, Clock, Sparkles, Send, CheckCircle2, X 
} from 'lucide-react';

export default function OpportunitiesTab({ opportunities, studentSkills, applications, onApplicationSubmitted }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');

  const calcMatch = (reqSkills = []) => {
    const normStudent = new Set((studentSkills || []).map((s) => s.trim().toLowerCase()));
    const matched = reqSkills.filter((r) => normStudent.has(r.trim().toLowerCase()));
    const missing = reqSkills.filter((r) => !normStudent.has(r.trim().toLowerCase()));
    const pct = reqSkills.length === 0 ? 100 : Math.round((matched.length / reqSkills.length) * 100);

    let rec = '';
    if (pct === 100) {
      rec = 'Outstanding match! You possess 100% of the required skills.';
    } else if (missing.length > 0) {
      rec = `Your match score is ${pct}%. Learn ${missing.slice(0, 2).join(' and ')} to improve your eligibility.`;
    } else {
      rec = `Your match score is ${pct}%.`;
    }

    return { pct, matched, missing, rec };
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedOpp) return;
    setSubmitting(true);
    setApplyMessage('');
    try {
      const res = await api.applyToOpportunity({
        opportunityId: selectedOpp._id,
        notes,
      });
      if (res.success) {
        setApplyMessage('Application submitted successfully!');
        setTimeout(() => {
          setSelectedOpp(null);
          setNotes('');
          setApplyMessage('');
          if (onApplicationSubmitted) onApplicationSubmitted();
        }, 1200);
      }
    } catch (err) {
      setApplyMessage(err.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = opportunities.filter((opp) => {
    const matchType = typeFilter === 'all' || opp.type === typeFilter;
    const matchSearch = !search ||
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.company.toLowerCase().includes(search.toLowerCase()) ||
      opp.location.toLowerCase().includes(search.toLowerCase()) ||
      (opp.requiredSkills || []).some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-[#0e1e38]/75 backdrop-blur-xl rounded-2xl border border-white/10 p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by role, company, location, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-[#0c1830] border border-white/10 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Opportunities</option>
            <option value="Internship">Internships Only</option>
            <option value="Job">Full Time Jobs Only</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((opp) => {
          const match = calcMatch(opp.requiredSkills);
          const hasApplied = applications.some((a) => (a.opportunity?._id || a.opportunity) === opp._id);

          return (
            <div
              key={opp._id}
              className="bg-[#0e1e38]/70 hover:bg-[#0e1e38]/90 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-blue-500/40 p-5 sm:p-6 shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      opp.type === 'Internship'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                    }`}>
                      {opp.type}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-slate-500" /> {opp.location}
                    </span>
                  </div>

                  <div className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 border ${
                    match.pct >= 75
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-xs shadow-emerald-500/20'
                      : match.pct >= 40
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-white/[0.05] text-slate-400 border-white/10'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    {match.pct}% Match
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{opp.title}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" /> {opp.company}
                </p>

                <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-300">
                  <span className="flex items-center gap-1 font-bold text-emerald-400">
                    <DollarSign className="w-3.5 h-3.5" /> {opp.stipendOrSalary}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {opp.duration}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">{opp.description}</p>

                {/* Smart Match Recommendation */}
                <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <p className="text-[11px] font-bold text-slate-200 leading-tight">{match.rec}</p>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {match.matched.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[10px] font-bold">
                        ✓ {s}
                      </span>
                    ))}
                    {match.missing.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold">
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Deadline: {new Date(opp.deadline).toLocaleDateString()}
                </span>

                {hasApplied ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                  </span>
                ) : (
                  <button
                    onClick={() => { setSelectedOpp(opp); setNotes(''); setApplyMessage(''); }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
                  >
                    <Send className="w-3 h-3" /> Apply Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1933] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-white">{selectedOpp.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedOpp.company} • {selectedOpp.location}</p>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applyMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                {applyMessage}
              </div>
            )}

            {/* Smart Score stored with application */}
            {(() => {
              const m = calcMatch(selectedOpp.requiredSkills);
              return (
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-300">Smart Match Score:</span>
                    <span className="text-emerald-400 font-extrabold text-sm">{m.pct}%</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{m.rec}</p>
                </div>
              );
            })()}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Applicant Note</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention why you are interested in this position..."
                className="w-full p-3 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOpp(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleApply}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                {submitting ? 'Applying...' : 'Confirm Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}