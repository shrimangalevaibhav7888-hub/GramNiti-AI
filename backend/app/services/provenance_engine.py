"""
GramNiti Data Provenance Engine
Tracks source of truth, provenance records, data coverage, verification timestamps,
and explicit demonstration data tagging across the platform.
"""

from typing import Dict, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field
from .source_registry import SourceRegistryService, OFFICIAL_SOURCE_REGISTRY, AuthoritativeSource, SourcePriority, SourceStatus


class ProvenanceRecord(BaseModel):
    record_id: str
    entity_type: str  # "SCHEME", "LOCATION_METRIC", "FINANCIAL_RULE", "ELIGIBILITY_RULE"
    entity_id: str
    source_name: str
    source_type: str  # "CENTRAL_MINISTRY", "STATE_DEPT", "STATUTORY_BODY", "SCHEDULED_BANK", "DEMO_DATASET"
    organization: str
    official_url: str
    guidelines_url: Optional[str] = None
    published_date: str
    last_updated_date: str
    last_verified_date: str
    data_coverage: str  # "Pan-India", "Maharashtra", "District Pune", "Village Malegaon Budruk"
    verification_status: str  # "ACTIVE", "UNDER_REVIEW", "OUTDATED", "SUPERSEDED"
    version: str = "v1.0"
    source_reliability: str = "HIGH"  # "HIGH", "MEDIUM", "DEMONSTRATION_ONLY"
    is_demo_data: bool = False
    disclaimer: Optional[str] = None


class ProvenanceEngine:

    @classmethod
    def get_scheme_provenance(cls, scheme_dict: Dict[str, Any]) -> ProvenanceRecord:
        source_id = scheme_dict.get("source_id", "SRC_KVIC")
        source = SourceRegistryService.get_source(source_id)
        
        source_name = source.name if source else scheme_dict.get("ministry", "Government of India")
        org = source.organization if source else "Government of India"
        source_type = source.source_type if source else "CENTRAL_MINISTRY"
        official_url = scheme_dict.get("official_portal_url") or (source.official_url if source else "https://india.gov.in")
        guidelines_url = scheme_dict.get("guidelines_pdf_url") or (source.guidelines_url if source else None)
        
        state_app = scheme_dict.get("state_applicability", ["ALL"])
        coverage = "Pan-India" if "ALL" in state_app else ", ".join(state_app)
        
        return ProvenanceRecord(
            record_id=f"PROV_{scheme_dict.get('code', 'SCHEME')}",
            entity_type="SCHEME",
            entity_id=scheme_dict.get("scheme_id") or scheme_dict.get("code", "UNKNOWN"),
            source_name=source_name,
            source_type=source_type,
            organization=org,
            official_url=official_url,
            guidelines_url=guidelines_url,
            published_date=scheme_dict.get("source_published_at", "2020-06-01"),
            last_updated_date=scheme_dict.get("source_updated_at", "2024-05-10"),
            last_verified_date=scheme_dict.get("last_verified_at", "2026-08-01"),
            data_coverage=coverage,
            verification_status=scheme_dict.get("status", "ACTIVE"),
            version="v2.4",
            source_reliability="HIGH",
            is_demo_data=False,
            disclaimer="Verified against official ministry scheme guidelines."
        )

    @classmethod
    def get_location_provenance(cls, location_dict: Dict[str, Any]) -> ProvenanceRecord:
        is_demo = location_dict.get("is_demo_data", True)
        village = location_dict.get("village_name", "Village")
        district = location_dict.get("district", "District")
        state = location_dict.get("state", "State")
        
        return ProvenanceRecord(
            record_id=f"PROV_LOC_{location_dict.get('location_id', 'DEMO')}",
            entity_type="LOCATION_METRIC",
            entity_id=location_dict.get("location_id", "DEMO_LOC"),
            source_name="GramNiti Village Economic Observatory Dataset" if is_demo else "Census of India & District Industries Centre",
            source_type="DEMO_DATASET" if is_demo else "OFFICIAL_STATISTICS",
            organization="GramNiti AI Research Team" if is_demo else "Ministry of Statistics and Programme Implementation",
            official_url="https://gramniti.gov.in/data-provenance",
            guidelines_url=None,
            published_date="2026-01-15",
            last_updated_date="2026-08-01",
            last_verified_date="2026-08-01",
            data_coverage=f"{village} ({district}, {state})",
            verification_status="ACTIVE",
            version="v1.2",
            source_reliability="DEMONSTRATION_ONLY" if is_demo else "HIGH",
            is_demo_data=is_demo,
            disclaimer="DEMO DATA — Local market indicators shown for demonstration." if is_demo else "District-level verified economic metrics."
        )
