import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGramNiti } from '../../contexts/GramNitiContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Languages, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  AlertCircle,
  HelpCircle,
  Check,
  ChevronRight,
  TrendingUp,
  Landmark
} from 'lucide-react';

export const AuthOnboardingModal = ({ setActiveTab }) => {
  const { t, language, setLanguage, preferredLanguages, setPreferredLanguages } = useLanguage();
  const { locations, businesses, selectLocation, selectBusiness, updateUserProfile, userProfile } = useGramNiti();
  const { 
    currentUser, 
    isAuthenticated, 
    showAuthModal, 
    initialModalStep, 
    signup, 
    login, 
    saveOnboarding, 
    closeAuthModal 
  } = useAuth();

  const [step, setStep] = useState(1);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'login'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1-3 Languages Selection State
  const [selectedLangs, setSelectedLangs] = useState(['en']);

  // Basic Profile State
  const [profileData, setProfileData] = useState({
    name: '',
    age: 32,
    gender: 'Male',
    social_category: 'General',
    occupation: 'Farmer',
    education: 'Secondary School (10th)',
    annual_income_inr: 180000,
    available_capital: 30000,
    is_rural: true,
  });

  // Location State
  const [selectedLocationId, setSelectedLocationId] = useState('LOC_BARAMATI_01');
  const [customVillage, setCustomVillage] = useState('Baramati');
  const [customDistrict, setCustomDistrict] = useState('Pune');
  const [customState, setCustomState] = useState('Maharashtra');

  // Business Interest State
  const [selectedBusinessCode, setSelectedBusinessCode] = useState('DAIRY_FARMING');
  const [desiredLoanAmount, setDesiredLoanAmount] = useState(200000);

  const availableLanguages = [
    { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
    { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'as', label: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳' },
    { code: 'ur', label: 'Urdu', native: 'اردو', flag: '🇮🇳' },
  ];

  useEffect(() => {
    if (showAuthModal) {
      setStep(initialModalStep || 1);
      setErrorMsg(null);
      if (currentUser?.full_name) {
        setFullName(currentUser.full_name);
        setProfileData(prev => ({ ...prev, name: currentUser.full_name }));
      }
      if (preferredLanguages && preferredLanguages.length > 0) {
        setSelectedLangs(preferredLanguages);
      }
    }
  }, [showAuthModal, initialModalStep, currentUser, preferredLanguages]);

  if (!showAuthModal) return null;

  // Language Toggle Handler (1 to 3 Languages)
  const toggleLanguage = (langCode) => {
    if (selectedLangs.includes(langCode)) {
      if (selectedLangs.length === 1) return; // Keep at least 1
      setSelectedLangs(selectedLangs.filter(c => c !== langCode));
    } else {
      if (selectedLangs.length >= 3) {
        // Replace last chosen language
        setSelectedLangs([selectedLangs[0], selectedLangs[1], langCode]);
      } else {
        setSelectedLangs([...selectedLangs, langCode]);
      }
    }
  };

  // Step 1: Handle Auth Submit
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (authMode === 'signup') {
        if (!fullName.trim() || !phoneOrEmail.trim() || !password.trim()) {
          throw new Error('Please fill in all required registration fields.');
        }
        if (password.length < 6) {
          throw new Error('Password should be at least 6 characters.');
        }
        const user = await signup(fullName, phoneOrEmail, password, selectedLangs);
        setProfileData(prev => ({ ...prev, name: fullName }));
        setStep(2); // Proceed to Language Selection
      } else {
        if (!phoneOrEmail.trim() || !password.trim()) {
          throw new Error('Please provide your phone number/email and password.');
        }
        const user = await login(phoneOrEmail, password);
        if (user.onboarding_completed && user.profile) {
          // Sync profile into GramNitiContext
          updateUserProfile(user.profile);
          closeAuthModal();
          if (setActiveTab) setActiveTab('dashboard');
        } else {
          setStep(2); // Incomplete onboarding, continue
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 -> 3: Confirm Languages
  const handleConfirmLanguages = () => {
    setPreferredLanguages(selectedLangs);
    if (selectedLangs.length > 0) {
      setLanguage(selectedLangs[0]);
    }
    setStep(3);
  };

  // Step 3 -> 4: Confirm Profile
  const handleConfirmProfile = () => {
    setStep(4);
  };

  // Step 4 -> 5: Confirm Location
  const handleConfirmLocation = () => {
    const loc = locations.find(l => l.location_id === selectedLocationId);
    if (loc) {
      selectLocation(loc);
      setCustomVillage(loc.village_name);
      setCustomDistrict(loc.district);
      setCustomState(loc.state);
    }
    setStep(5);
  };

  // Step 5 -> Complete Onboarding & Open Dashboard
  const handleCompleteOnboarding = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const loc = locations.find(l => l.location_id === selectedLocationId) || {
        location_id: selectedLocationId,
        village_name: customVillage,
        district: customDistrict,
        state: customState,
      };

      const biz = businesses.find(b => b.code === selectedBusinessCode) || businesses[0];

      const onboardingPayload = {
        user_id: currentUser?.user_id || 'USR_GUEST',
        preferred_languages: selectedLangs,
        profile: {
          ...profileData,
          name: profileData.name || fullName || 'Rural Entrepreneur',
        },
        location: {
          location_id: selectedLocationId,
          village_name: customVillage,
          district: customDistrict,
          state: customState,
        },
        business_interest: {
          business_id: biz?.business_id || 'BIZ_DAIRY_FARMING',
          business_name: biz?.name || 'Dairy Farming',
          desired_loan_amount: desiredLoanAmount,
        }
      };

      // Save to SQLite backend
      const res = await saveOnboarding(onboardingPayload);

      // Sync into global state
      if (loc) selectLocation(loc);
      if (biz) selectBusiness(biz);
      updateUserProfile({
        ...profileData,
        name: profileData.name || fullName || 'Rural Entrepreneur',
        location_id: selectedLocationId,
        is_rural: profileData.is_rural,
        business_interest: biz?.name,
        desired_loan_amount: desiredLoanAmount,
      });

      closeAuthModal();
      if (setActiveTab) {
        setActiveTab('dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete onboarding. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // Skip / Continue as Guest
  const handleContinueAsGuest = () => {
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#0B2559] via-[#072B61] to-[#14532D] text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                🌾 GramNiti AI
              </span>
              <span className="bg-white/10 text-slate-200 text-[11px] px-2.5 py-0.5 rounded-full">
                Step {step} of 5
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-heading font-extrabold text-white tracking-tight">
              {step === 1 && (authMode === 'signup' ? 'Rural Entrepreneur Registration' : 'Rural Entrepreneur Login')}
              {step === 2 && 'Select Preferred Languages (1 to 3)'}
              {step === 3 && 'Basic Entrepreneur Profile'}
              {step === 4 && 'Your Village & Enterprise Location'}
              {step === 5 && 'Select Business Interest & Investment'}
            </h2>
            <p className="text-xs text-slate-300">
              {step === 1 && 'Securely create or access your rural enterprise decision profile.'}
              {step === 2 && 'Choose up to 3 Indian languages for voice audio and portal navigation.'}
              {step === 3 && 'Enter demographic details to dynamically calculate maximum scheme subsidies.'}
              {step === 4 && 'Pinpoint your district and rural area for hyper-local feasibility.'}
              {step === 5 && 'Choose your business goal and simulate real financials on the dashboard.'}
            </p>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-slate-100 h-1.5 w-full shrink-0">
          <div 
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-900 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Sign Up / Login */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              {/* Toggle Switch */}
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setErrorMsg(null); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-[#14532D] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create New Account (Sign Up)
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setErrorMsg(null); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-[#14532D] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Existing User (Login)
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name (संपूर्ण नाव / पूरा नाम) *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Patil"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number or Email (मोबाईल क्रमांक / ईमेल) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      placeholder="e.g. 9876543210 or email@example.com"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password (पासवर्ड) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter secure password (min 6 chars)"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#14532D] hover:bg-[#0F3E22] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{authMode === 'signup' ? 'Continue to Language Selection' : 'Login to GramNiti Dashboard'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                >
                  Explore as Guest (पाहुणा म्हणून पुढे जा)
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Language Selection (1-3 Indian Languages) */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                <span className="font-semibold">Selected Languages: {selectedLangs.length} of 3</span>
                <span className="font-mono text-[#14532D] font-bold">
                  Primary: {availableLanguages.find(l => l.code === selectedLangs[0])?.native}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[46vh] overflow-y-auto pr-1">
                {availableLanguages.map((l) => {
                  const isSelected = selectedLangs.includes(l.code);
                  const isPrimary = selectedLangs[0] === l.code;

                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => toggleLanguage(l.code)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{l.flag}</span>
                        {isSelected && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                            isPrimary ? 'bg-emerald-600 text-white' : 'bg-emerald-200 text-emerald-900'
                          }`}>
                            {isPrimary ? 'Primary' : 'Added'}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs">{l.native}</div>
                        <div className="text-[11px] text-slate-500">{l.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmLanguages}
                  className="px-6 py-2.5 bg-[#14532D] hover:bg-[#0F3E22] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Continue to Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Basic Profile */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Applicant Name</label>
                  <input
                    type="text"
                    value={profileData.name || fullName}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age (वय)</label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    value={profileData.age}
                    onChange={(e) => setProfileData({ ...profileData, age: parseInt(e.target.value) || 18 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender (लिंग)</label>
                  <select
                    value={profileData.gender}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Male">Male (पुरुष)</option>
                    <option value="Female">Female (महिला - Special 35% Subsidy)</option>
                    <option value="Other">Other (इतर)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Social Category (वर्ग / जात)</label>
                  <select
                    value={profileData.social_category}
                    onChange={(e) => setProfileData({ ...profileData, social_category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="General">General (खुला प्रवर्ग - 25% Subsidy)</option>
                    <option value="OBC">OBC (इतर मागासवर्गीय - 35% Special)</option>
                    <option value="SC">SC (अनुसूचित जाती - 35% Special)</option>
                    <option value="ST">ST (अनुसूचित जमाती - 35% Special)</option>
                    <option value="Minority">Minority (अल्पसंख्याक - 35% Special)</option>
                    <option value="Ex-Serviceman">Ex-Serviceman (माजी सैनिक - 35% Special)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Education (शिक्षण)</label>
                  <select
                    value={profileData.education}
                    onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Secondary School (10th)">10th Standard (१० वी)</option>
                    <option value="8th Standard Pass">8th Standard (८ वी)</option>
                    <option value="Higher Secondary (12th)">12th Standard (१२ वी)</option>
                    <option value="Graduate">Graduate / Degree (पदवीधर)</option>
                    <option value="Vocational / ITI">Vocational / ITI (आयटीआय)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Annual Family Income (वार्षिक उत्पन्न)</label>
                  <input
                    type="number"
                    step="10000"
                    value={profileData.annual_income_inr}
                    onChange={(e) => setProfileData({ ...profileData, annual_income_inr: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmProfile}
                  className="px-6 py-2.5 bg-[#14532D] hover:bg-[#0F3E22] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Continue to Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Location */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Select Benchmark Location</label>
                  <select
                    value={selectedLocationId}
                    onChange={(e) => setSelectedLocationId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium cursor-pointer"
                  >
                    {locations.map((loc) => (
                      <option key={loc.location_id} value={loc.location_id}>
                        {loc.village_name}, {loc.district}, {loc.state} (Pop: {loc.population})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Village / Town Name</label>
                  <input
                    type="text"
                    value={customVillage}
                    onChange={(e) => setCustomVillage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    placeholder="Enter village name"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">District (जिल्हा)</label>
                  <input
                    type="text"
                    value={customDistrict}
                    onChange={(e) => setCustomDistrict(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    placeholder="Enter district"
                  />
                </div>

                <div className="sm:col-span-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block text-xs">Location Classification: Rural Area (ग्रामीण भाग)</span>
                    <span className="text-[11px] text-slate-600">Qualifies for maximum 35% margin money subsidy under PMEGP/PMFME.</span>
                  </div>
                  <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
                    Rural (Active)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmLocation}
                  className="px-6 py-2.5 bg-[#14532D] hover:bg-[#0F3E22] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Continue to Business</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Business Interest */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="font-bold text-xs text-slate-700 block mb-2">
                  Select Target Rural Enterprise:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[36vh] overflow-y-auto pr-1">
                  {businesses.map((biz) => {
                    const isSelected = selectedBusinessCode === biz.code;
                    const bizName = language === 'mr' ? biz.name_mr : language === 'hi' ? biz.name_hi : biz.name;

                    return (
                      <button
                        key={biz.code}
                        type="button"
                        onClick={() => setSelectedBusinessCode(biz.code)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                          <Briefcase className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-bold text-xs">{bizName}</div>
                          <div className="text-[11px] text-slate-500">
                            Sector: {biz.sector} • Margin: {biz.profit_margin_range}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Desired Project Investment / Loan Scale:</span>
                  <span className="font-mono text-[#14532D] text-sm font-extrabold">
                    ₹{desiredLoanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2500000"
                  step="25000"
                  value={desiredLoanAmount}
                  onChange={(e) => setDesiredLoanAmount(parseInt(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompleteOnboarding}
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#14532D] hover:bg-[#0F3E22] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Onboarding & Launch Dashboard</span>
                      <Sparkles className="w-4 h-4 text-[#EAB308]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
