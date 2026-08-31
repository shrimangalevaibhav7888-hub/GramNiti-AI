import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { GramNitiLogo } from '../common/GramNitiLogo';
import { 
  Globe, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink,
  User
} from 'lucide-react';

/**
 * Header
 * Clean, authoritative Government of India digital portal header.
 * Ministry of Social Justice and Empowerment + Digital India styling.
 */
export const Header = ({ activeTab, setActiveTab }) => {
  const { 
    language, 
    setLanguage, 
    preferredLanguages, 
    supportedLanguages, 
    setShowOnboardingModal,
    t 
  } = useLanguage();

  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', tab: 'home' },
    { id: 'about', label: 'About', tab: 'overview' },
    { id: 'how-it-works', label: 'How It Works', tab: 'overview' },
    { id: 'services', label: 'Services', tab: 'advisor' },
    { id: 'schemes', label: 'Schemes', tab: 'schemes' },
    { id: 'impact', label: 'Impact', tab: 'overview' },
    { id: 'resources', label: 'Resources', tab: 'documents' }
  ];

  const currentLangMeta = supportedLanguages.find(l => l.code === language) || {
    code: 'en',
    name: 'English',
    nativeName: 'English'
  };

  const handleNavClick = (tabId) => {
    if (setActiveTab) {
      setActiveTab(tabId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-xs">
      
      {/* 1. 🇮🇳 Top Official Government Banner */}
      <div className="bg-[#14532D] text-white text-[11px] sm:text-xs py-1.5 px-4 sm:px-8 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Ministry & Government of India Header */}
          <div className="flex items-center gap-2.5">
            {/* Ashoka Stambh Emblem SVG */}
            <svg className="w-4 h-5 sm:w-5 sm:h-6 text-amber-300 shrink-0" viewBox="0 0 24 30" fill="currentColor">
              <path d="M12 2C10.5 2 9.5 3 9.5 4.5C9.5 5.5 10 6.2 10.8 6.6C10.3 7 10 7.7 10 8.5C10 9.8 11 10.8 12.3 11C12.1 11.3 12 11.6 12 12C12 12.6 12.4 13 13 13H15C15.6 13 16 12.6 16 12C16 11.4 15.6 11 15 11H13.8C14.5 10.4 15 9.5 15 8.5C15 7.1 13.9 6 12.5 6C13.3 5.6 14 4.7 14 3.5C14 2 12.8 2 12 2Z" />
              <rect x="3" y="17" width="18" height="2" rx="1" />
              <circle cx="12" cy="20" r="1.5" />
              <rect x="2" y="22" width="20" height="2" rx="1" />
              <text x="12" y="29" fontSize="4.5" textAnchor="middle" fontWeight="bold" fill="currentColor">सत्यमेव जयते</text>
            </svg>

            <div className="flex items-center gap-2 divide-x divide-emerald-700/60">
              <span className="font-semibold text-emerald-100 hidden md:inline">
                Ministry of Social Justice and Empowerment
              </span>
              <span className="font-bold text-white pl-2">
                Government of India
              </span>
            </div>
          </div>

          {/* Right: National Portal & Accessibility Links */}
          <div className="flex items-center gap-3 text-[11px] text-emerald-200">
            <span className="hidden sm:inline">• National Decision-Support Portal</span>
            <button
              type="button"
              onClick={() => setShowOnboardingModal(true)}
              className="text-[#EAB308] hover:text-white underline decoration-dotted font-medium flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              <span>13 Indian Languages</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 🏛 Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Left: GramNiti AI Official Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-left focus:outline-none cursor-pointer"
            >
              <GramNitiLogo size="md" showTagline={true} taglineText="Government of India AI Decision Portal" />
            </button>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const isActive = activeTab === item.tab && item.id === 'home';
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.tab)}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#DCFCE7] text-[#14532D] font-bold shadow-2xs'
                      : 'text-slate-700 hover:text-[#14532D] hover:bg-slate-100/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Language Selector, Login & Get Started CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#166534]" />
                <span>{currentLangMeta.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 top-10 w-56 bg-white text-slate-900 shadow-2xl rounded-2xl border border-slate-200 p-2 z-50 animate-in fade-in">
                  <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1 tracking-wider border-b border-slate-100 mb-1">
                    13 Indian Languages Supported
                  </div>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {supportedLanguages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                          language === l.code
                            ? 'bg-[#DCFCE7] text-[#14532D] font-bold'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span>{l.name}</span>
                        <span className="text-[11px] text-slate-400 font-normal">{l.nativeName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Login / Portal Access */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => handleNavClick('dashboard')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-[#14532D] hover:bg-emerald-100 border border-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>{currentUser?.full_name || 'My Dashboard'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal(1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Get Started CTA */}
            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  handleNavClick('dashboard');
                } else {
                  openAuthModal(1);
                }
              }}
              className="px-4.5 py-2.5 bg-[#14532D] hover:bg-[#0A230C] text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Start Journey'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. 📱 Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.tab)}
                className="px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-[#14532D] rounded-xl border border-slate-100"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setShowOnboardingModal(true);
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl text-center"
            >
              Language ({currentLangMeta.name})
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('advisor')}
              className="flex-1 py-2 text-xs font-bold text-white bg-[#14532D] rounded-xl text-center shadow-xs"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
