#!/usr/bin/env node
/**
 * Setup Database Tables and Populate Data
 * Creates tables from migration files and populates them with data
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
 * Execute SQL directly (for CREATE TABLE statements)
 */
async function executeSQL(sql) {
  try {
    // For this demo, we'll use a simple approach
    // In production, you'd want proper SQL execution
    console.log('⚠️ SQL execution not implemented. Please run migrations manually via Supabase CLI or dashboard.');
    console.log('SQL to execute:', sql.substring(0, 200) + '...');
    return false;
  } catch (error) {
    console.error('❌ Failed to execute SQL:', error.message);
    return false;
  }
}

/**
 * Create tables from migration files
 */
async function createTables() {
  console.log('🏗️ Creating database tables...');

  const migrationFiles = [
    '20250218_exercises_comprehensive.sql',
    '20250218_foods_comprehensive.sql',
    '20250218_supplements_comprehensive.sql'
  ];

  for (const file of migrationFiles) {
    const filePath = path.join(__dirname, '../supabase/migrations', file);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Migration file not found: ${file}`);
      continue;
    }

    console.log(`📄 Processing table creation from: ${file}`);

    const sql = fs.readFileSync(filePath, 'utf-8');

    // Extract CREATE TABLE statements
    const createTableRegex = /CREATE TABLE[^;]+;/gi;
    const createTableMatches = sql.match(createTableRegex);

    if (createTableMatches) {
      for (const createStmt of createTableMatches) {
        console.log(`  Creating table from: ${createStmt.substring(0, 50)}...`);
        // Note: We can't actually execute DDL via Supabase client
        // This would need to be done via CLI or direct database access
      }
    }

    // Extract other DDL statements
    const ddlStatements = sql.match(/(CREATE INDEX|ALTER TABLE|CREATE POLICY)[^;]+;/gi);
    if (ddlStatements) {
      console.log(`  Found ${ddlStatements.length} DDL statements`);
    }
  }

  console.log('⚠️ Table creation requires manual execution via Supabase CLI or dashboard');
  console.log('Please run: supabase db reset');
  return false;
}

/**
 * Extract INSERT data from SQL file
 */
function extractInsertData(sqlContent, tableName) {
  const insertRegex = new RegExp(`INSERT INTO ${tableName}\\s*\\([^)]+\\)\\s*VALUES\\s*([\\s\\S]*?);`, 'gi');
  const matches = sqlContent.match(insertRegex);

  if (!matches) return null;

  const allData = [];

  for (const match of matches) {
    const valuesString = match.replace(/INSERT INTO[^V]+VALUES\s*/i, '');

    try {
      // Simple parsing - split by ),( and clean up
      const records = valuesString
        .replace(/^\s*\(/, '')
        .replace(/\);\s*$/, '')
        .split(/\),\s*\(/)
        .map(record => {
          try {
            // Clean and parse each record
            const cleanRecord = record
              .replace(/^\s*\(/, '')
              .replace(/\)\s*$/, '')
              .trim();

            // Split by comma but be careful with quoted strings
            const fields = [];
            let currentField = '';
            let inQuotes = false;
            let quoteChar = '';

            for (let i = 0; i < cleanRecord.length; i++) {
              const char = cleanRecord[i];
              const nextChar = cleanRecord[i + 1];

              if (!inQuotes && (char === '"' || char === "'")) {
                inQuotes = true;
                quoteChar = char;
                currentField += char;
              } else if (inQuotes && char === quoteChar && nextChar !== quoteChar) {
                inQuotes = false;
                currentField += char;
              } else if (!inQuotes && char === ',') {
                fields.push(currentField.trim());
                currentField = '';
              } else {
                currentField += char;
              }
            }

            if (currentField.trim()) {
              fields.push(currentField.trim());
            }

            // Convert to proper format
            return fields.map(field => {
              // Remove quotes
              if ((field.startsWith("'") && field.endsWith("'")) ||
                  (field.startsWith('"') && field.endsWith('"'))) {
                return field.slice(1, -1);
              }
              // Try to parse numbers
              if (/^\d+(\.\d+)?$/.test(field)) {
                return parseFloat(field);
              }
              return field;
            });

          } catch (e) {
            console.warn(`Could not parse record: ${record}`);
            return null;
          }
        })
        .filter(record => record !== null);

      allData.push(...records);

    } catch (error) {
      console.error(`Error parsing ${tableName} data:`, error.message);
    }
  }

  return allData;
}

/**
 * Insert data into Supabase table
 */
async function insertData(tableName, data, columns) {
  if (!data || data.length === 0) {
    console.log(`⚠️ No data to insert for ${tableName}`);
    return true;
  }

  console.log(`📊 Inserting ${data.length} records into ${tableName}...`);

  // Convert array data to objects
  const objects = data.map(record => {
    const obj = {};
    columns.forEach((col, index) => {
      obj[col] = record[index];
    });
    return obj;
  });

  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < objects.length; i += BATCH_SIZE) {
    const batch = objects.slice(i, i + BATCH_SIZE);

    try {
      const { error } = await supabase
        .from(tableName)
        .upsert(batch, { onConflict: 'name' });

      if (error) throw error;

      inserted += batch.length;
      console.log(`✅ Inserted ${inserted}/${objects.length} ${tableName} records...`);
    } catch (error) {
      console.error(`❌ Error inserting ${tableName} batch at ${i}:`, error.message);
      return false;
    }
  }

  console.log(`✅ ${tableName} population completed`);
  return true;
}

/**
 * Process migration files
 */
async function processMigrations() {
  const migrationFiles = [
    '20250218_exercises_comprehensive.sql',
    '20250218_foods_comprehensive.sql',
    '20250218_supplements_comprehensive.sql',
    '20250217_populate_exercises_foods.sql'
  ];

  for (const file of migrationFiles) {
    const filePath = path.join(__dirname, '../supabase/migrations', file);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Migration file not found: ${file}`);
      continue;
    }

    console.log(`\n📄 Processing: ${file}`);

    const sqlContent = fs.readFileSync(filePath, 'utf-8');

    // Extract table creation info (for column names)
    const createTableMatch = sqlContent.match(/CREATE TABLE[^}]+exercises\s*\(([\s\S]*?)\);/i);
    let columns = [];

    if (createTableMatch) {
      const tableDef = createTableMatch[1];
      const columnMatches = tableDef.match(/(\w+)\s+[\w\s()]+/g);
      if (columnMatches) {
        columns = columnMatches
          .map(col => col.split(/\s+/)[0])
          .filter(col => !['id', 'created_at', 'updated_at', 'CONSTRAINT'].includes(col));
      }
    }

    // Process exercises
    if (file.includes('exercises') || sqlContent.includes('INSERT INTO exercises')) {
      const exercisesData = extractInsertData(sqlContent, 'exercises');
      if (exercisesData && exercisesData.length > 0) {
        const exerciseColumns = ['name', 'muscle_group', 'sub_muscle_group', 'equipment', 'type', 'mechanics', 'description'];
        await insertData('exercises', exercisesData, exerciseColumns);
      }
    }

    // Process foods
    if (file.includes('foods') || sqlContent.includes('INSERT INTO foods')) {
      const foodsData = extractInsertData(sqlContent, 'foods');
      if (foodsData && foodsData.length > 0) {
        const foodColumns = ['name', 'category', 'unit', 'calories', 'protein', 'carbs', 'fat', 'base_amount', 'fiber', 'sugar', 'sodium'];
        await insertData('foods', foodsData, foodColumns);
      }
    }

    // Process supplements
    if (file.includes('supplements') || sqlContent.includes('INSERT INTO supplements')) {
      const supplementsData = extractInsertData(sqlContent, 'supplements');
      if (supplementsData && supplementsData.length > 0) {
        const supplementColumns = ['name', 'category', 'type', 'dosage', 'unit', 'benefits', 'timing', 'notes'];
        await insertData('supplements', supplementsData, supplementColumns);
      }
    }
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Setting up and populating FlexPro database...\n');

  try {
    // Test connection
    console.log('🔗 Testing Supabase connection...');
    const { error } = await supabase.from('exercises').select('count', { count: 'exact', head: true });
    if (error && !error.message.includes('does not exist')) {
      throw new Error(`Connection failed: ${error.message}`);
    }
    console.log('✅ Supabase connection successful\n');

    // Create tables (manual step required)
    console.log('⚠️ IMPORTANT: Tables must be created manually first!');
    console.log('Please run the following SQL in your Supabase SQL editor:\n');

    const migrationFiles = [
      '20250218_exercises_comprehensive.sql',
      '20250218_foods_comprehensive.sql',
      '20250218_supplements_comprehensive.sql'
    ];

    for (const file of migrationFiles) {
      const filePath = path.join(__dirname, '../supabase/migrations', file);
      if (fs.existsSync(filePath)) {
        const sql = fs.readFileSync(filePath, 'utf-8');
        // Extract just the CREATE TABLE and related DDL
        const createStatements = sql.match(/(CREATE TABLE[^;]+;|CREATE INDEX[^;]+;|ALTER TABLE[^;]+;|CREATE POLICY[^;]+;)/gi);
        if (createStatements) {
          console.log(`-- ${file}`);
          console.log(createStatements.join('\n'));
          console.log('');
        }
      }
    }

    console.log('After creating tables, run this script again to populate data.\n');

    // Try to populate data
    const hasTables = !error || !error.message.includes('does not exist');
    if (hasTables) {
      console.log('📊 Tables exist, populating data...\n');
      await processMigrations();
    }

  } catch (error) {
    console.error('\n💥 Setup error:', error.message);
    process.exit(1);
  }
}

main();