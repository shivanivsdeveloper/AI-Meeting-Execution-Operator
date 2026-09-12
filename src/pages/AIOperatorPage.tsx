import React, { useState } from 'react';
import { 
  Bot, Send, Sparkles, CheckSquare, AlertTriangle, 
  HelpCircle, Brain, ArrowRight, ExternalLink, Clock, ShieldCheck, Flame 
} from 'lucide-react';
import { api } from '../services/api';
import { NavTab } from '../components/layout/Sidebar';

interface AIOperatorPageProps {
  setActiveTab: (tab: NavTab) => void;
}

export const AIOperatorPage: React.FC<AIOperatorPageProps> = ({ setActiveTab }) => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<any[]>([
    {
      role: 'assistant',
      text: 'Good day, Shivani. I am your autonomous AI Meeting Execution Operator. I actively track 24 meetings, 86 decisions, 42 action items, and 2 critical project risks across AuraPay Platform. What would you like to operate today?',
      evidence: [
        'Sprint 24 Planning: Payment API deadline confirmed for Friday 4 PM',
        'Architecture Review: Firebase Auth and PostgreSQL ledgers locked',
        'Workload Monitor: Priya (87%), Arun (41%)'
      ],
      recommendations: [
        'What should I focus on today?',
        'Why was Firebase selected for auth?',
        'What is blocking the enterprise client demo?',
        'Prepare agenda for tomorrow\'s meeting',
        'Show unresolved decisions across meetings'
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (qText?: string) => {
    const q = qText || query;
    if (!q.trim()) return;

    setConversation(prev => [...prev, { role: 'user', text: q }]);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await api.askAIOperator(q);
      setConversation(prev => [
        ...prev,
        {
          role: 'assistant',
          text: res.answer,
          evidence: res.evidence,
          recommendations: res.recommendations,
          actionButton: res.actionButton
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (url: string) => {
    if (url === '/tasks') setActiveTab('tasks');
    else if (url === '/decisions') setActiveTab('decisions');
    else if (url === '/simulator') setActiveTab('simulator');
    else if (url === '/approvals') setActiveTab('approvals');
    else if (url === '/meetings') setActiveTab('meetings');
    else if (url === '/dashboard') setActiveTab('dashboard');
  };

  const quickCommands = [
    { label: 'What should I focus on today?', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Why was Firebase selected?', icon: <Brain className="w-3.5 h-3.5" /> },
    { label: 'What is blocking the project?', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { label: 'Prepare tomorrow\'s meeting', icon: <Clock className="w-3.5 h-3.5" /> },
    { label: 'Show unresolved decisions', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { label: 'What if API is delayed by 3 days?', icon: <Flame className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              AI Operator Command Center
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Autonomous multi-agent execution brain grounded in full cross-meeting memory.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Multi-Agent Orchestrator Online
        </div>
      </div>

      {/* Quick Prompt Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {quickCommands.map((cmd, i) => (
          <button
            key={i}
            onClick={() => handleSend(cmd.label)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 border border-white/5 hover:border-brand-500/30 text-xs font-semibold whitespace-nowrap transition-all shadow-sm"
          >
            {cmd.icon}
            <span>{cmd.label}</span>
          </button>
        ))}
      </div>

      {/* Main Conversation Stream */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 min-h-[480px] flex flex-col justify-between space-y-6">
        <div className="space-y-6 overflow-y-auto max-h-[500px] pr-2">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] p-5 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-br-none shadow-xl'
                    : 'bg-dark-900 text-slate-200 border border-white/10 rounded-bl-none shadow-xl'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Evidence Section */}
                {msg.evidence && msg.evidence.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-white/10 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Evidence Citations from Workspace Memory:
                    </div>
                    {msg.evidence.map((ev: string, i: number) => (
                      <div key={i} className="text-xs text-slate-400 font-mono bg-black/40 p-2 rounded-xl border border-white/5">
                        • {ev}
                      </div>
                    ))}
                  </div>
                )}

                {/* Grounded Action Button */}
                {msg.actionButton && (
                  <button
                    onClick={() => handleActionClick(msg.actionButton.url)}
                    className="mt-4 px-4 py-2 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-200 border border-brand-500/40 text-xs font-bold flex items-center gap-2 transition-colors"
                  >
                    <span>{msg.actionButton.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-brand-400 animate-pulse p-3 bg-dark-900 rounded-2xl border border-brand-500/20 w-max">
              <Bot className="w-4 h-4 animate-spin" />
              <span>Consulting cross-meeting memory, decision DAGs, and risk models...</span>
            </div>
          )}
        </div>

        {/* Query Input Box */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type any instruction (e.g. 'Draft client update email', 'Who should own API testing?')..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-dark-950 border border-white/15 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || isLoading}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          >
            <span>Execute</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
