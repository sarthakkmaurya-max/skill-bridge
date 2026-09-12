import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Code2, 
  Database, 
  Cloud, 
  BrainCircuit, 
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RoleBenchmark {
  id: string;
  title: string;
  category: string;
  matchScore: number;
  openingsCount: number;
  description: string;
  matchedSkills: { name: string; level: string }[];
  missingSkills: { name: string; priority: 'high' | 'medium'; learningHours: string }[];
  recommendedAction: string;
}

const BENCHMARKS: RoleBenchmark[] = [
  {
    id: 'fullstack',
    title: 'Full-Stack Software Engineer',
    category: 'Application Engineering',
    matchScore: 88,
    openingsCount: 42,
    description: 'Designs end-to-end web architectures, microservices, and reactive user interfaces using modern TypeScript ecosystems.',
    matchedSkills: [
      { name: 'TypeScript & React 18', level: 'Advanced' },
      { name: 'Node.js & Express API', level: 'Intermediate' },
      { name: 'PostgreSQL & Supabase RLS', level: 'Advanced' },
      { name: 'Tailwind CSS & Glassmorphism', level: 'Advanced' },
    ],
    missingSkills: [
      { name: 'Docker & Microservice Orchestration', priority: 'high', learningHours: '12 hrs' },
      { name: 'Redis Cache Layering', priority: 'medium', learningHours: '8 hrs' },
    ],
    recommendedAction: 'Complete the Docker & Containerization Assessment module to reach a 96% match and unlock priority interviews.',
  },
  {
    id: 'data-ai',
    title: 'AI & Data Intelligence Specialist',
    category: 'Data Science & ML',
    matchScore: 74,
    openingsCount: 28,
    description: 'Implements predictive models, data processing pipelines, and vector database embeddings for enterprise applications.',
    matchedSkills: [
      { name: 'Python & NumPy / Pandas', level: 'Advanced' },
      { name: 'SQL & Database Optimization', level: 'Advanced' },
      { name: 'Data Visualization & Reporting', level: 'Intermediate' },
    ],
    missingSkills: [
      { name: 'PyTorch / TensorFlow Deep Learning', priority: 'high', learningHours: '20 hrs' },
      { name: 'Vector Search & Embeddings (pgvector)', priority: 'high', learningHours: '10 hrs' },
      { name: 'MLOps Pipeline Deployment', priority: 'medium', learningHours: '14 hrs' },
    ],
    recommendedAction: 'Take the pgvector + LLM integration benchmark to increase role readiness by +16%.',
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Systems & DevOps Engineer',
    category: 'Cloud Infrastructure',
    matchScore: 82,
    openingsCount: 35,
    description: 'Automates infrastructure as code, manages multi-region cloud resilience, and enforces zero-trust security policies.',
    matchedSkills: [
      { name: 'Linux Administration & Shell', level: 'Advanced' },
      { name: 'Git & Automated Workflows', level: 'Advanced' },
      { name: 'REST & GraphQL Architecture', level: 'Intermediate' },
    ],
    missingSkills: [
      { name: 'Kubernetes Cluster Management', priority: 'high', learningHours: '18 hrs' },
      { name: 'Terraform Infrastructure as Code', priority: 'medium', learningHours: '12 hrs' },
    ],
    recommendedAction: 'Validate AWS/GCP cloud basics via institutional credential badge to unlock top-tier recruiter shortlists.',
  },
];

interface SkillMappingPreviewProps {
  onOpenAuth: (defaultTab?: 'signin' | 'signup') => void;
}

export const SkillMappingPreview: React.FC<SkillMappingPreviewProps> = ({ onOpenAuth }) => {
  const [selectedRole, setSelectedRole] = useState<RoleBenchmark>(BENCHMARKS[0]);
  const { user } = useAuth();

  return (
    <section id="preview" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
            <BrainCircuit className="w-4 h-4" />
            <span>Interactive Competency Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Map Your Academic Curricula to <span className="gradient-text">Live Industry Roles</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            SkillBridge calculates your real-time Role Readiness index by evaluating college courses, personal projects, and verified assessment credentials.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {BENCHMARKS.map((benchmark) => {
            const isSelected = selectedRole.id === benchmark.id;
            return (
              <button
                key={benchmark.id}
                onClick={() => setSelectedRole(benchmark)}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-glow-blue border border-blue-400/40'
                    : 'glass-panel text-slate-300 hover:text-white hover:border-white/20'
                }`}
              >
                {benchmark.id === 'fullstack' && <Code2 className="w-4 h-4" />}
                {benchmark.id === 'data-ai' && <Database className="w-4 h-4" />}
                {benchmark.id === 'cloud-devops' && <Cloud className="w-4 h-4" />}
                <span>{benchmark.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {benchmark.matchScore}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Detail Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-10 border border-white/10 shadow-2xl relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Role Info & Score Gauge */}
            <div className="lg:col-span-4 space-y-6 lg:border-r lg:border-white/10 lg:pr-8">
              <div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  {selectedRole.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">{selectedRole.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  {selectedRole.description}
                </p>
              </div>

              {/* Match Score Display */}
              <div className="p-5 rounded-xl bg-navy-950/70 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Readiness Score</span>
                  <span className="text-2xl font-black gradient-text">{selectedRole.matchScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${selectedRole.matchScore}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                  <span>Target: 85%+ for Direct Shortlist</span>
                  <span className="text-emerald-400 font-semibold">{selectedRole.openingsCount} Active Openings</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm shadow-glow-blue transition-all flex items-center justify-center space-x-2"
              >
                <span>{user ? 'View Role Opportunities' : 'Unlock Complete Assessment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Skills Breakdown (Strengths vs Gaps) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Matched Strengths */}
              <div>
                <div className="flex items-center space-x-2 text-sm font-semibold text-emerald-400 mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Competencies ({selectedRole.matchedSkills.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedRole.matchedSkills.map((skill, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-navy-900/60 border border-emerald-500/20 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500" />
                        <span className="text-xs font-medium text-slate-200">{skill.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Identified Gaps */}
              <div>
                <div className="flex items-center space-x-2 text-sm font-semibold text-amber-400 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>Targeted Skill Gaps to Bridge ({selectedRole.missingSkills.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedRole.missingSkills.map((gap, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-navy-900/60 border border-amber-500/20 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-500" />
                        <div>
                          <div className="text-xs font-medium text-slate-200">{gap.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Estimated prep: {gap.learningHours}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                        gap.priority === 'high' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {gap.priority} priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Bridge Recommendation Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-violet-900/30 border border-blue-500/20 flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 space-y-1">
                  <span className="font-semibold text-white">SkillBridge Recommendation: </span>
                  {selectedRole.recommendedAction}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
