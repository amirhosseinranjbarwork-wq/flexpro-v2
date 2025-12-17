export interface Exercise {
  id: string;
  name: string;
  nameEn: string;
  muscleGroup: string;
  subMuscleGroup?: string;
  equipment: string;
  type: 'resistance' | 'cardio' | 'corrective' | 'warmup' | 'cooldown';
  mechanics: 'compound' | 'isolation' | 'aerobic' | 'corrective' | 'dynamic-stretch' | 'static-stretch' | 'isometric';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  instructions: string[];
  tips: string[];
  commonMistakes: string[];
  variations: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  contraindications?: string[];
  preparationTime?: number; // minutes
  executionTime?: number; // seconds
  restTime?: number; // seconds
  caloriesPerHour?: number;
}

export const exercises: Exercise[] = [
  // ===== CHEST EXERCISES =====
  {
    id: 'chest_bench_press_barbell',
    name: 'پرس سینه هالتر خوابیده',
    nameEn: 'Barbell Bench Press',
    muscleGroup: 'سینه',
    subMuscleGroup: 'سینه میانی',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین پایه‌ای برای توسعه حجم و قدرت عضلات سینه، با تاکید بر فیبرهای میانی',
    instructions: [
      'روي نیمکت خوابیده قرار بگیرید و هالتر را بالای سینه نگه دارید',
      'دست‌ها را به عرض شانه باز کنید',
      'هالتر را به سمت پایین بیاورید تا به سینه برسد',
      'با فشار عضلات سینه هالتر را به بالا هل دهید'
    ],
    tips: [
      'کمر را همیشه روی نیمکت نگه دارید',
      'آرنج‌ها را ۴۵ درجه نگه دارید',
      'نفس را در پایین نگه دارید و در بالا بیرون دهید'
    ],
    commonMistakes: [
      'پریدن هالتر از سینه',
      'باز کردن بیش از حد آرنج‌ها',
      'بالا آوردن لگن از نیمکت'
    ],
    variations: [
      'پرس سینه دمبل',
      'پرس سینه دستگاه',
      'پرس سینه شیب‌دار'
    ],
    primaryMuscles: ['Pectoralis Major', 'Pectoralis Minor'],
    secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoid'],
    restTime: 120,
    caloriesPerHour: 300
  },
  {
    id: 'chest_incline_press_barbell',
    name: 'پرس سینه شیب‌دار هالتر',
    nameEn: 'Incline Barbell Bench Press',
    muscleGroup: 'سینه',
    subMuscleGroup: 'سینه فوقانی',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین برای توسعه بخش فوقانی عضلات سینه و شانه‌های جلو',
    instructions: [
      'روی نیمکت شیب‌دار ۳۰-۴۵ درجه قرار بگیرید',
      'هالتر را بالای سینه نگه دارید',
      'دست‌ها را به عرض شانه باز کنید',
      'هالتر را به سمت پایین بیاورید',
      'با فشار عضلات سینه هالتر را بالا هل دهید'
    ],
    tips: [
      'شیب نیمکت را ۳۰ درجه نگه دارید',
      'وزنه را کنترل شده حرکت دهید',
      'نفس را هماهنگ نگه دارید'
    ],
    commonMistakes: [
      'شیب بیش از حد نیمکت',
      'استفاده از وزن سنگین',
      'بالا آوردن بیش از حد شانه‌ها'
    ],
    variations: [
      'پرس شیب‌دار دمبل',
      'پرس شیب‌دار دستگاه',
      'پرس شیب‌دار کابل'
    ],
    primaryMuscles: ['Pectoralis Major (Clavicular Head)'],
    secondaryMuscles: ['Anterior Deltoid', 'Triceps Brachii'],
    restTime: 120,
    caloriesPerHour: 280
  },
  {
    id: 'chest_decline_press_barbell',
    name: 'پرس سینه شیب‌برعکس هالتر',
    nameEn: 'Decline Barbell Bench Press',
    muscleGroup: 'سینه',
    subMuscleGroup: 'سینه تحتانی',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین برای توسعه بخش تحتانی عضلات سینه',
    instructions: [
      'روی نیمکت شیب‌برعکس ۲۰-۳۰ درجه قرار بگیرید',
      'هالتر را بالای سینه نگه دارید',
      'دست‌ها را به عرض شانه باز کنید',
      'هالتر را کنترل شده پایین بیاورید',
      'با فشار عضلات سینه هالتر را بالا هل دهید'
    ],
    tips: [
      'سر را روی نیمکت نگه دارید',
      'وزنه را کاملاً کنترل کنید',
      'از لنگر مناسب استفاده کنید'
    ],
    commonMistakes: [
      'لغزیدن از نیمکت',
      'استفاده از شیب بیش از حد',
      'بالا آوردن بیش از حد سر'
    ],
    variations: [
      'پرس شیب‌برعکس دمبل',
      'پرس شیب‌برعکس دستگاه',
      'دیپ سینه'
    ],
    primaryMuscles: ['Pectoralis Major (Sternal Head)'],
    secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoid'],
    restTime: 120,
    caloriesPerHour: 290
  },
  {
    id: 'chest_fly_machine',
    name: 'فلای سینه دستگاه',
    nameEn: 'Pec Deck Machine',
    muscleGroup: 'سینه',
    subMuscleGroup: 'سینه میانی',
    equipment: 'دستگاه',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'تمرین ایزولاسیون عالی برای عضلات سینه با حداقل فشار روی شانه‌ها',
    instructions: [
      'روی دستگاه بنشینید و دستگیره‌ها را بگیرید',
      'آرنج‌ها را کمی خم نگه دارید',
      'دست‌ها را به سمت جلو بیاورید',
      'سپس به سمت داخل بکشید تا دست‌ها به هم برسند'
    ],
    tips: [
      'آرنج‌ها را همیشه در یک سطح نگه دارید',
      'حرکت را کنترل شده انجام دهید',
      'نفس را در باز کردن دم بگیرید'
    ],
    commonMistakes: [
      'استفاده از وزن سنگین',
      'باز کردن بیش از حد آرنج‌ها',
      'بالا آوردن شانه‌ها'
    ],
    variations: [
      'فلای سینه کابل',
      'فلای سینه دمبل',
      'فلای سینه یک دست'
    ],
    primaryMuscles: ['Pectoralis Major'],
    secondaryMuscles: ['Anterior Deltoid'],
    restTime: 90,
    caloriesPerHour: 250
  },
  {
    id: 'chest_push_up',
    name: 'شنا سینه',
    nameEn: 'Push-Up',
    muscleGroup: 'سینه',
    subMuscleGroup: 'سینه میانی',
    equipment: 'وزن بدن',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'beginner',
    description: 'تمرین کلاسیک بدنسازی که عضلات سینه، شانه و بازو را درگیر می‌کند',
    instructions: [
      'در وضعیت پلانک قرار بگیرید',
      'دست‌ها را به عرض شانه باز کنید',
      'بدن را پایین بیاورید تا سینه به زمین نزدیک شود',
      'با فشار بدن را بالا ببرید'
    ],
    tips: [
      'بدن را صاف نگه دارید',
      'کمر را قوس ندهید',
      'نفس را هماهنگ نگه دارید'
    ],
    commonMistakes: [
      'قوس دادن کمر',
      'آوردن شانه‌ها به سمت جلو',
      'بالا آوردن باسن'
    ],
    variations: [
      'شنا سینه پاشنه',
      'شنا سینه الماسی',
      'شنا سینه یک دست'
    ],
    primaryMuscles: ['Pectoralis Major', 'Triceps Brachii'],
    secondaryMuscles: ['Anterior Deltoid', 'Serratus Anterior'],
    restTime: 60,
    caloriesPerHour: 400
  },
  {
    id: 'chest_dip',
    name: 'دیپ سینه',
    nameEn: 'Chest Dip',
    muscleGroup: 'سینه',
    subMuscleGroup: 'سینه تحتانی',
    equipment: 'وزن بدن',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین پیشرفته برای توسعه عضلات سینه و پشت بازو',
    instructions: [
      'روی پارالل بارها قرار بگیرید',
      'بدن را بالا نگه دارید',
      'آرنج‌ها را خم کنید و بدن را پایین بیاورید',
      'با فشار بدن را بالا ببرید'
    ],
    tips: [
      'بدن را کمی به سمت جلو متمایل کنید',
      'آرنج‌ها را به سمت عقب نگه دارید',
      'حرکت را کنترل شده انجام دهید'
    ],
    commonMistakes: [
      'افتادن شانه‌ها به سمت پایین',
      'استفاده از حرکت پویا',
      'قفل نکردن آرنج‌ها در بالا'
    ],
    variations: [
      'دیپ پشت بازو',
      'دیپ با وزن اضافه',
      'دیپ ماشین'
    ],
    primaryMuscles: ['Pectoralis Major', 'Triceps Brachii'],
    secondaryMuscles: ['Anterior Deltoid'],
    restTime: 120,
    caloriesPerHour: 350
  },

  // ===== BACK EXERCISES =====
  {
    id: 'back_deadlift_barbell',
    name: 'ددلیفت هالتر',
    nameEn: 'Barbell Deadlift',
    muscleGroup: 'پشت',
    subMuscleGroup: 'پشت کامل',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'advanced',
    description: 'تمرین قدرتی کامل بدن که عضلات پشت، باسن و همسترینگ را هدف قرار می‌دهد',
    instructions: [
      'پایین هالتر بایستید',
      'پاها را به عرض شانه باز کنید',
      'زانوها را کمی خم کنید',
      'هالتر را با صاف کردن کمر و زانوها بالا ببرید',
      'در بالا بدن را کاملاً صاف نگه دارید'
    ],
    tips: [
      'کمر را همیشه صاف نگه دارید',
      'وزنه را نزدیک بدن نگه دارید',
      'نفس را قبل از بلند کردن نگه دارید'
    ],
    commonMistakes: [
      'قوس دادن کمر',
      'دور کردن وزنه از بدن',
      'استفاده از زانوهای زیاد'
    ],
    variations: [
      'ددلیفت رومانیایی',
      'ددلیفت سومو',
      'ددلیفت تک دست'
    ],
    primaryMuscles: ['Erector Spinae', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Trapezius', 'Rhomboids'],
    contraindications: ['مشکلات کمر', 'دیسک کمر'],
    restTime: 180,
    caloriesPerHour: 450
  },
  {
    id: 'back_pull_up',
    name: 'پول‌اپ',
    nameEn: 'Pull-Up',
    muscleGroup: 'پشت',
    subMuscleGroup: 'عرض',
    equipment: 'وزن بدن',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین عالی برای توسعه عضلات عرض و قدرت کلی بدن',
    instructions: [
      'از بارفیکس آویزان شوید',
      'دست‌ها را به عرض شانه باز کنید',
      'بدن را بالا بکشید تا چانه بالای بار برسد',
      'کنترل شده پایین بیایید'
    ],
    tips: [
      'از حرکت پویا خودداری کنید',
      'بدن را کاملاً بالا بکشید',
      'نفس را کنترل کنید'
    ],
    commonMistakes: [
      'استفاده از حرکت پویا',
      'نرسیدن چانه به بالای بار',
      'آویزان ماندن با دست‌های کاملاً صاف'
    ],
    variations: [
      'پول‌اپ پشت بازو',
      'پول‌اپ یک دست',
      'پول‌اپ با وزن اضافه'
    ],
    primaryMuscles: ['Latissimus Dorsi', 'Biceps Brachii'],
    secondaryMuscles: ['Rhomboids', 'Trapezius', 'Posterior Deltoid'],
    restTime: 120,
    caloriesPerHour: 380
  },
  {
    id: 'back_lat_pulldown',
    name: 'پول‌داون لات',
    nameEn: 'Lat Pulldown',
    muscleGroup: 'پشت',
    subMuscleGroup: 'عرض',
    equipment: 'دستگاه',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'beginner',
    description: 'تمرین پایه‌ای برای توسعه عضلات عرض با استفاده از دستگاه',
    instructions: [
      'روی دستگاه بنشینید',
      'بار را بالای سر بگیرید',
      'با کشیدن به سمت پایین، بار را به سینه بیاورید',
      'کنترل شده بار را بالا ببرید'
    ],
    tips: [
      'کمر را صاف نگه دارید',
      'بار را به سینه بیاورید نه گردن',
      'از حرکت کامل خودداری کنید'
    ],
    commonMistakes: [
      'خم کردن کمر',
      'کشیدن بار به گردن',
      'استفاده از حرکت پویا'
    ],
    variations: [
      'پول‌داون پشت بازو',
      'پول‌داون یک دست',
      'پول‌داون باریک'
    ],
    primaryMuscles: ['Latissimus Dorsi'],
    secondaryMuscles: ['Biceps Brachii', 'Rhomboids', 'Posterior Deltoid'],
    restTime: 90,
    caloriesPerHour: 320
  },
  {
    id: 'back_row_barbell',
    name: 'ردیف هالتر',
    nameEn: 'Barbell Row',
    muscleGroup: 'پشت',
    subMuscleGroup: 'پشت میانی',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین عالی برای توسعه ضخامت عضلات پشت میانی',
    instructions: [
      'هالتر را جلوی پاها نگه دارید',
      'با خم کردن زانو و کمر، هالتر را بگیرید',
      'با کشیدن شانه‌ها به عقب، هالتر را به شکم بکشید',
      'کنترل شده هالتر را پایین بیاورید'
    ],
    tips: [
      'کمر را صاف نگه دارید',
      'آرنج‌ها را نزدیک بدن نگه دارید',
      'حرکت را از عضلات پشت انجام دهید'
    ],
    commonMistakes: [
      'قوس دادن کمر',
      'استفاده از دست‌ها به جای پشت',
      'بالا آوردن شانه‌ها'
    ],
    variations: [
      'ردیف دمبل',
      'ردیف دستگاه',
      'ردیف کابل'
    ],
    primaryMuscles: ['Rhomboids', 'Trapezius', 'Latissimus Dorsi'],
    secondaryMuscles: ['Biceps Brachii', 'Posterior Deltoid'],
    restTime: 120,
    caloriesPerHour: 350
  },
  {
    id: 'back_face_pull',
    name: 'فیس پول',
    nameEn: 'Face Pull',
    muscleGroup: 'پشت',
    subMuscleGroup: 'پشت فوقانی',
    equipment: 'کابل',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'تمرین اصلاحی عالی برای بهبود وضعیت شانه‌ها و تقویت عضلات پشت فوقانی',
    instructions: [
      'کابل را روی سطح چشم تنظیم کنید',
      'دستگیره را با هر دو دست بگیرید',
      'با کشیدن به سمت صورت، آرنج‌ها را بالا ببرید',
      'آرنج‌ها را به سمت عقب بکشید'
    ],
    tips: [
      'آرنج‌ها را بالاتر از شانه‌ها نگه دارید',
      'از کابل با مقاومت مناسب استفاده کنید',
      'حرکت را کنترل شده انجام دهید'
    ],
    commonMistakes: [
      'آوردن دستگیره به صورت',
      'استفاده از وزن سنگین',
      'آرنج‌های پایین'
    ],
    variations: [
      'فیس پول یک دست',
      'فیس پول با طناب',
      'فیس پول ایستاده'
    ],
    primaryMuscles: ['Posterior Deltoid', 'Rhomboids'],
    secondaryMuscles: ['Trapezius', 'Biceps Brachii'],
    restTime: 90,
    caloriesPerHour: 280
  },

  // ===== SHOULDER EXERCISES =====
  {
    id: 'shoulder_overhead_press_barbell',
    name: 'پرس سرشانه هالتر نظامی',
    nameEn: 'Military Barbell Press',
    muscleGroup: 'شانه',
    subMuscleGroup: 'شانه کامل',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین پایه‌ای برای توسعه قدرت و حجم شانه‌ها',
    instructions: [
      'هالتر را جلوی گردن نگه دارید',
      'دست‌ها را به عرض شانه باز کنید',
      'هالتر را بالای سر هل دهید',
      'کنترل شده هالتر را پایین بیاورید'
    ],
    tips: [
      'بدن را صاف نگه دارید',
      'هالتر را جلوی صورت نگه دارید',
      'نفس را هماهنگ نگه دارید'
    ],
    commonMistakes: [
      'قوس دادن کمر',
      'برخورد هالتر با صورت',
      'استفاده از حرکت پویا'
    ],
    variations: [
      'پرس سرشانه دمبل',
      'پرس سرشانه دستگاه',
      'پرس سرشانه پشت سر'
    ],
    primaryMuscles: ['Anterior Deltoid', 'Lateral Deltoid'],
    secondaryMuscles: ['Triceps Brachii', 'Trapezius'],
    restTime: 120,
    caloriesPerHour: 320
  },
  {
    id: 'shoulder_lateral_raise_dumbbell',
    name: 'جانبی بلند کن دمبل',
    nameEn: 'Dumbbell Lateral Raise',
    muscleGroup: 'شانه',
    subMuscleGroup: 'شانه جانبی',
    equipment: 'دمبل',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'تمرین ایزولاسیون عالی برای توسعه عرض شانه‌ها',
    instructions: [
      'دمبل‌ها را در دست بگیرید',
      'دست‌ها را در کنار بدن نگه دارید',
      'با چرخش شانه‌ها، دست‌ها را به سمت پهلو بالا ببرید',
      'تا ارتفاع شانه‌ها دست‌ها را بالا ببرید'
    ],
    tips: [
      'آرنج‌ها را کمی خم نگه دارید',
      'از حرکت پویا خودداری کنید',
      'وزنه را کنترل شده حرکت دهید'
    ],
    commonMistakes: [
      'بالا آوردن بیش از حد شانه‌ها',
      'استفاده از دست‌ها به جای شانه‌ها',
      'قوس دادن کمر'
    ],
    variations: [
      'جانبی بلند کن کابل',
      'جانبی بلند کن دستگاه',
      'جانبی بلند کن یک دست'
    ],
    primaryMuscles: ['Lateral Deltoid'],
    secondaryMuscles: ['Anterior Deltoid', 'Posterior Deltoid'],
    restTime: 90,
    caloriesPerHour: 250
  },
  {
    id: 'shoulder_rear_delt_fly_machine',
    name: 'عقب‌شانه پرواز دستگاه',
    nameEn: 'Rear Delt Machine Fly',
    muscleGroup: 'شانه',
    subMuscleGroup: 'شانه عقب',
    equipment: 'دستگاه',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'تمرین ایزولاسیون برای تقویت عضلات پشت شانه',
    instructions: [
      'روی دستگاه بنشینید',
      'دستگیره‌ها را بگیرید',
      'با باز کردن دست‌ها، عضلات پشت شانه را بکشید',
      'کنترل شده دست‌ها را ببندید'
    ],
    tips: [
      'کمر را صاف نگه دارید',
      'آرنج‌ها را بالاتر از شانه‌ها نگه دارید',
      'حرکت را کنترل شده انجام دهید'
    ],
    commonMistakes: [
      'استفاده از وزن سنگین',
      'خم کردن کمر',
      'آوردن آرنج‌ها به سمت پایین'
    ],
    variations: [
      'عقب‌شانه پرواز دمبل',
      'عقب‌شانه پرواز کابل',
      'عقب‌شانه پرواز خوابیده'
    ],
    primaryMuscles: ['Posterior Deltoid'],
    secondaryMuscles: ['Rhomboids', 'Trapezius'],
    restTime: 90,
    caloriesPerHour: 240
  },
  {
    id: 'shoulder_shrug_barbell',
    name: 'شراگ هالتر',
    nameEn: 'Barbell Shrug',
    muscleGroup: 'شانه',
    subMuscleGroup: 'تراپز',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'تمرین ایزولاسیون برای توسعه عضلات تله و بهبود وضعیت شانه‌ها',
    instructions: [
      'هالتر را جلوی بدن نگه دارید',
      'شانه‌ها را تا حد ممکن بالا ببرید',
      'یک ثانیه در بالا نگه دارید',
      'کنترل شده شانه‌ها را پایین بیاورید'
    ],
    tips: [
      'از دست‌ها استفاده نکنید',
      'حرکت را فقط با شانه‌ها انجام دهید',
      'وزنه را کنترل کنید'
    ],
    commonMistakes: [
      'استفاده از دست‌ها',
      'بالا آوردن بیش از حد شانه‌ها',
      'قوس دادن کمر'
    ],
    variations: [
      'شراگ دمبل',
      'شراگ دستگاه',
      'شراگ کابل'
    ],
    primaryMuscles: ['Trapezius'],
    secondaryMuscles: [],
    restTime: 90,
    caloriesPerHour: 220
  },

  // ===== ARM EXERCISES =====
  {
    id: 'biceps_curl_barbell',
    name: 'جلو بازو میله مستقیم',
    nameEn: 'Barbell Bicep Curl',
    muscleGroup: 'بازو',
    subMuscleGroup: 'جلو بازو',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'تمرین کلاسیک برای توسعه عضلات جلو بازو',
    instructions: [
      'هالتر را با دست‌های باز نگه دارید',
      'آرنج‌ها را نزدیک بدن نگه دارید',
      'هالتر را به سمت شانه‌ها بالا ببرید',
      'کنترل شده پایین بیاورید'
    ],
    tips: [
      'آرنج‌ها را حرکت ندهید',
      'از حرکت پویا خودداری کنید',
      'نفس را در بالا بیرون دهید'
    ],
    commonMistakes: [
      'حرکت آرنج‌ها',
      'استفاده از کمر',
      'قفل کردن آرنج‌ها'
    ],
    variations: [
      'جلو بازو دمبل',
      'جلو بازو کابل',
      'جلو بازو EZ بار'
    ],
    primaryMuscles: ['Biceps Brachii'],
    secondaryMuscles: ['Brachialis', 'Brachioradialis'],
    restTime: 90,
    caloriesPerHour: 200
  },
  {
    id: 'triceps_extension_cable',
    name: 'پشت بازو کابل بالا',
    nameEn: 'Overhead Cable Tricep Extension',
    muscleGroup: 'بازو',
    subMuscleGroup: 'پشت بازو',
    equipment: 'کابل',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'intermediate',
    description: 'تمرین عالی برای ایزولاسیون عضلات پشت بازو',
    instructions: [
      'کابل را بالای سر تنظیم کنید',
      'دستگیره را با هر دو دست بگیرید',
      'آرنج‌ها را نزدیک سر نگه دارید',
      'کابل را به سمت پایین هل دهید'
    ],
    tips: [
      'آرنج‌ها را حرکت ندهید',
      'کابل را کاملاً پایین بیاورید',
      'نفس را کنترل کنید'
    ],
    commonMistakes: [
      'حرکت آرنج‌ها',
      'نرسیدن به کشش کامل',
      'استفاده از وزن سنگین'
    ],
    variations: [
      'پشت بازو دمبل',
      'پشت بازو هالتر',
      'پشت بازو یک دست'
    ],
    primaryMuscles: ['Triceps Brachii'],
    secondaryMuscles: [],
    restTime: 90,
    caloriesPerHour: 220
  },
  {
    id: 'biceps_hammer_curl',
    name: 'همر کرل',
    nameEn: 'Hammer Curl',
    muscleGroup: 'بازو',
    subMuscleGroup: 'جلو بازو',
    equipment: 'دمبل',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'تمرین عالی برای توسعه عضلات براکیالیس و ساعد',
    instructions: [
      'دمبل‌ها را در دست بگیرید',
      'کف دست‌ها رو به داخل',
      'دمبل‌ها را به سمت شانه‌ها بالا ببرید',
      'کنترل شده پایین بیاورید'
    ],
    tips: [
      'کف دست را همیشه رو به داخل نگه دارید',
      'آرنج‌ها را حرکت ندهید',
      'حرکت را کنترل شده انجام دهید'
    ],
    commonMistakes: [
      'چرخش دست‌ها',
      'حرکت آرنج‌ها',
      'استفاده از حرکت پویا'
    ],
    variations: [
      'همر کرل کابل',
      'همر کرل یک دست',
      'همر کرل EZ بار'
    ],
    primaryMuscles: ['Brachialis', 'Brachioradialis'],
    secondaryMuscles: ['Biceps Brachii'],
    restTime: 90,
    caloriesPerHour: 210
  },

  // ===== LEG EXERCISES =====
  {
    id: 'legs_squat_barbell',
    name: 'اسکات هالتر',
    nameEn: 'Barbell Back Squat',
    muscleGroup: 'ران',
    subMuscleGroup: 'ران کامل',
    equipment: 'هالتر',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین پایه‌ای بدنسازی که تمام عضلات پایین‌تنه را هدف قرار می‌دهد',
    instructions: [
      'هالتر را روی شانه‌ها قرار دهید',
      'پاها را به عرض شانه باز کنید',
      'با خم کردن زانو و باسن، پایین بروید',
      'تا جایی که ران‌ها موازی زمین شوند',
      'با فشار پاها بدن را بالا ببرید'
    ],
    tips: [
      'کمر را صاف نگه دارید',
      'زانوها را روی انگشتان پا نگه دارید',
      'وزنه را روی پنجه پا نگه دارید'
    ],
    commonMistakes: [
      'قوس دادن کمر',
      'زانوهای به داخل',
      'برآمدن پنجه پا'
    ],
    variations: [
      'اسکات دمبل',
      'اسکات دستگاه',
      'اسکات فرانت'
    ],
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Adductor Magnus', 'Soleus'],
    restTime: 180,
    caloriesPerHour: 420
  },
  {
    id: 'legs_leg_press_machine',
    name: 'اسکات لگ پرس',
    nameEn: 'Leg Press Machine',
    muscleGroup: 'ران',
    subMuscleGroup: 'ران کامل',
    equipment: 'دستگاه',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'beginner',
    description: 'تمرین ایمن برای توسعه عضلات ران با استفاده از دستگاه',
    instructions: [
      'روی دستگاه بنشینید',
      'پاها را روی صفحه قرار دهید',
      'پاها را به عرض شانه باز کنید',
      'صفحه را تا حد امکان پایین بیاورید',
      'با فشار پاها صفحه را هل دهید'
    ],
    tips: [
      'زانوها را کاملاً باز نکنید',
      'پاها را کاملاً صاف نکنید',
      'نفس را کنترل کنید'
    ],
    commonMistakes: [
      'قفل کردن زانوها',
      'برداشتن پاها از صفحه',
      'استفاده از وزن بیش از حد'
    ],
    variations: [
      'لگ پرس یک پا',
      'لگ پرس گسترده',
      'لگ پرس باریک'
    ],
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Adductor Magnus'],
    restTime: 120,
    caloriesPerHour: 350
  },
  {
    id: 'legs_lunge_dumbbell',
    name: 'لانگ دمبل',
    nameEn: 'Dumbbell Walking Lunge',
    muscleGroup: 'ران',
    subMuscleGroup: 'ران کامل',
    equipment: 'دمبل',
    type: 'resistance',
    mechanics: 'compound',
    difficulty: 'intermediate',
    description: 'تمرین عالی برای توسعه تعادل و قدرت یک طرفه',
    instructions: [
      'دمبل‌ها را در دست بگیرید',
      'یک پا را به سمت جلو بردارید',
      'با خم کردن هر دو زانو پایین بروید',
      'زانوی عقب را نزدیک زمین ببرید',
      'با فشار پا بدن را بالا ببرید'
    ],
    tips: [
      'زانوی جلو را روی انگشت پا نگه دارید',
      'بدن را صاف نگه دارید',
      'تعادل را حفظ کنید'
    ],
    commonMistakes: [
      'خم کردن بدن به سمت جلو',
      'قدم برداشتن کوتاه',
      'از دست دادن تعادل'
    ],
    variations: [
      'لانگ ثابت',
      'لانگ پرش',
      'لانگ معکوس'
    ],
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Adductor Magnus'],
    restTime: 90,
    caloriesPerHour: 380
  },
  {
    id: 'legs_leg_curl_machine',
    name: 'لگ کرل دستگاه',
    nameEn: 'Leg Curl Machine',
    muscleGroup: 'ران',
    subMuscleGroup: 'همسترینگ',
    equipment: 'دستگاه',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'تمرین ایزولاسیون برای توسعه عضلات پشت ران',
    instructions: [
      'روی دستگاه دراز بکشید',
      'پاها را زیر غلطک قرار دهید',
      'زانوها را خم کنید',
      'پاها را به سمت باسن بکشید'
    ],
    tips: [
      'حرکت را کنترل شده انجام دهید',
      'پاها را کاملاً صاف نکنید',
      'از وزن مناسب استفاده کنید'
    ],
    commonMistakes: [
      'استفاده از حرکت پویا',
      'بالا آوردن باسن از دستگاه',
      'قفل کردن زانوها'
    ],
    variations: [
      'لگ کرل ایستاده',
      'لگ کرل خوابیده',
      'لگ کرل یک پا'
    ],
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Gastrocnemius', 'Soleus'],
    restTime: 90,
    caloriesPerHour: 280
  },

  // ===== CORE EXERCISES =====
  {
    id: 'core_plank',
    name: 'پلانک',
    nameEn: 'Plank',
    muscleGroup: 'هسته',
    subMuscleGroup: 'هسته کامل',
    equipment: 'وزن بدن',
    type: 'resistance',
    mechanics: 'isometric',
    difficulty: 'beginner',
    description: 'تمرین ایزومتریک عالی برای تقویت عضلات هسته و بهبود پایداری',
    instructions: [
      'در وضعیت چهار دست و پا قرار بگیرید',
      'آرنج‌ها را دقیقاً زیر شانه‌ها قرار دهید',
      'بدن را صاف نگه دارید',
      'زمان را نگه دارید'
    ],
    tips: [
      'بدن را کاملاً صاف نگه دارید',
      'نفس را منظم نگه دارید',
      'کمر را قوس ندهید'
    ],
    commonMistakes: [
      'بالا آوردن باسن',
      'قوس دادن کمر',
      'افتادن شانه‌ها'
    ],
    variations: [
      'پلانک جانبی',
      'پلانک معکوس',
      'پلانک با بالشتک'
    ],
    primaryMuscles: ['Rectus Abdominis', 'Transversus Abdominis'],
    secondaryMuscles: ['Obliques', 'Erector Spinae'],
    restTime: 60,
    caloriesPerHour: 300
  },
  {
    id: 'core_crunch_machine',
    name: 'کرانچ دستگاه',
    nameEn: 'Crunch Machine',
    muscleGroup: 'هسته',
    subMuscleGroup: 'شکم',
    equipment: 'دستگاه',
    type: 'resistance',
    mechanics: 'isolation',
    difficulty: 'beginner',
    description: 'تمرین ایزولاسیون برای تقویت عضلات شکم با استفاده از دستگاه',
    instructions: [
      'روی دستگاه بنشینید',
      'دستگیره‌ها را بگیرید',
      'بدن را به سمت جلو خم کنید',
      'عضلات شکم را منقبض کنید'
    ],
    tips: [
      'از کمر استفاده نکنید',
      'حرکت را کنترل شده انجام دهید',
      'نفس را در انقباض بیرون دهید'
    ],
    commonMistakes: [
      'استفاده از کمر',
      'حرکت سریع',
      'قفل نکردن موقعیت'
    ],
    variations: [
      'کرانچ زمین',
      'کرانچ کابل',
      'کرانچ توپ'
    ],
    primaryMuscles: ['Rectus Abdominis'],
    secondaryMuscles: ['Obliques'],
    restTime: 60,
    caloriesPerHour: 250
  },

  // ===== CARDIO EXERCISES =====
  {
    id: 'cardio_treadmill_run',
    name: 'دویدن روی تردمیل',
    nameEn: 'Treadmill Running',
    muscleGroup: 'قلبی',
    equipment: 'دستگاه',
    type: 'cardio',
    mechanics: 'aerobic',
    difficulty: 'beginner',
    description: 'تمرین کاردیو عالی برای بهبود استقامت قلبی و سوزاندن کالری',
    instructions: [
      'روی تردمیل قرار بگیرید',
      'سرعت مناسب را انتخاب کنید',
      'با حفظ ریتم منظم بدوید',
      'زمان و سرعت را کنترل کنید'
    ],
    tips: [
      'نفس را منظم نگه دارید',
      'پاهای خود را ریتمیک حرکت دهید',
      'از گرم کردن قبل شروع استفاده کنید'
    ],
    commonMistakes: [
      'چسبیدن به دستگیره‌ها',
      'خم کردن بدن به سمت جلو',
      'نگاه کردن به پایین'
    ],
    variations: [
      'دویدن با شیب',
      'دویدن اینتروال',
      'پیاده‌روی سریع'
    ],
    primaryMuscles: [],
    secondaryMuscles: [],
    caloriesPerHour: 500
  },
  {
    id: 'cardio_bike_stationary',
    name: 'دوچرخه ثابت',
    nameEn: 'Stationary Bike',
    muscleGroup: 'قلبی',
    equipment: 'دستگاه',
    type: 'cardio',
    mechanics: 'aerobic',
    difficulty: 'beginner',
    description: 'تمرین کاردیو کم تاثیر برای بهبود استقامت قلبی',
    instructions: [
      'روی دوچرخه بنشینید',
      'پاها را روی پدال‌ها قرار دهید',
      'مقاومت مناسب را انتخاب کنید',
      'با ریتم منظم رکاب بزنید'
    ],
    tips: [
      'پشت را صاف نگه دارید',
      'نفس را منظم نگه دارید',
      'از برنامه‌های اینتروال استفاده کنید'
    ],
    commonMistakes: [
      'خم کردن بدن به سمت جلو',
      'چسبیدن به دستگیره‌ها',
      'استفاده از مقاومت بیش از حد'
    ],
    variations: [
      'دوچرخه اسپینینگ',
      'دوچرخه کوهستان',
      'دوچرخه ایستاده'
    ],
    primaryMuscles: [],
    secondaryMuscles: ['Quadriceps', 'Hamstrings', 'Gluteus Maximus'],
    caloriesPerHour: 400
  },

  // ===== WARMUP EXERCISES =====
  {
    id: 'warmup_dynamic_stretch',
    name: 'کشش دینامیکی',
    nameEn: 'Dynamic Stretching',
    muscleGroup: 'گرم کردن',
    equipment: 'وزن بدن',
    type: 'warmup',
    mechanics: 'dynamic-stretch',
    difficulty: 'beginner',
    description: 'حرکات کششی پویا برای آماده‌سازی بدن قبل از تمرین',
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
    preparationTime: 10
  },

  // ===== COOLDOWN EXERCISES =====
  {
    id: 'cooldown_static_stretch',
    name: 'کشش ایستا',
    nameEn: 'Static Stretching',
    muscleGroup: 'سرد کردن',
    equipment: 'وزن بدن',
    type: 'cooldown',
    mechanics: 'static-stretch',
    difficulty: 'beginner',
    description: 'کشش‌های ایستا برای بهبود انعطاف و ریکاوری بعد از تمرین',
    instructions: [
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
    executionTime: 30
  }
];

export default exercises;