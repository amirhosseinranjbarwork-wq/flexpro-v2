@echo off
REM Git Update Shortcut for FlexPro v2
REM This is a simple shortcut to run the auto git push script

echo ============================================
echo      FlexPro v2 - Git Update Shortcut
echo ============================================
echo.
echo This will automatically update all your changes to GitHub.
echo.
echo Press any key to continue, or Ctrl+C to cancel...
pause > nul

echo.
echo Running auto git push script...
call auto-git-push.bat

echo.
echo ============================================
echo          Shortcut execution completed!
echo ============================================
