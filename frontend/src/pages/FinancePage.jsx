import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGramNiti } from '../contexts/GramNitiContext';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';
import { EngineTransparencyCard } from '../components/common/EngineTransparencyCard';
import { 
  Calculator, 
  Coins, 
  Percent, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  Table, 
  Info,
  CheckCircle2,
  Clock,
  Landmark,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  Sliders,
  DollarSign,
  PieChart
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

export const FinancePage = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const { 
    financialPlan, 
    selectedBusiness, 
    selectedScheme, 
    eligibilityResult,
    userProfile 
  } = useGramNiti();

  const [activeMode, setActiveMode] = useState('SCA_ROUTER'); // 'SCA_ROUTER' or 'CUSTOM_SCHEME'

  // --- SCA Smart Scheme Router State ---
  const [marginCapital, setMarginCapital] = useState(userProfile?.available_capital || 100000);
  const [scaFrequency, setScaFrequency] = useState('QUARTERLY');
  const [scaRouterData, setScaRouterData] = useState(null);
  const [scaLoading, setScaLoading] = useState(false);

  // --- Custom Scheme Amortization State ---
  const [principal, setPrincipal] = useState(financialPlan?.loan_requirement || 180000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureMonths, setTenureMonths] = useState(60);
  const [repaymentFrequency, setRepaymentFrequency] = useState('MONTHLY');
  const [emiData, setEmiData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync with SCA router backend
  useEffect(() => {
    async function fetchRouter() {
      try {
        setScaLoading(true);
        const res = await api.routeMarginScheme(marginCapital, scaFrequency);
        setScaRouterData(res);
      } catch (e) {
        console.error("SCA Router calculation failed:", e);
        // Fallback local deterministic calculation
        const feasibleCost = marginCapital / 0.10;
        const isMFS = feasibleCost <= 140000;
        const maxLoan = isMFS ? Math.min(feasibleCost * 0.90, 125000) : Math.min(Math.min(feasibleCost, 5000000) * 0.90, 4500000);
        const rate = isMFS ? 6.5 : 8.0;
        const tenureY = isMFS ? 3 : 7;
        const tenureM = tenureY * 12;
        const morat = isMFS ? 3 : 6;
        setScaRouterData({
          available_margin_capital: marginCapital,
          margin_percentage: 10.0,
          total_feasible_project_cost: feasibleCost,
          maximum_loan_amount: maxLoan,
          selected_scheme_name: isMFS ? "Micro Finance Scheme" : "Term Loan Scheme",
          selected_scheme_tier: isMFS ? "Micro Finance Scheme (Up to ₹1.40 Lakh Cost)" : "Term Loan Scheme (₹1.40 Lakh to ₹50.00 Lakh Cost)",
          scheme_code: isMFS ? "MFS" : "TLS",
          annual_interest_rate_pct: rate,
          tenure_years: tenureY,
          tenure_months: tenureM,
          moratorium_months: morat,
          repayment_frequency: scaFrequency,
          repayment_periods_total: scaFrequency === 'QUARTERLY' ? tenureY * 4 : tenureM,
          installment_amount: Math.round(maxLoan / (scaFrequency === 'QUARTERLY' ? tenureY * 4 : tenureM) * 1.08),
          monthly_emi_equivalent: Math.round((maxLoan / tenureM) * 1.08),
          total_interest: Math.round(maxLoan * (rate / 100) * (tenureY / 2)),
          total_repayment: Math.round(maxLoan * 1.25),
          machinery_capex_component: feasibleCost * 0.75,
          working_capital_component: feasibleCost * 0.25,
          eligibility_logic_applied: isMFS
            ? `Project Cost of ₹${feasibleCost.toLocaleString('en-IN')} ≤ ₹1.40 Lakh -> Micro Finance Scheme (6.5% interest, 3-yr tenure, 3-mo moratorium, max loan ₹1.25 Lakh)`
            : `Project Cost of ₹${feasibleCost.toLocaleString('en-IN')} > ₹1.40 Lakh and ≤ ₹50.00 Lakh -> Term Loan Scheme (8% interest, 7-yr tenure, 6-mo moratorium, max loan ₹45 Lakh)`
        });
      } finally {
        setScaLoading(false);
      }
    }
    fetchRouter();
  }, [marginCapital, scaFrequency]);

  // Sync with standard EMI calculator
  useEffect(() => {
    if (financialPlan?.loan_requirement) {
      setPrincipal(financialPlan.loan_requirement);
    }
  }, [financialPlan]);

  useEffect(() => {
    async function calc() {
      try {
        setLoading(true);
        const res = await api.calculateEMI(principal, interestRate, tenureMonths, repaymentFrequency);
        setEmiData(res);
      } catch (e) {
        console.error("EMI calculation failed:", e);
      } finally {
        setLoading(false);
      }
    }
    calc();
  }, [principal, interestRate, tenureMonths, repaymentFrequency]);

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-emerald-100 text-[#14532D] rounded-2xl shadow-2xs">
              <Calculator className="w-5 h-5 text-[#166534]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
              Smart Financial Calculator & Scheme Router
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Official 10% Margin Money Router, State Channelizing Agency (SCA) Concessional Loans & Amortization Schedules.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode('SCA_ROUTER')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'SCA_ROUTER'
                ? 'bg-[#14532D] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>SCA Scheme Router (10/90)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('CUSTOM_SCHEME')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'CUSTOM_SCHEME'
                ? 'bg-[#14532D] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-300" />
            <span>Subsidy & Custom Amortization</span>
          </button>
        </div>
      </div>

      {/* Provenance Badge */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <ProvenanceBadge
          sourceName="Ministry of Social Justice and Empowerment (MoSJE) / National Channelizing Agencies"
          lastVerified="01-Aug-2026"
          coverage="Pan-India Concessional Credit (10% Margin : 90% Loan)"
          isDemoData={false}
          officialUrl="https://socialjustice.gov.in/"
        />
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: SCA SMART SCHEME ROUTER (10% MARGIN ➔ 90% CONCESSIONAL LOAN)       */}
      {/* ========================================================================= */}
      {activeMode === 'SCA_ROUTER' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Margin Input & Calculated Tiers */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#166534]" />
                  <span>Input Available Margin Capital (10% Contribution)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  The system automatically calculates your total borrowing capacity and routes you to the matching government concessional scheme.
                </p>
              </div>

              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setScaFrequency('QUARTERLY')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    scaFrequency === 'QUARTERLY'
                      ? 'bg-white text-[#14532D] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Quarterly Installment
                </button>
                <button
                  type="button"
                  onClick={() => setScaFrequency('MONTHLY')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    scaFrequency === 'MONTHLY'
                      ? 'bg-white text-[#14532D] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly EMI
                </button>
              </div>
            </div>

            {/* Live Margin Input Slider & Presets */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#166534]" />
                      <span>Your Available Cash / Margin Capital</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-mono font-extrabold text-[#14532D] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                        {formatCurrency(marginCapital)}
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={marginCapital}
                    onChange={(e) => setMarginCapital(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#166534]"
                  />

                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>₹10,000 (Micro)</span>
                    <span>₹1,00,000 (Standard)</span>
                    <span>₹5,00,000 (Max ₹50L Project)</span>
                  </div>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[14000, 30000, 50000, 100000, 250000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setMarginCapital(amt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        marginCapital === amt
                          ? 'bg-[#14532D] text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {formatCurrency(amt)} {amt === 14000 ? '(Micro Cap)' : amt === 100000 ? '(₹10L Project)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Output Summary Box */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#14532D] to-[#0A230C] text-white p-6 rounded-2xl space-y-4 shadow-md">
                <div className="flex items-center justify-between text-xs text-emerald-200">
                  <span className="font-semibold uppercase tracking-wider">Calculated Project Scale</span>
                  <span className="font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md">10% Margin Rule</span>
                </div>

                <div>
                  <span className="text-xs text-emerald-200/80 block">Total Feasible Project Cost (Margin / 10%)</span>
                  <div className="text-3xl font-extrabold font-mono text-[#EAB308] mt-0.5">
                    {formatCurrency(scaRouterData?.total_feasible_project_cost || marginCapital * 10)}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/20 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-emerald-200/80 block text-[11px]">Maximum 90% Loan:</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {formatCurrency(scaRouterData?.maximum_loan_amount || marginCapital * 9)}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-200/80 block text-[11px]">Your 10% Margin:</span>
                    <span className="font-mono font-bold text-[#EAB308] text-sm">
                      {formatCurrency(marginCapital)}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Scheme Routing Decision Logic Card */}
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#14532D]">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>Deterministic Scheme Auto-Selection Result:</span>
              </div>
              <p className="text-slate-700 font-medium pl-6 leading-relaxed">
                {scaRouterData?.eligibility_logic_applied || "Auto-routing applied based on statutory project cost thresholds."}
              </p>
            </div>

          </div>

          {/* Scheme Tiers Comparison & Matched Result */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tier A: Micro Finance Scheme Card */}
            <div className={`p-6 rounded-3xl border transition-all ${
              scaRouterData?.scheme_code === 'MFS'
                ? 'bg-white border-[#16A34A] ring-2 ring-[#16A34A]/40 shadow-md'
                : 'bg-slate-50 border-slate-200 opacity-70'
            }`}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
                    <Coins className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-slate-900">
                      Tier 1: Micro Finance Scheme
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">Project Cost up to ₹1.40 Lakh</span>
                  </div>
                </div>
                {scaRouterData?.scheme_code === 'MFS' && (
                  <span className="px-2.5 py-1 rounded-full bg-[#14532D] text-white text-[10px] font-bold uppercase tracking-wider font-mono">
                    ✓ ACTIVE MATCH
                  </span>
                )}
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>Concessional Interest Rate:</span>
                  <strong className="text-blue-700 font-mono">6.5% per annum</strong>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>Repayment Tenure:</span>
                  <strong className="font-mono">3 Years (36 Months)</strong>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>Moratorium Period:</span>
                  <strong className="text-amber-700 font-mono">3 Months</strong>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span>Maximum Agency Loan:</span>
                  <strong className="font-mono">Up to 90% (Max ₹1.25 Lakh)</strong>
                </li>
              </ul>
            </div>

            {/* Tier B: Term Loan Scheme Card */}
            <div className={`p-6 rounded-3xl border transition-all ${
              scaRouterData?.scheme_code === 'TLS'
                ? 'bg-white border-[#16A34A] ring-2 ring-[#16A34A]/40 shadow-md'
                : 'bg-slate-50 border-slate-200 opacity-70'
            }`}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-purple-100 text-purple-800">
                    <Landmark className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-slate-900">
                      Tier 2: Term Loan Scheme
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">Project Cost ₹1.40 Lakh to ₹50.00 Lakh</span>
                  </div>
                </div>
                {scaRouterData?.scheme_code === 'TLS' && (
                  <span className="px-2.5 py-1 rounded-full bg-[#14532D] text-white text-[10px] font-bold uppercase tracking-wider font-mono">
                    ✓ ACTIVE MATCH
                  </span>
                )}
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>Concessional Interest Rate:</span>
                  <strong className="text-purple-700 font-mono">8.0% per annum</strong>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>Repayment Tenure:</span>
                  <strong className="font-mono">7 Years (84 Months)</strong>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>Moratorium Period:</span>
                  <strong className="text-amber-700 font-mono">6 Months</strong>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span>Maximum Agency Loan:</span>
                  <strong className="font-mono">Up to 90% (Max ₹45.00 Lakh)</strong>
                </li>
              </ul>
            </div>

          </div>

          {/* Project Capital Breakdown: CapEx vs Working Capital */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#166534]" />
              <span>Project Capital & Working Capital Utilization</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-medium">10% Promoter Margin</span>
                <div className="text-xl font-extrabold font-mono text-slate-900">
                  {formatCurrency(marginCapital)}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Initial Cash Equity Provided
                </span>
              </div>

              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-1">
                <span className="text-xs text-emerald-800 font-medium">75% CapEx (Machinery & Shed)</span>
                <div className="text-xl font-extrabold font-mono text-[#14532D]">
                  {formatCurrency(scaRouterData?.machinery_capex_component || marginCapital * 7.5)}
                </div>
                <span className="text-[10px] text-emerald-700 block">
                  Equipment, Cattle/Chilling, Shed
                </span>
              </div>

              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 space-y-1">
                <span className="text-xs text-blue-800 font-medium">25% Working Capital</span>
                <div className="text-xl font-extrabold font-mono text-blue-900">
                  {formatCurrency(scaRouterData?.working_capital_component || marginCapital * 2.5)}
                </div>
                <span className="text-[10px] text-blue-700 block">
                  Feed, Raw Material & 3-Mo Ops
                </span>
              </div>
            </div>
          </div>

          {/* Repayment Schedule & Moratorium Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#166534]" />
                  <span>Repayment Schedule factoring {scaRouterData?.moratorium_months || 6}-Month Moratorium</span>
                </h3>
                <p className="text-xs text-slate-500">
                  During the initial {scaRouterData?.moratorium_months || 6}-month moratorium, the enterprise can establish operations before full principal repayments commence.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium block">
                  {scaFrequency === 'QUARTERLY' ? 'Quarterly Installment' : 'Monthly EMI'}
                </span>
                <span className="text-2xl font-extrabold font-mono text-[#14532D]">
                  {formatCurrency(scaRouterData?.installment_amount || 0)}
                </span>
              </div>
            </div>

            {/* Repayment KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Concessional Rate:</span>
                <strong className="text-slate-900 font-mono text-sm">{scaRouterData?.annual_interest_rate_pct}% p.a.</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Tenure:</span>
                <strong className="text-slate-900 font-mono text-sm">{scaRouterData?.tenure_years} Years ({scaRouterData?.tenure_months} Mo)</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Interest:</span>
                <strong className="text-amber-700 font-mono text-sm">{formatCurrency(scaRouterData?.total_interest || 0)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Outflow:</span>
                <strong className="text-[#14532D] font-mono text-sm">{formatCurrency(scaRouterData?.total_repayment || 0)}</strong>
              </div>
            </div>

            {/* Amortization Table */}
            {scaRouterData?.amortization_preview && scaRouterData.amortization_preview.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Table className="w-4 h-4 text-[#166534]" />
                    <span>Amortization Schedule (First 12 {scaFrequency === 'QUARTERLY' ? 'Quarters' : 'Months'})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">Standard Reducing Balance</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5">Period</th>
                        <th className="p-2.5">Opening Balance</th>
                        <th className="p-2.5">Installment</th>
                        <th className="p-2.5">Principal</th>
                        <th className="p-2.5">Interest</th>
                        <th className="p-2.5">Closing Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {scaRouterData.amortization_preview.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-sans font-bold text-slate-800">{row.period_label || `Period ${idx + 1}`}</td>
                          <td className="p-2.5 text-slate-600">{formatCurrency(row.opening_balance)}</td>
                          <td className="p-2.5 font-bold text-[#14532D]">{formatCurrency(row.installment_amount || row.emi)}</td>
                          <td className="p-2.5 text-slate-700">{formatCurrency(row.principal_component)}</td>
                          <td className="p-2.5 text-amber-700">{formatCurrency(row.interest_component)}</td>
                          <td className="p-2.5 font-bold text-slate-900">{formatCurrency(row.closing_balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('simulation')}
                className="px-5 py-2.5 bg-[#166534] hover:bg-[#14532D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Simulate 3-Scenario Cashflows</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CUSTOM CREDIT-LINKED SUBSIDY & AMORTIZATION CALCULATOR            */}
      {/* ========================================================================= */}
      {activeMode === 'CUSTOM_SCHEME' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Project Financing Structuring Breakdown Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
                1. Scheme-Dependent Capital Structuring (Means of Finance)
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Category: <strong className="text-slate-800">{userProfile?.social_category || 'General'}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Total Project Cost</span>
                <div className="text-xl font-extrabold font-mono text-slate-900">
                  {formatCurrency(financialPlan?.total_project_cost || 220000)}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Machinery, Assets & Working Capital
                </span>
              </div>

              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 space-y-1">
                <span className="text-xs text-emerald-800 font-medium">Own Contribution (Margin)</span>
                <div className="text-xl font-extrabold font-mono text-[#14532D]">
                  {formatCurrency(financialPlan?.own_contribution_amount || 22000)}
                </div>
                <span className="text-[10px] text-emerald-700 font-bold block">
                  {financialPlan?.own_contribution_pct || 10}% Beneficiary Equity
                </span>
              </div>

              <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-200 space-y-1">
                <span className="text-xs text-purple-800 font-medium">Eligible Scheme Subsidy</span>
                <div className="text-xl font-extrabold font-mono text-purple-900">
                  {formatCurrency(financialPlan?.subsidy_amount || 55000)}
                </div>
                <span className="text-[10px] text-purple-700 font-bold block">
                  {financialPlan?.subsidy_pct || 25}% Govt Margin Subsidy (TDR)
                </span>
              </div>

              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 space-y-1">
                <span className="text-xs text-blue-800 font-bold">Bank Term Loan Needed</span>
                <div className="text-xl font-extrabold font-mono text-blue-900">
                  {formatCurrency(financialPlan?.loan_requirement || 198000)}
                </div>
                <span className="text-[10px] text-blue-700 block">
                  Applied Term Loan Principal
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-[#14532D] leading-relaxed">
              {financialPlan?.calculation_explanation || "Structuring generated based on versioned official margin money rules."}
            </div>
          </div>

          {/* Interactive Custom Installment Calculator */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
                2. Custom Reducing-Balance Repayment Calculator
              </h3>

              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setRepaymentFrequency('MONTHLY')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    repaymentFrequency === 'MONTHLY'
                      ? 'bg-white text-[#14532D] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly EMI
                </button>
                <button
                  type="button"
                  onClick={() => setRepaymentFrequency('QUARTERLY')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    repaymentFrequency === 'QUARTERLY'
                      ? 'bg-white text-[#14532D] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Quarterly Installment
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sliders */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Loan Principal Amount</label>
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {formatCurrency(principal)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="2500000"
                    step="10000"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#166534]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>₹50,000</span>
                    <span>₹10,00,000</span>
                    <span>₹25,00,000</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Annual Bank Interest Rate (%)</label>
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {interestRate}% p.a.
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="16.0"
                    step="0.25"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#166534]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>4.0% (Subvented)</span>
                    <span>8.5% (Standard)</span>
                    <span>16.0%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Repayment Tenure</label>
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {tenureMonths} Months ({Math.round(tenureMonths / 12)} Years)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="84"
                    step="6"
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#166534]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>1 Year (12 Mo)</span>
                    <span>5 Years (60 Mo)</span>
                    <span>7 Years (84 Mo)</span>
                  </div>
                </div>
              </div>

              {/* Result Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#14532D] to-[#0A230C] rounded-2xl p-6 text-white space-y-5 flex flex-col justify-between shadow-md">
                <div>
                  <span className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">
                    {repaymentFrequency === 'QUARTERLY' ? 'Quarterly Installment' : 'Monthly EMI'}
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#EAB308] mt-1">
                    {formatCurrency(emiData?.installment_amount || emiData?.monthly_emi || 3694)}
                  </div>
                  <span className="text-xs text-emerald-100/80 block mt-1">
                    Reducing balance amortization ({repaymentFrequency.toLowerCase()})
                  </span>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/20 text-xs">
                  <div className="flex justify-between">
                    <span className="text-emerald-100">Total Interest Payable:</span>
                    <span className="font-mono font-bold text-white">
                      {formatCurrency(emiData?.total_interest || 41640)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-100">Total Bank Repayment:</span>
                    <span className="font-mono font-bold text-white">
                      {formatCurrency(emiData?.total_repayment || 221640)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-100">Total Installments:</span>
                    <span className="font-mono font-bold text-white">
                      {emiData?.periods_total || (repaymentFrequency === 'QUARTERLY' ? 20 : 60)} {repaymentFrequency === 'QUARTERLY' ? 'Quarters' : 'Months'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('simulation')}
                  className="w-full py-3 bg-[#EAB308] hover:bg-[#F59E0B] text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Test with 3-Case Simulation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Amortization Schedule Table Preview */}
            {emiData?.amortization_preview && emiData.amortization_preview.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Table className="w-4 h-4 text-[#166534]" />
                    <span>Amortization Schedule Preview (First 12 {repaymentFrequency === 'QUARTERLY' ? 'Quarters' : 'Months'})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">Reducing Balance Schedule</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5">Period</th>
                        <th className="p-2.5">Opening Balance</th>
                        <th className="p-2.5">Installment</th>
                        <th className="p-2.5">Principal</th>
                        <th className="p-2.5">Interest</th>
                        <th className="p-2.5">Closing Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {emiData.amortization_preview.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-sans font-bold text-slate-800">{row.period_label || `Month ${row.month}`}</td>
                          <td className="p-2.5 text-slate-600">{formatCurrency(row.opening_balance)}</td>
                          <td className="p-2.5 font-bold text-[#14532D]">{formatCurrency(row.installment_amount || row.emi)}</td>
                          <td className="p-2.5 text-slate-700">{formatCurrency(row.principal_component)}</td>
                          <td className="p-2.5 text-amber-700">{formatCurrency(row.interest_component)}</td>
                          <td className="p-2.5 font-bold text-slate-900">{formatCurrency(row.closing_balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Engine Audit Transparency */}
      <EngineTransparencyCard />

      {/* Standard Planning Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
};
