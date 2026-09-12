import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { ApiResponse, Opportunity, OpportunityType, WorkMode } from '@skillbridge/shared';

export const opportunitiesRouter = Router();

// In-memory demo store for sandbox mode
let demoOpportunities: Opportunity[] = [
  {
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
    description: 'Design enterprise React 18 microfrontends, accessible component libraries, and Tailwind layouts for high-throughput cloud consoles.',
    requiredSkills: ['React', 'TypeScript', 'HTML/CSS', 'Git'],
    eligibility: 'B.Tech / MCA 2026/2027 batch with 75%+ Frontend Role Readiness.',
    openingsCount: 6,
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
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
    description: 'Engineer zero-downtime banking integration microservices, idempotency ledgers, and high-concurrency PostgreSQL transaction pipelines.',
    requiredSkills: ['SQL', 'Python', 'JavaScript', 'Git', 'Problem Solving'],
    eligibility: 'Final year engineering students with proven database and API modeling background.',
    openingsCount: 4,
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
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
    description: 'Join the trading terminal platform team to build sub-millisecond charting interfaces, WebSocket feeds, and accessible financial tools.',
    requiredSkills: ['JavaScript', 'HTML/CSS', 'React', 'Problem Solving'],
    eligibility: 'Passionate self-taught developers or engineering graduates with strong vanilla JavaScript foundations.',
    openingsCount: 3,
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'opp-ind-4',
    recruiterId: 'rec-tcs',
    title: 'Data Intelligence & Analytics Specialist',
    company: 'TCS Innovation Labs',
    type: 'job',
    workMode: 'on_site',
    location: 'Hyderabad, Telangana',
    stipendOrSalary: '₹7,50,000 / year',
    duration: 'Full-Time',
    deadline: '2026-12-05T00:00:00.000Z',
    description: 'Transform client operational records into predictive machine learning models, executive dashboards, and statistical summaries.',
    requiredSkills: ['SQL', 'Python', 'Problem Solving', 'Communication'],
    eligibility: 'Graduates in Computer Science, Data Science, or Mathematics with 70%+ aggregate.',
    openingsCount: 10,
    status: 'active',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'opp-ind-5',
    recruiterId: 'rec-infosys',
    title: 'Cloud Architecture & DevOps Workshop',
    company: 'Infosys Springboard',
    type: 'workshop',
    workMode: 'remote',
    location: 'Virtual / Online',
    stipendOrSalary: 'Free + ₹15,000 Completion Merit Grant',
    duration: '4 Weeks',
    deadline: '2026-10-18T00:00:00.000Z',
    description: 'Intensive industry mentorship covering CI/CD automated deployment, container orchestration, and multi-cloud resilience.',
    requiredSkills: ['Git', 'Python', 'Adaptability'],
    eligibility: 'Open to all 2nd, 3rd, and 4th year college engineering students.',
    openingsCount: 50,
    status: 'active',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'opp-ind-6',
    recruiterId: 'rec-iitb',
    title: 'Faculty Development Program in AI & Engineering',
    company: 'IIT Bombay / AICTE Collaboration',
    type: 'fdp',
    workMode: 'hybrid',
    location: 'Mumbai, Maharashtra',
    stipendOrSalary: 'Funded Research Grant (₹30,000)',
    duration: '2 Weeks',
    deadline: '2026-11-12T00:00:00.000Z',
    description: 'Upskill university engineering faculty and department chairs on modernizing academic curricula to reflect current industry demands.',
    requiredSkills: ['Python', 'SQL', 'Communication', 'Teamwork'],
    eligibility: 'Accredited university professors, assistant professors, and placement coordinators.',
    openingsCount: 25,
    status: 'active',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'opp-ind-7',
    recruiterId: 'rec-flipkart',
    title: 'SDE Intern — Catalog & Search Platforms',
    company: 'Flipkart Internet',
    type: 'internship',
    workMode: 'on_site',
    location: 'Bengaluru, Karnataka',
    stipendOrSalary: '₹85,000 / month',
    duration: '6 Months',
    deadline: '2026-10-31T00:00:00.000Z',
    description: 'Work on search indexing, real-time product recommendations, and distributed caching for millions of concurrent shoppers.',
    requiredSkills: ['JavaScript', 'React', 'SQL', 'Problem Solving', 'Git'],
    eligibility: 'Pre-final year engineering students with top-tier algorithmic problem solving.',
    openingsCount: 5,
    status: 'active',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

/**
 * GET /api/opportunities
 * Returns list of opportunities with optional filters
 */
opportunitiesRouter.get('/', async (req, res: Response<ApiResponse<Opportunity[]>>) => {
  try {
    const { type, workMode, search } = req.query;

    if (!isSupabaseConfigured) {
      let results = [...demoOpportunities];
      if (type && type !== 'all') {
        results = results.filter(o => o.type === type);
      }
      if (workMode && workMode !== 'all') {
        results = results.filter(o => o.workMode === workMode);
      }
      if (search && typeof search === 'string') {
        const q = search.toLowerCase();
        results = results.filter(o => 
          o.title.toLowerCase().includes(q) || 
          o.company.toLowerCase().includes(q) ||
          o.requiredSkills.some(s => s.toLowerCase().includes(q))
        );
      }
      res.json({
        success: true,
        data: results,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    let query = supabase
      .from('opportunities')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }
    if (workMode && workMode !== 'all') {
      query = query.eq('work_mode', workMode);
    }

    const { data, error } = await query;
    if (error) {
      res.status(400).json({ success: false, error: error.message, timestamp: new Date().toISOString() });
      return;
    }

    const mapped: Opportunity[] = (data || []).map(d => ({
      id: d.id,
      recruiterId: d.recruiter_id,
      title: d.title,
      company: d.company,
      type: d.type as OpportunityType,
      workMode: d.work_mode as WorkMode,
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

    res.json({
      success: true,
      data: mapped,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch opportunities';
    res.status(500).json({ success: false, error: msg, timestamp: new Date().toISOString() });
  }
});

/**
 * GET /api/opportunities/mine
 * Returns only opportunities posted by the authenticated recruiter
 */
opportunitiesRouter.get('/mine', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse<Opportunity[]>>) => {
  try {
    const recruiterId = req.user?.id;
    if (!recruiterId) {
      res.status(401).json({ success: false, error: 'Unauthorized', timestamp: new Date().toISOString() });
      return;
    }

    if (!isSupabaseConfigured) {
      const mine = demoOpportunities.filter(o => o.recruiterId === recruiterId || o.recruiterId === 'demo-recruiter-id');
      res.json({ success: true, data: mine, timestamp: new Date().toISOString() });
      return;
    }

    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('recruiter_id', recruiterId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ success: false, error: error.message, timestamp: new Date().toISOString() });
      return;
    }

    const mapped: Opportunity[] = (data || []).map(d => ({
      id: d.id,
      recruiterId: d.recruiter_id,
      title: d.title,
      company: d.company,
      type: d.type as OpportunityType,
      workMode: d.work_mode as WorkMode,
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

    res.json({ success: true, data: mapped, timestamp: new Date().toISOString() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch recruiter opportunities';
    res.status(500).json({ success: false, error: msg, timestamp: new Date().toISOString() });
  }
});

/**
 * POST /api/opportunities
 * Creates a new opportunity
 */
opportunitiesRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse<Opportunity>>) => {
  try {
    const recruiterId = req.user?.id;
    if (!recruiterId) {
      res.status(401).json({ success: false, error: 'Unauthorized', timestamp: new Date().toISOString() });
      return;
    }

    const {
      title,
      company,
      type,
      workMode,
      location,
      stipendOrSalary,
      duration,
      deadline,
      description,
      requiredSkills,
      eligibility,
      openingsCount,
    } = req.body;

    // Validation
    if (!title || !company || !description || !location || !stipendOrSalary || !deadline) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: title, company, description, location, stipendOrSalary, deadline.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      recruiterId,
      title: title.trim(),
      company: company.trim(),
      type: type || 'internship',
      workMode: workMode || 'remote',
      location: location.trim(),
      stipendOrSalary: stipendOrSalary.trim(),
      duration: duration?.trim() || '3 Months',
      deadline,
      description: description.trim(),
      requiredSkills: Array.isArray(requiredSkills) && requiredSkills.length > 0 ? requiredSkills : ['Problem Solving'],
      eligibility: eligibility?.trim() || 'Open to all qualifying students.',
      openingsCount: Number(openingsCount) || 1,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!isSupabaseConfigured) {
      demoOpportunities.unshift(newOpp);
      res.status(201).json({
        success: true,
        message: 'Opportunity created successfully (sandbox mode)',
        data: newOpp,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { data, error } = await supabase
      .from('opportunities')
      .insert({
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
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ success: false, error: error.message, timestamp: new Date().toISOString() });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Opportunity published successfully',
      data: {
        ...newOpp,
        id: data.id,
        createdAt: data.created_at,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create opportunity';
    res.status(500).json({ success: false, error: msg, timestamp: new Date().toISOString() });
  }
});

/**
 * PUT /api/opportunities/:id
 * Updates an opportunity
 */
opportunitiesRouter.put('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse<Opportunity>>) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user?.id;

    if (!isSupabaseConfigured) {
      const idx = demoOpportunities.findIndex(o => o.id === id);
      if (idx === -1) {
        res.status(404).json({ success: false, error: 'Opportunity not found', timestamp: new Date().toISOString() });
        return;
      }
      demoOpportunities[idx] = {
        ...demoOpportunities[idx],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      res.json({
        success: true,
        message: 'Opportunity updated successfully',
        data: demoOpportunities[idx],
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { data, error } = await supabase
      .from('opportunities')
      .update({
        title: req.body.title,
        company: req.body.company,
        type: req.body.type,
        work_mode: req.body.workMode,
        location: req.body.location,
        stipend_or_salary: req.body.stipendOrSalary,
        duration: req.body.duration,
        deadline: req.body.deadline,
        description: req.body.description,
        required_skills: req.body.requiredSkills,
        eligibility: req.body.eligibility,
        openings_count: req.body.openingsCount,
        status: req.body.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('recruiter_id', recruiterId)
      .select()
      .single();

    if (error) {
      res.status(400).json({ success: false, error: error.message, timestamp: new Date().toISOString() });
      return;
    }

    res.json({
      success: true,
      message: 'Opportunity updated successfully',
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update opportunity';
    res.status(500).json({ success: false, error: msg, timestamp: new Date().toISOString() });
  }
});

/**
 * PATCH /api/opportunities/:id/status
 * Toggles or sets status ('active' | 'closed')
 */
opportunitiesRouter.patch('/:id/status', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const recruiterId = req.user?.id;

    if (!['active', 'closed'].includes(status)) {
      res.status(400).json({ success: false, error: 'Status must be active or closed', timestamp: new Date().toISOString() });
      return;
    }

    if (!isSupabaseConfigured) {
      const opp = demoOpportunities.find(o => o.id === id);
      if (opp) {
        opp.status = status;
        opp.updatedAt = new Date().toISOString();
      }
      res.json({ success: true, message: `Status updated to ${status}`, timestamp: new Date().toISOString() });
      return;
    }

    const { error } = await supabase
      .from('opportunities')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('recruiter_id', recruiterId);

    if (error) {
      res.status(400).json({ success: false, error: error.message, timestamp: new Date().toISOString() });
      return;
    }

    res.json({ success: true, message: `Status updated to ${status}`, timestamp: new Date().toISOString() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to toggle status';
    res.status(500).json({ success: false, error: msg, timestamp: new Date().toISOString() });
  }
});

/**
 * DELETE /api/opportunities/:id
 * Deletes recruiter's opportunity
 */
opportunitiesRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user?.id;

    if (!isSupabaseConfigured) {
      demoOpportunities = demoOpportunities.filter(o => o.id !== id);
      res.json({ success: true, message: 'Opportunity deleted successfully', timestamp: new Date().toISOString() });
      return;
    }

    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id)
      .eq('recruiter_id', recruiterId);

    if (error) {
      res.status(400).json({ success: false, error: error.message, timestamp: new Date().toISOString() });
      return;
    }

    res.json({ success: true, message: 'Opportunity deleted successfully', timestamp: new Date().toISOString() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete opportunity';
    res.status(500).json({ success: false, error: msg, timestamp: new Date().toISOString() });
  }
});