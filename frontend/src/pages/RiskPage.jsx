import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGramNiti } from '../contexts/GramNitiContext';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  TrendingDown, 
  HelpCircle, 
  Lightbulb,
  ShieldCheck
} from 'lucide-react';

export const RiskPage = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const { riskAssessment, selectedBusiness } = useGramNiti();

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-cream-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-gray-900">
              {t('nav_risk')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            Rule-based assessment identifying operational vulnerabilities for <span className="font-semibold text-gray-900">{selectedBusiness?.name}</span>.
          </p>
        </div>

        {/* Risk Scorecard */}
        <div className="bg-cream-50 p-3.5 rounded-2xl border border-cream-300 text-center min-w-[170px] shrink-0">
          <div className="text-[11px] text-gray-500 font-semibold uppercase">Overall Risk Score</div>
          <div className="text-3xl font-extrabold font-mono text-rural-green-900">
            {riskAssessment?.overall_risk_score || 32}
            <span className="text-sm text-gray-400 font-normal">/100</span>
          </div>
          <ScoreBadge 
            status={riskAssessment?.overall_risk_level || "LOW"} 
            label={(riskAssessment?.overall_risk_level || "Low") + " Risk Index"} 
            size="sm" 
          />
        </div>
      </div>

      {/* Contributing Risk Factors Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wider">
          Risk Factor Evaluation & Safeguards
        </h3>

        <div className="space-y-3">
          {riskAssessment?.contributing_factors?.map((factor, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                factor.risk_level === 'LOW'
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                  : factor.risk_level === 'MEDIUM'
                  ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                  : 'bg-rose-50/50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {factor.risk_level === 'LOW' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : factor.risk_level === 'MEDIUM' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span className="font-bold text-sm text-gray-900">{factor.factor_name}</span>
                  <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 font-mono">
                    {factor.category}
                  </span>
                </div>

                <ScoreBadge status={factor.risk_level} label={factor.risk_level + " Risk"} size="sm" />
              </div>

              <p className="text-gray-700 leading-relaxed pl-6">
                <span className="font-semibold text-gray-900">Observed Condition:</span> {factor.evidence}
              </p>

              {/* Actionable Mitigation Tip */}
              <div className="bg-white/80 p-2.5 rounded-lg border border-cream-300 ml-6 flex items-start gap-2 text-rural-green-950">
                <Lightbulb className="w-4 h-4 text-rural-saffron-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900">Recommended Safeguard: </span>
                  {factor.mitigation_advice}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className="px-6 py-2.5 bg-rural-green-800 hover:bg-rural-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <span>Proceed to Document Intelligence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
};
