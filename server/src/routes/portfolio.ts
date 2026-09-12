import { Router, Request, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { 
  ApiResponse, 
  StudentPortfolio, 
  PublicStudentPortfolio, 
  StudentProject, 
  Certification, 
  Achievement 
} from '@skillbridge/shared';

export const portfolioRouter = Router();

// In-memory demo data for Alex Rivera and sandbox mode
let demoProjects: StudentProject[] = [
  {
    id: 'proj-1',
    studentId: 'demo-student-id',
    title: 'CampusPlacement Cloud Portal',
    description: 'Full-stack reactive placement matching dashboard with role readiness calculations, real-time status tracking, and Supabase RLS policies.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Node.js'],
    projectUrl: 'https://campusplacement.preview.io',
    githubUrl: 'https://github.com/alexrivera/campus-placement-portal',
    status: 'Verified',
    verifiedBy: 'Dr. Devraj Patel (Dean)',
    verifiedAt: '2026-06-10T14:30:00Z',
    adminNotes: 'Institutional capstone project verified with distinction. Exceptional architecture.',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'proj-2',
    studentId: 'demo-student-id',
    title: 'Algorithmic Trading Dashboard',
    description: 'Sub-millisecond WebSocket chart visualizer with technical indicators (RSI, MACD) and custom canvas rendering.',
    technologies: ['JavaScript', 'HTML5 Canvas', 'Node.js', 'WebSocket', 'Tailwind'],
    projectUrl: 'https://algotrader-view.demo.app',
    githubUrl: 'https://github.com/alexrivera/algo-charting',
    status: 'Verified',
    verifiedBy: 'Dr. Devraj Patel (Dean)',
    verifiedAt: '2026-07-22T09:15:00Z',
    adminNotes: 'High performance rendering verified. Code passes campus open-source quality checks.',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'proj-3',
    studentId: 'demo-student-id',
    title: 'Distributed Distributed Ledger Microservice',
    description: 'High-throughput idempotency ledger with Redis caching and PostgreSQL ACID transactional safety for fintech payment pipelines.',
    technologies: ['Python', 'PostgreSQL', 'Docker', 'Redis'],
    projectUrl: '',
    githubUrl: 'https://github.com/alexrivera/ledger-service',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let demoCertifications: Certification[] = [
  {
    id: 'cert-1',
    studentId: 'demo-student-id',
    title: 'Modern React Architecture & Component Design',
    issuer: 'Apex Institute of Technology — Department of CS',
    issueDate: '2026-05-20',
    credentialUrl: 'https://credentials.apex.edu/verify/CS-REACT-8821',
    status: 'Verified',
    verifiedBy: 'Dr. Devraj Patel (Dean)',
    verifiedAt: '2026-05-22T10:00:00Z',
    adminNotes: 'Verified against university registrar archives.',
    createdAt: '2026-05-20T00:00:00Z',
  },
  {
    id: 'cert-2',
    studentId: 'demo-student-id',
    title: 'Relational Database Design & SQL Optimization',
    issuer: 'Oracle Academy / University Partner Cell',
    issueDate: '2026-03-15',
    credentialUrl: 'https://verify.oracle.com/cert/DB-99014',
    status: 'Verified',
    verifiedBy: 'Dr. Devraj Patel (Dean)',
    verifiedAt: '2026-03-18T14:30:00Z',
    adminNotes: 'Oracle academy partner verification verified.',
    createdAt: '2026-03-15T00:00:00Z',
  },
  {
    id: 'cert-3',
    studentId: 'demo-student-id',
    title: 'Docker Containerization & Kubernetes Fundamentals',
    issuer: 'Cloud Native Computing Foundation (CNCF)',
    issueDate: '2026-08-10',
    credentialUrl: 'https://cncf.io/verify/CKA-DOCKER-1102',
    status: 'Pending',
    createdAt: '2026-08-10T00:00:00Z',
  },
];

let demoAchievements: Achievement[] = [
  {
    id: 'ach-1',
    studentId: 'demo-student-id',
    title: '1st Place — National Smart Campus Hackathon 2026',
    description: 'Built a peer-to-peer textbook and skill exchange platform used by 4,000+ students.',
    date: '2026-04-12',
    issuer: 'Ministry of Education & Apex Institute',
  },
  {
    id: 'ach-2',
    studentId: 'demo-student-id',
    title: "Dean's Academic Merit Honor Roll",
    description: 'Awarded to top 5% academic performers across Computer Science and Engineering batches.',
    date: '2026-01-20',
    issuer: 'Apex Institute of Technology',
  },
];

let demoProfileMetadata: Record<string, any> = {
  'demo-student-id': {
    targetRole: 'Full-Stack Cloud Engineer',
    branch: 'Computer Science & Engineering',
    graduationYear: '2026',
    bio: 'Junior majoring in Computer Science with a focus on web application performance, TypeScript design systems, and responsive UX.',
    resumeUrl: 'https://alexrivera.dev/resume.pdf',
  }
};

function calculateCompletion(portfolio: Partial<StudentPortfolio>): number {
  let score = 20; // Base signup
  if (portfolio.bio && portfolio.bio.length > 20) score += 15;
  if (portfolio.targetRole) score += 10;
  if (portfolio.resumeUrl) score += 15;
  if (portfolio.projects && portfolio.projects.length > 0) score += 20;
  if (portfolio.certifications && portfolio.certifications.length > 0) score += 10;
  if (portfolio.achievements && portfolio.achievements.length > 0) score += 10;
  return Math.min(score, 100);
}

// -------------------------------------------------------------
// GET /api/portfolio/me - Retrieve current student portfolio
// -------------------------------------------------------------
portfolioRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse<StudentPortfolio>>) => {
  try {
    const studentId = req.user?.id || 'demo-student-id';
    const name = req.user?.user_metadata?.full_name || req.user?.user_metadata?.name || 'Alex Rivera';
    const email = req.user?.email || 'alex.rivera@apex.edu';

    if (!isSupabaseConfigured || studentId === 'demo-student-id') {
      const meta = demoProfileMetadata[studentId] || {
        targetRole: 'Full-Stack Cloud Engineer',
        branch: 'Computer Science & Engineering',
        graduationYear: '2026',
        bio: 'Junior majoring in Computer Science with a focus on web application performance.',
        resumeUrl: 'https://alexrivera.dev/resume.pdf',
      };

      const projects = demoProjects.filter(p => p.studentId === studentId);
      const certifications = demoCertifications.filter(c => c.studentId === studentId);
      const achievements = demoAchievements.filter(a => a.studentId === studentId);

      const studentPortfolio: StudentPortfolio = {
        studentId,
        name,
        email,
        college: 'Apex Institute of Technology',
        branch: meta.branch,
        graduationYear: meta.graduationYear,
        bio: meta.bio,
        targetRole: meta.targetRole,
        resumeUrl: meta.resumeUrl,
        roleReadinessScore: 88,
        completionPercentage: 0,
        recommendedRole: 'Frontend Developer',
        assessedSkills: {
          'React': 80,
          'JavaScript': 80,
          'HTML/CSS': 80,
          'Git': 60,
          'SQL': 60,
          'Python': 40,
          'Communication': 80,
          'Teamwork': 80,
          'Problem Solving': 80,
          'Adaptability': 80,
        },
        projects,
        certifications,
        achievements,
        internships: [
          {
            id: 'app-ind-1',
            title: 'Frontend React Engineering Intern',
            company: 'Nexus Cloud India',
            status: 'Shortlisted',
            appliedAt: '2026-09-08T00:00:00Z',
            duration: '6 Months',
          },
          {
            id: 'app-ind-4',
            title: 'Cloud Architecture & DevOps Workshop',
            company: 'Infosys Springboard',
            status: 'Selected',
            appliedAt: '2026-09-05T00:00:00Z',
            duration: '4 Weeks',
          },
        ],
      };
      studentPortfolio.completionPercentage = calculateCompletion(studentPortfolio);

      return res.json({
        success: true,
        data: studentPortfolio,
      });
    }

    // Supabase implementation
    const [profRes, projRes, certRes, achRes, assessRes, appRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', studentId).single(),
      supabase.from('projects').select('*').eq('student_id', studentId).order('created_at', { ascending: false }),
      supabase.from('certifications').select('*').eq('student_id', studentId).order('issue_date', { ascending: false }),
      supabase.from('achievements').select('*').eq('student_id', studentId).order('date', { ascending: false }),
      supabase.from('assessments').select('*').eq('student_id', studentId).order('completed_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('applications').select('id, status, applied_at, opportunity:opportunities(title, company, duration)').eq('student_id', studentId)
    ]);

    const profile = profRes.data || {};
    const assessedSkills: Record<string, number> = {};
    if (assessRes.data?.skill_scores) {
      Object.entries(assessRes.data.skill_scores).forEach(([k, item]: [string, any]) => {
        assessedSkills[k] = (item.score || 3) * 20;
      });
    }

    const internships = (appRes.data || []).map((a: any) => ({
      id: a.id,
      title: a.opportunity?.title || 'Engineering Internship',
      company: a.opportunity?.company || 'Industry Partner',
      status: a.status,
      appliedAt: a.applied_at,
      duration: a.opportunity?.duration || '3 Months',
    }));

    const portfolio: StudentPortfolio = {
      studentId,
      name: profile.name || name,
      email: profile.email || email,
      avatarUrl: profile.avatar_url,
      college: profile.college || 'Apex Institute of Technology',
      branch: profile.branch || 'Computer Science & Engineering',
      graduationYear: profile.graduation_year ? String(profile.graduation_year) : '2026',
      bio: profile.bio || '',
      targetRole: profile.target_role || 'Software Engineer',
      resumeUrl: profile.resume_url || '',
      roleReadinessScore: assessRes.data?.percentage || 75,
      completionPercentage: 0,
      recommendedRole: assessRes.data?.recommended_role || 'Software Engineer',
      assessedSkills,
      projects: (projRes.data || []).map((p: any) => ({
        id: p.id,
        studentId: p.student_id,
        title: p.title,
        description: p.description,
        technologies: p.technologies || [],
        projectUrl: p.project_url,
        githubUrl: p.github_url,
        status: p.status,
        verifiedBy: p.verified_by,
        verifiedAt: p.verified_at,
        adminNotes: p.admin_notes,
        createdAt: p.created_at,
      })),
      certifications: (certRes.data || []).map((c: any) => ({
        id: c.id,
        studentId: c.student_id,
        title: c.title,
        issuer: c.issuer,
        issueDate: c.issue_date,
        credentialUrl: c.credential_url,
        status: c.status,
        verifiedBy: c.verified_by,
        verifiedAt: c.verified_at,
        adminNotes: c.admin_notes,
        createdAt: c.created_at,
      })),
      achievements: (achRes.data || []).map((a: any) => ({
        id: a.id,
        studentId: a.student_id,
        title: a.title,
        description: a.description,
        date: a.date,
        issuer: a.issuer,
      })),
      internships,
    };
    portfolio.completionPercentage = calculateCompletion(portfolio);

    res.json({
      success: true,
      data: portfolio,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// PUT /api/portfolio/profile - Update summary profile fields
// -------------------------------------------------------------
portfolioRouter.put('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const studentId = req.user?.id || 'demo-student-id';
    const { targetRole, branch, graduationYear, bio, resumeUrl } = req.body;

    if (!isSupabaseConfigured || studentId === 'demo-student-id') {
      demoProfileMetadata[studentId] = {
        ...demoProfileMetadata[studentId],
        targetRole: targetRole || demoProfileMetadata[studentId]?.targetRole,
        branch: branch || demoProfileMetadata[studentId]?.branch,
        graduationYear: graduationYear || demoProfileMetadata[studentId]?.graduationYear,
        bio: bio !== undefined ? bio : demoProfileMetadata[studentId]?.bio,
        resumeUrl: resumeUrl !== undefined ? resumeUrl : demoProfileMetadata[studentId]?.resumeUrl,
      };
      return res.json({ success: true, message: 'Profile updated successfully' });
    }

    const updatePayload: Record<string, any> = {};
    if (targetRole !== undefined) updatePayload.target_role = targetRole;
    if (branch !== undefined) updatePayload.branch = branch;
    if (graduationYear !== undefined) updatePayload.graduation_year = parseInt(graduationYear, 10) || null;
    if (bio !== undefined) updatePayload.bio = bio;
    if (resumeUrl !== undefined) updatePayload.resume_url = resumeUrl;
    updatePayload.updated_at = new Date().toISOString();

    const { error } = await supabase.from('profiles').update(updatePayload).eq('id', studentId);
    if (error) throw error;

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// PROJECT CRUD ENDPOINTS
// -------------------------------------------------------------
portfolioRouter.post('/projects', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse<StudentProject>>) => {
  try {
    const studentId = req.user?.id || 'demo-student-id';
    const { title, description, technologies, projectUrl, githubUrl } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }

    const newProject: StudentProject = {
      id: `proj-${Date.now()}`,
      studentId,
      title,
      description,
      technologies: Array.isArray(technologies) ? technologies : (typeof technologies === 'string' ? technologies.split(',').map(s => s.trim()) : []),
      projectUrl: projectUrl || '',
      githubUrl: githubUrl || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!isSupabaseConfigured || studentId === 'demo-student-id') {
      demoProjects = [newProject, ...demoProjects];
      return res.status(201).json({ success: true, data: newProject });
    }

    const { data, error } = await supabase.from('projects').insert({
      student_id: studentId,
      title: newProject.title,
      description: newProject.description,
      technologies: newProject.technologies,
      project_url: newProject.projectUrl,
      github_url: newProject.githubUrl,
      status: 'Pending',
    }).select().single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

portfolioRouter.put('/projects/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse<StudentProject>>) => {
  try {
    const { id } = req.params;
    const studentId = req.user?.id || 'demo-student-id';
    const { title, description, technologies, projectUrl, githubUrl } = req.body;

    if (!isSupabaseConfigured || studentId === 'demo-student-id') {
      const idx = demoProjects.findIndex(p => p.id === id);
      if (idx === -1) return res.status(404).json({ success: false, error: 'Project not found' });

      demoProjects[idx] = {
        ...demoProjects[idx],
        title: title || demoProjects[idx].title,
        description: description || demoProjects[idx].description,
        technologies: technologies || demoProjects[idx].technologies,
        projectUrl: projectUrl !== undefined ? projectUrl : demoProjects[idx].projectUrl,
        githubUrl: githubUrl !== undefined ? githubUrl : demoProjects[idx].githubUrl,
        updatedAt: new Date().toISOString(),
      };
      return res.json({ success: true, data: demoProjects[idx] });
    }

    const { data, error } = await supabase.from('projects').update({
      title,
      description,
      technologies,
      project_url: projectUrl,
      github_url: githubUrl,
      updated_at: new Date().toISOString(),
    }).eq('id', id).eq('student_id', studentId).select().single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

portfolioRouter.delete('/projects/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const studentId = req.user?.id || 'demo-student-id';

    if (!isSupabaseConfigured || studentId === 'demo-student-id') {
      demoProjects = demoProjects.filter(p => p.id !== id);
      return res.json({ success: true, message: 'Project removed successfully' });
    }

    const { error } = await supabase.from('projects').delete().eq('id', id).eq('student_id', studentId);
    if (error) throw error;
    res.json({ success: true, message: 'Project removed successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// CERTIFICATION CRUD ENDPOINTS
// -------------------------------------------------------------
portfolioRouter.post('/certifications', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse<Certification>>) => {
  try {
    const studentId = req.user?.id || 'demo-student-id';
    const { title, issuer, issueDate, credentialUrl } = req.body;

    if (!title || !issuer || !issueDate) {
      return res.status(400).json({ success: false, error: 'Title, issuer, and issue date are required' });
    }

    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      studentId,
      title,
      issuer,
      issueDate,
      credentialUrl: credentialUrl || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    if (!isSupabaseConfigured || studentId === 'demo-student-id') {
      demoCertifications = [newCert, ...demoCertifications];
      return res.status(201).json({ success: true, data: newCert });
    }

    const { data, error } = await supabase.from('certifications').insert({
      student_id: studentId,
      title,
      issuer,
      issue_date: issueDate,
      credential_url: credentialUrl,
      status: 'Pending',
    }).select().single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

portfolioRouter.delete('/certifications/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const studentId = req.user?.id || 'demo-student-id';

    if (!isSupabaseConfigured || studentId === 'demo-student-id') {
      demoCertifications = demoCertifications.filter(c => c.id !== id);
      return res.json({ success: true, message: 'Certification removed successfully' });
    }

    const { error } = await supabase.from('certifications').delete().eq('id', id).eq('student_id', studentId);
    if (error) throw error;
    res.json({ success: true, message: 'Certification removed successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// ACHIEVEMENTS CRUD ENDPOINTS
// -------------------------------------------------------------
portfolioRouter.post('/achievements', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse<Achievement>>) => {
  try {
    const studentId = req.user?.id || 'demo-student-id';
    const { title, description, date, issuer } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }

    const newAch: Achievement = {
      id: `ach-${Date.now()}`,
      studentId,
      title,
      description,
      date: date || new Date().toISOString().split('T')[0],
      issuer: issuer || '',
    };

    if (!isSupabaseConfigured || studentId === 'demo-student-id') {
      demoAchievements = [newAch, ...demoAchievements];
      return res.status(201).json({ success: true, data: newAch });
    }

    const { data, error } = await supabase.from('achievements').insert({
      student_id: studentId,
      title,
      description,
      date: newAch.date,
      issuer: newAch.issuer,
    }).select().single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

portfolioRouter.delete('/achievements/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const studentId = req.user?.id || 'demo-student-id';

    if (!isSupabaseConfigured || studentId === 'demo-student-id') {
      demoAchievements = demoAchievements.filter(a => a.id !== id);
      return res.json({ success: true, message: 'Achievement removed' });
    }

    const { error } = await supabase.from('achievements').delete().eq('id', id).eq('student_id', studentId);
    if (error) throw error;
    res.json({ success: true, message: 'Achievement removed' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// GET /api/portfolio/public/:studentId - Sanitized Public View
// (Email & private recruiter notes stripped out for privacy)
// -------------------------------------------------------------
portfolioRouter.get('/public/:studentId', async (req: Request, res: Response<ApiResponse<PublicStudentPortfolio>>) => {
  try {
    const { studentId } = req.params;

    if (!isSupabaseConfigured || studentId === 'demo-student-id') {
      const meta = demoProfileMetadata['demo-student-id'] || {};
      const publicData: PublicStudentPortfolio = {
        studentId: 'demo-student-id',
        name: 'Alex Rivera',
        college: 'Apex Institute of Technology',
        branch: meta.branch || 'Computer Science & Engineering',
        graduationYear: meta.graduationYear || '2026',
        bio: meta.bio || 'Junior majoring in Computer Science with a focus on web application performance.',
        targetRole: meta.targetRole || 'Full-Stack Cloud Engineer',
        resumeUrl: meta.resumeUrl,
        roleReadinessScore: 88,
        recommendedRole: 'Frontend Developer',
        assessedSkills: {
          'React': 80,
          'JavaScript': 80,
          'HTML/CSS': 80,
          'Git': 60,
          'SQL': 60,
          'Python': 40,
          'Communication': 80,
          'Teamwork': 80,
          'Problem Solving': 80,
          'Adaptability': 80,
        },
        projects: demoProjects.filter(p => p.studentId === 'demo-student-id'),
        certifications: demoCertifications.filter(c => c.studentId === 'demo-student-id'),
        achievements: demoAchievements.filter(a => a.studentId === 'demo-student-id'),
      };
      return res.json({ success: true, data: publicData });
    }

    // Supabase public profile lookup
    const [profRes, projRes, certRes, achRes, assessRes] = await Promise.all([
      supabase.from('profiles').select('id, name, college, branch, graduation_year, bio, target_role, resume_url, avatar_url').eq('id', studentId).single(),
      supabase.from('projects').select('*').eq('student_id', studentId),
      supabase.from('certifications').select('*').eq('student_id', studentId),
      supabase.from('achievements').select('*').eq('student_id', studentId),
      supabase.from('assessments').select('*').eq('student_id', studentId).order('completed_at', { ascending: false }).limit(1).maybeSingle(),
    ]);

    if (!profRes.data) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const p = profRes.data;
    const assessedSkills: Record<string, number> = {};
    if (assessRes.data?.skill_scores) {
      Object.entries(assessRes.data.skill_scores).forEach(([k, item]: [string, any]) => {
        assessedSkills[k] = (item.score || 3) * 20;
      });
    }

    const publicProfile: PublicStudentPortfolio = {
      studentId: p.id,
      name: p.name,
      avatarUrl: p.avatar_url,
      college: p.college || 'Apex Institute of Technology',
      branch: p.branch || 'Engineering',
      graduationYear: p.graduation_year ? String(p.graduation_year) : '2026',
      bio: p.bio,
      targetRole: p.target_role || 'Software Engineer',
      resumeUrl: p.resume_url,
      roleReadinessScore: assessRes.data?.percentage || 75,
      recommendedRole: assessRes.data?.recommended_role,
      assessedSkills,
      projects: projRes.data || [],
      certifications: certRes.data || [],
      achievements: achRes.data || [],
    };

    res.json({ success: true, data: publicProfile });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
