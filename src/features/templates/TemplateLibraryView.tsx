import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Eye,
  Plus,
  Trash2,
  Bookmark,
  TrendingUp,
  Tag,
  Copy,
} from 'lucide-react';
import { Template, EmailCategory, EmailTone } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface TemplateLibraryViewProps {
  onUseTemplate: (template: Template) => void;
}

export const TemplateLibraryView: React.FC<TemplateLibraryViewProps> = ({ onUseTemplate }) => {
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTone, setSelectedTone] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'usage' | 'newest' | 'alpha'>('usage');
  const [onlyMine, setOnlyMine] = useState(false);

  // Preview Modal
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Create Template Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EmailCategory>('Business and Corporate');
  const [newDescription, setNewDescription] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newTone, setNewTone] = useState<EmailTone>('Professional');

  const categories = [
    'All',
    'Job and Career',
    'Business and Corporate',
    'Education',
    'Customer Service',
    'Sales and Marketing',
    'Personal and Everyday',
    'Legal, Finance, and Administration',
  ];

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await api.templates.list({
        search,
        category: selectedCategory,
        tone: selectedTone,
        onlyMine,
        limit: 50,
      });
      setTemplates(res || []);
    } catch (err: any) {
      showToast('Failed to load templates: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory, selectedTone, onlyMine]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTemplates();
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubject.trim() || !newBody.trim()) {
      showToast('Title, subject, and body are required', 'error');
      return;
    }

    try {
      await api.templates.create({
        title: newTitle,
        category: newCategory,
        description: newDescription || 'Custom user template',
        subject: newSubject,
        body: newBody,
        defaultTone: newTone,
        defaultLength: 'Medium',
      });

      setShowCreateModal(false);
      setNewTitle('');
      setNewDescription('');
      setNewSubject('');
      setNewBody('');
      showToast('Custom template created successfully', 'success');
      fetchTemplates();
    } catch (err: any) {
      showToast('Failed to create template: ' + err.message, 'error');
    }
  };

  const handleDeleteTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this custom template?')) return;

    try {
      await api.templates.delete(id);
      setTemplates((prev) => prev.filter((t) => t._id !== id));
      showToast('Template deleted', 'success');
    } catch (err: any) {
      showToast('Failed to delete: ' + err.message, 'error');
    }
  };

  // Sorting
  const sortedTemplates = [...templates].sort((a, b) => {
    if (sortBy === 'usage') return (b.usageCount || 0) - (a.usageCount || 0);
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'alpha') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-navy-900 tracking-tight">
              Executive Email Template Library
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Over 70+ proven career, enterprise, academic, and client communication templates with ready placeholders.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-blue-600 shadow-sm shadow-brand-blue/25 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Custom Template
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full lg:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates by keyword or role..."
              className="w-full pl-9 pr-4 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-brand-blue focus:outline-none transition"
            />
          </form>

          {/* Sort & Quick Filter */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyMine}
                onChange={(e) => setOnlyMine(e.target.checked)}
                className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
              />
              Only My Templates
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none"
              >
                <option value="usage">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="alpha">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 h-52 animate-pulse space-y-3">
              <div className="w-1/3 h-4 bg-slate-200 rounded" />
              <div className="w-3/4 h-5 bg-slate-200 rounded" />
              <div className="w-full h-14 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : sortedTemplates.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-navy-900">No templates found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedTemplates.map((template) => (
            <div
              key={template._id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:shadow-premium hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Category & Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-md truncate max-w-[180px]">
                    {template.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {template.usageCount || 0}
                    </span>
                    {!template.isSystem && (
                      <button
                        onClick={(e) => handleDeleteTemplate(template._id, e)}
                        className="text-slate-300 hover:text-rose-500 p-1 rounded transition"
                        title="Delete custom template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-navy-900 group-hover:text-brand-blue transition mb-1.5 line-clamp-1">
                  {template.title}
                </h3>

                <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>

                {/* Subject preview snippet */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 mb-4 line-clamp-1">
                  <span className="font-semibold text-slate-400 mr-1">Subject:</span>
                  {template.subject}
                </div>
              </div>

              {/* Actions footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="text-xs font-semibold text-slate-500 hover:text-navy-900 flex items-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>

                <button
                  onClick={() => onUseTemplate(template)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-blue-600 shadow-xs transition"
                >
                  Use Template
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-elevated border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[11px] font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-md">
                  {previewTemplate.category}
                </span>
                <h3 className="text-lg font-bold text-navy-900 mt-1">{previewTemplate.title}</h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-navy-900"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">{previewTemplate.description}</p>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-400">Subject:</span>
                <p className="text-xs font-bold text-navy-900 mt-0.5">{previewTemplate.subject}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400">Template Structure & Body:</span>
                <div className="mt-1 bg-white p-3 rounded-xl border border-slate-200 text-xs text-navy-900 whitespace-pre-wrap leading-relaxed font-sans max-h-72 overflow-y-auto">
                  {previewTemplate.body}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onUseTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-blue text-white hover:bg-blue-600 transition shadow-sm"
              >
                Use this Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-elevated border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-navy-900">Create Custom Template</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-navy-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">
                  Template Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Weekly Team Sprint Check-in"
                  className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EmailCategory)}
                    className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Default Tone</label>
                  <select
                    value={newTone}
                    onChange={(e) => setNewTone(e.target.value as EmailTone)}
                    className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Formal">Formal</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Confident">Confident</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g., Sprint Check-in: [Team Name] - [Date]"
                  className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Template Body</label>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={5}
                  placeholder="Use bracketed placeholders like [Recipient Name], [Date], [Project]..."
                  className="w-full px-3 py-2 text-xs text-navy-900 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none resize-none font-sans"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-blue text-white hover:bg-blue-600 shadow-sm"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
