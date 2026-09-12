import React, { useState } from 'react';
import { 
  ArrowLeft, Sparkles, CheckSquare, AlertTriangle, 
  HelpCircle, Layers, Image as ImageIcon, Download, 
  Clock, Users, CheckCircle2, Bot, Play, ExternalLink 
} from 'lucide-react';
import { Meeting } from '../types';
import { useMeeting } from '../context/MeetingContext';
import { useToast } from '../context/ToastContext';

interface MeetingDetailPageProps {
  meeting: Meeting;
  onBack: () => void;
}

export const MeetingDetailPage: React.FC<MeetingDetailPageProps> = ({ meeting, onBack }) => {
  const { decisions, tasks, risks, questions } = useMeeting();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'summary' | 'transcript' | 'decisions' | 'tasks' | 'whiteboard'>('summary');
  const [highlightedTimestamp, setHighlightedTimestamp] = useState<string | null>(null);

  const meetingDecisions = decisions.filter(d => d.meetingId === meeting.id);
  const meetingTasks = tasks.filter(t => t.meetingId === meeting.id);
  const meetingRisks = risks.filter(r => r.sourceMeetingId === meeting.id);
  const meetingQuestions = questions.filter(q => q.meetingId === meeting.id);

  const handleExport = () => {
    const exportData = {
      meeting: meeting.title,
      date: meeting.date,
      decisions: meetingDecisions,
      tasks: meetingTasks,
      risks: meetingRisks,
      summary: meeting.summary
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MeetFlow_DigitalTwin_${meeting.id}.json`;
    a.click();
    showToast('Meeting Digital Twin execution package exported!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Bar with Back Button & Export */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Meetings</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 text-xs font-semibold transition-all"
          >
            <Download className="w-4 h-4 text-brand-400" />
            <span>Export Execution Package</span>
          </button>
        </div>
      </div>

      {/* Meeting Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-500/30 bg-gradient-to-r from-brand-950/40 via-dark-850 to-dark-900 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40">
              {meeting.type} Sync
            </span>
            <span className="text-xs font-mono text-slate-400">
              ID: #{meeting.id}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-400" /> {meeting.duration}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-brand-400" /> {meeting.participants.length} Participants</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {meeting.title}
        </h1>

        {/* Continuity & Effectiveness Scores */}
        <div className="pt-2 flex flex-wrap gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-4 h-4" /> Effectiveness: {meeting.metrics?.effectivenessScore || 91}%
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-bold flex items-center gap-1.5 font-mono">
            <Sparkles className="w-4 h-4" /> Continuity Score: {meeting.metrics?.continuityScore || 88}%
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-dark-950 p-1.5 rounded-2xl border border-white/5 text-xs overflow-x-auto">
        {[
          { id: 'summary', label: 'Executive Intelligence' },
          { id: 'transcript', label: 'Diarized Transcript' },
          { id: 'decisions', label: `Decisions (${meetingDecisions.length})` },
          { id: 'tasks', label: `Action Items (${meetingTasks.length})` },
          { id: 'whiteboard', label: 'Whiteboard Architecture' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 font-bold glow-brand'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Executive Intelligence */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-300">
              <Bot className="w-4 h-4 text-brand-400" />
              <span>AI Executive Summary</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {meeting.summary?.executive || 'Summary processing complete.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Locked Agreements ({meeting.summary?.agreements.length || 3})
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {meeting.summary?.agreements.map((agr, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{agr}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Next-Meeting Follow-ups
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {meeting.summary?.followUpRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-400 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Diarized Transcript */}
      {activeTab === 'transcript' && (
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Speaker-Aware Diarized Transcript ({meeting.transcript.length} segments)
            </span>
            <span className="text-[11px] font-mono text-brand-400">Click any quote timestamp to inspect evidence</span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {meeting.transcript.map(tr => (
              <div
                key={tr.id}
                className={`p-4 rounded-xl border transition-all ${
                  highlightedTimestamp === tr.timestamp
                    ? 'bg-brand-950/50 border-brand-500 glow-brand'
                    : 'bg-dark-850 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">{tr.speaker}</span>
                    {tr.originalLanguage && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                        {tr.originalLanguage}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setHighlightedTimestamp(tr.timestamp)}
                    className="text-[10px] font-mono text-brand-400 hover:text-brand-300 px-2 py-0.5 rounded bg-white/5"
                  >
                    {tr.timestamp}
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{tr.text}</p>
                {tr.translatedText && (
                  <div className="mt-2 text-[11px] text-brand-300 bg-brand-950/40 p-2 rounded-lg border border-brand-500/20">
                    <strong>AI Structured Translation:</strong> {tr.translatedText}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Decisions */}
      {activeTab === 'decisions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetingDecisions.map(d => (
            <div key={d.id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  {d.status}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {d.confidence}% AI Confidence
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100">{d.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{d.description}</p>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-300 font-mono">
                <span className="text-brand-400 font-bold block mb-0.5">Evidence ({d.evidence.timestamp}):</span>
                “{d.evidence.quote}”
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Action Items */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetingTasks.map(t => (
            <div key={t.id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                  Priority: {t.priority}
                </span>
                <span className="text-xs font-mono text-purple-300">{t.status}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-100">{t.title}</h4>
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
                <img src={t.owner.avatar} alt="Owner" className="w-5 h-5 rounded-full object-cover" />
                <span>Owner: <strong>{t.owner.name}</strong></span>
                <span className="text-slate-400">· Due: {t.dueDate}</span>
              </div>
              {t.riskScore >= 70 && (
                <div className="text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-500/30 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Risk: {t.riskScore}% · {t.riskReason}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Whiteboard */}
      {activeTab === 'whiteboard' && (
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
            <ImageIcon className="w-4 h-4 text-brand-400" />
            <span>Extracted Architecture Diagram</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-dark-950">
              <img
                src={meeting.whiteboardData?.imageUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"}
                alt="Whiteboard"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-200">
                Extracted Architecture Components:
              </div>
              <div className="flex flex-wrap gap-2">
                {(meeting.whiteboardData?.extractedComponents || [
                  'React Next.js Frontend', 'Cloudflare API Gateway', 'Go Backend', 'PostgreSQL Ledger', 'Stripe v3 Webhooks'
                ]).map((comp, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-brand-300">
                    {comp}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-dark-850 p-4 rounded-xl border border-white/5">
                {meeting.whiteboardData?.architectureDescription || 'Idempotent webhook pipeline with Redis locks and strict relational database ledger.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
