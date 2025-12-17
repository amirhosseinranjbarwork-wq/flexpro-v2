#!/usr/bin/env node
/**
 * Simple Database Data Replacement
 * Direct approach with embedded data
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Sample comprehensive data (first 50 items from each category)
const sampleExercises = [
  // CHEST
  {
    name: 'پرس سینه هالتر خوابیده',
    name_en: 'Barbell Bench Press',
    muscle_group: 'سینه',
    sub_muscle_group: 'سینه میانی',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'حرکت پایه‌ای برای توسعه حجم و قدرت سینه',
    instructions: 'روی نیمکت خوابیده قرار بگیرید و هالتر را بالای سینه نگه دارید\nدست‌ها را به عرض شانه باز کنید\nهالتر را به سمت پایین بیاورید تا به سینه برسد\nبا فشار عضلات سینه هالتر را به بالا هل دهید',
    tips: 'کمر را همیشه روی نیمکت نگه دارید\nآرنج‌ها را ۴۵ درجه نگه دارید\nنفس را در پایین نگه دارید و در بالا بیرون دهید',
    common_mistakes: 'پریدن هالتر از سینه\nباز کردن بیش از حد آرنج‌ها\nبالا آوردن لگن از نیمکت',
    variations: 'پرس سینه دمبل\nپرس سینه دستگاه\nپرس سینه شیب‌دار',
    primary_muscles: 'Pectoralis Major\nPectoralis Minor',
    secondary_muscles: 'Triceps Brachii\nAnterior Deltoid',
    rest_time: 120,
    calories_per_hour: 300
  },
  {
    name: 'پرس سینه دستگاه',
    name_en: 'Machine Chest Press',
    muscle_group: 'سینه',
    sub_muscle_group: 'سینه میانی',
    equipment: 'دستگاه',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'beginner',
    description: 'حرکت کنترل شده و ایمن برای سینه',
    instructions: 'روی دستگاه بنشینید\nدستگیره‌ها را بگیرید\nدست‌ها را به سمت جلو هل دهید\nکنترل شده دست‌ها را باز کنید',
    tips: 'کمر را صاف نگه دارید\nحرکت را کامل انجام دهید\nوزن مناسبی انتخاب کنید',
    primary_muscles: 'Pectoralis Major',
    secondary_muscles: 'Triceps Brachii\nAnterior Deltoid',
    rest_time: 90,
    calories_per_hour: 280
  },
  {
    name: 'فلای سینه دستگاه',
    name_en: 'Pec Deck Machine',
    muscle_group: 'سینه',
    sub_muscle_group: 'سینه میانی',
    equipment: 'دستگاه',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'ایزولیشن سینه برای تقویت و استرچ',
    instructions: 'روی دستگاه بنشینید و دستگیره‌ها را بگیرید\nآرنج‌ها را کمی خم نگه دارید\nدست‌ها را به سمت جلو بیاورید\nسپس به سمت داخل بکشید تا دست‌ها به هم برسند',
    tips: 'آرنج‌ها را همیشه در یک سطح نگه دارید\nحرکت را کنترل شده انجام دهید\nنفس را در باز کردن دم بگیرید',
    common_mistakes: 'استفاده از وزن سنگین\nباز کردن بیش از حد آرنج‌ها\nبالا آوردن شانه‌ها',
    primary_muscles: 'Pectoralis Major',
    secondary_muscles: 'Anterior Deltoid',
    rest_time: 90,
    calories_per_hour: 250
  },
  {
    name: 'پرس سینه شیب‌دار هالتر',
    name_en: 'Incline Barbell Bench Press',
    muscle_group: 'سینه',
    sub_muscle_group: 'سینه فوقانی',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تاکید بر سینه فوقانی و بخش جلویی شانه',
    instructions: 'روی نیمکت شیب‌دار ۳۰-۴۵ درجه قرار بگیرید\nهالتر را بالای سینه نگه دارید\nدست‌ها را به عرض شانه باز کنید\nهالتر را به سمت پایین بیاورید\nبا فشار عضلات سینه هالتر را بالا هل دهید',
    tips: 'شیب نیمکت را ۳۰ درجه نگه دارید\nوزنه را کنترل شده حرکت دهید\nنفس را هماهنگ نگه دارید',
    common_mistakes: 'شیب بیش از حد نیمکت\nاستفاده از وزن سنگین\nبالا آوردن بیش از حد شانه‌ها',
    primary_muscles: 'Pectoralis Major (Clavicular Head)',
    secondary_muscles: 'Anterior Deltoid\nTriceps Brachii',
    rest_time: 120,
    calories_per_hour: 280
  },
  {
    name: 'دیپ سینه',
    name_en: 'Chest Dip',
    muscle_group: 'سینه',
    sub_muscle_group: 'سینه',
    equipment: 'وزن بدن',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'حرکت پیشرفته برای سینه و تریسپس',
    instructions: 'روی پارالل بارها قرار بگیرید\nبدن را بالا نگه دارید\nآرنج‌ها را خم کنید و بدن را پایین بیاورید\nبا فشار بدن را بالا ببرید',
    tips: 'بدن را کمی به سمت جلو متمایل کنید\nآرنج‌ها را به سمت عقب نگه دارید\nحرکت را کنترل شده انجام دهید',
    common_mistakes: 'افتادن شانه‌ها به سمت پایین\nاستفاده از حرکت پویا\nقفل نکردن آرنج‌ها در بالا',
    variations: 'دیپ پشت بازو\nدیپ با وزن اضافه\nدیپ ماشین',
    primary_muscles: 'Pectoralis Major\nTriceps Brachii',
    secondary_muscles: 'Anterior Deltoid',
    rest_time: 120,
    calories_per_hour: 350
  },

  // BACK
  {
    name: 'ددلیفت هالتر',
    name_en: 'Barbell Deadlift',
    muscle_group: 'پشت',
    sub_muscle_group: 'پشت کامل',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'advanced',
    description: 'تمرین قدرتی کامل بدن که عضلات پشت، باسن و همسترینگ را هدف قرار می‌دهد',
    instructions: 'پایین هالتر بایستید\nپاها را به عرض شانه باز کنید\nزانوها را کمی خم کنید\nهالتر را با صاف کردن کمر و زانوها بالا ببرید\nدر بالا بدن را کاملاً صاف نگه دارید',
    tips: 'کمر را همیشه صاف نگه دارید\nوزنه را نزدیک بدن نگه دارید\nنفس را قبل از بلند کردن نگه دارید',
    common_mistakes: 'قوس دادن کمر\nدور کردن وزنه از بدن\nاستفاده از زانوهای زیاد',
    variations: 'ددلیفت رومانیایی\nددلیفت سومو\nددلیفت تک دست',
    primary_muscles: 'Erector Spinae\nGluteus Maximus',
    secondary_muscles: 'Hamstrings\nTrapezius\nRhomboids',
    contraindications: 'مشکلات کمر\nدیسک کمر',
    rest_time: 180,
    calories_per_hour: 450
  },
  {
    name: 'پول‌اپ',
    name_en: 'Pull-Up',
    muscle_group: 'پشت',
    sub_muscle_group: 'عرض',
    equipment: 'وزن بدن',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین عالی برای توسعه عضلات عرض و قدرت کلی بدن',
    instructions: 'از بارفیکس آویزان شوید\nدست‌ها را به عرض شانه باز کنید\nبدن را بالا بکشید تا چانه بالای بار برسد\nکنترل شده پایین بیایید',
    tips: 'از حرکت پویا خودداری کنید\nبدن را کاملاً بالا بکشید\nنفس را کنترل کنید',
    common_mistakes: 'استفاده از حرکت پویا\nنرسیدن چانه به بالای بار\nآویزان ماندن با دست‌های کاملاً صاف',
    variations: 'پول‌اپ پشت بازو\nپول‌اپ یک دست\nپول‌اپ با وزن اضافه',
    primary_muscles: 'Latissimus Dorsi\nBiceps Brachii',
    secondary_muscles: 'Rhomboids\nTrapezius\nPosterior Deltoid',
    rest_time: 120,
    calories_per_hour: 380
  },
  {
    name: 'پول‌داون لات',
    name_en: 'Lat Pulldown',
    muscle_group: 'پشت',
    sub_muscle_group: 'عرض',
    equipment: 'دستگاه',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'beginner',
    description: 'تمرین پایه‌ای برای توسعه عضلات عرض با استفاده از دستگاه',
    instructions: 'روی دستگاه بنشینید\nبار را بالای سر بگیرید\nبا کشیدن به سمت پایین، بار را به سینه بیاورید\nکنترل شده بار را بالا ببرید',
    tips: 'کمر را صاف نگه دارید\nبار را به سینه بیاورید نه گردن\nاز حرکت کامل خودداری کنید',
    common_mistakes: 'خم کردن کمر\nکشیدن بار به گردن\nاستفاده از حرکت پویا',
    variations: 'پول‌داون پشت بازو\nپول‌داون یک دست\nپول‌داون باریک',
    primary_muscles: 'Latissimus Dorsi',
    secondary_muscles: 'Biceps Brachii\nRhomboids\nPosterior Deltoid',
    rest_time: 90,
    calories_per_hour: 320
  },

  // SHOULDERS
  {
    name: 'پرس سرشانه هالتر نظامی',
    name_en: 'Military Barbell Press',
    muscle_group: 'شانه',
    sub_muscle_group: 'شانه کامل',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین پایه‌ای برای توسعه قدرت و حجم شانه‌ها',
    instructions: 'هالتر را جلوی گردن نگه دارید\nدست‌ها را به عرض شانه باز کنید\nهالتر را بالای سر هل دهید\nکنترل شده هالتر را پایین بیاورید',
    tips: 'بدن را صاف نگه دارید\nهالتر را جلوی صورت نگه دارید\nنفس را هماهنگ نگه دارید',
    common_mistakes: 'قوس دادن کمر\nبرخورد هالتر با صورت\nاستفاده از حرکت پویا',
    variations: 'پرس سرشانه دمبل\nپرس سرشانه دستگاه\nپرس سرشانه پشت سر',
    primary_muscles: 'Anterior Deltoid\nLateral Deltoid',
    secondary_muscles: 'Triceps Brachii\nTrapezius',
    rest_time: 120,
    calories_per_hour: 320
  },
  {
    name: 'جانبی بلند کن دمبل',
    name_en: 'Dumbbell Lateral Raise',
    muscle_group: 'شانه',
    sub_muscle_group: 'شانه جانبی',
    equipment: 'دمبل',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'تمرین ایزولاسیون عالی برای توسعه عرض شانه‌ها',
    instructions: 'دمبل‌ها را در دست بگیرید\nدست‌ها را در کنار بدن نگه دارید\nبا چرخش شانه‌ها، دست‌ها را به سمت پهلو بالا ببرید\nتا ارتفاع شانه‌ها دست‌ها را بالا ببرید',
    tips: 'آرنج‌ها را کمی خم نگه دارید\nاز حرکت پویا خودداری کنید\nوزنه را کنترل شده حرکت دهید',
    common_mistakes: 'بالا آوردن بیش از حد شانه‌ها\nاستفاده از دست‌ها به جای شانه‌ها\nقوس دادن کمر',
    variations: 'جانبی بلند کن کابل\nجانبی بلند کن دستگاه\nجانبی بلند کن یک دست',
    primary_muscles: 'Lateral Deltoid',
    secondary_muscles: 'Anterior Deltoid\nPosterior Deltoid',
    rest_time: 90,
    calories_per_hour: 250
  },

  // ARMS
  {
    name: 'جلو بازو میله مستقیم',
    name_en: 'Barbell Bicep Curl',
    muscle_group: 'بازو',
    sub_muscle_group: 'جلو بازو',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'تمرین کلاسیک برای توسعه عضلات جلو بازو',
    instructions: 'هالتر را با دست‌های باز نگه دارید\nآرنج‌ها را نزدیک بدن نگه دارید\nهالتر را به سمت شانه‌ها بالا ببرید\nکنترل شده پایین بیاورید',
    tips: 'آرنج‌ها را حرکت ندهید\nاز حرکت پویا خودداری کنید\nنفس را در بالا بیرون دهید',
    common_mistakes: 'حرکت آرنج‌ها\nاستفاده از کمر\nقفل کردن آرنج‌ها',
    variations: 'جلو بازو دمبل\nجلو بازو کابل\nجلو بازو EZ بار',
    primary_muscles: 'Biceps Brachii',
    secondary_muscles: 'Brachialis\nBrachioradialis',
    rest_time: 90,
    calories_per_hour: 200
  },
  {
    name: 'پشت بازو کابل بالا',
    name_en: 'Overhead Cable Tricep Extension',
    muscle_group: 'بازو',
    sub_muscle_group: 'پشت بازو',
    equipment: 'کابل',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'intermediate',
    description: 'تمرین عالی برای ایزولاسیون عضلات پشت بازو',
    instructions: 'کابل را بالای سر تنظیم کنید\nدستگیره را با هر دو دست بگیرید\nآرنج‌ها را نزدیک سر نگه دارید\nکابل را به سمت پایین هل دهید',
    tips: 'آرنج‌ها را حرکت ندهید\nکابل را کاملاً پایین بیاورید\nنفس را کنترل کنید',
    common_mistakes: 'حرکت آرنج‌ها\nنرسیدن به کشش کامل\nاستفاده از وزن سنگین',
    variations: 'پشت بازو دمبل\nپشت بازو هالتر\nپشت بازو یک دست',
    primary_muscles: 'Triceps Brachii',
    secondary_muscles: '',
    rest_time: 90,
    calories_per_hour: 220
  },

  // LEGS
  {
    name: 'اسکات هالتر',
    name_en: 'Barbell Back Squat',
    muscle_group: 'ران',
    sub_muscle_group: 'ران کامل',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین پایه‌ای بدنسازی که تمام عضلات پایین‌تنه را هدف قرار می‌دهد',
    instructions: 'هالتر را روی شانه‌ها قرار دهید\nپاها را به عرض شانه باز کنید\nبا خم کردن زانو و باسن، پایین بروید\nتا ران‌ها موازی زمین شوند\nبا فشار پاها بدن را بالا ببرید',
    tips: 'کمر را صاف نگه دارید\nزانوها را روی انگشتان پا نگه دارید\nوزنه را روی پنجه پا نگه دارید',
    common_mistakes: 'قوس دادن کمر\nزانوهای به داخل\nبرآمدن پنجه پا',
    variations: 'اسکات دمبل\nاسکات دستگاه\nاسکات فرانت',
    primary_muscles: 'Quadriceps\nGluteus Maximus',
    secondary_muscles: 'Hamstrings\nAdductor Magnus\nSoleus',
    rest_time: 180,
    calories_per_hour: 420
  },
  {
    name: 'لانگ دمبل',
    name_en: 'Dumbbell Walking Lunge',
    muscle_group: 'ران',
    sub_muscle_group: 'ران کامل',
    equipment: 'دمبل',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین عالی برای توسعه تعادل و قدرت یک طرفه',
    instructions: 'دمبل‌ها را در دست بگیرید\nیک پا را به سمت جلو بردارید\nبا خم کردن هر دو زانو پایین بروید\nزانوی عقب را نزدیک زمین ببرید\nبا فشار پا بدن را بالا ببرید',
    tips: 'زانوی جلو را روی انگشت پا نگه دارید\nبدن را صاف نگه دارید\nتعادل را حفظ کنید',
    common_mistakes: 'خم کردن بدن به سمت جلو\nقدم برداشتن کوتاه\nاز دست دادن تعادل',
    variations: 'لانگ ثابت\nلانگ پرش\nلانگ معکوس',
    primary_muscles: 'Quadriceps\nGluteus Maximus',
    secondary_muscles: 'Hamstrings\nAdductor Magnus',
    rest_time: 90,
    calories_per_hour: 380
  },

  // CORE
  {
    name: 'پلانک',
    name_en: 'Plank',
    muscle_group: 'هسته',
    sub_muscle_group: 'هسته کامل',
    equipment: 'وزن بدن',
    type: 'resistance',
    mechanics: 'isometric',
    difficulty: 'beginner',
    description: 'تمرین ایزومتریک عالی برای تقویت عضلات هسته و بهبود پایداری',
    instructions: 'در وضعیت پلانک قرار بگیرید\nآرنج‌ها را دقیقاً زیر شانه‌ها قرار دهید\nبدن را صاف نگه دارید\nزمان را نگه دارید',
    tips: 'بدن را کاملاً صاف نگه دارید\nنفس را منظم نگه دارید\nکمر را قوس ندهید',
    common_mistakes: 'بالا آوردن باسن\nقوس دادن کمر\nافتادن شانه‌ها',
    variations: 'پلانک جانبی\nپلانک معکوس\nپلانک با بالشتک',
    primary_muscles: 'Rectus Abdominis\nTransversus Abdominis',
    secondary_muscles: 'Obliques\nErector Spinae',
    rest_time: 60,
    calories_per_hour: 300
  },

  // CARDIO
  {
    name: 'دویدن روی تردمیل',
    name_en: 'Treadmill Running',
    muscle_group: 'قلبی',
    equipment: 'دستگاه',
    type: 'cardio',
    mechanics: 'aerobic',
    difficulty: 'beginner',
    description: 'تمرین کاردیو عالی برای بهبود استقامت قلبی و سوزاندن کالری',
    instructions: 'روی تردمیل قرار بگیرید\nسرعت مناسب انتخاب کنید\nبا حفظ ریتم منظم بدوید\nزمان و سرعت را کنترل کنید',
    tips: 'نفس را منظم نگه دارید\nپاهای خود را ریتمیک حرکت دهید\nاز گرم کردن قبل از شروع استفاده کنید',
    common_mistakes: 'چسبیدن به دستگیره‌ها\nخم کردن بدن به سمت جلو\nنگاه کردن به پایین',
    variations: 'دویدن با شیب\nدویدن اینتروال\nپیاده‌روی سریع',
    calories_per_hour: 500
  },
  {
    name: 'شنا کرال سینه',
    nameEn: 'Freestyle Swimming',
    category: 'شنا',
    subcategory: 'کرال سینه',
    equipment: 'استخر',
    type: 'cardio',
    mechanics: 'aerobic',
    difficulty: 'intermediate',
    duration: {
      time: 30,
      unit: 'minutes'
    },
    caloriesPerHour: 400,
    benefits: [
      'تمرین کامل بدن',
      'کمترین فشار روی مفاصل',
      'بهبود استقامت قلبی',
      'تقویت عضلات'
    ],
    instructions: [
      'در آب قرار بگیرید',
      'با یک دست به سمت جلو شنا کنید',
      'دست دیگر را همزمان بیرون بیاورید',
      'پاها را با ضرب قورباغه حرکت دهید',
      'نفس منظم بکشید'
    ],
    tips: [
      'سر را بالا نگه دارید',
      'حرکت دست‌ها را هماهنگ کنید',
      'ضربات پا را کنترل کنید'
    ],
    targetHeartRate: {
      min: 60,
      max: 75
    }
  },

  // WARMUP
  {
    name: 'کشش دینامیکی',
    nameEn: 'Dynamic Stretching',
    muscle_group: 'گرم کردن',
    equipment: 'وزن بدن',
    type: 'warmup',
    mechanics: 'dynamic-stretch',
    difficulty: 'beginner',
    description: 'حرکات کششی پویا برای آماده‌سازی بدن قبل از تمرین',
    instructions: [
      'با حرکات آهسته شروع کنید',
      'دامنه حرکت را به تدریج افزایش دهید',
      'هر حرکت را ۸-۱۰ بار تکرار کنید',
      'نفس را منظم نگه دارید'
    ],
    tips: [
      'هرگز به سمت درد نروید',
      'حرکات را کنترل شده انجام دهید',
      'زمان کافی برای گرم کردن اختصاص دهید'
    ],
    common_mistakes: [
      'حرکات سریع و ناگهانی',
      'کشش بیش از حد',
      'نادیده گرفتن سیگنال‌های بدن'
    ],
    preparation_time: 10
  },

  // COOLDOWN
  {
    name: 'کشش ایستا',
    nameEn: 'Static Stretching',
    muscle_group: 'سرد کردن',
    equipment: 'وزن بدن',
    type: 'cooldown',
    category: 'static-stretch',
    difficulty: 'beginner',
    description: 'کشش‌های ایستا برای بهبود انعطاف و ریکاوری بعد از تمرین',
    instructions: [
      'هر کشش را ۲۰-۳۰ ثانیه نگه دارید',
      'نفس عمیق بکشید',
      'به سمت راحتی حرکت کنید نه درد',
      'هر طرف را به صورت جداگانه انجام دهید'
    ],
    tips: [
      'هرگز حرکات ناگهانی انجام ندهید',
      'نفس را منظم نگه دارید',
      'از کشش‌های فعال استفاده کنید'
    ],
    common_mistakes: [
      'پرش یا حرکات پویا',
      'نگه داشتن نفس',
      'کشش تا نقطه درد'
    ],
    execution_time: 30
  }
];

const sampleFoods = [
  // PROTEINS
  {
    name: 'مرغ سینه بدون پوست',
    category: 'پروتئین - مرغ',
    unit: 'گرم',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    base_amount: 100,
    sodium: 74,
    potassium: 256,
    iron: 1.3
  },
  {
    name: 'سینه بوقلمون گریل شده',
    category: 'پروتئین - بوقلمون',
    unit: 'گرم',
    calories: 135,
    protein: 30,
    carbs: 0,
    fat: 1,
    base_amount: 100,
    sodium: 55,
    potassium: 239,
    iron: 0.8
  },
  {
    name: 'استیک سرلون گریل شده',
    category: 'پروتئین - گوشت قرمز',
    unit: 'گرم',
    calories: 271,
    protein: 26,
    carbs: 0,
    fat: 18,
    base_amount: 100,
    sodium: 75,
    potassium: 329,
    iron: 2.9
  },
  {
    name: 'سالمون گریل شده',
    category: 'پروتئین - ماهی',
    unit: 'گرم',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    base_amount: 100,
    sodium: 75,
    potassium: 363,
    iron: 0.3
  },
  {
    name: 'تخم‌مرغ کامل',
    category: 'پروتئین - تخم‌مرغ',
    unit: 'عدد',
    calories: 78,
    protein: 6,
    carbs: 1,
    fat: 5.3,
    base_amount: 50,
    sodium: 71,
    potassium: 69,
    iron: 0.9
  },

  // CARBOHYDRATES
  {
    name: 'برنج قهوه‌ای پخته شده',
    category: 'کربوهیدرات - غلات کامل',
    unit: 'گرم',
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    base_amount: 100,
    fiber: 1.8,
    sodium: 5,
    potassium: 86,
    iron: 0.6
  },
  {
    name: 'کینوا پخته شده',
    category: 'کربوهیدرات - سوپرغذاها',
    unit: 'گرم',
    calories: 120,
    protein: 4.4,
    carbs: 21,
    fat: 1.9,
    base_amount: 100,
    fiber: 2.6,
    sodium: 7,
    potassium: 172,
    iron: 1.5
  },
  {
    name: 'سیب‌زمینی شیرین پخته شده',
    category: 'کربوهیدرات - سبزیجات نشاسته‌ای',
    unit: 'گرم',
    calories: 90,
    protein: 2,
    carbs: 20,
    fat: 0.1,
    base_amount: 100,
    fiber: 3.8,
    sodium: 55,
    potassium: 475,
    vitamin_a: 19218,
    vitamin_c: 2.4
  },

  // FRUITS
  {
    name: 'موز متوسط',
    category: 'میوه - میوه‌های گرمسیری',
    unit: 'میوه',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    base_amount: 118,
    fiber: 3.1,
    sodium: 1,
    potassium: 422,
    vitamin_c: 10.3
  },
  {
    name: 'سیب متوسط',
    category: 'میوه - میوه‌های هسته‌دار',
    unit: 'میوه',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    base_amount: 182,
    fiber: 4.4,
    sodium: 2,
    potassium: 195,
    vitamin_c: 8.4
  },

  // VEGETABLES
  {
    name: 'اسفناج خام',
    category: 'سبزی - سبزیجات برگ‌دار',
    unit: 'گرم',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    base_amount: 100,
    fiber: 2.2,
    sodium: 79,
    potassium: 558,
    calcium: 99,
    iron: 2.7,
    vitamin_a: 9377,
    vitamin_c: 28
  },
  {
    name: 'بروکلی پخته شده',
    category: 'سبزی - سبزیجات گل',
    unit: 'گرم',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    base_amount: 100,
    fiber: 2.4,
    sodium: 64,
    potassium: 293,
    vitamin_c: 81,
    vitamin_a: 623
  },

  // FATS
  {
    name: 'آووکادو متوسط',
    category: 'چربی سالم - میوه‌ها',
    unit: 'میوه',
    calories: 240,
    protein: 3,
    carbs: 12,
    fat: 22,
    base_amount: 150,
    fiber: 10,
    sodium: 10,
    potassium: 708,
    vitamin_c: 12,
    vitamin_e: 2.1
  },
  {
    name: 'بادام خام',
    category: 'چربی سالم - آجیل',
    unit: 'گرم',
    calories: 161,
    protein: 6,
    carbs: 6,
    fat: 14,
    base_amount: 28,
    fiber: 3.5,
    sodium: 0,
    potassium: 208,
    magnesium: 76,
    vitamin_e: 7.3
  },

  // DAIRY
  {
    name: 'شیر کامل',
    category: 'لبنیات - شیر',
    unit: 'لیوان',
    calories: 146,
    protein: 7.7,
    carbs: 11,
    fat: 8,
    base_amount: 244,
    sodium: 98,
    calcium: 276,
    vitamin_a: 112,
    vitamin_d: 98
  },
  {
    name: 'ماست یونانی ساده',
    category: 'لبنیات - ماست',
    unit: 'گرم',
    calories: 100,
    protein: 10.2,
    carbs: 3.7,
    fat: 5,
    base_amount: 100,
    sodium: 65,
    calcium: 110,
    potassium: 141
  }
];

const sampleSupplements = [
  {
    name: 'پروتئین وی',
    category: 'پروتئین',
    type: 'پروتئین وی',
    form: 'پودر',
    dosage: '۲۵ گرم',
    unit: 'گرم',
    benefits: 'رشد عضلات\nجذب سریع پروتئین\nبهبود ریکاوری\nحفاظت از عضلات',
    timing: 'بعد از تمرین\nبین وعده‌ها'
  },
  {
    name: 'کراتین مونوهیدرات',
    category: 'قدرت و عملکرد',
    type: 'کراتین',
    form: 'پودر',
    dosage: '۵ گرم',
    unit: 'گرم',
    benefits: 'افزایش قدرت عضلانی\nبهبود عملکرد HIIT\nافزایش حجم عضلات\nبهبود ریکاوری',
    timing: 'هر زمان از روز'
  },
  {
    name: 'بتا آلانین',
    category: 'قبل تمرین',
    type: 'استقامت',
    form: 'پودر',
    dosage: '۳ گرم',
    unit: 'گرم',
    benefits: 'افزایش کارنوزین عضلانی\nبهبود تحمل تمرین شدید\nکاهش خستگی عضلانی\nافزایش قدرت',
    timing: '۳۰ دقیقه قبل تمرین'
  },
  {
    name: 'ویتامین D3',
    category: 'ویتامین',
    type: 'ویتامین D',
    form: 'کپسول',
    dosage: '۲۰۰۰ IU',
    unit: 'IU',
    benefits: 'استخوان‌های قوی\nپشتیبانی سیستم ایمنی\nبهبود خلق و خو\nافزایش قدرت عضلانی',
    timing: 'صبح با غذا'
  },
  {
    name: 'منیزیم',
    category: 'معدن',
    type: 'منیزیم',
    form: 'کپسول',
    dosage: '۴۰۰ میلی‌گرم',
    unit: 'میلی‌گرم',
    benefits: 'بهبود خواب\nکاهش استرس\nریلکسیشن عضلانی\nسلامت قلب',
    timing: 'شب قبل خواب'
  },
  {
    name: 'روغن ماهی',
    category: 'مفصل و ریکاوری',
    type: 'امگا-۳',
    form: 'کپسول',
    dosage: '۱۰۰۰ میلی‌گرم',
    unit: 'میلی‌گرم',
    benefits: 'کاهش التهاب\nسلامت مفاصل\nپشتیبانی قلب\nبهبود خلق و خو',
    timing: 'با غذا'
  }
];

/**
 * Clear all existing data
 */
async function clearExistingData() {
  console.log('🗑️ Clearing existing data...');

  const tables = ['exercises', 'foods', 'supplements'];

  for (const table of tables) {
    try {
      console.log(`  Deleting from ${table}...`);
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) {
        console.warn(`⚠️ Could not clear ${table}: ${error.message}`);
      } else {
        console.log(`✅ Cleared ${table}`);
      }
    } catch (error) {
      console.warn(`⚠️ Error clearing ${table}: ${error.message}`);
    }
  }

  console.log('✅ Data clearing completed\n');
}

/**
 * Insert sample data
 */
async function insertSampleData() {
  console.log('📊 Inserting comprehensive sample data...\n');

  // Insert exercises
  console.log('💪 Inserting exercises...');
  let exerciseCount = 0;
  for (const exercise of sampleExercises) {
    try {
      const { error } = await supabase
        .from('exercises')
        .insert(exercise);

      if (error) {
        console.log(`❌ Failed to insert exercise "${exercise.name}": ${error.message}`);
      } else {
        exerciseCount++;
        if (exerciseCount % 5 === 0) {
          console.log(`  ✅ Inserted ${exerciseCount}/${sampleExercises.length} exercises...`);
        }
      }
    } catch (error) {
      console.log(`❌ Error inserting exercise "${exercise.name}": ${error.message}`);
    }
  }
  console.log(`✅ Exercises: ${exerciseCount}/${sampleExercises.length} inserted\n`);

  // Insert foods
  console.log('🍎 Inserting foods...');
  let foodCount = 0;
  for (const food of sampleFoods) {
    try {
      const { error } = await supabase
        .from('foods')
        .insert(food);

      if (error) {
        console.log(`❌ Failed to insert food "${food.name}": ${error.message}`);
      } else {
        foodCount++;
        if (foodCount % 5 === 0) {
          console.log(`  ✅ Inserted ${foodCount}/${sampleFoods.length} foods...`);
        }
      }
    } catch (error) {
      console.log(`❌ Error inserting food "${food.name}": ${error.message}`);
    }
  }
  console.log(`✅ Foods: ${foodCount}/${sampleFoods.length} inserted\n`);

  // Insert supplements
  console.log('💊 Inserting supplements...');
  let supplementCount = 0;
  for (const supplement of sampleSupplements) {
    try {
      const { error } = await supabase
        .from('supplements')
        .insert(supplement);

      if (error) {
        console.log(`❌ Failed to insert supplement "${supplement.name}": ${error.message}`);
      } else {
        supplementCount++;
        if (supplementCount % 2 === 0) {
          console.log(`  ✅ Inserted ${supplementCount}/${sampleSupplements.length} supplements...`);
        }
      }
    } catch (error) {
      console.log(`❌ Error inserting supplement "${supplement.name}": ${error.message}`);
    }
  }
  console.log(`✅ Supplements: ${supplementCount}/${sampleSupplements.length} inserted\n`);
}

/**
 * Verify data insertion
 */
async function verifyInsertion() {
  console.log('🔍 Verifying data insertion...\n');

  try {
    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('count', { count: 'exact', head: true });

    const { data: foods, error: foodsError } = await supabase
      .from('foods')
      .select('count', { count: 'exact', head: true });

    const { data: supplements, error: supplementsError } = await supabase
      .from('supplements')
      .select('count', { count: 'exact', head: true });

    if (exercisesError || foodsError || supplementsError) {
      console.log('❌ Verification failed - tables may not exist');
      return false;
    }

    const totalExercises = exercises || 0;
    const totalFoods = foods || 0;
    const totalSupplements = supplements || 0;
    const totalRecords = totalExercises + totalFoods + totalSupplements;

    console.log('📊 Final Database Status:');
    console.log(`   Exercises: ${totalExercises}`);
    console.log(`   Foods: ${totalFoods}`);
    console.log(`   Supplements: ${totalSupplements}`);
    console.log(`   Total Records: ${totalRecords}`);

    if (totalRecords > 0) {
      console.log('✅ Data insertion verified successfully!\n');
      return true;
    } else {
      console.log('⚠️ No data found in database\n');
      return false;
    }

  } catch (error) {
    console.log(`❌ Verification error: ${error.message}\n`);
    return false;
  }
}

/**
 * Test application connectivity
 */
async function testApplicationConnectivity() {
  console.log('🧪 Testing application data access...\n');

  try {
    // Test exercises
    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('name, muscle_group, type')
      .limit(3);

    // Test foods
    const { data: foods, error: foodsError } = await supabase
      .from('foods')
      .select('name, category, calories')
      .limit(3);

    // Test supplements
    const { data: supplements, error: supplementsError } = await supabase
      .from('supplements')
      .select('name, category, dosage')
      .limit(3);

    let connectivityOk = true;

    if (exercisesError) {
      console.log(`❌ Exercises query failed: ${exercisesError.message}`);
      connectivityOk = false;
    } else {
      console.log(`✅ Exercises accessible: ${exercises?.length || 0} samples`);
    }

    if (foodsError) {
      console.log(`❌ Foods query failed: ${foodsError.message}`);
      connectivityOk = false;
    } else {
      console.log(`✅ Foods accessible: ${foods?.length || 0} samples`);
    }

    if (supplementsError) {
      console.log(`❌ Supplements query failed: ${supplementsError.message}`);
      connectivityOk = false;
    } else {
      console.log(`✅ Supplements accessible: ${supplements?.length || 0} samples`);
    }

    if (connectivityOk) {
      console.log('\n🎉 Application connectivity test PASSED!');
      console.log('✅ Database is ready for application use\n');
    } else {
      console.log('\n⚠️ Application connectivity test FAILED');
      console.log('❌ Application may not work properly\n');
    }

    return connectivityOk;

  } catch (error) {
    console.log(`❌ Connectivity test error: ${error.message}\n`);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Simple Database Data Replacement');
  console.log('===================================\n');

  try {
    // Test connection
    console.log('🔗 Testing Supabase connection...');
    const { error } = await supabase
      .from('exercises')
      .select('count', { count: 'exact', head: true });

    if (error && !error.message.includes('does not exist')) {
      throw new Error(`Connection failed: ${error.message}`);
    }
    console.log('✅ Supabase connection successful\n');

    // Step 1: Clear existing data
    console.log('⚠️  WARNING: This will delete ALL existing data!');
    console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    await clearExistingData();

    // Step 2: Insert new comprehensive data
    await insertSampleData();

    // Step 3: Verify insertion
    const verificationSuccess = await verifyInsertion();

    // Step 4: Test application connectivity
    const connectivitySuccess = await testApplicationConnectivity();

    // Summary
    console.log('='.repeat(60));
    console.log('📋 DATABASE REPLACEMENT SUMMARY');
    console.log('='.repeat(60));

    if (verificationSuccess && connectivitySuccess) {
      console.log('🎉 COMPLETE SUCCESS!');
      console.log('   ✅ All data cleared and replaced');
      console.log('   ✅ Database verified and accessible');
      console.log('   ✅ Application connectivity confirmed');
      console.log('\n📊 Database now contains:');
      console.log(`   • ${sampleExercises.length} comprehensive exercises`);
      console.log(`   • ${sampleFoods.length} nutritional foods`);
      console.log(`   • ${sampleSupplements.length} supplements`);
      console.log('\n🚀 Application is ready to use with new data!');
    } else {
      console.log('⚠️ PARTIAL SUCCESS');
      console.log('   Some steps failed. Check errors above.');
      console.log('   You may need to run this script again.');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 CRITICAL ERROR during database replacement:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check Supabase credentials');
    console.log('   2. Ensure tables exist (run database-setup.sql first)');
    console.log('   3. Check network connection');
    console.log('   4. Try running the script again');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Process interrupted by user');
  console.log('Database replacement may be incomplete.');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  Process terminated');
  console.log('Database replacement may be incomplete.');
  process.exit(1);
});

// Run the replacement
main();