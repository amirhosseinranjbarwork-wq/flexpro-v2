import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseEnabled } from '../lib/supabaseClient';
import { exercises } from '../data/exercises';

// Fallback data when Supabase is not available - using first 20 comprehensive exercises
const fallbackExercises = exercises.slice(0, 20).map(exercise => ({
  id: exercise.id,
  name: exercise.name,
  muscle_group: exercise.muscleGroup,
  sub_muscle_group: exercise.subMuscleGroup || null,
  equipment: exercise.equipment,
  type: exercise.type,
  mechanics: exercise.mechanics,
  description: exercise.description
}));

export function useExercises() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      if (!supabase || !isSupabaseEnabled) {
        console.warn('Supabase not available, using fallback data');
        return fallbackExercises;
      }

      try {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .order('name');

        if (error) {
          console.warn('Supabase error, using fallback data:', error.message);
          return fallbackExercises;
        }

        if (!data || data.length === 0) {
          console.warn('No exercises data from Supabase, using fallback data');
          return fallbackExercises;
        }

        return data;
      } catch (err) {
        console.warn('useExercises error, using fallback data:', err.message);
        return fallbackExercises;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
}

// Fallback data when Supabase is not available
const fallbackFoods = [
  {
    "id": "chicken_breast_grilled",
    "name": "مرغ سینه بدون پوست",
    "nameEn": "Grilled Chicken Breast",
    "category": "پروتئین - مرغ",
    "subcategory": "مرغ",
    "unit": "گرم",
    "baseAmount": 100,
    "calories": 165,
    "protein": 31,
    "carbs": 0,
    "fat": 3.6,
    "sodium": 74,
    "potassium": 256,
    "iron": 1.3,
    "preparation": "گریل شده",
    "nutritionalHighlights": "پروتئین بالا\nچربی کم\nبدون کربوهیدرات",
    "servingSuggestions": "با سالاد\nدر ساندویچ\nبا سبزیجات"
  },
  {
    "id": "turkey_breast_grilled",
    "name": "سینه بوقلمون گریل شده",
    "nameEn": "Grilled Turkey Breast",
    "category": "پروتئین - بوقلمون",
    "subcategory": "بوقلمون",
    "unit": "گرم",
    "baseAmount": 100,
    "calories": 135,
    "protein": 30,
    "carbs": 0,
    "fat": 1,
    "sodium": 55,
    "potassium": 239,
    "iron": 0.8,
    "preparation": "گریل شده",
    "nutritionalHighlights": "پروتئین بسیار بالا\nچربی بسیار کم",
    "servingSuggestions": "در ساندویچ\nبا سالاد\nدر سوپ"
  },
  {
    "id": "beef_sirloin_grilled",
    "name": "استیک سرلون گریل شده",
    "nameEn": "Grilled Sirloin Steak",
    "category": "پروتئین - گوشت قرمز",
    "subcategory": "گوشت قرمز",
    "unit": "گرم",
    "baseAmount": 100,
    "calories": 271,
    "protein": 26,
    "carbs": 0,
    "fat": 18,
    "sodium": 75,
    "potassium": 329,
    "iron": 2.9,
    "preparation": "گریل شده",
    "nutritionalHighlights": "پروتئین بالا\nآهن بالا\nروی بالا",
    "servingSuggestions": "با سیب‌زمینی\nبا سالاد\nبا سبزیجات"
  },
  {
    "id": "salmon_grilled",
    "name": "سالمون گریل شده",
    "nameEn": "Grilled Salmon",
    "category": "پروتئین - ماهی",
    "subcategory": "ماهی",
    "unit": "گرم",
    "baseAmount": 100,
    "calories": 208,
    "protein": 20,
    "carbs": 0,
    "fat": 13,
    "sodium": 75,
    "potassium": 363,
    "iron": 0.3,
    "isVegan": false,
    "isGlutenFree": true,
    "allergens": [
      "ماهی"
    ],
    "preparation": "گریل شده",
    "nutritionalHighlights": "اسیدهای چرب امگا-۳\nپروتئین بالا\nویتامین D",
    "servingSuggestions": "با برنج\nبا سالاد\nبا سبزیجات"
  },
  {
    "id": "egg_whole",
    "name": "تخم‌مرغ کامل",
    "nameEn": "Whole Egg",
    "category": "پروتئین - تخم‌مرغ",
    "subcategory": "تخم‌مرغ",
    "unit": "عدد",
    "baseAmount": 50,
    "calories": 78,
    "protein": 6,
    "carbs": 1,
    "fat": 5.3,
    "sodium": 71,
    "potassium": 69,
    "iron": 0.9,
    "vitaminA": 75,
    "isVegan": false,
    "isGlutenFree": true,
    "allergens": [
      "تخم‌مرغ"
    ],
    "preparation": "خام یا پخته شده",
    "nutritionalHighlights": "پروتئین کامل\nویتامین‌های B\nکولین",
    "servingSuggestions": "آب‌پز\nسرد شده\nدر سالاد"
  },
  {
    "id": "brown_rice_cooked",
    "name": "برنج قهوه‌ای پخته شده",
    "nameEn": "Cooked Brown Rice",
    "category": "کربوهیدرات - غلات کامل",
    "subcategory": "غلات کامل",
    "unit": "گرم",
    "baseAmount": 100,
    "calories": 111,
    "protein": 2.6,
    "carbs": 23,
    "fat": 0.9,
    "fiber": 1.8,
    "sodium": 5,
    "potassium": 86,
    "iron": 0.6,
    "glycemicIndex": 50,
    "isVegan": true,
    "isGlutenFree": true,
    "preparation": "پخته شده",
    "nutritionalHighlights": "فیبر بالا\nمنگنز\nسلنیوم",
    "servingSuggestions": "با پروتئین\nدر سالاد\nبه عنوان پایه غذا"
  },
  {
    "id": "quinoa_cooked",
    "name": "کینوا پخته شده",
    "nameEn": "Cooked Quinoa",
    "category": "کربوهیدرات - سوپرغذاها",
    "subcategory": "سوپرغذاها",
    "unit": "گرم",
    "baseAmount": 100,
    "calories": 120,
    "protein": 4.4,
    "carbs": 21,
    "fat": 1.9,
    "fiber": 2.6,
    "sodium": 7,
    "potassium": 172,
    "iron": 1.5,
    "glycemicIndex": 53,
    "isVegan": true,
    "isGlutenFree": true,
    "preparation": "پخته شده",
    "nutritionalHighlights": "پروتئین کامل\nآهن بالا\nمغنزیوم",
    "servingSuggestions": "به عنوان برنج\nدر سالاد\nدر اسموتی"
  },
  {
    "id": "sweet_potato_baked",
    "name": "سیب‌زمینی شیرین پخته شده",
    "nameEn": "Baked Sweet Potato",
    "category": "کربوهیدرات - سبزیجات نشاسته‌ای",
    "subcategory": "سبزیجات نشاسته‌ای",
    "unit": "گرم",
    "baseAmount": 100,
    "calories": 90,
    "protein": 2,
    "carbs": 20,
    "fat": 0.1,
    "fiber": 3.8,
    "sodium": 55,
    "potassium": 475,
    "vitaminA": 19218,
    "vitaminC": 2.4,
    "glycemicIndex": 63,
    "isVegan": true,
    "isGlutenFree": true,
    "preparation": "پخته شده",
    "nutritionalHighlights": "بتا کاروتن بالا\nفیبر\nپتاسیم بالا",
    "servingSuggestions": "با پروتئین\nدر سالاد\nبه عنوان میان‌وعده"
  },
  {
    "id": "banana_medium",
    "name": "موز متوسط",
    "nameEn": "Medium Banana",
    "category": "میوه - میوه‌های گرمسیری",
    "subcategory": "میوه‌های گرمسیری",
    "unit": "میوه",
    "baseAmount": 118,
    "calories": 105,
    "protein": 1.3,
    "carbs": 27,
    "fat": 0.4,
    "fiber": 3.1,
    "sodium": 1,
    "potassium": 422,
    "vitaminC": 10.3,
    "glycemicIndex": 51,
    "isVegan": true,
    "isGlutenFree": true,
    "preparation": "خام",
    "nutritionalHighlights": "پتاسیم بالا\nویتامین B6\nفیبر",
    "servingSuggestions": "به عنوان میان‌وعده\nدر اسموتی\nبا جو دوسر"
  },
  {
    "id": "apple_medium",
    "name": "سیب متوسط",
    "nameEn": "Medium Apple",
    "category": "میوه - میوه‌های هسته‌دار",
    "subcategory": "میوه‌های هسته‌دار",
    "unit": "میوه",
    "baseAmount": 182,
    "calories": 95,
    "protein": 0.5,
    "carbs": 25,
    "fat": 0.3,
    "fiber": 4.4,
    "sodium": 2,
    "potassium": 195,
    "vitaminC": 8.4,
    "glycemicIndex": 39,
    "isVegan": true,
    "isGlutenFree": true,
    "preparation": "خام",
    "nutritionalHighlights": "فیبر محلول\nآنتی‌اکسیدان\nویتامین C",
    "servingSuggestions": "به عنوان میان‌وعده\nدر سالاد\nبا کره بادام"
  },
  {
    "id": "spinach_raw",
    "name": "اسفناج خام",
    "nameEn": "Raw Spinach",
    "category": "سبزی - سبزیجات برگ‌دار",
    "subcategory": "سبزیجات برگ‌دار",
    "unit": "گرم",
    "baseAmount": 100,
    "calories": 23,
    "protein": 2.9,
    "carbs": 3.6,
    "fat": 0.4,
    "fiber": 2.2,
    "sodium": 79,
    "potassium": 558,
    "calcium": 99,
    "iron": 2.7,
    "vitaminA": 9377,
    "vitaminC": 28,
    "isVegan": true,
    "isGlutenFree": true,
    "preparation": "خام",
    "nutritionalHighlights": "آهن بالا\nویتامین K بالا\nکلسیم",
    "servingSuggestions": "در سالاد\nدر اسموتی\nدر پخت"
  },
  {
    "id": "broccoli_cooked",
    "name": "بروکلی پخته شده",
    "nameEn": "Cooked Broccoli",
    "category": "سبزی - سبزیجات گل",
    "subcategory": "سبزیجات گل",
    "unit": "گرم",
    "baseAmount": 100,
    "calories": 34,
    "protein": 2.8,
    "carbs": 7,
    "fat": 0.4,
    "fiber": 2.4,
    "sodium": 64,
    "potassium": 293,
    "vitaminC": 81,
    "vitaminA": 623,
    "isVegan": true,
    "isGlutenFree": true,
    "preparation": "پخته شده",
    "nutritionalHighlights": "ویتامین C بالا\nفیبر\nآنتی‌اکسیدان",
    "servingSuggestions": "بخارپز\nدر سالاد\nبا پروتئین"
  },
  {
    "id": "avocado_medium",
    "name": "آووکادو متوسط",
    "nameEn": "Medium Avocado",
    "category": "چربی سالم - میوه‌ها",
    "subcategory": "میوه‌ها",
    "unit": "میوه",
    "baseAmount": 150,
    "calories": 240,
    "protein": 3,
    "carbs": 12,
    "fat": 22,
    "fiber": 10,
    "sodium": 10,
    "potassium": 708,
    "vitaminC": 12,
    "vitaminE": 2.1,
    "isVegan": true,
    "isGlutenFree": true,
    "preparation": "خام",
    "nutritionalHighlights": "چربی سالم\nفیبر بالا\nپتاسیم بالا",
    "servingSuggestions": "در سالاد\nدر ساندویچ\nدر اسموتی"
  },
  {
    "id": "almonds_raw",
    "name": "بادام خام",
    "nameEn": "Raw Almonds",
    "category": "چربی سالم - آجیل",
    "subcategory": "آجیل",
    "unit": "گرم",
    "baseAmount": 28,
    "calories": 161,
    "protein": 6,
    "carbs": 6,
    "fat": 14,
    "fiber": 3.5,
    "sodium": 0,
    "potassium": 208,
    "magnesium": 76,
    "vitaminE": 7.3,
    "isVegan": true,
    "isGlutenFree": true,
    "allergens": [
      "آجیل"
    ],
    "preparation": "خام",
    "nutritionalHighlights": "ویتامین E بالا\nمنیزیم\nچربی سالم",
    "servingSuggestions": "به عنوان میان‌وعده\nدر سالاد\nدر گرانولا"
  },
  {
    "id": "milk_whole",
    "name": "شیر کامل",
    "nameEn": "Whole Milk",
    "category": "لبنیات - شیر",
    "subcategory": "شیر",
    "unit": "لیوان",
    "baseAmount": 244,
    "calories": 146,
    "protein": 7.7,
    "carbs": 11,
    "fat": 8,
    "sodium": 98,
    "calcium": 276,
    "vitaminA": 112,
    "vitaminD": 98,
    "isVegan": false,
    "isGlutenFree": true,
    "allergens": [
      "لبنیات"
    ],
    "preparation": "پاستوریزه",
    "nutritionalHighlights": "کلسیم بالا\nویتامین D\nپروتئین",
    "servingSuggestions": "خام\nدر چای\nدر اسموتی"
  },
  {
    "id": "greek_yogurt_plain",
    "name": "ماست یونانی ساده",
    "nameEn": "Plain Greek Yogurt",
    "category": "لبنیات - ماست",
    "subcategory": "ماست",
    "unit": "گرم",
    "baseAmount": 100,
    "calories": 100,
    "protein": 10.2,
    "carbs": 3.7,
    "fat": 5,
    "sodium": 65,
    "calcium": 110,
    "potassium": 141,
    "isVegan": false,
    "isGlutenFree": true,
    "allergens": [
      "لبنیات"
    ],
    "preparation": "ساده",
    "nutritionalHighlights": "پروتئین بالا\nپروبیوتیک\nکلسیم بالا",
    "servingSuggestions": "با میوه\nبا گرانولا\nدر اسموتی"
  }
];

export function useFoods() {
  return useQuery({
    queryKey: ['foods'],
    queryFn: async () => {
      if (!supabase || !isSupabaseEnabled) {
        console.warn('Supabase not available, using fallback data');
        return fallbackFoods;
      }

      try {
        const { data, error } = await supabase
          .from('foods')
          .select('*')
          .order('name');

        if (error) {
          console.warn('Supabase error, using fallback data:', error.message);
          return fallbackFoods;
        }

        if (!data || data.length === 0) {
          console.warn('No foods data from Supabase, using fallback data');
          return fallbackFoods;
        }

        return data;
      } catch (err) {
        console.warn('useFoods error, using fallback data:', err.message);
        return fallbackFoods;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
}

// Fallback data when Supabase is not available
const fallbackSupplements = [
  {
    "id": "whey_protein",
    "name": "پروتئین وی",
    "nameEn": "Whey Protein",
    "category": "پروتئین",
    "subcategory": "پروتئین وی",
    "form": "پودر",
    "dosage": "۲۵ گرم",
    "unit": "گرم",
    "benefits": "رشد عضلات\nجذب سریع پروتئین\nبهبود ریکاوری\nحفاظت از عضلات",
    "timing": "بعد از تمرین\nبین وعده‌ها"
  },
  {
    "id": "creatine_monohydrate",
    "name": "کراتین مونوهیدرات",
    "nameEn": "Creatine Monohydrate",
    "category": "قدرت و عملکرد",
    "subcategory": "کراتین",
    "form": "پودر",
    "dosage": "۵ گرم",
    "unit": "گرم",
    "benefits": "افزایش قدرت عضلانی\nبهبود عملکرد HIIT\nافزایش حجم عضلات\nبهبود ریکاوری",
    "timing": "هر زمان از روز"
  },
  {
    "id": "beta_alanine",
    "name": "بتا آلانین",
    "nameEn": "Beta-Alanine",
    "category": "قبل تمرین",
    "subcategory": "استقامت",
    "form": "پودر",
    "dosage": "۳ گرم",
    "unit": "گرم",
    "benefits": "افزایش کارنوزین عضلانی\nبهبود تحمل تمرین شدید\nکاهش خستگی عضلانی\nافزایش قدرت",
    "timing": "۳۰ دقیقه قبل تمرین"
  },
  {
    "id": "vitamin_d3",
    "name": "ویتامین D3",
    "nameEn": "Vitamin D3",
    "category": "ویتامین",
    "subcategory": "ویتامین D",
    "form": "کپسول",
    "dosage": "۲۰۰۰ IU",
    "unit": "IU",
    "benefits": "استخوان‌های قوی\nپشتیبانی سیستم ایمنی\nبهبود خلق و خو\nافزایش قدرت عضلانی",
    "timing": "صبح با غذا"
  },
  {
    "id": "magnesium",
    "name": "منیزیم",
    "nameEn": "Magnesium",
    "category": "معدن",
    "subcategory": "منیزیم",
    "form": "کپسول",
    "dosage": "۴۰۰ میلی‌گرم",
    "unit": "میلی‌گرم",
    "benefits": "بهبود خواب\nکاهش استرس\nریلکسیشن عضلانی\nسلامت قلب",
    "timing": "شب قبل خواب"
  },
  {
    "id": "fish_oil",
    "name": "روغن ماهی",
    "nameEn": "Fish Oil",
    "category": "مفصل و ریکاوری",
    "subcategory": "امگا-۳",
    "form": "کپسول",
    "dosage": "۱۰۰۰ میلی‌گرم",
    "unit": "میلی‌گرم",
    "benefits": "کاهش التهاب\nسلامت مفاصل\nپشتیبانی قلب\nبهبود خلق و خو",
    "timing": "با غذا"
  }
];

export function useSupplements() {
  return useQuery({
    queryKey: ['supplements'],
    queryFn: async () => {
      if (!supabase || !isSupabaseEnabled) {
        console.warn('Supabase not available, using fallback data');
        return fallbackSupplements;
      }

      try {
        const { data, error } = await supabase
          .from('supplements')
          .select('*')
          .order('name');

        if (error) {
          console.warn('Supabase error, using fallback data:', error.message);
          return fallbackSupplements;
        }

        if (!data || data.length === 0) {
          console.warn('No supplements data from Supabase, using fallback data');
          return fallbackSupplements;
        }

        return data;
      } catch (err) {
        console.warn('useSupplements error, using fallback data:', err.message);
        return fallbackSupplements;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
}
