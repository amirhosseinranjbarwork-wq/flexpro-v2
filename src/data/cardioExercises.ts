/**
 * Cardio Exercises Database
 * Converted from data for develop/data/cardioExercises.js
 * Professional parameters for cardio training
 */

import { Exercise } from './exercises';

// Cardio exercises data structure
const cardioExercisesData: Record<string, string[]> = {
  "دستگاه‌های هوازی": [
    "تردمیل (Treadmill)",
    "تردمیل با شیب (Incline Treadmill)",
    "تردمیل بدون شیب (Flat Treadmill)",
    "دوچرخه ثابت (Stationary Bike)",
    "دوچرخه ثابت نشسته (Seated Bike)",
    "دوچرخه ثابت ایستاده (Upright Bike)",
    "دوچرخه اسپینینگ (Spinning Bike)",
    "الپتیکال (Elliptical)",
    "الپتیکال با دسته (Elliptical with Arms)",
    "الپتیکال بدون دسته (Elliptical without Arms)",
    "روئینگ (Rowing Machine)",
    "روئینگ با مقاومت کم",
    "روئینگ با مقاومت متوسط",
    "روئینگ با مقاومت بالا",
    "استپر (Stepper)",
    "استپر با مقاومت کم",
    "استپر با مقاومت متوسط",
    "استپر با مقاومت بالا",
    "اسکی فضایی (SkiErg)",
    "اسکی فضایی با مقاومت کم",
    "اسکی فضایی با مقاومت متوسط",
    "اسکی فضایی با مقاومت بالا",
    "آیروبیک (Aerobic Machine)",
    "آیروبیک با مقاومت کم",
    "آیروبیک با مقاومت متوسط",
    "آیروبیک با مقاومت بالا"
  ],
  "تمرینات اینتروال": [
    "HIIT (تمرین اینتروال با شدت بالا)",
    "HIIT روی تردمیل",
    "HIIT روی دوچرخه",
    "HIIT روی الپتیکال",
    "HIIT روی روئینگ",
    "HIIT با وزن بدن",
    "Tabata",
    "Tabata روی تردمیل",
    "Tabata روی دوچرخه",
    "Tabata روی الپتیکال",
    "Tabata با وزن بدن",
    "AMRAP (As Many Rounds As Possible)",
    "AMRAP با وزن بدن",
    "AMRAP با دمبل",
    "AMRAP با کتل‌بل",
    "EMOM (Every Minute On the Minute)",
    "EMOM با وزن بدن",
    "EMOM با دمبل",
    "EMOM با کتل‌بل"
  ],
  "دویدن و پیاده‌روی": [
    "دویدن آهسته (Jogging)",
    "دویدن متوسط (Running)",
    "دویدن سریع (Sprinting)",
    "دویدن اینتروال",
    "دویدن استقامتی",
    "دویدن سرعتی",
    "دویدن تپه‌نوردی",
    "دویدن در ساحل",
    "دویدن در پارک",
    "دویدن در خیابان",
    "پیاده‌روی",
    "پیاده‌روی سریع",
    "پیاده‌روی آهسته",
    "پیاده‌روی با شیب",
    "پیاده‌روی در تپه",
    "پیاده‌روی در ساحل",
    "پیاده‌روی در پارک",
    "پیاده‌روی در خیابان"
  ],
  "دوچرخه‌سواری": [
    "دوچرخه‌سواری در جاده",
    "دوچرخه‌سواری در کوهستان",
    "دوچرخه‌سواری در شهر",
    "دوچرخه‌سواری با سرعت بالا",
    "دوچرخه‌سواری با سرعت متوسط",
    "دوچرخه‌سواری با سرعت کم",
    "دوچرخه‌سواری اینتروال",
    "دوچرخه‌سواری استقامتی",
    "دوچرخه‌سواری سرعتی",
    "دوچرخه‌سواری تپه‌نوردی"
  ],
  "شنا": [
    "شنا کرال سینه",
    "شنا کرال پشت",
    "شنا پروانه",
    "شنا قورباغه",
    "شنا ترکیبی",
    "شنا با کمک",
    "شنا بدون کمک",
    "شنا استقامتی",
    "شنا سرعتی",
    "شنا اینتروال"
  ],
  "تمرینات عملکردی": [
    "برپی (Burpee)",
    "برپی با پرش",
    "برپی بدون پرش",
    "برپی با دمبل",
    "برپی با کتل‌بل",
    "جکینگ (Jumping Jacks)",
    "جکینگ با وزن",
    "جکینگ بدون وزن",
    "کوهنوردی (Mountain Climbers)",
    "کوهنوردی آهسته",
    "کوهنوردی سریع",
    "کوهنوردی با وزن",
    "کوهنوردی بدون وزن",
    "پرش روی جعبه (Box Jumps)",
    "پرش روی جعبه با ارتفاع کم",
    "پرش روی جعبه با ارتفاع متوسط",
    "پرش روی جعبه با ارتفاع بالا",
    "پرش روی جعبه با وزن",
    "پرش روی جعبه بدون وزن",
    "طناب زنی",
    "طناب زنی آهسته",
    "طناب زنی سریع",
    "طناب زنی اینتروال",
    "طناب زنی با وزن",
    "طناب زنی بدون وزن"
  ]
};

// Convert to Exercise array with professional parameters
export const cardioExercises: Exercise[] = [];

Object.entries(cardioExercisesData).forEach(([category, exercises]) => {
  exercises.forEach((exerciseName, index) => {
    const id = `cardio_${category.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '')}_${index}`;
    
    // Determine difficulty and calories based on exercise type
    let difficulty: Exercise['difficulty'] = 'beginner';
    let caloriesPerHour = 400;
    let equipment = 'وزن بدن';
    
    if (exerciseName.includes('HIIT') || exerciseName.includes('Tabata') || exerciseName.includes('سریع') || exerciseName.includes('Sprinting')) {
      difficulty = 'advanced';
      caloriesPerHour = 800;
    } else if (exerciseName.includes('متوسط') || exerciseName.includes('اینتروال') || exerciseName.includes('AMRAP') || exerciseName.includes('EMOM')) {
      difficulty = 'intermediate';
      caloriesPerHour = 600;
    }
    
    if (exerciseName.includes('تردمیل') || exerciseName.includes('دوچرخه') || exerciseName.includes('الپتیکال') || exerciseName.includes('روئینگ') || exerciseName.includes('استپر') || exerciseName.includes('اسکی') || exerciseName.includes('آیروبیک')) {
      equipment = 'دستگاه';
    } else if (exerciseName.includes('دمبل') || exerciseName.includes('کتل‌بل')) {
      equipment = exerciseName.includes('دمبل') ? 'دمبل' : 'کتل‌بل';
    } else if (exerciseName.includes('طناب')) {
      equipment = 'طناب';
    } else if (exerciseName.includes('جعبه') || exerciseName.includes('Box')) {
      equipment = 'جعبه';
    }
    
    // Determine heart rate zone
    let heartRateZone = 2; // Zone 2 by default
    if (exerciseName.includes('HIIT') || exerciseName.includes('Tabata') || exerciseName.includes('سریع')) {
      heartRateZone = 5; // Zone 5
    } else if (exerciseName.includes('اینتروال') || exerciseName.includes('AMRAP') || exerciseName.includes('EMOM')) {
      heartRateZone = 4; // Zone 4
    } else if (exerciseName.includes('آهسته') || exerciseName.includes('پیاده‌روی')) {
      heartRateZone = 1; // Zone 1
    }
    
    cardioExercises.push({
      id,
      name: exerciseName,
      nameEn: exerciseName,
      muscleGroup: 'قلبی',
      subMuscleGroup: category,
      equipment,
      type: 'cardio',
      mechanics: exerciseName.includes('HIIT') || exerciseName.includes('Tabata') || exerciseName.includes('اینتروال') ? 'aerobic' : 'aerobic',
      difficulty,
      description: `تمرین کاردیو ${category.includes('اینتروال') ? 'اینتروال' : category.includes('دستگاه') ? 'با دستگاه' : 'بدون دستگاه'} برای بهبود استقامت قلبی و سوزاندن کالری`,
      instructions: exerciseName.includes('HIIT') || exerciseName.includes('Tabata') ? [
        'گرم کردن ۵ دقیقه',
        'تمرین با شدت بالا ۲۰-۳۰ ثانیه',
        'استراحت فعال ۱۰-۲۰ ثانیه',
        'تکرار ۸-۱۰ دور',
        'سرد کردن ۵ دقیقه'
      ] : exerciseName.includes('دویدن') || exerciseName.includes('پیاده‌روی') ? [
        'گرم کردن ۵ دقیقه',
        'شروع با سرعت آهسته',
        'افزایش تدریجی سرعت',
        'حفظ ریتم منظم',
        'سرد کردن ۵ دقیقه'
      ] : [
        'گرم کردن ۵ دقیقه',
        'شروع با مقاومت/سرعت کم',
        'افزایش تدریجی',
        'حفظ ریتم منظم',
        'سرد کردن ۵ دقیقه'
      ],
      tips: [
        'نفس را منظم نگه دارید',
        'به سیگنال‌های بدن توجه کنید',
        'از گرم کردن قبل شروع استفاده کنید',
        exerciseName.includes('HIIT') || exerciseName.includes('Tabata') ? 'بین ست‌ها استراحت کافی داشته باشید' : 'زمان و شدت را کنترل کنید'
      ],
      commonMistakes: [
        'شروع با شدت بیش از حد',
        'نادیده گرفتن گرم کردن',
        'عدم رعایت فرم صحیح',
        exerciseName.includes('دستگاه') ? 'چسبیدن به دستگیره‌ها' : 'عدم حفظ ریتم'
      ],
      variations: [],
      primaryMuscles: [],
      secondaryMuscles: exerciseName.includes('دستگاه') ? [] : ['Quadriceps', 'Hamstrings', 'Gluteus Maximus', 'Calves'],
      caloriesPerHour,
      // Professional cardio parameters
      preparationTime: 5,
      executionTime: exerciseName.includes('HIIT') || exerciseName.includes('Tabata') ? 20 : exerciseName.includes('اینتروال') ? 30 : 45
    });
  });
});

export default cardioExercises;

