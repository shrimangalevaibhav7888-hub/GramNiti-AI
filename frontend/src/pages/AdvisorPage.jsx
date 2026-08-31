import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGramNiti } from '../contexts/GramNitiContext';
import { BusinessAnalysisDashboard } from '../components/business/BusinessAnalysisDashboard';
import { ExplainModal } from '../components/common/ExplainModal';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { 
  TrendingUp, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Volume2, 
  Sparkles,
  Users,
  Store,
  Tag,
  Layers,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const AdvisorPage = ({ setActiveTab }) => {
  const { t, language, speak } = useLanguage();
  const { 
    recommendations, 
    selectedBusiness, 
    selectBusiness, 
    feasibilityReport,
    currentLocation, 
    userProfile,
    loading 
  } = useGramNiti();

  const [activeExplainRec, setActiveExplainRec] = useState(null);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' or 'list'

  return (
    <div className="space-y-7 animate-in fade-in pb-16">
      {/* View Switcher Ribbon */}
      <div className="flex items-center justify-between bg-white p-3 px-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#166534]" />
          <span className="text-xs font-bold text-slate-800">
            {t('tab_business_dashboard')} & Market Intelligence
          </span>
        </div>

        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('dashboard')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'dashboard'
                ? 'bg-white text-[#14532D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Analysis Dashboard
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-[#14532D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Recommended Sectors ({recommendations.length})
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'dashboard' ? (
        <BusinessAnalysisDashboard setActiveTab={setActiveTab} />
      ) : (
        <div className="space-y-4">
          <h3 className="font-heading font-extrabold text-base text-slate-900 px-1">
            All Evaluated Business Sectors for {currentLocation?.village_name}
          </h3>

          {recommendations.map((rec) => {
            const isSelected = selectedBusiness?.code === rec.code;
            const displayName = language === 'mr' ? rec.name_mr : language === 'hi' ? rec.name_hi : rec.name;

            return (
              <div
                key={rec.business_id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-xs ${
                  isSelected
                    ? 'border-[#166534] ring-2 ring-[#DCFCE7] bg-[#DCFCE7]/10'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  {/* Title & Sector */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                        #{rec.suitability_rank}
                      </span>
                      <h4 className="text-base sm:text-lg font-heading font-bold text-slate-900">
                        {displayName}
                      </h4>
                      <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
                        {rec.sector}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {rec.why_recommended_summary}
                    </p>
                  </div>

                  {/* Suitability Score */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Suitability</div>
                      <div className="text-2xl font-extrabold font-mono text-[#14532D]">
                        {rec.suitability_score}<span className="text-xs text-slate-400">/100</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#DCFCE7] text-[#14532D] font-mono">
                      ✓ Recommended
                    </span>
                  </div>
                </div>

                {/* Financial Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-semibold">Estimated Project Cost:</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">{formatCurrency(rec.typical_investment)}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-semibold">Estimated Loan Need:</span>
                    <span className="font-bold text-[#14532D] font-mono text-sm">{formatCurrency(rec.estimated_loan_requirement)}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-semibold">Typical Monthly Profit:</span>
                    <span className="font-bold text-[#16A34A] font-mono text-sm">~{formatCurrency(rec.typical_monthly_profit)}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-semibold">Est. Break-Even:</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">{rec.break_even_months} Months</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveExplainRec(rec)}
                    className="text-xs text-[#166534] hover:text-[#14532D] font-bold flex items-center gap-1.5 underline decoration-dotted cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-[#166534]" />
                    {t('btn_explain')}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      selectBusiness(rec);
                      setViewMode('dashboard');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#166534] text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? '✓ Selected • Open Dashboard' : 'Select Business & View Analysis'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Explain Modal */}
      {activeExplainRec && (
        <ExplainModal
          recommendation={activeExplainRec}
          onClose={() => setActiveExplainRec(null)}
        />
      )}

      <DisclaimerBanner type="general" />
    </div>
  );
};
