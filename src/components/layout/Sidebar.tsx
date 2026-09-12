import React, { useState } from 'react';
import { 
  LayoutDashboard, Mic, Bot, CheckSquare, Sparkles, 
  FolderKanban, AlertTriangle, HelpCircle, Brain, 
  Users, BarChart3, Plug, Bell, Settings, ChevronLeft, 
  ChevronRight, ArrowRight, ShieldCheck, Flame
} from 'lucide-react';
import { useMeeting } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';

export type NavTab = 
  | 'dashboard' 
  | 'meetings' 
  | 'ai-operator' 
  | 'tasks' 
  | 'decisions' 
  | 'projects' 
  | 'risks' 
  | 'questions' 
  | 'simulator'
  | 'knowledge' 
  | 'team' 
  | 'analytics' 
  | 'integrations' 
  | 'approvals' 
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed
}) => {
  const { approvals, questions, risks, tasks } = useMeeting();
  const { user, workspace } = useAuth();

  const pendingApprovalsCount = approvals.filter(a => a.status === 'Awaiting Approval').length;
  const unresolvedQuestionsCount = questions.filter(q => q.status === 'Unresolved').length;
  const highRisksCount = risks.filter(r => r.level === 'High' || r.level === 'Critical').length;
  const inProgressTasksCount = tasks.filter(t => t.status === 'In Progress').length;

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string; group?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, group: 'Core' },
    { id: 'meetings', label: 'Meetings', icon: <Mic className="w-5 h-5" />, group: 'Core' },
    { id: 'ai-operator', label: 'AI Operator', icon: <Bot className="w-5 h-5" />, badge: 1, badgeColor: 'bg-brand-500 text-white animate-pulse', group: 'Core' },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" />, badge: inProgressTasksCount, group: 'Execution' },
    { id: 'decisions', label: 'Decisions', icon: <Sparkles className="w-5 h-5" />, group: 'Execution' },
    { id: 'approvals', label: 'Approvals Queue', icon: <ShieldCheck className="w-5 h-5" />, badge: pendingApprovalsCount, badgeColor: 'bg-amber-500 text-black', group: 'Execution' },
    { id: 'simulator', label: 'Scenario Simulator', icon: <Flame className="w-5 h-5" />, group: 'Execution' },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-5 h-5" />, group: 'Operations' },
    { id: 'risks', label: 'Risks', icon: <AlertTriangle className="w-5 h-5" />, badge: highRisksCount, badgeColor: 'bg-rose-500 text-white', group: 'Operations' },
    { id: 'questions', label: 'Questions', icon: <HelpCircle className="w-5 h-5" />, badge: unresolvedQuestionsCount, badgeColor: 'bg-amber-500/80 text-black', group: 'Operations' },
    { id: 'knowledge', label: 'Knowledge Graph', icon: <Brain className="w-5 h-5" />, group: 'Intelligence' },
    { id: 'team', label: 'Team Workload', icon: <Users className="w-5 h-5" />, group: 'Intelligence' },
    { id: 'analytics', label: 'Analytics & Funnel', icon: <BarChart3 className="w-5 h-5" />, group: 'Intelligence' },
    { id: 'integrations', label: 'Integrations', icon: <Plug className="w-5 h-5" />, group: 'System' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, group: 'System' },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-dark-900 border-r border-white/5 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      } h-screen sticky top-0`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-cyan p-0.5 shadow-lg shadow-brand-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  MeetFlow
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wide truncate max-w-[130px]">
                Execution Operator
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item, index) => {
          const isActive = activeTab === item.id;
          const showGroupLabel = !collapsed && item.group && (index === 0 || navItems[index - 1].group !== item.group);

          return (
            <React.Fragment key={item.id}>
              {showGroupLabel && (
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pt-3 pb-1">
                  {item.group}
                </div>
              )}
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-300 border border-brand-500/30 shadow-sm shadow-brand-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className={`flex-shrink-0 transition-colors ${isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {item.icon}
                </div>
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-white/10 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-400"></span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Autonomy Level Pill & User Info */}
      <div className="p-3 border-t border-white/5 bg-dark-950/40 space-y-3">
        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-brand-950/40 border border-brand-500/20 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-brand-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-brand-400" />
                Autopilot Mode
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Ask before executing high-impact actions.
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 px-2 py-1.5">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
            alt="User Avatar"
            className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10 flex-shrink-0"
          />
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-200 truncate">
                {user?.name || "Shivani Narayanan"}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {workspace?.name || "Shivani's Workspace"}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
