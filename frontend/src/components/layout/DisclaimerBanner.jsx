import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export const DisclaimerBanner = ({ type = 'general', customText }) => {
  const { t } = useLanguage();

  const getMessage = () => {
    if (customText) return customText;
    switch (type) {
      case 'eligibility':
        return t('disclaimer_eligibility');
      case 'simulation':
        return t('disclaimer_simulation');
      case 'ocr':
        return t('disclaimer_ocr');
      default:
        return t('disclaimer_general');
    }
  };

  return (
    <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3 sm:p-4 text-xs text-amber-950 flex items-start gap-2.5 shadow-sm">
      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
      <div className="leading-relaxed">
        <span className="font-semibold text-amber-900 mr-1">Official Guidance Notice:</span>
        {getMessage()}
      </div>
    </div>
  );
};
