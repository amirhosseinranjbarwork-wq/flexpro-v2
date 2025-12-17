#!/usr/bin/env node

/**
 * FlexPro v2 Data Migration Script
 * Migrates static data from src/data/ to Supabase
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🚀 Starting FlexPro v2 data migration...');

/**
 * Parse TypeScript file to extract export
 */
function parseTypeScriptExport(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Try export default
    const match = content.match(/export\s+default\s+({[\s\S]*?})(?:;|$)/);
    if (match) {
      // eslint-disable-next-line no-eval
      const data = eval(`(${match[1]})`);
      return data;
    }

    throw new Error(`Could not find export in ${filePath}`);
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Load and parse data from TypeScript files
 */
function loadStaticData() {
  try {
    console.log('📂 Loading static data files...');

    // Load food data
    const foodDataPath = path.join(__dirname, '../src/data/foodData.ts');
    const foodData = parseTypeScriptExport(foodDataPath);

    // Load exercise data
    const resistanceExercisesPath = path.join(__dirname, '../src/data/resistanceExercises.ts');
    const correctiveExercisesPath = path.join(__dirname, '../src/data/correctiveExercises.ts');
    const cardioExercisesPath = path.join(__dirname, '../src/data/cardioExercises.ts');
    const warmupCooldownPath = path.join(__dirname, '../src/data/warmupCooldown.ts');

    const resistanceExercises = parseTypeScriptExport(resistanceExercisesPath);
    const correctiveExercises = parseTypeScriptExport(correctiveExercisesPath);
    const cardioExercises = parseTypeScriptExport(cardioExercisesPath);
    const warmupCooldown = parseTypeScriptExport(warmupCooldownPath);

    // Load supplements data
    const supplementsDataPath = path.join(__dirname, '../src/data/supplementsData.ts');
    const supplementsData = parseTypeScriptExport(supplementsDataPath);

    console.log('✅ Static data files loaded successfully');

    return {
      foodData,
      resistanceExercises,
      correctiveExercises,
      cardioExercises,
      warmupCooldown,
      supplementsData
    };
  } catch (error) {
    console.error('❌ Error loading static data:', error.message);
    process.exit(1);
  }
}


/**
 * Migrate food data to Supabase
 */
async function migrateFoods(foodData) {
  console.log('🍎 Migrating foods data...');

  const foodsToInsert = [];

  // Handle the foodData structure
  if (foodData && typeof foodData === 'object') {
    Object.entries(foodData).forEach(([category, foods]) => {
      if (typeof foods === 'object') {
        Object.entries(foods).forEach(([foodName, foodInfo]) => {
          if (typeof foodInfo === 'object' && foodInfo !== null) {
            foodsToInsert.push({
              name: foodName,
              category,
              unit: foodInfo.u || foodInfo.unit || 'گرم',
              calories: parseFloat(foodInfo.p) || parseFloat(foodInfo.calories) || 0,
              protein: parseFloat(foodInfo.b) || parseFloat(foodInfo.protein) || 0,
              carbs: parseFloat(foodInfo.c) || parseFloat(foodInfo.carbs) || 0,
              fat: parseFloat(foodInfo.f) || parseFloat(foodInfo.fat) || 0,
              fiber: parseFloat(foodInfo.ch) || parseFloat(foodInfo.fiber) || 0,
              base_amount: parseFloat(foodInfo.base_amount) || 100
            });
          }
        });
      }
    });
  }

  if (foodsToInsert.length === 0) {
    console.warn('⚠️ No foods found to migrate');
    return true;
  }

  console.log(`📊 Inserting ${foodsToInsert.length} food items...`);

  // Insert in batches
  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < foodsToInsert.length; i += BATCH_SIZE) {
    const batch = foodsToInsert.slice(i, i + BATCH_SIZE);

    try {
      const { error } = await supabase
        .from('foods')
        .upsert(batch, { onConflict: 'name' });

      if (error) throw error;

      inserted += batch.length;
      console.log(`✅ Inserted ${inserted}/${foodsToInsert.length} foods...`);
    } catch (error) {
      console.error(`❌ Error inserting foods batch at ${i}:`, error.message);
      return false;
    }
  }

  console.log('✅ Foods migration completed');
  return true;
}

/**
 * Migrate exercises data to Supabase
 */
async function migrateExercises(data) {
  console.log('💪 Migrating exercises data...');

  const exercisesToInsert = [];

  // Migrate resistance exercises
  if (data.resistanceExercises) {
    console.log('  📋 Processing resistance exercises...');
    Object.entries(data.resistanceExercises).forEach(([muscleGroup, subMuscles]) => {
      if (typeof subMuscles === 'object') {
        Object.entries(subMuscles).forEach(([subMuscle, exerciseNames]) => {
          if (Array.isArray(exerciseNames)) {
            exerciseNames.forEach(name => {
              exercisesToInsert.push({
                name: String(name),
                muscle_group: String(muscleGroup),
                sub_muscle_group: String(subMuscle),
                type: 'resistance',
                mechanics: subMuscle.includes('فیبرهای') ? 'compound' : 'isolation'
              });
            });
          }
        });
      }
    });
  }

  // Migrate corrective exercises
  if (data.correctiveExercises) {
    console.log('  📋 Processing corrective exercises...');
    Object.entries(data.correctiveExercises).forEach(([category, exerciseNames]) => {
      if (Array.isArray(exerciseNames)) {
        exerciseNames.forEach(name => {
          exercisesToInsert.push({
            name: String(name),
            muscle_group: String(category),
            type: 'corrective',
            mechanics: 'corrective'
          });
        });
      }
    });
  }

  // Migrate cardio exercises
  if (data.cardioExercises) {
    console.log('  📋 Processing cardio exercises...');
    Object.entries(data.cardioExercises).forEach(([category, exerciseNames]) => {
      if (Array.isArray(exerciseNames)) {
        exerciseNames.forEach(name => {
          exercisesToInsert.push({
            name: String(name),
            muscle_group: String(category),
            type: 'cardio',
            mechanics: 'aerobic'
          });
        });
      }
    });
  }

  // Migrate warmup/cooldown exercises
  if (data.warmupCooldown) {
    console.log('  📋 Processing warmup/cooldown exercises...');
    Object.entries(data.warmupCooldown).forEach(([type, exercises]) => {
      if (typeof exercises === 'object') {
        Object.entries(exercises).forEach(([category, exerciseNames]) => {
          if (Array.isArray(exerciseNames)) {
            exerciseNames.forEach(name => {
              exercisesToInsert.push({
                name: String(name),
                muscle_group: String(category),
                type: type.toLowerCase(),
                mechanics: type === 'warmup' ? 'dynamic-stretch' : 'static-stretch'
              });
            });
          }
        });
      }
    });
  }

  if (exercisesToInsert.length === 0) {
    console.warn('⚠️ No exercises found to migrate');
    return true;
  }

  console.log(`📊 Inserting ${exercisesToInsert.length} exercise items...`);

  // Insert in batches
  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < exercisesToInsert.length; i += BATCH_SIZE) {
    const batch = exercisesToInsert.slice(i, i + BATCH_SIZE);

    try {
      const { error } = await supabase
        .from('exercises')
        .upsert(batch, { onConflict: 'name' });

      if (error) throw error;

      inserted += batch.length;
      console.log(`✅ Inserted ${inserted}/${exercisesToInsert.length} exercises...`);
    } catch (error) {
      console.error(`❌ Error inserting exercises batch at ${i}:`, error.message);
      return false;
    }
  }

  console.log('✅ Exercises migration completed');
  return true;
}

/**
 * Migrate supplements data to Supabase
 */
async function migrateSupplements(supplementsData) {
  console.log('💊 Migrating supplements data...');

  const supplementsToInsert = [];

  if (supplementsData && typeof supplementsData === 'object') {
    Object.entries(supplementsData).forEach(([category, supplements]) => {
      if (typeof supplements === 'object') {
        Object.entries(supplements).forEach(([supplementName, supplementInfo]) => {
          if (typeof supplementInfo === 'object' && supplementInfo !== null) {
            supplementsToInsert.push({
              name: supplementName,
              category,
              type: supplementInfo.type || null,
              dosage: supplementInfo.dosage || null,
              unit: supplementInfo.unit || null,
              benefits: supplementInfo.benefits || null,
              timing: supplementInfo.timing || null,
              notes: supplementInfo.notes || null
            });
          }
        });
      }
    });
  }

  if (supplementsToInsert.length === 0) {
    console.warn('⚠️ No supplements found to migrate');
    return true;
  }

  console.log(`📊 Inserting ${supplementsToInsert.length} supplement items...`);

  // Insert in batches
  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < supplementsToInsert.length; i += BATCH_SIZE) {
    const batch = supplementsToInsert.slice(i, i + BATCH_SIZE);

    try {
      const { error } = await supabase
        .from('supplements')
        .upsert(batch, { onConflict: 'name' });

      if (error) throw error;

      inserted += batch.length;
      console.log(`✅ Inserted ${inserted}/${supplementsToInsert.length} supplements...`);
    } catch (error) {
      console.error(`❌ Error inserting supplements batch at ${i}:`, error.message);
      return false;
    }
  }

  console.log('✅ Supplements migration completed');
  return true;
}

/**
 * Verify migration results
 */
async function verifyMigration() {
  console.log('🔍 Verifying migration...');

  const { data: foods, error: foodsError } = await supabase
    .from('foods')
    .select('count', { count: 'exact', head: true });

  const { data: exercises, error: exercisesError } = await supabase
    .from('exercises')
    .select('count', { count: 'exact', head: true });

  const { data: supplements, error: supplementsError } = await supabase
    .from('supplements')
    .select('count', { count: 'exact', head: true });

  if (foodsError || exercisesError || supplementsError) {
    console.error('❌ Error verifying migration');
    return false;
  }

  console.log(`📊 Migration results:`);
  console.log(`   - Foods: ${foods || 0}`);
  console.log(`   - Exercises: ${exercises || 0}`);
  console.log(`   - Supplements: ${supplements || 0}`);
  console.log(`   - Total: ${(foods || 0) + (exercises || 0) + (supplements || 0)}`);

  return true;
}

/**
 * Main migration function
 */
async function main() {
  try {
    // Test connection
    console.log('🔗 Testing Supabase connection...');
    const { error: connectionError } = await supabase.from('foods').select('count', { count: 'exact', head: true });
    if (connectionError && !connectionError.message.includes('relation "public.foods" does not exist')) {
      throw new Error(`Connection failed: ${connectionError.message}`);
    }
    console.log('✅ Supabase connection successful');

    // Load static data
    const data = loadStaticData();

    // Run migrations
    const foodsSuccess = await migrateFoods(data.foodData);
    const exercisesSuccess = await migrateExercises(data);
    const supplementsSuccess = await migrateSupplements(data.supplementsData);

    if (foodsSuccess && exercisesSuccess && supplementsSuccess) {
      await verifyMigration();
      console.log('🎉 Migration completed successfully!');
    } else {
      console.error('❌ Migration failed');
      process.exit(1);
    }

  } catch (error) {
    console.error('💥 Migration error:', error.message);
    process.exit(1);
  }
}

// Run migration
main();