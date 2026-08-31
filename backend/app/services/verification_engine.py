"""
Scheme Authenticity & Fraud Verification Pipeline
Evaluates official source identity, scheme content matching, financial term consistency,
domain signals, fraud heuristics, and source freshness.
Produces structured evidence breakdowns and status codes.
"""

import re
import urllib.parse
from typing import Dict, List, Optional, Tuple
from pydantic import BaseModel, Field
from .source_registry import SourceRegistryService, SourcePriority, SourceStatus, AuthoritativeSource
from ..db.seed_data import VERIFIED_SCHEMES


class VerificationSignal(BaseModel):
    category: str  # "SOURCE_IDENTITY", "SCHEME_MATCH", "FINANCIAL_TERMS", "DOMAIN_CHECK", "FRAUD_HEURISTIC", "FRESHNESS"
    signal_name: str
    status: str  # "PASS", "FLAG", "INFO", "WARNING"
    weight: float
    evidence: str
    official_reference: Optional[str] = None


class VerificationAssessmentResult(BaseModel):
    verification_id: str
    scheme_name_detected: Optional[str] = None
    official_source: Optional[str] = None
    official_domain: Optional[str] = None
    official_portal_url: Optional[str] = None
    
    # Core Status: VERIFIED, NEEDS_VERIFICATION, HIGH_RISK, VERIFICATION_UNAVAILABLE, EXPIRED, UNDER_REVIEW
    verification_status: str
    verification_confidence_score: float  # 0 to 100
    risk_level: str  # "LOW", "MEDIUM", "HIGH"
    
    # Evidence & Signal details
    scheme_exists: bool = False
    details_match: bool = False
    eligibility_match: bool = False
    loan_match: bool = False
    subsidy_match: bool = False
    domain_signal: str = "UNKNOWN"
    
    fraud_indicators: List[str] = Field(default_factory=list)
    evidence_breakdown: List[VerificationSignal] = Field(default_factory=list)
    
    safety_recommendation: str
    disclaimer: str = (
        "This is an application-generated verification assessment based on comparison with "
        "available official sources. It is not a government certification. Always verify details on the official source."
    )


# Common fraud heuristic regex patterns for Indian loan / scheme scams
FRAUD_PATTERNS = [
    {
        "name": "Advance Fee / Processing Charge Scam",
        "regex": r"(pay|deposit|transfer|fee|charges|charge|registration fee|processing fee)\s*(of)?\s*(rs\.?|inr|₹)?\s*([0-9,]{3,6})",
        "description": "Requests upfront payment/fee before loan disbursal (Government schemes never demand advance processing fees via personal transfers).",
        "severity": "CRITICAL"
    },
    {
        "name": "Personal UPI / QR Code Transfer Demand",
        "regex": r"([a-zA-Z0-9.\-_]{2,256}@(oksbi|okhdfcbank|okaxis|okicici|paytm|ybl|apl|gpay|upi))",
        "description": "Demands payment to a personal UPI ID rather than an official treasury portal.",
        "severity": "CRITICAL"
    },
    {
        "name": "Guaranteed / Instant Approval Claim",
        "regex": r"(100%|guaranteed|guarantee|instant|instantly|paisa direct account|bina kisi shart|bina kisi document|zero cibil|no cibil)\s*(loan|approval|sanction|subsidy)",
        "description": "Falsely promises guaranteed or instant approval without standard bank appraisal or statutory underwriting.",
        "severity": "HIGH"
    },
    {
        "name": "No Documents Required Claim",
        "regex": r"(no\s*documents?\s*required|bina\s*kagzat|zero\s*documentation|without\s*documents?|documents?\s*ki\s*zaroorat\s*nahi)",
        "description": "Claims no documentation is needed (All official government credit-linked schemes require KYC and DPR).",
        "severity": "HIGH"
    },
    {
        "name": "Urgency / Threat Language",
        "regex": r"(urgent|hurry|valid only today|offer ends today|aaj hi antim tithi|turant call kare|last chance|limited seats)",
        "description": "Uses artificial urgency or panic tactics to force hasty financial payments.",
        "severity": "MEDIUM"
    },
    {
        "name": "Telegram / WhatsApp Agent Channel Claim",
        "regex": r"(telegram\.me|t\.me\/|wa\.me\/|contact agent on whatsapp|inbox me for loan)",
        "description": "Directs applicant to private unverified messaging handles rather than registered institutional bank branches or official portals.",
        "severity": "HIGH"
    }
]

SUSPICIOUS_TLDS = [".xyz", ".top", ".club", ".click", ".link", ".buzz", ".work", ".site", ".live", ".guru", ".casa", ".loan", ".free"]


class VerificationEngine:

    @staticmethod
    def extract_domain(url_or_text: str) -> Optional[str]:
        if not url_or_text:
            return None
        # Look for explicit URL
        url_match = re.search(r"https?://[^\s/$.?#].[^\s]*", url_or_text, re.IGNORECASE)
        if url_match:
            try:
                parsed = urllib.parse.urlparse(url_match.group(0))
                return parsed.netloc.lower().replace("www.", "")
            except Exception:
                pass
        # Look for domain-like string
        domain_match = re.search(r"\b([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})\b", url_or_text)
        if domain_match:
            return domain_match.group(1).lower().replace("www.", "")
        return None

    @staticmethod
    def identify_scheme(submitted_text: str) -> Optional[Dict]:
        """
        Matches submitted text to known verified schemes in our repository.
        """
        text_lower = submitted_text.lower()
        for scheme in VERIFIED_SCHEMES:
            code_match = scheme["code"].lower() in text_lower
            name_words = [w.lower() for w in scheme["name"].split() if len(w) > 3]
            matched_words = sum(1 for w in name_words if w in text_lower)
            
            if code_match or (len(name_words) > 0 and matched_words / len(name_words) >= 0.6):
                return scheme
                
        # Common acronym / alias checks
        if "pmegp" in text_lower or "prime minister employment generation" in text_lower:
            return next((s for s in VERIFIED_SCHEMES if s["code"] == "PMEGP"), None)
        if "pmfme" in text_lower or "food processing scheme" in text_lower:
            return next((s for s in VERIFIED_SCHEMES if s["code"] == "PMFME"), None)
        if "mudra" in text_lower or "pmmy" in text_lower or "shishu" in text_lower or "kishore" in text_lower:
            return next((s for s in VERIFIED_SCHEMES if s["code"] == "PMMY_KISHORE"), None)
        if "nlm" in text_lower or "national livestock mission" in text_lower or "poultry subsidy" in text_lower or "goat breeding" in text_lower:
            return next((s for s in VERIFIED_SCHEMES if s["code"] == "NLM_EDP"), None)
        if "ahidf" in text_lower or "animal husbandry infrastructure" in text_lower:
            return next((s for s in VERIFIED_SCHEMES if s["code"] == "AHIDF"), None)
        if "stand up india" in text_lower or "standup india" in text_lower:
            return next((s for s in VERIFIED_SCHEMES if s["code"] == "STANDUP_INDIA"), None)
        if "aif" in text_lower or "agriculture infrastructure fund" in text_lower:
            return next((s for s in VERIFIED_SCHEMES if s["code"] == "AIF"), None)
            
        return None

    @classmethod
    def verify_submission(cls, submitted_text: str, submitted_url: Optional[str] = None) -> VerificationAssessmentResult:
        import uuid
        verification_id = f"VERIF_{uuid.uuid4().hex[:10].upper()}"
        full_text = f"{submitted_text or ''} {submitted_url or ''}".strip()
        
        signals: List[VerificationSignal] = []
        fraud_flags: List[str] = []
        
        # 1. Scheme Identification
        matched_scheme = cls.identify_scheme(full_text)
        
        # 2. Domain & Source Extraction
        domain = cls.extract_domain(full_text)
        matched_source: Optional[AuthoritativeSource] = None
        
        if domain:
            matched_source = SourceRegistryService.match_domain_to_source(domain)
        elif matched_scheme:
            matched_source = SourceRegistryService.get_source(matched_scheme["source_id"])
            
        # 3. Analyze Fraud Heuristics
        for pattern in FRAUD_PATTERNS:
            match = re.search(pattern["regex"], full_text, re.IGNORECASE)
            if match:
                fraud_flags.append(f"{pattern['name']}: {pattern['description']}")
                signals.append(VerificationSignal(
                    category="FRAUD_HEURISTIC",
                    signal_name=pattern["name"],
                    status="FLAG" if pattern["severity"] == "CRITICAL" else "WARNING",
                    weight=-30.0 if pattern["severity"] == "CRITICAL" else -15.0,
                    evidence=f"Detected pattern matching: '{match.group(0)}'",
                    official_reference="RBI Fraud Advisory & Official Ministry Guidelines"
                ))

        # 4. Domain Check (Balanced signal - not solely deciding)
        domain_signal_type = "NO_DOMAIN_PROVIDED"
        if domain:
            is_gov = domain.endswith(".gov.in") or domain.endswith(".nic.in")
            is_suspicious_tld = any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS)
            
            if matched_source and SourceRegistryService.is_authoritative(matched_source):
                domain_signal_type = "AUTHORITATIVE_SOURCE_DOMAIN"
                signals.append(VerificationSignal(
                    category="DOMAIN_CHECK",
                    signal_name="Authoritative Institutional / Government Domain",
                    status="PASS",
                    weight=25.0,
                    evidence=f"Domain '{domain}' matches registered authoritative entity: {matched_source.name} ({matched_source.organization}).",
                    official_reference=matched_source.official_url
                ))
            elif is_gov:
                domain_signal_type = "OFFICIAL_GOV_DOMAIN"
                signals.append(VerificationSignal(
                    category="DOMAIN_CHECK",
                    signal_name="Government Domain Signature",
                    status="PASS",
                    weight=20.0,
                    evidence=f"Domain '{domain}' is hosted under .gov.in / .nic.in government namespace.",
                    official_reference="National Informatics Centre (NIC)"
                ))
            elif is_suspicious_tld:
                domain_signal_type = "SUSPICIOUS_TLD"
                signals.append(VerificationSignal(
                    category="DOMAIN_CHECK",
                    signal_name="Suspicious Top-Level Domain",
                    status="FLAG",
                    weight=-25.0,
                    evidence=f"Domain '{domain}' uses a high-risk TLD commonly associated with phishing portals.",
                    official_reference="Indian Cyber Crime Coordination Centre (I4C)"
                ))
            else:
                # Legitimate non-gov domain or neutral third-party portal
                domain_signal_type = "NON_GOV_NEUTRAL"
                signals.append(VerificationSignal(
                    category="DOMAIN_CHECK",
                    signal_name="Non-Government Domain",
                    status="INFO",
                    weight=0.0,
                    evidence=f"Domain '{domain}' is not on the registry of official scheme portals. Cross-verification with official source required.",
                    official_reference=None
                ))

        # 5. Scheme Existence & Content Matching
        scheme_exists = matched_scheme is not None
        details_match = False
        loan_match = False
        subsidy_match = False
        
        if scheme_exists:
            signals.append(VerificationSignal(
                category="SCHEME_MATCH",
                signal_name="Official Scheme Registry Cross-Match",
                status="PASS",
                weight=30.0,
                evidence=f"Matched authentic government scheme: '{matched_scheme['name']}' ({matched_scheme['ministry']}).",
                official_reference=matched_scheme["official_portal_url"]
            ))
            
            # Check for financial inconsistencies (e.g. claiming ₹50 Lakh on Mudra Kishore or ₹5 Lakh without documents)
            loan_numbers = [float(x.replace(",", "")) for x in re.findall(r"(?:₹|rs\.?|inr)?\s*([0-9,]{4,9})", full_text, re.IGNORECASE)]
            
            if loan_numbers:
                claimed_amount = max(loan_numbers)
                max_allowed = matched_scheme["max_loan_amount"]
                if claimed_amount <= max_allowed:
                    loan_match = True
                    details_match = True
                    signals.append(VerificationSignal(
                        category="FINANCIAL_TERMS",
                        signal_name="Loan Amount Compatibility",
                        status="PASS",
                        weight=15.0,
                        evidence=f"Mentioned loan amount (₹{claimed_amount:,.0f}) is within official ceiling of ₹{max_allowed:,.0f}.",
                        official_reference=matched_scheme["guidelines_pdf_url"]
                    ))
                else:
                    signals.append(VerificationSignal(
                        category="FINANCIAL_TERMS",
                        signal_name="Loan Amount Discrepancy",
                        status="WARNING",
                        weight=-15.0,
                        evidence=f"Claimed amount ₹{claimed_amount:,.0f} exceeds official scheme ceiling of ₹{max_allowed:,.0f}.",
                        official_reference=matched_scheme["guidelines_pdf_url"]
                    ))
            else:
                details_match = True
                
            # Freshness Check
            signals.append(VerificationSignal(
                category="FRESHNESS",
                signal_name="Source Freshness & Version Status",
                status="PASS",
                weight=10.0,
                evidence=f"Scheme guidelines are active (Status: {matched_scheme['status']}, Last verified: {matched_scheme['last_verified_at']}).",
                official_reference=matched_scheme["official_portal_url"]
            ))
        else:
            # Scheme not recognized in authoritative registry
            signals.append(VerificationSignal(
                category="SCHEME_MATCH",
                signal_name="Scheme Not In Official Database",
                status="INFO",
                weight=0.0,
                evidence="Could not find an active central or state scheme matching the submitted description.",
                official_reference=None
            ))

        # 6. Compute Confidence Score & Status
        # Base confidence calculation
        raw_score = sum(s.weight for s in signals)
        # Normalize to 0-100 scale
        if scheme_exists:
            base_score = 50.0 + raw_score
        else:
            base_score = 30.0 + raw_score
            
        confidence_score = max(5.0, min(98.0, base_score))
        
        # 7. Determine Final Verification Status
        critical_fraud_found = any(s.status == "FLAG" for s in signals) or len(fraud_flags) > 0
        
        if critical_fraud_found:
            verification_status = "HIGH_RISK"
            risk_level = "HIGH"
            confidence_score = min(confidence_score, 35.0)
            safety_recommendation = (
                "⚠️ CAUTION: High risk of fraud detected. Advance fee demands, personal UPI requests, "
                "or false 'no documents' claims violate official government guidelines. Do NOT make payments or share OTPs."
            )
        elif scheme_exists and (matched_source is not None or domain_signal_type in ["OFFICIAL_GOV_DOMAIN", "AUTHORITATIVE_SOURCE_DOMAIN"]):
            verification_status = "VERIFIED"
            risk_level = "LOW"
            confidence_score = max(confidence_score, 75.0)
            safety_recommendation = (
                f"✅ Verified against official government scheme records ({matched_scheme['name']}). "
                f"Always apply only via the official portal: {matched_scheme['official_portal_url']} or nearest nationalized bank branch."
            )
        elif scheme_exists:
            verification_status = "NEEDS_VERIFICATION"
            risk_level = "MEDIUM"
            safety_recommendation = (
                f"ℹ️ The scheme name corresponds to '{matched_scheme['name']}', but the specific message or offer channel "
                "could not be fully verified. Confirm details directly at your local bank branch."
            )
        else:
            # Scheme cannot be matched to authoritative source
            verification_status = "VERIFICATION_UNAVAILABLE"
            risk_level = "MEDIUM"
            confidence_score = 40.0
            safety_recommendation = (
                "🔍 Authoritative verification is currently unavailable because the scheme could not be identified in the verified official repository. "
                "Verify with your District Industries Centre (DIC) or Lead District Manager (LDM) before taking financial action."
            )

        return VerificationAssessmentResult(
            verification_id=verification_id,
            scheme_name_detected=matched_scheme["name"] if matched_scheme else None,
            official_source=matched_source.name if matched_source else (matched_scheme["ministry"] if matched_scheme else None),
            official_domain=matched_source.primary_domain if matched_source else domain,
            official_portal_url=matched_scheme["official_portal_url"] if matched_scheme else (matched_source.official_url if matched_source else None),
            verification_status=verification_status,
            verification_confidence_score=round(confidence_score, 1),
            risk_level=risk_level,
            scheme_exists=scheme_exists,
            details_match=details_match,
            eligibility_match=scheme_exists,
            loan_match=loan_match,
            subsidy_match=subsidy_match,
            domain_signal=domain_signal_type,
            fraud_indicators=fraud_flags,
            evidence_breakdown=signals,
            safety_recommendation=safety_recommendation
        )
