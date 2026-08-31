import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { 
  Database, 
  ShieldCheck, 
  Landmark, 
  Building, 
  Clock, 
  ExternalLink, 
  Activity, 
  CheckCircle2, 
  FileText,
  AlertTriangle,
  Search,
  Check,
  XCircle,
  Sparkles,
  Layers,
  ShieldAlert
} from 'lucide-react';

export const AdminPage = () => {
  const { t } = useLanguage();
  const [sources, setSources] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Interactive Domain Tester State
  const [testDomain, setTestDomain] = useState('');
  const [domainCheckResult, setDomainCheckResult] = useState(null);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const srcRes = await api.getSources();
        setSources(srcRes || []);
        const schemeRes = await api.getSchemes();
        setSchemes(schemeRes.schemes || []);
        const statsRes = await api.getAdminOverview();
        setAdminStats(statsRes);
      } catch (e) {
        console.error("Admin data load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleTestDomain = () => {
    if (!testDomain.trim()) return;
    const clean = testDomain.toLowerCase().replace('www.', '').trim();
    
    // Check if in official registry
    const matchedSource = sources.find(s => 
      s.primary_domain === clean || s.allowed_domains?.includes(clean) || clean.endsWith('.' + s.primary_domain)
    );

    if (matchedSource) {
      setDomainCheckResult({
        domain: clean,
        status: 'AUTHORITATIVE_SOURCE',
        badge: '🟢 Authoritative Institutional Source',
        details: `Registered under ${matchedSource.name} (${matchedSource.organization}). Priority: P${matchedSource.priority}.`,
        url: matchedSource.official_url
      });
    } else if (clean.endsWith('.gov.in') || clean.endsWith('.nic.in')) {
      setDomainCheckResult({
        domain: clean,
        status: 'GOV_DOMAIN',
        badge: '🟢 Government Domain Namespace',
        details: 'Domain is hosted under national government top-level domain (.gov.in / .nic.in).',
        url: `https://${clean}`
      });
    } else if (['.xyz', '.top', '.club', '.click', '.link', '.buzz', '.loan', '.free'].some(tld => clean.endsWith(tld))) {
      setDomainCheckResult({
        domain: clean,
        status: 'HIGH_RISK_TLD',
        badge: '🔴 High-Risk / Suspicious TLD',
        details: 'Domain uses a top-level domain frequently associated with advance-fee loan scams and phishing attacks.',
        url: null
      });
    } else {
      setDomainCheckResult({
        domain: clean,
        status: 'UNREGISTERED_NEUTRAL',
        badge: '🟡 Unregistered Third-Party Domain',
        details: 'Domain is not present in the authoritative registry of government scheme implementing agencies. Requires manual verification.',
        url: null
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-gray-100 text-gray-800 rounded-2xl">
              <Database className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-gray-900">
                {t('nav_admin')}
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Authoritative Source Hierarchy, Scheme Freshness Tracker & Fraud Detection Engine.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 px-3.5 py-1.5 rounded-xl font-mono shrink-0 font-semibold">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          Status: {adminStats?.system_status || "ONLINE"}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium block">Authoritative Sources</span>
          <div className="text-2xl font-extrabold font-mono text-rural-green-900">
            {sources.length || 7} Sources
          </div>
          <span className="text-[10px] text-gray-400">Ministries, KVIC, NABARD, SIDBI</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium block">Active Schemes Monitored</span>
          <div className="text-2xl font-extrabold font-mono text-blue-800">
            {schemes.length || 7} Schemes
          </div>
          <span className="text-[10px] text-gray-400">PMEGP, PMFME, Mudra, AHIDF, etc.</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium block">Fraud Heuristic Rules</span>
          <div className="text-2xl font-extrabold font-mono text-rose-700">
            6 Guardrails
          </div>
          <span className="text-[10px] text-gray-400">Advance fees, UPI, Fake guarantee</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium block">Demo Village Locations</span>
          <div className="text-2xl font-extrabold font-mono text-amber-900">
            5 Locations
          </div>
          <span className="text-[10px] text-gray-400">Maharashtra, UP, MP Demographics</span>
        </div>
      </div>

      {/* Interactive Domain Validator Tool */}
      <div className="bg-gradient-to-br from-cream-50 to-white rounded-3xl p-6 border border-cream-300 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-cream-200">
          <ShieldCheck className="w-5 h-5 text-rural-green-800" />
          <div>
            <h3 className="font-heading font-bold text-sm text-gray-900">
              Interactive Domain & Source Verification Tool
            </h3>
            <p className="text-xs text-gray-500">
              Test any website URL or domain against the registered institutional hierarchy.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={testDomain}
            onChange={(e) => setTestDomain(e.target.value)}
            placeholder="e.g. kviconline.gov.in, nabard.org, standupmitra.in, or fake-pm-loan.xyz"
            className="flex-1 bg-white border border-cream-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-rural-green-600 shadow-2xs font-mono"
          />
          <button
            type="button"
            onClick={handleTestDomain}
            className="px-5 py-2.5 bg-rural-green-800 hover:bg-rural-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
          >
            Check Domain Status
          </button>
        </div>

        {/* Quick presets for testing */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-gray-500">Quick Test:</span>
          {['kviconline.gov.in', 'nabard.org', 'standupmitra.in', 'fake-mudra-loan.xyz'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setTestDomain(d);
                const clean = d;
                const matchedSource = sources.find(s => s.primary_domain === clean || s.allowed_domains?.includes(clean));
                if (matchedSource) {
                  setDomainCheckResult({
                    domain: clean,
                    status: 'AUTHORITATIVE_SOURCE',
                    badge: '🟢 Authoritative Institutional Source',
                    details: `Registered under ${matchedSource.name} (${matchedSource.organization}). Priority: P${matchedSource.priority}.`,
                    url: matchedSource.official_url
                  });
                } else if (clean.endsWith('.xyz')) {
                  setDomainCheckResult({
                    domain: clean,
                    status: 'HIGH_RISK_TLD',
                    badge: '🔴 High-Risk / Suspicious TLD',
                    details: 'Domain uses a top-level domain frequently associated with advance-fee loan scams and phishing attacks.',
                    url: null
                  });
                }
              }}
              className="text-[11px] bg-white hover:bg-cream-100 px-2.5 py-1 rounded-lg border border-cream-300 font-mono text-gray-700"
            >
              {d}
            </button>
          ))}
        </div>

        {/* Domain Test Result Output */}
        {domainCheckResult && (
          <div className="mt-3 p-4 bg-white rounded-2xl border border-cream-300 space-y-1.5 text-xs animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-gray-900">{domainCheckResult.domain}</span>
              <span className="font-bold text-xs">{domainCheckResult.badge}</span>
            </div>
            <p className="text-gray-600">{domainCheckResult.details}</p>
            {domainCheckResult.url && (
              <a
                href={domainCheckResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-1 text-[11px] pt-1"
              >
                <ExternalLink className="w-3 h-3" />
                Verified Target: {domainCheckResult.url}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Authoritative Source Registry Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-sm space-y-4">
        <div className="space-y-1 pb-2 border-b border-cream-200">
          <h3 className="font-heading font-bold text-base text-gray-900">
            Authoritative Source Priority Hierarchy (P1 to P6)
          </h3>
          <p className="text-xs text-gray-500">
            Source Priority: P1 Central Ministry &gt; P2 Scheme Portal &gt; P3 Statutory Body &gt; P4 Implementing Agency &gt; P5 Bank / FI &gt; P6 Authoritative Institutional.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-cream-300 rounded-2xl">
            <thead className="bg-cream-100 text-gray-700 font-semibold border-b border-cream-300">
              <tr>
                <th className="p-3">Hierarchy</th>
                <th className="p-3">Authoritative Entity</th>
                <th className="p-3">Source Type</th>
                <th className="p-3">Primary Domain</th>
                <th className="p-3">Verification Method</th>
                <th className="p-3">Last Verified Date</th>
                <th className="p-3">Official Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {sources.map((src) => (
                <tr key={src.source_id} className="hover:bg-cream-50/50">
                  <td className="p-3 font-bold font-mono text-rural-green-900">
                    <span className="bg-rural-green-100 text-rural-green-900 px-2 py-0.5 rounded-full">
                      P{src.priority}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-gray-900">
                    {src.name}
                    <span className="block text-[10px] text-gray-500 font-normal">{src.organization}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] bg-cream-100 text-gray-800 px-2 py-0.5 rounded border border-cream-300 font-mono">
                      {src.source_type}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-gray-700 font-medium">{src.primary_domain}</td>
                  <td className="p-3 text-gray-600">{src.verification_method}</td>
                  <td className="p-3 text-gray-500 font-mono">{src.last_verified_at}</td>
                  <td className="p-3">
                    <a
                      href={src.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-900 flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Visit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheme Freshness & Versioning Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-sm space-y-4">
        <div className="space-y-1 pb-2 border-b border-cream-200">
          <h3 className="font-heading font-bold text-base text-gray-900">
            Scheme Freshness, Status & Version Control
          </h3>
          <p className="text-xs text-gray-500">
            Every scheme rule is locked to effective dates and verified portal links. Outdated schemes are never presented as active.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-cream-300 rounded-2xl">
            <thead className="bg-cream-100 text-gray-700 font-semibold border-b border-cream-300">
              <tr>
                <th className="p-3">Scheme Code</th>
                <th className="p-3">Scheme Name</th>
                <th className="p-3">Effective Range</th>
                <th className="p-3">Status</th>
                <th className="p-3">Verification Method</th>
                <th className="p-3">Last Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {schemes.map((s) => (
                <tr key={s.scheme_id} className="hover:bg-cream-50/50">
                  <td className="p-3 font-mono font-bold text-blue-900">{s.code}</td>
                  <td className="p-3 font-semibold text-gray-900">{s.name}</td>
                  <td className="p-3 text-gray-600 font-mono text-[11px]">
                    {s.effective_from} to {s.effective_to || 'Ongoing'}
                  </td>
                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">{s.verification_method}</td>
                  <td className="p-3 text-gray-500 font-mono">{s.last_verified_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
