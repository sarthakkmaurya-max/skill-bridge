import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { 
  AssessmentResult, 
  calculateRoleReadiness, 
  calculateOpportunityMatch,
  Opportunity, 
  Application, 
  Certification,
  StudentPortfolio,
  StudentProject,
  Achievement
} from '@skillbridge/shared';
import { 
  getSampleStudentAssessment, 
  SAMPLE_OPPORTUNITIES, 
  SAMPLE_APPLICATIONS, 
  SAMPLE_CERTIFICATIONS,
  SAMPLE_STUDENT_PORTFOLIO
} from '../../lib/sampleData';
import { OverviewTab } from './OverviewTab';
import { SkillAssessmentWizard } from './SkillAssessmentWizard';
import { AssessmentResults } from './AssessmentResults';
import { OpportunitiesTab } from './OpportunitiesTab';
import { ApplicationsTab } from './ApplicationsTab';
import { PortfolioTab } from './PortfolioTab';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Briefcase, 
  FileText, 
  Award, 
  ExternalLink, 
  LogOut, 
  CheckCircle2, 
  ShieldCheck, 
  RotateCcw,
  Compass
} from 'lucide-react';

type DashboardTab = 'overview' | 'assessment' | 'opportunities' | 'applications' | 'portfolio';

interface StudentDashboardProps {
  onBackToLanding: () => void;
}

const ASSESSMENT_STORAGE_KEYS = (userId?: string) => {
  const keys = ['skillbridge_assessment_latest'];
  if (userId) {
    keys.push(`skillbridge_assessment_${userId}`);
  }
  keys.push('skillbridge_assessment_demo-student-id');
  keys.push('skillbridge_assessment_demo');
  return keys;
};

export const getStoredAssessment = (userId?: string): AssessmentResult | null => {
  try {
    const keys = ASSESSMENT_STORAGE_KEYS(userId);
    for (const key of keys) {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        if (parsed && parsed.skillScores && parsed.roleReadiness) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error('Failed to parse stored assessment:', err);
  }
  return null;
};

export const saveAssessmentLocally = (result: AssessmentResult, userId?: string) => {
  try {
    const json = JSON.stringify(result);
    localStorage.setItem('skillbridge_assessment_latest', json);
    if (userId) {
      localStorage.setItem(`skillbridge_assessment_${userId}`, json);
    }
    localStorage.setItem('skillbridge_assessment_demo-student-id', json);
    localStorage.setItem('skillbridge_assessment_demo', json);
    window.dispatchEvent(new CustomEvent('skillbridge:assessment_updated', { detail: result }));
  } catch (err) {
    console.error('Failed to save assessment locally:', err);
  }
};

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onBackToLanding }) => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  
  // Assessment state: initialized from local storage if available
  const [latestAssessment, setLatestAssessment] = useState<AssessmentResult | null>(() => {
    return getStoredAssessment();
  });
  const [isTakingAssessment, setIsTakingAssessment] = useState<boolean>(false);
  const [submittingAssessment, setSubmittingAssessment] = useState<boolean>(false);

  // Opportunities & Applications state
  const [opportunities] = useState<Opportunity[]>(SAMPLE_OPPORTUNITIES);
  const [applications, setApplications] = useState<Application[]>(SAMPLE_APPLICATIONS);
  const [certifications] = useState<Certification[]>(SAMPLE_CERTIFICATIONS);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  // Portfolio state with localStorage caching for demo mode
  const [portfolio, setPortfolio] = useState<StudentPortfolio>(() => {
    const cached = localStorage.getItem('skillbridge_portfolio_demo');
    const storedAss = getStoredAssessment();
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (storedAss) {
          return {
            ...parsed,
            roleReadinessScore: storedAss.percentage,
            recommendedRole: storedAss.recommendedRole || parsed.recommendedRole,
            targetRole: storedAss.recommendedRole || parsed.targetRole,
          };
        }
        return parsed;
      } catch {}
    }
    const initial = { ...SAMPLE_STUDENT_PORTFOLIO };
    if (storedAss) {
      initial.roleReadinessScore = storedAss.percentage;
      initial.recommendedRole = storedAss.recommendedRole || initial.recommendedRole;
      initial.targetRole = storedAss.recommendedRole || initial.targetRole;
    }
    return initial;
  });

  // Save portfolio changes to localStorage
  const savePortfolio = (updated: StudentPortfolio) => {
    setPortfolio(updated);
    localStorage.setItem('skillbridge_portfolio_demo', JSON.stringify(updated));
  };

  // Sync latest assessment & applications into portfolio
  useEffect(() => {
    if (latestAssessment) {
      setPortfolio((prev) => {
        const assessed: Record<string, number> = {};
        if (latestAssessment.skillScores) {
          Object.entries(latestAssessment.skillScores).forEach(([k, item]) => {
            assessed[item.name] = (item.score || 3) * 20;
          });
        }
        const updated = {
          ...prev,
          roleReadinessScore: latestAssessment.percentage,
          recommendedRole: latestAssessment.recommendedRole,
          assessedSkills: { ...prev.assessedSkills, ...assessed },
        };
        localStorage.setItem('skillbridge_portfolio_demo', JSON.stringify(updated));
        return updated;
      });
    }
  }, [latestAssessment]);

  // Sync applications into portfolio internships
  useEffect(() => {
    if (applications && applications.length > 0) {
      setPortfolio((prev) => {
        const internships = applications.map((a) => ({
          id: a.id,
          title: a.opportunity?.title || 'Applied Opportunity',
          company: a.opportunity?.company || 'Industry Partner',
          status: a.status,
          appliedAt: a.appliedAt,
          duration: a.opportunity?.duration || '3-6 Months',
        }));
        const updated = {
          ...prev,
          internships,
        };
        localStorage.setItem('skillbridge_portfolio_demo', JSON.stringify(updated));
        return updated;
      });
    }
  }, [applications]);

  const handleUpdateProfile = async (data: { 
    targetRole?: string; 
    bio?: string; 
    resumeUrl?: string; 
    resumeFileName?: string;
    resumeFileSize?: string;
    resumeFileType?: string;
    resumeUpdatedAt?: string;
    branch?: string; 
    graduationYear?: string 
  }) => {
    const updated = {
      ...portfolio,
      targetRole: data.targetRole !== undefined ? data.targetRole : portfolio.targetRole,
      bio: data.bio !== undefined ? data.bio : portfolio.bio,
      resumeUrl: data.resumeUrl !== undefined ? data.resumeUrl : portfolio.resumeUrl,
      resumeFileName: data.resumeFileName !== undefined ? data.resumeFileName : portfolio.resumeFileName,
      resumeFileSize: data.resumeFileSize !== undefined ? data.resumeFileSize : portfolio.resumeFileSize,
      resumeFileType: data.resumeFileType !== undefined ? data.resumeFileType : portfolio.resumeFileType,
      resumeUpdatedAt: data.resumeUpdatedAt !== undefined ? data.resumeUpdatedAt : portfolio.resumeUpdatedAt,
      branch: data.branch !== undefined ? data.branch : portfolio.branch,
      graduationYear: data.graduationYear !== undefined ? data.graduationYear : portfolio.graduationYear,
    };
    savePortfolio(updated);
    setAppliedNotification('Profile & Resume updated successfully!');
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  const handleAddProject = async (proj: Partial<StudentProject>) => {
    const newProj: StudentProject = {
      id: `proj-${Date.now()}`,
      studentId: user?.id || 'demo-student-id',
      title: proj.title || 'New Project',
      description: proj.description || '',
      technologies: proj.technologies || [],
      projectUrl: proj.projectUrl || '',
      githubUrl: proj.githubUrl || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedProjects = [newProj, ...portfolio.projects];
    const updated = {
      ...portfolio,
      projects: updatedProjects,
      completionPercentage: Math.min(100, portfolio.completionPercentage + 5),
    };
    savePortfolio(updated);
    setAppliedNotification(`Project "${newProj.title}" submitted for verification.`);
    setTimeout(() => setAppliedNotification(null), 4000);
  };

  const handleEditProject = async (proj: Partial<StudentProject>) => {
    const updatedProjects = portfolio.projects.map((p) => {
      if (p.id === proj.id) {
        return {
          ...p,
          title: proj.title || p.title,
          description: proj.description || p.description,
          technologies: proj.technologies || p.technologies,
          projectUrl: proj.projectUrl !== undefined ? proj.projectUrl : p.projectUrl,
          githubUrl: proj.githubUrl !== undefined ? proj.githubUrl : p.githubUrl,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    savePortfolio({ ...portfolio, projects: updatedProjects });
    setAppliedNotification('Project updated successfully.');
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  const handleDeleteProject = async (id: string) => {
    const updatedProjects = portfolio.projects.filter((p) => p.id !== id);
    savePortfolio({ ...portfolio, projects: updatedProjects });
    setAppliedNotification('Project removed from portfolio.');
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  const handleAddCert = async (cert: Partial<Certification>) => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      studentId: user?.id || 'demo-student-id',
      title: cert.title || 'Certification',
      issuer: cert.issuer || 'Accreditor',
      issueDate: cert.issueDate || new Date().toISOString().split('T')[0],
      credentialUrl: cert.credentialUrl || '',
      fileUrl: cert.fileUrl || '',
      fileName: cert.fileName || '',
      fileSize: cert.fileSize || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    const updatedCerts = [newCert, ...portfolio.certifications];
    savePortfolio({ ...portfolio, certifications: updatedCerts });
    setAppliedNotification(`Certificate "${newCert.title}" submitted for institutional verification.`);
    setTimeout(() => setAppliedNotification(null), 4000);
  };

  const handleDeleteCert = async (id: string) => {
    const updatedCerts = portfolio.certifications.filter((c) => c.id !== id);
    savePortfolio({ ...portfolio, certifications: updatedCerts });
    setAppliedNotification('Certificate removed.');
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  const handleAddAchievement = async (ach: Partial<Achievement>) => {
    const newAch: Achievement = {
      id: `ach-${Date.now()}`,
      studentId: user?.id || 'demo-student-id',
      title: ach.title || 'Achievement',
      description: ach.description || '',
      date: ach.date || new Date().toISOString().split('T')[0],
      issuer: ach.issuer || '',
    };
    const updatedAchs = [newAch, ...portfolio.achievements];
    savePortfolio({ ...portfolio, achievements: updatedAchs });
    setAppliedNotification('Honor / Achievement added.');
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  const handleDeleteAchievement = async (id: string) => {
    const updatedAchs = portfolio.achievements.filter((a) => a.id !== id);
    savePortfolio({ ...portfolio, achievements: updatedAchs });
    setAppliedNotification('Achievement removed.');
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  // Load assessment on mount or session restore
  useEffect(() => {
    const loadAssessment = async () => {
      const local = getStoredAssessment(user?.id);
      if (local) {
        setLatestAssessment(local);
        if (!isSupabaseConfigured || !user) {
          return;
        }
      }

      if (!isSupabaseConfigured || !user) {
        if (!local) {
          const sample = getSampleStudentAssessment();
          setLatestAssessment(sample);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('student_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          const loaded: AssessmentResult = {
            id: data.id,
            studentId: data.student_id,
            totalScore: data.total_score,
            maxScore: data.max_score,
            percentage: data.percentage,
            answers: data.answers || {},
            skillScores: data.skill_scores || {},
            roleReadiness: data.role_readiness,
            recommendedRole: data.recommended_role,
            recommendationMessage: data.recommendation_message,
            completedAt: data.completed_at,
          };
          setLatestAssessment(loaded);
          saveAssessmentLocally(loaded, user.id);
        } else if (!local) {
          const sample = getSampleStudentAssessment();
          setLatestAssessment(sample);
        }
      } catch {
        if (!local) {
          const sample = getSampleStudentAssessment();
          setLatestAssessment(sample);
        }
      }
    };

    loadAssessment();
  }, [user]);

  // Load applications on mount or session restore
  useEffect(() => {
    const loadApplications = async () => {
      const appKey = `skillbridge_applications_${user?.id || 'demo'}`;
      const cached = localStorage.getItem(appKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setApplications(parsed);
            return;
          }
        } catch {
          // fallback
        }
      }

      if (!isSupabaseConfigured || !user) {
        setApplications(SAMPLE_APPLICATIONS);
        localStorage.setItem(appKey, JSON.stringify(SAMPLE_APPLICATIONS));
        return;
      }

      try {
        const { data, error } = await supabase
          .from('applications')
          .select(`*, opportunity:opportunities (*)`)
          .eq('student_id', user.id)
          .order('applied_at', { ascending: false });

        if (data && !error && data.length > 0) {
          const mapped: Application[] = data.map((d: any) => ({
            id: d.id,
            opportunityId: d.opportunity_id,
            opportunity: d.opportunity,
            studentId: d.student_id,
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
          setApplications(SAMPLE_APPLICATIONS);
          localStorage.setItem(appKey, JSON.stringify(SAMPLE_APPLICATIONS));
        }
      } catch {
        setApplications(SAMPLE_APPLICATIONS);
      }
    };

    loadApplications();
  }, [user]);

  const handleAssessmentSubmit = async (answers: Record<number, number>) => {
    setSubmittingAssessment(true);
    try {
      const calculated = calculateRoleReadiness(answers);
      const studentId = user?.id || 'demo-student-id';
      const timestamp = new Date().toISOString();

      const newResult: AssessmentResult = {
        id: `assessment-${Date.now()}`,
        studentId,
        totalScore: calculated.totalScore,
        maxScore: calculated.maxScore,
        percentage: calculated.percentage,
        overallScore: calculated.overallScore,
        answers,
        skillScores: calculated.skillScores,
        roleReadiness: calculated.roleReadiness,
        recommendedRole: calculated.recommendedRole,
        recommendationMessage: calculated.recommendationMessage,
        completedAt: timestamp,
      };

      // Persist across all local storage keys for foolproof demo continuity
      saveAssessmentLocally(newResult, user?.id);

      // Immediately sync into portfolio state and cache
      const assessedSkillsMap: Record<string, number> = {};
      Object.entries(calculated.skillScores).forEach(([_, item]) => {
        assessedSkillsMap[item.name] = item.score * 20;
      });

      setPortfolio((prev) => {
        const updated = {
          ...prev,
          roleReadinessScore: calculated.percentage,
          recommendedRole: calculated.recommendedRole,
          targetRole: calculated.recommendedRole,
          assessedSkills: { ...prev.assessedSkills, ...assessedSkillsMap },
        };
        localStorage.setItem('skillbridge_portfolio_demo', JSON.stringify(updated));
        return updated;
      });

      if (isSupabaseConfigured && user) {
        try {
          await supabase.from('assessments').insert({
            student_id: studentId,
            total_score: calculated.totalScore,
            max_score: calculated.maxScore,
            percentage: calculated.percentage,
            answers,
            skill_scores: calculated.skillScores,
            role_readiness: calculated.roleReadiness,
            recommended_role: calculated.recommendedRole,
            recommendation_message: calculated.recommendationMessage,
            completed_at: timestamp,
          });
        } catch (dbErr: any) {
          console.warn('[StudentDashboard] Supabase insert warning:', dbErr.message);
        }
      }

      setLatestAssessment(newResult);
      setIsTakingAssessment(false);
      setActiveTab('assessment');
    } finally {
      setSubmittingAssessment(false);
    }
  };

  const handleQuickApply = async (opportunity: Opportunity, message?: string) => {
    const existing = applications.find((a) => a.opportunityId === opportunity.id);
    if (existing) {
      setAppliedNotification(`You have already applied to ${opportunity.title}.`);
      setTimeout(() => setAppliedNotification(null), 3500);
      return;
    }

    const ratingsMap: Record<string, number> = {};
    if (latestAssessment?.skillScores) {
      Object.entries(latestAssessment.skillScores).forEach(([k, item]) => {
        ratingsMap[k] = item.score;
      });
    }
    const match = calculateOpportunityMatch(ratingsMap, opportunity);
    const studentId = user?.id || 'demo-student-id';
    const appKey = `skillbridge_applications_${user?.id || 'demo'}`;
    const timestamp = new Date().toISOString();

    const newApp: Application = {
      id: `app-${Date.now()}`,
      opportunityId: opportunity.id,
      opportunity,
      studentId,
      studentName: profile?.name || 'Alex Rivera',
      studentEmail: user?.email || 'alex.rivera@apex.edu',
      studentCollege: profile?.college || 'Apex Institute of Technology',
      studentRoleReadiness: latestAssessment?.percentage || 88,
      recruiterId: opportunity.recruiterId,
      matchScore: match.matchPercentage,
      matchPercentage: match.matchPercentage,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      recommendationMessage: match.recommendation,
      status: 'Applied',
      appliedAt: timestamp,
      updatedAt: timestamp,
      notes: message || 'Applied via SkillBridge Portal.',
      recruiterNotes: '',
      resumeUrl: portfolio.resumeUrl || 'https://alexrivera.dev/resume.pdf',
      resumeFileName: portfolio.resumeFileName || 'Alex_Rivera_Resume.pdf',
      resumeFileSize: portfolio.resumeFileSize || '245 KB',
      candidatePortfolio: {
        bio: portfolio.bio,
        college: portfolio.college,
        degree: portfolio.branch,
        graduationYear: portfolio.graduationYear,
        roleReadinessScore: latestAssessment?.percentage || portfolio.roleReadinessScore,
        recommendedRole: latestAssessment?.recommendedRole || portfolio.recommendedRole,
        assessedSkills: portfolio.assessedSkills,
        projects: portfolio.projects.map((p) => ({
          title: p.title,
          description: p.description,
          tech: p.technologies,
          githubUrl: p.githubUrl,
          liveUrl: p.projectUrl,
        })),
        certifications: portfolio.certifications,
        resumeUrl: portfolio.resumeUrl || 'https://alexrivera.dev/resume.pdf',
        resumeFileName: portfolio.resumeFileName || 'Alex_Rivera_Resume.pdf',
        resumeFileSize: portfolio.resumeFileSize || '245 KB',
      },
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    localStorage.setItem(appKey, JSON.stringify(updated));

    // Also update demo recruiter's applications cache if applicable
    const recruiterCacheKey = `skillbridge_recruiter_applications_demo`;
    const cachedRecruiterApps = localStorage.getItem(recruiterCacheKey);
    if (cachedRecruiterApps) {
      try {
        const parsed = JSON.parse(cachedRecruiterApps);
        localStorage.setItem(recruiterCacheKey, JSON.stringify([newApp, ...parsed]));
      } catch {}
    }

    if (isSupabaseConfigured && user) {
      try {
        await supabase.from('applications').insert({
          opportunity_id: opportunity.id,
          student_id: user.id,
          recruiter_id: opportunity.recruiterId,
          match_percentage: match.matchPercentage,
          matched_skills: match.matchedSkills,
          missing_skills: match.missingSkills,
          recommendation_message: match.recommendation,
          status: 'Applied',
          notes: newApp.notes,
          applied_at: timestamp,
          updated_at: timestamp,
        });
      } catch (dbErr: any) {
        console.warn('[StudentDashboard] Supabase application insert error:', dbErr.message);
      }
    }

    setAppliedNotification(`Application submitted for ${opportunity.title} at ${opportunity.company}!`);
    setActiveTab('applications');
    setTimeout(() => setAppliedNotification(null), 4500);
  };

  const navItems: { key: DashboardTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { 
      key: 'assessment', 
      label: 'Skill Assessment', 
      icon: <BrainCircuit className="w-4 h-4" />,
      badge: latestAssessment ? `${latestAssessment.percentage}%` : 'New' 
    },
    { key: 'opportunities', label: 'Opportunities', icon: <Briefcase className="w-4 h-4" />, badge: `${opportunities.length}` },
    { key: 'applications', label: 'Applications', icon: <FileText className="w-4 h-4" />, badge: `${applications.length}` },
    { key: 'portfolio', label: 'Digital Portfolio', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/10 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-glow-blue">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base text-white tracking-tight">Skill<span className="gradient-text">Bridge</span></span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25">
                Student Portal
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                profile?.name?.charAt(0) || 'A'
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white max-w-[120px] truncate">
                {profile?.name || 'Alex Rivera'}
              </div>
              <div className="text-[10px] text-slate-400">Student Account</div>
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

      {/* Applied Banner Notification */}
      {appliedNotification && (
        <div className="w-full bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border-b border-emerald-500/30 py-2.5 px-4 text-center text-xs text-emerald-200 flex items-center justify-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{appliedNotification}</span>
        </div>
      )}

      {/* Dashboard Body with Sidebar */}
      <div className="flex-grow flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
          <div className="glass-card rounded-2xl border border-white/10 p-4 space-y-1 shadow-lg">
            <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Student Navigation
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    if (item.key === 'assessment') {
                      setIsTakingAssessment(false);
                    }
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-glow-blue border border-blue-400/30 font-bold'
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

          {/* Quick Readiness Card in Sidebar */}
          {latestAssessment && (
            <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Readiness Benchmark</span>
                <span className="text-sm font-black gradient-text">{latestAssessment.percentage}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full"
                  style={{ width: `${latestAssessment.percentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Best Fit: <strong className="text-white">{latestAssessment.recommendedRole}</strong>
              </p>
              <button
                onClick={() => {
                  setActiveTab('assessment');
                  setIsTakingAssessment(true);
                }}
                className="w-full py-2 px-3 rounded-lg border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 text-[11px] font-semibold transition-all flex items-center justify-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retake Test</span>
              </button>
            </div>
          )}

          {/* Institutional Trust Badge */}
          <div className="p-3.5 rounded-xl bg-navy-900/60 border border-white/5 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Institution</span>
            </div>
            <p className="text-[10px] text-slate-400">
              {profile?.college || 'Apex Institute of Technology'} • Career Services Cell
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <OverviewTab
              studentName={profile?.name || 'Alex'}
              latestAssessment={latestAssessment}
              opportunities={opportunities}
              applications={applications}
              onGoToAssessment={(retake) => {
                setActiveTab('assessment');
                setIsTakingAssessment(Boolean(retake));
              }}
              onGoToOpportunities={() => setActiveTab('opportunities')}
              onQuickApply={handleQuickApply}
            />
          )}

          {activeTab === 'assessment' && (
            <div className="space-y-6 animate-fadeIn">
              {isTakingAssessment ? (
                <SkillAssessmentWizard
                  initialAnswers={latestAssessment?.answers || {}}
                  onSubmit={handleAssessmentSubmit}
                  onCancel={latestAssessment ? () => setIsTakingAssessment(false) : undefined}
                  submitting={submittingAssessment}
                />
              ) : latestAssessment ? (
                <AssessmentResults
                  result={latestAssessment}
                  onRetake={() => setIsTakingAssessment(true)}
                  onExploreOpportunities={() => setActiveTab('opportunities')}
                />
              ) : (
                <div className="glass-card p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
                  <BrainCircuit className="w-12 h-12 text-blue-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No Assessment on Record</h3>
                  <p className="text-xs text-slate-400">
                    Take the 10-question standardized assessment to calculate your industry Role Readiness score.
                  </p>
                  <button
                    onClick={() => setIsTakingAssessment(true)}
                    className="px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-glow-blue"
                  >
                    Start 10-Question Assessment
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'opportunities' && (
            <OpportunitiesTab
              opportunities={opportunities}
              applications={applications}
              latestAssessment={latestAssessment}
              onQuickApply={handleQuickApply}
            />
          )}

          {activeTab === 'applications' && (
            <ApplicationsTab 
              applications={applications} 
              onExploreOpportunities={() => setActiveTab('opportunities')}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioTab
              portfolio={portfolio}
              onUpdateProfile={handleUpdateProfile}
              onAddProject={handleAddProject}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
              onAddCert={handleAddCert}
              onDeleteCert={handleDeleteCert}
              onAddAchievement={handleAddAchievement}
              onDeleteAchievement={handleDeleteAchievement}
            />
          )}
        </main>

      </div>

    </div>
  );
};