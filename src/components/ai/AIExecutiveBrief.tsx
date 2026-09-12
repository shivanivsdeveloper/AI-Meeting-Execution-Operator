import React from 'react';
import { Sparkles, Bot, AlertTriangle, ArrowRight, CheckCircle2, Flame } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface AIExecutiveBriefProps {
  onAskAI: () => void;
  setActiveTab: (tab: NavTab) => void;
}

export const AIExecutiveBrief: React.FC<AIExecutiveBriefProps> = ({ onAskAI, setActiveTab }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-950/80 via-dark-850 to-indigo-950/70 border border-brand-500/30 p-6 shadow-2xl shadow-brand-500/10 mb-8">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-300">
              AI Executive Brief · Morning Telemetry
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Generated 09:00 AM
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
            Good morning, Shivani. <span className="text-slate-300 font-normal">3 critical decisions were locked yesterday.</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
              <span><strong>Payment API Integration</strong> has an <strong>82% delay risk</strong> directly impacting Monday's client demo.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
              <span><strong>1 Unresolved Question</strong>: Production sandbox sign-off ownership is still unassigned.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
              <span><strong>Firebase Auth Migration</strong> verified completed on-time with 100% test pass rate.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 flex-shrink-0"></span>
              <span><strong>Workload Optimizer</strong> recommends shifting testing tasks from Priya to Arun.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto flex-shrink-0">
          <button
            onClick={onAskAI}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Bot className="w-4 h-4" />
            <span>Ask MeetFlow AI</span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-colors"
          >
            <span>Review Approval Queue (3)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
