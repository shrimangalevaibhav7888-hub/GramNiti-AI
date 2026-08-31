import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Users, 
  Lightbulb, 
  Landmark, 
  TrendingUp, 
  CheckCircle2, 
  PieChart, 
  BarChart3, 
  ArrowRight, 
  ShieldCheck, 
  DollarSign, 
  Sparkles,
  HelpCircle,
  AlertTriangle,
  FileText,
  Compass,
  Cpu,
  Layers,
  Image as ImageIcon,
  BarChart
} from 'lucide-react';
import { GramNitiLogo } from '../common/GramNitiLogo';

export const MacroBusinessAnalysisInfographic = ({ setActiveTab }) => {
  const { t, language } = useLanguage();
  const [viewFormat, setViewFormat] = useState('interactive'); // 'interactive' or 'infographic'

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-7 animate-in fade-in">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200 inline-block">
            <GramNitiLogo size="md" showTagline={true} taglineText="AI-Driven Hyper-Local Business Advisory" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#14532D] tracking-tight flex items-center gap-2">
                <span>BUSINESS ANALYSIS</span>
                <span className="text-emerald-600">🍃</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Data-Driven Insights for Rural Entrepreneurship Growth
            </p>
          </div>
        </div>

        {/* Target Users Box & Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 px-4 flex items-center gap-3">
            <div className="p-2 bg-[#166534] text-white rounded-xl">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Target Users</span>
              <span className="text-xs font-bold text-slate-800">
                Rural Micro-Entrepreneurs, SHGs, Farmers, Artisans, Small Business Owners
              </span>
            </div>
          </div>

          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs self-start sm:self-center">
            <button
              type="button"
              onClick={() => setViewFormat('interactive')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewFormat === 'interactive'
                  ? 'bg-white text-[#14532D] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart className="w-3.5 h-3.5" />
              <span>Interactive Data</span>
            </button>
            <button
              type="button"
              onClick={() => setViewFormat('infographic')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewFormat === 'infographic'
                  ? 'bg-white text-[#14532D] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Infographic Poster</span>
            </button>
          </div>
        </div>
      </div>

      {viewFormat === 'infographic' ? (
        /* Image Infographic Poster View */
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md bg-slate-50">
            <img 
              src="/images/gramniti-macro-business-analysis.jpg" 
              alt="GramNiti AI - Business Analysis Infographic" 
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="text-center text-xs text-slate-500">
            GramNiti AI Macro Market & Rural Entrepreneurship Analysis Infographic
          </div>
        </div>
      ) : (
        /* Full Interactive Vector & Grid View */
        <div className="space-y-7">
          
          {/* 2. Top 5 Key Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#14532D] text-white shrink-0">
                <Users className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 leading-tight">7.2 Cr+</div>
                <div className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">Rural Micro Enterprises (Potential Market)</div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#14532D] text-white shrink-0">
                <Lightbulb className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 leading-tight">3.8 Cr+</div>
                <div className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">Entrepreneurs Lack Right Business Guidance</div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#14532D] text-white shrink-0">
                <Landmark className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 leading-tight">1000+</div>
                <div className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">Government Schemes Integrated</div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#14532D] text-white shrink-0">
                <span className="text-base font-bold font-mono text-[#EAB308]">₹</span>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 leading-tight">₹ 20 L Cr+</div>
                <div className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">Credit Flow under Priority Sector for Rural</div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="p-2.5 rounded-xl bg-[#14532D] text-white shrink-0">
                <TrendingUp className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 leading-tight">25%+</div>
                <div className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">Annual Growth in Rural Digital Adoption</div>
              </div>
            </div>
          </div>

          {/* 3. 6-Card Analytical Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Card 1: Key Problems Faced by Rural Entrepreneurs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="bg-[#14532D] text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                  1. Key Problems Faced by Rural Entrepreneurs
                </div>

                {/* Donut Chart Simulation */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  {/* SVG Donut */}
                  <div className="relative w-36 h-36 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      {/* 28% Guidance (#166534) */}
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#166534" strokeWidth="18" strokeDasharray="61.57 219.91" strokeDashoffset="0" />
                      {/* 22% Scheme Discovery (#22c55e) */}
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#22c55e" strokeWidth="18" strokeDasharray="48.38 219.91" strokeDashoffset="-61.57" />
                      {/* 20% Financial Planning (#3b82f6) */}
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#3b82f6" strokeWidth="18" strokeDasharray="43.98 219.91" strokeDashoffset="-109.95" />
                      {/* 15% Fraud Offers (#f97316) */}
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#f97316" strokeWidth="18" strokeDasharray="32.99 219.91" strokeDashoffset="-153.93" />
                      {/* 10% Viability (#a855f7) */}
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#a855f7" strokeWidth="18" strokeDasharray="21.99 219.91" strokeDashoffset="-186.92" />
                      {/* 5% Documents (#ef4444) */}
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#ef4444" strokeWidth="18" strokeDasharray="11.00 219.91" strokeDashoffset="-208.91" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase leading-tight">Problem</span>
                      <span className="text-xs font-extrabold text-slate-800 leading-tight">Distribution</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-1.5 text-[11px] flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#166534] shrink-0" />
                      <span className="font-bold text-slate-800">28%</span>
                      <span className="text-slate-600 truncate">Lack of Business Guidance</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shrink-0" />
                      <span className="font-bold text-slate-800">22%</span>
                      <span className="text-slate-600 truncate">Complex Scheme Discovery</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shrink-0" />
                      <span className="font-bold text-slate-800">20%</span>
                      <span className="text-slate-600 truncate">Unclear Financial Planning</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] shrink-0" />
                      <span className="font-bold text-slate-800">15%</span>
                      <span className="text-slate-600 truncate">Fraud & Misleading Offers</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7] shrink-0" />
                      <span className="font-bold text-slate-800">10%</span>
                      <span className="text-slate-600 truncate">Uncertain Business Viability</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0" />
                      <span className="font-bold text-slate-800">5%</span>
                      <span className="text-slate-600 truncate">Document & Process Confusion</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight Pill */}
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-[#14532D] flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#D97706] shrink-0" />
                <span>Lack of guidance and verified information are the top barriers for rural entrepreneurs.</span>
              </div>
            </div>

            {/* Card 2: Market Opportunity */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="bg-[#14532D] text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                  2. Market Opportunity
                </div>
                <div className="text-center font-bold text-xs text-slate-700">Rural India Opportunity Landscape</div>

                {/* Vertical Bar Chart */}
                <div className="grid grid-cols-4 gap-2 items-end h-36 pt-4 border-b border-slate-200 pb-2">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold font-mono text-slate-700">7.2 Cr+</span>
                    <div className="w-full bg-[#166534] rounded-t-lg h-24" />
                    <span className="text-[9px] text-slate-500 text-center leading-tight">Total Rural Micro Enterprises</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold font-mono text-slate-700">9 Cr+</span>
                    <div className="w-full bg-[#22c55e] rounded-t-lg h-28" />
                    <span className="text-[9px] text-slate-500 text-center leading-tight">Women SHG Members</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold font-mono text-slate-700">65%</span>
                    <div className="w-full bg-[#166534] rounded-t-lg h-20" />
                    <span className="text-[9px] text-slate-500 text-center leading-tight">Lack Formal Guidance</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold font-mono text-slate-700">High</span>
                    <div className="w-full bg-[#22c55e] rounded-t-lg h-26" />
                    <span className="text-[9px] text-slate-500 text-center leading-tight">Growing Demand for Digital</span>
                  </div>
                </div>
              </div>

              {/* Insight Pill */}
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-[#14532D] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>Huge underserved market with high need for personalized, trusted, digital support.</span>
              </div>
            </div>

            {/* Card 3: Solution Impact – GramNiti AI */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="bg-[#14532D] text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                  3. Solution Impact – GramNiti AI
                </div>
                <div className="text-center font-bold text-xs text-slate-700">Expected Impact Over 3 Years</div>

                {/* Multi-line Trend / Visual Chart */}
                <div className="h-36 pt-2 space-y-2 border-b border-slate-200 pb-2">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-emerald-900 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#14532D]" /> Informed Decisions:
                      </span>
                      <span className="font-bold font-mono text-[#14532D]">40% ➔ 65% ➔ 85%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#14532D] h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-emerald-800 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Scheme Utilization:
                      </span>
                      <span className="font-bold font-mono text-[#16A34A]">30% ➔ 55% ➔ 75%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#22c55e] h-full rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-blue-800 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-600" /> Business Success Rate:
                      </span>
                      <span className="font-bold font-mono text-blue-700">20% ➔ 40% ➔ 60%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight Pill */}
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-[#14532D] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>GramNiti AI drives better decisions, higher scheme access and stronger business outcomes.</span>
              </div>
            </div>

            {/* Card 4: Business Segment Interest */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="bg-[#14532D] text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                  4. Business Segment Interest (Top Categories)
                </div>

                {/* Horizontal Bars */}
                <div className="space-y-2 text-xs pt-1">
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="font-medium text-slate-700">🐔 Poultry Farming</span>
                      <span className="font-bold font-mono text-slate-900">24%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#166534] h-full rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="font-medium text-slate-700">🐄 Dairy Farming</span>
                      <span className="font-bold font-mono text-slate-900">18%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#166534] h-full rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="font-medium text-slate-700">🏪 Grocery Store</span>
                      <span className="font-bold font-mono text-slate-900">16%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#22c55e] h-full rounded-full" style={{ width: '53%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="font-medium text-slate-700">🥫 Food Processing</span>
                      <span className="font-bold font-mono text-slate-900">14%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#22c55e] h-full rounded-full" style={{ width: '46%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="font-medium text-slate-700">🧵 Tailoring / Handicraft</span>
                      <span className="font-bold font-mono text-slate-900">10%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#22c55e] h-full rounded-full" style={{ width: '33%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight Pill */}
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-[#14532D] flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#166534] shrink-0" />
                <span>Livelihood and agri-allied businesses show the highest interest among rural entrepreneurs.</span>
              </div>
            </div>

            {/* Card 5: Financial Clarity Need */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="bg-[#14532D] text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                  5. Financial Clarity Need
                </div>
                <div className="text-center font-bold text-xs text-slate-700">Need for Financial Planning & Support</div>

                {/* Semicircle Gauge Meter for 87% */}
                <div className="flex flex-col items-center justify-center pt-2">
                  <div className="relative w-44 h-24 overflow-hidden flex items-end justify-center">
                    <svg viewBox="0 0 100 50" className="w-full h-full">
                      {/* Background Arch */}
                      <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
                      {/* Highlight Arch 87% */}
                      <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke="url(#gauge-gradient)" strokeWidth="12" strokeLinecap="round" strokeDasharray="125.66" strokeDashoffset="16.3" />
                      <defs>
                        <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="50%" stopColor="#eab308" />
                          <stop offset="100%" stopColor="#16a34a" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute bottom-0 flex flex-col items-center">
                      <span className="text-3xl font-extrabold font-mono text-[#14532D] leading-none">87%</span>
                    </div>
                  </div>
                  <p className="text-xs text-center text-slate-700 font-semibold mt-2 px-2">
                    Entrepreneurs need help with financial planning, loans & EMI clarity
                  </p>
                </div>
              </div>

              {/* Insight Pill */}
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-[#14532D] flex items-center gap-2">
                <span className="font-bold text-base text-[#166534]">₹</span>
                <span>Financial clarity is a major gap area that GramNiti AI helps to bridge effectively.</span>
              </div>
            </div>

            {/* Card 6: Revenue & Sustainability Potential */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="bg-[#14532D] text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                  6. Revenue & Sustainability Potential
                </div>
                <div className="text-center font-bold text-xs text-slate-700">Sustainable Growth Model</div>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center space-y-1">
                    <span className="text-lg block">🤝</span>
                    <div className="font-bold text-[11px] text-slate-900 leading-tight">Institutional Partnerships</div>
                    <div className="text-[9px] text-slate-500">Govt. & Financial Institutions</div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center space-y-1">
                    <span className="text-lg block">🔌</span>
                    <div className="font-bold text-[11px] text-slate-900 leading-tight">API Access & Integrations</div>
                    <div className="text-[9px] text-slate-500">Ecosystem Enablement</div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center space-y-1">
                    <span className="text-lg block">📊</span>
                    <div className="font-bold text-[11px] text-slate-900 leading-tight">Analytics & Insights</div>
                    <div className="text-[9px] text-slate-500">Data-driven Support</div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center space-y-1">
                    <span className="text-lg block">🎓</span>
                    <div className="font-bold text-[11px] text-slate-900 leading-tight">Training & Capacity</div>
                    <div className="text-[9px] text-slate-500">Rural Development</div>
                  </div>
                </div>
              </div>

              {/* Insight Pill */}
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-[#14532D] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#166534] shrink-0" />
                <span>Multiple revenue streams ensure sustainability while creating long-term rural impact.</span>
              </div>
            </div>

          </div>

          {/* 4. Bottom Pathway Ribbon */}
          <div className="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#0A230C] text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-800 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="text-[10px] font-extrabold text-[#EAB308] uppercase tracking-wider font-mono">
                GRAMNITI AI – THE DECISION LAYER FOR RURAL ENTERPRISES
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span>🔍 Discover</span>
                  <span className="text-white/60 font-normal">(Find Right Business & Schemes)</span>
                </div>
                <span className="text-[#EAB308]">➔</span>
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span>🛡 Verify</span>
                  <span className="text-white/60 font-normal">(Ensure Authenticity)</span>
                </div>
                <span className="text-[#EAB308]">➔</span>
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span>📊 Simulate</span>
                  <span className="text-white/60 font-normal">(Test Before You Invest)</span>
                </div>
                <span className="text-[#EAB308]">➔</span>
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span>🌾 Act</span>
                  <span className="text-white/60 font-normal">(Action Plan & DPR)</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-bold text-emerald-200">
                Empowering Rural India to Decide with Confidence and Grow with Clarity.
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
