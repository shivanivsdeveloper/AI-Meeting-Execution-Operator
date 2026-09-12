import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, Play, CheckCircle2, AlertTriangle, 
  ShieldCheck, Bot, Brain, Users, Zap, Lock, Globe2, ChevronRight, Layers 
} from 'lucide-react';
import { ExecutionOrbit } from '../components/visualizations/ExecutionOrbit';
import { DecisionExecutionTimeline } from '../components/visualizations/DecisionExecutionTimeline';

interface LandingPageProps {
  onStartFree: () => void;
  onLaunchDemo: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFree,
  onLaunchDemo,
  onLogin
}) => {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-brand-500 selection:text-white overflow-x-hidden">
      {/* Navigation Header */}
      <header className="h-20 border-b border-white/5 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-dark-950/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-cyan p-0.5 shadow-lg shadow-brand-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                MeetFlow AI
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                OPERATOR
              </span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <a href="#features" className="hover:text-slate-100 transition-colors">Meeting Intelligence</a>
          <a href="#execution" className="hover:text-slate-100 transition-colors">Autonomous Execution</a>
          <a href="#memory" className="hover:text-slate-100 transition-colors">Organizational Memory</a>
          <a href="#security" className="hover:text-slate-100 transition-colors">Enterprise Security</a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onLaunchDemo}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-brand-300 border border-brand-500/30 text-xs font-bold transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Demo</span>
          </button>
          <button
            onClick={onStartFree}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/30 transition-all"
          >
            Start Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/15 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Hero Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold mb-6 animate-slide-up">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>From conversations to execution. Automatically.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
          Meetings shouldn't end <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-accent-cyan bg-clip-text text-transparent">
            when the meeting ends.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
          MeetFlow AI turns conversations into decisions, decisions into structured execution, and execution into measurable outcomes. With predictive risk modeling, autonomous follow-ups, and cross-meeting memory.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onStartFree}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-2xl shadow-brand-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <span>Start Free with AuraPay Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onLaunchDemo}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current text-brand-400" />
            <span>Watch 1-Click Interactive Demo</span>
          </button>
        </div>

        {/* Floating Insight Cards Simulation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto mb-16">
          <div className="p-4 rounded-2xl bg-dark-850/90 border border-emerald-500/30 shadow-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Decision Detected
              </span>
              <span className="text-[10px] font-mono text-slate-400">97% Conf.</span>
            </div>
            <p className="text-xs font-semibold text-slate-100 pt-1">
              Payment API must be completed and deployed by Friday 4 PM.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-850/90 border border-rose-500/30 shadow-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Risk Predicted
              </span>
              <span className="text-[10px] font-mono text-rose-300">82% Delay Risk</span>
            </div>
            <p className="text-xs font-semibold text-slate-100 pt-1">
              QA testing dependency may delay Monday enterprise client demo.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-850/90 border border-brand-500/30 shadow-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Task Auto-Assigned
              </span>
              <span className="text-[10px] font-mono text-slate-400">Due Friday</span>
            </div>
            <p className="text-xs font-semibold text-slate-100 pt-1">
              Owner: Priya Sharma (91% on-time completion record).
            </p>
          </div>
        </div>

        {/* Live Visualizations Showcase */}
        <div id="execution" className="space-y-12">
          <ExecutionOrbit onSelectNode={onLaunchDemo} />
          <DecisionExecutionTimeline />
        </div>
      </section>

      {/* Feature Showcase Matrix */}
      <section id="features" className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Built for High-Velocity Product & Engineering Teams
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Other tools record transcripts. MeetFlow AI operates what happens next, assigns ownership, models risks, and verifies outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Multi-Agent AI Operator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Specialized agents for Decisions, Tasks, Risks, and Verification. Proactively alerts on blockers before deadlines fail.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Cross-Meeting Organizational Memory</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never repeat discussions. MeetFlow AI remembers why architectural decisions were made with timestamped citations.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Autonomous Verification Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Validates completion through integrated GitHub PRs, test suites, and Jira tickets. Zero manual status updating.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">What-If Scenario Simulator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulate cascading delays in real-time. Predict the exact impact on client demos and team members when upstream tasks slip.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Multilingual & Multimodal Vision</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Handles mixed Hindi/Tamil code-switched speech and converts uploaded whiteboard architecture photos into structured deliverables.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Human Approval & Safety Controls</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-impact actions require one-click human signoff. Complete audit trails ensure complete governance and SOC2 compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="font-bold text-slate-200">MeetFlow AI</span> — The AI Meeting Execution Operator
          </div>
          <div className="font-mono text-[11px]">
            Meet. Decide. Execute. Verify.
          </div>
        </div>
      </footer>
    </div>
  );
};
