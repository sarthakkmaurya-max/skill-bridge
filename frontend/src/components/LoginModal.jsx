import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  School, 
  Building2,
  Sparkles,
  ArrowRight,
  Layers,
  Zap
} from 'lucide-react';

export default function LoginModal() {
  const { login, register, loginWithGoogle, quickDemoLogin, isSupabaseEnabled, oauthError } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          name,
          email,
          password,
          role,
          college: role === 'recruiter' ? '' : college,
          company: role === 'recruiter' ? company : '',
        });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle(role);
    } catch (err) {
      setError(err.message || 'Google sign-in error');
      setGoogleLoading(false);
    }
  };

  const handleDemo = async (demoRole) => {
    setError('');
    setLoading(true);
    try {
      await quickDemoLogin(demoRole);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-blue-500 to-indigo-500 text-white shadow-lg shadow-brand-500/30 mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          SkillBridge
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Academia–Industry Collaboration & Placement Readiness Portal
        </p>

        {/* Supabase Integration Badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/60 border border-emerald-700/60 text-emerald-400 shadow-xs">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          {isSupabaseEnabled ? '⚡ Supabase Auth & Google OAuth Connected' : '⚡ Supabase Auth & DB Ready'}
        </div>
      </div>

      {/* 1-Click Demo Accounts Card */}
      <div className="relative sm:mx-auto sm:w-full sm:max-w-lg mb-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Instant 1-Click Demo Access
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Pre-seeded accounts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => handleDemo('student')}
              disabled={loading}
              className="flex flex-col items-start p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/60 transition-all text-left group"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <GraduationCap className="w-4 h-4" />
                </span>
                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
              </div>
              <span className="font-bold text-xs text-white">Student</span>
              <span className="text-[10px] text-slate-400">Alex Rivera</span>
            </button>

            <button
              onClick={() => handleDemo('recruiter')}
              disabled={loading}
              className="flex flex-col items-start p-3 rounded-xl bg-slate-800/80 hover:bg-blue-950/40 border border-slate-700 hover:border-blue-500/60 transition-all text-left group"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                  <Briefcase className="w-4 h-4" />
                </span>
                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
              </div>
              <span className="font-bold text-xs text-white">Recruiter</span>
              <span className="text-[10px] text-slate-400">Sarah (TechCorp)</span>
            </button>

            <button
              onClick={() => handleDemo('admin')}
              disabled={loading}
              className="flex flex-col items-start p-3 rounded-xl bg-slate-800/80 hover:bg-purple-950/40 border border-slate-700 hover:border-purple-500/60 transition-all text-left group"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
              </div>
              <span className="font-bold text-xs text-white">College Admin</span>
              <span className="text-[10px] text-slate-400">Prof. Vance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Login / Register Form */}
      <div className="relative sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Role Choice for Google & Registration */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Portal / Role</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'student', label: 'Student', icon: GraduationCap },
                { id: 'recruiter', label: 'Recruiter', icon: Briefcase },
                { id: 'admin', label: 'Admin', icon: ShieldCheck },
              ].map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      role === r.id
                        ? 'bg-brand-600/30 border-brand-500 text-brand-300 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-3 mb-4 disabled:opacity-60"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin shrink-0" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
          </button>

          {/* OR DIVIDER */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500 font-bold">Or with email</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-800 mb-5">
            <button
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
                !isRegister
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
                isRegister
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {(oauthError || error) && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex flex-col gap-1.5">
              <div className="flex items-center gap-2 font-bold text-red-200">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0"></span>
                <span>{oauthError ? 'Google Authentication Notice' : 'Authentication Error'}</span>
              </div>
              <p className="text-red-300/90 pl-4">{oauthError || error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Patel"
                      className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {role === 'recruiter' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. TechCorp Labs"
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">College / University</label>
                    <div className="relative">
                      <School className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g. Stanford Engineering"
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-bold text-sm shadow-md shadow-brand-600/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isRegister ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}