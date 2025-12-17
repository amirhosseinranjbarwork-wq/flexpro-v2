#!/usr/bin/env node
/**
 * Check Database Status
 * Verifies current state of database tables and data
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

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
 * Check table existence and data count
 */
async function checkTableStatus() {
  console.log('🔍 Checking database status...\n');

  const tables = [
    { name: 'exercises', description: 'تمرین‌های مقاومتی' },
    { name: 'foods', description: 'مواد غذایی' },
    { name: 'supplements', description: 'مکمل‌های غذایی' },
    { name: 'profiles', description: 'پروفایل کاربران' },
    { name: 'templates', description: 'قالب‌های تمرینی' },
    { name: 'coaching_relationships', description: 'روابط مربیگری' }
  ];

  console.log('📋 Table Status:');
  console.log('─'.repeat(60));

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select('count', { count: 'exact', head: true });

      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`❌ ${table.name.padEnd(20)} | جدول وجود ندارد`);
        } else {
          console.log(`⚠️  ${table.name.padEnd(20)} | خطا: ${error.message}`);
        }
      } else {
        const count = data || 0;
        const status = count > 0 ? '✅' : '⚠️ ';
        console.log(`${status} ${table.name.padEnd(20)} | ${count.toString().padStart(6)} رکورد | ${table.description}`);
      }
    } catch (error) {
      console.log(`❌ ${table.name.padEnd(20)} | خطای اتصال`);
    }
  }

  console.log('─'.repeat(60));

  // Check connection
  try {
    const { error } = await supabase.from('exercises').select('count', { count: 'exact', head: true });
    if (error && !error.message.includes('does not exist')) {
      console.log('\n❌ اتصال به Supabase برقرار نیست');
      console.log(`   خطا: ${error.message}`);
      return false;
    } else {
      console.log('\n✅ اتصال به Supabase برقرار است');
    }
  } catch (error) {
    console.log('\n❌ خطای اتصال به Supabase');
    console.log(`   خطا: ${error.message}`);
    return false;
  }

  return true;
}

/**
 * Show data samples
 */
async function showDataSamples() {
  console.log('\n📊 نمونه داده‌ها:');

  const tables = ['exercises', 'foods', 'supplements'];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(2);

      if (error) {
        if (!error.message.includes('does not exist')) {
          console.log(`❌ خطا در خواندن ${table}: ${error.message}`);
        }
      } else if (data && data.length > 0) {
        console.log(`\n${table.toUpperCase()} نمونه‌ها:`);
        data.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.name || item.title || 'بدون نام'}`);
          if (table === 'exercises') {
            console.log(`     گروه عضلانی: ${item.muscle_group}, نوع: ${item.type}`);
          } else if (table === 'foods') {
            console.log(`     کالری: ${item.calories}, پروتئین: ${item.protein}g`);
          } else if (table === 'supplements') {
            console.log(`     دسته: ${item.category}, دوز: ${item.dosage}`);
          }
        });
      }
    } catch (error) {
      // Ignore errors for non-existent tables
    }
  }
}

/**
 * Show replacement readiness
 */
async function showReplacementReadiness() {
  console.log('\n🔧 وضعیت آمادگی جایگزینی:');

  // Check local data files
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dataDir = path.join(__dirname, '../src/data');

  const requiredFiles = [
    'exercises.ts',
    'foods.ts',
    'supplementsComplete.ts'
  ];

  console.log('فایل‌های داده محلی:');
  let allFilesExist = true;

  for (const file of requiredFiles) {
    const filePath = path.join(dataDir, file);
    const exists = fs.existsSync(filePath);
    const status = exists ? '✅' : '❌';
    console.log(`   ${status} ${file}`);

    if (!exists) {
      allFilesExist = false;
    }
  }

  if (allFilesExist) {
    console.log('\n✅ تمام فایل‌های داده محلی موجود هستند');
    console.log('✅ آماده جایگزینی کامل بانک داده');
  } else {
    console.log('\n❌ برخی فایل‌های داده محلی وجود ندارند');
    console.log('❌ جایگزینی ممکن نیست');
  }

  return allFilesExist;
}

/**
 * Main function
 */
async function main() {
  console.log('📊 بررسی وضعیت بانک داده');
  console.log('========================\n');

  try {
    const connectionOk = await checkTableStatus();
    if (connectionOk) {
      await showDataSamples();
    }
    await showReplacementReadiness();

    console.log('\n📋 راهنمایی:');
    console.log('برای جایگزینی کامل بانک داده، اجرا کنید:');
    console.log('   npm run replace-database');
    console.log('\nاین کار تمام داده‌های موجود را پاک کرده و با داده‌های جدید جایگزین می‌کند.');

  } catch (error) {
    console.error('\n💥 خطا در بررسی وضعیت:', error.message);
    process.exit(1);
  }
}

main();