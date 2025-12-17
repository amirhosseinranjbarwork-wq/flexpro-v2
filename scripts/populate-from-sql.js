#!/usr/bin/env node
/**
 * Populate Database from SQL Migration Files
 * Extracts INSERT statements and executes them via Supabase
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
 * Extract INSERT data from SQL file
 */
function extractInsertData(sqlContent, tableName) {
  const insertRegex = new RegExp(`INSERT INTO ${tableName}\\s*\\([^)]+\\)\\s*VALUES\\s*([\\s\\S]*?);`, 'i');
  const match = sqlContent.match(insertRegex);

  if (!match) return null;

  const valuesString = match[1];

  // Parse the VALUES section
  try {
    // Remove comments and clean up
    const cleanValues = valuesString
      .replace(/--.*$/gm, '') // Remove comments
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Split by comma, but be careful with nested parentheses
    const records = [];
    let currentRecord = '';
    let parenCount = 0;

    for (let i = 0; i < cleanValues.length; i++) {
      const char = cleanValues[i];

      if (char === '(') parenCount++;
      if (char === ')') parenCount--;

      if (char === ',' && parenCount === 0) {
        if (currentRecord.trim()) {
          records.push(currentRecord.trim());
        }
        currentRecord = '';
      } else {
        currentRecord += char;
      }
    }

    if (currentRecord.trim()) {
      records.push(currentRecord.trim());
    }

    return records.map(record => {
      try {
        // Remove outer parentheses and evaluate
        const cleanRecord = record.replace(/^\s*\(/, '').replace(/\)\s*$/, '');
        return eval(`[${cleanRecord}]`);
      } catch (e) {
        console.warn(`Could not parse record: ${record}`);
        return null;
      }
    }).filter(record => record !== null);

  } catch (error) {
    console.error(`Error parsing ${tableName} data:`, error.message);
    return null;
  }
}

/**
 * Insert data into Supabase table
 */
async function insertData(tableName, data) {
  if (!data || data.length === 0) {
    console.log(`⚠️ No data to insert for ${tableName}`);
    return true;
  }

  console.log(`📊 Inserting ${data.length} records into ${tableName}...`);

  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);

    try {
      const { error } = await supabase
        .from(tableName)
        .upsert(batch, { onConflict: 'name' });

      if (error) throw error;

      inserted += batch.length;
      console.log(`✅ Inserted ${inserted}/${data.length} ${tableName} records...`);
    } catch (error) {
      console.error(`❌ Error inserting ${tableName} batch at ${i}:`, error.message);
      return false;
    }
  }

  console.log(`✅ ${tableName} population completed`);
  return true;
}

/**
 * Process a single migration file
 */
async function processMigrationFile(filePath) {
  try {
    console.log(`\n📄 Processing: ${path.basename(filePath)}`);

    const sqlContent = fs.readFileSync(filePath, 'utf-8');

    // Process exercises
    const exercisesData = extractInsertData(sqlContent, 'exercises');
    if (exercisesData) {
      const success = await insertData('exercises', exercisesData);
      if (!success) return false;
    }

    // Process foods
    const foodsData = extractInsertData(sqlContent, 'foods');
    if (foodsData) {
      const success = await insertData('foods', foodsData);
      if (!success) return false;
    }

    // Process supplements
    const supplementsData = extractInsertData(sqlContent, 'supplements');
    if (supplementsData) {
      const success = await insertData('supplements', supplementsData);
      if (!success) return false;
    }

    return true;

  } catch (error) {
    console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Populating database from SQL migrations...\n');

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
      .filter(file => file.endsWith('.sql') && file.includes('populate'))
      .sort();

    console.log(`📂 Found ${migrationFiles.length} populate migration files\n`);

    let successCount = 0;
    let failCount = 0;

    // Process migration files
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const success = await processMigrationFile(filePath);

      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Population Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📁 Total: ${migrationFiles.length}`);

    if (failCount === 0) {
      console.log('\n🎉 Database populated successfully!');

      // Verify results
      console.log('\n🔍 Verifying results...');
      const { data: exercises } = await supabase.from('exercises').select('count', { count: 'exact', head: true });
      const { data: foods } = await supabase.from('foods').select('count', { count: 'exact', head: true });
      const { data: supplements } = await supabase.from('supplements').select('count', { count: 'exact', head: true });

      console.log(`   Exercises: ${exercises || 0}`);
      console.log(`   Foods: ${foods || 0}`);
      console.log(`   Supplements: ${supplements || 0}`);
      console.log(`   Total: ${(exercises || 0) + (foods || 0) + (supplements || 0)}`);

    } else {
      console.log(`\n⚠️  ${failCount} files failed. Please check the errors above.`);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 Population error:', error.message);
    process.exit(1);
  }
}

main();