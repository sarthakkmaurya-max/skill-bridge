import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeroProps {
  onOpenAuth: (defaultTab?: 'signin' | 'signup') => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAuth, onScrollToSection }) => {
  const { user, signInAsDemo } = useAuth();

  return (
    <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
      {/* Background glow highlights */}
      <div className="glow-spot-blue top-10 left-1/4 -translate-x-1/2 -z-10" />
      <div className="glow-spot-violet top-40 right-10 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 text-left space-y-8">
            
            {/* Tag / Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide shadow-glow-blue">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Academia–Industry Collaboration Portal</span>
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              <span className="text-slate-300">Live Skill Mapping</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Bridge The Skill Gap Between{' '}
              <span className="gradient-text">Higher Education</span>{' '}
              & Industry Reality.
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
              Empowering students with AI-driven <span className="text-white font-medium">Role Readiness Scores</span>, providing recruiters with pre-validated talent pipelines, and giving universities real-time curricular demand analytics.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => user ? onScrollToSection('preview') : onOpenAuth('signup')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm shadow-glow-blue transition-all flex items-center space-x-2.5 group"
              >
                <span>{user ? 'Explore Skill Engine' : 'Get Started Free'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onScrollToSection('preview')}
                className="px-6 py-3.5 rounded-xl glass-panel hover:border-blue-500/40 text-slate-200 font-semibold text-sm transition-all flex items-center space-x-2"
              >
                <span>Live Interactive Demo</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {!user && (
                <button
                  onClick={() => signInAsDemo('student')}
                  className="px-4 py-3 rounded-xl border border-white/10 hover:border-violet-500/40 text-xs font-medium text-violet-300 hover:text-white transition-all bg-violet-950/20"
                >
                  ⚡ Quick Demo Persona
                </button>
              )}
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">94%</div>
                <div className="text-xs text-slate-400 mt-0.5">Placement Match Accuracy</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">120+</div>
                <div className="text-xs text-slate-400 mt-0.5">Industry Competencies</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">RLS Data Security</div>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Glassmorphism Readiness Preview Card */}
          <div className="lg:col-span-5 relative">
            
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-violet-600/20 rounded-3xl blur-2xl -z-10" />

            {/* Main Interactive Glass Card */}
            <div className="glass-card rounded-2xl p-6 sm:p-7 border border-white/15 shadow-2xl relative overflow-hidden">
              
              {/* Header inside Card */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Full-Stack Cloud Engineer</h2>
                    <span className="text-xs text-slate-400">Industry Target Profile • Q3 Standard</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>High Alignment</span>
                </span>
              </div>

              {/* Match Score Display */}
              <div className="py-6 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Role Readiness Index
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black gradient-text">88%</span>
                    <span className="text-xs text-slate-400">/ 100%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 h-full rounded-full transition-all duration-1000 shadow-glow-blue"
                    style={{ width: '88%' }}
                  />
                </div>
              </div>

              {/* Verified Competencies Pill Stack */}
              <div className="space-y-2.5 pt-1">
                <div className="text-xs text-slate-400 font-medium">Mapped & Verified Competencies:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    <span>React 18 & TypeScript</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    <span>Node.js & Express API</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-violet-400" />
                    <span>Supabase PostgreSQL</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>REST & RLS Policies</span>
                  </span>
                </div>
              </div>

              {/* AI Skill Gap Recommendation Box */}
              <div className="mt-5 p-3.5 rounded-xl bg-gradient-to-r from-blue-950/60 to-violet-950/60 border border-blue-500/20 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-blue-300">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  <span>Optimal Path to 100% Match:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Acquire <span className="text-white font-medium">Docker Containerization</span> &amp; <span className="text-white font-medium">CI/CD Pipeline Automation</span> to unlock 14 priority recruiter shortlists.
                </p>
              </div>

              {/* Card Footer Micro Bar */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Supabase Auth & RLS Guarded</span>
                </div>
                <div className="flex items-center space-x-1 text-slate-300">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  <span>18 Live Openings</span>
                </div>
              </div>

            </div>

            {/* Floating auxiliary badge */}
            <div className="absolute -bottom-5 -left-5 glass-panel rounded-xl px-4 py-2.5 border border-white/10 shadow-xl hidden sm:flex items-center space-x-2.5 animate-bounce-slow">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Automated Verification</div>
                <div className="text-[10px] text-slate-400">Instant Transcript & Assessment Sync</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
