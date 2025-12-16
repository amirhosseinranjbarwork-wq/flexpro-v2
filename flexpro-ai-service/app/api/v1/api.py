"""
API v1 Router
Combines all API endpoints
"""

from fastapi import APIRouter

from app.api.v1.endpoints import workout, diet, health

api_router = APIRouter()

# Include all endpoint routers
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