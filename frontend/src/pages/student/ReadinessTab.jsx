import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Clock, 
  FileText, 
  Award, 
  TrendingUp,
  ArrowRight,
  Target,
  BarChart3,
  Compass
} from 'lucide-react';

export default function ReadinessTab({ profileData, onStartQuiz, onSelectRole }) {
  const readiness = profileData?.roleReadiness || {
    frontend: { percentage: 68, strengths: ['HTML/CSS', 'Modern JavaScript'], gaps: ['React', 'Git'], recommendation: 'You are 68% ready for Frontend Developer. Improve React and Git.' },
    dataAnalyst: { percentage: 50, strengths: ['Basic Problem Solving'], gaps: ['SQL', 'Python'], recommendation: 'You are 50% ready for Data Analyst. Improve SQL and Python.' },
    backend: { percentage: 65, strengths: ['REST APIs'], gaps: ['Database Indexing'], recommendation: 'You are 65% ready for Backend Developer. Improve Database Indexing.' },
  };

  const cards = [
    { key: 'frontend', title: 'Frontend Developer', accentGlow: 'from-blue-500 to-indigo-600', barColor: 'bg-gradient-to-r from-blue-500 to-indigo-500', data: readiness.frontend },
    { key: 'dataAnalyst', title: 'Data Analyst', accentGlow: 'from-emerald-500 to-teal-600', barColor: 'bg-gradient-to-r from-emerald-400 to-teal-500', data: readiness.dataAnalyst },
    { key: 'backend', title: 'Backend Developer', accentGlow: 'from-violet-500 to-purple-600', barColor: 'bg-gradient-to-r from-violet-500 to-purple-500', data: readiness.backend },
  ];

  // Floating skill pills data with staggered animation offsets
  const floatingSkills = [
    { name: 'React', color: 'border-blue-400/30 text-blue-300 bg-blue-500/10', yOffset: [0, -6, 0], duration: 4.2, top: '15%', left: '10%' },
    { name: 'Python', color: 'border-violet-400/30 text-violet-300 bg-violet-500/10', yOffset: [0, 7, 0], duration: 4.8, top: '70%', left: '8%' },
    { name: 'SQL', color: 'border-emerald-400/30 text-emerald-300 bg-emerald-500/10', yOffset: [0, -7, 0], duration: 5.1, top: '25%', right: '15%' },
    { name: 'Git', color: 'border-amber-400/30 text-amber-300 bg-amber-500/10', yOffset: [0, 6, 0], duration: 4.5, top: '75%', right: '18%' },
    { name: 'Communication', color: 'border-purple-400/30 text-purple-300 bg-purple-500/10', yOffset: [0, -5, 0], duration: 5.4, top: '48%', left: '48%' },
  ];

  return (
    <div className="space-y-8">
      {/* 2-COLUMN BALANCED HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1836]/90 via-[#0d1c42]/80 to-[#12133a]/80 border border-white/10 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-2xl"
      >
        {/* Subtle Ambient Background Orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold tracking-wide"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Career Readiness & Industry Alignment
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-3"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Discover your{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                  career readiness
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Benchmark your technical proficiency and workplace problem-solving against real job descriptions to identify your exact role fit and priority learning paths.
              </p>
            </motion.div>

            {/* Abstract Career Skill-Network Graph with Floating Skill Pills */}
            <div className="relative h-44 sm:h-52 w-full rounded-2xl bg-[#091530]/60 border border-white/5 overflow-hidden p-4 shadow-inner">
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Abstract Career SVG Network Graph */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path d="M 60 40 Q 180 80 280 50 T 460 90 T 600 40" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 40 140 Q 160 110 320 150 T 520 120" fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" strokeOpacity="0.5" />
                <circle cx="60" cy="40" r="4" fill="#3B82F6" />
                <circle cx="280" cy="50" r="5" fill="#8B5CF6" />
                <circle cx="460" cy="90" r="4" fill="#34D399" />
                <circle cx="320" cy="150" r="4" fill="#60A5FA" />
              </svg>

              {/* Floating Skill Pills drifting in subtle infinite loops */}
              {floatingSkills.map((pill, idx) => (
                <motion.span
                  key={pill.name}
                  animate={{ y: pill.yOffset }}
                  transition={{
                    duration: pill.duration,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    delay: idx * 0.4,
                  }}
                  style={{
                    position: 'absolute',
                    top: pill.top,
                    left: pill.left,
                    right: pill.right,
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-md ${pill.color} select-none`}
                >
                  {pill.name}
                </motion.span>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: ASSESSMENT CARD */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl bg-[#0d1d44]/90 border border-blue-500/20 p-6 sm:p-7 shadow-xl shadow-black/40 backdrop-blur-xl hover:border-blue-400/40 transition-all duration-300">
              {/* Pulsing Icon Ring */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border border-white/20 glow-ring">
                    <BrainCircuit className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    Role Readiness Quiz
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    10 curated technical & soft-skill questions
                  </p>
                </div>
              </div>

              {/* 3 Compact Meta Badges */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-center">
                  <span className="text-xs font-extrabold text-blue-400">10</span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Questions</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-center">
                  <span className="text-xs font-extrabold text-violet-400">5 Mins</span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Duration</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-center">
                  <span className="text-xs font-extrabold text-emerald-400">Report</span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Personalised</span>
                </div>
              </div>

              {/* "What You Will Receive" Area */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2.5 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-blue-400" /> What you will receive:
                </span>
                <ul className="space-y-2 text-xs font-medium text-slate-200">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span><strong>Skill Gap Analysis</strong> across core competencies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span><strong>Role Readiness Score</strong> for 3 career tracks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span><strong>Recommended Opportunities</strong> with high match %</span>
                  </li>
                </ul>
              </div>

              {/* Gradient CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStartQuiz}
                className="group relative w-full py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Assessment</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 3 ROLE READINESS CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Your Career Track Alignment</h2>
            <p className="text-xs text-slate-400">Evaluated against real-time industry job standards</p>
          </div>
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" /> Live Benchmark
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const pct = card.data?.percentage || 0;
            const isHigh = pct >= 75;
            const isMedium = pct >= 50;

            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative rounded-2xl bg-[#0c1836]/70 border border-white/10 p-6 shadow-xl backdrop-blur-xl hover:border-blue-400/30 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header & Score Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-extrabold text-base text-white tracking-tight">{card.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                      isHigh
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : isMedium
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {pct}% Ready
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900/80 h-2.5 rounded-full overflow-hidden mb-4 p-0.5 border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 * idx, ease: 'easeOut' }}
                      className={`h-full rounded-full ${card.barColor} shadow-sm`}
                    />
                  </div>

                  {/* Recommendation Box */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 mb-4">
                    <p className="text-xs font-medium text-slate-200 leading-relaxed">
                      💡 {card.data?.recommendation || `You are ${pct}% ready for ${card.title}.`}
                    </p>
                  </div>

                  {/* Strengths (Mint Green) */}
                  <div className="mb-3">
                    <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Strengths
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(card.data?.strengths || []).length > 0 ? (
                        card.data.strengths.map((str, sIdx) => (
                          <span key={sIdx} className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[11px] font-semibold border border-emerald-500/20">
                            {str}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400">Complete assessment to populate</span>
                      )}
                    </div>
                  </div>

                  {/* Gaps (Amber) */}
                  <div>
                    <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Skill Gaps to Improve
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(card.data?.gaps || []).length > 0 ? (
                        card.data.gaps.map((gap, gIdx) => (
                          <span key={gIdx} className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[11px] font-semibold border border-amber-500/20">
                            {gap}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-semibold">No major gaps identified!</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => onSelectRole(card.title.split(' ')[0])}
                    className="w-full py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 hover:text-white text-xs font-bold transition-all border border-white/5 hover:border-white/10 flex items-center justify-center gap-1.5"
                  >
                    View {card.title} Roles <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}