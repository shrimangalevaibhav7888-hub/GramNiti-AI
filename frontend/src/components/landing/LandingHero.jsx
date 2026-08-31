import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGramNiti } from '../../contexts/GramNitiContext';
import { GramNitiEmblem } from '../common/GramNitiLogo';
import { 
  TrendingUp, 
  Landmark, 
  ShieldCheck, 
  Calculator, 
  BookOpen, 
  Users, 
  Bot, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Globe, 
  IndianRupee,
  Cpu,
  HeartHandshake,
  Lock,
  Leaf
} from 'lucide-react';

export const LandingHero = ({ setActiveTab }) => {
  const { t, setShowOnboardingModal, language } = useLanguage();
  const { loadDemoFarmerProfile } = useGramNiti();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#FAF9F3] border border-emerald-900/20 shadow-xl mb-8 animate-in fade-in duration-300">
      
      {/* 1. 🇮🇳 Top Institutional Header Bar */}
      <div className="bg-white/90 backdrop-blur-md px-6 sm:px-10 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Ministry Emblem & Name */}
        <div className="flex items-center gap-3.5">
          {/* Ashoka Stambh / National Emblem Icon */}
          <div className="flex flex-col items-center">
            <svg className="w-8 h-10 text-slate-800" viewBox="0 0 24 30" fill="currentColor">
              {/* Stylized National Emblem */}
              <path d="M12 2C10.5 2 9.5 3 9.5 4.5C9.5 5.5 10 6.2 10.8 6.6C10.3 7 10 7.7 10 8.5C10 9.8 11 10.8 12.3 11C12.1 11.3 12 11.6 12 12C12 12.6 12.4 13 13 13H15C15.6 13 16 12.6 16 12C16 11.4 15.6 11 15 11H13.8C14.5 10.4 15 9.5 15 8.5C15 7.1 13.9 6 12.5 6C13.3 5.6 14 4.7 14 3.5C14 2 12.8 2 12 2Z" opacity="0.9" />
              <path d="M6 5C5 5 4 6 4 7.5C4 8.5 4.5 9.2 5.3 9.6C4.8 10 4.5 10.7 4.5 11.5C4.5 12.8 5.5 13.8 6.8 14C6.6 14.3 6.5 14.6 6.5 15C6.5 15.6 6.9 16 7.5 16H9.5C10.1 16 10.5 15.6 10.5 15C10.5 14.4 10.1 14 9.5 14H8.3C9 13.4 9.5 12.5 9.5 11.5C9.5 10.1 8.4 9 7 9C7.8 8.6 8.5 7.7 8.5 6.5C8.5 5 7.3 5 6 5Z" opacity="0.8" />
              <path d="M18 5C16.7 5 15.5 5 15.5 6.5C15.5 7.7 16.2 8.6 17 9C15.6 9 14.5 10.1 14.5 11.5C14.5 12.5 15 13.4 15.7 14H14.5C13.9 14 13.5 14.4 13.5 15C13.5 15.6 13.9 16 14.5 16H16.5C17.1 16 17.5 15.6 17.5 15C17.5 14.6 17.4 14.3 17.2 14C18.5 13.8 19.5 12.8 19.5 11.5C19.5 10.7 19.2 10 18.7 9.6C19.5 9.2 20 8.5 20 7.5C20 6 19 5 18 5Z" opacity="0.8" />
              <rect x="3" y="17" width="18" height="2" rx="1" />
              <circle cx="12" cy="20" r="1.5" />
              <rect x="2" y="22" width="20" height="2" rx="1" />
              <text x="12" y="29" fontSize="4.5" textAnchor="middle" fontWeight="bold" fill="currentColor">सत्यमेव जयते</text>
            </svg>
          </div>

          <div className="border-l border-slate-300 pl-3">
            <div className="text-xs sm:text-sm font-heading font-extrabold text-slate-900 tracking-tight leading-tight">
              Ministry of Social Justice and Empowerment
            </div>
            <div className="text-[11px] font-semibold text-slate-600">
              Government of India
            </div>
          </div>
        </div>

        {/* Right: Digital India Logo & Slogan */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 via-white to-green-50 px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Stylized Digital India 'd' Logo */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#138808] via-[#000080] to-[#FF9933] flex items-center justify-center text-white font-extrabold text-xs shadow-inner">
              <span className="font-serif italic text-sm">di</span>
            </div>
            <div className="text-left">
              <div className="text-xs font-heading font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                Digital India
              </div>
              <div className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">
                Power To Empower
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 🌟 Main Hero Body: Headline + AI Assistant Wheel Mascot */}
      <div className="relative px-6 sm:px-10 pt-8 pb-32 sm:pb-36 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Big Brand Typography & Value Proposition (7 cols) */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Big Brand Title with Official Logo Lockup */}
            <div className="inline-block">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <GramNitiEmblem className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md" />
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-[#002B66]">
                    Gram
                  </span>
                  <span className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-[#00873E]">
                    Niti
                  </span>
                  <div className="relative inline-flex items-center ml-1">
                    <span className="bg-[#002B66] text-white font-heading font-extrabold text-lg sm:text-2xl md:text-3xl px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-2xl tracking-wider uppercase shadow-md">
                      AI
                    </span>
                    {/* Floating Pixel Cubes */}
                    <span className="absolute -top-2 -right-3 flex flex-col gap-0.5">
                      <span className="w-2 h-2 bg-[#EA580C] rounded-xs" />
                      <span className="w-2 h-2 bg-[#0284C7] rounded-xs -ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-extrabold text-[#0A230C] leading-snug tracking-tight">
              AI-Driven Hyper-Local Business Advisory <br className="hidden sm:inline" />
              & Financial Structuring Assistant
            </h2>

            {/* Tagline */}
            <p className="text-sm sm:text-base text-slate-700 font-medium max-w-xl">
              Empowering <strong className="text-emerald-900 font-bold">Rural Entrepreneurs</strong>. Building <strong className="text-emerald-800 font-bold">Self-Reliant Villages</strong>.
            </p>

            {/* Interactive Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('advisor')}
                className="px-6 py-3.5 bg-[#166534] hover:bg-[#14532D] text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Local Businesses</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('schemes')}
                className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl text-xs sm:text-sm font-bold transition-all border border-slate-300 shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Landmark className="w-4 h-4 text-blue-700" />
                <span>Central & State Schemes</span>
              </button>

              <button
                type="button"
                onClick={loadDemoFarmerProfile}
                className="px-4 py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-2xl text-xs font-bold transition-all border border-amber-200 flex items-center gap-1.5 cursor-pointer"
                title="Load 32-year-old dairy farmer profile preset"
              >
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>Load Demo Farmer</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Mascot & 5-Node AI Capability Wheel (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            
            {/* Outer Circular Ring Frame with 5 Connected Capability Nodes */}
            <div className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 rounded-full border-4 border-[#166534] bg-gradient-to-b from-white/95 via-emerald-50/40 to-emerald-100/50 backdrop-blur-md shadow-2xl p-4 flex items-center justify-center">
              
              {/* Subtle India Map Silhouette in Center Backdrop */}
              <svg 
                className="absolute inset-0 w-full h-full text-emerald-600/10 pointer-events-none p-6" 
                viewBox="0 0 100 100" 
                fill="currentColor"
              >
                <path d="M48 10 C52 14, 55 18, 56 24 C57 30, 64 34, 66 40 C70 45, 78 48, 76 54 C74 58, 68 62, 64 68 C58 75, 54 85, 48 95 C45 88, 40 76, 36 70 C32 64, 26 58, 28 50 C30 42, 36 38, 38 30 C40 22, 44 14, 48 10 Z" />
                <circle cx="50" cy="38" r="1.5" fill="#166534" />
                <circle cx="42" cy="52" r="1.5" fill="#166534" />
                <circle cx="58" cy="48" r="1.5" fill="#166534" />
                <circle cx="48" cy="68" r="1.5" fill="#166534" />
              </svg>

              {/* Dotted Radial Connector Lines */}
              <div className="absolute inset-0 border-2 border-dashed border-emerald-500/30 rounded-full m-8 pointer-events-none" />

              {/* 🤖 Central AI Mascot with Headphones */}
              <div className="relative z-20 flex flex-col items-center justify-center animate-bounce-subtle">
                {/* Cute Mascot Avatar */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-white to-slate-100 border-4 border-slate-200 shadow-xl flex flex-col items-center justify-center">
                  
                  {/* Headphone Band */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-28 h-10 border-t-6 border-slate-800 rounded-t-full pointer-events-none" />
                  {/* Left Ear Cushion */}
                  <div className="absolute -left-2 top-8 w-4 h-10 bg-slate-800 rounded-full shadow-md" />
                  {/* Right Ear Cushion */}
                  <div className="absolute -right-2 top-8 w-4 h-10 bg-slate-800 rounded-full shadow-md" />
                  {/* Headset Mic */}
                  <div className="absolute right-0 bottom-6 w-7 h-1.5 bg-slate-800 rounded-full rotate-25 origin-left flex items-center justify-end">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  {/* Robot Face Screen */}
                  <div className="w-20 h-16 bg-slate-900 rounded-2xl border-2 border-slate-700 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                    {/* Glowing Eyes */}
                    <div className="flex items-center gap-3">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    </div>
                    {/* Smiling Mouth */}
                    <div className="w-4 h-1.5 border-b-2 border-emerald-400 rounded-full mt-1.5" />
                  </div>

                  {/* Leaf Badge on Chest / Base */}
                  <div className="absolute -bottom-2 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-xs flex items-center gap-0.5 text-xs text-emerald-700 font-bold">
                    <span>🍃</span>
                  </div>
                </div>
              </div>

              {/* 5 Orbiting Connected Capability Nodes */}
              {/* 1. Top-Left: Finance Advice */}
              <button
                type="button"
                onClick={() => setActiveTab('finance')}
                className="absolute top-2 left-4 sm:top-3 sm:left-6 bg-white hover:bg-emerald-50 p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-md flex flex-col items-center text-center transition-all hover:scale-105 group cursor-pointer z-30"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1 leading-tight group-hover:text-emerald-800">
                  Finance<br />Advice
                </span>
              </button>

              {/* 2. Top-Right: Business Guidance */}
              <button
                type="button"
                onClick={() => setActiveTab('advisor')}
                className="absolute top-2 right-4 sm:top-3 sm:right-6 bg-white hover:bg-emerald-50 p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-md flex flex-col items-center text-center transition-all hover:scale-105 group cursor-pointer z-30"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1 leading-tight group-hover:text-emerald-800">
                  Business<br />Guidance
                </span>
              </button>

              {/* 3. Mid-Left: Scheme Discovery */}
              <button
                type="button"
                onClick={() => setActiveTab('schemes')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-2 bg-white hover:bg-emerald-50 p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-md flex flex-col items-center text-center transition-all hover:scale-105 group cursor-pointer z-30"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Landmark className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1 leading-tight group-hover:text-blue-800">
                  Scheme<br />Discovery
                </span>
              </button>

              {/* 4. Mid-Right: Local Language Support */}
              <button
                type="button"
                onClick={() => setShowOnboardingModal(true)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-2 bg-white hover:bg-emerald-50 p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-md flex flex-col items-center text-center transition-all hover:scale-105 group cursor-pointer z-30"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1 leading-tight group-hover:text-amber-800">
                  Local Language<br />Support (13)
                </span>
              </button>

              {/* 5. Bottom-Center: Knowledge & Insights */}
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-white hover:bg-emerald-50 p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-md flex flex-col items-center text-center transition-all hover:scale-105 group cursor-pointer z-30"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1 leading-tight group-hover:text-emerald-800">
                  Knowledge & Insights
                </span>
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* 3. 🌄 Pastoral Rural Landscape Illustration Backdrop */}
      <div className="absolute inset-x-0 bottom-0 h-44 sm:h-52 overflow-hidden pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 300">
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0" />
              <stop offset="60%" stopColor="#FEF3C7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="hillGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
            <linearGradient id="hillGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
            <linearGradient id="roadGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="50%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>

          {/* Gentle Rising Sun in Center Horizon */}
          <circle cx="600" cy="170" r="55" fill="#FDE047" opacity="0.6" />
          <circle cx="600" cy="170" r="80" fill="#FEF08A" opacity="0.3" />

          {/* Distant Rolling Hills */}
          <path d="M0 190 Q200 130 450 160 T900 150 Q1050 130 1200 170 L1200 300 L0 300 Z" fill="url(#hillGrad1)" opacity="0.6" />

          {/* Midground Green Terraces & Crop Rows */}
          <path d="M0 210 Q300 170 600 200 T1200 190 L1200 300 L0 300 Z" fill="url(#hillGrad2)" opacity="0.85" />

          {/* Winding Village Dirt Road */}
          <path d="M600 200 Q580 230 520 250 T380 300 L440 300 Q580 260 620 230 Z" fill="url(#roadGrad)" opacity="0.75" />

          {/* Left Traditional Village Houses & Windmill */}
          <g transform="translate(40, 200)">
            {/* Windmill */}
            <line x1="120" y1="30" x2="110" y2="85" stroke="#78350F" strokeWidth="2.5" />
            <line x1="120" y1="30" x2="130" y2="85" stroke="#78350F" strokeWidth="2.5" />
            <circle cx="120" cy="30" r="4" fill="#92400E" />
            <line x1="100" y1="30" x2="140" y2="30" stroke="#78350F" strokeWidth="2" />
            <line x1="120" y1="10" x2="120" y2="50" stroke="#78350F" strokeWidth="2" />

            {/* House 1 */}
            <polygon points="10,50 40,25 70,50" fill="#B45309" />
            <rect x="15" y="50" width="50" height="35" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
            <rect x="32" y="60" width="16" height="25" fill="#78350F" />
            <rect x="20" y="55" width="8" height="8" fill="#92400E" />

            {/* House 2 */}
            <polygon points="65,58 90,38 115,58" fill="#9A3412" />
            <rect x="70" y="58" width="40" height="27" fill="#FEF3C7" stroke="#9A3412" strokeWidth="1.5" />
            <rect x="85" y="66" width="10" height="19" fill="#78350F" />
          </g>

          {/* Right Traditional Village Farmsteads */}
          <g transform="translate(920, 205)">
            {/* House 3 */}
            <polygon points="20,52 50,30 80,52" fill="#B45309" />
            <rect x="25" y="52" width="50" height="33" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
            <rect x="42" y="62" width="14" height="23" fill="#78350F" />

            {/* House 4 */}
            <polygon points="75,58 100,40 125,58" fill="#9A3412" />
            <rect x="80" y="58" width="40" height="27" fill="#FEF3C7" stroke="#9A3412" strokeWidth="1.5" />
            <rect x="94" y="68" width="12" height="17" fill="#78350F" />
          </g>

          {/* Trees & Shrubbery along horizon */}
          <circle cx="280" cy="205" r="14" fill="#14532D" />
          <circle cx="300" cy="200" r="18" fill="#166534" />
          <circle cx="320" cy="208" r="12" fill="#15803D" />

          <circle cx="820" cy="198" r="16" fill="#14532D" />
          <circle cx="845" cy="195" r="20" fill="#166534" />
          <circle cx="870" cy="202" r="14" fill="#15803D" />
        </svg>
      </div>

      {/* 4. 🛡️ Bottom Feature Badges & Trust Banner */}
      <div className="relative z-20 bg-gradient-to-r from-[#0E3D1E] via-[#14532D] to-[#0A230C] text-white px-6 sm:px-10 py-4.5 border-t border-emerald-800/80">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left: 4 Trust & Core Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full lg:w-auto">
            {/* 1. Hyper-Local Intelligence */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 shrink-0 border border-white/15">
                <Cpu className="w-4 h-4 text-[#EAB308]" />
              </div>
              <span className="text-xs font-bold leading-tight">
                Hyper-Local<br />Intelligence
              </span>
            </div>

            {/* 2. AI-Powered Recommendations */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 shrink-0 border border-white/15">
                <Bot className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="text-xs font-bold leading-tight">
                AI-Powered<br />Recommendations
              </span>
            </div>

            {/* 3. Trusted • Simple • Accessible */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 shrink-0 border border-white/15">
                <HeartHandshake className="w-4 h-4 text-amber-300" />
              </div>
              <span className="text-xs font-bold leading-tight">
                Trusted • Simple<br />• Accessible
              </span>
            </div>

            {/* 4. Secure & Reliable */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 shrink-0 border border-white/15">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs font-bold leading-tight">
                Secure &amp;<br />Reliable
              </span>
            </div>
          </div>

          {/* Right: National Rural Growth Slogan */}
          <div className="text-center lg:text-right border-t lg:border-t-0 lg:border-l border-emerald-700/60 pt-3 lg:pt-0 lg:pl-6">
            <div className="text-xs font-heading font-extrabold tracking-tight text-white">
              AI for Rural Growth. Data for Empowerment.
            </div>
            <div className="text-xs text-[#EAB308] font-bold flex items-center justify-center lg:justify-end gap-1 mt-0.5">
              <span>Together for a Stronger Bharat.</span>
              <span>🍃</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
