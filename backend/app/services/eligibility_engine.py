"""
Deterministic Eligibility Engine for GramNiti AI
Evaluates scheme criteria deterministically with condition-by-condition breakdown.
Strictly distinguishes Scheme Eligibility from Bank Loan Approval.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from ..db.seed_data import VERIFIED_SCHEMES


class RuleCheckItem(BaseModel):
    condition_name: str
    required_value: str
    user_value: str
    is_satisfied: bool
    explanation: str


class EligibilityEvaluationResult(BaseModel):
    scheme_id: str
    scheme_code: str
    scheme_name: str
    status: str  # "ELIGIBLE", "POTENTIALLY_ELIGIBLE", "NOT_ELIGIBLE"
    is_eligible: bool
    applicable_subsidy_pct: float
    applicable_margin_money_pct: float
    conditions_checked: List[RuleCheckItem] = Field(default_factory=list)
    missing_or_failed_conditions: List[str] = Field(default_factory=list)
    official_portal_url: str
    guidelines_pdf_url: Optional[str] = None
    disclaimer: str = (
        "IMPORTANT: Scheme eligibility confirms that you meet the statutory criteria of the "
        "government scheme. It does NOT constitute a bank loan approval or sanction. "
        "Bank loan sanction is subject to the lending institution's internal credit appraisal, "
        "CIBIL score check, and physical verification."
    )


class EligibilityEngine:

    @classmethod
    def evaluate_eligibility(cls, scheme: Dict, user_profile: Dict) -> EligibilityEvaluationResult:
        conditions: List[RuleCheckItem] = []
        failed_conditions: List[str] = []
        
        user_age = int(user_profile.get("age", 30))
        user_category = str(user_profile.get("social_category", "General"))
        user_gender = str(user_profile.get("gender", "Male"))
        user_income = float(user_profile.get("annual_income_inr", 180000.0))
        desired_loan = float(user_profile.get("desired_loan_amount", 200000.0))
        is_rural = bool(user_profile.get("is_rural", True))
        
        # 1. Age Condition
        min_age = scheme.get("min_age", 18)
        max_age = scheme.get("max_age", 65)
        age_pass = min_age <= user_age <= max_age
        conditions.append(RuleCheckItem(
            condition_name="Age Requirement",
            required_value=f"Between {min_age} and {max_age} years",
            user_value=f"{user_age} years",
            is_satisfied=age_pass,
            explanation="Applicant meets the statutory age criteria." if age_pass else f"Applicant age ({user_age}) is outside the permitted range ({min_age}-{max_age})."
        ))
        if not age_pass:
            failed_conditions.append(f"Age must be between {min_age} and {max_age} years.")

        # 2. Social Category & Special Provision
        is_special_category = user_category in ["SC", "ST", "OBC", "Minority"] or user_gender in ["Female", "Women"]
        category_pass = True
        
        if scheme.get("code") == "STANDUP_INDIA":
            # Stand-Up India is exclusively for SC, ST or Women entrepreneurs
            category_pass = user_category in ["SC", "ST"] or user_gender in ["Female", "Women"]
            conditions.append(RuleCheckItem(
                condition_name="Target Beneficiary Category",
                required_value="SC, ST or Woman Entrepreneur (Greenfield unit)",
                user_value=f"Category: {user_category}, Gender: {user_gender}",
                is_satisfied=category_pass,
                explanation="Applicant belongs to designated SC/ST or Women beneficiary group." if category_pass else "Stand-Up India is specifically reserved for SC, ST, or Women entrepreneurs."
            ))
            if not category_pass:
                failed_conditions.append("Must be SC, ST, or Woman entrepreneur for Stand-Up India.")
        else:
            conditions.append(RuleCheckItem(
                condition_name="Social Category Applicability",
                required_value="Open to General & Reserved Categories",
                user_value=f"{user_category} ({user_gender})",
                is_satisfied=True,
                explanation=f"Category '{user_category}' is eligible under standard/special scheme provisions."
            ))

        # 3. Income Ceiling Check
        max_income = scheme.get("max_annual_income")
        if max_income:
            income_pass = user_income <= max_income
            conditions.append(RuleCheckItem(
                condition_name="Annual Income Ceiling",
                required_value=f"Maximum ₹{max_income:,.0f}/year",
                user_value=f"₹{user_income:,.0f}/year",
                is_satisfied=income_pass,
                explanation="Income is within specified limit." if income_pass else f"Income ₹{user_income:,.0f} exceeds maximum ceiling of ₹{max_income:,.0f}."
            ))
            if not income_pass:
                failed_conditions.append("Income exceeds scheme ceiling.")
        else:
            conditions.append(RuleCheckItem(
                condition_name="Income Ceiling",
                required_value="No restrictive income ceiling",
                user_value=f"₹{user_income:,.0f}/year",
                is_satisfied=True,
                explanation="This scheme has no upper limit on family income."
            ))

        # 4. Loan Amount Range Check
        min_loan = scheme.get("min_loan_amount", 10000.0)
        max_loan = scheme.get("max_loan_amount", 10000000.0)
        loan_pass = min_loan <= desired_loan <= max_loan
        conditions.append(RuleCheckItem(
            condition_name="Loan Quantum Eligibility",
            required_value=f"₹{min_loan:,.0f} to ₹{max_loan:,.0f}",
            user_value=f"₹{desired_loan:,.0f}",
            is_satisfied=loan_pass,
            explanation=f"Requested loan amount is within scheme parameters." if loan_pass else f"Requested loan (₹{desired_loan:,.0f}) is outside scheme limits (₹{min_loan:,.0f}-₹{max_loan:,.0f})."
        ))
        if not loan_pass:
            failed_conditions.append(f"Requested loan must be between ₹{min_loan:,.0f} and ₹{max_loan:,.0f}.")

        # 5. Determine Subsidy and Margin Money Rates dynamically from rules
        if is_special_category and is_rural:
            subsidy_rate = scheme.get("subsidy_percentage_special_rural", 0.0)
            margin_rate = scheme.get("margin_money_percentage_special", 5.0)
        elif is_rural:
            subsidy_rate = scheme.get("subsidy_percentage_general_rural", 0.0)
            margin_rate = scheme.get("margin_money_percentage_general", 10.0)
        else:
            subsidy_rate = scheme.get("subsidy_percentage_general_rural", 0.0) * 0.6  # Urban adjustment where applicable
            margin_rate = scheme.get("margin_money_percentage_general", 10.0)

        # Final Status
        if len(failed_conditions) == 0:
            status = "ELIGIBLE"
            is_eligible = True
        elif len(failed_conditions) == 1 and not loan_pass:
            status = "POTENTIALLY_ELIGIBLE"
            is_eligible = False
        else:
            status = "NOT_ELIGIBLE"
            is_eligible = False

        return EligibilityEvaluationResult(
            scheme_id=scheme.get("scheme_id", "SCHEME_UNKNOWN"),
            scheme_code=scheme.get("code", "UNKNOWN"),
            scheme_name=scheme.get("name", "Unknown Scheme"),
            status=status,
            is_eligible=is_eligible,
            applicable_subsidy_pct=subsidy_rate,
            applicable_margin_money_pct=margin_rate,
            conditions_checked=conditions,
            missing_or_failed_conditions=failed_conditions,
            official_portal_url=scheme.get("official_portal_url", ""),
            guidelines_pdf_url=scheme.get("guidelines_pdf_url")
        )
