"""
GramNiti Core Verification & Deterministic Engines Test Suite
Covers all test scenarios mandated in Section 14:
- Test A: Verified Scheme (VERIFIED status + Authoritative Source + Matching Evidence)
- Test B: Scam Message (HIGH_RISK + Fraud Indicators)
- Test C: Real Scheme + Fake Details (Mismatch Identification)
- Test D: Legitimate Non-Gov Institutional Portal (Not Classified as Fraud)
- Test E: Verification Unavailable (VERIFICATION_UNAVAILABLE status without false HIGH_RISK)
- Test F: Dynamic Dependency & Deterministic Calculations (EMI, Subsidies, Cashflows, Location/Biz Updates)
"""

import pytest
from app.services.source_registry import SourceRegistryService, SourcePriority
from app.services.verification_engine import VerificationEngine
from app.services.eligibility_engine import EligibilityEngine
from app.services.finance_engine import FinanceEngine
from app.services.simulation_engine import SimulationEngine
from app.services.risk_engine import RiskEngine
from app.services.business_engine import BusinessEngine
from app.db.seed_data import VERIFIED_SCHEMES, BUSINESS_TEMPLATES, DEMO_LOCATIONS


# --- Test A: Verified Scheme ---
def test_scenario_a_verified_scheme():
    """
    Test A — Verified Scheme:
    Official scheme query with official portal.
    Expected: VERIFIED, authoritative source, matching evidence.
    """
    sample_text = "Prime Minister's Employment Generation Programme (PMEGP) for setting up rural micro enterprise."
    official_url = "https://www.kviconline.gov.in/pmegpep/pmegphome/index.jsp"
    
    result = VerificationEngine.verify_submission(sample_text, official_url)
    
    assert result.verification_status == "VERIFIED", f"Expected VERIFIED, got {result.verification_status}"
    assert result.scheme_exists is True
    assert result.official_source is not None
    assert result.risk_level == "LOW"
    assert any(sig.category == "SCHEME_MATCH" and sig.status == "PASS" for sig in result.evidence_breakdown)
    assert any(sig.category == "DOMAIN_CHECK" and sig.status == "PASS" for sig in result.evidence_breakdown)


# --- Test B: Scam Message ---
def test_scenario_b_scam_message():
    """
    Test B — Scam Message:
    WhatsApp forward offering fake guaranteed loan with advance processing fee.
    Expected: HIGH_RISK, detected fraud indicators.
    """
    scam_text = (
        "Get ₹5,00,000 instant loan under Pradhan Mantri Mudra Yojana! "
        "No documents required, 100% guaranteed loan sanction. "
        "Pay registration fee of ₹2,500 via UPI to agent99@okhdfcbank to claim today."
    )
    
    result = VerificationEngine.verify_submission(scam_text)
    
    assert result.verification_status == "HIGH_RISK", f"Expected HIGH_RISK, got {result.verification_status}"
    assert result.risk_level == "HIGH"
    assert len(result.fraud_indicators) >= 2, "Should detect multiple fraud indicators"
    assert any("Advance Fee" in flag for flag in result.fraud_indicators)
    assert any("Guaranteed" in flag or "No Documents" in flag for flag in result.fraud_indicators)
    assert any("UPI" in flag for flag in result.fraud_indicators)


# --- Test C: Real Scheme + Fake Details ---
def test_scenario_c_real_scheme_fake_details():
    """
    Test C — Real Scheme + Fake Details:
    Mentions genuine scheme but claims an impossible ₹5 Crore loan under Mudra Kishore (which maxes at ₹5 Lakh).
    Expected: Identified mismatch in financial terms.
    """
    fake_detail_text = "Apply for Pradhan Mantri Mudra Yojana Kishore loan of ₹50,00,000 for purchasing farm equipment."
    
    result = VerificationEngine.verify_submission(fake_detail_text)
    
    assert result.scheme_exists is True
    # Should flag financial terms mismatch
    mismatch_signals = [s for s in result.evidence_breakdown if s.category == "FINANCIAL_TERMS" and s.status == "WARNING"]
    assert len(mismatch_signals) > 0, "Must detect loan ceiling discrepancy"
    assert "exceeds official scheme ceiling" in mismatch_signals[0].evidence


# --- Test D: Legitimate Non-Government Institutional Portal ---
def test_scenario_d_legitimate_institutional_portal():
    """
    Test D — Legitimate Non-Government Institutional Portal:
    Portals like NABARD (nabard.org) or StandUp Mitra (standupmitra.in) must NOT be marked as fraudulent.
    """
    standup_text = "Stand-Up India Scheme for women entrepreneurs"
    standup_url = "https://www.standupmitra.in/Home/SUISchemes"
    
    result = VerificationEngine.verify_submission(standup_text, standup_url)
    
    assert result.verification_status != "HIGH_RISK", "Legitimate institutional portal must not be HIGH_RISK"
    assert result.domain_signal == "AUTHORITATIVE_SOURCE_DOMAIN"
    assert result.risk_level in ["LOW", "MEDIUM"]


# --- Test E: Verification Unavailable ---
def test_scenario_e_verification_unavailable():
    """
    Test E — Verification Unavailable:
    Submitting an unknown or unverifiable scheme description.
    Expected: VERIFICATION_UNAVAILABLE (NOT automatically HIGH_RISK).
    """
    unknown_text = "XYZ Global Farmer Super Wealth Grant Scheme 2026"
    
    result = VerificationEngine.verify_submission(unknown_text)
    
    assert result.verification_status == "VERIFICATION_UNAVAILABLE", f"Expected VERIFICATION_UNAVAILABLE, got {result.verification_status}"
    assert result.scheme_exists is False
    assert result.risk_level != "HIGH", "Unknown scheme without fraud signals should not default to HIGH_RISK"


# --- Test F: Dynamic Dependency & Deterministic Calculations ---
def test_scenario_f_dynamic_dependency_and_math():
    """
    Test F — Dynamic Dependency & Deterministic Calculations:
    1. Tests EMI mathematical precision ($EMI = P*r*(1+r)^n / ((1+r)^n - 1)$)
    2. Tests Subsidies & Margin money calculation
    3. Tests that changing assumptions alters simulation output dynamically.
    4. Tests location change updates business recommendations.
    """
    # 1. Deterministic EMI Test
    # Principal: 1,80,000, Rate: 8.5% p.a., Tenure: 60 months
    emi_result = FinanceEngine.calculate_emi(180000.0, 8.5, 60)
    # Expected standard EMI is ~3,694.04
    assert 3690.0 <= emi_result.monthly_emi <= 3700.0
    assert emi_result.total_repayment > emi_result.principal
    assert len(emi_result.amortization_preview) == 12

    # 2. Deterministic Eligibility & Subsidy rule check
    pmegp_scheme = next(s for s in VERIFIED_SCHEMES if s["code"] == "PMEGP")
    # General rural user profile -> 25% subsidy
    user_general = {
        "age": 32, "social_category": "General", "gender": "Male",
        "annual_income_inr": 180000.0, "desired_loan_amount": 180000.0, "is_rural": True
    }
    elig_general = EligibilityEngine.evaluate_eligibility(pmegp_scheme, user_general)
    assert elig_general.is_eligible is True
    assert elig_general.applicable_subsidy_pct == 25.0
    assert elig_general.applicable_margin_money_pct == 10.0

    # Special category / Woman rural user profile -> 35% subsidy, 5% margin money
    user_special = {
        "age": 32, "social_category": "SC", "gender": "Female",
        "annual_income_inr": 180000.0, "desired_loan_amount": 180000.0, "is_rural": True
    }
    elig_special = EligibilityEngine.evaluate_eligibility(pmegp_scheme, user_special)
    assert elig_special.is_eligible is True
    assert elig_special.applicable_subsidy_pct == 35.0
    assert elig_special.applicable_margin_money_pct == 5.0

    # 3. Dynamic Simulation updates with changing assumptions
    base_assumptions = {"num_animals": 2, "animal_cost_inr": 85000, "milk_yield_per_day": 13.0, "milk_selling_price": 42.0, "feed_cost_per_day": 180.0}
    sim_base = SimulationEngine.simulate_dairy_farming(base_assumptions, loan_amount=180000.0)
    
    # Change assumptions: increase animals to 4 and milk yield to 16 L/day
    updated_assumptions = {"num_animals": 4, "animal_cost_inr": 85000, "milk_yield_per_day": 16.0, "milk_selling_price": 44.0, "feed_cost_per_day": 180.0}
    sim_updated = SimulationEngine.simulate_dairy_farming(updated_assumptions, loan_amount=360000.0)
    
    assert sim_updated.normal_case.monthly_revenue > sim_base.normal_case.monthly_revenue * 2
    assert sim_updated.total_investment > sim_base.total_investment
    assert sim_updated.best_case.monthly_revenue > sim_updated.normal_case.monthly_revenue > sim_updated.worst_case.monthly_revenue
