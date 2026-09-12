import React from 'react';
import { BarChart3, TrendingUp, Sparkles, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { ExecutionFunnelChart } from '../components/visualizations/ExecutionFunnelChart';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Execution Analytics & Conversion Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Measure decision velocity, meeting effectiveness, and conversation-to-completion conversion.
          </p>
        </div>
      </div>

      {/* Signature Execution Funnel Chart */}
      <ExecutionFunnelChart />

      {/* Decision Velocity & Quality Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Average Decision Velocity
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            4.2 <span className="text-sm text-slate-400">Hours</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Time from verbal proposal in meeting to signed architectural approval.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Meeting Waste Index
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            6.4<span className="text-sm text-slate-400">% (Low)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI detected minimal repeated circular discussions or unresolved stalling.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Commitment Reliability
          </div>
          <div className="text-3xl font-extrabold text-brand-300 font-mono">
            87<span className="text-sm text-slate-400">%</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Percentage of verbal promises delivered without deadline drift.
          </p>
        </div>
      </div>
    </div>
  );
};
