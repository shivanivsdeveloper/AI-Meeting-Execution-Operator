import React from 'react';
import { 
  Sparkles, CheckSquare, AlertTriangle, TrendingUp, 
  ShieldCheck, Mic, ArrowRight, Play, CheckCircle2, Clock, Users, Flame, Bot 
} from 'lucide-react';
import { useMeeting } from '../context/MeetingContext';
import { AIExecutiveBrief } from '../components/ai/AIExecutiveBrief';
import { AttentionCenter } from '../components/dashboard/AttentionCenter';
import { ExecutionOrbit } from '../components/visualizations/ExecutionOrbit';
import { DecisionExecutionTimeline } from '../components/visualizations/DecisionExecutionTimeline';
import { NavTab } from '../components/layout/Sidebar';

interface DashboardPageProps {
  setActiveTab: (tab: NavTab) => void;
  openAIChat: () => void;
  openLiveMeeting: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setActiveTab,
  openAIChat,
  openLiveMeeting
}) => {
  const { meetings, decisions, tasks, risks } = useMeeting();

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const highRisks = risks.filter(r => r.level === 'High' || r.level === 'Critical').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top AI Executive Brief */}
      <AIExecutiveBrief
        onAskAI={openAIChat}
        setActiveTab={setActiveTab}
      />

      {/* Primary KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Execution Health */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Execution Health</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              84<span className="text-sm text-slate-400">/100</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +6% from last sprint
            </div>
          </div>
        </div>

        {/* Metric 2: Meeting Effectiveness */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Meeting Effectiveness</span>
            <span className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              91<span className="text-sm text-slate-400">%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Low conversational waste
            </div>
          </div>
        </div>

        {/* Metric 3: Active Action Items */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Tasks</span>
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <CheckSquare className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {tasks.length} <span className="text-xs text-slate-400">({completedTasks} verified)</span>
            </div>
            <div className="text-[11px] text-purple-300 mt-1">
              {inProgressTasks} In Progress · 1 Blocked
            </div>
          </div>
        </div>

        {/* Metric 4: Predicted Project Risk */}
        <div className="glass-card rounded-2xl p-4 border border-rose-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Project Risk Telemetry</span>
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
              82<span className="text-sm text-rose-300">%</span>
            </div>
            <div className="text-[11px] text-rose-300 mt-1">
              {highRisks} Critical Blocker Flagged
            </div>
          </div>
        </div>
      </div>

      {/* Attention Center Component */}
      <AttentionCenter setActiveTab={setActiveTab} />

      {/* Signature Visualization: Execution Orbit */}
      <ExecutionOrbit
        onSelectNode={(nodeType) => {
          if (nodeType === 'decisions') setActiveTab('decisions');
          else if (nodeType === 'tasks') setActiveTab('tasks');
          else if (nodeType === 'risks') setActiveTab('risks');
          else if (nodeType === 'meeting') setActiveTab('meetings');
        }}
      />

      {/* Two Column Grid: Active Deliverables & Signature Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Decision-to-Execution Timeline */}
        <DecisionExecutionTimeline />

        {/* Right: Recent Meetings & Active Sprints */}
        <div className="space-y-6">
          {/* Quick Launch: Interactive AI Meeting Participant */}
          <div className="glass-card rounded-2xl p-6 border border-brand-500/40 bg-gradient-to-r from-brand-950/60 via-dark-850 to-indigo-950/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glow-brand shadow-xl relative overflow-hidden">
            <div className="space-y-1.5 relative z-10">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-extrabold text-brand-300 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/30">
                  <Bot className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
                  New AI Feature
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  Voice & Direct Interaction Ready
                </span>
              </div>
              <h4 className="text-base font-extrabold text-white tracking-tight">
                AI Meeting Participant Studio
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                Deploy the AI as an active team member with live speech synthesis, context-aware Q&A, conflict checking, and instant task execution.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('ai-participant')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-cyan hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-xl shadow-brand-500/30 flex items-center gap-2 flex-shrink-0 transition-all group relative z-10 hover:scale-[1.02]"
            >
              <Mic className="w-4 h-4 text-brand-200 group-hover:scale-110 transition-transform" />
              <span>Launch AI Participant</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Quick Launch Live Studio */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 bg-dark-850/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-300 uppercase tracking-wider mb-1">
                <Mic className="w-4 h-4 text-brand-400" />
                Live Meeting Studio
              </div>
              <h4 className="text-base font-bold text-white">
                Start Live Diarized Meeting Recording
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Speaker diarization, real-time decision capture, and conflict detection.
              </p>
            </div>

            <button
              onClick={openLiveMeeting}
              className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 border border-white/10 text-xs font-bold shadow-md flex items-center gap-2 flex-shrink-0 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Record Meeting</span>
            </button>
          </div>

          {/* Recent Meetings Card */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Recent Meetings & Digital Twins
              </h3>
              <button
                onClick={() => setActiveTab('meetings')}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
              >
                View All ({meetings.length}) $\to$
              </button>
            </div>

            <div className="space-y-3">
              {meetings.map(m => (
                <div
                  key={m.id}
                  onClick={() => setActiveTab('meetings')}
                  className="p-3.5 rounded-xl bg-dark-850/80 hover:bg-dark-800 border border-white/5 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                      <span>{m.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-brand-300">
                        {m.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>{m.duration}</span>
                      <span>·</span>
                      <span>{m.participants.length} Participants</span>
                      <span>·</span>
                      <span className="text-emerald-400 font-semibold">{m.metrics?.effectivenessScore || 91}% Effectiveness</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
