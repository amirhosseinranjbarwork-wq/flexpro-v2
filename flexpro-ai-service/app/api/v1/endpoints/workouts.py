"""
Workout Plan Endpoints
Handles workout plan creation and retrieval
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.db.database import get_db
from app.models.sql_models import WorkoutPlan, User
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


class WorkoutPlanCreate(BaseModel):
    data: dict  # JSON data containing workout plan structure
    plan_name: Optional[str] = None
    plan_type: Optional[str] = None


class WorkoutPlanUpdate(BaseModel):
    data: Optional[dict] = None
    plan_name: Optional[str] = None
    plan_type: Optional[str] = None


class WorkoutPlanResponse(BaseModel):
    id: int
    user_id: int
    data: dict
    plan_name: Optional[str]
    plan_type: Optional[str]
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


@router.post("/", response_model=WorkoutPlanResponse, status_code=201)
async def create_workout_plan(
    workout_data: WorkoutPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new workout plan for the current user
    
    Returns:
        Created workout plan
    """
    workout_plan = WorkoutPlan(
        user_id=current_user.id,
        data=workout_data.data,
        plan_name=workout_data.plan_name,
        plan_type=workout_data.plan_type or "training"
    )
    
    db.add(workout_plan)
    db.commit()
    db.refresh(workout_plan)
    
    return workout_plan


@router.get("/", response_model=List[WorkoutPlanResponse])
async def get_user_workout_plans(
    plan_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all workout plans for the current user
    
    Returns:
        List of workout plans
    """
    query = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == current_user.id)
    
    if plan_type:
        query = query.filter(WorkoutPlan.plan_type == plan_type)
    
    workout_plans = query.order_by(WorkoutPlan.created_at.desc()).all()
    
    return workout_plans


@router.get("/{workout_id}", response_model=WorkoutPlanResponse)
async def get_workout_plan(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific workout plan by ID
    
    Returns:
        Workout plan details
    """
    workout_plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == workout_id,
        WorkoutPlan.user_id == current_user.id
    ).first()
    
    if not workout_plan:
        raise HTTPException(status_code=404, detail="Workout plan not found")
    
    return workout_plan


@router.put("/{workout_id}", response_model=WorkoutPlanResponse)
async def update_workout_plan(
    workout_id: int,
    workout_data: WorkoutPlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a workout plan
    
    Returns:
        Updated workout plan
    """
    workout_plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == workout_id,
        WorkoutPlan.user_id == current_user.id
    ).first()
    
    if not workout_plan:
        raise HTTPException(status_code=404, detail="Workout plan not found")
    
    # Update fields
    if workout_data.data is not None:
        workout_plan.data = workout_data.data
    if workout_data.plan_name is not None:
        workout_plan.plan_name = workout_data.plan_name
    if workout_data.plan_type is not None:
        workout_plan.plan_type = workout_data.plan_type
    
    db.commit()
    db.refresh(workout_plan)
    
    return workout_plan


@router.delete("/{workout_id}", status_code=204)
async def delete_workout_plan(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a workout plan
    """
    workout_plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == workout_id,
        WorkoutPlan.user_id == current_user.id
    ).first()
    
    if not workout_plan:
        raise HTTPException(status_code=404, detail="Workout plan not found")
    
    db.delete(workout_plan)
    db.commit()
    
    return None


# Endpoint for coaches to get client workout plans
@router.get("/user/{user_id}", response_model=List[WorkoutPlanResponse])
async def get_user_workout_plans_by_user_id(
    user_id: int,
    plan_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get workout plans for a specific user (coach only)
    
    Returns:
        List of workout plans for the specified user
    """
    # Only coaches can access other users' plans
    if current_user.role != "coach":
        raise HTTPException(status_code=403, detail="Only coaches can access other users' plans")
    
    query = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user_id)
    
    if plan_type:
        query = query.filter(WorkoutPlan.plan_type == plan_type)
    
    workout_plans = query.order_by(WorkoutPlan.created_at.desc()).all()
    
    return workout_plans


