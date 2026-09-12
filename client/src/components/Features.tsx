import React, { useState } from 'react';
import { 
  GraduationCap, 
  Building2, 
  School, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  BarChart3, 
  KeyRound, 
  Server, 
  Database, 
  Layers
} from 'lucide-react';

export const Features: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'recruiters' | 'colleges'>('students');

  return (
    <section id="features" className="py-20 lg:py-28 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Layers className="w-4 h-4" />
            <span>Three-Way Collaboration Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for <span className="gradient-text">Every Stakeholder</span> in Higher Education
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            SkillBridge replaces manual resumes and intuition-based hiring with verified competency mapping across Students, Industry Recruiters, and University Deans.
          </p>
        </div>

        {/* Pillar Switcher Tabs */}
        <div className="flex justify-center max-w-xl mx-auto p-1.5 rounded-2xl glass-panel border border-white/10 mb-12">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'students'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>For Students</span>
          </button>
          <button
            onClick={() => setActiveTab('recruiters')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'recruiters'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-glow-violet'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>For Recruiters</span>
          </button>
          <button
            onClick={() => setActiveTab('colleges')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'colleges'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <School className="w-4 h-4" />
            <span>For Universities</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTab === 'students' && (
            <>
              <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 space-y-4 hover:border-blue-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">AI-Driven Role Readiness</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Real-time index scores measuring exactly where you stand against live openings for SWE, Data, and Cloud engineering roles.
                </p>
                <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Personalized Competency Radar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Actionable Bridge Pathways</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 space-y-4 hover:border-blue-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Verified Skill Badging</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Validate practical coding proficiencies through standardized problem sets and college transcript integration.
                </p>
                <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>Tamper-proof credential records</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>PostgreSQL RLS Protected Data</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 space-y-4 hover:border-blue-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Direct Internship Matching</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Apply with one click to verified recruiter postings where your role readiness score meets or exceeds requirements.
                </p>
                <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-400" />
                    <span>Match percentage on every job</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-400" />
                    <span>Zero blind resume filtering</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'recruiters' && (
            <>
              <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 space-y-4 hover:border-violet-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Precision Competency Search</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Query candidates by exact tech stacks, verified skill benchmarks, and readiness percentiles instead of keyword resumes.
                </p>
                <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-400" />
                    <span>Cut time-to-hire by 65%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-400" />
                    <span>Pre-screened coding proficiencies</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 space-y-4 hover:border-violet-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Campus Pipeline Management</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Host multi-college placement drives, schedule technical interviews, and issue offers directly through a unified recruiter portal.
                </p>
                <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Seamless college collaboration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Automated application status pipeline</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 space-y-4 hover:border-violet-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Custom Role Blueprints</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Publish specific skill weighting matrices to signal emerging technology needs directly to university curriculum chairs.
                </p>
                <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Define target competency scores</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Drive industry-academic synergy</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'colleges' && (
            <>
              <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 space-y-4 hover:border-emerald-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <School className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Curriculum Demand Alignment</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Identify emerging market skills lacking in standard university syllabi and modernize engineering coursework with data.
                </p>
                <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Macro gap heatmaps by department</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Industry advisory board insights</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 space-y-4 hover:border-emerald-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Placement Velocity Analytics</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Track batch-level conversion rates, average stipend levels, and student participation across all branches in real-time.
                </p>
                <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Cohort readiness distribution</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>One-click accreditation exports</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 space-y-4 hover:border-emerald-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Accreditation Ready (NAAC/NBA)</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Export auditable placement outcomes, industry MOUs, and continuous student competency development records.
                </p>
                <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-400" />
                    <span>Compliant reporting data models</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-400" />
                    <span>Auditable student records</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Architecture Section */}
        <div id="architecture" className="mt-24 pt-16 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-white">Enterprise Full-Stack Architecture</h3>
            <p className="text-sm text-slate-400 mt-2">
              Clean monorepo separation with zero-secret exposure and end-to-end type safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center space-x-2 text-blue-400 text-sm font-semibold">
                <Cpu className="w-4 h-4" />
                <span>client/ (Frontend)</span>
              </div>
              <p className="text-xs text-slate-400">
                React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite fast bundler.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-400 text-sm font-semibold">
                <Server className="w-4 h-4" />
                <span>server/ (Backend)</span>
              </div>
              <p className="text-xs text-slate-400">
                Node.js, Express, TypeScript, Helmet security, Supabase Bearer Auth Middleware.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center space-x-2 text-violet-400 text-sm font-semibold">
                <Database className="w-4 h-4" />
                <span>supabase/ (PostgreSQL)</span>
              </div>
              <p className="text-xs text-slate-400">
                PostgreSQL schema, Row Level Security (RLS), automated `handle_new_user()` trigger.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 text-sm font-semibold">
                <Lock className="w-4 h-4" />
                <span>Security & Secrets</span>
              </div>
              <p className="text-xs text-slate-400">
                Zero hardcoded keys. Isolated `.env.example`, protected git boundaries.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
