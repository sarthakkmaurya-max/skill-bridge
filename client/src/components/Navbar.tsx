import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  User as UserIcon, 
  LogOut, 
  Layers, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { UserRole } from '@skillbridge/shared';

interface NavbarProps {
  onOpenAuth: (defaultTab?: 'signin' | 'signup') => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onScrollToSection }) => {
  const { user, profile, activeRole, switchRole, signOut, isConfigured } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roles: { key: UserRole; label: string; color: string }[] = [
    { key: 'student', label: 'Student', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { key: 'recruiter', label: 'Recruiter', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
    { key: 'admin', label: 'College Admin', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  ];

  const currentRoleConfig = roles.find(r => r.key === activeRole) || roles[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-0.5 shadow-glow-blue flex items-center justify-center">
            <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-6 h-6 text-blue-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight text-white">Skill<span className="gradient-text">Bridge</span></span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide">Academia–Industry Collaboration</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <button 
            onClick={() => onScrollToSection('preview')} 
            className="hover:text-blue-400 transition-colors flex items-center space-x-1"
          >
            <span>Skill Engine</span>
          </button>
          <button 
            onClick={() => onScrollToSection('features')} 
            className="hover:text-blue-400 transition-colors flex items-center space-x-1"
          >
            <span>Pillars</span>
          </button>
          <button 
            onClick={() => onScrollToSection('architecture')} 
            className="hover:text-blue-400 transition-colors flex items-center space-x-1"
          >
            <span>Architecture</span>
          </button>

          {/* Configuration / Live status badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-white/5 text-xs text-slate-400">
            <div className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isConfigured ? 'Supabase Live' : 'Demo Sandbox'}</span>
          </div>
        </nav>

        {/* Right CTA / User State */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Role Switcher Pill */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className={`flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-lg border ${currentRoleConfig.color} transition-all`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{currentRoleConfig.label}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel shadow-glass border border-white/10 py-1.5 z-50 animate-fadeIn">
                    <div className="px-3 py-1 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Switch Role View
                    </div>
                    {roles.map(r => (
                      <button
                        key={r.key}
                        onClick={() => {
                          switchRole(r.key);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                          activeRole === r.key ? 'text-blue-400 font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <span>{r.label}</span>
                        {activeRole === r.key && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile Chip */}
              <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    profile?.name?.charAt(0) || <UserIcon className="w-4 h-4" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-xs font-medium text-white max-w-[110px] truncate">
                    {profile?.name || user.email?.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">{activeRole}</div>
                </div>

                <button
                  onClick={signOut}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onOpenAuth('signin')}
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-white rounded-xl group bg-gradient-to-br from-blue-600 to-violet-600 group-hover:from-blue-600 group-hover:to-violet-600 hover:shadow-glow-blue transition-all duration-300"
              >
                <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-navy-950 rounded-[10px] group-hover:bg-opacity-0 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" />
                  <span>Get Started</span>
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-3 pb-6 space-y-4 animate-fadeIn">
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => { onScrollToSection('preview'); setMobileMenuOpen(false); }}
              className="text-left text-sm text-slate-300 py-2 hover:text-blue-400"
            >
              Skill Engine
            </button>
            <button 
              onClick={() => { onScrollToSection('features'); setMobileMenuOpen(false); }}
              className="text-left text-sm text-slate-300 py-2 hover:text-blue-400"
            >
              Collaboration Pillars
            </button>
            <button 
              onClick={() => { onScrollToSection('architecture'); setMobileMenuOpen(false); }}
              className="text-left text-sm text-slate-300 py-2 hover:text-blue-400"
            >
              System Architecture
            </button>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
            {user ? (
              <div className="space-y-3">
                <div className="text-sm font-semibold text-white">Signed in as {profile?.name || user.email}</div>
                <div className="text-xs text-blue-400 uppercase tracking-wider font-semibold">Active Role: {activeRole}</div>
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-red-400 bg-red-500/10 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => { onOpenAuth('signin'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center text-sm font-medium text-white glass-panel rounded-xl"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { onOpenAuth('signup'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl"
                >
                  Register Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
