import React, { useState } from 'react';
import { 
  CheckSquare, Plus, Filter, Users, AlertTriangle, 
  ShieldCheck, ArrowRight, Play, CheckCircle2, Clock, Sparkles 
} from 'lucide-react';
import { useMeeting } from '../context/MeetingContext';
import { useToast } from '../context/ToastContext';
import { WorkloadBalanceModal } from '../components/tasks/WorkloadBalanceModal';
import { DependencyGraph } from '../components/visualizations/DependencyGraph';
import { Task } from '../types';

export const TasksPage: React.FC = () => {
  const { tasks, updateTaskStatus } = useMeeting();
  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'dependencies'>('list');
  const [isWorkloadModalOpen, setIsWorkloadModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await updateTaskStatus(taskId, newStatus);
    showToast(`Task status updated to ${newStatus}!`, newStatus === 'Completed' ? 'success' : 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Action Items Engine & Autonomous Verification
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Every task is grounded in verbal meeting evidence with automated risk scoring and skill-matched owners.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsWorkloadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold transition-all"
          >
            <Users className="w-4 h-4 text-brand-400" />
            <span>Balance Team Workload</span>
          </button>
        </div>
      </div>

      {/* View Switcher & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-950 p-2 rounded-2xl border border-white/5">
        <div className="flex items-center gap-1">
          {[
            { id: 'list', label: 'List View' },
            { id: 'kanban', label: 'Kanban Board' },
            { id: 'dependencies', label: 'Dependency Graph' }
          ].map(v => (
            <button
              key={v.id}
              onClick={() => setViewMode(v.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === v.id
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs">
          {['all', 'In Progress', 'Blocked', 'Completed'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterStatus === st ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode: Dependency Graph */}
      {viewMode === 'dependencies' && (
        <DependencyGraph />
      )}

      {/* View Mode: List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="glass-card rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    task.priority === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : task.priority === 'High'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}>
                    {task.priority} Priority
                  </span>

                  <span className="text-xs font-mono text-slate-400">
                    Due: {task.dueDate} · {task.projectName}
                  </span>

                  {task.verifiedByAi && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> AI Verified
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-100">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  {task.description}
                </p>

                {/* Evidence snippet */}
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                  <span className="text-brand-400">Evidence ({task.evidence.timestamp}):</span>
                  <span>“{task.evidence.quote}”</span>
                </div>
              </div>

              {/* Right: Owner & Status Action */}
              <div className="flex items-center gap-4 flex-shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                <div className="flex items-center gap-2">
                  <img
                    src={task.owner.avatar}
                    alt={task.owner.name}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/10"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200">{task.owner.name}</div>
                    <div className="text-[10px] text-slate-400">{task.owner.role}</div>
                  </div>
                </div>

                {/* Status Dropdown */}
                <select
                  value={task.status}
                  onChange={e => handleStatusChange(task.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${
                    task.status === 'Completed'
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      : task.status === 'Blocked'
                      ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                      : 'bg-brand-950/60 border-brand-500/40 text-brand-300'
                  }`}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Mode: Kanban */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Not Started', 'In Progress', 'Completed'].map(col => {
            const colTasks = tasks.filter(t => t.status === col);
            return (
              <div key={col} className="bg-dark-950/80 rounded-2xl border border-white/5 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <span>{col}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-400 font-mono">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colTasks.map(t => (
                    <div key={t.id} className="p-4 rounded-xl bg-dark-850 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-brand-300 font-mono">
                          {t.priority}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{t.dueDate}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-100">{t.title}</div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                        <span className="text-slate-400 text-[11px]">{t.owner.name}</span>
                        {t.verifiedByAi && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Workload Balance Modal */}
      <WorkloadBalanceModal
        isOpen={isWorkloadModalOpen}
        onClose={() => setIsWorkloadModalOpen(false)}
      />
    </div>
  );
};
