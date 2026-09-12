import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { ApiResponse, Application, ApplicationStatus, Opportunity } from '@skillbridge/shared';

export const applicationsRouter = Router();

// In-memory demo store for sandbox mode
let demoApplications: Application[] = [
  {
    id: 'app-ind-1',
    opportunityId: 'opp-ind-1',
    opportunity: {
      id: 'opp-ind-1',
      recruiterId: 'demo-recruiter-id',
      title: 'Frontend React Engineering Intern',
      company: 'Nexus Cloud India',
      type: 'internship',
      workMode: 'hybrid',
      location: 'Bengaluru, Karnataka',
      stipendOrSalary: '₹45,000 / month',
      duration: '6 Months',
      deadline: '2026-10-25T00:00:00.000Z',
      description: 'Design enterprise React 18 microfrontends, accessible component libraries, and Tailwind layouts.',
      requiredSkills: ['React', 'TypeScript', 'HTML/CSS', 'Git'],
      eligibility: 'B.Tech / MCA 2026/2027 batch with 75%+ Frontend Role Readiness.',
      openingsCount: 6,
      status: 'active',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    studentId: 'demo-student-id',
    studentName: 'Alex Rivera',
    studentEmail: 'alex.rivera@apex.edu',
    studentCollege: 'Apex Institute of Technology',
    studentRoleReadiness: 88,
    recruiterId: 'demo-recruiter-id',
    matchScore: 92,
    matchPercentage: 92,
    matchedSkills: ['React', 'TypeScript', 'HTML/CSS', 'Git'],
    missingSkills: [],
    recommendationMessage: 'You are a 92% match! You meet or exceed all industry requirements for this Frontend React Engineering Intern.',
    status: 'Shortlisted',
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Very excited about the distributed cloud console architecture at Nexus Cloud India.',
    recruiterNotes: 'Technical screening scheduled for Thursday 2:30 PM. Strong component design portfolio.',
    candidatePortfolio: {
      bio: 'Junior majoring in Computer Science with a focus on web application performance, TypeScript design systems, and responsive UX.',
      college: 'Apex Institute of Technology',
      degree: 'B.Tech Computer Science & Engineering',
      graduationYear: '2026',
      cgpaOrPercentage: '8.8 / 10 CGPA',
      roleReadinessScore: 88,
      recommendedRole: 'Frontend Developer',
      assessedSkills: {
        'React': 80,
        'JavaScript': 80,
        'HTML/CSS': 80,
        'Git': 60,
        'SQL': 60,
        'Problem Solving': 80,
      },
      projects: [
        {
          title: 'CampusPlacement Cloud Portal',
          description: 'Full-stack reactive placement matching dashboard with role readiness calculations.',
          tech: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
          githubUrl: 'https://github.com/alexrivera/campus-placement-portal',
        },
        {
          title: 'Algorithmic Trading Dashboard',
          description: 'Sub-millisecond WebSocket chart visualizer with responsive indicators.',
          tech: ['JavaScript', 'Canvas', 'HTML5', 'Node.js'],
          githubUrl: 'https://github.com/alexrivera/algo-charting',
        },
      ],
      certifications: [
        {
          id: 'cert-1',
          studentId: 'demo-student-id',
          title: 'Modern React Architecture & Component Design',
          issuer: 'Apex Institute of Technology — Department of CS',
          issueDate: '2026-05-20',
          credentialUrl: 'https://credentials.apex.edu/verify/CS-REACT-8821',
          status: 'Verified',
        },
      ],
    },
  },
  {
    id: 'app-ind-2',
    opportunityId: 'opp-ind-3',
    opportunity: {
      id: 'opp-ind-3',
      recruiterId: 'rec-zerodha',
      title: 'Web Platforms & UI Apprenticeship',
      company: 'Zerodha Broking',
      type: 'apprenticeship',
      workMode: 'remote',
      location: 'Remote (All India)',
      stipendOrSalary: '₹40,000 / month',
      duration: '12 Months',
      deadline: '2026-11-20T00:00:00.000Z',
      description: 'Join the trading terminal platform team to build sub-millisecond charting interfaces and WebSocket feeds.',
      requiredSkills: ['JavaScript', 'HTML/CSS', 'React', 'Problem Solving'],
      eligibility: 'Passionate self-taught developers or engineering graduates with strong vanilla JavaScript foundations.',
      openingsCount: 3,
      status: 'active',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    studentId: 'demo-student-id',
    studentName: 'Alex Rivera',
    studentEmail: 'alex.rivera@apex.edu',
    studentCollege: 'Apex Institute of Technology',
    studentRoleReadiness: 88,
    recruiterId: 'rec-zerodha',
    matchScore: 88,
    matchPercentage: 88,
    matchedSkills: ['JavaScript', 'HTML/CSS', 'React', 'Problem Solving'],
    missingSkills: [],
    recommendationMessage: 'You are an 88% match! Strong fit for high-performance trading platform frontends.',
    status: 'Interview',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Passionate about sub-millisecond rendering and accessible financial software.',
    recruiterNotes: 'Round 1 technical discussion scheduled for Friday at 3:00 PM IST with UI Platform Leads.',
  },
  {
    id: 'app-ind-3',
    opportunityId: 'opp-ind-2',
    opportunity: {
      id: 'opp-ind-2',
      recruiterId: 'rec-razorpay',
      title: 'Backend Systems & API Associate',
      company: 'Razorpay Payments',
      type: 'job',
      workMode: 'hybrid',
      location: 'Bengaluru, Karnataka',
      stipendOrSalary: '₹14,00,000 / year',
      duration: 'Full-Time',
      deadline: '2026-11-10T00:00:00.000Z',
      description: 'Engineer zero-downtime banking integration microservices and high-concurrency PostgreSQL transaction pipelines.',
      requiredSkills: ['SQL', 'Python', 'JavaScript', 'Git', 'Problem Solving'],
      eligibility: 'Final year engineering students with proven database and API modeling background.',
      openingsCount: 4,
      status: 'active',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    studentId: 'demo-student-id',
    studentName: 'Alex Rivera',
    studentEmail: 'alex.rivera@apex.edu',
    studentCollege: 'Apex Institute of Technology',
    studentRoleReadiness: 88,
    recruiterId: 'rec-razorpay',
    matchScore: 78,
    matchPercentage: 78,
    matchedSkills: ['JavaScript', 'Git', 'Problem Solving'],
    missingSkills: ['SQL Optimization', 'Python'],
    recommendationMessage: 'You are a 78% match. Improve SQL and Python to increase your interview eligibility.',
    status: 'Applied',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Keen on high-scale payment processing and distributed consensus.',
    recruiterNotes: 'Application received and under initial batch screening.',
  },
  // Additional candidates applying to Elena Rostova's opportunities for Recruiter view
  {
    id: 'app-ind-4',
    opportunityId: 'opp-ind-1',
    opportunity: {
      id: 'opp-ind-1',
      recruiterId: 'demo-recruiter-id',
      title: 'Frontend React Engineering Intern',
      company: 'Nexus Cloud India',
      type: 'internship',
      workMode: 'hybrid',
      location: 'Bengaluru, Karnataka',
      stipendOrSalary: '₹45,000 / month',
      duration: '6 Months',
      deadline: '2026-10-25T00:00:00.000Z',
      description: 'Design enterprise React 18 microfrontends, accessible component libraries, and Tailwind layouts.',
      requiredSkills: ['React', 'TypeScript', 'HTML/CSS', 'Git'],
      eligibility: 'B.Tech / MCA 2026/2027 batch with 75%+ Frontend Role Readiness.',
      openingsCount: 6,
      status: 'active',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    studentId: 'student-priya-sharma',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.sharma@iitb.ac.in',
    studentCollege: 'IIT Bombay',
    studentRoleReadiness: 94,
    recruiterId: 'demo-recruiter-id',
    matchScore: 96,
    matchPercentage: 96,
    matchedSkills: ['React', 'TypeScript', 'HTML/CSS', 'Git'],
    missingSkills: [],
    recommendationMessage: 'Top 2% candidate match with exceptional React and component architecture scores.',
    status: 'Interview',
    appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Worked on open-source web design system tools with 500+ GitHub stars.',
    recruiterNotes: 'System Architecture interview confirmed with VP of Engineering for Wednesday.',
    candidatePortfolio: {
      bio: 'Final year B.Tech Computer Science student at IIT Bombay. Core contributor to open-source UI libraries.',
      college: 'IIT Bombay',
      degree: 'B.Tech in Computer Science',
      graduationYear: '2026',
      cgpaOrPercentage: '9.4 / 10 CGPA',
      roleReadinessScore: 94,
      recommendedRole: 'Frontend Developer',
      assessedSkills: {
        'React': 100,
        'TypeScript': 95,
        'HTML/CSS': 95,
        'Git': 90,
        'Problem Solving': 95,
      },
      projects: [
        {
          title: 'NexusDesign System Core',
          description: 'Zero-runtime CSS-in-JS component library built on Radix UI primitives.',
          tech: ['TypeScript', 'React', 'Radix UI', 'Tailwind CSS'],
          githubUrl: 'https://github.com/priyasharma/nexus-design',
        },
      ],
      certifications: [
        {
          id: 'cert-priya-1',
          studentId: 'student-priya-sharma',
          title: 'Certified Cloud Native Associate (CKA)',
          issuer: 'Linux Foundation',
          issueDate: '2026-02-15',
          status: 'Verified',
        },
      ],
    },
  },
  {
    id: 'app-ind-5',
    opportunityId: 'opp-ind-1',
    opportunity: {
      id: 'opp-ind-1',
      recruiterId: 'demo-recruiter-id',
      title: 'Frontend React Engineering Intern',
      company: 'Nexus Cloud India',
      type: 'internship',
      workMode: 'hybrid',
      location: 'Bengaluru, Karnataka',
      stipendOrSalary: '₹45,000 / month',
      duration: '6 Months',
      deadline: '2026-10-25T00:00:00.000Z',
      description: 'Design enterprise React 18 microfrontends, accessible component libraries, and Tailwind layouts.',
      requiredSkills: ['React', 'TypeScript', 'HTML/CSS', 'Git'],
      eligibility: 'B.Tech / MCA 2026/2027 batch with 75%+ Frontend Role Readiness.',
      openingsCount: 6,
      status: 'active',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    studentId: 'student-rohan-gupta',
    studentName: 'Rohan Gupta',
    studentEmail: 'rohan.gupta@dtu.ac.in',
    studentCollege: 'Delhi Technological University (DTU)',
    studentRoleReadiness: 76,
    recruiterId: 'demo-recruiter-id',
    matchScore: 76,
    matchPercentage: 76,
    matchedSkills: ['HTML/CSS', 'React', 'Git'],
    missingSkills: ['TypeScript'],
    recommendationMessage: 'Good foundational match. TypeScript proficiency is recommended.',
    status: 'Applied',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Developed campus event ticketing portal using React and Tailwind.',
    recruiterNotes: 'Application under review. Portfolio link verified.',
    candidatePortfolio: {
      bio: 'B.Tech Information Technology student at DTU. Passionate about modern web development and community tech.',
      college: 'Delhi Technological University (DTU)',
      degree: 'B.Tech in IT',
      graduationYear: '2026',
      cgpaOrPercentage: '8.2 / 10 CGPA',
      roleReadinessScore: 76,
      recommendedRole: 'Frontend Developer',
      assessedSkills: {
        'React': 75,
        'JavaScript': 80,
        'HTML/CSS': 85,
        'Git': 70,
        'Problem Solving': 70,
      },
      projects: [
        {
          title: 'DTU Fest Pass Portal',
          description: 'QR-code generation and pass validation system for annual technical symposium.',
          tech: ['React', 'Node.js', 'Express', 'MongoDB'],
        },
      ],
    },
  },
  {
    id: 'app-ind-6',
    opportunityId: 'opp-ind-workshop',
    opportunity: {
      id: 'opp-ind-workshop',
      recruiterId: 'demo-recruiter-id',
      title: 'Cloud Systems & Microfrontends Workshop',
      company: 'Nexus Cloud India',
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
    },
    studentId: 'student-neha-verma',
    studentName: 'Neha Verma',
    studentEmail: 'neha.verma@pilani.bits-pilani.ac.in',
    studentCollege: 'BITS Pilani',
    studentRoleReadiness: 90,
    recruiterId: 'demo-recruiter-id',
    matchScore: 95,
    matchPercentage: 95,
    matchedSkills: ['React', 'Git', 'Problem Solving'],
    missingSkills: [],
    recommendationMessage: 'Exceptional match for cloud systems and microfrontend architecture.',
    status: 'Selected',
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Looking forward to Docker containerization and edge caching modules.',
    recruiterNotes: 'Admitted to Cohort 1 with merit grant approved.',
    candidatePortfolio: {
      bio: 'Junior at BITS Pilani majoring in Electronics & Computer Engineering. Cloud and edge computing enthusiast.',
      college: 'BITS Pilani',
      degree: 'B.E. Computer Science',
      graduationYear: '2027',
      cgpaOrPercentage: '9.1 / 10 CGPA',
      roleReadinessScore: 90,
      recommendedRole: 'Full Stack Engineer',
      assessedSkills: {
        'React': 90,
        'Git': 90,
        'Problem Solving': 95,
      },
    },
  },
];

/**
 * GET /api/applications/student
 * Fetch all applications submitted by the current authenticated student
 */
applicationsRouter.get('/student', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse<Application[]>>) => {
  try {
    const studentId = req.user?.id;

    if (!isSupabaseConfigured) {
      const studentApps = demoApplications.filter(a => a.studentId === studentId || a.studentId === 'demo-student-id');
      return res.json({
        success: true,
        data: studentApps,
        timestamp: new Date().toISOString(),
      });
    }

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        opportunity:opportunities (*)
      `)
      .eq('student_id', studentId)
      .order('applied_at', { ascending: false });

    if (error) {
      console.warn('[Applications API] Supabase query error, using sandbox fallback:', error.message);
      const studentApps = demoApplications.filter(a => a.studentId === studentId || a.studentId === 'demo-student-id');
      return res.json({
        success: true,
        data: studentApps,
        timestamp: new Date().toISOString(),
      });
    }

    const mapped: Application[] = (data || []).map((d: any) => ({
      id: d.id,
      opportunityId: d.opportunity_id,
      opportunity: d.opportunity ? {
        id: d.opportunity.id,
        recruiterId: d.opportunity.recruiter_id,
        title: d.opportunity.title,
        company: d.opportunity.company,
        type: d.opportunity.type,
        workMode: d.opportunity.work_mode,
        location: d.opportunity.location,
        stipendOrSalary: d.opportunity.stipend_or_salary,
        duration: d.opportunity.duration,
        deadline: d.opportunity.deadline,
        description: d.opportunity.description,
        requiredSkills: d.opportunity.required_skills || [],
        eligibility: d.opportunity.eligibility,
        openingsCount: d.opportunity.openings_count || 1,
        status: d.opportunity.status,
        createdAt: d.opportunity.created_at,
        updatedAt: d.opportunity.updated_at,
      } : undefined,
      studentId: d.student_id,
      recruiterId: d.recruiter_id,
      matchScore: d.match_percentage || d.match_score || 0,
      matchPercentage: d.match_percentage || d.match_score || 0,
      matchedSkills: d.matched_skills || [],
      missingSkills: d.missing_skills || [],
      recommendationMessage: d.recommendation_message || '',
      status: d.status,
      appliedAt: d.applied_at,
      updatedAt: d.updated_at,
      notes: d.notes,
      recruiterNotes: d.recruiter_notes,
    }));

    return res.json({
      success: true,
      data: mapped,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch student applications',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/applications/recruiter
 * Fetch applications for all opportunities owned by the authenticated recruiter
 */
applicationsRouter.get('/recruiter', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse<Application[]>>) => {
  try {
    const recruiterId = req.user?.id;

    if (!isSupabaseConfigured) {
      const recruiterApps = demoApplications.filter(a => a.recruiterId === recruiterId || a.recruiterId === 'demo-recruiter-id');
      return res.json({
        success: true,
        data: recruiterApps,
        timestamp: new Date().toISOString(),
      });
    }

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        opportunity:opportunities (*),
        student:profiles (*)
      `)
      .order('applied_at', { ascending: false });

    if (error) {
      console.warn('[Applications API] Supabase recruiter query error, using sandbox fallback:', error.message);
      const recruiterApps = demoApplications.filter(a => a.recruiterId === recruiterId || a.recruiterId === 'demo-recruiter-id');
      return res.json({
        success: true,
        data: recruiterApps,
        timestamp: new Date().toISOString(),
      });
    }

    // Filter to applications for recruiter's opportunities
    const filtered = (data || []).filter((d: any) => 
      d.recruiter_id === recruiterId || (d.opportunity && d.opportunity.recruiter_id === recruiterId)
    );

    const mapped: Application[] = filtered.map((d: any) => ({
      id: d.id,
      opportunityId: d.opportunity_id,
      opportunity: d.opportunity ? {
        id: d.opportunity.id,
        recruiterId: d.opportunity.recruiter_id,
        title: d.opportunity.title,
        company: d.opportunity.company,
        type: d.opportunity.type,
        workMode: d.opportunity.work_mode,
        location: d.opportunity.location,
        stipendOrSalary: d.opportunity.stipend_or_salary,
        duration: d.opportunity.duration,
        deadline: d.opportunity.deadline,
        description: d.opportunity.description,
        requiredSkills: d.opportunity.required_skills || [],
        eligibility: d.opportunity.eligibility,
        openingsCount: d.opportunity.openings_count || 1,
        status: d.opportunity.status,
        createdAt: d.opportunity.created_at,
        updatedAt: d.opportunity.updated_at,
      } : undefined,
      studentId: d.student_id,
      studentName: d.student?.name || 'Applicant Student',
      studentEmail: d.student?.email || 'student@university.edu',
      studentCollege: d.student?.college || 'Apex Institute of Technology',
      recruiterId: d.recruiter_id,
      matchScore: d.match_percentage || d.match_score || 0,
      matchPercentage: d.match_percentage || d.match_score || 0,
      matchedSkills: d.matched_skills || [],
      missingSkills: d.missing_skills || [],
      recommendationMessage: d.recommendation_message || '',
      status: d.status,
      appliedAt: d.applied_at,
      updatedAt: d.updated_at,
      notes: d.notes,
      recruiterNotes: d.recruiter_notes,
    }));

    return res.json({
      success: true,
      data: mapped,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch recruiter applications',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * POST /api/applications
 * Student submits application for an opportunity (strictly once per opportunity)
 */
applicationsRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse<Application>>) => {
  try {
    const studentId = req.user?.id || 'demo-student-id';
    const { 
      opportunityId, 
      opportunity, 
      matchPercentage = 85, 
      matchedSkills = [], 
      missingSkills = [], 
      message = '',
      studentName = 'Alex Rivera',
      studentEmail = 'alex.rivera@apex.edu',
      studentCollege = 'Apex Institute of Technology',
      studentRoleReadiness = 88,
    } = req.body;

    if (!opportunityId) {
      return res.status(400).json({
        success: false,
        error: 'opportunityId is required',
        timestamp: new Date().toISOString(),
      });
    }

    // Duplicate application check in demo store
    const existing = demoApplications.find(
      a => a.opportunityId === opportunityId && a.studentId === studentId
    );

    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'You have already applied for this opportunity. Duplicate submissions are not permitted.',
        timestamp: new Date().toISOString(),
      });
    }

    const recruiterId = opportunity?.recruiterId || 'demo-recruiter-id';
    const newApp: Application = {
      id: `app-${Date.now()}`,
      opportunityId,
      opportunity,
      studentId,
      studentName,
      studentEmail,
      studentCollege,
      studentRoleReadiness,
      recruiterId,
      matchScore: matchPercentage,
      matchPercentage,
      matchedSkills,
      missingSkills,
      recommendationMessage: `Application submitted with ${matchPercentage}% competency match alignment.`,
      status: 'Applied',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: message || 'Application submitted via SkillBridge student portal.',
      recruiterNotes: '',
    };

    if (isSupabaseConfigured && req.user) {
      try {
        const { data: dbCheck } = await supabase
          .from('applications')
          .select('id')
          .eq('opportunity_id', opportunityId)
          .eq('student_id', studentId)
          .maybeSingle();

        if (dbCheck) {
          return res.status(409).json({
            success: false,
            error: 'You have already applied for this opportunity.',
            timestamp: new Date().toISOString(),
          });
        }

        await supabase.from('applications').insert({
          opportunity_id: opportunityId,
          student_id: studentId,
          recruiter_id: recruiterId,
          match_percentage: matchPercentage,
          matched_skills: matchedSkills,
          missing_skills: missingSkills,
          recommendation_message: newApp.recommendationMessage,
          status: 'Applied',
          notes: newApp.notes,
          applied_at: newApp.appliedAt,
          updated_at: newApp.updatedAt,
        });
      } catch (dbErr: any) {
        console.warn('[Applications API] Supabase insert fallback to demo store:', dbErr.message);
      }
    }

    // Always store in memory demo store for local testing
    demoApplications = [newApp, ...demoApplications];

    return res.status(201).json({
      success: true,
      data: newApp,
      message: 'Application successfully submitted!',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to submit application',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * PATCH /api/applications/:id/status
 * Recruiter updates application status and optional recruiter notes
 */
applicationsRouter.patch('/:id/status', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse<Application>>) => {
  try {
    const { id } = req.params;
    const { status, recruiterNotes } = req.body;

    const validStatuses: ApplicationStatus[] = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        timestamp: new Date().toISOString(),
      });
    }

    const appIndex = demoApplications.findIndex(a => a.id === id);
    if (appIndex === -1 && !isSupabaseConfigured) {
      return res.status(404).json({
        success: false,
        error: 'Application not found',
        timestamp: new Date().toISOString(),
      });
    }

    const timestamp = new Date().toISOString();

    if (isSupabaseConfigured && req.user) {
      try {
        const updatePayload: any = {
          status,
          updated_at: timestamp,
        };
        if (recruiterNotes !== undefined) {
          updatePayload.recruiter_notes = recruiterNotes;
        }

        const { data, error } = await supabase
          .from('applications')
          .update(updatePayload)
          .eq('id', id)
          .select(`
            *,
            opportunity:opportunities (*)
          `)
          .single();

        if (!error && data) {
          const updated: Application = {
            id: data.id,
            opportunityId: data.opportunity_id,
            opportunity: data.opportunity,
            studentId: data.student_id,
            recruiterId: data.recruiter_id,
            matchScore: data.match_percentage || data.match_score || 0,
            matchPercentage: data.match_percentage || data.match_score || 0,
            matchedSkills: data.matched_skills || [],
            missingSkills: data.missing_skills || [],
            status: data.status,
            appliedAt: data.applied_at,
            updatedAt: data.updated_at,
            notes: data.notes,
            recruiterNotes: data.recruiter_notes,
          };
          return res.json({
            success: true,
            data: updated,
            message: `Application status updated to ${status}`,
            timestamp,
          });
        }
      } catch (dbErr: any) {
        console.warn('[Applications API] Supabase update status fallback:', dbErr.message);
      }
    }

    if (appIndex !== -1) {
      const existing = demoApplications[appIndex];
      const updated: Application = {
        ...existing,
        status,
        recruiterNotes: recruiterNotes !== undefined ? recruiterNotes : existing.recruiterNotes,
        updatedAt: timestamp,
      };
      demoApplications[appIndex] = updated;

      return res.json({
        success: true,
        data: updated,
        message: `Application status updated to ${status}`,
        timestamp,
      });
    }

    return res.status(404).json({
      success: false,
      error: 'Application not found',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to update application status',
      timestamp: new Date().toISOString(),
    });
  }
});
