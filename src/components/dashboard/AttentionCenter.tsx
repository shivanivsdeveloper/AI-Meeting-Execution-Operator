import React from 'react';
import { 
  AlertTriangle, Clock, ShieldCheck, HelpCircle, 
  Flame, Sparkles, CheckCircle2, ArrowRight, XCircle 
} from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface AttentionCenterProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenConflictModal?: () => void;
}

export const AttentionCenter: React.FC<AttentionCenterProps> = ({
  setActiveTab,
  onOpenConflictModal
}) => {
  const items = [
    {
      id: 'att_1',
      category: 'At Risk',
      severity: 'Critical',
      title: 'Payment API & Stripe v3 Delivery',
      detail: 'Due Friday 4 PM · Predicted delay risk: 82%',
      impact: 'Will block Arun’s automated QA and jeopardize Monday client demo.',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      actionLabel: 'Launch Simulator',
      targetTab: 'simulator' as NavTab
    },
    {
      id: 'att_2',
      category: 'Awaiting Approval',
      severity: 'High',
      title: 'Workload Rebalancing: Offload API QA to Arun',
      detail: 'Priya is at 87% capacity; Arun has 41% capacity with exact skill match.',
      impact: 'Reduces Priya’s delay risk by 28% without affecting milestones.',
      badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
      actionLabel: 'Review Approval Queue',
      targetTab: 'approvals' as NavTab
    },
    {
      id: 'att_3',
      category: 'Deadline Conflict',
      severity: 'High',
      title: 'Monday Sept 21 vs Wednesday Sept 23 Demo Date',
      detail: 'Sprint 24 agreed on Monday; GTM Partner calendar lists Wednesday.',
      impact: 'Engineering and Sales schedules are currently out of sync.',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      actionLabel: 'Resolve Conflict',
      targetTab: 'decisions' as NavTab
    },
    {
      id: 'att_4',
      category: 'Unresolved Question',
      severity: 'Medium',
      title: 'Who owns production sandbox credentials approval?',
      detail: 'First raised by Sarah Chen in Sprint 24 Planning (Seen in 2 meetings).',
      impact: 'Client testing team cannot access sandbox without signed owner.',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      actionLabel: 'View Question',
      targetTab: 'questions' as NavTab
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Attention Center · Proactive Escalations
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Items requiring managerial review, conflict resolution, or workload optimization
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
          4 Items Need Attention
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-dark-850/80 border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${item.badgeColor}`}>
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Priority: {item.severity}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                {item.detail}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                💡 {item.impact}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                Detected by RiskAgent
              </span>
              <button
                onClick={() => setActiveTab(item.targetTab)}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
              >
                {item.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
