#!/usr/bin/env node

/**
 * Database Verification Script
 * Checks if tables exist and have data
 * Run: node scripts/verify-database.js
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  console.log('🔍 Verifying database tables...\n');

  const tables = ['exercises', 'foods', 'supplements'];
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: Error - ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${count} records found`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }

  // Get sample data
  console.log('\n📊 Sample data:\n');

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(3);

      if (!error && data && data.length > 0) {
        console.log(`\n${table}:`);
        data.forEach((item, i) => {
          console.log(`  ${i + 1}. ${item.name || 'N/A'}`);
        });
      }
    } catch (err) {
      console.log(`Error fetching ${table}:`, err.message);
    }
  }

  console.log('\n✨ Verification complete!');
}

verifyDatabase().catch(console.error);
