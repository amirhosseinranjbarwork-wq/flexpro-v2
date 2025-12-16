"""
Configuration settings for FlexPro AI Microservice
"""

import os
from typing import Optional
from pydantic import BaseSettings


class Settings(BaseSettings):
    """Application settings"""

    # Supabase Configuration
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_anon_key: str = os.getenv("SUPABASE_ANON_KEY", "")
    supabase_service_role_key: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    # JWT Configuration
    jwt_secret: str = os.getenv("JWT_SECRET", "your-secret-key")
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24

    # Application Configuration
    environment: str = os.getenv("ENVIRONMENT", "development")
    debug: bool = environment == "development"

    # AI Configuration
    openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")

    # Scraping Configuration
    user_agent: str = "FlexPro-AI/1.0"
    request_timeout: int = 30
    max_retries: int = 3

    class Config:
        env_file = ".env"
        case_sensitive = False


# Create global settings instance
settings = Settings()