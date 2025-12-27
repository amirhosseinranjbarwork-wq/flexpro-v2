"""
Authentication Endpoints
Handles user registration and login
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import Optional

from app.db.database import get_db
from app.models.sql_models import User
from app.core.auth import verify_password, get_password_hash, create_access_token, decode_access_token

router = APIRouter()
security = HTTPBearer()


# Request/Response Models
class UserRegister(BaseModel):
    username: str
    email: Optional[EmailStr] = None
    password: str
    full_name: Optional[str] = None
    role: str = "client"  # 'coach' or 'client'


class UserLogin(BaseModel):
    username: str  # Can be username or email
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    id: int
    username: str
    email: Optional[str]
    full_name: Optional[str]
    role: str
    coach_code: Optional[str]
    is_super_admin: int

    class Config:
        from_attributes = True


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user
    
    Returns:
        Access token and user information
    """
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists (if provided)
    if user_data.email:
        existing_email = db.query(User).filter(User.email == user_data.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Validate role
    if user_data.role not in ["coach", "client"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be 'coach' or 'client'"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name,
        role=user_data.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate access token
    token_data = {
        "sub": str(new_user.id),
        "username": new_user.username,
        "email": new_user.email,
        "role": new_user.role
    }
    access_token = create_access_token(data=token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "role": new_user.role,
            "coach_code": new_user.coach_code,
            "is_super_admin": new_user.is_super_admin
        }
    }


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login user with username/email and password
    
    Returns:
        Access token and user information
    """
    # Find user by username or email
    user = db.query(User).filter(
        (User.username == credentials.username) | (User.email == credentials.username)
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # Generate access token
    token_data = {
        "sub": str(user.id),
        "username": user.username,
        "email": user.email,
        "role": user.role
    }
    access_token = create_access_token(data=token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "coach_code": user.coach_code,
            "is_super_admin": user.is_super_admin
        }
    }


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get current authenticated user from JWT token
    
    Returns:
        User object
    
    Raises:
        HTTPException: If token is invalid or user not found
    """
    token = credentials.credentials
    
    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
    except (ValueError, KeyError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information
    """
    return current_user

