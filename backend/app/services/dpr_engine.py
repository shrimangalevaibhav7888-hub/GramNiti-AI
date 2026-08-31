"""
AI-Assisted DPR Draft & Action Plan Generator for GramNiti AI
Assembles a complete, structured project report draft designed for rural micro-entrepreneurs:
- Planning and bank application preparation document
- Transparent Means of Finance & Amortization
- Step-by-step roadmap with official application channel
- Clear planning disclaimer (not a loan sanction guarantee)
"""

from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class DPRSection(BaseModel):
    section_id: str
    title: str
    title_hi: str
    title_mr: str
    subtitle: str
    subtitle_hi: str
    subtitle_mr: str
    data_type: str  # "VERIFIED_FACT", "USER_INPUT", "DETERMINISTIC_ESTIMATE", "AI_EXPLANATION"
    content_markdown: str
    key_metrics: Dict[str, Any] = Field(default_factory=dict)


class ActionPlanResult(BaseModel):
    report_id: str
    report_title: str = "AI-Assisted DPR Draft & Action Plan"
    generated_at: str
    applicant_name: str
    village_name: str
    district: str
    state: str
    business_name: str
    business_name_hi: str
    business_name_mr: str
    scheme_name: str
    scheme_code: str
    official_portal_url: str
    verification_status: str
    eligibility_status: str
    
    # Financial Breakdown
    project_cost: float
    own_contribution: float
    own_contribution_pct: float
    bank_loan: float
    eligible_subsidy: float
    subsidy_pct: float
    repayment_frequency: str = "MONTHLY"
    installment_amount: float
    monthly_emi: float
    normal_case_monthly_profit: float
    break_even_months: int
    
    # Documents Summary
    documents_ready: int
    documents_total: int
    
    # Scorecards
    suitability_score: float
    verification_confidence: float
    risk_score: float
    risk_level: str
    
    # Step-by-Step Roadmap
    action_steps: List[str] = Field(default_factory=list)
    action_steps_hi: List[str] = Field(default_factory=list)
    action_steps_mr: List[str] = Field(default_factory=list)
    
    dpr_sections: List[DPRSection] = Field(default_factory=list)
    
    disclaimer: str = (
        "This AI-assisted DPR is intended for planning and application preparation. "
        "It does not guarantee loan approval or bank sanction. Actual credit sanction is subject "
        "to the independent credit appraisal and underwriting standards of the lending financial institution."
    )


class DPREngine:

    @classmethod
    def generate_dpr_and_action_plan(
        cls,
        user_profile: Dict,
        location: Dict,
        business: Dict,
        scheme: Dict,
        verification: Dict,
        eligibility: Dict,
        financial_plan: Dict,
        simulation: Dict,
        risk: Dict,
        documents: Dict
    ) -> ActionPlanResult:
        import uuid
        report_id = f"DPR_DRAFT_{uuid.uuid4().hex[:8].upper()}"
        now_str = datetime.now().strftime("%d-%b-%Y")

        applicant_name = user_profile.get("name", "Ramesh Patil")
        village = location.get("village_name", "Malegaon Budruk")
        district = location.get("district", "Pune")
        state = location.get("state", "Maharashtra")
        biz_name = business.get("name", "Dairy Farming")
        biz_hi = business.get("name_hi", "डेयरी फार्मिंग")
        biz_mr = business.get("name_mr", "डेअरी फार्मिंग")
        scheme_name = scheme.get("name", "PMEGP")
        scheme_code = scheme.get("code", "PMEGP")

        proj_cost = float(financial_plan.get("total_project_cost", 220000.0))
        own_contrib = float(financial_plan.get("own_contribution_amount", 22000.0))
        own_pct = float(financial_plan.get("own_contribution_pct", 10.0))
        loan_req = float(financial_plan.get("loan_requirement", 198000.0))
        subsidy = float(financial_plan.get("subsidy_amount", 55000.0))
        subsidy_pct = float(financial_plan.get("subsidy_pct", 25.0))
        freq = financial_plan.get("repayment_frequency", "MONTHLY")
        installment = float(financial_plan.get("installment_amount") or financial_plan.get("monthly_emi", 3694.0))
        emi = float(financial_plan.get("monthly_emi", installment))

        profit_normal = float(simulation.get("normal_case", {}).get("net_cash_remaining", 14306.0))
        break_even = int(simulation.get("break_even_estimate_months", 9))
        docs_ready = int(documents.get("ready_count", 4))
        docs_total = int(documents.get("total_required") or documents.get("total_count") or len(documents.get("documents", [])) or 5)

        suitability = float(business.get("suitability_score", 88.0))
        verif_conf = float(verification.get("verification_confidence_score", 85.0))
        risk_score = float(risk.get("overall_risk_score", 32.0))
        risk_level = risk.get("risk_level", "LOW")

        # Step by step roadmap
        steps_en = [
            f"Step 1: Download this AI-Assisted DPR Draft and verify your KYC documents ({docs_ready}/{docs_total} currently prepared).",
            f"Step 2: Submit official online application at {scheme.get('official_portal_url', 'https://kviconline.gov.in')}.",
            f"Step 3: Track application acknowledgment and attend District Task Force Committee (DTFC) screening if required.",
            f"Step 4: Bank branch conducts credit appraisal and issues in-principle sanction letter.",
            f"Step 5: Deposit own margin money of ₹{own_contrib:,.0f} into dedicated project account for loan disbursement."
        ]

        steps_hi = [
            f"चरण 1: इस एआई-सहायक डीपीआर ड्राफ्ट को डाउनलोड करें और केवाईसी दस्तावेज तैयार रखें ({docs_ready}/{docs_total} तैयार).",
            f"चरण 2: आधिकारिक पोर्टल {scheme.get('official_portal_url', 'https://kviconline.gov.in')} पर ऑनलाइन आवेदन जमा करें।",
            f"चरण 3: जिला टास्क फोर्स समिति (DTFC) सत्यापन प्रक्रिया का पालन करें।",
            f"चरण 4: बैंक शाखा द्वारा वित्तीय मूल्यांकन और सैद्धांतिक स्वीकृति प्राप्त करें।",
            f"चरण 5: बैंक खाते में अपना ₹{own_contrib:,.0f} का अंशदान (मार्जिन मनी) जमा करें।"
        ]

        steps_mr = [
            f"टप्पा १: हा एआय-सहाय्यक डीपीआर मसुदा डाउनलोड करा आणि आवश्यक कागदपत्रे तपासा ({docs_ready}/{docs_total} तयार).",
            f"टप्पा २: {scheme.get('official_portal_url', 'https://kviconline.gov.in')} या अधिकृत पोर्टलवर अर्ज सादर करा.",
            f"टप्पा ३: जिल्हा कार्यदल समिती (DTFC) कडून अर्जाची छाननी पूर्ण करा.",
            f"टप्पा ४: बँक शाखेकडून प्रकल्प तपासणी व तत्त्वतः कर्ज मंजुरी पत्र मिळवा.",
            f"टप्पा ५: प्रकल्प खात्यामध्ये स्वतःचे भांडवल ₹{own_contrib:,.0f} जमा करून कर्ज वितरण प्राप्त करा."
        ]

        # Structured DPR Sections
        dpr_sections = [
            DPRSection(
                section_id="SEC_EXECUTIVE_SUMMARY",
                title="1. Executive Summary & Enterprise Overview",
                title_hi="1. कार्यकारी सारांश व उद्यम विवरण",
                title_mr="1. कार्यकारी सारांश आणि उद्योग माहिती",
                subtitle="High-level enterprise proposal for credit assessment preparation",
                subtitle_hi="ऋण मूल्यांकन तैयारी के लिए उद्यम प्रस्ताव",
                subtitle_mr="कर्ज मूल्यमापन पूर्वतयारीसाठी प्रकल्प प्रस्ताव",
                data_type="AI_EXPLANATION",
                content_markdown=(
                    f"### Enterprise Profile\n"
                    f"- **Proposed Unit**: {biz_name} ({biz_hi} / {biz_mr})\n"
                    f"- **Promoter Name**: {applicant_name}\n"
                    f"- **Location**: {village}, Taluka: {location.get('block_taluka', 'Baramati')}, Dist: {district}, {state}\n"
                    f"- **Target Government Scheme**: {scheme_name} ({scheme_code})\n"
                    f"- **Total Capital Outlay**: ₹{proj_cost:,.0f}\n"
                    f"- **Promoter Equity (Margin)**: ₹{own_contrib:,.0f} ({own_pct:.1f}%)\n"
                    f"- **Term Loan Proposed**: ₹{loan_req:,.0f}\n"
                    f"- **Anticipated Scheme Subsidy**: ₹{subsidy:,.0f} ({subsidy_pct:.1f}%)\n"
                ),
                key_metrics={
                    "total_cost": proj_cost,
                    "promoter_margin": own_contrib,
                    "term_loan": loan_req,
                    "subsidy": subsidy
                }
            ),
            DPRSection(
                section_id="SEC_MEANS_OF_FINANCE",
                title="2. Means of Finance & Project Cost Structure",
                title_hi="2. वित्तपोषण के स्रोत व परियोजना लागत",
                title_mr="2. वित्तीय रचना आणि प्रकल्प खर्च रचना",
                subtitle="Deterministic financial structure based on official scheme guidelines",
                subtitle_hi="योजना नियमावली आधारित निश्चित वित्तीय संरचना",
                subtitle_mr="योजनेच्या नियमांनुसार निश्चित वित्तीय रचना",
                data_type="DETERMINISTIC_ESTIMATE",
                content_markdown=(
                    f"| Component | Percentage | Amount (INR) |\n"
                    f"| :--- | :--- | :--- |\n"
                    f"| **Promoter Contribution (Margin Money)** | {own_pct:.1f}% | ₹{own_contrib:,.0f} |\n"
                    f"| **Bank Term Loan / Assistance** | {100.0 - own_pct:.1f}% | ₹{loan_req:,.0f} |\n"
                    f"| **Total Project Cost** | 100.0% | ₹{proj_cost:,.0f} |\n"
                    f"| **Eligible Scheme Subsidy (Back-Ended)** | {subsidy_pct:.1f}% | ₹{subsidy:,.0f} |\n\n"
                    f"**Repayment Schedule**: {freq.capitalize()} installment of ₹{installment:,.0f} over {financial_plan.get('tenure_months', 60)} months."
                ),
                key_metrics={
                    "project_cost": proj_cost,
                    "own_contribution": own_contrib,
                    "loan_requirement": loan_req,
                    "subsidy_amount": subsidy,
                    "repayment_frequency": freq,
                    "installment": installment
                }
            ),
            DPRSection(
                section_id="SEC_MARKET_FEASIBILITY",
                title="3. Hyper-Local Market Feasibility & Ecosystem",
                title_hi="3. स्थानीय बाजार संभाव्यता एवं पारिस्थितिकी",
                title_mr="3. स्थानिक बाजार व्यवहार्यता आणि परिसंस्था",
                subtitle="Local market dynamics and customer reach indicators",
                subtitle_hi="स्थानीय बाजार मांग और ग्राहक पहुंच",
                subtitle_mr="स्थानिक ग्राहक पोहोच आणि बाजार मागणी",
                data_type="DETERMINISTIC_ESTIMATE",
                content_markdown=(
                    f"- **Estimated Catchment Radius**: 5-10 km radius covering {village} and neighbouring hamlets.\n"
                    f"- **Primary Consumer Base**: Local rural households, weekly village haats, and dairy co-operatives.\n"
                    f"- **Suitability Score**: {suitability:.0f}/100 based on resource availability and local demand."
                ),
                key_metrics={
                    "suitability_score": suitability,
                    "catchment_km": 8.0
                }
            ),
            DPRSection(
                section_id="SEC_DISCLAIMER_NOTICE",
                title="4. Statutory Disclaimer & Application Instructions",
                title_hi="4. वैधानिक अस्वीकरण और आवेदन निर्देश",
                title_mr="4. वैधानिक सूचना आणि अर्ज मार्गदर्शक",
                subtitle="Official regulatory advisory",
                subtitle_hi="आधिकारिक विनियामक परामर्श",
                subtitle_mr="अधिकृत नियामक मार्गदर्शन",
                data_type="VERIFIED_FACT",
                content_markdown=(
                    "This AI-assisted DPR draft is an indicative planning document to help rural micro-entrepreneurs "
                    "organize their project application. It does NOT constitute a loan sanction or credit guarantee. "
                    "Always submit final applications through the official government portal."
                ),
                key_metrics={}
            )
        ]

        return ActionPlanResult(
            report_id=report_id,
            generated_at=now_str,
            applicant_name=applicant_name,
            village_name=village,
            district=district,
            state=state,
            business_name=biz_name,
            business_name_hi=biz_hi,
            business_name_mr=biz_mr,
            scheme_name=scheme_name,
            scheme_code=scheme_code,
            official_portal_url=scheme.get("official_portal_url", "https://kviconline.gov.in"),
            verification_status=verification.get("verification_status", "VERIFIED"),
            eligibility_status=eligibility.get("status", "POTENTIALLY_ELIGIBLE"),
            project_cost=proj_cost,
            own_contribution=own_contrib,
            own_contribution_pct=own_pct,
            bank_loan=loan_req,
            eligible_subsidy=subsidy,
            subsidy_pct=subsidy_pct,
            repayment_frequency=freq,
            installment_amount=installment,
            monthly_emi=emi,
            normal_case_monthly_profit=profit_normal,
            break_even_months=break_even,
            documents_ready=docs_ready,
            documents_total=docs_total,
            suitability_score=suitability,
            verification_confidence=verif_conf,
            risk_score=risk_score,
            risk_level=risk_level,
            action_steps=steps_en,
            action_steps_hi=steps_hi,
            action_steps_mr=steps_mr,
            dpr_sections=dpr_sections
        )
