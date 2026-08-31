import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  Building2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Clock,
  Printer,
  ChevronRight,
  Landmark,
  Layers,
  Volume2,
  HelpCircle,
  Calculator,
  UserCheck,
  Briefcase
} from 'lucide-react';

export const SchemeDocumentsModal = ({ 
  scheme, 
  isOpen, 
  onClose, 
  onSelectSchemeForJourney,
  defaultTab = 'easy' // 'easy', 'documents', 'stages'
}) => {
  const { t, language, speak } = useLanguage();
  const [activeTab, setActiveTab] = useState(defaultTab); // 'easy', 'documents', 'stages'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedDocs, setCheckedDocs] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && scheme) {
      setActiveTab(defaultTab || 'easy');
      setLoading(true);
      const schemeId = scheme.scheme_id || scheme.code;
      
      // Robust call using either API method
      const fetchPromise = api.getSchemeDocumentRoadmap 
        ? api.getSchemeDocumentRoadmap(schemeId) 
        : api.getSchemeDocumentRequirements(schemeId);

      fetchPromise
        .then(data => {
          setRoadmapData(data);
          setCheckedDocs(['AADHAAR', 'PAN']);
        })
        .catch(err => {
          console.error("Failed to load scheme document roadmap:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, scheme, defaultTab]);

  if (!isOpen || !scheme) return null;

  const toggleDoc = (docCode, e) => {
    if (e) e.stopPropagation();
    if (checkedDocs.includes(docCode)) {
      setCheckedDocs(checkedDocs.filter(c => c !== docCode));
    } else {
      setCheckedDocs([...checkedDocs, docCode]);
    }
  };

  const allDocs = roadmapData?.documents || [];
  const filteredDocs = allDocs.filter(doc => {
    if (selectedCategory === 'ALL') return true;
    return doc.category === selectedCategory;
  });

  const totalDocs = allDocs.length;
  const readyDocsCount = checkedDocs.filter(code => allDocs.some(d => d.doc_code === code)).length;
  const readinessPct = totalDocs > 0 ? Math.round((readyDocsCount / totalDocs) * 100) : 0;

  const easy = roadmapData?.easy_explanation;

  const handleSpeakEasy = () => {
    if (!easy) return;
    const narration = language === 'mr' 
      ? easy.audio_narration_mr 
      : language === 'hi' 
      ? easy.audio_narration_hi 
      : easy.audio_narration_en;
    speak(narration);
  };

  const handleCopyList = () => {
    if (!roadmapData) return;
    const docLines = allDocs.map((d, i) => {
      const name = language === 'mr' ? d.name_mr : language === 'hi' ? d.name_hi : d.name;
      const issuing = language === 'mr' ? d.issuing_authority_mr : language === 'hi' ? d.issuing_authority_hi : d.issuing_authority;
      return `${i + 1}. [${d.doc_code}] ${name}\n   - Authority: ${issuing}\n   - Purpose: ${d.scheme_relevance}`;
    }).join('\n\n');

    const fullText = `📄 Official Required Documents for ${scheme.name} (${scheme.code})\nMinistry: ${scheme.ministry}\nPortal: ${scheme.official_portal_url}\nMax Subsidy: ${scheme.subsidy_percentage_special_rural || 35}%\n\nChecklist:\n${docLines}\n\nGenerated via GramNiti AI`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const categoryLabels = {
    ALL: { en: "All Documents", hi: "सभी दस्तावेज", mr: "सर्व कागदपत्रे", icon: "📑" },
    KYC_IDENTITY: { en: "Mandatory KYC & Identity", hi: "अनिवार्य पहचान व पता (KYC)", mr: "ओळख व पत्ता (KYC)", icon: "👤" },
    BENEFIT_ELIGIBILITY: { en: "Subsidy & Category Proof", hi: "सब्सिडी एवं श्रेणी प्रमाण", mr: "अनुदान व आरक्षण दाखले", icon: "🌟" },
    TECHNICAL_FINANCIAL: { en: "Technical DPR & Quotations", hi: "डीपीआर एवं मशीनरी कोटेशन", mr: "प्रकल्प अहवाल व कोटेशन", icon: "📊" },
    STATUTORY_COMPLIANCE: { en: "Licenses & Approvals", hi: "लाइसेंस एवं अनुमोदन", mr: "परवाने व नोंदणी", icon: "🛡️" }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#0B2559] via-[#072B61] to-[#14532D] text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                {scheme.code} Decision Guide
              </span>
              {scheme.subsidy_percentage_special_rural > 0 && (
                <span className="bg-amber-400 text-slate-900 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full font-mono">
                  Up to {scheme.subsidy_percentage_special_rural}% Subsidy
                </span>
              )}
              <span className="bg-white/10 text-slate-200 text-[11px] px-2.5 py-0.5 rounded-full">
                {scheme.category || 'Central & State Government'}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-heading font-extrabold text-white tracking-tight">
              {scheme.name}
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>{scheme.ministry}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Readiness Bar & Action Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Readiness Tracker */}
          <div className="flex items-center gap-3">
            <div className="text-xs">
              <span className="text-slate-500 font-medium">Document Readiness:</span>{' '}
              <span className="font-extrabold font-mono text-[#14532D]">
                {readyDocsCount} of {totalDocs} Prepared ({readinessPct}%)
              </span>
            </div>
            <div className="w-24 sm:w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  readinessPct >= 80 ? 'bg-emerald-600' : readinessPct >= 50 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${readinessPct}%` }}
              />
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyList}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Copy checklist text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copied ? "Copied!" : "Copy List"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Print document checklist"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print</span>
            </button>

            <a
              href={scheme.official_portal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#14532D] hover:bg-[#0F3E22] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3 Main Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-5 sm:px-6 bg-white shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('easy')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'easy'
                ? 'border-[#14532D] text-[#14532D] bg-emerald-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#EAB308]" />
            <span>🌟 Easy Explanation ({language === 'mr' ? 'सोप्या भाषेत माहिती' : language === 'hi' ? 'सरल भाषा में जानकारी' : 'Plain Language'})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'border-[#14532D] text-[#14532D] bg-emerald-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Required Documents ({allDocs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stages')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'stages'
                ? 'border-[#14532D] text-[#14532D] bg-emerald-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span>4-Stage Approval Roadmap</span>
          </button>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {loading ? (
            <div className="py-16 text-center space-y-3 text-slate-500 text-xs">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Retrieving verified statutory guidelines for {scheme.name}...</p>
            </div>
          ) : activeTab === 'easy' ? (
            /* TAB 1: Easy Scheme Information */
            <div className="space-y-5 animate-in fade-in">
              
              {/* Top Banner with Audio Listen button */}
              <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-5 rounded-3xl border border-emerald-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#14532D] text-[11px] font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
                    <span>{language === 'mr' ? 'सोप्या शब्दात योजना सारांश' : language === 'hi' ? 'सरल शब्दों में योजना सारांश' : 'Simple Scheme Summary'}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    {language === 'mr' ? easy?.simple_summary_mr : language === 'hi' ? easy?.simple_summary_hi : easy?.simple_summary_en}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSpeakEasy}
                  className="px-4 py-2.5 bg-[#14532D] hover:bg-[#0F3E22] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer self-start sm:self-center"
                >
                  <Volume2 className="w-4 h-4 text-[#EAB308]" />
                  <span>🔊 {language === 'mr' ? 'ऐका (Listen)' : language === 'hi' ? 'सुनें (Listen)' : 'Listen Aloud'}</span>
                </button>
              </div>

              {/* Real-World Math Box */}
              <div className="bg-white p-5 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#14532D] uppercase tracking-wider font-mono">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'mr' ? 'उदाहरणासह समजून घ्या (खर्च व अनुदान गणित)' : language === 'hi' ? 'उदाहरण सहित समझें (लागत एवं सब्सिडी गणित)' : 'Understand with Real Example (Cost & Subsidy Math)'}</span>
                </div>
                <pre className="text-xs font-sans text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed">
                  {language === 'mr' ? easy?.real_math_example_mr : language === 'hi' ? easy?.real_math_example_hi : easy?.real_math_example_en}
                </pre>
              </div>

              {/* 2-Column Grid: Who can apply + Allowed Businesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Column 1: Eligibility */}
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2.5">
                  <h4 className="font-heading font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>{language === 'mr' ? 'कोण अर्ज करू शकतो? (पात्रता)' : language === 'hi' ? 'कौन आवेदन कर सकता है? (पात्रता)' : 'Who Can Apply? (Eligibility)'}</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {(language === 'mr' ? easy?.who_can_apply_mr : language === 'hi' ? easy?.who_can_apply_hi : easy?.who_can_apply_en)?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Allowed businesses */}
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2.5">
                  <h4 className="font-heading font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'mr' ? 'कोणता व्यवसाय सुरू करू शकता?' : language === 'hi' ? 'कौन सा व्यवसाय शुरू कर सकते हैं?' : 'Allowed Businesses'}</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {(language === 'mr' ? easy?.allowed_businesses_mr : language === 'hi' ? easy?.allowed_businesses_hi : easy?.allowed_businesses_en)?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 4 Easy Steps */}
              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-3">
                <h4 className="font-heading font-extrabold text-xs text-[#14532D] uppercase tracking-wider">
                  {language === 'mr' ? 'योजनेचा लाभ कसा मिळवायचा? (४ सोप्या पायऱ्या)' : language === 'hi' ? 'योजना का लाभ कैसे प्राप्त करें? (4 सरल चरण)' : 'How to Get Scheme Benefit (4 Simple Steps)'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {(language === 'mr' ? easy?.easy_steps_mr : language === 'hi' ? easy?.easy_steps_hi : easy?.easy_steps_en)?.map((step, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-emerald-200 flex items-start gap-2.5 shadow-2xs">
                      <span className="w-5 h-5 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-[11px] font-mono shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-slate-800 font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Button to view required documents */}
              <div className="flex items-center justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('documents')}
                  className="px-6 py-2.5 bg-[#14532D] hover:bg-[#0F3E22] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>📄 {language === 'mr' ? 'या योजनेसाठी आवश्यक कागदपत्रांची यादी पहा' : language === 'hi' ? 'इस योजना हेतु आवश्यक दस्तावेजों की सूची देखें' : 'View Required Documents Checklist for ' + scheme.code}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : activeTab === 'documents' ? (
            /* TAB 2: Document Checklist */
            <div className="space-y-4 animate-in fade-in">
              
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                {Object.entries(categoryLabels).map(([key, meta]) => {
                  const count = key === 'ALL' ? allDocs.length : allDocs.filter(d => d.category === key).length;
                  if (key !== 'ALL' && count === 0) return null;
                  const isSelected = selectedCategory === key;
                  const label = meta[language] || meta.en;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedCategory(key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#0B2559] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{meta.icon}</span>
                      <span>{label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Document Items List */}
              <div className="space-y-3">
                {filteredDocs.map((doc) => {
                  const isChecked = checkedDocs.includes(doc.doc_code);
                  const docName = language === 'mr' ? doc.name_mr : language === 'hi' ? doc.name_hi : doc.name;
                  const docDesc = language === 'mr' ? doc.description_mr : language === 'hi' ? doc.description_hi : doc.description;
                  const docIssuing = language === 'mr' ? doc.issuing_authority_mr : language === 'hi' ? doc.issuing_authority_hi : doc.issuing_authority;
                  const docHow = language === 'mr' ? doc.how_to_obtain_mr : language === 'hi' ? doc.how_to_obtain_hi : doc.how_to_obtain;
                  const docRelevance = language === 'mr' ? doc.scheme_relevance_mr : language === 'hi' ? doc.scheme_relevance_hi : doc.scheme_relevance;

                  return (
                    <div
                      key={doc.doc_code}
                      onClick={(e) => toggleDoc(doc.doc_code, e)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Checkbox */}
                        <div className="mt-0.5 shrink-0">
                          {isChecked ? (
                            <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-md border-2 border-slate-400 bg-white" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-heading font-extrabold text-sm text-slate-900">
                                {docName}
                              </h4>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono border border-slate-200">
                                {doc.doc_code}
                              </span>
                            </div>

                            <span className="text-[10px] bg-emerald-100 text-[#14532D] px-2.5 py-0.5 rounded-md font-bold font-mono">
                              {doc.approval_stage.split(':')[0]}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {docDesc}
                          </p>

                          {/* Metadata Card: Issuing Authority + How to obtain */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <div>
                              <span className="text-slate-400 font-semibold block">🏛️ Issuing Authority:</span>
                              <span className="text-slate-800 font-medium">{docIssuing}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-semibold block">📍 Where & How to Get:</span>
                              <span className="text-slate-700">{docHow}</span>
                            </div>
                          </div>

                          {/* Relevance Tag */}
                          <div className="flex items-center gap-1.5 text-[11px] text-[#166534] font-medium pt-0.5">
                            <Sparkles className="w-3 h-3 text-[#EAB308] shrink-0" />
                            <span>{docRelevance}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            /* TAB 3: 4-Stage Approval Roadmap */
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-950 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-blue-950 mb-0.5">
                    Statutory Benefit Approval & Subsidy Disbursement Roadmap
                  </h4>
                  <p className="text-blue-800 leading-relaxed">
                    Under official Government guidelines ({scheme.ministry}), scheme sanction follows a 4-step verified workflow. No intermediary agents or advance fees are required.
                  </p>
                </div>
              </div>

              {/* 4 Stages Timeline */}
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200 before:z-0">
                {roadmapData?.approval_stages?.map((stg) => {
                  const title = language === 'mr' ? stg.stage_name_mr : language === 'hi' ? stg.stage_name_hi : stg.stage_name;
                  const desc = language === 'mr' ? stg.description_mr : language === 'hi' ? stg.description_hi : stg.description;

                  return (
                    <div key={stg.stage_number} className="relative z-10 flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-sm ring-4 ring-white">
                        {stg.stage_number}
                      </div>
                      <div className="flex-1 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <h4 className="font-heading font-extrabold text-sm text-slate-900">
                            {title}
                          </h4>
                          <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-mono font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {stg.timeframe}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {desc}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-slate-500">Key Documents:</span>
                          {stg.required_docs_summary.map((docName, idx) => (
                            <span key={idx} className="text-[10px] bg-emerald-50 text-[#14532D] px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
                              ✓ {docName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Statutory Conditions & Notes */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Mandatory Statutory Conditions for {scheme.code}:
                </h4>
                <ul className="space-y-1.5 text-slate-600 pl-5 list-disc">
                  {roadmapData?.statutory_conditions?.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500">
            Self-attest all copies with active Aadhaar linked mobile number for instant verification.
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              Close
            </button>

            {onSelectSchemeForJourney && (
              <button
                type="button"
                onClick={() => {
                  onSelectSchemeForJourney(scheme);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0F3E22] text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed with {scheme.code} in Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
