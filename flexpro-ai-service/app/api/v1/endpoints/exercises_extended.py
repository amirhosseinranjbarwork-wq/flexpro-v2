"""
Exercise Endpoints (Extended)
Handles exercise data retrieval with full scientific parameters
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.db.database import get_db
from app.models.sql_models_extended import Exercise
from app.api.v1.endpoints.auth import get_current_user
from app.models.sql_models import User

router = APIRouter()


class ExerciseResponse(BaseModel):
    id: str
    name: str
    category: str
    primary_muscles: list
    secondary_muscles: list
    equipment: list
    difficulty: str
    description: Optional[str]
    instructions: Optional[str]
    default_sets: Optional[int]
    default_reps: Optional[int]
    default_rest: Optional[int]
    rpe: Optional[int]
    tempo: Optional[str]
    default_duration: Optional[int]
    intensity_zone: Optional[int]
    tags: Optional[list]

    class Config:
        from_attributes = True


@router.get("/", response_model=List[ExerciseResponse])
async def get_exercises(
    category: Optional[str] = Query(None, description="Filter by category"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    equipment: Optional[str] = Query(None, description="Filter by equipment"),
    muscle_group: Optional[str] = Query(None, description="Filter by muscle group"),
    search: Optional[str] = Query(None, description="Search by name"),
    skip: int = Query(0, description="Skip N records"),
    limit: int = Query(100, description="Limit results"),
    db: Session = Depends(get_db)
):
    """
    Get all exercises with optional filtering
    
    Returns:
        List of exercises
    """
    query = db.query(Exercise)
    
    # Apply filters
    if category:
        query = query.filter(Exercise.category == category)
    if difficulty:
        query = query.filter(Exercise.difficulty == difficulty)
    if equipment:
        # Check if equipment is in the JSON array
        query = query.filter(Exercise.equipment.contains([equipment]))
    if muscle_group:
        # Check if muscle group is in primary or secondary muscles
        query = query.filter(
            (Exercise.primary_muscles.contains([muscle_group])) |
            (Exercise.secondary_muscles.contains([muscle_group]))
        )
    if search:
        query = query.filter(Exercise.name.ilike(f"%{search}%"))
    
    exercises = query.order_by(Exercise.name).offset(skip).limit(limit).all()
    
    return exercises


@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise(
    exercise_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a specific exercise by ID
    
    Returns:
        Exercise details
    """
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    return exercise
