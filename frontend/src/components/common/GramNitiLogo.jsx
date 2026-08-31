import React from 'react';

/**
 * Exact Vector Representation of the Official GramNiti AI Logo
 * Matching the exact uploaded brand image:
 * - Hexagonal navy frame with rising blue bar charts, pixel cubes, green agricultural field furrows, and growth arrow
 * - Typography: "Gram" in Deep Navy (#0B2559) + "Niti" in Agricultural Green (#00873E) + "[AI]" in Navy Blue Badge with floating Orange/Green/Blue Pixels
 */

export const GramNitiEmblem = ({ className = "w-10 h-10" }) => (
  <svg 
    viewBox="0 0 360 400" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <defs>
      <linearGradient id="emblemArrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0F7633" />
        <stop offset="100%" stopColor="#16A34A" />
      </linearGradient>
    </defs>

    <g transform="translate(180, 180)">
      {/* Outer Hexagonal Frame (Deep Navy) */}
      <path 
        d="M 0,-155 L 125,-82 L 125,55 L 0,125 L -125,55 L -125,-82 Z" 
        fill="none" 
        stroke="#0A2558" 
        strokeWidth="26" 
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Inner White Cutout */}
      <path 
        d="M 0,-130 L 102,-68 L 102,44 L 0,102 L -102,44 L -102,-68 Z" 
        fill="#FFFFFF" 
      />

      {/* Floating Digital Pixels (Top Left inside Hexagon) */}
      <rect x="-68" y="-95" width="18" height="18" rx="3.5" fill="#0284C7" />
      <rect x="-45" y="-95" width="18" height="18" rx="3.5" fill="#F97316" />
      <rect x="-92" y="-72" width="18" height="18" rx="3.5" fill="#16A34A" />
      <rect x="-68" y="-72" width="18" height="18" rx="3.5" fill="#0284C7" />
      <rect x="-68" y="-49" width="18" height="18" rx="3.5" fill="#0A2558" />

      {/* Rising Blue Bar Chart Columns */}
      <rect x="-20" y="-24" width="28" height="76" rx="4" fill="#0284C7" />
      <rect x="14" y="-56" width="28" height="108" rx="4" fill="#00509E" />

      {/* Surging Green Growth Arrow Line */}
      <path 
        d="M -110,40 L -25,68 L 70,-72 L 92,-108" 
        fill="none" 
        stroke="url(#emblemArrowGrad)" 
        strokeWidth="26" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Arrowhead pointing Up-Right */}
      <polygon points="98,-140 130,-85 70,-92" fill="#16A34A" />

      {/* Agricultural Green Field Furrows / Cultivated Land Base */}
      <path d="M -118,44 C -94,50 -70,64 -58,80 L -78,96 C -95,82 -112,74 -130,68 Z" fill="#00873E" />
      <path d="M -90,60 C -65,68 -40,84 -28,104 L -48,120 C -64,102 -84,90 -102,82 Z" fill="#0F7633" />
      <path d="M -58,80 C -30,92 -5,114 4,140 L -18,154 C -30,130 -52,110 -72,100 Z" fill="#15803D" />
      <path d="M -20,102 C 12,118 32,148 36,180 C 8,168 -4,148 -36,128 Z" fill="#166534" />
    </g>
  </svg>
);

export const GramNitiLogo = ({ 
  size = "md", // "sm", "md", "lg", "xl", "hero"
  showTagline = false,
  taglineText = "AI-Driven Rural Advisory",
  className = "" 
}) => {
  const sizeMap = {
    sm: { emblem: "w-8 h-8", text: "text-lg", badge: "text-[10px] px-1.5 py-0.5 rounded-md", dots: "w-1 h-1 -top-1 -right-1.5" },
    md: { emblem: "w-11 h-11", text: "text-2xl", badge: "text-xs px-2 py-0.5 rounded-lg", dots: "w-1.5 h-1.5 -top-1.5 -right-2" },
    lg: { emblem: "w-16 h-16", text: "text-4xl", badge: "text-base px-3 py-1 rounded-xl", dots: "w-2 h-2 -top-2 -right-2.5" },
    xl: { emblem: "w-24 h-24", text: "text-5xl sm:text-6xl", badge: "text-2xl px-4 py-1.5 rounded-2xl", dots: "w-3 h-3 -top-3 -right-3.5" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Emblem Icon */}
      <GramNitiEmblem className={currentSize.emblem} />

      {/* Typography: Gram (Deep Navy) + Niti (Green) + [AI] with Pixel Cubes */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1 leading-none">
          <span className={`font-heading font-black tracking-tight text-[#0B2559] ${currentSize.text}`}>
            Gram
          </span>
          <span className={`font-heading font-black tracking-tight text-[#00873E] ${currentSize.text}`}>
            Niti
          </span>

          {/* [AI] Badge Container with floating pixel squares */}
          <div className="relative inline-flex items-center ml-1">
            <span className={`bg-gradient-to-tr from-[#072B61] to-[#0047BA] text-white font-heading font-black tracking-wider uppercase shadow-md ${currentSize.badge}`}>
              AI
            </span>

            {/* Floating Pixel Squares on top right of AI badge */}
            <span className={`absolute flex flex-col gap-0.5 ${currentSize.dots}`}>
              <span className="w-full h-full bg-[#16A34A] rounded-xs" />
              <span className="w-full h-full bg-[#F97316] rounded-xs ml-1" />
              <span className="w-full h-full bg-[#0284C7] rounded-xs" />
            </span>
          </div>
        </div>

        {showTagline && (
          <span className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 tracking-tight">
            {taglineText}
          </span>
        )}
      </div>
    </div>
  );
};
