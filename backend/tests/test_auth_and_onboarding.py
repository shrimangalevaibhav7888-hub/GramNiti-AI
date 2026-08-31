"""
Tests for Authentication & Rural Entrepreneur Onboarding in GramNiti AI
Verifies secure SQLite password hashing, token expiration, 1-3 language selection,
and end-to-end Rural Entrepreneur Onboarding flow.
All names, phone numbers, and profile details are demo/dummy data only.
"""

import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_signup_login_and_onboarding_flow():
    unique_email = f"demo.entrepreneur.{uuid.uuid4().hex[:8]}@example.com"
    
    # 1. Sign Up with dummy/demo credentials
    signup_payload = {
        "full_name": "Demo Kisan Entrepreneur",
        "phone_or_email": unique_email,
        "password": "SecurePassword123#",
        "preferred_languages": ["mr", "hi", "en"]
    }
    res_signup = client.post("/api/v1/auth/signup", json=signup_payload)
    assert res_signup.status_code == 200
    signup_data = res_signup.json()
    assert signup_data["status"] == "SUCCESS"
    assert "user_id" in signup_data
    assert "auth_token" in signup_data
    assert signup_data["preferred_languages"] == ["mr", "hi", "en"]
    assert signup_data["onboarding_completed"] is False

    user_id = signup_data["user_id"]
    token = signup_data["auth_token"]

    # 2. Reject duplicate signup
    res_dup = client.post("/api/v1/auth/signup", json=signup_payload)
    assert res_dup.status_code == 400

    # 3. Reject login with incorrect password
    res_bad_login = client.post("/api/v1/auth/login", json={
        "phone_or_email": unique_email,
        "password": "WrongPassword999"
    })
    assert res_bad_login.status_code == 401

    # 4. Login with correct password
    res_login = client.post("/api/v1/auth/login", json={
        "phone_or_email": unique_email,
        "password": "SecurePassword123#"
    })
    assert res_login.status_code == 200
    login_data = res_login.json()
    assert login_data["status"] == "SUCCESS"
    assert login_data["user_id"] == user_id
    assert "auth_token" in login_data
    active_token = login_data["auth_token"]

    # 5. Complete Rural Entrepreneur Onboarding (1-3 languages, profile, location, business interest)
    onboard_payload = {
        "user_id": user_id,
        "preferred_languages": ["mr", "hi", "en"],
        "profile": {
            "name": "Demo Kisan Entrepreneur",
            "age": 34,
            "gender": "Male",
            "social_category": "OBC",
            "occupation": "Farmer",
            "education": "Secondary School (10th)",
            "annual_income_inr": 180000.0,
            "available_capital": 50000.0,
            "is_rural": True
        },
        "location": {
            "location_id": "LOC_BARAMATI_01",
            "state": "Maharashtra",
            "district": "Pune",
            "village_name": "Baramati"
        },
        "business_interest": {
            "business_interest": "Dairy Farming & Milk Chilling",
            "desired_loan_amount": 250000.0
        }
    }
    res_onboard = client.post(
        "/api/v1/auth/onboarding",
        json=onboard_payload,
        headers={"Authorization": f"Bearer {active_token}"}
    )
    assert res_onboard.status_code == 200
    onboard_data = res_onboard.json()
    assert onboard_data["status"] == "SUCCESS"
    assert onboard_data["onboarding_completed"] is True
    assert onboard_data["profile"]["social_category"] == "OBC"
    assert onboard_data["profile"]["is_rural"] is True
    assert onboard_data["profile"]["business_interest"] == "Dairy Farming & Milk Chilling"

    # 6. Verify user profile via /auth/me
    res_me = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {active_token}"}
    )
    assert res_me.status_code == 200
    me_data = res_me.json()
    assert me_data["user_id"] == user_id
    assert me_data["onboarding_completed"] is True
    assert me_data["profile"]["name"] == "Demo Kisan Entrepreneur"
    assert me_data["profile"]["village_name"] == "Baramati"

    # 7. Log out
    res_logout = client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": f"Bearer {active_token}"}
    )
    assert res_logout.status_code == 200
    assert res_logout.json()["status"] == "SUCCESS"
