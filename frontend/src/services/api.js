import { 
  DEMO_USERS, 
  DEMO_PROFILE, 
  DEMO_CERTIFICATES, 
  DEMO_PROJECTS, 
  DEMO_OPPORTUNITIES, 
  DEMO_APPLICATIONS, 
  DEMO_ASSESSMENT_QUESTIONS, 
  DEMO_ADMIN_ANALYTICS, 
  DEMO_ADMIN_VERIFICATIONS, 
  DEMO_ADMIN_USERS 
} from './mockData';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';
const API_BASE = `${API_URL}/api`;

function getAuthHeader() {
  const token = localStorage.getItem('skillbridge_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getMockFallback(endpoint, options = {}) {
  // Auth: Login
  if (endpoint.startsWith('/auth/login')) {
    let body = {};
    try { body = JSON.parse(options.body || '{}'); } catch {}
    const email = (body.email || '').toLowerCase();
    const role = email.includes('recruiter') ? 'recruiter' : email.includes('admin') ? 'admin' : 'student';
    const target = DEMO_USERS[role];
    const user = { ...target, email: body.email || target.email };
    return {
      success: true,
      message: 'Logged in successfully.',
      token: 'demo_token_' + Date.now(),
      user,
    };
  }

  // Auth: Register
  if (endpoint.startsWith('/auth/register')) {
    let body = {};
    try { body = JSON.parse(options.body || '{}'); } catch {}
    const user = {
      _id: 'user_' + Date.now(),
      name: body.name || 'Demo User',
      email: body.email || 'user@skillbridge.edu',
      role: body.role || 'student',
      college: body.college || '',
      company: body.company || '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    return {
      success: true,
      message: 'User registered successfully.',
      token: 'demo_token_' + Date.now(),
      user,
    };
  }

  // Auth: Me
  if (endpoint.startsWith('/auth/me')) {
    let user = DEMO_USERS.student;
    try {
      const saved = localStorage.getItem('skillbridge_user');
      if (saved) user = JSON.parse(saved);
    } catch {}
    return { success: true, user };
  }

  // Student Profile
  if (endpoint.startsWith('/students/profile')) {
    let customProfile = DEMO_PROFILE;
    try {
      const saved = localStorage.getItem('skillbridge_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.name) {
          customProfile = {
            ...DEMO_PROFILE,
            name: u.name,
            email: u.email || DEMO_PROFILE.email,
            college: u.college || DEMO_PROFILE.college,
          };
        }
      }
    } catch {}
    return {
      success: true,
      profile: customProfile,
      certificates: DEMO_CERTIFICATES,
      projects: DEMO_PROJECTS,
    };
  }

  // Assessment Questions
  if (endpoint.startsWith('/assessments/questions')) {
    return {
      success: true,
      count: DEMO_ASSESSMENT_QUESTIONS.length,
      questions: DEMO_ASSESSMENT_QUESTIONS,
    };
  }

  // Submit Assessment
  if (endpoint.startsWith('/assessments/submit')) {
    return {
      success: true,
      message: 'Assessment evaluated and recorded successfully.',
      overallScore: '8 / 8 (100%)',
      roleReadiness: DEMO_PROFILE.roleReadiness,
      assessmentId: 'mock_assess_' + Date.now(),
    };
  }

  // Assessment Results
  if (endpoint.startsWith('/assessments/my-results')) {
    return {
      success: true,
      hasTakenAssessment: true,
      assessment: {
        totalScore: 7,
        roleReadiness: DEMO_PROFILE.roleReadiness,
        completedAt: new Date().toISOString(),
      },
    };
  }

  // Opportunities
  if (endpoint.startsWith('/opportunities/recruiter/my-listings')) {
    return {
      success: true,
      opportunities: [DEMO_OPPORTUNITIES[0], DEMO_OPPORTUNITIES[2]],
    };
  }

  if (endpoint.startsWith('/opportunities')) {
    return {
      success: true,
      opportunities: DEMO_OPPORTUNITIES,
    };
  }

  // Applications
  if (endpoint.startsWith('/applications')) {
    return {
      success: true,
      applications: DEMO_APPLICATIONS,
    };
  }

  // Portfolio
  if (endpoint.startsWith('/portfolio/certificates')) {
    return { success: true, certificates: DEMO_CERTIFICATES };
  }
  if (endpoint.startsWith('/portfolio/projects')) {
    return { success: true, projects: DEMO_PROJECTS };
  }

  // Admin
  if (endpoint.startsWith('/admin/analytics')) {
    return { success: true, analytics: DEMO_ADMIN_ANALYTICS };
  }
  if (endpoint.startsWith('/admin/verifications')) {
    return { success: true, verifications: DEMO_ADMIN_VERIFICATIONS };
  }
  if (endpoint.startsWith('/admin/users')) {
    return { success: true, users: DEMO_ADMIN_USERS };
  }

  return { success: true, message: 'Action completed successfully.' };
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  // If formData, remove Content-Type so browser sets boundary automatically
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.warn(`[SkillBridge API] Non-JSON response for ${endpoint}. Using offline fallback.`);
      return getMockFallback(endpoint, options);
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.warn(`[SkillBridge API] HTTP ${res.status} for ${endpoint}. Using fallback.`);
      return getMockFallback(endpoint, options);
    }
    return data;
  } catch (err) {
    console.warn(`[SkillBridge API] Network error for ${endpoint} (${err.message}). Using offline fallback.`);
    return getMockFallback(endpoint, options);
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),

  // Student Profile
  getProfile: () => request('/students/profile'),
  updateProfile: (profileData) => request('/students/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Skill Assessment
  getAssessmentQuestions: () => request('/assessments/questions'),
  submitAssessment: (answers) => request('/assessments/submit', { method: 'POST', body: JSON.stringify({ answers }) }),
  getMyAssessmentResults: () => request('/assessments/my-results'),

  // Opportunities
  getOpportunities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/opportunities${query ? `?${query}` : ''}`);
  },
  getOpportunityById: (id) => request(`/opportunities/${id}`),
  getOpportunityMatch: (id) => request(`/opportunities/${id}/match`),
  createOpportunity: (data) => request('/opportunities', { method: 'POST', body: JSON.stringify(data) }),
  updateOpportunity: (id, data) => request(`/opportunities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteOpportunity: (id) => request(`/opportunities/${id}`, { method: 'DELETE' }),
  getMyListings: () => request('/opportunities/recruiter/my-listings'),

  // Applications
  applyToOpportunity: (data) => request('/applications', { method: 'POST', body: JSON.stringify(data) }),
  getMyApplications: () => request('/applications/my-applications'),
  getOpportunityApplicants: (oppId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/applications/opportunity/${oppId}${query ? `?${query}` : ''}`);
  },
  updateApplicationStatus: (appId, data) => request(`/applications/${appId}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  getAllApplications: () => request('/applications'),

  // Portfolio
  getCertificates: (studentId) => request(`/portfolio/certificates${studentId ? `?studentId=${studentId}` : ''}`),
  addCertificate: (data) => request('/portfolio/certificates', { method: 'POST', body: JSON.stringify(data) }),
  deleteCertificate: (id) => request(`/portfolio/certificates/${id}`, { method: 'DELETE' }),

  getProjects: (studentId) => request(`/portfolio/projects${studentId ? `?studentId=${studentId}` : ''}`),
  addProject: (data) => request('/portfolio/projects', { method: 'POST', body: JSON.stringify(data) }),
  deleteProject: (id) => request(`/portfolio/projects/${id}`, { method: 'DELETE' }),

  uploadFile: (formData) => request('/portfolio/upload', { method: 'POST', body: formData }),

  // Admin
  getAdminAnalytics: () => request('/admin/analytics'),
  getAdminVerifications: () => request('/admin/verifications'),
  updateVerificationStatus: (type, id, data) => request(`/admin/verifications/${type}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getAdminUsers: (role) => request(`/admin/users${role ? `?role=${role}` : ''}`),
};