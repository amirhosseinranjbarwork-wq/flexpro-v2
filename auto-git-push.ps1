# FlexPro v2 - Auto Git Push Script
# PowerShell version for enhanced functionality

param(
    [string]$CommitMessage = "",
    [switch]$Force,
    [switch]$DryRun
)

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   FlexPro v2 - Auto Git Push Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Get current timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$shortDate = Get-Date -Format "yyyy-MM-dd"

Write-Host "Starting auto-update process..." -ForegroundColor Green
Write-Host "Timestamp: $timestamp" -ForegroundColor Gray
Write-Host ""

# Check if we're in a git repository
if (!(Test-Path ".git")) {
    Write-Host "ERROR: This is not a git repository!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check git status
Write-Host "Checking git status..." -ForegroundColor Yellow
try {
    $status = git status --porcelain
    $hasChanges = $status -and $status.Length -gt 0
}
catch {
    Write-Host "ERROR: Failed to check git status!" -ForegroundColor Red
    Write-Host "Make sure git is installed and accessible." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

if (!$hasChanges) {
    Write-Host "No changes detected. Everything is up to date!" -ForegroundColor Green
    Write-Host ""

    Write-Host "Current commit:" -ForegroundColor Cyan
    git log --oneline -1
    Write-Host ""

    if (!$DryRun) {
        Read-Host "Press Enter to exit"
    }
    exit 0
}

if ($DryRun) {
    Write-Host "DRY RUN MODE - Changes that would be made:" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Files to be added:" -ForegroundColor Yellow
    git status --porcelain | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    Write-Host ""
    Write-Host "This was a dry run. No changes were made." -ForegroundColor Cyan
    exit 0
}

Write-Host "Changes detected. Proceeding with auto-update..." -ForegroundColor Green
Write-Host ""

# Show what will be committed
Write-Host "Files to be committed:" -ForegroundColor Yellow
git status --porcelain | ForEach-Object {
    $status = $_.Substring(0, 2)
    $file = $_.Substring(3)

    switch ($status) {
        { $_ -match "^M" } { Write-Host "  Modified: $file" -ForegroundColor Yellow }
        { $_ -match "^A" } { Write-Host "  Added: $file" -ForegroundColor Green }
        { $_ -match "^D" } { Write-Host "  Deleted: $file" -ForegroundColor Red }
        { $_ -match "^R" } { Write-Host "  Renamed: $file" -ForegroundColor Blue }
        { $_ -match "^\?" } { Write-Host "  Untracked: $file" -ForegroundColor Gray }
        default { Write-Host "  $status $file" -ForegroundColor White }
    }
}
Write-Host ""

# Add all changes
Write-Host "Adding all changes..." -ForegroundColor Yellow
try {
    git add .
    Write-Host "✓ Changes added successfully" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Failed to add changes!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Create commit message
if ($CommitMessage -eq "") {
    $CommitMessage = "Auto update: $timestamp - FlexPro v2 changes"
}

Write-Host "Creating commit..." -ForegroundColor Yellow
Write-Host "Commit message: $CommitMessage" -ForegroundColor Gray

try {
    $commitOutput = git commit -m "$CommitMessage" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Changes committed successfully" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR: Failed to commit changes!" -ForegroundColor Red
        Write-Host $commitOutput -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}
catch {
    Write-Host "ERROR: Failed to commit changes!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Push to remote
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
try {
    if ($Force) {
        git push origin main --force-with-lease
    }
    else {
        git push origin main
    }
    Write-Host "✓ Successfully pushed to GitHub" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Failed to push to GitHub!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "- Check your internet connection" -ForegroundColor Gray
    Write-Host "- Verify your git credentials are set up correctly" -ForegroundColor Gray
    Write-Host "- Try running 'git push origin main --force-with-lease' if you need to force push" -ForegroundColor Gray
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "       UPDATE COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor White
Write-Host "- Timestamp: $timestamp" -ForegroundColor Gray
Write-Host "- All changes added and committed" -ForegroundColor Gray
Write-Host "- Pushed to origin/main" -ForegroundColor Gray
Write-Host ""
Write-Host "Your FlexPro v2 project is now up to date on GitHub!" -ForegroundColor Green
Write-Host ""

# Show the latest commit
Write-Host "Latest commit:" -ForegroundColor Cyan
git log --oneline -3
Write-Host ""

if (!$Force) {
    Read-Host "Press Enter to exit"
}
