import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGramNiti } from '../contexts/GramNitiContext';
import { AssumptionsCard } from '../components/common/AssumptionsCard';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { 
  Sliders, 
  TrendingUp, 
  Table, 
  ArrowRight, 
  Sparkles, 
  Info, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const SimulationPage = ({ setActiveTab }) => {
  const { t, language } = useLanguage();
  const { 
    simulationResult, 
    updateAssumption, 
    selectedBusiness, 
    financialPlan,
    currentLocation 
  } = useGramNiti();

  const businessName = language === 'mr' ? selectedBusiness?.name_mr : language === 'hi' ? selectedBusiness?.name_hi : selectedBusiness?.name;

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-cream-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 text-purple-800 rounded-xl">
              <Sliders className="w-5 h-5 text-purple-700" />
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-gray-900">
              {t('card_simulation_title')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            Interactive multi-scenario financial testing for <span className="font-semibold text-gray-900">{businessName}</span>.
          </p>
        </div>

        <div className="bg-purple-50 text-purple-900 border border-purple-200 px-3.5 py-2 rounded-xl text-xs font-semibold">
          Break-Even: ~{simulationResult?.break_even_estimate_months || 9} Months
        </div>
      </div>

      {/* Transparent Assumptions Editor */}
      <AssumptionsCard
        assumptions={simulationResult?.assumptions_used || []}
        onUpdateAssumption={updateAssumption}
      />

      {/* 3-Scenario Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Best Case */}
        <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-300 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              🟢 Best Case Scenario
            </span>
            <span className="text-[10px] bg-white text-emerald-800 font-mono px-2 py-0.5 rounded-full font-bold border border-emerald-200">
              High Yield (+15%)
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-600 block">Monthly Net Cashflow (Post-EMI):</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-900">
              {formatCurrency(simulationResult?.best_case?.net_cash_remaining || 21500)}
            </div>
          </div>
          <div className="text-xs text-gray-700 space-y-1 border-t border-emerald-200 pt-2 text-[11px]">
            <div className="flex justify-between">
              <span>Gross Revenue:</span>
              <span className="font-mono font-semibold">{formatCurrency(simulationResult?.best_case?.monthly_revenue || 52000)}</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Expenses:</span>
              <span className="font-mono font-semibold">{formatCurrency(simulationResult?.best_case?.monthly_expenses || 26800)}</span>
            </div>
            <div className="flex justify-between font-bold text-emerald-900 pt-0.5">
              <span>Annual Cash Surplus:</span>
              <span className="font-mono">{formatCurrency(simulationResult?.best_case?.annual_net_cash || 258000)}</span>
            </div>
          </div>
        </div>

        {/* 2. Normal Case (Expected Baseline) */}
        <div className="bg-amber-50/70 rounded-2xl p-5 border-2 border-amber-400 shadow-sm space-y-3 relative">
          <div className="absolute -top-2.5 right-4 bg-amber-500 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-2xs">
            Expected Baseline
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              🟡 Normal Case Scenario
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-600 block">Monthly Net Cashflow (Post-EMI):</span>
            <div className="text-2xl font-extrabold font-mono text-amber-950">
              {formatCurrency(simulationResult?.normal_case?.net_cash_remaining || 14300)}
            </div>
          </div>
          <div className="text-xs text-gray-700 space-y-1 border-t border-amber-200 pt-2 text-[11px]">
            <div className="flex justify-between">
              <span>Gross Revenue:</span>
              <span className="font-mono font-semibold">{formatCurrency(simulationResult?.normal_case?.monthly_revenue || 42000)}</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Expenses:</span>
              <span className="font-mono font-semibold">{formatCurrency(simulationResult?.normal_case?.monthly_expenses || 24000)}</span>
            </div>
            <div className="flex justify-between font-bold text-amber-950 pt-0.5">
              <span>Annual Cash Surplus:</span>
              <span className="font-mono">{formatCurrency(simulationResult?.normal_case?.annual_net_cash || 171600)}</span>
            </div>
          </div>
        </div>

        {/* 3. Worst Case */}
        <div className="bg-rose-50/70 rounded-2xl p-5 border border-rose-300 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              🔴 Worst Case Scenario
            </span>
            <span className="text-[10px] bg-white text-rose-800 font-mono px-2 py-0.5 rounded-full font-bold border border-rose-200">
              Low Yield (-20%)
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-600 block">Monthly Net Cashflow (Post-EMI):</span>
            <div className="text-2xl font-extrabold font-mono text-rose-950">
              {formatCurrency(simulationResult?.worst_case?.net_cash_remaining || 5800)}
            </div>
          </div>
          <div className="text-xs text-gray-700 space-y-1 border-t border-rose-200 pt-2 text-[11px]">
            <div className="flex justify-between">
              <span>Gross Revenue:</span>
              <span className="font-mono font-semibold">{formatCurrency(simulationResult?.worst_case?.monthly_revenue || 30200)}</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Expenses:</span>
              <span className="font-mono font-semibold">{formatCurrency(simulationResult?.worst_case?.monthly_expenses || 20700)}</span>
            </div>
            <div className="flex justify-between font-bold text-rose-950 pt-0.5">
              <span>Annual Cash Surplus:</span>
              <span className="font-mono">{formatCurrency(simulationResult?.worst_case?.annual_net_cash || 69600)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Scenario Comparison Table */}
      <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wider">
          Side-by-Side Scenario Profitability Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-cream-300 rounded-xl">
            <thead className="bg-cream-100 text-gray-700 font-semibold border-b border-cream-300">
              <tr>
                <th className="p-3">Financial Metric</th>
                <th className="p-3 text-emerald-800 font-bold bg-emerald-50/50">🟢 Best Case</th>
                <th className="p-3 text-amber-900 font-bold bg-amber-50/50">🟡 Normal Case</th>
                <th className="p-3 text-rose-900 font-bold bg-rose-50/50">🔴 Worst Case</th>
                <th className="p-3">Calculation Basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {simulationResult?.comparison_table?.map((row, idx) => (
                <tr key={idx} className="hover:bg-cream-50/50">
                  <td className="p-3 font-semibold text-gray-900">{row.metric_name}</td>
                  <td className="p-3 font-mono font-bold text-emerald-800 bg-emerald-50/30">
                    {formatCurrency(row.best_case)}
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-950 bg-amber-50/30">
                    {formatCurrency(row.normal_case)}
                  </td>
                  <td className="p-3 font-mono font-bold text-rose-900 bg-rose-50/30">
                    {formatCurrency(row.worst_case)}
                  </td>
                  <td className="p-3 text-gray-500 italic max-w-xs">{row.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setActiveTab('risk')}
            className="px-6 py-2.5 bg-rural-green-800 hover:bg-rural-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <span>Proceed to Risk Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mandatory Simulation Disclaimer */}
      <DisclaimerBanner type="simulation" />
    </div>
  );
};
