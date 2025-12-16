#!/usr/bin/env node
/**
 * Migration Script: Import Static Exercise and Food Data to Supabase
 * This script reads data from TypeScript files and inserts them into Supabase tables
 * Usage: node scripts/migrate-data-to-supabase.js
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Create client with options to bypass schema cache
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'migration-script'
    }
  }
});

/**
 * Parse TypeScript file to extract export (handles both export const and export default)
 */
function parseTypeScriptExport(filePath, exportName) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Try export const first
    let match = content.match(new RegExp(`export\\s+const\\s+${exportName}\\s*:\\s*[^=]*=\\s*(\\{[\\s\\S]*?\\});`));
    if (match) {
      // eslint-disable-next-line no-eval
      const data = eval(`(${match[1]})`);
      return data;
    }
    
    // Try export default
    match = content.match(/export\s+default\s+({[\s\S]*?})(?:;|$)/);
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
 * Migrate resistance exercises
 */
async function migrateResistanceExercises() {
  console.log('\n📋 Migrating Resistance Exercises...');
  
  const dataPath = path.join(__dirname, '../src/data/resistanceExercises.ts');
  const resistanceData = parseTypeScriptExport(dataPath, 'resistanceExercises');
  
  if (!resistanceData) {
    console.warn('⚠️  Skipping resistance exercises - data not found');
    return 0;
  }

  const exercises = [];
  
  Object.entries(resistanceData).forEach(([muscleGroup, subMuscles]) => {
    if (typeof subMuscles !== 'object') return;
    
    Object.entries(subMuscles).forEach(([subMuscle, exerciseNames]) => {
      if (Array.isArray(exerciseNames)) {
        exerciseNames.forEach(name => {
          exercises.push({
            name: String(name),
            muscle_group: String(muscleGroup),
            sub_muscle_group: String(subMuscle),
            type: 'resistance',
            equipment: null,
            mechanics: null,
            description: null,
          });
        });
      }
    });
  });

  if (exercises.length === 0) {
    console.warn('⚠️  No exercises found in resistance data');
    return;
  }

  // Insert in batches to avoid timeout
  const BATCH_SIZE = 100;
  let inserted = 0;

  for (let i = 0; i < exercises.length; i += BATCH_SIZE) {
    const batch = exercises.slice(i, i + BATCH_SIZE);
    
    try {
      const { error } = await supabase
        .from('exercises')
        .upsert(batch, { onConflict: 'name' });
      
      if (error) throw error;
      
      inserted += batch.length;
      console.log(`✅ Inserted ${inserted}/${exercises.length} resistance exercises...`);
    } catch (error) {
      console.error(`❌ Error inserting batch at ${i}:`, error.message);
    }
  }

  console.log(`✅ Completed: ${inserted} resistance exercises migrated`);
  return inserted;
}

/**
 * Migrate corrective exercises
 */
async function migrateCorrectiveExercises() {
  console.log('\n📋 Migrating Corrective Exercises...');
  
  const dataPath = path.join(__dirname, '../src/data/correctiveExercises.ts');
  const correctiveData = parseTypeScriptExport(dataPath, 'correctiveExercises');
  
  if (!correctiveData) {
    console.warn('⚠️  Skipping corrective exercises - data not found');
    return 0;
  }

  const exercises = [];
  
  Object.entries(correctiveData).forEach(([category, exerciseNames]) => {
    if (Array.isArray(exerciseNames)) {
      exerciseNames.forEach(name => {
        exercises.push({
          name: String(name),
          muscle_group: String(category),
          type: 'corrective',
          equipment: null,
          mechanics: null,
          description: null,
        });
      });
    }
  });

  if (exercises.length === 0) {
    console.warn('⚠️  No exercises found in corrective data');
    return 0;
  }

  const BATCH_SIZE = 100;
  let inserted = 0;

  for (let i = 0; i < exercises.length; i += BATCH_SIZE) {
    const batch = exercises.slice(i, i + BATCH_SIZE);
    
    try {
      const { error } = await supabase
        .from('exercises')
        .upsert(batch, { onConflict: 'name' });
      
      if (error) throw error;
      
      inserted += batch.length;
      console.log(`✅ Inserted ${inserted}/${exercises.length} corrective exercises...`);
    } catch (error) {
      console.error(`❌ Error inserting batch at ${i}:`, error.message);
    }
  }

  console.log(`✅ Completed: ${inserted} corrective exercises migrated`);
  return inserted;
}

/**
 * Migrate food data
 */
async function migrateFoods() {
  console.log('\n📋 Migrating Foods...');
  
  const dataPath = path.join(__dirname, '../src/data/foodData.ts');
  const foodData = parseTypeScriptExport(dataPath, 'foodData');
  
  if (!foodData || typeof foodData !== 'object') {
    console.warn('⚠️  Skipping foods - data not found or invalid format');
    return 0;
  }

  const foods = [];
  
  // Handle both array and object formats
  const entries = Array.isArray(foodData) ? foodData : Object.entries(foodData);
  
  entries.forEach(entry => {
    let category, items;
    
    if (Array.isArray(foodData)) {
      // If it's an array, assume it's already in the right format
      items = [entry];
      category = 'سایر';
    } else {
      [category, items] = entry;
      if (typeof items !== 'object') return;
    }
    
    // If items is an object of food entries
    if (!Array.isArray(items)) {
      Object.entries(items).forEach(([foodName, foodInfo]) => {
        // Map abbreviations: u=unit, p/c=calories, b=protein, c=carbs, f=fat, ch=fiber
        foods.push({
          name: foodName,
          category: category,
          unit: foodInfo.u || 'grams',
          calories: parseInt(foodInfo.p) || 0,
          protein: parseInt(foodInfo.b) || 0,
          carbs: parseInt(foodInfo.c) || 0,
          fat: parseInt(foodInfo.f) || 0,
          fiber: parseInt(foodInfo.ch) || 0,
          base_amount: 100,
        });
      });
    } else {
      // If items is an array of food names
      items.forEach(foodName => {
        foods.push({
          name: foodName,
          category: category,
          unit: 'grams',
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          base_amount: 100,
        });
      });
    }
  });

  if (foods.length === 0) {
    console.warn('⚠️  No foods found');
    return 0;
  }

  const BATCH_SIZE = 100;
  let inserted = 0;

  for (let i = 0; i < foods.length; i += BATCH_SIZE) {
    const batch = foods.slice(i, i + BATCH_SIZE);
    
    try {
      const { error } = await supabase
        .from('foods')
        .upsert(batch, { onConflict: 'name' });
      
      if (error) throw error;
      
      inserted += batch.length;
      console.log(`✅ Inserted ${inserted}/${foods.length} foods...`);
    } catch (error) {
      console.error(`❌ Error inserting batch at ${i}:`, error.message);
    }
  }

  console.log(`✅ Completed: ${inserted} foods migrated`);
  return inserted;
}

/**
 * Main migration function
 */
async function runMigration() {
  console.log('🚀 Starting data migration to Supabase...\n');
  
  try {
    // Test Supabase connection
    console.log('🔌 Testing Supabase connection...');
    const { data, error } = await supabase.from('exercises').select('count()', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Failed to connect to Supabase:', error.message);
      process.exit(1);
    }
    
    console.log('✅ Supabase connection successful\n');

    // Run migrations
    const resistanceCount = await migrateResistanceExercises();
    const correctiveCount = await migrateCorrectiveExercises();
    const foodsCount = await migrateFoods();

    console.log('\n' + '='.repeat(50));
    console.log('✅ Migration completed successfully!');
    console.log(`   Resistance Exercises: ${resistanceCount}`);
    console.log(`   Corrective Exercises: ${correctiveCount}`);
    console.log(`   Foods: ${foodsCount}`);
    console.log(`   Total: ${resistanceCount + correctiveCount + foodsCount}`);
    console.log('='.repeat(50) + '\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
runMigration();
