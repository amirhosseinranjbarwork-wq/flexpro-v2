export interface SupplementItem {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  subcategory?: string;
  form: 'پودر' | 'کپسول' | 'قرص' | 'مایع' | 'ژل';
  dosage: {
    amount: number;
    unit: string;
    timing: string[];
    frequency: string;
  };
  benefits: string[];
  ingredients?: string[];
  sideEffects?: string[];
  contraindications?: string[];
  researchRating: 1 | 2 | 3 | 4 | 5;
  costLevel: 'کم' | 'متوسط' | 'بالا';
  vegan: boolean;
  evidence: 'قوی' | 'متوسط' | 'محدود';
  timing: 'صبح' | 'قبل تمرین' | 'بعد تمرین' | 'شب' | 'هر زمان';
}

export const supplementsComplete: SupplementItem[] = [
  // ===== PROTEIN SUPPLEMENTS =====
  {
    id: 'whey_protein',
    name: 'پروتئین وی',
    nameEn: 'Whey Protein',
    category: 'پروتئین',
    subcategory: 'پروتئین وی',
    form: 'پودر',
    dosage: {
      amount: 25,
      unit: 'گرم',
      timing: ['بعد از تمرین', 'بین وعده‌ها'],
      frequency: '۱-۳ بار در روز'
    },
    benefits: [
      'رشد عضلات',
      'جذب سریع پروتئین',
      'بهبود ریکاوری',
      'حفاظت از عضلات'
    ],
    ingredients: ['پروتئین وی کنسانتره'],
    sideEffects: ['ناراحتی معده در برخی افراد'],
    researchRating: 5,
    costLevel: 'کم',
    vegan: false,
    evidence: 'قوی',
    timing: 'بعد تمرین'
  },
  {
    id: 'whey_isolate',
    name: 'پروتئین وی ایزوله',
    nameEn: 'Whey Protein Isolate',
    category: 'پروتئین',
    subcategory: 'پروتئین وی',
    form: 'پودر',
    dosage: {
      amount: 25,
      unit: 'گرم',
      timing: ['بعد از تمرین', 'صبح'],
      frequency: '۱-۲ بار در روز'
    },
    benefits: [
      'پروتئین خالص بالا',
      'کربوهیدرات و چربی کم',
      'جذب بسیار سریع',
      'مناسب برای رژیم‌های کم‌کربوهیدرات'
    ],
    ingredients: ['پروتئین وی ایزوله'],
    researchRating: 5,
    costLevel: 'متوسط',
    vegan: false,
    evidence: 'قوی',
    timing: 'بعد تمرین'
  },
  {
    id: 'casein_protein',
    name: 'پروتئین کازئین',
    nameEn: 'Casein Protein',
    category: 'پروتئین',
    subcategory: 'پروتئین وی',
    form: 'پودر',
    dosage: {
      amount: 25,
      unit: 'گرم',
      timing: ['شب قبل خواب', 'بین وعده‌ها'],
      frequency: '۱ بار در روز'
    },
    benefits: [
      'جذب کند پروتئین',
      'حفاظت از عضلات در طول خواب',
      'شعاع سیری بالا',
      'مناسب برای کاهش وزن'
    ],
    ingredients: ['میسلار کازئین'],
    researchRating: 4,
    costLevel: 'متوسط',
    vegan: false,
    evidence: 'قوی',
    timing: 'شب'
  },
  {
    id: 'plant_protein',
    name: 'پروتئین گیاهی',
    nameEn: 'Plant Protein',
    category: 'پروتئین',
    subcategory: 'پروتئین گیاهی',
    form: 'پودر',
    dosage: {
      amount: 25,
      unit: 'گرم',
      timing: ['بعد از تمرین', 'صبح'],
      frequency: '۱-۲ بار در روز'
    },
    benefits: [
      'مناسب برای گیاهخواران',
      'فیبر بالا',
      'آنتی‌اکسیدان',
      'کم کالری'
    ],
    ingredients: ['پروتئین نخود', 'پروتئین برنج', 'پروتئین کنف'],
    researchRating: 4,
    costLevel: 'متوسط',
    vegan: true,
    evidence: 'قوی',
    timing: 'بعد تمرین'
  },

  // ===== CREATINE =====
  {
    id: 'creatine_monohydrate',
    name: 'کراتین مونوهیدرات',
    nameEn: 'Creatine Monohydrate',
    category: 'قدرت و عملکرد',
    subcategory: 'کراتین',
    form: 'پودر',
    dosage: {
      amount: 5,
      unit: 'گرم',
      timing: ['هر زمان از روز'],
      frequency: 'روزانه'
    },
    benefits: [
      'افزایش قدرت عضلانی',
      'بهبود عملکرد HIIT',
      'افزایش حجم عضلات',
      'بهبود ریکاوری'
    ],
    ingredients: ['کراتین مونوهیدرات'],
    sideEffects: ['ورم موقتی عضلات', 'ناراحتی معده'],
    contraindications: ['مشکلات کلیوی'],
    researchRating: 5,
    costLevel: 'کم',
    vegan: true,
    evidence: 'قوی',
    timing: 'هر زمان'
  },
  {
    id: 'creatine_hcl',
    name: 'کراتین HCL',
    nameEn: 'Creatine HCl',
    category: 'قدرت و عملکرد',
    subcategory: 'کراتین',
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
      'دوز کمتر',
      'اثربخشی بالا'
    ],
    ingredients: ['کراتین هیدروکلراید'],
    researchRating: 4,
    costLevel: 'بالا',
    vegan: true,
    evidence: 'متوسط',
    timing: 'هر زمان'
  },

  // ===== BCAAs =====
  {
    id: 'bcaa_powder',
    name: 'BCAA پودر',
    nameEn: 'BCAA Powder',
    category: 'آمینو اسید',
    subcategory: 'BCAA',
    form: 'پودر',
    dosage: {
      amount: 5,
      unit: 'گرم',
      timing: ['طی تمرین', 'بعد از تمرین'],
      frequency: '۱-۲ بار در روز'
    },
    benefits: [
      'کاهش شکست عضلانی',
      'بهبود ریکاوری',
      'افزایش سنتز پروتئین',
      'کاهش خستگی'
    ],
    ingredients: ['لوسین', 'ایزولوسین', 'والین'],
    researchRating: 4,
    costLevel: 'متوسط',
    vegan: true,
    evidence: 'قوی',
    timing: 'طی تمرین'
  },
  {
    id: 'glutamine',
    name: 'گلوتامین',
    nameEn: 'Glutamine',
    category: 'آمینو اسید',
    subcategory: 'گلوتامین',
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
    ingredients: ['گلوتامین خالص'],
    researchRating: 4,
    costLevel: 'کم',
    vegan: true,
    evidence: 'قوی',
    timing: 'بعد تمرین'
  },

  // ===== PRE-WORKOUT =====
  {
    id: 'beta_alanine',
    name: 'بتا آلانین',
    nameEn: 'Beta-Alanine',
    category: 'قبل تمرین',
    subcategory: 'استقامت',
    form: 'پودر',
    dosage: {
      amount: 3,
      unit: 'گرم',
      timing: ['۳۰ دقیقه قبل تمرین'],
      frequency: 'قبل از تمرین'
    },
    benefits: [
      'افزایش کارنوزین عضلانی',
      'بهبود تحمل تمرین شدید',
      'کاهش خستگی عضلانی',
      'افزایش قدرت'
    ],
    ingredients: ['بتا آلانین'],
    sideEffects: ['گزگز پوست (پارستزی)'],
    researchRating: 5,
    costLevel: 'کم',
    vegan: true,
    evidence: 'قوی',
    timing: 'قبل تمرین'
  },
  {
    id: 'citrulline_malate',
    name: 'سیترولین مالات',
    nameEn: 'Citrulline Malate',
    category: 'قبل تمرین',
    subcategory: 'پام',
    form: 'پودر',
    dosage: {
      amount: 6,
      unit: 'گرم',
      timing: ['۲۰-۳۰ دقیقه قبل تمرین'],
      frequency: 'قبل از تمرین سنگین'
    },
    benefits: [
      'افزایش تولید اکسید نیتریک',
      'بهبود پام عضلانی',
      'کاهش خستگی',
      'بهبود ریکاوری'
    ],
    ingredients: ['سیترولین مالات'],
    researchRating: 4,
    costLevel: 'متوسط',
    vegan: true,
    evidence: 'قوی',
    timing: 'قبل تمرین'
  },
  {
    id: 'caffeine',
    name: 'کافئین',
    nameEn: 'Caffeine',
    category: 'قبل تمرین',
    subcategory: 'انرژی',
    form: 'کپسول',
    dosage: {
      amount: 200,
      unit: 'میلی‌گرم',
      timing: ['۳۰-۶۰ دقیقه قبل تمرین'],
      frequency: 'قبل از تمرین'
    },
    benefits: [
      'افزایش انرژی',
      'بهبود تمرکز',
      'افزایش چربی سوزی',
      'بهبود عملکرد'
    ],
    ingredients: ['کافئین آنهیدروس'],
    sideEffects: ['افزایش ضربان قلب', 'عصبی بودن', 'بی‌خوابی'],
    contraindications: ['مشکلات قلبی', 'حساسیت به کافئین'],
    researchRating: 5,
    costLevel: 'کم',
    vegan: true,
    evidence: 'قوی',
    timing: 'قبل تمرین'
  },

  // ===== FAT BURNERS =====
  {
    id: 'green_tea_extract',
    name: 'استخراج چای سبز',
    nameEn: 'Green Tea Extract',
    category: 'چاقی سوزی',
    subcategory: 'آنتی‌اکسیدان',
    form: 'کپسول',
    dosage: {
      amount: 500,
      unit: 'میلی‌گرم',
      timing: ['صبح', 'قبل غذا'],
      frequency: '۲-۳ بار در روز'
    },
    benefits: [
      'افزایش متابولیسم',
      'آنتی‌اکسیدان قوی',
      'حمایت از سلامت قلب',
      'بهبود چربی سوزی'
    ],
    ingredients: ['استخراج چای سبز', 'EGCG'],
    sideEffects: ['ناراحتی معده'],
    researchRating: 4,
    costLevel: 'متوسط',
    vegan: true,
    evidence: 'قوی',
    timing: 'صبح'
  },
  {
    id: 'cla',
    name: 'CLA',
    nameEn: 'Conjugated Linoleic Acid',
    category: 'چاقی سوزی',
    subcategory: 'اسیدهای چرب',
    form: 'کپسول',
    dosage: {
      amount: 3000,
      unit: 'میلی‌گرم',
      timing: ['با غذا'],
      frequency: '۲-۳ بار در روز'
    },
    benefits: [
      'کاهش چربی بدن',
      'حفاظت از عضلات',
      'تقویت سیستم ایمنی',
      'بهبود متابولیسم'
    ],
    ingredients: ['اسید لینولئیک مزدوج'],
    researchRating: 3,
    costLevel: 'متوسط',
    vegan: false,
    evidence: 'متوسط',
    timing: 'با غذا'
  },

  // ===== VITAMINS & MINERALS =====
  {
    id: 'vitamin_d3',
    name: 'ویتامین D3',
    nameEn: 'Vitamin D3',
    category: 'ویتامین',
    subcategory: 'ویتامین D',
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
    ingredients: ['ویتامین D3 کلکسی فرول'],
    sideEffects: ['مسمومیت در دوز بسیار بالا'],
    researchRating: 5,
    costLevel: 'کم',
    vegan: false,
    evidence: 'قوی',
    timing: 'صبح'
  },
  {
    id: 'zinc',
    name: 'روی',
    nameEn: 'Zinc',
    category: 'معدن',
    subcategory: 'روی',
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
    ingredients: ['سیترات روی'],
    sideEffects: ['ناراحتی معده'],
    contraindications: ['مصرف همزمان با آنتی‌بیوتیک‌ها'],
    researchRating: 4,
    costLevel: 'کم',
    vegan: true,
    evidence: 'قوی',
    timing: 'شب'
  },
  {
    id: 'magnesium',
    name: 'منیزیم',
    nameEn: 'Magnesium',
    category: 'معدن',
    subcategory: 'منیزیم',
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
    ingredients: ['سیترات منیزیم'],
    sideEffects: ['اسهال در دوز بالا'],
    researchRating: 4,
    costLevel: 'متوسط',
    vegan: true,
    evidence: 'قوی',
    timing: 'شب'
  },

  // ===== JOINT & RECOVERY =====
  {
    id: 'fish_oil',
    name: 'روغن ماهی',
    nameEn: 'Fish Oil',
    category: 'مفصل و ریکاوری',
    subcategory: 'امگا-۳',
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
    ingredients: ['روغن ماهی', 'EPA', 'DHA'],
    sideEffects: ['طعم ماهی', 'رقیق شدن خون'],
    contraindications: ['رقیق کننده‌های خون'],
    researchRating: 5,
    costLevel: 'متوسط',
    vegan: false,
    evidence: 'قوی',
    timing: 'با غذا'
  },
  {
    id: 'glucosamine',
    name: 'گلوکوزامین',
    nameEn: 'Glucosamine',
    category: 'مفصل و ریکاوری',
    subcategory: 'مفصل',
    form: 'قرص',
    dosage: {
      amount: 1500,
      unit: 'میلی‌گرم',
      timing: ['با غذا'],
      frequency: 'روزانه'
    },
    benefits: [
      'حمایت از غضروف',
      'کاهش درد مفاصل',
      'بهبود تحرک',
      'حمایت از بافت همبند'
    ],
    ingredients: ['گلوکوزامین سولفات'],
    researchRating: 3,
    costLevel: 'متوسط',
    vegan: false,
    evidence: 'متوسط',
    timing: 'با غذا'
  },

  // ===== SLEEP & RECOVERY =====
  {
    id: 'melatonin',
    name: 'ملاتونین',
    nameEn: 'Melatonin',
    category: 'خواب و ریکاوری',
    subcategory: 'ملاتونین',
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
    ingredients: ['ملاتونین'],
    sideEffects: ['خواب‌آلودگی روز بعد'],
    contraindications: ['بارداری', 'دیابت'],
    researchRating: 4,
    costLevel: 'کم',
    vegan: true,
    evidence: 'قوی',
    timing: 'شب'
  },
  {
    id: 'ashwagandha',
    name: 'آشواگاندا',
    nameEn: 'Ashwagandha',
    category: 'خواب و ریکاوری',
    subcategory: 'آداپتوژن',
    form: 'کپسول',
    dosage: {
      amount: 300,
      unit: 'میلی‌گرم',
      timing: ['صبح یا شب'],
      frequency: 'روزانه'
    },
    benefits: [
      'کاهش استرس',
      'بهبود خواب',
      'تقویت سیستم ایمنی',
      'کاهش التهاب'
    ],
    ingredients: ['ریشه آشواگاندا'],
    researchRating: 3,
    costLevel: 'متوسط',
    vegan: true,
    evidence: 'متوسط',
    timing: 'شب'
  }
];

export default supplementsComplete;