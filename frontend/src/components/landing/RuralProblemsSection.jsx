import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  FileQuestion, 
  HelpCircle, 
  Languages, 
  Smartphone, 
  AlertTriangle, 
  ArrowRight,
  FileSpreadsheet,
  Building2,
  Users
} from 'lucide-react';

export const RuralProblemsSection = ({ setActiveTab }) => {
  const { t, language } = useLanguage();

  const problems = [
    {
      id: 1,
      title: "Information is Scattered",
      subtitle: "Fragmented Portals & Outdated Notices",
      desc: "Information is spread across 50+ central & state departments. Rural citizens struggle to find authentic guidelines, application dates, and circulars.",
      stat: "68% Citizens miss deadlines",
      icon: FileQuestion,
      color: "bg-red-50 text-red-700 border-red-200"
    },
    {
      id: 2,
      title: "Complex Government Schemes",
      subtitle: "Burdensome Eligibility & Paperwork",
      desc: "Scheme guidelines use complex bureaucratic jargon. Citizens cannot easily determine if they qualify for 25%–35% subsidies or what documents are needed.",
      stat: "82% Face documentation confusion",
      icon: AlertTriangle,
      color: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
      id: 3,
      title: "Language Barriers",
      subtitle: "Lack of Regional Language Guidance",
      desc: "Most official portals are in English or formal Hindi. Rural entrepreneurs need simple conversational explanations in their local mother tongue with voice support.",
      stat: "13 Official Languages Needed",
      icon: Languages,
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: 4,
      title: "Limited Digital Accessibility",
      subtitle: "Complex UIs & Low Tech Literacy",
      desc: "Complicated web portals require desktop navigation. Rural citizens need a simplified, mobile-first, voice-friendly decision layer to take action.",
      stat: "74% Depend on local middlemen",
      icon: Smartphone,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200"
    }
  ];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-red-800 text-xs font-extrabold uppercase tracking-wider font-mono">
            <span>The Rural Challenge</span>
          </div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
            Bridging the Rural Information Gap
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Millions of rural citizens, farmers, and micro-entrepreneurs face severe informational bottlenecks that prevent them from accessing rightful government welfare and business opportunities.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('advisor')}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-center shrink-0 cursor-pointer"
        >
          <span>See How GramNiti Solves This</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Problem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {problems.map((prob) => {
          const Icon = prob.icon;
          return (
            <div
              key={prob.id}
              className={`p-5 rounded-2xl border ${prob.color} flex flex-col justify-between space-y-4 hover:shadow-md transition-all`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-white shadow-2xs border border-inherit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold font-mono uppercase bg-white px-2 py-0.5 rounded-md border border-inherit">
                    Problem 0{prob.id}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    {prob.title}
                  </h3>
                  <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    {prob.subtitle}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {prob.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-inherit/40 flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-500">Key Barrier:</span>
                <span className="font-mono">{prob.stat}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
