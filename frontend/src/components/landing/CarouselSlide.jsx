import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * CarouselSlide
 * Displays an individual designed slide visual with 100% crisp fidelity,
 * native 16:9 aspect ratio preservation, smooth horizontal slide/fade transitions,
 * and working interactive hitboxes over all illustrated buttons and navigation items.
 */
export const CarouselSlide = ({
  slide,
  index,
  currentIndex,
  totalSlides,
  setActiveTab,
  selectSlide
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { setShowOnboardingModal } = useLanguage();

  const offset = index - currentIndex;
  const isActive = index === currentIndex;

  const handleNav = (tab) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
  };

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${totalSlides}: ${slide.title}`}
      aria-hidden={!isActive}
      className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out select-none flex items-center justify-center ${
        isActive 
          ? 'opacity-100 translate-x-0 z-20 pointer-events-auto' 
          : offset < 0 
            ? 'opacity-0 -translate-x-full z-10 pointer-events-none' 
            : 'opacity-0 translate-x-full z-10 pointer-events-none'
      }`}
    >
      {/* Slide Image Container */}
      <div className="relative w-full h-full flex items-center justify-center bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200">
        
        {/* Actual Slide Designed Visual */}
        <img
          src={imageError ? slide.fallbackImage : slide.image}
          alt={slide.alt}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            if (!imageError) {
              setImageError(true);
            }
          }}
          className={`w-full h-full object-contain rounded-3xl transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            imageRendering: '-webkit-optimize-contrast',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(0)'
          }}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />

        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-50 animate-pulse flex items-center justify-center rounded-3xl">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-500">Loading GramNiti AI Slide...</p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🎯 WORKING INTERACTIVE BUTTON HITBOXES OVER SLIDE GRAPHICS                 */}
        {/* ========================================================================= */}
        {isActive && (
          <div className="absolute inset-0 z-30 pointer-events-auto">
            
            {/* Top Navigation Links Hitbox Ribbon (Across all 5 slides) */}
            <div className="absolute top-[3%] left-[36%] w-[10%] h-[9%] cursor-pointer hover:bg-emerald-500/10 rounded-lg transition-colors"
              onClick={() => selectSlide && selectSlide(0)}
              title="Home (Slide 1)"
            />
            <div className="absolute top-[3%] left-[44%] w-[8%] h-[9%] cursor-pointer hover:bg-emerald-500/10 rounded-lg transition-colors"
              onClick={() => selectSlide ? selectSlide(2) : handleNav('advisor')}
              title="Solutions (Slide 3 & Business Advisor)"
            />
            <div className="absolute top-[3%] left-[53%] w-[8%] h-[9%] cursor-pointer hover:bg-emerald-500/10 rounded-lg transition-colors"
              onClick={() => handleNav('schemes')}
              title="Explore Government Schemes"
            />
            <div className="absolute top-[3%] left-[62%] w-[9%] h-[9%] cursor-pointer hover:bg-emerald-500/10 rounded-lg transition-colors"
              onClick={() => selectSlide ? selectSlide(3) : handleNav('action-plan')}
              title="Technology & Architecture (Slide 4)"
            />
            <div className="absolute top-[3%] left-[73%] w-[7%] h-[9%] cursor-pointer hover:bg-emerald-500/10 rounded-lg transition-colors"
              onClick={() => selectSlide ? selectSlide(4) : handleNav('dashboard')}
              title="Impact & Real-World Outcomes (Slide 5)"
            />
            <div className="absolute top-[3%] left-[81%] w-[12%] h-[9%] cursor-pointer hover:bg-emerald-500/15 rounded-xl transition-colors ring-2 ring-emerald-500/0 hover:ring-emerald-500/40"
              onClick={() => handleNav('advisor')}
              title="Call-to-Action: Explore GramNiti"
            />

            {/* Slide 1 Specific Hitboxes */}
            {index === 0 && (
              <>
                {/* 'Explore GramNiti' Primary Button */}
                <div 
                  className="absolute top-[61%] left-[7%] w-[18%] h-[12%] cursor-pointer hover:bg-emerald-500/20 rounded-2xl transition-all ring-2 ring-transparent hover:ring-emerald-600/50"
                  onClick={() => handleNav('advisor')}
                  title="Explore GramNiti Local Business Advisor"
                />
                {/* 'How It Works' Secondary Button */}
                <div 
                  className="absolute top-[61%] left-[26%] w-[16%] h-[12%] cursor-pointer hover:bg-slate-900/15 rounded-2xl transition-all ring-2 ring-transparent hover:ring-slate-700/50"
                  onClick={() => selectSlide ? selectSlide(3) : handleNav('dashboard')}
                  title="How It Works (Slide 4 Process & Tech)"
                />
                {/* Right-side Dashboard Preview Click */}
                <div 
                  className="absolute top-[28%] left-[53%] w-[44%] h-[58%] cursor-pointer hover:bg-emerald-500/10 rounded-2xl transition-colors"
                  onClick={() => handleNav('advisor')}
                  title="Open Interactive Village Analytics & Feasibility Dashboard"
                />
              </>
            )}

            {/* Slide 2 Specific Hitboxes */}
            {index === 1 && (
              <>
                {/* Card 1: Information Scattered */}
                <div 
                  className="absolute top-[23%] left-[53%] w-[19%] h-[30%] cursor-pointer hover:bg-red-500/15 rounded-2xl transition-all"
                  onClick={() => handleNav('schemes')}
                  title="Explore All Schemes to solve scattered information"
                />
                {/* Card 2: Complex Schemes */}
                <div 
                  className="absolute top-[23%] left-[74%] w-[19%] h-[30%] cursor-pointer hover:bg-amber-500/15 rounded-2xl transition-all"
                  onClick={() => handleNav('verify')}
                  title="Verify Schemes & Eligibility Criteria"
                />
                {/* Card 3: Language Barriers */}
                <div 
                  className="absolute top-[56%] left-[53%] w-[19%] h-[30%] cursor-pointer hover:bg-blue-500/15 rounded-2xl transition-all"
                  onClick={() => setShowOnboardingModal(true)}
                  title="Choose Preferred Languages (13 Indian Languages)"
                />
                {/* Card 4: Limited Digital Accessibility */}
                <div 
                  className="absolute top-[56%] left-[74%] w-[19%] h-[30%] cursor-pointer hover:bg-emerald-500/15 rounded-2xl transition-all"
                  onClick={() => handleNav('dashboard')}
                  title="Open Voice-Enabled Simplified Dashboard"
                />
              </>
            )}

            {/* Slide 3 Specific Hitboxes */}
            {index === 2 && (
              <>
                {/* Top-Right Card: AI-Powered Scheme Discovery */}
                <div 
                  className="absolute top-[23%] left-[53%] w-[19%] h-[16%] cursor-pointer hover:bg-emerald-500/15 rounded-2xl transition-all"
                  onClick={() => handleNav('schemes')}
                  title="Open AI Scheme Discovery"
                />
                {/* Top-Far-Right Card: Multilingual & Voice Assistance */}
                <div 
                  className="absolute top-[23%] left-[74%] w-[20%] h-[16%] cursor-pointer hover:bg-emerald-500/15 rounded-2xl transition-all"
                  onClick={() => setShowOnboardingModal(true)}
                  title="Select from 13 Indian Languages"
                />
                {/* Central Connected Workflow Core */}
                <div 
                  className="absolute top-[44%] left-[50%] w-[45%] h-[20%] cursor-pointer hover:bg-emerald-500/15 rounded-2xl transition-all"
                  onClick={() => handleNav('advisor')}
                  title="Open GramNiti AI Intelligent Matching Engine"
                />
                {/* Bottom-Left Card: Hyper-Local Feasibility */}
                <div 
                  className="absolute top-[68%] left-[53%] w-[19%] h-[16%] cursor-pointer hover:bg-emerald-500/15 rounded-2xl transition-all"
                  onClick={() => handleNav('advisor')}
                  title="View 5-10km Hyper-Local Feasibility & SWOT Matrix"
                />
                {/* Bottom-Right Card: Simple Citizen Dashboard */}
                <div 
                  className="absolute top-[68%] left-[74%] w-[19%] h-[16%] cursor-pointer hover:bg-emerald-500/15 rounded-2xl transition-all"
                  onClick={() => handleNav('dashboard')}
                  title="Open 9-Step Citizen Dashboard"
                />
              </>
            )}

            {/* Slide 4 Specific Hitboxes */}
            {index === 3 && (
              <>
                {/* Pipeline Step 1 */}
                <div 
                  className="absolute top-[64%] left-[7%] w-[13%] h-[8%] cursor-pointer hover:bg-emerald-500/20 rounded-full transition-all"
                  onClick={() => handleNav('chat')}
                  title="1. User Query (Ask AI in 13 languages)"
                />
                {/* Pipeline Step 2 */}
                <div 
                  className="absolute top-[64%] left-[21%] w-[17%] h-[8%] cursor-pointer hover:bg-emerald-500/20 rounded-full transition-all"
                  onClick={() => handleNav('advisor')}
                  title="2. AI Understanding (Hyper-Local Viability)"
                />
                {/* Pipeline Step 3 */}
                <div 
                  className="absolute top-[64%] left-[40%] w-[16%] h-[8%] cursor-pointer hover:bg-emerald-500/20 rounded-full transition-all"
                  onClick={() => handleNav('verify')}
                  title="3. Government Data (Verified Schemes)"
                />
                {/* Pipeline Step 4 */}
                <div 
                  className="absolute top-[64%] left-[58%] w-[16%] h-[8%] cursor-pointer hover:bg-emerald-500/20 rounded-full transition-all"
                  onClick={() => handleNav('finance')}
                  title="4. Recommendation (Financial Structuring)"
                />
                {/* Pipeline Step 5 */}
                <div 
                  className="absolute top-[64%] left-[76%] w-[15%] h-[8%] cursor-pointer hover:bg-emerald-500/20 rounded-full transition-all"
                  onClick={() => handleNav('action-plan')}
                  title="5. Action / DPR (Generate Bank-Ready Draft)"
                />

                {/* Platform Pillars at bottom */}
                <div 
                  className="absolute top-[75%] left-[7%] w-[18%] h-[15%] cursor-pointer hover:bg-slate-900/10 rounded-2xl transition-all"
                  onClick={() => handleNav('home')}
                  title="Citizen Access Portal: Voice-first, mobile & desktop accessible"
                />
                <div 
                  className="absolute top-[75%] left-[28%] w-[20%] h-[15%] cursor-pointer hover:bg-slate-900/10 rounded-2xl transition-all"
                  onClick={() => handleNav('simulation')}
                  title="Policy & Subsidy Engine: Deterministic subsidy & EMI calculation"
                />
                <div 
                  className="absolute top-[75%] left-[51%] w-[21%] h-[15%] cursor-pointer hover:bg-slate-900/10 rounded-2xl transition-all"
                  onClick={() => handleNav('verify')}
                  title="Verified Scheme Registry: Official central & state datasets"
                />
                <div 
                  className="absolute top-[75%] left-[74%] w-[22%] h-[15%] cursor-pointer hover:bg-slate-900/10 rounded-2xl transition-all"
                  onClick={() => handleNav('chat')}
                  title="Multilingual Voice AI: 13 Indian languages conversational assistant"
                />
              </>
            )}

            {/* Slide 5 Specific Hitboxes */}
            {index === 4 && (
              <>
                {/* 4 Impact Cards */}
                <div 
                  className="absolute top-[39%] left-[57%] w-[19%] h-[15%] cursor-pointer hover:bg-emerald-500/15 rounded-2xl transition-all"
                  onClick={() => handleNav('schemes')}
                  title="75% Better Scheme Awareness (Browse Schemes)"
                />
                <div 
                  className="absolute top-[39%] left-[78%] w-[19%] h-[15%] cursor-pointer hover:bg-emerald-500/15 rounded-2xl transition-all"
                  onClick={() => handleNav('verify')}
                  title="Faster Access to Services (Verify Scheme)"
                />
                <div 
                  className="absolute top-[54%] left-[57%] w-[19%] h-[15%] cursor-pointer hover:bg-emerald-500/15 rounded-2xl transition-all"
                  onClick={() => setShowOnboardingModal(true)}
                  title="13 Indian Languages (Language Preferences)"
                />
                <div 
                  className="absolute top-[54%] left-[78%] w-[19%] h-[15%] cursor-pointer hover:bg-emerald-500/15 rounded-2xl transition-all"
                  onClick={() => handleNav('finance')}
                  title="Data-Driven Rural Growth (Plan Finance)"
                />

                {/* Big Primary CTA Button: 'Empower Your Village with GramNiti AI' */}
                <div 
                  className="absolute top-[74%] left-[23%] w-[54%] h-[14%] cursor-pointer hover:bg-amber-400/20 rounded-full transition-all ring-4 ring-transparent hover:ring-[#EAB308]/60 shadow-xl"
                  onClick={() => handleNav('dashboard')}
                  title="Empower Your Village with GramNiti AI (Open Dashboard)"
                />
              </>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
