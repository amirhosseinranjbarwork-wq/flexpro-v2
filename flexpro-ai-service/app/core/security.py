"""
Security utilities for FlexPro AI Service
Handles local JWT token verification (migrated from Supabase)
"""

from typing import Dict, Any
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.auth import decode_access_token
from app.db.database import get_db
from app.models.sql_models import User

security_scheme = HTTPBearer()


async def verify_token(token: str, db: Session) -> Dict[str, Any]:
    """
    Verify local JWT token and return user data

    Args:
        token: JWT token from Authorization header
        db: Database session

    Returns:
        Decoded user data with database user info

    Raises:
        HTTPException: If token is invalid
    """
    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
        
        # Get user from database
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        # Return user data
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "sub": str(user.id)
        }
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token format")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


async def get_current_user_data(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Dependency to get current user data from JWT token
    
    Returns:
        User data dictionary
    """
    token = credentials.credentials
    return await verify_token(token, db)


def get_user_role(user_data: Dict[str, Any]) -> str:
    """
    Extract user role from user data

    Args:
        user_data: User data dictionary

    Returns:
        User role ('coach' or 'client')
    """
    return user_data.get('role', 'client')


def require_coach_role(user_data: Dict[str, Any] = Depends(get_current_user_data)) -> None:
    """
    Check if user has coach role

    Args:
        user_data: User data dictionary

    Raises:
        HTTPException: If user is not a coach
    """
    role = get_user_role(user_data)
    if role != 'coach':
        raise HTTPException(
            status_code=403,
            detail="Coach role required for this operation"
        )