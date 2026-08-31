import React from 'react';
import { HeroCarousel } from '../components/landing/HeroCarousel';

/**
 * HomePage
 * Premium GovTech Landing Page Presentation for GramNiti AI.
 * Displays exclusively the full-width 5-slide automated presentation with working interactive buttons,
 * 13-language audio narration, touch swipe gestures, and instant action triggers.
 * Contains no extra text or vertical sections below the presentation,
 * while all deep-dive platform sections live in their dedicated 'overview' and feature tabs.
 */
export const HomePage = ({ setActiveTab }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center animate-in fade-in py-1 sm:py-2">
      <div className="w-full max-w-7xl">
        <HeroCarousel setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};
