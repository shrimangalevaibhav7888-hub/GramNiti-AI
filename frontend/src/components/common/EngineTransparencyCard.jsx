import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Database, Calculator, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

/**
 * EngineTransparencyCard
 * Displays a transparent breakdown of "How this result was generated",
 * distinguishing Deterministic Mathematical/Rule Engines from AI/RAG Explanation Layers.
 */
export const EngineTransparencyCard = ({
  title = "How this result was generated",
  items = null,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultItems = [
    { label: "Business Explanation & Context", engine: "AI / RAG Synthesis", type: "AI", icon: Sparkles, color: "text-purple-700 bg-purple-50" },
    { label: "Scheme Eligibility Evaluation", engine: "Rule Engine (Deterministic)", type: "RULE", icon: ShieldCheck, color: "text-emerald-700 bg-emerald-50" },
    { label: "Loan & Subsidy Structuring", engine: "Financial Math Engine", type: "MATH", icon: Calculator, color: "text-blue-700 bg-blue-50" },
    { label: "Amortization & EMI Schedule", engine: "Reducing-Balance Formula", type: "MATH", icon: Calculator, color: "text-blue-700 bg-blue-50" },
    { label: "Scheme Rules & Parameters", engine: "Official Gazette Database", type: "SOURCE", icon: Database, color: "text-slate-700 bg-slate-100" },
    { label: "Risk Assessment & SWOT", engine: "Multi-Factor Rule Engine", type: "RULE", icon: ShieldCheck, color: "text-amber-700 bg-amber-50" },
    { label: "DPR Narrative Synthesis", engine: "AI Structured Formatter", type: "AI", icon: BookOpen, color: "text-teal-700 bg-teal-50" }
  ];

  const displayItems = items || defaultItems;

  return (
    <div className={`bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden text-xs ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#166534]" />
          <span className="font-bold text-slate-800">{title}</span>
          <span className="text-[10px] bg-emerald-100 text-[#14532D] font-mono px-2 py-0.5 rounded-full font-semibold">
            Audit Trail
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 font-medium text-[11px]">
          <span>{isOpen ? 'Hide Details' : 'View Source Mapping'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-2 border-t border-slate-200/60 animate-in fade-in">
          <p className="text-[11px] text-slate-500 mb-2">
            GramNiti AI maintains strict separation: LLMs only explain and synthesize context; all eligibility, subsidy formulas, and financial calculations are executed by deterministic mathematical rule engines.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {displayItems.map((item, idx) => {
              const Icon = item.icon || Cpu;
              return (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${item.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-slate-700">{item.label}</span>
                  </div>
                  <span className="font-mono font-bold text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {item.engine}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
