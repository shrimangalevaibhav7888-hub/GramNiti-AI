"""
GramNiti AI Full API Endpoints & Multi-Language Regression Test Suite
Tests all REST endpoints via FastAPI TestClient:
- Location listings and detail
- Business recommendations & templates
- Scheme retrieval & filtering
- Fraud verification engine
- Deterministic eligibility evaluation
- Financial calculators (EMI & Project Financing)
- 3-Scenario Business Simulation
- Rule-based Risk assessment
- Document intelligence & simulated DEMO OCR
- DPR Action plan generation
- Multilingual RAG assistant in EN, HI, MR
- Source registry & Admin stats
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_and_health():
    res_root = client.get("/")
    assert res_root.status_code == 200
    data_root = res_root.json()
    assert data_root["app"] == "GramNiti AI"
    assert data_root["status"] == "ONLINE"

    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"


def test_locations_endpoints():
    res = client.get("/api/v1/locations")
    assert res.status_code == 200
    data = res.json()
    assert data["is_demo_data"] is True
    assert len(data["locations"]) >= 5

    first_loc_id = data["locations"][0]["location_id"]
    res_loc = client.get(f"/api/v1/locations/{first_loc_id}")
    assert res_loc.status_code == 200
    assert res_loc.json()["location_id"] == first_loc_id


def test_business_endpoints():
    res = client.get("/api/v1/businesses")
    assert res.status_code == 200
    businesses = res.json()
    assert len(businesses) >= 5

    # Test recommend business
    profile_payload = {
        "user_profile": {
            "name": "Ramesh Patil",
            "age": 32,
            "gender": "Male",
            "social_category": "General",
            "occupation": "Farmer",
            "education": "Secondary School (10th)",
            "skills": ["dairy_management", "agriculture"],
            "annual_income_inr": 180000.0,
            "available_capital": 30000.0,
            "business_interest": "Dairy Farming",
            "desired_loan_amount": 180000.0,
            "is_rural": True,
            "location_id": "LOC_BARAMATI_01"
        },
        "location_id": "LOC_BARAMATI_01"
    }
    res_rec = client.post("/api/v1/business/recommend", json=profile_payload)
    assert res_rec.status_code == 200
    recs = res_rec.json()
    assert len(recs) >= 3
    assert recs[0]["suitability_score"] >= 70.0

    # Test hyper-local feasibility report
    res_feas = client.post("/api/v1/business/feasibility", json={
        "business_id": "BIZ_DAIRY_FARMING",
        "location_id": "LOC_BARAMATI_01",
        "user_profile": profile_payload["user_profile"]
    })
    assert res_feas.status_code == 200
    feas_data = res_feas.json()
    assert "market_reach" in feas_data
    assert feas_data["market_reach"]["estimated_consumer_base"] > 10000
    assert len(feas_data["market_reach"]["primary_distribution_channels"]) >= 3
    assert "opportunity_analysis" in feas_data
    assert len(feas_data["opportunity_analysis"]["unserved_niches"]) >= 2
    assert "swot_analysis" in feas_data
    assert len(feas_data["swot_analysis"]["strengths"]) >= 2
    assert "threats" in feas_data
    assert len(feas_data["threats"]) >= 2
    assert "competitor_mapping" in feas_data
    assert feas_data["competitor_mapping"]["saturation_verdict"] == "UNDERSATURATED"
    assert "product_market_value" in feas_data
    assert "recommended_unit_price" in feas_data["product_market_value"]


def test_schemes_and_search():
    res = client.get("/api/v1/schemes")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 5

    # Test scheme search
    res_search = client.get("/api/v1/schemes?search=pmegp")
    assert res_search.status_code == 200
    search_data = res_search.json()
    assert search_data["total"] >= 1
    assert any(s["code"] == "PMEGP" for s in search_data["schemes"])


def test_verification_api():
    # Test verified scheme
    res_v = client.post("/api/v1/schemes/verify", json={
        "submitted_text": "PMEGP Scheme for micro enterprise",
        "submitted_url": "https://www.kviconline.gov.in/pmegpep/pmegphome/index.jsp"
    })
    assert res_v.status_code == 200
    v_data = res_v.json()
    assert v_data["verification_status"] == "VERIFIED"
    assert v_data["risk_level"] == "LOW"

    # Test scam alert
    res_scam = client.post("/api/v1/schemes/verify", json={
        "submitted_text": "Instant 5 Lakh Mudra Loan! Pay 2000 registration fee via UPI to agent@paytm",
        "submitted_url": None
    })
    assert res_scam.status_code == 200
    scam_data = res_scam.json()
    assert scam_data["verification_status"] == "HIGH_RISK"
    assert scam_data["risk_level"] == "HIGH"


def test_finance_and_simulation_api():
    # EMI calculation
    res_emi = client.post("/api/v1/finance/calculate-emi", json={
        "principal": 180000.0,
        "annual_interest_rate_pct": 8.5,
        "tenure_months": 60
    })
    assert res_emi.status_code == 200
    emi_data = res_emi.json()
    assert 3690.0 <= emi_data["monthly_emi"] <= 3700.0

    # SCA Scheme Router - Logic A: Micro Finance Scheme (Margin ₹10,000 -> Project Cost ₹1,00,000 <= ₹1.40L)
    res_mfs = client.post("/api/v1/finance/scheme-router", json={
        "available_margin_capital": 10000.0,
        "repayment_frequency": "QUARTERLY"
    })
    assert res_mfs.status_code == 200
    mfs_data = res_mfs.json()
    assert mfs_data["scheme_code"] == "MFS"
    assert mfs_data["annual_interest_rate_pct"] == 6.5
    assert mfs_data["tenure_years"] == 3
    assert mfs_data["moratorium_months"] == 3
    assert mfs_data["total_feasible_project_cost"] == 100000.0
    assert mfs_data["maximum_loan_amount"] == 90000.0

    # SCA Scheme Router - Logic B: Term Loan Scheme (Margin ₹1,00,000 -> Project Cost ₹10,00,000 > ₹1.40L)
    res_tls = client.post("/api/v1/finance/scheme-router", json={
        "available_margin_capital": 100000.0,
        "repayment_frequency": "QUARTERLY"
    })
    assert res_tls.status_code == 200
    tls_data = res_tls.json()
    assert tls_data["scheme_code"] == "TLS"
    assert tls_data["annual_interest_rate_pct"] == 8.0
    assert tls_data["tenure_years"] == 7
    assert tls_data["moratorium_months"] == 6
    assert tls_data["total_feasible_project_cost"] == 1000000.0
    assert tls_data["maximum_loan_amount"] == 900000.0

    # Simulation calculation
    res_sim = client.post("/api/v1/business/simulate", json={
        "business_id": "BIZ_DAIRY_FARMING",
        "assumptions_map": {"num_animals": 2, "milk_yield_per_day": 13.0},
        "loan_amount": 180000.0,
        "interest_rate": 8.5,
        "tenure_months": 60
    })
    assert res_sim.status_code == 200
    sim_data = res_sim.json()
    assert sim_data["best_case"]["monthly_revenue"] > sim_data["normal_case"]["monthly_revenue"]



def test_documents_and_demo_ocr():
    res_docs = client.get("/api/v1/documents/checklist?business_id=BIZ_DAIRY_FARMING&scheme_id=SCHEME_PMEGP")
    assert res_docs.status_code == 200
    doc_data = res_docs.json()
    assert doc_data["total_required"] >= 4
    assert len(doc_data["documents"]) >= 4

    # Test scheme document roadmap provider endpoint
    res_roadmap = client.get("/api/v1/documents/scheme/SCHEME_PMEGP")
    assert res_roadmap.status_code == 200
    roadmap = res_roadmap.json()
    assert roadmap["scheme_code"] == "PMEGP"
    assert len(roadmap["documents"]) >= 5
    assert len(roadmap["approval_stages"]) == 4
    assert "KYC_IDENTITY" in roadmap["category_breakdown"]
    assert "BENEFIT_ELIGIBILITY" in roadmap["category_breakdown"]
    assert any(d["doc_code"] == "AADHAAR" for d in roadmap["documents"])
    assert any(d["doc_code"] == "CASTE_CERTIFICATE" for d in roadmap["documents"])

    # Demo OCR simulation
    res_ocr = client.post("/api/v1/documents/upload-demo-ocr", data={
        "filename": "sample_aadhaar.pdf",
        "sample_text": "Sample Aadhaar verified"
    })
    assert res_ocr.status_code == 200
    ocr_data = res_ocr.json()
    assert ocr_data["status"] == "SUCCESS"
    assert ocr_data["ocr_confidence"] >= 80.0


def test_action_plan_api():
    req_body = {
        "user_profile": {
            "name": "Ramesh Patil",
            "age": 32,
            "gender": "Male",
            "social_category": "General",
            "occupation": "Farmer",
            "education": "Secondary School (10th)",
            "skills": ["dairy_management"],
            "annual_income_inr": 180000.0,
            "available_capital": 30000.0,
            "business_interest": "Dairy Farming",
            "desired_loan_amount": 180000.0,
            "is_rural": True,
            "location_id": "LOC_BARAMATI_01"
        },
        "location_id": "LOC_BARAMATI_01",
        "business_id": "BIZ_DAIRY_FARMING",
        "scheme_id": "SCHEME_PMEGP",
        "uploaded_doc_codes": ["AADHAAR", "PAN", "BANK_STATEMENT", "LAND_DOCUMENT_7_12"],
        "custom_assumptions": {}
    }
    res_plan = client.post("/api/v1/action-plan/generate", json=req_body)
    assert res_plan.status_code == 200
    plan_data = res_plan.json()
    assert plan_data["applicant_name"] == "Ramesh Patil"
    assert len(plan_data["dpr_sections"]) >= 4
    assert len(plan_data["action_steps"]) >= 4
    assert len(plan_data["action_steps_hi"]) >= 4
    assert len(plan_data["action_steps_mr"]) >= 4


def test_multilingual_chat_rag():
    # English Query
    res_en = client.post("/api/v1/chat", json={"query": "Tell me about PMEGP subsidy", "language": "en"})
    assert res_en.status_code == 200
    assert len(res_en.json()["citations"]) >= 1

    # Hindi Query
    res_hi = client.post("/api/v1/chat", json={"query": "डेयरी फार्मिंग के लिए लोन कैसे मिलेगा?", "language": "hi"})
    assert res_hi.status_code == 200
    assert len(res_hi.json()["reply_text"]) > 20

    # Marathi Query
    res_mr = client.post("/api/v1/chat", json={"query": "PMEGP योजनेतून किती अनुदान मिळेल?", "language": "mr"})
    assert res_mr.status_code == 200
    assert len(res_mr.json()["reply_text"]) > 20


def test_sources_and_admin():
    res_sources = client.get("/api/v1/sources")
    assert res_sources.status_code == 200
    sources = res_sources.json()
    assert len(sources) >= 5

    res_admin = client.get("/api/v1/admin/overview")
    assert res_admin.status_code == 200
    admin_data = res_admin.json()
    assert admin_data["system_status"] == "ONLINE"
