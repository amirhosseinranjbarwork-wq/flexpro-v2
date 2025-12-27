"""
Food Endpoints
Handles food/nutrition data retrieval
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.db.database import get_db
from app.models.sql_models import Food, User
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


class FoodResponse(BaseModel):
    id: int
    food_id: str
    name: str
    name_en: Optional[str]
    category: Optional[str]
    subcategory: Optional[str]
    calories: Optional[int]
    macros: Optional[dict]

    class Config:
        from_attributes = True


@router.get("/", response_model=List[FoodResponse])
async def get_foods(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by name"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all foods with optional filtering
    
    Returns:
        List of foods
    """
    query = db.query(Food)
    
    # Apply filters
    if category:
        query = query.filter(Food.category == category)
    if search:
        query = query.filter(Food.name.ilike(f"%{search}%"))
    
    foods = query.order_by(Food.name).all()
    
    return foods


@router.get("/{food_id}", response_model=FoodResponse)
async def get_food(
    food_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific food by ID
    
    Returns:
        Food details
    """
    food = db.query(Food).filter(Food.id == food_id).first()
    
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    
    return food

