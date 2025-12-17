#!/usr/bin/env node
/**
 * Local Data Setup for Development
 * Sets up local data storage when Supabase is not available
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load comprehensive data (first 50 items from each category)
const sampleExercises = [
  // CHEST
  {
    id: 'chest_bench_press_barbell',
    name: 'پرس سینه هالتر خوابیده',
    nameEn: 'Barbell Bench Press',
    muscleGroup: 'سینه',
    subMuscleGroup: 'سینه میانی',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'حرکت پایه‌ای برای توسعه حجم و قدرت سینه',
    instructions: 'روی نیمکت خوابیده قرار بگیرید و هالتر را بالای سینه نگه دارید\nدست‌ها را به عرض شانه باز کنید\nهالتر را به سمت پایین بیاورید تا به سینه برسد\nبا فشار عضلات سینه هالتر را به بالا هل دهید',
    tips: 'کمر را همیشه روی نیمکت نگه دارید\nآرنج‌ها را ۴۵ درجه نگه دارید\nنفس را در پایین نگه دارید و در بالا بیرون دهید',
    commonMistakes: 'پریدن هالتر از سینه\nباز کردن بیش از حد آرنج‌ها\nبالا آوردن لگن از نیمکت',
    variations: 'پرس سینه دمبل\nپرس سینه دستگاه\nپرس سینه شیب‌دار',
    primaryMuscles: 'Pectoralis Major\nPectoralis Minor',
    secondaryMuscles: 'Triceps Brachii\nAnterior Deltoid',
    restTime: 120,
    caloriesPerHour: 300
  },
  {
    id: 'chest_incline_press_barbell',
    name: 'پرس سینه شیب‌دار هالتر',
    nameEn: 'Incline Barbell Bench Press',
    muscleGroup: 'سینه',
    subMuscleGroup: 'سینه فوقانی',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تاکید بر سینه فوقانی و بخش جلویی شانه',
    instructions: 'روی نیمکت شیب‌دار ۳۰-۴۵ درجه قرار بگیرید\nهالتر را بالای سینه نگه دارید\nدست‌ها را به عرض شانه باز کنید\nهالتر را به سمت پایین بیاورید\nبا فشار عضلات سینه هالتر را بالا هل دهید',
    tips: 'شیب نیمکت را ۳۰ درجه نگه دارید\nوزنه را کنترل شده حرکت دهید\nنفس را هماهنگ نگه دارید',
    commonMistakes: 'شیب بیش از حد نیمکت\nاستفاده از وزن سنگین\nبالا آوردن بیش از حد شانه‌ها',
    primaryMuscles: 'Pectoralis Major (Clavicular Head)',
    secondaryMuscles: 'Anterior Deltoid\nTriceps Brachii',
    restTime: 120,
    caloriesPerHour: 280
  },
  {
    id: 'chest_fly_machine',
    name: 'فلای سینه دستگاه',
    nameEn: 'Pec Deck Machine',
    muscleGroup: 'سینه',
    subMuscleGroup: 'سینه میانی',
    equipment: 'دستگاه',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'ایزولیشن سینه برای تقویت و استرچ',
    instructions: 'روی دستگاه بنشینید و دستگیره‌ها را بگیرید\nآرنج‌ها را کمی خم نگه دارید\nدست‌ها را به سمت جلو بیاورید\nسپس به سمت داخل بکشید تا دست‌ها به هم برسند',
    tips: 'آرنج‌ها را همیشه در یک سطح نگه دارید\nحرکت را کنترل شده انجام دهید\nنفس را در باز کردن دم بگیرید',
    commonMistakes: 'استفاده از وزن سنگین\nباز کردن بیش از حد آرنج‌ها\nبالا آوردن شانه‌ها',
    primaryMuscles: 'Pectoralis Major',
    secondaryMuscles: 'Anterior Deltoid',
    restTime: 90,
    caloriesPerHour: 250
  },
  {
    id: 'chest_push_up',
    name: 'شنا سینه',
    nameEn: 'Push-Up',
    muscleGroup: 'سینه',
    subMuscleGroup: 'سینه میانی',
    equipment: 'وزن بدن',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'beginner',
    description: 'تمرین کلاسیک بدنسازی که عضلات سینه، شانه و بازو را درگیر می‌کند',
    instructions: 'در وضعیت پلانک قرار بگیرید\nدست‌ها را به عرض شانه باز کنید\nبدن را پایین بیاورید تا سینه به زمین نزدیک شود\nبا فشار بدن را بالا ببرید',
    tips: 'بدن را صاف نگه دارید\nکمر را قوس ندهید\nنفس را هماهنگ نگه دارید',
    commonMistakes: 'قوس دادن کمر\nآوردن شانه‌ها به سمت جلو\nبالا آوردن باسن',
    variations: 'شنا سینه پاشنه\nشنا سینه الماسی\nشنا سینه یک دست',
    primaryMuscles: 'Pectoralis Major\nTriceps Brachii',
    secondaryMuscles: 'Anterior Deltoid\nSerratus Anterior',
    restTime: 60,
    caloriesPerHour: 400
  },

  // BACK
  {
    id: 'back_deadlift_barbell',
    name: 'ددلیفت هالتر',
    nameEn: 'Barbell Deadlift',
    muscleGroup: 'پشت',
    subMuscleGroup: 'پشت کامل',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'advanced',
    description: 'تمرین قدرتی کامل بدن که عضلات پشت، باسن و همسترینگ را هدف قرار می‌دهد',
    instructions: 'پایین هالتر بایستید\nپاها را به عرض شانه باز کنید\nزانوها را کمی خم کنید\nهالتر را با صاف کردن کمر و زانوها بالا ببرید\nدر بالا بدن را کاملاً صاف نگه دارید',
    tips: 'کمر را همیشه صاف نگه دارید\nوزنه را نزدیک بدن نگه دارید\nنفس را قبل از بلند کردن نگه دارید',
    commonMistakes: 'قوس دادن کمر\nدور کردن وزنه از بدن\nاستفاده از زانوهای زیاد',
    variations: 'ددلیفت رومانیایی\nددلیفت سومو\nددلیفت تک دست',
    primaryMuscles: 'Erector Spinae\nGluteus Maximus',
    secondaryMuscles: 'Hamstrings\nTrapezius\nRhomboids',
    contraindications: 'مشکلات کمر\nدیسک کمر',
    restTime: 180,
    caloriesPerHour: 450
  },
  {
    id: 'back_pull_up',
    name: 'پول‌اپ',
    nameEn: 'Pull-Up',
    muscleGroup: 'پشت',
    subMuscleGroup: 'عرض',
    equipment: 'وزن بدن',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین عالی برای توسعه عضلات عرض و قدرت کلی بدن',
    instructions: 'از بارفیکس آویزان شوید\nدست‌ها را به عرض شانه باز کنید\nبدن را بالا بکشید تا چانه بالای بار برسد\nکنترل شده پایین بیایید',
    tips: 'از حرکت پویا خودداری کنید\nبدن را کاملاً بالا بکشید\nنفس را کنترل کنید',
    commonMistakes: 'استفاده از حرکت پویا\nنرسیدن چانه به بالای بار\nآویزان ماندن با دست‌های کاملاً صاف',
    variations: 'پول‌اپ پشت بازو\nپول‌اپ یک دست\nپول‌اپ با وزن اضافه',
    primaryMuscles: 'Latissimus Dorsi\nBiceps Brachii',
    secondaryMuscles: 'Rhomboids\nTrapezius\nPosterior Deltoid',
    restTime: 120,
    caloriesPerHour: 380
  },
  {
    id: 'back_lat_pulldown',
    name: 'پول‌داون لات',
    nameEn: 'Lat Pulldown',
    muscleGroup: 'پشت',
    subMuscleGroup: 'عرض',
    equipment: 'دستگاه',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'beginner',
    description: 'تمرین پایه‌ای برای توسعه عضلات عرض با استفاده از دستگاه',
    instructions: 'روی دستگاه بنشینید\nبار را بالای سر بگیرید\nبا کشیدن به سمت پایین، بار را به سینه بیاورید\nکنترل شده بار را بالا ببرید',
    tips: 'کمر را صاف نگه دارید\nبار را به سینه بیاورید نه گردن\nاز حرکت کامل خودداری کنید',
    commonMistakes: 'خم کردن کمر\nکشیدن بار به گردن\nاستفاده از حرکت پویا',
    variations: 'پول‌داون پشت بازو\nپول‌داون یک دست\nپول‌داون باریک',
    primaryMuscles: 'Latissimus Dorsi',
    secondaryMuscles: 'Biceps Brachii\nRhomboids\nPosterior Deltoid',
    restTime: 90,
    caloriesPerHour: 320
  },

  // SHOULDERS
  {
    id: 'shoulder_overhead_press_barbell',
    name: 'پرس سرشانه هالتر نظامی',
    nameEn: 'Military Barbell Press',
    muscleGroup: 'شانه',
    subMuscleGroup: 'شانه کامل',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین پایه‌ای برای توسعه قدرت و حجم شانه‌ها',
    instructions: 'هالتر را جلوی گردن نگه دارید\nدست‌ها را به عرض شانه باز کنید\nهالتر را بالای سر هل دهید\nکنترل شده هالتر را پایین بیاورید',
    tips: 'بدن را صاف نگه دارید\nهالتر را جلوی صورت نگه دارید\nنفس را هماهنگ نگه دارید',
    commonMistakes: 'قوس دادن کمر\nبرخورد هالتر با صورت\nاستفاده از حرکت پویا',
    variations: 'پرس سرشانه دمبل\nپرس سرشانه دستگاه\nپرس سرشانه پشت سر',
    primaryMuscles: 'Anterior Deltoid\nLateral Deltoid',
    secondaryMuscles: 'Triceps Brachii\nTrapezius',
    restTime: 120,
    caloriesPerHour: 320
  },
  {
    id: 'shoulder_lateral_raise_dumbbell',
    name: 'جانبی بلند کن دمبل',
    nameEn: 'Dumbbell Lateral Raise',
    muscleGroup: 'شانه',
    subMuscleGroup: 'شانه جانبی',
    equipment: 'دمبل',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'تمرین ایزولاسیون عالی برای توسعه عرض شانه‌ها',
    instructions: 'دمبل‌ها را در دست بگیرید\nدست‌ها را در کنار بدن نگه دارید\nبا چرخش شانه‌ها، دست‌ها را به سمت پهلو بالا ببرید\nتا ارتفاع شانه‌ها دست‌ها را بالا ببرید',
    tips: 'آرنج‌ها را کمی خم نگه دارید\nاز حرکت پویا خودداری کنید\nوزنه را کنترل شده حرکت دهید',
    commonMistakes: 'بالا آوردن بیش از حد شانه‌ها\nاستفاده از دست‌ها به جای شانه‌ها\nقوس دادن کمر',
    variations: 'جانبی بلند کن کابل\nجانبی بلند کن دستگاه\nجانبی بلند کن یک دست',
    primaryMuscles: 'Lateral Deltoid',
    secondaryMuscles: 'Anterior Deltoid\nPosterior Deltoid',
    restTime: 90,
    caloriesPerHour: 250
  },

  // ARMS
  {
    id: 'biceps_curl_barbell',
    name: 'جلو بازو میله مستقیم',
    nameEn: 'Barbell Bicep Curl',
    muscleGroup: 'بازو',
    subMuscleGroup: 'جلو بازو',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'تمرین کلاسیک برای توسعه عضلات جلو بازو',
    instructions: 'هالتر را با دست‌های باز نگه دارید\nآرنج‌ها را نزدیک بدن نگه دارید\nهالتر را به سمت شانه‌ها بالا ببرید\nکنترل شده پایین بیاورید',
    tips: 'آرنج‌ها را حرکت ندهید\nاز حرکت پویا خودداری کنید\nنفس را در بالا بیرون دهید',
    commonMistakes: 'حرکت آرنج‌ها\nاستفاده از کمر\nقفل کردن آرنج‌ها',
    variations: 'جلو بازو دمبل\nجلو بازو کابل\nجلو بازو EZ بار',
    primaryMuscles: 'Biceps Brachii',
    secondaryMuscles: 'Brachialis\nBrachioradialis',
    restTime: 90,
    caloriesPerHour: 200
  },
  {
    id: 'triceps_extension_cable',
    name: 'پشت بازو کابل بالا',
    nameEn: 'Overhead Cable Tricep Extension',
    muscleGroup: 'بازو',
    subMuscleGroup: 'پشت بازو',
    equipment: 'کابل',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'intermediate',
    description: 'تمرین عالی برای ایزولاسیون عضلات پشت بازو',
    instructions: 'کابل را بالای سر تنظیم کنید\nدستگیره را با هر دو دست بگیرید\nآرنج‌ها را نزدیک سر نگه دارید\nکابل را به سمت پایین هل دهید',
    tips: 'آرنج‌ها را حرکت ندهید\nکابل را کاملاً پایین بیاورید\nنفس را کنترل کنید',
    commonMistakes: 'حرکت آرنج‌ها\nنرسیدن به کشش کامل\nاستفاده از وزن سنگین',
    variations: 'پشت بازو دمبل\nپشت بازو هالتر\nپشت بازو یک دست',
    primaryMuscles: 'Triceps Brachii',
    secondaryMuscles: '',
    restTime: 90,
    caloriesPerHour: 220
  },

  // LEGS
  {
    id: 'legs_squat_barbell',
    name: 'اسکات هالتر',
    nameEn: 'Barbell Back Squat',
    muscleGroup: 'ران',
    subMuscleGroup: 'ران کامل',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین پایه‌ای بدنسازی که تمام عضلات پایین‌تنه را هدف قرار می‌دهد',
    instructions: 'هالتر را روی شانه‌ها قرار دهید\nپاها را به عرض شانه باز کنید\nبا خم کردن زانو و باسن، پایین بروید\nتا ران‌ها موازی زمین شوند\nبا فشار پاها بدن را بالا ببرید',
    tips: 'کمر را صاف نگه دارید\nزانوها را روی انگشتان پا نگه دارید\nوزنه را روی پنجه پا نگه دارید',
    commonMistakes: 'قوس دادن کمر\nزانوهای به داخل\nبرآمدن پنجه پا',
    variations: 'اسکات دمبل\nاسکات دستگاه\nاسکات فرانت',
    primaryMuscles: 'Quadriceps\nGluteus Maximus',
    secondaryMuscles: 'Hamstrings\nAdductor Magnus\nSoleus',
    restTime: 180,
    caloriesPerHour: 420
  },
  {
    id: 'legs_lunge_dumbbell',
    name: 'لانگ دمبل',
    nameEn: 'Dumbbell Walking Lunge',
    muscleGroup: 'ران',
    subMuscleGroup: 'ران کامل',
    equipment: 'دمبل',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین عالی برای توسعه تعادل و قدرت یک طرفه',
    instructions: 'دمبل‌ها را در دست بگیرید\nیک پا را به سمت جلو بردارید\nبا خم کردن هر دو زانو پایین بروید\nزانوی عقب را نزدیک زمین ببرید\nبا فشار پا بدن را بالا ببرید',
    tips: 'زانوی جلو را روی انگشت پا نگه دارید\nبدن را صاف نگه دارید\nتعادل را حفظ کنید',
    commonMistakes: 'خم کردن بدن به سمت جلو\nقدم برداشتن کوتاه\nاز دست دادن تعادل',
    variations: 'لانگ ثابت\nلانگ پرش\nلانگ معکوس',
    primaryMuscles: 'Quadriceps\nGluteus Maximus',
    secondaryMuscles: 'Hamstrings\nAdductor Magnus',
    restTime: 90,
    caloriesPerHour: 380
  },

  // CORE
  {
    id: 'core_plank',
    name: 'پلانک',
    nameEn: 'Plank',
    muscleGroup: 'هسته',
    subMuscleGroup: 'هسته کامل',
    equipment: 'وزن بدن',
    type: 'resistance',
    mechanics: 'isometric',
    difficulty: 'beginner',
    description: 'تمرین ایزومتریک عالی برای تقویت عضلات هسته و بهبود پایداری',
    instructions: 'در وضعیت پلانک قرار بگیرید\nآرنج‌ها را دقیقاً زیر شانه‌ها قرار دهید\nبدن را صاف نگه دارید\nزمان را نگه دارید',
    tips: 'بدن را کاملاً صاف نگه دارید\nنفس را منظم نگه دارید\nکمر را قوس ندهید',
    commonMistakes: 'بالا آوردن باسن\nقوس دادن کمر\nافتادن شانه‌ها',
    variations: 'پلانک جانبی\nپلانک معکوس\nپلانک با بالشتک',
    primaryMuscles: 'Rectus Abdominis\nTransversus Abdominis',
    secondaryMuscles: 'Obliques\nErector Spinae',
    restTime: 60,
    caloriesPerHour: 300
  },

  // CARDIO
  {
    id: 'cardio_treadmill_run',
    name: 'دویدن روی تردمیل',
    nameEn: 'Treadmill Running',
    muscleGroup: 'قلبی',
    equipment: 'دستگاه',
    type: 'cardio',
    mechanics: 'aerobic',
    difficulty: 'beginner',
    description: 'تمرین کاردیو عالی برای بهبود استقامت قلبی و سوزاندن کالری',
    instructions: 'روی تردمیل قرار بگیرید\nسرعت مناسب انتخاب کنید\nبا حفظ ریتم منظم بدوید\nزمان و سرعت را کنترل کنید',
    tips: 'نفس را منظم نگه دارید\nپاهای خود را ریتمیک حرکت دهید\nاز گرم کردن قبل از شروع استفاده کنید',
    commonMistakes: 'چسبیدن به دستگیره‌ها\nخم کردن بدن به سمت جلو\nنگاه کردن به پایین',
    variations: 'دویدن با شیب\nدویدن اینتروال\nپیاده‌روی سریع',
    caloriesPerHour: 500
  },
  {
    id: 'cardio_swimming',
    name: 'شنا کرال سینه',
    nameEn: 'Freestyle Swimming',
    muscleGroup: 'قلبی',
    equipment: 'استخر',
    type: 'cardio',
    mechanics: 'aerobic',
    difficulty: 'intermediate',
    description: 'تمرین کامل بدن با کمترین فشار روی مفاصل',
    instructions: 'در آب قرار بگیرید\nبا یک دست به سمت جلو شنا کنید\nدست دیگر را همزمان بیرون بیاورید\nپاها را با ضرب قورباغه حرکت دهید\nنفس منظم بکشید',
    tips: 'سر را بالا نگه دارید\nحرکت دست‌ها را هماهنگ کنید\nضربات پا را کنترل کنید',
    targetHeartRate: {
      min: 60,
      max: 75
    },
    caloriesPerHour: 400
  },

  // WARMUP
  {
    id: 'warmup_dynamic_stretch',
    name: 'کشش دینامیکی',
    nameEn: 'Dynamic Stretching',
    muscleGroup: 'گرم کردن',
    equipment: 'وزن بدن',
    type: 'warmup',
    mechanics: 'dynamic-stretch',
    difficulty: 'beginner',
    description: 'حرکات کششی پویا برای آماده‌سازی بدن قبل از تمرین',
    instructions: 'با حرکات آهسته شروع کنید\nدامنه حرکت را به تدریج افزایش دهید\nهر حرکت را ۸-۱۰ بار تکرار کنید\nنفس را منظم نگه دارید',
    tips: 'هرگز به سمت درد نروید\nحرکات را کنترل شده انجام دهید\nزمان کافی برای گرم کردن اختصاص دهید',
    commonMistakes: 'حرکات سریع و ناگهانی\nکشش بیش از حد\nنادیده گرفتن سیگنال‌های بدن',
    preparationTime: 10
  },

  // COOLDOWN
  {
    id: 'cooldown_static_stretch',
    name: 'کشش ایستا',
    nameEn: 'Static Stretching',
    muscleGroup: 'سرد کردن',
    equipment: 'وزن بدن',
    type: 'cooldown',
    category: 'static-stretch',
    difficulty: 'beginner',
    description: 'کشش‌های ایستا برای بهبود انعطاف و ریکاوری بعد از تمرین',
    instructions: 'هر کشش را ۲۰-۳۰ ثانیه نگه دارید\nنفس عمیق بکشید\nبه سمت راحتی حرکت کنید نه درد\nهر طرف را به صورت جداگانه انجام دهید',
    tips: 'هرگز حرکات ناگهانی انجام ندهید\nنفس را منظم نگه دارید\nاز کشش‌های فعال استفاده کنید',
    commonMistakes: 'پرش یا حرکات پویا\nنگه داشتن نفس\nکشش تا نقطه درد',
    executionTime: 30
  }
];

const sampleFoods = [
  // PROTEINS
  {
    id: 'chicken_breast_grilled',
    name: 'مرغ سینه بدون پوست',
    nameEn: 'Grilled Chicken Breast',
    category: 'پروتئین - مرغ',
    subcategory: 'مرغ',
    unit: 'گرم',
    baseAmount: 100,
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    sodium: 74,
    potassium: 256,
    iron: 1.3,
    preparation: 'گریل شده',
    nutritionalHighlights: 'پروتئین بالا\nچربی کم\nبدون کربوهیدرات',
    servingSuggestions: 'با سالاد\nدر ساندویچ\nبا سبزیجات'
  },
  {
    id: 'turkey_breast_grilled',
    name: 'سینه بوقلمون گریل شده',
    nameEn: 'Grilled Turkey Breast',
    category: 'پروتئین - بوقلمون',
    subcategory: 'بوقلمون',
    unit: 'گرم',
    baseAmount: 100,
    calories: 135,
    protein: 30,
    carbs: 0,
    fat: 1,
    sodium: 55,
    potassium: 239,
    iron: 0.8,
    preparation: 'گریل شده',
    nutritionalHighlights: 'پروتئین بسیار بالا\nچربی بسیار کم',
    servingSuggestions: 'در ساندویچ\nبا سالاد\nدر سوپ'
  },
  {
    id: 'beef_sirloin_grilled',
    name: 'استیک سرلون گریل شده',
    nameEn: 'Grilled Sirloin Steak',
    category: 'پروتئین - گوشت قرمز',
    subcategory: 'گوشت قرمز',
    unit: 'گرم',
    baseAmount: 100,
    calories: 271,
    protein: 26,
    carbs: 0,
    fat: 18,
    sodium: 75,
    potassium: 329,
    iron: 2.9,
    preparation: 'گریل شده',
    nutritionalHighlights: 'پروتئین بالا\nآهن بالا\nروی بالا',
    servingSuggestions: 'با سیب‌زمینی\nبا سالاد\nبا سبزیجات'
  },
  {
    id: 'salmon_grilled',
    name: 'سالمون گریل شده',
    nameEn: 'Grilled Salmon',
    category: 'پروتئین - ماهی',
    subcategory: 'ماهی',
    unit: 'گرم',
    baseAmount: 100,
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    sodium: 75,
    potassium: 363,
    iron: 0.3,
    isVegan: false,
    isGlutenFree: true,
    allergens: ['ماهی'],
    preparation: 'گریل شده',
    nutritionalHighlights: 'اسیدهای چرب امگا-۳\nپروتئین بالا\nویتامین D',
    servingSuggestions: 'با برنج\nبا سالاد\nبا سبزیجات'
  },
  {
    id: 'egg_whole',
    name: 'تخم‌مرغ کامل',
    nameEn: 'Whole Egg',
    category: 'پروتئین - تخم‌مرغ',
    subcategory: 'تخم‌مرغ',
    unit: 'عدد',
    baseAmount: 50,
    calories: 78,
    protein: 6,
    carbs: 1,
    fat: 5.3,
    sodium: 71,
    potassium: 69,
    iron: 0.9,
    vitaminA: 75,
    isVegan: false,
    isGlutenFree: true,
    allergens: ['تخم‌مرغ'],
    preparation: 'خام یا پخته شده',
    nutritionalHighlights: 'پروتئین کامل\nویتامین‌های B\nکولین',
    servingSuggestions: 'آب‌پز\nسرد شده\nدر سالاد'
  },

  // CARBOHYDRATES
  {
    id: 'brown_rice_cooked',
    name: 'برنج قهوه‌ای پخته شده',
    nameEn: 'Cooked Brown Rice',
    category: 'کربوهیدرات - غلات کامل',
    subcategory: 'غلات کامل',
    unit: 'گرم',
    baseAmount: 100,
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    fiber: 1.8,
    sodium: 5,
    potassium: 86,
    iron: 0.6,
    glycemicIndex: 50,
    isVegan: true,
    isGlutenFree: true,
    preparation: 'پخته شده',
    nutritionalHighlights: 'فیبر بالا\nمنگنز\nسلنیوم',
    servingSuggestions: 'با پروتئین\nدر سالاد\nبه عنوان پایه غذا'
  },
  {
    id: 'quinoa_cooked',
    name: 'کینوا پخته شده',
    nameEn: 'Cooked Quinoa',
    category: 'کربوهیدرات - سوپرغذاها',
    subcategory: 'سوپرغذاها',
    unit: 'گرم',
    baseAmount: 100,
    calories: 120,
    protein: 4.4,
    carbs: 21,
    fat: 1.9,
    fiber: 2.6,
    sodium: 7,
    potassium: 172,
    iron: 1.5,
    glycemicIndex: 53,
    isVegan: true,
    isGlutenFree: true,
    preparation: 'پخته شده',
    nutritionalHighlights: 'پروتئین کامل\nآهن بالا\nمغنزیوم',
    servingSuggestions: 'به عنوان برنج\nدر سالاد\nدر اسموتی'
  },
  {
    id: 'sweet_potato_baked',
    name: 'سیب‌زمینی شیرین پخته شده',
    nameEn: 'Baked Sweet Potato',
    category: 'کربوهیدرات - سبزیجات نشاسته‌ای',
    subcategory: 'سبزیجات نشاسته‌ای',
    unit: 'گرم',
    baseAmount: 100,
    calories: 90,
    protein: 2,
    carbs: 20,
    fat: 0.1,
    fiber: 3.8,
    sodium: 55,
    potassium: 475,
    vitaminA: 19218,
    vitaminC: 2.4,
    glycemicIndex: 63,
    isVegan: true,
    isGlutenFree: true,
    preparation: 'پخته شده',
    nutritionalHighlights: 'بتا کاروتن بالا\nفیبر\nپتاسیم بالا',
    servingSuggestions: 'با پروتئین\nدر سالاد\nبه عنوان میان‌وعده'
  },

  // FRUITS
  {
    id: 'banana_medium',
    name: 'موز متوسط',
    nameEn: 'Medium Banana',
    category: 'میوه - میوه‌های گرمسیری',
    subcategory: 'میوه‌های گرمسیری',
    unit: 'میوه',
    baseAmount: 118,
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    sodium: 1,
    potassium: 422,
    vitaminC: 10.3,
    glycemicIndex: 51,
    isVegan: true,
    isGlutenFree: true,
    preparation: 'خام',
    nutritionalHighlights: 'پتاسیم بالا\nویتامین B6\nفیبر',
    servingSuggestions: 'به عنوان میان‌وعده\nدر اسموتی\nبا جو دوسر'
  },
  {
    id: 'apple_medium',
    name: 'سیب متوسط',
    nameEn: 'Medium Apple',
    category: 'میوه - میوه‌های هسته‌دار',
    subcategory: 'میوه‌های هسته‌دار',
    unit: 'میوه',
    baseAmount: 182,
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    fiber: 4.4,
    sodium: 2,
    potassium: 195,
    vitaminC: 8.4,
    glycemicIndex: 39,
    isVegan: true,
    isGlutenFree: true,
    preparation: 'خام',
    nutritionalHighlights: 'فیبر محلول\nآنتی‌اکسیدان\nویتامین C',
    servingSuggestions: 'به عنوان میان‌وعده\nدر سالاد\nبا کره بادام'
  },

  // VEGETABLES
  {
    id: 'spinach_raw',
    name: 'اسفناج خام',
    nameEn: 'Raw Spinach',
    category: 'سبزی - سبزیجات برگ‌دار',
    subcategory: 'سبزیجات برگ‌دار',
    unit: 'گرم',
    baseAmount: 100,
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    sodium: 79,
    potassium: 558,
    calcium: 99,
    iron: 2.7,
    vitaminA: 9377,
    vitaminC: 28,
    isVegan: true,
    isGlutenFree: true,
    preparation: 'خام',
    nutritionalHighlights: 'آهن بالا\nویتامین K بالا\nکلسیم',
    servingSuggestions: 'در سالاد\nدر اسموتی\nدر پخت'
  },
  {
    id: 'broccoli_cooked',
    name: 'بروکلی پخته شده',
    nameEn: 'Cooked Broccoli',
    category: 'سبزی - سبزیجات گل',
    subcategory: 'سبزیجات گل',
    unit: 'گرم',
    baseAmount: 100,
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.4,
    sodium: 64,
    potassium: 293,
    vitaminC: 81,
    vitaminA: 623,
    isVegan: true,
    isGlutenFree: true,
    preparation: 'پخته شده',
    nutritionalHighlights: 'ویتامین C بالا\nفیبر\nآنتی‌اکسیدان',
    servingSuggestions: 'بخارپز\nدر سالاد\nبا پروتئین'
  },

  // FATS
  {
    id: 'avocado_medium',
    name: 'آووکادو متوسط',
    nameEn: 'Medium Avocado',
    category: 'چربی سالم - میوه‌ها',
    subcategory: 'میوه‌ها',
    unit: 'میوه',
    baseAmount: 150,
    calories: 240,
    protein: 3,
    carbs: 12,
    fat: 22,
    fiber: 10,
    sodium: 10,
    potassium: 708,
    vitaminC: 12,
    vitaminE: 2.1,
    isVegan: true,
    isGlutenFree: true,
    preparation: 'خام',
    nutritionalHighlights: 'چربی سالم\nفیبر بالا\nپتاسیم بالا',
    servingSuggestions: 'در سالاد\nدر ساندویچ\nدر اسموتی'
  },
  {
    id: 'almonds_raw',
    name: 'بادام خام',
    nameEn: 'Raw Almonds',
    category: 'چربی سالم - آجیل',
    subcategory: 'آجیل',
    unit: 'گرم',
    baseAmount: 28,
    calories: 161,
    protein: 6,
    carbs: 6,
    fat: 14,
    fiber: 3.5,
    sodium: 0,
    potassium: 208,
    magnesium: 76,
    vitaminE: 7.3,
    isVegan: true,
    isGlutenFree: true,
    allergens: ['آجیل'],
    preparation: 'خام',
    nutritionalHighlights: 'ویتامین E بالا\nمنیزیم\nچربی سالم',
    servingSuggestions: 'به عنوان میان‌وعده\nدر سالاد\nدر گرانولا'
  },

  // DAIRY
  {
    id: 'milk_whole',
    name: 'شیر کامل',
    nameEn: 'Whole Milk',
    category: 'لبنیات - شیر',
    subcategory: 'شیر',
    unit: 'لیوان',
    baseAmount: 244,
    calories: 146,
    protein: 7.7,
    carbs: 11,
    fat: 8,
    sodium: 98,
    calcium: 276,
    vitaminA: 112,
    vitaminD: 98,
    isVegan: false,
    isGlutenFree: true,
    allergens: ['لبنیات'],
    preparation: 'پاستوریزه',
    nutritionalHighlights: 'کلسیم بالا\nویتامین D\nپروتئین',
    servingSuggestions: 'خام\nدر چای\nدر اسموتی'
  },
  {
    id: 'greek_yogurt_plain',
    name: 'ماست یونانی ساده',
    nameEn: 'Plain Greek Yogurt',
    category: 'لبنیات - ماست',
    subcategory: 'ماست',
    unit: 'گرم',
    baseAmount: 100,
    calories: 100,
    protein: 10.2,
    carbs: 3.7,
    fat: 5,
    sodium: 65,
    calcium: 110,
    potassium: 141,
    isVegan: false,
    isGlutenFree: true,
    allergens: ['لبنیات'],
    preparation: 'ساده',
    nutritionalHighlights: 'پروتئین بالا\nپروبیوتیک\nکلسیم بالا',
    servingSuggestions: 'با میوه\nبا گرانولا\nدر اسموتی'
  }
];

const sampleSupplements = [
  {
    id: 'whey_protein',
    name: 'پروتئین وی',
    nameEn: 'Whey Protein',
    category: 'پروتئین',
    subcategory: 'پروتئین وی',
    form: 'پودر',
    dosage: '۲۵ گرم',
    unit: 'گرم',
    benefits: 'رشد عضلات\nجذب سریع پروتئین\nبهبود ریکاوری\nحفاظت از عضلات',
    timing: 'بعد از تمرین\nبین وعده‌ها'
  },
  {
    id: 'creatine_monohydrate',
    name: 'کراتین مونوهیدرات',
    nameEn: 'Creatine Monohydrate',
    category: 'قدرت و عملکرد',
    subcategory: 'کراتین',
    form: 'پودر',
    dosage: '۵ گرم',
    unit: 'گرم',
    benefits: 'افزایش قدرت عضلانی\nبهبود عملکرد HIIT\nافزایش حجم عضلات\nبهبود ریکاوری',
    timing: 'هر زمان از روز'
  },
  {
    id: 'beta_alanine',
    name: 'بتا آلانین',
    nameEn: 'Beta-Alanine',
    category: 'قبل تمرین',
    subcategory: 'استقامت',
    form: 'پودر',
    dosage: '۳ گرم',
    unit: 'گرم',
    benefits: 'افزایش کارنوزین عضلانی\nبهبود تحمل تمرین شدید\nکاهش خستگی عضلانی\nافزایش قدرت',
    timing: '۳۰ دقیقه قبل تمرین'
  },
  {
    id: 'vitamin_d3',
    name: 'ویتامین D3',
    nameEn: 'Vitamin D3',
    category: 'ویتامین',
    subcategory: 'ویتامین D',
    form: 'کپسول',
    dosage: '۲۰۰۰ IU',
    unit: 'IU',
    benefits: 'استخوان‌های قوی\nپشتیبانی سیستم ایمنی\nبهبود خلق و خو\nافزایش قدرت عضلانی',
    timing: 'صبح با غذا'
  },
  {
    id: 'magnesium',
    name: 'منیزیم',
    nameEn: 'Magnesium',
    category: 'معدن',
    subcategory: 'منیزیم',
    form: 'کپسول',
    dosage: '۴۰۰ میلی‌گرم',
    unit: 'میلی‌گرم',
    benefits: 'بهبود خواب\nکاهش استرس\nریلکسیشن عضلانی\nسلامت قلب',
    timing: 'شب قبل خواب'
  },
  {
    id: 'fish_oil',
    name: 'روغن ماهی',
    nameEn: 'Fish Oil',
    category: 'مفصل و ریکاوری',
    subcategory: 'امگا-۳',
    form: 'کپسول',
    dosage: '۱۰۰۰ میلی‌گرم',
    unit: 'میلی‌گرم',
    benefits: 'کاهش التهاب\nسلامت مفاصل\nپشتیبانی قلب\nبهبود خلق و خو',
    timing: 'با غذا'
  }
];

/**
 * Create local data file for fallback
 */
function createLocalDataFile() {
  const localDataPath = path.join(__dirname, '../public/local-data.json');

  const localData = {
    exercises: sampleExercises,
    foods: sampleFoods,
    supplements: sampleSupplements,
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    note: 'Local fallback data when Supabase is not available'
  };

  try {
    fs.writeFileSync(localDataPath, JSON.stringify(localData, null, 2));
    console.log('✅ Local data file created:', localDataPath);
    return true;
  } catch (error) {
    console.error('❌ Failed to create local data file:', error.message);
    return false;
  }
}

/**
 * Update hooks to use comprehensive data
 */
function updateHooksForLocalData() {
  console.log('🔧 Updating hooks for local data usage...');

  // Update useExercises hook
  const exercisesHookPath = path.join(__dirname, '../src/hooks/useExercises.ts');
  let exercisesHookContent = fs.readFileSync(exercisesHookPath, 'utf-8');

  // Replace fallback data with comprehensive data
  const oldFallback = exercisesHookContent.match(/const fallbackExercises = \[[\s\S]*?\];/);
  if (oldFallback) {
    const newFallback = `const fallbackExercises = ${JSON.stringify(sampleExercises.slice(0, 20), null, 2)};`;
    exercisesHookContent = exercisesHookContent.replace(oldFallback[0], newFallback);

    fs.writeFileSync(exercisesHookPath, exercisesHookContent);
    console.log('✅ Updated useExercises hook');
  }

  // Update foods fallback
  const foodsFallbackPattern = /const fallbackFoods = \[[\s\S]*?\];/;
  const newFoodsFallback = `const fallbackFoods = ${JSON.stringify(sampleFoods.slice(0, 20), null, 2)};`;
  exercisesHookContent = exercisesHookContent.replace(foodsFallbackPattern, newFoodsFallback);

  // Update supplements fallback
  const supplementsFallbackPattern = /const fallbackSupplements = \[[\s\S]*?\];/;
  const newSupplementsFallback = `const fallbackSupplements = ${JSON.stringify(sampleSupplements, null, 2)};`;
  exercisesHookContent = exercisesHookContent.replace(supplementsFallbackPattern, newSupplementsFallback);

  fs.writeFileSync(exercisesHookPath, exercisesHookContent);
  console.log('✅ Updated foods and supplements fallbacks');
}

/**
 * Clear browser local storage (instruction)
 */
function provideLocalStorageClearingInstructions() {
  console.log('\n🧹 Browser Local Storage Clearing:');
  console.log('To clear local storage in browser, open Developer Tools (F12) and run:');
  console.log('  localStorage.clear();');
  console.log('Or run this in console:');
  console.log('  Object.keys(localStorage).forEach(key => {');
  console.log('    if (key.includes("exercises") || key.includes("foods") || key.includes("supplements") ||');
  console.log('        key.includes("flexpro") || key.includes("supabase")) {');
  console.log('      localStorage.removeItem(key);');
  console.log('    }');
  console.log('  });');
}

/**
 * Main function
 */
async function main() {
  console.log('🏠 Local Data Setup for Development');
  console.log('===================================\n');

  console.log('📊 Comprehensive Data Summary:');
  console.log(`   Exercises: ${sampleExercises.length} items`);
  console.log(`   Foods: ${sampleFoods.length} items`);
  console.log(`   Supplements: ${sampleSupplements.length} items`);
  console.log(`   Total: ${sampleExercises.length + sampleFoods.length + sampleSupplements.length} records\n`);

  // Create local data file
  const dataFileCreated = createLocalDataFile();
  if (!dataFileCreated) {
    console.error('❌ Failed to create local data file');
    process.exit(1);
  }

  // Update hooks
  updateHooksForLocalData();

  // Provide instructions
  provideLocalStorageClearingInstructions();

  console.log('\n🎉 Local Data Setup Complete!');
  console.log('=============================');
  console.log('✅ Comprehensive data file created');
  console.log('✅ Hooks updated with fallback data');
  console.log('✅ Application will use local data when Supabase unavailable');
  console.log('\n🚀 Application is ready to run with complete local data!');
  console.log('   Run: npm run dev');
  console.log('\n💡 Note: Clear browser localStorage if you had old cached data');
}

main();