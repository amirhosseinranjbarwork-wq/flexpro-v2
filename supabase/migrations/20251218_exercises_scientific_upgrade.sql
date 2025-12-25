-- Scientific Upgrade for Exercises Table
-- Adds comprehensive parameters for professional strength coaching

-- Add new scientific columns to exercises table
ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'bodybuilding'
  CONSTRAINT exercises_category_check CHECK (category IN ('bodybuilding', 'cardio', 'warmup', 'cooldown', 'corrective')),

ADD COLUMN IF NOT EXISTS primary_muscle VARCHAR(100),

ADD COLUMN IF NOT EXISTS secondary_muscles TEXT[],

ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(20) DEFAULT 'intermediate'
  CONSTRAINT exercises_difficulty_check CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),

-- Scientific training parameters
ADD COLUMN IF NOT EXISTS tempo VARCHAR(20), -- e.g., "3-0-1-0" (eccentric-pause-concentric-pause)

ADD COLUMN IF NOT EXISTS default_rpe INTEGER CHECK (default_rpe >= 1 AND default_rpe <= 10),

ADD COLUMN IF NOT EXISTS default_rir INTEGER CHECK (default_rir >= 0 AND default_rir <= 5),

ADD COLUMN IF NOT EXISTS rest_interval_seconds INTEGER DEFAULT 90 CHECK (rest_interval_seconds > 0),

ADD COLUMN IF NOT EXISTS unilateral BOOLEAN DEFAULT false,

-- Equipment standardization
ADD COLUMN IF NOT EXISTS equipment_standardized VARCHAR(50)
  CONSTRAINT exercises_equipment_standardized_check CHECK (equipment_standardized IN (
    'barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'bands', 'foam_roller', 'trx', 'kettlebell', 'medicine_ball', 'battle_ropes', 'treadmill', 'rower', 'elliptical', 'bike'
  ));

-- Update existing records to have proper categories and standardized equipment
UPDATE exercises
SET
  category = CASE
    WHEN type = 'cardio' THEN 'cardio'
    WHEN type = 'corrective' THEN 'corrective'
    WHEN type = 'warmup' THEN 'warmup'
    WHEN type = 'cooldown' THEN 'cooldown'
    ELSE 'bodybuilding'
  END,
  primary_muscle = CASE
    WHEN muscle_group = 'سینه' THEN 'Pectoralis Major'
    WHEN muscle_group = 'پشت' THEN 'Latissimus Dorsi'
    WHEN muscle_group = 'شانه' THEN 'Deltoids'
    WHEN muscle_group = 'بازو' THEN 'Biceps Brachii'
    WHEN muscle_group = 'ران' THEN 'Quadriceps'
    WHEN muscle_group = 'سرین' THEN 'Gluteus Maximus'
    WHEN muscle_group = 'ساق' THEN 'Gastrocnemius'
    WHEN muscle_group = 'شکم' THEN 'Rectus Abdominis'
    ELSE muscle_group
  END,
  equipment_standardized = CASE
    WHEN equipment = 'هالتر' THEN 'barbell'
    WHEN equipment = 'دمبل' THEN 'dumbbell'
    WHEN equipment = 'دستگاه' THEN 'machine'
    WHEN equipment = 'کابل' THEN 'cable'
    WHEN equipment = 'وزن بدن' THEN 'bodyweight'
    WHEN equipment = 'باند' THEN 'bands'
    WHEN equipment = 'فوم رولر' THEN 'foam_roller'
    WHEN equipment = 'trx' THEN 'trx'
    WHEN equipment = 'کتل بل' THEN 'kettlebell'
    WHEN equipment = 'طب توپ' THEN 'medicine_ball'
    WHEN equipment = 'طناب جنگ' THEN 'battle_ropes'
    WHEN equipment = 'تردمیل' THEN 'treadmill'
    WHEN equipment = 'روئینگ' THEN 'rower'
    WHEN equipment = 'الیپتیکال' THEN 'elliptical'
    WHEN equipment = 'دوچرخه' THEN 'bike'
    ELSE 'bodyweight'
  END,
  difficulty_level = CASE
    WHEN name LIKE '%پیشرفته%' OR name LIKE '%دیپ%' OR name LIKE '%پل%' THEN 'advanced'
    WHEN name LIKE '%مبتدی%' THEN 'beginner'
    ELSE 'intermediate'
  END,
  default_rpe = CASE
    WHEN type = 'cardio' THEN 6
    WHEN difficulty_level = 'beginner' THEN 7
    WHEN difficulty_level = 'advanced' THEN 8
    ELSE 7
  END,
  default_rir = CASE
    WHEN difficulty_level = 'beginner' THEN 3
    WHEN difficulty_level = 'advanced' THEN 1
    ELSE 2
  END,
  rest_interval_seconds = CASE
    WHEN type = 'cardio' THEN 30
    WHEN mechanics = 'compound' THEN 180
    WHEN mechanics = 'isolation' THEN 90
    ELSE 120
  END,
  unilateral = CASE
    WHEN name LIKE '%یک طرف%' OR name LIKE '%چپ%' OR name LIKE '%راست%' THEN true
    ELSE false
  END;

-- Update indexes for new columns
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_primary_muscle ON exercises(primary_muscle);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment_standardized ON exercises(equipment_standardized);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty_level ON exercises(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_exercises_unilateral ON exercises(unilateral);

-- Update the search function to include new filters
CREATE OR REPLACE FUNCTION search_exercises(
  search_query TEXT DEFAULT '',
  muscle_filter TEXT DEFAULT NULL,
  type_filter TEXT DEFAULT NULL,
  category_filter TEXT DEFAULT NULL,
  equipment_filter TEXT DEFAULT NULL,
  difficulty_filter TEXT DEFAULT NULL,
  limit_count INT DEFAULT 20,
  offset_count INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  muscle_group VARCHAR,
  sub_muscle_group VARCHAR,
  equipment VARCHAR,
  type VARCHAR,
  category VARCHAR,
  primary_muscle VARCHAR,
  equipment_standardized VARCHAR,
  difficulty_level VARCHAR,
  rank NUMERIC
) LANGUAGE SQL STABLE AS $$
  SELECT
    e.id,
    e.name,
    e.muscle_group,
    e.sub_muscle_group,
    e.equipment,
    e.type,
    e.category,
    e.primary_muscle,
    e.equipment_standardized,
    e.difficulty_level,
    ts_rank(to_tsvector('persian', e.name || ' ' || COALESCE(e.description, '')),
            plainto_tsquery('persian', search_query)) AS rank
  FROM exercises e
  WHERE (search_query = '' OR to_tsvector('persian', e.name || ' ' || COALESCE(e.description, '')) @@ plainto_tsquery('persian', search_query))
    AND (muscle_filter IS NULL OR e.muscle_group = muscle_filter)
    AND (type_filter IS NULL OR e.type = type_filter)
    AND (category_filter IS NULL OR e.category = category_filter)
    AND (equipment_filter IS NULL OR e.equipment_standardized = equipment_filter)
    AND (difficulty_filter IS NULL OR e.difficulty_level = difficulty_filter)
  ORDER BY rank DESC, e.name ASC
  LIMIT limit_count
  OFFSET offset_count;
$$;

-- Grant permissions for new function
GRANT EXECUTE ON FUNCTION search_exercises TO anon, authenticated;








