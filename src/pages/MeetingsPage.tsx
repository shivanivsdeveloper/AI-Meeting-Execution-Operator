import React, { useState } from 'react';
import { 
  Mic, Plus, Upload, Calendar, Play, Sparkles, 
  Clock, Users, FileText, CheckCircle2, ChevronRight, Layers, ArrowRight 
} from 'lucide-react';
import { useMeeting } from '../context/MeetingContext';
import { useToast } from '../context/ToastContext';
import { PreMeetingBriefModal } from '../components/meetings/PreMeetingBriefModal';
import { Meeting } from '../types';

interface MeetingsPageProps {
  onSelectMeeting: (meeting: Meeting) => void;
  openLiveMeeting: () => void;
}

export const MeetingsPage: React.FC<MeetingsPageProps> = ({
  onSelectMeeting,
  openLiveMeeting
}) => {
  const { meetings } = useMeeting();
  const { showToast } = useToast();

  const [activeFilter, setActiveFilter] = useState<'all' | 'Planning' | 'Review' | 'Live' | 'Scheduled'>('all');
  const [isPreMeetingBriefOpen, setIsPreMeetingBriefOpen] = useState(false);
  const [selectedMeetingTitle, setSelectedMeetingTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredMeetings = meetings.filter(m => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'Scheduled') return m.status === 'Scheduled';
    if (activeFilter === 'Live') return m.status === 'Live';
    return m.type === activeFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Meetings & Digital Twins
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Every meeting is converted into a living knowledge twin with decisions, structured tasks, and risk predictions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => {
              setSelectedMeetingTitle('Client Demo Prep & Go-To-Market Alignment');
              setIsPreMeetingBriefOpen(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-brand-300 border border-brand-500/30 text-xs font-bold transition-all"
          >
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Generate Pre-Meeting Brief</span>
          </button>

          <button
            onClick={openLiveMeeting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/30 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Live Meeting</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-dark-950 p-1.5 rounded-2xl border border-white/5 text-xs overflow-x-auto">
        {(['all', 'Planning', 'Review', 'Scheduled'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              activeFilter === tab
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'all' ? 'All Meetings' : tab}
          </button>
        ))}
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeetings.map(meeting => (
          <div
            key={meeting.id}
            onClick={() => onSelectMeeting(meeting)}
            className="glass-card rounded-2xl p-6 border border-white/10 hover:border-brand-500/40 cursor-pointer transition-all flex flex-col justify-between group space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {meeting.type}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  meeting.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {meeting.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
                {meeting.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {meeting.summary?.executive || 'Diarized speaker tracks, decision extraction, and risk analysis attached.'}
              </p>
            </div>

            {/* Metrics Snapshot */}
            <div className="pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2 rounded-lg bg-white/[0.02]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Decisions</div>
                <div className="text-xs font-bold text-brand-300">{meeting.metrics?.decisionsCount || 3}</div>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Tasks</div>
                <div className="text-xs font-bold text-purple-300">{meeting.metrics?.tasksCount || 4}</div>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Effectiveness</div>
                <div className="text-xs font-bold text-emerald-400">{meeting.metrics?.effectivenessScore || 91}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{meeting.duration}</span>
              </div>
              <span className="text-brand-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Digital Twin <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pre Meeting Brief Modal */}
      <PreMeetingBriefModal
        isOpen={isPreMeetingBriefOpen}
        onClose={() => setIsPreMeetingBriefOpen(false)}
        meetingTitle={selectedMeetingTitle}
      />
    </div>
  );
};
