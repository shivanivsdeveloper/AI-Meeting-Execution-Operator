import React, { useState, useEffect } from 'react';
import { Plug, CheckCircle2, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { IntegrationStatus } from '../types';

export const IntegrationsPage: React.FC = () => {
  const { showToast } = useToast();
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    try {
      const data = await api.getIntegrations();
      setIntegrations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      const updated = await api.toggleIntegration(id);
      setIntegrations(prev => prev.map(i => (i.id === id ? updated : i)));
      showToast(
        updated.connected ? `${updated.name} connected successfully!` : `${updated.name} disconnected.`,
        'success'
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSync = async (id: string) => {
    setIsSyncing(id);
    try {
      await api.syncIntegration(id);
      showToast('Synced latest workspace events!', 'ai', 'Integration Sync');
      await fetchIntegrations();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Plug className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Integrations & Autonomous Connectors
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronize tasks to GitHub and Jira, notify Slack, and stream calendar invites automatically.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(item => (
          <div
            key={item.id}
            className={`glass-card rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
              item.connected ? 'border-brand-500/30' : 'border-white/5 opacity-80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-white">{item.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  item.connected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-400'
                }`}>
                  {item.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              {item.accountEmail && (
                <div className="text-xs text-slate-300 font-mono">
                  Account: {item.accountEmail}
                </div>
              )}

              {item.lastSynced && (
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Last synced: {item.lastSynced}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
              <button
                onClick={() => handleToggle(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  item.connected
                    ? 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                    : 'bg-brand-600 text-white hover:bg-brand-500 shadow-md shadow-brand-500/30'
                }`}
              >
                {item.connected ? 'Disconnect' : 'Connect'}
              </button>

              {item.connected && (
                <button
                  onClick={() => handleSync(item.id)}
                  disabled={isSyncing === item.id}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing === item.id ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
