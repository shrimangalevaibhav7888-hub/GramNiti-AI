import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ShieldCheck, CheckCircle2, Landmark, Globe, Lock, ArrowRight } from 'lucide-react';

/**
 * GovernmentTrustBanner
 * Displays authoritative institutional trust indicators, data security badges,
 * and prominent action trigger to start the Primary GramNiti Journey.
 * Fully supports all 13 Indian languages.
 */
export const GovernmentTrustBanner = ({ setActiveTab }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#0A230C] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-emerald-800 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Heading & Value Proposition */}
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-white/20 text-xs text-[#EAB308] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#EAB308]" />
            <span>Digital India • Ministry of Social Justice & Empowerment</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight">
            {t('trust_banner_title')}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {t('trust_banner_desc')}
          </p>
        </div>

        {/* Right: Primary CTA Button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab && setActiveTab('advisor')}
            className="px-6 py-4 bg-[#EAB308] hover:bg-[#F59E0B] text-slate-950 rounded-2xl font-heading font-extrabold text-sm sm:text-base transition-all shadow-md hover:shadow-xl flex items-center gap-2.5 cursor-pointer active:scale-98"
          >
            <span>{t('btn_start_journey')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Trust Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15">
        <div className="flex items-center gap-2.5 text-xs text-emerald-100">
          <div className="p-2 rounded-xl bg-white/10 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#EAB308]" />
          </div>
          <div>
            <div className="font-bold text-white">{t('badge_deterministic')}</div>
            <div className="text-[11px] text-emerald-200/80">{t('badge_zero_hallucination')}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-emerald-100">
          <div className="p-2 rounded-xl bg-white/10 shrink-0">
            <Landmark className="w-4 h-4 text-[#EAB308]" />
          </div>
          <div>
            <div className="font-bold text-white">{t('badge_gazette_verified')}</div>
            <div className="text-[11px] text-emerald-200/80">{t('badge_official_central_state')}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-emerald-100">
          <div className="p-2 rounded-xl bg-white/10 shrink-0">
            <Globe className="w-4 h-4 text-[#EAB308]" />
          </div>
          <div>
            <div className="font-bold text-white">{t('badge_13_languages')}</div>
            <div className="text-[11px] text-emerald-200/80">{t('badge_regional_multi_script')}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-emerald-100">
          <div className="p-2 rounded-xl bg-white/10 shrink-0">
            <Lock className="w-4 h-4 text-[#EAB308]" />
          </div>
          <div>
            <div className="font-bold text-white">{t('badge_privacy_first')}</div>
            <div className="text-[11px] text-emerald-200/80">{t('badge_data_minimization')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
