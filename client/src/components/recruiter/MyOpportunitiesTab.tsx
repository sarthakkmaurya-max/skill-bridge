import React, { useState } from 'react';
import { Opportunity, formatOpportunityType } from '@skillbridge/shared';
import { 
  Edit3, 
  Trash2, 
  Power, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { EditOpportunityModal } from './EditOpportunityModal';

interface MyOpportunitiesTabProps {
  opportunities: Opportunity[];
  onUpdate: (updated: Opportunity) => Promise<void>;
  onToggleStatus: (id: string, currentStatus: 'active' | 'closed') => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onGoToPost: () => void;
}

export const MyOpportunitiesTab: React.FC<MyOpportunitiesTabProps> = ({
  opportunities,
  onUpdate,
  onToggleStatus,
  onDelete,
  onGoToPost,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('all');
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = opportunities.filter(o => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">My Published Postings</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your company listings, toggle active status, and view applicant pipelines
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex p-1 rounded-xl bg-navy-950/80 border border-white/10 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterStatus === 'all' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({opportunities.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterStatus === 'active' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Active ({opportunities.filter(o => o.status === 'active').length})
            </button>
            <button
              onClick={() => setFilterStatus('closed')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterStatus === 'closed' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Closed ({opportunities.filter(o => o.status === 'closed').length})
            </button>
          </div>

          <button
            onClick={onGoToPost}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-xs font-bold shadow-glow-violet flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New</span>
          </button>
        </div>
      </div>

      {/* Listing Cards */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-white/10 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No opportunities found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {filterStatus === 'all'
              ? 'You have not posted any opportunities yet. Create your first opening now!'
              : `No postings currently match the "${filterStatus}" status filter.`}
          </p>
          <button
            onClick={onGoToPost}
            className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
          >
            Post an Opportunity
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(opp => {
            const isActive = opp.status === 'active';
            return (
              <div
                key={opp.id}
                className={`glass-card p-5 sm:p-6 rounded-2xl border transition-all space-y-4 ${
                  isActive ? 'border-white/10 hover:border-violet-500/30' : 'border-white/5 opacity-75 bg-slate-950/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h3 className="text-base font-bold text-white">{opp.title}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300">
                        {formatOpportunityType(opp.type)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {isActive ? '● Active' : '○ Closed'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 font-medium">{opp.company} • {opp.stipendOrSalary}</p>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    <button
                      onClick={() => setEditingOpp(opp)}
                      className="p-2 rounded-lg glass-panel hover:border-white/30 text-slate-300 hover:text-white transition-all text-xs flex items-center space-x-1"
                      title="Edit Opportunity"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    <button
                      onClick={() => onToggleStatus(opp.id, opp.status)}
                      className={`p-2 rounded-lg text-xs transition-all flex items-center space-x-1 border ${
                        isActive
                          ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                      title={isActive ? 'Close Opportunity' : 'Reactivate Opportunity'}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isActive ? 'Close' : 'Reopen'}</span>
                    </button>

                    {confirmDeleteId === opp.id ? (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => { onDelete(opp.id); setConfirmDeleteId(null); }}
                          className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1.5 rounded-lg glass-panel text-slate-400 hover:text-white text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(opp.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs"
                        title="Delete Opportunity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{opp.description}</p>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-xs text-slate-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{opp.location} ({opp.workMode || 'hybrid'})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{opp.openingsCount || 1} Openings</span>
                  </div>
                  <div className="text-right sm:text-left text-slate-500 text-[11px]">
                    Posted {new Date(opp.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.requiredSkills.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingOpp && (
        <EditOpportunityModal
          opportunity={editingOpp}
          isOpen={Boolean(editingOpp)}
          onClose={() => setEditingOpp(null)}
          onSave={onUpdate}
        />
      )}

    </div>
  );
};