// ========================================================
// SkillBridge — Shared TypeScript Interfaces & Data Models
// Used across client and server packages
// ========================================================

export type UserRole = 'student' | 'recruiter' | 'admin';

export type AuthProviderType = 'local' | 'supabase' | 'google' | 'demo';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  college?: string;
  company?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
}

export type SkillCategory = 'frontend' | 'backend' | 'data' | 'cloud' | 'soft_skills';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string;
  demandScore: number; // 1 to 100
}

export interface StudentSkill {
  skillId: string;
  name: string;
  category: SkillCategory;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced';
  verified: boolean;
}

export interface RoleReadinessItem {
  percentage: number;
  strengths: string[];
  gaps: string[];
  missingSkills?: string[];
  recommendation: string;
}

export interface RoleReadinessSummary {
  frontend: RoleReadinessItem;
  backend: RoleReadinessItem;
  dataAnalyst: RoleReadinessItem;
  recommendedRole?: string;
  recommendationMessage?: string;
}

export type AssessedSkillKey = 
  | 'html_css'
  | 'javascript'
  | 'react'
  | 'git'
  | 'sql'
  | 'python'
  | 'communication'
  | 'teamwork'
  | 'problem_solving'
  | 'adaptability';

export interface SkillScoreItem {
  skillKey: AssessedSkillKey;
  name: string;
  score: number; // 1 to 5
  maxScore: number; // 5
  percentage: number; // 20 to 100
  isStrength: boolean;
  isGap: boolean;
}

export interface AssessmentQuestionItem {
  id: number;
  skillKey: AssessedSkillKey;
  skillName: string;
  category: 'technical' | 'soft_skill';
  question: string;
  description: string;
  levelDescriptors: Record<number, string>;
}

export interface AssessmentResult {
  id: string;
  studentId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  overallScore?: number;
  answers?: Record<number, number>;
  skillScores?: Record<string, SkillScoreItem>;
  roleReadiness: RoleReadinessSummary;
  recommendedRole?: string;
  recommendationMessage?: string;
  completedAt: string;
}

export type OpportunityType = 'internship' | 'job' | 'apprenticeship' | 'workshop' | 'fdp';

export type WorkMode = 'remote' | 'hybrid' | 'on_site';

export interface OpportunityMatchResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

export interface Opportunity {
  id: string;
  recruiterId: string;
  title: string;
  company: string;
  type: OpportunityType;
  workMode?: WorkMode;
  location: string;
  stipendOrSalary: string;
  duration?: string;
  deadline: string;
  description: string;
  requiredSkills: string[];
  eligibility: string;
  openingsCount?: number;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt?: string;
}

export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';

export interface CandidateProject {
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface CandidatePortfolioSummary {
  bio?: string;
  college?: string;
  degree?: string;
  graduationYear?: string;
  cgpaOrPercentage?: string;
  roleReadinessScore?: number;
  recommendedRole?: string;
  assessedSkills?: Record<string, number>;
  projects?: CandidateProject[];
  certifications?: Certification[];
  resumeUrl?: string;
  resumeFileName?: string;
  resumeFileSize?: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunity?: Opportunity;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  studentCollege?: string;
  studentAvatarUrl?: string;
  studentRoleReadiness?: number;
  recruiterId?: string;
  matchScore: number;
  matchPercentage?: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendationMessage?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt?: string;
  notes?: string;
  recruiterNotes?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeFileSize?: string;
  candidatePortfolio?: CandidatePortfolioSummary;
}

export interface Certification {
  id: string;
  studentId: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  adminNotes?: string;
  createdAt?: string;
}

export interface StudentProject {
  id: string;
  studentId: string;
  title: string;
  description: string;
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Achievement {
  id: string;
  studentId: string;
  title: string;
  description: string;
  date: string;
  issuer?: string;
}

export interface StudentPortfolio {
  studentId: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  college: string;
  branch: string;
  graduationYear: string;
  bio?: string;
  targetRole: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeFileSize?: string;
  resumeFileType?: string;
  resumeUpdatedAt?: string;
  roleReadinessScore: number;
  completionPercentage: number;
  recommendedRole?: string;
  assessedSkills: Record<string, number>;
  projects: StudentProject[];
  certifications: Certification[];
  achievements: Achievement[];
  internships: Array<{
    id: string;
    title: string;
    company: string;
    status: ApplicationStatus;
    appliedAt: string;
    duration?: string;
  }>;
}

export interface PublicStudentPortfolio {
  studentId: string;
  name: string;
  avatarUrl?: string;
  college: string;
  branch: string;
  graduationYear: string;
  bio?: string;
  targetRole: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeFileSize?: string;
  roleReadinessScore: number;
  recommendedRole?: string;
  assessedSkills: Record<string, number>;
  projects: StudentProject[];
  certifications: Certification[];
  achievements: Achievement[];
}

export interface AdminKpiMetrics {
  totalStudents: number;
  activeOpportunities: number;
  totalApplications: number;
  placementReadyStudents: number;
  selectedCandidates: number;
  averageRoleReadiness: number;
}

export interface AdminSkillGapItem {
  skill: string;
  studentCount: number;
  percentage: number;
  gapLevel: 'high' | 'medium' | 'low';
}

export interface AdminInDemandSkillItem {
  skill: string;
  demandCount: number;
  demandScore: number;
}

export interface AdminReadinessDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface AdminBranchOutcome {
  branch: string;
  totalStudents: number;
  placedCount: number;
  placementRate: number;
}

export interface AdminVerificationItem {
  id: string;
  type: 'project' | 'certificate';
  studentId: string;
  studentName: string;
  studentCollege: string;
  studentBranch: string;
  title: string;
  descriptionOrIssuer: string;
  link?: string;
  githubUrl?: string;
  tech?: string[];
  status: 'Pending' | 'Verified' | 'Rejected';
  submittedAt: string;
  adminNotes?: string;
}

export interface AdminStudentSummary {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  graduationYear: string;
  roleReadinessScore: number;
  targetRole: string;
  applicationsCount: number;
  verifiedProjectsCount: number;
  verifiedCertsCount: number;
  placementStatus: 'Placed' | 'In Process' | 'Seeking';
}

export interface AdminAnalyticsData {
  kpis: AdminKpiMetrics;
  skillGaps: AdminSkillGapItem[];
  inDemandSkills: AdminInDemandSkillItem[];
  readinessDistribution: AdminReadinessDistribution[];
  branchOutcomes: AdminBranchOutcome[];
  applicationStatusBreakdown: Record<ApplicationStatus, number>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

