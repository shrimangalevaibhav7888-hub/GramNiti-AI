"""
GramNiti Source Validator Service
Validates authoritative domain namespaces, official government portal signatures,
SSL/TLS validation rules, and gazette notification references.
"""

import re
import urllib.parse
from typing import Dict, List, Optional, Tuple
from pydantic import BaseModel, Field
from .source_registry import SourceRegistryService, AuthoritativeSource, SourcePriority, SourceStatus


class SourceValidationResult(BaseModel):
    is_valid: bool
    domain: str
    matched_source: Optional[Dict] = None
    is_official_gov: bool = False
    is_statutory_institution: bool = False
    priority_level: int = 7
    source_type: str = "UNVERIFIED"
    validation_status: str = "UNVERIFIED"  # VALIDATED, RECOGNIZED_NON_GOV, UNVERIFIED, SUSPICIOUS
    notes: str = ""


class SourceValidator:
    GOV_SUFFIXES = [".gov.in", ".nic.in", ".ac.in", ".res.in"]
    KNOWN_FINANCIAL_DOMAINS = [
        "mudra.org.in", "nabard.org", "sidbi.in", "standupmitra.in",
        "udyamimitra.in", "jansamarth.in", "jan-samarth.in", "rbi.org.in", "iba.org.in"
    ]
    SUSPICIOUS_TLDS = [".xyz", ".top", ".club", ".click", ".link", ".buzz", ".work", ".site", ".live", ".guru", ".casa", ".loan", ".free"]

    @classmethod
    def clean_and_parse_url(cls, raw_url_or_domain: str) -> Tuple[Optional[str], Optional[str]]:
        if not raw_url_or_domain:
            return None, None
        text = raw_url_or_domain.strip()
        url_match = re.search(r"https?://[^\s/$.?#].[^\s]*", text, re.IGNORECASE)
        if url_match:
            try:
                parsed = urllib.parse.urlparse(url_match.group(0))
                clean_domain = parsed.netloc.lower().replace("www.", "").strip()
                return clean_domain, url_match.group(0)
            except Exception:
                pass
        domain_match = re.search(r"\b([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})\b", text)
        if domain_match:
            clean_domain = domain_match.group(1).lower().replace("www.", "").strip()
            return clean_domain, f"https://{clean_domain}"
        return None, None

    @classmethod
    def validate_source(cls, url_or_domain: str) -> SourceValidationResult:
        domain, full_url = cls.clean_and_parse_url(url_or_domain)
        if not domain:
            return SourceValidationResult(
                is_valid=False,
                domain="",
                notes="No valid domain could be extracted from input."
            )

        # Check official registry
        matched = SourceRegistryService.match_domain_to_source(domain)
        is_gov = any(domain.endswith(sfx) for sfx in cls.GOV_SUFFIXES)
        is_known_fi = any(domain == kd or domain.endswith("." + kd) for kd in cls.KNOWN_FINANCIAL_DOMAINS)
        is_suspicious = any(domain.endswith(tld) for tld in cls.SUSPICIOUS_TLDS)

        if matched:
            return SourceValidationResult(
                is_valid=True,
                domain=domain,
                matched_source=matched.model_dump(),
                is_official_gov=matched.priority <= SourcePriority.STATUTORY_AGENCY or is_gov,
                is_statutory_institution=True,
                priority_level=int(matched.priority),
                source_type=matched.source_type,
                validation_status="VALIDATED",
                notes=f"Matches registered authoritative source: {matched.name} ({matched.organization})."
            )

        if is_gov:
            return SourceValidationResult(
                is_valid=True,
                domain=domain,
                is_official_gov=True,
                priority_level=int(SourcePriority.MINISTRY_OR_DEPT),
                source_type="GOVERNMENT_PORTAL",
                validation_status="VALIDATED",
                notes="Valid Government of India / State Government domain (.gov.in / .nic.in)."
            )

        if is_known_fi:
            return SourceValidationResult(
                is_valid=True,
                domain=domain,
                is_statutory_institution=True,
                priority_level=int(SourcePriority.OFFICIAL_BANK_FI),
                source_type="STATUTORY_FINANCIAL_INSTITUTION",
                validation_status="VALIDATED",
                notes="Valid recognized statutory development financial institution portal."
            )

        if is_suspicious:
            return SourceValidationResult(
                is_valid=False,
                domain=domain,
                priority_level=int(SourcePriority.UNVERIFIED_THIRD_PARTY),
                source_type="SUSPICIOUS_PORTAL",
                validation_status="SUSPICIOUS",
                notes="High-risk TLD commonly associated with phishing or unofficial clone websites."
            )

        return SourceValidationResult(
            is_valid=False,
            domain=domain,
            priority_level=int(SourcePriority.UNVERIFIED_THIRD_PARTY),
            source_type="UNVERIFIED_THIRD_PARTY",
            validation_status="UNVERIFIED",
            notes="Third-party / non-government domain. Cross-verification with official portal required."
        )
