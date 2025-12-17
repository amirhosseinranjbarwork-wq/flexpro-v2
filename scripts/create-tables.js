#!/usr/bin/env node
/**
 * Create Tables in Supabase
 * Executes CREATE TABLE statements for all required tables
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
 * Create a table by executing its migration
 */
async function createTableFromMigration(migrationPath) {
  try {
    console.log(`📄 Creating table from: ${path.basename(migrationPath)}`);

    const sql = fs.readFileSync(migrationPath, 'utf-8');

    // Extract only CREATE TABLE and related DDL statements (no INSERTs)
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
      .filter(stmt =>
        stmt.toUpperCase().includes('CREATE TABLE') ||
        stmt.toUpperCase().includes('CREATE INDEX') ||
        stmt.toUpperCase().includes('ALTER TABLE') ||
        stmt.toUpperCase().includes('CREATE POLICY')
      );

    console.log(`Found ${statements.length} DDL statements`);

    // Note: We can't execute DDL directly via Supabase client
    // This would require direct database access or CLI
    console.log('⚠️ DDL execution requires Supabase CLI or direct database access');
    console.log('Please execute the following SQL in your Supabase SQL editor:\n');

    statements.forEach((stmt, index) => {
      console.log(`${index + 1}. ${stmt};`);
      console.log('');
    });

    return true;

  } catch (error) {
    console.error(`❌ Error processing ${path.basename(migrationPath)}:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🏗️ Creating FlexPro database tables...\n');

  try {
    // Test connection
    console.log('🔗 Testing Supabase connection...');
    const { error } = await supabase.from('exercises').select('count', { count: 'exact', head: true });
    if (error && !error.message.includes('does not exist')) {
      throw new Error(`Connection failed: ${error.message}`);
    }
    console.log('✅ Supabase connection successful\n');

    // Migration files
    const migrations = [
      '20250218_exercises_comprehensive.sql',
      '20250218_foods_comprehensive.sql',
      '20250218_supplements_comprehensive.sql'
    ];

    console.log('📋 SQL to execute in Supabase SQL Editor:\n');
    console.log('='.repeat(80));

    for (const migration of migrations) {
      const filePath = path.join(__dirname, '../supabase/migrations', migration);
      if (fs.existsSync(filePath)) {
        await createTableFromMigration(filePath);
      } else {
        console.warn(`⚠️ Migration file not found: ${migration}`);
      }
    }

    console.log('='.repeat(80));
    console.log('\n📝 Instructions:');
    console.log('1. Copy the SQL statements above');
    console.log('2. Go to your Supabase dashboard');
    console.log('3. Navigate to SQL Editor');
    console.log('4. Paste and execute the statements');
    console.log('5. After tables are created, run: npm run populate-data');

    console.log('\n⚠️ Alternative: If you have Supabase CLI installed, run:');
    console.log('   supabase db reset');

  } catch (error) {
    console.error('\n💥 Table creation error:', error.message);
    process.exit(1);
  }
}

main();