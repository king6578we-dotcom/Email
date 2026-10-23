import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Copy,
  Check,
  Languages,
  FileText,
  Sliders,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { EmailCategory, EmailTone, EmailLength } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToEditor: (subject: string, body: string, category?: string) => void;
  initialTopic?: string;
  initialRecipient?: string;
  initialCategory?: string;
}

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyToEditor,
  initialTopic = '',
  initialRecipient = '',
  initialCategory = 'Business and Corporate',
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'generate' | 'rewrite' | 'subject' | 'summarize' | 'translate'>('generate');

  // Generation state
  const [topic, setTopic] = useState(initialTopic);
  const [recipientName, setRecipientName] = useState(initialRecipient);
  const [senderName, setSenderName] = useState('');
  const [category, setCategory] = useState<EmailCategory>((initialCategory as EmailCategory) || 'Business and Corporate');
  const [tone, setTone] = useState<EmailTone>('Professional');
  const [length, setLength] = useState<EmailLength>('Medium');
  const [purpose, setPurpose] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [referenceText, setReferenceText] = useState('');

  // Rewrite state
  const [rewriteText, setRewriteText] = useState('');
  const [instruction, setInstruction] = useState<'polish' | 'formal' | 'friendly' | 'persuasive' | 'shorten' | 'expand'>('polish');

  // Subject state
  const [subjectTopic, setSubjectTopic] = useState('');
  const [subjectResults, setSubjectResults] = useState<string[]>([]);

  // Summarize state
  const [summarizeText, setSummarizeText] = useState('');
  const [summaryResult, setSummaryResult] = useState<{ summary: string; keyPoints: string[] } | null>(null);

  // Translate state
  const [translateText, setTranslateText] = useState('');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [translatedResult, setTranslatedResult] = useState('');

  // Generated output state
  const [generatedSubject, setGeneratedSubject] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast('Please specify an email topic or title', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.ai.generate({
        topic,
        recipientName,
        senderName,
        category,
        tone,
        length,
        purpose,
        callToAction,
        referenceText,
      });

      setGeneratedSubject(res.subject);
      setGeneratedBody(res.body);
      showToast('AI email generation completed', 'success');
    } catch (err: any) {
      showToast('Generation error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRewrite = async () => {
    if (!rewriteText.trim()) {
      showToast('Enter text to rewrite', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.ai.rewrite({
        text: rewriteText,
        instruction,
        tone,
      });

      setGeneratedBody(res.rewrittenText);
      showToast('Rewrite complete', 'success');
    } catch (err: any) {
      showToast('Rewrite error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSubjects = async () => {
    if (!subjectTopic.trim()) {
      showToast('Please specify a topic', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.ai.subjectLines({
        topic: subjectTopic,
        tone,
        count: 5,
      });
      setSubjectResults(res.subjectLines || []);
      showToast('Generated 5 subject alternatives', 'success');
    } catch (err: any) {
      showToast('Subject error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!summarizeText.trim()) return;
    try {
      setLoading(true);
      const res = await api.ai.summarize(summarizeText);
      setSummaryResult(res);
      showToast('Summary complete', 'success');
    } catch (err: any) {
      showToast('Summarize error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!translateText.trim()) return;
    try {
      setLoading(true);
      const res = await api.ai.translate(translateText, targetLang);
      setTranslatedResult(res.translatedText);
      showToast('Translation ready', 'success');
    } catch (err: any) {
      showToast('Translate error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

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

  const languages = ['Spanish', 'French', 'German', 'Italian', 'Japanese', 'Mandarin Chinese', 'Arabic', 'Portuguese', 'Hindi'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-elevated border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-blue flex items-center justify-center text-white shadow-md shadow-brand-violet/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-900">AI Email Generation Engine</h2>
              <p className="text-xs text-slate-500">
                15 executive tones with anti-hallucination guardrails and structured generation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 px-1 pt-2 gap-2 overflow-x-auto">
          {[
            { id: 'generate', label: 'Generate from Topic', icon: Wand2 },
            { id: 'rewrite', label: 'Rewrite & Tone Shift', icon: Sliders },
            { id: 'subject', label: 'Subject Line Ideator', icon: FileText },
            { id: 'summarize', label: 'Summarize Thread', icon: FileText },
            { id: 'translate', label: 'Translate', icon: Languages },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-brand-violet text-brand-violet'
                    : 'border-transparent text-slate-500 hover:text-navy-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 px-1 space-y-6">
          {activeTab === 'generate' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Email Topic or Objective <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Requesting a meeting to discuss vendor partnership renewal"
                    className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-violet focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy-900 mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g., Alex Mercer"
                      className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-violet focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-900 mb-1">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g., Jordan Reed"
                      className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-violet focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy-900 mb-1">
                      Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as EmailTone)}
                      className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-violet focus:outline-none transition"
                    >
                      {tones.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-900 mb-1">
                      Length
                    </label>
                    <select
                      value={length}
                      onChange={(e) => setLength(e.target.value as EmailLength)}
                      className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-violet focus:outline-none transition"
                    >
                      <option value="Short">Short</option>
                      <option value="Medium">Medium</option>
                      <option value="Detailed">Detailed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Purpose & Important Notes
                  </label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={2}
                    placeholder="Specific bullet points or context..."
                    className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-violet focus:outline-none transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Call to Action
                  </label>
                  <input
                    type="text"
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    placeholder="e.g., Let's confirm by Thursday at 3 PM."
                    className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-violet focus:outline-none transition"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-blue text-white font-bold text-xs hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loading ? 'Generating with AI...' : 'Generate Polished Email'}
                </button>
              </div>

              {/* Output Preview */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Generated Output
                    </span>
                    {generatedSubject && (
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Ready to Use
                      </span>
                    )}
                  </div>

                  {generatedSubject && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400">Subject:</span>
                      <p className="text-xs font-bold text-navy-900 bg-white p-2 rounded-lg border border-slate-200">
                        {generatedSubject}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400">Body:</span>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-navy-900 whitespace-pre-wrap leading-relaxed min-h-[220px] max-h-[300px] overflow-y-auto">
                      {generatedBody || (
                        <div className="h-full flex items-center justify-center text-slate-400 text-center py-12">
                          Fill parameters on the left and click "Generate Polished Email".
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {generatedBody && (
                  <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`Subject: ${generatedSubject}\n\n${generatedBody}`);
                        showToast('Email copied to clipboard', 'success');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
                    >
                      Copy All
                    </button>
                    <button
                      onClick={() => {
                        onApplyToEditor(generatedSubject, generatedBody, category);
                        onClose();
                        showToast('Applied to Email Studio', 'success');
                      }}
                      className="px-4 py-1.5 rounded-lg bg-brand-blue text-white text-xs font-bold hover:bg-blue-600 transition flex items-center gap-1.5 shadow-sm"
                    >
                      Apply to Editor
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'rewrite' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Original Text
                </label>
                <textarea
                  value={rewriteText}
                  onChange={(e) => setRewriteText(e.target.value)}
                  rows={4}
                  placeholder="Paste existing email draft to improve..."
                  className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-violet focus:outline-none transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Instruction
                  </label>
                  <select
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none transition"
                  >
                    <option value="polish">Polish Grammar & Clarity</option>
                    <option value="formal">Make More Formal</option>
                    <option value="friendly">Make Warm & Friendly</option>
                    <option value="persuasive">Make Persuasive</option>
                    <option value="shorten">Shorten & Condense</option>
                    <option value="expand">Expand with Detail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Target Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as EmailTone)}
                    className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none transition"
                  >
                    {tones.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleRewrite}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-brand-violet text-white font-bold text-xs hover:bg-violet-700 shadow-md flex items-center justify-center gap-2 transition"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Rewrite Draft
              </button>

              {generatedBody && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-navy-900">Rewritten Result:</span>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">
                    {generatedBody}
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        onApplyToEditor('', generatedBody);
                        onClose();
                      }}
                      className="px-4 py-1.5 rounded-lg bg-brand-blue text-white text-xs font-bold hover:bg-blue-600 transition"
                    >
                      Apply to Editor
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'subject' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Email Topic / Purpose
                </label>
                <input
                  type="text"
                  value={subjectTopic}
                  onChange={(e) => setSubjectTopic(e.target.value)}
                  placeholder="e.g., Pitching product redesign to engineering VP"
                  className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none transition"
                />
              </div>

              <button
                onClick={handleGenerateSubjects}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-brand-violet text-white font-bold text-xs hover:bg-violet-700 shadow-md flex items-center justify-center gap-2 transition"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                Generate 5 Subject Lines
              </button>

              {subjectResults.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-navy-900">Click to apply:</span>
                  {subjectResults.map((sub, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onApplyToEditor(sub, '');
                        onClose();
                      }}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand-violet hover:bg-violet-50/40 text-xs font-medium text-navy-900 transition flex items-center justify-between group"
                    >
                      <span>{sub}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-violet" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'summarize' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Long Email or Conversation Thread
                </label>
                <textarea
                  value={summarizeText}
                  onChange={(e) => setSummarizeText(e.target.value)}
                  rows={5}
                  placeholder="Paste email thread here..."
                  className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none transition resize-none"
                />
              </div>

              <button
                onClick={handleSummarize}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-brand-blue text-white font-bold text-xs hover:bg-blue-600 shadow-md flex items-center justify-center gap-2 transition"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Summarize Key Takeaways
              </button>

              {summaryResult && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-navy-900">Executive Summary:</span>
                    <p className="text-xs text-slate-700 mt-1">{summaryResult.summary}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-navy-900">Key Points:</span>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1 mt-1">
                      {summaryResult.keyPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'translate' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Target Language
                </label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none transition"
                >
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Email Content
                </label>
                <textarea
                  value={translateText}
                  onChange={(e) => setTranslateText(e.target.value)}
                  rows={4}
                  placeholder="Paste email to translate..."
                  className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none transition resize-none"
                />
              </div>

              <button
                onClick={handleTranslate}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-brand-violet text-white font-bold text-xs hover:bg-violet-700 shadow-md flex items-center justify-center gap-2 transition"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
                Translate Email
              </button>

              {translatedResult && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-navy-900">Translated Email:</span>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">
                    {translatedResult}
                  </p>
                  <button
                    onClick={() => {
                      onApplyToEditor('', translatedResult);
                      onClose();
                    }}
                    className="px-4 py-1.5 rounded-lg bg-brand-blue text-white text-xs font-bold hover:bg-blue-600 transition"
                  >
                    Apply to Editor
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
