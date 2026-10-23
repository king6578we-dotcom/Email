import React, { useState } from 'react';
import { HelpCircle, BookOpen, KeyRound, Sparkles, Send, Shield, ChevronDown, ChevronUp } from 'lucide-react';

export const HelpSupportView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the AI Email Generation Engine work?',
      a: 'The AI engine generates complete, context-aware emails based on your topic, recipient, desired tone, and length. It adheres to strict anti-hallucination rules and will never invent commitments or facts. Placeholders such as [Date] or [Meeting Link] are used when information is needed.',
    },
    {
      q: 'Are my emails sent automatically after AI generation?',
      a: 'No. Never. AI generation and email delivery are strictly decoupled. You must always review the generated email, verify the recipient, and provide explicit human confirmation before an email is dispatched.',
    },
    {
      q: 'How does autosave work?',
      a: 'The Email Writing Studio automatically saves your active draft after 2.5 seconds of idle typing. Every significant edit creates a version snapshot, allowing you to view and roll back changes at any time via the "Versions" button.',
    },
    {
      q: 'How can I configure my own SMTP email provider?',
      a: 'You can configure your SMTP credentials (host, port, user, password) in the server environment variables (.env). In development and testing mode, ScribeAI connects to Ethereal Mail or simulates instantaneous deliveries with test previews.',
    },
    {
      q: 'Can other users see my email drafts or templates?',
      a: 'No. ScribeAI enforces strict tenant isolation. All database queries verify ownership against your authenticated user session. Custom templates and private emails are strictly restricted to your account.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl pb-16">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-extrabold text-navy-900 tracking-tight">Help & Documentation Center</h1>
        </div>
        <p className="text-xs text-slate-500">
          Everything you need to know about email drafting, AI tones, templates, and delivery settings.
        </p>
      </div>

      {/* Quick Guide Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle space-y-2">
          <Sparkles className="w-5 h-5 text-brand-violet" />
          <h3 className="text-xs font-bold text-navy-900">15 Executive Tones</h3>
          <p className="text-xs text-slate-500">
            Switch from Professional to Diplomatic, Assertive, or Empathetic with a single click.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle space-y-2">
          <BookOpen className="w-5 h-5 text-brand-blue" />
          <h3 className="text-xs font-bold text-navy-900">70+ Categorized Templates</h3>
          <p className="text-xs text-slate-500">
            From cover letters to salary negotiation, vendor reminders, and executive minutes.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle space-y-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h3 className="text-xs font-bold text-navy-900">Human-Confirmed Sending</h3>
          <p className="text-xs text-slate-500">
            Strict human confirmation checkbox prevents unintentional email dispatch.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-3">
        <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-navy-900 hover:text-brand-blue transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed animate-fade-in pl-2 border-l-2 border-brand-blue">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
