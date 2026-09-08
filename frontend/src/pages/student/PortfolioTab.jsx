import React, { useState } from 'react';
import { api } from '../../services/api';
import { Plus, Trash2, ShieldCheck, Clock, ExternalLink, Code2, FileText, X } from 'lucide-react';

export default function PortfolioTab({ profileData, certificates, projects, onRefresh }) {
  const [newSkill, setNewSkill] = useState('');
  const [showCertModal, setShowCertModal] = useState(false);
  const [showProjModal, setShowProjModal] = useState(false);

  const [certForm, setCertForm] = useState({ title: '', issuer: '', credentialUrl: '', notes: '' });
  const [projForm, setProjForm] = useState({ title: '', description: '', technologies: '', repoUrl: '', liveUrl: '' });

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const clean = newSkill.trim();
    if ((profileData?.skills || []).includes(clean)) {
      setNewSkill('');
      return;
    }
    const updated = [...(profileData?.skills || []), clean];
    try {
      await api.updateProfile({ skills: updated });
      setNewSkill('');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSkill = async (skill) => {
    const updated = (profileData?.skills || []).filter((s) => s !== skill);
    try {
      await api.updateProfile({ skills: updated });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    try {
      const res = await api.addCertificate(certForm);
      if (res.success) {
        setShowCertModal(false);
        setCertForm({ title: '', issuer: '', credentialUrl: '', notes: '' });
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProj = async (e) => {
    e.preventDefault();
    try {
      const res = await api.addProject(projForm);
      if (res.success) {
        setShowProjModal(false);
        setProjForm({ title: '', description: '', technologies: '', repoUrl: '', liveUrl: '' });
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCert = async (id) => {
    try {
      await api.deleteCertificate(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProj = async (id) => {
    try {
      await api.deleteProject(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Card */}
      <div className="bg-[#0e1e38]/75 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
          <div>
            <h2 className="text-2xl font-black text-white">{profileData?.name}</h2>
            <p className="text-xs text-slate-400 mt-1">
              {profileData?.branch} • {profileData?.college} (Graduating {profileData?.graduationYear})
            </p>
          </div>
          {profileData?.resumeUrl && (
            <a
              href={profileData.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-bold transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" /> Resume Link
            </a>
          )}
        </div>

        {/* Skills Management */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Profile Skills ({profileData?.skills?.length || 0})
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {(profileData?.skills || []).map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-2 hover:border-blue-500/50 transition-colors"
              >
                {s}
                <button
                  onClick={() => handleRemoveSkill(s)}
                  className="text-blue-400 hover:text-white font-bold ml-0.5 transition-colors"
                  aria-label={`Remove skill ${s}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSkill} className="flex gap-2 max-w-sm">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g. Docker, TypeScript)..."
              className="flex-1 px-3.5 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
            >
              Add
            </button>
          </form>
        </div>
      </div>

      {/* Certificates Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Certificates & Credentials</h3>
            <p className="text-xs text-slate-400">Verified by College Admin with verified badges</p>
          </div>
          <button
            onClick={() => setShowCertModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Certificate
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((c) => (
            <div
              key={c._id}
              className="bg-[#0e1e38]/70 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-xl flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-400">{c.issuer}</span>
                  {c.verificationStatus === 'verified' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shadow-xs shadow-emerald-500/20">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Badge
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pending Verification
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm sm:text-base text-white">{c.title}</h4>
                {c.credentialUrl && (
                  <a
                    href={c.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 hover:underline mt-2"
                  >
                    View Credential <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-slate-400">
                <span>Issued: {new Date(c.issueDate).toLocaleDateString()}</span>
                <button
                  onClick={() => handleDeleteCert(c._id)}
                  className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
                  aria-label="Delete certificate"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Featured Projects</h3>
            <p className="text-xs text-slate-400">Real-world projects with source code repositories</p>
          </div>
          <button
            onClick={() => setShowProjModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-[#0e1e38]/70 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-xl flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h4 className="font-bold text-sm sm:text-base text-white">{p.title}</h4>
                  {p.verificationStatus === 'verified' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shadow-xs shadow-emerald-500/20">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Badge
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pending Verification
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(p.technologies || []).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-slate-300 text-[10px] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  {p.repoUrl && (
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-300 hover:text-white font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Code2 className="w-3.5 h-3.5 text-blue-400" /> Code
                    </a>
                  )}
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1.5 hover:underline transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Demo
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteProj(p._id)}
                  className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
                  aria-label="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1933] border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-white">Add Certificate</h3>
              <button
                onClick={() => setShowCertModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCert} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  placeholder="AWS Cloud Practitioner"
                  className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Issuer</label>
                <input
                  type="text"
                  required
                  value={certForm.issuer}
                  onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                  placeholder="Amazon Web Services"
                  className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Credential URL</label>
                <input
                  type="url"
                  value={certForm.credentialUrl}
                  onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProjModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1933] border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-white">Add Project</h3>
              <button
                onClick={() => setShowProjModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProj} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={projForm.title}
                  onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                  placeholder="AlgoVision Visualizer"
                  className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={projForm.description}
                  onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                  placeholder="Short description..."
                  className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={projForm.technologies}
                  onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })}
                  placeholder="React, Tailwind, Node.js"
                  className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repo URL</label>
                <input
                  type="url"
                  value={projForm.repoUrl}
                  onChange={(e) => setProjForm({ ...projForm, repoUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo URL</label>
                <input
                  type="url"
                  value={projForm.liveUrl}
                  onChange={(e) => setProjForm({ ...projForm, liveUrl: e.target.value })}
                  placeholder="https://my-project.vercel.app"
                  className="w-full p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProjModal(false)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}