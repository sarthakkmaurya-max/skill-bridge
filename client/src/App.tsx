import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SkillMappingPreview } from './components/SkillMappingPreview';
import { Features } from './components/Features';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { RecruiterDashboard } from './components/recruiter/RecruiterDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PublicPortfolioModal } from './components/dashboard/PublicPortfolioModal';
import { SAMPLE_STUDENT_PORTFOLIO } from './lib/sampleData';
import { useAuth } from './context/AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Building2, 
  School, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  LayoutDashboard 
} from 'lucide-react';

import { AuthCallback } from './components/auth/AuthCallback';
import { UserRole } from '@skillbridge/shared';

export function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'signin' | 'signup'>('signin');
  const [currentView, setCurrentView] = useState<
    'landing' | 'student_dashboard' | 'recruiter_dashboard' | 'admin_dashboard' | 'public_portfolio' | 'auth_callback'
  >(() => {
    if (window.location.pathname === '/auth/callback' || window.location.pathname.startsWith('/auth/callback')) {
      return 'auth_callback';
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('portfolio')) {
      return 'public_portfolio';
    }
    return 'landing';
  });
  const { user, profile, activeRole, isConfigured } = useAuth();

  // Dynamic student readiness tracking from stored assessment
  const [studentReadiness, setStudentReadiness] = useState<{ percentage: number; role: string }>(() => {
    try {
      const keys = ['skillbridge_assessment_latest', 'skillbridge_assessment_demo-student-id', 'skillbridge_assessment_demo'];
      for (const k of keys) {
        const item = localStorage.getItem(k);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed && parsed.percentage !== undefined) {
            return {
              percentage: parsed.percentage,
              role: parsed.recommendedRole || 'Frontend Developer',
            };
          }
        }
      }
    } catch {}
    return { percentage: 88, role: 'Frontend Developer' };
  });

  useEffect(() => {
    const handleAssessmentUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.percentage !== undefined) {
        setStudentReadiness({
          percentage: detail.percentage,
          role: detail.recommendedRole || 'Frontend Developer',
        });
      }
    };
    window.addEventListener('skillbridge:assessment_updated', handleAssessmentUpdate);
    return () => {
      window.removeEventListener('skillbridge:assessment_updated', handleAssessmentUpdate);
    };
  }, []);

  // Check URL query parameters for direct public portfolio preview
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('portfolio')) {
      setCurrentView('public_portfolio');
    }
  }, []);

  // Automatically offer relevant dashboard when user signs in or role changes
  useEffect(() => {
    if (currentView === 'auth_callback') {
      return;
    }
    if (user && activeRole === 'student') {
      const hasSeen = sessionStorage.getItem('skillbridge_seen_dashboard');
      if (!hasSeen) {
        sessionStorage.setItem('skillbridge_seen_dashboard', 'true');
        setCurrentView('student_dashboard');
      }
    } else if (user && activeRole === 'recruiter') {
      const hasSeen = sessionStorage.getItem('skillbridge_seen_recruiter_dashboard');
      if (!hasSeen) {
        sessionStorage.setItem('skillbridge_seen_recruiter_dashboard', 'true');
        setCurrentView('recruiter_dashboard');
      }
    } else if (user && activeRole === 'admin') {
      const hasSeen = sessionStorage.getItem('skillbridge_seen_admin_dashboard');
      if (!hasSeen) {
        sessionStorage.setItem('skillbridge_seen_admin_dashboard', 'true');
        setCurrentView('admin_dashboard');
      }
    } else {
      if (currentView !== 'public_portfolio') {
        setCurrentView('landing');
      }
    }
  }, [user, activeRole, currentView]);

  const handleOpenAuth = (defaultTab: 'signin' | 'signup' = 'signin') => {
    setAuthDefaultTab(defaultTab);
    setAuthModalOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthCallbackSuccess = (role: UserRole) => {
    if (role === 'student') {
      sessionStorage.setItem('skillbridge_seen_dashboard', 'true');
      setCurrentView('student_dashboard');
    } else if (role === 'recruiter') {
      sessionStorage.setItem('skillbridge_seen_recruiter_dashboard', 'true');
      setCurrentView('recruiter_dashboard');
    } else if (role === 'admin') {
      sessionStorage.setItem('skillbridge_seen_admin_dashboard', 'true');
      setCurrentView('admin_dashboard');
    } else {
      setCurrentView('landing');
    }
  };

  // If in Auth Callback route, render the AuthCallback component
  if (currentView === 'auth_callback') {
    return (
      <AuthCallback
        onAuthenticated={handleAuthCallbackSuccess}
        onBackToLanding={() => {
          window.history.replaceState({}, document.title, '/');
          setCurrentView('landing');
        }}
        onOpenAuthModal={() => {
          window.history.replaceState({}, document.title, '/');
          setCurrentView('landing');
          setAuthModalOpen(true);
        }}
      />
    );
  }

  // If in Student Dashboard view, render the protected Student Dashboard
  if (user && activeRole === 'student' && currentView === 'student_dashboard') {
    return (
      <StudentDashboard onBackToLanding={() => setCurrentView('landing')} />
    );
  }

  // If in Recruiter Dashboard view, render the protected Recruiter Dashboard
  if (user && activeRole === 'recruiter' && currentView === 'recruiter_dashboard') {
    return (
      <RecruiterDashboard onBackToLanding={() => setCurrentView('landing')} />
    );
  }

  // If in Admin Dashboard view, render the protected Admin Dashboard
  if (user && activeRole === 'admin' && currentView === 'admin_dashboard') {
    return (
      <AdminDashboard onBackToLanding={() => setCurrentView('landing')} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Optional Top Warning Bar if Supabase is unconfigured */}
      {!isConfigured && (
        <aside aria-label="Environment Notice" className="w-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-center text-xs text-amber-200">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Local Sandbox Mode:</strong> Supabase keys are not set in your <code>.env</code> file. You can preview all portal interfaces via <strong>Quick Demo Access</strong> in the login modal!
            </span>
          </div>
        </aside>
      )}

      {/* Role-Specific Active Persona Banner when Authenticated */}
      {user && profile && (
        <aside aria-label="Authenticated Session" className="w-full bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-violet-900/40 border-b border-white/10 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">
                Active Session: <strong className="text-white">{profile.name}</strong>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {activeRole}
              </span>
              {profile.college && <span className="text-slate-400 hidden md:inline">• {profile.college}</span>}
              {profile.company && <span className="text-slate-400 hidden md:inline">• {profile.company}</span>}
            </div>

            <div className="flex items-center space-x-3 text-slate-300">
              {activeRole === 'student' && (
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Readiness: {studentReadiness.percentage}% ({studentReadiness.role})</span>
                  </span>
                  <button
                    onClick={() => setCurrentView('student_dashboard')}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue flex items-center space-x-1.5 transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Open Student Dashboard</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
              {activeRole === 'recruiter' && (
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1 text-violet-300 font-medium">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Employer Portal Active</span>
                  </span>
                  <button
                    onClick={() => setCurrentView('recruiter_dashboard')}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-violet flex items-center space-x-1.5 transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Open Recruiter Dashboard</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
              {activeRole === 'admin' && (
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1 text-emerald-300 font-medium">
                    <School className="w-3.5 h-3.5" />
                    <span>Cohort Placement Rate: 94%</span>
                  </span>
                  <button
                    onClick={() => setCurrentView('admin_dashboard')}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-glow-emerald flex items-center space-x-1.5 transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Open Admin Dashboard</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Navigation */}
      <Navbar onOpenAuth={handleOpenAuth} onScrollToSection={handleScrollToSection} />

      {/* Main Landing Page Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero onOpenAuth={handleOpenAuth} onScrollToSection={handleScrollToSection} />

        {/* Skill Mapping Interactive Preview */}
        <SkillMappingPreview onOpenAuth={handleOpenAuth} />

        {/* Pillars / Features */}
        <Features />

        {/* Call to Action Banner */}
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl glass-card border border-white/15 p-8 sm:p-14 text-center overflow-hidden shadow-2xl">
              
              {/* Background gradient flares */}
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Transform Campus Placements</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Ready to Supercharge Your <span className="gradient-text">Talent Outcomes</span>?
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Join forward-thinking colleges, high-growth recruiters, and ambitious students building the future of academia–industry synergy.
                </p>

                <div className="pt-2 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => handleOpenAuth('signup')}
                    className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm shadow-glow-blue transition-all flex items-center space-x-2 group"
                  >
                    <span>Create Your Portal Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleScrollToSection('preview')}
                    className="px-7 py-3.5 rounded-xl glass-panel hover:border-white/20 text-slate-200 font-semibold text-sm transition-all"
                  >
                    Explore Competencies
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Public Portfolio Preview Modal */}
      <PublicPortfolioModal
        isOpen={currentView === 'public_portfolio'}
        onClose={() => {
          window.history.replaceState({}, document.title, window.location.pathname);
          setCurrentView('landing');
        }}
        portfolio={SAMPLE_STUDENT_PORTFOLIO}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authDefaultTab}
      />

    </div>
  );
}

export default App;
