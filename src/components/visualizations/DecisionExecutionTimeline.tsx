import React from 'react';
import { 
  Sparkles, CheckSquare, UserCheck, Play, 
  AlertTriangle, CheckCircle2, ShieldCheck, ArrowDown, ExternalLink 
} from 'lucide-react';

interface TimelineStep {
  time: string;
  stage: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
  badgeColor?: string;
  evidenceQuote?: string;
  speaker?: string;
}

export const DecisionExecutionTimeline: React.FC = () => {
  const steps: TimelineStep[] = [
    {
      time: '10:02 AM',
      stage: 'Conversation & Discussion',
      title: 'Enterprise Client Demo Target Set',
      description: 'Sarah Chen outlines strategic requirement for Monday client demonstration and asks for API readiness.',
      icon: <Sparkles className="w-4 h-4 text-blue-300" />,
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      evidenceQuote: 'Today we need to lock down the critical milestones for our enterprise client demo on Monday.',
      speaker: 'Sarah Chen'
    },
    {
      time: '10:09 AM',
      stage: 'Decision Locked',
      title: 'Payment API Staging Deadline Locked for Friday 4 PM',
      description: 'Shivani Narayanan formally confirms delivery cutoff to protect downstream QA testing window.',
      icon: <Sparkles className="w-4 h-4 text-indigo-300" />,
      color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      badge: '97% Confidence',
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
      evidenceQuote: 'It is decided: Payment API must be completed and deployed to staging by Friday 4 PM.',
      speaker: 'Shivani Narayanan'
    },
    {
      time: '10:15 AM',
      stage: 'Action Item Extracted',
      title: 'Complete Payment API & Stripe v3 Webhook Integration',
      description: 'MeetFlow AI TaskAgent automatically converts verbal decision into structured task with priority Critical.',
      icon: <CheckSquare className="w-4 h-4 text-brand-300" />,
      color: 'bg-brand-500/20 text-brand-300 border-brand-500/40',
      badge: 'Autonomous AI'
    },
    {
      time: '10:16 AM',
      stage: 'Intelligent Assignment',
      title: 'Assigned to Priya Sharma (Lead Backend Lead)',
      description: 'AI matched skills: Stripe v3 specialization, 91% on-time record, explicit speaker commitment.',
      icon: <UserCheck className="w-4 h-4 text-purple-300" />,
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      badge: 'Match Rationale: 96%'
    },
    {
      time: '11:00 AM',
      stage: 'Work Initiated',
      title: 'Branch feature/payment-api-v3 Created',
      description: 'GitHub integration synced branch creation and initial webhook signature verification commits.',
      icon: <Play className="w-4 h-4 text-cyan-300" />,
      color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      badge: 'In Progress'
    },
    {
      time: 'Next Day (09:30 AM)',
      stage: 'Risk Predicted',
      title: '82% High Delay Risk Alert Generated',
      description: 'RiskAgent detected QA testing dependency is dangerously tight if staging deployment slips into weekend.',
      icon: <AlertTriangle className="w-4 h-4 text-rose-300" />,
      color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      badge: 'Alert: 82% Risk',
      badgeColor: 'bg-rose-500/30 text-rose-300'
    },
    {
      time: 'Friday 03:45 PM',
      stage: 'Completed',
      title: 'Stripe v3 API Endpoints Deployed to Staging',
      description: 'PR #148 merged with 100% unit test coverage and clean webhook idempotency checks.',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-300" />,
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      badge: 'Completed On-Time'
    },
    {
      time: 'Friday 04:00 PM',
      stage: 'Autonomous Verification',
      title: 'AI Verification Engine Certified Staging Health',
      description: 'Automated Playwright test suite executed with 250/250 passing assertions. Zero human overhead.',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      color: 'bg-emerald-950/80 text-emerald-200 border-emerald-500 glow-emerald',
      badge: 'Verified & Certified',
      badgeColor: 'bg-emerald-500 text-black font-bold'
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Signature Visual: Decision $\to$ Execution Timeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Full end-to-end audit trail from spoken conversation to autonomous AI verification
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300">
          Trace ID: #aurapay-sprint24-e2e
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:top-3 before:bottom-3 before:left-3 sm:before:left-4 before:w-0.5 before:bg-gradient-to-b before:from-brand-500 before:via-indigo-500 before:to-emerald-500">
        {steps.map((step, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline dot icon */}
            <div className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full ${step.color} border flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
              {step.icon}
            </div>

            <div className="p-4 rounded-xl bg-dark-850/70 border border-white/5 hover:border-white/15 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/5 text-slate-300">
                    {step.time}
                  </span>
                  <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">
                    {step.stage}
                  </span>
                </div>
                {step.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${step.badgeColor || 'bg-white/10 text-slate-300'}`}>
                    {step.badge}
                  </span>
                )}
              </div>

              <h4 className="text-sm font-semibold text-slate-100 mt-1">
                {step.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {step.description}
              </p>

              {step.evidenceQuote && (
                <div className="mt-2.5 p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-300 font-mono flex items-start gap-2">
                  <span className="text-brand-400 font-bold">“</span>
                  <div className="flex-1">
                    <span>{step.evidenceQuote}</span>
                    {step.speaker && (
                      <span className="text-slate-400 block mt-0.5 text-[10px] font-sans">
                        — {step.speaker} (Sprint 24 Transcript)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
