import React from 'react';
import { AdminAnalyticsData } from '@skillbridge/shared';
import { 
  TrendingUp, 
  BarChart3, 
  AlertTriangle, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

interface AdminAnalyticsTabProps {
  analytics: AdminAnalyticsData;
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({ analytics }) => {
  const {
    kpis,
    skillGaps,
    inDemandSkills,
    readinessDistribution,
    branchOutcomes,
    applicationStatusBreakdown,
  } = analytics;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <span>Campus Talent Analytics &amp; Skill Demand Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical distribution of role readiness, curriculum skill gaps, and industry recruitment alignment
          </p>
        </div>
        <span className="text-xs font-semibold text-indigo-400 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 self-start sm:self-auto">
          Cohort Size: {kpis.totalStudents} Students
        </span>
      </div>

      {/* Row 1: Skill Gaps & Top In-Demand Employer Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Common Skill Gaps */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">Curriculum Skill Gaps (Need Intervention)</h3>
            </div>
            <span className="text-[11px] text-slate-400">Assessed Cohort Gaps</span>
          </div>

          <p className="text-xs text-slate-400">
            Competencies where students scored lowest on standardized assessments relative to job requirements.
          </p>

          <div className="space-y-3 pt-1">
            {skillGaps.map((gap) => (
              <div key={gap.skill} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{gap.skill}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-[11px]">{gap.studentCount} students affected</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      gap.gapLevel === 'high'
                        ? 'bg-red-500/20 text-red-300'
                        : gap.gapLevel === 'medium'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {gap.percentage}% Gap
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      gap.gapLevel === 'high'
                        ? 'bg-red-500'
                        : gap.gapLevel === 'medium'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${gap.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
            <strong>Actionable Recommendation:</strong> Organize a 2-week hands-on Docker &amp; SQL Query Tuning workshop prior to upcoming placement drives.
          </div>
        </div>

        {/* In-Demand Skills by Industry Recruiters */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-violet-400" />
              <h3 className="text-base font-bold text-white">Top Employer Requested Competencies</h3>
            </div>
            <span className="text-[11px] text-slate-400">Recruiter Demand Index</span>
          </div>

          <p className="text-xs text-slate-400">
            Skills most frequently specified across active campus placement job descriptions and internships.
          </p>

          <div className="space-y-3 pt-1">
            {inDemandSkills.map((item) => (
              <div key={item.skill} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.skill}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-400">{item.demandCount} Active Openings</span>
                    <span className="font-bold text-violet-400 text-xs">Score: {item.demandScore}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-blue-500 h-full rounded-full"
                    style={{ width: `${item.demandScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-[11px] text-violet-300">
            <strong>Recruitment Synergy:</strong> 74% of corporate partners mandate React and Node.js for software engineering tracks.
          </div>
        </div>

      </div>

      {/* Row 2: Role Readiness Distribution & Application Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Role Readiness Distribution Curve */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Role Readiness Distribution Curve</span>
            </h3>
            <span className="text-xs font-bold text-emerald-400">Avg {kpis.averageRoleReadiness}%</span>
          </div>

          <p className="text-xs text-slate-400">
            Cohort segmentation based on verified 10-skill standardized role readiness benchmarks.
          </p>

          {/* SVG Visual Distribution Bar Chart */}
          <div className="pt-3 space-y-3">
            {readinessDistribution.map((tier) => (
              <div key={tier.range} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{tier.range}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-[11px]">{tier.count} Students</span>
                    <span className="font-bold text-white text-xs">{tier.percentage}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${tier.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Status Funnel */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Application Screening &amp; Conversion Funnel</span>
            </h3>
            <span className="text-xs font-bold text-teal-400">{kpis.totalApplications} Submissions</span>
          </div>

          <p className="text-xs text-slate-400">
            Conversion stages from student submission through recruiter review, interviews, and final selection.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
            {[
              { label: 'Applied', count: applicationStatusBreakdown.Applied, color: 'text-teal-400', bg: 'bg-teal-500/15 border-teal-500/30' },
              { label: 'Shortlisted', count: applicationStatusBreakdown.Shortlisted, color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
              { label: 'Interview', count: applicationStatusBreakdown.Interview, color: 'text-violet-400', bg: 'bg-violet-500/15 border-violet-500/30' },
              { label: 'Selected', count: applicationStatusBreakdown.Selected, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
              { label: 'Rejected', count: applicationStatusBreakdown.Rejected, color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' },
            ].map((stage) => (
              <div key={stage.label} className={`p-3 rounded-2xl border text-center ${stage.bg} space-y-1`}>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{stage.label}</span>
                <span className={`text-xl font-black ${stage.color}`}>{stage.count}</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-200">
            <strong>Conversion Metric:</strong> 63% of interviewed students receive final offer letters.
          </div>
        </div>

      </div>

      {/* Row 3: Branch / Department-wise Outcomes */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <span>Departmental Placement Outcomes (Branch-wise Breakdown)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Comparative placement performance across academic departments</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-navy-900/60 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Department / Branch</th>
                <th className="py-3 px-4 text-center">Enrolled Students</th>
                <th className="py-3 px-4 text-center">Placed Candidates</th>
                <th className="py-3 px-4 text-center">Placement Rate</th>
                <th className="py-3 px-4">Progress Visual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {branchOutcomes.map((branch) => (
                <tr key={branch.branch} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{branch.branch}</td>
                  <td className="py-3 px-4 text-center text-slate-300">{branch.totalStudents}</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">{branch.placedCount}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {branch.placementRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 w-48">
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                        style={{ width: `${branch.placementRate}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
