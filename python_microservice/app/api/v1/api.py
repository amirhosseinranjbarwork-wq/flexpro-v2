"""
API Router for v1 endpoints
"""

from fastapi import APIRouter

from app.api.v1.endpoints import generate, health

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(generate.router, prefix="/generate", tags=["generation"])