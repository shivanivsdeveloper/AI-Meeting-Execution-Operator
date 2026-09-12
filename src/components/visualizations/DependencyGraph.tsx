import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, ShieldAlert, User } from 'lucide-react';
import { useMeeting } from '../../context/MeetingContext';

export const DependencyGraph: React.FC = () => {
  const { tasks } = useMeeting();
  const [highlightedPath, setHighlightedPath] = useState<string | null>('tsk_01');

  const nodes = [
    {
      id: 'tsk_01',
      title: 'Payment API & Stripe v3',
      owner: 'Priya Sharma',
      status: 'In Progress',
      risk: 82,
      due: 'Friday',
      blockedBy: [],
      x: 50,
      y: 120
    },
    {
      id: 'tsk_02',
      title: 'E2E Regression Testing',
      owner: 'Arun Kumar',
      status: 'Blocked',
      risk: 78,
      due: 'Saturday',
      blockedBy: ['tsk_01'],
      x: 340,
      y: 60
    },
    {
      id: 'tsk_03',
      title: 'Checkout UI Staging Hookup',
      owner: 'Rahul Verma',
      status: 'In Progress',
      risk: 65,
      due: 'Friday',
      blockedBy: ['tsk_01'],
      x: 340,
      y: 180
    },
    {
      id: 'tsk_04',
      title: 'Client Demo Walkthrough',
      owner: 'Sarah Chen',
      status: 'Not Started',
      risk: 74,
      due: 'Monday',
      blockedBy: ['tsk_02', 'tsk_03'],
      x: 640,
      y: 120
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Task Dependency Graph & Blocker Cascade
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time critical path modeling. Delays in <span className="text-brand-300 font-semibold">Payment API</span> directly cascade to <span className="text-rose-400 font-semibold">Client Demo</span>.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span> Critical Bottleneck
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Blocked Task
          </div>
        </div>
      </div>

      {/* SVG Canvas for Dependency Graph */}
      <div className="relative w-full h-72 sm:h-80 bg-dark-950/60 rounded-xl border border-white/5 overflow-x-auto overflow-y-hidden p-4 flex items-center justify-center">
        <svg className="w-full h-full min-w-[700px]" viewBox="0 0 850 260">
          {/* Connector Arrows */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" opacity="0.8" />
            </marker>
            <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#f43f5e" opacity="0.9" />
            </marker>
          </defs>

          {/* Lines from tsk_01 to tsk_02 & tsk_03 */}
          <path
            d="M 230 140 C 285 140, 285 90, 340 90"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            markerEnd="url(#arrowhead-red)"
            className="animate-pulse"
          />
          <path
            d="M 230 140 C 285 140, 285 190, 340 190"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />

          {/* Lines from tsk_02 & tsk_03 to tsk_04 */}
          <path
            d="M 520 90 C 580 90, 580 140, 640 140"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            markerEnd="url(#arrowhead-red)"
          />
          <path
            d="M 520 190 C 580 190, 580 140, 640 140"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />

          {/* Render Nodes */}
          {nodes.map(node => {
            const isHovered = highlightedPath === node.id;
            const isBlocked = node.status === 'Blocked';
            const isCritical = node.risk >= 80;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y - 45})`}
                className="cursor-pointer transition-transform"
                onClick={() => setHighlightedPath(node.id)}
              >
                <rect
                  width="180"
                  height="90"
                  rx="14"
                  fill={isCritical ? '#181222' : '#101626'}
                  stroke={isCritical ? '#f43f5e' : isBlocked ? '#f59e0b' : '#6366f1'}
                  strokeWidth={isHovered ? '2.5' : '1.5'}
                  filter="drop-shadow(0 4px 12px rgba(0,0,0,0.5))"
                />

                <text x="12" y="24" fill="#f8fafc" fontSize="11" fontWeight="700">
                  {node.title.length > 22 ? node.title.substring(0, 20) + '...' : node.title}
                </text>

                <g transform="translate(12, 36)">
                  <text x="0" y="10" fill="#94a3b8" fontSize="10">
                    Owner: {node.owner}
                  </text>
                  <text x="0" y="24" fill="#94a3b8" fontSize="10">
                    Due: {node.due}
                  </text>
                </g>

                {/* Risk badge pill */}
                <rect
                  x="12"
                  y="66"
                  width="72"
                  height="16"
                  rx="8"
                  fill={isCritical ? 'rgba(244,63,94,0.2)' : isBlocked ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.2)'}
                />
                <text
                  x="48"
                  y="78"
                  textAnchor="middle"
                  fill={isCritical ? '#f43f5e' : isBlocked ? '#f59e0b' : '#818cf8'}
                  fontSize="9"
                  fontWeight="bold"
                >
                  Risk: {node.risk}%
                </text>

                {/* Status indicator */}
                <text
                  x="168"
                  y="78"
                  textAnchor="end"
                  fill={node.status === 'Completed' ? '#10b981' : '#94a3b8'}
                  fontSize="9"
                  fontWeight="600"
                >
                  {node.status}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>If <strong>Payment API</strong> slips by 24 hours, <strong>Client Demo</strong> is automatically delayed by 48 hours.</span>
        </div>
        <span className="text-[11px] font-mono text-brand-400 underline cursor-pointer">
          Simulate Delay $\to$
        </span>
      </div>
    </div>
  );
};
