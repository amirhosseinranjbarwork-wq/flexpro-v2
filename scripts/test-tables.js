#!/usr/bin/env node
/**
 * Test database tables functionality
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

// Create client without schema cache
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'test-script'
    }
  }
});

async function testTables() {
  console.log('🧪 Testing database tables...\n');

  try {
    // Test exercises table
    console.log('Testing exercises table...');
    const { data: exerciseData, error: exerciseError } = await supabase
      .from('exercises')
      .select('name, muscle_group')
      .limit(5);

    if (exerciseError) {
      console.log('❌ Exercises table error:', exerciseError.message);
    } else {
      console.log(`✅ Exercises table OK - Found ${exerciseData.length} records`);
      if (exerciseData.length > 0) {
        console.log('   Sample:', exerciseData[0]);
      }
    }

    // Test foods table
    console.log('\nTesting foods table...');
    const { data: foodData, error: foodError } = await supabase
      .from('foods')
      .select('name, category, calories')
      .limit(5);

    if (foodError) {
      console.log('❌ Foods table error:', foodError.message);
    } else {
      console.log(`✅ Foods table OK - Found ${foodData.length} records`);
      if (foodData.length > 0) {
        console.log('   Sample:', foodData[0]);
      }
    }

    // Test insert capability
    console.log('\nTesting insert capability...');
    const testExercise = {
      name: 'Test Exercise - ' + Date.now(),
      muscle_group: 'chest',
      type: 'resistance'
    };

    const { error: insertError } = await supabase
      .from('exercises')
      .insert(testExercise);

    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
    } else {
      console.log('✅ Insert successful');
    }

  } catch (error) {
    console.log('❌ General error:', error.message);
  }
}

testTables();
