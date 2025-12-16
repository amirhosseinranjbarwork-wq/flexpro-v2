"""
Security utilities for FlexPro AI Service
Handles Supabase JWT token verification
"""

import time
from typing import Dict, Any
import jwt
import httpx
from fastapi import HTTPException

from app.core.config import settings


async def verify_supabase_token(token: str) -> Dict[str, Any]:
    """
    Verify Supabase JWT token

    Args:
        token: JWT token from Authorization header

    Returns:
        Decoded user data

    Raises:
        HTTPException: If token is invalid
    """
    try:
        # Decode JWT without verification first to get header
        header = jwt.get_unverified_header(token)
        kid = header.get('kid')

        if not kid:
            raise HTTPException(status_code=401, detail="Invalid token header")

        # Get JWK from Supabase
        jwk_url = f"{settings.SUPABASE_URL}/rest/v1/jwt"
        async with httpx.AsyncClient() as client:
            response = await client.get(jwk_url)
            response.raise_for_status()
            jwk_data = response.json()

        # Find the correct key
        public_key = None
        for key in jwk_data.get('keys', []):
            if key.get('kid') == kid:
                public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
                break

        if not public_key:
            raise HTTPException(status_code=401, detail="Invalid token key")

        # Verify and decode token
        decoded = jwt.decode(
            token,
            public_key,
            algorithms=['RS256'],
            audience='authenticated',
            issuer=f"{settings.SUPABASE_URL}/auth/v2"
        )

        # Check token expiration
        if decoded.get('exp', 0) < time.time():
            raise HTTPException(status_code=401, detail="Token expired")

        return decoded

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


def get_user_role(user_data: Dict[str, Any]) -> str:
    """
    Extract user role from JWT payload

    Args:
        user_data: Decoded JWT payload

    Returns:
        User role ('coach' or 'client')
    """
    # Extract role from user metadata or app_metadata
    app_metadata = user_data.get('app_metadata', {})
    user_metadata = user_data.get('user_metadata', {})

    role = (
        app_metadata.get('role') or
        user_metadata.get('role') or
        'client'  # Default to client
    )

    return role


def require_coach_role(user_data: Dict[str, Any]) -> None:
    """
    Check if user has coach role

    Args:
        user_data: Decoded JWT payload

    Raises:
        HTTPException: If user is not a coach
    """
    role = get_user_role(user_data)
    if role != 'coach':
        raise HTTPException(
            status_code=403,
            detail="Coach role required for this operation"
        )