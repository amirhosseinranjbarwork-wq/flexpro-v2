# 🚀 Auto Git Push Scripts - FlexPro v2

این اسکریپت‌ها به طور خودکار تمام تغییرات پروژه FlexPro v2 را شناسایی، commit و push می‌کنند.

## 📁 فایل‌ها

### `auto-git-push.bat`
- **نوع**: Windows Batch Script
- **استفاده**: اجرای ساده و سریع
- **ویژگی‌ها**: رابط کاربری ساده، پیام‌های واضح

### `auto-git-push.ps1`
- **نوع**: PowerShell Script
- **استفاده**: پیشرفته با ویژگی‌های بیشتر
- **ویژگی‌ها**: رنگ‌بندی، اطلاعات بیشتر، حالت dry-run، force push

## 🎯 نحوه استفاده

### روش ۱: فایل Batch (ساده)
```bash
# دوبار کلیک کنید روی فایل auto-git-push.bat
# یا در Command Prompt اجرا کنید:
auto-git-push.bat
```

### روش ۲: فایل PowerShell (پیشرفته)
```powershell
# اجرای ساده:
.\auto-git-push.ps1

# با پیام commit سفارشی:
.\auto-git-push.ps1 -CommitMessage "Custom commit message"

# حالت dry-run (بدون اعمال تغییرات):
.\auto-git-push.ps1 -DryRun

# Force push (در صورت نیاز):
.\auto-git-push.ps1 -Force
```

## ⚙️ پارامترهای PowerShell

| پارامتر | توضیح | مثال |
|---------|--------|-------|
| `-CommitMessage` | پیام commit سفارشی | `.\auto-git-push.ps1 -CommitMessage "Fixed bug"` |
| `-Force` | Force push با --force-with-lease | `.\auto-git-push.ps1 -Force` |
| `-DryRun` | نمایش تغییرات بدون اعمال | `.\auto-git-push.ps1 -DryRun` |

## 🔄 عملکرد اسکریپت

### ۱. بررسی Repository
- اطمینان از وجود `.git` directory
- بررسی دسترسی به git commands

### ۲. شناسایی تغییرات
- بررسی فایل‌های تغییر یافته، اضافه شده، حذف شده
- نمایش لیست فایل‌های تغییر یافته

### ۳. Add تغییرات
- اجرای `git add .` برای تمام فایل‌ها
- اضافه کردن فایل‌های جدید و تغییر یافته

### ۴. Commit تغییرات
- ایجاد commit با timestamp و پیام مناسب
- یا استفاده از پیام سفارشی (در PowerShell)

### ۵. Push به GitHub
- اجرای `git push origin main`
- پشتیبانی از force push در صورت نیاز

## 📊 خروجی اسکریپت

### Batch Script:
```
===========================================
   FlexPro v2 - Auto Git Push Script
===========================================

Starting auto-update process...
Timestamp: 2025-01-17 15:30:45

Changes detected. Proceeding with auto-update...

Adding all changes...
✓ Changes added successfully

Creating commit...
✓ Changes committed successfully

Pushing to GitHub...
✓ Successfully pushed to GitHub

===========================================
       UPDATE COMPLETED SUCCESSFULLY!
===========================================

Summary:
- Timestamp: 2025-01-17 15:30:45
- All changes added and committed
- Pushed to origin/main

Your FlexPro v2 project is now up to date on GitHub!
```

### PowerShell Script:
```
===========================================
   FlexPro v2 - Auto Git Push Script
===========================================

Starting auto-update process...
Timestamp: 2025-01-17 15:30:45

Changes detected. Proceeding with auto-update...

Files to be committed:
  Modified: src/components/App.tsx
  Added: src/components/NewComponent.tsx

Adding all changes...
✓ Changes added successfully

Creating commit...
Commit message: Auto update: 2025-01-17 15:30:45 - FlexPro v2 changes
✓ Changes committed successfully

Pushing to GitHub...
✓ Successfully pushed to GitHub

===========================================
       UPDATE COMPLETED SUCCESSFULLY!
===========================================

Summary:
- Timestamp: 2025-01-17 15:30:45
- All changes added and committed
- Pushed to origin/main

Your FlexPro v2 project is now up to date on GitHub!
```

## ⚠️ نکات مهم

### پیش‌نیازها:
- **Git** باید نصب و راه‌اندازی شده باشد
- **دسترسی اینترنت** برای push به GitHub
- **Git credentials** باید تنظیم شده باشند

### تنظیم Git Credentials:
```bash
# تنظیم نام کاربری و ایمیل
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# یا استفاده از GitHub CLI
gh auth login
```

### اجرای اسکریپت:
- اسکریپت را در **پوشه اصلی پروژه** اجرا کنید
- اطمینان حاصل کنید که در branch `main` هستید
- در صورت خطا، پیام‌های خطا را بررسی کنید

## 🔧 عیب‌یابی

### خطای "not a git repository":
```
ERROR: This is not a git repository!
Please run this script from the project root directory.
```
**راه حل**: اسکریپت را در پوشه‌ای اجرا کنید که `.git` دارد.

### خطای push:
```
ERROR: Failed to push to GitHub!
```
**راه حل**:
- اتصال اینترنت را بررسی کنید
- Git credentials را تنظیم کنید
- Remote URL را چک کنید: `git remote -v`

### هیچ تغییری یافت نشد:
```
No changes detected. Everything is up to date!
```
**این پیام طبیعی است** - هیچ تغییری برای commit وجود ندارد.

## 🎯 بهترین روش‌ها

### ۱. قبل از اجرای اسکریپت:
- تغییرات خود را تست کنید
- اطمینان حاصل کنید همه چیز کار می‌کند
- فایل‌های حساس را بررسی کنید (مثل `.env`)

### ۲. استفاده منظم:
- بعد از هر جلسه کاری اسکریپت را اجرا کنید
- تغییرات را به صورت منظم commit کنید
- از پیام‌های commit معنادار استفاده کنید

### ۳. در صورت مشکل:
- از حالت `-DryRun` استفاده کنید
- تغییرات را دستی بررسی کنید
- در صورت نیاز از `-Force` استفاده کنید

## 📞 پشتیبانی

در صورت بروز مشکل:
1. پیام خطا را بررسی کنید
2. وضعیت git را چک کنید: `git status`
3. Remote repository را بررسی کنید: `git remote -v`
4. با تیم پشتیبانی تماس بگیرید

---

**FlexPro v2** - همیشه بروز بمانید! 🚀
