"""
Unit tests for Data Provenance, Source Validator, Freshness,
and Scheme-Dependent Financial Structuring (Monthly & Quarterly).
"""

import pytest
from app.services.source_registry import SourceRegistryService, SourcePriority
from app.services.source_validator import SourceValidator
from app.services.provenance_engine import ProvenanceEngine
from app.services.freshness_engine import FreshnessEngine
from app.services.finance_engine import FinanceEngine
from app.services.verification_engine import VerificationEngine
from app.services.dpr_engine import DPREngine
from app.db.seed_data import VERIFIED_SCHEMES, DEMO_LOCATIONS, BUSINESS_TEMPLATES


def test_source_registry_and_validator():
    # Check that official government domains validate
    res_kvic = SourceValidator.validate_source("https://www.kviconline.gov.in/pmegpep/")
    assert res_kvic.is_valid is True
    assert res_kvic.priority_level == int(SourcePriority.IMPLEMENTING_AGENCY)
    assert res_kvic.is_statutory_institution is True

    # Check that non-gov institutional portals like NABARD and StandupMitra validate
    res_nabard = SourceValidator.validate_source("nabard.org")
    assert res_nabard.is_valid is True
    assert res_nabard.is_statutory_institution is True

    # Check that suspicious domains are flagged
    res_scam = SourceValidator.validate_source("http://pm-free-loan-subsidy2026.xyz")
    assert res_scam.is_valid is False
    assert res_scam.validation_status == "SUSPICIOUS"


def test_provenance_engine():
    pmegp = next(s for s in VERIFIED_SCHEMES if s["code"] == "PMEGP")
    prov_scheme = ProvenanceEngine.get_scheme_provenance(pmegp)
    assert prov_scheme.entity_type == "SCHEME"
    assert prov_scheme.source_reliability == "HIGH"
    assert prov_scheme.is_demo_data is False
    assert "kviconline.gov.in" in prov_scheme.official_url

    loc = DEMO_LOCATIONS[0]
    prov_loc = ProvenanceEngine.get_location_provenance(loc)
    assert prov_loc.is_demo_data is True
    assert "DEMO DATA" in prov_loc.disclaimer


def test_freshness_engine():
    res = FreshnessEngine.assess_freshness(
        entity_id="SCHEME_PMEGP",
        last_verified_str="2026-08-01",
        current_status="ACTIVE"
    )
    assert res.is_fresh is True
    assert res.status == "ACTIVE"

    res_expired = FreshnessEngine.assess_freshness(
        entity_id="SCHEME_OLD",
        last_verified_str="2020-01-01",
        current_status="ACTIVE",
        effective_to="2022-12-31"
    )
    assert res_expired.is_fresh is False
    assert res_expired.status == "EXPIRED"


def test_scheme_dependent_finance_and_frequencies():
    pmegp = next(s for s in VERIFIED_SCHEMES if s["code"] == "PMEGP")
    
    # Monthly Repayment for Special Rural Category (5% margin, 35% subsidy)
    fin_monthly = FinanceEngine.structure_project_finance(
        total_project_cost=500000.0,
        annual_interest_rate_pct=8.5,
        tenure_months=60,
        repayment_frequency="MONTHLY",
        scheme_rules=pmegp,
        user_category="OBC",
        is_rural=True
    )
    assert fin_monthly.own_contribution_pct == 5.0
    assert fin_monthly.own_contribution_amount == 25000.0
    assert fin_monthly.subsidy_pct == 35.0
    assert fin_monthly.subsidy_amount == 175000.0
    assert fin_monthly.loan_requirement == 475000.0
    assert fin_monthly.repayment_frequency == "MONTHLY"
    assert fin_monthly.installment_amount > 0

    # Quarterly Repayment
    fin_quarterly = FinanceEngine.structure_project_finance(
        total_project_cost=500000.0,
        annual_interest_rate_pct=8.5,
        tenure_months=60,
        repayment_frequency="QUARTERLY",
        scheme_rules=pmegp,
        user_category="OBC",
        is_rural=True
    )
    assert fin_quarterly.repayment_frequency == "QUARTERLY"
    # Quarterly installment should roughly be ~3x monthly EMI
    assert fin_quarterly.installment_amount > fin_monthly.installment_amount * 2.5


def test_verification_assessment_evidence():
    # Test scam detection with advance processing fee and personal UPI
    scam_text = "Pay processing fee of Rs 5000 to ramesh@oksbi on whatsapp for instant 100% loan approval with no documents required"
    verif = VerificationEngine.verify_submission(scam_text)
    assert verif.verification_status == "HIGH_RISK"
    assert len(verif.fraud_indicators) >= 2
    assert "not a government certification" in verif.disclaimer.lower()


def test_ai_assisted_dpr_disclaimer():
    user = {"name": "Ramesh", "social_category": "OBC", "is_rural": True}
    loc = DEMO_LOCATIONS[0]
    biz = BUSINESS_TEMPLATES[0]
    scheme = VERIFIED_SCHEMES[0]
    
    verif = VerificationEngine.verify_submission("PMEGP Scheme").model_dump()
    fin = FinanceEngine.structure_project_finance(biz["typical_investment"], scheme_rules=scheme).model_dump()
    sim = {"normal_case": {"net_cash_remaining": 15000.0}, "break_even_estimate_months": 8}
    risk = {"overall_risk_score": 30.0, "risk_level": "LOW"}
    docs = {"ready_count": 4, "total_count": 5}
    elig = {"status": "ELIGIBLE", "applicable_margin_money_pct": 5.0, "applicable_subsidy_pct": 35.0}

    dpr = DPREngine.generate_dpr_and_action_plan(
        user_profile=user, location=loc, business=biz, scheme=scheme,
        verification=verif, eligibility=elig, financial_plan=fin, simulation=sim,
        risk=risk, documents=docs
    )
    assert "AI-Assisted DPR Draft" in dpr.report_title
    assert "does not guarantee loan approval or bank sanction" in dpr.disclaimer
