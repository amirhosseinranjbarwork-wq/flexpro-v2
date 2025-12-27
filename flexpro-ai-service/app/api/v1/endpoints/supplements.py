"""
Supplement Endpoints
Handles supplement data retrieval
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.db.database import get_db
from app.models.sql_models_extended import Supplement
from app.api.v1.endpoints.auth import get_current_user
from app.models.sql_models import User

router = APIRouter()


class SupplementResponse(BaseModel):
    id: str
    name: str
    category: str
    standard_dose: float
    dose_unit: str
    timing: str
    evidence_level: str
    benefits: str
    instructions: Optional[str]
    tags: Optional[list]

    class Config:
        from_attributes = True


@router.get("/", response_model=List[SupplementResponse])
async def get_supplements(
    category: Optional[str] = Query(None, description="Filter by category"),
    evidence_level: Optional[str] = Query(None, description="Filter by evidence level"),
    search: Optional[str] = Query(None, description="Search by name"),
    skip: int = Query(0, description="Skip N records"),
    limit: int = Query(100, description="Limit results"),
    db: Session = Depends(get_db)
):
    """
    Get all supplements with optional filtering
    
    Returns:
        List of supplements
    """
    query = db.query(Supplement)
    
    # Apply filters
    if category:
        query = query.filter(Supplement.category == category)
    if evidence_level:
        query = query.filter(Supplement.evidence_level == evidence_level)
    if search:
        query = query.filter(Supplement.name.ilike(f"%{search}%"))
    
    supplements = query.order_by(Supplement.name).offset(skip).limit(limit).all()
    
    return supplements


@router.get("/{supplement_id}", response_model=SupplementResponse)
async def get_supplement(
    supplement_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a specific supplement by ID
    
    Returns:
        Supplement details
    """
    supplement = db.query(Supplement).filter(Supplement.id == supplement_id).first()
    
    if not supplement:
        raise HTTPException(status_code=404, detail="Supplement not found")
    
    return supplement
