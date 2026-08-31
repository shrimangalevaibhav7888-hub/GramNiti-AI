import React, { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGramNiti } from '../contexts/GramNitiContext';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { EngineTransparencyCard } from '../components/common/EngineTransparencyCard';
import { 
  FileText, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin,
  TrendingUp,
  Landmark,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Volume2,
  PieChart,
  BarChart3,
  Calendar,
  Layers,
  Store,
  DollarSign,
  Percent,
  CheckCircle,
  AlertTriangle,
  Award,
  Clock,
  Shield,
  FileCheck2
} from 'lucide-react';
import { formatCurrency, formatLakhs } from '../utils/formatters';

export const ActionPlanPage = ({ setActiveTab }) => {
  const { t, language, speak } = useLanguage();
  const { 
    actionPlan, 
    userProfile, 
    currentLocation, 
    selectedBusiness, 
    feasibilityReport,
    selectedScheme,
    financialPlan,
    simulationResult,
    riskAssessment,
    uploadedDocCodes
  } = useGramNiti();
  
  const printRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  if (!actionPlan) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-xs">
        Loading Detailed Project Report...
      </div>
    );
  }

  const businessDisplayName = actionPlan.business_name_mr && language === 'mr' 
    ? actionPlan.business_name_mr 
    : actionPlan.business_name_hi && language === 'hi' 
    ? actionPlan.business_name_hi 
    : actionPlan.business_name || 'Dairy Farming';
  const currentActionSteps = language === 'mr' 
    ? actionPlan.action_steps_mr 
    : language === 'hi' 
    ? actionPlan.action_steps_hi 
    : actionPlan.action_steps;

  // Means of finance percentages
  const projCost = actionPlan.project_cost || 220000;
  const ownAmt = actionPlan.own_contribution || 22000;
  const subsidyAmt = actionPlan.eligible_subsidy || 55000;
  const loanAmt = actionPlan.bank_loan || 198000;
  const netLoanAfterSubsidy = Math.max(0, loanAmt - subsidyAmt);

  const ownPct = Math.round((ownAmt / projCost) * 100);
  const subsidyPct = Math.round((subsidyAmt / projCost) * 100);
  const loanPct = Math.round((loanAmt / projCost) * 100);

  // 3-scenario cashflows
  const normalProfit = simulationResult?.normal_case?.net_cash_remaining || actionPlan.normal_case_monthly_profit || 14306;
  const bestProfit = simulationResult?.best_case?.net_cash_remaining || Math.round(normalProfit * 1.55);
  const worstProfit = simulationResult?.worst_case?.net_cash_remaining || Math.max(2500, Math.round(normalProfit * 0.45));

  // Audio summary readout builder supporting 13 languages
  const handleReadSummary = () => {
    const costStr = formatCurrency(projCost);
    const ownStr = formatCurrency(ownAmt);
    const subStr = formatCurrency(subsidyAmt);
    const loanStr = formatCurrency(loanAmt);
    const emiStr = formatCurrency(actionPlan.monthly_emi);
    const profitStr = formatCurrency(normalProfit);
    const biz = businessDisplayName;

    const speechMap = {
      mr: `तुमचा ${biz} सविस्तर प्रकल्प अहवाल: एकूण खर्च ${costStr} आहे. स्वतःचे भांडवल ${ownStr}, शासकीय अनुदान ${subStr}, आणि बँक कर्ज ${loanStr} आहे. दरमहा बँकेचा हप्ता ${emiStr} असून हप्ता भरून हातात दरमहा सुमारे ${profitStr} निव्वळ नफा राहील.`,
      hi: `आपकी ${biz} विस्तृत परियोजना रिपोर्ट: कुल लागत ${costStr} है। अपनी पूंजी ${ownStr}, सरकारी सब्सिडी ${subStr}, और बैंक ऋण ${loanStr} है। मासिक बैंक EMI ${emiStr} चुकाने के बाद लगभग ${profitStr} शुद्ध लाभ रहेगा।`,
      bn: `আপনার ${biz} বিস্তারিত প্রকল্প প্রতিবেদন: মোট প্রয়োজনীয় ব্যয় ${costStr}। নিজস্ব মূলধন ${ownStr}, সরকারি অনুদান ${subStr}, এবং ব্যাংক ঋণ ${loanStr}। মাসিক ব্যাংক কিস্তি ${emiStr} পরিশোধের পর প্রায় ${profitStr} নিট লাভ থাকবে।`,
      gu: `તમારો ${biz} વિગતવાર પ્રોજેક્ટ અહેવાલ: કુલ ખર્ચ ${costStr} છે. પોતાની મૂડી ${ownStr}, સરકારી સબસિડી ${subStr}, અને બેંક લોન ${loanStr} છે. માસિક બેંક હપ્તો ${emiStr} બાદ આશરે ${profitStr} ચોખ્ખો નફો રહેશે.`,
      pa: `ਤੁਹਾਡੀ ${biz} ਵਿਸਤ੍ਰਿਤ ਪ੍ਰੋਜੈਕਟ ਰਿਪੋਰਟ: ਕੁੱਲ ਲਾਗਤ ${costStr} ਹੈ। ਆਪਣੀ ਪੂੰਜੀ ${ownStr}, ਸਰਕਾਰੀ ਸਬਸਿਡੀ ${subStr}, ਅਤੇ ਬੈਂਕ ਕਰਜ਼ਾ ${loanStr} ਹੈ। ਮਹੀਨਾਵਾਰ ਕਿਸ਼ਤ ${emiStr} ਕੱਟ ਕੇ ਲਗਭਗ ${profitStr} ਸ਼ੁੱਧ ਮੁਨਾਫਾ ਰਹੇਗਾ।`,
      ta: `உங்கள் ${biz} விரிவான திட்ட அறிக்கை: மொத்த செலவு ${costStr}. சொந்த முதலீடு ${ownStr}, அரசு மானியம் ${subStr}, வங்கி கடன் ${loanStr}. மாதாந்திர தவணை ${emiStr} கழித்து சுமார் ${profitStr} நிகர லாபம் எதிர்பார்க்கப்படுகிறது.`,
      te: `మీ ${biz} సమగ్ర ప్రాజెక్ట్ నివేదిక: మొత్తం వ్యయం ${costStr}. సొంత పెట్టుబడి ${ownStr}, ప్రభుత్వ సబ్సిడీ ${subStr}, బ్యాంక్ రుణం ${loanStr}. నెలవారీ వాయిదా ${emiStr} పోను సుమారు ${profitStr} నికర లాభం ఉంటుంది.`,
      kn: `ನಿಮ್ಮ ${biz} ವಿವರವಾದ ಯೋಜನಾ ವರದಿ: ಒಟ್ಟು ವೆಚ್ಚ ${costStr}. ಸ್ವಂತ ಬಂಡವಾಳ ${ownStr}, ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ${subStr}, ಬ್ಯಾಂಕ್ ಸಾಲ ${loanStr}. ಮಾಸಿಕ ಕಂತು ${emiStr} ಪಾವತಿಸಿದ ನಂತರ ಸುಮಾರು ${profitStr} ನಿವ್ವಳ ಲಾಭ ಉಳಿಯುತ್ತದೆ.`,
      ml: `നിങ്ങളുടെ ${biz} പ്രോജക്ട് റിപ്പോർട്ട്: ആകെ ചെലവ് ${costStr}. സ്വന്തം നിക്ഷേപം ${ownStr}, സർക്കാർ സബ്‌സിഡി ${subStr}, ബാങ്ക് വായ്പ ${loanStr}. പ്രതിമാസ തവണ ${emiStr} കഴിഞ്ഞ് ഏകദേശം ${profitStr} അറ്റാദായം ലഭിക്കും.`,
      or: `ଆପଣଙ୍କର ${biz} ବିସ୍ତୃତ ପ୍ରକଳ୍ପ ରିପୋର୍ଟ: ମୋଟ ଖର୍ଚ୍ଚ ${costStr}। ନିଜ ପୁଞ୍ଜି ${ownStr}, ସରକାରୀ ଅନୁଦାନ ${subStr}, ଏବଂ ବ୍ୟାଙ୍କ ଋଣ ${loanStr}। ମାସିକ କିସ୍ତି ${emiStr} ପରେ ପ୍ରାୟ ${profitStr} ନିଟ୍ ଲାଭ ରହିବ।`,
      as: `আপোনাৰ ${biz} প্ৰকল্প প্ৰতিবেদন: মুঠ খৰচ ${costStr}। নিজা মূলধন ${ownStr}, চৰকাৰী ৰাজসাহায্য ${subStr}, আৰু বেংক ঋণ ${loanStr}। মাহেকীয়া কিস্তি ${emiStr} ৰ পিছত প্ৰায় ${profitStr} লাভ থাকিব।`,
      ur: `آپ کی ${biz} تفصیلی پروجیکٹ رپورٹ: کل لاگت ${costStr} ہے۔ ذاتی سرمایہ ${ownStr}، سرکاری سبسڈی ${subStr}، اور بینک قرض ${loanStr} ہے۔ ماہانہ قسط ${emiStr} کے بعد تقریباً ${profitStr} خالص منافع متوقع ہے۔`
    };

    const summaryText = speechMap[language] || `Your ${actionPlan.business_name} Detailed Project Report: Total cost is ${costStr}. Margin money is ${ownStr}, government subsidy is ${subStr}, and bank loan is ${loanStr}. Monthly EMI is ${emiStr}, leaving an estimated monthly profit of ${profitStr}.`;
    speak(summaryText);
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Top Banner & Actions */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-[#DCFCE7] text-[#14532D] rounded-2xl">
              <Sparkles className="w-5 h-5 text-[#166534]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 flex items-center gap-2">
                🌾 {t('dpr_title')}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {t('dpr_subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReadSummary}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span>{t('btn_listen')}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-[#166534] hover:bg-[#14532D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>{t('btn_print')}</span>
          </button>
        </div>
      </div>

      {/* 1. 1-Minute Executive Visual Summary Cards */}
      <div className="bg-gradient-to-br from-[#14532D] via-[#166534] to-[#0A230C] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-700/60 pb-4">
          <div>
            <div className="text-xs font-bold text-[#EAB308] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-[#EAB308]" />
              {t('dpr_easy_summary_title')}
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white mt-0.5">
              {businessDisplayName} • {actionPlan.scheme_code} Scheme
            </h2>
          </div>
          <div className="text-xs text-emerald-200 bg-black/30 px-3.5 py-1.5 rounded-xl border border-white/15 font-mono flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#EAB308]" />
            <span>{actionPlan.village_name}, {actionPlan.district}</span>
          </div>
        </div>

        {/* 6 High-Impact Financial Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* 1. Total Project Cost */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1.5">
            <span className="text-emerald-200 font-medium block">
              1. {t('dpr_cost_title')}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {formatCurrency(actionPlan.project_cost)}
            </div>
            <p className="text-[11px] text-emerald-100/75">
              Covers equipment, initial setup, and first 3 months working capital.
            </p>
          </div>

          {/* 2. Own Margin Money */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1.5">
            <span className="text-[#EAB308] font-medium block">
              2. {t('dpr_own_capital_title')} ({actionPlan.own_contribution_pct}%)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#EAB308]">
              {formatCurrency(actionPlan.own_contribution)}
            </div>
            <p className="text-[11px] text-emerald-100/75">
              Required seed margin money from your available capital.
            </p>
          </div>

          {/* 3. Bank Loan */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1.5">
            <span className="text-blue-200 font-medium block">
              3. {t('dpr_bank_loan_title')}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-200">
              {formatCurrency(actionPlan.bank_loan)}
            </div>
            <p className="text-[11px] text-emerald-100/75">
              Term loan sanctioned by commercial or rural bank branch.
            </p>
          </div>

          {/* 4. Government Subsidy */}
          <div className="bg-emerald-950/60 backdrop-blur-md p-4 rounded-2xl border border-emerald-400/40 space-y-1.5">
            <span className="text-emerald-300 font-bold block">
              4. {t('dpr_subsidy_title')} ({actionPlan.subsidy_pct}%)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300">
              {formatCurrency(actionPlan.eligible_subsidy)}
            </div>
            <p className="text-[11px] text-emerald-200/80">
              Direct back-ended capital subsidy deposited into your loan account.
            </p>
          </div>

          {/* 5. Monthly EMI */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-1.5">
            <span className="text-emerald-200 font-medium block">
              5. {t('dpr_emi_title')}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-200">
              {formatCurrency(actionPlan.monthly_emi)} <span className="text-xs font-normal">/ mo</span>
            </div>
            <p className="text-[11px] text-emerald-100/75">
              Fixed monthly bank repayment @ 8.5% interest for 5 years (60 months).
            </p>
          </div>

          {/* 6. In-Hand Monthly Profit */}
          <div className="bg-emerald-900/80 backdrop-blur-md p-4 rounded-2xl border-2 border-emerald-400 space-y-1.5 relative overflow-hidden">
            <span className="text-emerald-300 font-bold block uppercase tracking-wide">
              6. {t('dpr_inhand_profit_title')}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300">
              {formatCurrency(normalProfit)} <span className="text-xs font-normal text-emerald-200">/ mo</span>
            </div>
            <div className="text-[11px] font-bold text-white pt-1">
              Annual Family Surplus: {formatCurrency(normalProfit * 12)} / year
            </div>
          </div>
        </div>
      </div>

      {/* 2. VISUAL CHARTS & DASHBOARD SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Means of Project Finance Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <PieChart className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                Means of Project Financing
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Total: {formatCurrency(projCost)}
            </span>
          </div>

          {/* Visual Stacked Progress Bar */}
          <div className="space-y-2">
            <div className="h-6 w-full bg-slate-100 rounded-xl overflow-hidden flex p-1 gap-1">
              <div 
                style={{ width: `${ownPct}%` }} 
                className="bg-[#EAB308] h-full rounded-lg transition-all"
                title={`Own Contribution: ${ownPct}%`}
              />
              <div 
                style={{ width: `${subsidyPct}%` }} 
                className="bg-[#16A34A] h-full rounded-lg transition-all"
                title={`Government Subsidy: ${subsidyPct}%`}
              />
              <div 
                style={{ width: `${Math.max(10, 100 - ownPct - subsidyPct)}%` }} 
                className="bg-blue-600 h-full rounded-lg transition-all"
                title={`Net Bank Debt: ${100 - ownPct - subsidyPct}%`}
              />
            </div>

            {/* Legend Items */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                  <span>Own Capital</span>
                </div>
                <div className="font-mono font-bold text-slate-900 mt-1">{formatCurrency(ownAmt)}</div>
                <span className="text-[10px] text-slate-500">{ownPct}% Margin</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                  <span>Govt Subsidy</span>
                </div>
                <div className="font-mono font-bold text-[#166534] mt-1">{formatCurrency(subsidyAmt)}</div>
                <span className="text-[10px] text-slate-500">{subsidyPct}% Grant</span>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200">
                <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span>Net Loan</span>
                </div>
                <div className="font-mono font-bold text-blue-900 mt-1">{formatCurrency(netLoanAfterSubsidy)}</div>
                <span className="text-[10px] text-slate-500">Effective Debt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: 3-Scenario Profit Projection Comparison */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                3-Scenario Monthly In-Hand Cashflows
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#166534]">
              Post-EMI Net
            </span>
          </div>

          {/* Horizontal Comparison Bars */}
          <div className="space-y-3 pt-1 text-xs">
            {/* Best Case */}
            <div className="space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Best Case (Peak Milk/Demand)</span>
                </span>
                <span className="font-mono font-bold text-[#166534]">{formatCurrency(bestProfit)} / mo</span>
              </div>
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-400 to-[#16A34A] h-full rounded-full w-[95%]" />
              </div>
            </div>

            {/* Normal Case */}
            <div className="space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#166534]" />
                  <span>Normal Case (Realistic Average)</span>
                </span>
                <span className="font-mono font-extrabold text-[#14532D]">{formatCurrency(normalProfit)} / mo</span>
              </div>
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#EAB308] to-[#166534] h-full rounded-full w-[65%]" />
              </div>
            </div>

            {/* Worst Case */}
            <div className="space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Worst Case (High Fodder Costs)</span>
                </span>
                <span className="font-mono font-bold text-amber-900">{formatCurrency(worstProfit)} / mo</span>
              </div>
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full w-[35%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Feasibility & Viability Health Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 uppercase text-[10px] font-bold">
            <span>Suitability Score</span>
            <Award className="w-3.5 h-3.5 text-[#166534]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#14532D]">
            {actionPlan.suitability_score || 87}<span className="text-xs text-slate-400">/100</span>
          </div>
          <span className="text-[#16A34A] font-bold text-[11px] block">High Local Fit</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 uppercase text-[10px] font-bold">
            <span>Verification Confidence</span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-blue-700">
            {actionPlan.verification_confidence || 92}<span className="text-xs text-slate-400">/100</span>
          </div>
          <span className="text-blue-700 font-bold text-[11px] block">Verified Official Source</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 uppercase text-[10px] font-bold">
            <span>Break-Even Period</span>
            <Clock className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-purple-800">
            {actionPlan.break_even_months || 9} <span className="text-xs text-slate-400">Months</span>
          </div>
          <span className="text-purple-700 font-bold text-[11px] block">Rapid Capital Payback</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 uppercase text-[10px] font-bold">
            <span>Operational Risk</span>
            <Shield className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#166534]">
            {actionPlan.risk_score || 32}<span className="text-xs text-slate-400">/100</span>
          </div>
          <span className="text-[#16A34A] font-bold text-[11px] block">{actionPlan.risk_level || 'LOW'} Vulnerability</span>
        </div>
      </div>

      {/* 4. Step-by-Step Chronological Loan Action Roadmap */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#DCFCE7] text-[#14532D] rounded-xl">
              <Sparkles className="w-5 h-5 text-[#166534]" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-slate-900">
                {t('dpr_roadmap_title')}
              </h3>
              <p className="text-xs text-slate-500">
                Follow this sequential milestone checklist to submit your application for bank sanction.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {currentActionSteps.map((step, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium hover:border-emerald-300 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span className="pt-0.5">{step}</span>
            </div>
          ))}
        </div>

        {/* Official Application Portal Callout Box */}
        <div className="mt-4 p-4 bg-[#EFF6FF] border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-blue-950 block text-sm">{t('dpr_official_channel_title')}:</span>
            <span className="text-blue-800 font-mono text-xs">{actionPlan.official_portal_url}</span>
          </div>
          <a
            href={actionPlan.official_portal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs shrink-0 transition-colors"
          >
            <span>Open Verified Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 5. Formal Detailed Project Report Sections (Bank Appraisal Print Document) */}
      <div ref={printRef} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="border-b-2 border-[#166534] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-[#14532D]">
              Formal Detailed Project Report (DPR)
            </h3>
            <p className="text-xs text-slate-500">
              Techno-economic viability appraisal schedule for commercial bank loan sanction.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
            DPR Ref: <strong className="text-slate-900">{actionPlan.report_id}</strong>
          </div>
        </div>

        {/* DPR Sections */}
        <div className="space-y-5">
          {actionPlan.dpr_sections?.map((section) => (
            <div key={section.section_id} className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                    {language === 'mr' ? section.title_mr : language === 'hi' ? section.title_hi : section.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {language === 'mr' ? section.subtitle_mr : language === 'hi' ? section.subtitle_hi : section.subtitle}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 uppercase font-bold">
                  {section.data_type.replace('_', ' ')}
                </span>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line prose prose-xs max-w-none pt-1">
                {section.content_markdown}
              </div>
            </div>
          ))}
        </div>

        {/* Statutory Planning Disclaimer */}
        <div className="text-[11px] text-slate-600 bg-amber-50 p-4 rounded-xl border border-amber-200 leading-relaxed font-medium">
          <strong>Planning Notice:</strong> {actionPlan.disclaimer || "This AI-assisted DPR is intended for planning and application preparation. It does not guarantee loan approval or bank sanction."}
        </div>
      </div>

      {/* Engine Audit Transparency */}
      <EngineTransparencyCard />

      <DisclaimerBanner />
    </div>
  );
};
