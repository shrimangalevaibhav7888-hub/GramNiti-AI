"""
FastAPI Authentication & Rural Entrepreneur Onboarding Router
Handles signup, login, onboarding data saving, user session validation, and logout.
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
import uuid

from ...db.database import get_db
from ...db.models import User, UserProfile
from ...services.auth_service import AuthService

router = APIRouter()


class SignUpRequest(BaseModel):
    full_name: str
    phone_or_email: str
    password: str
    preferred_languages: Optional[List[str]] = Field(default_factory=lambda: ["en"])


class LoginRequest(BaseModel):
    phone_or_email: str
    password: str


class RuralEntrepreneurOnboardingRequest(BaseModel):
    user_id: Optional[str] = None
    preferred_languages: List[str] = Field(default_factory=lambda: ["en"])
    profile: Dict[str, Any] = Field(default_factory=dict)
    location: Dict[str, Any] = Field(default_factory=dict)
    business_interest: Dict[str, Any] = Field(default_factory=dict)


@router.post("/signup")
def sign_up(req: SignUpRequest, db: Session = Depends(get_db)):
    """Create a new rural entrepreneur account with salted PBKDF2-SHA256 password hashing in SQLite."""
    try:
        user, token = AuthService.create_user(
            db=db,
            full_name=req.full_name,
            phone_or_email=req.phone_or_email,
            password=req.password,
            preferred_languages=req.preferred_languages
        )
        return {
            "status": "SUCCESS",
            "message": "Account created successfully.",
            "user_id": user.user_id,
            "full_name": user.full_name,
            "phone_or_email": user.phone_or_email,
            "preferred_language": user.preferred_language,
            "preferred_languages": user.preferred_languages,
            "onboarding_completed": user.onboarding_completed,
            "auth_token": token,
            "token_expires_at": user.token_expires_at.isoformat() if user.token_expires_at else None
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.post("/login")
def log_in(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate rural entrepreneur credentials and return active session token."""
    try:
        user, token = AuthService.authenticate_user(
            db=db,
            phone_or_email=req.phone_or_email,
            password=req.password
        )
        profile = db.query(UserProfile).filter(UserProfile.user_id == user.user_id).first()

        return {
            "status": "SUCCESS",
            "message": "Login successful.",
            "user_id": user.user_id,
            "full_name": user.full_name,
            "phone_or_email": user.phone_or_email,
            "preferred_language": user.preferred_language,
            "preferred_languages": user.preferred_languages,
            "onboarding_completed": user.onboarding_completed,
            "auth_token": token,
            "token_expires_at": user.token_expires_at.isoformat() if user.token_expires_at else None,
            "profile": {
                "name": profile.name if profile else user.full_name,
                "age": profile.age if profile else None,
                "gender": profile.gender if profile else None,
                "social_category": profile.social_category if profile else None,
                "occupation": profile.occupation if profile else None,
                "education": profile.education if profile else None,
                "annual_income_inr": profile.annual_income_inr if profile else None,
                "available_capital": profile.available_capital if profile else None,
                "business_interest": profile.business_interest if profile else None,
                "desired_loan_amount": profile.desired_loan_amount if profile else None,
                "is_rural": profile.is_rural if profile else True,
                "location_id": profile.location_id if profile else None,
                "state": profile.state if profile else None,
                "district": profile.district if profile else None,
                "village_name": profile.village_name if profile else None
            } if profile else None
        }
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


@router.post("/onboarding")
def save_onboarding(
    req: RuralEntrepreneurOnboardingRequest,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Save Rural Entrepreneur Onboarding choices: 1-3 languages, profile, location, business interest."""
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]

    user = None
    if token:
        user = AuthService.get_user_by_token(db, token)

    if not user and req.user_id:
        user = db.query(User).filter(User.user_id == req.user_id).first()

    if not user:
        # Create user record for onboarding
        user = User(
            user_id=req.user_id or f"USR_{uuid.uuid4().hex[:10].upper()}",
            full_name=req.profile.get("name", "Rural Entrepreneur"),
            preferred_language=req.preferred_languages[0] if req.preferred_languages else "en",
            preferred_languages=req.preferred_languages,
            onboarding_completed=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Update User languages and onboarding status
    user.preferred_languages = req.preferred_languages or user.preferred_languages or ["en"]
    if req.preferred_languages:
        user.preferred_language = req.preferred_languages[0]
    user.onboarding_completed = True
    if req.profile.get("name"):
        user.full_name = req.profile.get("name")

    # Update companion UserProfile
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.user_id).first()
    if not profile:
        profile = UserProfile(
            profile_id=f"PROF_{uuid.uuid4().hex[:12].upper()}",
            user_id=user.user_id
        )
        db.add(profile)

    p = req.profile
    loc = req.location
    biz = req.business_interest

    if "name" in p and p["name"]: profile.name = str(p["name"])
    if "age" in p and p["age"] is not None and str(p["age"]).strip() != "":
        try: profile.age = int(p["age"])
        except (ValueError, TypeError): pass
    if "gender" in p and p["gender"]: profile.gender = str(p["gender"])
    if "social_category" in p and p["social_category"]: profile.social_category = str(p["social_category"])
    if "occupation" in p and p["occupation"]: profile.occupation = str(p["occupation"])
    if "education" in p and p["education"]: profile.education = str(p["education"])
    if "annual_income_inr" in p and p["annual_income_inr"] is not None and str(p["annual_income_inr"]).strip() != "":
        try: profile.annual_income_inr = float(p["annual_income_inr"])
        except (ValueError, TypeError): pass
    if "available_capital" in p and p["available_capital"] is not None and str(p["available_capital"]).strip() != "":
        try: profile.available_capital = float(p["available_capital"])
        except (ValueError, TypeError): pass
    if "is_rural" in p and p["is_rural"] is not None: profile.is_rural = bool(p["is_rural"])

    if loc.get("location_id"): profile.location_id = loc.get("location_id")
    if loc.get("state"): profile.state = loc.get("state")
    if loc.get("district"): profile.district = loc.get("district")
    if loc.get("village_name"): profile.village_name = loc.get("village_name")

    if biz.get("business_interest") or biz.get("business_name"): 
        profile.business_interest = biz.get("business_interest") or biz.get("business_name")
    if "desired_loan_amount" in biz and biz["desired_loan_amount"] is not None and str(biz["desired_loan_amount"]).strip() != "": 
        try: profile.desired_loan_amount = float(biz["desired_loan_amount"])
        except (ValueError, TypeError): pass

    profile.preferred_languages = user.preferred_languages
    profile.preferred_language = user.preferred_language

    db.commit()
    db.refresh(user)
    db.refresh(profile)

    return {
        "status": "SUCCESS",
        "message": "Rural entrepreneur onboarding completed successfully.",
        "user_id": user.user_id,
        "full_name": user.full_name,
        "preferred_language": user.preferred_language,
        "preferred_languages": user.preferred_languages,
        "onboarding_completed": True,
        "profile": {
            "name": profile.name,
            "age": profile.age,
            "gender": profile.gender,
            "social_category": profile.social_category,
            "occupation": profile.occupation,
            "education": profile.education,
            "annual_income_inr": profile.annual_income_inr,
            "available_capital": profile.available_capital,
            "business_interest": profile.business_interest,
            "desired_loan_amount": profile.desired_loan_amount,
            "is_rural": profile.is_rural,
            "location_id": profile.location_id,
            "state": profile.state,
            "district": profile.district,
            "village_name": profile.village_name,
            "preferred_languages": profile.preferred_languages,
            "preferred_language": profile.preferred_language
        }
    }


@router.get("/me")
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Retrieve currently authenticated user profile from active session token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication token required.")

    token = authorization.split(" ")[1]
    user = AuthService.get_user_by_token(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Session expired or invalid token. Please log in again.")

    profile = db.query(UserProfile).filter(UserProfile.user_id == user.user_id).first()
    return {
        "status": "SUCCESS",
        "user_id": user.user_id,
        "full_name": user.full_name,
        "phone_or_email": user.phone_or_email,
        "preferred_language": user.preferred_language,
        "preferred_languages": user.preferred_languages,
        "onboarding_completed": user.onboarding_completed,
        "profile": {
            "name": profile.name if profile else user.full_name,
            "age": profile.age if profile else None,
            "gender": profile.gender if profile else None,
            "social_category": profile.social_category if profile else None,
            "occupation": profile.occupation if profile else None,
            "education": profile.education if profile else None,
            "annual_income_inr": profile.annual_income_inr if profile else None,
            "available_capital": profile.available_capital if profile else None,
            "business_interest": profile.business_interest if profile else None,
            "desired_loan_amount": profile.desired_loan_amount if profile else None,
            "is_rural": profile.is_rural if profile else True,
            "location_id": profile.location_id if profile else None,
            "state": profile.state if profile else None,
            "district": profile.district if profile else None,
            "village_name": profile.village_name if profile else None
        } if profile else None
    }


@router.post("/logout")
def log_out(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Invalidate current user session token."""
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        user = db.query(User).filter(User.auth_token == token).first()
        if user:
            user.auth_token = None
            user.token_expires_at = None
            db.commit()
    return {"status": "SUCCESS", "message": "Logged out successfully."}
