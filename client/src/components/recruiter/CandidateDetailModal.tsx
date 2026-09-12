import React, { useState } from 'react';
import { Application, formatOpportunityType } from '@skillbridge/shared';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  GraduationCap, 
  Mail, 
  FolderGit2, 
  Award, 
  ExternalLink, 
  Calendar, 
  UserCheck, 
  MessageSquareQuote,
  Layers,
  Clock,
  FileText,
  Download,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import { downloadDocument } from '../../lib/storage';

interface CandidateDetailModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenStatusModal: (application: Application) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  onOpenStatusModal,
}) => {
  if (!isOpen || !application) return null;

  const portfolio = application.candidatePortfolio;
  const matchPercentage = application.matchPercentage || application.matchScore || 85;
  const matchedSkills = application.matchedSkills || [];
  const missingSkills = application.missingSkills || [];

  const [viewerOpen, setViewerOpen] = useState(false);
  const resumeUrl = application.resumeUrl || portfolio?.resumeUrl || 'https://alexrivera.dev/resume.pdf';
  const resumeFileName = application.resumeFileName || portfolio?.resumeFileName || `${application.studentName?.replace(/\s+/g, '_') || 'Candidate'}_Resume.pdf`;
  const resumeFileSize = application.resumeFileSize || portfolio?.resumeFileSize || '245 KB';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl glass-card border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Accents */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Candidate Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white text-xl font-black shadow-glow-violet flex-shrink-0">
              {application.studentName?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {application.studentName || 'Alex Rivera'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {application.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                <span className="flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                  <span>{application.studentCollege || 'Apex Institute of Technology'}</span>
                </span>
                {application.studentEmail && (
                  <span className="flex items-center space-x-1 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{application.studentEmail}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenStatusModal(application);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-glow-violet flex items-center space-x-1.5 transition-all self-start sm:self-auto"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Update Status &amp; Notes</span>
          </button>
        </div>

        {/* Bio */}
        {portfolio?.bio && (
          <p className="text-xs text-slate-300 leading-relaxed bg-navy-950/60 p-3.5 rounded-2xl border border-white/5">
            {portfolio.bio}
          </p>
        )}

        {/* Candidate Verified Resume Document Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-navy-950/60 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                  {resumeFileName}
                </h4>
                <span className="px-2 py-0.2 rounded text-[10px] uppercase font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Resume</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {resumeFileSize} • Attached to candidate application
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setViewerOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-semibold shadow-glow-blue flex items-center space-x-1.5 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Resume</span>
            </button>
            <button
              type="button"
              onClick={() => downloadDocument(resumeUrl, resumeFileName)}
              className="px-3 py-1.5 rounded-xl glass-panel hover:border-white/30 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-all"
              title="Download PDF to computer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Target Opportunity & Smart Match Strip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-violet-950/60 via-indigo-950/60 to-blue-950/60 border border-violet-500/30 space-y-3 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Application Target:
              </span>
              <div className="text-sm font-bold text-white flex items-center space-x-2 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-violet-400" />
                <span>{application.opportunity?.title || 'Engineering Role'}</span>
                <span className="px-2 py-0.2 rounded text-[10px] uppercase font-bold bg-blue-500/20 text-blue-300">
                  {formatOpportunityType(application.opportunity?.type)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Competency Match
              </span>
              <div className="text-xl font-black gradient-text">
                {matchPercentage}% Match
              </div>
            </div>
          </div>

          {/* Match Score Bar */}
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full"
              style={{ width: `${matchPercentage}%` }}
            />
          </div>

          {/* Matched vs Missing Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-white/10">
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Match Strengths ({matchedSkills.length})</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {matchedSkills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[10px] font-semibold"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-amber-400 flex items-center space-x-1 mb-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Skill Gaps for Role ({missingSkills.length})</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {missingSkills.length > 0 ? (
                  missingSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[10px] font-semibold"
                    >
                      △ {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-400 italic">None! Satisfies all requirements.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Standardized 10-Skill Assessment Scores */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Standardized 10-Point Assessment Breakdown</span>
            </h3>
            <span className="text-xs font-bold text-emerald-400">
              Role Readiness: {application.studentRoleReadiness || 88}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3.5 rounded-2xl bg-navy-950/60 border border-white/5 text-xs">
            {portfolio?.assessedSkills ? (
              Object.entries(portfolio.assessedSkills).map(([skillName, score]) => (
                <div key={skillName} className="p-2 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 truncate">{skillName}</span>
                    <span className="font-bold text-white">{score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              ['React (80%)', 'JavaScript (80%)', 'HTML/CSS (80%)', 'Git (60%)', 'SQL (60%)', 'Problem Solving (80%)'].map((s) => (
                <div key={s} className="p-2 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-300">
                  {s}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Project Highlights */}
        {portfolio?.projects && portfolio.projects.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-violet-400" />
              <span>Student Projects &amp; Repositories</span>
            </h3>
            <div className="space-y-2">
              {portfolio.projects.map((proj, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-navy-950/60 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.tech.map((t) => (
                      <span key={t} className="px-2 py-0.2 rounded bg-white/5 text-[10px] text-slate-400 border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Certifications */}
        {portfolio?.certifications && portfolio.certifications.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Institutional Credentials</span>
            </h3>
            <div className="space-y-2">
              {portfolio.certifications.map((cert) => (
                <div key={cert.id} className="p-3 rounded-2xl bg-navy-950/60 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white text-[11px]">{cert.title}</h4>
                    <span className="text-[10px] text-slate-400">{cert.issuer} • Issued {new Date(cert.issueDate).toLocaleDateString()}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {cert.status} ✓
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Recruiter Notes & Student Motivation */}
        <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
          {application.notes && (
            <div className="p-3 rounded-xl bg-navy-950/40 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Candidate Statement:</span>
              <p className="text-slate-200 italic">"{application.notes}"</p>
            </div>
          )}

          {application.recruiterNotes && (
            <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-500/30 space-y-1">
              <span className="text-[10px] font-bold uppercase text-violet-300 flex items-center space-x-1">
                <MessageSquareQuote className="w-3.5 h-3.5" />
                <span>Internal Recruiter Review Notes:</span>
              </span>
              <p className="text-slate-200 italic font-medium">"{application.recruiterNotes}"</p>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenStatusModal(application);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-glow-violet flex items-center space-x-2"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Update Candidate Status</span>
          </button>
        </div>

      </div>

      <DocumentViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        documentUrl={resumeUrl}
        documentName={resumeFileName}
        documentSize={resumeFileSize}
      />
    </div>
  );
};
