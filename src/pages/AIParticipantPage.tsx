import React from 'react';
import { AIParticipantStudio } from '../components/meetings/AIParticipantStudio';
import { Bot, Sparkles, ShieldCheck, ArrowRight, Mic, Volume2 } from 'lucide-react';
import { NavTab } from '../components/layout/Sidebar';

interface AIParticipantPageProps {
  setActiveTab: (tab: NavTab) => void;
}

export const AIParticipantPage: React.FC<AIParticipantPageProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4 animate-pulse" />
            Active Virtual Team Member
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            AI Meeting Participant Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time speech-to-text, context-aware question answering, proactive blocker detection, and automated task commitment creation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('model-training')}
            className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Inspect Trained AI Model</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Studio Component */}
      <AIParticipantStudio
        onFinish={() => setActiveTab('dashboard')}
      />
    </div>
  );
};
