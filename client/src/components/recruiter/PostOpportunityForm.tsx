import React, { useState } from 'react';
import { Opportunity, OpportunityType, WorkMode } from '@skillbridge/shared';
import { 
  Sparkles, 
  Plus, 
  X, 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface PostOpportunityFormProps {
  initialCompany?: string;
  onSubmit: (opp: Omit<Opportunity, 'id' | 'createdAt' | 'recruiterId'>) => Promise<void>;
  onSuccessRedirect?: () => void;
}

const COMMON_SKILLS = [
  'React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Node.js', 
  'Python', 'SQL', 'Git', 'Problem Solving', 'Communication', 
  'Docker', 'Tailwind CSS', 'PostgreSQL', 'Machine Learning'
];

export const PostOpportunityForm: React.FC<PostOpportunityFormProps> = ({
  initialCompany = '',
  onSubmit,
  onSuccessRedirect,
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState(initialCompany || 'Nexus Cloud India');
  const [type, setType] = useState<OpportunityType>('internship');
  const [workMode, setWorkMode] = useState<WorkMode>('hybrid');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [stipendOrSalary, setStipendOrSalary] = useState('₹45,000 / month');
  const [duration, setDuration] = useState('6 Months');
  const [deadline, setDeadline] = useState('2026-11-15');
  const [openingsCount, setOpeningsCount] = useState<number>(3);
  const [eligibility, setEligibility] = useState('Current B.Tech/MCA 2026 or 2027 batch with 75%+ role readiness.');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['React', 'TypeScript', 'Git']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !requiredSkills.includes(trimmed)) {
      setRequiredSkills([...requiredSkills, trimmed]);
    }
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please provide a job or internship title.');
      return;
    }
    if (!description.trim() || description.length < 20) {
      setErrorMessage('Please provide a comprehensive role description (min 20 characters).');
      return;
    }
    if (requiredSkills.length === 0) {
      setErrorMessage('Please specify at least one required skill.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        company: company.trim(),
        type,
        workMode,
        location: location.trim(),
        stipendOrSalary: stipendOrSalary.trim(),
        duration: duration.trim(),
        deadline: new Date(deadline).toISOString(),
        eligibility: eligibility.trim(),
        description: description.trim(),
        requiredSkills,
        openingsCount: Number(openingsCount) || 1,
        status: 'active',
      });

      setSuccessMessage(`Opportunity "${title}" has been published successfully!`);
      // Reset form
      setTitle('');
      setDescription('');
      if (onSuccessRedirect) {
        setTimeout(onSuccessRedirect, 1500);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to publish opportunity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-9 rounded-3xl border border-white/15 space-y-6 shadow-2xl animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center text-white shadow-glow-violet">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Post New Industry Opportunity</h2>
            <p className="text-xs text-slate-400">
              Publish internships, jobs, workshops, or faculty development programs to university talent pools
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Row 1: Title & Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Opportunity Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. SDE Frontend React Intern"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hiring Company *</label>
          <input
            type="text"
            required
            placeholder="e.g. Nexus Cloud India"
            value={company}
            onChange={e => setCompany(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>
      </div>

      {/* Row 2: Type, Work Mode, Openings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Opportunity Type *</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as OpportunityType)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs bg-navy-950 text-slate-200"
          >
            <option value="internship">Internship</option>
            <option value="job">Full-Time Job</option>
            <option value="apprenticeship">Apprenticeship</option>
            <option value="workshop">Hands-on Workshop</option>
            <option value="fdp">Faculty Development Program (FDP)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Mode *</label>
          <select
            value={workMode}
            onChange={e => setWorkMode(e.target.value as WorkMode)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs bg-navy-950 text-slate-200"
          >
            <option value="remote">Remote (Virtual)</option>
            <option value="hybrid">Hybrid</option>
            <option value="on_site">On-site (Office / Campus)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Number of Openings</label>
          <input
            type="number"
            min="1"
            max="100"
            value={openingsCount}
            onChange={e => setOpeningsCount(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>
      </div>

      {/* Row 3: Location, Stipend/Salary, Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location *</label>
          <input
            type="text"
            required
            placeholder="e.g. Bengaluru, Karnataka"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Stipend / Salary *</label>
          <input
            type="text"
            required
            placeholder="e.g. ₹45,000 / month or ₹12 LPA"
            value={stipendOrSalary}
            onChange={e => setStipendOrSalary(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duration</label>
          <input
            type="text"
            placeholder="e.g. 6 Months / Full-Time"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>
      </div>

      {/* Row 4: Deadline & Eligibility */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Application Deadline *</label>
          <input
            type="date"
            required
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Candidate Eligibility</label>
          <input
            type="text"
            placeholder="e.g. B.Tech / MCA 2026/2027 batch with 75%+ readiness"
            value={eligibility}
            onChange={e => setEligibility(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>
      </div>

      {/* Required Skills Chip Selector */}
      <div className="space-y-2.5 pt-1">
        <label className="block text-xs font-semibold text-slate-300">
          Required Competencies &amp; Skills * (Selected: {requiredSkills.length})
        </label>
        
        {/* Selected skills pills */}
        <div className="flex flex-wrap gap-2 min-h-[38px] p-2.5 rounded-xl bg-navy-950/80 border border-white/10">
          {requiredSkills.map(skill => (
            <span
              key={skill}
              className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-semibold flex items-center space-x-1.5"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-red-400 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {requiredSkills.length === 0 && (
            <span className="text-xs text-slate-500 self-center">No skills selected yet. Click recommendations or add custom skills below.</span>
          )}
        </div>

        {/* Quick add suggestions */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-slate-400 font-medium">Quick Suggestions:</span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_SKILLS.map(skill => {
              const isAdded = requiredSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => isAdded ? handleRemoveSkill(skill) : handleAddSkill(skill)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                    isAdded
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {isAdded ? '✓ ' : '+ '} {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom skill add input */}
        <div className="flex items-center space-x-2 pt-1">
          <input
            type="text"
            placeholder="Type custom skill (e.g. Next.js, Redux, GCP)..."
            value={customSkillInput}
            onChange={e => setCustomSkillInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill(customSkillInput);
              }
            }}
            className="flex-1 px-3.5 py-2 rounded-xl glass-input text-xs"
          />
          <button
            type="button"
            onClick={() => handleAddSkill(customSkillInput)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Add Skill
          </button>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Role Description &amp; Responsibilities *</label>
        <textarea
          rows={4}
          required
          placeholder="Describe the day-to-day responsibilities, learning outcomes, tech stack details, and mentorship opportunities..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs leading-relaxed"
        />
      </div>

      {/* Submit Action */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-xs shadow-glow-violet flex items-center space-x-2 transition-all"
        >
          {isSubmitting ? (
            <span>Publishing Opportunity...</span>
          ) : (
            <>
              <Briefcase className="w-4 h-4" />
              <span>Publish Opportunity Now</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
};