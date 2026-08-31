"""
GramNiti AI - Backend Application Entry Point
FastAPI service exposing hyper-local business recommendations, verified scheme discovery,
fraud detection & authenticity verification, deterministic eligibility & financial calculators,
3-scenario simulation modeling, rule-based risk assessment, DEMO OCR, and multilingual RAG assistant.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.endpoints import router as api_v1_router
from .api.v1.auth import router as auth_router
from .db.database import engine, Base, init_db_schema

# Create all database tables and migrate missing columns
init_db_schema()

app = FastAPI(
    title="🌾 GramNiti AI API",
    description="Your AI-powered rural business and financial decision assistant",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local React dev server and web client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth routes explicitly mounted under both /api/v1/auth and /api/auth
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth Alias"])

# Unified API routes
app.include_router(api_v1_router, prefix="/api")


@app.get("/")
def root():
    return {
        "app": "GramNiti AI",
        "tagline": "Your AI-powered rural business and financial decision assistant",
        "status": "ONLINE",
        "version": "1.0.0",
        "docs": "/docs",
        "disclaimer": "GramNiti provides decision-support information based on verified official sources and deterministic rules."
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "gramniti-backend"}
