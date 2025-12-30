/**
 * Warmup and Cooldown Exercises Database
 * Converted from data for develop/data/warmupCooldown.js
 */

import { Exercise } from './exercises';

// Warmup exercises
export const warmupExercisesData = [
  // هوازی سبک
  "راه رفتن سریع (5 دقیقه)",
  "دویدن آهسته در جا",
  "دوچرخه ثابت سبک (5 دقیقه)",
  "الپتیکال سبک (5 دقیقه)",
  "طناب زنی سبک",
  "پله بالا رفتن آهسته",
  
  // کشش پویا - بالاتنه
  "چرخش بازوها (Arm Circles)",
  "چرخش شانه‌ها (Shoulder Circles)",
  "کشش پویای سینه (Dynamic Chest Stretch)",
  "کشش پویای پشت (Cat-Cow)",
  "چرخش گردن آهسته",
  "چرخش مچ دست",
  "شنا سوئدی دیواری",
  "پرش دست‌ها بالا (Arm Swings)",
  
  // کشش پویا - پایین‌تنه
  "لانگ پویا (Walking Lunges)",
  "اسکات بدون وزنه (Bodyweight Squat)",
  "کشش پویای همسترینگ (Leg Swings)",
  "High Knees (زانو بالا)",
  "Butt Kicks (پاشنه به باسن)",
  "چرخش لگن (Hip Circles)",
  "چرخش مچ پا",
  "Side Shuffle (حرکت جانبی)",
  
  // حرکات ترکیبی
  "Jumping Jacks",
  "Inchworm (کرم اینچ)",
  "World's Greatest Stretch",
  "Frankenstein Walk",
  "A-Skip",
  "B-Skip",
  "Carioca (حرکت پیچشی)",
  
  // آماده‌سازی عصبی-عضلانی
  "پرش‌های کوتاه در جا",
  "تمرین واکنش سریع",
  "حرکات هماهنگی دست و پا",
  "تمرین تعادل یک پا",
  
  // گرم کردن اختصاصی
  "گرم کردن اختصاصی سینه (ست سبک)",
  "گرم کردن اختصاصی پشت (ست سبک)",
  "گرم کردن اختصاصی پا (ست سبک)",
  "گرم کردن اختصاصی شانه (ست سبک)",
  "گرم کردن با کش مقاومتی",
  "گرم کردن با وزنه سبک"
];

// Cooldown exercises
export const cooldownExercisesData = [
  // هوازی سبک
  "راه رفتن آهسته (5 دقیقه)",
  "دوچرخه ثابت سبک (5 دقیقه)",
  "الپتیکال آرام",
  
  // کشش ایستا - بالاتنه
  "کشش سینه با دیوار (30 ثانیه)",
  "کشش پشت بازو (Triceps Stretch)",
  "کشش جلو بازو (Biceps Stretch)",
  "کشش شانه کراس بادی (Cross-Body Stretch)",
  "کشش گردن جانبی",
  "کشش گردن رو به جلو",
  "کشش زیربغل (Lat Stretch)",
  "کشش تراپز و کول",
  "Child's Pose (حالت کودک)",
  "Thread the Needle",
  
  // کشش ایستا - پایین‌تنه
  "کشش چهارسر ایستاده (Quad Stretch)",
  "کشش همسترینگ ایستاده",
  "کشش همسترینگ نشسته",
  "Pigeon Pose (کشش باسن)",
  "Figure Four Stretch",
  "کشش ساق پا با دیوار",
  "کشش نزدیک‌کننده ران (Butterfly)",
  "کشش IT Band",
  "کشش فلکسور ران (Hip Flexor Stretch)",
  "90/90 Stretch",
  "Frog Stretch",
  
  // کشش کمر
  "کشش کمر خوابیده (Knee to Chest)",
  "چرخش ستون فقرات خوابیده (Supine Twist)",
  "Cat-Cow آهسته",
  "Cobra Stretch",
  "کشش کودک (Child's Pose)",
  "Scorpion Stretch",
  
  // ریلکسیشن
  "تنفس دیافراگمی (2 دقیقه)",
  "مدیتیشن کوتاه (3 دقیقه)",
  "Savasana (استراحت کامل)",
  
  // فوم رولر
  "فوم رولر چهارسر",
  "فوم رولر همسترینگ",
  "فوم رولر IT Band",
  "فوم رولر پشت",
  "فوم رولر ساق پا",
  "فوم رولر باسن",
  
  // با توپ تنیس/لاکراس
  "رهاسازی نقطه‌ای کف پا",
  "رهاسازی نقطه‌ای باسن",
  "رهاسازی نقطه‌ای شانه"
];

// Convert warmup exercises to Exercise array
export const warmupExercises: Exercise[] = warmupExercisesData.map((exerciseName, index) => {
  const id = `warmup_${index}`;
  return {
    id,
    name: exerciseName,
    nameEn: exerciseName,
    muscleGroup: 'گرم کردن',
    equipment: exerciseName.includes('دوچرخه') || exerciseName.includes('الپتیکال') ? 'دستگاه' : 
               exerciseName.includes('کش') ? 'کش' : 
               exerciseName.includes('وزنه') ? 'وزنه' : 
               'وزن بدن',
    type: 'warmup',
    mechanics: 'dynamic-stretch',
    difficulty: 'beginner',
    description: 'تمرین گرم کردن برای آماده‌سازی بدن قبل از تمرین',
    instructions: [
      'با حرکات آهسته شروع کنید',
      'دامنه حرکت را به تدریج افزایش دهید',
      'هر حرکت را ۸-۱۰ بار تکرار کنید',
      'نفس را منظم نگه دارید'
    ],
    tips: [
      'هرگز به سمت درد نروید',
      'حرکات را کنترل شده انجام دهید',
      'زمان کافی برای گرم کردن اختصاص دهید'
    ],
    commonMistakes: [
      'حرکات سریع و ناگهانی',
      'کشش بیش از حد',
      'نادیده گرفتن سیگنال‌های بدن'
    ],
    variations: [],
    primaryMuscles: [],
    secondaryMuscles: [],
    preparationTime: exerciseName.includes('5 دقیقه') ? 5 : 10
  };
});

// Convert cooldown exercises to Exercise array
export const cooldownExercises: Exercise[] = cooldownExercisesData.map((exerciseName, index) => {
  const id = `cooldown_${index}`;
  return {
    id,
    name: exerciseName,
    nameEn: exerciseName,
    muscleGroup: 'سرد کردن',
    equipment: exerciseName.includes('دوچرخه') || exerciseName.includes('الپتیکال') ? 'دستگاه' : 
               exerciseName.includes('فوم رولر') ? 'فوم رولر' : 
               exerciseName.includes('توپ') ? 'توپ' : 
               'وزن بدن',
    type: 'cooldown',
    mechanics: 'static-stretch',
    difficulty: 'beginner',
    description: 'تمرین سرد کردن برای بهبود انعطاف و ریکاوری بعد از تمرین',
    instructions: [
      exerciseName.includes('30 ثانیه') ? 'هر کشش را ۳۰ ثانیه نگه دارید' : 
      exerciseName.includes('2 دقیقه') ? '۲ دقیقه انجام دهید' : 
      exerciseName.includes('3 دقیقه') ? '۳ دقیقه انجام دهید' : 
      'هر کشش را ۲۰-۳۰ ثانیه نگه دارید',
      'نفس عمیق بکشید',
      'به سمت راحتی حرکت کنید نه درد',
      'هر طرف را به صورت جداگانه انجام دهید'
    ],
    tips: [
      'هرگز حرکات ناگهانی انجام ندهید',
      'نفس را منظم نگه دارید',
      'از کشش‌های فعال استفاده کنید'
    ],
    commonMistakes: [
      'پرش یا حرکات پویا',
      'نگه داشتن نفس',
      'کشش تا نقطه درد'
    ],
    variations: [],
    primaryMuscles: [],
    secondaryMuscles: [],
    executionTime: exerciseName.includes('30 ثانیه') ? 30 : 
                   exerciseName.includes('2 دقیقه') ? 120 : 
                   exerciseName.includes('3 دقیقه') ? 180 : 
                   30
  };
});

export default { warmupExercises, cooldownExercises };

