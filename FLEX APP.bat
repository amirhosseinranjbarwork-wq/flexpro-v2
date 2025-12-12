@echo off
:: این دستور به پوشه فعلی پروژه می‌رود
cd /d "%~dp0"

:: باز کردن مرورگر به صورت خودکار (چند ثانیه صبر می‌کند تا سرور لود شود)
timeout /t 3 >nul
start "" "http://localhost:5174"

:: اجرای سرور React
echo Starting FLEX PRO Application...
npm run dev