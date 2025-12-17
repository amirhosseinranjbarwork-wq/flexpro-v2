export interface Supplement {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  type: string;
  form: 'پودر' | 'کپسول' | 'قرص' | 'مایع' | 'ژل' | 'شربت';
  dosage: {
    amount: number;
    unit: string;
    timing: string[];
    frequency: string;
  };
  benefits: string[];
  ingredients: string[];
  sideEffects?: string[];
  contraindications?: string[];
  interactions?: string[];
  qualityStandards?: string[];
  researchRating: 1 | 2 | 3 | 4 | 5; // 1=محدود, 5=قوی
  costLevel: 'کم' | 'متوسط' | 'بالا';
  vegan?: boolean;
  allergens?: string[];
  storage?: string;
  shelfLife?: string;
  manufacturer?: string;
}

export const supplements: Supplement[] = [
  // ===== PROTEIN SUPPLEMENTS =====
  {
    id: 'whey_protein_isolate',
    name: 'پروتئین وی ایزوله',
    nameEn: 'Whey Protein Isolate',
    category: 'پروتئین',
    type: 'پروتئین وی',
    form: 'پودر',
    dosage: {
      amount: 25,
      unit: 'گرم',
      timing: ['بعد از تمرین', 'بین وعده‌ها', 'صبح'],
      frequency: '۱-۳ بار در روز'
    },
    benefits: [
      'رشد و ترمیم عضلات',
      'افزایش توده عضلانی',
      'بهبود ریکاوری',
      'حفاظت از عضلات',
      'افزایش قدرت'
    ],
    ingredients: [
      'پروتئین وی ایزوله',
      'لاکتوز کم',
      'چربی کم',
      'کربوهیدرات کم'
    ],
    sideEffects: [
      'ناراحتی معده (در موارد نادر)',
      'اسهال (در مصرف بیش از حد)',
      'حساسیت به لاکتوز'
    ],
    contraindications: [
      'حساسیت به لبنیات',
      'مشکلات کلیوی (در مصرف بیش از حد)'
    ],
    interactions: [
      'ممکن است جذب برخی داروها را کاهش دهد'
    ],
    qualityStandards: [
      'NSF Certified for Sport',
      'Informed Choice',
      'GMP Certified'
    ],
    researchRating: 5,
    costLevel: 'متوسط',
    vegan: false,
    allergens: ['لبنیات'],
    storage: 'در جای خشک و خنک',
    shelfLife: '۲۴ ماه'
  },
  {
    id: 'whey_protein_concentrate',
    name: 'پروتئین وی کنسانتره',
    nameEn: 'Whey Protein Concentrate',
    category: 'پروتئین',
    type: 'پروتئین وی',
    form: 'پودر',
    dosage: {
      amount: 30,
      unit: 'گرم',
      timing: ['بعد از تمرین', 'بین وعده‌ها'],
      frequency: '۱-۲ بار در روز'
    },
    benefits: [
      'رشد عضلات',
      'افزایش توده عضلانی',
      'بهبود ریکاوری',
      'حفاظت از عضلات'
    ],
    ingredients: [
      'پروتئین وی کنسانتره',
      'لاکتوز',
      'چربی',
      'کربوهیدرات'
    ],
    sideEffects: [
      'ناراحتی معده',
      'گاز معده',
      'حساسیت به لاکتوز'
    ],
    researchRating: 4,
    costLevel: 'کم',
    vegan: false,
    allergens: ['لبنیات']
  },
  {
    id: 'plant_protein_blend',
    name: 'پروتئین گیاهی ترکیبی',
    nameEn: 'Plant Protein Blend',
    category: 'پروتئین',
    type: 'پروتئین گیاهی',
    form: 'پودر',
    dosage: {
      amount: 30,
      unit: 'گرم',
      timing: ['بعد از تمرین', 'صبح', 'بین وعده‌ها'],
      frequency: '۱-۲ بار در روز'
    },
    benefits: [
      'رشد عضلات برای گیاهخواران',
      'پروتئین کامل',
      'فیبر بالا',
      'کم کالری'
    ],
    ingredients: [
      'پروتئین نخود',
      'پروتئین برنج',
      'پروتئین کتان',
      'پروتئین کنف'
    ],
    researchRating: 4,
    costLevel: 'متوسط',
    vegan: true,
    allergens: []
  },

  // ===== CREATINE =====
  {
    id: 'creatine_monohydrate',
    name: 'کراتین مونوهیدرات',
    nameEn: 'Creatine Monohydrate',
    category: 'قدرت و عملکرد',
    type: 'کراتین',
    form: 'پودر',
    dosage: {
      amount: 5,
      unit: 'گرم',
      timing: ['هر زمان از روز', 'بعد از تمرین'],
      frequency: 'روزانه'
    },
    benefits: [
      'افزایش قدرت عضلانی',
      'بهبود عملکرد HIIT',
      'افزایش حجم عضلات',
      'بهبود ریکاوری',
      'افزایش انرژی ATP'
    ],
    ingredients: [
      'کراتین مونوهیدرات خالص'
    ],
    sideEffects: [
      'ورم موقتی عضلات',
      'ناراحتی معده (در موارد نادر)'
    ],
    contraindications: [
      'مشکلات کلیوی',
      'کم آبی بدن'
    ],
    qualityStandards: [
      'USP Verified',
      'NSF Certified'
    ],
    researchRating: 5,
    costLevel: 'کم',
    vegan: true,
    allergens: [],
    storage: 'در جای خشک'
  },
  {
    id: 'creatine_hcl',
    name: 'کراتین HCL',
    nameEn: 'Creatine HCl',
    category: 'قدرت و عملکرد',
    type: 'کراتین',
    form: 'کپسول',
    dosage: {
      amount: 1,
      unit: 'گرم',
      timing: ['هر زمان از روز'],
      frequency: 'روزانه'
    },
    benefits: [
      'جذب بهتر',
      'کمتر ناراحتی معده',
      'افزایش قدرت'
    ],
    ingredients: [
      'کراتین هیدروکلراید'
    ],
    researchRating: 4,
    costLevel: 'بالا',
    vegan: true
  },

  // ===== PRE-WORKOUT =====
  {
    id: 'c4_original',
    name: 'C4 Original',
    nameEn: 'C4 Original',
    category: 'قبل تمرین',
    type: 'استیمولانت',
    form: 'پودر',
    dosage: {
      amount: 6,
      unit: 'گرم',
      timing: ['۲۰-۳۰ دقیقه قبل از تمرین'],
      frequency: 'قبل از تمرین'
    },
    benefits: [
      'افزایش انرژی',
      'بهبود تمرکز',
      'افزایش قدرت',
      'بهبود پام عضلانی'
    ],
    ingredients: [
      'بتا آلانین',
      'سیترولین مالات',
      'آرژنین',
      'کافئین',
      'تیروزین'
    ],
    sideEffects: [
      'پارستزی (گزگز پوست)',
      'افزایش ضربان قلب',
      'عصبی بودن',
      'بی‌خوابی'
    ],
    contraindications: [
      'مشکلات قلبی',
      'حساسیت به کافئین',
      'بارداری'
    ],
    researchRating: 4,
    costLevel: 'متوسط',
    vegan: true
  },
  {
    id: 'beta_alanine',
    name: 'بتا آلانین',
    nameEn: 'Beta-Alanine',
    category: 'قبل تمرین',
    type: 'پافر اسید لاکتیک',
    form: 'پودر',
    dosage: {
      amount: 3,
      unit: 'گرم',
      timing: ['قبل از تمرین', 'هر زمان'],
      frequency: 'روزانه'
    },
    benefits: [
      'افزایش کارنوزین عضلانی',
      'بهبود تحمل تمرین شدید',
      'کاهش خستگی عضلانی',
      'افزایش قدرت'
    ],
    ingredients: [
      'بتا آلانین خالص'
    ],
    sideEffects: [
      'پارستزی (گزگز پوست) - طبیعی'
    ],
    researchRating: 5,
    costLevel: 'کم',
    vegan: true,
    allergens: []
  },
  {
    id: 'citrulline_malate',
    name: 'سیترولین مالات',
    nameEn: 'Citrulline Malate',
    category: 'قبل تمرین',
    type: 'افزایش پام',
    form: 'پودر',
    dosage: {
      amount: 6,
      unit: 'گرم',
      timing: ['۲۰-۳۰ دقیقه قبل از تمرین'],
      frequency: 'قبل از تمرینات سنگین'
    },
    benefits: [
      'افزایش تولید اکسید نیتریک',
      'بهبود پام عضلانی',
      'کاهش خستگی',
      'بهبود ریکاوری'
    ],
    ingredients: [
      'سیترولین مالات'
    ],
    researchRating: 4,
    costLevel: 'متوسط',
    vegan: true
  },

  // ===== BCAAs =====
  {
    id: 'bcaa_2_1_1',
    name: 'BCAA 2:1:1',
    nameEn: 'BCAA 2:1:1',
    category: 'آمینو اسید',
    type: 'BCAA',
    form: 'پودر',
    dosage: {
      amount: 5,
      unit: 'گرم',
      timing: ['طی تمرین', 'بعد از تمرین', 'صبح'],
      frequency: '۱-۳ بار در روز'
    },
    benefits: [
      'کاهش شکست عضلانی',
      'بهبود ریکاوری',
      'افزایش سنتز پروتئین',
      'کاهش DOMS'
    ],
    ingredients: [
      'لوسین',
      'ایزولوسین',
      'والین'
    ],
    researchRating: 4,
    costLevel: 'متوسط',
    vegan: true
  },
  {
    id: 'glutamine',
    name: 'گلوتامین',
    nameEn: 'Glutamine',
    category: 'آمینو اسید',
    type: 'گلوتامین',
    form: 'پودر',
    dosage: {
      amount: 5,
      unit: 'گرم',
      timing: ['بعد از تمرین', 'صبح'],
      frequency: 'روزانه'
    },
    benefits: [
      'پشتیبانی سیستم ایمنی',
      'بهبود ریکاوری',
      'حفاظت از عضلات',
      'سلامت روده'
    ],
    ingredients: [
      'گلوتامین خالص'
    ],
    researchRating: 4,
    costLevel: 'کم',
    vegan: true
  },

  // ===== FAT BURNERS =====
  {
    id: 'caffeine_anhydrous',
    name: 'کافئین آنهیدروس',
    nameEn: 'Caffeine Anhydrous',
    category: 'چاقی سوزی',
    type: 'استیمولانت',
    form: 'کپسول',
    dosage: {
      amount: 200,
      unit: 'میلی‌گرم',
      timing: ['صبح', 'قبل از تمرین'],
      frequency: 'روزانه'
    },
    benefits: [
      'افزایش متابولیسم',
      'بهبود تمرکز',
      'افزایش انرژی',
      'افزایش چربی سوزی'
    ],
    ingredients: [
      'کافئین خالص'
    ],
    sideEffects: [
      'افزایش ضربان قلب',
      'عصبی بودن',
      'بی‌خوابی',
      'افزایش فشار خون'
    ],
    contraindications: [
      'مشکلات قلبی',
      'حساسیت به کافئین',
      'بارداری'
    ],
    researchRating: 5,
    costLevel: 'کم',
    vegan: true
  },
  {
    id: 'green_tea_extract',
    name: 'استخراج چای سبز',
    nameEn: 'Green Tea Extract',
    category: 'چاقی سوزی',
    type: 'آنتی‌اکسیدان',
    form: 'کپسول',
    dosage: {
      amount: 500,
      unit: 'میلی‌گرم',
      timing: ['با غذا', 'روزانه'],
      frequency: '۲-۳ بار در روز'
    },
    benefits: [
      'افزایش متابولیسم',
      'آنتی‌اکسیدان قوی',
      'حمایت از سلامت قلب',
      'بهبود چربی سوزی'
    ],
    ingredients: [
      'استخراج چای سبز',
      'EGCG'
    ],
    sideEffects: [
      'ناراحتی معده',
      'بی‌خوابی'
    ],
    researchRating: 4,
    costLevel: 'متوسط',
    vegan: true
  },

  // ===== VITAMINS & MINERALS =====
  {
    id: 'vitamin_d3',
    name: 'ویتامین D3',
    nameEn: 'Vitamin D3',
    category: 'ویتامین',
    type: 'ویتامین D',
    form: 'کپسول',
    dosage: {
      amount: 2000,
      unit: 'IU',
      timing: ['صبح با غذا'],
      frequency: 'روزانه'
    },
    benefits: [
      'استخوان‌های قوی',
      'پشتیبانی سیستم ایمنی',
      'بهبود خلق و خو',
      'افزایش قدرت عضلانی'
    ],
    ingredients: [
      'ویتامین D3 (کلکسی فرول)'
    ],
    sideEffects: [
      'مسمومیت (در مصرف بیش از حد)'
    ],
    researchRating: 5,
    costLevel: 'کم',
    vegan: false,
    allergens: []
  },
  {
    id: 'zinc_picolinate',
    name: 'روی پیکولینات',
    nameEn: 'Zinc Picolinate',
    category: 'معدن',
    type: 'روی',
    form: 'کپسول',
    dosage: {
      amount: 15,
      unit: 'میلی‌گرم',
      timing: ['شام'],
      frequency: 'روزانه'
    },
    benefits: [
      'پشتیبانی سیستم ایمنی',
      'سلامت پوست',
      'تولید تستوسترون',
      'بهبود ریکاوری'
    ],
    ingredients: [
      'روی پیکولینات'
    ],
    sideEffects: [
      'ناراحتی معده',
      'تهوع'
    ],
    contraindications: [
      'مصرف همزمان با آنتی‌بیوتیک‌ها'
    ],
    researchRating: 4,
    costLevel: 'کم',
    vegan: true
  },
  {
    id: 'magnesium_glycinate',
    name: 'منیزیم گلیسینات',
    nameEn: 'Magnesium Glycinate',
    category: 'معدن',
    type: 'منیزیم',
    form: 'کپسول',
    dosage: {
      amount: 400,
      unit: 'میلی‌گرم',
      timing: ['شب قبل خواب'],
      frequency: 'روزانه'
    },
    benefits: [
      'بهبود خواب',
      'کاهش استرس',
      'ریلکسیشن عضلانی',
      'سلامت قلب'
    ],
    ingredients: [
      'منیزیم گلیسینات'
    ],
    sideEffects: [
      'اسهال (در دوز بالا)'
    ],
    researchRating: 4,
    costLevel: 'متوسط',
    vegan: true
  },

  // ===== JOINT & RECOVERY =====
  {
    id: 'fish_oil',
    name: 'روغن ماهی',
    nameEn: 'Fish Oil',
    category: 'مفصل و ریکاوری',
    type: 'امگا-۳',
    form: 'کپسول',
    dosage: {
      amount: 1000,
      unit: 'میلی‌گرم',
      timing: ['با غذا'],
      frequency: '۲-۳ بار در روز'
    },
    benefits: [
      'کاهش التهاب',
      'سلامت مفاصل',
      'پشتیبانی قلب',
      'بهبود خلق و خو'
    ],
    ingredients: [
      'روغن ماهی',
      'EPA',
      'DHA'
    ],
    sideEffects: [
      'طعم ماهی',
      'ناراحتی معده',
      'رقیق شدن خون'
    ],
    contraindications: [
      'رقیق کننده‌های خون',
      'حساسیت به ماهی'
    ],
    researchRating: 5,
    costLevel: 'متوسط',
    vegan: false,
    allergens: ['ماهی']
  },
  {
    id: 'glucosamine_chondroitin',
    name: 'گلوکوزامین و کندروئیتین',
    nameEn: 'Glucosamine & Chondroitin',
    category: 'مفصل و ریکاوری',
    type: 'مفصل',
    form: 'کپسول',
    dosage: {
      amount: 1500,
      unit: 'میلی‌گرم گلوکوزامین',
      timing: ['با غذا'],
      frequency: 'روزانه'
    },
    benefits: [
      'حمایت از غضروف',
      'کاهش درد مفاصل',
      'بهبود تحرک',
      'حمایت از بافت همبند'
    ],
    ingredients: [
      'گلوکوزامین سولفات',
      'کندروئیتین سولفات'
    ],
    sideEffects: [
      'ناراحتی معده',
      'حساسیت پوستی'
    ],
    researchRating: 3,
    costLevel: 'متوسط',
    vegan: false
  },

  // ===== SLEEP & RECOVERY =====
  {
    id: 'melatonin',
    name: 'ملاتونین',
    nameEn: 'Melatonin',
    category: 'خواب و ریکاوری',
    type: 'ملاتونین',
    form: 'قرص',
    dosage: {
      amount: 3,
      unit: 'میلی‌گرم',
      timing: ['۳۰ دقیقه قبل خواب'],
      frequency: 'در صورت نیاز'
    },
    benefits: [
      'بهبود کیفیت خواب',
      'تنظیم ریتم شبانه‌روزی',
      'کاهش زمان به خواب رفتن'
    ],
    ingredients: [
      'ملاتونین'
    ],
    sideEffects: [
      'خواب‌آلودگی روز بعد',
      'سردرد',
      'تهوع'
    ],
    contraindications: [
      'بارداری',
      'شیردهی',
      'دیابت'
    ],
    researchRating: 4,
    costLevel: 'کم',
    vegan: true
  },
  {
    id: 'magnesium_l_threonate',
    name: 'منیزیم L-ترئونات',
    nameEn: 'Magnesium L-Threonate',
    category: 'خواب و ریکاوری',
    type: 'منیزیم',
    form: 'کپسول',
    dosage: {
      amount: 300,
      unit: 'میلی‌گرم',
      timing: ['شب'],
      frequency: 'روزانه'
    },
    benefits: [
      'عبور سد خونی-مغزی',
      'بهبود خواب',
      'پشتیبانی شناختی',
      'کاهش استرس'
    ],
    ingredients: [
      'منیزیم L-ترئونات'
    ],
    researchRating: 3,
    costLevel: 'بالا',
    vegan: true
  },

  // ===== TESTOSTERONE SUPPORT =====
  {
    id: 'zma_complex',
    name: 'کمپلکس ZMA',
    nameEn: 'ZMA Complex',
    category: 'تستوسترون',
    type: 'معدنی',
    form: 'کپسول',
    dosage: {
      amount: 1,
      unit: 'کپسول',
      timing: ['شب قبل خواب'],
      frequency: 'روزانه'
    },
    benefits: [
      'افزایش تستوسترون',
      'بهبود ریکاوری',
      'بهبود خواب',
      'افزایش قدرت'
    ],
    ingredients: [
      'روی',
      'منیزیم',
      'ویتامین B6'
    ],
    researchRating: 3,
    costLevel: 'متوسط',
    vegan: true
  },
  {
    id: 'd_aspartic_acid',
    name: 'اسید D-آسپارتیک',
    nameEn: 'D-Aspartic Acid',
    category: 'تستوسترون',
    type: 'آمینو اسید',
    form: 'کپسول',
    dosage: {
      amount: 3000,
      unit: 'میلی‌گرم',
      timing: ['صبح'],
      frequency: 'روزانه'
    },
    benefits: [
      'افزایش تستوسترون طبیعی',
      'بهبود باروری',
      'افزایش انرژی'
    ],
    ingredients: [
      'اسید D-آسپارتیک'
    ],
    researchRating: 3,
    costLevel: 'متوسط',
    vegan: true
  },

  // ===== WOMEN'S HEALTH =====
  {
    id: 'iron_bisglycinate',
    name: 'آهن بیس‌گلیسینات',
    nameEn: 'Iron Bisglycinate',
    category: 'سلامت زنان',
    type: 'آهن',
    form: 'کپسول',
    dosage: {
      amount: 18,
      unit: 'میلی‌گرم',
      timing: ['صبح با ویتامین C'],
      frequency: 'روزانه'
    },
    benefits: [
      'پیشگیری از کم خونی',
      'حمل اکسیژن بهتر',
      'افزایش انرژی',
      'پشتیبانی قاعدگی'
    ],
    ingredients: [
      'آهن بیس‌گلیسینات',
      'ویتامین C'
    ],
    sideEffects: [
      'یبوست',
      'تهوع',
      'مشکلات گوارشی'
    ],
    researchRating: 4,
    costLevel: 'متوسط',
    vegan: true
  },
  {
    id: 'calcium_magnesium_zinc',
    name: 'کلسیم، منیزیم، روی',
    nameEn: 'Calcium Magnesium Zinc',
    category: 'سلامت زنان',
    type: 'معدنی',
    form: 'قرص',
    dosage: {
      amount: 1,
      unit: 'قرص',
      timing: ['شب'],
      frequency: 'روزانه'
    },
    benefits: [
      'استخوان‌های قوی',
      'بهبود خواب',
      'پشتیبانی هورمونی',
      'کاهش PMS'
    ],
    ingredients: [
      'سیترات کلسیم',
      'منیزیم سیترات',
      'روی پیکولینات'
    ],
    researchRating: 3,
    costLevel: 'کم',
    vegan: true
  }
];

export default supplements;