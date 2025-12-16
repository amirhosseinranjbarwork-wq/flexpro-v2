#!/usr/bin/env node
/**
 * Complete database setup script
 * This script will guide you through the complete setup process
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSetup() {
  console.log('🔍 Checking complete setup...\n');

  // Check 1: Environment variables
  console.log('✅ Environment variables configured');

  // Check 2: Supabase connection
  try {
    const { error } = await supabase.from('profiles').select('count()', { count: 'exact', head: true });
    if (error) {
      console.log('❌ Supabase connection failed:', error.message);
      console.log('Full error:', JSON.stringify(error, null, 2));
      return false;
    }
    console.log('✅ Supabase connection working');
  } catch (error) {
    console.log('❌ Supabase connection failed:', error.message);
    console.log('Error type:', error.constructor.name);
    return false;
  }

  // Check 3: Tables exist
  const tablesExist = await checkTablesExist();
  if (!tablesExist) {
    console.log('\n❌ CRITICAL: Database tables not found!');
    console.log('📋 SOLUTION: Execute SQL migrations manually in Supabase Dashboard');
    console.log('\n🔗 Go to: https://supabase.com/dashboard');
    console.log('1. Select your project');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy and paste the following SQL:');

    // Show migration content
    const exercisesSql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20250116_create_exercises_foods_tables.sql'), 'utf-8');
    const adminSql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20250116_add_super_admin_flag.sql'), 'utf-8');

    console.log('\n' + '='.repeat(80));
    console.log('MIGRATION 1 - Exercises and Foods Tables:');
    console.log('='.repeat(80));
    console.log(exercisesSql);

    console.log('\n' + '='.repeat(80));
    console.log('MIGRATION 2 - Admin Features:');
    console.log('='.repeat(80));
    console.log(adminSql);

    console.log('\n⚠️  IMPORTANT: Execute both migrations in order!');
    console.log('After executing both, run: node scripts/setup-complete.js');

    return false;
  }

  // Check 4: Data migrated
  const dataMigrated = await checkDataMigrated();
  if (!dataMigrated) {
    console.log('\n⚠️  Data not migrated yet');
    console.log('📋 SOLUTION: Run data migration');
    console.log('node scripts/migrate-data-to-supabase.js');

    // Try to run migration automatically
    console.log('\n🚀 Attempting automatic data migration...');
    try {
      const { spawn } = await import('child_process');
      const migrationProcess = spawn('node', ['scripts/migrate-data-to-supabase.js'], {
        stdio: 'inherit',
        cwd: path.dirname(__dirname)
      });

      return new Promise((resolve) => {
        migrationProcess.on('close', (code) => {
          if (code === 0) {
            console.log('\n✅ Data migration completed successfully!');
            resolve(true);
          } else {
            console.log('\n❌ Data migration failed');
            resolve(false);
          }
        });
      });
    } catch (error) {
      console.log('❌ Could not run migration automatically');
      return false;
    }
  }

  // Check 5: Final verification
  console.log('\n🎯 Running final verification...');

  try {
    // Test exercises search
    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('name, muscle_group')
      .limit(5);

    if (exercisesError) throw exercisesError;

    // Test foods search
    const { data: foods, error: foodsError } = await supabase
      .from('foods')
      .select('name, category')
      .limit(5);

    if (foodsError) throw foodsError;

    console.log(`✅ Found ${exercises.length} exercises and ${foods.length} foods`);
    console.log('✅ All systems operational!');

    console.log('\n🎉 SETUP COMPLETE!');
    console.log('Your FlexPro v2 is ready to use!');
    console.log('\n🚀 To start the application:');
    console.log('npm run dev');

    return true;

  } catch (error) {
    console.log('❌ Final verification failed:', error.message);
    return false;
  }
}

async function checkTablesExist() {
  try {
    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('count()', { count: 'exact', head: true });

    const { data: foods, error: foodsError } = await supabase
      .from('foods')
      .select('count()', { count: 'exact', head: true });

    return !exercisesError && !foodsError;
  } catch (error) {
    return false;
  }
}

async function checkDataMigrated() {
  try {
    const { count: exerciseCount, error: exerciseError } = await supabase
      .from('exercises')
      .select('*', { count: 'exact', head: true });

    const { count: foodCount, error: foodError } = await supabase
      .from('foods')
      .select('*', { count: 'exact', head: true });

    return !exerciseError && !foodError && (exerciseCount > 0 || foodCount > 0);
  } catch (error) {
    return false;
  }
}

// Run the setup check
checkSetup();
