@echo off
REM FlexPro Development Sync Launcher
REM این فایل batch workflow توسعه کامل را اجرا می‌کند

echo ========================================
echo 🎯 FlexPro Development Sync Launcher
echo ========================================
echo.

REM تنظیم دایرکتوری به محل فایل batch (مهم برای اجرای از shortcut یا administrator)
cd /d "%~dp0"

echo 📂 تغییر دایرکتوری به: %cd%
echo.

REM اجرای دستور همگام‌سازی کامل
echo 🚀 شروع همگام‌سازی کامل...
echo.
npm run dev:sync

REM بررسی نتیجه اجرای دستور
if %errorlevel% neq 0 (
    echo.
    echo ❌ خطا در اجرای همگام‌سازی!
    echo کد خطا: %errorlevel%
    echo.
    pause
) else (
    echo.
    echo ✅ همگام‌سازی با موفقیت تکمیل شد!
    echo.
    REM بدون pause چون development server اجرا شده و باید باز بماند
)