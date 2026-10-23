import React, { useState } from 'react';
import { Settings, User as UserIcon, PenTool, Bell, Save, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { EmailTone, EmailLength } from '../../types';

export const SettingsView: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [signature, setSignature] = useState(user?.emailSignature || '');
  const [defaultTone, setDefaultTone] = useState<EmailTone>(
    (user?.settings?.defaultTone as EmailTone) || 'Professional'
  );
  const [defaultLength, setDefaultLength] = useState<EmailLength>(
    (user?.settings?.defaultLength as EmailLength) || 'Medium'
  );
  const [emailNotifications, setEmailNotifications] = useState(
    user?.settings?.emailNotifications !== false
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile({
        name,
        emailSignature: signature,
        settings: {
          defaultTone,
          defaultLength,
          emailNotifications,
        },
      });
      showToast('Settings updated successfully', 'success');
    } catch (err: any) {
      showToast('Failed to save settings: ' + err.message, 'error');
    } finally {
      setSaving(false);
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

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl pb-16">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Settings className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-extrabold text-navy-900 tracking-tight">Account & Writing Settings</h1>
        </div>
        <p className="text-xs text-slate-500">
          Configure default email signatures, default AI tones, and account preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserIcon className="w-4 h-4 text-brand-blue" />
            Profile & Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 text-xs text-slate-400 bg-slate-100 rounded-xl border border-slate-200 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Account email cannot be modified directly</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">
              Default Email Signature
            </label>
            <textarea
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              rows={4}
              placeholder="e.g. Best regards,&#10;Your Name&#10;Director of Operations&#10;Company Inc."
              className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none resize-none font-sans"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              This signature is automatically appended when writing new emails
            </span>
          </div>
        </div>

        {/* AI & Editor Defaults */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <PenTool className="w-4 h-4 text-brand-violet" />
            AI Writing Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Default Tone of Voice
              </label>
              <select
                value={defaultTone}
                onChange={(e) => setDefaultTone(e.target.value as EmailTone)}
                className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none"
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
                Default Email Length
              </label>
              <select
                value={defaultLength}
                onChange={(e) => setDefaultLength(e.target.value as EmailLength)}
                className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none"
              >
                <option value="Short">Short (Concise & crisp)</option>
                <option value="Medium">Medium (Balanced standard)</option>
                <option value="Detailed">Detailed (Comprehensive with notes)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-blue-600 shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};
