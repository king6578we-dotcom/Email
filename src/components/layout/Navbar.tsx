import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  PenSquare,
  Sparkles,
  LogOut,
  User as UserIcon,
  Shield,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onNewEmail: () => void;
  onOpenAiModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigate: (tab: any) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  onNewEmail,
  onOpenAiModal,
  searchQuery,
  setSearchQuery,
  onNavigate,
  darkMode,
  setDarkMode,
  onOpenAuth,
}) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'AI Assistant ready', desc: '15 executive tone modes available', time: 'Just now' },
    { id: 2, title: 'Template Library updated', desc: 'Added 70+ categorized templates', time: '1h ago' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search emails, topics, templates..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-navy-900 rounded-xl border border-slate-200 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/10 transition"
          />
        </div>
      </div>

      {/* Right: Quick actions, notifications, user avatar */}
      <div className="flex items-center gap-2.5">
        {/* Generate with AI button */}
        <button
          onClick={onOpenAiModal}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-violet-50 text-brand-violet hover:bg-violet-100 border border-violet-200 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Generate with AI
        </button>

        {/* New Email Button */}
        <button
          onClick={onNewEmail}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-blue text-white hover:bg-blue-600 shadow-sm shadow-brand-blue/25 transition"
        >
          <PenSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Write Email</span>
        </button>

        {/* Dark/Light toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-violet" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-elevated border border-slate-100 py-3 z-50">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-xs text-navy-900">Notifications</span>
                <span className="text-[11px] text-brand-blue font-medium cursor-pointer">Mark all read</span>
              </div>
              <div className="divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition cursor-pointer">
                    <p className="text-xs font-semibold text-navy-900">{n.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile menu */}
        <div className="relative">
          {user ? (
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-violet text-white font-bold text-xs flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-navy-900 text-white hover:bg-navy-800 transition shadow-xs"
            >
              Sign In
            </button>
          )}

          {showProfileMenu && user && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-slate-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-navy-900 truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition text-left"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  Account Settings
                </button>
                <button
                  onClick={() => {
                    onNavigate('security');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition text-left"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  Security Center
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
