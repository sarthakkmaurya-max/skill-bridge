import React, { useState } from 'react';
import { Opportunity } from '@skillbridge/shared';
import { Search, Briefcase, Building2, MapPin, Calendar, Users, ExternalLink } from 'lucide-react';

interface AdminOpportunitiesTabProps {
  opportunities: Opportunity[];
}

export const AdminOpportunitiesTab: React.FC<AdminOpportunitiesTabProps> = ({ opportunities }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = opportunities.filter((opp) => {
    const q = search.toLowerCase();
    const matchesSearch = 
      opp.title.toLowerCase().includes(q) ||
      opp.company.toLowerCase().includes(q) ||
      opp.location.toLowerCase().includes(q);
    const matchesType = typeFilter === 'all' || opp.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-violet-400" />
            <span>Campus Opportunities &amp; Corporate Partnerships</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Industry recruitment drives, internships, and university faculty development programs
          </p>
        </div>
        <span className="text-xs font-semibold text-violet-400 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 self-start sm:self-auto">
          {filtered.length} Opportunities Active
        </span>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search opportunities by title, recruiter company, or city..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl glass-input text-xs text-white"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-slate-200 bg-navy-950"
          >
            <option value="all">All Opportunity Types</option>
            <option value="internship">Internship</option>
            <option value="job">Full-Time Job</option>
            <option value="apprenticeship">Apprenticeship</option>
            <option value="workshop">Workshop</option>
            <option value="fdp">Faculty Development</option>
          </select>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((opp) => (
          <div key={opp.id} className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between hover:border-white/20 transition-all">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{opp.title}</h4>
                  <div className="text-xs font-semibold text-violet-400 flex items-center space-x-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{opp.company}</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/15 text-violet-300 border border-violet-500/30">
                  {opp.type}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {opp.description}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {opp.requiredSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-400">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{opp.location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{opp.openingsCount || 1} Openings</span>
              </span>
              <span className="text-emerald-400 font-bold col-span-2 sm:col-span-1">
                {opp.stipendOrSalary}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
