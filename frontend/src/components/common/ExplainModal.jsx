import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const ExplainModal = ({ isOpen, onClose, title, summary, evidenceList = [] }) => {
  const { speak } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-cream-300 relative max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cream-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rural-green-100 text-rural-green-800 rounded-xl">
              <Sparkles className="w-5 h-5 text-rural-green-700" />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-rural-green-950">
                {title || "Why this recommendation?"}
              </h3>
              <p className="text-xs text-gray-500">Transparent factor breakdown & data sources</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Summary */}
        {summary && (
          <div className="my-4 p-3.5 bg-rural-green-50/80 border border-rural-green-200 rounded-xl text-xs text-rural-green-950 leading-relaxed">
            <span className="font-semibold block mb-1">Executive Rationale:</span>
            {summary}
          </div>
        )}

        {/* Evidence Factors List */}
        <div className="space-y-3 my-4">
          <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
            Contributing Evidence & Verification Factors
          </h4>

          {evidenceList.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No specific factors recorded.</p>
          ) : (
            evidenceList.map((item, idx) => {
              const isPositive = item.impact === 'POSITIVE' || item.status === 'PASS';
              const isCaution = item.impact === 'CAUTION' || item.status === 'WARNING' || item.status === 'FLAG';
              
              return (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                    isPositive 
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : isCaution
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                      : 'bg-cream-100 border-cream-300 text-gray-800'
                  }`}
                >
                  {isPositive ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : isCaution ? (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{item.factor || item.signal_name}</span>
                      <span className="text-[10px] text-gray-500 bg-white/80 px-2 py-0.5 rounded-full border border-gray-200 font-mono">
                        {item.source || item.category}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-snug">{item.explanation || item.evidence}</p>
                    {item.value && (
                      <div className="text-[11px] font-mono text-gray-600 bg-white/60 px-2 py-0.5 rounded inline-block">
                        Metric: {item.value}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-cream-200 flex items-center justify-between">
          <button
            onClick={() => speak(summary || "This recommendation is based on available local demand and capital match.")}
            className="text-xs text-rural-green-800 font-medium hover:underline flex items-center gap-1"
          >
            🔊 Listen to Explanation
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-rural-green-800 text-white rounded-xl text-xs font-semibold hover:bg-rural-green-700"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
