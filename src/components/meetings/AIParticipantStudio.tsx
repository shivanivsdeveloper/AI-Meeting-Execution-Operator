import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Play, Pause, Square, Volume2, VolumeX, 
  Sparkles, CheckSquare, AlertTriangle, HelpCircle, Bot, 
  Clock, Users, ArrowRight, ShieldCheck, Check, X, 
  Settings, Sliders, RefreshCw, Send, ChevronRight, FileText,
  Flame, CheckCircle2, MessageSquare
} from 'lucide-react';
import { 
  TranscriptSegment, AIParticipantMode, AIParticipantFrequency,
  AIParticipantConfig, AIParticipantIntervention, 
  ExtractedActionItemDraft, ExtractedDecisionDraft, TaskPriority
} from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useMeeting } from '../../context/MeetingContext';

interface AIParticipantStudioProps {
  onClose?: () => void;
  onFinish?: (meetingId: string) => void;
}

export const AIParticipantStudio: React.FC<AIParticipantStudioProps> = ({
  onClose,
  onFinish
}) => {
  const { showToast } = useToast();
  const { refreshAll } = useMeeting();

  // Meeting & Audio State
  const [isMeetingActive, setIsMeetingActive] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState('Sarah Chen');

  // AI Configuration State
  const [config, setConfig] = useState<AIParticipantConfig>({
    mode: 'smart_participant',
    frequency: 'balanced',
    voiceEnabled: true,
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    autoExtractTasks: true,
    autoVerifyDecisions: true,
    bargeInAllowed: true,
    proactiveInterventionThreshold: 75
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Live Streams
  const [transcriptStream, setTranscriptStream] = useState<TranscriptSegment[]>([]);
  const [aiInterventions, setAiInterventions] = useState<AIParticipantIntervention[]>([]);
  const [actionDrafts, setActionDrafts] = useState<ExtractedActionItemDraft[]>([]);
  const [decisionDrafts, setDecisionDrafts] = useState<ExtractedDecisionDraft[]>([]);
  const [agendaItems, setAgendaItems] = useState<{ id: string; title: string; completed: boolean }[]>([
    { id: 'ag_1', title: 'Payment API Delivery & Cutoff Alignment', completed: true },
    { id: 'ag_2', title: 'Staging Deployment & Webhook Verification', completed: false },
    { id: 'ag_3', title: 'E2E QA Test Automation Scheduling', completed: false },
    { id: 'ag_4', title: 'Merchant Sandbox Sign-off Ownership', completed: false },
    { id: 'ag_5', title: 'Partner Demo Schedule Confirmation', completed: false }
  ]);

  // User manual query input
  const [manualQuery, setManualQuery] = useState('');
  const [isAnalyzingChunk, setIsAnalyzingChunk] = useState(false);

  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Simulated live conversational stream for instant out-of-the-box demo
  const sampleScript: Omit<TranscriptSegment, 'id'>[] = [
    {
      speaker: 'Sarah Chen',
      timestamp: '00:04',
      seconds: 4,
      text: 'Good morning team. Let\'s align on our critical deliverables for the enterprise client demo.'
    },
    {
      speaker: 'Priya Sharma',
      timestamp: '00:14',
      seconds: 14,
      text: 'We should finish the payment API by Friday 4 PM. I will personally handle the Stripe v3 webhook integration.'
    },
    {
      speaker: 'Arun Kumar',
      timestamp: '00:28',
      seconds: 28,
      text: 'Testing must start immediately Friday afternoon. If the API is delayed, QA cannot certify the build before Monday demo.'
    },
    {
      speaker: 'Sarah Chen',
      timestamp: '00:42',
      seconds: 42,
      text: 'MeetFlow, what is the status of the Stripe v3 payment integration task?'
    },
    {
      speaker: 'Shivani Narayanan',
      timestamp: '00:58',
      seconds: 58,
      text: 'Confirmed: Payment API must be completed and deployed to staging by Friday 4 PM. Priya owns backend, Arun owns QA test suites.'
    },
    {
      speaker: 'Sarah Chen',
      timestamp: '01:15',
      seconds: 75,
      text: 'I just sent the partner client invite for Wednesday September 23 at 10 AM.'
    },
    {
      speaker: 'Rahul Verma',
      timestamp: '01:30',
      seconds: 90,
      text: 'Someone needs to get the production sandbox credentials and merchant API keys approved sometime next week.'
    }
  ];

  // Speech Synthesis setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Text-to-speech speaker helper
  const speakText = (text: string) => {
    if (!config.voiceEnabled || !synthRef.current) return;
    try {
      synthRef.current.cancel(); // cancel any active speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = config.voiceSpeed || 1.0;
      utterance.pitch = config.voicePitch || 1.0;

      setIsAISpeaking(true);
      utterance.onend = () => setIsAISpeaking(false);
      utterance.onerror = () => setIsAISpeaking(false);

      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn('TTS playback error:', e);
      setIsAISpeaking(false);
    }
  };

  const stopAISpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsAISpeaking(false);
    showToast('AI speech interrupted (Barge-in).', 'info');
  };

  // Timer
  useEffect(() => {
    let interval: any;
    if (isMeetingActive) {
      interval = setInterval(() => setCurrentSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isMeetingActive]);

  // Stream live transcript chunks and evaluate with AI participant backend
  useEffect(() => {
    if (!isMeetingActive) return;

    const streamTimer = setInterval(async () => {
      if (transcriptStream.length < sampleScript.length) {
        const nextSegment: TranscriptSegment = {
          ...sampleScript[transcriptStream.length],
          id: 'seg_' + Date.now()
        };

        setActiveSpeaker(nextSegment.speaker);
        setTranscriptStream(prev => [...prev, nextSegment]);

        // Process through backend model inference
        try {
          setIsAnalyzingChunk(true);
          const analysis = await api.analyzeMeetingChunk({
            segment: nextSegment,
            mode: config.mode,
            frequency: config.frequency,
            previousSegments: transcriptStream
          });

          if (analysis.extractedTask) {
            setActionDrafts(prev => [analysis.extractedTask, ...prev]);
          }

          if (analysis.extractedDecision) {
            setDecisionDrafts(prev => [analysis.extractedDecision, ...prev]);
          }

          if (analysis.shouldSpeak && analysis.intervention) {
            setAiInterventions(prev => [analysis.intervention, ...prev]);
            speakText(analysis.intervention.spokenText);
          }
        } catch (err) {
          console.error('Inference error:', err);
        } finally {
          setIsAnalyzingChunk(false);
        }
      }
    }, 5500);

    return () => clearInterval(streamTimer);
  }, [isMeetingActive, transcriptStream.length, config.mode, config.frequency]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptStream, aiInterventions]);

  // Handle direct manual question to AI participant
  const handleDirectAsk = async () => {
    if (!manualQuery.trim()) return;
    const queryText = manualQuery;
    setManualQuery('');

    const userSegment: TranscriptSegment = {
      id: 'seg_user_' + Date.now(),
      speaker: 'Shivani Narayanan',
      timestamp: formatTime(currentSeconds),
      seconds: currentSeconds,
      text: queryText
    };

    setTranscriptStream(prev => [...prev, userSegment]);

    try {
      setIsAnalyzingChunk(true);
      const res = await api.directAskParticipant(queryText, config.mode);
      if (res.intervention) {
        setAiInterventions(prev => [res.intervention, ...prev]);
        speakText(res.intervention.spokenText);
      }
    } catch (err) {
      showToast('Failed to reach AI Participant.', 'warning');
    } finally {
      setIsAnalyzingChunk(false);
    }
  };

  // Approve action draft and create real task
  const handleApproveAction = async (draft: ExtractedActionItemDraft) => {
    try {
      await api.approveExtractedTask(draft);
      await refreshAll();
      setActionDrafts(prev => prev.map(d => d.id === draft.id ? { ...d, status: 'approved' } : d));
      showToast(`Approved: Task "${draft.title}" saved to workspace database!`, 'success', 'Task Created');
    } catch (err) {
      showToast('Error approving task.', 'warning');
    }
  };

  // Approve decision draft and create real decision
  const handleApproveDecision = async (draft: ExtractedDecisionDraft) => {
    try {
      await api.approveExtractedDecision(draft);
      await refreshAll();
      setDecisionDrafts(prev => prev.map(d => d.id === draft.id ? { ...d, reviewStatus: 'approved' } : d));
      showToast(`Confirmed: Decision "${draft.title}" locked in workspace memory!`, 'success', 'Decision Locked');
    } catch (err) {
      showToast('Error confirming decision.', 'warning');
    }
  };

  // Toggle agenda item
  const toggleAgendaItem = (id: string) => {
    setAgendaItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  // End and finalize meeting
  const handleEndMeeting = async () => {
    setIsMeetingActive(false);
    stopAISpeech();
    try {
      const approvedTasksCount = actionDrafts.filter(a => a.status === 'approved').length;
      const approvedDecisionsCount = decisionDrafts.filter(d => d.reviewStatus === 'approved').length;

      await api.endParticipantMeeting({
        meetingId: 'meet_sprint_aurapay_01',
        title: 'Sprint 24 Planning & Execution Brief',
        transcripts: transcriptStream,
        approvedTasksCount: Math.max(1, approvedTasksCount),
        approvedDecisionsCount: Math.max(1, approvedDecisionsCount)
      });

      await refreshAll();
      showToast('Meeting finalized! Executive summary & minutes generated.', 'ai', 'Execution Complete');
      if (onFinish) onFinish('meet_sprint_aurapay_01');
      else if (onClose) onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col bg-[#07090e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in text-slate-100">
      {/* Top Header Bar */}
      <div className="h-16 px-4 sm:px-6 bg-dark-900 border-b border-white/10 flex items-center justify-between gap-3">
        {/* Left: Live Status & Meeting Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold font-mono">
            <span className={`w-2 h-2 rounded-full bg-rose-500 ${isMeetingActive ? 'animate-ping' : ''}`}></span>
            {isMeetingActive ? `LIVE · ${formatTime(currentSeconds)}` : 'PAUSED'}
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate flex items-center gap-2">
              <span>Interactive AI Meeting Participant</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono uppercase">
                {config.mode.replace('_', ' ')}
              </span>
            </h2>
          </div>
        </div>

        {/* Center: AI Speaking Status & Waveform */}
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-xl bg-dark-950/80 border border-white/5">
          <div className="relative">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isAISpeaking ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/50 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
              <Bot className="w-4 h-4" />
            </div>
            {isAISpeaking && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-dark-900 animate-ping"></span>
            )}
          </div>

          <div className="text-xs">
            <div className="font-semibold text-slate-200">
              {isAISpeaking ? 'AI Speaking Live' : 'AI Actively Listening'}
            </div>
            <div className="text-[10px] text-slate-400">
              {isAISpeaking ? 'Click Stop to interrupt' : 'Ready for questions & decisions'}
            </div>
          </div>

          {/* Audio Waveform */}
          <div className="flex items-center gap-1 h-5 ml-2">
            {[14, 24, 18, 30, 20, 26, 12, 28, 16, 22].map((h, i) => (
              <div
                key={i}
                style={{ height: isAISpeaking ? `${h}px` : isMeetingActive ? '6px' : '3px' }}
                className={`w-1 rounded-full transition-all duration-200 ${isAISpeaking ? 'bg-gradient-to-t from-brand-500 to-accent-cyan' : 'bg-slate-700'}`}
              ></div>
            ))}
          </div>

          {isAISpeaking && (
            <button
              onClick={stopAISpeech}
              className="ml-2 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold transition-all"
              title="Stop AI speech immediately"
            >
              Stop Speaking
            </button>
          )}
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 transition-colors"
            title="Configure AI Participant Mode & Frequency"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMicMuted(!isMicMuted)}
            className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
              isMicMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/10'
            }`}
            title={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
          >
            {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-brand-400" />}
          </button>

          <button
            onClick={() => setIsMeetingActive(!isMeetingActive)}
            className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
              isMeetingActive
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
            title={isMeetingActive ? "Pause Meeting" : "Resume Meeting"}
          >
            {isMeetingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={handleEndMeeting}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/30 flex items-center gap-1.5 transition-all"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>End & Finalize</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Grid Layout: 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[580px] max-h-[750px] overflow-hidden">
        {/* Column 1: Live Diarized Transcript Stream (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-dark-950 border-r border-white/5 overflow-hidden">
          <div className="p-3.5 border-b border-white/5 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" />
              <span>Diarized Transcript · Current Speaker: <strong className="text-brand-300">{activeSpeaker}</strong></span>
            </div>
            {isAnalyzingChunk && (
              <span className="text-[10px] text-brand-400 animate-pulse flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-spin" /> AI Analyzing
              </span>
            )}
          </div>

          {/* Transcript Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {transcriptStream.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-dark-850/80 border border-white/5 space-y-1 animate-slide-up"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">{item.speaker}</span>
                    {item.speaker.includes('Priya') && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                        Lead Backend
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{item.text}</p>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>

          {/* Direct Input Bar */}
          <div className="p-3 border-t border-white/5 bg-dark-900 flex items-center gap-2">
            <input
              type="text"
              value={manualQuery}
              onChange={(e) => setManualQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDirectAsk()}
              placeholder="Speak or type a question to the AI Participant..."
              className="flex-1 px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={handleDirectAsk}
              className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-md shadow-brand-500/20"
              title="Send to AI Participant"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Column 2: AI Participant Verbal & Guidance Stream (4 cols) */}
        <div className="lg:col-span-4 flex flex-col bg-dark-900 border-r border-white/5 overflow-hidden">
          <div className="p-3.5 border-b border-white/5 flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-brand-400 animate-pulse" />
              <span>AI Interventions & Verbal Responses</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
              {aiInterventions.length} Spoken
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {aiInterventions.length === 0 ? (
              <div className="text-center py-20 px-4 space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-400 mx-auto flex items-center justify-center border border-brand-500/20">
                  <Bot className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">AI Participant is Active</h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Listening in <strong>{config.mode.replace('_', ' ')}</strong> mode. The AI will speak when asked, flag critical conflicts, or clarify missing deadlines.
                </p>
              </div>
            ) : (
              aiInterventions.map(int => (
                <div
                  key={int.id}
                  className={`p-3.5 rounded-xl border shadow-lg space-y-2 animate-slide-up ${
                    int.intent === 'conflict_warning'
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                      : int.intent === 'blocker_alert'
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                      : int.intent === 'proactive_clarification'
                      ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
                      : 'bg-dark-850 border-brand-500/30 text-brand-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10">
                      {int.intent.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono opacity-80">{int.timestamp}</span>
                      <button
                        onClick={() => speakText(int.spokenText)}
                        className="p-1 rounded hover:bg-white/10 text-slate-300"
                        title="Replay Voice"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-slate-100 leading-snug">
                    "{int.spokenText}"
                  </p>

                  {int.detailedAnalysis && (
                    <div className="text-[11px] text-slate-400 p-2 rounded-lg bg-black/30 border border-white/5">
                      <strong>Analysis:</strong> {int.detailedAnalysis}
                    </div>
                  )}

                  {int.evidenceQuotes.length > 0 && (
                    <div className="text-[10px] text-slate-400 space-y-0.5 pt-1">
                      <div className="font-semibold text-slate-400">Grounding Evidence:</div>
                      {int.evidenceQuotes.map((q, idx) => (
                        <div key={idx} className="italic text-slate-400 pl-2 border-l border-brand-500/40">
                          • {q}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Review & Approval Queue + Agenda (3 cols) */}
        <div className="lg:col-span-3 flex flex-col bg-dark-950 overflow-hidden">
          {/* Agenda Checklist */}
          <div className="p-3.5 border-b border-white/5 bg-dark-900/50">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-brand-400" />
                Live Agenda
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                {agendaItems.filter(a => a.completed).length}/{agendaItems.length} Done
              </span>
            </div>

            <div className="space-y-1.5">
              {agendaItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleAgendaItem(item.id)}
                  className={`p-2 rounded-lg text-[11px] flex items-center gap-2 cursor-pointer transition-all ${
                    item.completed
                      ? 'bg-emerald-500/10 text-emerald-300 line-through opacity-70'
                      : 'bg-dark-850 hover:bg-dark-800 text-slate-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="rounded border-slate-700 text-brand-500 focus:ring-0"
                  />
                  <span className="truncate">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items Approval Queue */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                Action Review Queue
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                {actionDrafts.length} Extracted
              </span>
            </div>

            {actionDrafts.length === 0 ? (
              <div className="text-center py-8 text-[11px] text-slate-400">
                Listening for commitments, deadlines, and task ownership...
              </div>
            ) : (
              actionDrafts.map(draft => (
                <div
                  key={draft.id}
                  className={`p-3 rounded-xl border space-y-2 transition-all ${
                    draft.status === 'approved'
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-dark-850 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      {draft.priority} Priority
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Due: {draft.dueDate}</span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-100">{draft.title}</h5>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Owner: <strong className="text-brand-300">{draft.ownerName}</strong></span>
                    <span className="text-rose-400 font-mono font-bold">Risk: {draft.riskScore}%</span>
                  </div>

                  {draft.status === 'approved' ? (
                    <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Saved to Database
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApproveAction(draft)}
                      className="w-full py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-bold shadow-md flex items-center justify-center gap-1 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve $\to$ Create Task</span>
                    </button>
                  )}
                </div>
              ))
            )}

            {/* Decisions Drafts */}
            {decisionDrafts.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Confirmed Decisions
                </div>
                {decisionDrafts.map(dec => (
                  <div
                    key={dec.id}
                    className={`p-3 rounded-xl border space-y-1.5 ${
                      dec.reviewStatus === 'approved'
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-dark-850 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {dec.status}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">{dec.confidence}% Conf.</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-100">{dec.title}</p>
                    {dec.reviewStatus === 'approved' ? (
                      <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Locked in Workspace Memory
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApproveDecision(dec)}
                        className="w-full py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold"
                      >
                        Confirm & Lock Decision
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-dark-900 border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-400" />
                AI Participant Configuration
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Participation Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'silent_observer', label: 'Silent Observer', desc: 'Notes only, never speaks' },
                  { id: 'smart_participant', label: 'Smart Participant', desc: 'Answers when asked' },
                  { id: 'decision_advisor', label: 'Decision Advisor', desc: 'Flags risks & conflicts' },
                  { id: 'meeting_facilitator', label: 'Meeting Facilitator', desc: 'Guides time & agenda' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setConfig({ ...config, mode: m.id as AIParticipantMode })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      config.mode === m.id
                        ? 'bg-brand-600/20 border-brand-500 text-brand-200'
                        : 'bg-dark-850 border-white/5 text-slate-400 hover:bg-dark-800'
                    }`}
                  >
                    <div className="text-xs font-bold">{m.label}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Speaking Frequency */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Speaking Frequency</label>
              <div className="grid grid-cols-3 gap-2">
                {(['conservative', 'balanced', 'proactive'] as AIParticipantFrequency[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setConfig({ ...config, frequency: f })}
                    className={`py-2 rounded-xl border text-xs font-bold capitalize transition-all ${
                      config.frequency === f
                        ? 'bg-brand-600 border-brand-500 text-white'
                        : 'bg-dark-850 border-white/5 text-slate-400'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Output Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-850 border border-white/5">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-200">Text-to-Speech Voice Output</div>
                <div className="text-[10px] text-slate-400">Speak AI responses into meeting</div>
              </div>
              <input
                type="checkbox"
                checked={config.voiceEnabled}
                onChange={(e) => setConfig({ ...config, voiceEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-brand-500"
              />
            </div>

            <button
              onClick={() => {
                setShowSettingsModal(false);
                showToast('AI Participant settings updated.', 'success');
              }}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/30"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
