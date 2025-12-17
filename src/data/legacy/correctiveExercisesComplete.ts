export interface CorrectiveExercise {
  id: string;
  name: string;
  nameEn: string;
  condition: string;
  phase: 'inhibit' | 'lengthen' | 'activate' | 'integrate';
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: {
    sets: number;
    reps?: number;
    holdTime?: number; // seconds
    side?: 'each' | 'both';
  };
  instructions: string[];
  benefits: string[];
  precautions?: string[];
  modifications?: string[];
  progression?: string[];
  frequency: string;
  painScale?: 1 | 2 | 3 | 4 | 5; // 1=no pain, 5=severe pain
}

export const correctiveExercises: CorrectiveExercise[] = [
  // ===== KYPHOSIS & FORWARD HEAD =====
  {
    id: 'kyphosis_doorway_chest_stretch',
    name: 'کشش سینه در چارچوب در',
    nameEn: 'Doorway Chest Stretch',
    condition: 'کایفوز و سر به جلو',
    phase: 'lengthen',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      sets: 3,
      holdTime: 30,
      side: 'both'
    },
    instructions: [
      'در چارچوب در بایستید',
      'یک دست را روی دیوار قرار دهید',
      'بدن را به سمت جلو متمایل کنید',
      'تا کشش در سینه احساس شود نگه دارید'
    ],
    benefits: [
      'باز کردن عضلات سینه',
      'بهبود وضعیت شانه‌ها',
      'کاهش قوس بیش از حد کمر',
      'بهبود تنفس'
    ],
    precautions: [
      'اگر درد شدید داشت متوقف شوید',
      'نفس عمیق بکشید',
      'شانه‌ها را پایین نگه دارید'
    ],
    modifications: [
      'برای مبتدیان: زاویه کمتر',
      'برای پیشرفته: دست بالاتر'
    ],
    progression: [
      'افزایش زمان نگه داشتن',
      'اضافه کردن حرکت پویا',
      'استفاده از کش مقاومتی'
    ],
    frequency: 'روزانه ۲-۳ بار'
  },
  {
    id: 'kyphosis_wall_angel',
    name: 'وال انجل',
    nameEn: 'Wall Angel',
    condition: 'کایفوز و سر به جلو',
    phase: 'integrate',
    equipment: 'دیوار',
    difficulty: 'intermediate',
    duration: {
      sets: 3,
      reps: 10,
      side: 'both'
    },
    instructions: [
      'به دیوار تکیه دهید',
      'آرنج‌ها را ۹۰ درجه خم کنید',
      'دست‌ها را به سمت بالا ببرید',
      'سپس پایین بیاورید',
      'تماس با دیوار را حفظ کنید'
    ],
    benefits: [
      'تقویت عضلات پشت شانه',
      'بهبود حرکت شانه‌ها',
      'اصلاح وضعیت بدنی',
      'تقویت عضلات تثبیت‌کننده'
    ],
    precautions: [
      'اگر درد در شانه داشت متوقف شوید',
      'حرکت را کنترل شده انجام دهید',
      'نفس را نگه ندارید'
    ],
    modifications: [
      'بدون دیوار برای مبتدیان',
      'با توپ کوچک برای پیشرفته'
    ],
    frequency: '۳-۴ بار در هفته'
  },
  {
    id: 'kyphosis_foam_roll_thoracic',
    name: 'فوم رول سینه‌ای',
    nameEn: 'Thoracic Foam Rolling',
    condition: 'کایفوز و سر به جلو',
    phase: 'inhibit',
    equipment: 'فوم رولر',
    difficulty: 'intermediate',
    duration: {
      sets: 2,
      holdTime: 20,
      side: 'each'
    },
    instructions: [
      'روی فوم رولر دراز بکشید',
      'قفسه سینه روی رولر قرار گیرد',
      'دست‌ها را زیر سر قرار دهید',
      'بدن را به سمت عقب و جلو حرکت دهید',
      'نقاط حساس را نگه دارید'
    ],
    benefits: [
      'رها کردن عضلات سینه',
      'بهبود تحرک قفسه سینه',
      'کاهش تنش عضلانی',
      'بهبود گردش خون'
    ],
    precautions: [
      'اگر درد شدید داشت متوقف شوید',
      'روی استخوان‌ها رول نکنید',
      'نفس عمیق بکشید'
    ],
    modifications: [
      'روی زمین برای مبتدیان',
      'با بالش زیر کمر'
    ],
    frequency: '۳-۴ بار در هفته'
  },

  // ===== LORDOSIS =====
  {
    id: 'lordosis_hip_flexor_stretch',
    name: 'کشش خم‌کننده‌های ران',
    nameEn: 'Hip Flexor Stretch',
    condition: 'لوردوز و گودی کمر',
    phase: 'lengthen',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      sets: 3,
      holdTime: 30,
      side: 'each'
    },
    instructions: [
      'یک زانو را روی زمین قرار دهید',
      'زانوی دیگر را ۹۰ درجه خم کنید',
      'باسن را به سمت جلو هل دهید',
      'کشش در جلوی ران را احساس کنید'
    ],
    benefits: [
      'کاهش تنش خم‌کننده‌های ران',
      'بهبود وضعیت لگن',
      'کاهش قوس کمر',
      'بهبود تعادل عضلانی'
    ],
    precautions: [
      'اگر درد در زانو داشت متوقف شوید',
      'باسن را محکم نگه دارید',
      'تنفس منظم داشته باشید'
    ],
    modifications: [
      'روی نیمکت برای مبتدیان',
      'با کش برای پیشرفته'
    ],
    frequency: 'روزانه ۲ بار'
  },
  {
    id: 'lordosis_dead_bug',
    name: 'ددباگ',
    nameEn: 'Dead Bug',
    condition: 'لوردوز و گودی کمر',
    phase: 'activate',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      sets: 3,
      reps: 10,
      side: 'each'
    },
    instructions: [
      'روی زمین دراز بکشید',
      'زانوها را ۹۰ درجه خم کنید',
      'یک دست را بالای سر ببرید',
      'زانوی مخالف را صاف کنید',
      'مرکز بدن را ثابت نگه دارید'
    ],
    benefits: [
      'تقویت عضلات هسته',
      'بهبود کنترل موتور',
      'بهبود هماهنگی',
      'کاهش فشار روی کمر'
    ],
    precautions: [
      'کمر را به زمین چسبیده نگه دارید',
      'حرکت را آهسته انجام دهید',
      'اگر کمر درد گرفت متوقف شوید'
    ],
    modifications: [
      'بدون حرکت دست برای مبتدیان',
      'با وزن برای پیشرفته'
    ],
    frequency: '۴-۵ بار در هفته'
  },

  // ===== KNEE VALGUS =====
  {
    id: 'knee_valgus_clamshell',
    name: 'کلامشل',
    nameEn: 'Clamshell',
    condition: 'زانوی پرانتزی',
    phase: 'activate',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      sets: 3,
      reps: 15,
      side: 'each'
    },
    instructions: [
      'روی پهلو دراز بکشید',
      'زانوها را ۹۰ درجه خم کنید',
      'پاها را روی هم نگه دارید',
      'زانوی بالایی را به سمت بالا باز کنید',
      'سپس بسته کنید'
    ],
    benefits: [
      'تقویت عضلات دورکننده ران',
      'بهبود پایداری زانو',
      'تصحیح alignment ران',
      'تقویت عضلات باسن'
    ],
    precautions: [
      'پایین‌تنه را حرکت ندهید',
      'حرکت فقط از لگن باشد',
      'اگر درد در زانو داشت متوقف شوید'
    ],
    modifications: [
      'با کش مقاومتی',
      'با وزن برای پیشرفته'
    ],
    progression: [
      'افزایش تعداد تکرار',
      'اضافه کردن وزن',
      'با کش'
    ],
    frequency: '۴-۵ بار در هفته'
  },

  // ===== FLAT FEET =====
  {
    id: 'flat_feet_short_foot',
    name: 'شورت فوت',
    nameEn: 'Short Foot Exercise',
    condition: 'پای صاف',
    phase: 'activate',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      sets: 3,
      reps: 10,
      holdTime: 5,
      side: 'each'
    },
    instructions: [
      'روی زمین بنشینید یا بایستید',
      'انگشتان پا را روی زمین نگه دارید',
      'قوس کف پا را بالا بیاورید',
      'پاشنه را روی زمین نگه دارید',
      'زمان را نگه دارید'
    ],
    benefits: [
      'تقویت عضلات کف پا',
      'بهبود قوس کف پا',
      'بهبود پایداری مچ پا',
      'کاهش فشار روی زانو'
    ],
    precautions: [
      'اگر درد شدید داشت متوقف شوید',
      'حرکت را کنترل شده انجام دهید',
      'نفس منظم داشته باشید'
    ],
    modifications: [
      'نشسته برای مبتدیان',
      'ایستاده برای پیشرفته'
    ],
    frequency: 'روزانه ۲-۳ بار'
  },

  // ===== LOWER BACK PAIN =====
  {
    id: 'lower_back_cat_cow',
    name: 'گربه-گاو',
    nameEn: 'Cat-Cow Stretch',
    condition: 'درد پایین کمر',
    phase: 'lengthen',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      sets: 3,
      reps: 10,
      side: 'both'
    },
    instructions: [
      'چهار دست و پا قرار بگیرید',
      'در حالت گربه: کمر را قوس دهید و چانه را به سینه بیاورید',
      'در حالت گاو: کمر را صاف کنید و به سمت بالا نگاه کنید',
      'بین دو حالت حرکت کنید'
    ],
    benefits: [
      'بهبود تحرک ستون فقرات',
      'کاهش تنش عضلات کمر',
      'بهبود گردش خون',
      'تقویت عضلات تثبیت‌کننده'
    ],
    precautions: [
      'حرکت را آهسته انجام دهید',
      'اگر درد شدید داشت متوقف شوید',
      'تنفس را با حرکت هماهنگ کنید'
    ],
    modifications: [
      'آهسته‌تر برای مبتدیان',
      'با تمرکز روی تنفس'
    ],
    frequency: 'روزانه ۲-۳ بار'
  },
  {
    id: 'lower_back_child_pose',
    name: 'حالت کودک',
    nameEn: 'Child\'s Pose',
    condition: 'درد پایین کمر',
    phase: 'lengthen',
    equipment: 'وزن بدن',
    difficulty: 'beginner',
    duration: {
      sets: 3,
      holdTime: 30,
      side: 'both'
    },
    instructions: [
      'زنانو زده بنشینید',
      'باسن را روی پاشنه‌ها قرار دهید',
      'بدن را به سمت جلو خم کنید',
      'پیشانی را روی زمین بگذارید',
      'دست‌ها را جلوی بدن دراز کنید'
    ],
    benefits: [
      'کشش عضلات کمر و باسن',
      'کاهش استرس',
      'بهبود انعطاف',
      'ریلکسیشن عضلات'
    ],
    precautions: [
      'اگر زانو درد داشت متوقف شوید',
      'فشار را روی کمر وارد نکنید',
      'تنفس عمیق داشته باشید'
    ],
    modifications: [
      'با بالش زیر باسن',
      'با دست‌ها در کنار بدن'
    ],
    frequency: 'روزانه'
  }
];

export default correctiveExercises;