import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGramNiti } from '../contexts/GramNitiContext';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { 
  User, 
  MapPin, 
  Wallet, 
  Briefcase, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap,
  Layers,
  Globe,
  Settings
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const ProfilePage = ({ setActiveTab }) => {
  const { 
    t, 
    preferredLanguages, 
    primaryLanguage, 
    supportedLanguages, 
    setShowOnboardingModal,
    language,
    setLanguage
  } = useLanguage();

  const { 
    userProfile, 
    setUserProfile, 
    locations, 
    currentLocation, 
    setLocation, 
    loadDemoFarmerProfile,
    recalculatePipeline 
  } = useGramNiti();

  const [formData, setFormData] = useState(userProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    if (formData.location_id !== currentLocation?.location_id) {
      setLocation(formData.location_id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#DCFCE7] text-[#14532D] rounded-xl">
              <User className="w-5 h-5 text-[#166534]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
              {t('nav_profile')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Configure your demographic, financial capacity, language preferences, and village location parameters.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            loadDemoFarmerProfile();
            setFormData(userProfile);
          }}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-[#D97706]" />
          Load Demo Farmer Preset
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Profile updated successfully! Downstream business recommendations, eligibility, and DPR have been recalculated.
        </div>
      )}

      {/* Language Preferences Card (1 to 3 Preferred Languages) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
              <Globe className="w-5 h-5 text-[#16A34A]" />
            </div>
            <div>
              <h3 className="text-sm font-heading font-bold text-slate-900">
                {t('preferred_languages_label')} (1 to 3 Languages)
              </h3>
              <p className="text-xs text-slate-500">
                The first language is your primary language. You can quickly switch between your chosen languages across the entire app.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowOnboardingModal(true)}
            className="px-3.5 py-2 bg-[#166534] hover:bg-[#14532D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t('onboarding_change_languages')}</span>
          </button>
        </div>

        {/* Display selected languages chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {preferredLanguages.map((code, idx) => {
            const langMeta = supportedLanguages.find(l => l.code === code);
            const isCurrent = language === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2 text-xs ${
                  isCurrent
                    ? 'bg-[#DCFCE7] border-[#16A34A] ring-2 ring-[#16A34A]/20 font-bold text-[#14532D]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  idx === 0 ? 'bg-[#EAB308] text-slate-900' : 'bg-slate-200 text-slate-700'
                }`}>
                  {idx === 0 ? 'Primary' : `#${idx + 1}`}
                </span>
                <span className="font-semibold">{langMeta?.nativeName || code}</span>
                <span className="text-slate-500 text-[11px]">({langMeta?.name})</span>
                {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Details Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">{t('label_name')}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">{t('label_age')}</label>
            <input
              type="number"
              min={18}
              max={75}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">{t('label_gender')}</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female (Special Subsidy Quota)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Social Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">{t('label_category')}</label>
            <select
              value={formData.social_category}
              onChange={(e) => setFormData({ ...formData, social_category: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="General">General (25% Rural Subsidy)</option>
              <option value="OBC">OBC (35% Rural Subsidy)</option>
              <option value="SC">SC (35% Rural Subsidy / Stand-Up India)</option>
              <option value="ST">ST (35% Rural Subsidy / Stand-Up India)</option>
              <option value="Minority">Minority (35% Rural Subsidy)</option>
            </select>
          </div>

          {/* Occupation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">{t('label_occupation')}</label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Location / Village */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">{t('label_village')}</label>
            <select
              value={formData.location_id}
              onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
            >
              {locations.map(loc => (
                <option key={loc.location_id} value={loc.location_id}>
                  {loc.village_name}, {loc.block_taluka}, {loc.district} ({loc.state})
                </option>
              ))}
            </select>
          </div>

          {/* Available Capital */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">{t('label_capital')}</label>
            <input
              type="number"
              step={5000}
              value={formData.available_capital}
              onChange={(e) => setFormData({ ...formData, available_capital: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          {/* Desired Loan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">{t('label_desired_loan')}</label>
            <input
              type="number"
              step={10000}
              value={formData.desired_loan_amount}
              onChange={(e) => setFormData({ ...formData, desired_loan_amount: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#166534] hover:bg-[#14532D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t('btn_save')}</span>
          </button>
        </div>
      </form>

      <DisclaimerBanner />
    </div>
  );
};
