"""
Exercise Endpoints
Handles exercise data retrieval
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.db.database import get_db
from app.models.sql_models import Exercise
from app.api.v1.endpoints.auth import get_current_user
from app.models.sql_models import User

router = APIRouter()


class ExerciseResponse(BaseModel):
    id: int
    exercise_id: str
    name: str
    category: Optional[str]
    muscle_group: Optional[str]
    sub_muscle_group: Optional[str]
    equipment: Optional[str]
    type: Optional[str]
    difficulty: Optional[str]
    scientific_data: Optional[dict]

    class Config:
        from_attributes = True


@router.get("/", response_model=List[ExerciseResponse])
async def get_exercises(
    category: Optional[str] = Query(None, description="Filter by category"),
    muscle_group: Optional[str] = Query(None, description="Filter by muscle group"),
    equipment: Optional[str] = Query(None, description="Filter by equipment"),
    search: Optional[str] = Query(None, description="Search by name"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
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
    if muscle_group:
        query = query.filter(Exercise.muscle_group == muscle_group)
    if equipment:
        query = query.filter(Exercise.equipment == equipment)
    if search:
        query = query.filter(Exercise.name.ilike(f"%{search}%"))
    
    exercises = query.order_by(Exercise.name).all()
    
    return exercises


@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
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


@router.get("/by-exercise-id/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise_by_exercise_id(
    exercise_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific exercise by its original exercise_id (from TypeScript)
    
    Returns:
        Exercise details
    """
    exercise = db.query(Exercise).filter(Exercise.exercise_id == exercise_id).first()
    
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    return exercise


