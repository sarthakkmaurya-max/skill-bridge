import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  AdminKpiMetrics, 
  AdminStudentSummary, 
  AdminVerificationItem, 
  AdminAnalyticsData,
  Opportunity, 
  Application, 
  StudentPortfolio 
} from '@skillbridge/shared';
import { 
  SAMPLE_ADMIN_STUDENTS, 
  SAMPLE_ADMIN_VERIFICATIONS, 
  SAMPLE_ADMIN_ANALYTICS, 
  SAMPLE_OPPORTUNITIES, 
  SAMPLE_APPLICATIONS 
} from '../../lib/sampleData';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminStudentsTab } from './AdminStudentsTab';
import { AdminOpportunitiesTab } from './AdminOpportunitiesTab';
import { AdminApplicationsTab } from './AdminApplicationsTab';
import { AdminVerificationsTab } from './AdminVerificationsTab';
import { AdminAnalyticsTab } from './AdminAnalyticsTab';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Award, 
  BarChart3, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  School,
  CheckCircle2
} from 'lucide-react';

type AdminTab = 'overview' | 'students' | 'opportunities' | 'applications' | 'verifications' | 'analytics';

interface AdminDashboardProps {
  onBackToLanding: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToLanding }) => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // State with localStorage sandbox continuity
  const [students, setStudents] = useState<AdminStudentSummary[]>(() => {
    const cached = localStorage.getItem('skillbridge_admin_students_demo');
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    return SAMPLE_ADMIN_STUDENTS;
  });

  const [verifications, setVerifications] = useState<AdminVerificationItem[]>(() => {
    const cached = localStorage.getItem('skillbridge_admin_verifications_demo');
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    return SAMPLE_ADMIN_VERIFICATIONS;
  });

  const [opportunities] = useState<Opportunity[]>(SAMPLE_OPPORTUNITIES);
  const [applications] = useState<Application[]>(SAMPLE_APPLICATIONS);
  const [analytics, setAnalytics] = useState<AdminAnalyticsData>(SAMPLE_ADMIN_ANALYTICS);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync verifications to localStorage
  const saveVerifications = (updated: AdminVerificationItem[]) => {
    setVerifications(updated);
    localStorage.setItem('skillbridge_admin_verifications_demo', JSON.stringify(updated));
  };

  const handleUpdateVerificationStatus = async (
    type: 'project' | 'certificate',
    id: string,
    status: 'Verified' | 'Rejected',
    adminNotes?: string
  ) => {
    const updated = verifications.map((item) => {
      if (item.id === id && item.type === type) {
        return {
          ...item,
          status,
          adminNotes: adminNotes || item.adminNotes || (status === 'Verified' ? 'Verified by campus career services.' : 'Revisions requested.'),
        };
      }
      return item;
    });
    saveVerifications(updated);

    // Also update student's local portfolio if it exists so Alex Rivera sees the badge immediately
    const studentCache = localStorage.getItem('skillbridge_portfolio_demo');
    if (studentCache) {
      try {
        const port: StudentPortfolio = JSON.parse(studentCache);
        if (type === 'project') {
          port.projects = port.projects.map(p => p.id === id ? { ...p, status, adminNotes: adminNotes || p.adminNotes } : p);
        } else {
          port.certifications = port.certifications.map(c => c.id === id ? { ...c, status, adminNotes: adminNotes || c.adminNotes } : c);
        }
        localStorage.setItem('skillbridge_portfolio_demo', JSON.stringify(port));
      } catch {}
    }

    setNotification(`${type === 'project' ? 'Project' : 'Certificate'} marked as ${status}!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const pendingCount = verifications.filter(v => v.status === 'Pending').length;

  const navItems: { key: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'students', label: 'Students Directory', icon: <GraduationCap className="w-4 h-4" />, badge: `${students.length}` },
    { key: 'opportunities', label: 'Campus Drives', icon: <Briefcase className="w-4 h-4" />, badge: `${opportunities.length}` },
    { key: 'applications', label: 'Applications', icon: <FileText className="w-4 h-4" />, badge: `${applications.length}` },
    { 
      key: 'verifications', 
      label: 'Verifications', 
      icon: <Award className="w-4 h-4" />, 
      badge: pendingCount > 0 ? `${pendingCount} New` : undefined 
    },
    { key: 'analytics', label: 'Skill Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/10 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-glow-emerald">
            <School className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base text-white tracking-tight">Skill<span className="gradient-text">Bridge</span></span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                College Admin Portal
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                profile?.name?.charAt(0) || 'D'
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white max-w-[140px] truncate">
                {profile?.name || 'Dr. Devraj Patel'}
              </div>
              <div className="text-[10px] text-emerald-400">{profile?.college || 'Apex Institute'} • Dean</div>
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

      {/* Notification toast */}
      {notification && (
        <div className="w-full bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border-b border-emerald-500/30 py-2 px-4 text-center text-xs text-emerald-200 flex items-center justify-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Dashboard Body */}
      <div className="flex-grow flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
          <div className="glass-card rounded-2xl border border-white/10 p-4 space-y-1 shadow-lg">
            <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Administration
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-glow-emerald border border-emerald-400/30 font-bold'
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

          {/* Quick Metrics in Sidebar */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Batch Placement Rate</span>
              <span className="font-black text-emerald-400">94.2%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '94.2%' }} />
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Apex Institute ranks in the top 5% nationally for verified tech placements.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-900/60 border border-white/5 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Campus Career Cell</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Authorized Authority: Dr. Devraj Patel (Dean)
            </p>
          </div>
        </aside>

        {/* Main Content View */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <AdminOverviewTab
              kpis={analytics.kpis}
              pendingVerifications={verifications}
              students={students}
              opportunities={opportunities}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'students' && (
            <AdminStudentsTab students={students} />
          )}

          {activeTab === 'opportunities' && (
            <AdminOpportunitiesTab opportunities={opportunities} />
          )}

          {activeTab === 'applications' && (
            <AdminApplicationsTab applications={applications} />
          )}

          {activeTab === 'verifications' && (
            <AdminVerificationsTab
              verifications={verifications}
              onUpdateStatus={handleUpdateVerificationStatus}
            />
          )}

          {activeTab === 'analytics' && (
            <AdminAnalyticsTab analytics={analytics} />
          )}
        </main>

      </div>

    </div>
  );
};
