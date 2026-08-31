import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  TRANSLATIONS, 
  SUPPORTED_LANGUAGES, 
  getLanguageMeta, 
  getTranslation, 
  detectScriptAndLanguage, 
  getLocalizedEntity 
} from '../utils/translations';
import { speakText, stopSpeaking, startListening } from '../utils/speech';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // 1. Initialize Preferred Languages (1 to 3 languages)
  const [preferredLanguages, setPreferredLanguagesState] = useState(() => {
    try {
      const saved = localStorage.getItem('gramniti_preferred_languages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 1 && parsed.length <= 3) {
          return parsed;
        }
      }
      const singleLang = localStorage.getItem('gramniti_lang');
      if (singleLang && TRANSLATIONS[singleLang]) {
        return [singleLang];
      }
    } catch (e) {
      console.warn("Error reading preferred languages from localStorage", e);
    }
    return ['en']; // Fallback to English
  });

  // 2. Active Language
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('gramniti_lang');
    if (saved && TRANSLATIONS[saved]) {
      return saved;
    }
    return preferredLanguages[0] || 'en';
  });

  // 3. Onboarding Modal State
  const [showOnboardingModal, setShowOnboardingModal] = useState(() => {
    const hasOnboarded = localStorage.getItem('gramniti_lang_onboarded');
    return !hasOnboarded;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const primaryLanguage = preferredLanguages[0] || 'en';
  const currentLanguageMeta = getLanguageMeta(language);
  const direction = currentLanguageMeta?.direction || 'ltr';

  // Apply Direction & HTML Lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = direction;
      document.documentElement.lang = language;
    }
  }, [direction, language]);

  // Sync Preferred Languages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gramniti_preferred_languages', JSON.stringify(preferredLanguages));
    } catch (e) {
      console.warn("Could not persist preferred languages", e);
    }
  }, [preferredLanguages]);

  // Sync Active Language to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gramniti_lang', language);
    } catch (e) {
      console.warn("Could not persist active language", e);
    }
  }, [language]);

  /**
   * Set Preferred Languages with 1-to-3 limit validation
   * @param {string[]} languages - array of 1 to 3 language codes
   */
  const setPreferredLanguages = useCallback((languages) => {
    if (!Array.isArray(languages) || languages.length === 0) {
      languages = ['en'];
    }
    // Limit to max 3
    const validated = languages.slice(0, 3);
    setPreferredLanguagesState(validated);
    localStorage.setItem('gramniti_preferred_languages', JSON.stringify(validated));
    localStorage.setItem('gramniti_lang_onboarded', 'true');

    // If active language is not in new preferred list, switch to primary
    if (!validated.includes(language)) {
      setLanguageState(validated[0]);
    }
  }, [language]);

  /**
   * Set Active Language
   * @param {string} lang - language code
   */
  const setLanguage = useCallback((lang) => {
    if (TRANSLATIONS[lang]) {
      setLanguageState(lang);
      localStorage.setItem('gramniti_lang', lang);
      localStorage.setItem('gramniti_lang_onboarded', 'true');
    }
  }, []);

  /**
   * Translation lookup with interpolation and English fallback
   */
  const t = useCallback((key, params = {}) => {
    let text = getTranslation(key, language);
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramVal));
      });
    }
    return text;
  }, [language]);

  /**
   * Auto Language Detection helper
   */
  const detectLanguage = useCallback((text) => {
    return detectScriptAndLanguage(text);
  }, []);

  /**
   * Text-to-Speech
   */
  const speak = useCallback((text, targetLang = language) => {
    setIsSpeaking(true);
    speakText(text, targetLang, () => {
      setIsSpeaking(false);
    });
  }, [language]);

  const stopAudio = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);
  }, []);

  /**
   * Speech Recognition (STT)
   */
  const listen = useCallback((onResultCallback, options = {}) => {
    setIsListening(true);
    const targetLang = options.language || language;
    startListening({
      language: targetLang,
      onResult: (transcript) => {
        setIsListening(false);
        if (onResultCallback) onResultCallback(transcript);
      },
      onError: (err) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        preferredLanguages,
        setPreferredLanguages,
        primaryLanguage,
        currentLanguageMeta,
        direction,
        supportedLanguages: SUPPORTED_LANGUAGES,
        showOnboardingModal,
        setShowOnboardingModal,
        t,
        getLocalized: (obj, field) => getLocalizedEntity(obj, field, language),
        detectLanguage,
        speak,
        stopAudio,
        listen,
        isSpeaking,
        isListening
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
