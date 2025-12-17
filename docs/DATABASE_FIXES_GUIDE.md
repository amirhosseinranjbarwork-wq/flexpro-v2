# راهنمای اصلاح مشکلات داده‌ها

سه مشکل اصلی در نرم‌افزار گزارش شده بود:

## 1. ❌ داده‌های خالی در پنل‌های تمرین، غذا و مکمل
## 2. ❌ داده‌های کاربر بعد از رفرش پاک می‌شود
## 3. ❌ PDF Export کار نمی‌کند

---

## ✅ راه‌حل‌های اعمال شده

### مشکل 1: داده‌های خالی
**علت**: جدول‌های Supabase خالی هستند و یا errors در hooks

**حل**:
1. ✅ Hook‌ها به‌روزرسانی شد (`src/hooks/useExercises.ts`)
   - Null checks اضافه شد
   - Error logging اضافه شد
   - Retry logic اضافه شد (3 attempts)
   - Graceful degradation (empty array instead of crash)

2. ✅ سه migration file جامع ایجاد شد:
   - `20250218_exercises_comprehensive.sql` (160+ تمرین)
   - `20250218_foods_comprehensive.sql` (100+ غذا)
   - `20250218_supplements_comprehensive.sql` (80+ مکمل)

### مشکل 2: از دست رفتن داده‌ها
**علت**: activeUserId در localStorage save نمی‌شود

**حل**:
✅ `src/context/DataContext.tsx` به‌روزرسانی شد:
- ACTIVE_USER_KEY = 'flexActiveUserId' تعریف شد
- useEffect برای sync کردن state با localStorage اضافه شد
- حالا activeUserId بعد از رفرش باقی می‌ماند

### مشکل 3: PDF Export نمی‌شود
**علت**: Print generator ها ایجاد نشده بودند

**حل**:
✅ `src/utils/printGenerators.ts` ایجاد شد:
- 3 تابع برای تولید HTML (training, nutrition, supplements)
- Persian support و proper formatting
- RTL text support

✅ `src/context/AppContext.tsx` به‌روزرسانی شد:
- Print generators integration
- Pass generated HTML to UIContext

---

## 📋 مراحل اعمال Migrations

### گام 1: Supabase CLI نصب کنید
```bash
npm install -g supabase
```

### گام 2: Supabase Project وصل کنید
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### گام 3: Migrations را اعمال کنید
```bash
# تمام migrations
supabase migration up

# یا تک‌تک (اختیاری):
supabase db push 20250218_exercises_comprehensive.sql
supabase db push 20250218_foods_comprehensive.sql
supabase db push 20250218_supplements_comprehensive.sql
```

### گام 4: مستقیم در Supabase Console

اگر CLI کار نمی‌کند:

1. برو به https://app.supabase.com
2. Project خود را انتخاب کن
3. SQL Editor بازکن
4. هر فایل migration را کپی کن و اجرا کن:
   - `supabase/migrations/20250218_exercises_comprehensive.sql`
   - `supabase/migrations/20250218_foods_comprehensive.sql`
   - `supabase/migrations/20250218_supplements_comprehensive.sql`

---

## ✅ اعتبار‌سنجی

### بررسی 1: جدول‌ها وجود دارند
```bash
node scripts/verify-database.js
```

### بررسی 2: UI داده‌ها لود می‌کند
1. App باز کن
2. Training Panel بازکن
3. Console باید داده‌ها نشان دهد (نه error)

### بررسی 3: Persistence کار می‌کند
1. یک کاربر انتخاب کن
2. صفحه را refresh کن
3. کاربر انتخاب شده همچنان انتخاب شده باشد

### بررسی 4: PDF Export کار می‌کند
1. یک program save کن
2. Print button کلیک کن
3. PDF Preview نمایش داده شود

---

## 🗄️ ساختار جدول‌ها

### exercises
```sql
- id: UUID
- name: VARCHAR (نام تمرین)
- muscle_group: VARCHAR (گروه عضلات)
- sub_muscle_group: VARCHAR (زیر گروه)
- type: VARCHAR (resistance, cardio, corrective)
- equipment: VARCHAR
- difficulty: VARCHAR
- description: TEXT
```

### foods
```sql
- id: UUID
- name: VARCHAR (نام غذا)
- category: VARCHAR (protein, carb, fat, etc)
- calories: NUMERIC
- protein: NUMERIC (گرم)
- carbohydrates: NUMERIC (گرم)
- fat: NUMERIC (گرم)
- fiber: NUMERIC (گرم)
- unit: VARCHAR (گرم، فنجان، عدد)
- base_amount: NUMERIC (base unit برای محاسبات)
```

### supplements
```sql
- id: UUID
- name: VARCHAR (نام مکمل)
- category: VARCHAR (protein, creatine, pre-workout, etc)
- type: VARCHAR
- dosage: VARCHAR (دوز توصیه شده)
- unit: VARCHAR
- benefits: TEXT
- timing: VARCHAR (شامل، بعد از تمرین، شب، etc)
- notes: TEXT
```

---

## 🔍 Troubleshooting

### مشکل: جدول‌ها نمایش داده نمی‌شوند
```bash
# SQL Editor می‌روی و check کن:
SELECT table_name FROM information_schema.tables WHERE table_schema='public';
```

### مشکل: داده‌ها نمایش داده نمی‌شوند
```bash
# Check if RLS policies allow reads:
SELECT * FROM exercises LIMIT 10;
```

### مشکل: Hook‌ها error نمایش می‌دهند
1. Browser console باز کن (F12)
2. Network tab بررسی کن
3. Supabase connection check کن

---

## 📝 فایل‌های تغییر یافته

✅ **Hooks** (Enhanced):
- `src/hooks/useExercises.ts` - All 3 hooks updated

✅ **Context** (Fixed):
- `src/context/DataContext.tsx` - Added localStorage persistence
- `src/context/UIContext.tsx` - Updated print signature
- `src/context/AppContext.tsx` - Added print integration

✅ **Utils** (New):
- `src/utils/printGenerators.ts` - Print HTML generators

✅ **Components** (Updated):
- `src/components/SupplementsPanel.tsx` - Now uses Supabase hook

✅ **Types** (Updated):
- `src/types/types.ts` - Updated print function signatures

✅ **Migrations** (New):
- `supabase/migrations/20250218_exercises_comprehensive.sql`
- `supabase/migrations/20250218_foods_comprehensive.sql`
- `supabase/migrations/20250218_supplements_comprehensive.sql`

---

## 🎯 Next Steps

1. ✅ Migrations را اعمال کن
2. ✅ `verify-database.js` را اجرا کن
3. ✅ UI را test کن
4. ✅ Print functionality را test کن
5. ✅ Persistence را verify کن

---

**نوشته شده**: ۱۸ فوریه ۲۰۲۵

اگر مشکل دارید:
- Browser console را check کن برای errors
- Supabase SQL Editor باز کن تا جدول‌ها درست هستند
- Network tab بررسی کن برای failed requests
