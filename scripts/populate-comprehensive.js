#!/usr/bin/env node
/**
 * Comprehensive Database Population
 * Populates database with complete exercise, food, and supplement data
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { exercises } from '../src/data/exercises.js';
import { foods } from '../src/data/foods.js';
import { supplementsComplete as supplements } from '../src/data/supplementsComplete.js';

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
 * Insert data into table
 */
async function insertData(tableName, data, columns) {
  if (!data || data.length === 0) {
    console.log(`⚠️ No data to insert for ${tableName}`);
    return true;
  }

  console.log(`📊 Inserting ${data.length} records into ${tableName}...`);

  const BATCH_SIZE = 25;
  let inserted = 0;

  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);

    try {
      const { error } = await supabase
        .from(tableName)
        .upsert(batch, { onConflict: 'name' });

      if (error) {
        // If table doesn't exist, skip
        if (error.message.includes('does not exist')) {
          console.log(`⚠️ Table ${tableName} does not exist. Skipping...`);
          return false;
        }
        throw error;
      }

      inserted += batch.length;
      console.log(`✅ Inserted ${inserted}/${data.length} ${tableName} records...`);
    } catch (error) {
      console.error(`❌ Error inserting ${tableName} batch at ${i}:`, error.message);
      return false;
    }
  }

  console.log(`✅ ${tableName} population completed`);
  return true;
}

/**
 * Convert exercises to database format
 */
function convertExercisesToDB() {
  return exercises.map(exercise => ({
    name: exercise.name,
    muscle_group: exercise.muscleGroup,
    sub_muscle_group: exercise.subMuscleGroup || null,
    equipment: exercise.equipment,
    type: exercise.type,
    mechanics: exercise.mechanics,
    description: exercise.description,
    difficulty: exercise.difficulty,
    instructions: exercise.instructions.join('\n'),
    tips: exercise.tips.join('\n'),
    common_mistakes: exercise.commonMistakes?.join('\n') || null,
    variations: exercise.variations?.join('\n') || null,
    primary_muscles: exercise.primaryMuscles?.join('\n') || null,
    secondary_muscles: exercise.secondaryMuscles?.join('\n') || null,
    contraindications: exercise.contraindications?.join('\n') || null,
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
    category: food.category,
    unit: food.unit,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    base_amount: food.baseAmount,
    fiber: food.fiber || null,
    sugar: food.sugar || null,
    sodium: food.sodium || null,
    potassium: food.potassium || null,
    calcium: food.calcium || null,
    iron: food.iron || null,
    vitamin_c: food.vitaminC || null,
    vitamin_a: food.vitaminA || null,
    glycemic_index: food.glycemicIndex || null,
    is_vegan: food.isVegan,
    is_gluten_free: food.isGlutenFree,
    allergens: food.allergens?.join('\n') || null,
    preparation: food.preparation || null,
    serving_suggestions: food.servingSuggestions?.join('\n') || null,
    nutritional_highlights: food.nutritionalHighlights?.join('\n') || null
  }));
}

/**
 * Convert supplements to database format
 */
function convertSupplementsToDB() {
  return supplements.map(supplement => ({
    name: supplement.name,
    category: supplement.category,
    type: supplement.type || null,
    dosage: `${supplement.dosage.amount} ${supplement.dosage.unit}`,
    unit: supplement.dosage.unit,
    benefits: supplement.benefits.join('\n'),
    timing: supplement.dosage.timing.join('\n'),
    notes: supplement.ingredients?.join('\n') || null
  }));
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Comprehensive database population...\n');

  try {
    // Test connection
    console.log('🔗 Testing Supabase connection...');
    const { error } = await supabase.from('exercises').select('count', { count: 'exact', head: true });
    if (error && !error.message.includes('does not exist')) {
      throw new Error(`Connection failed: ${error.message}`);
    }
    console.log('✅ Supabase connection successful\n');

    let totalSuccess = 0;
    let totalFailed = 0;

    // Convert data
    console.log('🔄 Converting data formats...');
    const exercisesDB = convertExercisesToDB();
    const foodsDB = convertFoodsToDB();
    const supplementsDB = convertSupplementsToDB();

    console.log(`📊 Prepared ${exercisesDB.length} exercises, ${foodsDB.length} foods, ${supplementsDB.length} supplements\n`);

    // Insert exercises
    const exercisesSuccess = await insertData('exercises', exercisesDB, []);
    if (exercisesSuccess) totalSuccess++; else totalFailed++;

    // Insert foods
    const foodsSuccess = await insertData('foods', foodsDB, []);
    if (foodsSuccess) totalSuccess++; else totalFailed++;

    // Insert supplements
    const supplementsSuccess = await insertData('supplements', supplementsDB, []);
    if (supplementsSuccess) totalSuccess++; else totalFailed++;

    console.log('\n' + '='.repeat(50));
    console.log('📊 Population Summary:');
    console.log(`   ✅ Successful: ${totalSuccess}`);
    console.log(`   ❌ Failed: ${totalFailed}`);
    console.log(`   📁 Total: ${totalSuccess + totalFailed}`);

    if (totalFailed === 0) {
      console.log('\n🎉 Database populated successfully!');

      // Verify results
      console.log('\n🔍 Verifying results...');
      try {
        const { data: exercisesCount } = await supabase.from('exercises').select('count', { count: 'exact', head: true });
        const { data: foodsCount } = await supabase.from('foods').select('count', { count: 'exact', head: true });
        const { data: supplementsCount } = await supabase.from('supplements').select('count', { count: 'exact', head: true });

        console.log(`   Exercises: ${exercisesCount || 0}`);
        console.log(`   Foods: ${foodsCount || 0}`);
        console.log(`   Supplements: ${supplementsCount || 0}`);
        console.log(`   Total: ${(exercisesCount || 0) + (foodsCount || 0) + (supplementsCount || 0)}`);
      } catch (e) {
        console.log('   Could not verify counts');
      }
    } else {
      console.log('\n⚠️ Some tables failed to populate. They may not exist yet.');
      console.log('Please create the tables first using the SQL provided by create-tables.js');
    }

  } catch (error) {
    console.error('\n💥 Population error:', error.message);
    process.exit(1);
  }
}

main();