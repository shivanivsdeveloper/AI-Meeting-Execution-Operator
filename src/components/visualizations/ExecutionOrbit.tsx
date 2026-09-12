import React, { useState } from 'react';
import { 
  Sparkles, CheckSquare, AlertTriangle, ShieldCheck, 
  Layers, Users, ArrowUpRight, Play, Info 
} from 'lucide-react';
import { useMeeting } from '../../context/MeetingContext';

interface ExecutionOrbitProps {
  onSelectNode?: (type: string) => void;
}

export const ExecutionOrbit: React.FC<ExecutionOrbitProps> = ({ onSelectNode }) => {
  const { decisions, tasks, risks, commitments, meetings } = useMeeting();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const activeMeeting = meetings[0];

  const nodes = [
    {
      id: 'decisions',
      title: 'Decisions',
      count: decisions.length,
      status: 'Active (97% Conf.)',
      color: 'from-blue-500 to-indigo-600',
      icon: <Sparkles className="w-4 h-4 text-blue-300" />,
      angle: 0, // top
      detail: 'Staging cutoff confirmed for Friday 4 PM to protect client demo.'
    },
    {
      id: 'tasks',
      title: 'Action Items',
      count: tasks.length,
      status: '4 Tracked',
      color: 'from-brand-500 to-purple-600',
      icon: <CheckSquare className="w-4 h-4 text-brand-300" />,
      angle: 72,
      detail: 'Priya assigned Payment API; Arun assigned automated regression.'
    },
    {
      id: 'risks',
      title: 'Risk Engine',
      count: risks.length,
      status: '82% High Risk',
      color: 'from-rose-500 to-red-600',
      icon: <AlertTriangle className="w-4 h-4 text-rose-300" />,
      angle: 144,
      detail: 'Testing dependency bottleneck if Friday delivery slips.'
    },
    {
      id: 'commitments',
      title: 'Commitments',
      count: commitments.length,
      status: '3 Active',
      color: 'from-amber-500 to-orange-600',
      icon: <Users className="w-4 h-4 text-amber-300" />,
      angle: 216,
      detail: 'Verbal promises extracted and timestamped with evidence.'
    },
    {
      id: 'execution',
      title: 'Verification',
      count: '94%',
      status: 'AI Certified',
      color: 'from-emerald-500 to-teal-600',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-300" />,
      angle: 288,
      detail: 'Completed items verified with zero human overhead.'
    }
  ];

  return (
    <div className="relative glass-card rounded-2xl p-6 overflow-hidden border border-white/10">
      {/* Background glow and subtle grid */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Signature Visual: Execution Orbit
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time orbital propagation from Meeting Center $\to$ Execution Nodes
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-brand-300">
          State: Synchronized
        </span>
      </div>

      {/* Orbit Visualization Container */}
      <div className="relative w-full h-80 sm:h-96 flex items-center justify-center my-2">
        {/* Orbital rings */}
        <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-brand-500/20 animate-spin" style={{ animationDuration: '60s' }}></div>
        <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-white/5 border-dashed"></div>

        {/* Central Meeting Core */}
        <div
          onClick={() => {
            setSelectedNode('meeting');
            onSelectNode && onSelectNode('meeting');
          }}
          className="relative z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-purple p-1 shadow-2xl shadow-brand-500/50 flex items-center justify-center cursor-pointer group hover:scale-105 transition-transform"
        >
          <div className="w-full h-full bg-dark-950 rounded-full flex flex-col items-center justify-center text-center p-2 border border-white/20">
            <Layers className="w-5 h-5 text-brand-400 mb-0.5 group-hover:animate-bounce" />
            <span className="text-[10px] uppercase font-bold text-brand-300 tracking-wider">Meeting</span>
            <span className="text-[11px] font-semibold text-white leading-tight line-clamp-1">
              Sprint 24
            </span>
            <span className="text-[9px] text-slate-400 font-mono">Live Sync</span>
          </div>
        </div>

        {/* Orbiting Satellite Nodes */}
        {nodes.map((node, index) => {
          // Calculate positions along a circle
          const radius = 130; // pixels from center (scales on desktop)
          const rad = (node.angle - 90) * (Math.PI / 180);
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;

          const isSelected = selectedNode === node.id;

          return (
            <div
              key={node.id}
              onClick={() => {
                setSelectedNode(node.id);
                onSelectNode && onSelectNode(node.id);
              }}
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
              className={`absolute z-20 cursor-pointer group transition-all duration-300 ${
                isSelected ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className={`p-2.5 sm:p-3 rounded-2xl bg-dark-850/90 backdrop-blur-xl border ${
                isSelected ? 'border-brand-400 glow-brand ring-2 ring-brand-500/50' : 'border-white/10 hover:border-white/25'
              } flex items-center gap-2.5 shadow-xl`}>
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${node.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  {node.icon}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                    {node.title}
                    <span className="text-[10px] font-mono text-brand-300">({node.count})</span>
                  </div>
                  <div className="text-[10px] font-medium text-slate-400">
                    {node.status}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Drawer / Info */}
      <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Info className="w-4 h-4 text-brand-400 flex-shrink-0" />
          <span>
            {selectedNode
              ? nodes.find(n => n.id === selectedNode)?.detail || 'Meeting center connected to 5 real-time execution nodes.'
              : 'Click any orbital node above to inspect live execution telemetry and rationale.'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
          Orbit ID: #orb_9942
        </span>
      </div>
    </div>
  );
};
