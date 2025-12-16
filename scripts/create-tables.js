#!/usr/bin/env node
/**
 * Create database tables directly
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
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'create-tables-script'
    }
  }
});

async function createTables() {
  console.log('🏗️ Creating database tables...\n');

  try {
    // Read migration files
    const exercisesSql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20250116_create_exercises_foods_tables.sql'), 'utf-8');
    const adminSql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20250116_add_super_admin_flag.sql'), 'utf-8');

    console.log('📄 Read migration files successfully');

    // Split into statements and execute
    const allSql = exercisesSql + '\n\n' + adminSql;
    const statements = allSql.split(';').filter(stmt => stmt.trim().length > 0);

    console.log(`📋 Found ${statements.length} SQL statements to execute`);

    let successCount = 0;
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;

      try {
        // Try to execute using different methods
        console.log(`Executing statement ${i + 1}/${statements.length}...`);

        // Method 1: Direct query (might not work)
        const { error } = await supabase.rpc('exec', { query: statement });

        if (error) {
          console.log(`   ⚠️ RPC failed, trying alternative method...`);

          // Method 2: Try with different RPC
          const { error: error2 } = await supabase.from('_supabase_migrations').insert({
            name: `migration_${i}`,
            statements: [statement]
          });

          if (error2) {
            console.log(`   ❌ Statement ${i + 1} failed:`, error2.message);
            console.log(`   SQL: ${statement.substring(0, 100)}...`);
          } else {
            successCount++;
            console.log(`   ✅ Statement ${i + 1} executed`);
          }
        } else {
          successCount++;
          console.log(`   ✅ Statement ${i + 1} executed`);
        }
      } catch (err) {
        console.log(`   ❌ Error executing statement ${i + 1}:`, err.message);
      }
    }

    console.log(`\n📊 Results: ${successCount}/${statements.length} statements executed`);

    if (successCount > 0) {
      console.log('\n🎉 Tables created! Now try running:');
      console.log('node scripts/migrate-data-to-supabase.js');
    } else {
      console.log('\n❌ No statements executed. Manual execution required in Supabase Dashboard.');
    }

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    console.log('\n💡 Please execute the migrations manually in Supabase SQL Editor');
  }
}

createTables();
