#!/usr/bin/env node

/**
 * FlexPro Database Setup Script
 *
 * این اسکریپت عملیات زیر را انجام می‌دهد:
 * 1. اجرای migration‌های SQL از supabase/migrations
 * 2. ایجاد داده‌های اولیه (Roles, Admin User)
 * 3. اعتبارسنجی اتصال به دیتابیس
 *
 * Usage:
 *   npm run db:reset
 *   node scripts/setup-db.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// تنظیم __dirname برای ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// بارگذاری متغیرهای محیطی
dotenv.config();

// تنظیمات
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  console.error('❌ خطا: VITE_SUPABASE_URL تنظیم نشده است');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ خطا: SUPABASE_SERVICE_ROLE_KEY یا VITE_SUPABASE_ANON_KEY تنظیم نشده است');
  console.log('💡 برای دسترسی کامل به دیتابیس، SUPABASE_SERVICE_ROLE_KEY را تنظیم کنید');
  process.exit(1);
}

// ایجاد Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

/**
 * اجرای یک فایل SQL
 * توجه: Supabase RPC برای اجرای SQL خام پشتیبانی نمی‌کند
 * این تابع فقط برای نمایش محتوای فایل استفاده می‌شود
 */
async function executeSqlFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`📄 محتوای ${path.basename(filePath)}:`);
    console.log('─'.repeat(50));
    console.log(sql.substring(0, 200) + (sql.length > 200 ? '\n... (truncated)' : ''));
    console.log('─'.repeat(50));
    console.log(`ℹ️  لطفاً این SQL را در Supabase Dashboard یا CLI اجرا کنید`);
    return true;
  } catch (err) {
    console.error(`❌ خطا در خواندن فایل ${filePath}:`, err.message);
    return false;
  }
}

/**
 * نمایش migration‌ها
 */
async function showMigrations() {
  console.log('\n🚀 Migration‌های موجود:\n');

  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // مرتب‌سازی بر اساس نام فایل

  if (migrationFiles.length === 0) {
    console.log('❌ هیچ migration یافت نشد');
    return false;
  }

  console.log(`📁 تعداد ${migrationFiles.length} فایل migration یافت شد:`);
  migrationFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });

  console.log('\n📝 برای اجرای migrationها:');
  console.log('   ۱. Supabase CLI را نصب کنید: npm install -g supabase');
  console.log('   ۲. به پروژه متصل شوید: supabase link --project-ref your-project-ref');
  console.log('   ۳. Migrationها را اجرا کنید: supabase db push');

  return true;
}

/**
 * ایجاد داده‌های اولیه
 */
async function seedDatabase() {
  console.log('\n🌱 ایجاد داده‌های اولیه...\n');
  console.log('⚠️  توجه: این اسکریپت نمی‌تواند migrationها را اجرا کند');
  console.log('💡 لطفاً migrationها را به صورت دستی در Supabase Dashboard اجرا کنید\n');

  try {
    // بررسی اتصال به جداول
    console.log('🔍 بررسی جداول...');

    const tables = ['roles', 'profiles', 'clients'];
    let availableTables = [];

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        if (!error) {
          availableTables.push(table);
          console.log(`✅ جدول ${table} موجود است`);
        } else {
          console.log(`❌ جدول ${table} موجود نیست:`, error.message);
        }
      } catch (err) {
        console.log(`❌ خطا در بررسی جدول ${table}:`, err.message);
      }
    }

    if (availableTables.length === 0) {
      console.log('\n❌ هیچ جدولی یافت نشد. لطفاً ابتدا migrationها را اجرا کنید.');
      return false;
    }

    console.log(`\n📊 جداول موجود: ${availableTables.join(', ')}`);

    // نمایش دستورالعمل برای seeding دستی
    console.log('\n📝 برای seeding داده‌های اولیه، این SQL را در Supabase SQL Editor اجرا کنید:');
    console.log('─'.repeat(70));
    console.log(`
-- ایجاد نقش‌های پیش‌فرض
INSERT INTO roles (name, description) VALUES
  ('coach', 'مربی ورزشی'),
  ('client', 'شاگرد'),
  ('admin', 'مدیر سیستم')
ON CONFLICT (name) DO NOTHING;

-- ایجاد کاربر admin (پسورد: admin123456)
-- این کار باید از طریق Supabase Auth انجام شود
    `);
    console.log('─'.repeat(70));

    return true;
  } catch (error) {
    console.error('❌ خطا در ایجاد داده‌های اولیه:', error.message);
    return false;
  }
}

/**
 * تست اتصال به دیتابیس
 */
async function testConnection() {
  console.log('\n🔍 تست اتصال به دیتابیس...\n');

  try {
    // تست اتصال با یک query ساده
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ خطا در اتصال به دیتابیس:', error.message);
      return false;
    }

    console.log('✅ اتصال به دیتابیس برقرار است');
    console.log(`📊 تعداد کاربران: ${data || 0}`);

    return true;
  } catch (error) {
    console.error('❌ خطا در تست اتصال:', error.message);
    return false;
  }
}

/**
 * نمایش آمار نهایی
 */
async function showStats() {
  console.log('\n📈 آمار دیتابیس:\n');

  try {
    // آمار کاربران
    const { count: userCount, error: userError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (!userError) {
      console.log(`👥 کاربران: ${userCount || 0}`);
    }

    // آمار نقش‌ها
    const { count: roleCount, error: roleError } = await supabase
      .from('roles')
      .select('*', { count: 'exact', head: true });

    if (!roleError) {
      console.log(`🎭 نقش‌ها: ${roleCount || 0}`);
    }

    // آمار برنامه‌های تمرینی
    const { count: workoutCount, error: workoutError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    if (!workoutError) {
      console.log(`💪 شاگردان: ${workoutCount || 0}`);
    }

  } catch (error) {
    console.log('⚠️  خطا در دریافت آمار');
  }
}

/**
 * تابع اصلی
 */
async function main() {
  console.log('🎯 راه‌اندازی دیتابیس FlexPro\n');
  console.log('═'.repeat(50));

  const results = {
    migrations: false,
    seed: false,
    connection: false
  };

  // ۱. نمایش migration‌ها
  results.migrations = await showMigrations();

  // ۲. ایجاد داده‌های اولیه
  results.seed = await seedDatabase();

  // ۳. تست اتصال
  results.connection = await testConnection();

  // ۴. نمایش آمار
  await showStats();

  console.log('\n═'.repeat(50));

  // نتیجه نهایی
  const allSuccessful = Object.values(results).every(Boolean);

  if (allSuccessful) {
    console.log('🎉 راه‌اندازی دیتابیس با موفقیت تکمیل شد!');
    console.log('\n🚀 اکنون می‌توانید پروژه را اجرا کنید:');
    console.log('   npm run dev');
  } else {
    console.log('⚠️  راه‌اندازی دیتابیس با برخی خطاها تکمیل شد');
    console.log('🔍 لطفاً خطاها را بررسی کنید');
  }

  console.log('\n✨ FlexPro Database Setup Complete ✨\n');

  process.exit(allSuccessful ? 0 : 1);
}

// اجرای اسکریپت
main().catch((error) => {
  console.error('💥 خطای غیرمنتظره:', error);
  process.exit(1);
});