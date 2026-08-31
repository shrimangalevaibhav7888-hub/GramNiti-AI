import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Compass, TrendingUp, ShieldCheck, Calculator, Bot } from 'lucide-react';

export const MobileNav = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'home', label: t('nav_home'), icon: Compass },
    { id: 'advisor', label: t('nav_discover'), icon: TrendingUp },
    { id: 'verify', label: t('nav_verify'), icon: ShieldCheck, alert: true },
    { id: 'finance', label: t('nav_plan'), icon: Calculator },
    { id: 'chat', label: t('nav_chat'), icon: Bot },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-2 px-3">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || 
            (tab.id === 'finance' && (activeTab === 'finance' || activeTab === 'simulation')) ||
            (tab.id === 'advisor' && activeTab === 'advisor');
          
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-[#14532D] font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#166534] stroke-[2.5]' : 'text-slate-400'}`} />
                {tab.alert && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#DC2626] rounded-full animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
