import React, { useState } from 'react';
import { Image, Sparkles, X, CheckCircle2, ArrowRight, Layers, Bot, Upload } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface WhiteboardUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onExtracted?: (result: any) => void;
}

export const WhiteboardUploader: React.FC<WhiteboardUploaderProps> = ({
  isOpen,
  onClose,
  onExtracted
}) => {
  const { showToast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string>(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    setIsProcessing(true);
    try {
      const res = await api.analyzeWhiteboard(selectedImage);
      setAnalysisResult(res);
      showToast('Vision AI extracted architecture diagram and tasks!', 'ai', 'Whiteboard Vision');
      onExtracted && onExtracted(res);
    } catch (err) {
      console.error(err);
      showToast('Failed to analyze whiteboard image', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-dark-900 border border-white/15 shadow-2xl p-6 overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <Layers className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Multimodal Whiteboard & Architecture Vision AI
              </h3>
              <p className="text-xs text-slate-400">
                Upload whiteboard photos or system diagrams to extract components & tasks
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Preview & Upload Area */}
        <div className="mt-4 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-dark-950 flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Whiteboard Architecture"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-brand-300 border border-white/10">
              Architecture Whiteboard v2.0
            </div>
          </div>

          {!analysisResult && (
            <button
              onClick={handleAnalyze}
              disabled={isProcessing}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>Processing Whiteboard with Multimodal Vision AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Diagram & Extract Structured Architecture</span>
                </>
              )}
            </button>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <div className="p-4 rounded-2xl bg-dark-850 border border-brand-500/30 space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Vision AI Extracted 6 Architecture Components:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {analysisResult.detectedComponents.map((comp: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-slate-200 font-mono"
                  >
                    {comp}
                  </span>
                ))}
              </div>

              <div className="text-xs text-slate-300 bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
                <strong>Architecture Summary:</strong> {analysisResult.architectureSummary}
              </div>

              <div>
                <div className="text-xs font-bold text-slate-300 mb-1">
                  Automatically Suggested Implementation Tasks:
                </div>
                <div className="space-y-1.5">
                  {analysisResult.suggestedTasks.map((task: string, i: number) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20 text-xs text-brand-200 flex items-center justify-between"
                    >
                      <span>• {task}</span>
                      <span className="text-[10px] font-mono text-brand-400 font-bold">Auto-Create</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors"
                >
                  Attach Architecture to Meeting
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
