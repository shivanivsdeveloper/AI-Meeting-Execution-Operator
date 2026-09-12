import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Play, Pause, Sparkles, CheckSquare, 
  AlertTriangle, HelpCircle, Layers, Image as ImageIcon, 
  Bot, Clock, Users, ArrowRight, ShieldCheck, Check 
} from 'lucide-react';
import { TranscriptSegment } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useMeeting } from '../../context/MeetingContext';
import { WhiteboardUploader } from './WhiteboardUploader';

interface LiveMeetingRoomProps {
  onFinishMeeting: (meetingId: string) => void;
  onClose: () => void;
}

export const LiveMeetingRoom: React.FC<LiveMeetingRoomProps> = ({
  onFinishMeeting,
  onClose
}) => {
  const { showToast } = useToast();
  const { refreshAll } = useMeeting();

  const [isRecording, setIsRecording] = useState(true);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [activeSpeaker, setActiveSpeaker] = useState('Priya Sharma');
  const [transcriptStream, setTranscriptStream] = useState<TranscriptSegment[]>([]);
  const [liveInsights, setLiveInsights] = useState<{ id: string; type: string; title: string; confidence: number; timestamp: string }[]>([]);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Initial simulated live script
  const liveScript: Omit<TranscriptSegment, 'id'>[] = [
    {
      speaker: 'Sarah Chen',
      timestamp: '00:05',
      seconds: 5,
      text: 'Good morning everyone. Let\'s align on our critical deliverables for Monday\'s enterprise client demonstration.'
    },
    {
      speaker: 'Priya Sharma',
      timestamp: '00:15',
      seconds: 15,
      text: 'We should finish the payment API by Friday 4 PM. I will personally handle the Stripe v3 webhook integration and signature verification.',
      aiDetectedTypes: ['decision', 'task']
    },
    {
      speaker: 'Rahul Verma',
      timestamp: '00:30',
      seconds: 30,
      text: 'The checkout UI and payment modal components are ready on frontend staging branch.'
    },
    {
      speaker: 'Arun Kumar',
      timestamp: '00:45',
      seconds: 45,
      text: 'Testing must start immediately Friday afternoon. If the API is delayed, QA cannot certify the build before Monday demo.',
      aiDetectedTypes: ['risk']
    },
    {
      speaker: 'Shivani Narayanan',
      timestamp: '01:05',
      seconds: 65,
      text: 'Confirmed: Payment API must be completed by Friday 4 PM. Priya owns backend, Arun owns QA test suites.',
      aiDetectedTypes: ['decision', 'task']
    },
    {
      speaker: 'Priya Sharma',
      timestamp: '01:20',
      seconds: 80,
      text: 'Login module Friday-kulla complete panniduvom. Token refresh is already optimized.',
      originalLanguage: 'Tamil / English Mix',
      translatedText: 'We will complete the login module before Friday.',
      aiDetectedTypes: ['task']
    },
    {
      speaker: 'Sarah Chen',
      timestamp: '01:35',
      seconds: 95,
      text: 'Who will approve the production deploy sandbox credentials for the client testing team?',
      aiDetectedTypes: ['question']
    }
  ];

  // Timer simulation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setCurrentSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Stream transcript segments over time
  useEffect(() => {
    if (!isRecording) return;

    const streamInterval = setInterval(() => {
      setTranscriptStream(prev => {
        if (prev.length < liveScript.length) {
          const nextItem = {
            ...liveScript[prev.length],
            id: 'live_' + Date.now()
          };
          setActiveSpeaker(nextItem.speaker);

          // Trigger live AI copilot insight
          if (nextItem.aiDetectedTypes?.includes('decision')) {
            setLiveInsights(ins => [
              {
                id: 'ins_' + Date.now(),
                type: 'Decision Detected',
                title: 'Payment API deadline locked for Friday 4 PM',
                confidence: 97,
                timestamp: nextItem.timestamp
              },
              ...ins
            ]);
          } else if (nextItem.aiDetectedTypes?.includes('risk')) {
            setLiveInsights(ins => [
              {
                id: 'ins_' + Date.now(),
                type: 'Risk Detected',
                title: 'Downstream QA bottleneck if API slips into weekend',
                confidence: 82,
                timestamp: nextItem.timestamp
              },
              ...ins
            ]);
          } else if (nextItem.aiDetectedTypes?.includes('question')) {
            setLiveInsights(ins => [
              {
                id: 'ins_' + Date.now(),
                type: 'Unanswered Question',
                title: 'Missing owner: Sandbox credentials approval',
                confidence: 94,
                timestamp: nextItem.timestamp
              },
              ...ins
            ]);
          }

          return [...prev, nextItem];
        }
        return prev;
      });
    }, 4500);

    return () => clearInterval(streamInterval);
  }, [isRecording]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptStream]);

  // Finish meeting & trigger full multi-agent pipeline
  const handleExecuteMeeting = async () => {
    setIsRecording(false);
    setIsAnalyzing(true);

    const steps = [
      'Processing Diarized Audio & Speaker Tracks...',
      'DecisionAgent extracting approved commitments...',
      'TaskAgent generating structured action items with recommended owners...',
      'RiskAgent computing downstream schedule dependency blockers...',
      'ExecutionAgent preparing automated follow-ups & next meeting brief...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(i);
      await new Promise(r => setTimeout(r, 700));
    }

    try {
      await api.processMeeting('meet_sprint_aurapay_01');
      await refreshAll();
      showToast('Meeting processed! Decisions, Tasks, and Risks extracted.', 'ai', 'AI Execution Operator');
      onFinishMeeting('meet_sprint_aurapay_01');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07090e] flex flex-col animate-fade-in overflow-hidden">
      {/* Top Studio Bar */}
      <div className="h-16 px-6 bg-dark-900 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            LIVE RECORDING · {formatTime(currentSeconds)}
          </div>
          <h2 className="text-sm font-bold text-slate-100 hidden sm:inline">
            Sprint 24 Planning & Payment API Delivery
          </h2>
        </div>

        {/* Audio Visualizer Waveform */}
        <div className="hidden md:flex items-center gap-1 h-6">
          {[12, 24, 18, 28, 14, 22, 10, 26, 18, 14, 20].map((h, i) => (
            <div
              key={i}
              style={{ height: isRecording ? `${h}px` : '4px' }}
              className="w-1 rounded-full bg-brand-400 transition-all duration-300"
            ></div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWhiteboardOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 text-xs font-semibold"
          >
            <ImageIcon className="w-3.5 h-3.5 text-brand-400" />
            <span>Attach Whiteboard</span>
          </button>

          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
              isRecording
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={handleExecuteMeeting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/30 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Finish & Execute with AI</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body: 2 Columns */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 overflow-hidden">
        {/* Left 2 Cols: Live Speaker Diarized Transcript */}
        <div className="lg:col-span-2 flex flex-col bg-dark-950 border-r border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" />
              <span>Real-Time Speaker Diarization · Active: <strong className="text-brand-300">{activeSpeaker}</strong></span>
            </div>
            <span className="font-mono text-[11px] text-emerald-400">Multilingual: Tanglish / Hindi Enabled</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {transcriptStream.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-2xl bg-dark-850/70 border border-white/5 space-y-1.5 animate-slide-up"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">
                      {item.speaker}
                    </span>
                    {item.originalLanguage && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                        {item.originalLanguage}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {item.text}
                </p>

                {item.translatedText && (
                  <div className="text-[11px] text-brand-300 bg-brand-950/40 p-2 rounded-lg border border-brand-500/20">
                    <strong>AI Structured Translation:</strong> {item.translatedText}
                  </div>
                )}
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
        </div>

        {/* Right 1 Col: Real-Time AI Copilot Panel */}
        <div className="bg-dark-900 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-2 text-xs font-bold text-slate-100 uppercase tracking-wider">
            <Bot className="w-4 h-4 text-brand-400 animate-pulse" />
            <span>AI Real-Time Copilot Insights</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {liveInsights.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-400">
                AI Copilot is actively listening for decisions, commitments, and schedule risks...
              </div>
            ) : (
              liveInsights.map(ins => (
                <div
                  key={ins.id}
                  className="p-3.5 rounded-xl bg-dark-850 border border-white/10 shadow-lg space-y-1 animate-slide-up"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                      {ins.type}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {ins.confidence}% Conf.
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-100 pt-1">
                    {ins.title}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Timestamp: {ins.timestamp}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Multi-Agent Analysis Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-cyan p-1 flex items-center justify-center shadow-2xl shadow-brand-500/50 mb-6 animate-spin">
            <Bot className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-xl font-extrabold text-white tracking-tight mb-2">
            MeetFlow Multi-Agent Execution Pipeline Running
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-8">
            Coordinating Transcript, Decision, Task, Risk, and Verification Agents...
          </p>

          <div className="space-y-3 w-full max-w-md text-left">
            {[
              'Processing Diarized Audio & Speaker Tracks',
              'DecisionAgent extracting approved choices',
              'TaskAgent assigning recommended owners & priorities',
              'RiskAgent computing dependency blockers & delay predictions',
              'ExecutionAgent preparing automated follow-ups'
            ].map((stg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  analysisStep > i
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : analysisStep === i
                    ? 'bg-brand-950/60 border-brand-500/50 text-brand-200 glow-brand'
                    : 'bg-dark-850/50 border-white/5 text-slate-400'
                }`}
              >
                <span>{stg}</span>
                {analysisStep > i ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : analysisStep === i ? (
                  <Sparkles className="w-4 h-4 text-brand-400 animate-spin" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Whiteboard Modal */}
      <WhiteboardUploader
        isOpen={isWhiteboardOpen}
        onClose={() => setIsWhiteboardOpen(false)}
      />
    </div>
  );
};
