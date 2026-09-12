import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MeetingProvider, useMeeting } from './context/MeetingContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { MainLayout } from './components/layout/MainLayout';
import { NavTab } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { DashboardPage } from './pages/DashboardPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { MeetingDetailPage } from './pages/MeetingDetailPage';
import { DecisionsPage } from './pages/DecisionsPage';
import { TasksPage } from './pages/TasksPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { AIOperatorPage } from './pages/AIOperatorPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TeamPage } from './pages/TeamPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LiveMeetingRoom } from './components/meetings/LiveMeetingRoom';
import { Meeting } from './types';
import { Sparkles, CheckCircle2, ArrowRight, Play, X, Bot } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, loadDemoSession } = useAuth();
  const { meetings } = useMeeting();
  const { showToast } = useToast();

  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'onboarding' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isLiveMeetingOpen, setIsLiveMeetingOpen] = useState(false);
  const [isInteractiveDemoActive, setIsInteractiveDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(1);

  // 13-Step Interactive Demo Story Runner
  const startInteractiveDemo = async () => {
    setIsInteractiveDemoActive(true);
    setDemoStep(1);
    await loadDemoSession();
    setCurrentView('app');
    setActiveTab('dashboard');
    showToast('Interactive Demo Story Started! Follow guided tour.', 'ai', 'AuraPay Demo');
  };

  const handleNextDemoStep = () => {
    const next = demoStep + 1;
    setDemoStep(next);

    if (next === 2) {
      setActiveTab('dashboard');
      showToast('Step 2: Dashboard identifies 2 high-risk tasks approaching deadlines.', 'info');
    } else if (next === 3) {
      setActiveTab('meetings');
      if (meetings.length > 0) setSelectedMeeting(meetings[0]);
      showToast('Step 3: Opening Sprint 24 Planning Meeting Digital Twin.', 'info');
    } else if (next === 4) {
      setActiveTab('decisions');
      showToast('Step 4: AI DecisionAgent extracts approved delivery cutoffs.', 'ai');
    } else if (next === 5) {
      setActiveTab('tasks');
      showToast('Step 5: TaskAgent assigns Priya Sharma with 96% match rationale.', 'ai');
    } else if (next === 6) {
      setActiveTab('tasks');
      showToast('Step 6: User confirms priority and dependencies.', 'success');
    } else if (next === 7) {
      setActiveTab('projects');
      showToast('Step 7: Task integrated into AuraPay Core Platform roadmap.', 'info');
    } else if (next === 8) {
      setActiveTab('tasks');
      showToast('Step 8: Downstream QA testing flagged as Blocked.', 'warning');
    } else if (next === 9) {
      setActiveTab('simulator');
      showToast('Step 9: Running What-If Simulator on +3 days delay impact.', 'ai');
    } else if (next === 10) {
      setActiveTab('approvals');
      showToast('Step 10: Workload Optimizer drafts reassignment to Arun.', 'ai');
    } else if (next === 11) {
      setActiveTab('approvals');
      showToast('Step 11: Human manager approves workload rebalance.', 'success');
    } else if (next === 12) {
      setActiveTab('meetings');
      showToast('Step 12: Next meeting agenda generated automatically.', 'ai');
    } else if (next === 13) {
      setActiveTab('dashboard');
      showToast('Step 13: Decision $\to$ Execution $\to$ Verification complete!', 'success');
    }
  };

  // Demo step descriptions
  const demoDescriptions = [
    '',
    'Step 1: Authenticated into AuraPay Platform workspace.',
    'Step 2: Dashboard Attention Center alerts: "2 tasks are at risk".',
    'Step 3: Inspecting Sprint 24 Planning Meeting Digital Twin.',
    'Step 4: Decision detected: "Payment API must be completed by Friday 4 PM".',
    'Step 5: AI creates structured action item and matches recommended owner.',
    'Step 6: Confirmed Priya Sharma as Lead Backend owner (91% on-time rate).',
    'Step 7: Task appears in Project Roadmap and Execution Timeline.',
    'Step 8: Testing dependency is blocked until API deploy.',
    'Step 9: What-If Simulator predicts 2-day client demo slip.',
    'Step 10: AI prepares Workload Rebalancing proposal in Approval Center.',
    'Step 11: Human approves reassigning QA tests to Arun (41% capacity).',
    'Step 12: Next meeting brief automatically includes pending questions.',
    'Step 13: Decision $\to$ Execution $\to$ Verification loop complete!'
  ];

  if (currentView === 'landing' && !isAuthenticated) {
    return (
      <LandingPage
        onStartFree={() => setCurrentView('onboarding')}
        onLaunchDemo={startInteractiveDemo}
        onLogin={() => setCurrentView('auth')}
      />
    );
  }

  if (currentView === 'auth') {
    return (
      <AuthPage
        onSuccess={() => {
          setCurrentView('app');
          setActiveTab('dashboard');
        }}
        onLaunchDemo={startInteractiveDemo}
      />
    );
  }

  if (currentView === 'onboarding') {
    return (
      <OnboardingWizard
        onComplete={() => {
          setCurrentView('app');
          setActiveTab('dashboard');
        }}
      />
    );
  }

  return (
    <MainLayout
      activeTab={activeTab}
      setActiveTab={(t) => {
        setSelectedMeeting(null);
        setActiveTab(t);
      }}
      startInteractiveDemo={startInteractiveDemo}
    >
      {/* Interactive Guided Demo Tour Bar if active */}
      {isInteractiveDemoActive && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-brand-950/90 via-dark-850 to-indigo-950/90 border border-brand-500/50 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-up glow-brand">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-300 font-extrabold flex items-center justify-center font-mono border border-brand-500/40">
              {demoStep}/13
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Interactive Master Demo Walkthrough
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  Step {demoStep} of 13
                </span>
              </div>
              <p className="text-xs text-brand-200 mt-0.5 font-medium">
                {demoDescriptions[demoStep]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsInteractiveDemoActive(false)}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Exit Tour
            </button>
            {demoStep < 13 ? (
              <button
                onClick={handleNextDemoStep}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-brand-500/30 transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsInteractiveDemoActive(false);
                  showToast('Demo completed! Explore all features freely.', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Demo</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Selected Meeting Digital Twin View Override */}
      {selectedMeeting ? (
        <MeetingDetailPage
          meeting={selectedMeeting}
          onBack={() => setSelectedMeeting(null)}
        />
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <DashboardPage
              setActiveTab={setActiveTab}
              openAIChat={() => {}}
              openLiveMeeting={() => setIsLiveMeetingOpen(true)}
            />
          )}

          {activeTab === 'meetings' && (
            <MeetingsPage
              onSelectMeeting={(m) => setSelectedMeeting(m)}
              openLiveMeeting={() => setIsLiveMeetingOpen(true)}
            />
          )}

          {activeTab === 'decisions' && <DecisionsPage />}

          {activeTab === 'tasks' && <TasksPage />}

          {activeTab === 'simulator' && <SimulatorPage />}

          {activeTab === 'ai-operator' && <AIOperatorPage setActiveTab={setActiveTab} />}

          {activeTab === 'approvals' && <ApprovalsPage />}

          {activeTab === 'knowledge' && <KnowledgePage />}

          {activeTab === 'projects' && <ProjectsPage />}

          {activeTab === 'team' && <TeamPage />}

          {activeTab === 'analytics' && <AnalyticsPage />}

          {activeTab === 'integrations' && <IntegrationsPage />}

          {activeTab === 'settings' && <SettingsPage />}

          {activeTab === 'risks' && (
            <div className="space-y-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Project Risk Register & Delay Telemetry
              </h1>
              <SimulatorPage />
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Cross-Meeting Unresolved Questions
              </h1>
              <DecisionsPage />
            </div>
          )}
        </>
      )}

      {/* Live Meeting Room Studio Modal */}
      {isLiveMeetingOpen && (
        <LiveMeetingRoom
          onFinishMeeting={(meetingId) => {
            setIsLiveMeetingOpen(false);
            if (meetings.length > 0) setSelectedMeeting(meetings[0]);
          }}
          onClose={() => setIsLiveMeetingOpen(false)}
        />
      )}
    </MainLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MeetingProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </MeetingProvider>
    </AuthProvider>
  );
}
