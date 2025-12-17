#!/usr/bin/env node
/**
 * Apply SQL Migrations to Supabase
 * Executes migration files directly via Supabase REST API
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
 * Execute SQL via Supabase RPC
 */
async function executeSQL(sql) {
  try {
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        // Use raw SQL execution through Supabase
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });

        if (error) {
          console.error('❌ SQL Error:', error);
          console.error('Statement:', statement);
          throw error;
        }
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to execute SQL:', error.message);
    return false;
  }
}

/**
 * Apply a single migration file
 */
async function applyMigration(filePath) {
  try {
    console.log(`📄 Applying migration: ${path.basename(filePath)}`);

    const sql = fs.readFileSync(filePath, 'utf-8');

    // Remove comments and empty lines for cleaner output
    const cleanSQL = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
      .join('\n');

    console.log(`📊 Executing SQL...`);

    const success = await executeSQL(cleanSQL);

    if (success) {
      console.log(`✅ Migration applied successfully: ${path.basename(filePath)}\n`);
      return true;
    } else {
      console.error(`❌ Failed to apply migration: ${path.basename(filePath)}\n`);
      return false;
    }

  } catch (error) {
    console.error(`❌ Error applying migration ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Applying SQL migrations to Supabase...\n');

  try {
    // Test connection
    console.log('🔗 Testing Supabase connection...');
    const { error } = await supabase.from('exercises').select('count', { count: 'exact', head: true });
    if (error && !error.message.includes('does not exist')) {
      throw new Error(`Connection failed: ${error.message}`);
    }
    console.log('✅ Supabase connection successful\n');

    // Get migration files
    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure proper order

    console.log(`📂 Found ${migrationFiles.length} migration files\n`);

    let successCount = 0;
    let failCount = 0;

    // Apply migrations
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const success = await applyMigration(filePath);

      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    // Summary
    console.log('='.repeat(50));
    console.log('📊 Migration Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📁 Total: ${migrationFiles.length}`);

    if (failCount === 0) {
      console.log('\n🎉 All migrations applied successfully!');
    } else {
      console.log(`\n⚠️  ${failCount} migrations failed. Please check the errors above.`);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 Migration error:', error.message);
    process.exit(1);
  }
}

main();