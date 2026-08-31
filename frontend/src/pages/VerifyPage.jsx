import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGramNiti } from '../contexts/GramNitiContext';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';
import { EngineTransparencyCard } from '../components/common/EngineTransparencyCard';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ExternalLink, 
  Sparkles, 
  FileWarning, 
  Info,
  ArrowRight,
  RefreshCw,
  Send,
  HelpCircle
} from 'lucide-react';

const SAMPLE_PRESETS = [
  {
    title: "🚨 Advance Fee Scam Example",
    text: "Get ₹5,00,000 instant loan under Pradhan Mantri Mudra Yojana! No documents required, 100% guaranteed loan sanction. Pay registration fee of ₹2,500 via UPI to loanagent@okhdfcbank to claim today.",
    url: "http://pm-mudra-yojana-apply.xyz/pay",
    type: "scam"
  },
  {
    title: "⚠️ Unrealistic Loan Ceiling Claim",
    text: "Apply for Pradhan Mantri Mudra Yojana Kishore loan of ₹50,00,000 for purchasing farm equipment with zero interest.",
    url: "",
    type: "mismatch"
  },
  {
    title: "✅ Genuine PMEGP Portal Offer",
    text: "Prime Minister's Employment Generation Programme (PMEGP) subsidy up to 35% for rural micro-enterprises. Apply through official KVIC portal.",
    url: "https://www.kviconline.gov.in/pmegpep/pmegphome/index.jsp",
    type: "genuine"
  },
  {
    title: "🏛 Legitimate NABARD Portal",
    text: "National Bank for Agriculture and Rural Development (NABARD) institutional credit and refinance support for rural entrepreneurship.",
    url: "https://www.nabard.org/",
    type: "institutional"
  },
  {
    title: "⚪ Unknown / Unverified Third-Party Grant",
    text: "Universal Global Farmer Solar Grant Scheme 2026 for village micro-units.",
    url: "",
    type: "unavailable"
  }
];

export const VerifyPage = () => {
  const { t } = useLanguage();
  const { verificationResult, setVerificationResult } = useGramNiti();
  
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleVerify = async (textToVerify = inputText, urlToVerify = inputUrl) => {
    if (!textToVerify && !urlToVerify) return;
    try {
      setScanning(true);
      const res = await api.verifyScheme(textToVerify, urlToVerify);
      setVerificationResult(res);
    } catch (e) {
      console.error("Verification failed:", e);
    } finally {
      setScanning(false);
    }
  };

  const loadPreset = (preset) => {
    setInputText(preset.text);
    setInputUrl(preset.url);
    handleVerify(preset.text, preset.url);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <div className="flex items-center gap-2 bg-[#DCFCE7] text-[#14532D] border border-emerald-300 px-4 py-2 rounded-xl font-heading font-extrabold text-sm sm:text-base shadow-2xs">
            <span className="text-lg">🟢</span>
            <span>Verified Scheme</span>
          </div>
        );
      case 'HIGH_RISK':
        return (
          <div className="flex items-center gap-2 bg-red-50 text-red-900 border border-red-300 px-4 py-2 rounded-xl font-heading font-extrabold text-sm sm:text-base shadow-2xs">
            <span className="text-lg">🔴</span>
            <span>High Risk / Potential Scam</span>
          </div>
        );
      case 'NEEDS_VERIFICATION':
      default:
        return (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-300 px-4 py-2 rounded-xl font-heading font-extrabold text-sm sm:text-base shadow-2xs">
            <span className="text-lg">🟡</span>
            <span>Needs Verification</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-[#14532D] rounded-xl">
              <ShieldCheck className="w-5 h-5 text-[#166534]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
              Verification Assessment
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Multi-signal authenticity pipeline cross-matching official databases, domain registries, and fraud heuristics.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-300 px-3.5 py-1.5 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>Application-Generated Assessment</span>
        </div>
      </div>

      {/* Preset Quick Test Buttons */}
      <div className="bg-slate-100/80 p-4 rounded-2xl border border-slate-200 space-y-2">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
          Test Instant Sample Messages & Offers:
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadPreset(preset)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 transition-all shadow-2xs hover:border-slate-400 cursor-pointer"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Input Box */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 block">
            Paste Scheme Offer Text, WhatsApp Message, or SMS:
          </label>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. 'I received a message saying XYZ Yojana gives ₹5 Lakh loan without documents if I pay ₹2,000 fee'..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#166534]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 block">
            Link or Website URL (Optional):
          </label>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="e.g. https://www.kviconline.gov.in"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#166534]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setInputText('');
              setInputUrl('');
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => handleVerify()}
            disabled={scanning || (!inputText && !inputUrl)}
            className="px-6 py-2.5 bg-[#14532D] hover:bg-[#0A230C] disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            {scanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Assessing Authenticity...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Run Verification Assessment</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verification Assessment Result Panel */}
      {verificationResult && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 animate-in slide-in-from-bottom-2 duration-300">
          
          {/* Top Verdict Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Verification Assessment Verdict
              </div>
              <h2 className="text-xl font-heading font-extrabold text-slate-900">
                {verificationResult.scheme_name_detected || 'Scheme Offer Evaluation'}
              </h2>
              {verificationResult.official_source && (
                <div className="text-xs text-slate-500">
                  Matched Entity: <strong>{verificationResult.official_source}</strong>
                </div>
              )}
            </div>

            <div>
              {renderStatusBadge(verificationResult.verification_status)}
            </div>
          </div>

          {/* Safety Recommendation Notice */}
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 ${
            verificationResult.verification_status === 'HIGH_RISK'
              ? 'bg-red-50 text-red-950 border-red-200'
              : verificationResult.verification_status === 'VERIFIED'
              ? 'bg-[#DCFCE7] text-[#14532D] border-emerald-300'
              : 'bg-amber-50 text-amber-950 border-amber-200'
          }`}>
            <div className="font-bold flex items-center gap-1.5 text-sm">
              <Info className="w-4 h-4" />
              <span>Assessment Guidance</span>
            </div>
            <p>{verificationResult.safety_recommendation}</p>
          </div>

          {/* Transparent Evidence Checklist */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
              Transparent Evidence Checklist
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 flex items-start gap-2.5">
                {verificationResult.official_source ? (
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-xs text-slate-800">Official Source Matching</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {verificationResult.official_source ? `Matched registered authority: ${verificationResult.official_source}` : 'No matching official ministry registry found.'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 flex items-start gap-2.5">
                {verificationResult.scheme_exists ? (
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-xs text-slate-800">Scheme Name Match</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {verificationResult.scheme_exists ? `Identified in verified gazette repository.` : 'Scheme name could not be identified in central or state database.'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 flex items-start gap-2.5">
                {verificationResult.details_match ? (
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-xs text-slate-800">Financial Parameters Consistency</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {verificationResult.details_match ? 'Mentioned financial figures are within statutory limits.' : 'Financial numbers or loan ceilings conflict with official guidelines.'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 flex items-start gap-2.5">
                {verificationResult.fraud_indicators && verificationResult.fraud_indicators.length > 0 ? (
                  <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-xs text-slate-800">Fraud Indicators Check</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {verificationResult.fraud_indicators && verificationResult.fraud_indicators.length > 0
                      ? `${verificationResult.fraud_indicators.length} critical red flags detected (e.g. advance fee, UPI requests).`
                      : 'No typical advance fee or urgent scam patterns detected.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Official Portal Reference */}
          {verificationResult.official_portal_url && (
            <div className="p-4 bg-slate-100 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-800">Authentic Application Channel</div>
                <div className="text-[11px] text-slate-500">Always submit applications directly through the official portal.</div>
              </div>
              <a
                href={verificationResult.official_portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-[#0A230C] transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Statutory Assessment Disclaimer */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 leading-relaxed">
            <strong>Disclaimer:</strong> {verificationResult.disclaimer}
          </div>
        </div>
      )}

      {/* Engine Audit Transparency */}
      <EngineTransparencyCard />
    </div>
  );
};
