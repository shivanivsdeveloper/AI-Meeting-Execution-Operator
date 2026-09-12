import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, X, Check, RefreshCw, FileText, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface PreMeetingBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingTitle?: string;
}

export const PreMeetingBriefModal: React.FC<PreMeetingBriefModalProps> = ({
  isOpen,
  onClose,
  meetingTitle = 'Client Demo Prep & Go-To-Market Alignment'
}) => {
  const { showToast } = useToast();
  const [agenda, setAgenda] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAgenda = async () => {
    setIsLoading(true);
    try {
      const res = await api.generateAgenda(meetingTitle);
      setAgenda(res.agenda);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAgenda();
    }
  }, [isOpen, meetingTitle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-dark-900 border border-white/15 shadow-2xl p-6 overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                AI Pre-Meeting Intelligence Brief
              </h3>
              <p className="text-xs text-slate-400">{meetingTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intelligence Stats Pill */}
        <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Previous Decisions</div>
            <div className="text-base font-bold text-brand-400 mt-0.5">7 Reviewed</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Active Risks</div>
            <div className="text-base font-bold text-rose-400 mt-0.5">2 Open</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Unresolved Qs</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">1 Persisting</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Continuity Score</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">88% High</div>
          </div>
        </div>

        {/* Recommended Agenda */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              AI Recommended Agenda (Grounded on Workspace State):
            </span>
            <button
              onClick={fetchAgenda}
              disabled={isLoading}
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {agenda.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-dark-850 border border-white/5 text-xs text-slate-200 flex items-start gap-2.5"
              >
                <span className="text-brand-400 font-bold font-mono">0{idx + 1}</span>
                <span className="leading-relaxed flex-1">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
          >
            Dismiss
          </button>

          <button
            onClick={() => {
              showToast('Agenda accepted and synced to Google Calendar invite!', 'success');
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-500/30 transition-all"
          >
            <Check className="w-4 h-4" />
            Accept & Distribute Agenda
          </button>
        </div>
      </div>
    </div>
  );
};
