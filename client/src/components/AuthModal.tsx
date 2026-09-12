import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  GraduationCap, 
  Building2, 
  School, 
  AlertCircle, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  Info
} from 'lucide-react';
import { UserRole } from '@skillbridge/shared';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'signin',
}) => {
  const { 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    signInAsDemo, 
    isConfigured 
  } = useAuth();

  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [isRedirectingGoogle, setIsRedirectingGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (tab === 'signin') {
        const res = await signInWithEmail(email, password);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          onClose();
        }
      } else {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name');
          setLoading(false);
          return;
        }
        const res = await signUpWithEmail(email, password, name, role);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setSuccessMessage('Account created! Please check your email inbox to verify your account.');
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setIsRedirectingGoogle(true);
    setLoading(true);
    try {
      const res = await signInWithGoogle(role);
      if (res.error) {
        setErrorMessage(res.error);
        setIsRedirectingGoogle(false);
        setLoading(false);
      }
      // If successful, Supabase redirect takes over
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in could not be initiated.');
      setIsRedirectingGoogle(false);
      setLoading(false);
    }
  };

  const handleDemoAccess = (demoRole: UserRole) => {
    signInAsDemo(demoRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md rounded-2xl glass-card border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corner glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 shadow-glow-blue mb-2 text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {tab === 'signin' ? 'Welcome Back to SkillBridge' : 'Create Your SkillBridge Account'}
          </h3>
          <p className="text-xs text-slate-400">
            {tab === 'signin' 
              ? 'Sign in to access your role readiness dashboard' 
              : 'Join the next-gen academia–industry collaboration network'}
          </p>
        </div>

        {/* Environment Alert only if Supabase is unconfigured */}
        {!isConfigured && (
          <div className="mb-5 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs flex items-start space-x-2.5">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
            <div className="space-y-1 text-left">
              <div className="font-semibold text-white">Local Development Setup Notice</div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Supabase credentials are not set in <code className="bg-slate-900/90 px-1.5 py-0.5 rounded text-blue-300 font-mono">client/.env</code>. See <code className="bg-slate-900/90 px-1.5 py-0.5 rounded text-blue-300 font-mono">client/.env.example</code> to configure them.
              </p>
              <p className="text-slate-400 text-[11px]">
                You can test all portal features right away using <strong className="text-white">Quick Demo Access</strong> below!
              </p>
            </div>
          </div>
        )}

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab Toggle */}
        <div className="flex p-1 rounded-xl bg-navy-950/80 border border-white/5 mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setTab('signin'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'signin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'signup' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Target Role Selector for OAuth & Sign Up */}
        <div className="mb-3">
          <label className="block text-[11px] font-medium text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Choose Your Portal Role:</span>
            <span className="text-[10px] text-slate-400 capitalize">Active: <strong className="text-white">{role}</strong></span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-2 rounded-xl border text-center text-xs transition-all flex flex-col items-center space-y-1 ${
                role === 'student'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold shadow-glow-blue'
                  : 'border-white/5 bg-navy-950/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="text-[10px]">Student</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('recruiter')}
              className={`p-2 rounded-xl border text-center text-xs transition-all flex flex-col items-center space-y-1 ${
                role === 'recruiter'
                  ? 'bg-violet-600/20 border-violet-500 text-violet-300 font-semibold shadow-glow-violet'
                  : 'border-white/5 bg-navy-950/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="text-[10px]">Recruiter</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`p-2 rounded-xl border text-center text-xs transition-all flex flex-col items-center space-y-1 ${
                role === 'admin'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-semibold shadow-glow-emerald'
                  : 'border-white/5 bg-navy-950/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <School className="w-4 h-4" />
              <span className="text-[10px]">College</span>
            </button>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading || isRedirectingGoogle}
          className="w-full py-2.5 px-4 rounded-xl glass-panel hover:border-white/20 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-3 transition-all mb-4 hover:bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isRedirectingGoogle ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-white font-bold">Redirecting to Google…</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.27 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.73 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-wider">or email</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Select Your Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-2 rounded-xl border text-center text-xs transition-all flex flex-col items-center space-y-1 ${
                      role === 'student'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                        : 'border-white/5 bg-navy-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-[10px]">Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('recruiter')}
                    className={`p-2 rounded-xl border text-center text-xs transition-all flex flex-col items-center space-y-1 ${
                      role === 'recruiter'
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300 font-semibold'
                        : 'border-white/5 bg-navy-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-[10px]">Recruiter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-2 rounded-xl border text-center text-xs transition-all flex flex-col items-center space-y-1 ${
                      role === 'admin'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-semibold'
                        : 'border-white/5 bg-navy-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <School className="w-4 h-4" />
                    <span className="text-[10px]">College</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-10 pr-3.5 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-xs shadow-glow-blue transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{tab === 'signin' ? 'Sign In to Portal' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Instant Demo Persona Access */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="text-center text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            ⚡ Quick Sandbox Demo Access
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoAccess('student')}
              className="px-2 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 text-[11px] font-medium transition-all"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoAccess('recruiter')}
              className="px-2 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-300 text-[11px] font-medium transition-all"
            >
              Demo Recruiter
            </button>
            <button
              type="button"
              onClick={() => handleDemoAccess('admin')}
              className="px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium transition-all"
            >
              Demo Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
