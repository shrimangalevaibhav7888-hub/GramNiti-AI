import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  MapPin, 
  TrendingUp, 
  Calculator, 
  Landmark, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

/**
 * FeatureHighlights
 * Clean, minimal 4-card feature overview directly under the hero carousel.
 * Adheres strictly to minimal text rule and fully supports all 13 Indian languages.
 */
export const FeatureHighlights = ({ setActiveTab }) => {
  const { t } = useLanguage();

  const cards = [
    {
      id: 'insights',
      title: t('card_local_insights_title'),
      subtitle: t('card_local_insights_desc'),
      tab: 'advisor',
      icon: MapPin,
      iconBg: 'bg-emerald-100 text-emerald-800',
      badge: '5–10 km Radius'
    },
    {
      id: 'feasibility',
      title: t('card_biz_feasibility_title'),
      subtitle: t('card_biz_feasibility_desc'),
      tab: 'advisor',
      icon: TrendingUp,
      iconBg: 'bg-blue-100 text-blue-800',
      badge: 'Suitability 0–100'
    },
    {
      id: 'finance',
      title: t('card_fin_planning_title'),
      subtitle: t('card_fin_planning_desc'),
      tab: 'finance',
      icon: Calculator,
      iconBg: 'bg-amber-100 text-amber-800',
      badge: 'Deterministic Math'
    },
    {
      id: 'schemes',
      title: t('card_scheme_guidance_title'),
      subtitle: t('card_scheme_guidance_desc'),
      tab: 'schemes',
      icon: Landmark,
      iconBg: 'bg-purple-100 text-purple-800',
      badge: 'Official Gazette'
    }
  ];

  return (
    <section className="space-y-6 pt-4 pb-6">
      {/* Clean Minimal Title & Tagline */}
      <div className="text-center space-y-1.5 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#14532D]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>{t('landing_gov_badge')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
          {t('app_name')} AI
        </h2>
        <p className="text-sm sm:text-base font-semibold text-slate-600">
          {t('landing_hero_tagline')}
        </p>
      </div>

      {/* 4 Small Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => setActiveTab && setActiveTab(card.tab)}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${card.iconBg} transition-transform group-hover:scale-105`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {card.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-[#14532D] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-[#166534] group-hover:text-[#14532D] pt-1">
                <span>{t('btn_explore')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
