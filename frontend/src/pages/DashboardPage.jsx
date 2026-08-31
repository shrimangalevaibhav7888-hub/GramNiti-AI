import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGramNiti } from '../contexts/GramNitiContext';
import { RuralProblemsSection } from '../components/landing/RuralProblemsSection';
import { SolutionArchitectureSection } from '../components/landing/SolutionArchitectureSection';
import { MacroBusinessAnalysisInfographic } from '../components/business/MacroBusinessAnalysisInfographic';
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
  User,
  Zap
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const DashboardPage = ({ setActiveTab }) => {
  const { t, language, speak } = useLanguage();
  const { 
    userProfile, 
    locations,
    currentLocation, 
    setLocation,
    selectedBusiness, 
    feasibilityReport,
    selectedScheme, 
    financialPlan, 
    verificationResult,
    eligibilityResult,
    simulationResult,
    riskAssessment,
    documentChecklist,
    uploadedDocCodes,
    actionPlan,
    getJourneyStepState 
  } = useGramNiti();

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const journey = getJourneyStepState();
  const businessDisplayName = selectedBusiness?.name_mr && language === 'mr' 
    ? selectedBusiness.name_mr 
    : selectedBusiness?.name_hi && language === 'hi' 
    ? selectedBusiness.name_hi 
    : selectedBusiness?.name || 'Dairy Farming';
  const schemeDisplayName = selectedScheme?.name || 'PMEGP Scheme';

  // Multilingual summary speech readout builder
  const handleReadDashboardSummary = () => {
    const profitStr = formatCurrency(simulationResult?.normal_case?.net_cash_remaining || 14306);
    const biz = businessDisplayName;
    const sch = selectedScheme?.code || 'PMEGP';
    const name = userProfile.name || 'Friend';

    const speechMap = {
      mr: `नमस्ते ${name}. ग्रामनीती नियंत्रण कक्षात आपले स्वागत आहे. तुमचा निवडलेला व्यवसाय ${biz} असून यासाठी ${sch} योजनेअंतर्गत २५ ते ३५ टक्के अनुदानाची शिफारस आहे. बँकेचा हप्ता भरून दरमहा सुमारे ${profitStr} निव्वळ नफा अपेक्षित आहे.`,
      hi: `नमस्ते ${name}. ग्रामनीती कंट्रोल सेंटर में आपका स्वागत है। आपका चयनित व्यवसाय ${biz} है जिसके लिए ${sch} योजना में 25 से 35 प्रतिशत सब्सिडी उपलब्ध है। मासिक बैंक EMI चुकाने के बाद लगभग ${profitStr} शुद्ध लाभ रहेगा।`,
      bn: `নমস্কার ${name}। গ্রামনীতিতে আপনাকে স্বাগতম। আপনার নির্বাচিত ব্যবসা ${biz} এবং এর জন্য ${sch} প্রকল্পের অধীনে অনুদানের সুপারিশ করা হয়েছে। ব্যাংকের কিস্তি পরিশোধের পর প্রতি মাসে আনুমানিক ${profitStr} নিট লাভ থাকবে।`,
      gu: `નમસ્તે ${name}. ગ્રામનીતિ કંટ્રોલ સેન્ટરમાં આપનું સ્વાગત છે. તમારો પસંદ કરેલ વ્યવસાય ${biz} છે જેના માટે ${sch} યોજનામાં સબસિડી ઉપલબ્ધ છે. માસિક બેંક હપ્તા બાદ અંદાજે ${profitStr} ચોખ્ખો નફો રહેશે.`,
      pa: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${name}. ਗ੍ਰਾਮਨੀਤੀ ਕੰਟਰੋਲ ਸੈਂਟਰ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਤੁਹਾਡਾ ਕਾਰੋਬਾਰ ${biz} ਹੈ ਜਿਸ ਲਈ ${sch} ਸਕੀਮ ਅਧੀਨ ਸਬਸਿਡੀ ਦੀ ਸਿਫਾਰਸ਼ ਹੈ। ਬੈਂਕ ਕਿਸ਼ਤ ਕੱਟ ਕੇ ਹਰ ਮਹੀਨੇ ਲਗਭਗ ${profitStr} ਸ਼ੁੱਧ ਮੁਨਾਫਾ ਰਹੇਗਾ।`,
      ta: `வணக்கம் ${name}. கிராம்நீதிக்கு நல்வரவு. உங்கள் தொழில் ${biz}, இதற்கு ${sch} திட்டத்தின் கீழ் மானியம் பரிந்துரைக்கப்படுகிறது. வங்கி தவணை செலுத்திய பின் மாதத்திற்கு சுமார் ${profitStr} நிகர லாபம் எதிர்பார்க்கப்படுகிறது.`,
      te: `నమస్కారం ${name}. గ్రామనీతికి స్వాగతం. మీ వ్యాపారం ${biz}, దీని కోసం ${sch} పథకం కింద సబ్సిడీ సిఫార్సు చేయబడింది. బ్యాంక్ వాయిదా చెల్లించిన తర్వాత నెలకు సుమారు ${profitStr} నికర లాభం ఉంటుంది.`,
      kn: `ನಮಸ್ಕಾರ ${name}. ಗ್ರಾಮನೀತಿಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಉದ್ಯಮ ${biz}, ಇದಕ್ಕಾಗಿ ${sch} ಯೋಜನೆಯಡಿ ಸಬ್ಸಿಡಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ. ಬ್ಯಾಂಕ್ ಕಂತು ಪಾವತಿಸಿದ ನಂತರ ತಿಂಗಳಿಗೆ ಸುಮಾರು ${profitStr} ನಿವ್ವಳ ಲಾಭ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ.`,
      ml: `നമസ്കാരം ${name}. ഗ്രാംനീതിയിലേക്ക് സ്വാഗതം. നിങ്ങളുടെ സംരംഭം ${biz}, ഇതിനായി ${sch} പദ്ധതി വഴി സബ്‌സിഡി ലഭ്യമാണ്. ബാങ്ക് തവണയ്ക്ക് ശേഷം പ്രതിമാസം ഏകദേശം ${profitStr} അറ്റാദായം ലഭിക്കും.`,
      or: `ନମସ୍କାର ${name}। ଗ୍ରାମନୀତିରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ଆପଣଙ୍କ ବ୍ୟବସାୟ ${biz} ଏବଂ ଏଥିପାଇଁ ${sch} ଯୋଜନା ଅଧୀନରେ ଅନୁଦାନ ଉପଲବ୍ଧ। ବ୍ୟାଙ୍କ କିସ୍ତି ପରେ ମାସିକ ପ୍ରାୟ ${profitStr} ନିଟ୍ ଲାଭ ରହିବ।`,
      as: `নমস্কাৰ ${name}। গ্ৰামনীতিলৈ আপোনাক স্বাগতম। আপোনাৰ নিৰ্বাচিত ব্যৱসায় ${biz} আৰু ইয়াৰ বাবে ${sch} আঁচনিৰ অধীনত ৰাজসাহায্য উপলব্ধ। মাহেকীয়া কিস্তি পৰিশোধৰ পিছত প্ৰায় ${profitStr} লাভ থাকিব।`,
      ur: `سلام ${name}۔ گرام نیتی میں خوش آمدید۔ آپ کا منتخب کردہ کاروبار ${biz} ہے جس کے لیے ${sch} اسکیم के تحت سبسڈی تجویز کی گئی ہے۔ بینک قسط کے बाद ماہانہ تقریباً ${profitStr} خالص منافع متوقع ہے۔`
    };

    const speechText = speechMap[language] || `Namaste ${name}. Welcome to your GramNiti control center. Your active business is ${biz} paired with ${sch} scheme. Your estimated monthly profit after bank EMI is ${profitStr}.`;
    speak(speechText);
  };

  return (
    <div className="space-y-10 animate-in fade-in pb-16">
      
      {/* 1. 🧭 User & Location Greeting Banner (Personal Workspace) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#14532D] via-[#166534] to-[#0A230C] text-white p-6 sm:p-8 shadow-md border border-emerald-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            
            {/* Village & Location Tag with Provenance Selector */}
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/30 hover:bg-black/40 border border-white/20 text-xs text-[#EAB308] font-semibold transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#EAB308]" />
                <span>
                  {currentLocation ? `${currentLocation.village_name} • ${currentLocation.block_taluka} • ${currentLocation.district}, ${currentLocation.state}` : 'Select Village'}
                </span>
                <ChevronDown className="w-3 h-3 text-white/70" />
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-mono font-bold tracking-wider ml-1">
                  DEMO DATA
                </span>
              </button>

              {locationDropdownOpen && (
                <div className="absolute top-9 left-0 w-80 bg-white text-slate-900 shadow-2xl rounded-2xl border border-slate-200 p-2.5 z-50 animate-in fade-in">
                  <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1 tracking-wider">
                    Select Local Village Dataset
                  </div>
                  <div className="space-y-1 mt-1 max-h-60 overflow-y-auto">
                    {locations.map(loc => (
                      <button
                        key={loc.location_id}
                        type="button"
                        onClick={() => {
                          setLocation(loc.location_id);
                          setLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                          currentLocation?.location_id === loc.location_id
                            ? 'bg-[#DCFCE7] text-[#14532D] font-bold'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-sm">{loc.village_name}</div>
                        <div className="text-[11px] text-slate-500">{loc.block_taluka}, {loc.district}, {loc.state}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Greeting */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white tracking-tight flex items-center gap-2">
              {t('namaste')}, {userProfile.name} 👋
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              {t('welcome_sub')}
            </p>
          </div>

          {/* Profile Progress & Audio Widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[260px] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-200 font-semibold uppercase tracking-wider">{t('profile_completion')}</span>
              <span className="font-mono font-bold text-[#EAB308] text-sm">{journey.progressPct}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden p-0.5">
              <div 
                className="bg-gradient-to-r from-[#EAB308] to-[#16A34A] h-full rounded-full transition-all duration-700"
                style={{ width: `${journey.progressPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10 text-emerald-100/80">
              <span>Next Step: <strong className="text-white">{journey.nextStep.title}</strong></span>
              <button
                type="button"
                onClick={handleReadDashboardSummary}
                className="hover:text-[#EAB308] transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                title="Listen to summary"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Audio</span>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Background Icon */}
        <div className="absolute right-[-10px] bottom-[-25px] opacity-10 text-[150px] select-none pointer-events-none">
          🌾
        </div>
      </div>

      {/* 2. 🧭 Primary 9-Step MVP Journey Stepper */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="space-y-0.5">
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#166534]" />
              <span>Primary Decision-Support Journey (9-Step Pathway)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Connected pathway from business selection to AI-assisted DPR draft generation.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-[#14532D] bg-[#DCFCE7] px-3 py-1 rounded-full border border-emerald-200 font-mono">
              {journey.completedCount} / {journey.totalSteps} Complete
            </span>
            <button
              type="button"
              onClick={() => setActiveTab(journey.nextStep.tab)}
              className="px-4 py-2 bg-[#166534] hover:bg-[#14532D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>{journey.isAllComplete ? 'View AI-Assisted DPR Draft' : t('continue_journey')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Horizontal Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-9 gap-2 pt-1">
          {journey.steps.map((step) => {
            const isCurrent = journey.nextStep.id === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveTab(step.tab)}
                className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  step.isCompleted
                    ? 'bg-[#DCFCE7]/40 border-emerald-300 text-emerald-950 hover:bg-[#DCFCE7]/70'
                    : isCurrent
                    ? 'bg-amber-50 border-[#EAB308] text-amber-950 ring-2 ring-[#EAB308]/40 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                  <span className={isCurrent ? 'text-amber-700 font-bold' : 'text-slate-400'}>{step.number}</span>
                  {step.isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#EAB308] animate-ping" />
                  ) : null}
                </div>
                <div className="text-xs font-bold truncate leading-tight">
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ⚡ Quick Actions Launchpad */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-heading font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#EAB308]" />
            <span>{t('dash_quick_actions')}</span>
          </h3>
          <span className="text-xs text-slate-400">1-Click Direct Access</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('advisor')}
            className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-emerald-400 hover:shadow-xs transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-[#DCFCE7] text-[#14532D] group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-[#166534]" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">Find Business</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schemes')}
            className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-blue-400 hover:shadow-xs transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-700 group-hover:scale-110 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">Explore Schemes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verify')}
            className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-amber-400 hover:shadow-xs transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">Verify Scheme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finance')}
            className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-emerald-400 hover:shadow-xs transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 group-hover:scale-110 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">Plan Finance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('simulation')}
            className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-purple-400 hover:shadow-xs transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 group-hover:scale-110 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">3-Case Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('action-plan')}
            className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-teal-400 hover:shadow-xs transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-teal-50 text-teal-700 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">DPR Draft</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-emerald-400 hover:shadow-xs transition-all flex flex-col items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-[#DCFCE7] text-[#14532D] group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 leading-tight">Ask GramNiti</span>
          </button>
        </div>
      </div>

      {/* 4. ⚠️ Rural Problem Context */}
      <RuralProblemsSection setActiveTab={setActiveTab} />

      {/* 5. 📈 Macro Business Analysis Infographic */}
      <MacroBusinessAnalysisInfographic setActiveTab={setActiveTab} />

      {/* 6. ⚙️ Solution Architecture & Pipeline */}
      <SolutionArchitectureSection setActiveTab={setActiveTab} />

      {/* 7. 🏆 Measurable Real-World Impact */}
      <ImpactMetricsSection setActiveTab={setActiveTab} />

      {/* 8. 📊 Engine Audit & Transparency Section */}
      <EngineTransparencyCard />

      <DisclaimerBanner type="general" />
    </div>
  );
};
