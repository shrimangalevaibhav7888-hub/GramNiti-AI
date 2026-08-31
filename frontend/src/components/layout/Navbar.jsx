import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGramNiti } from '../../contexts/GramNitiContext';
import { useAuth } from '../../contexts/AuthContext';
import { GramNitiLogo } from '../common/GramNitiLogo';
import { 
  Compass, 
  Landmark, 
  ShieldCheck, 
  Calculator, 
  TrendingUp, 
  FileText, 
  Bot, 
  User, 
  Menu, 
  X, 
  MapPin,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Globe,
  Settings,
  Check,
  Search,
  Layers,
  LogOut,
  LogIn
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { 
    language, 
    setLanguage, 
    preferredLanguages, 
    supportedLanguages, 
    setShowOnboardingModal,
    t, 
    isSpeaking, 
    stopAudio,
    speak
  } = useLanguage();
  
  const { currentLocation, locations, setLocation, loadDemoFarmerProfile, getJourneyStepState } = useGramNiti();
  const { currentUser, isAuthenticated, openAuthModal, logout } = useAuth();
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');

  const langDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const journey = getJourneyStepState();

  const navItems = [
    { id: 'home', label: t('nav_home') || 'Home', icon: Compass },
    { id: 'overview', label: 'Platform Overview', icon: Layers },
    { id: 'dashboard', label: 'My Dashboard', icon: Sparkles },
    { id: 'advisor', label: t('tab_business_dashboard') || 'Business Analysis', icon: TrendingUp },
    { id: 'schemes', label: t('nav_schemes') || 'Schemes', icon: Landmark },
    { id: 'verify', label: t('nav_verify') || 'Verify', icon: ShieldCheck, highlight: true },
    { id: 'finance', label: t('nav_plan') || 'Finance', icon: Calculator },
    { id: 'action-plan', label: t('nav_action_plan') || 'DPR Draft', icon: FileText },
    { id: 'chat', label: t('nav_chat') || 'Ask AI', icon: Bot }
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

  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
    setLangDropdownOpen(false);
    setLangSearch('');
  };

  const filteredLangs = supportedLanguages.filter(l => 
    l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* 1. 🇮🇳 Top Official Government Utility Ribbon */}
      <div className="bg-[#14532D] text-white text-xs py-1.5 px-4 sm:px-6 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Ministry & Emblem Header */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-5 text-amber-300 shrink-0" viewBox="0 0 24 30" fill="currentColor">
              <path d="M12 2C10.5 2 9.5 3 9.5 4.5C9.5 5.5 10 6.2 10.8 6.6C10.3 7 10 7.7 10 8.5C10 9.8 11 10.8 12.3 11C12.1 11.3 12 11.6 12 12C12 12.6 12.4 13 13 13H15C15.6 13 16 12.6 16 12C16 11.4 15.6 11 15 11H13.8C14.5 10.4 15 9.5 15 8.5C15 7.1 13.9 6 12.5 6C13.3 5.6 14 4.7 14 3.5C14 2 12.8 2 12 2Z" />
              <rect x="3" y="17" width="18" height="2" rx="1" />
              <circle cx="12" cy="20" r="1.5" />
              <rect x="2" y="22" width="20" height="2" rx="1" />
              <text x="12" y="29" fontSize="4.5" textAnchor="middle" fontWeight="bold" fill="currentColor">सत्यमेव जयते</text>
            </svg>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span className="font-semibold text-emerald-100 hidden md:inline">Ministry of Social Justice and Empowerment •</span>
              <span className="font-bold text-white">Government of India</span>
            </div>
          </div>

          {/* Location Selector & DEMO DATA Tag */}
          <div className="flex items-center gap-2 relative">
            <MapPin className="w-3.5 h-3.5 text-[#EAB308] shrink-0" />
            <button
              type="button"
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="font-semibold text-emerald-200 hover:text-white underline decoration-dotted flex items-center gap-1 text-xs cursor-pointer"
            >
              {currentLocation ? `${currentLocation.village_name}, ${currentLocation.district}` : 'Select Village'}
              <ChevronDown className="w-3 h-3" />
            </button>
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold tracking-wider">
              DEMO DATA
            </span>

            {locationDropdownOpen && (
              <div className="absolute top-7 right-0 w-80 bg-white text-slate-900 shadow-2xl rounded-2xl border border-slate-200 p-2.5 z-50 animate-in fade-in">
                <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1 tracking-wider">
                  Select Local Village Dataset
                </div>
                <div className="space-y-1 mt-1 max-h-64 overflow-y-auto">
                  {locations.map(loc => (
                    <button
                      key={loc.location_id}
                      type="button"
                      onClick={() => {
                        setLocation(loc.location_id);
                        setLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                        currentLocation?.location_id === loc.location_id
                          ? 'bg-[#DCFCE7] text-[#14532D] font-bold'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-sm">{loc.village_name}</div>
                      <div className="text-[11px] text-slate-500">{loc.block_taluka}, {loc.district}, {loc.state}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Audio Indicator & 13 Languages Direct Selector */}
          <div className="flex items-center gap-2" ref={langDropdownRef}>
            {isSpeaking && (
              <button
                type="button"
                onClick={stopAudio}
                className="bg-[#D97706] text-white px-2 py-0.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 animate-pulse cursor-pointer"
              >
                <VolumeX className="w-3 h-3" /> Stop Audio
              </button>
            )}

            {/* Direct Language Switcher Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-700/80 shadow-2xs cursor-pointer transition-all"
                title="Switch Language (13 Indian Languages Supported)"
              >
                <Globe className="w-3.5 h-3.5 text-[#EAB308]" />
                <span className="font-sans">{currentLangMeta.nativeName}</span>
                <span className="text-[10px] text-emerald-300 font-mono">({currentLangMeta.badge})</span>
                <ChevronDown className="w-3 h-3 text-emerald-300" />
              </button>

              {/* Comprehensive 13 Languages Dropdown Menu */}
              {langDropdownOpen && (
                <div className="absolute top-8 right-0 w-72 bg-white text-slate-900 shadow-2xl rounded-2xl border border-slate-200 p-2.5 z-50 animate-in fade-in max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between px-2 py-1 border-b border-slate-100 mb-2">
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Select Language (13 Languages)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setLangDropdownOpen(false);
                        setShowOnboardingModal(true);
                      }}
                      className="text-[10px] text-[#166534] font-bold hover:underline"
                    >
                      Preferences
                    </button>
                  </div>

                  {/* Quick Search */}
                  <div className="px-2 mb-2">
                    <div className="relative">
                      <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                        placeholder="Search language..."
                        className="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
                      />
                    </div>
                  </div>

                  {/* List of 13 Languages */}
                  <div className="space-y-1">
                    {filteredLangs.map((l) => {
                      const isSelected = language === l.code;
                      return (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => handleSelectLanguage(l.code)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#DCFCE7] text-[#14532D] font-bold'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-sm font-sans">{l.nativeName}</div>
                            <div className="text-[10px] text-slate-500">{l.name} • {l.region}</div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-[#16A34A] stroke-[3]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo */}
          <button 
            type="button"
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            <GramNitiLogo size="md" showTagline={true} taglineText="Government of India AI Decision Portal" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || 
                (item.id === 'finance' && (activeTab === 'finance' || activeTab === 'simulation')) ||
                (item.id === 'advisor' && activeTab === 'advisor');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#DCFCE7] text-[#14532D] font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#16A34A]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action & Profile / Auth Button */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('profile')}
                  className="hidden sm:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#14532D] border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  title="View Entrepreneur Profile"
                >
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="max-w-[110px] truncate">{currentUser?.full_name || 'Entrepreneur'}</span>
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-300 cursor-pointer"
                  title="Logout from session"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openAuthModal(1)}
                  className="inline-flex items-center gap-1.5 bg-[#14532D] hover:bg-[#0F3E22] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  title="Sign In / Register Rural Entrepreneur"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sign In / Onboard</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={loadDemoFarmerProfile}
              className="hidden xl:inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-amber-200 cursor-pointer"
              title="Load 32-year-old farmer preset"
            >
              <Sparkles className="w-3 h-3 text-[#D97706]" />
              <span>Demo Farmer</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('profile')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#14532D] text-white border-[#14532D]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Profile & Settings"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 cursor-pointer ${
                    isActive ? 'bg-[#DCFCE7] text-[#14532D]' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
