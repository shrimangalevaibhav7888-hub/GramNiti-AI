import React from 'react';
import { Sliders, HelpCircle, RefreshCw } from 'lucide-react';

export const AssumptionsCard = ({ assumptions = [], onUpdateAssumption, onReset }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-cream-300 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rural-saffron-100 text-rural-saffron-800 rounded-lg">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-gray-900">
              Simulation Assumptions (Live Controls)
            </h4>
            <p className="text-[11px] text-gray-500">
              Modifying any parameter updates 3-scenario revenue, expenses, and cashflow in real-time.
            </p>
          </div>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="text-xs text-gray-500 hover:text-rural-green-800 flex items-center gap-1 font-medium"
          >
            <RefreshCw className="w-3 h-3" /> Reset Defaults
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {assumptions.map((item) => (
          <div key={item.parameter} className="bg-cream-50 p-3 rounded-xl border border-cream-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800">{item.label}</label>
              <span className="text-xs font-mono font-bold text-rural-green-800 bg-white px-2 py-0.5 rounded border border-cream-300">
                {item.value} <span className="text-[10px] text-gray-500">{item.unit}</span>
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={item.minimum}
              max={item.maximum}
              step={item.unit.includes('Liter') || item.unit.includes('%') ? 0.5 : 1}
              value={item.value}
              onChange={(e) => onUpdateAssumption(item.parameter, e.target.value)}
              className="w-full h-1.5 bg-cream-300 rounded-lg appearance-none cursor-pointer accent-rural-green-700"
            />

            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span>Min: {item.minimum}</span>
              <span className="italic truncate max-w-[140px]" title={item.source}>
                Source: {item.source}
              </span>
              <span>Max: {item.maximum}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
