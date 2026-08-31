"""
GramNiti Source Registry
Manages authoritative source identity, source priority hierarchy, freshness,
and verification methods. Unverified third-party information is never allowed
to become the source of truth for government scheme rules.
"""

from enum import IntEnum, Enum
from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class SourcePriority(IntEnum):
    """
    Source Hierarchy (Priority 1 is highest authoritative source):
    1. Official Government Ministry/Department
    2. Official Government Scheme Portal
    3. Statutory Government Agency
    4. Official Implementing Agency
    5. Official Bank / Financial Institution
    6. Other Authoritative Institutional Source
    7. Unverified Third-Party Source
    """
    MINISTRY_OR_DEPT = 1
    OFFICIAL_SCHEME_PORTAL = 2
    STATUTORY_AGENCY = 3
    IMPLEMENTING_AGENCY = 4
    OFFICIAL_BANK_FI = 5
    AUTHORITATIVE_INSTITUTIONAL = 6
    UNVERIFIED_THIRD_PARTY = 7


class SourceStatus(str, Enum):
    ACTIVE = "ACTIVE"
    UNDER_REVIEW = "UNDER_REVIEW"
    OUTDATED = "OUTDATED"
    DEPRECATED = "DEPRECATED"
    UNVERIFIED = "UNVERIFIED"


class AuthoritativeSource(BaseModel):
    source_id: str
    name: str
    organization: str
    priority: SourcePriority
    source_type: str  # "CENTRAL_MINISTRY", "STATE_DEPT", "STATUTORY_BODY", "SCHEDULED_BANK", "DEVELOPMENT_BANK"
    primary_domain: str
    allowed_domains: List[str] = Field(default_factory=list)
    official_url: str
    guidelines_url: Optional[str] = None
    status: SourceStatus = SourceStatus.ACTIVE
    last_verified_at: str
    source_published_at: Optional[str] = None
    source_updated_at: Optional[str] = None
    verification_method: str  # "OFFICIAL_GAZETTE", "MINISTRY_PORTAL", "SCHEME_GUIDELINE_DOC"


# Authoritative Source Registry database of verified official Indian government & institutional bodies
OFFICIAL_SOURCE_REGISTRY: Dict[str, AuthoritativeSource] = {
    "SRC_KVIC": AuthoritativeSource(
        source_id="SRC_KVIC",
        name="Khadi and Village Industries Commission (KVIC)",
        organization="Ministry of Micro, Small and Medium Enterprises (MoMSME)",
        priority=SourcePriority.IMPLEMENTING_AGENCY,
        source_type="STATUTORY_BODY",
        primary_domain="kviconline.gov.in",
        allowed_domains=["kviconline.gov.in", "kvic.gov.in", "msme.gov.in"],
        official_url="https://www.kviconline.gov.in/pmegpep/pmegphome/index.jsp",
        guidelines_url="https://msme.gov.in/sites/default/files/PMEGP_Guidelines.pdf",
        status=SourceStatus.ACTIVE,
        last_verified_at="2026-08-01",
        source_published_at="2008-08-15",
        source_updated_at="2024-05-10",
        verification_method="MINISTRY_PORTAL"
    ),
    "SRC_MOFPI": AuthoritativeSource(
        source_id="SRC_MOFPI",
        name="Ministry of Food Processing Industries (MoFPI)",
        organization="Government of India",
        priority=SourcePriority.MINISTRY_OR_DEPT,
        source_type="CENTRAL_MINISTRY",
        primary_domain="pmfme.mofpi.gov.in",
        allowed_domains=["pmfme.mofpi.gov.in", "mofpi.gov.in"],
        official_url="https://pmfme.mofpi.gov.in/",
        guidelines_url="https://pmfme.mofpi.gov.in/pmfme/guidelines",
        status=SourceStatus.ACTIVE,
        last_verified_at="2026-08-01",
        source_published_at="2020-06-29",
        source_updated_at="2024-04-12",
        verification_method="MINISTRY_PORTAL"
    ),
    "SRC_MUDRA": AuthoritativeSource(
        source_id="SRC_MUDRA",
        name="Micro Units Development & Refinance Agency (MUDRA)",
        organization="Department of Financial Services, Ministry of Finance",
        priority=SourcePriority.STATUTORY_AGENCY,
        source_type="STATUTORY_BODY",
        primary_domain="mudra.org.in",
        allowed_domains=["mudra.org.in", "financialservices.gov.in", "janmaramarth.in", "jan-samarth.in", "jansamarth.in"],
        official_url="https://www.mudra.org.in/",
        guidelines_url="https://www.mudra.org.in/Offerings",
        status=SourceStatus.ACTIVE,
        last_verified_at="2026-08-01",
        source_published_at="2015-04-08",
        source_updated_at="2024-03-20",
        verification_method="MINISTRY_PORTAL"
    ),
    "SRC_DAHD": AuthoritativeSource(
        source_id="SRC_DAHD",
        name="Department of Animal Husbandry and Dairying (DAHD)",
        organization="Ministry of Fisheries, Animal Husbandry & Dairying",
        priority=SourcePriority.MINISTRY_OR_DEPT,
        source_type="CENTRAL_MINISTRY",
        primary_domain="dahd.nic.in",
        allowed_domains=["dahd.nic.in", "ahidf.udyamimitra.in", "nlm.udyamimitra.in"],
        official_url="https://ahidf.udyamimitra.in/",
        guidelines_url="https://dahd.nic.in/schemes/programmes/ahidf",
        status=SourceStatus.ACTIVE,
        last_verified_at="2026-08-01",
        source_published_at="2020-06-24",
        source_updated_at="2024-02-15",
        verification_method="OFFICIAL_GAZETTE"
    ),
    "SRC_NABARD": AuthoritativeSource(
        source_id="SRC_NABARD",
        name="National Bank for Agriculture and Rural Development (NABARD)",
        organization="Statutory Development Financial Institution",
        priority=SourcePriority.OFFICIAL_BANK_FI,
        source_type="DEVELOPMENT_BANK",
        primary_domain="nabard.org",
        allowed_domains=["nabard.org", "enam.gov.in"],
        official_url="https://www.nabard.org/",
        guidelines_url="https://www.nabard.org/schemes.aspx",
        status=SourceStatus.ACTIVE,
        last_verified_at="2026-08-01",
        source_published_at="1982-07-12",
        source_updated_at="2024-06-01",
        verification_method="MINISTRY_PORTAL"
    ),
    "SRC_STANDUP": AuthoritativeSource(
        source_id="SRC_STANDUP",
        name="Stand-Up India Portal",
        organization="SIDBI / Department of Financial Services",
        priority=SourcePriority.OFFICIAL_SCHEME_PORTAL,
        source_type="OFFICIAL_PORTAL",
        primary_domain="standupmitra.in",
        allowed_domains=["standupmitra.in", "sidbi.in", "financialservices.gov.in"],
        official_url="https://www.standupmitra.in/",
        guidelines_url="https://www.standupmitra.in/Home/SUISchemes",
        status=SourceStatus.ACTIVE,
        last_verified_at="2026-08-01",
        source_published_at="2016-04-05",
        source_updated_at="2024-01-10",
        verification_method="MINISTRY_PORTAL"
    ),
    "SRC_AIF": AuthoritativeSource(
        source_id="SRC_AIF",
        name="Agriculture Infrastructure Fund (AIF)",
        organization="Department of Agriculture & Farmers Welfare",
        priority=SourcePriority.OFFICIAL_SCHEME_PORTAL,
        source_type="CENTRAL_MINISTRY",
        primary_domain="agriinfra.dac.gov.in",
        allowed_domains=["agriinfra.dac.gov.in", "agricoop.nic.in"],
        official_url="https://agriinfra.dac.gov.in/",
        guidelines_url="https://agriinfra.dac.gov.in/Home/Guidelines",
        status=SourceStatus.ACTIVE,
        last_verified_at="2026-08-01",
        source_published_at="2020-07-08",
        source_updated_at="2024-03-01",
        verification_method="OFFICIAL_GAZETTE"
    )
}


class SourceRegistryService:
    @staticmethod
    def get_source(source_id: str) -> Optional[AuthoritativeSource]:
        return OFFICIAL_SOURCE_REGISTRY.get(source_id)

    @staticmethod
    def list_sources() -> List[AuthoritativeSource]:
        return list(OFFICIAL_SOURCE_REGISTRY.values())

    @staticmethod
    def match_domain_to_source(domain: str) -> Optional[AuthoritativeSource]:
        """
        Matches a domain to registered authoritative institutional and government sources.
        Non-government domains like nabard.org, standupmitra.in, mudra.org.in are properly matched.
        """
        clean_domain = domain.lower().replace("www.", "").strip()
        for source in OFFICIAL_SOURCE_REGISTRY.values():
            if clean_domain == source.primary_domain:
                return source
            for allowed in source.allowed_domains:
                if clean_domain == allowed or clean_domain.endswith("." + allowed):
                    return source
        return None

    @staticmethod
    def is_authoritative(source: Optional[AuthoritativeSource]) -> bool:
        if not source:
            return False
        return source.priority <= SourcePriority.AUTHORITATIVE_INSTITUTIONAL and source.status == SourceStatus.ACTIVE
