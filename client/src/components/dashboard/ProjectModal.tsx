import React, { useState, useEffect } from 'react';
import { StudentProject } from '@skillbridge/shared';
import { X, FolderGit2, Globe, Github, Plus, Trash2, Sparkles } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Partial<StudentProject>) => Promise<void> | void;
  initialProject?: StudentProject | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProject,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title || '');
      setDescription(initialProject.description || '');
      setTechnologies(initialProject.technologies || []);
      setProjectUrl(initialProject.projectUrl || '');
      setGithubUrl(initialProject.githubUrl || '');
    } else {
      setTitle('');
      setDescription('');
      setTechnologies(['React', 'TypeScript']);
      setProjectUrl('');
      setGithubUrl('');
    }
    setError(null);
  }, [initialProject, isOpen]);

  if (!isOpen) return null;

  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (t: string) => {
    setTechnologies(technologies.filter((tech) => tech !== t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a project title');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a project description');
      return;
    }
    if (technologies.length === 0) {
      setError('Please add at least one technology tag');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onSave({
        id: initialProject?.id,
        title: title.trim(),
        description: description.trim(),
        technologies,
        projectUrl: projectUrl.trim(),
        githubUrl: githubUrl.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-2xl glass-card border border-white/15 p-6 sm:p-7 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {initialProject ? 'Edit Project' : 'Add New Portfolio Project'}
            </h3>
            <p className="text-xs text-slate-400">
              Submitted projects receive verification badges upon faculty or admin review.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Project Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Ledger Microservice"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description &amp; Key Highlights <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain problem statement, architecture, technologies used, and real-world impact..."
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tech Stack Tags <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                placeholder="Type skill & press Enter (e.g. React, PostgreSQL)"
                className="flex-1 px-3 py-1.5 rounded-xl glass-input text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {technologies.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] font-medium flex items-center space-x-1"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(t)}
                    className="hover:text-red-300 transition-colors ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Live Demo URL</span>
              </label>
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://myproject.app"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                <Github className="w-3.5 h-3.5 text-slate-400" />
                <span>GitHub Repo URL</span>
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-xs shadow-glow-blue transition-all"
            >
              {saving ? 'Saving...' : initialProject ? 'Update Project' : 'Add Project to Portfolio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
