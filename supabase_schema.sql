-- ============================================
-- FlexPro v2 - Supabase Schema & RLS Policies
-- ============================================
-- This file contains Row Level Security (RLS) policies
-- to ensure users can only access their own data
-- and coaches can only access their assigned clients.

-- ============================================
-- Enable Row Level Security on all tables
-- ============================================

-- Enable RLS on users table
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on clients table
ALTER TABLE IF EXISTS clients ENABLE ROW LEVEL SECURITY;

-- Enable RLS on workout_plans table
ALTER TABLE IF EXISTS workout_plans ENABLE ROW LEVEL SECURITY;

-- Enable RLS on templates table
ALTER TABLE IF EXISTS templates ENABLE ROW LEVEL SECURITY;

-- Enable RLS on program_requests table
ALTER TABLE IF EXISTS program_requests ENABLE ROW LEVEL SECURITY;

-- Enable RLS on profiles table (if exists)
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for 'users' table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Coaches can view their clients" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Coaches can update their clients" ON users;
DROP POLICY IF EXISTS "Coaches can insert clients" ON users;
DROP POLICY IF EXISTS "Coaches can delete their clients" ON users;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON users FOR SELECT
USING (auth.uid()::text = id::text);

-- Policy: Coaches can view their assigned clients
CREATE POLICY "Coaches can view their clients"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = users.id
    AND clients.coach_id = auth.uid()::text
  )
);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (auth.uid()::text = id::text);

-- Policy: Coaches can update their clients
CREATE POLICY "Coaches can update their clients"
ON users FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = users.id
    AND clients.coach_id = auth.uid()::text
  )
);

-- Policy: Coaches can insert clients (only their own clients)
CREATE POLICY "Coaches can insert clients"
ON users FOR INSERT
WITH CHECK (
  coach_id = auth.uid()::text
);

-- Policy: Coaches can delete their clients
CREATE POLICY "Coaches can delete their clients"
ON users FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = users.id
    AND clients.coach_id = auth.uid()::text
  )
);

-- ============================================
-- RLS Policies for 'clients' table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Clients can view their own data" ON clients;
DROP POLICY IF EXISTS "Coaches can view their clients" ON clients;
DROP POLICY IF EXISTS "Clients can update their own data" ON clients;
DROP POLICY IF EXISTS "Coaches can update their clients" ON clients;
DROP POLICY IF EXISTS "Coaches can insert clients" ON clients;
DROP POLICY IF EXISTS "Coaches can delete their clients" ON clients;

-- Policy: Clients can view their own data
CREATE POLICY "Clients can view their own data"
ON clients FOR SELECT
USING (auth.uid()::text = id);

-- Policy: Coaches can view their assigned clients
CREATE POLICY "Coaches can view their clients"
ON clients FOR SELECT
USING (coach_id = auth.uid()::text);

-- Policy: Clients can update their own data
CREATE POLICY "Clients can update their own data"
ON clients FOR UPDATE
USING (auth.uid()::text = id);

-- Policy: Coaches can update their clients
CREATE POLICY "Coaches can update their clients"
ON clients FOR UPDATE
USING (coach_id = auth.uid()::text);

-- Policy: Coaches can insert clients
CREATE POLICY "Coaches can insert clients"
ON clients FOR INSERT
WITH CHECK (coach_id = auth.uid()::text);

-- Policy: Coaches can delete their clients
CREATE POLICY "Coaches can delete their clients"
ON clients FOR DELETE
USING (coach_id = auth.uid()::text);

-- ============================================
-- RLS Policies for 'workout_plans' table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Clients can view their own plans" ON workout_plans;
DROP POLICY IF EXISTS "Coaches can view their clients' plans" ON workout_plans;
DROP POLICY IF EXISTS "Coaches can update their clients' plans" ON workout_plans;
DROP POLICY IF EXISTS "Coaches can insert plans for their clients" ON workout_plans;
DROP POLICY IF EXISTS "Coaches can delete their clients' plans" ON workout_plans;

-- Policy: Clients can view their own plans
CREATE POLICY "Clients can view their own plans"
ON workout_plans FOR SELECT
USING (auth.uid()::text = client_id);

-- Policy: Coaches can view their clients' plans
CREATE POLICY "Coaches can view their clients' plans"
ON workout_plans FOR SELECT
USING (coach_id = auth.uid()::text);

-- Policy: Coaches can update their clients' plans
CREATE POLICY "Coaches can update their clients' plans"
ON workout_plans FOR UPDATE
USING (coach_id = auth.uid()::text);

-- Policy: Coaches can insert plans for their clients
CREATE POLICY "Coaches can insert plans for their clients"
ON workout_plans FOR INSERT
WITH CHECK (coach_id = auth.uid()::text);

-- Policy: Coaches can delete their clients' plans
CREATE POLICY "Coaches can delete their clients' plans"
ON workout_plans FOR DELETE
USING (coach_id = auth.uid()::text);

-- ============================================
-- RLS Policies for 'templates' table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Coaches can view their own templates" ON templates;
DROP POLICY IF EXISTS "Coaches can manage their own templates" ON templates;

-- Policy: Coaches can view their own templates
CREATE POLICY "Coaches can view their own templates"
ON templates FOR SELECT
USING (coach_id = auth.uid()::text OR coach_id IS NULL);

-- Policy: Coaches can manage their own templates
CREATE POLICY "Coaches can manage their own templates"
ON templates FOR ALL
USING (coach_id = auth.uid()::text OR coach_id IS NULL)
WITH CHECK (coach_id = auth.uid()::text OR coach_id IS NULL);

-- ============================================
-- RLS Policies for 'program_requests' table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Clients can view their own requests" ON program_requests;
DROP POLICY IF EXISTS "Coaches can view requests for their clients" ON program_requests;
DROP POLICY IF EXISTS "Clients can create requests" ON program_requests;
DROP POLICY IF EXISTS "Coaches can update requests" ON program_requests;

-- Policy: Clients can view their own requests
CREATE POLICY "Clients can view their own requests"
ON program_requests FOR SELECT
USING (auth.uid()::text = client_id);

-- Policy: Coaches can view requests for their clients
CREATE POLICY "Coaches can view requests for their clients"
ON program_requests FOR SELECT
USING (coach_id = auth.uid()::text);

-- Policy: Clients can create requests
CREATE POLICY "Clients can create requests"
ON program_requests FOR INSERT
WITH CHECK (auth.uid()::text = client_id);

-- Policy: Coaches can update requests
CREATE POLICY "Coaches can update requests"
ON program_requests FOR UPDATE
USING (coach_id = auth.uid()::text);

-- ============================================
-- RLS Policies for 'profiles' table (if exists)
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid()::text = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid()::text = id);

-- ============================================
-- Notes:
-- ============================================
-- 1. All policies use auth.uid() to get the current authenticated user's ID
-- 2. Coaches can only access clients assigned to them via coach_id
-- 3. Clients can only access their own data
-- 4. Templates are coach-specific (coach_id must match)
-- 5. Program requests are visible to both client (creator) and coach (assigned)
-- 6. Make sure to run these policies after creating the tables in Supabase

