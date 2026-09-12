import React from 'react';
import { LayoutDashboard, Mic, Bot, CheckSquare, MoreHorizontal } from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  openAIChat: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, openAIChat }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-dark-900/90 backdrop-blur-xl border-t border-white/10 px-4 flex items-center justify-around z-40">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center gap-1 ${
          activeTab === 'dashboard' ? 'text-brand-400' : 'text-slate-400'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px] font-medium">Home</span>
      </button>

      <button
        onClick={() => setActiveTab('meetings')}
        className={`flex flex-col items-center gap-1 ${
          activeTab === 'meetings' ? 'text-brand-400' : 'text-slate-400'
        }`}
      >
        <Mic className="w-5 h-5" />
        <span className="text-[10px] font-medium">Meetings</span>
      </button>

      <button
        onClick={openAIChat}
        className="flex flex-col items-center gap-1 text-brand-300 relative -top-3"
      >
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/40">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <span className="text-[10px] font-bold text-brand-300">AI</span>
      </button>

      <button
        onClick={() => setActiveTab('tasks')}
        className={`flex flex-col items-center gap-1 ${
          activeTab === 'tasks' ? 'text-brand-400' : 'text-slate-400'
        }`}
      >
        <CheckSquare className="w-5 h-5" />
        <span className="text-[10px] font-medium">Tasks</span>
      </button>

      <button
        onClick={() => setActiveTab('settings')}
        className={`flex flex-col items-center gap-1 ${
          activeTab === 'settings' ? 'text-brand-400' : 'text-slate-400'
        }`}
      >
        <MoreHorizontal className="w-5 h-5" />
        <span className="text-[10px] font-medium">More</span>
      </button>
    </nav>
  );
};
