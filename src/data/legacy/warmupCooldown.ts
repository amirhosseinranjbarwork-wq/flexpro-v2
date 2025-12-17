export interface WarmupCooldownExercise {
  id: string;
  name: string;
  nameEn: string;
  type: 'warmup' | 'cooldown';
  category: 'cardio' | 'dynamic-stretch' | 'static-stretch' | 'activation' | 'relaxation' | 'foam-rolling';
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: {
    time?: number; // seconds or minutes
    unit: 'seconds' | 'minutes';
    reps?: number;
    sets?: number;
  };
  instructions: string[];
  benefits: string[];
  tips?: string[];
  precautions?: string[];
  targetMuscles?: string[];
  sequence?: number; // order in routine
  intensity: 'light' | 'moderate' | 'recovery';
}

export const warmupExercises: WarmupCooldownExercise[] = [
  // ===== LIGHT CARDIO =====
  {
    id: 'warmup_light_walk',
    name: 'راه رفتن سریع',
    nameEn: 'Brisk Walking',
    type: 'warmup',
    category: 'cardio',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      time: 5,
      unit: 'minutes'
    },
    instructions: [
      'با سرعت راحت راه بروید',
      'دست‌ها را ریتمیک حرکت دهید',
      'نفس منظم داشته باشید',
      'بدن را گرم کنید'
    ],
    benefits: [
      'افزایش دمای بدن',
      'بهبود گردش خون',
      'آماده‌سازی قلبی-عروقی',
      'کاهش ریسک آسیب'
    ],
    targetMuscles: ['Lower body', 'Core'],
    sequence: 1,
    intensity: 'light'
  },
  {
    id: 'warmup_jog_in_place',
    name: 'دویدن آهسته در جا',
    nameEn: 'Jogging in Place',
    type: 'warmup',
    category: 'cardio',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      time: 2,
      unit: 'minutes'
    },
    instructions: [
      'در جا بدوید',
      'زانوها را بالا بیاورید',
      'دست‌ها را شل نگه دارید',
      'نفس را کنترل کنید'
    ],
    benefits: [
      'افزایش ضربان قلب',
      'گرم کردن عضلات پا',
      'بهبود هماهنگی',
      'آماده‌سازی عصبی'
    ],
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Calves'],
    sequence: 2,
    intensity: 'moderate'
  },

  // ===== DYNAMIC STRETCHES =====
  {
    id: 'warmup_arm_circles',
    name: 'چرخش بازوها',
    nameEn: 'Arm Circles',
    type: 'warmup',
    category: 'dynamic-stretch',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      reps: 10,
      sets: 2
    },
    instructions: [
      'دست‌ها را به پهلو دراز کنید',
      'با دست‌ها دایره کوچک بکشید',
      'سپس دایره را بزرگ‌تر کنید',
      'جهت را عوض کنید'
    ],
    benefits: [
      'گرم کردن شانه‌ها',
      'بهبود تحرک مفاصل',
      'کاهش تنش عضلانی',
      'آماده‌سازی بالاتنه'
    ],
    targetMuscles: ['Shoulders', 'Upper back'],
    sequence: 3,
    intensity: 'light'
  },
  {
    id: 'warmup_leg_swings',
    name: 'کشش پویای همسترینگ',
    nameEn: 'Leg Swings',
    type: 'warmup',
    category: 'dynamic-stretch',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      reps: 10,
      sets: 2
    },
    instructions: [
      'از دیوار یا میله حمایت بگیرید',
      'یک پا را به سمت جلو تاب دهید',
      'دامنه حرکت را تدریجاً افزایش دهید',
      'پا را عوض کنید'
    ],
    benefits: [
      'گرم کردن همسترینگ',
      'بهبود تحرک لگن',
      'کاهش ریسک آسیب',
      'بهبود تعادل'
    ],
    targetMuscles: ['Hamstrings', 'Hip flexors'],
    sequence: 4,
    intensity: 'moderate'
  },
  {
    id: 'warmup_cat_cow',
    name: 'حرکت گربه-گاو',
    nameEn: 'Cat-Cow Stretch',
    type: 'warmup',
    category: 'dynamic-stretch',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      reps: 8,
      sets: 2
    },
    instructions: [
      'چهار دست و پا قرار بگیرید',
      'نفس عمیق بکشید (گاو)',
      'نفس را بیرون دهید و کمر را قوس دهید (گربه)',
      'حرکت را روان انجام دهید'
    ],
    benefits: [
      'گرم کردن ستون فقرات',
      'بهبود تحرک کمر',
      'کاهش تنش عضلانی',
      'بهبود گردش خون'
    ],
    targetMuscles: ['Back', 'Core', 'Shoulders'],
    sequence: 5,
    intensity: 'light'
  },

  // ===== ACTIVATION =====
  {
    id: 'warmup_high_knees',
    name: 'زانو بالا',
    nameEn: 'High Knees',
    type: 'warmup',
    category: 'activation',
    equipment: 'وزن بدن',
    difficulty: 'intermediate',
    duration: {
      time: 30,
      unit: 'seconds'
    },
    instructions: [
      'در جای خود بدوید',
      'زانوها را تا سطح کمر بالا بیاورید',
      'دست‌ها را ریتمیک حرکت دهید',
      'با سرعت بالا حرکت کنید'
    ],
    benefits: [
      'فعال‌سازی عضلات پا',
      'بهبود هماهنگی',
      'افزایش ضربان قلب',
      'آماده‌سازی عصبی'
    ],
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Core'],
    sequence: 6,
    intensity: 'moderate'
  },
  {
    id: 'warmup_bodyweight_squat',
    name: 'اسکات بدون وزنه',
    nameEn: 'Bodyweight Squat',
    type: 'warmup',
    category: 'activation',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      reps: 10,
      sets: 2
    },
    instructions: [
      'پاها را به عرض شانه باز کنید',
      'باسن را به عقب پایین بیاورید',
      'زانوها را ۹۰ درجه خم کنید',
      'سپس بالا بیایید'
    ],
    benefits: [
      'فعال‌سازی عضلات پا',
      'گرم کردن مفاصل',
      'بهبود تکنیک',
      'تقویت عضلات تثبیت‌کننده'
    ],
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    sequence: 7,
    intensity: 'moderate'
  }
];

export const cooldownExercises: WarmupCooldownExercise[] = [
  // ===== LIGHT CARDIO =====
  {
    id: 'cooldown_light_walk',
    name: 'راه رفتن آهسته',
    nameEn: 'Light Walking',
    type: 'cooldown',
    category: 'cardio',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      time: 5,
      unit: 'minutes'
    },
    instructions: [
      'با سرعت آرام راه بروید',
      'تنفس عمیق داشته باشید',
      'بدن را آرام کنید',
      'ضربان قلب را پایین بیاورید'
    ],
    benefits: [
      'کاهش ضربان قلب',
      'بهبود ریکاوری',
      'کاهش اسید لاکتیک',
      'ریلکسیشن'
    ],
    targetMuscles: ['Lower body'],
    sequence: 1,
    intensity: 'recovery'
  },

  // ===== STATIC STRETCHES =====
  {
    id: 'cooldown_chest_wall_stretch',
    name: 'کشش سینه با دیوار',
    nameEn: 'Chest Wall Stretch',
    type: 'cooldown',
    category: 'static-stretch',
    equipment: 'دیوار',
    difficulty: 'beginner',
    duration: {
      time: 30,
      unit: 'seconds'
    },
    instructions: [
      'به دیوار تکیه دهید',
      'یک دست را روی دیوار قرار دهید',
      'بدن را به سمت جلو متمایل کنید',
      'کشش را در سینه احساس کنید'
    ],
    benefits: [
      'کشش عضلات سینه',
      'بهبود وضعیت شانه‌ها',
      'کاهش تنش عضلانی',
      'بهبود تنفس'
    ],
    targetMuscles: ['Pectorals', 'Anterior deltoid'],
    sequence: 2,
    intensity: 'recovery'
  },
  {
    id: 'cooldown_quad_standing_stretch',
    name: 'کشش چهارسر ایستاده',
    nameEn: 'Standing Quad Stretch',
    type: 'cooldown',
    category: 'static-stretch',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      time: 30,
      unit: 'seconds'
    },
    instructions: [
      'یک پا را به سمت عقب خم کنید',
      'پاشنه را به سمت باسن بیاورید',
      'زانو را به سمت زمین بگیرید',
      'تعادل خود را حفظ کنید'
    ],
    benefits: [
      'کشش عضلات چهارسر',
      'بهبود انعطاف ران',
      'کاهش ریسک آسیب',
      'بهبود ریکاوری'
    ],
    targetMuscles: ['Quadriceps'],
    sequence: 3,
    intensity: 'recovery'
  },
  {
    id: 'cooldown_hamstring_standing_stretch',
    name: 'کشش همسترینگ ایستاده',
    nameEn: 'Standing Hamstring Stretch',
    type: 'cooldown',
    category: 'static-stretch',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      time: 30,
      unit: 'seconds'
    },
    instructions: [
      'یک پا را جلوی بدن دراز کنید',
      'بدن را از کمر به سمت جلو خم کنید',
      'دست‌ها را روی زمین بگذارید',
      'کشش را در پشت ران احساس کنید'
    ],
    benefits: [
      'کشش همسترینگ',
      'بهبود انعطاف',
      'کاهش تنش عضلانی',
      'بهبود گردش خون'
    ],
    targetMuscles: ['Hamstrings'],
    sequence: 4,
    intensity: 'recovery'
  },
  {
    id: 'cooldown_child_pose',
    name: 'حالت کودک',
    nameEn: 'Child\'s Pose',
    type: 'cooldown',
    category: 'static-stretch',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      time: 45,
      unit: 'seconds'
    },
    instructions: [
      'زنانو زده بنشینید',
      'باسن را روی پاشنه‌ها قرار دهید',
      'بدن را به سمت جلو دراز کنید',
      'پیشانی را روی زمین بگذارید',
      'تنفس عمیق داشته باشید'
    ],
    benefits: [
      'کشش کمر و باسن',
      'ریلکسیشن کامل',
      'کاهش استرس',
      'بهبود تمرکز'
    ],
    targetMuscles: ['Back', 'Glutes', 'Shoulders'],
    sequence: 5,
    intensity: 'recovery'
  },

  // ===== RELAXATION =====
  {
    id: 'cooldown_diaphragmatic_breathing',
    name: 'تنفس دیافراگمی',
    nameEn: 'Diaphragmatic Breathing',
    type: 'cooldown',
    category: 'relaxation',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      time: 2,
      unit: 'minutes'
    },
    instructions: [
      'دراز بکشید یا بنشینید',
      'یک دست را روی شکم قرار دهید',
      'نفس عمیق از بینی بکشید',
      'شکم را منبسط کنید نه سینه',
      'نفس را آرام بیرون دهید'
    ],
    benefits: [
      'کاهش استرس',
      'بهبود ریکاوری',
      'بهبود تمرکز',
      'تنظیم ضربان قلب'
    ],
    targetMuscles: ['Diaphragm', 'Core'],
    sequence: 6,
    intensity: 'recovery'
  },

  // ===== FOAM ROLLING =====
  {
    id: 'cooldown_foam_roll_quads',
    name: 'فوم رولر چهارسر',
    nameEn: 'Quad Foam Rolling',
    type: 'cooldown',
    category: 'foam-rolling',
    equipment: 'فوم رولر',
    difficulty: 'intermediate',
    duration: {
      time: 1,
      unit: 'minutes'
    },
    instructions: [
      'روی شکم دراز بکشید',
      'فوم رولر زیر ران قرار دهید',
      'بدن را به سمت جلو و عقب حرکت دهید',
      'نقاط حساس را نگه دارید'
    ],
    benefits: [
      'رها کردن گره‌های عضلانی',
      'بهبود گردش خون',
      'کاهش DOMS',
      'بهبود ریکاوری'
    ],
    targetMuscles: ['Quadriceps'],
    sequence: 7,
    intensity: 'recovery'
  },
  {
    id: 'cooldown_foam_roll_hamstrings',
    name: 'فوم رولر همسترینگ',
    nameEn: 'Hamstring Foam Rolling',
    type: 'cooldown',
    category: 'foam-rolling',
    equipment: 'فوم رولر',
    difficulty: 'intermediate',
    duration: {
      time: 1,
      unit: 'minutes'
    },
    instructions: [
      'نشسته یا دراز بکشید',
      'فوم رولر زیر پشت ران قرار دهید',
      'بدن را به سمت جلو و عقب حرکت دهید',
      'هر دو پا را انجام دهید'
    ],
    benefits: [
      'رها کردن همسترینگ',
      'بهبود انعطاف',
      'کاهش تنش عضلانی',
      'بهبود ریکاوری'
    ],
    targetMuscles: ['Hamstrings'],
    sequence: 8,
    intensity: 'recovery'
  }
];

export default { warmupExercises, cooldownExercises };

