#!/usr/bin/env node

/**
 * Ultimate Exercise Seeder - Scientific Training Database
 *
 * این اسکریپت دیتابیس را با داده‌های تمرینی حرفه‌ای و علمی پر می‌کند
 * بر اساس اصول NSCA و NASM برای برنامه‌ریزی ورزشی حرفه‌ای
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// تنظیم مسیر برای ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// بارگذاری متغیرهای محیطی
config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ متغیرهای محیطی Supabase یافت نشد!');
  console.log('لطفاً فایل .env را بررسی کنید.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ========== داده‌های تمرینی حرفه‌ای ==========

const scientificExercises = {
  // ========== BODYBUILDING - Hypertrophy & Strength ==========
  bodybuilding: [
    // CHEST
    {
      name: "Bench Press - Barbell",
      muscle_group: "Chest",
      sub_muscle_group: "Pectoralis Major",
      equipment: "Barbell",
      type: "resistance",
      mechanics: "compound",
      category: "bodybuilding",
      primary_muscle: "Pectoralis Major",
      secondary_muscles: ["Triceps Brachii", "Anterior Deltoid"],
      equipment_standardized: "barbell",
      difficulty_level: "intermediate",
      tempo: "3-0-1-0",
      default_rpe: 7,
      default_rir: 2,
      rest_interval_seconds: 180,
      unilateral: false,
      description: "Foundation chest exercise for building mass and strength",
      instructions: "Lie on bench, grip barbell shoulder-width, lower to chest, press up explosively"
    },
    {
      name: "Incline Dumbbell Press",
      muscle_group: "Chest",
      sub_muscle_group: "Upper Pectoralis",
      equipment: "Dumbbells",
      type: "resistance",
      mechanics: "compound",
      category: "bodybuilding",
      primary_muscle: "Pectoralis Major",
      secondary_muscles: ["Triceps Brachii", "Anterior Deltoid"],
      equipment_standardized: "dumbbell",
      difficulty_level: "intermediate",
      tempo: "3-0-1-0",
      default_rpe: 7,
      default_rir: 2,
      rest_interval_seconds: 150,
      unilateral: false,
      description: "Targets upper chest fibers for balanced development",
      instructions: "Set bench to 30-45°, press dumbbells up from chest position"
    },
    {
      name: "Cable Flyes",
      muscle_group: "Chest",
      sub_muscle_group: "Pectoralis Major",
      equipment: "Cable Machine",
      type: "resistance",
      mechanics: "isolation",
      category: "bodybuilding",
      primary_muscle: "Pectoralis Major",
      secondary_muscles: [],
      equipment_standardized: "cable",
      difficulty_level: "beginner",
      tempo: "3-0-1-0",
      default_rpe: 8,
      default_rir: 1,
      rest_interval_seconds: 90,
      unilateral: false,
      description: "Isolation movement for chest with constant tension",
      instructions: "Set cables at chest height, step forward, bring handles together in front"
    },

    // BACK
    {
      name: "Deadlift - Conventional",
      muscle_group: "Back",
      sub_muscle_group: "Posterior Chain",
      equipment: "Barbell",
      type: "resistance",
      mechanics: "compound",
      category: "bodybuilding",
      primary_muscle: "Erector Spinae",
      secondary_muscles: ["Gluteus Maximus", "Hamstrings", "Latissimus Dorsi", "Trapezius"],
      equipment_standardized: "barbell",
      difficulty_level: "advanced",
      tempo: "1-0-1-0",
      default_rpe: 8,
      default_rir: 1,
      rest_interval_seconds: 240,
      unilateral: false,
      description: "King of posterior chain exercises for total body strength",
      instructions: "Stand with feet hip-width, grip barbell, lift by extending hips and knees"
    },
    {
      name: "Pull-ups",
      muscle_group: "Back",
      sub_muscle_group: "Lats",
      equipment: "Bodyweight",
      type: "resistance",
      mechanics: "compound",
      category: "bodybuilding",
      primary_muscle: "Latissimus Dorsi",
      secondary_muscles: ["Biceps Brachii", "Rhomboids", "Trapezius"],
      equipment_standardized: "bodyweight",
      difficulty_level: "intermediate",
      tempo: "3-0-1-0",
      default_rpe: 8,
      default_rir: 1,
      rest_interval_seconds: 120,
      unilateral: false,
      description: "Bodyweight back exercise for building width and strength",
      instructions: "Hang from bar with palms facing away, pull up until chin over bar"
    },
    {
      name: "Face Pulls",
      muscle_group: "Back",
      sub_muscle_group: "Upper Back",
      equipment: "Cable Machine",
      type: "resistance",
      mechanics: "isolation",
      category: "bodybuilding",
      primary_muscle: "Rhomboids",
      secondary_muscles: ["Rear Deltoids", "Trapezius"],
      equipment_standardized: "cable",
      difficulty_level: "beginner",
      tempo: "2-0-2-0",
      default_rpe: 7,
      default_rir: 2,
      rest_interval_seconds: 90,
      unilateral: false,
      description: "Essential for posture and rear delt development",
      instructions: "Set rope at face height, pull towards face, squeeze shoulder blades"
    },

    // LEGS
    {
      name: "Back Squat",
      muscle_group: "Legs",
      sub_muscle_group: "Quadriceps",
      equipment: "Barbell",
      type: "resistance",
      mechanics: "compound",
      category: "bodybuilding",
      primary_muscle: "Quadriceps",
      secondary_muscles: ["Gluteus Maximus", "Hamstrings", "Erector Spinae"],
      equipment_standardized: "barbell",
      difficulty_level: "intermediate",
      tempo: "3-0-1-0",
      default_rpe: 7,
      default_rir: 2,
      rest_interval_seconds: 180,
      unilateral: false,
      description: "Fundamental lower body exercise for quad and glute development",
      instructions: "Bar on upper back, feet shoulder-width, squat until thighs parallel to floor"
    },
    {
      name: "Romanian Deadlift",
      muscle_group: "Legs",
      sub_muscle_group: "Hamstrings",
      equipment: "Barbell",
      type: "resistance",
      mechanics: "compound",
      category: "bodybuilding",
      primary_muscle: "Hamstrings",
      secondary_muscles: ["Gluteus Maximus", "Erector Spinae"],
      equipment_standardized: "barbell",
      difficulty_level: "intermediate",
      tempo: "3-0-1-0",
      default_rpe: 7,
      default_rir: 2,
      rest_interval_seconds: 150,
      unilateral: false,
      description: "Hamstring-focused hinge movement for posterior chain strength",
      instructions: "Hinge at hips, keep bar close to legs, feel stretch in hamstrings"
    },
    {
      name: "Calf Raises",
      muscle_group: "Legs",
      sub_muscle_group: "Calves",
      equipment: "Bodyweight",
      type: "resistance",
      mechanics: "isolation",
      category: "bodybuilding",
      primary_muscle: "Gastrocnemius",
      secondary_muscles: ["Soleus"],
      equipment_standardized: "bodyweight",
      difficulty_level: "beginner",
      tempo: "2-0-1-0",
      default_rpe: 8,
      default_rir: 1,
      rest_interval_seconds: 90,
      unilateral: false,
      description: "Isolation exercise for calf development",
      instructions: "Stand with balls of feet on edge, raise heels as high as possible"
    }
  ],

  // ========== CARDIO ==========
  cardio: [
    {
      name: "Steady State Cardio - Treadmill",
      muscle_group: "Full Body",
      sub_muscle_group: "Cardiovascular System",
      equipment: "Treadmill",
      type: "cardio",
      mechanics: null,
      category: "cardio",
      primary_muscle: "Cardiovascular System",
      secondary_muscles: [],
      equipment_standardized: "treadmill",
      difficulty_level: "beginner",
      tempo: null,
      default_rpe: 6,
      default_rir: null,
      rest_interval_seconds: 30,
      unilateral: false,
      description: "Zone 2 cardio for aerobic base and recovery",
      instructions: "Maintain heart rate at 60-70% max, focus on steady pace"
    },
    {
      name: "HIIT - Battle Ropes",
      muscle_group: "Full Body",
      sub_muscle_group: "Cardiovascular System",
      equipment: "Battle Ropes",
      type: "cardio",
      mechanics: null,
      category: "cardio",
      primary_muscle: "Cardiovascular System",
      secondary_muscles: ["Shoulders", "Core"],
      equipment_standardized: "battle_ropes",
      difficulty_level: "advanced",
      tempo: null,
      default_rpe: 9,
      default_rir: null,
      rest_interval_seconds: 30,
      unilateral: false,
      description: "High-intensity interval training for maximal conditioning",
      instructions: "30 seconds maximum effort waves, 30 seconds rest, repeat 8-12 rounds"
    },
    {
      name: "Zone 2 - Rowing",
      muscle_group: "Full Body",
      sub_muscle_group: "Cardiovascular System",
      equipment: "Rower",
      type: "cardio",
      mechanics: null,
      category: "cardio",
      primary_muscle: "Cardiovascular System",
      secondary_muscles: ["Back", "Legs"],
      equipment_standardized: "rower",
      difficulty_level: "intermediate",
      tempo: null,
      default_rpe: 6,
      default_rir: null,
      rest_interval_seconds: 30,
      unilateral: false,
      description: "Efficient full-body cardio for aerobic capacity",
      instructions: "Maintain steady pace at conversational effort level"
    }
  ],

  // ========== WARM-UP ==========
  warmup: [
    {
      name: "Arm Circles",
      muscle_group: "Shoulders",
      sub_muscle_group: "Full Shoulders",
      equipment: "Bodyweight",
      type: "warmup",
      mechanics: null,
      category: "warmup",
      primary_muscle: "Deltoids",
      secondary_muscles: ["Rotator Cuff"],
      equipment_standardized: "bodyweight",
      difficulty_level: "beginner",
      tempo: null,
      default_rpe: 4,
      default_rir: null,
      rest_interval_seconds: 0,
      unilateral: false,
      description: "Dynamic warm-up for shoulder mobility and circulation",
      instructions: "Make small circles with arms, gradually increase size, 10 each direction"
    },
    {
      name: "Leg Swings",
      muscle_group: "Legs",
      sub_muscle_group: "Hips",
      equipment: "Bodyweight",
      type: "warmup",
      mechanics: null,
      category: "warmup",
      primary_muscle: "Hip Flexors",
      secondary_muscles: ["Glutes", "Hamstrings"],
      equipment_standardized: "bodyweight",
      difficulty_level: "beginner",
      tempo: null,
      default_rpe: 4,
      default_rir: null,
      rest_interval_seconds: 0,
      unilateral: true,
      description: "Dynamic hip mobility and warm-up drill",
      instructions: "Hold onto stable surface, swing leg forward and back, 10 each leg"
    },
    {
      name: "Torso Twists",
      muscle_group: "Core",
      sub_muscle_group: "Spine",
      equipment: "Bodyweight",
      type: "warmup",
      mechanics: null,
      category: "warmup",
      primary_muscle: "Obliques",
      secondary_muscles: ["Rectus Abdominis"],
      equipment_standardized: "bodyweight",
      difficulty_level: "beginner",
      tempo: null,
      default_rpe: 4,
      default_rir: null,
      rest_interval_seconds: 0,
      unilateral: false,
      description: "Spinal mobility warm-up for rotational movements",
      instructions: "Stand with feet shoulder-width, rotate torso side to side slowly"
    }
  ],

  // ========== COOL-DOWN ==========
  cooldown: [
    {
      name: "Child's Pose",
      muscle_group: "Back",
      sub_muscle_group: "Spine",
      equipment: "Bodyweight",
      type: "cooldown",
      mechanics: null,
      category: "cooldown",
      primary_muscle: "Erector Spinae",
      secondary_muscles: ["Latissimus Dorsi"],
      equipment_standardized: "bodyweight",
      difficulty_level: "beginner",
      tempo: null,
      default_rpe: 3,
      default_rir: null,
      rest_interval_seconds: 0,
      unilateral: false,
      description: "Restorative pose for spinal decompression and relaxation",
      instructions: "Kneel and sit back on heels, stretch arms forward, hold for 30-60 seconds"
    },
    {
      name: "Seated Forward Fold",
      muscle_group: "Legs",
      sub_muscle_group: "Hamstrings",
      equipment: "Bodyweight",
      type: "cooldown",
      mechanics: null,
      category: "cooldown",
      primary_muscle: "Hamstrings",
      secondary_muscles: ["Calves", "Back"],
      equipment_standardized: "bodyweight",
      difficulty_level: "beginner",
      tempo: null,
      default_rpe: 3,
      default_rir: null,
      rest_interval_seconds: 0,
      unilateral: false,
      description: "Hamstring stretch for recovery and flexibility",
      instructions: "Sit with legs extended, reach towards toes, hold stretch"
    }
  ],

  // ========== CORRECTIVE - NASM Inspired ==========
  corrective: [
    {
      name: "Clamshells",
      muscle_group: "Hips",
      sub_muscle_group: "Glutes",
      equipment: "Bodyweight",
      type: "corrective",
      mechanics: null,
      category: "corrective",
      primary_muscle: "Gluteus Medius",
      secondary_muscles: ["Gluteus Minimus"],
      equipment_standardized: "bodyweight",
      difficulty_level: "beginner",
      tempo: "3-0-1-0",
      default_rpe: 6,
      default_rir: null,
      rest_interval_seconds: 60,
      unilateral: true,
      description: "Corrects hip abduction weakness and lower extremity dysfunction",
      instructions: "Lie on side, knees bent 90°, open and close top knee like clamshell"
    },
    {
      name: "Face Pulls - Corrective",
      muscle_group: "Shoulders",
      sub_muscle_group: "Posterior Chain",
      equipment: "Cable Machine",
      type: "corrective",
      mechanics: null,
      category: "corrective",
      primary_muscle: "Rhomboids",
      secondary_muscles: ["Rear Deltoids", "Middle Trapezius"],
      equipment_standardized: "cable",
      difficulty_level: "beginner",
      tempo: "2-0-2-0",
      default_rpe: 6,
      default_rir: null,
      rest_interval_seconds: 60,
      unilateral: false,
      description: "Corrects upper cross syndrome and posture imbalances",
      instructions: "Pull rope towards face, focus on squeezing shoulder blades together"
    },
    {
      name: "Y-T-W Raises",
      muscle_group: "Shoulders",
      sub_muscle_group: "Scapular Stabilizers",
      equipment: "Bodyweight",
      type: "corrective",
      mechanics: null,
      category: "corrective",
      primary_muscle: "Lower Trapezius",
      secondary_muscles: ["Rhomboids", "Rear Deltoids"],
      equipment_standardized: "bodyweight",
      difficulty_level: "beginner",
      tempo: "3-0-1-0",
      default_rpe: 5,
      default_rir: null,
      rest_interval_seconds: 45,
      unilateral: false,
      description: "Corrects scapular dyskinesis and postural imbalances",
      instructions: "Lie prone, raise arms in Y, T, W positions to activate scapular muscles"
    },
    {
      name: "Dead Bugs",
      muscle_group: "Core",
      sub_muscle_group: "Deep Core",
      equipment: "Bodyweight",
      type: "corrective",
      mechanics: null,
      category: "corrective",
      primary_muscle: "Transverse Abdominis",
      secondary_muscles: ["Multifidus"],
      equipment_standardized: "bodyweight",
      difficulty_level: "beginner",
      tempo: "2-0-2-0",
      default_rpe: 5,
      default_rir: null,
      rest_interval_seconds: 45,
      unilateral: false,
      description: "Corrects core instability and movement dysfunction",
      instructions: "Lie supine, extend opposite arm and leg while maintaining core stability"
    },
    {
      name: "Foam Rolling - IT Band",
      muscle_group: "Legs",
      sub_muscle_group: "Lateral Thigh",
      equipment: "Foam Roller",
      type: "corrective",
      mechanics: null,
      category: "corrective",
      primary_muscle: "Iliotibial Band",
      secondary_muscles: ["Tensor Fascia Latae"],
      equipment_standardized: "foam_roller",
      difficulty_level: "intermediate",
      tempo: null,
      default_rpe: 7,
      default_rir: null,
      rest_interval_seconds: 30,
      unilateral: true,
      description: "Self-myofascial release for IT band syndrome and lateral knee pain",
      instructions: "Roll slowly from hip to knee, pause on tender spots for 20-30 seconds"
    }
  ]
};

// ========== توابع کمکی ==========

async function runMigration() {
  console.log('📋 اجرای migration علمی exercises...');

  try {
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251218_exercises_scientific_upgrade.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // اجرای migration به صورت دستی با RPC (اگر ممکن باشد)
    // در غیر این صورت دستورالعمل نمایش داده می‌شود
    console.log('⚠️ لطفاً migration زیر را در Supabase SQL Editor اجرا کنید:');
    console.log('─'.repeat(70));
    console.log(migrationSQL);
    console.log('─'.repeat(70));

    // تأخیر برای خواندن دستورالعمل‌ها
    await new Promise(resolve => setTimeout(resolve, 2000));

  } catch (error) {
    console.error('❌ خطا در خواندن migration:', error);
    return false;
  }

  return true;
}

async function clearExistingExercises() {
  console.log('🧹 پاکسازی داده‌های موجود...');

  const { error } = await supabase
    .from('exercises')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (error) {
    console.error('❌ خطا در پاکسازی:', error);
    return false;
  }

  console.log('✅ داده‌های موجود پاک شدند');
  return true;
}

async function insertExercises(exercises: any[], category: string) {
  console.log(`📥 درج ${exercises.length} حرکت ${category}...`);

  const { data, error } = await supabase
    .from('exercises')
    .insert(exercises)
    .select();

  if (error) {
    console.error(`❌ خطا در درج ${category}:`, error);
    return false;
  }

  console.log(`✅ ${data?.length || 0} حرکت ${category} با موفقیت درج شد`);
  return true;
}

async function verifyExercises() {
  console.log('🔍 بررسی تعداد رکوردها...');

  const { data, error } = await supabase
    .from('exercises')
    .select('category', { count: 'exact' });

  if (error) {
    console.error('❌ خطا در بررسی:', error);
    return false;
  }

  const countByCategory = data?.reduce((acc, exercise) => {
    acc[exercise.category] = (acc[exercise.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('📊 آمار نهایی:');
  Object.entries(countByCategory || {}).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} حرکت`);
  });

  return true;
}

// ========== تابع اصلی ==========

async function main() {
  console.log('🚀 شروع Ultimate Exercise Seeding...');
  console.log('=' .repeat(50));

  try {
    // اجرای migration
    const migrated = await runMigration();
    if (!migrated) {
      console.error('❌ اجرای migration ناموفق، عملیات متوقف شد');
      process.exit(1);
    }

    // پاکسازی داده‌های موجود
    const cleared = await clearExistingExercises();
    if (!cleared) {
      console.error('❌ پاکسازی ناموفق، عملیات متوقف شد');
      process.exit(1);
    }

    // درج داده‌های جدید
    const categories = Object.keys(scientificExercises) as Array<keyof typeof scientificExercises>;

    for (const category of categories) {
      const exercises = scientificExercises[category];
      const success = await insertExercises(exercises, category);

      if (!success) {
        console.error(`❌ درج ${category} ناموفق، عملیات متوقف شد`);
        process.exit(1);
      }

      // تأخیر کوتاه برای جلوگیری از rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // بررسی نهایی
    await verifyExercises();

    console.log('');
    console.log('🎉 Ultimate Exercise Database با موفقیت ایجاد شد!');
    console.log('💪 آماده برنامه‌ریزی ورزشی حرفه‌ای');

  } catch (error) {
    console.error('💥 خطای غیرمنتظره:', error);
    process.exit(1);
  }
}

// اجرای اسکریپت
main();

