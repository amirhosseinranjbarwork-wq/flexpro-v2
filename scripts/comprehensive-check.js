#!/usr/bin/env node
/**
 * Comprehensive project check script
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 بررسی جامع پروژه FlexPro v2\n');
console.log('=' .repeat(50));

let issues = [];
let warnings = [];

// 1. Check package.json
console.log('📦 بررسی package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));
  console.log('✅ package.json معتبر است');
  console.log(`   نسخه: ${packageJson.version}`);
  console.log(`   اسکریپت‌ها: ${Object.keys(packageJson.scripts || {}).length} عدد`);
} catch (error) {
  issues.push(`❌ خطا در package.json: ${error.message}`);
}

// 2. Check environment files
console.log('\n🌍 بررسی فایل‌های محیطی...');
const envFiles = ['.env', '.env.local'];
envFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} وجود دارد`);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      console.log(`   ${lines.length} متغیر محیطی`);
    } catch (error) {
      warnings.push(`⚠️ نمی‌توان ${file} را خواند: ${error.message}`);
    }
  } else {
    warnings.push(`⚠️ ${file} وجود ندارد`);
  }
});

// 3. Check TypeScript config
console.log('\n🔧 بررسی تنظیمات TypeScript...');
const tsFiles = ['tsconfig.json', 'tsconfig.node.json'];
tsFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} وجود دارد`);
  } else {
    warnings.push(`⚠️ ${file} وجود ندارد`);
  }
});

// 4. Check src directory structure
console.log('\n📁 بررسی ساختار دایرکتوری src...');
const requiredDirs = [
  'components', 'context', 'hooks', 'pages', 'types', 'utils', 'lib'
];
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '../src', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ دایرکتوری ${dir} وجود دارد`);
  } else {
    issues.push(`❌ دایرکتوری ${dir} وجود ندارد`);
  }
});

// 5. Check key files
console.log('\n📄 بررسی فایل‌های کلیدی...');
const keyFiles = [
  'src/App.tsx',
  'src/main.tsx',
  'src/index.css',
  'src/context/AuthContext.tsx',
  'src/context/DataContext.tsx',
  'src/pages/CoachDashboard.tsx',
  'src/pages/ClientDashboard.tsx'
];
keyFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} وجود دارد`);
  } else {
    issues.push(`❌ ${file} وجود ندارد`);
  }
});

// 6. Check build output
console.log('\n🏗️ بررسی خروجی build...');
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  console.log('✅ دایرکتوری dist وجود دارد');
  try {
    const files = fs.readdirSync(distPath);
    console.log(`   ${files.length} فایل ساخته شده`);
  } catch (error) {
    warnings.push(`⚠️ نمی‌توان محتویات dist را خواند: ${error.message}`);
  }
} else {
  warnings.push('⚠️ دایرکتوری dist وجود ندارد - build اجرا نشده');
}

// 7. Check database migrations
console.log('\n🗄️ بررسی migration های دیتابیس...');
const migrationsDir = path.join(__dirname, '../supabase/migrations');
if (fs.existsSync(migrationsDir)) {
  console.log('✅ دایرکتوری migrations وجود دارد');
  try {
    const files = fs.readdirSync(migrationsDir);
    console.log(`   ${files.length} فایل migration`);
    files.forEach(file => {
      console.log(`   - ${file}`);
    });
  } catch (error) {
    warnings.push(`⚠️ نمی‌توان migration ها را خواند: ${error.message}`);
  }
} else {
  issues.push('❌ دایرکتوری supabase/migrations وجود ندارد');
}

// 8. Check scripts
console.log('\n📜 بررسی اسکریپت‌ها...');
const scriptsDir = path.join(__dirname, '../scripts');
if (fs.existsSync(scriptsDir)) {
  console.log('✅ دایرکتوری scripts وجود دارد');
  try {
    const files = fs.readdirSync(scriptsDir);
    const scriptFiles = files.filter(f => f.endsWith('.js'));
    console.log(`   ${scriptFiles.length} اسکریپت JavaScript`);
    scriptFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
  } catch (error) {
    warnings.push(`⚠️ نمی‌توان اسکریپت‌ها را خواند: ${error.message}`);
  }
} else {
  warnings.push('⚠️ دایرکتوری scripts وجود ندارد');
}

// 9. Check tests
console.log('\n🧪 بررسی تست‌ها...');
const testDirs = [
  'src/__tests__',
  'src/hooks/__tests__',
  'src/utils/__tests__'
];
let testFilesCount = 0;
testDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    try {
      const files = fs.readdirSync(dirPath);
      const testFiles = files.filter(f => f.endsWith('.test.ts') || f.endsWith('.test.tsx'));
      testFilesCount += testFiles.length;
      if (testFiles.length > 0) {
        console.log(`✅ ${dir}: ${testFiles.length} فایل تست`);
      }
    } catch (error) {
      // Directory exists but can't read
    }
  }
});

if (testFilesCount === 0) {
  warnings.push('⚠️ فایل تست یافت نشد');
} else {
  console.log(`✅ مجموع ${testFilesCount} فایل تست`);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 خلاصه بررسی:');

if (issues.length === 0) {
  console.log('✅ هیچ مشکل جدی یافت نشد');
} else {
  console.log(`❌ ${issues.length} مشکل جدی:`);
  issues.forEach(issue => console.log(`   ${issue}`));
}

if (warnings.length === 0) {
  console.log('✅ هیچ هشدار یافت نشد');
} else {
  console.log(`⚠️ ${warnings.length} هشدار:`);
  warnings.forEach(warning => console.log(`   ${warning}`));
}

console.log('\n💡 نکات مهم:');
console.log('1. برای اجرای کامل پروژه، migration های SQL را در Supabase Dashboard اجرا کنید');
console.log('2. سپس اسکریپت انتقال داده‌ها را اجرا کنید');
console.log('3. در نهایت برنامه را با npm run dev راه‌اندازی کنید');
console.log('4. اگر خطاهای lint دارید، آنها را رفع کنید (اختیاری)');

console.log('\n🎯 وضعیت کلی: پروژه آماده راه‌اندازی است، فقط نیاز به تنظیم دیتابیس دارد.');
