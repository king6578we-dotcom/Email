import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Inbox,
  Send,
  FileEdit,
  Star,
  Clock,
  PieChart,
  Calendar,
} from 'lucide-react';
import { AnalyticsData } from '../../types';
import { formatDate } from '../../lib/utils';

interface AnalyticsViewProps {
  analytics: AnalyticsData | null;
  loading: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics, loading }) => {
  const overview = analytics?.overview || {
    totalEmails: 0,
    draftsCount: 0,
    sentCount: 0,
    favoritesCount: 0,
  };

  const total = overview.totalEmails || 1;
  const deliveryRate = overview.totalEmails > 0
    ? Math.round((overview.sentCount / overview.totalEmails) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-brand-violet flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-navy-900 tracking-tight">
              Email Analytics & Productivity Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Authorized, aggregated metrics on drafting speed, categories, and verified delivery volume.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          Last 7 Days (Live Sync)
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Total Produced
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-navy-900">{overview.totalEmails}</span>
            <Inbox className="w-5 h-5 text-brand-blue" />
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">All correspondence generated</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Active Drafts
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-navy-900">{overview.draftsCount}</span>
            <FileEdit className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Saved and pending final dispatch</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Confirmed Sent
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-navy-900">{overview.sentCount}</span>
            <Send className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Accepted by SMTP mail server</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Delivery Conversion
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-navy-900">{deliveryRate}%</span>
            <TrendingUp className="w-5 h-5 text-brand-violet" />
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Ratio of drafts to sent correspondence</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Timeline Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
          <h3 className="text-base font-bold text-navy-900 mb-1">Weekly Drafting Activity</h3>
          <p className="text-xs text-slate-500 mb-6">Volume of correspondence created per day</p>

          {analytics?.weeklyActivity && analytics.weeklyActivity.length > 0 ? (
            <div className="flex items-end justify-between gap-3 h-52 px-2 pt-6">
              {analytics.weeklyActivity.map((day, idx) => {
                const max = Math.max(1, ...analytics.weeklyActivity.map((d) => d.count));
                const pct = Math.max(10, Math.round((day.count / max) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-xs font-bold text-navy-900 opacity-0 group-hover:opacity-100 transition">
                      {day.count}
                    </span>
                    <div className="w-full max-w-[44px] bg-slate-100 rounded-t-xl h-36 flex items-end">
                      <div
                        style={{ height: `${pct}%` }}
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          day.count > 0 ? 'bg-gradient-to-t from-brand-blue to-brand-violet shadow-xs' : 'bg-slate-200'
                        }`}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{day.day}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-xs text-slate-400">
              No activity telemetry recorded yet.
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
          <h3 className="text-base font-bold text-navy-900 mb-1">Category Distribution</h3>
          <p className="text-xs text-slate-500 mb-6">Breakdown of communication focus areas</p>

          {analytics?.categories && analytics.categories.length > 0 ? (
            <div className="space-y-4">
              {analytics.categories.map((cat, idx) => {
                const pct = Math.round((cat.count / total) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-navy-900">{cat.category}</span>
                      <span className="text-slate-500 font-mono">
                        {cat.count} emails ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-blue to-brand-violet rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-xs text-slate-400">
              Categories will populate as you create emails.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
