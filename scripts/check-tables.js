#!/usr/bin/env node
/**
 * Check if database tables exist
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

async function checkTables() {
  console.log('🔍 Checking database tables...\n');

  const tables = ['exercises', 'foods'];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count()', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ Table '${table}' does not exist:`, error.message);
      } else {
        console.log(`✅ Table '${table}' exists and is accessible`);
      }
    } catch (error) {
      console.log(`❌ Error checking table '${table}':`, error.message);
    }
  }

  console.log('\n💡 If tables don\'t exist, run the SQL migrations in Supabase Dashboard first.');
}

checkTables();
