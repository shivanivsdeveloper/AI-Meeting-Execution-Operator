import React from 'react';
import { ArrowDown, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

interface FunnelStage {
  stage: string;
  count: number;
  conversion: string;
  dropRate?: string;
  color: string;
}

export const ExecutionFunnelChart: React.FC = () => {
  const stages: FunnelStage[] = [
    { stage: 'Meetings Held', count: 24, conversion: '100%', color: 'from-blue-600 to-indigo-600' },
    { stage: 'Decisions Extracted', count: 86, conversion: '94%', color: 'from-indigo-600 to-brand-600' },
    { stage: 'Action Items Created', count: 68, conversion: '79%', color: 'from-brand-600 to-purple-600' },
    { stage: 'Owners Assigned', count: 68, conversion: '100%', color: 'from-purple-600 to-pink-600' },
    { stage: 'Work Started', count: 54, conversion: '79%', color: 'from-pink-600 to-cyan-600' },
    { stage: 'Completed On-Time', count: 47, conversion: '87%', color: 'from-cyan-600 to-emerald-600' },
    { stage: 'AI Verified & Certified', count: 44, conversion: '94%', color: 'from-emerald-600 to-teal-500' }
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Signature Analytics: Execution Funnel
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Conversion velocity from Spoken Conversation $\to$ Verified Operational Outcome
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
          <Sparkles className="w-3.5 h-3.5" /> Overall Throughput: 84%
        </div>
      </div>

      {/* Vertical Cascading Funnel */}
      <div className="space-y-3">
        {stages.map((stg, idx) => {
          // Dynamic width calculation for funnel visual effect
          const widthPercentage = Math.max(35, 100 - idx * 9);

          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-36 sm:w-48 text-right flex-shrink-0">
                <span className="text-xs font-semibold text-slate-200 truncate block">
                  {stg.stage}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {stg.conversion} pass-through
                </span>
              </div>

              <div className="flex-1">
                <div
                  style={{ width: `${widthPercentage}%` }}
                  className={`h-9 rounded-xl bg-gradient-to-r ${stg.color} p-0.5 shadow-md flex items-center justify-between px-3 transition-all group hover:scale-101`}
                >
                  <span className="text-xs font-bold text-white font-mono">
                    {stg.count}
                  </span>
                  <span className="text-[10px] font-bold text-white/90">
                    Step {idx + 1}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="text-[10px] uppercase font-bold text-slate-400">Discussion $\to$ Decision</div>
          <div className="text-sm font-bold text-brand-400 mt-0.5">4.2 Hours</div>
        </div>
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="text-[10px] uppercase font-bold text-slate-400">Decision $\to$ Task</div>
          <div className="text-sm font-bold text-cyan-400 mt-0.5">1.5 Minutes (Auto)</div>
        </div>
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 col-span-2 sm:col-span-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Task $\to$ Verified</div>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">2.8 Days Avg</div>
        </div>
      </div>
    </div>
  );
};
