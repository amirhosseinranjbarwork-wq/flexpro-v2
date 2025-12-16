-- Exercises Table for Dynamic Exercise Data
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  muscle_group VARCHAR(100) NOT NULL,
  sub_muscle_group VARCHAR(100),
  equipment VARCHAR(255),
  type VARCHAR(50) NOT NULL DEFAULT 'resistance',
  mechanics VARCHAR(50),
  description TEXT,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for better query performance
  CONSTRAINT exercises_type_check CHECK (type IN ('resistance', 'cardio', 'corrective', 'warmup', 'cooldown'))
);

-- Foods Table for Dynamic Food Data
CREATE TABLE IF NOT EXISTS foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  unit VARCHAR(50) NOT NULL DEFAULT 'grams',
  calories NUMERIC(6, 2) NOT NULL,
  protein NUMERIC(6, 2) NOT NULL,
  carbs NUMERIC(6, 2) NOT NULL,
  fat NUMERIC(6, 2) NOT NULL,
  base_amount NUMERIC(6, 2) DEFAULT 100,
  fiber NUMERIC(6, 2),
  sugar NUMERIC(6, 2),
  sodium NUMERIC(8, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group);
CREATE INDEX IF NOT EXISTS idx_exercises_type ON exercises(type);
CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(name);
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name);

-- Full-text search indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_exercises_name_tsvector ON exercises USING GIN (
  to_tsvector('persian', name || ' ' || COALESCE(description, ''))
);

CREATE INDEX IF NOT EXISTS idx_foods_name_tsvector ON foods USING GIN (
  to_tsvector('persian', name)
);

-- Enable RLS (Row Level Security) for exercises table
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exercises_read_policy" ON exercises FOR SELECT USING (true);

-- Enable RLS for foods table
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "foods_read_policy" ON foods FOR SELECT USING (true);

-- Create search functions for better querying
CREATE OR REPLACE FUNCTION search_exercises(search_query TEXT, muscle_filter TEXT DEFAULT NULL, type_filter TEXT DEFAULT NULL, limit_count INT DEFAULT 20, offset_count INT DEFAULT 0)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  muscle_group VARCHAR,
  sub_muscle_group VARCHAR,
  equipment VARCHAR,
  type VARCHAR,
  mechanics VARCHAR,
  rank NUMERIC
) LANGUAGE SQL STABLE AS $$
  SELECT 
    e.id,
    e.name,
    e.muscle_group,
    e.sub_muscle_group,
    e.equipment,
    e.type,
    e.mechanics,
    ts_rank(to_tsvector('persian', e.name || ' ' || COALESCE(e.description, '')), 
            plainto_tsquery('persian', search_query)) AS rank
  FROM exercises e
  WHERE (search_query = '' OR to_tsvector('persian', e.name || ' ' || COALESCE(e.description, '')) @@ plainto_tsquery('persian', search_query))
    AND (muscle_filter IS NULL OR e.muscle_group = muscle_filter)
    AND (type_filter IS NULL OR e.type = type_filter)
  ORDER BY rank DESC, e.name ASC
  LIMIT limit_count
  OFFSET offset_count;
$$;

CREATE OR REPLACE FUNCTION search_foods(search_query TEXT, limit_count INT DEFAULT 20, offset_count INT DEFAULT 0)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  category VARCHAR,
  unit VARCHAR,
  calories NUMERIC,
  protein NUMERIC,
  carbs NUMERIC,
  fat NUMERIC,
  rank NUMERIC
) LANGUAGE SQL STABLE AS $$
  SELECT 
    f.id,
    f.name,
    f.category,
    f.unit,
    f.calories,
    f.protein,
    f.carbs,
    f.fat,
    ts_rank(to_tsvector('persian', f.name), plainto_tsquery('persian', search_query)) AS rank
  FROM foods f
  WHERE search_query = '' OR to_tsvector('persian', f.name) @@ plainto_tsquery('persian', search_query)
  ORDER BY rank DESC, f.name ASC
  LIMIT limit_count
  OFFSET offset_count;
$$;

-- Grant permissions
GRANT SELECT ON exercises TO anon, authenticated;
GRANT SELECT ON foods TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_exercises TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_foods TO anon, authenticated;
