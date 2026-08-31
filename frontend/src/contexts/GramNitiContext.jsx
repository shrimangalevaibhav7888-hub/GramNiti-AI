import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const GramNitiContext = createContext();

const DEFAULT_PROFILE = {
  name: "Ramesh Patil",
  age: 32,
  gender: "Male",
  social_category: "General",
  occupation: "Farmer",
  education: "Secondary School (10th)",
  skills: ["dairy_management", "animal_care", "agriculture"],
  annual_income_inr: 180000.0,
  available_capital: 30000.0,
  business_interest: "Dairy Farming",
  desired_loan_amount: 180000.0,
  is_rural: true,
  location_id: "LOC_BARAMATI_01",
  preferred_languages: ["en"],
  primary_language: "en"
};

export const GramNitiProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('gramniti_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [feasibilityReport, setFeasibilityReport] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  
  const [verificationResult, setVerificationResult] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [financialPlan, setFinancialPlan] = useState(null);
  const [customAssumptions, setCustomAssumptions] = useState({});
  const [simulationResult, setSimulationResult] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [documentChecklist, setDocumentChecklist] = useState(null);
  const [uploadedDocCodes, setUploadedDocCodes] = useState([
    "AADHAAR", "PAN", "BANK_STATEMENT", "LAND_DOCUMENT_7_12"
  ]);
  const [actionPlan, setActionPlan] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save profile to local storage
  useEffect(() => {
    localStorage.setItem('gramniti_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Initial Data Load (Locations, Businesses, Schemes)
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const locRes = await api.getLocations();
        setLocations(locRes.locations || []);
        const activeLoc = locRes.locations?.find(l => l.location_id === userProfile.location_id) || locRes.locations?.[0];
        setCurrentLocation(activeLoc);

        const bizRes = await api.getBusinesses();
        setBusinesses(bizRes || []);

        const schemeRes = await api.getSchemes();
        setSchemes(schemeRes.schemes || []);
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Could not load reference datasets. Ensure backend is running.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // --- Dynamic Pipeline Recalculation ---
  const recalculatePipeline = useCallback(async () => {
    if (!currentLocation) return;
    try {
      setLoading(true);
      // 1. Business Recommendations
      const recs = await api.recommendBusinesses(userProfile, currentLocation.location_id);
      setRecommendations(recs);
      
      const matchedBiz = recs.find(r => r.code === selectedBusiness?.code) || recs[0];
      const activeBiz = businesses.find(b => b.business_id === matchedBiz?.business_id || b.code === matchedBiz?.code) || businesses[0];
      setSelectedBusiness(activeBiz);

      // 2. Hyper-Local Feasibility Report (Module 1)
      if (activeBiz) {
        const feas = await api.getBusinessFeasibility(activeBiz.business_id, currentLocation.location_id, userProfile);
        setFeasibilityReport(feas);
      }

      // 3. Verified Schemes
      const schemeRes = await api.getSchemes();
      const allSchemes = schemeRes.schemes || [];
      setSchemes(allSchemes);
      const activeScheme = allSchemes.find(s => s.code === (selectedScheme?.code || "PMEGP")) || allSchemes[0];
      setSelectedScheme(activeScheme);

      // 4. Scheme Verification
      if (activeScheme) {
        const verif = await api.verifyScheme(activeScheme.name, activeScheme.official_portal_url);
        setVerificationResult(verif);

        // 5. Deterministic Eligibility
        const elig = await api.checkEligibility(activeScheme.scheme_id, userProfile);
        setEligibilityResult(elig);

        // 6. Deterministic Finance
        const fin = await api.structureProjectFinance(
          activeBiz?.typical_investment || 220000,
          elig?.applicable_margin_money_pct || 10.0,
          elig?.applicable_subsidy_pct || 25.0,
          8.5,
          60,
          'MONTHLY',
          activeScheme?.scheme_id || activeScheme?.code || null,
          userProfile?.social_category || 'General',
          userProfile?.is_rural !== undefined ? userProfile.is_rural : true
        );
        setFinancialPlan(fin);

        // 7. 3-Scenario Simulation
        const sim = await api.simulateBusiness(
          activeBiz?.business_id || "BIZ_DAIRY_FARMING",
          customAssumptions,
          fin?.loan_requirement || 180000
        );
        setSimulationResult(sim);

        // 8. Deterministic Risk Assessment
        const risk = await api.analyzeRisk(
          activeBiz?.business_id || "BIZ_DAIRY_FARMING",
          currentLocation.location_id,
          fin,
          sim
        );
        setRiskAssessment(risk);

        // 9. Documents
        const docs = await api.getDocumentChecklist(activeBiz?.business_id, activeScheme.scheme_id);
        setDocumentChecklist(docs);

        // 10. Bankable Action Plan & DPR
        const dpr = await api.generateActionPlan({
          user_profile: userProfile,
          location_id: currentLocation.location_id,
          business_id: activeBiz?.business_id,
          scheme_id: activeScheme.scheme_id,
          uploaded_doc_codes: uploadedDocCodes,
          custom_assumptions: customAssumptions
        });
        setActionPlan(dpr);
      }
    } catch (err) {
      console.error("Pipeline recalculation error:", err);
    } finally {
      setLoading(false);
    }
  }, [userProfile, currentLocation, businesses, customAssumptions, uploadedDocCodes]);

  // Run pipeline when location or base business changes
  useEffect(() => {
    if (currentLocation && businesses.length > 0) {
      recalculatePipeline();
    }
  }, [currentLocation, businesses.length]);

  // Update specific business selection
  const selectBusiness = async (biz) => {
    setSelectedBusiness(biz);
    if (!currentLocation || !selectedScheme) return;
    try {
      setLoading(true);
      const feas = await api.getBusinessFeasibility(biz.business_id, currentLocation.location_id, userProfile);
      setFeasibilityReport(feas);

      const elig = await api.checkEligibility(selectedScheme.scheme_id, userProfile);
      setEligibilityResult(elig);

      const fin = await api.structureProjectFinance(
        biz.typical_investment,
        elig.applicable_margin_money_pct,
        elig.applicable_subsidy_pct,
        8.5,
        60,
        'MONTHLY',
        selectedScheme?.scheme_id || selectedScheme?.code || null,
        userProfile?.social_category || 'General',
        userProfile?.is_rural !== undefined ? userProfile.is_rural : true
      );
      setFinancialPlan(fin);

      const sim = await api.simulateBusiness(biz.business_id, customAssumptions, fin.loan_requirement);
      setSimulationResult(sim);

      const risk = await api.analyzeRisk(biz.business_id, currentLocation.location_id, fin, sim);
      setRiskAssessment(risk);

      const docs = await api.getDocumentChecklist(biz.business_id, selectedScheme.scheme_id);
      setDocumentChecklist(docs);

      const dpr = await api.generateActionPlan({
        user_profile: userProfile,
        location_id: currentLocation.location_id,
        business_id: biz.business_id,
        scheme_id: selectedScheme.scheme_id,
        uploaded_doc_codes: uploadedDocCodes,
        custom_assumptions: customAssumptions
      });
      setActionPlan(dpr);
    } catch (e) {
      console.error("Error switching business:", e);
    } finally {
      setLoading(false);
    }
  };

  // Update specific scheme selection
  const selectScheme = async (scheme) => {
    setSelectedScheme(scheme);
    if (!selectedBusiness || !currentLocation) return;
    try {
      setLoading(true);
      const verif = await api.verifyScheme(scheme.name, scheme.official_portal_url);
      setVerificationResult(verif);

      const elig = await api.checkEligibility(scheme.scheme_id, userProfile);
      setEligibilityResult(elig);

      const fin = await api.structureProjectFinance(
        selectedBusiness.typical_investment,
        elig.applicable_margin_money_pct,
        elig.applicable_subsidy_pct,
        8.5,
        60,
        'MONTHLY',
        scheme?.scheme_id || scheme?.code || null,
        userProfile?.social_category || 'General',
        userProfile?.is_rural !== undefined ? userProfile.is_rural : true
      );
      setFinancialPlan(fin);

      const sim = await api.simulateBusiness(selectedBusiness.business_id, customAssumptions, fin.loan_requirement);
      setSimulationResult(sim);

      const risk = await api.analyzeRisk(selectedBusiness.business_id, currentLocation.location_id, fin, sim);
      setRiskAssessment(risk);

      const docs = await api.getDocumentChecklist(selectedBusiness.business_id, scheme.scheme_id);
      setDocumentChecklist(docs);

      const dpr = await api.generateActionPlan({
        user_profile: userProfile,
        location_id: currentLocation.location_id,
        business_id: selectedBusiness.business_id,
        scheme_id: scheme.scheme_id,
        uploaded_doc_codes: uploadedDocCodes,
        custom_assumptions: customAssumptions
      });
      setActionPlan(dpr);
    } catch (e) {
      console.error("Error switching scheme:", e);
    } finally {
      setLoading(false);
    }
  };

  // Live Assumption changes in Simulation
  const updateAssumption = async (paramName, newValue) => {
    const updated = { ...customAssumptions, [paramName]: Number(newValue) };
    setCustomAssumptions(updated);
    if (!selectedBusiness) return;
    try {
      const sim = await api.simulateBusiness(
        selectedBusiness.business_id,
        updated,
        financialPlan?.loan_requirement || 180000
      );
      setSimulationResult(sim);

      if (currentLocation && financialPlan) {
        const risk = await api.analyzeRisk(selectedBusiness.business_id, currentLocation.location_id, financialPlan, sim);
        setRiskAssessment(risk);
      }
    } catch (e) {
      console.error("Error updating assumption:", e);
    }
  };

  // Location change handler
  const setLocation = (locId) => {
    const matched = locations.find(l => l.location_id === locId) || locations[0];
    setCurrentLocation(matched);
    setUserProfile(prev => ({ ...prev, location_id: matched.location_id }));
  };

  // Reset to default demo profile
  const loadDemoFarmerProfile = () => {
    setUserProfile(DEFAULT_PROFILE);
    if (locations.length > 0) {
      setCurrentLocation(locations[0]);
    }
  };

  // Compute 10-step journey status
  const getJourneyStepState = () => {
    const steps = [
      { id: 'profile', number: '01', title: 'Profile', isCompleted: Boolean(userProfile.name), tab: 'profile' },
      { id: 'location', number: '02', title: 'Location', isCompleted: Boolean(currentLocation), tab: 'profile' },
      { id: 'advisor', number: '03', title: 'Business & Feasibility', isCompleted: Boolean(selectedBusiness && feasibilityReport), tab: 'advisor' },
      { id: 'schemes', number: '04', title: 'Scheme', isCompleted: Boolean(selectedScheme), tab: 'schemes' },
      { id: 'verify', number: '05', title: 'Verification', isCompleted: Boolean(verificationResult), tab: 'verify' },
      { id: 'eligibility', number: '06', title: 'Eligibility', isCompleted: Boolean(eligibilityResult), tab: 'eligibility' },
      { id: 'finance', number: '07', title: 'Finance', isCompleted: Boolean(financialPlan), tab: 'finance' },
      { id: 'simulation', number: '08', title: 'Simulation', isCompleted: Boolean(simulationResult), tab: 'simulation' },
      { id: 'documents', number: '09', title: 'Documents', isCompleted: Boolean(uploadedDocCodes.length >= 3), tab: 'documents' },
      { id: 'action-plan', number: '10', title: 'Action Plan', isCompleted: Boolean(actionPlan), tab: 'action-plan' },
    ];

    const completedCount = steps.filter(s => s.isCompleted).length;
    const progressPct = Math.round((completedCount / steps.length) * 100);
    const nextIncompleteStep = steps.find(s => !s.isCompleted) || steps[steps.length - 1];

    return {
      steps,
      completedCount,
      totalSteps: steps.length,
      progressPct,
      nextStep: nextIncompleteStep,
      isAllComplete: completedCount === steps.length
    };
  };

  return (
    <GramNitiContext.Provider
      value={{
        userProfile,
        setUserProfile,
        updateProfile: setUserProfile,
        locations,
        currentLocation,
        setLocation,
        businesses,
        recommendations,
        selectedBusiness,
        selectBusiness,
        feasibilityReport,
        schemes,
        selectedScheme,
        selectScheme,
        verificationResult,
        setVerificationResult,
        eligibilityResult,
        financialPlan,
        customAssumptions,
        updateAssumption,
        simulationResult,
        riskAssessment,
        documentChecklist,
        uploadedDocCodes,
        setUploadedDocCodes,
        actionPlan,
        recalculatePipeline,
        loadDemoFarmerProfile,
        getJourneyStepState,
        loading,
        error
      }}
    >
      {children}
    </GramNitiContext.Provider>
  );
};

export const useGramNiti = () => {
  const context = useContext(GramNitiContext);
  if (!context) {
    throw new Error('useGramNiti must be used within a GramNitiProvider');
  }
  return context;
};
