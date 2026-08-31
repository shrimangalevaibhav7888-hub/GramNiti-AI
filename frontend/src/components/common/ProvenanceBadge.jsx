import React from 'react';
import { ShieldCheck, Calendar, MapPin, Database, ExternalLink } from 'lucide-react';

/**
 * ProvenanceBadge
 * Renders verified data provenance metadata (Source, Last Verified Date, Coverage)
 * and displays an explicit DEMO DATA badge when synthetic data is in use.
 */
export const ProvenanceBadge = ({
  sourceName = "Ministry of MSME / KVIC",
  lastVerified = "01-Aug-2026",
  coverage = "Pan-India",
  isDemoData = false,
  officialUrl = null,
  className = ""
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
      {/* 1. Verified vs Demo Data Indicator */}
      {isDemoData ? (
        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          DEMO DATA
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#14532D] border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
          Verified Source
        </span>
      )}

      {/* 2. Source Name */}
      <span className="text-slate-600 flex items-center gap-1">
        <span className="font-semibold text-slate-700">Source:</span>
        {officialUrl ? (
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-900 underline decoration-dotted inline-flex items-center gap-0.5 font-medium"
          >
            <span>{sourceName}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span>{sourceName}</span>
        )}
      </span>

      <span className="text-slate-300">•</span>

      {/* 3. Last Verified Date */}
      <span className="text-slate-500 flex items-center gap-1">
        <Calendar className="w-3 h-3 text-slate-400" />
        <span>Verified: <strong className="text-slate-700 font-mono">{lastVerified}</strong></span>
      </span>

      <span className="text-slate-300">•</span>

      {/* 4. Coverage */}
      <span className="text-slate-500 flex items-center gap-1">
        <MapPin className="w-3 h-3 text-slate-400" />
        <span>{coverage}</span>
      </span>
    </div>
  );
};
