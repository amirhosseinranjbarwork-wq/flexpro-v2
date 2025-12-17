-- ============================================
-- FlexPro v2 Database Schema & Migration
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- Step 1: Foods Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'g',
    calories DECIMAL(8,2) NOT NULL DEFAULT 0,
    protein DECIMAL(8,2) NOT NULL DEFAULT 0,
    carbs DECIMAL(8,2) NOT NULL DEFAULT 0,
    fat DECIMAL(8,2) NOT NULL DEFAULT 0,
    base_amount DECIMAL(8,2) NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_foods_category ON public.foods(category);
CREATE INDEX IF NOT EXISTS idx_foods_name ON public.foods(name);

-- ============================================
-- Step 2: Exercises Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    muscle_group TEXT NOT NULL,
    sub_muscle_target TEXT,
    type TEXT NOT NULL DEFAULT 'resistance' CHECK (type IN ('resistance', 'cardio', 'corrective', 'warmup', 'cooldown')),
    mechanics TEXT CHECK (mechanics IN ('compound', 'isolation')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON public.exercises(muscle_group);
CREATE INDEX IF NOT EXISTS idx_exercises_sub_muscle ON public.exercises(sub_muscle_target);
CREATE INDEX IF NOT EXISTS idx_exercises_type ON public.exercises(type);

-- ============================================
-- Step 3: Full-Text Search Setup
-- ============================================

-- Create trigram indexes for fuzzy search
CREATE INDEX IF NOT EXISTS idx_foods_name_trgm ON public.foods USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_exercises_name_trgm ON public.exercises USING gin (name gin_trgm_ops);

-- Create tsvector indexes for advanced search
CREATE INDEX IF NOT EXISTS idx_foods_search ON public.foods USING gin (to_tsvector('english', name || ' ' || category));
CREATE INDEX IF NOT EXISTS idx_exercises_search ON public.exercises USING gin (to_tsvector('english', name || ' ' || muscle_group || ' ' || COALESCE(sub_muscle_target, '')));

-- ============================================
-- Step 4: RPC Functions for Search
-- ============================================

-- Function to search foods
CREATE OR REPLACE FUNCTION public.search_foods(
    search_query TEXT,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    category TEXT,
    unit TEXT,
    calories DECIMAL,
    protein DECIMAL,
    carbs DECIMAL,
    fat DECIMAL,
    base_amount DECIMAL,
    rank REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        f.id,
        f.name,
        f.category,
        f.unit,
        f.calories,
        f.protein,
        f.carbs,
        f.fat,
        f.base_amount,
        ts_rank(to_tsvector('english', f.name || ' ' || f.category), plainto_tsquery('english', search_query)) +
        similarity(f.name, search_query) * 0.3 AS rank
    FROM public.foods f
    WHERE
        to_tsvector('english', f.name || ' ' || f.category) @@ plainto_tsquery('english', search_query)
        OR similarity(f.name, search_query) > 0.3
        OR f.name ILIKE '%' || search_query || '%'
    ORDER BY rank DESC, f.name
    LIMIT limit_count
    OFFSET offset_count;
END;
$$;

-- Function to search exercises
CREATE OR REPLACE FUNCTION public.search_exercises(
    search_query TEXT,
    muscle_group_filter TEXT DEFAULT NULL,
    type_filter TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    muscle_group TEXT,
    sub_muscle_target TEXT,
    type TEXT,
    mechanics TEXT,
    description TEXT,
    rank REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.name,
        e.muscle_group,
        e.sub_muscle_target,
        e.type,
        e.mechanics,
        e.description,
        ts_rank(to_tsvector('english', e.name || ' ' || e.muscle_group || ' ' || COALESCE(e.sub_muscle_target, '')), plainto_tsquery('english', search_query)) +
        similarity(e.name, search_query) * 0.3 AS rank
    FROM public.exercises e
    WHERE
        (muscle_group_filter IS NULL OR e.muscle_group = muscle_group_filter)
        AND (type_filter IS NULL OR e.type = type_filter)
        AND (
            to_tsvector('english', e.name || ' ' || e.muscle_group || ' ' || COALESCE(e.sub_muscle_target, '')) @@ plainto_tsquery('english', search_query)
            OR similarity(e.name, search_query) > 0.3
            OR e.name ILIKE '%' || search_query || '%'
        )
    ORDER BY rank DESC, e.name
    LIMIT limit_count
    OFFSET offset_count;
END;
$$;

-- ============================================
-- Step 5: RLS Policies
-- ============================================

-- Enable RLS
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Foods: Read-only for authenticated users
CREATE POLICY "Foods are viewable by authenticated users" ON public.foods
    FOR SELECT USING (auth.role() = 'authenticated');

-- Foods: Insert/Update/Delete only for service role (admin)
CREATE POLICY "Foods are manageable by service role" ON public.foods
    FOR ALL USING (auth.role() = 'service_role');

-- Exercises: Read-only for authenticated users
CREATE POLICY "Exercises are viewable by authenticated users" ON public.exercises
    FOR SELECT USING (auth.role() = 'authenticated');

-- Exercises: Insert/Update/Delete only for service role (admin)
CREATE POLICY "Exercises are manageable by service role" ON public.exercises
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Step 6: Updated At Triggers
-- ============================================

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER handle_foods_updated_at
    BEFORE UPDATE ON public.foods
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_exercises_updated_at
    BEFORE UPDATE ON public.exercises
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Step 7: Sync Table for Offline Support
-- ============================================

CREATE TABLE IF NOT EXISTS public.sync_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    last_synced TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    version INTEGER DEFAULT 1,
    UNIQUE(user_id, table_name, record_id)
);

-- RLS for sync_metadata
ALTER TABLE public.sync_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own sync metadata" ON public.sync_metadata
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- Existing Tables RLS Review (Enhanced)
-- ============================================

-- Ensure existing tables have proper RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_requests ENABLE ROW LEVEL SECURITY;

-- Enhanced RLS for clients (coaches can only see their clients)
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;
CREATE POLICY "Coaches can manage their clients" ON public.clients
    FOR ALL USING (
        coach_id = auth.uid() OR
        auth.role() = 'service_role'
    );

-- Enhanced RLS for workout_plans
DROP POLICY IF EXISTS "Users can view their own workout plans" ON public.workout_plans;
CREATE POLICY "Coaches can manage their clients' workout plans" ON public.workout_plans
    FOR ALL USING (
        coach_id = auth.uid() OR
        auth.role() = 'service_role'
    );

-- Enhanced RLS for program_requests
DROP POLICY IF EXISTS "Users can view their own requests" ON public.program_requests;
CREATE POLICY "Coaches can manage their clients' requests" ON public.program_requests
    FOR ALL USING (
        coach_id = auth.uid() OR
        auth.role() = 'service_role'
    );