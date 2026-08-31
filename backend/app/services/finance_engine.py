"""
Deterministic Financial Engine for GramNiti AI
Pure mathematical calculations for EMI, amortization schedules, project financing,
margin money, credit-linked subsidies, and multi-frequency repayment (Monthly & Quarterly).
Never uses LLM for arithmetic.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class AmortizationScheduleRow(BaseModel):
    month: Optional[int] = None
    period: int = 1
    period_label: str = "Month 1"
    opening_balance: float
    installment_amount: float
    emi: Optional[float] = None
    principal_component: float
    interest_component: float
    closing_balance: float


class EMICalculationResult(BaseModel):
    principal: float
    annual_interest_rate_pct: float
    tenure_months: int
    repayment_frequency: str = "MONTHLY"  # "MONTHLY", "QUARTERLY"
    periods_total: int
    installment_amount: float
    monthly_emi: float  # Maintained for full backward compatibility
    total_interest: float
    total_repayment: float
    amortization_preview: List[AmortizationScheduleRow] = Field(default_factory=list)


class ProjectFinanceResult(BaseModel):
    total_project_cost: float
    own_contribution_amount: float
    own_contribution_pct: float
    subsidy_amount: float
    subsidy_pct: float
    subsidy_ceiling_applied: bool = False
    loan_requirement: float
    repayment_frequency: str = "MONTHLY"
    installment_amount: float  # Periodic EMI or Quarterly Installment
    monthly_emi: float  # Normalized monthly payment for backward compatibility
    monthly_emi_equivalent: float
    interest_rate_pct: float
    tenure_months: int
    moratorium_months: int = 0
    funding_gap: float = 0.0
    scheme_code: Optional[str] = None
    calculation_explanation: str
    transparency_breakdown: Dict[str, str] = Field(default_factory=dict)


class FinanceEngine:

    @classmethod
    def calculate_emi(
        cls,
        principal: float,
        annual_rate_pct: float,
        tenure_months: int,
        repayment_frequency: str = "MONTHLY"
    ) -> EMICalculationResult:
        """
        Standard Monthly EMI / Periodic Installment Calculation.
        """
        return cls.calculate_amortization(principal, annual_rate_pct, tenure_months, repayment_frequency)

    @classmethod
    def calculate_amortization(
        cls,
        principal: float,
        annual_rate_pct: float,
        tenure_months: int,
        repayment_frequency: str = "MONTHLY",
        moratorium_months: int = 0
    ) -> EMICalculationResult:
        """
        Standard Reducing-Balance Installment Formula with Multi-Frequency Support:
        Periodic Rate r = (Annual Rate / 100) / (Periods per year)
        Monthly: Periods/year = 12
        Quarterly: Periods/year = 4
        Installment = P * r * (1 + r)^n / ((1 + r)^n - 1)
        """
        frequency_upper = repayment_frequency.upper()
        if frequency_upper == "QUARTERLY":
            periods_per_year = 4
            num_periods = max(1, tenure_months // 3)
            label_prefix = "Quarter"
        else:
            frequency_upper = "MONTHLY"
            periods_per_year = 12
            num_periods = max(1, tenure_months)
            label_prefix = "Month"

        if principal <= 0 or num_periods <= 0:
            return EMICalculationResult(
                principal=0, annual_interest_rate_pct=annual_rate_pct, tenure_months=tenure_months,
                repayment_frequency=frequency_upper, periods_total=num_periods,
                installment_amount=0, monthly_emi=0, total_interest=0, total_repayment=0, amortization_preview=[]
            )

        r = (annual_rate_pct / 100.0) / periods_per_year
        n = num_periods

        if r == 0:
            installment = principal / n
            total_repayment = principal
            total_interest = 0.0
        else:
            installment = principal * (r * ((1 + r) ** n)) / (((1 + r) ** n) - 1)
            total_repayment = installment * n
            total_interest = total_repayment - principal

        # Generate preview amortization schedule (first 12 periods)
        schedule: List[AmortizationScheduleRow] = []
        balance = principal

        for p in range(1, min(n + 1, 13)):
            interest_part = balance * r
            principal_part = installment - interest_part
            closing = max(0.0, balance - principal_part)
            schedule.append(AmortizationScheduleRow(
                month=p if frequency_upper == "MONTHLY" else p * 3,
                period=p,
                period_label=f"{label_prefix} {p}",
                opening_balance=round(balance, 2),
                installment_amount=round(installment, 2),
                emi=round(installment, 2),
                principal_component=round(principal_part, 2),
                interest_component=round(interest_part, 2),
                closing_balance=round(closing, 2)
            ))
            balance = closing

        monthly_emi_val = round(installment if frequency_upper == "MONTHLY" else (installment / 3.0), 2)

        return EMICalculationResult(
            principal=round(principal, 2),
            annual_interest_rate_pct=annual_rate_pct,
            tenure_months=tenure_months,
            repayment_frequency=frequency_upper,
            periods_total=n,
            installment_amount=round(installment, 2),
            monthly_emi=monthly_emi_val,
            total_interest=round(total_interest, 2),
            total_repayment=round(total_repayment, 2),
            amortization_preview=schedule
        )

    @classmethod
    def structure_project_finance(
        cls,
        total_project_cost: float,
        own_contribution_pct: Optional[float] = None,
        subsidy_pct: Optional[float] = None,
        annual_interest_rate_pct: float = 8.5,
        tenure_months: int = 60,
        moratorium_months: int = 0,
        repayment_frequency: str = "MONTHLY",
        scheme_rules: Optional[Dict] = None,
        user_category: str = "General",
        is_rural: bool = True
    ) -> ProjectFinanceResult:
        """
        Scheme-Dependent Deterministic Financial Structuring:
        Extracts required margin, subsidy percentages, maximum project cost ceilings,
        and interest subvention from the versioned scheme rule base.
        """
        # 1. Resolve Margin & Subsidy dynamically from scheme if provided
        final_margin_pct = own_contribution_pct
        final_subsidy_pct = subsidy_pct
        max_cost_ceiling = 5000000.0  # ₹50 Lakh default ceiling
        max_loan_ceiling = 4500000.0
        scheme_code = None

        if scheme_rules:
            scheme_code = scheme_rules.get("code")
            max_cost_ceiling = float(scheme_rules.get("max_loan_amount", 2500000.0)) * 1.15
            max_loan_ceiling = float(scheme_rules.get("max_loan_amount", 2500000.0))
            
            # Category-based margin determination
            is_special = user_category.upper() in ["SC", "ST", "OBC", "WOMEN", "MINORITY", "EX-SERVICEMAN", "PH"]
            if final_margin_pct is None:
                if is_special:
                    final_margin_pct = float(scheme_rules.get("margin_money_percentage_special", 5.0))
                else:
                    final_margin_pct = float(scheme_rules.get("margin_money_percentage_general", 10.0))
            
            # Subsidy calculation based on scheme rules
            if final_subsidy_pct is None:
                if is_special and is_rural:
                    final_subsidy_pct = float(scheme_rules.get("subsidy_percentage_special_rural", 35.0))
                else:
                    final_subsidy_pct = float(scheme_rules.get("subsidy_percentage_general_rural", 25.0))

            # Repayment frequency preference from scheme if set
            if "repayment_period_months" in scheme_rules and tenure_months == 60:
                tenure_months = int(scheme_rules.get("repayment_period_months", 60))
            if "moratorium_months" in scheme_rules and moratorium_months == 0:
                moratorium_months = int(scheme_rules.get("moratorium_months", 6))

        # Defaults if not defined
        final_margin_pct = final_margin_pct if final_margin_pct is not None else 10.0
        final_subsidy_pct = final_subsidy_pct if final_subsidy_pct is not None else 25.0

        # Cap cost to scheme limits
        effective_cost = min(total_project_cost, max_cost_ceiling)
        
        # 2. Deterministic Amounts
        own_amount = round(effective_cost * (final_margin_pct / 100.0), 2)
        raw_subsidy_amount = round(effective_cost * (final_subsidy_pct / 100.0), 2)
        
        # Scheme specific subsidy capping (e.g. PMFME capped at ₹10 Lakhs)
        subsidy_ceiling_applied = False
        if scheme_code == "PMFME" and raw_subsidy_amount > 1000000.0:
            subsidy_amount = 1000000.0
            subsidy_ceiling_applied = True
        else:
            subsidy_amount = raw_subsidy_amount

        # Loan Requirement = Project Cost - Own Contribution
        loan_amount = min(max(0.0, round(effective_cost - own_amount, 2)), max_loan_ceiling)

        # 3. Multi-frequency amortization calculation
        amort_res = cls.calculate_amortization(
            principal=loan_amount,
            annual_rate_pct=annual_interest_rate_pct,
            tenure_months=tenure_months,
            repayment_frequency=repayment_frequency,
            moratorium_months=moratorium_months
        )

        monthly_equiv = amort_res.installment_amount if repayment_frequency.upper() == "MONTHLY" else round(amort_res.installment_amount / 3.0, 2)

        explanation = (
            f"For an eligible project cost of ₹{effective_cost:,.0f} under {scheme_code or 'Standard Scheme'}, "
            f"your required margin contribution is {final_margin_pct:.1f}% (₹{own_amount:,.0f}). "
            f"The bank term loan required is ₹{loan_amount:,.0f}. "
            f"Eligible credit-linked back-ended subsidy is {final_subsidy_pct:.1f}% (₹{subsidy_amount:,.0f}), "
            f"with a {repayment_frequency.lower()} installment of ₹{amort_res.installment_amount:,.0f}."
        )

        transparency = {
            "own_contribution": "Calculated via Scheme Beneficiary Margin Rule (Deterministic)",
            "eligible_loan": "Calculated as (Project Cost - Own Contribution) capped to statutory limit",
            "subsidy_amount": "Calculated via Scheme Gazette Formula (Back-Ended TDR)",
            "amortization": f"Calculated via Standard Reducing-Balance {repayment_frequency.capitalize()} Formula"
        }

        return ProjectFinanceResult(
            total_project_cost=round(effective_cost, 2),
            own_contribution_amount=own_amount,
            own_contribution_pct=final_margin_pct,
            subsidy_amount=subsidy_amount,
            subsidy_pct=final_subsidy_pct,
            subsidy_ceiling_applied=subsidy_ceiling_applied,
            loan_requirement=loan_amount,
            repayment_frequency=repayment_frequency.upper(),
            installment_amount=amort_res.installment_amount,
            monthly_emi=monthly_equiv,
            monthly_emi_equivalent=monthly_equiv,
            interest_rate_pct=annual_interest_rate_pct,
            tenure_months=tenure_months,
            moratorium_months=moratorium_months,
            funding_gap=0.0,
            scheme_code=scheme_code,
            calculation_explanation=explanation,
            transparency_breakdown=transparency
        )

    @classmethod
    def route_margin_to_scheme(
        cls,
        available_margin_capital: float,
        repayment_frequency: str = "QUARTERLY"
    ) -> Dict:
        """
        Official State Channelizing Agency (SCA/CA) Concessional Credit Router:
        1. Total Feasible Project Cost = Available Margin / 10%
        2. Maximum Loan Amount = 90% of Project Cost
        3. Logic A: Project Cost <= ₹1.40 Lakh -> Micro Finance Scheme (6.5% interest, 3-yr tenure, 3-mo moratorium, max loan ₹1.25L)
        4. Logic B: Project Cost > ₹1.40 Lakh and <= ₹50.00 Lakh -> Term Loan Scheme (8% interest, 7-yr tenure, 6-mo moratorium, max loan ₹45L)
        """
        margin = max(1000.0, float(available_margin_capital))
        feasible_project_cost = margin / 0.10
        raw_loan = feasible_project_cost * 0.90

        if feasible_project_cost <= 140000.0:
            scheme_name = "Micro Finance Scheme"
            scheme_code = "MFS"
            tier = "Micro Finance Scheme (Up to ₹1.40 Lakh Cost)"
            interest_rate = 6.5
            tenure_years = 3
            tenure_months = 36
            moratorium_months = 3
            max_loan_limit = 125000.0
            actual_loan = min(raw_loan, max_loan_limit)
            logic_desc = f"Project Cost of ₹{feasible_project_cost:,.0f} ≤ ₹1.40 Lakh -> Micro Finance Scheme (6.5% interest, 3-year tenure, 3-month moratorium, max loan ₹1.25 Lakh)"
        else:
            scheme_name = "Term Loan Scheme"
            scheme_code = "TLS"
            tier = "Term Loan Scheme (₹1.40 Lakh to ₹50.00 Lakh Cost)"
            interest_rate = 8.0
            tenure_years = 7
            tenure_months = 84
            moratorium_months = 6
            max_loan_limit = 4500000.0
            capped_cost = min(feasible_project_cost, 5000000.0)
            actual_loan = min(capped_cost * 0.90, max_loan_limit)
            logic_desc = f"Project Cost of ₹{feasible_project_cost:,.0f} > ₹1.40 Lakh and ≤ ₹50.00 Lakh -> Term Loan Scheme (8% interest, 7-year tenure, 6-month moratorium, max loan ₹45 Lakh)"

        # Break into CapEx (75%) and Working Capital (25%)
        machinery_capex = round(feasible_project_cost * 0.75, 2)
        working_capital = round(feasible_project_cost * 0.25, 2)

        # Calculate amortization with repayment frequency
        amort = cls.calculate_amortization(
            principal=actual_loan,
            annual_rate_pct=interest_rate,
            tenure_months=tenure_months,
            repayment_frequency=repayment_frequency,
            moratorium_months=moratorium_months
        )

        monthly_equiv = amort.installment_amount if repayment_frequency.upper() == "MONTHLY" else round(amort.installment_amount / 3.0, 2)

        return {
            "available_margin_capital": round(margin, 2),
            "margin_percentage": 10.0,
            "total_feasible_project_cost": round(feasible_project_cost, 2),
            "maximum_loan_amount": round(actual_loan, 2),
            "selected_scheme_name": scheme_name,
            "selected_scheme_tier": tier,
            "scheme_code": scheme_code,
            "annual_interest_rate_pct": interest_rate,
            "tenure_years": tenure_years,
            "tenure_months": tenure_months,
            "moratorium_months": moratorium_months,
            "repayment_frequency": repayment_frequency.upper(),
            "repayment_periods_total": amort.periods_total,
            "installment_amount": amort.installment_amount,
            "monthly_emi_equivalent": monthly_equiv,
            "total_interest": amort.total_interest,
            "total_repayment": amort.total_repayment,
            "machinery_capex_component": machinery_capex,
            "working_capital_component": working_capital,
            "eligibility_logic_applied": logic_desc,
            "amortization_preview": [r.model_dump() for r in amort.amortization_preview]
        }


