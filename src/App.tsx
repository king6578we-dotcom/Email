import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './features/dashboard/DashboardView';
import { EmailEditorView } from './features/email-editor/EmailEditorView';
import { TemplateLibraryView } from './features/templates/TemplateLibraryView';
import { EmailListView } from './features/emails/EmailListView';
import { AnalyticsView } from './features/analytics/AnalyticsView';
import { SettingsView } from './features/settings/SettingsView';
import { SecurityCenterView } from './features/security/SecurityCenterView';
import { HelpSupportView } from './features/help/HelpSupportView';
import { TeamWorkspaceView } from './features/team/TeamWorkspaceView';
import { CategoriesView } from './features/categories/CategoriesView';
import { AiGeneratorModal } from './features/ai-generator/AiGeneratorModal';
import { AuthModal } from './features/auth/AuthModal';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import { AnalyticsData, Email, Template } from './types';

export const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Active email in editor
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  // Modals
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiModalContext, setAiModalContext] = useState({ topic: '', recipient: '', category: 'Business and Corporate' });
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Template filter state if navigating from Categories
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Load analytics when user is authenticated
  const loadAnalytics = async () => {
    if (!user) return;
    try {
      setLoadingAnalytics(true);
      const data = await api.analytics.get();
      setAnalytics(data);
    } catch {
      // ignore in unauth
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  // Handle dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Quick Action Handlers
  const handleNewEmail = () => {
    setSelectedEmailId(null);
    setActiveTab('editor');
  };

  const handleOpenEmail = (id: string) => {
    setSelectedEmailId(id);
    setActiveTab('editor');
  };

  const handleUseTemplate = (template: Template) => {
    setSelectedEmailId(null);
    setActiveTab('editor');
    // Save as draft or prefill editor
    setTimeout(async () => {
      try {
        const draft = await api.emails.create({
          title: template.title,
          subject: template.subject,
          body: template.body,
          category: template.category,
          tone: template.defaultTone,
          templateId: template._id,
          status: 'draft',
        });
        setSelectedEmailId(draft._id);
        loadAnalytics();
      } catch (err) {
        // prefill
      }
    }, 100);
  };

  const handleOpenAiModal = (topic = '', recipient = '', category = 'Business and Corporate') => {
    setAiModalContext({ topic, recipient, category });
    setShowAiModal(true);
  };

  const handleApplyAiToEditor = async (generatedSubject: string, generatedBody: string, cat?: string) => {
    try {
      const draft = await api.emails.create({
        title: generatedSubject || 'AI Generated Email',
        subject: generatedSubject,
        body: generatedBody,
        category: cat || 'Business and Corporate',
        status: 'draft',
      });
      setSelectedEmailId(draft._id);
      setActiveTab('editor');
      loadAnalytics();
    } catch (err) {
      setActiveTab('editor');
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategoryFilter(categoryName);
    setActiveTab('templates');
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex ${darkMode ? 'dark bg-navy-950 text-white' : ''}`}>
      {/* Responsive Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        draftsCount={analytics?.overview?.draftsCount || 0}
        favoritesCount={analytics?.overview?.favoritesCount || 0}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <Navbar
          onOpenMobileMenu={() => setMobileOpen(true)}
          onNewEmail={handleNewEmail}
          onOpenAiModal={() => handleOpenAiModal()}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNavigate={(tab) => setActiveTab(tab)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenAuth={() => setShowAuthModal(true)}
        />

        {/* View Router Container */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              analytics={analytics}
              loading={loadingAnalytics}
              onNavigate={(tab) => setActiveTab(tab)}
              onNewEmail={handleNewEmail}
              onOpenAiModal={() => handleOpenAiModal()}
              onOpenEmail={handleOpenEmail}
            />
          )}

          {activeTab === 'editor' && (
            <EmailEditorView
              emailId={selectedEmailId}
              onSaved={(email) => {
                setSelectedEmailId(email._id);
                loadAnalytics();
              }}
              onOpenAiModalWithContext={(topic, recipient, cat) => handleOpenAiModal(topic, recipient, cat)}
            />
          )}

          {activeTab === 'ai-generator' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
                <h1 className="text-xl font-extrabold text-navy-900 tracking-tight">AI Email Generator Suite</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Launch the dedicated AI generation workspace below to write, polish, and tone-shift correspondence.
                </p>
                <button
                  onClick={() => handleOpenAiModal()}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-brand-violet text-white text-xs font-bold hover:bg-violet-700 transition shadow-sm"
                >
                  Open AI Workspace Modal
                </button>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <TemplateLibraryView onUseTemplate={handleUseTemplate} />
          )}

          {activeTab === 'my-emails' && (
            <EmailListView
              initialTab="all"
              onOpenEmail={handleOpenEmail}
              onNewEmail={handleNewEmail}
            />
          )}

          {activeTab === 'drafts' && (
            <EmailListView
              initialTab="drafts"
              onOpenEmail={handleOpenEmail}
              onNewEmail={handleNewEmail}
            />
          )}

          {activeTab === 'favorites' && (
            <EmailListView
              initialTab="favorites"
              onOpenEmail={handleOpenEmail}
              onNewEmail={handleNewEmail}
            />
          )}

          {activeTab === 'history' && (
            <EmailListView
              initialTab="history"
              onOpenEmail={handleOpenEmail}
              onNewEmail={handleNewEmail}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesView onSelectCategory={handleCategorySelect} />
          )}

          {activeTab === 'team' && <TeamWorkspaceView />}

          {activeTab === 'analytics' && (
            <AnalyticsView analytics={analytics} loading={loadingAnalytics} />
          )}

          {activeTab === 'settings' && <SettingsView />}

          {activeTab === 'security' && <SecurityCenterView analytics={analytics} />}

          {activeTab === 'help' && <HelpSupportView />}
        </main>
      </div>

      {/* AI Generator Modal */}
      <AiGeneratorModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onApplyToEditor={handleApplyAiToEditor}
        initialTopic={aiModalContext.topic}
        initialRecipient={aiModalContext.recipient}
        initialCategory={aiModalContext.category}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          loadAnalytics();
        }}
      />
    </div>
  );
};

export default App;
