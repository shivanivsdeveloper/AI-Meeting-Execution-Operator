import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Bot, Users, Plug, ShieldCheck, Check } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState('VP of Engineering');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Meeting productivity',
    'Task management',
    'Decision tracking',
    'Risk management'
  ]);
  const [workspaceName, setWorkspaceName] = useState("Shivani's Workspace");
  const [autonomyLevel, setAutonomyLevel] = useState('ask_before_executing');

  const goalsList = [
    'Meeting productivity',
    'Task management',
    'Project execution',
    'Team accountability',
    'Decision tracking',
    'Client meetings',
    'Risk management'
  ];

  const handleToggleGoal = (g: string) => {
    setSelectedGoals(prev =>
      prev.includes(g) ? prev.filter(item => item !== g) : [...prev, g]
    );
  };

  const handleFinish = async () => {
    try {
      await api.submitOnboarding({
        role,
        goals: selectedGoals,
        workspaceName
      });
      showToast('Personalized AI Workspace initialized!', 'success');
      onComplete();
    } catch (err) {
      console.error(err);
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl bg-dark-900 border border-white/10 shadow-2xl p-8 animate-slide-up">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-500/30">
              0{currentStep}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Step {currentStep} of 4 · Onboarding
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`w-6 h-1.5 rounded-full transition-all ${
                  s === currentStep ? 'bg-brand-500 w-10' : s < currentStep ? 'bg-emerald-500' : 'bg-white/10'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Step 1: Role */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                What is your primary role?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                MeetFlow AI customizes executive summaries and risk briefings based on your perspective.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                'Founder / CEO',
                'VP of Engineering',
                'Product Manager',
                'Lead Developer',
                'QA / DevOps Lead',
                'Operations / HR'
              ].map(r => (
                <div
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-3.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    role === r
                      ? 'bg-brand-500/20 border-brand-500 text-white glow-brand'
                      : 'bg-dark-850 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  {r}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Goals */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                What are you trying to improve?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select all operational bottlenecks you want MeetFlow AI to automate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {goalsList.map(g => {
                const isSelected = selectedGoals.includes(g);
                return (
                  <div
                    key={g}
                    onClick={() => handleToggleGoal(g)}
                    className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-500/20 border-brand-500 text-white'
                        : 'bg-dark-850 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span>{g}</span>
                    {isSelected && <Check className="w-4 h-4 text-brand-400" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Workspace & Autonomy */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Configure Workspace & AI Autonomy
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Set how autonomously MeetFlow AI should create tasks, assign owners, and send updates.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={e => setWorkspaceName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                AI Autonomy Level
              </label>
              {[
                { id: 'suggest_only', label: 'Suggest Only (Passive recommendations)' },
                { id: 'ask_before_executing', label: 'Ask Before Executing (Recommended default)' },
                { id: 'execute_approved', label: 'Execute Approved Actions (High velocity)' },
                { id: 'fully_autonomous', label: 'Fully Autonomous Operator' }
              ].map(lvl => (
                <div
                  key={lvl.id}
                  onClick={() => setAutonomyLevel(lvl.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    autonomyLevel === lvl.id
                      ? 'bg-brand-500/20 border-brand-500 text-white'
                      : 'bg-dark-850 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {lvl.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Ready */}
        {currentStep === 4 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 to-accent-emerald mx-auto p-1 flex items-center justify-center shadow-2xl shadow-brand-500/40">
              <Bot className="w-8 h-8 text-white" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Your AI Execution Workspace is Ready
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Loaded with AuraPay Platform sprint meetings, decision evolution tracking, and predictive risk telemetry.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(s => s - 1)}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(s => s + 1)}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-500/30 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-2xl shadow-brand-500/40 transition-all"
            >
              <span>Enter MeetFlow Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
