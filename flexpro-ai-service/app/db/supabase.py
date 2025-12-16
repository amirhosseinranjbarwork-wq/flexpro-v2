"""
Supabase client configuration for FlexPro AI Service
"""

from supabase import create_client, Client
from app.core.config import settings

_supabase_client: Client | None = None


def get_supabase_client() -> Client:
    """Get Supabase client instance"""
    if _supabase_client is None:
        raise RuntimeError("Supabase client not initialized. Call init_supabase() first.")
    return _supabase_client


async def init_supabase() -> None:
    """Initialize Supabase client"""
    global _supabase_client

    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be configured")

    _supabase_client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_ANON_KEY
    )

    # Test connection
    try:
        response = _supabase_client.table('foods').select('count', count='exact', head=True)
        # Note: In async context, this would be awaited, but for init we use sync
    except Exception as e:
        raise RuntimeError(f"Failed to connect to Supabase: {e}")


# Convenience functions for common operations
async def get_user_profile(user_id: str) -> dict:
    """Get user profile from Supabase"""
    client = get_supabase_client()
    response = client.table('profiles').select('*').eq('id', user_id).single()
    return response.data


async def get_client_data(client_id: str) -> dict:
    """Get client data from Supabase"""
    client = get_supabase_client()
    response = client.table('clients').select('*').eq('id', client_id).single()
    return response.data


async def get_exercises_by_muscle_groups(muscle_groups: list[str]) -> list[dict]:
    """Get exercises by muscle groups"""
    client = get_supabase_client()
    response = client.table('exercises').select('*').in('muscle_group', muscle_groups)
    return response.data or []


async def get_foods_by_categories(categories: list[str]) -> list[dict]:
    """Get foods by categories"""
    client = get_supabase_client()
    response = client.table('foods').select('*').in('category', categories)
    return response.data or []


async def search_foods(query: str, limit: int = 20) -> list[dict]:
    """Search foods using Supabase RPC"""
    client = get_supabase_client()
    response = client.rpc('search_foods', {
        'search_query': query,
        'limit_count': limit
    })
    return response.data or []


async def search_exercises(query: str, limit: int = 20) -> list[dict]:
    """Search exercises using Supabase RPC"""
    client = get_supabase_client()
    response = client.rpc('search_exercises', {
        'search_query': query,
        'limit_count': limit
    })
    return response.data or []