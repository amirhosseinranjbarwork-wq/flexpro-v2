#!/usr/bin/env node

/**
 * FlexPro Development Sync Script
 *
 * این اسکریپت workflow توسعه را اتوماتیک می‌کند:
 * 1. Git sync - تغییرات را commit و push می‌کند
 * 2. Database sync - Supabase را بروز می‌کند
 * 3. Development server را شروع می‌کند
 *
 * Usage:
 *   npm run dev:sync
 *   node scripts/dev-sync.js
 */

import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { createInterface } from 'readline';

// تنظیم __dirname برای ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تنظیم رنگ‌های کنسول
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // رنگ‌های پیش‌زمینه
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // رنگ‌های پس‌زمینه
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
};

/**
 * نمایش پیام رنگی
 */
function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * نمایش عنوان بخش
 */
function logSection(title) {
  console.log('\n' + '='.repeat(50));
  log(`🚀 ${title}`, 'cyan');
  console.log('='.repeat(50));
}

/**
 * نمایش موفقیت
 */
function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

/**
 * نمایش خطا
 */
function logError(message) {
  log(`❌ ${message}`, 'red');
}

/**
 * نمایش هشدار
 */
function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

/**
 * نمایش اطلاعات
 */
function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * اجرای دستور و برگرداندن نتیجه
 */
function execCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      ...options
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * اجرای دستور به صورت async
 */
function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * بررسی وجود تغییرات git
 */
async function checkGitStatus() {
  logSection('بررسی وضعیت Git');

  const { success, output } = execCommand('git status --porcelain');

  if (!success) {
    logError('خطا در بررسی وضعیت git');
    return false;
  }

  const hasChanges = output.trim().length > 0;

  if (hasChanges) {
    logWarning('تغییرات شناسایی شد که نیاز به commit دارند');
    console.log(output);
    return true;
  } else {
    logSuccess('هیچ تغییری برای commit وجود ندارد');
    return false;
  }
}

/**
 * دریافت پیام commit از کاربر
 */
async function getCommitMessage() {
  // اگر در محیط CI هستیم یا ورودی غیرتعاملی، از پیام پیش‌فرض استفاده کنیم
  if (process.env.CI || !process.stdin.isTTY) {
    return null;
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      logInfo('زمان تمام شد، از پیام پیش‌فرض استفاده می‌کنیم');
      rl.close();
      resolve(null); // استفاده از پیام پیش‌فرض
    }, 10000); // ۱۰ ثانیه timeout

    rl.question('پیام commit را وارد کنید (یا Enter برای استفاده از پیام پیش‌فرض): ', (answer) => {
      clearTimeout(timeout);
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * اجرای git sync
 */
async function syncGit() {
  logSection('همگام‌سازی Git');

  try {
    // بررسی تغییرات
    const hasChanges = await checkGitStatus();

    if (!hasChanges) {
      return true;
    }

    // Stage کردن فایل‌ها
    logInfo('Stage کردن فایل‌ها...');
    await runCommand('git', ['add', '.']);
    logSuccess('فایل‌ها stage شدند');

    // دریافت پیام commit
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
    const defaultMessage = `Auto-sync: ${timestamp}`;
    const commitMessage = await getCommitMessage();
    const finalMessage = commitMessage || defaultMessage;

    // Commit کردن
    logInfo(`Commit با پیام: "${finalMessage}"`);
    await runCommand('git', ['commit', '-m', finalMessage]);
    logSuccess('تغییرات commit شدند');

    // Push کردن
    logInfo('Push به remote...');
    await runCommand('git', ['push', 'origin', 'main']);
    logSuccess('تغییرات به GitHub push شدند');

    return true;
  } catch (error) {
    logError(`خطا در همگام‌سازی Git: ${error.message}`);
    return false;
  }
}

/**
 * اجرای database sync
 */
async function syncDatabase() {
  logSection('همگام‌سازی Database (Supabase)');

  try {
    // بررسی وجود Supabase CLI
    const { success: cliCheck } = execCommand('npx supabase --version');
    if (!cliCheck) {
      logWarning('Supabase CLI یافت نشد. لطفاً آن را نصب کنید: npm install -g supabase');
      return false;
    }

    // بررسی اتصال به Supabase (اختیاری)
    logInfo('بررسی اتصال به Supabase...');
    const { success: statusCheck, error } = execCommand('npx supabase status');
    if (!statusCheck) {
      logWarning('Supabase CLI یا Docker اجرا نیست. Database sync رد می‌شود');
      logInfo('برای فعال کردن: Docker Desktop را اجرا کنید و سپس: npx supabase start');
      // ادامه می‌دهیم چون ممکنه کاربر از remote Supabase استفاده کنه
    } else {
      logSuccess('اتصال به Supabase برقرار است');
    }

    // Push database changes (فقط اگر Supabase اجرا باشه)
    if (statusCheck) {
      logInfo('Push کردن تغییرات database...');
      await runCommand('npx', ['supabase', 'db', 'push']);
      logSuccess('Database schema بروزرسانی شد');
    } else {
      logInfo('Database push رد شد (Supabase اجرا نیست)');
    }

    // Generate TypeScript types (اختیاری - فقط اگر Supabase اجرا باشه)
    if (statusCheck) {
      logInfo('تولید TypeScript types...');
      try {
        // اجرای دستور با shell برای redirect کردن خروجی در Windows
        await runCommand('npx supabase gen types typescript --local > src/types/database.ts', [], { shell: true });
        logSuccess('TypeScript types بروزرسانی شدند');
      } catch (error) {
        logWarning('خطا در تولید types، اما ادامه می‌دهیم...');
        logWarning(`جزئیات خطا: ${error.message}`);
      }
    } else {
      logInfo('تولید types رد شد (Supabase اجرا نیست)');
    }

    return true;
  } catch (error) {
    logError(`خطا در همگام‌سازی Database: ${error.message}`);
    return false;
  }
}

/**
 * شروع development server
 */
async function startDevServer() {
  logSection('شروع Development Server');

  try {
    logInfo('شروع Vite development server...');
    log('🚀 Server در حال اجرا است. برای توقف Ctrl+C را فشار دهید.', 'green');
    console.log('');

    // اجرای server (اینجا متوقف می‌شود تا server اجرا شود)
    await runCommand('npm', ['run', 'dev']);

  } catch (error) {
    logError(`خطا در شروع server: ${error.message}`);
    process.exit(1);
  }
}

/**
 * تابع اصلی
 */
async function main() {
  console.log('');
  log('🎯 FlexPro Development Sync', 'magenta');
  log('🚀 اتوماتیک کردن workflow توسعه', 'cyan');
  console.log('═'.repeat(50));

  const results = {
    git: false,
    database: false,
    server: false
  };

  try {
    // ۱. Git Sync
    results.git = await syncGit();

    // ۲. Database Sync
    results.database = await syncDatabase();

    // ۳. Start Development Server
    if (results.git && results.database) {
      logSuccess('✅ همه مراحل با موفقیت تکمیل شد!');
      await startDevServer();
    } else {
      logWarning('⚠️  برخی مراحل با خطا مواجه شدند، اما server را شروع می‌کنیم...');
      await startDevServer();
    }

  } catch (error) {
    logError(`خطای غیرمنتظره: ${error.message}`);
    process.exit(1);
  }
}

// اجرای اسکریپت
main().catch((error) => {
  logError(`💥 خطای غیرمنتظره: ${error}`);
  process.exit(1);
});