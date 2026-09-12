import React, { useState } from 'react';
import { 
  StudentPortfolio, 
  StudentProject, 
  Certification, 
  Achievement 
} from '@skillbridge/shared';
import { 
  Award, 
  FolderGit2, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Github, 
  Globe, 
  ShieldCheck, 
  Share2, 
  FileText, 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  AlertCircle,
  Briefcase,
  GraduationCap,
  Download,
  Eye,
  UploadCloud
} from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { CertificationModal } from './CertificationModal';
import { AchievementModal } from './AchievementModal';
import { PublicPortfolioModal } from './PublicPortfolioModal';
import { FileUploadZone } from '../common/FileUploadZone';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import { downloadDocument } from '../../lib/storage';

interface PortfolioTabProps {
  portfolio: StudentPortfolio;
  onUpdateProfile: (data: { 
    targetRole?: string; 
    bio?: string; 
    resumeUrl?: string; 
    resumeFileName?: string;
    resumeFileSize?: string;
    resumeFileType?: string;
    resumeUpdatedAt?: string;
    branch?: string; 
    graduationYear?: string 
  }) => Promise<void> | void;
  onAddProject: (project: Partial<StudentProject>) => Promise<void> | void;
  onEditProject: (project: Partial<StudentProject>) => Promise<void> | void;
  onDeleteProject: (id: string) => Promise<void> | void;
  onAddCert: (cert: Partial<Certification>) => Promise<void> | void;
  onDeleteCert: (id: string) => Promise<void> | void;
  onAddAchievement: (ach: Partial<Achievement>) => Promise<void> | void;
  onDeleteAchievement: (id: string) => Promise<void> | void;
}

export const PortfolioTab: React.FC<PortfolioTabProps> = ({
  portfolio,
  onUpdateProfile,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onAddCert,
  onDeleteCert,
  onAddAchievement,
  onDeleteAchievement,
}) => {
  // Modal states
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<StudentProject | null>(null);

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [achModalOpen, setAchModalOpen] = useState(false);
  const [publicModalOpen, setPublicModalOpen] = useState(false);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);

  // Profile Edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editTargetRole, setEditTargetRole] = useState(portfolio.targetRole || 'Full-Stack Cloud Engineer');
  const [editBio, setEditBio] = useState(portfolio.bio || '');
  const [editResumeUrl, setEditResumeUrl] = useState(portfolio.resumeUrl || '');
  const [editResumeFile, setEditResumeFile] = useState<{
    url: string;
    fileName: string;
    fileSize: string;
    fileType?: string;
    uploadedAt?: string;
  } | null>(
    portfolio.resumeUrl
      ? {
          url: portfolio.resumeUrl,
          fileName: portfolio.resumeFileName || portfolio.resumeUrl.split('/').pop()?.split('?')[0] || 'Resume.pdf',
          fileSize: portfolio.resumeFileSize || 'Attached',
          fileType: portfolio.resumeFileType || 'application/pdf',
          uploadedAt: portfolio.resumeUpdatedAt || new Date().toISOString(),
        }
      : null
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = editResumeFile?.url || editResumeUrl;
    await onUpdateProfile({
      targetRole: editTargetRole,
      bio: editBio,
      resumeUrl: finalUrl,
      resumeFileName: editResumeFile?.fileName,
      resumeFileSize: editResumeFile?.fileSize,
      resumeFileType: editResumeFile?.fileType,
      resumeUpdatedAt: editResumeFile?.uploadedAt || new Date().toISOString(),
    });
    setIsEditingProfile(false);
  };

  const handleOpenAddProject = () => {
    setSelectedProject(null);
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj: StudentProject) => {
    setSelectedProject(proj);
    setProjectModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Profile Summary & Completion Header */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-glow-blue flex-shrink-0">
              {portfolio.avatarUrl ? (
                <img src={portfolio.avatarUrl} alt={portfolio.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                portfolio.name.charAt(0)
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{portfolio.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Institutional Portfolio</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-blue-400 flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Target Role: {portfolio.targetRole || 'Full-Stack Software Engineer'}</span>
              </p>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  <span>{portfolio.college}</span>
                </span>
                <span>•</span>
                <span>{portfolio.branch}</span>
                <span>•</span>
                <span>Class of {portfolio.graduationYear}</span>
              </div>
            </div>
          </div>

          {/* Right Action & Readiness Meter */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            
            {/* Completion Gauge */}
            <div className="glass-panel px-4 py-3 rounded-2xl border border-white/10 flex items-center space-x-3.5">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500"
                    strokeDasharray={`${portfolio.completionPercentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-black text-white">{portfolio.completionPercentage}%</span>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Profile Strength</div>
                <div className="text-xs font-semibold text-emerald-400">Recruiter Ready</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-3.5 py-2 rounded-xl glass-panel hover:border-white/20 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center justify-center space-x-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Summary'}</span>
              </button>

              <button
                onClick={() => setPublicModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-xs shadow-glow-blue transition-all flex items-center justify-center space-x-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Public Portfolio</span>
              </button>
            </div>

          </div>

        </div>

        {/* Inline Profile Edit Form */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-5 pt-5 border-t border-white/10 space-y-4 animate-fadeIn">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Update Profile &amp; Career Documents</h4>
            
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target Role</label>
              <input
                type="text"
                value={editTargetRole}
                onChange={(e) => setEditTargetRole(e.target.value)}
                placeholder="e.g. Cloud Engineer / Frontend Specialist"
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>

            {/* Direct File & Resume Upload Zone */}
            <FileUploadZone
              label="Verified Candidate Resume"
              folder="resumes"
              userId={portfolio.studentId}
              value={editResumeFile?.url || editResumeUrl}
              fileName={editResumeFile?.fileName}
              fileSize={editResumeFile?.fileSize}
              onChange={(res) => {
                if (res) {
                  setEditResumeFile(res);
                  setEditResumeUrl(res.url);
                } else {
                  setEditResumeFile(null);
                  setEditResumeUrl('');
                }
              }}
              helperText="Upload your official resume (.pdf, .docx) up to 10 MB. Cloud-persisted &amp; visible to recruiters."
            />

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Professional Bio</label>
              <textarea
                rows={2}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Share your technical interests and engineering background..."
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Bio Display (if not editing) */}
        {!isEditingProfile && portfolio.bio && (
          <div className="mt-4 pt-4 border-t border-white/5 text-xs text-slate-300 leading-relaxed">
            {portfolio.bio}
          </div>
        )}

        {/* Verified Resume Document Hub Card */}
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white">Verified Career Resume</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Industry Ready</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Attached to applications and accessible to verified recruiters
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-wrap">
              {portfolio.resumeUrl ? (
                <>
                  <button
                    type="button"
                    onClick={() => setDocumentViewerOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Document</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadDocument(portfolio.resumeUrl!, portfolio.resumeFileName || 'Alex_Rivera_Resume.pdf')}
                    className="px-3 py-1.5 rounded-xl glass-panel hover:border-white/30 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                    title="Download PDF to computer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-xs transition-colors"
                  >
                    Replace
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-bold shadow-glow-blue flex items-center space-x-1.5 transition-all"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Resume File</span>
                </button>
              )}
            </div>
          </div>

          {/* Resume Details Pill */}
          {portfolio.resumeUrl && (
            <div className="p-3 rounded-2xl bg-navy-950/60 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white truncate max-w-xs sm:max-w-md">
                  {portfolio.resumeFileName || portfolio.resumeUrl.split('/').pop()?.split('?')[0] || 'Alex_Rivera_Resume.pdf'}
                </span>
                {portfolio.resumeFileSize && (
                  <span className="text-[11px] text-slate-400">({portfolio.resumeFileSize})</span>
                )}
              </div>
              <span className="text-[10px] text-slate-400">
                Last updated: {portfolio.resumeUpdatedAt ? new Date(portfolio.resumeUpdatedAt).toLocaleDateString() : 'Active Document'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Assessed Skills Matrix (Auto-populated from Assessment) */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Industry Role Readiness &amp; Assessed Competencies</h3>
              <p className="text-xs text-slate-400">Automatically synchronized from your standardized 10-skill evaluation</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
            {portfolio.roleReadinessScore}% Overall Readiness
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {Object.entries(portfolio.assessedSkills || {}).map(([skill, score]) => (
            <div key={skill} className="glass-panel p-3 rounded-xl border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 truncate">{skill}</span>
                <span className="font-bold text-blue-400">{score}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full" 
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engineering Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FolderGit2 className="w-5 h-5 text-blue-400" />
              <span>Projects &amp; Architectures</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Showcase production code, repositories, and faculty-verified engineering systems
            </p>
          </div>

          <button
            onClick={handleOpenAddProject}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>

        {portfolio.projects.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center space-y-3">
            <FolderGit2 className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Projects Added Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add your capstone projects, full-stack applications, or open-source repositories to boost your role readiness score.
            </p>
            <button
              onClick={handleOpenAddProject}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-glow-blue"
            >
              Add Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolio.projects.map((proj) => (
              <div key={proj.id} className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between hover:border-white/20 transition-all">
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                      <span className="text-[11px] text-slate-400">Added {new Date(proj.createdAt).toLocaleDateString()}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 flex items-center space-x-1 ${
                      proj.status === 'Verified'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : proj.status === 'Pending'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-red-500/15 text-red-300 border border-red-500/30'
                    }`}>
                      {proj.status === 'Verified' && <ShieldCheck className="w-3 h-3" />}
                      {proj.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {proj.status === 'Rejected' && <AlertCircle className="w-3 h-3" />}
                      <span>{proj.status === 'Verified' ? 'Verified ✓' : proj.status}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {proj.adminNotes && (
                    <div className="p-2.5 rounded-lg bg-navy-950/70 border border-white/5 text-[11px] text-slate-400">
                      <strong className="text-slate-300">Admin Review:</strong> {proj.adminNotes}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-300 hover:text-white flex items-center space-x-1 text-xs"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    )}
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 text-xs font-semibold"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditProject(proj)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit Project"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certifications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-violet-400" />
              <span>Certifications &amp; Credentials</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified certifications backed by campus career cells or industry accreditors
            </p>
          </div>

          <button
            onClick={() => setCertModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-glow-violet flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certificate</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolio.certifications.map((cert) => (
            <div key={cert.id} className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{cert.title}</h4>
                    <span className="text-[11px] text-slate-400">{cert.issuer}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cert.status === 'Verified'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    {cert.status === 'Verified' ? 'Verified ✓' : cert.status}
                  </span>
                  <button
                    onClick={() => onDeleteCert(cert.id)}
                    className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-[11px] flex items-center space-x-1"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Honors & Achievements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Honors &amp; Achievements</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Competitive hackathon podiums, academic scholarships, and department honors
            </p>
          </div>

          <button
            onClick={() => setAchModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-glow-amber flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Achievement</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolio.achievements.map((ach) => (
            <div key={ach.id} className="glass-card p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-white">{ach.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400">{ach.date}</span>
                  <button
                    onClick={() => onDeleteAchievement(ach.id)}
                    className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-snug">{ach.description}</p>
              {ach.issuer && (
                <span className="text-[10px] text-amber-400/90 font-medium">Awarded by: {ach.issuer}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Internship & Placement History (Auto-populated from Applications) */}
      {portfolio.internships && portfolio.internships.length > 0 && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Verified Placement / Internship Journey</h3>
              <p className="text-xs text-slate-400">Institutional recruitment records tracked on SkillBridge</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {portfolio.internships.map((intern) => (
              <div key={intern.id} className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white">{intern.title}</h5>
                  <span className="text-[11px] text-slate-400">{intern.company} • {intern.duration || 'Duration Varies'}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  intern.status === 'Selected'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {intern.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSave={selectedProject ? onEditProject : onAddProject}
        initialProject={selectedProject}
      />

      <CertificationModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        onSave={onAddCert}
      />

      <AchievementModal
        isOpen={achModalOpen}
        onClose={() => setAchModalOpen(false)}
        onSave={onAddAchievement}
      />

      <PublicPortfolioModal
        isOpen={publicModalOpen}
        onClose={() => setPublicModalOpen(false)}
        portfolio={portfolio}
      />

      <DocumentViewerModal
        isOpen={documentViewerOpen}
        onClose={() => setDocumentViewerOpen(false)}
        documentUrl={portfolio.resumeUrl}
        documentName={portfolio.resumeFileName || 'Alex_Rivera_Resume.pdf'}
        documentSize={portfolio.resumeFileSize || '245 KB'}
        uploadedAt={portfolio.resumeUpdatedAt}
      />

    </div>
  );
};
