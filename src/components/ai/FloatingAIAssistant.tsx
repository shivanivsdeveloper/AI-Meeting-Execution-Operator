import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, X, Minimize2, Maximize2, 
  ExternalLink, ChevronRight, HelpCircle, Flame, CheckCircle2 
} from 'lucide-react';
import { api } from '../../services/api';
import { NavTab } from '../layout/Sidebar';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  evidence?: string[];
  recommendations?: string[];
  actionButton?: {
    label: string;
    url: string;
  };
  timestamp: string;
}

interface FloatingAIAssistantProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setActiveTab: (tab: NavTab) => void;
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({
  isOpen,
  setIsOpen,
  setActiveTab
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: 'Good day! I am MeetFlow AI Operator. I monitor your workspace meetings, decisions, risks, and task execution continuously. How can I assist you?',
      recommendations: [
        'What should I focus on today?',
        'Why was Firebase selected for auth?',
        'What are the highest project risks?',
        'Prepare tomorrow\'s meeting agenda'
      ],
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await api.askAIOperator(query);
      const aiMsg: Message = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: res.answer,
        evidence: res.evidence,
        recommendations: res.recommendations,
        actionButton: res.actionButton,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'ai',
          text: 'I encountered an error querying workspace memory. Please verify backend connectivity.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-cyan text-white shadow-2xl shadow-brand-500/40 hover:scale-105 active:scale-95 transition-all group flex items-center gap-2.5"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="text-xs font-bold tracking-wide pr-1 hidden sm:inline">
          Ask MeetFlow
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[550px] rounded-3xl bg-dark-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="px-4 py-3.5 bg-dark-850 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-100">MeetFlow AI Operator</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Grounded Workspace Memory</span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Chat Flow */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-br-none shadow-md'
                  : 'bg-dark-800 text-slate-200 border border-white/5 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Evidence Section */}
              {msg.evidence && msg.evidence.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-400" /> Evidence Citations:
                  </div>
                  {msg.evidence.map((ev, idx) => (
                    <div key={idx} className="text-[10px] text-slate-400 font-mono bg-black/30 p-1.5 rounded">
                      • {ev}
                    </div>
                  ))}
                </div>
              )}

              {/* Action Button */}
              {msg.actionButton && (
                <button
                  onClick={() => handleActionClick(msg.actionButton!.url)}
                  className="mt-3 w-full py-1.5 px-2.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {msg.actionButton.label} <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Suggested Quick Prompts if any */}
            {msg.recommendations && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {msg.recommendations.map((rec, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(rec)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 border border-white/5 hover:border-brand-500/30 transition-all text-left"
                  >
                    {rec}
                  </button>
                ))}
              </div>
            )}

            <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-brand-400 animate-pulse p-2">
            <Bot className="w-4 h-4 animate-spin" />
            <span>Consulting cross-meeting memory & risk graphs...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-dark-850 border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask about decisions, risks, who owns what..."
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isLoading}
          className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
