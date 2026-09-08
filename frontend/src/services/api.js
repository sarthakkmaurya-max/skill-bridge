const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('skillbridge_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
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

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
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