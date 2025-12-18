#!/usr/bin/env node

/**
 * FlexPro Database Setup Script
 *
 * این اسکریپت عملیات زیر را انجام می‌دهد:
 * 1. اجرای migration‌های SQL از supabase/migrations
 * 2. ایجاد داده‌های اولیه (roles, admin user)
 * 3. اعتبارسنجی اتصال به دیتابیس
 *
 * Usage:
 *   npm run db:reset
 *   node scripts/setup-db.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

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
 */
async function executeSqlFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error(`❌ خطا در اجرای ${path.basename(filePath)}:`, error.message);
      return false;
    }

    console.log(`✅ ${path.basename(filePath)} اجرا شد`);
    return true;
  } catch (err) {
    console.error(`❌ خطا در خواندن فایل ${filePath}:`, err.message);
    return false;
  }
}

/**
 * اجرای migration‌ها
 */
async function runMigrations() {
  console.log('\n🚀 اجرای Migration‌ها...\n');

  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // مرتب‌سازی بر اساس نام فایل

  let successCount = 0;
  let errorCount = 0;

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const success = await executeSqlFile(filePath);

    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  console.log(`\n📊 نتیجه Migration‌ها: ${successCount} موفق، ${errorCount} ناموفق`);

  if (errorCount > 0) {
    console.log('⚠️  برخی migration‌ها با خطا مواجه شدند، اما ادامه می‌دهیم...');
  }

  return errorCount === 0;
}

/**
 * ایجاد داده‌های اولیه
 */
async function seedDatabase() {
  console.log('\n🌱 ایجاد داده‌های اولیه...\n');

  try {
    // ایجاد نقش‌های پیش‌فرض
    const { error: roleError } = await supabase
      .from('roles')
      .upsert([
        { name: 'coach', description: 'مربی ورزشی' },
        { name: 'client', description: 'شاگرد' },
        { name: 'admin', description: 'مدیر سیستم' }
      ], { onConflict: 'name' });

    if (roleError) {
      console.error('❌ خطا در ایجاد نقش‌ها:', roleError.message);
    } else {
      console.log('✅ نقش‌های پیش‌فرض ایجاد شدند');
    }

    // ایجاد کاربر admin پیش‌فرض (فقط در محیط development)
    if (process.env.NODE_ENV === 'development') {
      const adminEmail = 'admin@flexpro.dev';
      const adminPassword = 'admin123456';

      // ابتدا بررسی کنیم آیا کاربر وجود دارد
      const { data: existingUser } = await supabase.auth.admin.listUsers();

      const adminExists = existingUser?.users?.some(user => user.email === adminEmail);

      if (!adminExists) {
        const { data, error } = await supabase.auth.admin.createUser({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
          user_metadata: {
            full_name: 'مدیر سیستم',
            role: 'admin'
          }
        });

        if (error) {
          console.error('❌ خطا در ایجاد کاربر admin:', error.message);
        } else {
          console.log('✅ کاربر admin ایجاد شد:');
          console.log(`   ایمیل: ${adminEmail}`);
          console.log(`   رمز عبور: ${adminPassword}`);
          console.log(`   ID: ${data.user.id}`);

          // ایجاد پروفایل admin
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              full_name: 'مدیر سیستم',
              email: adminEmail,
              role: 'admin',
              coach_code: 'ADMIN001'
            });

          if (profileError) {
            console.error('❌ خطا در ایجاد پروفایل admin:', profileError.message);
          } else {
            console.log('✅ پروفایل admin ایجاد شد');
          }
        }
      } else {
        console.log('ℹ️  کاربر admin از قبل وجود دارد');
      }
    }

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

  // ۱. اجرای migration‌ها
  results.migrations = await runMigrations();

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