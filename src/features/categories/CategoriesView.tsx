import React from 'react';
import { Tag, Briefcase, Building2, GraduationCap, Headphones, TrendingUp, Heart, Scale, ArrowRight } from 'lucide-react';
import { EmailCategory } from '../../types';

interface CategoriesViewProps {
  onSelectCategory: (cat: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ onSelectCategory }) => {
  const categoriesList = [
    {
      name: 'Job and Career',
      icon: Briefcase,
      color: 'from-blue-600 to-indigo-600',
      bgLight: 'bg-blue-50 text-brand-blue',
      description: 'Job applications, cover letters, referral requests, interview follow-ups, salary negotiation, and resignation.',
      useCases: ['Job application', 'Cover letter', 'Interview thank-you', 'Salary negotiation', 'Resignation notice', 'Referral request'],
    },
    {
      name: 'Business and Corporate',
      icon: Building2,
      color: 'from-navy-800 to-navy-900',
      bgLight: 'bg-slate-100 text-navy-900',
      description: 'Business introductions, partnership proposals, client onboarding, meeting minutes, project status updates, and vendor notices.',
      useCases: ['Business introduction', 'Project status update', 'Meeting minutes', 'Invoice reminder', 'Partnership proposal'],
    },
    {
      name: 'Education',
      icon: GraduationCap,
      color: 'from-emerald-600 to-teal-700',
      bgLight: 'bg-emerald-50 text-emerald-700',
      description: 'Leave applications, assignment submissions, professor communication, scholarship letters, and recommendation requests.',
      useCases: ['Professor communication', 'Assignment extension', 'Recommendation request', 'Leave application'],
    },
    {
      name: 'Customer Service',
      icon: Headphones,
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50 text-amber-700',
      description: 'Customer complaints, refund requests, delivery delay notices, apologies, support ticket answers, and cancellation notices.',
      useCases: ['Refund request', 'Customer apology', 'Delivery delay response', 'Support resolution'],
    },
    {
      name: 'Sales and Marketing',
      icon: TrendingUp,
      color: 'from-violet-600 to-purple-700',
      bgLight: 'bg-violet-50 text-brand-violet',
      description: 'Cold outreach, sales introductions, product launch releases, follow-up cadences, lead nurturing, and demo invitations.',
      useCases: ['Cold outreach', 'Product launch', 'Demo invitation', 'Follow-up campaign', 'Renewal reminder'],
    },
    {
      name: 'Personal and Everyday',
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      bgLight: 'bg-rose-50 text-rose-700',
      description: 'Heartfelt thank-yous, personal invitations, congratulations, condolence notes, and appointment requests.',
      useCases: ['Thank-you note', 'Celebration invitation', 'Condolence message', 'Personal apology'],
    },
    {
      name: 'Legal, Finance, and Administration',
      icon: Scale,
      color: 'from-cyan-600 to-blue-700',
      bgLight: 'bg-cyan-50 text-cyan-800',
      description: 'Document requests, payment confirmations, expense reimbursement, compliance inquiries, and policy clarifications.',
      useCases: ['Expense reimbursement', 'Compliance inquiry', 'Document request', 'Policy clarification'],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold">
            <Tag className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-extrabold text-navy-900 tracking-tight">
            Email Taxonomy & Categorized Domains
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Explore specialized domain communication structures with contextual vocabulary and recommended etiquette.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesList.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle hover:shadow-premium hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${cat.bgLight} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                    Domain #{idx + 1}
                  </span>
                </div>

                <h3 className="text-base font-bold text-navy-900 mb-1.5">{cat.name}</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{cat.description}</p>

                <div className="space-y-1.5 mb-6">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Supported Scenarios:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.useCases.map((uc, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectCategory(cat.name)}
                className="w-full py-2 rounded-xl border border-slate-200 hover:border-brand-blue hover:bg-blue-50/50 text-xs font-bold text-navy-900 hover:text-brand-blue transition flex items-center justify-center gap-1.5"
              >
                Browse {cat.name} Templates
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
