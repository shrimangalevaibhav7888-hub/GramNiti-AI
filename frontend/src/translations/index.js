/**
 * GramNiti AI - Master Multilingual Translation Registry & Utilities
 * Comprehensive support for 13 Indian Languages
 */

import { en } from './en';
import { hi } from './hi';
import { mr } from './mr';
import { bn } from './bn';
import { gu } from './gu';
import { pa } from './pa';
import { ta } from './ta';
import { te } from './te';
import { kn } from './kn';
import { ml } from './ml';
import { or } from './or';
import { as } from './as';
import { ur } from './ur';

export const TRANSLATIONS = {
  en,
  hi,
  mr,
  bn,
  gu,
  pa,
  ta,
  te,
  kn,
  ml,
  or,
  as,
  ur
};

export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    direction: 'ltr',
    speechCode: 'en-IN',
    region: 'Pan-India / Official',
    badge: 'EN'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    direction: 'ltr',
    speechCode: 'hi-IN',
    region: 'North & Central India',
    badge: 'HI'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    direction: 'ltr',
    speechCode: 'mr-IN',
    region: 'Maharashtra & Goa',
    badge: 'MR'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    direction: 'ltr',
    speechCode: 'bn-IN',
    region: 'West Bengal & Tripura',
    badge: 'BN'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    direction: 'ltr',
    speechCode: 'gu-IN',
    region: 'Gujarat',
    badge: 'GU'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    direction: 'ltr',
    speechCode: 'pa-IN',
    region: 'Punjab & North India',
    badge: 'PA'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    direction: 'ltr',
    speechCode: 'ta-IN',
    region: 'Tamil Nadu & Puducherry',
    badge: 'TA'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    direction: 'ltr',
    speechCode: 'te-IN',
    region: 'Andhra Pradesh & Telangana',
    badge: 'TE'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    direction: 'ltr',
    speechCode: 'kn-IN',
    region: 'Karnataka',
    badge: 'KN'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    direction: 'ltr',
    speechCode: 'ml-IN',
    region: 'Kerala & Lakshadweep',
    badge: 'ML'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    direction: 'ltr',
    speechCode: 'or-IN',
    region: 'Odisha',
    badge: 'OR'
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Assamese-Bengali',
    direction: 'ltr',
    speechCode: 'as-IN',
    region: 'Assam & North-East',
    badge: 'AS'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Perso-Arabic',
    direction: 'rtl',
    speechCode: 'ur-IN',
    region: 'Pan-India',
    badge: 'UR'
  }
];

/**
 * Get language metadata by code
 */
export const getLanguageMeta = (code) => {
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
};

/**
 * Safe translation lookup with English fallback
 */
export const getTranslation = (key, lang = 'en') => {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  if (dict && dict[key] !== undefined) {
    return dict[key];
  }
  if (TRANSLATIONS.en && TRANSLATIONS.en[key] !== undefined) {
    return TRANSLATIONS.en[key];
  }
  return key;
};

/**
 * Auto-detect language and script from input text
 */
export const detectScriptAndLanguage = (text) => {
  if (!text || typeof text !== 'string') return 'en';
  
  // Perso-Arabic / Urdu script
  if (/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)) {
    return 'ur';
  }
  // Gurmukhi / Punjabi script
  if (/[\u0A00-\u0A7F]/.test(text)) {
    return 'pa';
  }
  // Gujarati script
  if (/[\u0A80-\u0AFF]/.test(text)) {
    return 'gu';
  }
  // Odia script
  if (/[\u0B00-\u0B7F]/.test(text)) {
    return 'or';
  }
  // Tamil script
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return 'ta';
  }
  // Telugu script
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return 'te';
  }
  // Kannada script
  if (/[\u0C80-\u0CFF]/.test(text)) {
    return 'kn';
  }
  // Malayalam script
  if (/[\u0D00-\u0D7F]/.test(text)) {
    return 'ml';
  }
  // Bengali / Assamese script
  if (/[\u0980-\u09FF]/.test(text)) {
    // Assamese specific characters / words check
    if (/[ৰৱ]/.test(text) || text.includes('আছে') || text.includes('কৰক') || text.includes('নমস্কাৰ')) {
      return 'as';
    }
    return 'bn';
  }
  // Devanagari script (Hindi vs Marathi)
  if (/[\u0900-\u097F]/.test(text)) {
    const marathiMarkers = ['आहे', 'नाही', 'कसा', 'कशी', 'करावे', 'योजना', 'व्यवसाय', 'माहिती', 'पाहिजे', 'मिळेल', 'झाले', 'करावा'];
    const hasMarathi = marathiMarkers.some(m => text.includes(m));
    if (hasMarathi) return 'mr';
    return 'hi';
  }

  return 'en';
};

/**
 * Helper to safely extract localized fields from data objects
 * e.g. getLocalizedEntity(business, 'name', 'hi')
 */
export const getLocalizedEntity = (obj, field = 'name', lang = 'en') => {
  if (!obj) return '';
  if (lang !== 'en') {
    const localizedKey = `${field}_${lang}`;
    if (obj[localizedKey]) return obj[localizedKey];
  }
  return obj[field] || '';
};
