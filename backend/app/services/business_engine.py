"""
AI-Powered Business Recommendation Engine for GramNiti AI
Evaluates hyper-local village resources, available capital, user skills, and market access.
Produces structured Recommendation Evidence and suitability rankings.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from ..db.seed_data import BUSINESS_TEMPLATES


class RecommendationEvidenceItem(BaseModel):
    recommendation_id: str
    factor: str
    value: str
    impact: str  # "POSITIVE", "NEUTRAL", "CAUTION"
    source: str
    explanation: str


class BusinessRecommendationItem(BaseModel):
    business_id: str
    code: str
    name: str
    name_hi: str
    name_mr: str
    sector: str
    suitability_score: float  # 0 to 100
    suitability_rank: int
    typical_investment: float
    estimated_loan_requirement: float
    typical_monthly_profit: float
    break_even_months: int
    risk_level: str  # "LOW", "MEDIUM", "HIGH"
    why_recommended_summary: str
    evidence_list: List[RecommendationEvidenceItem] = Field(default_factory=list)
    key_equipment: List[str] = Field(default_factory=list)


class BusinessEngine:

    @classmethod
    def recommend_businesses(
        cls,
        user_profile: Dict,
        location: Dict
    ) -> List[BusinessRecommendationItem]:
        import uuid
        recommendations: List[BusinessRecommendationItem] = []
        
        user_capital = float(user_profile.get("available_capital", 30000.0))
        user_interest = str(user_profile.get("business_interest", "Dairy Farming")).lower()
        user_skills = [s.lower() for s in user_profile.get("skills", [])]
        user_occupation = str(user_profile.get("occupation", "Farmer")).lower()
        
        # Location attributes
        primary_livelihood = str(location.get("primary_livelihood", "")).lower()
        has_cold_storage = bool(location.get("cold_storage_available", False))
        power_hours = float(location.get("power_reliability_hours_per_day", 18.0))
        village_name = location.get("village_name", "Your Village")
        district = location.get("district", "Your District")
        
        livestock = location.get("livestock_population", {})
        agri_produce = [p.lower() for p in location.get("agricultural_produce", [])]

        for biz in BUSINESS_TEMPLATES:
            rec_id = f"REC_{uuid.uuid4().hex[:8].upper()}"
            evidence: List[RecommendationEvidenceItem] = []
            score = 60.0  # Baseline
            
            # 1. Capital Match Factor
            typical_inv = biz["typical_investment"]
            req_own_contrib = typical_inv * (biz["typical_own_contribution_pct"] / 100.0)
            
            if user_capital >= req_own_contrib:
                score += 15.0
                evidence.append(RecommendationEvidenceItem(
                    recommendation_id=rec_id,
                    factor="Capital Affordability",
                    value=f"Available: ₹{user_capital:,.0f} vs Required Margin: ₹{req_own_contrib:,.0f}",
                    impact="POSITIVE",
                    source="User Profile & Financial Standards",
                    explanation=f"Your available capital covers the required {biz['typical_own_contribution_pct']:.0f}% promoter equity."
                ))
            else:
                score -= 10.0
                evidence.append(RecommendationEvidenceItem(
                    recommendation_id=rec_id,
                    factor="Capital Gap",
                    value=f"Available: ₹{user_capital:,.0f} vs Required Margin: ₹{req_own_contrib:,.0f}",
                    impact="CAUTION",
                    source="User Profile & Financial Standards",
                    explanation=f"A small capital gap of ₹{(req_own_contrib - user_capital):,.0f} can be bridged via SHG group funds or government micro-credit."
                ))

            # 2. Local Resource & Demand Match
            biz_code = biz["code"]
            if biz_code == "DAIRY_FARMING":
                has_cows = any("cow" in k.lower() or "cattle" in k.lower() or "buffalo" in k.lower() for k in livestock.keys())
                if has_cows or "dairy" in primary_livelihood:
                    score += 18.0
                    evidence.append(RecommendationEvidenceItem(
                        recommendation_id=rec_id,
                        factor="Local Dairy Ecosystem",
                        value=f"High livestock presence in {village_name}, {district}",
                        impact="POSITIVE",
                        source="Village Livestock Dataset (DEMO DATA)",
                        explanation="Existing veterinary care, fodder supply, and co-operative milk collection routes make dairy highly sustainable."
                    ))
            elif biz_code == "COLD_PRESSED_OIL":
                has_oilseeds = any("soybean" in p or "groundnut" in p or "mustard" in p for p in agri_produce)
                if has_oilseeds:
                    score += 16.0
                    evidence.append(RecommendationEvidenceItem(
                        recommendation_id=rec_id,
                        factor="Raw Material Proximity",
                        value=f"Local cultivation of oilseeds in {district}",
                        impact="POSITIVE",
                        source="Agricultural Produce Open Dataset (DEMO DATA)",
                        explanation="Direct procurement from neighboring farms eliminates distributor middleman costs."
                    ))
            elif biz_code == "POULTRY_FARMING":
                if power_hours >= 16.0:
                    score += 12.0
                    evidence.append(RecommendationEvidenceItem(
                        recommendation_id=rec_id,
                        factor="Broiler Management Infrastructure",
                        value=f"{power_hours} hours reliable daily electricity",
                        impact="POSITIVE",
                        source="Rural Utility Infrastructure Profile",
                        explanation="Adequate power reliability ensures brooder heating and ventilation fans operate continuously."
                    ))

            # 3. User Interest & Skill Alignment
            if biz["name"].lower() in user_interest or biz_code.lower() in user_interest:
                score += 12.0
                evidence.append(RecommendationEvidenceItem(
                    recommendation_id=rec_id,
                    factor="User Interest Alignment",
                    value=user_interest.title(),
                    impact="POSITIVE",
                    source="User Onboarding Input",
                    explanation="Matches your stated entrepreneurial interest."
                ))

            # Normalize Score
            final_score = max(35.0, min(95.0, score))
            
            # Risk Level
            if final_score >= 80:
                risk_level = "LOW"
            elif final_score >= 65:
                risk_level = "MEDIUM"
            else:
                risk_level = "HIGH"

            # Estimated Loan
            est_loan = typical_inv - req_own_contrib
            typ_profit = biz["typical_revenue_monthly"] - biz["typical_expenses_monthly"]

            summary_text = (
                f"Based on available hyper-local data for {village_name}, your capital capacity, "
                f"and favorable village economic factors, this enterprise shows a strong suitability index."
            )

            recommendations.append(BusinessRecommendationItem(
                business_id=biz["business_id"],
                code=biz["code"],
                name=biz["name"],
                name_hi=biz["name_hi"],
                name_mr=biz["name_mr"],
                sector=biz["sector"],
                suitability_score=round(final_score, 0),
                suitability_rank=1,
                typical_investment=biz["typical_investment"],
                estimated_loan_requirement=round(est_loan, 0),
                typical_monthly_profit=round(typ_profit, 0),
                break_even_months=biz["break_even_months"],
                risk_level=risk_level,
                why_recommended_summary=summary_text,
                evidence_list=evidence,
                key_equipment=biz["equipment_needed"]
            ))

        # Sort by suitability score descending and set ranks
        recommendations.sort(key=lambda x: x.suitability_score, reverse=True)
        for idx, rec in enumerate(recommendations):
            rec.suitability_rank = idx + 1

        return recommendations
