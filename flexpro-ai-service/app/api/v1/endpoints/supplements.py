"""
Supplement Endpoints
Handles supplement data retrieval
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.db.database import get_db
from app.models.sql_models import Supplement
from app.api.v1.endpoints.auth import get_current_user
from app.models.sql_models import User

router = APIRouter()


class SupplementResponse(BaseModel):
    id: int
    supplement_id: str
    name: str
    category: Optional[str]
    standard_dose: Optional[int]
    dose_unit: Optional[str]
    frequency_per_day: Optional[int]
    timing: Optional[list]
    evidence_level: Optional[str]
    primary_benefits: Optional[list]
    secondary_benefits: Optional[list]
    mechanisms: Optional[list]
    meta_analysis_findings: Optional[str]
    side_effects: Optional[list]
    contraindications: Optional[list]
    pregnancy_safe: Optional[bool]
    breastfeeding_safe: Optional[bool]
    goals: Optional[list]
    stacks_with: Optional[list]
    cost_effectiveness: Optional[str]
    taste_rating: Optional[int]
    mixability: Optional[str]
    tags: Optional[list]
    popularity_score: Optional[int]
    scientific_rating: Optional[int]

    class Config:
        from_attributes = True


@router.get("/", response_model=List[SupplementResponse])
async def get_supplements(
    category: Optional[str] = Query(None, description="Filter by category (creatine, protein, etc.)"),
    search: Optional[str] = Query(None, description="Search by name"),
    evidence_level: Optional[str] = Query(None, description="Filter by evidence level (strong, moderate, weak)"),
    goal: Optional[str] = Query(None, description="Filter by goal (muscle_growth, recovery, etc.)"),
    min_rating: Optional[int] = Query(None, description="Minimum scientific rating (1-10)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
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
    if goal and hasattr(Supplement, 'goals'):
        # For JSON array filtering, we'd need more complex logic
        # This is a simplified version
        pass
    if min_rating:
        query = query.filter(Supplement.scientific_rating >= min_rating)

    supplements = query.order_by(Supplement.name).all()

    return supplements


@router.get("/{supplement_id}", response_model=SupplementResponse)
async def get_supplement(
    supplement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
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


@router.get("/by-supplement-id/{supplement_id}", response_model=SupplementResponse)
async def get_supplement_by_supplement_id(
    supplement_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific supplement by its original supplement_id

    Returns:
        Supplement details
    """
    supplement = db.query(Supplement).filter(Supplement.supplement_id == supplement_id).first()

    if not supplement:
        raise HTTPException(status_code=404, detail="Supplement not found")

    return supplement


@router.get("/categories/", response_model=List[str])
async def get_supplement_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all unique supplement categories

    Returns:
        List of categories
    """
    categories = db.query(Supplement.category).distinct().filter(Supplement.category.isnot(None)).all()
    return [cat[0] for cat in categories]


@router.get("/top-rated/", response_model=List[SupplementResponse])
async def get_top_rated_supplements(
    limit: int = Query(10, description="Number of supplements to return"),
    min_rating: int = Query(8, description="Minimum scientific rating"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get top-rated supplements by scientific rating

    Returns:
        List of top-rated supplements
    """
    supplements = db.query(Supplement)\
        .filter(Supplement.scientific_rating >= min_rating)\
        .order_by(Supplement.scientific_rating.desc())\
        .limit(limit)\
        .all()

    return supplements