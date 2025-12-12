@echo off
echo 🚀 Auto-committing and pushing changes...

REM Add all changes
git add .

REM Check if there are changes to commit
git diff --staged --quiet
if %errorlevel% equ 0 (
    echo ✅ No changes to commit
) else (
    REM Get current date and time
    for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value') do set datetime=%%i
    set datetime=%datetime:~0,8% %datetime:~8,6%

    REM Commit with timestamp
    git commit -m "Auto-commit: %datetime%"

    REM Push to GitHub
    git push origin main
    if %errorlevel% equ 0 (
        echo ✅ Successfully pushed to GitHub!
    ) else (
        echo ❌ Failed to push to GitHub
    )
)

echo.
pause
