import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  LogOut, 
  Layers,
  Zap,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, quickDemoLogin, isSupabaseEnabled, authProvider } = useAuth();

  if (!user) return null;

  const roles = [
    { id: 'student', label: 'Student', icon: GraduationCap, badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'recruiter', label: 'Recruiter', icon: Briefcase, badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  ];

  const currentRole = roles.find((r) => r.id === user.role) || roles[0];
  const RoleIcon = currentRole.icon;

  return (
    <header className="sticky top-0 z-50 bg-[#081225]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 border border-white/20"
            >
              <Layers className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
                SkillBridge
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Zap className="w-2.5 h-2.5 text-blue-400" />
                {authProvider === 'google' ? 'Google' : authProvider === 'supabase' ? 'Supabase' : 'SaaS'}
              </span>
            </div>
          </div>

          {/* Role Switcher as Animated Segmented Control */}
          <div className="hidden md:flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 shadow-inner">
            {roles.map((r) => {
              const isSelected = user.role === r.id;
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  onClick={() => quickDemoLogin(r.id)}
                  className={`relative px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 z-10 ${
                    isSelected ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="roleIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg shadow-md -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5" />
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* User Profile Area */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2.5 pl-2">
              {/* Avatar Initial */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/15 flex items-center justify-center text-xs font-bold text-blue-300 shadow-inner">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* Name & Role */}
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-100 leading-tight flex items-center gap-1 justify-end">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                  {user.college || user.company || user.email}
                </p>
              </div>

              {/* Role Badge */}
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${currentRole.badgeColor}`}>
                <RoleIcon className="w-3 h-3" />
                {currentRole.label}
              </span>
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}