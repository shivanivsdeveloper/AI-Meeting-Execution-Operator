import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, AlertTriangle, Clock, 
  ArrowRight, ShieldAlert, History, Filter, Search, Check, X 
} from 'lucide-react';
import { useMeeting } from '../context/MeetingContext';
import { useToast } from '../context/ToastContext';
import { Decision } from '../types';

export const DecisionsPage: React.FC = () => {
  const { decisions, updateDecisionStatus, resolveConflict } = useMeeting();
  const { showToast } = useToast();

  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(decisions[0] || null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictResolutionChoice, setConflictResolutionChoice] = useState('Monday Sept 21 (Confirmed)');

  const handleResolveConflict = async () => {
    if (!selectedDecision) return;
    try {
      await resolveConflict(selectedDecision.id, conflictResolutionChoice, 'Aligned engineering and GTM teams to Monday Sept 21 demo date.');
      showToast('Deadline conflict resolved and synced across workspace!', 'success');
      setShowConflictModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Decisions Hub & Organizational Evolution
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Track why decisions were made, detect contradictions across meetings, and flag implementation drift.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-brand-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {decisions.length} Active Decisions Logged
        </div>
      </div>

      {/* Decision Drift Alert Banner */}
      {decisions.some(d => d.driftDetected) && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start justify-between gap-4 glow-amber">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Decision Drift Detected by AI Operator
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">
                  Medium Severity
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1 font-medium">
                PR #142 references a custom standalone JWT server for auth, drifting from the agreed <strong className="text-brand-300">Firebase Auth</strong> architecture decision (Sept 08 Review).
              </p>
            </div>
          </div>

          <button
            onClick={() => showToast('Flagged PR #142 for architecture compliance review.', 'ai', 'Drift Review')}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex-shrink-0 transition-colors"
          >
            Review Drift in PR
          </button>
        </div>
      )}

      {/* 2-Column Grid: List & Evolution Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Decisions List */}
        <div className="lg:col-span-2 space-y-3">
          {decisions.map(d => {
            const isSelected = selectedDecision?.id === d.id;
            const hasConflict = !!d.conflictWith;

            return (
              <div
                key={d.id}
                onClick={() => setSelectedDecision(d)}
                className={`p-5 rounded-2xl bg-dark-850 border cursor-pointer transition-all ${
                  isSelected ? 'border-brand-500 glow-brand ring-1 ring-brand-500/50' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {d.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {d.date} · {d.meetingTitle}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {d.confidence}% AI Confidence
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 mb-1">
                  {d.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {d.description}
                </p>

                {/* Evidence Quote */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-300 font-mono flex items-start gap-2">
                  <span className="text-brand-400 font-bold">“</span>
                  <div className="flex-1">
                    <span>{d.evidence.quote}</span>
                    <span className="text-slate-400 block mt-0.5 text-[10px] font-sans">
                      — {d.evidence.speaker} (Timestamp {d.evidence.timestamp})
                    </span>
                  </div>
                </div>

                {/* Conflict Flag Button */}
                {hasConflict && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-rose-300 font-semibold">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Contradiction with GTM Sync ({d.conflictWith?.conflictingText})</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDecision(d);
                        setShowConflictModal(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-rose-500 text-white text-xs font-bold shadow-md hover:bg-rose-400 transition-colors"
                    >
                      Resolve Conflict
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Decision Evolution History Drawer */}
        <div className="bg-dark-900 rounded-3xl border border-white/10 p-6 space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200 pb-3 border-b border-white/10">
            <History className="w-4 h-4 text-brand-400" />
            <span>Decision Evolution Trail</span>
          </div>

          {selectedDecision ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white">{selectedDecision.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{selectedDecision.reason}</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-300">Progression History:</div>
                <div className="relative pl-4 space-y-3 before:content-[''] before:absolute before:top-2 before:bottom-2 before:left-1 before:w-0.5 before:bg-brand-500/40">
                  {selectedDecision.evolutionHistory.map((step, idx) => (
                    <div key={idx} className="relative text-xs">
                      <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-brand-400 ring-2 ring-dark-900"></div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-300">{step.stage}</span>
                        <span className="text-[10px] font-mono text-slate-400">{step.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{step.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-xs text-slate-400">
              Select any decision on the left to inspect its evolution timeline.
            </div>
          )}
        </div>
      </div>

      {/* Conflict Resolution Modal */}
      {showConflictModal && selectedDecision && selectedDecision.conflictWith && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-dark-900 border border-white/15 shadow-2xl p-6 overflow-hidden animate-slide-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Resolve Deadline Contradiction</span>
              </div>
              <button onClick={() => setShowConflictModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              MeetFlow AI detected conflicting dates across 2 different meeting syncs:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-dark-850 border border-brand-500/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-brand-300">Sprint 24 Planning:</span>
                <div className="text-sm font-bold text-white">Monday Sept 21</div>
                <div className="text-[11px] text-slate-400">Shivani Narayanan confirmed</div>
              </div>

              <div className="p-3.5 rounded-xl bg-dark-850 border border-rose-500/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-400">GTM Sync Calendar:</span>
                <div className="text-sm font-bold text-white">Wednesday Sept 23</div>
                <div className="text-[11px] text-slate-400">Partner invite draft</div>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Authoritative Decision:
              </label>
              <select
                value={conflictResolutionChoice}
                onChange={e => setConflictResolutionChoice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="Monday Sept 21 (Confirmed)">Lock to Monday Sept 21 (Engineering Ready)</option>
                <option value="Wednesday Sept 23 (Postponed)">Shift to Wednesday Sept 23 (More Testing Time)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConflictModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveConflict}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/30 transition-all"
              >
                Confirm Resolution & Update Calendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
