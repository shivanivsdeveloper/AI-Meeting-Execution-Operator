import React, { useState } from 'react';
import { 
  ShieldCheck, Check, X, Sparkles, Mail, 
  Users, Calendar, AlertTriangle, ArrowRight, Clock 
} from 'lucide-react';
import { useMeeting } from '../context/MeetingContext';
import { useToast } from '../context/ToastContext';

export const ApprovalsPage: React.FC = () => {
  const { approvals, actOnApproval } = useMeeting();
  const { showToast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      await actOnApproval(id, action);
      showToast(
        action === 'approve' ? 'AI action approved and executed!' : 'AI action rejected.',
        action === 'approve' ? 'success' : 'info'
      );
    } catch (err) {
      console.error(err);
      showToast('Action failed', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'external_email':
        return <Mail className="w-5 h-5 text-blue-400" />;
      case 'reassign_task':
        return <Users className="w-5 h-5 text-brand-400" />;
      case 'schedule_meeting':
        return <Calendar className="w-5 h-5 text-purple-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Human Approval Center & Governance Queue
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            High-impact autonomous actions (client emails, task reassignments, emergency syncs) require human authorization.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>{approvals.filter(a => a.status === 'Awaiting Approval').length} Pending Human Review</span>
        </div>
      </div>

      {/* Approvals Queue Cards */}
      <div className="space-y-4">
        {approvals.map(item => {
          const isPending = item.status === 'Awaiting Approval';

          return (
            <div
              key={item.id}
              className={`glass-card rounded-3xl p-6 border transition-all ${
                isPending ? 'border-brand-500/40 glow-brand' : 'border-white/5 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 flex-shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                        {item.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {item.confidence}% AI Confidence
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-100 mt-1">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold ${
                  item.status === 'Awaiting Approval'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    : item.status === 'Approved' || item.status === 'Executed'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium mb-4">
                {item.summary}
              </p>

              {/* Specific Details Box */}
              {item.type === 'external_email' && item.details?.body && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs font-mono text-slate-300 space-y-2 mb-4">
                  <div className="text-[11px] text-slate-400">
                    <strong>Recipient:</strong> {item.details.recipient} <br />
                    <strong>Subject:</strong> {item.details.subject}
                  </div>
                  <div className="whitespace-pre-line text-[11px] text-slate-200 border-t border-white/5 pt-2">
                    {item.details.body}
                  </div>
                </div>
              )}

              {item.type === 'reassign_task' && (
                <div className="p-3.5 rounded-2xl bg-brand-950/30 border border-brand-500/20 text-xs text-brand-200 space-y-1 mb-4">
                  <div><strong>Current Owner:</strong> {item.details.currentOwner}</div>
                  <div><strong>Proposed Owner:</strong> {item.details.recommendedOwner}</div>
                  <div className="text-[11px] text-slate-400">💡 {item.details.predictedWorkloadDrop}</div>
                </div>
              )}

              {/* Action Buttons */}
              {isPending && (
                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleAction(item.id, 'reject')}
                    disabled={processingId === item.id}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
                  >
                    Reject Action
                  </button>

                  <button
                    onClick={() => handleAction(item.id, 'approve')}
                    disabled={processingId === item.id}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-brand-500/30 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Execute Now</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
