import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGramNiti } from '../../contexts/GramNitiContext';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { EngineTransparencyCard } from '../common/EngineTransparencyCard';
import { MacroBusinessAnalysisInfographic } from './MacroBusinessAnalysisInfographic';
import { 
  TrendingUp, 
  Users, 
  Store, 
  Layers, 
  AlertTriangle, 
  Tag, 
  Landmark, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  Printer, 
  CheckCircle2, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Lightbulb, 
  ShieldCheck,
  Compass,
  Filter,
  RefreshCw
} from 'lucide-react';

export const BusinessAnalysisDashboard = ({ setActiveTab }) => {
  const { t, language, speak } = useLanguage();
  const { 
    recommendations, 
    selectedBusiness, 
    selectBusiness, 
    feasibilityReport, 
    currentLocation, 
    financialPlan, 
    simulationResult,
    userProfile 
  } = useGramNiti();

  const [selectedSector, setSelectedSector] = useState('ALL');
  const [activeTab, setActiveTabLocal] = useState('market'); // 'market', 'swot', 'economics', 'cashflow', 'competitors', 'schemes'

  const businessDisplayName = language === 'mr' 
    ? selectedBusiness?.name_mr 
    : language === 'hi' 
    ? selectedBusiness?.name_hi 
    : selectedBusiness?.name || 'Dairy Farming';

  const sectors = ['ALL', ...new Set(recommendations.map(r => r.sector))];

  const filteredBusinesses = selectedSector === 'ALL' 
    ? recommendations 
    : recommendations.filter(r => r.sector === selectedSector);

  // Audio Readout supporting all 13 Indian languages
  const handleReadBusinessAnalysis = () => {
    const pop = feasibilityReport?.market_reach?.estimated_consumer_base?.toLocaleString() || '28,500';
    const biz = businessDisplayName;
    const profit = formatCurrency(selectedBusiness?.typical_monthly_profit || 14306);
    const cost = formatCurrency(selectedBusiness?.typical_investment || 220000);

    const speechMap = {
      mr: `${biz} व्यवसाय विश्लेषण डॅशबोर्ड: प्रकल्प खर्च ${cost} असून ५ ते १० किमी परिसरात सुमारे ${pop} ग्राहक आहेत. मासिक अपेक्षित नफा ${profit} आहे आणि स्थानिक बाजारात स्पर्धेचे प्रमाण केवळ २४ टक्के आहे.`,
      hi: `${biz} व्यवसाय विश्लेषण डैशबोर्ड: कुल परियोजना लागत ${cost} है और 5 से 10 किमी दायरे में ${pop} उपभोक्ता उपलब्ध हैं। मासिक शुद्ध लाभ ${profit} अनुमानित है और बाजार में प्रतिस्पर्धा कम है।`,
      bn: `${biz} ব্যবসায় বিশ্লেষণ ড্যাশবোর্ড: মোট প্রকল্প ব্যয় ${cost} এবং ৫-১০ কিমি এলাকায় প্রায় ${pop} ভোক্তা রয়েছে। আনুমানিক মাসিক লাভ ${profit}।`,
      gu: `${biz} વ્યવસાય વિશ્લેષણ ડેશબોર્ડ: કુલ પ્રોજેક્ટ ખર્ચ ${cost} છે અને સ્થાનિક વિસ્તારમાં ${pop} ગ્રાહકો છે. અંદાજિત માસિક નફો ${profit} છે.`,
      pa: `${biz} ਕਾਰੋਬਾਰ ਵਿਸ਼ਲੇਸ਼ਣ ਡੈਸ਼ਬੋਰਡ: ਕੁੱਲ ਲਾਗਤ ${cost} ਹੈ ਅਤੇ 5-10 ਕਿਲੋਮੀਟਰ ਵਿੱਚ ${pop} ਖਪਤਕਾਰ ਹਨ। ਮਹੀਨਾਵਾਰ ਮੁਨਾਫਾ ${profit} ਹੈ।`,
      ta: `${biz} தொழில் பகுப்பாய்வு தகவல் பலகை: திட்ட செலவு ${cost}. 5-10 கிமீ சுற்றளவில் ${pop} நுகர்வோர் உள்ளனர். மாதாந்திர லாபம் ${profit}.`,
      te: `${biz} వ్యాపార విశ్లేషణ డాష్‌బోర్డ్: ప్రాజెక్ట్ ఖర్చు ${cost}. 5-10 కి.మీ పరిధిలో ${pop} వినియోగదారులు ఉన్నారు. నెలవారీ లాభం ${profit}.`,
      kn: `${biz} ಉದ್ಯಮ ವಿಶ್ಲೇಷಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್: ಒಟ್ಟು ವೆಚ್ಚ ${cost}. 5-10 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ${pop} ಗ್ರಾಹಕರಿದ್ದಾರೆ. ಮಾಸಿಕ ಲಾಭ ${profit}.`,
      ml: `${biz} ബിസിനസ് വിശകലന ഡാഷ്‌ബോർഡ്: ആകെ ചെലവ് ${cost}. 5-10 കി.മീ പരിധിയിൽ ${pop} ഉപഭോക്താക്കളുണ്ട്. പ്രതിമാസ ലാഭം ${profit}.`,
      or: `${biz} ବ୍ୟବସାୟ ବିଶ୍ଳେଷଣ ଡ୍ୟାସବୋର୍ଡ: ମୋଟ ଖର୍ଚ୍ଚ ${cost} ଏବଂ ୫-୧୦ କିମି ପରିସୀମାରେ ${pop} ଗ୍ରାହକ ଅଛନ୍ତି। ମାସିକ ଲାଭ ${profit}।`,
      as: `${biz} ব্যৱসায় বিশ্লেষণ ডেশ্ববৰ্ড: মুঠ খৰচ ${cost} আৰু ৫-১০ কিমি অঞ্চলত ${pop} সম্ভাৱ্য গ্ৰাহক আছে। মাহেকীয়া লাভ ${profit}।`,
      ur: `${biz} کاروباری تجزیاتی ڈیش بورڈ: کل لاگت ${cost} ہے اور 5 سے 10 کلومیٹر کے دائرے میں ${pop} صارفین دستیاب ہیں۔ ماہانہ منافع ${profit} ہے۔`
    };

    const speechText = speechMap[language] || `${biz} Business Analysis Dashboard: Project investment is ${cost}. Catchment population is ${pop} within a 5-10 km radius. Estimated monthly profit is ${profit} with a low market saturation of 24%.`;
    speak(speechText);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-7 animate-in fade-in pb-12">
      
      {/* 1. Header & Quick Actions */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-[#DCFCE7] text-[#14532D] rounded-2xl">
              <TrendingUp className="w-5 h-5 text-[#166534]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                {t('tab_business_dashboard')}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Comprehensive 360° market feasibility, unit economics, SWOT, and cashflow intelligence.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReadBusinessAnalysis}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span>{t('dashboard_listen_report')}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-[#166534] hover:bg-[#14532D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t('dashboard_print_report')}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Active Business</span>
          <div className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
            {businessDisplayName}
          </div>
          <span className="text-[10px] text-[#166534] font-semibold block">{selectedBusiness?.sector || 'Livestock'}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Suitability Score</span>
          <div className="text-xl font-extrabold font-mono text-[#166534]">
            {feasibilityReport?.suitability_score || selectedBusiness?.suitability_score || 88}<span className="text-xs text-slate-400">/100</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold block">✓ High Potential</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Total Investment</span>
          <div className="text-base sm:text-lg font-extrabold font-mono text-slate-900">
            {formatCurrency(selectedBusiness?.typical_investment || 220000)}
          </div>
          <span className="text-[10px] text-slate-500 block">CapEx + 3 Mo OpEx</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Estimated Profit</span>
          <div className="text-base sm:text-lg font-extrabold font-mono text-[#16A34A]">
            ~{formatCurrency(selectedBusiness?.typical_monthly_profit || 14306)}/mo
          </div>
          <span className="text-[10px] text-emerald-600 block">After bank EMI</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Market Reach</span>
          <div className="text-base sm:text-lg font-extrabold font-mono text-blue-700">
            ~{feasibilityReport?.market_reach?.estimated_consumer_base?.toLocaleString() || '28,500'}
          </div>
          <span className="text-[10px] text-slate-500 block">5–10 km catchment</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Saturation Level</span>
          <div className="text-base sm:text-lg font-extrabold font-mono text-[#D97706]">
            {feasibilityReport?.competitor_mapping?.market_saturation_level_pct || 24}%
          </div>
          <span className="text-[10px] text-amber-700 font-bold block">Low Competition</span>
        </div>
      </div>

      {/* 3. Sector Filter & Business Switcher Carousel */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#166534]" />
            <h3 className="font-heading font-extrabold text-sm text-slate-900">
              {t('dashboard_filter_sector')}:
            </h3>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {sectors.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSector === sec
                    ? 'bg-[#166534] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sec === 'ALL' ? t('dashboard_all_sectors') : sec}
              </button>
            ))}
          </div>
        </div>

        {/* Business Selector Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredBusinesses.map((biz) => {
            const isSelected = selectedBusiness?.code === biz.code;
            const displayName = language === 'mr' ? biz.name_mr : language === 'hi' ? biz.name_hi : biz.name;
            return (
              <button
                key={biz.business_id}
                type="button"
                onClick={() => selectBusiness(biz)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-[#DCFCE7] border-[#16A34A] ring-2 ring-[#16A34A]/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">#{biz.suitability_rank}</span>
                  <span className="text-[10px] font-mono font-bold text-[#14532D] bg-white px-2 py-0.5 rounded border border-slate-200">
                    {biz.suitability_score}/100
                  </span>
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">{displayName}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{formatCurrency(biz.typical_investment)} • ~{formatCurrency(biz.typical_monthly_profit)}/mo</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Deep-Dive Interactive Analysis Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'macro_graphs', label: 'Macro Business Analysis (Graphs & Insights)', icon: BarChart3 },
            { id: 'market', label: t('dashboard_market_catchment'), icon: Users },
            { id: 'swot', label: t('dashboard_swot_matrix'), icon: Layers },
            { id: 'economics', label: t('dashboard_unit_economics'), icon: Tag },
            { id: 'cashflow', label: t('dashboard_profit_forecast'), icon: DollarSign },
            { id: 'competitors', label: t('dashboard_competitor_density'), icon: Store },
            { id: 'schemes', label: t('dashboard_scheme_alignment'), icon: Landmark },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabLocal(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#14532D] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 0: Macro Business Analysis Graphs & Insights */}
        {activeTab === 'macro_graphs' && (
          <MacroBusinessAnalysisInfographic setActiveTab={setActiveTab} />
        )}

        {/* Tab 1: Market Catchment & Demographics */}
        {activeTab === 'market' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Catchment Radius</span>
                <div className="text-lg font-bold text-slate-900 font-mono">
                  {feasibilityReport?.market_reach?.radius_km || '5–10 km'}
                </div>
                <span className="text-slate-500 text-[11px]">Primary localized trade perimeter</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Estimated Catchment Population</span>
                <div className="text-lg font-bold text-[#166534] font-mono">
                  ~{feasibilityReport?.market_reach?.estimated_consumer_base?.toLocaleString() || '28,500'} Residents
                </div>
                <span className="text-slate-500 text-[11px]">Village cluster & weekly haat mandis</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Connectivity & Transport</span>
                <div className="text-lg font-bold text-blue-700 font-mono">
                  {feasibilityReport?.market_reach?.market_connectivity_rating || 'High (All-Weather Road)'}
                </div>
                <span className="text-slate-500 text-[11px]">Direct state highway access</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <span className="font-bold text-slate-900 block text-sm">Consumer Demographics & Distribution Footprint:</span>
              <p className="text-slate-700 leading-relaxed">
                {language === 'mr' 
                  ? feasibilityReport?.market_reach?.consumer_base_description_mr 
                  : language === 'hi' 
                  ? feasibilityReport?.market_reach?.consumer_base_description_hi 
                  : feasibilityReport?.market_reach?.consumer_base_description || "High rural household density with steady daily recurring demand."}
              </p>

              <div className="space-y-1.5 pt-2">
                <span className="font-bold text-slate-800 text-xs">Recommended Direct Distribution Channels:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {(feasibilityReport?.market_reach?.primary_distribution_channels || [
                    "Direct Village Consumer Gate Sale",
                    "Local Retail Kirana & Dairy Booths",
                    "Weekly Haat Bazaar stalls",
                    "Institutional bulk supply to block hotels"
                  ]).map((channel, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                      <span className="font-medium">{channel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive SWOT Matrix */}
        {activeTab === 'swot' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in">
            <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-300 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
                <span className="w-3 h-3 rounded-full bg-[#16A34A]" />
                <span>Strengths (सामर्थ्य / ताकत)</span>
              </div>
              <ul className="space-y-1.5 text-emerald-900">
                {(language === 'mr' ? feasibilityReport?.swot_analysis?.strengths_mr : language === 'hi' ? feasibilityReport?.swot_analysis?.strengths_hi : feasibilityReport?.swot_analysis?.strengths || [
                  "Strong daily recurring cashflow demand",
                  "Low raw material transport cost within village",
                  "Eligible for 25% to 35% government back-ended subsidy"
                ]).map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#16A34A] font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-300 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
                <span className="w-3 h-3 rounded-full bg-[#D97706]" />
                <span>Weaknesses (कमतरता / चुनौतियां)</span>
              </div>
              <ul className="space-y-1.5 text-amber-900">
                {(language === 'mr' ? feasibilityReport?.swot_analysis?.weaknesses_mr : language === 'hi' ? feasibilityReport?.swot_analysis?.weaknesses_hi : feasibilityReport?.swot_analysis?.weaknesses || [
                  "Initial capital investment required for setup",
                  "Dependence on local power and water consistency",
                  "Requires disciplined daily quality maintenance"
                ]).map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#D97706] font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-300 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-blue-950 text-sm">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span>Opportunities (संधी / अवसर)</span>
              </div>
              <ul className="space-y-1.5 text-blue-900">
                {(language === 'mr' ? feasibilityReport?.swot_analysis?.opportunities_mr : language === 'hi' ? feasibilityReport?.swot_analysis?.opportunities_hi : feasibilityReport?.swot_analysis?.opportunities || [
                  "Value addition (curd, paneer, packaging) gives 40% higher margins",
                  "Direct delivery subscription model in surrounding taluka town",
                  "Tie-ups with local rural self-help groups (SHGs)"
                ]).map((o, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50/60 p-5 rounded-2xl border border-red-300 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-red-950 text-sm">
                <span className="w-3 h-3 rounded-full bg-red-600" />
                <span>Threats (धोके / खतरे)</span>
              </div>
              <ul className="space-y-1.5 text-red-900">
                {(language === 'mr' ? feasibilityReport?.swot_analysis?.threats_mr : language === 'hi' ? feasibilityReport?.swot_analysis?.threats_hi : feasibilityReport?.swot_analysis?.threats || [
                  "Seasonal fodder price fluctuations",
                  "Local disease outbreaks if vaccination is delayed",
                  "Middlemen pricing pressures"
                ]).map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Unit Economics & Margins */}
        {activeTab === 'economics' && (
          <div className="space-y-4 text-xs animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Benchmark Unit Price</span>
                <div className="text-base font-extrabold text-[#14532D]">
                  {feasibilityReport?.product_market_value?.recommended_unit_price || '₹55 – ₹62 per Liter'}
                </div>
                <span className="text-slate-500 text-[11px] block">Based on village purchasing power</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Operating Gross Margin</span>
                <div className="text-base font-extrabold text-[#16A34A] font-mono">
                  34% – 42%
                </div>
                <span className="text-slate-500 text-[11px] block">After feed & utilities cost</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Estimated Monthly Sales</span>
                <div className="text-base font-extrabold text-blue-700 font-mono">
                  {feasibilityReport?.product_market_value?.predicted_monthly_market_value || '₹45,000 – ₹58,000'}
                </div>
                <span className="text-slate-500 text-[11px] block">Full operating capacity</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs text-[#14532D] leading-relaxed">
              <strong>Pricing Rationale:</strong> {feasibilityReport?.product_market_value?.pricing_rationale || "Direct farmgate selling eliminates 15-20% middlemen margins, ensuring premium margins while keeping prices competitive for village consumers."}
            </div>
          </div>
        )}

        {/* Tab 4: 3-Case Cashflow & Profit Forecast */}
        {activeTab === 'cashflow' && (
          <div className="space-y-4 text-xs animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 text-sm">Conservative Case</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-mono">Low Volume</span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-amber-900">
                  {formatCurrency(simulationResult?.worst_case?.net_cash_remaining || 6500)}/mo
                </div>
                <p className="text-[11px] text-amber-800">
                  Accounts for 20% seasonal drop in production or sudden feed price surge.
                </p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 ring-2 ring-emerald-400/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#14532D] text-sm">Base / Normal Case</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-[#14532D] font-mono">Expected</span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-[#14532D]">
                  {formatCurrency(simulationResult?.normal_case?.net_cash_remaining || 14306)}/mo
                </div>
                <p className="text-[11px] text-emerald-800">
                  Normal average operation after deducting raw materials, electricity, and bank EMI.
                </p>
              </div>

              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-950 text-sm">Optimistic Case</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900 font-mono">Value Added</span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-blue-900">
                  {formatCurrency(simulationResult?.best_case?.net_cash_remaining || 22174)}/mo
                </div>
                <p className="text-[11px] text-blue-800">
                  Includes value-added processing and direct institutional weekly contracts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Competitor Saturation */}
        {activeTab === 'competitors' && (
          <div className="space-y-4 text-xs animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Competitor Density</span>
                <div className="text-base font-bold text-slate-900">
                  {feasibilityReport?.competitor_mapping?.estimated_competitor_density || 'Low (1–2 small units)'}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Market Saturation Index</span>
                <div className="text-xl font-bold font-mono text-[#166534]">
                  {feasibilityReport?.competitor_mapping?.market_saturation_level_pct || 24}%
                </div>
                <span className="text-emerald-700 font-bold text-[10px]">Room for 3+ new units</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Active Units in Block</span>
                <div className="text-xl font-bold font-mono text-slate-900">
                  {feasibilityReport?.competitor_mapping?.estimated_active_units_in_block || 2} Units
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-900 block text-sm">Winning Competitive Edge:</span>
              <p className="text-slate-700 leading-relaxed">
                {feasibilityReport?.competitor_mapping?.competitive_differentiation_strategy || "Freshness, pure unadulterated produce, doorstep delivery to local households, and digital UPI billing."}
              </p>
            </div>
          </div>
        )}

        {/* Tab 6: Matched Government Schemes */}
        {activeTab === 'schemes' && (
          <div className="space-y-4 text-xs animate-in fade-in">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-[#14532D] uppercase tracking-wider font-mono">
                  Recommended Primary Scheme
                </div>
                <div className="font-heading font-extrabold text-base text-slate-900">
                  Prime Minister's Employment Generation Programme (PMEGP)
                </div>
                <div className="text-xs text-slate-600">
                  Government Margin Subsidy: <strong>25% – 35%</strong> (Up to ₹12.5 Lakh for special categories in rural areas).
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab('schemes')}
                className="px-5 py-2.5 bg-[#166534] hover:bg-[#14532D] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              >
                <span>{t('dashboard_apply_scheme')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Provenance & Engine Transparency Audit */}
      <EngineTransparencyCard />
    </div>
  );
};
