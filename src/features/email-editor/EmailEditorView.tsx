import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  Send,
  Sparkles,
  Copy,
  Download,
  Star,
  Archive,
  History,
  Eye,
  Check,
  Undo2,
  Redo2,
  BookmarkPlus,
  RefreshCw,
  AlertCircle,
  FileText,
  Clock,
  ChevronDown,
  Wand2,
} from 'lucide-react';
import { Email, EmailCategory, EmailTone, EmailLength, EmailVersion } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { countWordsAndChars, exportToPdf, exportToTxt, formatDate } from '../../lib/utils';
import confetti from 'canvas-confetti';

interface EmailEditorViewProps {
  emailId?: string | null;
  onSaved: (email: Email) => void;
  onOpenAiModalWithContext?: (topic: string, recipient: string, category: string) => void;
}

export const EmailEditorView: React.FC<EmailEditorViewProps> = ({
  emailId,
  onSaved,
  onOpenAiModalWithContext,
}) => {
  const { showToast } = useToast();
  const { user } = useAuth();

  // State
  const [currentId, setCurrentId] = useState<string | null>(emailId || null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState(user?.name || '');
  const [category, setCategory] = useState<EmailCategory>('Business and Corporate');
  const [tone, setTone] = useState<EmailTone>('Professional');
  const [length, setLength] = useState<EmailLength>('Medium');
  const [language, setLanguage] = useState('English');
  const [purpose, setPurpose] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [referenceText, setReferenceText] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [status, setStatus] = useState<'draft' | 'saved' | 'sent' | 'archived'>('draft');

  // Autosave & Version State
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [historyStack, setHistoryStack] = useState<{ subject: string; body: string }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Modals
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  const [versions, setVersions] = useState<EmailVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  // Delivery Modal State
  const [confirmedSend, setConfirmedSend] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // AI Quick Assist State
  const [aiLoading, setAiLoading] = useState(false);
  const [subjectSuggestions, setSubjectSuggestions] = useState<string[]>([]);
  const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);

  const isInitialMount = useRef(true);

  // Load email if emailId provided
  useEffect(() => {
    if (emailId) {
      loadEmail(emailId);
    } else {
      resetEditor();
    }
  }, [emailId]);

  const resetEditor = () => {
    setCurrentId(null);
    setTitle('');
    setSubject('');
    setBody('');
    setRecipientName('');
    setRecipientEmail('');
    setSenderName(user?.name || '');
    setCategory('Business and Corporate');
    setTone((user?.settings?.defaultTone as EmailTone) || 'Professional');
    setLength((user?.settings?.defaultLength as EmailLength) || 'Medium');
    setLanguage('English');
    setPurpose('');
    setCallToAction('');
    setReferenceText('');
    setIsFavorite(false);
    setIsArchived(false);
    setStatus('draft');
    setSaveStatus('idle');
  };

  const loadEmail = async (id: string) => {
    try {
      setSaveStatus('saving');
      const data = await api.emails.get(id);
      setCurrentId(data._id);
      setTitle(data.title || '');
      setSubject(data.subject || '');
      setBody(data.body || '');
      setRecipientName(data.recipientName || '');
      setRecipientEmail(data.recipientEmail || '');
      setSenderName(data.senderName || user?.name || '');
      setCategory(data.category as EmailCategory);
      setTone(data.tone as EmailTone);
      setLength(data.length as EmailLength);
      setLanguage(data.language || 'English');
      setPurpose(data.purpose || '');
      setCallToAction(data.callToAction || '');
      setReferenceText(data.referenceText || '');
      setIsFavorite(data.isFavorite || false);
      setIsArchived(data.isArchived || false);
      setStatus(data.status || 'draft');
      setSaveStatus('saved');
      setLastSavedAt(new Date(data.updatedAt));

      // Push initial history state
      setHistoryStack([{ subject: data.subject || '', body: data.body || '' }]);
      setHistoryIndex(0);
    } catch (err: any) {
      showToast('Failed to load email: ' + err.message, 'error');
      setSaveStatus('failed');
    }
  };

  // Debounced Autosave (3 seconds)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!title && !body && !subject) return;

    setSaveStatus('idle');
    const timer = setTimeout(() => {
      handleSave(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [
    title,
    subject,
    body,
    recipientName,
    recipientEmail,
    senderName,
    category,
    tone,
    length,
    language,
    purpose,
    callToAction,
    referenceText,
  ]);

  // Handle Save
  const handleSave = async (isAutosave = false) => {
    if (!title.trim() && !subject.trim() && !body.trim()) return;

    try {
      setSaveStatus('saving');
      const payload = {
        title: title.trim() || subject.trim() || 'Untitled Email',
        subject,
        body,
        recipientName,
        recipientEmail,
        senderName,
        category,
        tone,
        length,
        language,
        purpose,
        callToAction,
        referenceText,
        status: status === 'sent' ? 'sent' : 'draft',
      };

      let result: Email;
      if (currentId) {
        result = await api.emails.update(currentId, payload);
      } else {
        result = await api.emails.create(payload);
        setCurrentId(result._id);
      }

      setSaveStatus('saved');
      setLastSavedAt(new Date());
      onSaved(result);

      if (!isAutosave) {
        showToast('Email draft saved successfully', 'success');
      }
    } catch (err: any) {
      setSaveStatus('failed');
      if (!isAutosave) {
        showToast('Failed to save draft: ' + err.message, 'error');
      }
    }
  };

  // Undo / Redo
  const pushHistory = (newSubject: string, newBody: string) => {
    const updated = historyStack.slice(0, historyIndex + 1);
    updated.push({ subject: newSubject, body: newBody });
    if (updated.length > 25) updated.shift();
    setHistoryStack(updated);
    setHistoryIndex(updated.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = historyStack[historyIndex - 1];
      setSubject(prev.subject);
      setBody(prev.body);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const next = historyStack[historyIndex + 1];
      setSubject(next.subject);
      setBody(next.body);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Copy helpers
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard`, 'success');
  };

  const copyCompleteEmail = () => {
    const full = `Subject: ${subject}\n\n${body}`;
    copyToClipboard(full, 'Complete email');
  };

  // AI Quick Actions
  const handleAiPolish = async () => {
    if (!body.trim()) {
      showToast('Enter some email body text to polish', 'info');
      return;
    }
    try {
      setAiLoading(true);
      const res = await api.ai.rewrite({
        text: body,
        instruction: 'polish',
        tone,
      });
      if (res?.rewrittenText) {
        pushHistory(subject, res.rewrittenText);
        setBody(res.rewrittenText);
        showToast('Email polished and improved for clarity', 'success');
      }
    } catch (err: any) {
      showToast('AI Rewrite error: ' + err.message, 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiToneShift = async (newTone: EmailTone) => {
    if (!body.trim()) return;
    try {
      setAiLoading(true);
      const res = await api.ai.rewrite({
        text: body,
        instruction: 'formal',
        tone: newTone,
      });
      if (res?.rewrittenText) {
        setTone(newTone);
        pushHistory(subject, res.rewrittenText);
        setBody(res.rewrittenText);
        showToast(`Adjusted email tone to ${newTone}`, 'success');
      }
    } catch (err: any) {
      showToast('Tone adjustment error: ' + err.message, 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateSubjectLines = async () => {
    const topicText = title || subject || 'Professional Update';
    try {
      setAiLoading(true);
      const res = await api.ai.subjectLines({
        topic: topicText,
        tone,
        count: 5,
      });
      if (res?.subjectLines && res.subjectLines.length > 0) {
        setSubjectSuggestions(res.subjectLines);
        setShowSubjectSuggestions(true);
      }
    } catch (err: any) {
      showToast('Subject generation error: ' + err.message, 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // Send Email with Explicit Confirmation
  const handleSendEmail = async () => {
    if (!currentId) {
      await handleSave(false);
    }
    if (!recipientEmail || !recipientEmail.includes('@')) {
      showToast('Please provide a valid recipient email address', 'error');
      return;
    }
    if (!subject.trim() || !body.trim()) {
      showToast('Subject and email body cannot be empty', 'error');
      return;
    }
    if (!confirmedSend) {
      showToast('You must explicitly confirm before sending', 'error');
      return;
    }

    try {
      setIsSending(true);
      const result = await api.delivery.send({
        emailId: currentId,
        recipientEmail,
        recipientName,
        subject,
        body,
        confirmedByUser: true,
      });

      setStatus('sent');
      setShowSendModal(false);
      setConfirmedSend(false);
      showToast('Email delivered successfully to ' + recipientEmail, 'success');
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      showToast('Delivery failed: ' + err.message, 'error');
    } finally {
      setIsSending(false);
    }
  };

  // Version History
  const openVersionHistory = async () => {
    if (!currentId) {
      showToast('Save this draft first to inspect version history', 'info');
      return;
    }
    try {
      setLoadingVersions(true);
      setShowVersionsModal(true);
      const data = await api.emails.versions(currentId);
      setVersions(data || []);
    } catch (err: any) {
      showToast('Failed to load version history: ' + err.message, 'error');
    } finally {
      setLoadingVersions(false);
    }
  };

  const restoreVersion = (v: EmailVersion) => {
    pushHistory(v.subject, v.body);
    setSubject(v.subject);
    setBody(v.body);
    setShowVersionsModal(false);
    showToast(`Restored version #${v.versionNumber}`, 'success');
  };

  const { chars, words, readTimeMinutes } = countWordsAndChars(body);

  const categories: EmailCategory[] = [
    'Job and Career',
    'Business and Corporate',
    'Education',
    'Customer Service',
    'Sales and Marketing',
    'Personal and Everyday',
    'Legal, Finance, and Administration',
  ];

  const tones: EmailTone[] = [
    'Professional',
    'Formal',
    'Friendly',
    'Polite',
    'Persuasive',
    'Confident',
    'Diplomatic',
    'Apologetic',
    'Empathetic',
    'Assertive',
    'Academic',
    'Executive',
    'Casual',
    'Sales-oriented',
    'Customer-support-oriented',
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle flex flex-wrap items-center justify-between gap-4">
        {/* Left: Save status & undo/redo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            {saveStatus === 'saving' && (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-brand-blue animate-spin" />
                <span className="text-slate-600 font-medium">Saving draft...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-600 font-medium">
                  Saved {lastSavedAt ? `at ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                </span>
              </>
            )}
            {saveStatus === 'failed' && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-rose-600 font-medium">Save failed</span>
              </>
            )}
            {saveStatus === 'idle' && (
              <span className="text-slate-400 font-medium">Ready</span>
            )}
          </div>

          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 text-slate-500 hover:text-navy-900 disabled:opacity-40 transition"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= historyStack.length - 1}
              className="p-2 text-slate-500 hover:text-navy-900 disabled:opacity-40 transition"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={openVersionHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium transition"
            title="Inspect version snapshots"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Versions</span>
          </button>
        </div>

        {/* Right: Actions (Copy, Export, Preview, Send) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy complete email */}
          <button
            onClick={copyCompleteEmail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            Copy
          </button>

          {/* Export Dropdown / Action */}
          <button
            onClick={() => exportToPdf(title || 'email', subject, body, recipientEmail)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
            title="Export polished document as PDF"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            PDF
          </button>
          <button
            onClick={() => exportToTxt(title || 'email', subject, body)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
            title="Export as plain text"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            TXT
          </button>

          {/* Preview modal button */}
          <button
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            Preview
          </button>

          {/* Manual Save */}
          <button
            onClick={() => handleSave(false)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-semibold transition"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>

          {/* Send Email Dialog Button */}
          <button
            onClick={() => setShowSendModal(true)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-blue-600 shadow-sm shadow-brand-blue/30 transition transform active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            Send Email
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Configuration & Right Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Context, Recipient & Tones (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Email Specifications</span>
              <span className="text-[10px] text-brand-blue font-medium">Smart Context</span>
            </h3>

            {/* Email Topic / Title */}
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Email Topic or Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Follow-up on project proposal"
                className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-blue focus:outline-none transition"
              />
            </div>

            {/* Recipient Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g., Sarah Connor"
                  className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-blue focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-blue focus:outline-none transition"
                />
              </div>
            </div>

            {/* Sender Name / Signature */}
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Sender Name / Signature
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your Name / Signature"
                className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-blue focus:outline-none transition"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EmailCategory)}
                className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-blue focus:outline-none transition"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Tone Selector (15 options) */}
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Tone ({tones.length} options)
              </label>
              <select
                value={tone}
                onChange={(e) => handleAiToneShift(e.target.value as EmailTone)}
                className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-blue focus:outline-none transition"
              >
                {tones.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Length & Language */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as EmailLength)}
                  className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-blue focus:outline-none transition"
                >
                  <option value="Short">Short</option>
                  <option value="Medium">Medium</option>
                  <option value="Detailed">Detailed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Language
                </label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="English"
                  className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-blue focus:outline-none transition"
                />
              </div>
            </div>

            {/* Purpose & Important Details */}
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Purpose & Important Details
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={2}
                placeholder="Key goals, topics to cover, or expectations..."
                className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-blue focus:outline-none transition resize-none"
              />
            </div>

            {/* Call to Action */}
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Call to Action
              </label>
              <input
                type="text"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                placeholder="e.g., Let's schedule a 15-min call on Wednesday."
                className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-blue focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Distraction-Free Editor & Real-Time Stats (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col min-h-[580px] overflow-hidden">
            {/* Subject Line Header */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Subject:
              </span>
              <input
                type="text"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  pushHistory(e.target.value, body);
                }}
                placeholder="Clear, compelling subject line..."
                className="w-full text-sm font-semibold text-navy-900 bg-transparent focus:outline-none"
              />

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => copyToClipboard(subject, 'Subject line')}
                  className="p-1.5 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded-lg transition"
                  title="Copy subject line"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={handleGenerateSubjectLines}
                  disabled={aiLoading}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-brand-violet bg-violet-50 hover:bg-violet-100 rounded-lg border border-violet-200 transition"
                  title="Generate alternative subject lines"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Subject Ideas</span>
                </button>
              </div>
            </div>

            {/* Subject suggestions bar if triggered */}
            {showSubjectSuggestions && subjectSuggestions.length > 0 && (
              <div className="bg-violet-50/80 px-4 py-3 border-b border-violet-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-violet flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5" />
                    AI Subject Line Alternatives
                  </span>
                  <button
                    onClick={() => setShowSubjectSuggestions(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="space-y-1">
                  {subjectSuggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSubject(sug);
                        setShowSubjectSuggestions(false);
                        showToast('Applied subject line', 'success');
                      }}
                      className="w-full text-left text-xs text-navy-900 hover:bg-white p-1.5 rounded-lg border border-transparent hover:border-violet-200 transition font-medium truncate"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Assistant Quick Tool Ribbon */}
            <div className="px-4 py-2 bg-slate-50/60 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  AI Tools:
                </span>
                <button
                  onClick={handleAiPolish}
                  disabled={aiLoading}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-blue text-navy-900 font-medium transition flex items-center gap-1 shadow-xs"
                >
                  <Sparkles className="w-3 h-3 text-brand-blue" />
                  Polish & Clarity
                </button>

                <button
                  onClick={() => handleAiToneShift('Formal')}
                  disabled={aiLoading}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-blue text-navy-900 font-medium transition"
                >
                  Formal
                </button>
                <button
                  onClick={() => handleAiToneShift('Friendly')}
                  disabled={aiLoading}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-blue text-navy-900 font-medium transition"
                >
                  Friendly
                </button>
                <button
                  onClick={() => handleAiToneShift('Persuasive')}
                  disabled={aiLoading}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-blue text-navy-900 font-medium transition"
                >
                  Persuasive
                </button>
                <button
                  onClick={() => handleAiToneShift('Diplomatic')}
                  disabled={aiLoading}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-blue text-navy-900 font-medium transition"
                >
                  Diplomatic
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ~{readTimeMinutes} min read
              </div>
            </div>

            {/* Rich Editor Textarea */}
            <div className="flex-1 p-5 relative">
              <textarea
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  pushHistory(subject, e.target.value);
                }}
                placeholder="Write your email body here, or click 'Generate with AI'..."
                className="w-full h-full min-h-[380px] bg-transparent text-sm leading-relaxed text-navy-900 focus:outline-none resize-none font-sans"
              />
            </div>

            {/* Bottom Editor Bar: Word & Character counts */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span>
                  Words: <strong className="text-navy-900 font-semibold">{words}</strong>
                </span>
                <span>
                  Characters: <strong className="text-navy-900 font-semibold">{chars}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => copyToClipboard(body, 'Email body')}
                  className="hover:text-navy-900 transition flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Body
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-elevated border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-blue" />
                Email Client Preview
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Simulated Email Envelope */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2 mb-4 font-sans">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500 w-16">From:</span>
                <span className="text-navy-900 font-medium">
                  {senderName || user?.name || 'You'} &lt;{user?.email || 'user@company.com'}&gt;
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500 w-16">To:</span>
                <span className="text-navy-900 font-medium">
                  {recipientName ? `${recipientName} ` : ''}&lt;{recipientEmail || 'recipient@domain.com'}&gt;
                </span>
              </div>
              <div className="flex items-center gap-2 border-t border-slate-200/60 pt-2">
                <span className="font-semibold text-slate-500 w-16">Subject:</span>
                <span className="text-navy-900 font-bold text-sm">
                  {subject || 'No subject'}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-subtle whitespace-pre-wrap text-sm text-navy-900 leading-relaxed font-sans min-h-[160px]">
              {body || '(Email body is empty)'}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setShowSendModal(true);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-blue text-white hover:bg-blue-600 transition shadow-sm"
              >
                Proceed to Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explicit Send Confirmation Dialog */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-elevated border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-4">
              <Send className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-navy-900 mb-1">
              Confirm & Dispatch Email
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Per strict security regulations, human review and explicit confirmation are required prior to dispatch.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2 mb-4">
              <div>
                <span className="font-semibold text-slate-500">Recipient: </span>
                <span className="text-navy-900 font-medium">
                  {recipientEmail || 'None specified'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Subject: </span>
                <span className="text-navy-900 font-medium">
                  {subject || 'None'}
                </span>
              </div>
            </div>

            {/* Explicit Confirmation Checkbox */}
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition mb-6">
              <input
                type="checkbox"
                checked={confirmedSend}
                onChange={(e) => setConfirmedSend(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue w-4 h-4"
              />
              <span className="text-xs font-medium text-slate-700">
                I have reviewed the recipient, subject line, and content, and explicitly authorize sending this correspondence.
              </span>
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSendModal(false);
                  setConfirmedSend(false);
                }}
                disabled={isSending}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={!confirmedSend || isSending}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-blue text-white hover:bg-blue-600 disabled:opacity-50 transition shadow-sm flex items-center gap-2"
              >
                {isSending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                {isSending ? 'Sending...' : 'Confirm & Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-elevated border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <History className="w-4 h-4 text-brand-blue" />
                Version History Snapshots
              </h3>
              <button
                onClick={() => setShowVersionsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-navy-900"
              >
                ✕
              </button>
            </div>

            {loadingVersions ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading versions...</div>
            ) : versions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No previous versions saved yet.</div>
            ) : (
              <div className="space-y-3">
                {versions.map((v) => (
                  <div
                    key={v._id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 space-y-2 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-900">
                        Version #{v.versionNumber}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(v.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium truncate">
                      Subject: {v.subject}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 font-mono text-[11px]">
                      {v.body}
                    </p>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => restoreVersion(v)}
                        className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-brand-blue hover:bg-blue-50 transition"
                      >
                        Restore this version
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
