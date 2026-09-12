import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bot, Bell, Moon, Sun, ChevronDown, 
  Sparkles, Check, Play, RefreshCw, LogOut, User as UserIcon, 
  ShieldAlert, ExternalLink, X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMeeting } from '../../context/MeetingContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { NavTab } from './Sidebar';

interface TopbarProps {
  setActiveTab: (tab: NavTab) => void;
  openAIChat: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  startInteractiveDemo: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  setActiveTab,
  openAIChat,
  isDarkMode,
  setIsDarkMode,
  startInteractiveDemo
}) => {
  const { user, workspace, logout } = useAuth();
  const { notifications, resetToDemo } = useMeeting();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const res = await api.searchGlobal(q);
      setSearchResults(res.results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResetDemo = async () => {
    setShowProfileMenu(false);
    showToast('Resetting workspace to AuraPay Platform pristine state...', 'ai', 'Workspace Reset');
    await resetToDemo();
    showToast('Workspace refreshed successfully!', 'success');
  };

  return (
    <>
      <header className="h-16 bg-dark-900/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
        {/* Left: Workspace Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
              A
            </div>
            <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px] md:max-w-[180px]">
              {workspace?.name || "Shivani's Workspace"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            AuraPay v2.0 Platform Live
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <div
            onClick={() => setShowSearchModal(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-brand-500/40 hover:bg-white/[0.06] transition-all cursor-pointer group text-slate-400"
          >
            <div className="flex items-center gap-2.5 text-xs">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-400 transition-colors" />
              <span>Search meetings, decisions, tasks, or people...</span>
            </div>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Interactive Demo Action Button */}
          <button
            onClick={startInteractiveDemo}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Demo</span>
          </button>

          {/* Ask MeetFlow AI Quick Trigger */}
          <button
            onClick={openAIChat}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold transition-all group"
          >
            <Bot className="w-4 h-4 text-brand-400 group-hover:animate-bounce" />
            <span className="hidden md:inline">Ask MeetFlow</span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-dark-900 animate-pulse"></span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-dark-850/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-4 z-50 animate-slide-up">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-brand-400" />
                    <span className="text-sm font-bold text-slate-100">Notifications</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300">
                      {notifications.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-white/5 max-h-80 overflow-y-auto mt-2 -mx-2 px-2">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className="py-3 hover:bg-white/[0.03] transition-colors rounded-lg px-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-200">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      {notif.actionUrl && (
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            if (notif.actionUrl === '/tasks') setActiveTab('tasks');
                            else if (notif.actionUrl === '/approvals') setActiveTab('approvals');
                            else if (notif.actionUrl === '/decisions') setActiveTab('decisions');
                            else if (notif.actionUrl === '/meetings') setActiveTab('meetings');
                          }}
                          className="mt-2 text-[11px] font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                        >
                          {notif.smartAction?.label || 'Take Action'} <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors"
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt="Avatar"
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-brand-500/50"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-dark-850/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-3 z-50 animate-slide-up">
                <div className="px-3 py-2 border-b border-white/10">
                  <div className="text-xs font-bold text-slate-100">{user?.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                  <div className="mt-1 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                    Role: {user?.role || 'VP of Engineering'}
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveTab('settings');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 text-left"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    Workspace Settings & RBAC
                  </button>

                  <button
                    onClick={handleResetDemo}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-amber-300 hover:bg-amber-500/10 text-left"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-400" />
                    Reset to Pristine Demo
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Omnisearch Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-dark-900 border border-white/15 shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
              <Search className="w-5 h-5 text-brand-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search anything (e.g. Firebase, Payment API, Priya, Monday demo)..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {!searchResults && !isSearching && (
                <div className="text-center py-8 text-xs text-slate-400">
                  Type any keyword or natural language query to search cross-meeting memory.
                </div>
              )}

              {isSearching && (
                <div className="text-center py-8 text-xs text-brand-400 animate-pulse">
                  Searching workspace memory...
                </div>
              )}

              {searchResults && (
                <div className="space-y-4">
                  {searchResults.decisions?.length > 0 && (
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                        Decisions ({searchResults.decisions.length})
                      </div>
                      <div className="space-y-2">
                        {searchResults.decisions.map((d: any) => (
                          <div
                            key={d.id}
                            onClick={() => {
                              setShowSearchModal(false);
                              setActiveTab('decisions');
                            }}
                            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors"
                          >
                            <div className="text-xs font-semibold text-slate-200">{d.title}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{d.reason}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.tasks?.length > 0 && (
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                        Tasks ({searchResults.tasks.length})
                      </div>
                      <div className="space-y-2">
                        {searchResults.tasks.map((t: any) => (
                          <div
                            key={t.id}
                            onClick={() => {
                              setShowSearchModal(false);
                              setActiveTab('tasks');
                            }}
                            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors flex items-center justify-between"
                          >
                            <div>
                              <div className="text-xs font-semibold text-slate-200">{t.title}</div>
                              <div className="text-[11px] text-slate-400">Owner: {t.owner?.name} · Priority: {t.priority}</div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                              {t.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.meetings?.length > 0 && (
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                        Meetings ({searchResults.meetings.length})
                      </div>
                      <div className="space-y-2">
                        {searchResults.meetings.map((m: any) => (
                          <div
                            key={m.id}
                            onClick={() => {
                              setShowSearchModal(false);
                              setActiveTab('meetings');
                            }}
                            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors"
                          >
                            <div className="text-xs font-semibold text-slate-200">{m.title}</div>
                            <div className="text-[11px] text-slate-400">{m.date} · {m.duration}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
