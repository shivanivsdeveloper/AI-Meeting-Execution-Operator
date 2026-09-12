import React from 'react';
import { Users, Sparkles, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { INITIAL_USERS } from '../../server/seedData';

export const TeamPage: React.FC = () => {
  const users = INITIAL_USERS;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Team Workload & Capacity Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Objective workload balancing and skill matching without toxic employee scoreboards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(u => {
          const isOverloaded = u.currentWorkload >= 80;
          const isOptimal = u.currentWorkload < 60;

          return (
            <div key={u.id} className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{u.name}</h3>
                    <p className="text-xs text-slate-400">{u.role}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  isOverloaded ? 'bg-rose-500/20 text-rose-300' : isOptimal ? 'bg-emerald-500/20 text-emerald-300' : 'bg-brand-500/20 text-brand-300'
                }`}>
                  {u.currentWorkload}% Workload
                </span>
              </div>

              {/* Workload meter */}
              <div className="space-y-1">
                <div className="w-full h-2 bg-dark-950 rounded-full overflow-hidden border border-white/5">
                  <div
                    style={{ width: `${u.currentWorkload}%` }}
                    className={`h-full rounded-full ${
                      isOverloaded ? 'bg-rose-500' : isOptimal ? 'bg-emerald-500' : 'bg-brand-500'
                    }`}
                  ></div>
                </div>
              </div>

              {/* Skill tags */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Core Expertise:</div>
                <div className="flex flex-wrap gap-1.5">
                  {u.skills.map((s, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/5">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{u.activeTasksCount} Active Tasks</span>
                <span className="text-emerald-400 font-semibold">{u.onTimeCompletionRate}% On-Time</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
