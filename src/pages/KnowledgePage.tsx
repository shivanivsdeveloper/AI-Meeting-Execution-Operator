import React from 'react';
import { Brain, Search, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { KnowledgeGraphView } from '../components/visualizations/KnowledgeGraphView';

export const KnowledgePage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Organizational Memory & Knowledge Graph
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore associative links across all past meetings, decisions, team members, and deliverables.
          </p>
        </div>
      </div>

      <KnowledgeGraphView />
    </div>
  );
};
