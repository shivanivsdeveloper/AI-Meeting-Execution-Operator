import React, { useState } from 'react';
import { Users, Sparkles, X, ArrowRight, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { useMeeting } from '../../context/MeetingContext';
import { useToast } from '../../context/ToastContext';

interface WorkloadBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkloadBalanceModal: React.FC<WorkloadBalanceModalProps> = ({ isOpen, onClose }) => {
  const { rebalanceWorkload } = useMeeting();
  const { showToast } = useToast();
  const [isApplying, setIsApplying] = useState(false);

  if (!isOpen) return null;

  const handleApplyRebalance = async () => {
    setIsApplying(true);
    try {
      await rebalanceWorkload('usr_priya', 'usr_arun', 'tsk_02');
      showToast('Workload rebalanced! Task moved to Arun Kumar.', 'success', 'Workload Optimizer');
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Failed to rebalance workload', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-dark-900 border border-white/15 shadow-2xl p-6 overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <Users className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                AI Workload Balancing & Capacity Optimization
              </h3>
              <p className="text-xs text-slate-400">
                AI identified severe workload bottleneck on Lead Backend
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-6 space-y-4">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Overloaded User */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-rose-400">Current Owner (Overloaded)</span>
                <span className="text-xs font-mono font-bold text-rose-400">87% Capacity</span>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="Priya"
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-rose-500/50"
                />
                <div>
                  <div className="text-xs font-bold text-slate-100">Priya Sharma</div>
                  <div className="text-[11px] text-slate-400">6 Active Tasks · 82% Risk</div>
                </div>
              </div>
            </div>

            {/* Recommended Target User */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Recommended (Available)</span>
                <span className="text-xs font-mono font-bold text-emerald-400">41% Capacity</span>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="Arun"
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-emerald-500/50"
                />
                <div>
                  <div className="text-xs font-bold text-slate-100">Arun Kumar</div>
                  <div className="text-[11px] text-slate-400">2 Active Tasks · QA Expert</div>
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Item Detail */}
          <div className="p-3.5 rounded-xl bg-dark-850 border border-white/10 text-xs space-y-1">
            <div className="text-[10px] uppercase font-bold text-brand-300">Target Task to Reassign:</div>
            <div className="font-semibold text-slate-100">Execute Automated E2E Regression & Load Test Suites</div>
            <div className="text-[11px] text-slate-400">
              Matches Arun’s Playwright & k6 testing specialization. Shifts Priya from 87% $\to$ 74% capacity.
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleApplyRebalance}
            disabled={isApplying}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-500/30 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isApplying ? 'Reassigning...' : 'Approve & Reassign to Arun'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
