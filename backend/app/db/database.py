"""
Database configuration for GramNiti AI
Supports standard SQLite for MVP and seamless transition to PostgreSQL.
"""

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Use consistent absolute DB location in root folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEFAULT_DB_PATH = os.path.join(BASE_DIR, "gramniti.db").replace("\\", "/")
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db_schema():
    Base.metadata.create_all(bind=engine)
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        with engine.begin() as conn:
            # Check users table columns
            if "users" in tables:
                existing_cols = {col["name"] for col in inspector.get_columns("users")}
                if "full_name" not in existing_cols:
                    conn.exec_driver_sql("ALTER TABLE users ADD COLUMN full_name VARCHAR(128)")
                if "password_hash" not in existing_cols:
                    conn.exec_driver_sql("ALTER TABLE users ADD COLUMN password_hash VARCHAR(256)")
                if "onboarding_completed" not in existing_cols:
                    conn.exec_driver_sql("ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT 0")
                if "auth_token" not in existing_cols:
                    conn.exec_driver_sql("ALTER TABLE users ADD COLUMN auth_token VARCHAR(128)")
                if "token_expires_at" not in existing_cols:
                    conn.exec_driver_sql("ALTER TABLE users ADD COLUMN token_expires_at TIMESTAMP")
            
            # Check user_profiles table columns
            if "user_profiles" in tables:
                profile_cols = {col["name"] for col in inspector.get_columns("user_profiles")}
                if "is_rural" not in profile_cols:
                    conn.exec_driver_sql("ALTER TABLE user_profiles ADD COLUMN is_rural BOOLEAN DEFAULT 1")
                if "state" not in profile_cols:
                    conn.exec_driver_sql("ALTER TABLE user_profiles ADD COLUMN state VARCHAR(64) DEFAULT 'Maharashtra'")
                if "district" not in profile_cols:
                    conn.exec_driver_sql("ALTER TABLE user_profiles ADD COLUMN district VARCHAR(64) DEFAULT 'Pune'")
                if "village_name" not in profile_cols:
                    conn.exec_driver_sql("ALTER TABLE user_profiles ADD COLUMN village_name VARCHAR(128) DEFAULT 'Baramati'")
    except Exception as e:
        print(f"init_db_schema notice: {e}")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
