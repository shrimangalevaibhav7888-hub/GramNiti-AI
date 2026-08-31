import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ShieldCheck, Landmark, CheckCircle, ExternalLink, Globe } from 'lucide-react';
import { GramNitiLogo } from '../common/GramNitiLogo';

export const Footer = ({ setActiveTab }) => {
  const { t, setShowOnboardingModal, language, preferredLanguages, supportedLanguages } = useLanguage();

  const handleNav = (tab) => {
    if (setActiveTab) {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const authoritativeSources = [
    { name: "MoMSME / KVIC (PMEGP Portal)", url: "https://www.kviconline.gov.in/" },
    { name: "MoFPI (PMFME Scheme Portal)", url: "https://pmfme.mofpi.gov.in/" },
    { name: "Ministry of Finance (Mudra Portal)", url: "https://www.mudra.org.in/" },
    { name: "DAHD (Animal Husbandry AHIDF)", url: "https://ahidf.udyamimitra.in/" },
    { name: "Ministry of Agriculture (AIF Portal)", url: "https://agriinfra.dac.gov.in/" }
  ];

  const coreCapabilities = [
    { label: t('card_advisor_title') || 'Business Feasibility Advisor', tab: 'advisor' },
    { label: t('card_verify_title') || 'Scheme Verification & Fraud Check', tab: 'verify' },
    { label: t('nav_eligibility') || 'Deterministic Eligibility Engine', tab: 'eligibility' },
    { label: t('card_simulation_title') || '3-Scenario Cash Flow Simulator', tab: 'simulation' },
    { label: t('card_action_plan_title') || 'AI-Assisted Bank DPR Generator', tab: 'action-plan' }
  ];

  return (
    <footer className="bg-[#0A230C] text-gray-300 text-xs mt-16 border-t border-emerald-950 pb-20 lg:pb-8 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="bg-white p-2 rounded-2xl inline-block shadow-sm">
              <GramNitiLogo size="sm" showTagline={false} />
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#EAB308]">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('status_verified')}</span>
            </div>
          </div>

          {/* Col 2: Verified Source Registry */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">Authoritative Sources</h4>
            <ul className="space-y-1.5 text-gray-400">
              {authoritativeSources.map((src, i) => (
                <li key={i}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1 hover:underline"
                  >
                    <span>• {src.name}</span>
                    <ExternalLink className="w-3 h-3 text-emerald-400 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Core Features */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">Integrated Capabilities</h4>
            <ul className="space-y-1.5 text-gray-400">
              {coreCapabilities.map((cap, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => handleNav(cap.tab)}
                    className="hover:text-emerald-300 transition-colors text-left cursor-pointer hover:underline inline-flex items-center gap-1"
                  >
                    <span>• {cap.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Trust & Disclaimer */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">Trust & Safety Notice</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-900">
              GramNiti AI is an AI-assisted decision-support platform designed for planning and scheme application preparation. It does NOT guarantee loan approval or bank sanction. All mathematical calculations and eligibility rules are derived from verified official gazettes.
            </p>
            <button
              type="button"
              onClick={() => setShowOnboardingModal(true)}
              className="mt-2 text-xs text-emerald-300 hover:text-white flex items-center gap-1.5 font-medium underline decoration-dotted cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t('onboarding_change_languages')} (13 Languages)</span>
            </button>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-emerald-950 pt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500">
          <div>
            © 2026 GramNiti AI. Multilingual Rural Micro-Enterprise & Scheme Decision System.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Deterministic Financial & Eligibility Engine
            </span>
            <span className="text-gray-600">|</span>
            <span className="text-[#EAB308] font-mono">13 Indian Languages Supported</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
