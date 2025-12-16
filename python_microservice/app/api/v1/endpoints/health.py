"""
Health check endpoints
"""

from fastapi import APIRouter, Depends
from app.core.database import supabase
from app.core.security import get_current_user

router = APIRouter()

@router.get("/")
async def health_check():
    """Basic health check"""
    return {"status": "healthy", "service": "flexpro-ai"}

@router.get("/detailed")
async def detailed_health_check(user: dict = Depends(get_current_user)):
    """Detailed health check with database connectivity"""
    try:
        # Test database connection
        response = supabase.table('foods').select('count', count='exact', head=True)
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy",
        "service": "flexpro-ai",
        "database": db_status,
        "user_id": user.get('sub')
    }