"""
Food Endpoints (Extended)
Handles food/nutrition data retrieval with complete nutritional data
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.db.database import get_db
from app.models.sql_models_extended import Food
from app.api.v1.endpoints.auth import get_current_user
from app.models.sql_models import User

router = APIRouter()


class FoodResponse(BaseModel):
    id: str
    name: str
    category: str
    serving_size: float
    serving_unit: str
    calories: int
    protein: float
    carbs: float
    fat: float
    fiber: float
    benefits: Optional[str]
    tags: Optional[list]

    class Config:
        from_attributes = True


@router.get("/", response_model=List[FoodResponse])
async def get_foods(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by name"),
    skip: int = Query(0, description="Skip N records"),
    limit: int = Query(100, description="Limit results"),
    db: Session = Depends(get_db)
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
    
    foods = query.order_by(Food.name).offset(skip).limit(limit).all()
    
    return foods


@router.get("/{food_id}", response_model=FoodResponse)
async def get_food(
    food_id: str,
    db: Session = Depends(get_db)
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
