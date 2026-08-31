import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGramNiti } from '../contexts/GramNitiContext';
import { LiveSandboxSimulator } from '../components/landing/LiveSandboxSimulator';
import { RuralProblemsSection } from '../components/landing/RuralProblemsSection';
import { SolutionArchitectureSection } from '../components/landing/SolutionArchitectureSection';
import { FeatureHighlights } from '../components/landing/FeatureHighlights';
import { GovernmentTrustBanner } from '../components/landing/GovernmentTrustBanner';
import { MacroBusinessAnalysisInfographic } from '../components/business/MacroBusinessAnalysisInfographic';
import { InteractiveVoiceLanguageSection } from '../components/landing/InteractiveVoiceLanguageSection';
import { ImpactMetricsSection } from '../components/landing/ImpactMetricsSection';
import { EngineTransparencyCard } from '../components/common/EngineTransparencyCard';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { 
  TrendingUp, 
  Landmark, 
  ShieldCheck, 
  Calculator, 
  Sliders, 
  FileCheck2, 
  Bot, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Compass,
  Volume2,
  ChevronDown,
  Target,
  FileSpreadsheet,
  Cpu,
  FileText,
  Users,
  Store,
  Layers,
  HelpCircle,
  BarChart3,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const PortalOverviewPage = ({ setActiveTab }) => {
  const { t, language, speak } = useLanguage();
  const { 
    userProfile, 
    locations,
    currentLocation, 
    setLocation,
    selectedBusiness, 
    selectedScheme, 
    simulationResult,
    getJourneyStepState 
  } = useGramNiti();

  const journey = getJourneyStepState();

  const handleReadOverview = () => {
    const speechMap = {
      en: "GramNiti AI Platform Overview: Deep dive into rural challenges, smart solution architecture, comprehensive business analysis, and multilingual guidance.",
      hi: "ग्रामनीती एआई संपूर्ण प्लेटफॉर्म अवलोकन। ग्रामीण चुनौतियां, एकीकृत समाधान, व्यापक व्यवसाय विश्लेषण और 13 भारतीय भाषाओं में मार्गदर्शन।",
      mr: "ग्रामनीती एआय संपूर्ण मंच विहंगावलोकन. ग्रामीण आव्हाने, आमची एकात्मिक प्रणाली, व्यवसाय विश्लेषण आणि १३ भारतीय भाषांमधील मार्गदर्शन.",
      bn: "গ্রামনীতি এআই সম্পূর্ণ প্ল্যাটফর্ম ওভারভিউ: গ্রামীণ চ্যালেঞ্জ, স্মার্ট সমাধান ব্যবস্থা, বিস্তারিত ব্যবসায়িক বিশ্লেষণ এবং বহুভাষিক সহায়তা।",
      gu: "ગ્રામનીતિ AI પ્લેટફોર્મ વિહંગાવલોકન: ગ્રામીણ પડકારો, સ્માર્ટ સોલ્યુશન, વ્યાપાર વિશ્લેષણ અને ૧૩ ભારતીય ભાષાઓમાં માર્ગદર્શન.",
      pa: "ਗ੍ਰਾਮਨੀਤੀ AI ਪਲੇਟਫਾਰਮ ਸੰਖੇਪ ਜਾਣਕਾਰੀ: ਪੇਂਡੂ ਚੁਣੌਤੀਆਂ, ਸਮਾਰਟ ਹੱਲ ਪ੍ਰਣਾਲੀ, ਵਿਆਪਕ ਕਾਰੋਬਾਰੀ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਬਹੁ-ਭਾਸ਼ਾਈ ਮਾਰਗਦਰਸ਼ਨ।",
      ta: "கிராம்நீதி AI தளத்தின் கண்ணோட்டம்: கிராமப்புற சவால்கள், ஸ்மார்ட் தீர்வுகள், விரிவான வணிக பகுப்பாய்வு மற்றும் பலமொழி வழிகாட்டுதல்.",
      te: "గ్రామనీతి AI ప్లాట్‌ఫామ్ స్థూలదృష్టి: గ్రామీణ సవాళ్లు, స్మార్ట్ పరిష్కారాలు, సమగ్ర వ్యాపార విశ్లేషణ మరియు బహుభాషా మార్గదర్శకత్వం.",
      kn: "ಗ್ರಾಮನೀತಿ AI ವೇದಿಕೆಯ ಅವಲೋಕನ: ಗ್ರಾಮೀಣ ಸವಾಲುಗಳು, ಸ್ಮಾರ್ಟ್ ಪರಿಹಾರ ವ್ಯವಸ್ಥೆ, ಸಮಗ್ರ ವ್ಯಾಪಾರ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಬಹುಭಾಷಾ ಮಾರ್ಗದರ್ಶನ.",
      ml: "ഗ്രാംനീതി AI പ്ലാറ്റ്‌ഫോം അവലോകനം: ഗ്രാമീണ വെല്ലുവിളികൾ, സ്മാർട്ട് പരിഹാരങ്ങൾ, സമഗ്ര ബിസിനസ്സ് വിശകലനം, ബഹുഭാഷാ സഹായം.",
      or: "ଗ୍ରାମନୀତି AI ପ୍ଲାଟଫର୍ମ ଅବଲୋକନ: ଗ୍ରାମୀଣ ଚ୍ୟାଲେଞ୍ଜ, ସ୍ମାର୍ଟ ସମାଧାନ, ବ୍ୟାପକ ବ୍ୟବସାୟିକ ବିଶ୍ଳେଷଣ ଏବଂ ୧୩ଟି ଭାଷାରେ ମାର୍ଗଦର୍ଶନ।",
      as: "গ্ৰামনীতি AI প্লেটফৰ্মৰ আভাস: গ্ৰামীণ প্ৰত্যাহ্বান, স্মাৰ্ট সমাধান ব্যৱস্থা, বিশদ ব্যৱসায়িক বিশ্লেষণ আৰু বহুভাষিক সহায়।",
      ur: "گرام نیتی AI پلیٹ فارم کا جائزہ: دیہی چیلنجز، اسمارٹ حل کا نظام، جامع کاروباری تجزیہ اور کثیر لسانی رہنمائی۔"
    };
    const text = speechMap[language] || speechMap['en'];
    speak(text);
  };

  return (
    <div className="space-y-10 animate-in fade-in pb-16">
      
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-emerald-100 text-[#14532D] rounded-2xl shadow-2xs">
              <Layers className="w-5 h-5 text-[#166534]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
              GramNiti AI — Comprehensive Platform Overview
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Complete institutional overview covering rural market challenges, solution architecture, business infographics, and 9-step decision workflows.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReadOverview}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Listen to platform overview"
          >
            <Volume2 className="w-4 h-4 text-[#166534]" />
            <span>Audio Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="px-4 py-2 bg-[#166534] hover:bg-[#14532D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Compass className="w-4 h-4" />
            <span>View Landing Slides</span>
          </button>
        </div>
      </div>

      {/* 1. ⚡ Interactive Live Village Sandbox & Loan Preview */}
      <div className="w-full">
        <LiveSandboxSimulator setActiveTab={setActiveTab} />
      </div>

      {/* 2. ⚠️ The Rural Challenge (Problem Breakdown from Slide 2) */}
      <div className="w-full">
        <RuralProblemsSection setActiveTab={setActiveTab} />
      </div>

      {/* 3. ⚙️ One Platform. Smarter Access. (Architecture & Pipeline from Slide 3 & 4) */}
      <div className="w-full">
        <SolutionArchitectureSection setActiveTab={setActiveTab} />
      </div>

      {/* 4. 🏛 4 Core Feature Highlights */}
      <div className="w-full">
        <FeatureHighlights setActiveTab={setActiveTab} />
      </div>

      {/* 5. 🇮🇳 Government Trust, MoSJE Alignment & Primary Journey Action Banner */}
      <div className="w-full">
        <GovernmentTrustBanner setActiveTab={setActiveTab} />
      </div>

      {/* 6. 📈 Comprehensive Business Analysis Graph & Data-Driven Rural Insights Infographic */}
      <div className="w-full">
        <MacroBusinessAnalysisInfographic setActiveTab={setActiveTab} />
      </div>

      {/* 7. 🌐 13 Official Indian Languages with Real-Time Voice Assistance */}
      <div className="w-full">
        <InteractiveVoiceLanguageSection />
      </div>

      {/* 8. 🧭 Interactive 9-Step Connected Decision Pathway */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#DCFCE7] text-[#14532D]">
                <Compass className="w-5 h-5 text-[#166534]" />
              </span>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
                Connected 9-Step Decision Pathway
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              GramNiti AI guides every rural entrepreneur from idea exploration to verified scheme subsidy and bank-ready DPR draft.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="px-5 py-2.5 bg-[#166534] hover:bg-[#14532D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-98 shrink-0"
          >
            <span>Launch Citizen Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 9-Step Interactive Stepper Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {journey.steps.map((step) => {
            const isCurrent = journey.nextStep.id === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveTab(step.tab)}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer group ${
                  step.isCompleted
                    ? 'bg-[#DCFCE7]/40 border-emerald-300 text-emerald-950 hover:bg-[#DCFCE7]/70'
                    : isCurrent
                    ? 'bg-amber-50 border-[#EAB308] text-amber-950 ring-2 ring-[#EAB308]/40 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1.5">
                  <span className={isCurrent ? 'text-amber-700 font-extrabold' : 'text-slate-400'}>
                    Step {step.number}
                  </span>
                  {step.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308] animate-ping" />
                  ) : null}
                </div>
                <div className="text-xs font-bold truncate leading-tight group-hover:text-[#166534] transition-colors">
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 9. ⚡ 1-Click Fast Navigation Hub (All 7 Integrated Modules) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#EAB308]" />
              <span>Explore All GramNiti AI Modules</span>
            </h3>
            <p className="text-xs text-slate-500">
              Access all intelligent GovTech tools directly with 1-click navigation.
            </p>
          </div>
          <span className="text-xs font-bold text-[#14532D] bg-[#DCFCE7] px-3 py-1 rounded-full font-mono">
            7 Integrated Tools
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('advisor')}
            className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-emerald-400 hover:shadow-md transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-[#DCFCE7] text-[#14532D] group-hover:scale-110 transition-transform shadow-2xs">
              <TrendingUp className="w-5 h-5 text-[#166534]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 leading-tight block">Business Advisor</span>
              <span className="text-[10px] text-slate-500">5–10km SWOT Viability</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schemes')}
            className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-700 group-hover:scale-110 transition-transform shadow-2xs">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 leading-tight block">Scheme Explorer</span>
              <span className="text-[10px] text-slate-500">PMEGP, PMFME, Mudra</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verify')}
            className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-amber-400 hover:shadow-md transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 group-hover:scale-110 transition-transform shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 leading-tight block">Verify Authenticity</span>
              <span className="text-[10px] text-slate-500">Anti-Fraud Protection</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finance')}
            className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-emerald-400 hover:shadow-md transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 group-hover:scale-110 transition-transform shadow-2xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 leading-tight block">Plan Finance</span>
              <span className="text-[10px] text-slate-500">10% Margin & 90% Loan</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('simulation')}
            className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-purple-400 hover:shadow-md transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 group-hover:scale-110 transition-transform shadow-2xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 leading-tight block">3-Case Simulator</span>
              <span className="text-[10px] text-slate-500">Test Stress Scenarios</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('action-plan')}
            className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-teal-400 hover:shadow-md transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-teal-50 text-teal-700 group-hover:scale-110 transition-transform shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 leading-tight block">DPR Draft</span>
              <span className="text-[10px] text-slate-500">AI-Assisted Loan Pack</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-emerald-400 hover:shadow-md transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-[#DCFCE7] text-[#14532D] group-hover:scale-110 transition-transform shadow-2xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 leading-tight block">Ask GramNiti</span>
              <span className="text-[10px] text-slate-500">13 Indian Languages AI</span>
            </div>
          </button>
        </div>
      </div>

      {/* 10. 🏆 Measurable Real-World Impact (Detailed Impact Breakdown from Slide 5) */}
      <div className="w-full">
        <ImpactMetricsSection setActiveTab={setActiveTab} />
      </div>

      {/* 11. 📊 Engine Audit & Transparency Section */}
      <EngineTransparencyCard />

      {/* 12. 🛡 Disclaimer Banner */}
      <DisclaimerBanner type="general" />
    </div>
  );
};
