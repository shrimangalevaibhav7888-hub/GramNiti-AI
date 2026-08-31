"""
GramNiti Freshness Engine
Monitors freshness of scheme rules and data sources, detects staleness,
and manages transitions between ACTIVE, UNDER_REVIEW, SUPERSEDED, and EXPIRED statuses.
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
from .source_registry import SourceStatus


class FreshnessAssessment(BaseModel):
    entity_id: str
    status: str  # ACTIVE, UNDER_REVIEW, SUPERSEDED, EXPIRED
    is_fresh: bool
    last_verified_at: str
    days_since_verification: int
    staleness_warning: bool
    recommended_action: str


class FreshnessEngine:
    MAX_FRESH_DAYS = 90  # Schemes should be verified at least once every 90 days

    @classmethod
    def assess_freshness(
        cls,
        entity_id: str,
        last_verified_str: str,
        current_status: str = "ACTIVE",
        effective_to: Optional[str] = None
    ) -> FreshnessAssessment:
        now = datetime.now()
        
        # Check expiration date
        if effective_to:
            try:
                exp_date = datetime.strptime(effective_to, "%Y-%m-%d")
                if now > exp_date:
                    return FreshnessAssessment(
                        entity_id=entity_id,
                        status="EXPIRED",
                        is_fresh=False,
                        last_verified_at=last_verified_str,
                        days_since_verification=0,
                        staleness_warning=True,
                        recommended_action="Scheme has passed its validity date. Archive or replace with revised scheme guidelines."
                    )
            except Exception:
                pass

        if current_status == "UNDER_REVIEW":
            return FreshnessAssessment(
                entity_id=entity_id,
                status="UNDER_REVIEW",
                is_fresh=False,
                last_verified_at=last_verified_str,
                days_since_verification=0,
                staleness_warning=True,
                recommended_action="Official source has changed. Admin review and rule re-validation required."
            )

        if current_status == "SUPERSEDED":
            return FreshnessAssessment(
                entity_id=entity_id,
                status="SUPERSEDED",
                is_fresh=False,
                last_verified_at=last_verified_str,
                days_since_verification=0,
                staleness_warning=True,
                recommended_action="A newer version of this government scheme exists. Refer to the active guideline version."
            )

        # Parse last verification date
        days_since = 30
        try:
            v_date = datetime.strptime(last_verified_str, "%Y-%m-%d")
            days_since = max(0, (now - v_date).days)
        except Exception:
            pass

        is_stale = days_since > cls.MAX_FRESH_DAYS

        return FreshnessAssessment(
            entity_id=entity_id,
            status="ACTIVE" if not is_stale else "UNDER_REVIEW",
            is_fresh=not is_stale,
            last_verified_at=last_verified_str,
            days_since_verification=days_since,
            staleness_warning=is_stale,
            recommended_action="Active and validated against official ministry guidelines." if not is_stale else "Stale source check needed. Verify with latest official portal bulletin."
        )
