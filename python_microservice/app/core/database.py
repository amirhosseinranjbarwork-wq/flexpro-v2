"""
Database connection and utilities
"""

from supabase import create_client, Client
from app.core.config import settings

# Initialize Supabase client
supabase: Client = create_client(
    supabase_url=settings.supabase_url,
    supabase_key=settings.supabase_anon_key
)

# Service role client for admin operations
supabase_admin: Client = create_client(
    supabase_url=settings.supabase_url,
    supabase_key=settings.supabase_service_role_key or settings.supabase_anon_key
)

def get_supabase_client() -> Client:
    """Get the main Supabase client"""
    return supabase

def get_supabase_admin_client() -> Client:
    """Get the admin Supabase client for elevated operations"""
    return supabase_admin