# 🚀 دستورات Git برای Synchronization

**تاریخ:** $(date)  
**وضعیت:** آماده برای اجرا

---

## 📊 خلاصه تغییرات

### ✅ فایل‌های اصلاح شده (Modified):
- 13 فایل در `src/` (hooks, components, pages, lib)
- 3 فایل در `src/utils/`
- 1 فایل در `src/components/print/` (جدید)
- فایل‌های پیکربندی (package.json, .gitignore, vitest.config.ts)
- فایل‌های Supabase (migrations, functions)

### ✅ فایل‌های حذف شده (Deleted):
- `landingpage.txt`
- `src/data/legacy/` (6 فایل)

### ✅ فایل‌های جدید (Untracked):
- `AUDIT_REPORT.md`
- `CLEANUP_COMPLETED.md`
- `CLEANUP_LIST.md`
- `CLEANUP_SUMMARY.md`
- `GIT_COMMANDS.md` (این فایل)

---

## 🎯 دستورات Git

### مرحله 1: بررسی وضعیت
```bash
git status
```

### مرحله 2: اضافه کردن تمام تغییرات
```bash
# اضافه کردن فایل‌های تغییر یافته
git add .

# یا به صورت انتخابی:
git add src/
git add package.json package-lock.json
git add .gitignore
git add vitest.config.ts
git add supabase/
git add AUDIT_REPORT.md CLEANUP_COMPLETED.md CLEANUP_LIST.md CLEANUP_SUMMARY.md GIT_COMMANDS.md
```

### مرحله 3: Commit با پیام حرفه‌ای
```bash
git commit -m "refactor: comprehensive audit and cleanup

- Fix critical Supabase integration issues across all hooks and components
- Add Local Mock Data fallback for all database operations
- Remove unused legacy files and test-app folder
- Update .gitignore with comprehensive patterns
- Improve error handling and offline support

Breaking Changes:
- All hooks now support Local Mock mode when Supabase is disabled
- Legacy data files removed (migrated to main exercises.ts)

Features:
- Full offline support with localStorage fallback
- Graceful degradation when Supabase is unavailable
- Enhanced error handling and user feedback

Files Modified:
- 13 hooks updated with Supabase checks
- 3 critical components fixed (AdminDashboard, AdminRoute, SavePlanModal)
- Database layer refactored with local data support
- Print system upgraded with premium layout

Files Removed:
- src/data/legacy/ (6 files)
- landingpage.txt
- test-app/ folder

Documentation:
- Added comprehensive audit report
- Added cleanup documentation"
```

### مرحله 4: Push به Remote
```bash
# Push به branch فعلی
git push

# یا اگر branch جدید است:
git push -u origin <branch-name>

# یا push به main (با احتیاط):
git push origin main
```

---

## 📝 پیام Commit کوتاه (Alternative)

اگر پیام بالا خیلی طولانی است، می‌توانید از این استفاده کنید:

```bash
git commit -m "refactor: fix Supabase integration and cleanup unused files

- Add Local Mock Data fallback for all database operations
- Fix critical Supabase checks in hooks and components
- Remove legacy files and test-app folder
- Update .gitignore with comprehensive patterns"
```

---

## ⚠️ نکات مهم

1. **قبل از Push:**
   - مطمئن شوید که همه تست‌ها pass می‌کنند
   - بررسی کنید که برنامه در حالت Local Mock کار می‌کند
   - بررسی کنید که هیچ خطای TypeScript وجود ندارد

2. **Branch Strategy:**
   - اگر روی branch دیگری هستید، ابتدا merge کنید
   - یا مستقیماً به main push کنید (اگر مطمئن هستید)

3. **Backup:**
   - قبل از push، یک backup بگیرید
   - یا از `git tag` استفاده کنید

---

## 🔍 بررسی نهایی

```bash
# بررسی تغییرات
git diff --cached

# بررسی فایل‌های staged
git status

# بررسی تاریخچه
git log --oneline -5
```

---

**آماده برای Push!** 🚀


