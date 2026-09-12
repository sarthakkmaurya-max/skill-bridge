import React from 'react';
import { 
  AssessmentResult, 
  SkillScoreItem 
} from '@skillbridge/shared';
import { 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Sparkles, 
  Briefcase, 
  TrendingUp, 
  ArrowRight, 
  Award, 
  BarChart3, 
  ShieldCheck,
  Code2,
  Database,
  Cpu
} from 'lucide-react';

interface AssessmentResultsProps {
  result: AssessmentResult;
  onRetake: () => void;
  onExploreOpportunities?: () => void;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  result,
  onRetake,
  onExploreOpportunities,
}) => {
  const { 
    totalScore, 
    maxScore, 
    percentage, 
    skillScores = {}, 
    roleReadiness, 
    recommendedRole, 
    recommendationMessage,
    completedAt 
  } = result;

  const skillList: SkillScoreItem[] = Object.values(skillScores);
  const strengths = skillList.filter((s) => s.isStrength);
  const gaps = skillList.filter((s) => s.isGap);

  // SVG circle calculation for circular score gauge
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const roleConfigs = [
    {
      key: 'frontend',
      title: 'Frontend Developer',
      icon: <Code2 className="w-5 h-5 text-blue-400" />,
      color: 'from-blue-600 to-indigo-600',
      border: 'border-blue-500/30',
      data: roleReadiness.frontend,
    },
    {
      key: 'data_analyst',
      title: 'Data Analyst',
      icon: <Database className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-600 to-teal-600',
      border: 'border-emerald-500/30',
      data: roleReadiness.dataAnalyst,
    },
    {
      key: 'backend',
      title: 'Backend Developer',
      icon: <Cpu className="w-5 h-5 text-violet-400" />,
      color: 'from-violet-600 to-purple-600',
      border: 'border-violet-500/30',
      data: roleReadiness.backend,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Banner: Best-Fit Career Role Recommendation */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl">
        {/* Glow ambient spots */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Animated Circular Score Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Track background circle */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-slate-800/80"
                  fill="transparent"
                />
                {/* Animated progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inside gauge label */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold text-white tracking-tight">{percentage}%</span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Readiness
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {totalScore} / {maxScore} pts
                </span>
              </div>
            </div>

            <span className="text-xs text-slate-400 mt-2">
              Evaluated {new Date(completedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Right Column: Recommendation Narrative */}
          <div className="md:col-span-8 space-y-4 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Role Alignment</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Best Match: <span className="gradient-text">{recommendedRole || 'Frontend Developer'}</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              {recommendationMessage || 'Great performance! Continue refining your skill gaps to unlock priority recruiter shortlists.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onRetake}
                className="px-4 py-2.5 rounded-xl glass-panel hover:border-white/30 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                <span>Retake Assessment</span>
              </button>

              {onExploreOpportunities && (
                <button
                  type="button"
                  onClick={onExploreOpportunities}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-bold shadow-glow-blue flex items-center space-x-2 transition-all"
                >
                  <span>View Matching Internships</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Career Role Comparison Matrix (Frontend, Data Analyst, Backend) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>Role Readiness Across Industry Tracks</span>
          </h3>
          <span className="text-xs text-slate-400">Rule-based weighted analysis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roleConfigs.map((role) => {
            const isTopMatch = role.title === recommendedRole;
            const item = role.data;
            return (
              <div
                key={role.key}
                className={`glass-card p-5 rounded-2xl border transition-all relative ${
                  isTopMatch
                    ? `${role.border} bg-navy-900/90 shadow-glow-blue scale-[1.01]`
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {isTopMatch && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ★ Top Match
                  </span>
                )}

                <div className="flex items-center space-x-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {role.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{role.title}</h4>
                    <span className="text-[11px] text-slate-400">Target Benchmark</span>
                  </div>
                </div>

                {/* Score and Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-300 font-medium">Readiness Index</span>
                    <span className="text-xl font-black text-white">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${role.color} rounded-full transition-all duration-700`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Recommendation snippet */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {item.recommendation}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Skill-Gaps Categorization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Verified Strengths (Green) */}
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Strengths ({strengths.length})</span>
            </div>
            <span className="text-[11px] text-slate-400">Rating 4–5 (80–100%)</span>
          </div>

          {strengths.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {strengths.map((s) => (
                <div
                  key={s.skillKey}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{s.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-200">
                    {s.score}/5
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No skills currently meet the 80%+ strength threshold.</p>
          )}
        </div>

        {/* Targeted Skill Gaps (Amber / Red) */}
        <div className="glass-card p-6 rounded-2xl border border-amber-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Targeted Skill Gaps ({gaps.length})</span>
            </div>
            <span className="text-[11px] text-slate-400">Rating 1–3 (&lt;75%)</span>
          </div>

          {gaps.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {gaps.map((g) => (
                <div
                  key={g.skillKey}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 ${
                    g.score <= 2
                      ? 'bg-red-500/10 border-red-500/30 text-red-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{g.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20">
                    {g.score}/5
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Congratulations! You have bridged all assessed skill gaps.</p>
          )}
        </div>

      </div>

      {/* 10-Skill Breakdown Progress Bars */}
      <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span>Complete 10-Skill Assessment Breakdown</span>
          </div>
          <span className="text-xs text-slate-400">Scores normalized (20% – 100%)</span>
        </div>

        <div className="space-y-4">
          {skillList.map((skill) => (
            <div key={skill.skillKey} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-200">{skill.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    skill.isStrength 
                      ? 'bg-emerald-500/15 text-emerald-300' 
                      : 'bg-amber-500/15 text-amber-300'
                  }`}>
                    {skill.score}/5 • {skill.isStrength ? 'Strength' : 'Improvement Gap'}
                  </span>
                </div>
                <span className="font-bold text-white">{skill.percentage}%</span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    skill.isStrength
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : skill.score <= 2
                      ? 'bg-gradient-to-r from-red-500 to-rose-400'
                      : 'bg-gradient-to-r from-amber-500 to-orange-400'
                  }`}
                  style={{ width: `${skill.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};