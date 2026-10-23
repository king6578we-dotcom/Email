import React from 'react';
import { ShieldCheck, Lock, Key, Server, EyeOff, Activity, CheckCircle2 } from 'lucide-react';
import { AnalyticsData } from '../../types';
import { formatDate } from '../../lib/utils';

interface SecurityCenterViewProps {
  analytics: AnalyticsData | null;
}

export const SecurityCenterView: React.FC<SecurityCenterViewProps> = ({ analytics }) => {
  const securityFeatures = [
    {
      title: 'Password Hashing & Salt Protection',
      desc: 'Passwords hashed with high-work-factor bcrypt/Argon2 salts. Never stored in plaintext or reversible formats.',
      status: 'Active',
      icon: Lock,
    },
    {
      title: 'HttpOnly & SameSite Cookie Sessions',
      desc: 'Session tokens are strictly secured against client-side script inspection (XSS immunity) using HttpOnly and SameSite flags.',
      status: 'Active',
      icon: Key,
    },
    {
      title: 'NoSQL & Header Injection Safeguards',
      desc: 'Strict Zod schema validation, ObjectId validation, and header line-break sanitization prevent header manipulation.',
      status: 'Enforced',
      icon: Server,
    },
    {
      title: 'Strict User Data Isolation',
      desc: 'Every database query enforces server-side ownership checks. Cross-tenant access is rejected at API level.',
      status: 'Enforced',
      icon: EyeOff,
    },
    {
      title: 'Explicit Email Delivery Confirmation',
      desc: 'Emails are never sent automatically. Human review and explicit confirmedByUser checkbox are required prior to dispatch.',
      status: 'Mandatory',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-navy-900 tracking-tight">Security & Governance Center</h1>
          </div>
          <p className="text-xs text-slate-500">
            Real-time security telemetry, authentication safeguards, and compliance event logs.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Zero-Trust Policies Active
        </div>
      </div>

      {/* Security Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityFeatures.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-navy-900">{feat.title}</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {feat.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Security Audit Feed */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-violet" />
            <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
              Security Audit Event Log
            </h2>
          </div>
          <span className="text-xs text-slate-400">Authenticated account events</span>
        </div>

        {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {analytics.recentActivity.map((log) => (
              <div key={log._id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      log.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-navy-900 block">{log.action.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-400">Status: {log.status}</span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-mono">
                  {formatDate(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No critical security events recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};
