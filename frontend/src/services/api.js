/**
 * GramNiti API Client Service
 * Interacts with FastAPI backend endpoints.
 */

const API_BASE = (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api/v1` : '/api/v1');

async function fetchJSON(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed [${url}]:`, error);
    throw error;
  }
}

export const api = {
  // Locations
  getLocations: () => fetchJSON('/locations'),
  getLocation: (id) => fetchJSON(`/locations/${id}`),

  // Businesses
  getBusinesses: () => fetchJSON('/businesses'),
  getBusiness: (id) => fetchJSON(`/businesses/${id}`),
  recommendBusinesses: (userProfile, locationId) =>
    fetchJSON('/business/recommend', {
      method: 'POST',
      body: JSON.stringify({ user_profile: userProfile, location_id: locationId }),
    }),
  getBusinessFeasibility: (businessId, locationId, userProfile = null) =>
    fetchJSON('/business/feasibility', {
      method: 'POST',
      body: JSON.stringify({
        business_id: businessId,
        location_id: locationId,
        user_profile: userProfile,
      }),
    }),

  // Schemes
  getSchemes: (search = '') => fetchJSON(`/schemes${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getScheme: (id) => fetchJSON(`/schemes/${id}`),

  // Verification & Fraud Detection
  verifyScheme: (submittedText, submittedUrl = null) =>
    fetchJSON('/schemes/verify', {
      method: 'POST',
      body: JSON.stringify({ submitted_text: submittedText, submitted_url: submittedUrl }),
    }),

  // Deterministic Eligibility
  checkEligibility: (schemeId, userProfile) =>
    fetchJSON('/schemes/check-eligibility', {
      method: 'POST',
      body: JSON.stringify({ scheme_id: schemeId, user_profile: userProfile }),
    }),

  // Deterministic Financial Calculator
  calculateEMI: (principal, annualInterestRatePct, tenureMonths, repaymentFrequency = 'MONTHLY') =>
    fetchJSON('/finance/calculate-emi', {
      method: 'POST',
      body: JSON.stringify({
        principal: principal,
        annual_interest_rate_pct: annualInterestRatePct,
        tenure_months: tenureMonths,
        repayment_frequency: repaymentFrequency,
      }),
    }),

  structureProjectFinance: (totalProjectCost, ownContributionPct, subsidyPct, annualInterestRatePct = 8.5, tenureMonths = 60, repaymentFrequency = 'MONTHLY', schemeId = null, userCategory = 'General', isRural = true) =>
    fetchJSON('/finance/structure-project', {
      method: 'POST',
      body: JSON.stringify({
        total_project_cost: totalProjectCost,
        own_contribution_pct: ownContributionPct,
        subsidy_pct: subsidyPct,
        annual_interest_rate_pct: annualInterestRatePct,
        tenure_months: tenureMonths,
        repayment_frequency: repaymentFrequency,
        scheme_id: schemeId,
        user_category: userCategory,
        is_rural: isRural
      }),
    }),

  routeMarginScheme: (availableMarginCapital = 100000, repaymentFrequency = 'QUARTERLY') =>
    fetchJSON('/finance/scheme-router', {
      method: 'POST',
      body: JSON.stringify({
        available_margin_capital: availableMarginCapital,
        repayment_frequency: repaymentFrequency,
      }),
    }),

  // Provenance & Source Registry
  getSchemeProvenance: (schemeId) => fetchJSON(`/provenance/scheme/${schemeId}`),
  getLocationProvenance: (locationId) => fetchJSON(`/provenance/location/${locationId}`),

  // 3-Scenario Business Simulation
  simulateBusiness: (businessId, assumptionsMap = {}, loanAmount = 180000, interestRate = 8.5, tenureMonths = 60) =>
    fetchJSON('/business/simulate', {
      method: 'POST',
      body: JSON.stringify({
        business_id: businessId,
        assumptions_map: assumptionsMap,
        loan_amount: loanAmount,
        interest_rate: interestRate,
        tenure_months: tenureMonths,
      }),
    }),

  // Risk Assessment
  analyzeRisk: (businessId, locationId, financialPlan, simulationData) =>
    fetchJSON('/risk/analyze', {
      method: 'POST',
      body: JSON.stringify({
        business_id: businessId,
        location_id: locationId,
        financial_plan: financialPlan,
        simulation_data: simulationData,
      }),
    }),

  // Documents & DEMO OCR
  getDocumentChecklist: (businessId, schemeId) =>
    fetchJSON(`/documents/checklist?business_id=${businessId}&scheme_id=${schemeId}`),

  getSchemeDocumentRoadmap: (schemeId) =>
    fetchJSON(`/documents/scheme/${schemeId}`),

  getSchemeDocumentRequirements: (schemeId) =>
    fetchJSON(`/documents/scheme/${schemeId}`),

  uploadDemoOCR: async (filename, sampleText) => {
    const formData = new FormData();
    formData.append('filename', filename);
    if (sampleText) formData.append('sample_text', sampleText);

    const url = `${API_BASE}/documents/upload-demo-ocr`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed [${url}]:`, error);
      throw error;
    }
  },

  // Action Plan & DPR
  generateActionPlan: (payload) =>
    fetchJSON('/action-plan/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Chat AI Assistant
  askGramNiti: (query, language, contextState) =>
    fetchJSON('/chat', {
      method: 'POST',
      body: JSON.stringify({
        query: query,
        language: language,
        context_state: contextState,
      }),
    }),

  // Authentication & Rural Entrepreneur Onboarding
  signup: (payload) =>
    fetchJSON('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    fetchJSON('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  saveOnboarding: (payload, token = null) =>
    fetchJSON('/auth/onboarding', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    }),

  getCurrentUser: (token) =>
    fetchJSON('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }),

  logout: (token = null) =>
    fetchJSON('/auth/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  // Sources & Admin
  getSources: () => fetchJSON('/sources'),
  getAdminOverview: () => fetchJSON('/admin/overview'),
};
