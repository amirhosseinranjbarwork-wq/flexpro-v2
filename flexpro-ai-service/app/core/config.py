"""
Configuration settings for FlexPro AI Service
Optimized for local SQLite database operation
"""

import os
from typing import Optional
from pydantic import BaseSettings


class Settings(BaseSettings):
    """Application settings for local-only operation"""

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Local Mode Configuration
    LOCAL_MODE: bool = True  # Always run in local mode
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "flexpro-local-secret-key-2025")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Local SQLite Database (automatically configured)
    DATABASE_URL: Optional[str] = None  # Auto-configured in database.py

    # Training System Configuration
    MAX_WORKOUT_EXERCISES: int = 12
    MAX_DIET_MEALS: int = 6
    DEFAULT_WORKOUT_DURATION: int = 60  # minutes
    DEFAULT_REST_SECONDS: int = 90
    
    # Exercise Parameters
    MIN_SETS: int = 1
    MAX_SETS: int = 10
    MIN_REPS: int = 1
    MAX_REPS: int = 50
    MIN_REST_SECONDS: int = 15
    MAX_REST_SECONDS: int = 300

    # Cardio Parameters
    MIN_CARDIO_MINUTES: int = 5
    MAX_CARDIO_MINUTES: int = 120
    
    # API Configuration
    ENABLE_CORS: bool = True
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"]

    # Rate Limiting (disabled for local use)
    RATE_LIMIT_ENABLED: bool = False
    RATE_LIMIT_REQUESTS: int = 1000
    RATE_LIMIT_WINDOW: int = 60  # seconds

    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_TO_FILE: bool = False

    # Optional AI Configuration (for future features)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    ENABLE_AI_FEATURES: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = True


# Create global settings instance
settings = Settings()