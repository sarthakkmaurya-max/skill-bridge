import React, { useState } from 'react';
import { AdminVerificationItem } from '@skillbridge/shared';
import { 
  Award, 
  FolderGit2, 
  Check, 
  X, 
  ExternalLink, 
  Github, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  MessageSquare 
} from 'lucide-react';

interface AdminVerificationsTabProps {
  verifications: AdminVerificationItem[];
  onUpdateStatus: (type: 'project' | 'certificate', id: string, status: 'Verified' | 'Rejected', adminNotes?: string) => Promise<void> | void;
}

export const AdminVerificationsTab: React.FC<AdminVerificationsTabProps> = ({
  verifications,
  onUpdateStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Verified' | 'Rejected'>('all');
  const [activeNoteItemId, setActiveNoteItemId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const filtered = verifications.filter((item) => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const pendingCount = verifications.filter(v => v.status === 'Pending').length;
  const verifiedCount = verifications.filter(v => v.status === 'Verified').length;
  const rejectedCount = verifications.filter(v => v.status === 'Rejected').length;

  const handleApprove = (item: AdminVerificationItem) => {
    const defaultNote = 'Verified by campus career & placement cell.';
    onUpdateStatus(item.type, item.id, 'Verified', noteText.trim() || defaultNote);
    setActiveNoteItemId(null);
    setNoteText('');
  };

  const handleReject = (item: AdminVerificationItem) => {
    const defaultNote = 'Verification revision required. Please update repository link or issue proof.';
    onUpdateStatus(item.type, item.id, 'Rejected', noteText.trim() || defaultNote);
    setActiveNoteItemId(null);
    setNoteText('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Digital Credential Verification Authority</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Authenticate student code repositories, institutional certifications, and engineering honors
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingCount} Pending Review</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {[
          { key: 'all', label: 'All Items', count: verifications.length },
          { key: 'Pending', label: 'Pending Approval', count: pendingCount },
          { key: 'Verified', label: 'Verified Badges', count: verifiedCount },
          { key: 'Rejected', label: 'Revisions Needed', count: rejectedCount },
        ].map((pill) => (
          <button
            key={pill.key}
            onClick={() => setStatusFilter(pill.key as any)}
            className={`px-3.5 py-1.5 rounded-xl transition-all text-xs font-semibold flex items-center space-x-1.5 ${
              statusFilter === pill.key
                ? 'bg-emerald-600 text-white shadow-glow-emerald'
                : 'glass-panel hover:border-white/20 text-slate-300'
            }`}
          >
            <span>{pill.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              statusFilter === pill.key ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {pill.count}
            </span>
          </button>
        ))}
      </div>

      {/* Verifications List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="glass-card p-10 rounded-2xl text-center space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">No items in this queue</h4>
            <p className="text-xs text-slate-400">All submitted student records in this view are up-to-date.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 hover:border-white/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.type === 'project'
                      ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400'
                      : 'bg-violet-500/15 border border-violet-500/30 text-violet-400'
                  }`}>
                    {item.type === 'project' ? <FolderGit2 className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        {item.type}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.status === 'Verified'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.status === 'Pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {item.status === 'Verified' ? 'Verified ✓' : item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.descriptionOrIssuer}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                      <span>Submitted by: <strong className="text-slate-200">{item.studentName}</strong></span>
                      <span>•</span>
                      <span>{item.studentBranch}</span>
                      <span>•</span>
                      <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                    </div>

                    {item.tech && item.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tech.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.adminNotes && (
                      <div className="mt-1 text-[11px] text-slate-400">
                        <span className="text-slate-300 font-semibold">Admin Notes: </span>
                        {item.adminNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side verification controls */}
                <div className="flex flex-col sm:items-end space-y-2 flex-shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="flex items-center space-x-2">
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg glass-panel hover:border-white/20 text-blue-400 text-xs font-semibold flex items-center space-x-1"
                      >
                        <span>Inspect Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <button
                      onClick={() => handleApprove(item)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald flex items-center space-x-1 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleReject(item)}
                      className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold flex items-center space-x-1 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setActiveNoteItemId(activeNoteItemId === item.id ? null : item.id);
                      setNoteText(item.adminNotes || '');
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>{activeNoteItemId === item.id ? 'Close Note' : 'Add Custom Review Note'}</span>
                  </button>
                </div>
              </div>

              {/* Custom review note expandable input */}
              {activeNoteItemId === item.id && (
                <div className="mt-2 pt-2 border-t border-white/5 space-y-2 animate-fadeIn">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter review feedback note for student portfolio..."
                    className="w-full px-3 py-1.5 rounded-xl glass-input text-xs text-white"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleApprove(item)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold"
                    >
                      Approve with Note
                    </button>
                    <button
                      onClick={() => handleReject(item)}
                      className="px-3 py-1 rounded-lg bg-red-600/30 text-red-300 border border-red-500/30 text-[11px] font-bold"
                    >
                      Reject with Note
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
};
