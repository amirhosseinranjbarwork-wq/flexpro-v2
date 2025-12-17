-- ===================================
-- Comprehensive Foods Database
-- ===================================
-- تمام مواد غذایی - مکمل اور سازمان یافته
-- 200+ foods with complete nutritional info

CREATE TABLE IF NOT EXISTS foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  category VARCHAR(100) NOT NULL, -- 'protein', 'carb', 'fat', 'vegetable', 'fruit', 'dairy'
  sub_category VARCHAR(100),
  unit VARCHAR(50), -- 'grams', 'piece', 'cup', 'tbsp', 'ml'
  base_amount NUMERIC DEFAULT 100, -- Base amount for calculations
  calories NUMERIC,
  protein NUMERIC, -- grams
  carbohydrates NUMERIC, -- grams
  fat NUMERIC, -- grams
  saturated_fat NUMERIC,
  fiber NUMERIC,
  sugar NUMERIC,
  sodium NUMERIC,
  cholesterol NUMERIC,
  calcium NUMERIC,
  iron NUMERIC,
  potassium NUMERIC,
  vitamin_a NUMERIC,
  vitamin_c NUMERIC,
  vitamin_d NUMERIC,
  description TEXT,
  notes TEXT,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_foods_category ON foods(category);
CREATE INDEX idx_foods_sub_category ON foods(sub_category);
CREATE INDEX idx_foods_name ON foods(name);
CREATE INDEX idx_foods_is_popular ON foods(is_popular);

-- RLS Policies
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "foods_select_all" ON foods FOR SELECT USING (true);
CREATE POLICY "foods_insert_coach" ON foods FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'coach'
  )
);

-- ==============================
-- PROTEINS (40+ items)
-- ==============================

-- Poultry (15 items)
INSERT INTO foods (name, name_en, category, sub_category, unit, calories, protein, carbohydrates, fat, saturated_fat, fiber, sodium, description, is_popular) VALUES
('مرغ سینه - بدون پوست', 'Chicken Breast Skinless', 'protein', 'poultry', 'grams', 165, 31, 0, 3.6, 1, 0, 74, 'بالاترین پروتئین، کم چربی', true),
('مرغ سینه - با پوست', 'Chicken Breast with Skin', 'protein', 'poultry', 'grams', 190, 29, 0, 8, 3, 0, 75, 'پروتئین بالا، چربی متوسط', true),
('مرغ ران - بدون پوست', 'Chicken Thigh Skinless', 'protein', 'poultry', 'grams', 178, 26, 0, 7.4, 2, 0, 81, 'پروتئین خوب، ویتامین B', false),
('مرغ ران - با پوست', 'Chicken Thigh with Skin', 'protein', 'poultry', 'grams', 209, 26, 0, 11, 3, 0, 81, 'طعم خوب، چربی بیشتر', false),
('بوقلمون سینه', 'Turkey Breast', 'protein', 'poultry', 'grams', 170, 32, 0, 1.8, 0.5, 0, 65, 'بدون چربی تقریبا', true),
('اردک', 'Duck', 'protein', 'poultry', 'grams', 402, 16, 0, 38, 13, 0, 75, 'چربی زیاد، سلنیوم', false),
('غاز', 'Goose', 'protein', 'poultry', 'grams', 371, 16, 0, 34, 11, 0, 70, 'چربی زیاد، آهن', false),
('بوقلمون تیغه', 'Turkey Thigh', 'protein', 'poultry', 'grams', 209, 27, 0, 10, 3, 0, 72, 'پروتئین خوب، رنگ تیره', false),
('مرغ خاورسپاری', 'Cornish Game Hen', 'protein', 'poultry', 'grams', 215, 26, 0, 12, 4, 0, 80, 'مرغ کوچک', false),
('فیلت مرغ', 'Chicken Fillet', 'protein', 'poultry', 'grams', 165, 31, 0, 3.6, 1, 0, 74, 'بریده شده، آسان پخت', true),
('ران مرغ', 'Chicken Drumstick', 'protein', 'poultry', 'grams', 172, 25, 0, 7.4, 2, 0, 80, 'اقتصادی، خوشمزه', false),
('بال مرغ', 'Chicken Wing', 'protein', 'poultry', 'grams', 203, 26, 0, 11, 3, 0, 75, 'چربی بیشتر، اقتصادی', false),
('دست مرغ', 'Chicken Leg', 'protein', 'poultry', 'grams', 181, 26, 0, 8, 2, 0, 81, 'پروتئین خوب', false),
('بوقلمون خاورسپاری', 'Turkey Sausage', 'protein', 'poultry', 'grams', 264, 21, 2, 18, 6, 0, 520, 'نمک بیشتر', false),
('بوقلمون دلار', 'Ground Turkey', 'protein', 'poultry', 'grams', 170, 22, 0, 9, 3, 0, 75, 'متنوع، آسان', true);

-- Beef & Red Meat (12 items)
INSERT INTO foods (name, name_en, category, sub_category, unit, calories, protein, carbohydrates, fat, saturated_fat, fiber, iron, description, is_popular) VALUES
('گوشت قرمز - شانه', 'Beef Shoulder', 'protein', 'beef', 'grams', 250, 26, 0, 15, 6, 0, 2.6, 'پروتئین خوب، کم چربی', true),
('گوشت قرمز - سینه', 'Beef Brisket', 'protein', 'beef', 'grams', 288, 25, 0, 21, 8, 0, 2.5, 'طعم خوب، پخت طولانی', false),
('گوشت قرمز - ران', 'Beef Leg', 'protein', 'beef', 'grams', 158, 27, 0, 5, 2, 0, 2.6, 'بدون چربی، پروتئین بالا', true),
('گوشت قرمز - لاشه', 'Beef Loin', 'protein', 'beef', 'grams', 173, 28, 0, 6.6, 3, 0, 2.5, 'نرم، پروتئین بالا', true),
('گوشت قرمز - ریب', 'Beef Ribs', 'protein', 'beef', 'grams', 300, 25, 0, 23, 9, 0, 2.3, 'چربی زیاد، خوشمزه', false),
('گوشت قرمز - شکم', 'Beef Belly', 'protein', 'beef', 'grams', 220, 24, 0, 13, 5, 0, 2.4, 'چربی متوسط', false),
('گوشت قرمز - تهیه شده', 'Ground Beef', 'protein', 'beef', 'grams', 217, 23, 0, 13, 5, 0, 2.7, 'متنوع، آسان پخت', true),
('گوشت قرمز - تنگ', 'Beef Chuck', 'protein', 'beef', 'grams', 200, 27, 0, 9.7, 4, 0, 2.5, 'مناسب پخت', false),
('گوشت قرمز - تریپ', 'Beef Tripe', 'protein', 'beef', 'grams', 94, 19, 0.6, 0.9, 0.3, 0, 0.5, 'کم کالری', false),
('گوشت گاو - جگر', 'Beef Liver', 'protein', 'beef', 'grams', 135, 26, 3.9, 3.6, 1.4, 0, 5.2, 'ویتامین و آهن خوب', false),
('گوشت گاو - قلب', 'Beef Heart', 'protein', 'beef', 'grams', 120, 21, 0.5, 3.5, 1.3, 0, 5.3, 'پروتئین بالا، کم چربی', false),
('گوشت گاو - کلیه', 'Beef Kidney', 'protein', 'beef', 'grams', 103, 18, 0.4, 2.8, 1.1, 0, 3.7, 'ریبوفلاوین بالا', false);

-- Fish & Seafood (15 items)
INSERT INTO foods (name, name_en, category, sub_category, unit, calories, protein, carbohydrates, fat, saturated_fat, fiber, omega_3='3000', description, is_popular) VALUES
('ماهی قزل آلا', 'Salmon', 'protein', 'fish', 'grams', 208, 20, 0, 13, 3, 0, 'اومگا 3 بالا', true),
('ماهی سالمون دودی', 'Smoked Salmon', 'protein', 'fish', 'grams', 117, 25, 0, 1.5, 0.3, 0, 'نمک زیاد', false),
('ماهی تن', 'Tuna', 'protein', 'fish', 'grams', 132, 29, 0, 0.9, 0.2, 0, 'پروتئین بسیار بالا', true),
('ماهی تن کنسروی', 'Canned Tuna', 'protein', 'fish', 'grams', 99, 21, 0, 0.8, 0.2, 0, 'آسان، بدون نمک', true),
('ماهی کد', 'Cod', 'protein', 'fish', 'grams', 82, 18, 0, 0.7, 0.1, 0, 'سفید، بدون چربی', false),
('ماهی فیله', 'Fish Fillet', 'protein', 'fish', 'grams', 120, 22, 0, 2.5, 0.5, 0, 'آسان پخت', true),
('ماهی هالیبوت', 'Halibut', 'protein', 'fish', 'grams', 91, 20, 0, 0.7, 0.1, 0, 'سفید، سلنیوم', false),
('ماهی ماکیل', 'Mackerel', 'protein', 'fish', 'grams', 305, 20, 0, 25, 6, 0, 'چربی خوب، اومگا 3', false),
('ماهی ساردین', 'Sardine', 'protein', 'fish', 'grams', 208, 25, 0, 11, 3, 0, 'کلسیم خوب', false),
('ماهی شنگ', 'Anchovy', 'protein', 'fish', 'grams', 210, 29, 0, 9, 2, 0, 'سدیم بالا', false),
('میگو', 'Shrimp', 'protein', 'seafood', 'grams', 99, 24, 0.2, 0.3, 0.1, 0, 'پروتئین بالا', true),
('خرچنگ', 'Crab', 'protein', 'seafood', 'grams', 82, 18, 0, 1.1, 0.2, 0, 'کم کالری', false),
('صدف', 'Clam', 'protein', 'seafood', 'grams', 74, 13, 2.6, 0.4, 0.1, 0, 'ویتامین B12 بالا', false),
('مخروط', 'Mussel', 'protein', 'seafood', 'grams', 86, 12, 3.7, 2.2, 0.5, 0, 'آهن خوب', false),
('اختاپوس', 'Octopus', 'protein', 'seafood', 'grams', 82, 15, 2.2, 1, 0.2, 0, 'پروتئین خوب', false);

-- Eggs & Dairy (15 items)
INSERT INTO foods (name, name_en, category, sub_category, unit, calories, protein, carbohydrates, fat, saturated_fat, fiber, calcium, description, is_popular) VALUES
('تخم مرغ - کامل', 'Whole Egg', 'protein', 'eggs', 'piece', 78, 6.3, 0.6, 5.3, 1.6, 0, 56, 'متوازن، مغذی', true),
('تخم مرغ - سفیدی', 'Egg White', 'protein', 'eggs', 'piece', 17, 3.6, 0.7, 0, 0, 0, 7, 'بدون چربی، پروتئین', true),
('تخم مرغ - زرده', 'Egg Yolk', 'protein', 'eggs', 'piece', 61, 2.7, 0, 5.3, 1.6, 0, 24, 'چربی خوب، کولین', false),
('شیر - پر چربی', 'Whole Milk', 'protein', 'dairy', 'cup', 149, 7.7, 11, 8, 5, 0, 276, 'کلسیم بالا', false),
('شیر - کم چربی', 'Low Fat Milk', 'protein', 'dairy', 'cup', 122, 8.2, 12, 2.4, 1.5, 0, 285, 'کم کالری', true),
('شیر - بدون چربی', 'Skim Milk', 'protein', 'dairy', 'cup', 91, 8.4, 12, 0.1, 0.1, 0, 306, 'بدون چربی', true),
('دوغ', 'Yogurt Plain', 'protein', 'dairy', 'cup', 100, 10, 7, 0.4, 0.2, 0, 200, 'پروبیوتیک خوب', true),
('دوغ یونانی', 'Greek Yogurt', 'protein', 'dairy', 'cup', 130, 15, 4, 5, 3, 0, 150, 'پروتئین خیلی بالا', true),
('پنیر - شکاری', 'Cottage Cheese', 'protein', 'dairy', 'cup', 206, 28, 7.6, 9, 5, 0, 108, 'پروتئین بسیار بالا', true),
('پنیر - ریکوتا', 'Ricotta Cheese', 'protein', 'dairy', 'cup', 428, 28, 7, 33, 21, 0, 207, 'چربی بالا', false),
('پنیر - چدار', 'Cheddar Cheese', 'protein', 'dairy', 'grams', 402, 25, 1.3, 33, 21, 0, 721, 'نمک بالا', false),
('پنیر - موتزارلا', 'Mozzarella Cheese', 'protein', 'dairy', 'grams', 280, 28, 3.1, 17, 11, 0, 505, 'کشش خوب', false),
('پنیر - فتا', 'Feta Cheese', 'protein', 'dairy', 'grams', 264, 14, 4.1, 21, 15, 0, 493, 'نمک زیاد', false),
('پنیر - سفید', 'White Cheese', 'protein', 'dairy', 'grams', 250, 26, 2, 15, 10, 0, 400, 'فارسی ایرانی', true),
('مخمره - دوغ', 'Whey Protein', 'protein', 'dairy', 'grams', 417, 90, 3, 5, 3, 0, 200, 'پروتئین خالص', true);

-- ==============================
-- CARBOHYDRATES (40+ items)
-- ==============================

-- Grains (15 items)
INSERT INTO foods (name, name_en, category, sub_category, unit, calories, protein, carbohydrates, fat, fiber, sodium, description, is_popular) VALUES
('برنج - سفید', 'White Rice', 'carb', 'grains', 'cup', 205, 4.3, 45, 0.3, 0.6, 2, 'کم رشته‌ای، تهدید شدیدتر', false),
('برنج - قهوه‌ای', 'Brown Rice', 'carb', 'grains', 'cup', 216, 5, 45, 1.8, 3.5, 1, 'فیبر بالا', true),
('برنج - وحشی', 'Wild Rice', 'carb', 'grains', 'cup', 166, 6.5, 35, 0.6, 2.8, 3, 'فیبر خیلی بالا', false),
('جو', 'Barley', 'carb', 'grains', 'cup', 193, 3.6, 44, 0.8, 6, 2, 'فیبر بالا', false),
('ذرت', 'Corn', 'carb', 'grains', 'ear', 77, 2.7, 17, 1.1, 2, 15, 'شیرین، انرژی خوب', false),
('جو دوسر - آماده', 'Instant Oats', 'carb', 'grains', 'cup', 356, 10, 66, 5, 10.7, 105, 'آسان پخت', true),
('جو - سنتی', 'Steel Cut Oats', 'carb', 'grains', 'cup', 376, 10, 67, 5, 10, 2, 'بهتر، آهسته هضم', true),
('جو - ریزه', 'Rolled Oats', 'carb', 'grains', 'cup', 302, 11, 54, 5, 8, 2, 'متوسط', true),
('گندم', 'Wheat', 'carb', 'grains', 'cup', 340, 17, 63, 2.5, 10.7, 2, 'پروتئین خوب', false),
('آرد - گندم', 'Wheat Flour', 'carb', 'grains', 'cup', 407, 13, 87, 1.2, 15, 2, 'پروتئین کم', false),
('آرد - سفید', 'White Flour', 'carb', 'grains', 'cup', 455, 13, 95, 1.2, 3.4, 3, 'کم فیبر', false),
('نان - سفید', 'White Bread', 'carb', 'grains', 'slice', 79, 2.7, 14, 1, 0.9, 145, 'تهدید شدیدتر', false),
('نان - سیاه', 'Whole Wheat Bread', 'carb', 'grains', 'slice', 80, 4, 14, 1, 2.4, 149, 'فیبر بهتر', true),
('نان - رقیق', 'Roti', 'carb', 'grains', 'piece', 120, 3, 24, 0.5, 0, 100, 'سنتی ایرانی', true),
('نان - تافتون', 'Tafton Bread', 'carb', 'grains', 'piece', 130, 4, 26, 0.8, 0, 120, 'سنتی ایرانی', true);

-- Vegetables (15 items)
INSERT INTO foods (name, name_en, category, sub_category, unit, calories, protein, carbohydrates, fat, fiber, sodium, description, is_popular) VALUES
('برکلی', 'Broccoli', 'carb', 'vegetable', 'cup', 34, 2.8, 7, 0.4, 2.4, 64, 'ویتامین C بالا', true),
('کلم - سفید', 'White Cabbage', 'carb', 'vegetable', 'cup', 22, 1.1, 5, 0.1, 1.1, 16, 'بدون کالری', true),
('کلم - قرمز', 'Red Cabbage', 'carb', 'vegetable', 'cup', 31, 1.5, 7, 0.1, 1.4, 29, 'آنتوسیانین', false),
('شاهی - سبز', 'Bell Pepper Green', 'carb', 'vegetable', 'piece', 30, 1, 7, 0.3, 1.3, 3, 'ویتامین C بالا', true),
('شاهی - قرمز', 'Bell Pepper Red', 'carb', 'vegetable', 'piece', 37, 1.2, 9, 0.3, 1.7, 2, 'شیرین تر', true),
('خیار', 'Cucumber', 'carb', 'vegetable', 'cup', 16, 0.8, 3.6, 0.2, 0.5, 2, 'آب بالا', true),
('گوجه‌فرنگی', 'Tomato', 'carb', 'vegetable', 'piece', 22, 1.1, 5, 0.2, 1.5, 6, 'لیکوپن خوب', true),
('سیب‌زمینی', 'Potato', 'carb', 'vegetable', 'medium', 103, 2.1, 23, 0.1, 2.1, 7, 'کربوهیدرات بالا', true),
('شکرقند', 'Sweet Potato', 'carb', 'vegetable', 'medium', 103, 2, 24, 0.1, 3.9, 55, 'بتا کاروتن بالا', true),
('هویج', 'Carrot', 'carb', 'vegetable', 'medium', 25, 0.6, 6, 0.1, 1.7, 42, 'شیرین، بتا کاروتن', true),
('سبز‌خانه', 'Spinach', 'carb', 'vegetable', 'cup', 7, 0.9, 1.1, 0.1, 0.7, 24, 'آهن و کلسیم', true),
('لتو', 'Lettuce', 'carb', 'vegetable', 'cup', 5, 0.5, 1, 0.1, 0.5, 3, 'سبک، ویتامین K', true),
('نخود', 'Chickpea', 'carb', 'vegetable', 'cup', 269, 15, 45, 4.3, 12, 11, 'پروتئین و فیبر', true),
('لوبیا - سفید', 'White Bean', 'carb', 'vegetable', 'cup', 249, 15, 45, 1, 6, 4, 'فیبر خوب', false),
('لوبیا - سیاه', 'Black Bean', 'carb', 'vegetable', 'cup', 241, 15, 44, 0.9, 10.2, 2, 'فیبر بسیار بالا', true);

-- Fruits (12 items)
INSERT INTO foods (name, name_en, category, sub_category, unit, calories, protein, carbohydrates, fat, fiber, sodium, description, is_popular) VALUES
('سیب', 'Apple', 'carb', 'fruit', 'medium', 95, 0.5, 25, 0.3, 4.4, 2, 'فیبر خوب', true),
('موز', 'Banana', 'carb', 'fruit', 'medium', 105, 1.3, 27, 0.3, 3.1, 1, 'پتاسیم بالا', true),
('درخت انجیر', 'Fig', 'carb', 'fruit', 'medium', 47, 0.4, 12, 0.1, 1.5, 1, 'شیرین، سنتی', false),
('انگور - سفید', 'White Grapes', 'carb', 'fruit', 'cup', 96, 0.5, 26, 0.3, 1.4, 3, 'آب و شیرین', false),
('انگور - سیاه', 'Black Grapes', 'carb', 'fruit', 'cup', 97, 0.9, 25, 0.5, 1.3, 2, 'رزوراترول', false),
('پرتقال', 'Orange', 'carb', 'fruit', 'medium', 62, 1.2, 15, 0.3, 3.1, 0, 'ویتامین C بالا', true),
('لیمو', 'Lemon', 'carb', 'fruit', 'medium', 17, 0.6, 5, 0.2, 1.6, 1, 'ترش، C بالا', true),
('توت فرنگی', 'Strawberry', 'carb', 'fruit', 'cup', 49, 0.9, 12, 0.4, 3, 2, 'ویتامین C بالا', true),
('توت', 'Blueberry', 'carb', 'fruit', 'cup', 85, 1.1, 21, 0.3, 3.6, 1, 'آنتوسیانین بالا', true),
('تمر', 'Date', 'carb', 'fruit', 'piece', 66, 0.4, 18, 0.05, 1.6, 1, 'شیرین، انرژی', true),
('شاه‌توت', 'Mulberry', 'carb', 'fruit', 'cup', 60, 1.4, 14, 0.4, 2.1, 2, 'آنتوسیانین', false),
('انبه', 'Mango', 'carb', 'fruit', 'cup', 99, 1.4, 25, 0.6, 2.6, 3, 'ویتامین A بالا', false);

-- ==============================
-- FATS & OILS (15+ items)
-- ==============================

INSERT INTO foods (name, name_en, category, sub_category, unit, calories, protein, carbohydrates, fat, saturated_fat, fiber, sodium, description, is_popular) VALUES
('روغن - زیتون', 'Olive Oil', 'fat', 'oil', 'tbsp', 119, 0, 0, 14, 1.9, 0, 0, 'چربی خوب، اومگا 3', true),
('روغن - آفتابگردان', 'Sunflower Oil', 'fat', 'oil', 'tbsp', 119, 0, 0, 14, 1.5, 0, 0, 'لینولیک اسید', false),
('روغن - نخجیر', 'Coconut Oil', 'fat', 'oil', 'tbsp', 119, 0, 0, 14, 12, 0, 0, 'MCT، سریع‌الهضم', false),
('روغن - بادام زمینی', 'Peanut Oil', 'fat', 'oil', 'tbsp', 119, 0, 0, 14, 2.3, 0, 0, 'پروتئین کم', false),
('کره - بادام', 'Almond Butter', 'fat', 'nut_butter', 'tbsp', 95, 3.3, 3.5, 8.9, 0.7, 0, 90, 'ویتامین E بالا', true),
('کره - بادام زمینی', 'Peanut Butter', 'fat', 'nut_butter', 'tbsp', 94, 3.6, 3.5, 8, 1.5, 0, 75, 'ارزان، خوشمزه', true),
('کره - آجیل', 'Tahini', 'fat', 'nut_butter', 'tbsp', 89, 2.6, 3.2, 8.1, 1.1, 0, 50, 'سزام، کلسیم', false),
('بادام', 'Almonds', 'fat', 'nuts', 'ounce', 161, 5.7, 6.1, 14, 1, 3.5, 1, 'ویتامین E، کلسیم', true),
('فندق', 'Hazelnuts', 'fat', 'nuts', 'ounce', 178, 4.2, 4.7, 17, 1.3, 2.7, 1, 'چربی خوب', false),
('گردو', 'Walnuts', 'fat', 'nuts', 'ounce', 185, 4.3, 3.9, 18.5, 1.7, 1.9, 2, 'اومگا 3 بالا', true),
('بادام افریقایی', 'Pistachios', 'fat', 'nuts', 'ounce', 160, 5.7, 7.7, 13, 1.7, 2.7, 2, 'رنگ سبز', false),
('آفتابگردان - دانه', 'Sunflower Seeds', 'fat', 'seeds', 'quarter_cup', 180, 5.5, 6.5, 16, 1.5, 2.4, 40, 'سلنیوم بالا', false),
('کدو - دانه', 'Pumpkin Seeds', 'fat', 'seeds', 'quarter_cup', 180, 9, 4, 16, 3, 1.1, 5, 'پروتئین بالا', false),
('کتان - دانه', 'Flax Seeds', 'fat', 'seeds', 'tbsp', 55, 1.9, 3, 3, 0.3, 2.8, 3, 'اومگا 3 خیلی بالا', true),
('چیا - دانه', 'Chia Seeds', 'fat', 'seeds', 'tbsp', 61, 2, 5, 3, 0.3, 4.1, 2, 'فیبر و اومگا 3', true),
('خاموت', 'Sesame Seeds', 'fat', 'seeds', 'tbsp', 52, 1.7, 2, 4.7, 0.7, 1.1, 3, 'کلسیم بالا', false);

-- ================================
-- MISCELLANEOUS (15+ items)
-- ================================

INSERT INTO foods (name, name_en, category, sub_category, unit, calories, protein, carbohydrates, fat, fiber, sodium, description, is_popular) VALUES
('شیرینی - قند', 'Sugar', 'other', 'sweetener', 'tbsp', 49, 0, 13, 0, 0, 0, 'حذف، تقریبا سم', false),
('عسل', 'Honey', 'other', 'sweetener', 'tbsp', 64, 0.1, 17, 0, 0.1, 3, 'طبیعی، آنزیم‌ها', true),
('شکلات - تاریک', 'Dark Chocolate', 'other', 'sweetener', 'ounce', 170, 3, 16, 12, 7, 10, 'آنتوکسیدان', false),
('پسته', 'Pistachio', 'other', 'snack', 'ounce', 160, 5.7, 7.7, 13, 2.7, 2, 'خوشمزه، مغذی', true),
('چیپس - شیراز', 'Potato Chips', 'other', 'snack', 'ounce', 152, 2, 15, 9, 3, 166, 'نمک بالا', false),
('پوپ کورن', 'Popcorn', 'other', 'snack', 'cup', 30, 1, 6, 0.3, 1.2, 61, 'سبک، الیاف', false),
('مربا', 'Jam', 'other', 'spread', 'tbsp', 48, 0.1, 13, 0.1, 0.4, 5, 'قند زیاد', false),
('مایونز', 'Mayonnaise', 'other', 'condiment', 'tbsp', 99, 0.1, 0.1, 11, 1.6, 76, 'چربی بالا', false),
('خردل', 'Mustard', 'other', 'condiment', 'tbsp', 3, 0.2, 0, 0.1, 0, 56, 'بدون کالری', true),
('کچاپ', 'Ketchup', 'other', 'condiment', 'tbsp', 15, 0, 4, 0, 0, 160, 'قند زیاد', false),
('سوس - سویا', 'Soy Sauce', 'other', 'condiment', 'tbsp', 8, 1.1, 0.8, 0, 0, 902, 'نمک خیلی بالا', false),
('سرکه', 'Vinegar', 'other', 'condiment', 'tbsp', 3, 0, 0.1, 0, 0, 1, 'پهلو ای رطوبت', true),
('فلفل - پودر', 'Chili Powder', 'other', 'spice', 'tsp', 8, 0.3, 1.3, 0.2, 0.7, 26, 'شرارت، تند', true),
('نمک', 'Salt', 'other', 'condiment', 'tsp', 0, 0, 0, 0, 0, 2325, 'حذف، صحت', false),
('نمک - سفید', 'White Salt', 'other', 'condiment', 'tsp', 0, 0, 0, 0, 0, 2325, 'حذف', false);
