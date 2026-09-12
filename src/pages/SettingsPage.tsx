import React, { useState, useEffect } from 'react';
import { 
  Settings, Bot, ShieldCheck, Lock, Users, 
  FileText, History, Check, Save, RefreshCw, Key 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { AuditLogItem } from '../types';

export const SettingsPage: React.FC = () => {
  const { user, workspace } = useAuth();
  const { showToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'ai' | 'rbac' | 'audit' | 'privacy'>('ai');
  const [autonomyLevel, setAutonomyLevel] = useState<string>(workspace?.settings.autonomyLevel || 'ask_before_executing');
  const [redactionEnabled, setRedactionEnabled] = useState(true);
  const [retentionDays, setRetentionDays] = useState(90);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const logs = await api.getAuditLogs();
        setAuditLogs(logs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAudit();
  }, []);

  const handleSaveSettings = () => {
    showToast('Workspace AI and security preferences saved!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Workspace Settings, AI Autonomy & Governance
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure agent autonomy levels, privacy retention, multi-provider AI keys, and inspect immutable audit logs.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 bg-dark-950 p-1.5 rounded-2xl border border-white/5 text-xs">
        {[
          { id: 'ai', label: 'AI Preferences & Autonomy' },
          { id: 'rbac', label: 'Workspace RBAC & Team' },
          { id: 'privacy', label: 'Privacy & Redaction' },
          { id: 'audit', label: `Immutable Audit Logs (${auditLogs.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              activeSubTab === tab.id
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 font-bold glow-brand'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SubTab: AI Preferences */}
      {activeSubTab === 'ai' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">AI Autonomy Level</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Control the boundary between autonomous AI actions and human review.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'suggest_only',
                title: 'Suggest Only',
                desc: 'AI extracts decisions and recommends actions without creating tasks or drafting emails.'
              },
              {
                id: 'ask_before_executing',
                title: 'Ask Before Executing (Default / Recommended)',
                desc: 'AI prepares tasks, drafts, and follow-ups into the Approval Queue for 1-click human confirmation.'
              },
              {
                id: 'execute_approved',
                title: 'Execute Approved Actions',
                desc: 'AI automatically updates task statuses and internal calendars; asks only for external communications.'
              },
              {
                id: 'fully_autonomous',
                title: 'Fully Autonomous Operator',
                desc: 'Continuous self-executing AI operator with automated escalations and post-meeting syncs.'
              }
            ].map(lvl => (
              <div
                key={lvl.id}
                onClick={() => setAutonomyLevel(lvl.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                  autonomyLevel === lvl.id
                    ? 'bg-brand-500/20 border-brand-500 text-white glow-brand'
                    : 'bg-dark-850 border-white/5 text-slate-300 hover:border-white/15'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white">{lvl.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{lvl.desc}</div>
                </div>
                {autonomyLevel === lvl.id && (
                  <Check className="w-5 h-5 text-brand-400 flex-shrink-0 ml-4" />
                )}
              </div>
            ))}
          </div>

          {/* Multi-Provider Key Input */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              AI Provider Configuration (Optional Direct Keys)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiApiKey}
                  onChange={e => setGeminiApiKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  placeholder="sk-proj-..."
                  value={openaiApiKey}
                  onChange={e => setOpenaiApiKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              MeetFlow AI operates seamlessly with our zero-config built-in multi-agent engine out of the box.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-500/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save AI Preferences</span>
            </button>
          </div>
        </div>
      )}

      {/* SubTab: RBAC */}
      {activeSubTab === 'rbac' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Workspace Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                5 active workspace members with granular permission levels.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 font-bold">
              Owner: Shivani Narayanan
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {[
              { name: 'Shivani Narayanan', email: 'shivani@meetflow.ai', role: 'Owner', access: 'Full Workspace Admin & Billing' },
              { name: 'Sarah Chen', email: 'sarah.c@aurapay.io', role: 'Manager', access: 'Meeting Creation & Client Communications' },
              { name: 'Priya Sharma', email: 'priya.s@aurapay.io', role: 'Member', access: 'Task Execution & PR Linking' },
              { name: 'Rahul Verma', email: 'rahul.v@aurapay.io', role: 'Member', access: 'Task Execution & UI Staging' },
              { name: 'Arun Kumar', email: 'arun.k@aurapay.io', role: 'Member', access: 'QA Suite Runs & Test Certification' }
            ].map((mem, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-100">{mem.name}</div>
                  <div className="text-[11px] text-slate-400">{mem.email} · {mem.access}</div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-dark-950 border border-white/10 text-brand-300 font-semibold">
                  {mem.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab: Privacy */}
      {activeSubTab === 'privacy' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Privacy & Retention Policy</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure data retention and automated sensitive PII redaction.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-dark-850 border border-white/5">
              <div>
                <div className="text-xs font-bold text-white">Automated PII & Secret Redaction</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Mask credit card numbers, API keys, and passwords before AI analysis.
                </div>
              </div>
              <input
                type="checkbox"
                checked={redactionEnabled}
                onChange={e => setRedactionEnabled(e.target.checked)}
                className="w-5 h-5 accent-brand-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-dark-850 border border-white/5 space-y-2">
              <div className="text-xs font-bold text-white">Audio Recording Retention Window</div>
              <div className="text-[11px] text-slate-400">
                Automatically purge raw voice recordings after transcript processing.
              </div>
              <select
                value={retentionDays}
                onChange={e => setRetentionDays(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl bg-dark-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-brand-500 mt-2"
              >
                <option value={30}>30 Days Retention</option>
                <option value={90}>90 Days Retention (Recommended)</option>
                <option value={365}>1 Year Retention</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SubTab: Immutable Audit Logs */}
      {activeSubTab === 'audit' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Immutable Workspace Audit Log</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every human and autonomous AI action is recorded with timestamps and verification states.
              </p>
            </div>
            <span className="text-[11px] font-mono text-brand-300">
              SOC2 Compliant Ledger
            </span>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-2">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-dark-850 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      log.actor.isAi ? 'bg-brand-500/20 text-brand-300' : 'bg-white/10 text-slate-300'
                    }`}>
                      {log.actor.name} {log.actor.agentName ? `(${log.actor.agentName})` : ''}
                    </span>
                    <span className="font-bold text-slate-200">{log.action}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{log.details}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 block">{log.timestamp}</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">{log.approvalStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
