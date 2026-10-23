import React, { useState } from 'react';
import { Users, UserPlus, Shield, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const TeamWorkspaceView: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [members, setMembers] = useState([
    { id: 1, name: user?.name || 'Workspace Owner', email: user?.email || 'owner@company.com', role: 'Owner', status: 'Active' },
    { id: 2, name: 'Elena Rostova', email: 'elena.rostova@company.com', role: 'Editor', status: 'Active' },
    { id: 3, name: 'David Kim', email: 'david.kim@company.com', role: 'Reviewer', status: 'Invited' },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes('@')) {
      showToast('Enter a valid email address', 'error');
      return;
    }

    setMembers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'Invited',
      },
    ]);

    setInviteEmail('');
    setShowInviteModal(false);
    showToast(`Invitation sent to ${inviteEmail}`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl pb-16">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-navy-900 tracking-tight">Team Collaboration Workspace</h1>
          </div>
          <p className="text-xs text-slate-500">
            Collaborate on shared brand voice templates, review drafts, and manage access privileges.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-blue-600 shadow-sm transition shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Invite Colleague
        </button>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
        <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          Workspace Members ({members.length})
        </h2>

        <div className="divide-y divide-slate-100">
          {members.map((member) => (
            <div key={member.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-navy-900 font-bold flex items-center justify-center">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="font-bold text-navy-900 block">{member.name}</span>
                  <span className="text-[11px] text-slate-400">{member.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {member.role}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    member.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-slate-100">
            <h3 className="text-base font-bold text-navy-900 mb-2">Invite Team Member</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add colleagues to share draft reviews and workspace templates.
            </p>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none"
                >
                  <option value="Editor">Editor (Can create, edit & draft emails)</option>
                  <option value="Reviewer">Reviewer (Can review drafts & comment)</option>
                  <option value="Admin">Admin (Full workspace administration)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-blue text-white hover:bg-blue-600 shadow-sm"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
