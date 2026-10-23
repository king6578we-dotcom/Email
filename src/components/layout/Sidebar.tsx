import React from 'react';
import {
  LayoutDashboard,
  PenTool,
  Sparkles,
  Layers,
  Inbox,
  FileEdit,
  Star,
  History,
  Tag,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Send,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'editor'
  | 'ai-generator'
  | 'templates'
  | 'my-emails'
  | 'drafts'
  | 'favorites'
  | 'history'
  | 'categories'
  | 'team'
  | 'analytics'
  | 'settings'
  | 'security'
  | 'help';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  draftsCount?: number;
  favoritesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  draftsCount = 0,
  favoritesCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'editor', label: 'Write an Email', icon: PenTool, highlight: true },
    { id: 'ai-generator', label: 'AI Email Generator', icon: Sparkles, badge: 'AI' },
    { id: 'templates', label: 'Email Templates', icon: Layers },
    { id: 'my-emails', label: 'My Emails', icon: Inbox },
    { id: 'drafts', label: 'Drafts', icon: FileEdit, count: draftsCount },
    { id: 'favorites', label: 'Favorites', icon: Star, count: favoritesCount },
    { id: 'history', label: 'Email History', icon: History },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'team', label: 'Team Workspace', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security Center', icon: ShieldCheck },
    { id: 'help', label: 'Help and Support', icon: HelpCircle },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id as ActiveTab);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-white border-r border-slate-200/80 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-violet flex items-center justify-center text-white shadow-md shadow-brand-blue/20 shrink-0">
              <Send className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-navy-900 tracking-tight leading-none">
                  Scribe<span className="text-brand-blue">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                  Email Studio
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all relative group ${
                  isActive
                    ? 'bg-blue-50/80 text-brand-blue font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-brand-blue' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />

                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-brand-violet to-brand-blue text-white shadow-xs">
                    {item.badge}
                  </span>
                )}

                {!collapsed && item.count !== undefined && item.count > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                    {item.count}
                  </span>
                )}

                {/* Left Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-brand-blue rounded-r-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* User Card at bottom */}
        <div className="p-3 border-t border-slate-100">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100/80 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-navy-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              AI
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-navy-900 truncate">
                  AI Generation Engine
                </span>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active & Ready
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
