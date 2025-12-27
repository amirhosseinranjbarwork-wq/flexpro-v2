"""
API v1 Router
Combines all API endpoints
"""

from fastapi import APIRouter

from app.api.v1.endpoints import workout, diet, health, auth, exercises, workouts, foods

api_router = APIRouter()

# Authentication endpoints (no auth required)
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["authentication"]
)

# Data endpoints (require authentication)
api_router.include_router(
    exercises.router,
    prefix="/exercises",
    tags=["exercises"]
)

api_router.include_router(
    workouts.router,
    prefix="/workouts",
    tags=["workouts"]
)

api_router.include_router(
    foods.router,
    prefix="/foods",
    tags=["foods"]
)

# AI Generation endpoints (require authentication)
api_router.include_router(
    workout.router,
    prefix="/generate",
    tags=["workout-generation"]
)

api_router.include_router(
    diet.router,
    prefix="/generate",
    tags=["diet-generation"]
)

api_router.include_router(
    health.router,
    tags=["health"]
)