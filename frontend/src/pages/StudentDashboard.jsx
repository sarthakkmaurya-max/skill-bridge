import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import ReadinessTab from './student/ReadinessTab';
import AssessmentTab from './student/AssessmentTab';
import OpportunitiesTab from './student/OpportunitiesTab';
import ApplicationsTab from './student/ApplicationsTab';
import PortfolioTab from './student/PortfolioTab';
import { TrendingUp, BrainCircuit, Briefcase, Send, Award } from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('readiness');
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [projects, setProjects] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profRes, oppsRes, appsRes] = await Promise.all([
        api.getProfile(),
        api.getOpportunities(),
        api.getMyApplications(),
      ]);

      if (profRes.success) {
        setProfileData(profRes.profile);
        setCertificates(profRes.certificates || []);
        setProjects(profRes.projects || []);
      }
      if (oppsRes.success) {
        setOpportunities(oppsRes.opportunities || []);
      }
      if (appsRes.success) {
        setApplications(appsRes.applications || []);
      }
    } catch (err) {
      console.error('Error loading student data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const tabs = [
    { id: 'readiness', label: 'Role Readiness', icon: TrendingUp },
    { id: 'assessment', label: 'Skill Assessment', icon: BrainCircuit },
    { id: 'opportunities', label: 'Find Opportunities', icon: Briefcase, count: opportunities.length },
    { id: 'applications', label: 'Applications Tracker', icon: Send, count: applications.length },
    { id: 'portfolio', label: 'Digital Portfolio', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#081225] text-slate-100 relative overflow-hidden pb-24 selection:bg-blue-500/30 selection:text-white">
      {/* Ambient background glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute top-10 left-1/4 w-[650px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-violet-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-20 left-1/3 w-[450px] h-[450px] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Sticky Subnav */}
      <div className="bg-[#081225]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 sticky top-16 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2.5 no-scrollbar scroll-smooth" aria-label="Student sections">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 py-2 px-3.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Sliding active pill indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSubnavTab"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/25 to-violet-600/25 border border-blue-500/40 shadow-sm shadow-blue-500/20"
                    />
                  )}

                  <Icon className={`w-4 h-4 relative z-10 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="relative z-10 font-semibold">{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                        isActive
                          ? 'bg-blue-500/25 text-blue-200 border border-blue-400/40'
                          : 'bg-white/[0.06] text-slate-400 border border-white/10'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 rounded-full blur-md bg-blue-500/20" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wide">
              Loading student workspace...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {activeTab === 'readiness' && (
                <ReadinessTab
                  profileData={profileData}
                  onStartQuiz={() => setActiveTab('assessment')}
                  onSelectRole={() => setActiveTab('opportunities')}
                />
              )}
              {activeTab === 'assessment' && (
                <AssessmentTab
                  onCompleted={() => {
                    loadData();
                    setActiveTab('readiness');
                  }}
                />
              )}
              {activeTab === 'opportunities' && (
                <OpportunitiesTab
                  opportunities={opportunities}
                  studentSkills={profileData?.skills || []}
                  applications={applications}
                  onApplicationSubmitted={() => {
                    loadData();
                    setActiveTab('applications');
                  }}
                />
              )}
              {activeTab === 'applications' && (
                <ApplicationsTab
                  applications={applications}
                  onExplore={() => setActiveTab('opportunities')}
                />
              )}
              {activeTab === 'portfolio' && (
                <PortfolioTab
                  profileData={profileData}
                  certificates={certificates}
                  projects={projects}
                  onRefresh={loadData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}