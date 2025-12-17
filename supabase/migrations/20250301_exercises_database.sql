-- ===================================
-- Comprehensive Exercises Database
-- ===================================
-- تمام تمرینات - مکمل اور سازمان یافته
-- 200+ exercises across all categories

CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description TEXT,
  muscle_group VARCHAR(100) NOT NULL,
  sub_muscle_group VARCHAR(100),
  type VARCHAR(50) NOT NULL, -- 'resistance', 'cardio', 'stretching', 'mobility'
  equipment VARCHAR(100),
  difficulty VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
  mechanics VARCHAR(50), -- 'compound', 'isolation'
  duration_type VARCHAR(50), -- 'reps', 'time', 'distance'
  image_url TEXT,
  video_url TEXT,
  instructions TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_exercises_muscle_group ON exercises(muscle_group);
CREATE INDEX idx_exercises_sub_muscle_group ON exercises(sub_muscle_group);
CREATE INDEX idx_exercises_type ON exercises(type);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);

-- RLS Policies
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exercises_select_all" ON exercises FOR SELECT USING (true);
CREATE POLICY "exercises_insert_coach" ON exercises FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'coach'
  )
);
CREATE POLICY "exercises_update_coach" ON exercises FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'coach'
  )
);

-- ===============================
-- RESISTANCE EXERCISES (120+ items)
-- ===============================

-- CHEST (20 exercises)
INSERT INTO exercises (name, name_en, muscle_group, sub_muscle_group, type, equipment, difficulty, mechanics, duration_type, instructions) VALUES
('پرس سینه - بارابل', 'Barbell Bench Press', 'سینه', 'سینه میانی', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'پاهای خود را بر زمین قرار دهید، میله را تا سطح سینه پایین بیاورید و بلند کنید'),
('پرس سینه - دمبل', 'Dumbbell Bench Press', 'سینه', 'سینه میانی', 'resistance', 'dumbbell', 'intermediate', 'compound', 'reps', 'دمبل ها را به سمت جانب کاهش دهید تا سطح سینه'),
('پرس سینه شیب دار', 'Incline Bench Press', 'سینه', 'سینه بالایی', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'نیمکت را 30-45 درجه بالا کنید'),
('پرس سینه شیب منفی', 'Decline Bench Press', 'سینه', 'سینه پایینی', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'نیمکت را به عقب تمایل دهید'),
('پیچ سینه - دمبل', 'Dumbbell Flyes', 'سینه', 'سینه میانی', 'resistance', 'dumbbell', 'beginner', 'isolation', 'reps', 'بازوها را کمی خم کنید و دمبل ها را در کمان حرکت دهید'),
('پیچ سینه - ماشین', 'Pec Deck Flyes', 'سینه', 'سینه میانی', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'دسته ها را به سمت جلو بکشید'),
('پشتک سینه - باربل', 'Barbell Pullover', 'سینه', 'سینه میانی', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'روی نیمکت عرضی بنشینید و میله را روی سینه بالا و پایین کنید'),
('پشتک سینه - دمبل', 'Dumbbell Pullover', 'سینه', 'سینه میانی', 'resistance', 'dumbbell', 'beginner', 'isolation', 'reps', 'دمبل را بالای سینه نگه دارید و در کمان حرکت دهید'),
('دیپس - موازی', 'Parallel Bar Dips', 'سینه', 'سینه پایینی', 'resistance', 'barbell', 'advanced', 'compound', 'reps', 'بدن را پایین کنید تا بازوها 90 درجه باشند'),
('پرس سینه - کابل', 'Cable Chest Press', 'سینه', 'سینه میانی', 'resistance', 'cable', 'beginner', 'compound', 'reps', 'انتهای کابل را به سمت جلو فشار دهید'),
('پرس سینه - مشین اسمیت', 'Smith Machine Bench Press', 'سینه', 'سینه میانی', 'resistance', 'machine', 'beginner', 'compound', 'reps', 'میله را در ریل عمودی حرکت دهید'),
('پیچ کابل - متقاطع', 'Crossover Cable Flyes', 'سینه', 'سینه میانی', 'resistance', 'cable', 'intermediate', 'isolation', 'reps', 'کابل های متقاطع را درهم بیاورید'),
('پرس سینه - هفت', 'Machine Chest Press', 'سینه', 'سینه میانی', 'resistance', 'machine', 'beginner', 'compound', 'reps', 'به جلو فشار دهید'),
('دیپس - وسن', 'Weighted Dips', 'سینه', 'سینه پایینی', 'resistance', 'barbell', 'advanced', 'compound', 'reps', 'وزن اضافی شامل کنید'),
('پیچ - دمبل شیب دار', 'Incline Dumbbell Flyes', 'سینه', 'سینه بالایی', 'resistance', 'dumbbell', 'intermediate', 'isolation', 'reps', 'روی نیمکت شیب دار بنشینید'),
('پیچ - دمبل منفی', 'Decline Dumbbell Flyes', 'سینه', 'سینه پایینی', 'resistance', 'dumbbell', 'intermediate', 'isolation', 'reps', 'روی نیمکت منفی بنشینید'),
('پرس سینه - تنگ', 'Close Grip Bench Press', 'سینه', 'سینه میانی', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'دستان را نزدیک تر از عرض شانه ها قرار دهید'),
('پرس سینه - واید', 'Wide Grip Bench Press', 'سینه', 'سینه میانی', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'دستان را پهن تر از عرض شانه ها قرار دهید'),
('پرس سینه - اسمیت شیب', 'Smith Machine Incline Press', 'سینه', 'سینه بالایی', 'resistance', 'machine', 'beginner', 'compound', 'reps', 'ماشین را 45 درجه تنظیم کنید'),
('پیچ سینه - دمبل - تک دست', 'Single Arm Dumbbell Flyes', 'سینه', 'سینه میانی', 'resistance', 'dumbbell', 'intermediate', 'isolation', 'reps', 'هر طرف را جداگانه کار کنید');

-- BACK (20 exercises)
INSERT INTO exercises (name, name_en, muscle_group, sub_muscle_group, type, equipment, difficulty, mechanics, duration_type, instructions) VALUES
('کشش افقی - بارابل', 'Barbell Bent Over Row', 'پشت', 'پشت میانی', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', '45 درجه تمایل دهید و میله را تا سینه بکشید'),
('کشش افقی - دمبل', 'Dumbbell Bent Over Row', 'پشت', 'پشت میانی', 'resistance', 'dumbbell', 'intermediate', 'compound', 'reps', 'دمبل ها را به سمت سینه بکشید'),
('کشش بالا - تنگ', 'Close Grip Lat Pulldown', 'پشت', 'عریض پشت', 'resistance', 'cable', 'beginner', 'compound', 'reps', 'میله تنگ را پایین بکشید تا سینه'),
('کشش بالا - واید', 'Wide Grip Lat Pulldown', 'پشت', 'عریض پشت', 'resistance', 'cable', 'beginner', 'compound', 'reps', 'میله وایدرا پایین بکشید تا سینه'),
('کشش بالا - کمند', 'V-Grip Lat Pulldown', 'پشت', 'عریض پشت', 'resistance', 'cable', 'beginner', 'compound', 'reps', 'V-شکل کمند را بکشید'),
('ستاره کشی', 'Pull-ups', 'پشت', 'عریض پشت', 'resistance', 'barbell', 'advanced', 'compound', 'reps', 'خود را بالا بکشید تا چانه بالای میله باشد'),
('ستاره کشی - کمند', 'Pull-ups with Rope', 'پشت', 'عریض پشت', 'resistance', 'cable', 'advanced', 'compound', 'reps', 'کمند را بکشید'),
('سینه کشی', 'Chest Supported T-Bar Row', 'پشت', 'پشت میانی', 'resistance', 'barbell', 'advanced', 'compound', 'reps', 'سینه از نیمکت پشتیبانی دریافت می کند'),
('کشش جانبی - تک دست', 'Single Arm Lat Pulldown', 'پشت', 'عریض پشت', 'resistance', 'cable', 'intermediate', 'isolation', 'reps', 'هر طرف را جداگانه کار کنید'),
('کشش - دستگاه', 'Machine Row', 'پشت', 'پشت میانی', 'resistance', 'machine', 'beginner', 'compound', 'reps', 'نیروی خود را فشار دهید'),
('ستاره کشی معکوس', 'Reverse Pull-ups', 'پشت', 'عریض پشت', 'resistance', 'barbell', 'beginner', 'compound', 'reps', 'دستان را سطح تحتانی نگه دارید'),
('کشش - کابل صاف', 'Straight Arm Lat Pulldown', 'پشت', 'عریض پشت', 'resistance', 'cable', 'intermediate', 'isolation', 'reps', 'بازوها را مستقیم نگه دارید'),
('کشش سنتی', 'Seal Row', 'پشت', 'پشت میانی', 'resistance', 'barbell', 'advanced', 'compound', 'reps', 'روی نیمکت بنشینید و میله را بکشید'),
('کشش جانبی', 'Assisted Lat Pulldown', 'پشت', 'عریض پشت', 'resistance', 'machine', 'beginner', 'compound', 'reps', 'دستگاه کمک می کند'),
('کشش - دستگاه اسمیت', 'Smith Machine Row', 'پشت', 'پشت میانی', 'resistance', 'machine', 'beginner', 'compound', 'reps', 'میله در ریل ثابت است'),
('کشش - بند الاستیک', 'Banded Pull-ups', 'پشت', 'عریض پشت', 'resistance', 'barbell', 'beginner', 'compound', 'reps', 'بند الاستیک کمک می کند'),
('کشش افقی - تک دست', 'Single Arm Row', 'پشت', 'پشت میانی', 'resistance', 'dumbbell', 'intermediate', 'compound', 'reps', 'هر طرف را جداگانه کار کنید'),
('کشش - ردو', 'Renegade Row', 'پشت', 'پشت میانی', 'resistance', 'dumbbell', 'advanced', 'compound', 'reps', 'از موضع پلانک شروع کنید'),
('پشتک - بارابل', 'Barbell Pullover', 'پشت', 'پشت میانی', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'میله را روی سینه بالا و پایین کنید'),
('کشش - دستگاه جزئی', 'Partial Lat Pulldown', 'پشت', 'عریض پشت', 'resistance', 'cable', 'beginner', 'isolation', 'reps', 'فقط نیمی از حدود حرکت');

-- SHOULDERS (15 exercises)
INSERT INTO exercises (name, name_en, muscle_group, sub_muscle_group, type, equipment, difficulty, mechanics, duration_type, instructions) VALUES
('فشار سر - بارابل', 'Barbell Overhead Press', 'شانه', 'شانه جلویی', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'میله را بالای سر فشار دهید'),
('فشار سر - دمبل', 'Dumbbell Shoulder Press', 'شانه', 'شانه جلویی', 'resistance', 'dumbbell', 'intermediate', 'compound', 'reps', 'دمبل ها را بالای سر فشار دهید'),
('فشار - مشین', 'Machine Shoulder Press', 'شانه', 'شانه جلویی', 'resistance', 'machine', 'beginner', 'compound', 'reps', 'به جلو و بالا فشار دهید'),
('بالا کشی جانبی', 'Lateral Raise', 'شانه', 'شانه جانبی', 'resistance', 'dumbbell', 'beginner', 'isolation', 'reps', 'دمبل ها را تا سطح شانه بالا بیاورید'),
('بالا کشی جانبی - کابل', 'Cable Lateral Raise', 'شانه', 'شانه جانبی', 'resistance', 'cable', 'beginner', 'isolation', 'reps', 'کابل را به طرف بالا بکشید'),
('بالا کشی جلویی', 'Front Raise', 'شانه', 'شانه جلویی', 'resistance', 'dumbbell', 'beginner', 'isolation', 'reps', 'دمبل ها را جلو و بالا بیاورید'),
('بالا کشی جلویی - ماشین', 'Machine Front Raise', 'شانه', 'شانه جلویی', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'دسته ها را بالا بیاورید'),
('بالا کشی عقب', 'Rear Delt Flyes', 'شانه', 'شانه عقب', 'resistance', 'dumbbell', 'intermediate', 'isolation', 'reps', 'دمبل ها را عقب و بالا بیاورید'),
('بالا کشی عقب - کابل', 'Cable Rear Delt Flyes', 'شانه', 'شانه عقب', 'resistance', 'cable', 'intermediate', 'isolation', 'reps', 'کابل ها را درهم بیاورید'),
('فشار آرنولد', 'Arnold Press', 'شانه', 'شانه جلویی', 'resistance', 'dumbbell', 'advanced', 'compound', 'reps', 'دمبل ها را به درون بچرخانید'),
('قسمت بالا کشی', 'Upright Row', 'شانه', 'شانه جانبی', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'میله را تا سطح سینه بالا بیاورید'),
('قسمت بالا کشی - دمبل', 'Dumbbell Upright Row', 'شانه', 'شانه جانبی', 'resistance', 'dumbbell', 'intermediate', 'compound', 'reps', 'دمبل ها را جانبی بالا بیاورید'),
('فشار - بند', 'Banded Overhead Press', 'شانه', 'شانه جلویی', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'بند الاستیک مقاومت کم می کند'),
('بالا کشی یک دست', 'Single Arm Dumbbell Raise', 'شانه', 'شانه جانبی', 'resistance', 'dumbbell', 'intermediate', 'isolation', 'reps', 'هر طرف را جداگانه کار کنید'),
('فشار - زیر فک', 'Underhand Shoulder Press', 'شانه', 'شانه جلویی', 'resistance', 'dumbbell', 'intermediate', 'compound', 'reps', 'دستان را به سمت داخل');

-- BICEPS (12 exercises)
INSERT INTO exercises (name, name_en, muscle_group, sub_muscle_group, type, equipment, difficulty, mechanics, duration_type, instructions) VALUES
('خم - بارابل', 'Barbell Curl', 'بازو', 'دوسر بازو', 'resistance', 'barbell', 'beginner', 'isolation', 'reps', 'میله را تا سطح سینه بالا بیاورید'),
('خم - دمبل', 'Dumbbell Curl', 'بازو', 'دوسر بازو', 'resistance', 'dumbbell', 'beginner', 'isolation', 'reps', 'دمبل ها را تا سطح سینه بالا بیاورید'),
('خم - کابل', 'Cable Curl', 'بازو', 'دوسر بازو', 'resistance', 'cable', 'beginner', 'isolation', 'reps', 'کابل را بالا بیاورید'),
('خم - غلط', 'Hammer Curl', 'بازو', 'دوسر بازو', 'resistance', 'dumbbell', 'beginner', 'isolation', 'reps', 'دمبل ها را در موضع چکش بالا بیاورید'),
('خم - تمرکز', 'Concentration Curl', 'بازو', 'دوسر بازو', 'resistance', 'dumbbell', 'intermediate', 'isolation', 'reps', 'دمبل را درون ران تکیه دهید'),
('خم - نشسته', 'Seated Bicep Curl', 'بازو', 'دوسر بازو', 'resistance', 'dumbbell', 'beginner', 'isolation', 'reps', 'نشسته دمبل ها را بالا بیاورید'),
('خم - دستگاه', 'Machine Curl', 'بازو', 'دوسر بازو', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'دستگاه کمک می کند'),
('خم - موج', 'EZ Bar Curl', 'بازو', 'دوسر بازو', 'resistance', 'barbell', 'beginner', 'isolation', 'reps', 'میله موج دار تنش کم می کند'),
('خم - مشین اسمیت', 'Smith Machine Curl', 'بازو', 'دوسر بازو', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'میله در ریل ثابت است'),
('خم - باند', 'Banded Curl', 'بازو', 'دوسر بازو', 'resistance', 'barbell', 'beginner', 'isolation', 'reps', 'بند الاستیک مقاومت افزایش می دهد'),
('خم - کابل تک دست', 'Single Arm Cable Curl', 'بازو', 'دوسر بازو', 'resistance', 'cable', 'intermediate', 'isolation', 'reps', 'هر طرف را جداگانه کار کنید'),
('خم - دمبل متناوب', 'Alternating Dumbbell Curl', 'بازو', 'دوسر بازو', 'resistance', 'dumbbell', 'beginner', 'isolation', 'reps', 'دمبل ها را متناوب بالا بیاورید');

-- TRICEPS (12 exercises)
INSERT INTO exercises (name, name_en, muscle_group, sub_muscle_group, type, equipment, difficulty, mechanics, duration_type, instructions) VALUES
('ترک - تنگ', 'Close Grip Bench Press', 'بازو', 'سه سر بازو', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'دستان را نزدیک تر قرار دهید'),
('ترک - دیپس', 'Tricep Dips', 'بازو', 'سه سر بازو', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'بدن را پایین کنید'),
('ترک - فشار پایین', 'Tricep Pushdown', 'بازو', 'سه سر بازو', 'resistance', 'cable', 'beginner', 'isolation', 'reps', 'میله را پایین فشار دهید'),
('ترک - افزایش سر', 'Overhead Tricep Extension', 'بازو', 'سه سر بازو', 'resistance', 'dumbbell', 'intermediate', 'isolation', 'reps', 'دمبل را بالای سر نگه دارید'),
('ترک - فرانسوی', 'French Press', 'بازو', 'سه سر بازو', 'resistance', 'barbell', 'intermediate', 'isolation', 'reps', 'میله را تا پشت سر پایین بیاورید'),
('ترک - کابل بالا', 'Overhead Cable Extension', 'بازو', 'سه سر بازو', 'resistance', 'cable', 'intermediate', 'isolation', 'reps', 'کابل را بالا بیاورید'),
('ترک - دمبل یک دست', 'Single Arm Overhead Extension', 'بازو', 'سه سر بازو', 'resistance', 'dumbbell', 'beginner', 'isolation', 'reps', 'دمبل را بالای سر نگه دارید'),
('ترک - کاکری', 'Kickback', 'بازو', 'سه سر بازو', 'resistance', 'dumbbell', 'beginner', 'isolation', 'reps', 'دمبل را عقب فشار دهید'),
('ترک - دستگاه', 'Machine Tricep Press', 'بازو', 'سه سر بازو', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'به عقب فشار دهید'),
('ترک - کابل V', 'V-Grip Tricep Pushdown', 'بازو', 'سه سر بازو', 'resistance', 'cable', 'beginner', 'isolation', 'reps', 'V شکل را فشار دهید'),
('ترک - بند', 'Banded Tricep Extension', 'بازو', 'سه سر بازو', 'resistance', 'barbell', 'beginner', 'isolation', 'reps', 'بند الاستیک بیش می کند'),
('ترک - رسه قسمتی', 'Rope Tricep Pushdown', 'بازو', 'سه سر بازو', 'resistance', 'cable', 'beginner', 'isolation', 'reps', 'کمند را به طرفین باز کنید');

-- LEGS (30 exercises)
INSERT INTO exercises (name, name_en, muscle_group, sub_muscle_group, type, equipment, difficulty, mechanics, duration_type, instructions) VALUES
('اسکوات - بارابل', 'Barbell Back Squat', 'پا', 'ران جلویی', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'صندلی را بنشینید تا ران موازی زمین'),
('اسکوات - جلو', 'Front Squat', 'پا', 'ران جلویی', 'resistance', 'barbell', 'advanced', 'compound', 'reps', 'میله را جلوی شانه ها نگه دارید'),
('اسکوات - دمبل', 'Dumbbell Goblet Squat', 'پا', 'ران جلویی', 'resistance', 'dumbbell', 'beginner', 'compound', 'reps', 'دمبل را جلوی سینه نگه دارید'),
('اسکوات - دستگاه', 'Leg Press', 'پا', 'ران جلویی', 'resistance', 'machine', 'beginner', 'compound', 'reps', 'سکو را فشار دهید'),
('اسکوات - اسمیت', 'Smith Machine Squat', 'پا', 'ران جلویی', 'resistance', 'machine', 'beginner', 'compound', 'reps', 'میله در ریل ثابت است'),
('سقوط اسکوات', 'Drop Set Squat', 'پا', 'ران جلویی', 'resistance', 'barbell', 'advanced', 'compound', 'reps', 'وزن را کاهش دهید'),
('پویش پا', 'Leg Extension', 'پا', 'ران جلویی', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'پاها را صاف کنید'),
('خم پا', 'Leg Curl', 'پا', 'ران عقبی', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'پاها را خم کنید'),
('فشار - موازی', 'Hack Squat', 'پا', 'ران جلویی', 'resistance', 'machine', 'intermediate', 'compound', 'reps', 'ماشین خاص هک'),
('اسکوات - بالا تر پا', 'Bulgarian Split Squat', 'پا', 'ران جلویی', 'resistance', 'dumbbell', 'advanced', 'compound', 'reps', 'یک پا را بالا نگه دارید'),
('گام - دمبل', 'Dumbbell Lunge', 'پا', 'ران جلویی', 'resistance', 'dumbbell', 'beginner', 'compound', 'reps', 'قدم بردارید'),
('گام - بارابل', 'Barbell Lunge', 'پا', 'ران جلویی', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'میله را روی شانه ها قرار دهید'),
('گام - معکوس', 'Reverse Lunge', 'پا', 'ران جلویی', 'resistance', 'dumbbell', 'beginner', 'compound', 'reps', 'عقب قدم بردارید'),
('گام - جانبی', 'Lateral Lunge', 'پا', 'ران جلویی', 'resistance', 'dumbbell', 'intermediate', 'compound', 'reps', 'کنار قدم بردارید'),
('فشاری - سه سر ران', 'Quad Dominant Leg Press', 'پا', 'ران جلویی', 'resistance', 'machine', 'intermediate', 'compound', 'reps', 'پاها را بالا قرار دهید'),
('فشاری - ران عقبی', 'Hamstring Dominant Leg Press', 'پا', 'ران عقبی', 'resistance', 'machine', 'intermediate', 'compound', 'reps', 'پاها را پایین قرار دهید'),
('گل مهراد - دمبل', 'Bulgarian Split Squat with Dumbbell', 'پا', 'ران جلویی', 'resistance', 'dumbbell', 'intermediate', 'compound', 'reps', 'دمبل و پا بالا'),
('خم - دستگاه', 'Lying Leg Curl', 'پا', 'ران عقبی', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'دراز بخوابید'),
('خم - ایستاده', 'Standing Leg Curl', 'پا', 'ران عقبی', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'ایستاده بمانید'),
('خم - تک پا', 'Single Leg Curl', 'پا', 'ران عقبی', 'resistance', 'machine', 'intermediate', 'isolation', 'reps', 'هر پا را جداگانه'),
('رفع - پنجه', 'Calf Raise', 'پا', 'ساق', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'پنجه ها را بالا بیاورید'),
('رفع - پنجه نشسته', 'Seated Calf Raise', 'پا', 'ساق', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'نشسته بالا بیاورید'),
('رفع - پنجه دمبل', 'Dumbbell Calf Raise', 'پا', 'ساق', 'resistance', 'dumbbell', 'beginner', 'isolation', 'reps', 'دمبل را نگه دارید'),
('لات - دستگاه', 'Leg Abduction', 'پا', 'ران جانبی', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'پاها را باز کنید'),
('لات - جمع', 'Leg Adduction', 'پا', 'ران داخلی', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'پاها را جمع کنید'),
('گام - تله', 'Bulgarian Split Squat on Decline', 'پا', 'ران جلویی', 'resistance', 'barbell', 'advanced', 'compound', 'reps', 'شیب منفی'),
('اسکوات - تک پا', 'Pistol Squat', 'پا', 'ران جلویی', 'resistance', 'bodyweight', 'advanced', 'compound', 'reps', 'یک پا بر روی زمین'),
('خم - نشسته', 'Seated Leg Curl', 'پا', 'ران عقبی', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'نشسته خم کنید'),
('دید - خارج', 'Leg Press - Outer Quads', 'پا', 'ران جلویی', 'resistance', 'machine', 'intermediate', 'compound', 'reps', 'پاهای پهن'),
('اسکوات - V', 'V-Squat', 'پا', 'ران جلویی', 'resistance', 'machine', 'intermediate', 'compound', 'reps', 'ماشین V شکل');

-- CORE (15 exercises)
INSERT INTO exercises (name, name_en, muscle_group, sub_muscle_group, type, equipment, difficulty, mechanics, duration_type, instructions) VALUES
('کرانچ', 'Crunch', 'هسته', 'شکم', 'resistance', 'bodyweight', 'beginner', 'isolation', 'reps', 'شکم را خم کنید'),
('کرانچ - دستگاه', 'Machine Crunch', 'هسته', 'شکم', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'دستگاه را بالا بکشید'),
('کرانچ - دمبل', 'Weighted Crunch', 'هسته', 'شکم', 'resistance', 'dumbbell', 'beginner', 'isolation', 'reps', 'وزن روی سینه'),
('پلانک', 'Plank', 'هسته', 'هسته', 'resistance', 'bodyweight', 'beginner', 'isometric', 'time', 'موضع صاف نگه دارید'),
('پلانک - جانبی', 'Side Plank', 'هسته', 'هسته جانبی', 'resistance', 'bodyweight', 'beginner', 'isometric', 'time', 'یک طرف نگه دارید'),
('بالا و پایین - کابل', 'Cable Wood Chop', 'هسته', 'هسته', 'resistance', 'cable', 'intermediate', 'compound', 'reps', 'کابل را بچرخانید'),
('بالا و پایین - دمبل', 'Dumbbell Wood Chop', 'هسته', 'هسته', 'resistance', 'dumbbell', 'intermediate', 'compound', 'reps', 'دمبل را بچرخانید'),
('اب آپ', 'Ab Wheel Rollout', 'هسته', 'شکم', 'resistance', 'barbell', 'advanced', 'compound', 'reps', 'چرخ را جلو رول کنید'),
('پا بالا - دستگاه', 'Leg Raise Machine', 'هسته', 'شکم پایین', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'پاها را بالا بیاورید'),
('پا بالا - دیوار', 'Hanging Leg Raise', 'هسته', 'شکم پایین', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'از میله آویز باشید'),
('پیچ - دستگاه', 'Machine Rotation', 'هسته', 'هسته جانبی', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'دستگاه را بچرخانید'),
('پیچ - کابل', 'Cable Rotation', 'هسته', 'هسته جانبی', 'resistance', 'cable', 'intermediate', 'isolation', 'reps', 'کابل را بچرخانید'),
('تاب - نشسته', 'Seated Ab Crunch', 'هسته', 'شکم', 'resistance', 'machine', 'beginner', 'isolation', 'reps', 'نشسته خم کنید'),
('کیپ - دمبل', 'Landmine Rotation', 'هسته', 'هسته جانبی', 'resistance', 'barbell', 'intermediate', 'compound', 'reps', 'میله را بچرخانید'),
('پالوف - پریس', 'Pallof Press', 'هسته', 'هسته', 'resistance', 'cable', 'intermediate', 'compound', 'reps', 'مقاومت را فشار دهید');

-- ================================
-- CARDIO EXERCISES (20+ items)
-- ================================

INSERT INTO exercises (name, name_en, muscle_group, sub_muscle_group, type, equipment, difficulty, mechanics, duration_type, instructions) VALUES
('تردمیل', 'Treadmill Running', 'کل بدن', 'قلبی', 'cardio', 'treadmill', 'beginner', 'aerobic', 'time', 'روی تردمیل بدوید'),
('تردمیل - قدم زنی', 'Treadmill Walking', 'کل بدن', 'قلبی', 'cardio', 'treadmill', 'beginner', 'aerobic', 'time', 'روی تردمیل قدم بزنید'),
('دوچرخه ثابت', 'Stationary Bike', 'کل بدن', 'قلبی', 'cardio', 'bike', 'beginner', 'aerobic', 'time', 'روی دوچرخه بنشینید'),
('دوچرخه ثابت - HIIT', 'Spinning - HIIT', 'کل بدن', 'قلبی', 'cardio', 'bike', 'advanced', 'anaerobic', 'time', 'تناوبی سریع و آهسته'),
('شنا', 'Swimming', 'کل بدن', 'قلبی', 'cardio', 'pool', 'intermediate', 'aerobic', 'time', 'شنا کنید'),
('شنا - کرال', 'Front Crawl Swimming', 'کل بدن', 'قلبی', 'cardio', 'pool', 'intermediate', 'aerobic', 'time', 'کرال کنید'),
('پدل - ثابت', 'Elliptical', 'کل بدن', 'قلبی', 'cardio', 'machine', 'beginner', 'aerobic', 'time', 'روی مشین بدوید'),
('قایقرانی - دستگاه', 'Rowing Machine', 'کل بدن', 'قلبی', 'resistance', 'machine', 'intermediate', 'compound', 'time', 'عضلات را بکشید'),
('پرش - طناب', 'Jump Rope', 'کل بدن', 'قلبی', 'cardio', 'rope', 'intermediate', 'plyometric', 'time', 'با طناب بپرید'),
('کاهو - تپه', 'Hill Running', 'کل بدن', 'قلبی', 'cardio', 'bodyweight', 'advanced', 'aerobic', 'time', 'تپه را بدوید'),
('چرخ - بیرونی', 'Outdoor Cycling', 'کل بدن', 'قلبی', 'cardio', 'bicycle', 'intermediate', 'aerobic', 'distance', 'دوچرخه سواری کنید'),
('دویدن - جا', 'Jumping Jacks', 'کل بدن', 'قلبی', 'cardio', 'bodyweight', 'beginner', 'aerobic', 'reps', 'بپرید و دستان را بالا کنید'),
('کاهش - وزن', 'Battle Ropes', 'کل بدن', 'قلبی', 'cardio', 'rope', 'advanced', 'anaerobic', 'time', 'طناب ها را تکان دهید'),
('درو - شی', 'Assault Bike', 'کل بدن', 'قلبی', 'cardio', 'machine', 'advanced', 'anaerobic', 'time', 'دوچرخه حمله را سواری کنید'),
('شروع - بدو', 'Sprint', 'کل بدن', 'قلبی', 'cardio', 'bodyweight', 'advanced', 'anaerobic', 'distance', 'سریع بدوید'),
('ورزش - ریتمی', 'Stair Climbing', 'کل بدن', 'قلبی', 'cardio', 'machine', 'intermediate', 'aerobic', 'time', 'پله‌ها را بالا برود');

-- ================================
-- STRETCHING & MOBILITY (15+ items)
-- ================================

INSERT INTO exercises (name, name_en, muscle_group, sub_muscle_group, type, equipment, difficulty, mechanics, duration_type, instructions) VALUES
('کشش - شانه', 'Shoulder Stretch', 'شانه', 'شانه', 'stretching', 'bodyweight', 'beginner', 'static', 'time', 'شانه را کشش دهید'),
('کشش - سینه', 'Chest Stretch', 'سینه', 'سینه', 'stretching', 'bodyweight', 'beginner', 'static', 'time', 'سینه را کشش دهید'),
('کشش - پشت', 'Back Stretch', 'پشت', 'پشت', 'stretching', 'bodyweight', 'beginner', 'static', 'time', 'پشت را کشش دهید'),
('کشش - ران', 'Hamstring Stretch', 'پا', 'ران عقبی', 'stretching', 'bodyweight', 'beginner', 'static', 'time', 'ران را کشش دهید'),
('کشش - بازو', 'Tricep Stretch', 'بازو', 'سه سر بازو', 'stretching', 'bodyweight', 'beginner', 'static', 'time', 'سه سر بازو را کشش دهید'),
('کشش - ساق', 'Calf Stretch', 'پا', 'ساق', 'stretching', 'bodyweight', 'beginner', 'static', 'time', 'ساق را کشش دهید'),
('کشش - شکم', 'Abdominal Stretch', 'هسته', 'شکم', 'stretching', 'bodyweight', 'beginner', 'static', 'time', 'شکم را کشش دهید'),
('کشش - یوگا', 'Downward Dog', 'کل بدن', 'کل بدن', 'stretching', 'bodyweight', 'beginner', 'static', 'time', 'یوگا پوز'),
('کشش - 90 درجه', 'Pigeon Pose', 'پا', 'ران', 'stretching', 'bodyweight', 'intermediate', 'static', 'time', '90 درجه بنشینید'),
('کشش - فلکسی', 'Deep Hip Flexor Stretch', 'پا', 'هیپ', 'stretching', 'bodyweight', 'intermediate', 'static', 'time', 'هیپ را کشش دهید'),
('کشش - زیر فک', 'Chin Tuck Stretch', 'گردن', 'گردن', 'stretching', 'bodyweight', 'beginner', 'static', 'time', 'چانه را کشش دهید'),
('کشش - پیچی', 'Spinal Twist Stretch', 'پشت', 'ستون فقرات', 'stretching', 'bodyweight', 'beginner', 'static', 'time', 'ستون فقرات را بچرخانید'),
('کشش - دیوار', 'Wall Chest Stretch', 'سینه', 'سینه', 'stretching', 'bodyweight', 'beginner', 'static', 'time', 'دیوار استفاده کنید'),
('کشش - چند', 'Full Body Stretch', 'کل بدن', 'کل بدن', 'stretching', 'bodyweight', 'beginner', 'static', 'time', 'کل بدن را کشش دهید'),
('کشش - شاسیو', 'Glute Stretch', 'پا', 'باسن', 'stretching', 'bodyweight', 'beginner', 'static', 'time', 'باسن را کشش دهید');

-- ================================
-- WARMUP EXERCISES (10 items)
-- ================================

INSERT INTO exercises (name, name_en, muscle_group, sub_muscle_group, type, equipment, difficulty, mechanics, duration_type, instructions) VALUES
('گردش - شانه', 'Arm Circles', 'کل بدن', 'شانه', 'warmup', 'bodyweight', 'beginner', 'dynamic', 'reps', 'دستان را در دایره حرکت دهید'),
('گردش - رانه', 'Leg Circles', 'پا', 'هیپ', 'warmup', 'bodyweight', 'beginner', 'dynamic', 'reps', 'پاها را در دایره حرکت دهید'),
('ورم - بازو', 'Arm Swings', 'کل بدن', 'شانه', 'warmup', 'bodyweight', 'beginner', 'dynamic', 'reps', 'دستان را تاب دهید'),
('ورم - سر', 'Head Rolls', 'گردن', 'گردن', 'warmup', 'bodyweight', 'beginner', 'dynamic', 'reps', 'سر را بچرخانید'),
('ورم - بدن', 'Torso Twists', 'کل بدن', 'کل بدن', 'warmup', 'bodyweight', 'beginner', 'dynamic', 'reps', 'بدن را بچرخانید'),
('ورم - پا', 'Walking Lunges', 'پا', 'ران', 'warmup', 'bodyweight', 'beginner', 'dynamic', 'reps', 'قدم بردارید'),
('ورم - تپه', 'High Knees', 'کل بدن', 'قلبی', 'warmup', 'bodyweight', 'beginner', 'dynamic', 'reps', 'زانوها را بالا بیاورید'),
('ورم - باتپه', 'Butt Kicks', 'کل بدن', 'قلبی', 'warmup', 'bodyweight', 'beginner', 'dynamic', 'reps', 'پاشنه را باسن لمس کند'),
('ورم - بدن', 'Inchworms', 'کل بدن', 'کل بدن', 'warmup', 'bodyweight', 'intermediate', 'dynamic', 'reps', 'مثل کنه حرکت کنید'),
('ورم - شانه', 'Shoulder Dislocates', 'شانه', 'شانه', 'warmup', 'stick', 'beginner', 'dynamic', 'reps', 'شانه را تابلو بدهید');

-- ================================
-- COOLDOWN & RECOVERY (10 items)
-- ================================

INSERT INTO exercises (name, name_en, muscle_group, sub_muscle_group, type, equipment, difficulty, mechanics, duration_type, instructions) VALUES
('خنک - راه رفتن', 'Walking Cool Down', 'کل بدن', 'قلبی', 'cooldown', 'bodyweight', 'beginner', 'aerobic', 'time', 'آهسته قدم بزنید'),
('خنک - دوچرخه', 'Easy Cycling', 'کل بدن', 'قلبی', 'cooldown', 'bike', 'beginner', 'aerobic', 'time', 'آهسته سواری کنید'),
('خنک - تنفس', 'Deep Breathing', 'کل بدن', 'کل بدن', 'cooldown', 'bodyweight', 'beginner', 'static', 'time', 'عمیق تنفس کنید'),
('خنک - یوگا', 'Yoga Relaxation', 'کل بدن', 'کل بدن', 'cooldown', 'bodyweight', 'beginner', 'static', 'time', 'یوگا استراحت'),
('خنک - معادله', 'Foam Rolling', 'کل بدن', 'کل بدن', 'cooldown', 'roller', 'beginner', 'static', 'time', 'غلطک تحت فشار'),
('خنک - تاب', 'Light Stretching', 'کل بدن', 'کل بدن', 'cooldown', 'bodyweight', 'beginner', 'static', 'time', 'کشش سبک'),
('خنک - مدیتیشن', 'Meditation', 'کل بدن', 'کل بدن', 'cooldown', 'bodyweight', 'beginner', 'static', 'time', 'تمرکز کنید'),
('خنک - ماسیج', 'Self Massage', 'کل بدن', 'کل بدن', 'cooldown', 'bodyweight', 'beginner', 'static', 'time', 'خود ماساژ کنید'),
('خنک - قسمت', 'Static Stretching', 'کل بدن', 'کل بدن', 'cooldown', 'bodyweight', 'beginner', 'static', 'time', 'کشش ثابت'),
('خنک - شمار', 'Breathing Exercises', 'کل بدن', 'کل بدن', 'cooldown', 'bodyweight', 'beginner', 'static', 'time', 'تمرینات تنفسی');
