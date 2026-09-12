import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { UserRole } from '@skillbridge/shared';
import {
  Loader2,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  Building2,
  School,
  ArrowRight,
  Sparkles,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

interface AuthCallbackProps {
  onAuthenticated: (role: UserRole) => void;
  onBackToLanding: () => void;
  onOpenAuthModal?: () => void;
}

interface OAuthErrorInfo {
  type: string;
  title: string;
  message: string;
  hint?: string;
  actionType?: 'retry' | 'demo' | 'config';
}

export const AuthCallback: React.FC<AuthCallbackProps> = ({
  onAuthenticated,
  onBackToLanding,
  onOpenAuthModal,
}) => {
  const { syncUserProfileAndRole, signInAsDemo } = useAuth();

  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Verifying your Google authentication credentials...');
  const [errorInfo, setErrorInfo] = useState<OAuthErrorInfo | null>(null);

  // Role selection fallback state if no role was pre-selected or found in Supabase
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isSubmittingRole, setIsSubmittingRole] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      // 1. Parse query and hash parameters
      const searchParams = new URLSearchParams(window.location.search);
      const rawHash = window.location.hash.startsWith('#')
        ? window.location.hash.substring(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(rawHash);

      const error = searchParams.get('error') || hashParams.get('error');
      const errorCode = searchParams.get('error_code') || hashParams.get('error_code');
      const errorDescription =
        searchParams.get('error_description') || hashParams.get('error_description');
      const code = searchParams.get('code');

      // 2. Check for OAuth errors in URL
      if (error) {
        if (!isMounted) return;
        setLoading(false);

        if (error === 'redirect_uri_mismatch' || errorCode === '400') {
          setErrorInfo({
            type: 'redirect_uri_mismatch',
            title: 'OAuth Redirect URI Mismatch',
            message:
              errorDescription ||
              'The redirect URI does not match the authorized redirect URIs configured in Google Cloud Console or Supabase.',
            hint:
              'Verify in Supabase Dashboard (Auth -> URL Configuration) that Site URL is set to your origin (e.g. http://localhost:5173) and Additional Redirect URLs includes /auth/callback. In Google Cloud Console, ensure Authorized redirect URIs includes https://<your-project-ref>.supabase.co/auth/v1/callback.',
            actionType: 'config',
          });
        } else if (error === 'access_denied' || errorCode === '403') {
          setErrorInfo({
            type: 'access_denied',
            title: 'Sign-In Request Cancelled',
            message:
              errorDescription ||
              'You cancelled the Google sign-in request or access was denied.',
            hint: 'Please try signing in again and grant permission to proceed.',
            actionType: 'retry',
          });
        } else {
          setErrorInfo({
            type: error,
            title: 'Google Authentication Failed',
            message:
              errorDescription ||
              `Google authentication failed with error code: ${error}.`,
            hint: 'Please try signing in again or explore the portal using Local Sandbox Demo mode.',
            actionType: 'retry',
          });
        }
        return;
      }

      // 3. Verify Supabase configuration
      if (!isSupabaseConfigured) {
        if (!isMounted) return;
        setLoading(false);
        setErrorInfo({
          type: 'missing_environment_variables',
          title: 'Supabase Credentials Missing',
          message:
            'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured in client/.env.',
          hint:
            'To enable live Google OAuth and database persistence, add your Supabase project URL and anon key to client/.env. Alternatively, you can test everything using instant Sandbox Demo mode.',
          actionType: 'demo',
        });
        return;
      }

      try {
        setStatusMessage('Exchanging OAuth token and restoring session...');

        // 4. Exchange PKCE code if present and not yet exchanged
        if (code) {
          try {
            const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeErr) {
              console.warn('[AuthCallback] exchangeCodeForSession note:', exchangeErr.message);
              // May already be exchanged by supabase client listener, continue to getSession
            }
          } catch (codeErr) {
            console.warn('[AuthCallback] Code exchange exception:', codeErr);
          }
        }

        // 5. Retrieve active Supabase session
        let activeUser: User | null = null;
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();

        if (sessionErr) {
          throw sessionErr;
        }

        if (sessionData?.session?.user) {
          activeUser = sessionData.session.user;
        } else {
          // Wait up to 5 seconds for onAuthStateChange to capture session
          activeUser = await new Promise<User | null>((resolve) => {
            const timeout = setTimeout(() => {
              subscription.unsubscribe();
              resolve(null);
            }, 5000);

            const {
              data: { subscription },
            } = supabase.auth.onAuthStateChange((_event, session) => {
              if (session?.user) {
                clearTimeout(timeout);
                subscription.unsubscribe();
                resolve(session.user);
              }
            });
          });
        }

        if (!activeUser) {
          if (!isMounted) return;
          setLoading(false);
          setErrorInfo({
            type: 'session_restoration_timeout',
            title: 'Authentication Session Not Found',
            message:
              'Unable to retrieve your Google authentication session. The session token may have expired or third-party cookies might be restricted.',
            hint:
              'Please try signing in again. If testing locally, ensure your browser allows cookies for localhost.',
            actionType: 'retry',
          });
          return;
        }

        setStatusMessage('Syncing user profile and role permissions...');

        // 6. Role resolution check
        // Priority 1: Check existing profile in Supabase DB
        let resolvedRole: UserRole | null = null;
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', activeUser.id)
            .maybeSingle();

          if (profileData?.role && ['student', 'recruiter', 'admin'].includes(profileData.role)) {
            resolvedRole = profileData.role as UserRole;
          }
        } catch {
          // Continue to next checks if table doesn't exist yet
        }

        // Priority 2: Check pre-selected role in localStorage from login modal
        if (!resolvedRole) {
          const preSaved = localStorage.getItem('skillbridge_oauth_role') as UserRole | null;
          if (preSaved && ['student', 'recruiter', 'admin'].includes(preSaved)) {
            resolvedRole = preSaved;
          }
        }

        // Priority 3: Check Supabase user metadata
        if (!resolvedRole) {
          const metaRole = activeUser.user_metadata?.role as UserRole | undefined;
          if (metaRole && ['student', 'recruiter', 'admin'].includes(metaRole)) {
            resolvedRole = metaRole;
          }
        }

        // 7. If role is still undetermined, prompt user to select their role
        if (!resolvedRole) {
          if (!isMounted) return;
          setPendingUser(activeUser);
          setNeedsRoleSelection(true);
          setLoading(false);
          return;
        }

        // 8. Safely sync user profile with resolved role
        const synced = await syncUserProfileAndRole(activeUser, resolvedRole);
        const finalRole = synced?.role || resolvedRole;

        // Clean query/hash parameters from URL without reloading
        window.history.replaceState({}, document.title, window.location.pathname);

        if (isMounted) {
          onAuthenticated(finalRole);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        setLoading(false);
        const errMsg = err instanceof Error ? err.message : 'Unknown authentication error occurred';
        setErrorInfo({
          type: 'general_oauth_error',
          title: 'Google Sign-In Error',
          message: errMsg,
          hint: 'Please return to the landing page and try signing in again.',
          actionType: 'retry',
        });
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [syncUserProfileAndRole, onAuthenticated]);

  // Handler for manual role selection when user had no pre-selected role
  const handleRoleSelectionSubmit = async () => {
    if (!pendingUser) return;
    setIsSubmittingRole(true);
    try {
      const synced = await syncUserProfileAndRole(pendingUser, selectedRole);
      const finalRole = synced?.role || selectedRole;
      window.history.replaceState({}, document.title, window.location.pathname);
      onAuthenticated(finalRole);
    } catch (err) {
      console.error('[AuthCallback] Failed to save chosen role:', err);
      window.history.replaceState({}, document.title, window.location.pathname);
      onAuthenticated(selectedRole);
    } finally {
      setIsSubmittingRole(false);
    }
  };

  const handleDemoAccess = (role: UserRole) => {
    signInAsDemo(role);
    window.history.replaceState({}, document.title, '/');
    onAuthenticated(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 px-4 py-12 relative overflow-hidden text-slate-100 font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Brand Header */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-glow-blue border border-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Skill<span className="gradient-text">Bridge</span>
          </span>
        </div>

        {/* 1. LOADING STATE */}
        {loading && (
          <div className="glass-card border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 animate-spin opacity-40 blur-sm" />
              <div className="relative w-14 h-14 rounded-full bg-navy-900 flex items-center justify-center border border-white/20">
                <Loader2 className="w-7 h-7 text-blue-400 animate-spin" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Completing Google Authentication</h2>
              <p className="text-sm text-slate-300 max-w-sm mx-auto">{statusMessage}</p>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verifying tokens via Supabase Auth</span>
            </div>
          </div>
        )}

        {/* 2. ROLE SELECTION FALLBACK (When no role exists) */}
        {!loading && needsRoleSelection && pendingUser && (
          <div className="glass-card border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Account Setup</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Select Your Account Type</h2>
              <p className="text-sm text-slate-300">
                Welcome, <strong className="text-white">{pendingUser.user_metadata?.full_name || pendingUser.email}</strong>! Choose your primary role to configure your portal workspace:
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Student Role Option */}
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center space-x-4 ${
                  selectedRole === 'student'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-glow-blue'
                    : 'glass-panel border-white/10 hover:border-white/20 text-slate-300'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    selectedRole === 'student'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-blue-400'
                  }`}
                >
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-white">Student</h3>
                    {selectedRole === 'student' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assess competency readiness, explore internships, and showcase your digital portfolio.
                  </p>
                </div>
              </button>

              {/* Recruiter Role Option */}
              <button
                type="button"
                onClick={() => setSelectedRole('recruiter')}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center space-x-4 ${
                  selectedRole === 'recruiter'
                    ? 'bg-violet-600/20 border-violet-500 text-white shadow-glow-violet'
                    : 'glass-panel border-white/10 hover:border-white/20 text-slate-300'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    selectedRole === 'recruiter'
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/5 text-violet-400'
                  }`}
                >
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-white">Recruiter / Employer</h3>
                    {selectedRole === 'recruiter' && (
                      <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Post opportunities, filter smart-matched candidates, and manage shortlists.
                  </p>
                </div>
              </button>

              {/* College Admin Role Option */}
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center space-x-4 ${
                  selectedRole === 'admin'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-glow-emerald'
                    : 'glass-panel border-white/10 hover:border-white/20 text-slate-300'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    selectedRole === 'admin'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/5 text-emerald-400'
                  }`}
                >
                  <School className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-white">College Placement Cell</h3>
                    {selectedRole === 'admin' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Track cohort placement statistics, verify student credentials, and view industry partners.
                  </p>
                </div>
              </button>
            </div>

            <button
              onClick={handleRoleSelectionSubmit}
              disabled={isSubmittingRole}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm shadow-glow-blue transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmittingRole ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Setting Up Workspace...</span>
                </>
              ) : (
                <>
                  <span>Continue to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* 3. ERROR STATE */}
        {!loading && errorInfo && (
          <div className="glass-card border border-red-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 animate-fade-in bg-navy-900/90">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-white">{errorInfo.title}</h2>
              <p className="text-sm text-red-200 bg-red-950/40 border border-red-800/40 rounded-xl p-3 text-left font-mono text-xs break-words">
                {errorInfo.message}
              </p>
            </div>

            {errorInfo.hint && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 space-y-2">
                <div className="flex items-center space-x-2 text-blue-400 font-semibold">
                  <HelpCircle className="w-4 h-4" />
                  <span>Troubleshooting Guide:</span>
                </div>
                <p className="leading-relaxed text-slate-300">{errorInfo.hint}</p>
                {errorInfo.type === 'redirect_uri_mismatch' && (
                  <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 space-y-1">
                    <p>• Google Cloud Console Authorized redirect URI:</p>
                    <code className="block p-1 rounded bg-black/40 text-blue-300">
                      https://&lt;your-supabase-project&gt;.supabase.co/auth/v1/callback
                    </code>
                    <p className="pt-1">• Supabase Redirect URL:</p>
                    <code className="block p-1 rounded bg-black/40 text-blue-300">
                      {window.location.origin}/auth/callback
                    </code>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  window.history.replaceState({}, document.title, '/');
                  if (onOpenAuthModal) {
                    onOpenAuthModal();
                  } else {
                    onBackToLanding();
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-glow-blue"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Return to Sign In</span>
              </button>

              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-slate-400 text-center mb-2.5">
                  Want to explore without configuring Google credentials?
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoAccess('student')}
                    className="py-2 px-2 rounded-lg glass-panel hover:border-blue-500/50 hover:bg-blue-600/10 text-xs text-slate-200 font-medium text-center transition-all"
                  >
                    Student Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoAccess('recruiter')}
                    className="py-2 px-2 rounded-lg glass-panel hover:border-violet-500/50 hover:bg-violet-600/10 text-xs text-slate-200 font-medium text-center transition-all"
                  >
                    Recruiter Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoAccess('admin')}
                    className="py-2 px-2 rounded-lg glass-panel hover:border-emerald-500/50 hover:bg-emerald-600/10 text-xs text-slate-200 font-medium text-center transition-all"
                  >
                    Admin Demo
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  window.history.replaceState({}, document.title, '/');
                  onBackToLanding();
                }}
                className="w-full text-center text-xs text-slate-400 hover:text-white transition-colors pt-1"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
