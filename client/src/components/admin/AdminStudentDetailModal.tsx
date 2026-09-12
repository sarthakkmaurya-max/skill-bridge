import React from 'react';
import { AdminStudentSummary } from '@skillbridge/shared';
import { 
  X, 
  User, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Award, 
  FolderGit2, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';

interface AdminStudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: AdminStudentSummary | null;
}

export const AdminStudentDetailModal: React.FC<AdminStudentDetailModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl rounded-2xl glass-card border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start space-x-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white text-xl font-bold shadow-glow-emerald flex-shrink-0">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-white">{student.name}</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                student.placementStatus === 'Placed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : student.placementStatus === 'In Process'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-slate-700/50 text-slate-300 border border-white/10'
              }`}>
                {student.placementStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{student.email}</p>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2">
              <span className="flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                <span>{student.branch} • Class of {student.graduationYear}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="glass-panel p-3.5 rounded-xl border border-white/5 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Role Readiness</span>
            <span className="text-xl font-black gradient-text">{student.roleReadinessScore}%</span>
          </div>
          <div className="glass-panel p-3.5 rounded-xl border border-white/5 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Applications</span>
            <span className="text-xl font-black text-blue-400">{student.applicationsCount}</span>
          </div>
          <div className="glass-panel p-3.5 rounded-xl border border-white/5 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Verified Projects</span>
            <span className="text-xl font-black text-emerald-400">{student.verifiedProjectsCount}</span>
          </div>
          <div className="glass-panel p-3.5 rounded-xl border border-white/5 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Verified Certs</span>
            <span className="text-xl font-black text-violet-400">{student.verifiedCertsCount}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Target Role &amp; Focus</span>
            <div className="text-sm font-semibold text-white flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>{student.targetRole}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Institutional student record verified under <strong>{student.college}</strong> Career Services database.
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
};
