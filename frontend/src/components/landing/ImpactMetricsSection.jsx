import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  Globe, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Users,
  Award
} from 'lucide-react';

export const ImpactMetricsSection = ({ setActiveTab }) => {
  const { t, language } = useLanguage();

  const impacts = [
    {
      metric: "75%+",
      title: "Better Scheme Awareness",
      desc: "Massive boost in rural scheme discovery, eliminating missed deadlines and hidden qualification criteria.",
      icon: TrendingUp,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200"
    },
    {
      metric: "10x",
      title: "Faster Access to Services",
      desc: "Instant eligibility verification in seconds instead of weeks of tedious bureaucratic visits.",
      icon: Zap,
      color: "text-blue-700 bg-blue-50 border-blue-200"
    },
    {
      metric: "13",
      title: "Inclusive Multilingual Languages",
      desc: "Voice-friendly conversational guidance in Hindi, Marathi, Bengali, Tamil, Telugu, and more.",
      icon: Globe,
      color: "text-purple-700 bg-purple-50 border-purple-200"
    },
    {
      metric: "₹20 L Cr+",
      title: "Data-Driven Rural Growth",
      desc: "Connecting rural micro-enterprises with prioritized banking credit flow and 25%–35% back-ended subsidies.",
      icon: ShieldCheck,
      color: "text-amber-700 bg-amber-50 border-amber-200"
    }
  ];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#14532D] text-xs font-extrabold uppercase tracking-wider font-mono">
            <Award className="w-3.5 h-3.5 text-[#166534]" />
            <span>Measurable Real-World Impact</span>
          </div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
            Building Smarter, More Empowered Villages
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            GramNiti AI is designed for national scale under the Digital India & MoSJE mandate to catalyze self-reliance and inclusive growth.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('action-plan')}
          className="px-5 py-3 bg-[#166534] hover:bg-[#14532D] text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 self-start sm:self-center shrink-0 cursor-pointer active:scale-98"
        >
          <span>Generate Bank-Ready DPR Draft</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {impacts.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${item.color} flex flex-col justify-between space-y-4 hover:shadow-md transition-all`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-white shadow-2xs border border-inherit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
                    {item.metric}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 pt-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Call To Action Banner */}
      <div className="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#0A230C] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-[10px] font-extrabold text-[#EAB308] uppercase tracking-wider font-mono">
            Smart Governance • Empowered Villages
          </div>
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
            Empower Your Village with GramNiti AI
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Take the first step toward building a sustainable, profitable rural enterprise with verified government subsidies and AI financial planning.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('advisor')}
            className="px-6 py-3.5 bg-[#EAB308] hover:bg-amber-400 text-slate-950 rounded-2xl font-heading font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-xl flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Explore Local Businesses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('schemes')}
            className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all border border-white/20 cursor-pointer"
          >
            <span>Browse Schemes</span>
          </button>
        </div>
      </div>
    </section>
  );
};
