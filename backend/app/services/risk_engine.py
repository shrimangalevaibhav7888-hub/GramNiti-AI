"""
Rule-Based Risk Assessment Engine for GramNiti AI
Evaluates risk transparently across Financial, Market, Operational/Location,
Repayment Burden, and Process dimensions.
Explicitly labeled as a Rule-Based Risk Assessment (not a predictive ML model).
"""

from typing import Dict, List
from pydantic import BaseModel, Field


class RiskFactor(BaseModel):
    category: str  # "FINANCIAL", "MARKET", "LOCATION_INFRASTRUCTURE", "REPAYMENT_BURDEN", "PROCESS"
    factor_name: str
    risk_level: str  # "LOW", "MEDIUM", "HIGH"
    score_impact: float  # 0 to 100
    evidence: str
    mitigation_advice: str


class RiskAssessmentResult(BaseModel):
    assessment_id: str
    business_id: str
    business_name: str
    overall_risk_score: float  # 0 to 100 (Lower is safer)
    overall_risk_level: str  # "LOW" (0-39), "MEDIUM" (40-69), "HIGH" (70-100)
    category_scores: Dict[str, float] = Field(default_factory=dict)
    contributing_factors: List[RiskFactor] = Field(default_factory=list)
    actionable_mitigations: List[str] = Field(default_factory=list)
    disclaimer: str = (
        "This is a Rule-Based Risk Assessment computed using transparent heuristic rules, "
        "historical price variability metrics, and location infrastructure indicators. "
        "It is designed to highlight operational vulnerabilities and is not a guaranteed prediction."
    )


class RiskEngine:

    @classmethod
    def assess_risk(
        cls,
        business: Dict,
        location: Dict,
        financial_plan: Dict,
        simulation: Dict
    ) -> RiskAssessmentResult:
        import uuid
        assessment_id = f"RISK_{uuid.uuid4().hex[:10].upper()}"
        factors: List[RiskFactor] = []
        
        # 1. Repayment Burden Risk (EMI to Net Operating Profit Ratio)
        monthly_emi = float(financial_plan.get("monthly_emi", 3500.0))
        normal_profit = float(simulation.get("normal_case", {}).get("gross_operating_profit", 15000.0))
        
        dscr_proxy = (normal_profit / monthly_emi) if monthly_emi > 0 else 5.0
        
        if dscr_proxy >= 2.5:
            repayment_risk = "LOW"
            repay_score = 15.0
            repay_evidence = f"Strong repayment buffer (Operating profit is {dscr_proxy:.1f}x of EMI)."
            repay_advice = "Maintain 2 months EMI reserve in a separate savings account."
        elif dscr_proxy >= 1.5:
            repayment_risk = "MEDIUM"
            repay_score = 45.0
            repay_evidence = f"Moderate repayment buffer (Operating profit is {dscr_proxy:.1f}x of EMI)."
            repay_advice = "Avoid taking additional unsecured consumer loans during the first 12 months."
        else:
            repayment_risk = "HIGH"
            repay_score = 75.0
            repay_evidence = f"Tight debt servicing margin (Operating profit is only {dscr_proxy:.1f}x of EMI)."
            repay_advice = "Consider reducing loan principal by increasing own equity or choosing a longer loan tenure."

        factors.append(RiskFactor(
            category="REPAYMENT_BURDEN",
            factor_name="Debt Service Coverage Ratio",
            risk_level=repayment_risk,
            score_impact=repay_score,
            evidence=repay_evidence,
            mitigation_advice=repay_advice
        ))

        # 2. Location & Infrastructure Risk
        power_hours = float(location.get("power_reliability_hours_per_day", 18.0))
        market_distance = float(location.get("market_access_distance_km", 5.0))
        has_cold_storage = bool(location.get("cold_storage_available", False))
        
        biz_sector = business.get("sector", "")
        is_perishable = "Livestock" in biz_sector or "Dairy" in business.get("name", "")
        
        if is_perishable and not has_cold_storage and market_distance > 10.0:
            infra_risk = "HIGH"
            infra_score = 70.0
            infra_evidence = f"Perishable dairy/livestock product located {market_distance} km from primary market without local chilling center."
            infra_advice = "Tie up directly with local dairy collection center with instant morning/evening chilling van pickup."
        elif power_hours < 14.0:
            infra_risk = "MEDIUM"
            infra_score = 50.0
            infra_evidence = f"Rural grid power available for {power_hours} hours/day."
            infra_advice = "Invest in subsidized PM-KUSUM solar pumps or manual backup generator."
        else:
            infra_risk = "LOW"
            infra_score = 20.0
            infra_evidence = f"Good village infrastructure: {power_hours} hrs power supply and {market_distance} km to wholesale market."
            infra_advice = "Standard operational maintenance is sufficient."

        factors.append(RiskFactor(
            category="LOCATION_INFRASTRUCTURE",
            factor_name="Power & Cold Chain Accessibility",
            risk_level=infra_risk,
            score_impact=infra_score,
            evidence=infra_evidence,
            mitigation_advice=infra_advice
        ))

        # 3. Market & Output Price Volatility Risk
        biz_code = business.get("code", "")
        if biz_code == "POULTRY_FARMING":
            market_risk = "HIGH"
            market_score = 65.0
            market_evidence = "Broiler chicken wholesale rates fluctuate sharply (±30%) based on regional feed supply and seasonal demand."
            market_advice = "Opt for contract farming integration with an established poultry integrator to secure fixed growing charges."
        elif biz_code == "DAIRY_FARMING":
            market_risk = "MEDIUM"
            market_score = 35.0
            market_evidence = "Farmgate milk procurement rates are stable through co-operative societies, but private dairy rates fluctuate with fat percentage."
            market_advice = "Maintain high milk fat/SNF through balanced cattle feed and mineral mixtures."
        else:
            market_risk = "LOW"
            market_score = 25.0
            market_evidence = "Local demand for daily essentials and processing services remains consistent throughout the year."
            market_advice = "Provide reliable customer service and transparent electronic weighment."

        factors.append(RiskFactor(
            category="MARKET",
            factor_name="Output Price Volatility",
            risk_level=market_risk,
            score_impact=market_score,
            evidence=market_evidence,
            mitigation_advice=market_advice
        ))

        # 4. Biological / Operational Risk (Animal mortality or machinery failure)
        if "Livestock" in biz_sector:
            bio_risk = "MEDIUM"
            bio_score = 45.0
            bio_evidence = "Livestock is exposed to seasonal viral infections, mastitis, and heat stress."
            bio_advice = "Obtain comprehensive subsidized cattle insurance and adhere strictly to veterinary vaccination schedules."
        else:
            bio_risk = "LOW"
            bio_score = 20.0
            bio_evidence = "Standard mechanical processing with standard manufacturer warranty."
            bio_advice = "Follow scheduled oiling and preventive maintenance of electric motors."

        factors.append(RiskFactor(
            category="OPERATIONAL",
            factor_name="Operational & Asset Vulnerability",
            risk_level=bio_risk,
            score_impact=bio_score,
            evidence=bio_evidence,
            mitigation_advice=bio_advice
        ))

        # Overall composite score
        overall_score = round(sum(f.score_impact for f in factors) / len(factors), 1)
        if overall_score < 40:
            overall_level = "LOW"
        elif overall_score < 70:
            overall_level = "MEDIUM"
        else:
            overall_level = "HIGH"

        category_scores = {
            "Repayment Burden": repay_score,
            "Location & Infra": infra_score,
            "Market Volatility": market_score,
            "Operational Asset": bio_score
        }

        mitigations = [f.mitigation_advice for f in factors]

        return RiskAssessmentResult(
            assessment_id=assessment_id,
            business_id=business.get("business_id", "BIZ_UNKNOWN"),
            business_name=business.get("name", "Rural Business"),
            overall_risk_score=overall_score,
            overall_risk_level=overall_level,
            category_scores=category_scores,
            contributing_factors=factors,
            actionable_mitigations=mitigations
        )
