import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGramNiti } from '../contexts/GramNitiContext';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { SchemeDocumentsModal } from '../components/schemes/SchemeDocumentsModal';
import { 
  Landmark, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Clock, 
  FileText,
  Building2,
  Filter,
  Layers,
  Sparkles,
  Copy,
  Check,
  Globe,
  Scale,
  MapPin,
  ChevronDown,
  Info
} from 'lucide-react';
import { formatCurrency, formatLakhs } from '../utils/formatters';

export const SchemesPage = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const { schemes, selectedScheme, selectScheme, selectedBusiness, currentLocation } = useGramNiti();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('ALL'); // 'ALL', 'CENTRAL', 'STATE', 'CENTRALLY_SPONSORED'
  const [selectedState, setSelectedState] = useState('ALL'); // 'ALL', 'Maharashtra', 'Uttar Pradesh', 'Gujarat', 'Karnataka', 'Tamil Nadu'
  const [showComparisonMatrix, setShowComparisonMatrix] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [viewingDocScheme, setViewingDocScheme] = useState(null);
  const [modalInitialTab, setModalInitialTab] = useState('easy');

  const handleOpenEasyInfo = (scheme) => {
    setModalInitialTab('easy');
    setViewingDocScheme(scheme);
  };

  const handleOpenDocuments = (scheme) => {
    setModalInitialTab('documents');
    setViewingDocScheme(scheme);
  };

  const handleCopyUrl = (url, schemeCode) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedUrl(schemeCode);
      setTimeout(() => setCopiedUrl(null), 2500);
    }
  };

  // Extract unique states available
  const availableStates = Array.from(new Set(
    schemes
      .map(s => s.state_name)
      .filter(st => st && !st.includes('Pan-India') && !st.includes('Shared'))
  ));

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = 
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (scheme.state_name && scheme.state_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTier = 
      selectedTier === 'ALL' ||
      (selectedTier === 'CENTRAL' && (scheme.scheme_tier === 'CENTRAL' || (!scheme.scheme_tier && scheme.category?.includes('Central')))) ||
      (selectedTier === 'STATE' && scheme.scheme_tier === 'STATE') ||
      (selectedTier === 'CENTRALLY_SPONSORED' && scheme.scheme_tier === 'CENTRALLY_SPONSORED');

    const matchesState = 
      selectedState === 'ALL' ||
      scheme.state_applicability?.includes('ALL') ||
      scheme.state_name === selectedState ||
      (scheme.state_applicability && scheme.state_applicability.includes(selectedState));

    return matchesSearch && matchesTier && matchesState;
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#DCFCE7] text-[#14532D] rounded-2xl">
              <Landmark className="w-5 h-5 text-[#166534]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                  {t('card_schemes_title')}
                </h1>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full font-mono">
                  CENTRAL vs STATE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Verified Central and State Government credit-linked schemes with official working links & stacking rules.
              </p>
            </div>
          </div>
        </div>

        {/* Right Action: Matrix Toggle & Selected Business Pill */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowComparisonMatrix(!showComparisonMatrix)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
              showComparisonMatrix
                ? 'bg-blue-700 text-white'
                : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            <Scale className="w-4 h-4 text-[#EAB308]" />
            <span>{showComparisonMatrix ? "View Card Grid" : t('btn_toggle_matrix')}</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs">
            <span className="text-slate-500 text-[11px] font-medium">Active Business:</span>
            <span className="font-bold text-[#14532D]">
              {selectedBusiness?.name || 'Dairy Farming'}
            </span>
          </div>
        </div>
      </div>

      {/* Central vs State Comparison Matrix Mode */}
      {showComparisonMatrix && (
        <div className="bg-white rounded-3xl p-6 border border-blue-200 shadow-md space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-700" />
              <div>
                <h3 className="text-sm font-heading font-extrabold text-slate-900">
                  {t('comparison_matrix_title')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('comparison_matrix_subtitle')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowComparisonMatrix(false)}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              Close Matrix
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Scheme & Level</th>
                  <th className="p-3">Govt Tier</th>
                  <th className="p-3">Funding Pattern</th>
                  <th className="p-3">Subsidy / Interest Benefit</th>
                  <th className="p-3">Top-Up Stacking</th>
                  <th className="p-3 text-right">Official Working Portal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemes.map(s => {
                  const isCentral = s.scheme_tier === 'CENTRAL' || (!s.scheme_tier && s.category?.includes('Central'));
                  const isCentrallySponsored = s.scheme_tier === 'CENTRALLY_SPONSORED';
                  return (
                    <tr key={s.scheme_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-500">{s.ministry}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isCentral 
                            ? 'bg-blue-100 text-blue-800' 
                            : isCentrallySponsored 
                            ? 'bg-amber-100 text-amber-900' 
                            : 'bg-purple-100 text-purple-900'
                        }`}>
                          {isCentral ? '🏛️ Central' : isCentrallySponsored ? '🤝 Central + State' : `🏢 ${s.state_name || 'State'}`}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-700">
                        {s.funding_pattern || (isCentral ? '100% Central Ministry' : 'State Budget')}
                      </td>
                      <td className="p-3 text-slate-800">
                        <div className="font-semibold text-emerald-700">
                          {s.subsidy_percentage_special_rural > 0 
                            ? `${s.subsidy_percentage_general_rural}% - ${s.subsidy_percentage_special_rural}% Subsidy` 
                            : s.interest_subvention || 'Credit Guarantee'
                          }
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-xs">{s.subsidy_description}</div>
                      </td>
                      <td className="p-3">
                        {s.stacking_eligible !== false ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {t('stacking_eligible_badge')}
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                            {t('stacking_restricted_badge')}
                          </span>
                        )}
                        {s.stacking_notes && (
                          <div className="text-[10px] text-slate-500 mt-0.5 max-w-xs">{s.stacking_notes}</div>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEasyInfo(s)}
                            className="inline-flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-[#14532D] border border-emerald-300 font-bold px-2 py-1.5 rounded-lg text-xs transition-colors shadow-2xs cursor-pointer"
                            title="View scheme explanation in easy language"
                          >
                            <Sparkles className="w-3 h-3 text-[#EAB308]" />
                            <span>Easy Info</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDocuments(s)}
                            className="inline-flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold px-2 py-1.5 rounded-lg text-xs transition-colors shadow-2xs cursor-pointer"
                            title="View documents required for scheme approval"
                          >
                            <FileText className="w-3 h-3 text-amber-800" />
                            <span>Documents</span>
                          </button>

                          <a
                            href={s.official_portal_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors shadow-2xs"
                          >
                            <span>Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="space-y-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        {/* Tier Tabs: All, Central, State, Centrally Sponsored */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTier('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTier === 'ALL'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('all_schemes_tab')} ({schemes.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier('CENTRAL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedTier === 'CENTRAL'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <span>🏛️ {t('central_schemes_tab')}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20">
                {schemes.filter(s => s.scheme_tier === 'CENTRAL' || (!s.scheme_tier && s.category?.includes('Central'))).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier('STATE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedTier === 'STATE'
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <span>🏢 {t('state_schemes_tab')}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20">
                {schemes.filter(s => s.scheme_tier === 'STATE').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier('CENTRALLY_SPONSORED')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedTier === 'CENTRALLY_SPONSORED'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span>🤝 {t('centrally_sponsored_tab')}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20">
                {schemes.filter(s => s.scheme_tier === 'CENTRALLY_SPONSORED').length}
              </span>
            </button>
          </div>

          {/* State Specific Filter Dropdown */}
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All States (Pan-India)</option>
              {availableStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scheme name, ministry, state (e.g. PMEGP, Mudra, Annasaheb Patil, UP, Gujarat)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map((scheme) => {
          const isSelected = selectedScheme?.code === scheme.code;
          const isCentral = scheme.scheme_tier === 'CENTRAL' || (!scheme.scheme_tier && scheme.category?.includes('Central'));
          const isCentrallySponsored = scheme.scheme_tier === 'CENTRALLY_SPONSORED';
          const isState = scheme.scheme_tier === 'STATE';

          return (
            <div
              key={scheme.scheme_id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[#16A34A] ring-2 ring-[#16A34A]/20 shadow-md bg-gradient-to-b from-emerald-50/30 to-white'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                {/* Badges Ribbon */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Tier Badge */}
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                      isCentral
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : isCentrallySponsored
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-purple-100 text-purple-900 border border-purple-200'
                    }`}>
                      {isCentral ? '🏛️ Central Govt' : isCentrallySponsored ? '🤝 Central + State' : `🏢 State Govt (${scheme.state_name})`}
                    </span>

                    {/* Funding Pattern Badge */}
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg text-[10px] font-semibold border border-slate-200">
                      {scheme.funding_pattern || (isCentral ? '100% Central MSME' : 'State Budget')}
                    </span>
                  </div>

                  {/* Verification & Code Badge */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {scheme.code}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Scheme Title & Ministry */}
                <div className="mt-3.5">
                  <h3 className="text-base font-heading font-extrabold text-slate-900 leading-snug">
                    {scheme.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{scheme.ministry}</span>
                  </div>
                </div>

                {/* Financial Highlights */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-medium">Loan Limit</span>
                    <div className="font-bold text-slate-900 font-mono mt-0.5">
                      {formatCurrency(scheme.min_loan_amount)} – {formatLakhs(scheme.max_loan_amount)}
                    </div>
                  </div>

                  <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-emerald-800 font-medium">Subsidy / Benefit</span>
                    <div className="font-bold text-emerald-800 font-mono mt-0.5">
                      {scheme.subsidy_percentage_special_rural > 0 
                        ? `${scheme.subsidy_percentage_general_rural}% - ${scheme.subsidy_percentage_special_rural}% Subsidy` 
                        : (scheme.interest_subvention || 'Credit Guarantee')}
                    </div>
                  </div>
                </div>

                {/* Subsidy description */}
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {scheme.subsidy_description}
                </p>

                {/* Top-up Stacking Note */}
                {scheme.stacking_notes && (
                  <div className="mt-2.5 p-2 bg-blue-50/70 border border-blue-200/80 rounded-xl text-[11px] text-blue-900 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Stacking Rule:</strong> {scheme.stacking_notes}</span>
                  </div>
                )}
              </div>

              {/* Working Official Link & Selection Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                {/* Official Verified Working Portal Link */}
                <div className="bg-slate-50 rounded-xl p-2 flex items-center justify-between gap-2 border border-slate-200">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[11px] font-mono text-slate-700 truncate">
                      {scheme.official_portal_url}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(scheme.official_portal_url, scheme.code)}
                      className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-200 transition-colors"
                      title="Copy official portal URL"
                    >
                      {copiedUrl === scheme.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <a
                      href={scheme.official_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-[#14532D] hover:bg-[#0A230C] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow-2xs"
                      title="Open verified official portal in new tab"
                    >
                      <span>{t('visit_official_portal')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Easy Info & Documents Quick Action Strip */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEasyInfo(scheme)}
                    className="py-2 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#14532D] border border-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    title="View scheme in easy language"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
                    <span>🌟 Easy Info</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDocuments(scheme)}
                    className="py-2 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    title="View required documents checklist"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>📄 Documents</span>
                  </button>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      selectScheme(scheme);
                      setActiveTab('eligibility');
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#166534] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#EAB308]" />
                        <span>Active Scheme (Selected)</span>
                      </>
                    ) : (
                      <span>Select Scheme & Check Eligibility</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      selectScheme(scheme);
                      setActiveTab('finance');
                    }}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-[#14532D] rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-1 cursor-pointer"
                    title="Simulate financials with this scheme"
                  >
                    <span>Simulate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <DisclaimerBanner />

      {/* Scheme Specific Document Requirements & Approval Roadmap Modal */}
      <SchemeDocumentsModal
        scheme={viewingDocScheme}
        isOpen={!!viewingDocScheme}
        defaultTab={modalInitialTab}
        onClose={() => setViewingDocScheme(null)}
        onSelectSchemeForJourney={(s) => {
          selectScheme(s);
          setActiveTab('eligibility');
        }}
      />
    </div>
  );
};
