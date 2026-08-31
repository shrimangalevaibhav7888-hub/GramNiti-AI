import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGramNiti } from '../../contexts/GramNitiContext';
import { GramNitiEmblem } from '../common/GramNitiLogo';
import { 
  Globe, 
  Check, 
  Sparkles, 
  ArrowRight, 
  X, 
  Search, 
  AlertCircle, 
  ShieldCheck,
  CheckCircle2,
  Volume2
} from 'lucide-react';

export const LanguageOnboardingModal = () => {
  const { 
    supportedLanguages, 
    preferredLanguages, 
    setPreferredLanguages, 
    setLanguage, 
    showOnboardingModal, 
    setShowOnboardingModal, 
    t,
    speak
  } = useLanguage();
  
  const { userProfile, updateProfile } = useGramNiti();

  // Local selection state (ordered array of selected language codes)
  const [selectedCodes, setSelectedCodes] = useState(preferredLanguages || ['en']);
  const [searchQuery, setSearchQuery] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  // Sync with current preferredLanguages whenever modal opens
  useEffect(() => {
    if (showOnboardingModal) {
      setSelectedCodes(preferredLanguages.length > 0 ? preferredLanguages : ['en']);
      setWarningMessage('');
    }
  }, [showOnboardingModal, preferredLanguages]);

  if (!showOnboardingModal) return null;

  const handleToggleLanguage = (code) => {
    setWarningMessage('');
    if (selectedCodes.includes(code)) {
      // Deselecting: only allowed if there's more than 1 selected
      if (selectedCodes.length === 1) {
        setWarningMessage("At least 1 language must be selected.");
        return;
      }
      setSelectedCodes(selectedCodes.filter(c => c !== code));
    } else {
      // Selecting new language: check max 3
      if (selectedCodes.length >= 3) {
        setWarningMessage(t('onboarding_max_limit_reached'));
        return;
      }
      setSelectedCodes([...selectedCodes, code]);
    }
  };

  const handleConfirm = () => {
    if (selectedCodes.length === 0) {
      handleSkip();
      return;
    }
    const finalSelection = selectedCodes.slice(0, 3);
    const primary = finalSelection[0];
    
    // Update LanguageContext
    setPreferredLanguages(finalSelection);
    setLanguage(primary);
    
    // Update GramNiti Profile if updateProfile is available
    if (updateProfile && userProfile) {
      updateProfile({
        ...userProfile,
        preferred_languages: finalSelection,
        primary_language: primary,
        preferred_language: primary
      });
    }

    setShowOnboardingModal(false);
  };

  const handleSkip = () => {
    setPreferredLanguages(['en']);
    setLanguage('en');
    if (updateProfile && userProfile) {
      updateProfile({
        ...userProfile,
        preferred_languages: ['en'],
        primary_language: 'en',
        preferred_language: 'en'
      });
    }
    setShowOnboardingModal(false);
  };

  // Filter languages by search query
  const filteredLanguages = supportedLanguages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#15803D] text-white p-6 sm:p-7 relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center border border-white/20 shadow-md">
                <GramNitiEmblem className="w-full h-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-heading font-extrabold tracking-tight">
                    {t('onboarding_title')}
                  </h2>
                  <span className="text-[10px] bg-[#EAB308] text-slate-900 font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                    13 LANGUAGES
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 mt-1 max-w-lg leading-relaxed">
                  {t('onboarding_subtitle')}
                </p>
              </div>
            </div>

            {/* Dismiss button if already onboarded */}
            {localStorage.getItem('gramniti_lang_onboarded') && (
              <button
                type="button"
                onClick={() => setShowOnboardingModal(false)}
                className="text-white/70 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Selection Tracker & Instructions */}
          <div className="mt-4 pt-3 border-t border-emerald-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-950/80 px-2.5 py-1 rounded-lg font-semibold text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#EAB308]" />
                {t('onboarding_selected_count')}: <strong className="text-white">{selectedCodes.length} / 3</strong>
              </span>
              <span className="text-emerald-200/80 text-[11px] hidden sm:inline">
                {t('onboarding_min_max_hint')}
              </span>
            </div>

            {/* Active Selection Chips Preview */}
            <div className="flex items-center gap-1.5">
              {selectedCodes.map((code, idx) => {
                const lang = supportedLanguages.find(l => l.code === code);
                return (
                  <span 
                    key={code}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 ${
                      idx === 0 
                        ? 'bg-[#EAB308] text-slate-900 shadow-2xs' 
                        : 'bg-emerald-800 text-emerald-100 border border-emerald-600'
                    }`}
                  >
                    <span>{idx === 0 ? '★' : `#${idx + 1}`}</span>
                    <span>{lang?.nativeName || code}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Warning / Validation Notice */}
        {warningMessage && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-2 text-xs text-amber-900 animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* Search Filter */}
        <div className="p-4 sm:px-6 border-b border-slate-100 bg-slate-50/70 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('onboarding_search_placeholder')}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-500 hover:text-slate-700 font-medium px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Languages Selection Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[46vh] space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredLanguages.map((lang) => {
              const selectedIndex = selectedCodes.indexOf(lang.code);
              const isSelected = selectedIndex !== -1;
              const isPrimary = selectedIndex === 0;

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleToggleLanguage(lang.code)}
                  className={`p-3 rounded-2xl text-left border transition-all relative group flex flex-col justify-between ${
                    isSelected
                      ? isPrimary
                        ? 'bg-[#DCFCE7] border-[#16A34A] ring-2 ring-[#16A34A]/20 shadow-xs'
                        : 'bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {/* Native Script Name */}
                      <div className="text-base font-bold text-slate-900 leading-snug font-sans">
                        {lang.nativeName}
                      </div>
                      {/* English Name */}
                      <div className="text-xs font-semibold text-slate-600 mt-0.5">
                        {lang.name}
                      </div>
                    </div>

                    {/* Selection Indicator Badge */}
                    <div className="shrink-0">
                      {isSelected ? (
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                          isPrimary 
                            ? 'bg-[#16A34A] text-white shadow-2xs' 
                            : 'bg-emerald-600 text-white'
                        }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>{isPrimary ? t('onboarding_primary_badge') : `#${selectedIndex + 1}`}</span>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 group-hover:border-slate-400 flex items-center justify-center text-[10px] text-slate-400">
                          +
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Region / Script Detail */}
                  <div className="mt-2 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate">{lang.region}</span>
                    <span className="font-mono bg-slate-100 px-1 rounded text-slate-600 font-bold">
                      {lang.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSkip}
            className="w-full sm:w-auto text-xs text-slate-500 hover:text-slate-800 font-medium px-4 py-2 hover:bg-slate-200/60 rounded-xl transition-colors text-center"
          >
            {t('onboarding_btn_skip')}
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedCodes.length === 0}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                selectedCodes.length > 0
                  ? 'bg-[#166534] hover:bg-[#14532D] text-white active:scale-98 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{t('onboarding_btn_continue')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
