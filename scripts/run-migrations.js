#!/usr/bin/env node
/**
 * Supabase Migration Instructions
 * Since Supabase CLI requires project linking, please execute these migrations manually:
 *
 * 1. Go to your Supabase Dashboard: https://supabase.com/dashboard
 * 2. Select your project
 * 3. Go to SQL Editor
 * 4. Copy and paste the contents of each migration file in order:
 *
 * Order of execution:
 * 1. supabase/migrations/20250116_create_exercises_foods_tables.sql
 * 2. supabase/migrations/20250116_add_super_admin_flag.sql
 *
 * After running migrations, execute data migration:
 * node scripts/migrate-data-to-supabase.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📋 Supabase Migration Instructions:\n');

console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Go to SQL Editor');
console.log('4. Execute the following migrations in order:\n');

// List migration files
const migrationsDir = path.join(__dirname, '../supabase/migrations');
const migrationFiles = [
  '20250116_create_exercises_foods_tables.sql',
  '20250116_add_super_admin_flag.sql',
  '20250116_add_auth_functions.sql',
  '20250116_add_program_requests_table.sql'
];

migrationFiles.forEach((file, index) => {
  const filePath = path.join(migrationsDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`${index + 1}. ${file}`);
    console.log('   Content preview:');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').slice(0, 5);
    lines.forEach(line => {
      if (line.trim()) console.log(`      ${line}`);
    });
    console.log('   ... (full content in file)\n');
  } else {
    console.log(`${index + 1}. ${file} - FILE NOT FOUND ❌\n`);
  }
});

console.log('5. After running migrations, execute data migration:');
console.log('   node scripts/migrate-data-to-supabase.js\n');

console.log('⚠️  Important: Make sure your .env.local file contains:');
console.log('   VITE_SUPABASE_URL=your_supabase_url');
console.log('   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key\n');
