import { Router, Response } from 'express';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { 
  ApiResponse, 
  AdminAnalyticsData, 
  AdminStudentSummary, 
  AdminVerificationItem, 
  ApplicationStatus 
} from '@skillbridge/shared';

export const adminRouter = Router();

// In-memory demo data for Apex Institute of Technology
let demoVerifications: AdminVerificationItem[] = [
  {
    id: 'proj-3',
    type: 'project',
    studentId: 'demo-student-id',
    studentName: 'Alex Rivera',
    studentCollege: 'Apex Institute of Technology',
    studentBranch: 'Computer Science & Engineering',
    title: 'Distributed Distributed Ledger Microservice',
    descriptionOrIssuer: 'High-throughput idempotency ledger with Redis caching and PostgreSQL ACID safety.',
    link: 'https://github.com/alexrivera/ledger-service',
    githubUrl: 'https://github.com/alexrivera/ledger-service',
    tech: ['Python', 'PostgreSQL', 'Docker', 'Redis'],
    status: 'Pending',
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: '',
  },
  {
    id: 'cert-3',
    type: 'certificate',
    studentId: 'demo-student-id',
    studentName: 'Alex Rivera',
    studentCollege: 'Apex Institute of Technology',
    studentBranch: 'Computer Science & Engineering',
    title: 'Docker Containerization & Kubernetes Fundamentals',
    descriptionOrIssuer: 'Cloud Native Computing Foundation (CNCF)',
    link: 'https://cncf.io/verify/CKA-DOCKER-1102',
    status: 'Pending',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: '',
  },
  {
    id: 'proj-priya-1',
    type: 'project',
    studentId: 'student-priya-sharma',
    studentName: 'Priya Sharma',
    studentCollege: 'Apex Institute of Technology',
    studentBranch: 'Computer Science & Engineering',
    title: 'NexusDesign System Core Component Library',
    descriptionOrIssuer: 'Accessible UI component primitives with Radix UI and Tailwind CSS.',
    link: 'https://github.com/priyasharma/nexus-design',
    githubUrl: 'https://github.com/priyasharma/nexus-design',
    tech: ['TypeScript', 'React', 'Tailwind CSS'],
    status: 'Pending',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: '',
  },
  {
    id: 'cert-rohan-1',
    type: 'certificate',
    studentId: 'student-rohan-gupta',
    studentName: 'Rohan Gupta',
    studentCollege: 'Apex Institute of Technology',
    studentBranch: 'Information Technology',
    title: 'AWS Certified Cloud Practitioner',
    descriptionOrIssuer: 'Amazon Web Services Training & Certification',
    link: 'https://aws.amazon.com/verification/CLF-00192',
    status: 'Pending',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: '',
  },
  {
    id: 'proj-1',
    type: 'project',
    studentId: 'demo-student-id',
    studentName: 'Alex Rivera',
    studentCollege: 'Apex Institute of Technology',
    studentBranch: 'Computer Science & Engineering',
    title: 'CampusPlacement Cloud Portal',
    descriptionOrIssuer: 'Full-stack reactive placement matching dashboard with role readiness calculations.',
    link: 'https://campusplacement.preview.io',
    githubUrl: 'https://github.com/alexrivera/campus-placement-portal',
    tech: ['React', 'TypeScript', 'Tailwind', 'Supabase'],
    status: 'Verified',
    submittedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: 'Institutional capstone project verified with distinction.',
  },
  {
    id: 'cert-1',
    type: 'certificate',
    studentId: 'demo-student-id',
    studentName: 'Alex Rivera',
    studentCollege: 'Apex Institute of Technology',
    studentBranch: 'Computer Science & Engineering',
    title: 'Modern React Architecture & Component Design',
    descriptionOrIssuer: 'Apex Institute of Technology — Department of CS',
    link: 'https://credentials.apex.edu/verify/CS-REACT-8821',
    status: 'Verified',
    submittedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: 'Verified against department records.',
  }
];

const demoStudents: AdminStudentSummary[] = [
  {
    id: 'demo-student-id',
    name: 'Alex Rivera',
    email: 'alex.rivera@apex.edu',
    college: 'Apex Institute of Technology',
    branch: 'Computer Science & Engineering',
    graduationYear: '2026',
    roleReadinessScore: 88,
    targetRole: 'Full-Stack Cloud Engineer',
    applicationsCount: 4,
    verifiedProjectsCount: 2,
    verifiedCertsCount: 2,
    placementStatus: 'In Process',
  },
  {
    id: 'student-priya-sharma',
    name: 'Priya Sharma',
    email: 'priya.sharma@apex.edu',
    college: 'Apex Institute of Technology',
    branch: 'Computer Science & Engineering',
    graduationYear: '2026',
    roleReadinessScore: 94,
    targetRole: 'Frontend Architect',
    applicationsCount: 3,
    verifiedProjectsCount: 1,
    verifiedCertsCount: 1,
    placementStatus: 'Placed',
  },
  {
    id: 'student-rohan-gupta',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@apex.edu',
    college: 'Apex Institute of Technology',
    branch: 'Information Technology',
    graduationYear: '2026',
    roleReadinessScore: 76,
    targetRole: 'Full-Stack Developer',
    applicationsCount: 2,
    verifiedProjectsCount: 0,
    verifiedCertsCount: 1,
    placementStatus: 'Seeking',
  },
  {
    id: 'student-ananya-das',
    name: 'Ananya Das',
    email: 'ananya.das@apex.edu',
    college: 'Apex Institute of Technology',
    branch: 'Electronics & Communication',
    graduationYear: '2027',
    roleReadinessScore: 70,
    targetRole: 'Embedded Software Engineer',
    applicationsCount: 2,
    verifiedProjectsCount: 1,
    verifiedCertsCount: 0,
    placementStatus: 'Seeking',
  },
  {
    id: 'student-kabir-mehta',
    name: 'Kabir Mehta',
    email: 'kabir.mehta@apex.edu',
    college: 'Apex Institute of Technology',
    branch: 'Artificial Intelligence & Data Science',
    graduationYear: '2026',
    roleReadinessScore: 85,
    targetRole: 'Data & ML Engineer',
    applicationsCount: 5,
    verifiedProjectsCount: 2,
    verifiedCertsCount: 1,
    placementStatus: 'In Process',
  },
  {
    id: 'student-tanvi-verma',
    name: 'Tanvi Verma',
    email: 'tanvi.verma@apex.edu',
    college: 'Apex Institute of Technology',
    branch: 'Computer Science & Engineering',
    graduationYear: '2026',
    roleReadinessScore: 91,
    targetRole: 'Backend Systems Engineer',
    applicationsCount: 4,
    verifiedProjectsCount: 2,
    verifiedCertsCount: 2,
    placementStatus: 'Placed',
  },
];

const demoAnalytics: AdminAnalyticsData = {
  kpis: {
    totalStudents: 248,
    activeOpportunities: 18,
    totalApplications: 142,
    placementReadyStudents: 164,
    selectedCandidates: 72,
    averageRoleReadiness: 82,
  },
  skillGaps: [
    { skill: 'Docker & Kubernetes', studentCount: 104, percentage: 42, gapLevel: 'high' },
    { skill: 'SQL & Query Optimization', studentCount: 88, percentage: 35, gapLevel: 'high' },
    { skill: 'TypeScript Generics & Types', studentCount: 65, percentage: 26, gapLevel: 'medium' },
    { skill: 'System Design & Scalability', studentCount: 58, percentage: 23, gapLevel: 'medium' },
    { skill: 'Cloud Microservices (AWS)', studentCount: 44, percentage: 18, gapLevel: 'low' },
  ],
  inDemandSkills: [
    { skill: 'React & Front-End Design', demandCount: 16, demandScore: 96 },
    { skill: 'TypeScript & JavaScript', demandCount: 14, demandScore: 92 },
    { skill: 'Node.js & REST APIs', demandCount: 12, demandScore: 89 },
    { skill: 'PostgreSQL & Relational Data', demandCount: 11, demandScore: 86 },
    { skill: 'Git & Agile Teamwork', demandCount: 10, demandScore: 84 },
    { skill: 'Python & Data Analysis', demandCount: 8, demandScore: 80 },
  ],
  readinessDistribution: [
    { range: '<60% (Needs Foundation)', count: 24, percentage: 10 },
    { range: '60%–74% (Developing)', count: 60, percentage: 24 },
    { range: '75%–84% (Proficient)', count: 96, percentage: 39 },
    { range: '85%+ (Placement Ready)', count: 68, percentage: 27 },
  ],
  branchOutcomes: [
    { branch: 'Computer Science & Engineering', totalStudents: 110, placedCount: 46, placementRate: 88 },
    { branch: 'Information Technology', totalStudents: 56, placedCount: 16, placementRate: 78 },
    { branch: 'AI & Data Science', totalStudents: 42, placedCount: 12, placementRate: 84 },
    { branch: 'Electronics & Communication', totalStudents: 40, placedCount: 8, placementRate: 70 },
  ],
  applicationStatusBreakdown: {
    'Applied': 48,
    'Shortlisted': 38,
    'Interview': 24,
    'Selected': 22,
    'Rejected': 10,
  },
};

// -------------------------------------------------------------
// GET /api/admin/analytics - Retrieve KPI & chart analytics
// -------------------------------------------------------------
adminRouter.get('/analytics', requireAuth, requireRole(['admin']), async (_req: AuthenticatedRequest, res: Response<ApiResponse<AdminAnalyticsData>>) => {
  try {
    if (!isSupabaseConfigured) {
      return res.json({ success: true, data: demoAnalytics });
    }

    // In Supabase mode, compute real metrics with fallback
    const [profCount, oppCount, appCount] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('applications').select('id', { count: 'exact', head: true })
    ]);

    const kpis = {
      ...demoAnalytics.kpis,
      totalStudents: profCount.count || demoAnalytics.kpis.totalStudents,
      activeOpportunities: oppCount.count || demoAnalytics.kpis.activeOpportunities,
      totalApplications: appCount.count || demoAnalytics.kpis.totalApplications,
    };

    res.json({
      success: true,
      data: {
        ...demoAnalytics,
        kpis,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// GET /api/admin/students - Retrieve student directory
// -------------------------------------------------------------
adminRouter.get('/students', requireAuth, requireRole(['admin']), async (req: AuthenticatedRequest, res: Response<ApiResponse<AdminStudentSummary[]>>) => {
  try {
    const { branch, readiness, search } = req.query;

    let filtered = [...demoStudents];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.email.toLowerCase().includes(q) ||
        s.targetRole.toLowerCase().includes(q)
      );
    }

    if (branch && typeof branch === 'string' && branch !== 'all') {
      filtered = filtered.filter(s => s.branch === branch);
    }

    if (readiness && typeof readiness === 'string' && readiness !== 'all') {
      if (readiness === 'ready') filtered = filtered.filter(s => s.roleReadinessScore >= 85);
      else if (readiness === 'proficient') filtered = filtered.filter(s => s.roleReadinessScore >= 75 && s.roleReadinessScore < 85);
      else if (readiness === 'developing') filtered = filtered.filter(s => s.roleReadinessScore < 75);
    }

    res.json({ success: true, data: filtered });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// GET /api/admin/verifications - Pending queue of projects & certs
// -------------------------------------------------------------
adminRouter.get('/verifications', requireAuth, requireRole(['admin']), async (req: AuthenticatedRequest, res: Response<ApiResponse<AdminVerificationItem[]>>) => {
  try {
    const { status } = req.query;
    let list = [...demoVerifications];
    if (status && typeof status === 'string' && status !== 'all') {
      list = list.filter(item => item.status === status);
    }
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// PATCH /api/admin/verifications/:type/:id - Approve or Reject
// -------------------------------------------------------------
adminRouter.patch('/verifications/:type/:id', requireAuth, requireRole(['admin']), async (req: AuthenticatedRequest, res: Response<ApiResponse<AdminVerificationItem>>) => {
  try {
    const { type, id } = req.params;
    const { status, adminNotes } = req.body;

    if (status !== 'Verified' && status !== 'Rejected') {
      return res.status(400).json({ success: false, error: 'Status must be Verified or Rejected' });
    }

    const idx = demoVerifications.findIndex(v => v.id === id && v.type === type);
    if (idx !== -1) {
      demoVerifications[idx] = {
        ...demoVerifications[idx],
        status,
        adminNotes: adminNotes || demoVerifications[idx].adminNotes || (status === 'Verified' ? 'Verified by campus career cell' : 'Requires revisions'),
      };
      return res.json({ success: true, data: demoVerifications[idx] });
    }

    if (isSupabaseConfigured) {
      const table = type === 'project' ? 'projects' : 'certifications';
      const adminId = req.user?.id || 'demo-admin-id';
      const { data, error } = await supabase.from(table).update({
        status,
        verified_by: adminId,
        verified_at: new Date().toISOString(),
        admin_notes: adminNotes || '',
      }).eq('id', id).select().single();

      if (error) throw error;
      return res.json({ success: true, data });
    }

    res.status(404).json({ success: false, error: 'Verification item not found' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
