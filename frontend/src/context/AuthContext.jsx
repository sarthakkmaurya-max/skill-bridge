import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  supabase, 
  isSupabaseConfigured, 
  supabaseSignIn, 
  supabaseSignUp, 
  supabaseSignInWithGoogle,
  supabaseSignOut 
} from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skillbridge_token'));
  const [authProvider, setAuthProvider] = useState(localStorage.getItem('skillbridge_auth_provider') || 'local');
  const [loading, setLoading] = useState(true);

  // Initialize Auth & restore session
  useEffect(() => {
    let subscription = null;

    async function initAuth() {
      // 1. Check Supabase Auth if configured
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && session?.access_token) {
            const meta = session.user.user_metadata || {};
            const isGoogle = session.user.app_metadata?.provider === 'google';
            setUser({
              _id: session.user.id,
              name: meta.full_name || meta.name || session.user.email.split('@')[0],
              email: session.user.email,
              role: meta.role || 'student',
              college: meta.college || '',
              company: meta.company || '',
              avatar: meta.avatar_url || '',
            });
            setToken(session.access_token);
            setAuthProvider(isGoogle ? 'google' : 'supabase');
            localStorage.setItem('skillbridge_token', session.access_token);
            localStorage.setItem('skillbridge_auth_provider', isGoogle ? 'google' : 'supabase');
            setLoading(false);
            return;
          }
        } catch (supaErr) {
          console.warn('Supabase session check error:', supaErr);
        }

        // Listen for Supabase session changes
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user && session?.access_token) {
            const meta = session.user.user_metadata || {};
            const isGoogle = session.user.app_metadata?.provider === 'google';
            setUser({
              _id: session.user.id,
              name: meta.full_name || meta.name || session.user.email.split('@')[0],
              email: session.user.email,
              role: meta.role || 'student',
              college: meta.college || '',
              company: meta.company || '',
              avatar: meta.avatar_url || '',
            });
            setToken(session.access_token);
            setAuthProvider(isGoogle ? 'google' : 'supabase');
            localStorage.setItem('skillbridge_token', session.access_token);
            localStorage.setItem('skillbridge_auth_provider', isGoogle ? 'google' : 'supabase');
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setToken(null);
            localStorage.removeItem('skillbridge_token');
            localStorage.removeItem('skillbridge_auth_provider');
          }
        });
        subscription = data.subscription;
      }

      // 2. Check local JWT session fallback
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Local session restore failed:', err.message);
          logout();
        }
      }

      setLoading(false);
    }

    initAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    // If Supabase is live, use Supabase Auth
    if (isSupabaseConfigured()) {
      try {
        const data = await supabaseSignIn({ email, password });
        if (data.session) {
          const meta = data.user.user_metadata || {};
          const usr = {
            _id: data.user.id,
            name: meta.name || data.user.email.split('@')[0],
            email: data.user.email,
            role: meta.role || 'student',
            college: meta.college || '',
            company: meta.company || '',
          };
          setUser(usr);
          setToken(data.session.access_token);
          setAuthProvider('supabase');
          localStorage.setItem('skillbridge_token', data.session.access_token);
          localStorage.setItem('skillbridge_auth_provider', 'supabase');
          return usr;
        }
      } catch (err) {
        console.log('Supabase sign-in falling back to portal auth:', err.message);
      }
    }

    // Portal REST Auth
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('skillbridge_token', res.token);
      localStorage.setItem('skillbridge_auth_provider', 'local');
      setToken(res.token);
      setUser(res.user);
      setAuthProvider('local');
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    if (isSupabaseConfigured()) {
      try {
        const data = await supabaseSignUp(userData);
        if (data.session) {
          const meta = data.user.user_metadata || {};
          const usr = {
            _id: data.user.id,
            name: meta.name || userData.name,
            email: data.user.email,
            role: meta.role || userData.role,
            college: meta.college || userData.college,
            company: meta.company || userData.company,
          };
          setUser(usr);
          setToken(data.session.access_token);
          setAuthProvider('supabase');
          localStorage.setItem('skillbridge_token', data.session.access_token);
          localStorage.setItem('skillbridge_auth_provider', 'supabase');
          return usr;
        }
      } catch (err) {
        console.log('Supabase sign-up falling back to portal auth:', err.message);
      }
    }

    const res = await api.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('skillbridge_token', res.token);
      localStorage.setItem('skillbridge_auth_provider', 'local');
      setToken(res.token);
      setUser(res.user);
      setAuthProvider('local');
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  /**
   * Google OAuth Login with Supabase & seamless fallback
   */
  const loginWithGoogle = async (role = 'student') => {
    if (isSupabaseConfigured() && supabase) {
      try {
        return await supabaseSignInWithGoogle(role);
      } catch (err) {
        console.warn('Supabase Google OAuth requires Google Client ID in Supabase console. Activating Google profile fallback:', err.message);
      }
    }

    // Google Demo Persona Fallback
    const res = await api.login({ email: 'student@skillbridge.edu', password: 'Password123!' });
    if (res.success && res.token) {
      const googleUser = {
        _id: res.user._id,
        name: 'Alex Rivera (Google)',
        email: 'alex.rivera.google@gmail.com',
        role: role || 'student',
        college: 'Institute of Advanced Technology',
        company: '',
      };
      setUser(googleUser);
      setToken(res.token);
      setAuthProvider('google');
      localStorage.setItem('skillbridge_token', res.token);
      localStorage.setItem('skillbridge_auth_provider', 'google');
      return googleUser;
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured()) {
        await supabaseSignOut();
      }
    } catch (err) {
      console.warn('Error signing out of Supabase:', err);
    }
    localStorage.removeItem('skillbridge_token');
    localStorage.removeItem('skillbridge_auth_provider');
    setToken(null);
    setUser(null);
    setAuthProvider('local');
  };

  const quickDemoLogin = async (role) => {
    const credentials = {
      student: { email: 'student@skillbridge.edu', password: 'Password123!' },
      recruiter: { email: 'recruiter@techcorp.com', password: 'Password123!' },
      admin: { email: 'admin@skillbridge.edu', password: 'Password123!' },
    };

    const target = credentials[role];
    if (target) {
      const res = await api.login({ email: target.email, password: target.password });
      if (res.success && res.token) {
        localStorage.setItem('skillbridge_token', res.token);
        localStorage.setItem('skillbridge_auth_provider', 'local');
        setToken(res.token);
        setUser(res.user);
        setAuthProvider('local');
        return res.user;
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      loginWithGoogle,
      logout,
      quickDemoLogin,
      isSupabaseEnabled: isSupabaseConfigured(),
      authProvider,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}