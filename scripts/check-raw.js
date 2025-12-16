#!/usr/bin/env node
/**
 * Check tables using raw SQL
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

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkRaw() {
  console.log('🔍 Checking tables with raw SQL...\n');

  try {
    // Check if tables exist
    const { data: tablesData, error: tablesError } = await supabase.rpc('exec_sql', {
      sql: "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('exercises', 'foods');"
    });

    if (tablesError) {
      console.log('❌ Error checking tables:', tablesError.message);
    } else {
      console.log('📋 Tables found:', tablesData);
    }

    // Try to select from exercises directly
    const { data: exerciseData, error: exerciseError } = await supabase
      .from('exercises')
      .select('*')
      .limit(1);

    if (exerciseError) {
      console.log('❌ Cannot select from exercises:', exerciseError.message);
    } else {
      console.log('✅ Can select from exercises');
    }

  } catch (error) {
    console.log('❌ General error:', error.message);
  }
}

checkRaw();
