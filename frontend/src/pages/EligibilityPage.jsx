import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGramNiti } from '../contexts/GramNitiContext';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  UserCheck,
  Building,
  Info
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const EligibilityPage = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const { 
    eligibilityResult, 
    selectedScheme, 
    userProfile, 
    currentLocation, 
    selectedBusiness 
  } = useGramNiti();

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-cream-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <UserCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-gray-900">
              {t('nav_eligibility')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            Deterministic rule engine checking criteria for <span className="font-semibold text-gray-900">{selectedScheme?.name}</span>.
          </p>
        </div>

        <ScoreBadge 
          status={eligibilityResult?.status || "ELIGIBLE"} 
          size="lg"
        />
      </div>

      {/* Mandatory Disclaimer: Scheme Eligibility != Bank Loan Approval */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 leading-relaxed shadow-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900 text-sm block mb-1">
            Important Statutory Distinction:
          </span>
          {eligibilityResult?.disclaimer || t('disclaimer_eligibility')}
        </div>
      </div>

      {/* Rate Provisions Card (Subsidies and Margins) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">Eligible Scheme Subsidy</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-700">
            {eligibilityResult?.applicable_subsidy_pct || 25.0}%
          </div>
          <span className="text-[11px] text-gray-500">
            Margin Money Capital Subsidy under Rural {userProfile.social_category} Quota
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">Required Promoter Margin</span>
          <div className="text-2xl font-extrabold font-mono text-rural-green-800">
            {eligibilityResult?.applicable_margin_money_pct || 10.0}%
          </div>
          <span className="text-[11px] text-gray-500">
            Own capital contribution needed ({formatCurrency((selectedBusiness?.typical_investment || 220000) * (eligibilityResult?.applicable_margin_money_pct || 10.0) / 100)})
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">Eligible Bank Loan Limit</span>
          <div className="text-2xl font-extrabold font-mono text-blue-800">
            {formatCurrency((selectedBusiness?.typical_investment || 220000) * (1 - (eligibilityResult?.applicable_margin_money_pct || 10.0) / 100))}
          </div>
          <span className="text-[11px] text-gray-500">
            Balance funded through bank term credit
          </span>
        </div>
      </div>

      {/* Condition by Condition Rule Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wider">
            Deterministic Condition Breakdown
          </h3>
          <span className="text-xs text-gray-500 font-mono">
            {eligibilityResult?.conditions_checked?.filter(c => c.is_satisfied).length || 5} of {eligibilityResult?.conditions_checked?.length || 5} Conditions Met
          </span>
        </div>

        <div className="space-y-3">
          {eligibilityResult?.conditions_checked?.map((cond, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                cond.is_satisfied
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/60 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {cond.is_satisfied ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="font-bold text-gray-900 text-sm">{cond.condition_name}</div>
                  <p className="text-gray-700 leading-snug">{cond.explanation}</p>
                  <div className="text-[11px] text-gray-500">
                    Scheme Requirement: <span className="font-semibold">{cond.required_value}</span>
                  </div>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="text-[10px] text-gray-500 block uppercase font-semibold">Your Value</span>
                <span className="font-bold font-mono text-gray-900 bg-white/80 px-2 py-0.5 rounded border border-gray-200">
                  {cond.user_value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setActiveTab('finance')}
            className="px-6 py-2.5 bg-rural-green-800 hover:bg-rural-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <span>Proceed to Financial & EMI Planning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
};
