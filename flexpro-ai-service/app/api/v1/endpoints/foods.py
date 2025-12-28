"""
Food Endpoints
Handles food/nutrition data retrieval
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.db.database import get_db
from app.models.sql_models import Food
from app.api.v1.endpoints.auth import get_current_user
from app.models.sql_models import User

router = APIRouter()


class FoodResponse(BaseModel):
    id: int
    food_id: str
    name: str
    category: Optional[str]
    subcategory: Optional[str]
    calories: Optional[int]
    protein: Optional[int]
    carbs: Optional[int]
    fat: Optional[int]
    fiber: Optional[int]
    macros: Optional[dict]
    micros: Optional[dict]
    protein_type: Optional[str]
    protein_digestibility: Optional[int]
    digestion_speed: Optional[str]
    glycemic_index: Optional[int]
    ideal_timing: Optional[list]
    restrictions: Optional[list]
    allergens: Optional[list]
    benefits: Optional[str]
    tags: Optional[list]

    class Config:
        from_attributes = True


@router.get("/", response_model=List[FoodResponse])
async def get_foods(
    category: Optional[str] = Query(None, description="Filter by category (protein, carbohydrate, fruit, etc.)"),
    search: Optional[str] = Query(None, description="Search by name"),
    protein_type: Optional[str] = Query(None, description="Filter by protein type (complete, incomplete)"),
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
    if protein_type:
        query = query.filter(Food.protein_type == protein_type)
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


@router.get("/by-food-id/{food_id}", response_model=FoodResponse)
async def get_food_by_food_id(
    food_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific food by its original food_id

    Returns:
        Food details
    """
    food = db.query(Food).filter(Food.food_id == food_id).first()

    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    return food


@router.get("/categories/", response_model=List[str])
async def get_food_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all unique food categories

    Returns:
        List of categories
    """
    categories = db.query(Food.category).distinct().filter(Food.category.isnot(None)).all()
    return [cat[0] for cat in categories]