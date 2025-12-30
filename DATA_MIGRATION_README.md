# مستندات بازنویسی بانک داده‌ها

## خلاصه تغییرات

تمام بانک داده‌های پروژه از پوشه `data for develop` بازنویسی و با ساختار حرفه‌ای TypeScript جایگزین شدند.

## فایل‌های جدید

### 1. تمرینات (Exercises)

#### `src/data/resistanceExercises.ts`
- ✅ تمام تمرینات مقاومتی با دسته‌بندی کامل
- ✅ شامل: سینه، پشت، پا، شانه، بازو، شکم
- ✅ تمرینات پرخطر برای آسیب‌های مختلف

#### `src/data/cardioExercises.ts`
- ✅ دستگاه‌های هوازی (تردمیل، دوچرخه، الپتیکال، روئینگ، ...)
- ✅ تمرینات اینتروال (HIIT, Tabata, AMRAP, EMOM)
- ✅ دویدن و پیاده‌روی
- ✅ دوچرخه‌سواری
- ✅ شنا
- ✅ تمرینات عملکردی (برپی، طناب زنی، ...)

#### `src/data/correctiveExercises.ts`
- ✅ تمرینات اصلاحی برای مشکلات مختلف:
  - کایفوز و سر به جلو
  - لوردوز و گودی کمر
  - اسکولیوز
  - زانوی پرانتزی/ضربدری
  - پای صاف
  - شانه گرد
  - شانه یخ‌زده
  - سندرم تونل کارپال
  - درد پایین کمر

#### `src/data/warmupCooldown.ts`
- ✅ تمرینات گرم کردن (53 تمرین)
- ✅ تمرینات سرد کردن (47 تمرین)

#### `src/data/exercises.ts`
- ✅ تمرینات مقاومتی پایه
- ✅ تمرینات هوازی پایه
- ✅ Import و ترکیب تمام تمرینات

### 2. غذاها (Foods)

#### `src/data/foods.ts`
- ✅ منابع پروتئین (53 مورد)
- ✅ کربوهیدرات و غلات (28 مورد)
- ✅ چربی‌های سالم و آجیل (23 مورد)
- ✅ لبنیات (18 مورد)
- ✅ میوه‌ها (31 مورد)
- ✅ سبزیجات (30 مورد)
- ✅ نوشیدنی‌ها (50 مورد)
- ✅ شیرینی‌کننده‌ها و سس‌ها (25 مورد)
- ✅ غذاهای آماده و فست‌فود (16 مورد)

**پارامترهای حرفه‌ای:**
- `mealTiming`: زمان مناسب مصرف (pre-workout, post-workout, anytime, ...)
- `macroRatio`: نسبت ماکرو (high-protein, high-carb, high-fat, balanced)
- `satietyIndex`: شاخص سیری (1-10)
- `digestibility`: سرعت هضم (fast, medium, slow)
- `costLevel`: سطح قیمت (low, medium, high)

#### `src/data/foodDataHelper.ts`
- Helper functions برای سازگاری با کامپوننت‌های موجود
- تبدیل به فرمت قدیمی برای backward compatibility
- توابع جستجو و فیلتر پیشرفته

### 3. مکمل‌ها (Supplements)

#### `src/data/supplements.ts`
- ✅ پروتئین‌ها (16 نوع)
- ✅ کراتین (6 نوع)
- ✅ آمینو اسیدها (18 نوع)
- ✅ پری و پست ورک‌اوت (6 نوع)
- ✅ ویتامین‌ها و مینرال‌ها (30 نوع)
- ✅ چربی‌های سالم (9 نوع)
- ✅ چربی سوزها (13 نوع)
- ✅ هورمون‌ها و تستوسترون (8 نوع)
- ✅ گوارش و آنزیم‌ها (9 نوع)
- ✅ کلاژن و مفاصل (12 نوع)
- ✅ خواب و آرامش (8 نوع)
- ✅ انرژی و استقامت (6 نوع)
- ✅ آنتی‌اکسیدان‌ها (7 نوع)
- ✅ گیاهان دارویی (9 نوع)
- ✅ الکترولیت‌ها (6 نوع)
- ✅ فیبر (5 نوع)
- ✅ سایر (20 نوع)

**مجموع: 227 مکمل**

## پارامترهای حرفه‌ای

### تمرینات (`src/types/exercise-parameters.ts`)

#### ResistanceParameters
```typescript
{
  sets: number;
  reps: number | string; // "8-12", "AMRAP", etc.
  weight?: number;
  rest: number;
  rpe?: number; // 1-10
  rir?: number; // 0-5
  tempo?: string; // "3-0-1-0"
  system?: 'straight_set' | 'superset' | 'drop_set' | ...;
  dropSets?: { count: number; weightReduction: number };
  restPause?: { intraSetRest: number; miniSets: number };
  clusterSet?: { repsPerCluster: number; intraClusterRest: number };
  // ... و بیشتر
}
```

#### CardioParameters
```typescript
{
  duration: number; // minutes
  intensity: 'low' | 'moderate' | 'high' | 'very_high';
  targetZone?: 1 | 2 | 3 | 4 | 5;
  method?: 'liss' | 'hiit' | 'tabata' | 'intervals';
  intervals?: {
    workDuration: number;
    restDuration: number;
    rounds: number;
  };
  treadmill?: { speed?: number; incline?: number };
  // ... و بیشتر
}
```

#### CorrectiveParameters
```typescript
{
  sets: number;
  reps?: number;
  duration?: number;
  correctiveType?: 'stretch' | 'strengthen' | 'activate';
  stretchType?: 'static' | 'dynamic' | 'pnf';
  nasmPhase?: 'inhibit' | 'lengthen' | 'activate' | 'integrate';
  // ... و بیشتر
}
```

### برنامه غذایی (`src/types/diet-parameters.ts`)

#### MealTimingParameters
- زمان مصرف غذا
- نسبت به تمرین (pre/post)
- تنظیمات روز تمرین/استراحت

#### MacroDistributionParameters
- توزیع ماکروها
- توزیع بین وعده‌ها
- تنظیمات بر اساس هدف

#### FoodSelectionParameters
- فیلتر بر اساس meal timing
- فیلتر بر اساس macro ratio
- فیلتر بر اساس satiety index
- فیلتر بر اساس digestibility

#### MealPlanParameters
- Calorie cycling
- Carb cycling
- Intermittent fasting
- Meal prep
- Hydration

### مکمل‌ها (`src/types/supplement-parameters.ts`)

#### SupplementTimingParameters
- زمان مصرف (pre/post workout, morning, evening, ...)
- Cycling
- Loading phase

#### SupplementDosingParameters
- دوز بر اساس وزن بدن
- Split dosing
- Goal-based adjustments
- Stack combinations

#### SupplementQualityParameters
- Quality standards
- Third-party testing
- Purity
- Bioavailability

#### SupplementSafetyParameters
- Contraindications
- Drug interactions
- Side effects
- Maximum safe dose

## نحوه استفاده

### Import داده‌ها

```typescript
import { 
  exercises, 
  foods, 
  supplements,
  resistanceExercises,
  cardioExercises,
  correctiveExercises
} from './data';
```

### استفاده از Helper Functions

```typescript
import { 
  getFoodByName,
  getFoodsByMealTiming,
  getRecommendedFoodsForGoal,
  getOptimalTiming,
  getOptimalDose
} from './data';

// جستجوی غذا
const chicken = getFoodByName('سینه مرغ');

// غذاهای مناسب قبل تمرین
const preWorkoutFoods = getFoodsByMealTiming('pre-workout');

// غذاهای توصیه شده برای افزایش عضله
const muscleGainFoods = getRecommendedFoodsForGoal('muscle_gain', 'post-workout');

// زمان بهینه مصرف مکمل
const timing = getOptimalTiming(supplement, 'muscle_gain');

// دوز بهینه مکمل
const dose = getOptimalDose(supplement, 75); // 75kg bodyweight
```

### استفاده از پارامترهای حرفه‌ای

```typescript
import { 
  ResistanceParameters,
  CardioParameters,
  defaultResistanceParameters,
  defaultCardioParameters
} from './types/exercise-parameters';

// پارامترهای تمرین مقاومتی
const resistanceParams: ResistanceParameters = {
  ...defaultResistanceParameters,
  sets: 4,
  reps: '8-12',
  weight: 80,
  rpe: 8,
  system: 'drop_set',
  dropSets: {
    count: 2,
    weightReduction: 20 // 20% reduction
  }
};

// پارامترهای تمرین کاردیو
const cardioParams: CardioParameters = {
  ...defaultCardioParameters,
  duration: 30,
  method: 'hiit',
  intervals: {
    workDuration: 30,
    restDuration: 60,
    rounds: 8,
    workIntensity: 'very_high',
    restType: 'active'
  }
};
```

## سازگاری با کد موجود

برای حفظ سازگاری با کامپوننت‌های موجود، از `foodDataHelper.ts` استفاده کنید:

```typescript
import { foodData } from './data/foodDataHelper';

// فرمت قدیمی (سازگار با DietPanel)
const oldFormat = foodData;
```

## نکات مهم

1. ✅ تمام داده‌ها به TypeScript تبدیل شدند
2. ✅ پارامترهای حرفه‌ای برای هر بخش طراحی شد
3. ✅ Helper functions برای سازگاری با کد موجود
4. ✅ ساختار منطقی و دسته‌بندی شده
5. ✅ پشتیبانی از پارامترهای پیشرفته تمرین و تغذیه

## فایل‌های قدیمی

فایل‌های زیر هنوز در پروژه وجود دارند اما استفاده نمی‌شوند:
- `src/data/ultimate-exercises.ts` (استفاده در workoutStore)
- `src/data/ultimate-supplements.ts` (استفاده در SupplementsPanel)
- `src/data/scientific-foods.ts` (استفاده در DietPanel)

این فایل‌ها می‌توانند در آینده حذف شوند یا با داده‌های جدید جایگزین شوند.

## مراحل بعدی

1. به‌روزرسانی کامپوننت‌ها برای استفاده از داده‌های جدید
2. حذف فایل‌های قدیمی (در صورت نیاز)
3. تست کامل تمام بخش‌ها
4. به‌روزرسانی مستندات

