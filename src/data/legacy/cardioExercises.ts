export interface CardioExercise {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  subcategory?: string;
  equipment: string;
  type: 'cardio' | 'interval' | 'steady-state' | 'functional';
  intensity: 'low' | 'moderate' | 'high' | 'maximum';
  duration?: {
    min: number;
    max: number;
    unit: 'minutes' | 'seconds';
  };
  caloriesPerHour: {
    min: number;
    max: number;
    weight: number; // kg
  };
  benefits: string[];
  instructions: string[];
  tips: string[];
  precautions?: string[];
  contraindications?: string[];
  modifications?: string[];
  targetHeartRate?: {
    min: number;
    max: number;
    age?: number;
  };
}

export const cardioExercises: CardioExercise[] = [
  // ===== TREADMILL =====
  {
    id: 'treadmill_walking',
    name: 'پیاده‌روی روی تردمیل',
    nameEn: 'Treadmill Walking',
    category: 'دستگاه‌های هوازی',
    subcategory: 'تردمیل',
    equipment: 'تردمیل',
    type: 'steady-state',
    intensity: 'low',
    duration: {
      min: 20,
      max: 60,
      unit: 'minutes'
    },
    caloriesPerHour: {
      min: 200,
      max: 300,
      weight: 70
    },
    benefits: [
      'بهبود استقامت قلبی',
      'کاهش استرس',
      'تقویت استخوان‌ها',
      'بهبود خواب'
    ],
    instructions: [
      'روی تردمیل قرار بگیرید',
      'سرعت مناسب انتخاب کنید (۳-۵ کیلومتر بر ساعت)',
      'دست‌ها را ریتمیک حرکت دهید',
      'نفس منظم بکشید'
    ],
    tips: [
      'از نگه داشتن دستگیره خودداری کنید',
      'به جلو نگاه کنید نه به پایین',
      'سرعت را تدریجاً افزایش دهید'
    ],
    targetHeartRate: {
      min: 50,
      max: 69
    }
  },
  {
    id: 'treadmill_jogging',
    name: 'دویدن آهسته روی تردمیل',
    nameEn: 'Treadmill Jogging',
    category: 'دستگاه‌های هوازی',
    subcategory: 'تردمیل',
    equipment: 'تردمیل',
    type: 'steady-state',
    intensity: 'moderate',
    duration: {
      min: 20,
      max: 45,
      unit: 'minutes'
    },
    caloriesPerHour: {
      min: 400,
      max: 600,
      weight: 70
    },
    benefits: [
      'سوزاندن کالری بالا',
      'بهبود استقامت',
      'تقویت سیستم قلبی-عروقی',
      'بهبود روحیه'
    ],
    instructions: [
      'سرعت ۶-۸ کیلومتر بر ساعت',
      'فرم بدنی صحیح حفظ کنید',
      'نفس منظم از طریق بینی و دهان',
      'زمان ریکاوری را رعایت کنید'
    ],
    tips: [
      'کمر را صاف نگه دارید',
      'پاها را نرم فرود بیاورید',
      'از موسیقی انگیزشی استفاده کنید'
    ],
    targetHeartRate: {
      min: 70,
      max: 79
    }
  },
  {
    id: 'treadmill_sprinting',
    name: 'دویدن سریع روی تردمیل',
    nameEn: 'Treadmill Sprinting',
    category: 'تمرینات اینتروال',
    subcategory: 'HIIT',
    equipment: 'تردمیل',
    type: 'interval',
    intensity: 'maximum',
    duration: {
      min: 10,
      max: 20,
      unit: 'minutes'
    },
    caloriesPerHour: {
      min: 800,
      max: 1000,
      weight: 70
    },
    benefits: [
      'سوزاندن چربی بالا',
      'بهبود قدرت بی هوازی',
      'افزایش متابولیسم',
      'بهبود استقامت'
    ],
    instructions: [
      '۲۰-۳۰ ثانیه دویدن تمام سرعت',
      '۱-۲ دقیقه ریکاوری با پیاده‌روی',
      '۸-۱۰ تکرار',
      '۵ دقیقه گرم کردن و سرد کردن'
    ],
    tips: [
      'سرعت حداکثر خود را حفظ کنید',
      'زمان ریکاوری را کامل استفاده کنید',
      'نفس عمیق بکشید'
    ],
    precautions: [
      'فقط برای افراد با شرایط بدنی خوب',
      'با پزشک مشورت کنید',
      'فرم صحیح را حفظ کنید'
    ],
    targetHeartRate: {
      min: 80,
      max: 100
    }
  },

  // ===== STATIONARY BIKE =====
  {
    id: 'bike_stationary',
    name: 'دوچرخه ثابت',
    nameEn: 'Stationary Bike',
    category: 'دستگاه‌های هوازی',
    subcategory: 'دوچرخه',
    equipment: 'دوچرخه ثابت',
    type: 'steady-state',
    intensity: 'moderate',
    duration: {
      min: 20,
      max: 60,
      unit: 'minutes'
    },
    caloriesPerHour: {
      min: 300,
      max: 500,
      weight: 70
    },
    benefits: [
      'کم تاثیر روی مفاصل',
      'تقویت عضلات پا',
      'بهبود استقامت',
      'کمک به کاهش وزن'
    ],
    instructions: [
      'روی دوچرخه بنشینید',
      'پاها را روی پدال‌ها قرار دهید',
      'مقاومت مناسب تنظیم کنید',
      'با ریتم منظم رکاب بزنید'
    ],
    tips: [
      'کمر را صاف نگه دارید',
      'تنفس منظم داشته باشید',
      'از برنامه‌های اینتروال استفاده کنید'
    ],
    modifications: [
      'برای مبتدیان: مقاومت کم، مدت کوتاه',
      'برای پیشرفته: اینتروال شدید'
    ],
    targetHeartRate: {
      min: 60,
      max: 75
    }
  },

  // ===== ELLIPTICAL =====
  {
    id: 'elliptical_cross_trainer',
    name: 'الپتیکال',
    nameEn: 'Elliptical Cross Trainer',
    category: 'دستگاه‌های هوازی',
    subcategory: 'الپتیکال',
    equipment: 'الپتیکال',
    type: 'steady-state',
    intensity: 'moderate',
    duration: {
      min: 20,
      max: 45,
      unit: 'minutes'
    },
    caloriesPerHour: {
      min: 400,
      max: 600,
      weight: 70
    },
    benefits: [
      'حرکت کامل بدن',
      'کمترین فشار روی مفاصل',
      'تقویت بالاتنه و پایین‌تنه',
      'بهبود تعادل'
    ],
    instructions: [
      'دستگیره‌ها را بگیرید',
      'با پاها و دست‌ها همزمان حرکت کنید',
      'مقاومت مناسب تنظیم کنید',
      'نفس منظم نگه دارید'
    ],
    tips: [
      'از دستگیره‌ها برای تعادل استفاده کنید',
      'سرعت را کنترل کنید',
      'حرکت طبیعی داشته باشید'
    ],
    targetHeartRate: {
      min: 65,
      max: 78
    }
  },

  // ===== ROWING MACHINE =====
  {
    id: 'rowing_machine',
    name: 'روئینگ',
    nameEn: 'Rowing Machine',
    category: 'دستگاه‌های هوازی',
    subcategory: 'روئینگ',
    equipment: 'روئینگ',
    type: 'steady-state',
    intensity: 'high',
    duration: {
      min: 15,
      max: 30,
      unit: 'minutes'
    },
    caloriesPerHour: {
      min: 500,
      max: 700,
      weight: 70
    },
    benefits: [
      'تمرین کامل بدن',
      'تقویت عضلات هسته',
      'بهبود استقامت',
      'سوزاندن کالری بالا'
    ],
    instructions: [
      'پاها را در جایگاه محکم کنید',
      'دستگیره را بگیرید',
      'بدن را به عقب کشیده، سپس هل دهید',
      'حرکت را کنترل شده انجام دهید'
    ],
    tips: [
      'کمر را صاف نگه دارید',
      'از عضلات هسته استفاده کنید',
      'نفس را با حرکت هماهنگ کنید'
    ],
    targetHeartRate: {
      min: 75,
      max: 85
    }
  },

  // ===== HIIT EXERCISES =====
  {
    id: 'hiit_treadmill',
    name: 'HIIT روی تردمیل',
    nameEn: 'HIIT on Treadmill',
    category: 'تمرینات اینتروال',
    subcategory: 'HIIT',
    equipment: 'تردمیل',
    type: 'interval',
    intensity: 'maximum',
    duration: {
      min: 15,
      max: 25,
      unit: 'minutes'
    },
    caloriesPerHour: {
      min: 700,
      max: 900,
      weight: 70
    },
    benefits: [
      'سوزاندن چربی بالا',
      'افزایش متابولیسم',
      'بهبود استقامت بی‌هوازی',
      'صرفه‌جویی در زمان'
    ],
    instructions: [
      '۲ دقیقه گرم کردن',
      '۳۰ ثانیه دویدن تمام سرعت',
      '۹۰ ثانیه پیاده‌روی ریکاوری',
      '۸-۱۰ تکرار',
      '۲ دقیقه سرد کردن'
    ],
    tips: [
      'سرعت حداکثر خود را حفظ کنید',
      'زمان ریکاوری را کامل استفاده کنید',
      'هیدراته بمانید'
    ],
    precautions: [
      'برای افراد سالم',
      'با پزشک مشورت کنید',
      'فرم صحیح را حفظ کنید'
    ],
    contraindications: [
      'مشکلات قلبی',
      'آسیب‌های مفصلی',
      'بارداری'
    ]
  },
  {
    id: 'tabata_protocol',
    name: 'Tabata',
    nameEn: 'Tabata Protocol',
    category: 'تمرینات اینتروال',
    subcategory: 'Tabata',
    equipment: 'وزن بدن یا دستگاه',
    type: 'interval',
    intensity: 'maximum',
    duration: {
      min: 4,
      max: 8,
      unit: 'minutes'
    },
    caloriesPerHour: {
      min: 600,
      max: 800,
      weight: 70
    },
    benefits: [
      'افزایش ظرفیت بی‌هوازی',
      'سوزاندن چربی',
      'بهبود استقامت',
      'افزایش VO2 Max'
    ],
    instructions: [
      '۲۰ ثانیه کار حداکثر',
      '۱۰ ثانیه ریکاوری',
      '۸ تکرار',
      '۴ دقیقه کل'
    ],
    tips: [
      'تمرکز روی شدت بالا',
      'زمان را دقیق رعایت کنید',
      'انتخاب حرکت مناسب برای سطح خود'
    ],
    targetHeartRate: {
      min: 85,
      max: 100
    }
  },

  // ===== FUNCTIONAL MOVEMENTS =====
  {
    id: 'burpee',
    name: 'برپی',
    nameEn: 'Burpee',
    category: 'تمرینات عملکردی',
    subcategory: 'حرکت کامل بدن',
    equipment: 'وزن بدن',
    type: 'functional',
    intensity: 'high',
    duration: {
      min: 30,
      max: 60,
      unit: 'seconds'
    },
    caloriesPerHour: {
      min: 500,
      max: 700,
      weight: 70
    },
    benefits: [
      'تمرین کامل بدن',
      'بهبود قدرت و استقامت',
      'سوزاندن کالری بالا',
      'بهبود هماهنگی'
    ],
    instructions: [
      'در وضعیت ایستاده شروع کنید',
      'به سمت پایین اسکوات کنید',
      'دست‌ها را روی زمین بگذارید',
      'پاها را به عقب پرتاب کنید',
      'یک حرکت push-up انجام دهید',
      'پاها را به سمت جلو جمع کنید',
      'وایستید و پرش کنید'
    ],
    tips: [
      'حرکت را روان انجام دهید',
      'نفس را کنترل کنید',
      'برای مبتدیان بدون پرش'
    ],
    modifications: [
      'بدون پرش برای مبتدیان',
      'با دمبل برای پیشرفته',
      'یک پا برای چالش بیشتر'
    ]
  },
  {
    id: 'mountain_climbers',
    name: 'کوهنوردی',
    nameEn: 'Mountain Climbers',
    category: 'تمرینات عملکردی',
    subcategory: 'هسته و کاردیو',
    equipment: 'وزن بدن',
    type: 'functional',
    intensity: 'high',
    duration: {
      min: 30,
      max: 60,
      unit: 'seconds'
    },
    caloriesPerHour: {
      min: 400,
      max: 600,
      weight: 70
    },
    benefits: [
      'تقویت عضلات هسته',
      'بهبود استقامت کاردیو',
      'تقویت عضلات شانه و بازو',
      'بهبود هماهنگی'
    ],
    instructions: [
      'در وضعیت پلانک قرار بگیرید',
      'یک زانو را به سمت سینه بیاورید',
      'سریع زانو را عوض کنید',
      'بدن را ثابت نگه دارید',
      'با سرعت بالا حرکت کنید'
    ],
    tips: [
      'باسن را بالا نیاورید',
      'کمر را قوس ندهید',
      'نفس منظم داشته باشید'
    ],
    modifications: [
      'آهسته برای مبتدیان',
      'با وزن برای پیشرفته'
    ]
  },
  {
    id: 'jump_rope',
    name: 'طناب زنی',
    nameEn: 'Jump Rope',
    category: 'تمرینات عملکردی',
    subcategory: 'کاردیو',
    equipment: 'طناب',
    type: 'functional',
    intensity: 'high',
    duration: {
      min: 5,
      max: 15,
      unit: 'minutes'
    },
    caloriesPerHour: {
      min: 600,
      max: 800,
      weight: 70
    },
    benefits: [
      'بهبود هماهنگی',
      'تقویت عضلات ساق و باسن',
      'سوزاندن کالری بالا',
      'بهبود چابکی'
    ],
    instructions: [
      'طناب را در دست بگیرید',
      'در وضعیت ایستاده قرار بگیرید',
      'طناب را از روی سر رد کنید',
      'با نوک پا زمین را لمس کنید',
      'با ریتم منظم ادامه دهید'
    ],
    tips: [
      'مچ دست‌ها را حرکت دهید نه بازو',
      'پاهای خود را نزدیک هم نگه دارید',
      'نفس منظم داشته باشید'
    ],
    modifications: [
      'آهسته برای مبتدیان',
      'دوجانبه برای پیشرفته',
      'با مانع برای چالش'
    ]
  },

  // ===== SWIMMING =====
  {
    id: 'swimming_freestyle',
    name: 'شنا کرال سینه',
    nameEn: 'Freestyle Swimming',
    category: 'شنا',
    subcategory: 'کرال سینه',
    equipment: 'استخر',
    type: 'steady-state',
    intensity: 'moderate',
    duration: {
      min: 20,
      max: 45,
      unit: 'minutes'
    },
    caloriesPerHour: {
      min: 400,
      max: 600,
      weight: 70
    },
    benefits: [
      'تمرین کامل بدن',
      'کمترین فشار روی مفاصل',
      'بهبود استقامت قلبی',
      'تقویت عضلات'
    ],
    instructions: [
      'در آب قرار بگیرید',
      'با یک دست به سمت جلو شنا کنید',
      'دست دیگر را همزمان بیرون بیاورید',
      'پاها را با ضرب قورباغه حرکت دهید',
      'نفس منظم بکشید'
    ],
    tips: [
      'سر را بالا نگه دارید',
      'حرکت دست‌ها را هماهنگ کنید',
      'ضربات پا را کنترل کنید'
    ],
    targetHeartRate: {
      min: 60,
      max: 75
    }
  },

  // ===== WALKING =====
  {
    id: 'brisk_walking',
    name: 'پیاده‌روی سریع',
    nameEn: 'Brisk Walking',
    category: 'دویدن و پیاده‌روی',
    subcategory: 'پیاده‌روی',
    equipment: 'وزن بدن',
    type: 'steady-state',
    intensity: 'low',
    duration: {
      min: 30,
      max: 60,
      unit: 'minutes'
    },
    caloriesPerHour: {
      min: 200,
      max: 300,
      weight: 70
    },
    benefits: [
      'بهبود سلامت قلب',
      'کاهش استرس',
      'تقویت استخوان‌ها',
      'بهبود خواب'
    ],
    instructions: [
      'با سرعت ۵-۶ کیلومتر بر ساعت راه بروید',
      'دست‌ها را ریتمیک حرکت دهید',
      'سر را بالا نگه دارید',
      'نفس عمیق بکشید'
    ],
    tips: [
      'کفش مناسب بپوشید',
      'از آب استفاده کنید',
      'با دوست یا موسیقی راه بروید'
    ],
    targetHeartRate: {
      min: 50,
      max: 65
    }
  },

  // ===== CYCLING =====
  {
    id: 'cycling_road',
    name: 'دوچرخه‌سواری جاده',
    nameEn: 'Road Cycling',
    category: 'دوچرخه‌سواری',
    subcategory: 'جاده',
    equipment: 'دوچرخه',
    type: 'steady-state',
    intensity: 'moderate',
    duration: {
      min: 30,
      max: 90,
      unit: 'minutes'
    },
    caloriesPerHour: {
      min: 400,
      max: 600,
      weight: 70
    },
    benefits: [
      'تقویت عضلات پا',
      'بهبود استقامت قلبی',
      'کمترین فشار روی زانوها',
      'بهبود تعادل'
    ],
    instructions: [
      'کلاه ایمنی بزنید',
      'تنظیمات دوچرخه را چک کنید',
      'با سرعت مناسب رکاب بزنید',
      'از مسیر مناسب استفاده کنید'
    ],
    tips: [
      'هیدراته بمانید',
      'از کرم ضد آفتاب استفاده کنید',
      'چشم‌ها را از باد محافظت کنید'
    ],
    precautions: [
      'ایمنی جاده را رعایت کنید',
      'با دید کافی رکاب بزنید',
      'در مسیرهای شلوغ احتیاط کنید'
    ]
  }
];

export default cardioExercises;

