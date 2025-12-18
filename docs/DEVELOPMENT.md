# 🚀 راهنمای توسعه - FlexPro

## 📋 پیش‌نیازها

قبل از شروع توسعه، اطمینان حاصل کنید که موارد زیر را نصب کرده‌اید:

- **Node.js** (نسخه 18 یا بالاتر)
- **npm** یا **yarn**
- **Git**
- **Supabase CLI** (اختیاری، برای توسعه پیشرفته)

## 🛠️ راه‌اندازی سریع

### ۱. کلون کردن و نصب وابستگی‌ها

```bash
git clone <repository-url>
cd flexpro-v2
npm install
```

### ۲. تنظیم متغیرهای محیطی

فایل `.env.example` را کپی کرده و به `.env` تغییر نام دهید:

```bash
cp .env.example .env
```

متغیرهای زیر را تنظیم کنید:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Development settings
VITE_APP_ENV=development
```

### ۳. راه‌اندازی دیتابیس

```bash
# راه‌اندازی دیتابیس (migration + seed)
npm run db:reset

# یا به صورت دستی:
npm run db:migrate
npm run db:seed
```

### ۴. اجرای پروژه

```bash
# اجرای سرور توسعه
npm run dev

# اجرای با HMR (Hot Module Replacement)
npm run dev:hot
```

پروژه در `http://localhost:5173` اجرا خواهد شد.

## 📜 اسکریپت‌های موجود

| کامند | توضیح |
|-------|--------|
| `npm run dev` | اجرای سرور توسعه |
| `npm run build` | ساخت پروژه برای production |
| `npm run preview` | پیش‌نمایش build شده |
| `npm run test` | اجرای تست‌ها |
| `npm run lint` | بررسی کد با ESLint |
| `npm run format` | فرمت کردن کد |
| `npm run db:reset` | ریست کامل دیتابیس |
| `npm run db:migrate` | اجرای migration‌ها |
| `npm run db:seed` | افزودن داده‌های اولیه |
| `npm run db:generate-types` | تولید TypeScript types |

## 🏗️ ساختار پروژه

```
flexpro-v2/
├── docs/                   # مستندات
│   ├── ARCHITECTURE.md    # معماری سیستم
│   └── DEVELOPMENT.md     # این فایل
├── public/                # فایل‌های static
├── src/
│   ├── components/        # کامپوننت‌های React
│   │   ├── ui/           # کامپوننت‌های پایه UI
│   │   ├── dashboard/    # کامپوننت‌های داشبورد
│   │   └── ...           # کامپوننت‌های تخصصی
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities و API clients
│   ├── pages/            # صفحات اصلی
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── supabase/
│   ├── migrations/       # SQL migrations
│   └── config.toml      # تنظیمات Supabase
└── scripts/              # ابزارهای توسعه
```

## 🧪 توسعه و تست

### اجرای تست‌ها

```bash
# اجرای همه تست‌ها
npm run test

# اجرای تست‌ها با watch mode
npm run test:watch

# اجرای تست‌ها با coverage
npm run test:coverage
```

### بررسی کیفیت کد

```bash
# بررسی ESLint
npm run lint

# رفع خودکار مشکلات ESLint
npm run lint:fix

# فرمت کردن کد
npm run format
```

## 🔧 تنظیمات پیشرفته

### Supabase Local Development

```bash
# نصب Supabase CLI
npm install -g supabase

# راه‌اندازی Supabase محلی
supabase start

# تولید TypeScript types
npm run db:generate-types
```

### Environment Variables

| متغیر | توضیح | پیش‌فرض |
|--------|--------|----------|
| `VITE_SUPABASE_URL` | URL Supabase project | - |
| `VITE_SUPABASE_ANON_KEY` | Anonymous key Supabase | - |
| `VITE_APP_ENV` | محیط اجرای برنامه | `development` |

## 🚀 Deployment

### Build برای Production

```bash
# ساخت پروژه
npm run build

# پیش‌نمایش build
npm run preview
```

### Deploy به Vercel/Netlify

```bash
# با Vercel CLI
npm install -g vercel
vercel

# با Netlify CLI
npm install -g netlify-cli
netlify deploy --prod
```

## 🐛 گزارش باگ‌ها

برای گزارش باگ‌ها یا درخواست ویژگی‌های جدید:

1. از GitHub Issues استفاده کنید
2. باگ را با جزئیات کامل توصیف کنید
3. مراحل reproduce را ذکر کنید
4. Screenshots اضافه کنید

## 📚 منابع مفید

- [React Documentation](https://reactjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## 🤝 مشارکت

1. Fork کنید
2. Branch جدید بسازید (`git checkout -b feature/amazing-feature`)
3. تغییرات را commit کنید (`git commit -m 'Add amazing feature'`)
4. Push کنید (`git push origin feature/amazing-feature`)
5. Pull Request بسازید

---

## 📞 تماس

برای سوالات توسعه، با تیم توسعه تماس بگیرید.