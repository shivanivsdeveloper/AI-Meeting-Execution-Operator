import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, User, CheckCircle2, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface AuthPageProps {
  onSuccess: () => void;
  onLaunchDemo: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onLaunchDemo }) => {
  const { login, register, loadDemoSession } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('shivani@meetflow.ai');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('VP of Engineering');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        showToast('Welcome back, Shivani!', 'success');
      } else {
        await register(name, email, role);
        showToast('Account created successfully! Welcome to MeetFlow AI.', 'success');
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      showToast('Authentication failed. Please verify credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    await loadDemoSession();
    showToast('Loaded AuraPay Platform demo workspace!', 'ai', 'AuraPay Demo');
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md rounded-3xl bg-dark-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl p-8 relative z-10 animate-slide-up">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-cyan p-0.5 shadow-xl shadow-brand-500/40 flex items-center justify-center mb-3">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-brand-400" />
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            MeetFlow AI
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' ? 'Sign in to your AI Execution Workspace' : 'Create your enterprise workspace'}
          </p>
        </div>

        {/* 1-Click Interactive Demo Sandbox Shortcut */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-3 mb-6 rounded-2xl bg-gradient-to-r from-brand-600/20 via-indigo-600/20 to-brand-500/20 hover:from-brand-600/30 hover:to-brand-500/30 text-brand-300 border border-brand-500/40 text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Play className="w-4 h-4 fill-current text-brand-400" />
          <span>Instant 1-Click Demo Login (AuraPay Platform)</span>
        </button>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-slate-400">or with email</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Shivani Narayanan"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Role in Organization
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="VP of Engineering">VP of Engineering</option>
                  <option value="Founder / CEO">Founder / CEO</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Lead Developer">Lead Developer</option>
                  <option value="Engineering Manager">Engineering Manager</option>
                  <option value="QA / DevOps Lead">QA / DevOps Lead</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="shivani@meetflow.ai"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create Workspace Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <span>
              Don't have a workspace?{' '}
              <button
                onClick={() => setMode('register')}
                className="font-bold text-brand-400 hover:text-brand-300"
              >
                Register Now
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-bold text-brand-400 hover:text-brand-300"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
