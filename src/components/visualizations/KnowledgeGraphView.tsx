import React, { useState, useEffect, useRef } from 'react';
import { Brain, Layers, Filter, Search, Sparkles, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { api } from '../../services/api';
import { KnowledgeNode, KnowledgeEdge } from '../../types';

export const KnowledgeGraphView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [edges, setEdges] = useState<KnowledgeEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const data = await api.getKnowledgeGraph();
        setNodes(data.nodes);
        setEdges(data.edges);
        if (data.nodes.length > 0) {
          setSelectedNode(data.nodes[0]);
        }
      } catch (err) {
        console.error('Failed to load knowledge graph', err);
      }
    };
    fetchGraph();
  }, []);

  // Filtered nodes
  const filteredNodes = nodes.filter(n => {
    const matchesType = filterType === 'all' || n.type.toLowerCase() === filterType.toLowerCase();
    const matchesSearch = !searchFilter || n.label.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesType && matchesSearch;
  });

  const nodeColorMap: Record<string, { bg: string; border: string; text: string }> = {
    Meeting: { bg: '#3b82f6', border: '#60a5fa', text: '#dbeafe' },
    Decision: { bg: '#6366f1', border: '#818cf8', text: '#e0e7ff' },
    Task: { bg: '#8b5cf6', border: '#a78bfa', text: '#ede9fe' },
    Person: { bg: '#10b981', border: '#34d399', text: '#d1fae5' },
    Project: { bg: '#f59e0b', border: '#fbbf24', text: '#fef3c7' },
    Document: { bg: '#ec4899', border: '#f472b6', text: '#fce7f3' }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
      {/* Header with Search & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Cross-Meeting Organizational Memory & Knowledge Graph
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamic associative network linking People, Meetings, Decisions, Projects, and Deliverables
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-xl border border-white/5 text-xs">
            {['all', 'Meeting', 'Decision', 'Task', 'Person', 'Project'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filterType === t
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive 2D Node Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Node Explorer Matrix */}
        <div className="lg:col-span-2 bg-dark-950/70 rounded-2xl border border-white/5 p-4 min-h-[380px] flex flex-col justify-between">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[350px] p-1">
            {filteredNodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const color = nodeColorMap[node.type] || nodeColorMap.Meeting;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{
                    borderColor: isSelected ? color.border : 'rgba(255,255,255,0.08)'
                  }}
                  className={`p-3 rounded-xl bg-dark-850/80 border hover:scale-102 transition-all cursor-pointer shadow-md relative overflow-hidden group ${
                    isSelected ? 'ring-2 ring-brand-500/40 glow-brand' : ''
                  }`}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: color.bg }}
                  ></div>

                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1 mt-1">
                    <span style={{ color: color.text }}>{node.type}</span>
                    <span className="text-slate-400 font-mono">{node.status || 'Active'}</span>
                  </div>

                  <div className="text-xs font-bold text-slate-100 line-clamp-1 group-hover:text-brand-300 transition-colors">
                    {node.label}
                  </div>

                  {node.sublabel && (
                    <div className="text-[10px] text-slate-400 mt-1 truncate">
                      {node.sublabel}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-white/5 flex items-center justify-between">
            <span>Showing {filteredNodes.length} associative nodes & 12 relationship edges</span>
            <span className="font-mono text-brand-400">Knowledge Engine: Online</span>
          </div>
        </div>

        {/* Selected Node Inspector Drawer */}
        <div className="bg-dark-850/90 rounded-2xl border border-white/10 p-4 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                  {selectedNode.type} Node
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedNode.id}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-100">
                  {selectedNode.label}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedNode.sublabel || 'Active entity within AuraPay Core Platform memory context.'}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="text-[11px] font-bold text-slate-300">Connected Associations:</div>
                {edges
                  .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                  .map(e => {
                    const otherNodeId = e.source === selectedNode.id ? e.target : e.source;
                    const otherNode = nodes.find(n => n.id === otherNodeId);
                    return (
                      <div
                        key={e.id}
                        className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] flex items-center justify-between"
                      >
                        <span className="text-brand-300 font-mono">[{e.relation}]</span>
                        <span className="text-slate-200 font-medium truncate max-w-[140px]">
                          {otherNode?.label || otherNodeId}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-400">
              Click any node to inspect semantic cross-meeting connections.
            </div>
          )}

          <button
            onClick={() => {}}
            className="w-full mt-4 py-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold transition-colors"
          >
            Query Related Memory in AI Operator $\to$
          </button>
        </div>
      </div>
    </div>
  );
};
