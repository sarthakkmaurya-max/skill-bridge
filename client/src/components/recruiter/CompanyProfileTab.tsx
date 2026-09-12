import React, { useState } from 'react';
import { Building2, Globe, Mail, MapPin, CheckCircle2, Save } from 'lucide-react';

interface CompanyProfileTabProps {
  initialCompany?: string;
  initialLocation?: string;
}

export const CompanyProfileTab: React.FC<CompanyProfileTabProps> = ({
  initialCompany = 'Nexus Cloud India',
  initialLocation = 'Bengaluru, Karnataka',
}) => {
  const [companyName, setCompanyName] = useState(initialCompany);
  const [industry, setIndustry] = useState('Cloud Infrastructure & Enterprise SaaS');
  const [location, setLocation] = useState(initialLocation);
  const [website, setWebsite] = useState('https://nexuscloud.io');
  const [contactEmail, setContactEmail] = useState('talent.india@nexuscloud.io');
  const [bio, setBio] = useState(
    'Nexus Cloud India builds mission-critical multi-cloud deployment platforms and reactive developer tooling for modern engineering organizations.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Company Profile</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your verified employer branding displayed to university students
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Company profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-glow-violet">
            {companyName.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{companyName}</h3>
            <span className="text-xs text-blue-400 font-medium">Verified Industry Hiring Partner</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Industry Sector</label>
            <input
              type="text"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Headquarters Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company Website</label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Talent Contact Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              required
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Company Overview / Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs leading-relaxed"
          />
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-xs font-bold shadow-glow-violet flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};