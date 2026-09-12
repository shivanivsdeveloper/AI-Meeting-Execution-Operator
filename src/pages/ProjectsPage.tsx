import React from 'react';
import { FolderKanban, CheckCircle2, AlertTriangle, Users, TrendingUp, Clock } from 'lucide-react';
import { INITIAL_PROJECTS } from '../../server/seedData';

export const ProjectsPage: React.FC = () => {
  const projects = INITIAL_PROJECTS;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Projects & Milestone Execution
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time project health, task completion rates, and milestone schedules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map(p => (
          <div key={p.id} className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full ${
                  p.scheduleStatus === 'On Track' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {p.scheduleStatus}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.description}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-extrabold text-white font-mono">{p.healthScore}%</div>
                <div className="text-[10px] text-slate-400 font-semibold">Health Score</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Overall Progress</span>
                <span className="font-mono font-bold text-brand-400">{p.progressPercentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-dark-950 rounded-full overflow-hidden border border-white/5">
                <div
                  style={{ width: `${p.progressPercentage}%` }}
                  className="h-full bg-gradient-to-r from-brand-500 to-accent-cyan rounded-full"
                ></div>
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="text-xs font-bold text-slate-200">Milestone Deliverables:</div>
              <div className="space-y-2">
                {p.milestones.map((m, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-dark-850 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {m.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500" />
                      )}
                      <span className={m.completed ? 'text-slate-400 line-through' : 'text-slate-200 font-medium'}>
                        {m.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{m.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
