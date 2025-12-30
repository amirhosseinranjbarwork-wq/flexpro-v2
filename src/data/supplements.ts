/**
 * Supplements Database
 * Converted from data for develop/data/supplementsData.js
 */

export interface Supplement {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  type: string;
  form: 'پودر' | 'کپسول' | 'قرص' | 'مایع' | 'ژل' | 'شربت';
  dosage?: {
    amount: number;
    unit: string;
    timing: string[];
    frequency: string;
  };
  benefits?: string[];
  ingredients?: string[];
  sideEffects?: string[];
  contraindications?: string[];
  interactions?: string[];
  qualityStandards?: string[];
  researchRating?: 1 | 2 | 3 | 4 | 5;
  costLevel?: 'کم' | 'متوسط' | 'بالا';
  vegan?: boolean;
  allergens?: string[];
  storage?: string;
  shelfLife?: string;
  manufacturer?: string;
}

// Helper function to create supplement from name
function createSupplement(name: string, category: string, type: string): Supplement {
  const id = name.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '').replace(/\//g, '_');
  return {
    id,
    name,
    category,
    type,
    form: name.includes('پودر') || name.includes('پروتئین') || name.includes('گینر') ? 'پودر' : 
          name.includes('کپسول') ? 'کپسول' : 
          name.includes('قرص') ? 'قرص' : 
          name.includes('مایع') ? 'مایع' : 
          name.includes('ژل') ? 'ژل' : 
          name.includes('شربت') ? 'شربت' : 'کپسول',
    vegan: !name.includes('وی') && !name.includes('کازئین') && !name.includes('گوشت') && !name.includes('تخم') && !name.includes('ماهی'),
    allergens: name.includes('وی') || name.includes('کازئین') ? ['لبنیات'] : 
               name.includes('ماهی') ? ['ماهی'] : []
  };
}

// Supplements data from the original file
const supplementsDataRaw = [
  // پروتئین‌ها
  "پروتئین وی (Whey Protein)",
  "پروتئین وی ایزوله (Whey Isolate)",
  "پروتئین وی کنسانتره (Whey Concentrate)",
  "پروتئین وی هیدرولیزه (Whey Hydrolysate)",
  "پروتئین کازئین (Casein Protein)",
  "پروتئین کازئین میسلار (Micellar Casein)",
  "پروتئین تخم مرغ (Egg Protein)",
  "پروتئین گوشت (Beef Protein)",
  "پروتئین سویا (Soy Protein)",
  "پروتئین نخود (Pea Protein)",
  "پروتئین برنج (Rice Protein)",
  "پروتئین کنف (Hemp Protein)",
  "پروتئین گیاهی ترکیبی (Plant Blend)",
  "گینر (Mass Gainer)",
  "گینر کم‌قند (Low-Sugar Mass Gainer)",
  "گینر پرکربوهیدرات (High-Carb Mass Gainer)",
  
  // کراتین
  "کراتین مونوهیدرات (Creatine Monohydrate)",
  "کراتین اتیل استر (Creatine Ethyl Ester)",
  "کراتین هیدروکلراید (Creatine HCl)",
  "کراتین بافر شده (Buffered Creatine)",
  "کراتین مایکرو (Micronized Creatine)",
  "کراتین مایع (Liquid Creatine)",
  
  // آمینو اسیدها
  "BCAA (اسیدهای آمینه شاخه‌دار)",
  "BCAA 2:1:1",
  "BCAA 4:1:1",
  "BCAA 8:1:1",
  "EAA (اسیدهای آمینه ضروری)",
  "گلوتامین (Glutamine)",
  "گلوتامین پپتید (Glutamine Peptide)",
  "آرژنین (L-Arginine)",
  "سیترولین (Citrulline)",
  "سیترولین مالات (Citrulline Malate)",
  "تائورین (Taurine)",
  "گلیسین (Glycine)",
  "آلانین (Alanine)",
  "بتا آلانین (Beta-Alanine)",
  "HMB (هیدروکسی متیل بوتیرات)",
  "لوسین (Leucine)",
  "ایزولوسین (Isoleucine)",
  "والین (Valine)",
  
  // پری و پست ورک‌اوت
  "پمپ/پری ورک اوت (Pre-Workout)",
  "پری ورک‌اوت بدون کافئین (Stim-Free Pre-Workout)",
  "پری ورک‌اوت با کافئین بالا (High-Caffeine Pre-Workout)",
  "پست ورک‌اوت (Post-Workout)",
  "ریکاوری (Recovery)",
  "نوتریشن پست ورک‌اوت (Post-Workout Nutrition)",
  
  // ویتامین‌ها و مینرال‌ها
  "مولتی ویتامین مینرال",
  "مولتی ویتامین مردان",
  "مولتی ویتامین زنان",
  "مولتی ویتامین ورزشکاران",
  "ویتامین D3",
  "ویتامین D3 + K2",
  "ویتامین C",
  "ویتامین C با رهاسازی تدریجی",
  "ویتامین E",
  "ویتامین A",
  "ویتامین K",
  "ویتامین B کمپلکس",
  "ویتامین B1 (تیامین)",
  "ویتامین B2 (ریبوفلاوین)",
  "ویتامین B3 (نیاسین)",
  "ویتامین B5 (پانتوتنیک اسید)",
  "ویتامین B6",
  "ویتامین B7 (بیوتین)",
  "ویتامین B9 (فولیک اسید)",
  "ویتامین B12",
  "زینک (Zinc)",
  "زینک پیکولینات",
  "زینک گلوکونات",
  "منیزیم (Magnesium)",
  "منیزیم گلیسینات",
  "منیزیم سیترات",
  "منیزیم اکسید",
  "آهن (Iron)",
  "کلسیم (Calcium)",
  "فسفر (Phosphorus)",
  "سلنیوم (Selenium)",
  "کروم (Chromium)",
  "مس (Copper)",
  "منگنز (Manganese)",
  "مولیبدن (Molybdenum)",
  "ید (Iodine)",
  
  // چربی‌های سالم
  "امگا 3 (Omega-3)",
  "روغن ماهی (Fish Oil)",
  "روغن کریل (Krill Oil)",
  "DHA",
  "EPA",
  "ALA (آلفا لینولنیک اسید)",
  "CLA (کونژوگه لینولئیک اسید)",
  "MCT Oil",
  "روغن نارگیل",
  
  // چربی سوزها
  "ال-کارنیتین (L-Carnitine)",
  "ال-کارنیتین ال-تارتارات",
  "ال-کارنیتین فومارات",
  "گرین تی اکسید (Green Tea Extract)",
  "کافئین (Caffeine)",
  "کافئین آنهیدروس",
  "کافئین با رهاسازی تدریجی",
  "گوارانا",
  "یوهیمبین (Yohimbine)",
  "سینفرین (Synephrine)",
  "کپسایسین (Capsaicin)",
  "ال-تیروزین (L-Tyrosine)",
  "ال-فنیل آلانین (L-Phenylalanine)",
  
  // هورمون‌ها و تستوسترون
  "تریبولوس (Tribulus)",
  "فنوگریک (Fenugreek)",
  "اشواگاندا (Ashwagandha)",
  "گینسنگ (Ginseng)",
  "مکا (Maca)",
  "هورن گوآت (Horny Goat Weed)",
  "DHEA",
  "D-آسپارتیک اسید (D-Aspartic Acid)",
  
  // گوارش و آنزیم‌ها
  "پروبیوتیک",
  "پریبیوتیک",
  "آنزیم‌های گوارشی",
  "بروملین",
  "پاپائین",
  "لاکتاز",
  "لیپاز",
  "آمیلاز",
  "پروتئاز",
  
  // کلاژن و مفاصل
  "کلاژن (Collagen)",
  "کلاژن هیدرولیزه",
  "کلاژن نوع 1",
  "کلاژن نوع 2",
  "گلوکوزامین",
  "کندرویتین",
  "MSM",
  "هیالورونیک اسید",
  "کورکومین (Curcumin)",
  "زردچوبه",
  "بوسولیا",
  
  // خواب و آرامش
  "ملاتونین (Melatonin)",
  "گلیسین",
  "منیزیم (برای خواب)",
  "ال-تریپتوفان (L-Tryptophan)",
  "5-HTP",
  "والرین (Valerian)",
  "کامومیل",
  "لاوندر",
  
  // انرژی و استقامت
  "کوآنزیم Q10",
  "ال-کارنیتین (برای انرژی)",
  "ریبوز",
  "بتا آلانین (برای استقامت)",
  "سیترولین (برای استقامت)",
  "بیت آلانین",
  
  // آنتی‌اکسیدان‌ها
  "رسوراترول",
  "کوآنزیم Q10",
  "آلفا لیپوئیک اسید",
  "گلوتاتیون",
  "آستاگزانتین",
  "لیکوپن",
  "کوئرستین",
  
  // گیاهان دارویی
  "جینسینگ",
  "اشواگاندا",
  "رودیولا",
  "مکا",
  "تریبولوس",
  "فنوگریک",
  "هورن گوآت",
  "تونگکات علی",
  "یوهیمبین",
  
  // الکترولیت‌ها
  "الکترولیت",
  "سدیم",
  "پتاسیم",
  "منیزیم (الکترولیت)",
  "کلراید",
  "بیکربنات سدیم",
  
  // فیبر
  "پسیلیوم",
  "گلوکومانان",
  "اینولین",
  "فیبر محلول",
  "فیبر نامحلول",
  
  // سایر
  "کلاژن پپتید",
  "ال-گلوتاتیون",
  "NAC (N-Acetyl Cysteine)",
  "ال-سیستئین",
  "کولین",
  "اینوزیتول",
  "PQQ",
  "NAD+",
  "رسوراترول",
  "کورکومین",
  "EGCG",
  "کاتچین",
  "پلی فنول",
  "فلاونوئید",
  "آنتوسیانین",
  "کاروتنوئید",
  "لوتئین",
  "زآگزانتین",
  "بتا کاروتن"
];

// Convert to Supplement array
export const supplements: Supplement[] = supplementsDataRaw.map(name => {
  // Determine category and type based on name
  let category = 'سایر';
  let type = 'عمومی';
  
  if (name.includes('پروتئین') || name.includes('گینر')) {
    category = 'پروتئین';
    type = name.includes('وی') ? 'پروتئین وی' : 
           name.includes('کازئین') ? 'کازئین' : 
           name.includes('گیاهی') ? 'پروتئین گیاهی' : 'پروتئین';
  } else if (name.includes('کراتین')) {
    category = 'قدرت و عملکرد';
    type = 'کراتین';
  } else if (name.includes('BCAA') || name.includes('EAA') || name.includes('گلوتامین') || name.includes('آرژنین') || name.includes('سیترولین') || name.includes('آمینو')) {
    category = 'آمینو اسید';
    type = name.includes('BCAA') ? 'BCAA' : 
           name.includes('EAA') ? 'EAA' : 
           name.includes('گلوتامین') ? 'گلوتامین' : 'آمینو اسید';
  } else if (name.includes('پری') || name.includes('پست') || name.includes('ورک اوت') || name.includes('ریکاوری')) {
    category = 'قبل تمرین';
    type = name.includes('پری') ? 'پری ورک‌اوت' : 'پست ورک‌اوت';
  } else if (name.includes('ویتامین') || name.includes('زینک') || name.includes('منیزیم') || name.includes('آهن') || name.includes('کلسیم') || name.includes('مولتی')) {
    category = 'ویتامین و مینرال';
    type = name.includes('ویتامین') ? 'ویتامین' : 'مینرال';
  } else if (name.includes('امگا') || name.includes('روغن ماهی') || name.includes('MCT') || name.includes('CLA')) {
    category = 'چربی سالم';
    type = 'امگا-۳';
  } else if (name.includes('کارنیتین') || name.includes('چربی سوز') || name.includes('کافئین') || name.includes('گرین تی')) {
    category = 'چاقی سوزی';
    type = 'چربی سوز';
  } else if (name.includes('تستوسترون') || name.includes('تریبولوس') || name.includes('اشواگاندا') || name.includes('گینسنگ')) {
    category = 'تستوسترون';
    type = 'هورمون';
  } else if (name.includes('پروبیوتیک') || name.includes('آنزیم') || name.includes('گوارش')) {
    category = 'گوارش';
    type = 'آنزیم';
  } else if (name.includes('کلاژن') || name.includes('گلوکوزامین') || name.includes('مفصل')) {
    category = 'مفصل و ریکاوری';
    type = 'مفصل';
  } else if (name.includes('خواب') || name.includes('ملاتونین') || name.includes('آرامش')) {
    category = 'خواب و ریکاوری';
    type = 'خواب';
  } else if (name.includes('الکترولیت')) {
    category = 'الکترولیت';
    type = 'الکترولیت';
  } else if (name.includes('فیبر')) {
    category = 'فیبر';
    type = 'فیبر';
  }
  
  return createSupplement(name, category, type);
});

export default supplements;
