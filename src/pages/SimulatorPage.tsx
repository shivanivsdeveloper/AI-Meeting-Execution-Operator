import React, { useState, useEffect } from 'react';
import { 
  Flame, Sparkles, AlertTriangle, ArrowRight, 
  Users, Clock, ShieldAlert, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { api } from '../services/api';
import { WhatIfSimulationResult } from '../types';

export const SimulatorPage: React.FC = () => {
  const [selectedTaskId, setSelectedTaskId] = useState('tsk_01');
  const [delayDays, setDelayDays] = useState(3);
  const [simulation, setSimulation] = useState<WhatIfSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = async (taskId: string, days: number) => {
    setIsSimulating(true);
    try {
      const res = await api.runWhatIfSimulation(taskId, days);
      setSimulation(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    runSimulation(selectedTaskId, delayDays);
  }, [selectedTaskId, delayDays]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              What-If Scenario Delay Simulator
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Model cascading schedule delays in real-time across dependencies, milestones, and team members.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400" /> Predictive Critical Path Engine
        </div>
      </div>

      {/* Simulator Control Panel */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Select Target Task */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Select Upstream Bottleneck Task:
            </label>
            <select
              value={selectedTaskId}
              onChange={e => setSelectedTaskId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-dark-950 border border-white/15 text-xs text-slate-100 font-semibold focus:outline-none focus:border-brand-500"
            >
              <option value="tsk_01">Complete Payment API & Stripe v3 Integration (Priya)</option>
              <option value="tsk_02">Execute Automated E2E Regression & Load Test Suites (Arun)</option>
              <option value="tsk_03">Connect Frontend Checkout UI to Staging (Rahul)</option>
            </select>
          </div>

          {/* Delay Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Simulated Delay:
              </label>
              <span className="text-sm font-extrabold text-rose-400 font-mono">
                +{delayDays} Days
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              value={delayDays}
              onChange={e => setDelayDays(Number(e.target.value))}
              className="w-full accent-brand-500 h-2 bg-dark-950 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>+1 Day</span>
              <span>+3 Days (Default)</span>
              <span>+7 Days (Max Slip)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Impact Overview Cards */}
        {simulation && (
          <div className="pt-4 border-t border-white/10 space-y-6 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Milestone Impact */}
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 glow-rose">
                <div className="text-[10px] uppercase font-bold text-rose-300">
                  Predicted Milestone Delay
                </div>
                <div className="text-xl font-extrabold text-white mt-1">
                  +{simulation.predictedMilestoneDelay.delayDays} Days Slip
                </div>
                <div className="text-xs text-rose-200 mt-0.5">
                  Milestone: <strong>{simulation.predictedMilestoneDelay.milestoneName}</strong>
                </div>
              </div>

              {/* Affected Deliverables */}
              <div className="p-4 rounded-2xl bg-dark-850 border border-white/10">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Affected Downstream Tasks
                </div>
                <div className="text-xl font-extrabold text-brand-300 mt-1">
                  {simulation.affectedTasksCount} Tasks Blocked
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Cascading through critical path
                </div>
              </div>

              {/* Impacted Engineers */}
              <div className="p-4 rounded-2xl bg-dark-850 border border-white/10">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Affected Team Members
                </div>
                <div className="text-xl font-extrabold text-purple-300 mt-1">
                  {simulation.affectedTeamMembers.length} Engineers
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  QA, Frontend, & Product Leads
                </div>
              </div>
            </div>

            {/* Cascading Delay Chain */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Predicted Downstream Schedule Impact:
              </h4>

              <div className="space-y-2">
                {simulation.cascadingDelays.map((casc, i) => (
                  <div
                    key={casc.taskId}
                    className="p-3.5 rounded-xl bg-dark-850 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-rose-400 font-bold font-mono">#{i + 1}</span>
                      <span className="font-semibold text-slate-100">{casc.taskTitle}</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-400 line-through">{casc.originalDueDate}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-rose-300 font-bold">{casc.newDueDate} (+{casc.delayDays}d)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Mitigation Recommendation */}
            <div className="p-4 rounded-2xl bg-brand-950/40 border border-brand-500/30 text-xs space-y-2">
              <div className="text-xs font-bold text-brand-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>AI Recommended Mitigation Strategy:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Approve the automated workload rebalancing proposal to transfer <strong>E2E Regression Testing</strong> to Arun Kumar. This frees up 13 hours for Priya to complete the Payment API strictly by Friday 4 PM, averting the +2 day client demo slip.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
