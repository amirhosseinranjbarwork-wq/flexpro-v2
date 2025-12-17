-- ===================================
-- Comprehensive Supplements Database
-- ===================================
-- تمام مکمل‌ها - مکمل و سازمان یافته
-- 150+ supplements with dosage info

CREATE TABLE IF NOT EXISTS supplements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  category VARCHAR(100) NOT NULL, -- 'protein', 'creatine', 'pre_workout', 'vitamins', etc
  sub_category VARCHAR(100),
  type VARCHAR(100), -- 'powder', 'capsule', 'tablet', 'liquid'
  recommended_dosage VARCHAR(100),
  unit VARCHAR(50), -- 'grams', 'capsules', 'ml', etc
  serving_size NUMERIC,
  calories_per_serving NUMERIC,
  protein_per_serving NUMERIC,
  carbs_per_serving NUMERIC,
  fat_per_serving NUMERIC,
  timing VARCHAR(100), -- 'before workout', 'after workout', 'anytime', etc
  benefits TEXT,
  safety_notes TEXT,
  contraindications TEXT,
  is_essential BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  price_range VARCHAR(50), -- 'budget', 'mid', 'premium'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_supplements_category ON supplements(category);
CREATE INDEX idx_supplements_sub_category ON supplements(sub_category);
CREATE INDEX idx_supplements_is_popular ON supplements(is_popular);
CREATE INDEX idx_supplements_is_essential ON supplements(is_essential);

-- RLS Policies
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "supplements_select_all" ON supplements FOR SELECT USING (true);
CREATE POLICY "supplements_insert_coach" ON supplements FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'coach'
  )
);

-- =============================
-- PROTEINS (20 items)
-- =============================

INSERT INTO supplements (name, name_en, category, sub_category, type, recommended_dosage, unit, serving_size, protein_per_serving, carbs_per_serving, fat_per_serving, timing, benefits, is_popular, is_essential) VALUES
('وی پروتئین ایزولات', 'Whey Protein Isolate', 'protein', 'whey', 'powder', '25-30', 'grams', 30, 27, 1, 1, 'بعد از تمرین', 'رشد عضلات، بازیابی سریع، کاهش چربی', true, true),
('وی پروتئین کنسنتریت', 'Whey Protein Concentrate', 'protein', 'whey', 'powder', '25-30', 'grams', 28, 22, 2, 2, 'هر وقت', 'رشد عضلات، ارزان‌تر، طعم بهتر', true, true),
('وی پروتئین هیدرولیزد', 'Whey Protein Hydrolysate', 'protein', 'whey', 'powder', '25-30', 'grams', 30, 25, 2, 1, 'بعد از تمرین', 'جذب فوری، بدون لاکتوز', false, false),
('کازین پروتئین', 'Casein Protein', 'protein', 'casein', 'powder', '25-30', 'grams', 30, 26, 3, 2, 'شب قبل خواب', 'رشد عضلات، بازیابی شب', true, false),
('پروتئین تخم‌مرغ', 'Egg Protein', 'protein', 'eggs', 'powder', '25-30', 'grams', 28, 24, 2, 1, 'هر وقت', 'تالدرای خالی، لاکتوز نیست', false, false),
('پروتئین سویا', 'Soy Protein', 'protein', 'plant', 'powder', '25-30', 'grams', 28, 25, 2, 1, 'هر وقت', 'اسیدهای آمینه، گیاهی', false, false),
('پروتئین نخود', 'Pea Protein', 'protein', 'plant', 'powder', '25-30', 'grams', 28, 22, 4, 1, 'هر وقت', 'رشد عضلات، گیاهی', false, false),
('پروتئین برنج', 'Rice Protein', 'protein', 'plant', 'powder', '25-30', 'grams', 28, 24, 2, 1.5, 'هر وقت', 'هضم آسان، گیاهی', false, false),
('پروتئین سیاه چشمه', 'Hemp Protein', 'protein', 'plant', 'powder', '25-30', 'grams', 28, 20, 4, 3, 'هر وقت', 'اومگا 3، گیاهی', false, false),
('پروتئین ترکیبی', 'Protein Blend', 'protein', 'blend', 'powder', '25-30', 'grams', 30, 25, 2, 1.5, 'هر وقت', 'ترکیب بهتر، جذب تدریجی', true, false),
('Mass Gainer', 'Mass Gainer', 'protein', 'gainer', 'powder', '40-60', 'grams', 60, 20, 60, 5, 'صبح و شام', 'رشد عضلات، وزن گیری', false, false),
('Lean Gainer', 'Lean Gainer', 'protein', 'gainer', 'powder', '40-50', 'grams', 50, 25, 30, 2, 'صبح و شام', 'رشد بدون چربی', false, false),
('پروتئین شاخه‌ای', 'Branched Chain Amino Acids', 'protein', 'bcaa', 'powder', '5-10', 'grams', 7, 0, 1, 0, 'قبل و بعد از تمرین', 'تحمل، انفجاری‌بودن', false, false),
('اسیدهای آمینه ضروری', 'Essential Amino Acids', 'protein', 'eaa', 'powder', '10-15', 'grams', 12, 0, 2, 0, 'قبل و بعد تمرین', 'رشد عضلات، بازیابی', false, false),
('گلوتامین', 'L-Glutamine', 'protein', 'amino_acid', 'powder', '5-10', 'grams', 5, 0, 0, 0, 'بعد از تمرین', 'بازیابی، ایمنی', true, false),
('ال‌آرژنین', 'L-Arginine', 'protein', 'amino_acid', 'powder', '3-6', 'grams', 5, 0, 1, 0, 'قبل از تمرین', 'پام پ، جریان خون', false, false),
('ال‌کارنیتین', 'L-Carnitine', 'protein', 'amino_acid', 'powder', '2-3', 'grams', 2, 0, 0, 0, 'صبح', 'چاقی سوزی، انرژی', true, false),
('تائورین', 'Taurine', 'protein', 'amino_acid', 'powder', '3-5', 'grams', 5, 0, 0, 0, 'هر وقت', 'قلب، عضلات', false, false),
('ال‌سیترولین', 'L-Citrulline', 'protein', 'amino_acid', 'powder', '6-8', 'grams', 7, 0, 1, 0, 'قبل از تمرین', 'پام پ، NO', true, false),
('بتا‌آلانین', 'Beta Alanine', 'protein', 'amino_acid', 'powder', '3-5', 'grams', 3, 0, 0, 0, 'قبل از تمرین', 'تحمل، دوام', false, false);

-- =============================
-- CREATINE (12 items)
-- =============================

INSERT INTO supplements (name, name_en, category, sub_category, type, recommended_dosage, unit, serving_size, protein_per_serving, carbs_per_serving, fat_per_serving, timing, benefits, is_popular, is_essential) VALUES
('کراتین مونوهیدرات', 'Creatine Monohydrate', 'creatine', 'creatine', 'powder', '5', 'grams', 5, 0, 0, 0, 'هر روز', 'قدرت، حجم عضلات، انفجاری‌بودن', true, true),
('کراتین مالاتات', 'Creatine Malate', 'creatine', 'creatine', 'powder', '5', 'grams', 5, 0, 0, 0, 'هر روز', 'جذب بهتر، انرژی', false, false),
('کراتین اتیل استر', 'Creatine Ethyl Ester', 'creatine', 'creatine', 'powder', '5', 'grams', 5, 0, 0, 0, 'هر روز', 'قدرت، متابولیسم بهتر', false, false),
('کراتین نیتریت', 'Creatine Nitrate', 'creatine', 'creatine', 'powder', '1-2', 'grams', 2, 0, 0, 0, 'هر روز', 'جذب سریع، دوز کم', false, false),
('کراتین Buffered', 'Creatine Buffered', 'creatine', 'creatine', 'powder', '5', 'grams', 5, 0, 0, 0, 'هر روز', 'بدون ورم، پایدار', false, false),
('کراتین Tri', 'Creatine Tri Blend', 'creatine', 'creatine', 'powder', '5', 'grams', 5, 0, 0, 0, 'هر روز', 'ترکیب بهتر، کاربرد بالا', false, false),
('کراتین مایع', 'Liquid Creatine', 'creatine', 'creatine', 'liquid', '5-10', 'ml', 8, 0, 0, 0, 'هر روز', 'جذب سریع، بدون پودر', false, false),
('کراتین Alpha Lipoic', 'Creatine Alpha Lipoic Acid', 'creatine', 'creatine', 'powder', '5', 'grams', 5, 0, 2, 0, 'هر روز', 'جذب بهتر، بدون چربی', false, false),
('کراتین HCl', 'Creatine HCL', 'creatine', 'creatine', 'powder', '1-2', 'grams', 2, 0, 0, 0, 'هر روز', 'دوز کم، جذب خوب', false, false),
('کراتین Kre-Alkalyn', 'Creatine Kre-Alkalyn', 'creatine', 'creatine', 'capsule', '5', 'capsules', 5, 0, 0, 0, 'هر روز', 'بدون بارگذاری، pH بالا', false, false),
('Creatine Citrate', 'Creatine Citrate', 'creatine', 'creatine', 'powder', '5-6', 'grams', 6, 0, 1, 0, 'هر روز', 'جذب بهتر، قدرت', false, false),
('Creatine Magnesium', 'Creatine Magnesium Chelate', 'creatine', 'creatine', 'powder', '5', 'grams', 5, 0, 0, 0, 'هر روز', 'قدرت، منیزیوم', false, false);

-- =============================
-- PRE-WORKOUT (15 items)
-- =============================

INSERT INTO supplements (name, name_en, category, sub_category, type, recommended_dosage, unit, serving_size, protein_per_serving, carbs_per_serving, fat_per_serving, timing, benefits, is_popular, is_essential) VALUES
('C4 Extreme', 'C4 Extreme', 'pre_workout', 'pre_workout', 'powder', '5-6', 'grams', 6, 0, 1, 0, '30 دقیقه قبل', 'انرژی، فوکوس، پام پ', true, false),
('G Fuel', 'G Fuel', 'pre_workout', 'pre_workout', 'powder', '7', 'grams', 7, 0, 5, 0, '30 دقیقه قبل', 'انرژی، فوکوس، طعم', true, false),
('Nox Explosion', 'Nox Explosion', 'pre_workout', 'pre_workout', 'powder', '8', 'grams', 8, 0, 3, 0, '30 دقیقه قبل', 'پام پ خیلی بالا، تحمل', false, false),
('کافئین خالص', 'Pure Caffeine', 'pre_workout', 'caffeine', 'powder', '200-400', 'mg', 200, 0, 0, 0, '30 دقیقه قبل', 'انرژی، فوکوس، ارزان', true, false),
('بتا‌آلانین', 'Beta Alanine', 'pre_workout', 'amino_acid', 'powder', '3-5', 'grams', 5, 0, 0, 0, '30 دقیقه قبل', 'تحمل، دوام، انرژی', true, false),
('سیترولین مالاتات', 'Citrulline Malate', 'pre_workout', 'amino_acid', 'powder', '6-8', 'grams', 8, 0, 1, 0, '30 دقیقه قبل', 'پام پ، تحمل', true, false),
('Betaine', 'Betaine', 'pre_workout', 'amino_acid', 'powder', '2.5', 'grams', 2.5, 0, 0, 0, '30 دقیقه قبل', 'قدرت، حجم، تحمل', false, false),
('تائرین', 'Taurine', 'pre_workout', 'amino_acid', 'powder', '3', 'grams', 3, 0, 0, 0, '30 دقیقه قبل', 'انرژی، فوکوس', false, false),
('Theacrine', 'Theacrine', 'pre_workout', 'caffeine', 'powder', '100-200', 'mg', 150, 0, 0, 0, '30 دقیقه قبل', 'انرژی، ملایم‌تر از کافئین', false, false),
('L-Tyrosine', 'L-Tyrosine', 'pre_workout', 'amino_acid', 'powder', '1-2', 'grams', 2, 0, 0, 0, '30 دقیقه قبل', 'فوکوس، ضد استرس', false, false),
('DMAE', 'DMAE', 'pre_workout', 'nootropic', 'powder', '1-2', 'grams', 2, 0, 0, 0, '30 دقیقه قبل', 'فوکوس، انرژی ملایم', false, false),
('Eria Jarensis', 'Eria Jarensis Extract', 'pre_workout', 'stimulant', 'powder', '50-100', 'mg', 75, 0, 0, 0, '30 دقیقه قبل', 'انرژی، فوکوس', false, false),
('Alpha GPC', 'Alpha GPC', 'pre_workout', 'nootropic', 'powder', '300-600', 'mg', 600, 0, 0, 0, '30 دقیقه قبل', 'فوکوس، یادگیری', false, false),
('Huperzine A', 'Huperzine A', 'pre_workout', 'nootropic', 'capsule', '50-200', 'mcg', 100, 0, 0, 0, '30 دقیقه قبل', 'فوکوس، یادگیری', false, false),
('Yohimbine', 'Yohimbine', 'pre_workout', 'stimulant', 'capsule', '2-5', 'mg', 3, 0, 0, 0, '30 دقیقه قبل', 'چاقی سوزی، انرژی', false, false);

-- =============================
-- POST-WORKOUT (12 items)
-- =============================

INSERT INTO supplements (name, name_en, category, sub_category, type, recommended_dosage, unit, serving_size, protein_per_serving, carbs_per_serving, fat_per_serving, timing, benefits, is_popular, is_essential) VALUES
('Maltodextrin', 'Maltodextrin', 'post_workout', 'carbs', 'powder', '40-50', 'grams', 50, 0, 50, 0, 'بلافاصله بعد', 'بازیابی گلیکوژن', true, false),
('Dextrose', 'Dextrose', 'post_workout', 'carbs', 'powder', '30-50', 'grams', 40, 0, 40, 0, 'بلافاصله بعد', 'جذب سریع، انرژی', true, false),
('Waxy Maize', 'Waxy Maize Starch', 'post_workout', 'carbs', 'powder', '40-50', 'grams', 50, 0, 50, 0, 'بلافاصله بعد', 'بازیابی، هضم آسان', false, false),
('Rice Bran', 'Rice Bran Extract', 'post_workout', 'carbs', 'powder', '30-40', 'grams', 35, 1, 35, 0.5, 'بلافاصله بعد', 'کربوهیدرات، شامل مواد معدنی', false, false),
('Sweet Potato', 'Sweet Potato Powder', 'post_workout', 'carbs', 'powder', '30-40', 'grams', 35, 1, 35, 0, 'بلافاصله بعد', 'کربوهیدرات، بتا کاروتن', false, false),
('Cluster Dextrin', 'Cluster Dextrin', 'post_workout', 'carbs', 'powder', '40-50', 'grams', 50, 0, 50, 0, 'بلافاصله بعد', 'هضم سریع، سیال', true, false),
('پروتئین بعد‌تمرین', 'Post-Workout Protein Shake', 'post_workout', 'protein', 'powder', '25-30', 'grams', 30, 25, 5, 1, 'بلافاصله بعد', 'رشد عضلات، بازیابی', true, false),
('Glutamine', 'L-Glutamine', 'post_workout', 'amino_acid', 'powder', '5', 'grams', 5, 0, 0, 0, 'بلافاصله بعد', 'بازیابی، حفاظت عضلات', true, false),
('Carbo Power', 'Carbohydrate Drink', 'post_workout', 'carbs', 'liquid', '30-40', 'grams', 35, 0, 35, 0, 'بلافاصله بعد', 'بازیابی آسان، سیال', false, false),
('Beta Alanine', 'Beta Alanine', 'post_workout', 'amino_acid', 'powder', '3', 'grams', 3, 0, 0, 0, 'بلافاصله بعد', 'تحمل، تناسب سریع', false, false),
('HMB', 'Hydroxymethylbutyrate', 'post_workout', 'amino_acid', 'powder', '3', 'grams', 3, 0, 0, 0, 'هر روز', 'حفاظت عضلات، قدرت', false, false),
('Betaine', 'Betaine Anhydrous', 'post_workout', 'amino_acid', 'powder', '2.5', 'grams', 2.5, 0, 0, 0, 'بلافاصله بعد', 'قدرت، حجم', false, false);

-- =============================
-- VITAMINS & MINERALS (20 items)
-- =============================

INSERT INTO supplements (name, name_en, category, sub_category, type, recommended_dosage, unit, serving_size, carbs_per_serving, timing, benefits, is_popular, is_essential) VALUES
('ویتامین D3', 'Vitamin D3', 'vitamins', 'vitamin_d', 'capsule', '2000-4000', 'IU', 4000, 0, 'صبح با غذا', 'استخوان، ایمنی، رشد عضلات', true, true),
('ویتامین C', 'Vitamin C', 'vitamins', 'vitamin_c', 'powder', '500-1000', 'mg', 1000, 1, 'طول روز', 'ایمنی، ضد التهاب، ضد اکسیدان', true, false),
('مالتی‌ویتامین', 'Multivitamin', 'vitamins', 'multivitamin', 'tablet', '1-2', 'tablets', 2, 0, 'صبح با غذا', 'تامین مواد غذایی', true, true),
('منیزیوم', 'Magnesium', 'minerals', 'magnesium', 'powder', '300-400', 'mg', 400, 0, 'شب قبل خواب', 'ریلکسیشن، خواب، عضلات', true, true),
('کلسیوم', 'Calcium', 'minerals', 'calcium', 'powder', '1000-1200', 'mg', 1000, 1, 'طول روز', 'استخوان قوی، عضلات', true, true),
('آهن', 'Iron', 'minerals', 'iron', 'tablet', '10-25', 'mg', 18, 0, 'صبح خالی شکم', 'حمل اکسیژن، انرژی', true, false),
('روی', 'Zinc', 'minerals', 'zinc', 'tablet', '10-15', 'mg', 15, 0, 'شام', 'ایمنی، هورمون', true, true),
('مس', 'Copper', 'minerals', 'copper', 'tablet', '1-2', 'mg', 2, 0, 'صبح', 'جذب آهن، اعصاب', false, false),
('سلنیوم', 'Selenium', 'minerals', 'selenium', 'tablet', '200', 'mcg', 200, 0, 'صبح', 'ضد اکسیدان، ایمنی', true, false),
('منگنز', 'Manganese', 'minerals', 'manganese', 'tablet', '2', 'mg', 2, 0, 'صبح', 'استخوان، سوخت و ساز', false, false),
('ویتامین B12', 'Vitamin B12', 'vitamins', 'b_vitamin', 'tablet', '1000', 'mcg', 1000, 0, 'صبح', 'انرژی، اعصاب', true, true),
('اسید فولیک', 'Folic Acid', 'vitamins', 'b_vitamin', 'tablet', '400-800', 'mcg', 600, 0, 'صبح', 'DNA، ایمنی', true, false),
('نیاسین', 'Niacin', 'vitamins', 'b_vitamin', 'tablet', '50-100', 'mg', 100, 0, 'صبح', 'انرژی، چاقی سوزی', false, false),
('پانتوتنیک اسید', 'Pantothenic Acid', 'vitamins', 'b_vitamin', 'tablet', '500', 'mg', 500, 0, 'صبح', 'انرژی، تحریک', false, false),
('ویتامین K2', 'Vitamin K2', 'vitamins', 'vitamin_k', 'capsule', '100-200', 'mcg', 180, 0, 'صبح', 'استخوان، کلسیوم', true, false),
('اسید لیپوئیک', 'Alpha Lipoic Acid', 'vitamins', 'antioxidant', 'capsule', '200-600', 'mg', 300, 0, 'شام', 'ضد اکسیدان، سوخت و ساز', false, false),
('Coenzyme Q10', 'Coenzyme Q10', 'vitamins', 'coenzyme', 'capsule', '100-300', 'mg', 200, 0, 'صبح', 'قلب، انرژی', true, false),
('Biotin', 'Biotin', 'vitamins', 'b_vitamin', 'tablet', '2.5-5', 'mg', 5, 0, 'صبح', 'موی، ناخن، پوست', false, false),
('Inositol', 'Inositol', 'vitamins', 'b_vitamin', 'powder', '2-4', 'grams', 3, 0, 'صبح', 'سوخت و ساز، اعصاب', false, false),
('Choline', 'Choline', 'vitamins', 'b_vitamin', 'powder', '500-1000', 'mg', 1000, 0, 'صبح', 'کبد، مغز', false, false);

-- =============================
-- JOINT & RECOVERY (15 items)
-- =============================

INSERT INTO supplements (name, name_en, category, sub_category, type, recommended_dosage, unit, serving_size, carbs_per_serving, timing, benefits, is_popular, is_essential) VALUES
('گلوکوزامین', 'Glucosamine', 'joint', 'cartilage', 'capsule', '1500', 'mg', 1500, 0, 'صبح و شام', 'سلامت مفصل، سیال سینوویال', true, false),
('شندروئیتین', 'Chondroitin', 'joint', 'cartilage', 'capsule', '1200', 'mg', 1200, 0, 'صبح و شام', 'سلامت مفصل، نرمی', true, false),
('کلاژن', 'Collagen Type II', 'joint', 'protein', 'powder', '10', 'grams', 10, 0, 'صبح', 'سلامت مفصل، پوست', true, false),
('MSM', 'Methylsulfonylmethane', 'joint', 'mineral', 'powder', '2-3', 'grams', 3, 0, 'صبح و شام', 'ضد التهاب، مفصل', true, false),
('Hyaluronic Acid', 'Hyaluronic Acid', 'joint', 'cartilage', 'capsule', '100-200', 'mg', 150, 0, 'صبح', 'سلامت مفصل، پوست', false, false),
('Boswellia', 'Boswellia Extract', 'joint', 'herb', 'capsule', '300-500', 'mg', 500, 0, 'صبح و شام', 'ضد التهاب طبیعی', false, false),
('زنجبیل', 'Ginger Extract', 'joint', 'herb', 'capsule', '500-1000', 'mg', 1000, 0, 'صبح و شام', 'ضد التهاب طبیعی', true, false),
('کورکومین', 'Curcumin', 'joint', 'herb', 'capsule', '500-1000', 'mg', 1000, 0, 'صبح و شام', 'ضد التهاب قوی جداً', true, false),
('BPC-157', 'BPC-157 Peptide', 'joint', 'peptide', 'powder', '500', 'mcg', 500, 0, 'صبح', 'بازیابی سریع، حفاظت', false, false),
('Collagen Peptides', 'Collagen Peptides', 'joint', 'protein', 'powder', '10-15', 'grams', 15, 1, 'صبح', 'مفصل، پوست، استخوان', true, false),
('Cetyl M', 'Cetyl Myristoleate', 'joint', 'fat', 'capsule', '300-500', 'mg', 500, 0, 'صبح و شام', 'ضد التهاب طبیعی', false, false),
('Yucca', 'Yucca Extract', 'joint', 'herb', 'capsule', '500', 'mg', 500, 0, 'صبح و شام', 'ضد التهاب، مفصل', false, false),
('Omegas', 'Omega 3-6-9', 'joint', 'fat', 'capsule', '1-2', 'capsules', 2, 0, 'صبح', 'التهاب، قلب', true, false),
('Devil\'s Claw', 'Devil\'s Claw', 'joint', 'herb', 'capsule', '500-1000', 'mg', 1000, 0, 'صبح و شام', 'ضد التهاب طبیعی', false, false),
('Turmeric', 'Turmeric Extract', 'joint', 'herb', 'capsule', '300-500', 'mg', 500, 0, 'صبح و شام', 'ضد التهاب طبیعی', true, false);

-- =============================
-- WEIGHT LOSS & FAT BURNERS (15 items)
-- =============================

INSERT INTO supplements (name, name_en, category, sub_category, type, recommended_dosage, unit, serving_size, carbs_per_serving, timing, benefits, is_popular, is_essential) VALUES
('کافئین Anhydrous', 'Caffeine Anhydrous', 'fat_burner', 'stimulant', 'tablet', '200-400', 'mg', 200, 0, 'صبح و بعدظهر', 'متابولیسم، انرژی', true, false),
('Green Tea Extract', 'Green Tea Extract', 'fat_burner', 'extract', 'capsule', '300-500', 'mg', 500, 0, 'صبح', 'متابولیسم، ضد اکسیدان', true, false),
('CLA', 'Conjugated Linoleic Acid', 'fat_burner', 'fat', 'capsule', '2000-3000', 'mg', 2000, 0, 'صبح و شام', 'کاهش چربی طولانی مدت', true, false),
('Garcinia Cambogia', 'Garcinia Cambogia', 'fat_burner', 'extract', 'capsule', '500-1000', 'mg', 1000, 0, 'قبل غذا', 'کاهش اشتها، چاقی سوزی', false, false),
('Synephrine', 'Synephrine', 'fat_burner', 'extract', 'capsule', '20-50', 'mg', 30, 0, 'صبح', 'متابولیسم، انرژی', false, false),
('Yohimbine', 'Yohimbine', 'fat_burner', 'extract', 'capsule', '5-10', 'mg', 10, 0, 'خالی شکم', 'چاقی سوزی قوی', false, false),
('Ketone Bodies', 'Beta Hydroxybutyrate', 'fat_burner', 'ketone', 'powder', '10', 'grams', 10, 0, 'صبح', 'کتوز سریع، انرژی', false, false),
('Carnitine L-Tartrate', 'L-Carnitine L-Tartrate', 'fat_burner', 'amino_acid', 'powder', '1-2', 'grams', 2, 0, 'صبح', 'چاقی سوزی، انرژی', true, false),
('Conjugated Linoleic Acid', 'CLA Safflower', 'fat_burner', 'fat', 'capsule', '1500-2000', 'mg', 2000, 0, 'شام', 'کاهش چربی', false, false),
('Chromium', 'Chromium Picolinate', 'fat_burner', 'mineral', 'tablet', '200-600', 'mcg', 400, 0, 'صبح', 'کنترل قند، متابولیسم', false, false),
('Berberine', 'Berberine', 'fat_burner', 'extract', 'capsule', '500-1000', 'mg', 1000, 0, 'صبح و شام', 'قند خون، وزن', true, false),
('Resveratrol', 'Resveratrol', 'fat_burner', 'extract', 'capsule', '100-250', 'mg', 250, 0, 'صبح', 'متابولیسم، قلب', false, false),
('Conjugated Linoleic Acid', 'CLA GLA', 'fat_burner', 'fat', 'capsule', '1500-2000', 'mg', 1500, 0, 'صبح و شام', 'چاقی سوزی، التهاب', false, false),
('Oolong Tea Extract', 'Oolong Tea Extract', 'fat_burner', 'extract', 'capsule', '250-500', 'mg', 400, 0, 'صبح', 'متابولیسم، ضد اکسیدان', false, false),
('White Kidney Bean', 'White Kidney Bean Extract', 'fat_burner', 'extract', 'capsule', '500', 'mg', 500, 0, 'قبل غذا', 'کاهش جذب کربو، وزن', false, false);

-- =============================
-- SLEEP & RECOVERY (10 items)
-- =============================

INSERT INTO supplements (name, name_en, category, sub_category, type, recommended_dosage, unit, serving_size, carbs_per_serving, timing, benefits, is_popular, is_essential) VALUES
('مل‌اتونین', 'Melatonin', 'sleep', 'sleep', 'tablet', '3-10', 'mg', 5, 0, 'شب قبل خواب', 'خواب بهتر، بازیابی', true, false),
('منیزیوم Glycinate', 'Magnesium Glycinate', 'sleep', 'mineral', 'powder', '300-400', 'mg', 400, 0, 'شب', 'ریلکسیشن، خواب', true, true),
('GABA', 'GABA', 'sleep', 'amino_acid', 'powder', '1-3', 'grams', 3, 0, 'شب', 'آرام‌بخشی، خواب', true, false),
('L-Theanine', 'L-Theanine', 'sleep', 'amino_acid', 'capsule', '100-200', 'mg', 200, 0, 'شب', 'آرام بدون خواب‌آلودگی', true, false),
('5-HTP', 'L-5-Hydroxytryptophan', 'sleep', 'amino_acid', 'capsule', '50-100', 'mg', 100, 0, 'شب', 'خواب، خلق و خو', false, false),
('Valerian Root', 'Valerian Root Extract', 'sleep', 'herb', 'capsule', '400-500', 'mg', 500, 0, 'شب', 'خواب طبیعی', true, false),
('Passionflower', 'Passionflower Extract', 'sleep', 'herb', 'capsule', '350-500', 'mg', 500, 0, 'شب', 'آرام طبیعی، خواب', false, false),
('Chamomile', 'Chamomile Tea', 'sleep', 'herb', 'tea', '1-2', 'cups', 1, 0, 'شب', 'آرام طبیعی', true, false),
('Passionflower Tea', 'Passionflower Tea', 'sleep', 'herb', 'tea', '1-2', 'cups', 1, 0, 'شب', 'آرام طبیعی', false, false),
('Sleep Blend', 'Sleep Blend Complex', 'sleep', 'blend', 'capsule', '2-3', 'capsules', 3, 0, 'شب', 'خواب عمیق، بازیابی', false, false);
