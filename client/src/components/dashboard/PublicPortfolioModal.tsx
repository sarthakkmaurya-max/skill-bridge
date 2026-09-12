import React, { useState } from 'react';
import { StudentPortfolio } from '@skillbridge/shared';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Github, 
  Globe, 
  Award, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Trophy, 
  CheckCircle2, 
  Code2,
  Eye,
  Download
} from 'lucide-react';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import { downloadDocument } from '../../lib/storage';

interface PublicPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: StudentPortfolio;
}

export const PublicPortfolioModal: React.FC<PublicPortfolioModalProps> = ({
  isOpen,
  onClose,
  portfolio,
}) => {
  const [copied, setCopied] = useState(false);
  const [resumeViewerOpen, setResumeViewerOpen] = useState(false);

  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}?portfolio=${portfolio.studentId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/85 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl rounded-3xl glass-card border border-white/20 p-6 sm:p-9 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Actions */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Verified Public Digital Portfolio
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl glass-panel hover:border-blue-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
              <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-7 pt-6 pr-1 custom-scrollbar">
          
          {/* Hero Profile Summary */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white text-2xl font-black shadow-glow-blue flex-shrink-0">
                {portfolio.avatarUrl ? (
                  <img src={portfolio.avatarUrl} alt={portfolio.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  portfolio.name.charAt(0)
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{portfolio.name}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Talent</span>
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

            {/* Role Readiness Score Pill */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto p-3 sm:p-0 rounded-xl bg-navy-950/40 sm:bg-transparent border sm:border-0 border-white/5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Role Readiness</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-black gradient-text">{portfolio.roleReadinessScore}%</span>
                <span className="text-xs text-slate-400 font-bold">Benchmark</span>
              </div>
              {portfolio.resumeUrl && (
                <div className="mt-2 flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setResumeViewerOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Resume</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadDocument(portfolio.resumeUrl!, portfolio.resumeFileName || 'Candidate_Resume.pdf')}
                    className="p-1.5 rounded-lg glass-panel hover:border-white/30 text-slate-300 hover:text-white transition-colors"
                    title="Download resume PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bio / Executive Summary */}
          {portfolio.bio && (
            <div className="space-y-1.5">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">Professional Summary</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed glass-panel p-4 rounded-xl border border-white/5">
                {portfolio.bio}
              </p>
            </div>
          )}

          {/* Assessed Competencies Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center space-x-1.5">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>Standardized Skill Benchmarks (Industry Assessed)</span>
              </h4>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Assessment Scores</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {Object.entries(portfolio.assessedSkills || {}).map(([skill, score]) => (
                <div key={skill} className="glass-panel p-3 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
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

          {/* Featured Verified Projects */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center space-x-1.5">
              <Briefcase className="w-4 h-4 text-violet-400" />
              <span>Engineering Projects &amp; Implementations</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {portfolio.projects.map((proj) => (
                <div key={proj.id} className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-sm font-bold text-white">{proj.title}</h5>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                        proj.status === 'Verified' 
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        {proj.status === 'Verified' ? 'Verified ✓' : proj.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    {proj.adminNotes ? (
                      <span className="text-[10px] text-emerald-400 truncate max-w-[180px]">
                        ✓ {proj.adminNotes}
                      </span>
                    ) : <span />}

                    <div className="flex items-center space-x-2">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                          title="View Source Code"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {proj.projectUrl && (
                        <a
                          href={proj.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors flex items-center space-x-1 text-xs"
                          title="Live Demo"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Certifications & Honors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Certifications */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Certifications &amp; Credentials</span>
              </h4>

              <div className="space-y-2.5">
                {portfolio.certifications.map((cert) => (
                  <div key={cert.id} className="glass-panel p-3.5 rounded-xl border border-white/5 space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h6 className="text-xs font-bold text-white">{cert.title}</h6>
                        <span className="text-[11px] text-slate-400">{cert.issuer}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        cert.status === 'Verified' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
                      }`}>
                        {cert.status}
                      </span>
                    </div>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-blue-400 hover:underline flex items-center space-x-1"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center space-x-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Honors &amp; Recognitions</span>
              </h4>

              <div className="space-y-2.5">
                {portfolio.achievements.map((ach) => (
                  <div key={ach.id} className="glass-panel p-3.5 rounded-xl border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <h6 className="text-xs font-bold text-white">{ach.title}</h6>
                      <span className="text-[10px] text-slate-400">{ach.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{ach.description}</p>
                    {ach.issuer && <span className="text-[10px] text-amber-400/80 font-medium">Issued by: {ach.issuer}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Privacy footer */}
          <div className="p-3.5 rounded-xl bg-navy-900/60 border border-white/5 text-center text-[11px] text-slate-400">
            Institutional Verification Signed by Apex Institute Career Services • Personal contact data is protected.
          </div>

        </div>

      </div>

      <DocumentViewerModal
        isOpen={resumeViewerOpen}
        onClose={() => setResumeViewerOpen(false)}
        documentUrl={portfolio.resumeUrl}
        documentName={portfolio.resumeFileName || 'Candidate_Resume.pdf'}
        documentSize={portfolio.resumeFileSize || '245 KB'}
      />
    </div>
  );
};
