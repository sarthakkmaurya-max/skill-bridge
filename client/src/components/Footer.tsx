import React from 'react';
import { Compass, Shield, Database, Github, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-navy-950/90 text-slate-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/5">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Skill<span className="gradient-text">Bridge</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Academia–Industry Collaboration Portal for real-time skill mapping, verified role readiness, and frictionless placement pipelines.
            </p>
            <div className="flex items-center space-x-2 pt-1 text-[11px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Row-Level Security Enabled</span>
            </div>
          </div>

          {/* Navigation Column 1 */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Skill Engine</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><a href="#preview" className="hover:text-blue-400 transition-colors">Role Readiness Index</a></li>
              <li><a href="#preview" className="hover:text-blue-400 transition-colors">Curriculum Gap Analysis</a></li>
              <li><a href="#preview" className="hover:text-blue-400 transition-colors">Verified Skill Catalog</a></li>
              <li><a href="#preview" className="hover:text-blue-400 transition-colors">Assessment Benchmarks</a></li>
            </ul>
          </div>

          {/* Navigation Column 2 */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Stakeholders</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Student Career Hub</a></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Recruiter Talent Pipeline</a></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">University Placement Cell</a></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Accreditation (NBA/NAAC)</a></li>
            </ul>
          </div>

          {/* Tech Stack & Architecture */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Stack &amp; Security</h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">React 18 + TS</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">Tailwind CSS</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">Node.js Express</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">Supabase Auth</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">PostgreSQL RLS</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-2">
              Strict environment isolation with zero hardcoded API credentials.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} SkillBridge Portal. Built for Academia &amp; Enterprise Synergy.
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Security Practices</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
