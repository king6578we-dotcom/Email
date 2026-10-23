import React from 'react';
import {
  PenTool,
  Sparkles,
  Layers,
  Wand2,
  Inbox,
  FileEdit,
  Send,
  Star,
  ArrowUpRight,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { AnalyticsData } from '../../types';
import { formatDate } from '../../lib/utils';

interface DashboardViewProps {
  analytics: AnalyticsData | null;
  loading: boolean;
  onNavigate: (tab: any) => void;
  onNewEmail: () => void;
  onOpenAiModal: () => void;
  onOpenEmail: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  analytics,
  loading,
  onNavigate,
  onNewEmail,
  onOpenAiModal,
  onOpenEmail,
}) => {
  const overview = analytics?.overview || {
    totalEmails: 0,
    draftsCount: 0,
    sentCount: 0,
    favoritesCount: 0,
  };

  const statCards = [
    {
      label: 'Total Emails',
      value: overview.totalEmails,
      icon: Inbox,
      gradient: 'from-blue-600 to-indigo-600',
      bgLight: 'bg-blue-50 text-brand-blue',
      tab: 'my-emails',
    },
    {
      label: 'Drafts Saved',
      value: overview.draftsCount,
      icon: FileEdit,
      gradient: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50 text-amber-600',
      tab: 'drafts',
    },
    {
      label: 'Delivered / Sent',
      value: overview.sentCount,
      icon: Send,
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50 text-emerald-600',
      tab: 'history',
    },
    {
      label: 'Favorites',
      value: overview.favoritesCount,
      icon: Star,
      gradient: 'from-violet-600 to-purple-600',
      bgLight: 'bg-violet-50 text-brand-violet',
      tab: 'favorites',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-brand-blue text-white p-8 lg:p-10 shadow-elevated">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            AI Executive Communication Suite
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
            Draft, refine, and send emails with unmatched precision.
          </h1>
          <p className="text-blue-100/90 text-sm lg:text-base leading-relaxed mb-6 font-normal">
            Generate polished emails in 15 executive tones, draw from 70+ categorized industry templates, and manage communications with persistent version control.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNewEmail}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-navy-900 font-bold text-sm hover:bg-blue-50 shadow-md transition transform active:scale-95"
            >
              <PenTool className="w-4 h-4 text-brand-blue" />
              Write an Email
            </button>
            <button
              onClick={onOpenAiModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-violet text-white font-bold text-sm hover:bg-violet-700 shadow-md transition transform active:scale-95 border border-violet-400/30"
            >
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </button>
            <button
              onClick={() => onNavigate('templates')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white font-medium text-sm hover:bg-white/20 transition backdrop-blur-sm"
            >
              <Layers className="w-4 h-4" />
              Browse 70+ Templates
            </button>
          </div>
        </div>

        {/* Decorative background glows */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-brand-violet/20 blur-3xl pointer-events-none" />
        <div className="absolute right-40 top-0 w-80 h-80 rounded-full bg-brand-blue/30 blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(stat.tab)}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:shadow-premium hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`w-9 h-9 rounded-xl ${stat.bgLight} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-navy-900 tracking-tight">
                  {loading ? '...' : stat.value}
                </span>
                <span className="text-xs text-brand-blue flex items-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Start Panel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
        <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-brand-violet" />
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={onNewEmail}
            className="flex items-start gap-4 p-4 rounded-xl border border-slate-200/80 hover:border-brand-blue/40 hover:bg-blue-50/30 transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-navy-900 group-hover:text-brand-blue transition">
                Write a New Email
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Open distraction-free email editor with real-time stats
              </p>
            </div>
          </button>

          <button
            onClick={onOpenAiModal}
            className="flex items-start gap-4 p-4 rounded-xl border border-slate-200/80 hover:border-violet-300 hover:bg-violet-50/30 transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-brand-violet flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-navy-900 group-hover:text-brand-violet transition">
                Generate with AI
              </p>
              <p className="text-xs text-slate-500 mt-1">
                From topic to complete email in 15 executive tones
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('templates')}
            className="flex items-start gap-4 p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-navy-900 group-hover:text-indigo-600 transition">
                Browse Templates
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Explore 70+ proven career and business templates
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              onNewEmail();
            }}
            className="flex items-start gap-4 p-4 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-navy-900 group-hover:text-emerald-600 transition">
                Improve Existing Email
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Paste draft to polish grammar, clarity, and tone
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Two-Column Section: Weekly Activity & Recently Edited */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity & Categories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Activity Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-navy-900">Weekly Writing Activity</h3>
                <p className="text-xs text-slate-500">Emails and drafts created across the last 7 days</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-brand-blue">
                Real-Time
              </span>
            </div>

            {analytics?.weeklyActivity && analytics.weeklyActivity.length > 0 ? (
              <div className="flex items-end justify-between gap-2 h-44 pt-6 px-2">
                {analytics.weeklyActivity.map((day, idx) => {
                  const maxCount = Math.max(1, ...analytics.weeklyActivity.map((d) => d.count));
                  const heightPercent = Math.max(12, Math.round((day.count / maxCount) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-[11px] font-bold text-navy-900 opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.count}
                      </div>
                      <div className="w-full max-w-[40px] bg-slate-100 rounded-t-xl overflow-hidden h-32 flex items-end">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full transition-all duration-500 rounded-t-xl ${
                            day.count > 0
                              ? 'bg-gradient-to-t from-brand-blue to-brand-violet shadow-xs'
                              : 'bg-slate-200'
                          }`}
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-medium">{day.day}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-xs text-slate-400">
                No activity recorded yet this week. Start writing an email!
              </div>
            )}
          </div>

          {/* Most-Used Categories */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
            <h3 className="text-base font-bold text-navy-900 mb-1">Most-Used Categories</h3>
            <p className="text-xs text-slate-500 mb-4">Distribution of your correspondence by domain</p>

            {analytics?.categories && analytics.categories.length > 0 ? (
              <div className="space-y-3">
                {analytics.categories.map((cat, idx) => {
                  const total = analytics.overview.totalEmails || 1;
                  const pct = Math.round((cat.count / total) * 100);

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-navy-900">{cat.category}</span>
                        <span className="text-slate-500 font-mono">
                          {cat.count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-blue rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                Categorized stats will appear here as you create emails.
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Recently Edited Emails & Activity Feed */}
        <div className="space-y-6">
          {/* Recently Edited */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-navy-900">Recently Edited</h3>
              <button
                onClick={() => onNavigate('my-emails')}
                className="text-xs font-semibold text-brand-blue hover:underline"
              >
                View all
              </button>
            </div>

            {analytics?.recentlyEdited && analytics.recentlyEdited.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {analytics.recentlyEdited.map((email) => (
                  <div
                    key={email._id}
                    onClick={() => onOpenEmail(email._id)}
                    className="py-3 hover:bg-slate-50/80 rounded-xl px-2 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-bold text-navy-900 truncate group-hover:text-brand-blue transition">
                        {email.title || 'Untitled Draft'}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {formatDate(email.updatedAt)}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md shrink-0 ${
                        email.status === 'sent'
                          ? 'bg-emerald-50 text-emerald-700'
                          : email.status === 'draft'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {email.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                <FileEdit className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                No saved drafts yet. Click "Write an Email" above.
              </div>
            )}
          </div>

          {/* Recent Security Activity */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
            <h3 className="text-base font-bold text-navy-900 mb-1">Recent Activity</h3>
            <p className="text-xs text-slate-500 mb-4">Security and delivery audit log</p>

            {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {analytics.recentActivity.slice(0, 5).map((log) => (
                  <div key={log._id} className="flex items-start gap-2.5 text-xs">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        log.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-navy-900">{log.action.replace(/_/g, ' ')}</p>
                      <span className="text-[10px] text-slate-400">{formatDate(log.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-400">
                Log records will appear here as activity occurs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
