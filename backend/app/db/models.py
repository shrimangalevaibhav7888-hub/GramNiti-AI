"""
SQLAlchemy Database Models for GramNiti AI
Complete schema supporting users, location intelligence, business metrics,
versioned government schemes, deterministic rules, verification audit trails,
simulations, risk assessments, and recommendation evidence.
"""

from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(String(64), primary_key=True, index=True)
    full_name = Column(String(128), nullable=True)
    phone_or_email = Column(String(128), unique=True, index=True, nullable=True)
    password_hash = Column(String(256), nullable=True)
    preferred_language = Column(String(16), default="en")  # en, hi, mr, bn, gu, pa, ta, te, kn, ml, or, as, ur
    preferred_languages = Column(JSON, default=lambda: ["en"])
    onboarding_completed = Column(Boolean, default=False)
    auth_token = Column(String(128), nullable=True, index=True)
    token_expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_active_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class UserProfile(Base):
    __tablename__ = "user_profiles"

    profile_id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.user_id"), nullable=False)
    name = Column(String(128), default="Kisan Entrepreneur")
    age = Column(Integer, default=32)
    gender = Column(String(16), default="Male")  # Male, Female, Other
    social_category = Column(String(32), default="General")  # General, OBC, SC, ST, Minority, Women, Ex-Serviceman
    occupation = Column(String(64), default="Farmer")
    education = Column(String(64), default="Secondary School (10th)")
    skills = Column(JSON, default=list)  # ["dairy_management", "animal_care", "agriculture"]
    annual_income_range = Column(String(64), default="1,00,000 - 2,50,000")
    annual_income_inr = Column(Float, default=180000.0)
    available_capital = Column(Float, default=30000.0)
    business_interest = Column(String(64), default="Dairy Farming")
    desired_loan_amount = Column(Float, default=200000.0)
    is_rural = Column(Boolean, default=True)
    state = Column(String(64), default="Maharashtra")
    district = Column(String(64), default="Pune")
    village_name = Column(String(128), default="Baramati")
    location_id = Column(String(64), nullable=True)
    preferred_languages = Column(JSON, default=lambda: ["en"])
    preferred_language = Column(String(16), default="en")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Location(Base):
    __tablename__ = "locations"

    location_id = Column(String(64), primary_key=True, index=True)
    village_name = Column(String(128), index=True)
    gram_panchayat = Column(String(128))
    block_taluka = Column(String(128), index=True)
    district = Column(String(128), index=True)
    state = Column(String(128), index=True)
    pincode = Column(String(16), index=True)
    population = Column(Integer, default=3500)
    primary_livelihood = Column(String(128), default="Agriculture & Allied Livestock")
    agricultural_produce = Column(JSON, default=list)  # ["Sugarcane", "Wheat", "Soybean", "Vegetables"]
    livestock_population = Column(JSON, default=dict)  # {"Cattle": 1200, "Buffalo": 850, "Goats": 600}
    market_access_distance_km = Column(Float, default=6.5)
    bank_branch_distance_km = Column(Float, default=3.2)
    cold_storage_available = Column(Boolean, default=False)
    power_reliability_hours_per_day = Column(Float, default=18.0)
    water_availability = Column(String(32), default="Canal & Borewell")
    is_demo_data = Column(Boolean, default=True)


class Business(Base):
    __tablename__ = "businesses"

    business_id = Column(String(64), primary_key=True, index=True)
    code = Column(String(64), unique=True, index=True)
    name = Column(String(128))
    name_hi = Column(String(128))
    name_mr = Column(String(128))
    sector = Column(String(64))  # Livestock, Agro-Processing, Manufacturing, Retail, Services
    description = Column(Text)
    min_investment = Column(Float)
    typical_investment = Column(Float)
    max_investment = Column(Float)
    typical_own_contribution_pct = Column(Float, default=10.0)
    equipment_needed = Column(JSON, default=list)
    working_capital_months = Column(Integer, default=3)
    typical_revenue_monthly = Column(Float)
    typical_expenses_monthly = Column(Float)
    profit_margin_range = Column(String(64))  # "22% - 35%"
    break_even_months = Column(Integer, default=8)
    key_risks = Column(JSON, default=list)
    mitigation_strategies = Column(JSON, default=list)
    required_documents = Column(JSON, default=list)
    default_assumptions = Column(JSON, default=dict)


class Scheme(Base):
    __tablename__ = "schemes"

    scheme_id = Column(String(64), primary_key=True, index=True)
    code = Column(String(64), unique=True, index=True)  # PMEGP, PMFME, PMMY_KISHORE, AHIDF, NLM_EDP, STANDUP_INDIA, AIF
    name = Column(String(256))
    official_name = Column(String(256))
    category = Column(String(64))  # Central Sector, Centrally Sponsored, State Scheme
    ministry = Column(String(256))
    implementing_agency = Column(String(256))
    source_id = Column(String(64))
    target_beneficiaries = Column(JSON, default=list)
    state_applicability = Column(JSON, default=list)  # ["ALL"] or specific state list
    district_applicability = Column(JSON, default=list)  # ["ALL"]
    
    # Eligibility criteria
    min_age = Column(Integer, default=18)
    max_age = Column(Integer, default=65)
    max_annual_income = Column(Float, nullable=True)
    category_criteria = Column(JSON, default=list)  # ["General", "OBC", "SC", "ST", "Women", "Minority"]
    occupation_criteria = Column(JSON, default=list)
    business_types = Column(JSON, default=list)
    education_criteria = Column(String(128), default="None")
    
    # Financial parameters
    min_loan_amount = Column(Float, default=10000.0)
    max_loan_amount = Column(Float, default=1000000.0)
    subsidy_percentage_general_rural = Column(Float, default=0.0)
    subsidy_percentage_special_rural = Column(Float, default=0.0)
    subsidy_description = Column(Text)
    interest_subvention = Column(String(128), default="Standard Bank Rates")
    margin_money_percentage_general = Column(Float, default=10.0)
    margin_money_percentage_special = Column(Float, default=5.0)
    repayment_period_months = Column(Integer, default=60)
    moratorium_months = Column(Integer, default=6)
    
    # Document requirements
    required_documents = Column(JSON, default=list)
    
    # Versioning & Freshness metadata
    official_portal_url = Column(String(512))
    guidelines_pdf_url = Column(String(512), nullable=True)
    effective_from = Column(String(32), default="2020-04-01")
    effective_to = Column(String(32), nullable=True)
    superseded_by = Column(String(64), nullable=True)
    last_verified_at = Column(String(32), default="2026-08-01")
    source_published_at = Column(String(32), default="2020-06-01")
    source_updated_at = Column(String(32), default="2024-05-10")
    verification_method = Column(String(64), default="MINISTRY_PORTAL")
    status = Column(String(32), default="ACTIVE")  # ACTIVE, EXPIRED, SUPERSEDED, UNDER_REVIEW
    
    # Central vs State Govt Classification
    scheme_tier = Column(String(32), default="CENTRAL")  # CENTRAL, STATE, CENTRALLY_SPONSORED
    state_name = Column(String(128), default="Central (Pan-India)")
    funding_pattern = Column(String(128), default="100% Central Government")
    stacking_eligible = Column(Boolean, default=True)
    stacking_notes = Column(Text, nullable=True)


class SchemeVerification(Base):
    __tablename__ = "scheme_verifications"

    verification_id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), nullable=True)
    scheme_name = Column(String(256), nullable=True)
    submitted_text = Column(Text, nullable=True)
    submitted_url = Column(String(512), nullable=True)
    official_source = Column(String(256), nullable=True)
    official_domain = Column(String(128), nullable=True)
    
    # Verification Signals & Evidence
    scheme_exists = Column(Boolean, default=False)
    details_match = Column(Boolean, default=False)
    eligibility_match = Column(Boolean, default=False)
    loan_match = Column(Boolean, default=False)
    subsidy_match = Column(Boolean, default=False)
    domain_signal = Column(String(64), default="UNKNOWN")  # OFFICIAL_GOV, AUTHORITATIVE_INSTITUTIONAL, NON_GOV_NEUTRAL, SUSPICIOUS
    fraud_indicators = Column(JSON, default=list)
    evidence_breakdown = Column(JSON, default=list)
    
    # Verification Assessment & Confidence
    verification_score = Column(Float, default=0.0)  # 0 to 100 confidence
    risk_level = Column(String(32), default="NEEDS_VERIFICATION")  # LOW, MEDIUM, HIGH
    verification_status = Column(String(32), default="NEEDS_VERIFICATION")
    # Allowed statuses: VERIFIED, NEEDS_VERIFICATION, HIGH_RISK, VERIFICATION_UNAVAILABLE, EXPIRED, UNDER_REVIEW
    
    safety_recommendation = Column(Text)
    disclaimer = Column(Text)
    last_verified = Column(DateTime(timezone=True), server_default=func.now())


class EligibilityResult(Base):
    __tablename__ = "eligibility_results"

    result_id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), nullable=False)
    scheme_id = Column(String(64), ForeignKey("schemes.scheme_id"), nullable=False)
    is_eligible = Column(Boolean, default=False)
    status = Column(String(32), default="POTENTIALLY_ELIGIBLE")  # ELIGIBLE, POTENTIALLY_ELIGIBLE, NOT_ELIGIBLE
    criteria_breakdown = Column(JSON, default=list)  # List of condition checks with pass/fail and explanations
    missing_criteria = Column(JSON, default=list)
    subsidy_rate = Column(Float, default=0.0)
    margin_money_rate = Column(Float, default=10.0)
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())


class FinancialPlan(Base):
    __tablename__ = "financial_plans"

    plan_id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), nullable=False)
    business_id = Column(String(64), nullable=True)
    scheme_id = Column(String(64), nullable=True)
    project_cost = Column(Float, default=200000.0)
    own_contribution = Column(Float, default=20000.0)
    own_contribution_pct = Column(Float, default=10.0)
    eligible_subsidy_amount = Column(Float, default=50000.0)
    eligible_subsidy_pct = Column(Float, default=25.0)
    loan_amount = Column(Float, default=180000.0)
    interest_rate_pct = Column(Float, default=8.5)
    tenure_months = Column(Integer, default=60)
    monthly_emi = Column(Float, default=3694.0)
    total_interest = Column(Float, default=41640.0)
    total_repayment = Column(Float, default=221640.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Simulation(Base):
    __tablename__ = "simulations"

    simulation_id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), nullable=False)
    business_id = Column(String(64), nullable=False)
    assumptions_data = Column(JSON, default=list)  # Detailed list with parameter, value, unit, min, max, source, last_updated
    best_case_data = Column(JSON, default=dict)
    normal_case_data = Column(JSON, default=dict)
    worst_case_data = Column(JSON, default=dict)
    break_even_months_estimate = Column(Integer, default=9)
    is_estimate = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    assessment_id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), nullable=False)
    business_id = Column(String(64), nullable=False)
    overall_risk_score = Column(Float, default=35.0)  # 0 to 100
    risk_level = Column(String(32), default="LOW")  # LOW, MEDIUM, HIGH
    factors = Column(JSON, default=list)  # Rule-based factors contributing to score
    mitigation_tips = Column(JSON, default=list)
    assessed_at = Column(DateTime(timezone=True), server_default=func.now())


class RecommendationEvidence(Base):
    __tablename__ = "recommendation_evidence"

    evidence_id = Column(String(64), primary_key=True, index=True)
    recommendation_id = Column(String(64), index=True)
    user_id = Column(String(64))
    business_id = Column(String(64))
    factor = Column(String(128))  # e.g., "Capital Fit", "Local Demand", "Perishability / Cold Chain"
    value = Column(String(256))
    impact = Column(String(32))  # "POSITIVE", "NEUTRAL", "CAUTION"
    source = Column(String(128))  # "Village Livelihood Dataset", "User Profile"
    explanation = Column(Text)


class Document(Base):
    __tablename__ = "documents"

    doc_id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), nullable=False)
    doc_type = Column(String(64))  # AADHAAR, PAN, INCOME_CERTIFICATE, 7_12_EXTRACT, BANK_STATEMENT, PROJECT_REPORT
    doc_name = Column(String(256))
    file_path = Column(String(512), nullable=True)
    ocr_detected_type = Column(String(64), nullable=True)
    ocr_confidence = Column(Float, default=0.0)
    extracted_metadata = Column(JSON, default=dict)
    is_demo_ocr = Column(Boolean, default=True)
    status = Column(String(32), default="UPLOADED")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base):
    __tablename__ = "audit_logs"

    log_id = Column(String(64), primary_key=True, index=True)
    action = Column(String(128))
    entity_type = Column(String(64))
    entity_id = Column(String(64), nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
