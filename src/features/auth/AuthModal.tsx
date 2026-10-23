import React, { useState } from 'react';
import { Lock, Mail, User as UserIcon, Send, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        showToast('Welcome back! Successfully signed in.', 'success');
        onClose();
      } else if (mode === 'register') {
        await register(name, email, password);
        showToast('Account created successfully! Welcome to ScribeAI.', 'success');
        onClose();
      } else if (mode === 'forgot') {
        await api.auth.forgotPassword(email);
        setForgotSent(true);
        showToast('Password reset link issued.', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/45 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-elevated border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-navy-900 transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-violet text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-brand-blue/20">
            <Send className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-navy-900 tracking-tight">
            {mode === 'login'
              ? 'Welcome back to ScribeAI'
              : mode === 'register'
              ? 'Create your ScribeAI Account'
              : 'Reset your Password'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login'
              ? 'Enter your credentials to access your email studio and drafts'
              : mode === 'register'
              ? 'Start generating and managing high-converting professional emails'
              : 'Enter your registered email to receive recovery instructions'}
          </p>
        </div>

        {/* Tab switch */}
        {mode !== 'forgot' && (
          <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                mode === 'login' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500 hover:text-navy-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                mode === 'register' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500 hover:text-navy-900'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {forgotSent ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-xs text-slate-600">
              If an account with that email exists, password reset instructions have been issued.
            </p>
            <button
              onClick={() => {
                setForgotSent(false);
                setMode('login');
              }}
              className="text-xs font-bold text-brand-blue hover:underline"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Connor"
                    className="w-full pl-9 pr-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-navy-900">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-brand-blue font-semibold hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none"
                    required
                    minLength={8}
                  />
                </div>
                {mode === 'register' && (
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Must be 8+ chars with uppercase & number
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-violet text-white font-bold text-xs hover:opacity-95 shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing...'
              ) : mode === 'login' ? (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              ) : mode === 'register' ? (
                'Create Account'
              ) : (
                'Send Recovery Link'
              )}
            </button>

            {mode === 'forgot' && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-500 hover:text-navy-900 font-medium"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
