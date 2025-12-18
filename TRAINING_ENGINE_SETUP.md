# 🚀 راه‌اندازی Training Engine - FlexPro v2

## 🎯 نمای کلی

Training Engine جدید بر اساس اصول علمی NSCA و NASM بازسازی شده تا تجربه‌ای حرفه‌ای برای برنامه‌ریزی تمرینی فراهم کند.

## 📋 پیش‌نیازها

- ✅ Supabase project تنظیم شده
- ✅ متغیرهای محیطی `.env` کامل
- ✅ Node.js و npm نصب شده

## 🛠️ مراحل راه‌اندازی

### مرحله ۱: اجرای Migration علمی

```bash
# اجرای اسکریپت seed (migration SQL نمایش داده می‌شود)
npm run db:seed-exercises
```

**مهم:** SQL نمایش داده شده را کپی کرده و در **Supabase SQL Editor** اجرا کنید:

1. به Supabase Dashboard بروید
2. SQL Editor را باز کنید
3. SQL را paste کرده و Run کنید

### مرحله ۲: تولید داده‌های تمرینی

```bash
# اجرای دوباره اسکریپت برای تولید داده‌ها
npm run db:seed-exercises
```

### مرحله ۳: بروزرسانی TypeScript Types

```bash
# تولید types جدید
npm run db:generate-types
```

### مرحله ۴: راه‌اندازی برنامه

```bash
# اجرای برنامه
npm run dev
```

## 🎨 ویژگی‌های جدید

### 📊 پارامترهای علمی

- **Tempo**: الگوی حرکت (مثال: "3-0-1-0")
- **RPE**: نرخ ادراک تلاش (1-10)
- **RIR**: تعداد تکرار باقیمانده (0-5)
- **Rest Interval**: زمان استراحت (ثانیه)

### 🏷️ دسته‌بندی پیشرفته

- **Bodybuilding**: تمرینات قدرت و حجم
- **Cardio**: تمرینات قلبی عروقی
- **Corrective**: تمرینات اصلاحی (NASM inspired)
- **Warm-up**: گرم‌کردن
- **Cool-down**: سردکردن

### 🎯 فیلترینگ هوشمند

- فیلتر بر اساس **دسته‌بندی**
- فیلتر بر اساس **تجهیزات**
- فیلتر بر اساس **سطح دشواری**
- جستجوی پیشرفته

## 📈 داده‌های موجود

### Bodybuilding (۲۰+ حرکت)
- Bench Press variations
- Deadlift variations
- Squat patterns
- Isolation movements

### Cardio (۵+ حرکت)
- Steady State
- HIIT protocols
- Zone 2 training

### Corrective (۱۰+ حرکت)
- Clamshells
- Face Pulls
- Y-T-W Raises
- Dead Bugs
- Foam Rolling

### Warm-up/Cool-down (۱۰+ حرکت)
- Dynamic stretches
- Activation drills
- Recovery protocols

## 🔧 تنظیمات پیشرفته

### افزودن حرکت جدید

```typescript
{
  name: "Custom Exercise",
  category: "bodybuilding",
  primary_muscle: "Target Muscle",
  equipment_standardized: "barbell",
  difficulty_level: "intermediate",
  tempo: "3-0-1-0",
  default_rpe: 7,
  default_rir: 2,
  rest_interval_seconds: 120
}
```

## 🐛 عیب‌یابی

### خطای "Table exercises not found"
```
→ مرحله ۱ را دوباره اجرا کنید و SQL را در Supabase اجرا کنید
```

### خطای "No exercises loaded"
```
→ npm run db:seed-exercises را دوباره اجرا کنید
```

### خطای TypeScript
```
→ npm run db:generate-types را اجرا کنید
```

## 📚 منابع

- **NSCA**: National Strength and Conditioning Association
- **NASM**: National Academy of Sports Medicine
- **Scientific Training Parameters**: Periodization, Auto-regulation

---

## 🎉 آماده استفاده!

Training Engine شما اکنون با استانداردهای حرفه‌ای آماده است! 💪
