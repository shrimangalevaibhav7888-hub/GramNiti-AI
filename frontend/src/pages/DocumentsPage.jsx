import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGramNiti } from '../contexts/GramNitiContext';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { api } from '../services/api';
import { 
  FileText, 
  CheckCircle2, 
  UploadCloud, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  FileCheck2, 
  Building,
  Sparkles, 
  Info, 
  ShieldCheck, 
  Tag,
  Copy,
  Check,
  Printer,
  ExternalLink,
  Layers,
  Clock,
  Landmark,
  Volume2,
  ChevronDown
} from 'lucide-react';

export const DocumentsPage = ({ setActiveTab }) => {
  const { t, language, speak } = useLanguage();
  const { 
    schemes,
    selectedBusiness, 
    selectedScheme, 
    selectScheme,
    uploadedDocCodes, 
    setUploadedDocCodes 
  } = useGramNiti();

  const [activeView, setActiveView] = useState('checklist'); // 'checklist', 'approval_stages'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentScheme, setCurrentScheme] = useState(selectedScheme || schemes[0]);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Synchronize currentScheme when selectedScheme changes from global context
  useEffect(() => {
    if (selectedScheme) {
      setCurrentScheme(selectedScheme);
    }
  }, [selectedScheme]);

  // Load document roadmap data whenever currentScheme changes
  useEffect(() => {
    if (currentScheme) {
      setLoading(true);
      const schemeId = currentScheme.scheme_id || currentScheme.code;
      api.getSchemeDocumentRoadmap(schemeId)
        .then(data => {
          setRoadmapData(data);
        })
        .catch(err => {
          console.error("Error loading scheme document roadmap:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentScheme]);

  const handleSchemeChange = (schemeCode) => {
    const found = schemes.find(s => s.code === schemeCode || s.scheme_id === schemeCode);
    if (found) {
      setCurrentScheme(found);
      selectScheme(found);
    }
  };

  const handleSimulateUpload = async (docCode, filename) => {
    try {
      setUploading(true);
      const res = await api.uploadDemoOCR(filename, `Sample verified ${docCode} for applicant.`);
      setOcrResult(res);

      if (!uploadedDocCodes.includes(docCode)) {
        setUploadedDocCodes([...uploadedDocCodes, docCode]);
      }
    } catch (e) {
      console.error("Upload OCR error:", e);
    } finally {
      setUploading(false);
    }
  };

  const allDocs = roadmapData?.documents || [];
  const filteredDocs = allDocs.filter(doc => {
    if (selectedCategory === 'ALL') return true;
    return doc.category === selectedCategory;
  });

  const totalDocs = allDocs.length;
  const readyDocsCount = uploadedDocCodes.filter(code => allDocs.some(d => d.doc_code === code)).length;
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

    const fullText = `📄 Official Required Documents Provider: ${currentScheme?.name} (${currentScheme?.code})\nMinistry: ${currentScheme?.ministry}\nPortal: ${currentScheme?.official_portal_url}\nMax Subsidy: ${currentScheme?.subsidy_percentage_special_rural || 35}%\n\nDocuments List:\n${docLines}\n\nGenerated via GramNiti AI`;

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
    KYC_IDENTITY: { en: "Mandatory KYC", hi: "अनिवार्य पहचान (KYC)", mr: "ओळख पुरावे (KYC)", icon: "👤" },
    BENEFIT_ELIGIBILITY: { en: "Subsidy Proof", hi: "सब्सिडी प्रमाण", mr: "अनुदान दाखले", icon: "🌟" },
    TECHNICAL_FINANCIAL: { en: "DPR & Quotations", hi: "डीपीआर एवं कोटेशन", mr: "प्रकल्प अहवाल व कोटेशन", icon: "📊" },
    STATUTORY_COMPLIANCE: { en: "Licenses & NOC", hi: "लाइसेंस व एनओसी", mr: "परवाने व नोंदणी", icon: "🛡️" }
  };

  const businessDisplayName = language === 'mr' ? selectedBusiness?.name_mr : language === 'hi' ? selectedBusiness?.name_hi : selectedBusiness?.name;

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      
      {/* Top Banner & Scheme Selector */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-[#DCFCE7] text-[#14532D] rounded-2xl">
              <FileCheck2 className="w-6 h-6 text-[#166534]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                  {t('card_documents_title')}
                </h1>
                <span className="text-[10px] bg-emerald-100 text-[#14532D] font-extrabold px-2.5 py-0.5 rounded-full font-mono">
                  Checklist Provider
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Official statutory document requirements, issuing authorities, and benefit approval roadmaps for central & state schemes.
              </p>
            </div>
          </div>
        </div>

        {/* Scheme Selector Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
              Select Target Scheme:
            </label>
            <div className="relative">
              <select
                value={currentScheme?.code || 'PMEGP'}
                onChange={(e) => handleSchemeChange(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer pr-8"
              >
                {schemes.map((s) => (
                  <option key={s.scheme_id} value={s.code}>
                    {s.code} — {s.name.length > 32 ? s.name.substring(0, 32) + '...' : s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Readiness Score Pill */}
          <div className="bg-emerald-50 text-emerald-950 border border-emerald-300 px-4 py-2 rounded-2xl text-center shrink-0 flex flex-col justify-center">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Readiness</div>
            <div className="text-xl font-extrabold font-mono text-[#14532D]">
              {readyDocsCount} / {totalDocs} ({readinessPct}%)
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory DEMO OCR & Legal Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 leading-relaxed shadow-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900 text-sm block mb-0.5">
            Official Statutory Notice:
          </span>
          {roadmapData?.disclaimer || "All requirements are synchronized with official Ministry guidelines. Automated OCR detection confirms format validity only."}
        </div>
      </div>

      {/* Document Intelligence Card Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        
        {/* Navigation & Action Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          {/* View Mode Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveView('checklist')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'checklist'
                  ? 'bg-[#14532D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Required Documents ({allDocs.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('approval_stages')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'approval_stages'
                  ? 'bg-[#14532D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>4-Stage Approval Roadmap</span>
            </button>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyList}
              className="px-3 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Copy checklist text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? "Copied!" : "Copy List"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Print document checklist"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>

            <a
              href={currentScheme?.official_portal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#0B2559] hover:bg-[#072B61] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>Visit Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* View 1: Document Checklist */}
        {activeView === 'checklist' ? (
          <div className="space-y-5">
            
            {/* Easy Language Summary & Math Box */}
            {easy && (
              <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 p-5 rounded-2xl border border-emerald-200 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#14532D] text-[11px] font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
                      <span>{language === 'mr' ? 'सोप्या भाषेत योजना माहिती' : language === 'hi' ? 'सरल भाषा में योजना जानकारी' : 'Easy Scheme Information'}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                      {language === 'mr' ? easy.simple_summary_mr : language === 'hi' ? easy.simple_summary_hi : easy.simple_summary_en}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSpeakEasy}
                    className="px-3.5 py-2 bg-[#14532D] hover:bg-[#0F3E22] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-center"
                    title="Listen to scheme explanation"
                  >
                    <Volume2 className="w-4 h-4 text-[#EAB308]" />
                    <span>🔊 {language === 'mr' ? 'ऐका' : language === 'hi' ? 'सुनें' : 'Listen'}</span>
                  </button>
                </div>

                {/* Real-World Math Box */}
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                  <span className="font-extrabold text-[#14532D] block mb-1">
                    📊 {language === 'mr' ? 'उदाहरणासह समजून घ्या:' : language === 'hi' ? 'उदाहरण सहित समझें:' : 'Understand with Real Example:'}
                  </span>
                  {language === 'mr' ? easy.real_math_example_mr : language === 'hi' ? easy.real_math_example_hi : easy.real_math_example_en}
                </div>
              </div>
            )}

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pb-2">
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
                        ? 'bg-slate-900 text-white shadow-2xs'
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

            {/* Document Cards */}
            <div className="space-y-3.5">
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                  <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Loading document requirements for {currentScheme?.name}...</p>
                </div>
              ) : (
                filteredDocs.map((doc) => {
                  const isUploaded = uploadedDocCodes.includes(doc.doc_code);
                  const docName = language === 'mr' ? doc.name_mr : language === 'hi' ? doc.name_hi : doc.name;
                  const docDesc = language === 'mr' ? doc.description_mr : language === 'hi' ? doc.description_hi : doc.description;
                  const docIssuing = language === 'mr' ? doc.issuing_authority_mr : language === 'hi' ? doc.issuing_authority_hi : doc.issuing_authority;
                  const docHow = language === 'mr' ? doc.how_to_obtain_mr : language === 'hi' ? doc.how_to_obtain_hi : doc.how_to_obtain;
                  const docRelevance = language === 'mr' ? doc.scheme_relevance_mr : language === 'hi' ? doc.scheme_relevance_hi : doc.scheme_relevance;

                  return (
                    <div
                      key={doc.doc_code}
                      className={`p-4 sm:p-5 rounded-2xl border text-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                        isUploaded
                          ? 'bg-emerald-50/40 border-emerald-300 text-emerald-950'
                          : 'bg-slate-50/60 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 max-w-3xl">
                        {isUploaded ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-400 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{docName}</span>
                            <span className="text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 font-mono">
                              {doc.doc_code}
                            </span>
                            <span className="text-[10px] bg-emerald-100 text-[#14532D] px-2 py-0.5 rounded-md font-bold font-mono">
                              {doc.approval_stage.split(':')[0]}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{docDesc}</p>
                          
                          {/* Metadata Card: Issuing Authority + How to obtain */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200">
                            <div>
                              <span className="text-slate-400 font-semibold block">🏛️ Issuing Authority:</span>
                              <span className="text-slate-800 font-medium">{docIssuing}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-semibold block">📍 Where & How to Get:</span>
                              <span className="text-slate-700">{docHow}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-[#166534] font-medium pt-0.5">
                            <Tag className="w-3 h-3 text-[#EAB308] shrink-0" />
                            <span>{docRelevance}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                        {isUploaded ? (
                          <span className="bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Uploaded & Ready
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSimulateUpload(doc.doc_code, `${doc.doc_code.toLowerCase()}_verified.pdf`)}
                            disabled={uploading}
                            className="px-4 py-2 bg-[#14532D] hover:bg-[#0F3E22] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                          >
                            <UploadCloud className="w-4 h-4" />
                            Upload (Demo OCR)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* OCR Result Preview Card */}
            {ocrResult && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs animate-in fade-in">
                <div className="flex items-center justify-between font-bold text-emerald-950">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#EAB308]" />
                    DEMO OCR Detection Result ({ocrResult.file_name})
                  </span>
                  <span className="bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full font-mono font-bold">
                    Classification Confidence: {ocrResult.ocr_confidence}%
                  </span>
                </div>
                <pre className="bg-white/90 p-3 rounded-xl border border-emerald-200 text-[11px] font-mono text-slate-800 overflow-x-auto">
                  {JSON.stringify(ocrResult.extracted_metadata, null, 2)}
                </pre>
                <div className="text-[10px] text-slate-500 italic">
                  {ocrResult.disclaimer}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* View 2: 4-Stage Approval Roadmap */
          <div className="space-y-5">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-950 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-blue-950 mb-0.5">
                  Statutory Benefit Approval & Subsidy Disbursement Roadmap for {currentScheme?.code}
                </h4>
                <p className="text-blue-800 leading-relaxed">
                  Under official Government guidelines ({currentScheme?.ministry}), scheme sanction follows a 4-step verified workflow.
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
          </div>
        )}

        {/* Action Bottom Button */}
        <div className="pt-4 flex items-center justify-end border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('action-plan')}
            className="px-6 py-2.5 bg-[#14532D] hover:bg-[#0F3E22] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to Bank-Ready DPR & Action Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DisclaimerBanner type="ocr" />
    </div>
  );
};
