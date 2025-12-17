#!/usr/bin/env node
/**
 * Complete Database Replacement Script
 * Clears all existing data and replaces with comprehensive data from src/data/
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load data from TypeScript files by parsing them
function loadTypeScriptData(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Simple extraction of export default
  const exportMatch = content.match(/export\s+const\s+(\w+)\s*=\s*(\[[\s\S]*?\]);/);
  if (!exportMatch) {
    throw new Error(`Could not parse data from ${filePath}`);
  }

  // Use eval to parse the array (not ideal but works for this)
  try {
    // eslint-disable-next-line no-eval
    return eval(exportMatch[2]);
  } catch (error) {
    throw new Error(`Failed to parse data from ${filePath}: ${error.message}`);
  }
}

// Load comprehensive data
const exercises = loadTypeScriptData(path.join(__dirname, '../src/data/exercises.ts')).find(item => item.exercises)?.exercises || [];
const foods = loadTypeScriptData(path.join(__dirname, '../src/data/foods.ts')).find(item => item.foods)?.foods || [];
const supplements = loadTypeScriptData(path.join(__dirname, '../src/data/supplementsComplete.ts')).find(item => item.supplementsComplete)?.supplementsComplete || [];

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

/**
 * Clear all existing data from tables
 */
async function clearExistingData() {
  console.log('🗑️ Clearing existing data...');

  const tables = ['exercises', 'foods', 'supplements', 'templates', 'coaching_relationships'];

  for (const table of tables) {
    try {
      console.log(`  Deleting from ${table}...`);
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        console.warn(`⚠️ Could not clear ${table} (table may not exist): ${error.message}`);
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
 * Convert exercises to database format
 */
function convertExercisesToDB() {
  return exercises.map(exercise => ({
    name: exercise.name,
    name_en: exercise.nameEn,
    muscle_group: exercise.muscleGroup,
    sub_muscle_group: exercise.subMuscleGroup || null,
    equipment: exercise.equipment,
    type: exercise.type,
    mechanics: exercise.mechanics,
    difficulty: exercise.difficulty,
    description: exercise.description,
    instructions: exercise.instructions ? exercise.instructions.join('\n') : null,
    tips: exercise.tips ? exercise.tips.join('\n') : null,
    common_mistakes: exercise.commonMistakes ? exercise.commonMistakes.join('\n') : null,
    variations: exercise.variations ? exercise.variations.join('\n') : null,
    primary_muscles: exercise.primaryMuscles ? exercise.primaryMuscles.join('\n') : null,
    secondary_muscles: exercise.secondaryMuscles ? exercise.secondaryMuscles.join('\n') : null,
    contraindications: exercise.contraindications ? exercise.contraindications.join('\n') : null,
    preparation_time: exercise.preparationTime || null,
    execution_time: exercise.executionTime || null,
    rest_time: exercise.restTime || null,
    calories_per_hour: exercise.caloriesPerHour || null
  }));
}

/**
 * Convert foods to database format
 */
function convertFoodsToDB() {
  return foods.map(food => ({
    name: food.name,
    name_en: food.nameEn,
    category: food.category,
    subcategory: food.subcategory || null,
    unit: food.unit,
    base_amount: food.baseAmount,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    fiber: food.fiber || null,
    sugar: food.sugar || null,
    sodium: food.sodium || null,
    potassium: food.potassium || null,
    calcium: food.calcium || null,
    iron: food.iron || null,
    vitamin_c: food.vitaminC || null,
    vitamin_a: food.vitaminA || null,
    glycemic_index: food.glycemicIndex || null,
    is_vegan: food.isVegan || false,
    is_gluten_free: food.isGlutenFree || false,
    allergens: food.allergens ? food.allergens.join('\n') : null,
    preparation: food.preparation || null,
    serving_suggestions: food.servingSuggestions ? food.servingSuggestions.join('\n') : null,
    nutritional_highlights: food.nutritionalHighlights ? food.nutritionalHighlights.join('\n') : null
  }));
}

/**
 * Convert supplements to database format
 */
function convertSupplementsToDB() {
  return supplements.map(supplement => ({
    name: supplement.name,
    name_en: supplement.nameEn,
    category: supplement.category,
    subcategory: supplement.subcategory || null,
    type: supplement.type || null,
    form: supplement.form,
    dosage: `${supplement.dosage.amount} ${supplement.dosage.unit}`,
    unit: supplement.dosage.unit,
    benefits: supplement.benefits.join('\n'),
    timing: supplement.dosage.timing.join('\n'),
    notes: supplement.notes || null
  }));
}

/**
 * Insert data into table with progress tracking
 */
async function insertDataWithProgress(tableName, data, dataType) {
  if (!data || data.length === 0) {
    console.log(`⚠️ No ${dataType} data to insert`);
    return true;
  }

  console.log(`📊 Inserting ${data.length} ${dataType} into ${tableName}...`);

  const BATCH_SIZE = 10; // Smaller batch size for reliability
  let inserted = 0;
  let failed = 0;

  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(data.length / BATCH_SIZE);

    process.stdout.write(`  Batch ${batchNumber}/${totalBatches}: `);

    try {
      const { error } = await supabase
        .from(tableName)
        .insert(batch);

      if (error) {
        console.log(`❌ Failed (${error.message})`);
        failed += batch.length;
      } else {
        console.log(`✅ Success`);
        inserted += batch.length;
      }
    } catch (error) {
      console.log(`❌ Error (${error.message})`);
      failed += batch.length;
    }
  }

  const success = failed === 0;
  console.log(`✅ ${tableName} insertion completed: ${inserted} inserted, ${failed} failed\n`);
  return success;
}

/**
 * Verify data insertion
 */
async function verifyInsertion() {
  console.log('🔍 Verifying data insertion...');

  try {
    const { data: exercisesCount, error: exercisesError } = await supabase
      .from('exercises')
      .select('count', { count: 'exact', head: true });

    const { data: foodsCount, error: foodsError } = await supabase
      .from('foods')
      .select('count', { count: 'exact', head: true });

    const { data: supplementsCount, error: supplementsError } = await supabase
      .from('supplements')
      .select('count', { count: 'exact', head: true });

    if (exercisesError || foodsError || supplementsError) {
      console.warn('⚠️ Could not verify counts (tables may not exist)');
      return false;
    }

    console.log('📊 Verification Results:');
    console.log(`   Exercises: ${exercisesCount || 0} (${exercises.length} expected)`);
    console.log(`   Foods: ${foodsCount || 0} (${foods.length} expected)`);
    console.log(`   Supplements: ${supplementsCount || 0} (${supplements.length} expected)`);

    const totalExpected = exercises.length + foods.length + supplements.length;
    const totalActual = (exercisesCount || 0) + (foodsCount || 0) + (supplementsCount || 0);

    console.log(`   Total: ${totalActual}/${totalExpected}`);

    if (totalActual === totalExpected) {
      console.log('✅ All data inserted successfully!\n');
      return true;
    } else {
      console.log('⚠️ Some data may be missing\n');
      return false;
    }

  } catch (error) {
    console.warn('⚠️ Verification failed:', error.message);
    return false;
  }
}

/**
 * Test application connectivity
 */
async function testApplicationConnectivity() {
  console.log('🧪 Testing application connectivity...');

  try {
    // Test exercises
    const { data: testExercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('name, muscle_group, type')
      .limit(5);

    if (exercisesError) {
      console.log('❌ Exercises query failed');
      return false;
    }

    // Test foods
    const { data: testFoods, error: foodsError } = await supabase
      .from('foods')
      .select('name, category, calories')
      .limit(5);

    if (foodsError) {
      console.log('❌ Foods query failed');
      return false;
    }

    // Test supplements
    const { data: testSupplements, error: supplementsError } = await supabase
      .from('supplements')
      .select('name, category, dosage')
      .limit(5);

    if (supplementsError) {
      console.log('❌ Supplements query failed');
      return false;
    }

    console.log('✅ Sample Data Retrieved:');
    console.log(`   Exercises: ${testExercises?.length || 0} samples`);
    console.log(`   Foods: ${testFoods?.length || 0} samples`);
    console.log(`   Supplements: ${testSupplements?.length || 0} samples`);
    console.log('✅ Application connectivity test passed!\n');

    return true;

  } catch (error) {
    console.log('❌ Connectivity test failed:', error.message);
    return false;
  }
}

/**
 * Clear local storage and cache
 */
function clearLocalData() {
  console.log('🧹 Clearing local storage and cache...');

  try {
    // Clear localStorage if in browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('exercises') || key.includes('foods') || key.includes('supplements') ||
            key.includes('flexpro') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
      console.log('✅ Local storage cleared');
    }

    // Clear sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const sessionKeys = Object.keys(sessionStorage);
      sessionKeys.forEach(key => {
        if (key.includes('exercises') || key.includes('foods') || key.includes('supplements') ||
            key.includes('flexpro') || key.includes('supabase')) {
          sessionStorage.removeItem(key);
        }
      });
      console.log('✅ Session storage cleared');
    }

  } catch (error) {
    console.warn('⚠️ Could not clear local storage:', error.message);
  }

  console.log('✅ Local data clearing completed\n');
}

/**
 * Main replacement function
 */
async function main() {
  console.log('🚀 Complete Database Replacement Process');
  console.log('======================================\n');

  try {
    // Test connection
    console.log('🔗 Testing Supabase connection...');
    const { error: connectionError } = await supabase.from('exercises').select('count', { count: 'exact', head: true });
    if (connectionError && !connectionError.message.includes('does not exist')) {
      throw new Error(`Connection failed: ${connectionError.message}`);
    }
    console.log('✅ Supabase connection successful\n');

    // Step 1: Clear existing data
    await clearExistingData();

    // Step 2: Clear local data
    clearLocalData();

    // Step 3: Convert data formats
    console.log('🔄 Converting data formats...');
    const exercisesDB = convertExercisesToDB();
    const foodsDB = convertFoodsToDB();
    const supplementsDB = convertSupplementsToDB();

    console.log(`📊 Data prepared:`);
    console.log(`   Exercises: ${exercisesDB.length} records`);
    console.log(`   Foods: ${foodsDB.length} records`);
    console.log(`   Supplements: ${supplementsDB.length} records`);
    console.log(`   Total: ${exercisesDB.length + foodsDB.length + supplementsDB.length} records\n`);

    // Step 4: Insert new data
    console.log('📥 Inserting new comprehensive data...');

    const exercisesSuccess = await insertDataWithProgress('exercises', exercisesDB, 'exercises');
    const foodsSuccess = await insertDataWithProgress('foods', foodsDB, 'foods');
    const supplementsSuccess = await insertDataWithProgress('supplements', supplementsDB, 'supplements');

    // Step 5: Verify insertion
    const verificationSuccess = await verifyInsertion();

    // Step 6: Test application connectivity
    const connectivitySuccess = await testApplicationConnectivity();

    // Summary
    console.log('=' .repeat(60));
    console.log('📋 FINAL SUMMARY');
    console.log('=' .repeat(60));
    console.log('Database Replacement Process Results:');
    console.log(`   ✅ Exercises: ${exercisesSuccess ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   ✅ Foods: ${foodsSuccess ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   ✅ Supplements: ${supplementsSuccess ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   ✅ Verification: ${verificationSuccess ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   ✅ Connectivity: ${connectivitySuccess ? 'SUCCESS' : 'FAILED'}`);

    const overallSuccess = exercisesSuccess && foodsSuccess && supplementsSuccess && verificationSuccess;

    if (overallSuccess) {
      console.log('\n🎉 COMPLETE DATABASE REPLACEMENT SUCCESSFUL!');
      console.log('   All data has been replaced with comprehensive datasets.');
      console.log('   Application is now connected to the new database.');
      console.log('\n📝 Next Steps:');
      console.log('   1. Restart the application');
      console.log('   2. Clear browser cache if needed');
      console.log('   3. Test all features with new data');
    } else {
      console.log('\n⚠️ DATABASE REPLACEMENT COMPLETED WITH ISSUES');
      console.log('   Some steps failed. Please check the errors above.');
      console.log('   You may need to run this script again or manually fix issues.');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 CRITICAL ERROR during database replacement:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check Supabase connection');
    console.log('   2. Ensure tables exist (run create-tables.js first)');
    console.log('   3. Check environment variables');
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