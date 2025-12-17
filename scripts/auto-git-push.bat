@echo off
echo ============================================
echo    FlexPro v2 - Auto Git Push Script
echo ============================================
echo.

REM Get current timestamp
for /f "tokens=2-4 delims=/ " %%a in ("%date%") do set timestamp=%%c-%%a-%%b
for /f "tokens=1-2 delims=: " %%a in ("%time%") do set timestamp=%timestamp%_%%a-%%b

echo Starting auto-update process...
echo Timestamp: %timestamp%
echo.

REM Check if we're in a git repository
if not exist .git (
    echo ERROR: This is not a git repository!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

echo Checking git status...
git status --porcelain > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to check git status!
    pause
    exit /b 1
)

REM Check if there are any changes
git status --porcelain | findstr /r /c:".*" > nul 2>&1
if %errorlevel% neq 0 (
    echo No changes detected. Everything is up to date!
    echo.
    echo Current commit:
    git log --oneline -1
    echo.
    pause
    exit /b 0
)

echo Changes detected. Proceeding with auto-update...
echo.

REM Add all changes
echo Adding all changes...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to add changes!
    pause
    exit /b 1
)
echo ✓ Changes added successfully
echo.

REM Create commit message
set commit_msg="Auto update: %timestamp% - FlexPro v2 changes"

REM Commit changes
echo Creating commit...
git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo ERROR: Failed to commit changes!
    echo This might be because there are no changes to commit.
    pause
    exit /b 1
)
echo ✓ Changes committed successfully
echo.

REM Push to remote
echo Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERROR: Failed to push to GitHub!
    echo Please check your internet connection and git credentials.
    pause
    exit /b 1
)
echo ✓ Successfully pushed to GitHub
echo.

echo ============================================
echo        UPDATE COMPLETED SUCCESSFULLY!
echo ============================================
echo.
echo Summary:
echo - Timestamp: %timestamp%
echo - All changes added and committed
echo - Pushed to origin/main
echo.
echo Your FlexPro v2 project is now up to date on GitHub!
echo.

REM Show the latest commit
echo Latest commit:
git log --oneline -1
echo.

pause