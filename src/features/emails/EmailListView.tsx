import React, { useState, useEffect } from 'react';
import {
  Inbox,
  FileEdit,
  Send,
  Star,
  Archive,
  Trash2,
  Search,
  Filter,
  Eye,
  RotateCcw,
  Copy,
  Download,
  Plus,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Email, EmailCategory } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate, exportToPdf, exportToTxt } from '../../lib/utils';

interface EmailListViewProps {
  initialTab?: 'all' | 'drafts' | 'favorites' | 'history' | 'archive' | 'trash';
  onOpenEmail: (id: string) => void;
  onNewEmail: () => void;
}

export const EmailListView: React.FC<EmailListViewProps> = ({
  initialTab = 'all',
  onOpenEmail,
  onNewEmail,
}) => {
  const { showToast } = useToast();
  const [tab, setTab] = useState(initialTab);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        page,
        limit: 12,
        search,
      };

      if (category !== 'all') params.category = category;

      if (tab === 'drafts') params.status = 'draft';
      else if (tab === 'history') params.status = 'sent';
      else if (tab === 'favorites') params.isFavorite = true;
      else if (tab === 'archive') params.isArchived = true;
      else if (tab === 'trash') params.isDeleted = true;

      const res = await api.emails.list(params);
      setEmails(res || []);
    } catch (err: any) {
      showToast('Failed to load emails: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [tab, page, category]);

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await api.emails.favorite(id);
      setEmails((prev) => prev.map((item) => (item._id === id ? { ...item, isFavorite: updated.isFavorite } : item)));
      showToast(updated.isFavorite ? 'Added to favorites' : 'Removed from favorites', 'success');
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    }
  };

  const handleToggleArchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await api.emails.archive(id);
      setEmails((prev) => prev.filter((item) => item._id !== id));
      showToast(updated.isArchived ? 'Email moved to archive' : 'Email unarchived', 'success');
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (tab === 'trash') {
        if (!window.confirm('Permanently delete this email? This cannot be undone.')) return;
        await api.emails.permanentDelete(id);
        showToast('Email permanently deleted', 'success');
      } else {
        await api.emails.delete(id);
        showToast('Email moved to trash', 'success');
      }
      setEmails((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      showToast('Delete error: ' + err.message, 'error');
    }
  };

  const handleRestore = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.emails.restore(id);
      setEmails((prev) => prev.filter((item) => item._id !== id));
      showToast('Email restored from trash', 'success');
    } catch (err: any) {
      showToast('Restore error: ' + err.message, 'error');
    }
  };

  const handleDuplicate = async (email: Email, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const duplicated = await api.emails.create({
        ...email,
        _id: undefined,
        title: `${email.title} (Copy)`,
        status: 'draft',
      });
      setEmails((prev) => [duplicated, ...prev]);
      showToast('Email duplicated successfully', 'success');
    } catch (err: any) {
      showToast('Duplicate error: ' + err.message, 'error');
    }
  };

  const tabs = [
    { id: 'all', label: 'All Emails', icon: Inbox },
    { id: 'drafts', label: 'Drafts', icon: FileEdit },
    { id: 'history', label: 'Sent History', icon: Send },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold">
              <Inbox className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-navy-900 tracking-tight">
              My Email Correspondence
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Manage your drafts, delivered communications, and categorized archives.
          </p>
        </div>

        <button
          onClick={onNewEmail}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-blue-600 shadow-sm shadow-brand-blue/25 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Write New Email
        </button>
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id as any);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
                  isActive
                    ? 'bg-blue-50 text-brand-blue border border-blue-200/60 shadow-xs'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchEmails()}
              placeholder="Search by topic, subject, or recipient..."
              className="w-full pl-9 pr-4 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-400">Category:</span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Job and Career">Job & Career</option>
              <option value="Business and Corporate">Business & Corporate</option>
              <option value="Education">Education</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Sales and Marketing">Sales & Marketing</option>
              <option value="Personal and Everyday">Personal & Everyday</option>
              <option value="Legal, Finance, and Administration">Legal & Finance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Emails Table / Card Grid */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 h-24 animate-pulse" />
          ))}
        </div>
      ) : emails.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-navy-900">No emails found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {tab === 'trash'
              ? 'Your trash is completely empty.'
              : 'Create a new email draft or adjust your search filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {emails.map((email) => (
            <div
              key={email._id}
              onClick={() => onOpenEmail(email._id)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-subtle hover:shadow-premium hover:border-slate-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <button
                  onClick={(e) => handleToggleFavorite(email._id, e)}
                  className={`p-1 rounded-lg transition mt-0.5 ${
                    email.isFavorite
                      ? 'text-amber-400 hover:text-amber-500'
                      : 'text-slate-300 hover:text-amber-400'
                  }`}
                  title={email.isFavorite ? 'Favorited' : 'Add to favorites'}
                >
                  <Star className={`w-4 h-4 ${email.isFavorite ? 'fill-amber-400' : ''}`} />
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-navy-900 group-hover:text-brand-blue transition truncate">
                      {email.title || email.subject || 'Untitled Email'}
                    </h3>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md shrink-0 ${
                        email.status === 'sent'
                          ? 'bg-emerald-50 text-emerald-700'
                          : email.status === 'draft'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {email.status}
                    </span>

                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[140px] hidden md:inline">
                      {email.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 truncate mb-1.5">
                    {email.subject ? (
                      <span className="font-semibold text-navy-900 mr-1.5">{email.subject} —</span>
                    ) : null}
                    {email.body ? email.body.replace(/\n+/g, ' ') : 'No content'}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    {email.recipientEmail && (
                      <span>To: {email.recipientEmail}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(email.updatedAt)}
                    </span>
                    <span>v{email.versionCount || 1}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                {tab === 'trash' ? (
                  <>
                    <button
                      onClick={(e) => handleRestore(email._id, e)}
                      className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                      title="Restore email"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(email._id, e)}
                      className="p-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition"
                      title="Permanently delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => handleDuplicate(email, e)}
                      className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-navy-900 transition"
                      title="Duplicate email"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportToPdf(email.title, email.subject, email.body, email.recipientEmail);
                      }}
                      className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-navy-900 transition"
                      title="Export as PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleToggleArchive(email._id, e)}
                      className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-navy-900 transition"
                      title={email.isArchived ? 'Unarchive' : 'Archive'}
                    >
                      <Archive className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleDelete(email._id, e)}
                      className="p-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition"
                      title="Move to trash"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
