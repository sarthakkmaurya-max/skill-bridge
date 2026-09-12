import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Opportunity, Application, ApplicationStatus } from '@skillbridge/shared';
import { SAMPLE_RECRUITER_APPLICATIONS } from '../../lib/sampleData';
import { PostOpportunityForm } from './PostOpportunityForm';
import { MyOpportunitiesTab } from './MyOpportunitiesTab';
import { ApplicantsTab } from './ApplicantsTab';
import { CompanyProfileTab } from './CompanyProfileTab';
import { 
  Building2, 
  PlusCircle, 
  ListOrdered, 
  Users, 
  ExternalLink, 
  LogOut, 
  Compass, 
  Sparkles,
  Briefcase,
  CheckCircle2,
  Clock,
  LayoutDashboard
} from 'lucide-react';

type RecruiterTab = 'overview' | 'post' | 'my_opportunities' | 'applicants' | 'profile';

interface RecruiterDashboardProps {
  onBackToLanding: () => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ onBackToLanding }) => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<RecruiterTab>('overview');
  const [myOpportunities, setMyOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>(SAMPLE_RECRUITER_APPLICATIONS);
  const [loading, setLoading] = useState(true);

  // Load recruiter opportunities
  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      const storageKey = `skillbridge_recruiter_opps_${user?.id || 'demo'}`;
      const cached = localStorage.getItem(storageKey);

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setMyOpportunities(parsed);
          setLoading(false);
          return;
        } catch {
          // fallback
        }
      }

      if (!isSupabaseConfigured || !user) {
        // Default demo openings for Elena Rostova
        const defaultDemo: Opportunity[] = [
          {
            id: 'opp-ind-1',
            recruiterId: user?.id || 'demo-recruiter-id',
            title: 'Frontend React Engineering Intern',
            company: profile?.company || 'Nexus Cloud India',
            type: 'internship',
            workMode: 'hybrid',
            location: 'Bengaluru, Karnataka',
            stipendOrSalary: '₹45,000 / month',
            duration: '6 Months',
            deadline: '2026-10-25T00:00:00.000Z',
            description: 'Design enterprise React 18 microfrontends, accessible component libraries, and Tailwind layouts for high-throughput cloud consoles.',
            requiredSkills: ['React', 'TypeScript', 'HTML/CSS', 'Git'],
            eligibility: 'B.Tech / MCA 2026/2027 batch with 75%+ Frontend Role Readiness.',
            openingsCount: 6,
            status: 'active',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'opp-ind-workshop',
            recruiterId: user?.id || 'demo-recruiter-id',
            title: 'Cloud Systems & Microfrontends Workshop',
            company: profile?.company || 'Nexus Cloud India',
            type: 'workshop',
            workMode: 'remote',
            location: 'Online / Pan-India',
            stipendOrSalary: '₹15,000 Merit Grant',
            duration: '3 Weeks',
            deadline: '2026-11-05T00:00:00.000Z',
            description: 'Industry-guided live coding cohort building scalable distributed frontends on Docker and Supabase PostgreSQL.',
            requiredSkills: ['React', 'Git', 'Problem Solving'],
            eligibility: 'Pre-final year engineering students across partner universities.',
            openingsCount: 30,
            status: 'active',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ];
        setMyOpportunities(defaultDemo);
        localStorage.setItem(storageKey, JSON.stringify(defaultDemo));
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('opportunities')
          .select('*')
          .eq('recruiter_id', user.id)
          .order('created_at', { ascending: false });

        if (data && !error) {
          const mapped: Opportunity[] = data.map(d => ({
            id: d.id,
            recruiterId: d.recruiter_id,
            title: d.title,
            company: d.company,
            type: d.type,
            workMode: d.work_mode,
            location: d.location,
            stipendOrSalary: d.stipend_or_salary,
            duration: d.duration,
            deadline: d.deadline,
            description: d.description,
            requiredSkills: d.required_skills || [],
            eligibility: d.eligibility,
            openingsCount: d.openings_count || 1,
            status: d.status,
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }));
          setMyOpportunities(mapped);
          localStorage.setItem(storageKey, JSON.stringify(mapped));
        }
      } catch {
        // graceful
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [user, profile]);

  const saveToStorage = (updatedList: Opportunity[]) => {
    setMyOpportunities(updatedList);
    const storageKey = `skillbridge_recruiter_opps_${user?.id || 'demo'}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedList));
  };

  const handleCreateOpportunity = async (newOppData: Omit<Opportunity, 'id' | 'createdAt' | 'recruiterId'>) => {
    const recruiterId = user?.id || 'demo-recruiter-id';
    const newOpp: Opportunity = {
      ...newOppData,
      id: `opp-${Date.now()}`,
      recruiterId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && user) {
      await supabase.from('opportunities').insert({
        recruiter_id: recruiterId,
        title: newOpp.title,
        company: newOpp.company,
        type: newOpp.type,
        work_mode: newOpp.workMode,
        location: newOpp.location,
        stipend_or_salary: newOpp.stipendOrSalary,
        duration: newOpp.duration,
        deadline: newOpp.deadline,
        description: newOpp.description,
        required_skills: newOpp.requiredSkills,
        eligibility: newOpp.eligibility,
        openings_count: newOpp.openingsCount,
        status: 'active',
      });
    }

    saveToStorage([newOpp, ...myOpportunities]);
    setActiveTab('my_opportunities');
  };

  const handleUpdateOpportunity = async (updated: Opportunity) => {
    if (isSupabaseConfigured && user) {
      await supabase
        .from('opportunities')
        .update({
          title: updated.title,
          company: updated.company,
          type: updated.type,
          work_mode: updated.workMode,
          location: updated.location,
          stipend_or_salary: updated.stipendOrSalary,
          duration: updated.duration,
          deadline: updated.deadline,
          description: updated.description,
          required_skills: updated.requiredSkills,
          eligibility: updated.eligibility,
          openings_count: updated.openingsCount,
          status: updated.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updated.id)
        .eq('recruiter_id', user.id);
    }

    const updatedList = myOpportunities.map(o => o.id === updated.id ? updated : o);
    saveToStorage(updatedList);
  };

  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'closed') => {
    const newStatus: 'active' | 'closed' = currentStatus === 'active' ? 'closed' : 'active';
    if (isSupabaseConfigured && user) {
      await supabase
        .from('opportunities')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('recruiter_id', user.id);
    }
    const updatedList = myOpportunities.map(o => o.id === id ? { ...o, status: newStatus } : o);
    saveToStorage(updatedList);
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (isSupabaseConfigured && user) {
      await supabase
        .from('opportunities')
        .delete()
        .eq('id', id)
        .eq('recruiter_id', user.id);
    }
    const updatedList = myOpportunities.filter(o => o.id !== id);
    saveToStorage(updatedList);
  };

  // Load applications for recruiter's opportunities
  useEffect(() => {
    const fetchApplications = async () => {
      const appKey = `skillbridge_recruiter_applications_${user?.id || 'demo'}`;
      const cached = localStorage.getItem(appKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setApplications(parsed);
            return;
          }
        } catch {}
      }

      if (!isSupabaseConfigured || !user) {
        setApplications(SAMPLE_RECRUITER_APPLICATIONS);
        localStorage.setItem(appKey, JSON.stringify(SAMPLE_RECRUITER_APPLICATIONS));
        return;
      }

      try {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            opportunity:opportunities (*),
            student:profiles (*)
          `)
          .order('applied_at', { ascending: false });

        if (data && !error && data.length > 0) {
          const mapped: Application[] = data.map((d: any) => ({
            id: d.id,
            opportunityId: d.opportunity_id,
            opportunity: d.opportunity,
            studentId: d.student_id,
            studentName: d.student?.name || 'Candidate Student',
            studentEmail: d.student?.email || 'student@university.edu',
            studentCollege: d.student?.college || 'Apex Institute of Technology',
            recruiterId: d.recruiter_id,
            matchScore: d.match_percentage || d.match_score || 85,
            matchPercentage: d.match_percentage || d.match_score || 85,
            matchedSkills: d.matched_skills || [],
            missingSkills: d.missing_skills || [],
            status: d.status,
            appliedAt: d.applied_at,
            updatedAt: d.updated_at,
            notes: d.notes,
            recruiterNotes: d.recruiter_notes,
          }));
          setApplications(mapped);
          localStorage.setItem(appKey, JSON.stringify(mapped));
        } else {
          setApplications(SAMPLE_RECRUITER_APPLICATIONS);
          localStorage.setItem(appKey, JSON.stringify(SAMPLE_RECRUITER_APPLICATIONS));
        }
      } catch {
        setApplications(SAMPLE_RECRUITER_APPLICATIONS);
      }
    };

    fetchApplications();
  }, [user]);

  const handleUpdateApplicationStatus = async (
    applicationId: string, 
    newStatus: ApplicationStatus, 
    notes: string
  ) => {
    const timestamp = new Date().toISOString();
    const updatedList = applications.map((app) => 
      app.id === applicationId
        ? { ...app, status: newStatus, recruiterNotes: notes, updatedAt: timestamp }
        : app
    );

    setApplications(updatedList);
    const appKey = `skillbridge_recruiter_applications_${user?.id || 'demo'}`;
    localStorage.setItem(appKey, JSON.stringify(updatedList));

    // Also sync to student application cache if this was Alex Rivera's application
    const targetApp = updatedList.find(a => a.id === applicationId);
    if (targetApp) {
      const studentCacheKey = `skillbridge_applications_${targetApp.studentId}`;
      const cachedStudentApps = localStorage.getItem(studentCacheKey);
      if (cachedStudentApps) {
        try {
          const parsed: Application[] = JSON.parse(cachedStudentApps);
          const syncStudent = parsed.map(a => 
            a.opportunityId === targetApp.opportunityId || a.id === targetApp.id
              ? { ...a, status: newStatus, recruiterNotes: notes, updatedAt: timestamp }
              : a
          );
          localStorage.setItem(studentCacheKey, JSON.stringify(syncStudent));
        } catch {}
      }

      const demoStudentKey = 'skillbridge_applications_demo';
      const cachedDemoStudent = localStorage.getItem(demoStudentKey);
      if (cachedDemoStudent) {
        try {
          const parsedDemo: Application[] = JSON.parse(cachedDemoStudent);
          const syncDemo = parsedDemo.map(a => 
            a.opportunityId === targetApp.opportunityId || a.id === targetApp.id
              ? { ...a, status: newStatus, recruiterNotes: notes, updatedAt: timestamp }
              : a
          );
          localStorage.setItem(demoStudentKey, JSON.stringify(syncDemo));
        } catch {}
      }
    }

    if (isSupabaseConfigured && user) {
      try {
        await supabase
          .from('applications')
          .update({
            status: newStatus,
            recruiter_notes: notes,
            updated_at: timestamp,
          })
          .eq('id', applicationId);
      } catch (dbErr: any) {
        console.warn('[RecruiterDashboard] Supabase update status error:', dbErr.message);
      }
    }
  };

  const navItems: { key: RecruiterTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'post', label: 'Post Opportunity', icon: <PlusCircle className="w-4 h-4" /> },
    { 
      key: 'my_opportunities', 
      label: 'My Opportunities', 
      icon: <ListOrdered className="w-4 h-4" />, 
      badge: `${myOpportunities.length}` 
    },
    { key: 'applicants', label: 'Applicants', icon: <Users className="w-4 h-4" />, badge: `${applications.length}` },
    { key: 'profile', label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/10 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center text-white shadow-glow-violet">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base text-white tracking-tight">Skill<span className="gradient-text">Bridge</span></span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
                Recruiter Portal
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToLanding}
            className="text-xs text-slate-300 hover:text-white glass-panel px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all flex items-center space-x-1.5"
          >
            <span>Landing Page</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          <div className="flex items-center space-x-2.5 pl-3 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                profile?.name?.charAt(0) || 'E'
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white max-w-[120px] truncate">
                {profile?.name || 'Elena Rostova'}
              </div>
              <div className="text-[10px] text-slate-400">{profile?.company || 'Nexus Cloud India'}</div>
            </div>

            <button
              onClick={() => signOut()}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-grow flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
          <div className="glass-card rounded-2xl border border-white/10 p-4 space-y-1 shadow-lg">
            <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Recruiter Menu
            </div>
            {navItems.map(item => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-glow-violet border border-violet-400/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Stats Widget */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
            <span className="text-xs font-semibold text-slate-300">Active Talent Drives</span>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-navy-950/70 border border-white/5">
                <div className="text-lg font-black text-white">{myOpportunities.filter(o => o.status === 'active').length}</div>
                <div className="text-[10px] text-slate-400">Openings</div>
              </div>
              <div className="p-2.5 rounded-xl bg-navy-950/70 border border-white/5">
                <div className="text-lg font-black text-emerald-400">{applications.length}</div>
                <div className="text-[10px] text-slate-400">Applicants</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Tabs */}
        <main className="flex-1 min-w-0">
          
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Industry Talent Acquisition Suite</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Welcome, {profile?.name || 'Elena'} 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Source pre-screened university candidates matched against your exact engineering competency matrices across partner institutions.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
                  <div className="p-3 rounded-xl bg-navy-950/60 border border-white/5">
                    <div className="text-[11px] text-slate-400">Active Postings</div>
                    <div className="text-2xl font-black text-white mt-1">
                      {myOpportunities.filter(o => o.status === 'active').length}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950/60 border border-white/5">
                    <div className="text-[11px] text-slate-400">Total Applicants</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">
                      {applications.length}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950/60 border border-white/5">
                    <div className="text-[11px] text-slate-400">Avg Candidate Match</div>
                    <div className="text-2xl font-black text-blue-400 mt-1">
                      83%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950/60 border border-white/5">
                    <div className="text-[11px] text-slate-400">Campus Drives</div>
                    <div className="text-2xl font-black text-violet-400 mt-1">
                      3 Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Openings preview */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-violet-400" />
                    <span>Your Active Postings</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('my_opportunities')}
                    className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
                  >
                    View all ({myOpportunities.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {myOpportunities.slice(0, 2).map(opp => (
                    <div key={opp.id} className="p-4 rounded-xl bg-navy-900/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">{opp.title}</h4>
                        <span className="text-xs text-slate-400">{opp.location} • {opp.stipendOrSalary}</span>
                      </div>
                      <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {opp.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* POST OPPORTUNITY */}
          {activeTab === 'post' && (
            <PostOpportunityForm
              initialCompany={profile?.company || 'Nexus Cloud India'}
              onSubmit={handleCreateOpportunity}
              onSuccessRedirect={() => setActiveTab('my_opportunities')}
            />
          )}

          {/* MY OPPORTUNITIES */}
          {activeTab === 'my_opportunities' && (
            <MyOpportunitiesTab
              opportunities={myOpportunities}
              onUpdate={handleUpdateOpportunity}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteOpportunity}
              onGoToPost={() => setActiveTab('post')}
            />
          )}

          {/* APPLICANTS */}
          {activeTab === 'applicants' && (
            <ApplicantsTab 
              applications={applications} 
              opportunities={myOpportunities}
              onUpdateStatus={handleUpdateApplicationStatus}
            />
          )}

          {/* COMPANY PROFILE */}
          {activeTab === 'profile' && (
            <CompanyProfileTab
              initialCompany={profile?.company || 'Nexus Cloud India'}
            />
          )}

        </main>

      </div>

    </div>
  );
};