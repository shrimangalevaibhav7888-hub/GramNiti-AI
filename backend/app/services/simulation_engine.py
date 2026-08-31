"""
3-Scenario Business Simulation Engine for GramNiti AI
Maintains transparent assumptions metadata (parameter, value, unit, min, max, source, last_updated).
Computes Best, Normal, and Worst case outcomes deterministically.
Outputs are explicitly labeled as simulations/estimates.
"""

from typing import Dict, List, Any
from pydantic import BaseModel, Field
from .finance_engine import FinanceEngine


class AssumptionItem(BaseModel):
    parameter: str
    label: str
    value: float
    unit: str
    minimum: float
    maximum: float
    source: str
    last_updated: str


class ScenarioMetricRow(BaseModel):
    metric_name: str
    best_case: float
    normal_case: float
    worst_case: float
    unit: str
    explanation: str


class ScenarioOutcome(BaseModel):
    scenario_name: str  # "Best Case", "Normal Case", "Worst Case"
    monthly_revenue: float
    monthly_expenses: float
    gross_operating_profit: float
    monthly_emi: float
    net_cash_remaining: float
    annual_net_cash: float
    break_even_months: int


class BusinessSimulationResult(BaseModel):
    business_id: str
    business_name: str
    total_investment: float
    loan_amount: float
    monthly_emi: float
    assumptions_used: List[AssumptionItem] = Field(default_factory=list)
    
    best_case: ScenarioOutcome
    normal_case: ScenarioOutcome
    worst_case: ScenarioOutcome
    
    comparison_table: List[ScenarioMetricRow] = Field(default_factory=list)
    break_even_estimate_months: int
    is_estimate: bool = True
    disclaimer: str = (
        "IMPORTANT NOTICE: All figures shown are mathematical projections based on user-selected "
        "assumptions and typical operating metrics. Actual enterprise revenue and profits vary based "
        "on local market demand, commodity price shifts, management quality, and weather factors. "
        "These simulations are decision-support estimates, not guaranteed income."
    )


class SimulationEngine:

    @classmethod
    def simulate_dairy_farming(
        cls,
        assumptions_map: Dict[str, float],
        loan_amount: float = 180000.0,
        interest_rate: float = 8.5,
        tenure_months: int = 60
    ) -> BusinessSimulationResult:
        # Extract parameters with safe defaults
        num_animals = float(assumptions_map.get("num_animals", 2))
        cost_per_animal = float(assumptions_map.get("animal_cost_inr", 85000))
        shed_cost = float(assumptions_map.get("shed_and_equipment_cost", 50000))
        daily_yield_liter = float(assumptions_map.get("milk_yield_per_day", 13.0))
        milk_price = float(assumptions_map.get("milk_selling_price", 42.0))
        feed_cost_day = float(assumptions_map.get("feed_cost_per_day", 180.0))
        vet_cost_month = float(assumptions_map.get("vet_and_medicines_monthly", 1200.0))
        util_cost_month = float(assumptions_map.get("electricity_water_monthly", 1000.0))

        total_capex = (num_animals * cost_per_animal) + shed_cost
        emi_res = FinanceEngine.calculate_emi(loan_amount, interest_rate, tenure_months)
        emi = emi_res.monthly_emi

        # Normal Case (30 days/month)
        normal_monthly_liters = num_animals * daily_yield_liter * 30.0
        normal_revenue = normal_monthly_liters * milk_price
        normal_feed = num_animals * feed_cost_day * 30.0
        normal_expenses = normal_feed + vet_cost_month + util_cost_month
        normal_gross_profit = normal_revenue - normal_expenses
        normal_cash = normal_gross_profit - emi

        # Best Case (+15% yield, +8% price, -5% feed cost)
        best_yield = daily_yield_liter * 1.15
        best_price = milk_price * 1.08
        best_revenue = (num_animals * best_yield * 30.0) * best_price
        best_expenses = (num_animals * (feed_cost_day * 0.95) * 30.0) + (vet_cost_month * 0.85) + util_cost_month
        best_gross_profit = best_revenue - best_expenses
        best_cash = best_gross_profit - emi

        # Worst Case (-20% yield due to summer/disease, -10% price, +15% feed price)
        worst_yield = daily_yield_liter * 0.80
        worst_price = milk_price * 0.90
        worst_revenue = (num_animals * worst_yield * 30.0) * worst_price
        worst_expenses = (num_animals * (feed_cost_day * 1.15) * 30.0) + (vet_cost_month * 1.35) + util_cost_month
        worst_gross_profit = worst_revenue - worst_expenses
        worst_cash = worst_gross_profit - emi

        # Break even estimation (Months = Capex / Monthly Cashflow)
        be_normal = max(1, round(total_capex / max(100.0, normal_cash))) if normal_cash > 0 else 99
        be_best = max(1, round(total_capex / max(100.0, best_cash))) if best_cash > 0 else 99
        be_worst = max(1, round(total_capex / max(100.0, worst_cash))) if worst_cash > 0 else 99

        best_outcome = ScenarioOutcome(
            scenario_name="Best Case",
            monthly_revenue=round(best_revenue, 2),
            monthly_expenses=round(best_expenses, 2),
            gross_operating_profit=round(best_gross_profit, 2),
            monthly_emi=emi,
            net_cash_remaining=round(best_cash, 2),
            annual_net_cash=round(best_cash * 12, 2),
            break_even_months=be_best
        )
        normal_outcome = ScenarioOutcome(
            scenario_name="Normal Case",
            monthly_revenue=round(normal_revenue, 2),
            monthly_expenses=round(normal_expenses, 2),
            gross_operating_profit=round(normal_gross_profit, 2),
            monthly_emi=emi,
            net_cash_remaining=round(normal_cash, 2),
            annual_net_cash=round(normal_cash * 12, 2),
            break_even_months=be_normal
        )
        worst_outcome = ScenarioOutcome(
            scenario_name="Worst Case",
            monthly_revenue=round(worst_revenue, 2),
            monthly_expenses=round(worst_expenses, 2),
            gross_operating_profit=round(worst_gross_profit, 2),
            monthly_emi=emi,
            net_cash_remaining=round(worst_cash, 2),
            annual_net_cash=round(worst_cash * 12, 2),
            break_even_months=be_worst
        )

        comparison_table = [
            ScenarioMetricRow(
                metric_name="Monthly Milk Production",
                best_case=round(num_animals * best_yield * 30.0, 1),
                normal_case=round(normal_monthly_liters, 1),
                worst_case=round(num_animals * worst_yield * 30.0, 1),
                unit="Liters / month",
                explanation="Milk volume varies with breed lactation cycle and balanced green/dry nutrition."
            ),
            ScenarioMetricRow(
                metric_name="Monthly Revenue",
                best_case=round(best_revenue, 2),
                normal_case=round(normal_revenue, 2),
                worst_case=round(worst_revenue, 2),
                unit="₹ / month",
                explanation="Gross milk sales to dairy co-operative societies or local consumers."
            ),
            ScenarioMetricRow(
                metric_name="Monthly Operating Expenses",
                best_case=round(best_expenses, 2),
                normal_case=round(normal_expenses, 2),
                worst_case=round(worst_expenses, 2),
                unit="₹ / month",
                explanation="Cattle feed, green fodder, dry straw, medicines, and utility charges."
            ),
            ScenarioMetricRow(
                metric_name="Net Operating Profit (Pre-EMI)",
                best_case=round(best_gross_profit, 2),
                normal_case=round(normal_gross_profit, 2),
                worst_case=round(worst_gross_profit, 2),
                unit="₹ / month",
                explanation="Operational surplus before deducting loan installment repayment."
            ),
            ScenarioMetricRow(
                metric_name="Monthly Bank EMI",
                best_case=round(emi, 2),
                normal_case=round(emi, 2),
                worst_case=round(emi, 2),
                unit="₹ / month",
                explanation="Fixed monthly loan repayment installment."
            ),
            ScenarioMetricRow(
                metric_name="Net Cash Remaining (Post-EMI)",
                best_case=round(best_cash, 2),
                normal_case=round(normal_cash, 2),
                worst_case=round(worst_cash, 2),
                unit="₹ / month",
                explanation="Take-home disposable cash surplus available to the farmer family."
            )
        ]

        assumptions_list = [
            AssumptionItem(
                parameter="num_animals", label="Milch Animals", value=num_animals, unit="animals",
                minimum=1, maximum=10, source="NABARD Model Dairy Scheme", last_updated="2026-08-01"
            ),
            AssumptionItem(
                parameter="animal_cost_inr", label="Cost per Animal", value=cost_per_animal, unit="₹ / animal",
                minimum=50000, maximum=130000, source="State Cattle Market Benchmark", last_updated="2026-08-01"
            ),
            AssumptionItem(
                parameter="milk_yield_per_day", label="Daily Milk Yield", value=daily_yield_liter, unit="Liters / day",
                minimum=8.0, maximum=24.0, source="DAHD Livestock Metrics", last_updated="2026-08-01"
            ),
            AssumptionItem(
                parameter="milk_selling_price", label="Milk Selling Price", value=milk_price, unit="₹ / Liter",
                minimum=32.0, maximum=58.0, source="District Co-operative Benchmark", last_updated="2026-08-01"
            ),
            AssumptionItem(
                parameter="feed_cost_per_day", label="Feed Cost per Animal", value=feed_cost_day, unit="₹ / day",
                minimum=120.0, maximum=280.0, source="NDRI Cattle Feed Guidelines", last_updated="2026-08-01"
            )
        ]

        return BusinessSimulationResult(
            business_id="BIZ_DAIRY_FARMING",
            business_name="Dairy Farming",
            total_investment=round(total_capex, 2),
            loan_amount=round(loan_amount, 2),
            monthly_emi=emi,
            assumptions_used=assumptions_list,
            best_case=best_outcome,
            normal_case=normal_outcome,
            worst_case=worst_outcome,
            comparison_table=comparison_table,
            break_even_estimate_months=be_normal
        )

    @classmethod
    def simulate_generic(
        cls,
        business_id: str,
        business_name: str,
        total_investment: float,
        typical_monthly_revenue: float,
        typical_monthly_expenses: float,
        loan_amount: float = 150000.0,
        interest_rate: float = 8.5,
        tenure_months: int = 60
    ) -> BusinessSimulationResult:
        emi_res = FinanceEngine.calculate_emi(loan_amount, interest_rate, tenure_months)
        emi = emi_res.monthly_emi

        # Normal Case
        normal_rev = typical_monthly_revenue
        normal_exp = typical_monthly_expenses
        normal_profit = normal_rev - normal_exp
        normal_cash = normal_profit - emi

        # Best Case (+20% revenue, -5% expense)
        best_rev = normal_rev * 1.20
        best_exp = normal_exp * 0.95
        best_profit = best_rev - best_exp
        best_cash = best_profit - emi

        # Worst Case (-20% revenue, +15% expense)
        worst_rev = normal_rev * 0.80
        worst_exp = normal_exp * 1.15
        worst_profit = worst_rev - worst_exp
        worst_cash = worst_profit - emi

        be_normal = max(1, round(total_investment / max(100.0, normal_cash))) if normal_cash > 0 else 99
        be_best = max(1, round(total_investment / max(100.0, best_cash))) if best_cash > 0 else 99
        be_worst = max(1, round(total_investment / max(100.0, worst_cash))) if worst_cash > 0 else 99

        best_outcome = ScenarioOutcome(
            scenario_name="Best Case", monthly_revenue=round(best_rev, 2), monthly_expenses=round(best_exp, 2),
            gross_operating_profit=round(best_profit, 2), monthly_emi=emi, net_cash_remaining=round(best_cash, 2),
            annual_net_cash=round(best_cash * 12, 2), break_even_months=be_best
        )
        normal_outcome = ScenarioOutcome(
            scenario_name="Normal Case", monthly_revenue=round(normal_rev, 2), monthly_expenses=round(normal_exp, 2),
            gross_operating_profit=round(normal_profit, 2), monthly_emi=emi, net_cash_remaining=round(normal_cash, 2),
            annual_net_cash=round(normal_cash * 12, 2), break_even_months=be_normal
        )
        worst_outcome = ScenarioOutcome(
            scenario_name="Worst Case", monthly_revenue=round(worst_rev, 2), monthly_expenses=round(worst_exp, 2),
            gross_operating_profit=round(worst_profit, 2), monthly_emi=emi, net_cash_remaining=round(worst_cash, 2),
            annual_net_cash=round(worst_cash * 12, 2), break_even_months=be_worst
        )

        comparison_table = [
            ScenarioMetricRow(
                metric_name="Monthly Revenue", best_case=round(best_rev, 2), normal_case=round(normal_rev, 2),
                worst_case=round(worst_rev, 2), unit="₹ / month", explanation="Gross sales and service collections."
            ),
            ScenarioMetricRow(
                metric_name="Monthly Operating Expenses", best_case=round(best_exp, 2), normal_case=round(normal_exp, 2),
                worst_case=round(worst_exp, 2), unit="₹ / month", explanation="Raw materials, electricity, wages, maintenance."
            ),
            ScenarioMetricRow(
                metric_name="Net Profit (Pre-EMI)", best_case=round(best_profit, 2), normal_case=round(normal_profit, 2),
                worst_case=round(worst_profit, 2), unit="₹ / month", explanation="Operating surplus before loan repayment."
            ),
            ScenarioMetricRow(
                metric_name="Monthly Loan EMI", best_case=round(emi, 2), normal_case=round(emi, 2),
                worst_case=round(emi, 2), unit="₹ / month", explanation="Monthly bank debt servicing."
            ),
            ScenarioMetricRow(
                metric_name="Net Cash Remaining (Post-EMI)", best_case=round(best_cash, 2), normal_case=round(normal_cash, 2),
                worst_case=round(worst_cash, 2), unit="₹ / month", explanation="Net cash surplus left with entrepreneur."
            )
        ]

        assumptions_list = [
            AssumptionItem(
                parameter="total_investment", label="Total Capital Project Cost", value=total_investment, unit="₹ total",
                minimum=50000, maximum=1000000, source="MSME Model Project Profile", last_updated="2026-08-01"
            ),
            AssumptionItem(
                parameter="typical_monthly_revenue", label="Baseline Monthly Sales", value=typical_monthly_revenue, unit="₹ / month",
                minimum=10000, maximum=500000, source="Sectoral Micro-Enterprise Survey", last_updated="2026-08-01"
            ),
            AssumptionItem(
                parameter="typical_monthly_expenses", label="Baseline Operating Expenses", value=typical_monthly_expenses, unit="₹ / month",
                minimum=5000, maximum=300000, source="Rural Trade Association Benchmark", last_updated="2026-08-01"
            )
        ]

        return BusinessSimulationResult(
            business_id=business_id,
            business_name=business_name,
            total_investment=round(total_investment, 2),
            loan_amount=round(loan_amount, 2),
            monthly_emi=emi,
            assumptions_used=assumptions_list,
            best_case=best_outcome,
            normal_case=normal_outcome,
            worst_case=worst_outcome,
            comparison_table=comparison_table,
            break_even_estimate_months=be_normal
        )
