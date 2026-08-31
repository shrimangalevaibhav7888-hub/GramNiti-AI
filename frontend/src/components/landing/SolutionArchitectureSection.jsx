import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  Layers, 
  Database, 
  Globe, 
  FileText, 
  ShieldCheck,
  Zap,
  Code2,
  Workflow
} from 'lucide-react';

export const SolutionArchitectureSection = ({ setActiveTab }) => {
  const { t, language } = useLanguage();
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: 1,
      name: "1. User Query",
      tagline: "Voice or Text in 13 Indian Languages",
      desc: "Rural citizens share their village location, existing skills, available margin capital, or scheme question via voice or text.",
      tech: "Voice & Speech Recognition • 13 Regional Scripts • Instant Translation"
    },
    {
      num: 2,
      name: "2. AI Understanding",
      tagline: "Semantic Intent & Village Context",
      desc: "GramNiti AI parses the user's demographic profile, block parameters, mandi distance, and local purchasing power.",
      tech: "Village Demographics • Mandi Access Analysis • Purchasing Power Match"
    },
    {
      num: 3,
      name: "3. Government Data",
      tagline: "1000+ Verified Central & State Schemes",
      desc: "Queries are cross-referenced with official MoSJE, MSME, and State Government datasets with cryptographic provenance tracking.",
      tech: "Official Gazette Circulars • Central & State Databases • Live Verification"
    },
    {
      num: 4,
      name: "4. Recommendation",
      tagline: "Deterministic Feasibility & Subsidy Math",
      desc: "Generates 0–100 suitability scores, SWOT viability matrix, 10% margin / 90% loan calculation, and 3-case simulation.",
      tech: "Deterministic Financial Engine • Zero-Error Subsidy Math • 3-Case Projections"
    },
    {
      num: 5,
      name: "5. Action / DPR",
      tagline: "AI-Assisted Bank-Ready DPR Draft",
      desc: "Produces a structured, downloadable, and printable Detailed Project Report draft tailored for bank loan officers.",
      tech: "Bank-Ready DPR Draft • Loan Officer Checklist • Official Verification"
    }
  ];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-7">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#14532D] text-xs font-extrabold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#166534]" />
            <span>The Solution & Platform Capabilities</span>
          </div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
            One Platform. Smarter Access.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            From citizen query to bank-ready action — GramNiti AI acts as the intelligent GovTech bridge connecting rural India with verified opportunities.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('finance')}
          className="px-4 py-2.5 bg-[#166534] hover:bg-[#14532D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-center shrink-0 cursor-pointer"
        >
          <span>Try Financial Calculator</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 5-Step Process Pipeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            End-to-End Decision Pipeline
          </span>
          <span className="text-xs text-slate-400">Click any step to inspect</span>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {steps.map((step) => {
            const isActive = activeStep === step.num;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(step.num)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#14532D] text-white border-[#14532D] shadow-md ring-2 ring-emerald-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
                  <span className={isActive ? 'text-[#EAB308]' : 'text-slate-400'}>
                    Step 0{step.num}
                  </span>
                  {isActive && <Zap className="w-3.5 h-3.5 text-[#EAB308] animate-pulse" />}
                </div>
                <div className="text-xs font-bold truncate">
                  {step.name.split('. ')[1]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detail Card */}
        {(() => {
          const cur = steps.find(s => s.num === activeStep) || steps[0];
          return (
            <div className="bg-gradient-to-r from-[#DCFCE7]/40 via-white to-[#EFF6FF]/40 rounded-2xl p-5 border border-emerald-200 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-xs font-mono">
                    {cur.num}
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-slate-900">
                    {cur.name} — <span className="text-[#166534] font-medium">{cur.tagline}</span>
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  {cur.tech}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {cur.desc}
              </p>
            </div>
          );
        })()}
      </div>

      {/* Core Platform Pillars & Governance Ecosystem */}
      <div className="pt-2 border-t border-slate-100">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-3">
          Core Platform Pillars & Governance Ecosystem
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-[#14532D] shrink-0 font-bold text-base">
              📱
            </div>
            <div>
              <div className="font-bold text-slate-900">Citizen Access Portal</div>
              <div className="text-[11px] text-slate-500">Voice-first, mobile & desktop accessible</div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-900 shrink-0 font-bold text-base">
              ⚙️
            </div>
            <div>
              <div className="font-bold text-slate-900">Policy & Subsidy Engine</div>
              <div className="text-[11px] text-slate-500">Deterministic subsidy & EMI math</div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 shrink-0 font-bold text-base">
              🛡️
            </div>
            <div>
              <div className="font-bold text-slate-900">Verified Scheme Registry</div>
              <div className="text-[11px] text-slate-500">Official portals with data provenance</div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-900 shrink-0 font-bold text-base">
              🌐
            </div>
            <div>
              <div className="font-bold text-slate-900">Multilingual Voice AI</div>
              <div className="text-[11px] text-slate-500">13 Indian languages + speech assistance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
