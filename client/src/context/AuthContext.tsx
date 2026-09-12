import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserRole } from '@skillbridge/shared';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  activeRole: UserRole;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, name: string, role: UserRole) => Promise<{ error?: string }>;
  signInWithGoogle: (role?: UserRole) => Promise<{ error?: string }>;
  signInAsDemo: (role: UserRole) => void;
  signOut: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  syncUserProfileAndRole: (supabaseUser: User, chosenRole?: UserRole) => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Preset demo personas for instant exploration
const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  student: {
    id: 'demo-student-id',
    email: 'alex.rivera@student.skillbridge.edu',
    name: 'Alex Rivera',
    role: 'student',
    college: 'Apex Institute of Technology',
    bio: 'Computer Science junior specializing in Cloud Computing & React architectures.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  recruiter: {
    id: 'demo-recruiter-id',
    email: 'elena.rostova@techcorp.io',
    name: 'Elena Rostova',
    role: 'recruiter',
    company: 'Nexus Cloud Innovations',
    bio: 'Lead Talent Partner sourcing top full-stack and cloud engineering interns.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  admin: {
    id: 'demo-admin-id',
    email: 'dean.patel@apex.edu',
    name: 'Dr. Devraj Patel',
    role: 'admin',
    college: 'Apex Institute of Technology',
    bio: 'Dean of Industry Relations and Career Placement Cell.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<UserRole>('student');

  // Fetch or construct profile from Supabase
  const loadProfile = async (supabaseUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (data && !error) {
        const loaded: UserProfile = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role as UserRole,
          college: data.college,
          company: data.company,
          avatarUrl: data.avatar_url,
          bio: data.bio,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        setProfile(loaded);
        setActiveRole(loaded.role);
      } else {
        // Fallback to metadata
        const metaRole = (supabaseUser.user_metadata?.role as UserRole) || 'student';
        const fallback: UserProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User',
          role: metaRole,
          avatarUrl: supabaseUser.user_metadata?.avatar_url,
          createdAt: supabaseUser.created_at,
        };
        setProfile(fallback);
        setActiveRole(metaRole);
      }
    } catch {
      // Graceful fallback
      const metaRole = (supabaseUser.user_metadata?.role as UserRole) || 'student';
      setProfile({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.full_name || 'User',
        role: metaRole,
        createdAt: supabaseUser.created_at,
      });
      setActiveRole(metaRole);
    }
  };

  useEffect(() => {
    // Check saved demo mode from session storage
    const savedDemo = sessionStorage.getItem('skillbridge_demo_role') as UserRole | null;
    if (savedDemo && DEMO_PROFILES[savedDemo]) {
      const demoProf = DEMO_PROFILES[savedDemo];
      setProfile(demoProf);
      setActiveRole(savedDemo);
      setUser({
        id: demoProf.id,
        email: demoProf.email,
        app_metadata: {},
        user_metadata: { role: demoProf.role, full_name: demoProf.name },
        aud: 'authenticated',
        created_at: demoProf.createdAt,
      } as User);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Initialize Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      return {
        error: 'Supabase credentials are not set in client/.env. See client/.env.example to configure them, or use "Quick Sandbox Demo Access" below.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        await loadProfile(data.user);
      }
      return {};
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Sign in failed' };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      return {
        error: 'Supabase credentials are not set in client/.env. See client/.env.example to configure them, or use "Quick Sandbox Demo Access" below.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role,
          },
        },
      });

      if (error) return { error: error.message };
      if (data.user) {
        await loadProfile(data.user);
      }
      return {};
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Sign up failed' };
    }
  };

  const signInWithGoogle = async (selectedRole: UserRole = 'student'): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      return {
        error: 'Missing environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not set in client/.env. Please configure them using client/.env.example, or click "Quick Sandbox Demo Access" below.',
      };
    }

    try {
      localStorage.setItem('skillbridge_oauth_role', selectedRole);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) return { error: error.message };
      return {};
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Google OAuth initialization failed' };
    }
  };

  const syncUserProfileAndRole = async (supabaseUser: User, chosenRole?: UserRole): Promise<UserProfile | null> => {
    try {
      // 1. Query existing profile from Supabase
      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      let targetRole: UserRole = 'student';
      if (existing?.role && ['student', 'recruiter', 'admin'].includes(existing.role)) {
        targetRole = existing.role as UserRole;
      } else if (chosenRole) {
        targetRole = chosenRole;
      } else {
        const metaRole = supabaseUser.user_metadata?.role as UserRole | undefined;
        if (metaRole && ['student', 'recruiter', 'admin'].includes(metaRole)) {
          targetRole = metaRole;
        } else {
          const preSavedRole = localStorage.getItem('skillbridge_oauth_role') as UserRole | null;
          if (preSavedRole && ['student', 'recruiter', 'admin'].includes(preSavedRole)) {
            targetRole = preSavedRole;
          }
        }
      }

      const userName = 
        existing?.name || 
        supabaseUser.user_metadata?.full_name || 
        supabaseUser.user_metadata?.name || 
        supabaseUser.email?.split('@')[0] || 
        'User';

      const userAvatar = 
        existing?.avatar_url || 
        supabaseUser.user_metadata?.avatar_url || 
        supabaseUser.user_metadata?.picture || 
        '';

      const userEmail = supabaseUser.email || existing?.email || '';

      // Upsert profile in Supabase table
      const { data: upserted } = await supabase
        .from('profiles')
        .upsert({
          id: supabaseUser.id,
          email: userEmail,
          name: userName,
          role: targetRole,
          avatar_url: userAvatar,
          updated_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      const finalProfile: UserProfile = {
        id: supabaseUser.id,
        email: userEmail,
        name: userName,
        role: targetRole,
        avatarUrl: userAvatar,
        college: upserted?.college || existing?.college || (targetRole === 'student' ? 'Apex Institute of Technology' : undefined),
        company: upserted?.company || existing?.company || (targetRole === 'recruiter' ? 'Nexus Cloud Innovations' : undefined),
        bio: upserted?.bio || existing?.bio || '',
        createdAt: upserted?.created_at || existing?.created_at || new Date().toISOString(),
      };

      setProfile(finalProfile);
      setActiveRole(targetRole);
      setUser(supabaseUser);
      localStorage.removeItem('skillbridge_oauth_role');
      return finalProfile;
    } catch (err) {
      console.warn('[AuthContext] syncUserProfileAndRole fallback:', err);
      const targetRole = chosenRole || (supabaseUser.user_metadata?.role as UserRole) || 'student';
      const fallback: UserProfile = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User',
        role: targetRole,
        avatarUrl: supabaseUser.user_metadata?.avatar_url || '',
        createdAt: new Date().toISOString(),
      };
      setProfile(fallback);
      setActiveRole(targetRole);
      setUser(supabaseUser);
      localStorage.removeItem('skillbridge_oauth_role');
      return fallback;
    }
  };

  const signInAsDemo = (role: UserRole) => {
    const demoProf = DEMO_PROFILES[role];
    sessionStorage.setItem('skillbridge_demo_role', role);
    setProfile(demoProf);
    setActiveRole(role);
    setUser({
      id: demoProf.id,
      email: demoProf.email,
      app_metadata: {},
      user_metadata: { role: demoProf.role, full_name: demoProf.name },
      aud: 'authenticated',
      created_at: demoProf.createdAt,
    } as User);
  };

  const signOut = async () => {
    sessionStorage.removeItem('skillbridge_demo_role');
    sessionStorage.removeItem('skillbridge_seen_dashboard');
    sessionStorage.removeItem('skillbridge_seen_recruiter_dashboard');
    sessionStorage.removeItem('skillbridge_seen_admin_dashboard');
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    if (profile) {
      setProfile({ ...profile, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        activeRole,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInAsDemo,
        signOut,
        switchRole,
        syncUserProfileAndRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
