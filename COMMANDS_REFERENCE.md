# 📋 FlexPro v2 - مرجع سریع دستورات

راهنمای سریع دستورات و فرمان‌های رایج

---

## 🚀 راه‌اندازی

### راه‌اندازی خودکار (توصیه می‌شود)

#### Windows:
```batch
start-local.bat
```

#### Linux/Mac:
```bash
./start-local.sh
```

### راه‌اندازی دستی

#### Backend:
```bash
# وارد پوشه Backend شوید
cd flexpro-ai-service

# ایجاد محیط مجازی
python -m venv venv

# فعال‌سازی محیط مجازی
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# نصب وابستگی‌ها
pip install -r requirements.txt

# اجرای سرور
python -m app.main

# یا با uvicorn:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend:
```bash
# در پوشه اصلی پروژه

# نصب وابستگی‌ها
npm install

# اجرای برنامه
npm run dev

# اجرا با Host برای دسترسی از شبکه محلی
npm run dev:hot
```

---

## 🔧 دستورات توسعه

### Backend Commands

```bash
# اجرا با reload خودکار
uvicorn app.main:app --reload

# اجرا با log سطح debug
uvicorn app.main:app --reload --log-level debug

# ریست کامل دیتابیس
rm flexpro.db
python -m app.main

# اجرای seed script مستقل
python -m app.db.seed

# چک کردن syntax
python -m py_compile app/main.py

# فرمت کردن کد
black app/
isort app/
```

### Frontend Commands

```bash
# توسعه
npm run dev

# Build برای production
npm run build

# Preview build
npm run preview

# Lint check
npm run lint

# Lint fix
npm run lint:fix

# Format code
npm run format

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## 🗄️ دستورات دیتابیس

### Backup Database

```bash
# Windows:
copy flexpro-ai-service\flexpro.db backup\flexpro-%date:~-4,4%%date:~-10,2%%date:~-7,2%.db

# Linux/Mac:
cp flexpro-ai-service/flexpro.db backup/flexpro-$(date +%Y%m%d).db
```

### Restore Database

```bash
# Windows:
copy backup\flexpro-YYYYMMDD.db flexpro-ai-service\flexpro.db

# Linux/Mac:
cp backup/flexpro-YYYYMMDD.db flexpro-ai-service/flexpro.db
```

### Reset Database

```bash
# حذف دیتابیس
rm flexpro-ai-service/flexpro.db

# اجرای مجدد Backend (دیتابیس جدید ساخته می‌شود)
cd flexpro-ai-service
python -m app.main
```

### View Database (SQLite Browser)

```bash
# نصب sqlite3 (اگر نصب نیست)
# Ubuntu/Debian:
sudo apt install sqlite3

# macOS:
brew install sqlite3

# مشاهده دیتابیس
sqlite3 flexpro-ai-service/flexpro.db

# دستورات داخل sqlite3:
.tables                    # لیست جداول
.schema exercises          # ساختار جدول
SELECT * FROM exercises;   # نمایش داده‌ها
.quit                      # خروج
```

---

## 📦 دستورات Package Management

### Python Packages

```bash
# نصب package جدید
pip install package-name

# به‌روزرسانی requirements.txt
pip freeze > requirements.txt

# نصب از requirements
pip install -r requirements.txt

# به‌روزرسانی همه packages
pip list --outdated
pip install --upgrade package-name
```

### NPM Packages

```bash
# نصب package جدید
npm install package-name

# نصب dev dependency
npm install -D package-name

# حذف package
npm uninstall package-name

# به‌روزرسانی packages
npm update

# چک کردن outdated packages
npm outdated

# audit امنیتی
npm audit
npm audit fix
```

---

## 🔍 دستورات Debug

### Backend Debugging

```bash
# اجرا با Python debugger
python -m pdb app/main.py

# چک کردن syntax errors
python -m py_compile app/**/*.py

# Profiling
python -m cProfile app/main.py

# Memory profiling
python -m memory_profiler app/main.py
```

### Frontend Debugging

```bash
# Build analysis
npm run build -- --mode=development

# Bundle size analysis
npm install -D vite-bundle-visualizer
# Add to vite.config.ts and run build

# TypeScript check
npx tsc --noEmit

# Check for unused dependencies
npx depcheck
```

---

## 🌐 دستورات Network

### چک کردن Ports

```bash
# Windows:
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Linux/Mac:
lsof -i :8000
lsof -i :5173
```

### Kill Process on Port

```bash
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :8000
kill -9 <PID>
```

### Test API Endpoints

```bash
# با curl
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/exercises

# با httpie (بهتر)
http GET localhost:8000/health
http GET localhost:8000/api/v1/exercises

# با wget
wget -O- http://localhost:8000/health
```

---

## 🧪 دستورات Testing

### Backend Tests

```bash
cd flexpro-ai-service

# اجرای تمام تست‌ها
pytest

# اجرا با coverage
pytest --cov=app

# اجرا با verbose
pytest -v

# اجرای تست خاص
pytest tests/test_exercises.py
```

### Frontend Tests

```bash
# اجرای تمام تست‌ها
npm test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui

# Coverage
npm run test:coverage

# اجرای تست خاص
npm test -- ExerciseSelector
```

---

## 📄 دستورات Git (مرجع)

### Basic Commands

```bash
# وضعیت
git status

# افزودن فایل‌ها
git add .
git add file.txt

# Commit
git commit -m "پیام commit"

# Push
git push origin main

# Pull
git pull origin main

# مشاهده لاگ
git log --oneline
```

### Branching

```bash
# ساخت branch جدید
git checkout -b feature/new-feature

# تغییر branch
git checkout main

# مرج کردن
git merge feature/new-feature

# حذف branch
git branch -d feature/new-feature
```

### Stash

```bash
# ذخیره تغییرات موقت
git stash

# لیست stash ها
git stash list

# برگرداندن آخرین stash
git stash pop

# حذف stash ها
git stash clear
```

---

## 🔒 دستورات امنیتی

### چک کردن Vulnerabilities

```bash
# Backend
pip audit
safety check

# Frontend
npm audit
npm audit fix
```

### بررسی Dependencies

```bash
# Backend
pip list --outdated

# Frontend
npm outdated
```

---

## 📊 دستورات Monitoring

### Backend Logs

```bash
# مشاهده logs
tail -f backend.log

# جستجو در logs
grep "ERROR" backend.log
cat backend.log | grep "exercise"
```

### System Resources

```bash
# CPU & Memory usage
top
htop  # بهتر

# Disk usage
df -h
du -sh flexpro-ai-service/

# Process list
ps aux | grep python
ps aux | grep node
```

---

## 🔄 دستورات Automation

### Cron Jobs (Linux/Mac)

```bash
# ویرایش crontab
crontab -e

# بک‌آپ روزانه ساعت 2 صبح:
0 2 * * * cp /path/to/flexpro.db /path/to/backup/flexpro-$(date +\%Y\%m\%d).db
```

### Task Scheduler (Windows)

```batch
# ساخت task برای بک‌آپ روزانه
schtasks /create /tn "FlexPro Backup" /tr "path\to\backup-script.bat" /sc daily /st 02:00
```

---

## 🆘 دستورات اضطراری

### کشتن همه پروسه‌ها

```bash
# Windows:
taskkill /f /im python.exe
taskkill /f /im node.exe

# Linux/Mac:
pkill -9 python
pkill -9 node
```

### پاک کردن Cache

```bash
# Backend (Python)
find . -type d -name "__pycache__" -exec rm -r {} +
find . -type f -name "*.pyc" -delete

# Frontend (Node)
rm -rf node_modules
rm -rf dist
npm cache clean --force
npm install
```

### Hard Reset

```bash
# حذف همه چیز و شروع از اول

# Backend:
cd flexpro-ai-service
rm -rf venv
rm flexpro.db
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Frontend:
rm -rf node_modules
rm -rf dist
npm install
```

---

## 📱 دستورات Production

### Build for Production

```bash
# Frontend
npm run build

# Backend
# No build needed - Python runs directly
```

### Deploy (Local Server)

```bash
# با PM2 (Node.js process manager)
npm install -g pm2

# اجرای Frontend
pm2 start "npm run dev" --name flexpro-frontend

# اجرای Backend
pm2 start "python -m app.main" --name flexpro-backend --interpreter python

# مشاهده status
pm2 status
pm2 logs
```

---

## 🎯 Quick Reference URLs

```
Frontend:     http://localhost:5173
Backend:      http://localhost:8000
API Docs:     http://localhost:8000/docs
Health:       http://localhost:8000/health
Redoc:        http://localhost:8000/redoc
```

---

## 📞 Need Help?

```bash
# Backend help
python -m app.main --help
uvicorn --help

# Frontend help
npm run --help
vite --help

# Package manager help
pip --help
npm help

# Git help
git --help
git <command> --help
```

---

<div align="center">

**💡 Tip:** این فایل را Bookmark کنید برای دسترسی سریع!

[⬆ بازگشت به بالا](#-flexpro-v2---مرجع-سریع-دستورات)

</div>
