"""
Authentication and Password Security Service for GramNiti AI
Provides secure salted password hashing (PBKDF2-HMAC-SHA256),
constant-time password verification, and expiring session token management.
"""

import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
import uuid

from ..db.models import User, UserProfile


class AuthService:
    ITERATIONS = 100_000
    ALGORITHM = "sha256"
    TOKEN_LIFETIME_DAYS = 7

    @classmethod
    def hash_password(cls, password: str) -> str:
        """Securely hash a password using PBKDF2-HMAC-SHA256 with a 16-byte random salt."""
        if not password or len(password.strip()) == 0:
            raise ValueError("Password cannot be empty.")
        
        salt = secrets.token_bytes(16)
        key = hashlib.pbkdf2_hmac(
            cls.ALGORITHM,
            password.encode("utf-8"),
            salt,
            cls.ITERATIONS
        )
        return f"pbkdf2_sha256${cls.ITERATIONS}${salt.hex()}${key.hex()}"

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        """Verify password in constant-time against stored salted hash."""
        if not plain_password or not hashed_password:
            return False
        
        try:
            parts = hashed_password.split("$")
            if len(parts) != 4 or parts[0] != "pbkdf2_sha256":
                return False
            
            iterations = int(parts[1])
            salt = bytes.fromhex(parts[2])
            expected_key = bytes.fromhex(parts[3])

            computed_key = hashlib.pbkdf2_hmac(
                cls.ALGORITHM,
                plain_password.encode("utf-8"),
                salt,
                iterations
            )
            return hmac.compare_digest(computed_key, expected_key)
        except Exception:
            return False

    @classmethod
    def generate_token(cls) -> Tuple[str, datetime]:
        """Generate a cryptographically secure session token with expiration timestamp."""
        token = secrets.token_urlsafe(32)
        expires_at = datetime.now(timezone.utc) + timedelta(days=cls.TOKEN_LIFETIME_DAYS)
        return token, expires_at

    @classmethod
    def create_user(
        cls,
        db: Session,
        full_name: str,
        phone_or_email: str,
        password: str,
        preferred_languages: Optional[list] = None
    ) -> Tuple[User, str]:
        """Register a new user in SQLite with a hashed password and initialized profile."""
        clean_contact = phone_or_email.strip().lower()
        existing = db.query(User).filter(User.phone_or_email == clean_contact).first()
        if existing:
            raise ValueError("An account with this phone number or email already exists.")

        user_id = f"USR_{uuid.uuid4().hex[:12].upper()}"
        pwd_hash = cls.hash_password(password)
        token, expires_at = cls.generate_token()
        lang_list = preferred_languages or ["en"]

        user = User(
            user_id=user_id,
            full_name=full_name.strip(),
            phone_or_email=clean_contact,
            password_hash=pwd_hash,
            preferred_language=lang_list[0] if lang_list else "en",
            preferred_languages=lang_list,
            onboarding_completed=False,
            auth_token=token,
            token_expires_at=expires_at
        )
        db.add(user)

        # Initialize companion profile
        profile = UserProfile(
            profile_id=f"PROF_{uuid.uuid4().hex[:12].upper()}",
            user_id=user_id,
            name=full_name.strip(),
            preferred_language=lang_list[0] if lang_list else "en",
            preferred_languages=lang_list
        )
        db.add(profile)
        db.commit()
        db.refresh(user)

        return user, token

    @classmethod
    def authenticate_user(
        cls,
        db: Session,
        phone_or_email: str,
        password: str
    ) -> Tuple[User, str]:
        """Authenticate user credentials and refresh session token."""
        clean_contact = phone_or_email.strip().lower()
        user = db.query(User).filter(User.phone_or_email == clean_contact).first()
        if not user or not user.password_hash:
            raise ValueError("Invalid phone number / email or password.")

        if not cls.verify_password(password, user.password_hash):
            raise ValueError("Invalid phone number / email or password.")

        token, expires_at = cls.generate_token()
        user.auth_token = token
        user.token_expires_at = expires_at
        user.last_active_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(user)

        return user, token

    @classmethod
    def get_user_by_token(cls, db: Session, token: str) -> Optional[User]:
        """Look up user by active session token, checking expiry."""
        if not token:
            return None
        user = db.query(User).filter(User.auth_token == token).first()
        if not user:
            return None
        
        # Check token expiration
        if user.token_expires_at:
            # Handle tz-aware or naive timestamps
            now = datetime.now(timezone.utc)
            exp = user.token_expires_at
            if exp.tzinfo is None:
                exp = exp.replace(tzinfo=timezone.utc)
            if now > exp:
                return None
                
        return user
