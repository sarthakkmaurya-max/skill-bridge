import React, { useState } from 'react';
import { Opportunity, OpportunityType, WorkMode } from '@skillbridge/shared';
import { X, Save, AlertCircle } from 'lucide-react';

interface EditOpportunityModalProps {
  opportunity: Opportunity;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Opportunity) => Promise<void>;
}

export const EditOpportunityModal: React.FC<EditOpportunityModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(opportunity.title);
  const [company, setCompany] = useState(opportunity.company);
  const [type, setType] = useState<OpportunityType>(opportunity.type);
  const [workMode, setWorkMode] = useState<WorkMode>(opportunity.workMode || 'hybrid');
  const [location, setLocation] = useState(opportunity.location);
  const [stipendOrSalary, setStipendOrSalary] = useState(opportunity.stipendOrSalary);
  const [duration, setDuration] = useState(opportunity.duration || '3 Months');
  const [deadline, setDeadline] = useState(opportunity.deadline ? opportunity.deadline.split('T')[0] : '');
  const [openingsCount, setOpeningsCount] = useState<number>(opportunity.openingsCount || 1);
  const [eligibility, setEligibility] = useState(opportunity.eligibility || '');
  const [description, setDescription] = useState(opportunity.description);
  const [requiredSkills, setRequiredSkills] = useState<string[]>(opportunity.requiredSkills || []);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !requiredSkills.includes(trimmed)) {
      setRequiredSkills([...requiredSkills, trimmed]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (s: string) => {
    setRequiredSkills(requiredSkills.filter(item => item !== s));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const updated: Opportunity = {
        ...opportunity,
        title: title.trim(),
        company: company.trim(),
        type,
        workMode,
        location: location.trim(),
        stipendOrSalary: stipendOrSalary.trim(),
        duration: duration.trim(),
        deadline: new Date(deadline).toISOString(),
        openingsCount: Number(openingsCount) || 1,
        eligibility: eligibility.trim(),
        description: description.trim(),
        requiredSkills,
        updatedAt: new Date().toISOString(),
      };
      await onSave(updated);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update opportunity');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-card border border-white/15 p-6 sm:p-8 shadow-2xl space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-xl font-bold text-white">Edit Opportunity Posting</h3>
          <p className="text-xs text-slate-400">Update job requirements, deadline, or compensation</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Company</label>
              <input
                type="text"
                required
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as OpportunityType)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-navy-950 text-slate-200"
              >
                <option value="internship">Internship</option>
                <option value="job">Job</option>
                <option value="apprenticeship">Apprenticeship</option>
                <option value="workshop">Workshop</option>
                <option value="fdp">Faculty Development Program</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={e => setWorkMode(e.target.value as WorkMode)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-navy-950 text-slate-200"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on_site">On-site</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Openings</label>
              <input
                type="number"
                min="1"
                value={openingsCount}
                onChange={e => setOpeningsCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Stipend/Salary</label>
              <input
                type="text"
                required
                value={stipendOrSalary}
                onChange={e => setStipendOrSalary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Deadline</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Required Skills</label>
            <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-navy-950/80 border border-white/10 mb-2">
              {requiredSkills.map(skill => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs flex items-center space-x-1"
                >
                  <span>{skill}</span>
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add skill..."
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl glass-input text-xs"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow-blue flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};