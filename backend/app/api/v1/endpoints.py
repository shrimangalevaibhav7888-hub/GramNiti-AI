"""
FastAPI REST API Endpoints for GramNiti AI
Unified endpoints linking Profile, Location, Business Advisor, Schemes,
Verification & Fraud Assessment, Eligibility, Finance, Simulation, Risk,
Documents, AI-Assisted DPR Action Plan, Chat RAG, Provenance, and Admin Registry.
"""

import uuid
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Header
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ...db.database import get_db
from ...db.models import User, UserProfile
from ...services.auth_service import AuthService
from ...services.source_registry import SourceRegistryService, AuthoritativeSource
from ...services.source_validator import SourceValidator, SourceValidationResult
from ...services.provenance_engine import ProvenanceEngine, ProvenanceRecord
from ...services.freshness_engine import FreshnessEngine, FreshnessAssessment
from ...services.verification_engine import VerificationEngine, VerificationAssessmentResult
from ...services.eligibility_engine import EligibilityEngine, EligibilityEvaluationResult
from ...services.finance_engine import FinanceEngine, EMICalculationResult, ProjectFinanceResult
from ...services.simulation_engine import SimulationEngine, BusinessSimulationResult
from ...services.risk_engine import RiskEngine, RiskAssessmentResult
from ...services.business_engine import BusinessEngine, BusinessRecommendationItem
from ...services.feasibility_engine import FeasibilityEngine, BusinessFeasibilityReport
from ...services.document_engine import DocumentEngine, DocumentChecklistResult, SchemeDocumentRoadmapResponse
from ...services.dpr_engine import DPREngine, ActionPlanResult
from ...services.rag_engine import RAGEngine, ChatResponse
from ...db.seed_data import DEMO_LOCATIONS, VERIFIED_SCHEMES, BUSINESS_TEMPLATES

router = APIRouter(prefix="/v1")


# Request Models
class UserProfileInput(BaseModel):
    name: str = "Ramesh Patil"
    age: int = 32
    gender: str = "Male"
    social_category: str = "General"  # General, OBC, SC, ST, Women, Minority
    occupation: str = "Farmer"
    education: str = "Secondary School (10th)"
    skills: List[str] = Field(default_factory=lambda: ["dairy_management", "agriculture"])
    annual_income_inr: float = 180000.0
    available_capital: float = 30000.0
    business_interest: str = "Dairy Farming"
    desired_loan_amount: float = 180000.0
    is_rural: bool = True
    location_id: str = "LOC_BARAMATI_01"
    preferred_languages: Optional[List[str]] = Field(default_factory=lambda: ["en"])
    preferred_language: Optional[str] = "en"


class BusinessRecommendRequest(BaseModel):
    user_profile: UserProfileInput
    location_id: Optional[str] = "LOC_BARAMATI_01"


class BusinessFeasibilityRequest(BaseModel):
    business_id: str = "BIZ_DAIRY_FARMING"
    location_id: str = "LOC_BARAMATI_01"
    user_profile: Optional[UserProfileInput] = None


class SchemeVerifyRequest(BaseModel):
    submitted_text: str
    submitted_url: Optional[str] = None


class EligibilityCheckRequest(BaseModel):
    scheme_id: str
    user_profile: UserProfileInput


class EMICalculateRequest(BaseModel):
    principal: float = 180000.0
    annual_interest_rate_pct: float = 8.5
    tenure_months: int = 60
    repayment_frequency: str = "MONTHLY"  # "MONTHLY", "QUARTERLY"


class ProjectFinanceRequest(BaseModel):
    total_project_cost: float = 220000.0
    own_contribution_pct: Optional[float] = None
    subsidy_pct: Optional[float] = None
    annual_interest_rate_pct: float = 8.5
    tenure_months: int = 60
    moratorium_months: int = 0
    repayment_frequency: str = "MONTHLY"
    scheme_id: Optional[str] = None
    user_category: str = "General"
    is_rural: bool = True


class SimulationRequest(BaseModel):
    business_id: str = "BIZ_DAIRY_FARMING"
    assumptions_map: Dict[str, float] = Field(default_factory=dict)
    loan_amount: float = 180000.0
    interest_rate: float = 8.5
    tenure_months: int = 60


class RiskAnalyzeRequest(BaseModel):
    business_id: str = "BIZ_DAIRY_FARMING"
    location_id: str = "LOC_BARAMATI_01"
    financial_plan: Dict[str, Any] = Field(default_factory=dict)
    simulation_data: Dict[str, Any] = Field(default_factory=dict)


class ActionPlanGenerateRequest(BaseModel):
    user_profile: UserProfileInput
    location_id: str = "LOC_BARAMATI_01"
    business_id: str = "BIZ_DAIRY_FARMING"
    scheme_id: str = "SCHEME_PMEGP"
    repayment_frequency: str = "MONTHLY"
    uploaded_doc_codes: List[str] = Field(default_factory=lambda: ["AADHAAR", "PAN", "BANK_STATEMENT", "LAND_DOCUMENT_7_12"])
    custom_assumptions: Dict[str, float] = Field(default_factory=dict)


class ChatRequest(BaseModel):
    query: str
    language: Optional[str] = None
    context_state: Optional[Dict[str, Any]] = None


# --- 1. Locations & Provenance API ---
@router.get("/locations")
def list_locations():
    return {
        "is_demo_data": True,
        "label": "DEMO DATA — Village demographic & economic indicators for demonstration",
        "locations": DEMO_LOCATIONS
    }


@router.get("/locations/{location_id}")
def get_location(location_id: str):
    loc = next((l for l in DEMO_LOCATIONS if l["location_id"] == location_id), None)
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")
    return loc


@router.get("/provenance/location/{location_id}", response_model=ProvenanceRecord)
def get_location_provenance(location_id: str):
    loc = next((l for l in DEMO_LOCATIONS if l["location_id"] == location_id), DEMO_LOCATIONS[0])
    return ProvenanceEngine.get_location_provenance(loc)


# --- 2. Business Advisor API ---
@router.get("/businesses")
def list_businesses():
    return BUSINESS_TEMPLATES


@router.get("/businesses/{business_id}")
def get_business(business_id: str):
    biz = next((b for b in BUSINESS_TEMPLATES if b["business_id"] == business_id or b["code"] == business_id), None)
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    return biz


@router.post("/business/recommend", response_model=List[BusinessRecommendationItem])
def recommend_businesses(req: BusinessRecommendRequest):
    loc = next((l for l in DEMO_LOCATIONS if l["location_id"] == req.location_id), DEMO_LOCATIONS[0])
    return BusinessEngine.recommend_businesses(req.user_profile.model_dump(), loc)


@router.post("/business/feasibility", response_model=BusinessFeasibilityReport)
def generate_business_feasibility(req: BusinessFeasibilityRequest):
    biz = next((b for b in BUSINESS_TEMPLATES if b["business_id"] == req.business_id or b["code"] == req.business_id), BUSINESS_TEMPLATES[0])
    loc = next((l for l in DEMO_LOCATIONS if l["location_id"] == req.location_id), DEMO_LOCATIONS[0])
    profile = req.user_profile.model_dump() if req.user_profile else {}
    return FeasibilityEngine.generate_feasibility_report(biz, loc, profile)


@router.get("/business/{business_id}/feasibility", response_model=BusinessFeasibilityReport)
def get_business_feasibility(business_id: str, location_id: str = "LOC_BARAMATI_01"):
    biz = next((b for b in BUSINESS_TEMPLATES if b["business_id"] == business_id or b["code"] == business_id), BUSINESS_TEMPLATES[0])
    loc = next((l for l in DEMO_LOCATIONS if l["location_id"] == location_id), DEMO_LOCATIONS[0])
    return FeasibilityEngine.generate_feasibility_report(biz, loc, {})


# --- 3. Schemes & Provenance API ---
@router.get("/schemes")
def list_schemes(
    category: Optional[str] = None,
    business_type: Optional[str] = None,
    search: Optional[str] = None
):
    results = VERIFIED_SCHEMES
    if search:
        s_low = search.lower()
        results = [
            s for s in results
            if s_low in s["name"].lower() or s_low in s["code"].lower() or s_low in s["ministry"].lower()
        ]
    return {
        "total": len(results),
        "source_registry_status": "OFFICIALLY_VERIFIED",
        "schemes": results
    }


@router.get("/schemes/{scheme_id}")
def get_scheme(scheme_id: str):
    scheme = next((s for s in VERIFIED_SCHEMES if s["scheme_id"] == scheme_id or s["code"] == scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme


@router.get("/provenance/scheme/{scheme_id}", response_model=ProvenanceRecord)
def get_scheme_provenance(scheme_id: str):
    scheme = next((s for s in VERIFIED_SCHEMES if s["scheme_id"] == scheme_id or s["code"] == scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return ProvenanceEngine.get_scheme_provenance(scheme)


@router.get("/schemes/{scheme_id}/freshness", response_model=FreshnessAssessment)
def get_scheme_freshness(scheme_id: str):
    scheme = next((s for s in VERIFIED_SCHEMES if s["scheme_id"] == scheme_id or s["code"] == scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return FreshnessEngine.assess_freshness(
        entity_id=scheme["scheme_id"],
        last_verified_str=scheme.get("last_verified_at", "2026-08-01"),
        current_status=scheme.get("status", "ACTIVE"),
        effective_to=scheme.get("effective_to")
    )


# --- 4. Scheme Authenticity & Verification Assessment API ---
@router.post("/schemes/verify", response_model=VerificationAssessmentResult)
def verify_scheme_offer(req: SchemeVerifyRequest):
    return VerificationEngine.verify_submission(req.submitted_text, req.submitted_url)


# --- 5. Deterministic Eligibility API ---
@router.post("/schemes/check-eligibility", response_model=EligibilityEvaluationResult)
def check_eligibility(req: EligibilityCheckRequest):
    scheme = next((s for s in VERIFIED_SCHEMES if s["scheme_id"] == req.scheme_id or s["code"] == req.scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found in verified database")
    return EligibilityEngine.evaluate_eligibility(scheme, req.user_profile.model_dump())


# --- 6. Deterministic Financial Calculator API ---
@router.post("/finance/calculate-emi", response_model=EMICalculationResult)
def calculate_emi(req: EMICalculateRequest):
    return FinanceEngine.calculate_amortization(
        principal=req.principal,
        annual_rate_pct=req.annual_interest_rate_pct,
        tenure_months=req.tenure_months,
        repayment_frequency=req.repayment_frequency
    )


@router.post("/finance/structure-project", response_model=ProjectFinanceResult)
def structure_project_finance(req: ProjectFinanceRequest):
    scheme_rules = None
    if req.scheme_id:
        scheme_rules = next((s for s in VERIFIED_SCHEMES if s["scheme_id"] == req.scheme_id or s["code"] == req.scheme_id), None)

    return FinanceEngine.structure_project_finance(
        total_project_cost=req.total_project_cost,
        own_contribution_pct=req.own_contribution_pct,
        subsidy_pct=req.subsidy_pct,
        annual_interest_rate_pct=req.annual_interest_rate_pct,
        tenure_months=req.tenure_months,
        moratorium_months=req.moratorium_months,
        repayment_frequency=req.repayment_frequency,
        scheme_rules=scheme_rules,
        user_category=req.user_category,
        is_rural=req.is_rural
    )


class SchemeRouterRequest(BaseModel):
    available_margin_capital: float = 100000.0
    repayment_frequency: str = "QUARTERLY"  # "MONTHLY", "QUARTERLY"


@router.post("/finance/scheme-router")
def route_margin_scheme(req: SchemeRouterRequest):
    return FinanceEngine.route_margin_to_scheme(
        available_margin_capital=req.available_margin_capital,
        repayment_frequency=req.repayment_frequency
    )



# --- 7. Business Simulator API ---
@router.post("/business/simulate", response_model=BusinessSimulationResult)
def simulate_business(req: SimulationRequest):
    biz = next((b for b in BUSINESS_TEMPLATES if b["business_id"] == req.business_id or b["code"] == req.business_id), BUSINESS_TEMPLATES[0])
    
    if biz["code"] == "DAIRY_FARMING":
        return SimulationEngine.simulate_dairy_farming(
            assumptions_map=req.assumptions_map,
            loan_amount=req.loan_amount,
            interest_rate=req.interest_rate,
            tenure_months=req.tenure_months
        )
    else:
        return SimulationEngine.simulate_generic(
            business_id=biz["business_id"],
            business_name=biz["name"],
            total_investment=biz["typical_investment"],
            typical_monthly_revenue=biz["typical_revenue_monthly"],
            typical_monthly_expenses=biz["typical_expenses_monthly"],
            loan_amount=req.loan_amount,
            interest_rate=req.interest_rate,
            tenure_months=req.tenure_months
        )


# --- 8. Rule-Based Risk Engine API ---
@router.post("/risk/analyze", response_model=RiskAssessmentResult)
def analyze_risk(req: RiskAnalyzeRequest):
    biz = next((b for b in BUSINESS_TEMPLATES if b["business_id"] == req.business_id or b["code"] == req.business_id), BUSINESS_TEMPLATES[0])
    loc = next((l for l in DEMO_LOCATIONS if l["location_id"] == req.location_id), DEMO_LOCATIONS[0])
    return RiskEngine.assess_risk(biz, loc, req.financial_plan, req.simulation_data)


# --- 9. Document Intelligence & DEMO OCR API ---
@router.get("/documents/checklist", response_model=DocumentChecklistResult)
def get_document_checklist(business_id: str = "BIZ_DAIRY_FARMING", scheme_id: str = "SCHEME_PMEGP"):
    biz = next((b for b in BUSINESS_TEMPLATES if b["business_id"] == business_id or b["code"] == business_id), BUSINESS_TEMPLATES[0])
    scheme = next((s for s in VERIFIED_SCHEMES if s["scheme_id"] == scheme_id or s["code"] == scheme_id), VERIFIED_SCHEMES[0])
    return DocumentEngine.get_checklist(biz, scheme)


@router.get("/documents/scheme/{scheme_id}", response_model=SchemeDocumentRoadmapResponse)
def get_scheme_document_roadmap(scheme_id: str):
    scheme = next((s for s in VERIFIED_SCHEMES if s["scheme_id"] == scheme_id or s["code"] == scheme_id), None)
    if not scheme:
        # Fallback to first scheme
        scheme = VERIFIED_SCHEMES[0]
    return DocumentEngine.get_scheme_document_roadmap(scheme)


@router.post("/documents/upload-demo-ocr")
def upload_demo_ocr(filename: str = Form("aadhaar_card_sample.pdf"), sample_text: Optional[str] = Form(None)):
    return DocumentEngine.simulate_ocr_upload(filename, sample_text)


# --- 10. AI-Assisted DPR Draft & Action Plan API ---
@router.post("/action-plan/generate", response_model=ActionPlanResult)
def generate_action_plan(req: ActionPlanGenerateRequest):
    user_dict = req.user_profile.model_dump()
    loc = next((l for l in DEMO_LOCATIONS if l["location_id"] == req.location_id), DEMO_LOCATIONS[0])
    biz = next((b for b in BUSINESS_TEMPLATES if b["business_id"] == req.business_id or b["code"] == req.business_id), BUSINESS_TEMPLATES[0])
    scheme = next((s for s in VERIFIED_SCHEMES if s["scheme_id"] == req.scheme_id or s["code"] == req.scheme_id), VERIFIED_SCHEMES[0])
    
    # 1. Verification
    verif = VerificationEngine.verify_submission(scheme["name"], scheme["official_portal_url"]).model_dump()
    
    # 2. Eligibility
    elig = EligibilityEngine.evaluate_eligibility(scheme, user_dict).model_dump()
    
    # 3. Finance
    fin = FinanceEngine.structure_project_finance(
        total_project_cost=biz["typical_investment"],
        own_contribution_pct=elig["applicable_margin_money_pct"],
        subsidy_pct=elig["applicable_subsidy_pct"],
        annual_interest_rate_pct=8.5,
        tenure_months=60,
        repayment_frequency=req.repayment_frequency,
        scheme_rules=scheme,
        user_category=user_dict.get("social_category", "General"),
        is_rural=user_dict.get("is_rural", True)
    ).model_dump()
    
    # 4. Simulation
    if biz["code"] == "DAIRY_FARMING":
        sim = SimulationEngine.simulate_dairy_farming(
            assumptions_map=req.custom_assumptions,
            loan_amount=fin["loan_requirement"]
        ).model_dump()
    else:
        sim = SimulationEngine.simulate_generic(
            business_id=biz["business_id"],
            business_name=biz["name"],
            total_investment=biz["typical_investment"],
            typical_monthly_revenue=biz["typical_revenue_monthly"],
            typical_monthly_expenses=biz["typical_expenses_monthly"],
            loan_amount=fin["loan_requirement"]
        ).model_dump()
        
    # 5. Risk
    risk = RiskEngine.assess_risk(biz, loc, fin, sim).model_dump()
    
    # 6. Documents
    docs = DocumentEngine.get_checklist(biz, scheme, req.uploaded_doc_codes).model_dump()
    
    return DPREngine.generate_dpr_and_action_plan(
        user_profile=user_dict,
        location=loc,
        business=biz,
        scheme=scheme,
        verification=verif,
        eligibility=elig,
        financial_plan=fin,
        simulation=sim,
        risk=risk,
        documents=docs
    )


# --- 11. Multilingual AI Assistant Chat (RAG) API ---
@router.post("/chat", response_model=ChatResponse)
def ask_gramniti(req: ChatRequest):
    return RAGEngine.answer_query(req.query, req.language, req.context_state)


# --- 12. Authoritative Source Registry API ---
@router.get("/sources", response_model=List[AuthoritativeSource])
def get_authoritative_sources():
    return SourceRegistryService.list_sources()


@router.post("/sources/validate", response_model=SourceValidationResult)
def validate_external_source(url_or_domain: str):
    return SourceValidator.validate_source(url_or_domain)


# --- 13. Admin Overview & Audit Stats ---
@router.get("/admin/overview")
def get_admin_overview():
    return {
        "total_verified_schemes": len(VERIFIED_SCHEMES),
        "total_active_sources": len(SourceRegistryService.list_sources()),
        "total_businesses": len(BUSINESS_TEMPLATES),
        "total_demo_locations": len(DEMO_LOCATIONS),
        "fraud_patterns_monitored": 6,
        "system_status": "ONLINE",
        "last_registry_sync": "2026-08-27T18:00:00Z"
    }

