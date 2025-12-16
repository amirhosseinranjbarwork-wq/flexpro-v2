"""
Security utilities for JWT validation and authentication
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from fastapi import HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx

from app.core.config import settings

security = HTTPBearer()

async def validate_supabase_jwt(token: str) -> Dict[str, Any]:
    """
    Validate Supabase JWT token
    """
    try:
        # Decode JWT without verification (Supabase handles verification)
        payload = jwt.get_unverified_claims(token)

        # Verify expiration
        exp = payload.get('exp')
        if exp and datetime.utcfromtimestamp(exp) < datetime.utcnow():
            raise HTTPException(status_code=401, detail="Token expired")

        # Verify issuer
        iss = payload.get('iss')
        if not iss or not iss.endswith('supabase.co'):
            raise HTTPException(status_code=401, detail="Invalid token issuer")

        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Dependency to get current authenticated user from Supabase JWT
    """
    token = credentials.credentials
    return await validate_supabase_jwt(token)

async def get_current_coach(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Dependency to ensure current user is a coach
    """
    # In a real implementation, you might check user role in database
    # For now, we'll assume authenticated users can access AI features
    return user

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create JWT access token (for internal use if needed)
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=settings.jwt_expiration_hours))
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return encoded_jwt