import React, { useState, useMemo } from 'react';
import { 
  Opportunity, 
  Application, 
  AssessmentResult, 
  calculateOpportunityMatch, 
  formatOpportunityType, 
  OpportunityType, 
  WorkMode,
  OpportunityMatchResult 
} from '@skillbridge/shared';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  Users, 
  ArrowUpDown, 
  Eye, 
  Calendar, 
  SlidersHorizontal,
  X 
} from 'lucide-react';
import { OpportunityDetailModal } from './OpportunityDetailModal';
import { ApplyConfirmationModal } from './ApplyConfirmationModal';
import { SAMPLE_STUDENT_ANSWERS } from '../../lib/sampleData';

interface OpportunitiesTabProps {
  opportunities: Opportunity[];
  applications: Application[];
  latestAssessment?: AssessmentResult | null;
  onQuickApply: (opportunity: Opportunity, message?: string) => Promise<void> | void;
}

export const OpportunitiesTab: React.FC<OpportunitiesTabProps> = ({
  opportunities,
  applications,
  latestAssessment,
  onQuickApply,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [workModeFilter, setWorkModeFilter] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'newest' | 'openings' | 'deadline'>('match');

  // Detail Modal state
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedMatchResult, setSelectedMatchResult] = useState<OpportunityMatchResult | null>(null);

  // Apply Confirmation Modal state
  const [applyConfirmOpp, setApplyConfirmOpp] = useState<Opportunity | null>(null);
  const [applyConfirmMatch, setApplyConfirmMatch] = useState<OpportunityMatchResult | null>(null);

  // Derive ratings to pass to match engine
  const studentSkillRatings: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {};
    if (latestAssessment?.skillScores && Object.keys(latestAssessment.skillScores).length > 0) {
      Object.entries(latestAssessment.skillScores).forEach(([k, item]) => {
        map[k] = item.score;
      });
      return map;
    }

    // Map question IDs to skill keys
    const skillKeyMap: Record<number, string> = {
      1: 'html_css',
      2: 'javascript',
      3: 'react',
      4: 'git',
      5: 'sql',
      6: 'python',
      7: 'communication',
      8: 'teamwork',
      9: 'problem_solving',
      10: 'adaptability',
    };
    Object.entries(SAMPLE_STUDENT_ANSWERS).forEach(([qId, val]) => {
      const key = skillKeyMap[Number(qId)] || String(qId);
      map[key] = val;
    });
    return map;
  }, [latestAssessment]);

  // Collect unique skills across all listings for filter dropdown
  const uniqueSkills = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((opp) => {
      opp.requiredSkills?.forEach((s) => set.add(s));
    });
    return Array.from(set).sort();
  }, [opportunities]);

  // Compute matched items with pre-calculated match scores
  const processedOpportunities = useMemo(() => {
    return opportunities.map((opp) => {
      const match = calculateOpportunityMatch(studentSkillRatings, opp);
      const isApplied = applications.some((app) => app.opportunityId === opp.id);
      return {
        ...opp,
        matchResult: match,
        isApplied,
      };
    });
  }, [opportunities, studentSkillRatings, applications]);

  // Filter and sort items
  const filteredAndSortedOpportunities = useMemo(() => {
    return processedOpportunities
      .filter((opp) => {
        // Status filter: only active opportunities
        if (opp.status && opp.status !== 'active') return false;

        // Search text filter
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = opp.title.toLowerCase().includes(q);
          const matchComp = opp.company.toLowerCase().includes(q);
          const matchDesc = opp.description.toLowerCase().includes(q);
          const matchSkills = opp.requiredSkills?.some((s) => s.toLowerCase().includes(q));
          if (!matchTitle && !matchComp && !matchDesc && !matchSkills) {
            return false;
          }
        }

        // Type filter
        if (typeFilter !== 'all' && opp.type !== typeFilter) {
          return false;
        }

        // Work Mode filter
        if (workModeFilter !== 'all' && opp.workMode !== workModeFilter) {
          return false;
        }

        // Skill filter
        if (skillFilter !== 'all') {
          if (!opp.requiredSkills?.some((s) => s.toLowerCase() === skillFilter.toLowerCase())) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          return b.matchResult.matchPercentage - a.matchResult.matchPercentage;
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'openings') {
          return (b.openingsCount || 1) - (a.openingsCount || 1);
        }
        if (sortBy === 'deadline') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return 0;
      });
  }, [processedOpportunities, searchTerm, typeFilter, workModeFilter, skillFilter, sortBy]);

  const handleOpenDetail = (opp: typeof processedOpportunities[0]) => {
    setSelectedOpportunity(opp);
    setSelectedMatchResult(opp.matchResult);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setWorkModeFilter('all');
    setSkillFilter('all');
    setSortBy('match');
  };

  const hasActiveFilters = searchTerm !== '' || typeFilter !== 'all' || workModeFilter !== 'all' || skillFilter !== 'all' || sortBy !== 'match';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>Smart Opportunity Engine</span>
            </span>
            <span className="text-xs text-slate-400">
              Assessed Persona: <strong className="text-white">{latestAssessment?.recommendedRole || 'Full Stack Engineer'}</strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
            Verified Industry Placements &amp; Programs
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Every position is calibrated against your standardized 10-point skill evaluation with transparent competency alignment.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start lg:self-auto">
          <div className="px-4 py-2 rounded-2xl glass-panel text-center">
            <div className="text-lg font-black gradient-text">{filteredAndSortedOpportunities.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Matching Roles</div>
          </div>
          <div className="px-4 py-2 rounded-2xl glass-panel text-center">
            <div className="text-lg font-black text-emerald-400">
              {filteredAndSortedOpportunities.filter(o => o.matchResult.matchPercentage >= 75).length}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">High Match (&gt;75%)</div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, Indian employer, skill, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-950/80 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="md:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950/80 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="all">All Types (5)</option>
              <option value="internship">Internship</option>
              <option value="job">Full-Time Job</option>
              <option value="apprenticeship">Apprenticeship</option>
              <option value="workshop">Workshop</option>
              <option value="fdp">Faculty Dev (FDP)</option>
            </select>
          </div>

          {/* Work Mode Filter */}
          <div className="md:col-span-2">
            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950/80 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="all">All Work Modes</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on_site">On-Site</option>
            </select>
          </div>

          {/* Skill Filter */}
          <div className="md:col-span-3">
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950/80 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="all">All Required Skills</option>
              {uniqueSkills.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Row: Sorting & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-medium">Sort Listings By:</span>
            <div className="flex items-center space-x-1.5">
              {[
                { id: 'match', label: 'Highest Smart Match' },
                { id: 'newest', label: 'Recently Posted' },
                { id: 'openings', label: 'Openings Count' },
                { id: 'deadline', label: 'Upcoming Deadline' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    sortBy === opt.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
            >
              <X className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Opportunity Cards Grid */}
      {filteredAndSortedOpportunities.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto border border-white/10">
          <SlidersHorizontal className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Matching Opportunities Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Try adjusting your search keywords, clearing work mode constraints, or selecting a different skill filter.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-glow-blue"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredAndSortedOpportunities.map((opp) => {
            const matchScore = opp.matchResult.matchPercentage;
            const badgeColor =
              matchScore >= 80
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : matchScore >= 65
                ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30';

            return (
              <div
                key={opp.id}
                className="glass-card rounded-2xl border border-white/10 p-5 sm:p-6 flex flex-col justify-between hover:border-blue-500/40 transition-all hover:shadow-xl group"
              >
                <div className="space-y-3.5">
                  {/* Card Header: Type, Work Mode, Match Score */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {formatOpportunityType(opp.type)}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {opp.workMode || 'Hybrid'}
                      </span>
                    </div>

                    <div className={`px-2.5 py-1 rounded-full text-xs font-black border flex items-center space-x-1 flex-shrink-0 ${badgeColor}`}>
                      <Sparkles className="w-3 h-3" />
                      <span>{matchScore}% Match</span>
                    </div>
                  </div>

                  {/* Title & Employer */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                      {opp.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium mt-1">
                      <Building2 className="w-3.5 h-3.5 text-violet-400" />
                      <span>{opp.company}</span>
                    </div>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Required Skills Chips */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Required Skills &amp; Match:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.requiredSkills?.map((skill) => {
                        const isMatched = opp.matchResult.matchedSkills.includes(skill);
                        return (
                          <span
                            key={skill}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                              isMatched
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-900/60 text-slate-400 border-white/5'
                            }`}
                          >
                            {isMatched ? '✓ ' : ''}{skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Metadata: Location, Stipend, Duration, Openings */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-white/5">
                    <div className="flex items-center space-x-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{opp.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 truncate font-medium text-emerald-300">
                      <DollarSign className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{opp.stipendOrSalary}</span>
                    </div>
                    {opp.duration && (
                      <div className="flex items-center space-x-1 truncate">
                        <Clock className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{opp.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1 truncate">
                      <Users className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <span>{opp.openingsCount || 1} Openings</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleOpenDetail(opp)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold glass-panel text-slate-300 hover:text-white border border-white/10 hover:border-blue-500/40 transition-all flex items-center space-x-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => {
                      setApplyConfirmOpp(opp);
                      setApplyConfirmMatch(opp.matchResult);
                    }}
                    disabled={opp.isApplied}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      opp.isApplied
                        ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/5'
                        : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-glow-blue'
                    }`}
                  >
                    {opp.isApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Applied ✓</span>
                      </>
                    ) : (
                      <span>Apply Now</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOpportunity && selectedMatchResult && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          matchResult={selectedMatchResult}
          isOpen={Boolean(selectedOpportunity)}
          onClose={() => setSelectedOpportunity(null)}
          isAlreadyApplied={applications.some(a => a.opportunityId === selectedOpportunity.id)}
          onApplyPlaceholder={() => {
            setApplyConfirmOpp(selectedOpportunity);
            setApplyConfirmMatch(selectedMatchResult);
          }}
        />
      )}

      {/* Apply Confirmation Modal */}
      {applyConfirmOpp && (
        <ApplyConfirmationModal
          opportunity={applyConfirmOpp}
          matchResult={applyConfirmMatch}
          isOpen={Boolean(applyConfirmOpp)}
          onClose={() => setApplyConfirmOpp(null)}
          isAlreadyApplied={applications.some(a => a.opportunityId === applyConfirmOpp.id)}
          onConfirmApply={async (opp, msg) => {
            await onQuickApply(opp, msg);
            setApplyConfirmOpp(null);
            setSelectedOpportunity(null);
          }}
        />
      )}
    </div>
  );
};