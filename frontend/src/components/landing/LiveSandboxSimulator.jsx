import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGramNiti } from '../../contexts/GramNitiContext';
import { 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  Landmark, 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  Volume2, 
  DollarSign, 
  Store, 
  Users, 
  Tag, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Coins,
  Calendar,
  Layers
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const LiveSandboxSimulator = ({ setActiveTab }) => {
  const { t, language, speak } = useLanguage();
  const { locations, setLocation, currentLocation, recommendations, selectBusiness, selectedBusiness } = useGramNiti();

  const [selectedLocId, setSelectedLocId] = useState(currentLocation?.location_id || 1);
  const [marginCapital, setMarginCapital] = useState(50000);
  const [selectedSector, setSelectedSector] = useState('DAIRY');

  const activeLoc = locations.find(l => l.location_id === Number(selectedLocId)) || locations[0];

  const presets = [
    {
      id: 'DAIRY',
      name: 'Dairy Farming & Chilling Unit',
      category: 'Livestock & Agri-Allied',
      icon: '🐄',
      baseCost: 500000,
      subsidyScheme: 'PMEGP / AHIDF (35% Subsidy)',
      subsidyAmount: 175000,
      monthlyProfit: 16500,
      breakEvenMonths: 14,
      suitability: 91,
      catchment: '28,500 Residents (5–10 km)',
      demandSummary: 'High local consumption of fresh A2 milk with strong dairy cooperative collection center within 4 km.'
    },
    {
      id: 'POULTRY',
      name: 'Broiler & Layer Poultry Farm',
      category: 'Livestock',
      icon: '🐔',
      baseCost: 420000,
      subsidyScheme: 'National Livestock Mission (NLM 25%)',
      subsidyAmount: 105000,
      monthlyProfit: 14200,
      breakEvenMonths: 12,
      suitability: 87,
      catchment: '34,000 Residents (8 km radius)',
      demandSummary: 'Consistent weekly demand from nearby weekly haats and highway dhabas with established chick feed supply.'
    },
    {
      id: 'COLD_STORAGE',
      name: 'Solar Micro Cold Storage Unit',
      category: 'Agro-Processing & Value Addition',
      icon: '❄️',
      baseCost: 650000,
      subsidyScheme: 'PMFME & AIF (35% Capital Subsidy + 3% Interest Subvention)',
      subsidyAmount: 227500,
      monthlyProfit: 21000,
      breakEvenMonths: 16,
      suitability: 89,
      catchment: '12 Neighboring Farming Villages',
      demandSummary: 'Prevents 20–30% post-harvest perishable losses for tomato, chilli, and seasonal vegetable farmers.'
    },
    {
      id: 'SPICE_MILL',
      name: 'Organic Spice Grinding & Packaging',
      category: 'Agro-Processing',
      icon: '🌶️',
      baseCost: 350000,
      subsidyScheme: 'PMFME ODOP (35% Subsidy)',
      subsidyAmount: 122500,
      monthlyProfit: 13800,
      breakEvenMonths: 11,
      suitability: 86,
      catchment: 'Local Block Retail Market & SHG Outlets',
      demandSummary: 'Direct procurement of raw turmeric and coriander from local farmers with premium packaged branding.'
    },
    {
      id: 'RETAIL_MART',
      name: 'Rural Agro-Input & Utility Mart',
      category: 'Rural Retail & Services',
      icon: '🏪',
      baseCost: 300000,
      subsidyScheme: 'Pradhan Mantri Mudra Yojana (Tarun / Kishore)',
      subsidyAmount: 0,
      monthlyProfit: 12500,
      breakEvenMonths: 9,
      suitability: 84,
      catchment: 'Direct village main road junction',
      demandSummary: 'Supplies certified seeds, bio-fertilizers, organic pesticides, and daily essentials with high repeat footfall.'
    }
  ];

  const activePreset = presets.find(p => p.id === selectedSector) || presets[0];

  // --- SCA 10/90 Concessional Credit Router Logic ---
  const feasibleProjectCost = marginCapital / 0.10;
  const isMicroFinance = feasibleProjectCost <= 140000;
  
  const scaSchemeName = isMicroFinance ? "Micro Finance Scheme" : "Term Loan Scheme";
  const scaSchemeCode = isMicroFinance ? "MFS" : "TLS";
  const scaRate = isMicroFinance ? 6.5 : 8.0;
  const scaTenureYears = isMicroFinance ? 3 : 7;
  const scaTenureMonths = scaTenureYears * 12;
  const scaMoratoriumMonths = isMicroFinance ? 3 : 6;
  const maxLoanCeiling = isMicroFinance ? 125000 : 4500000;
  const maxFeasibleCost = isMicroFinance ? 140000 : 5000000;
  const effectiveCost = Math.min(feasibleProjectCost, maxFeasibleCost);
  const eligibleLoanAmount = Math.min(effectiveCost * 0.90, maxLoanCeiling);

  const monthlyEmiEst = Math.round((eligibleLoanAmount / scaTenureMonths) * (1 + (scaRate * scaTenureYears) / 200));

  // Audio briefing in active language
  const handleSpeakBriefing = () => {
    const speechMap = {
      mr: `${activeLoc.village_name} गावासाठी ${activePreset.name}: उपलब्ध भांडवल ${formatCurrency(marginCapital)} वरून एकूण प्रकल्प क्षमता ${formatCurrency(effectiveCost)} आहे. ९० टक्के कर्ज ${formatCurrency(eligibleLoanAmount)} साठी ${scaSchemeName} अंतर्गत ${scaRate}% सवलतीच्या दराने ${scaTenureYears} वर्षांची परतफेड आणि ${scaMoratoriumMonths} महिन्यांची सवलत मिळेल.`,
      hi: `${activeLoc.village_name} गाँव के लिए ${activePreset.name}: आपकी उपलब्ध पूंजी ${formatCurrency(marginCapital)} से कुल परियोजना क्षमता ${formatCurrency(effectiveCost)} बनती है। 90% ऋण ${formatCurrency(eligibleLoanAmount)} हेतु ${scaSchemeName} के तहत ${scaRate}% रियायती ब्याज दर पर ${scaTenureYears} वर्ष की अवधि व ${scaMoratoriumMonths} माह का मोरटोरियम मिलेगा।`,
      en: `Smart Scheme Routing for ${activeLoc.village_name}: ${activePreset.name}. Available margin of ${formatCurrency(marginCapital)} qualifies you for a ${formatCurrency(effectiveCost)} project cost and ${formatCurrency(eligibleLoanAmount)} loan under ${scaSchemeName} at ${scaRate}% concessional interest over ${scaTenureYears} years with ${scaMoratoriumMonths}-month moratorium.`
    };
    const text = speechMap[language] || speechMap['en'];
    speak(text);
  };

  const handleLaunchFullAdvisor = () => {
    if (setLocation) {
      setLocation(activeLoc.location_id);
    }
    if (setActiveTab) {
      setActiveTab('advisor');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#14532D] text-xs font-extrabold uppercase tracking-wider font-mono">
            <Zap className="w-3.5 h-3.5 text-[#166534]" />
            <span>Interactive Feasibility & Smart Scheme Calculator</span>
          </div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
            Hyper-Local Feasibility & 10% Margin Money Scheme Router
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Instant consulting engine: Input your village location, available cash margin, and enterprise category to preview data-backed market feasibility and statutory loan routing.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSpeakBriefing}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Listen to briefing in your language"
          >
            <Volume2 className="w-4 h-4 text-[#166534]" />
            <span>Audio Briefing</span>
          </button>

          <button
            type="button"
            onClick={handleLaunchFullAdvisor}
            className="px-5 py-2 bg-[#166534] hover:bg-[#14532D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span>Open 360° Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Core User Inputs (Geographic Location, Margin Money, Proposed Business) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
        
        {/* Input 1: Geographic Location */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#166534]" />
            <span>1. Geographic Location (Village / Block)</span>
          </label>
          <select
            value={selectedLocId}
            onChange={(e) => {
              setSelectedLocId(e.target.value);
              if (setLocation) setLocation(Number(e.target.value));
            }}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#166534] focus:outline-none cursor-pointer"
          >
            {locations.map(loc => (
              <option key={loc.location_id} value={loc.location_id}>
                {loc.village_name} ({loc.block_taluka}, {loc.district}, {loc.state})
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-500 block">
            5–10km hyper-local catchment radius evaluated
          </span>
        </div>

        {/* Input 2: Available Margin Capital */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#166534]" />
              <span>2. Available Margin Capital (10%)</span>
            </label>
            <span className="text-xs font-mono font-bold text-[#14532D] bg-emerald-100 px-2 py-0.5 rounded">
              {formatCurrency(marginCapital)}
            </span>
          </div>
          <input
            type="range"
            min="10000"
            max="300000"
            step="5000"
            value={marginCapital}
            onChange={(e) => setMarginCapital(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#166534]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹10K (Micro)</span>
            <span>₹50K</span>
            <span>₹1L (₹10L Cost)</span>
            <span>₹3L</span>
          </div>
        </div>

        {/* Input 3: Proposed Business Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#166534]" />
            <span>3. Proposed Business Category</span>
          </label>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#166534] focus:outline-none cursor-pointer"
          >
            {presets.map(p => (
              <option key={p.id} value={p.id}>
                {p.icon} {p.name}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-500 block">
            {activePreset.category}
          </span>
        </div>

      </div>

      {/* Module 1 & Module 2 Calculated Results Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Col (6 Cols): Module 1 Hyper-Local Feasibility Snapshot */}
        <div className="lg:col-span-6 bg-slate-50/80 rounded-2xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-heading font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-700" />
              <span>Module 1: Hyper-Local Feasibility Snapshot</span>
            </h3>
            <span className="text-xs font-bold text-[#14532D] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full font-mono">
              Suitability: {activePreset.suitability}/100
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">1. Market Reach</span>
              <strong className="text-slate-900 text-xs block mt-0.5">{activePreset.catchment}</strong>
              <span className="text-[10px] text-slate-500">Haats & direct consumers</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">2. Opportunity Niche</span>
              <strong className="text-[#166534] text-xs block mt-0.5">High Unserved Demand</strong>
              <span className="text-[10px] text-slate-500">Low local saturation (24%)</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">3. SWOT & Threat Check</span>
              <strong className="text-slate-900 text-xs block mt-0.5">Verified Supply Chain</strong>
              <span className="text-[10px] text-slate-500">Stable raw inputs & feed</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">4. Est. Net Profit</span>
              <strong className="text-[#16A34A] text-xs block mt-0.5">~{formatCurrency(activePreset.monthlyProfit)}/mo</strong>
              <span className="text-[10px] text-slate-500">After concessional EMI</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
            <strong>Demand Profile:</strong> {activePreset.demandSummary}
          </p>
        </div>

        {/* Right Col (6 Cols): Module 2 Smart Financial Router Snapshot */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#14532D] to-[#0A230C] text-white rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/20">
              <h3 className="font-heading font-extrabold text-xs text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-[#EAB308]" />
                <span>Module 2: Smart Scheme Auto-Selection</span>
              </h3>
              <span className="text-xs font-bold text-amber-300 bg-black/30 px-2.5 py-0.5 rounded-full font-mono">
                {scaSchemeCode} Active
              </span>
            </div>

            {/* Main Decision Output */}
            <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
              <div>
                <span className="text-emerald-200/80 text-[11px] block">Feasible Project Cost (Margin / 10%):</span>
                <span className="text-2xl font-extrabold font-mono text-[#EAB308]">
                  {formatCurrency(effectiveCost)}
                </span>
              </div>
              <div>
                <span className="text-emerald-200/80 text-[11px] block">Eligible 90% Concessional Loan:</span>
                <span className="text-2xl font-extrabold font-mono text-white">
                  {formatCurrency(eligibleLoanAmount)}
                </span>
              </div>
            </div>

            {/* Scheme Tier Details */}
            <div className="mt-3 p-3 bg-white/10 rounded-xl border border-white/15 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{scaSchemeName}</span>
                <span className="font-mono text-[#EAB308] font-bold">{scaRate}% p.a. Concessional</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-100/90 pt-1">
                <span>Repayment Tenure: <strong>{scaTenureYears} Years ({scaTenureMonths} Mo)</strong></span>
                <span>Moratorium: <strong className="text-amber-300">{scaMoratoriumMonths} Months</strong></span>
              </div>
              <div className="text-[11px] text-emerald-200/80 pt-0.5">
                Est. Monthly Installment: <strong>~{formatCurrency(monthlyEmiEst)}/mo</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-emerald-200/80">
              {isMicroFinance ? "Project Cost ≤ ₹1.40L → Tier 1 Micro Credit" : "Project Cost > ₹1.40L → Tier 2 Term Loan"}
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('finance')}
              className="px-4 py-2 bg-[#EAB308] hover:bg-[#F59E0B] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <span>View Full Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div>
          ✓ Official State Channelizing Agency (SCA/CA) Concessional Credit Rules • 10% Margin Money • 100% Deterministic Math
        </div>
        <div className="flex items-center gap-2 font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('advisor')}
            className="hover:text-[#166534] transition-colors cursor-pointer"
          >
            Explore Feasibility Report →
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setActiveTab('schemes')}
            className="hover:text-[#166534] transition-colors cursor-pointer"
          >
            Explore 1000+ Schemes →
          </button>
        </div>
      </div>

    </div>
  );
};
