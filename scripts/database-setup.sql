-- FlexPro Database Tables Creation
-- Generated automatically for complete database setup
-- Copy this entire SQL and execute it in Supabase SQL Editor

-- Profiles Table (User profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  username VARCHAR(100) UNIQUE,
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'coach', 'admin')),
  bio TEXT,
  avatar_url VARCHAR(500),
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  banned_at TIMESTAMP WITH TIME ZONE,
  is_super_admin BOOLEAN DEFAULT FALSE,
  plans JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exercises Table (Comprehensive exercise database)
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  name_en VARCHAR(255),
  muscle_group VARCHAR(100) NOT NULL,
  sub_muscle_group VARCHAR(100),
  equipment VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'resistance' CHECK (type IN ('resistance', 'cardio', 'corrective', 'warmup', 'cooldown')),
  mechanics VARCHAR(50) CHECK (mechanics IN ('compound', 'isolation', 'aerobic', 'corrective', 'dynamic-stretch', 'static-stretch', 'isometric')),
  difficulty VARCHAR(20) DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  description TEXT,
  instructions TEXT,
  tips TEXT,
  common_mistakes TEXT,
  variations TEXT,
  primary_muscles TEXT,
  secondary_muscles TEXT,
  contraindications TEXT,
  preparation_time INTEGER,
  execution_time INTEGER,
  rest_time INTEGER,
  calories_per_hour INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Foods Table (Comprehensive nutrition database)
CREATE TABLE IF NOT EXISTS foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  name_en VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  unit VARCHAR(50) NOT NULL DEFAULT 'گرم',
  base_amount DECIMAL(8,2) DEFAULT 100,
  calories DECIMAL(8,2) NOT NULL,
  protein DECIMAL(6,2) NOT NULL,
  carbs DECIMAL(6,2) NOT NULL,
  fat DECIMAL(6,2) NOT NULL,
  fiber DECIMAL(6,2),
  sugar DECIMAL(6,2),
  sodium DECIMAL(8,2),
  potassium DECIMAL(8,2),
  calcium DECIMAL(8,2),
  iron DECIMAL(6,2),
  vitamin_c DECIMAL(6,2),
  vitamin_a INTEGER,
  glycemic_index INTEGER,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  allergens TEXT,
  preparation VARCHAR(100),
  serving_suggestions TEXT,
  nutritional_highlights TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Supplements Table (Comprehensive supplements database)
CREATE TABLE IF NOT EXISTS supplements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  name_en VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  type VARCHAR(100),
  form VARCHAR(50) DEFAULT 'پودر' CHECK (form IN ('پودر', 'کپسول', 'قرص', 'مایع', 'ژل')),
  dosage VARCHAR(100),
  unit VARCHAR(50),
  benefits TEXT,
  timing TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Templates Table (Workout and nutrition templates)
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  data JSONB,
  full_week_data JSONB,
  is_full_program BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  user_id UUID REFERENCES profiles(id),
  is_public BOOLEAN DEFAULT FALSE,
  category VARCHAR(50) CHECK (category IN ('workout', 'nutrition', 'full_program')),
  difficulty VARCHAR(20) DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Coaching Relationships Table
CREATE TABLE IF NOT EXISTS coaching_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES profiles(id),
  client_id UUID NOT NULL REFERENCES profiles(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  notes TEXT,
  goals JSONB,
  progress_tracking JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(coach_id, client_id, status)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group);
CREATE INDEX IF NOT EXISTS idx_exercises_type ON exercises(type);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(name);

CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
CREATE INDEX IF NOT EXISTS idx_foods_calories ON foods(calories);
CREATE INDEX IF NOT EXISTS idx_foods_protein ON foods(protein);
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name);

CREATE INDEX IF NOT EXISTS idx_supplements_category ON supplements(category);
CREATE INDEX IF NOT EXISTS idx_supplements_name ON supplements(name);

CREATE INDEX IF NOT EXISTS idx_templates_created_by ON templates(created_by);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON templates(is_public);

CREATE INDEX IF NOT EXISTS idx_coaching_relationships_coach_id ON coaching_relationships(coach_id);
CREATE INDEX IF NOT EXISTS idx_coaching_relationships_client_id ON coaching_relationships(client_id);
CREATE INDEX IF NOT EXISTS idx_coaching_relationships_status ON coaching_relationships(status);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_relationships ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "profiles_select_policy" ON profiles FOR SELECT USING (
  auth.uid() = id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('coach', 'admin'))
);

CREATE POLICY "profiles_insert_policy" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_policy" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Public read access for exercises, foods, and supplements
CREATE POLICY "exercises_read_policy" ON exercises FOR SELECT USING (true);
CREATE POLICY "foods_read_policy" ON foods FOR SELECT USING (true);
CREATE POLICY "supplements_read_policy" ON supplements FOR SELECT USING (true);

-- Templates policies
CREATE POLICY "templates_read_policy" ON templates FOR SELECT USING (
  is_public = true OR
  created_by = auth.uid() OR
  user_id = auth.uid()
);

CREATE POLICY "templates_insert_policy" ON templates FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "templates_update_policy" ON templates FOR UPDATE USING (
  created_by = auth.uid() OR
  user_id = auth.uid()
);

-- Coaching relationships policies
CREATE POLICY "coaching_read_policy" ON coaching_relationships FOR SELECT USING (
  coach_id = auth.uid() OR client_id = auth.uid()
);

CREATE POLICY "coaching_insert_policy" ON coaching_relationships FOR INSERT WITH CHECK (
  coach_id = auth.uid() OR client_id = auth.uid()
);

CREATE POLICY "coaching_update_policy" ON coaching_relationships FOR UPDATE USING (
  coach_id = auth.uid() OR client_id = auth.uid()
);

-- Create functions for search capabilities
CREATE OR REPLACE FUNCTION search_exercises(
  search_query TEXT DEFAULT '',
  muscle_filter TEXT DEFAULT '',
  type_filter TEXT DEFAULT '',
  difficulty_filter TEXT DEFAULT '',
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  name_en TEXT,
  muscle_group TEXT,
  sub_muscle_group TEXT,
  equipment TEXT,
  type TEXT,
  difficulty TEXT,
  description TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.name,
    e.name_en,
    e.muscle_group,
    e.sub_muscle_group,
    e.equipment,
    e.type,
    e.difficulty,
    e.description,
    CASE
      WHEN search_query = '' THEN 1.0
      ELSE GREATEST(
        similarity(e.name, search_query),
        similarity(e.name_en, search_query),
        similarity(e.description, search_query)
      )
    END as rank
  FROM exercises e
  WHERE (search_query = '' OR
         e.name ILIKE '%' || search_query || '%' OR
         e.name_en ILIKE '%' || search_query || '%' OR
         e.description ILIKE '%' || search_query || '%')
    AND (muscle_filter = '' OR e.muscle_group = muscle_filter)
    AND (type_filter = '' OR e.type = type_filter)
    AND (difficulty_filter = '' OR e.difficulty = difficulty_filter)
  ORDER BY rank DESC, e.name
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_foods(
  search_query TEXT DEFAULT '',
  category_filter TEXT DEFAULT '',
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  name_en TEXT,
  category TEXT,
  unit TEXT,
  calories DECIMAL,
  protein DECIMAL,
  carbs DECIMAL,
  fat DECIMAL,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    f.id,
    f.name,
    f.name_en,
    f.category,
    f.unit,
    f.calories,
    f.protein,
    f.carbs,
    f.fat,
    CASE
      WHEN search_query = '' THEN 1.0
      ELSE GREATEST(
        similarity(f.name, search_query),
        similarity(f.name_en, search_query),
        similarity(f.category, search_query)
      )
    END as rank
  FROM foods f
  WHERE (search_query = '' OR
         f.name ILIKE '%' || search_query || '%' OR
         f.name_en ILIKE '%' || search_query || '%' OR
         f.category ILIKE '%' || search_query || '%')
    AND (category_filter = '' OR f.category = category_filter)
  ORDER BY rank DESC, f.name
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get email by username (secure)
CREATE OR REPLACE FUNCTION get_email_by_username(p_username TEXT)
RETURNS TEXT AS $$
DECLARE
  user_email TEXT;
BEGIN
  SELECT email INTO user_email
  FROM profiles
  WHERE username = p_username
  LIMIT 1;

  RETURN user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION search_exercises TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_foods TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_email_by_username TO authenticated, anon;

-- Create trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_foods_updated_at BEFORE UPDATE ON foods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplements_updated_at BEFORE UPDATE ON supplements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaching_relationships_updated_at BEFORE UPDATE ON coaching_relationships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();