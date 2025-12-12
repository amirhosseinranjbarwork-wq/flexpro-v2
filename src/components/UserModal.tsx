import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { User as UserIcon, Activity, Heart, DollarSign, Ruler, Scale, Calculator, TrendingUp } from 'lucide-react';
import type { User, UserInput } from '../types/index';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserInput) => void;
  initialData?: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const initialFormState: UserInput = {
    name: '', phone: '', age: '', gender: 'male',
    height: '', weight: '', activity: '1.55',
    injuries: [], notes: '',
    exp: '', level: 'beginner', job: '', allergy: '',
    days: '', sleep: 'fair', smoke: 'no', alcohol: 'no', caffeine: 'no',
    financial: { startDate: '', duration: 1, amount: 0 },
    measurements: { neck: '', hip: '', thigh: '', arm: '', waist: '', wrist: '', calf: '', chest: '', shoulder: '' },
    email: '', address: '', education: '', maritalStatus: 'single',
    medicalConditions: [], medications: '', dietType: '', nutritionGoals: '',
    waterIntake: '', mealFrequency: '', foodPreferences: [],
    targetWeight: '', bodyFat: '',
    plans: { workouts: {}, diet: [], dietRest: [], supps: [], prog: [] }
  };

  const [formData, setFormData] = useState<UserInput>(initialFormState);
  const [activeTab, setActiveTab] = useState('identity');

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => {
      if (initialData) {
        setFormData(JSON.parse(JSON.stringify(initialData)) as UserInput);
      } else {
        setFormData(initialFormState);
      }
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isOpen]);

  // محاسبات علمی پیشرفته
  const calculations = useMemo(() => {
    const w = parseFloat(String(formData.weight ?? '')) || 0;
    const h = parseFloat(String(formData.height ?? '')) || 0;
    const a = parseFloat(String(formData.age ?? '')) || 0;
    const waist = parseFloat(String(formData.measurements?.waist ?? '')) || 0;
    const hip = parseFloat(String(formData.measurements?.hip ?? '')) || 0;
    const neck = parseFloat(String(formData.measurements?.neck ?? '')) || 0;
    const isMale = formData.gender !== 'female';
    const activityFactor = parseFloat(String(formData.activity ?? '')) || 1.2;
    const goal = formData.nutritionGoals || 'maintenance';
    const trainingDays = parseInt(String(formData.days ?? '3'), 10) || 3;

    // BMI (Body Mass Index)
    // Validation: اطمینان از مقادیر معتبر
    let bmi = 0;
    let bmiCategory = 'نامعتبر';
    let bmiColor = 'text-slate-400';
    
    if (h > 0 && w > 0 && h <= 300 && w <= 500 && !isNaN(h) && !isNaN(w)) {
      const heightM = h / 100;
      if (heightM > 0 && !isNaN(heightM)) {
        const bmiVal = w / (heightM * heightM);
        if (!isNaN(bmiVal) && bmiVal > 0 && bmiVal < 100) {
          bmi = Number(bmiVal.toFixed(1));
          
          // دسته‌بندی BMI
          if (bmi < 16) { bmiCategory = 'لاغری شدید'; bmiColor = 'text-red-500'; }
          else if (bmi < 17) { bmiCategory = 'لاغری متوسط'; bmiColor = 'text-amber-500'; }
          else if (bmi < 18.5) { bmiCategory = 'کمبود وزن'; bmiColor = 'text-yellow-500'; }
          else if (bmi < 25) { bmiCategory = 'نرمال'; bmiColor = 'text-emerald-500'; }
          else if (bmi < 30) { bmiCategory = 'اضافه وزن'; bmiColor = 'text-amber-500'; }
          else if (bmi < 35) { bmiCategory = 'چاقی درجه 1'; bmiColor = 'text-red-400'; }
          else if (bmi < 40) { bmiCategory = 'چاقی درجه 2'; bmiColor = 'text-red-500'; }
          else { bmiCategory = 'چاقی مفرط'; bmiColor = 'text-red-600'; }
        }
      }
    }

    // WHR (Waist-to-Hip Ratio)
    // Validation: اطمینان از مقادیر معتبر و جلوگیری از تقسیم بر صفر
    let whr = 0;
    let whrRisk = 'نامعتبر';
    let whrColor = 'text-slate-400';
    
    if (waist > 0 && hip > 0 && waist <= 200 && hip <= 200 && !isNaN(waist) && !isNaN(hip)) {
      const whrVal = waist / hip;
      if (!isNaN(whrVal) && whrVal > 0 && whrVal < 5) {
        whr = Number(whrVal.toFixed(2));
        
        // دسته‌بندی WHR بر اساس جنسیت
        if (isMale) {
          if (whr < 0.9) { whrRisk = 'کم (سالم)'; whrColor = 'text-emerald-500'; }
          else if (whr < 1.0) { whrRisk = 'متوسط'; whrColor = 'text-yellow-500'; }
          else { whrRisk = 'بالا (خطرناک)'; whrColor = 'text-red-500'; }
        } else {
          if (whr < 0.8) { whrRisk = 'کم (سالم)'; whrColor = 'text-emerald-500'; }
          else if (whr < 0.85) { whrRisk = 'متوسط'; whrColor = 'text-yellow-500'; }
          else { whrRisk = 'بالا (خطرناک)'; whrColor = 'text-red-500'; }
        }
      }
    }

    // BMR (Basal Metabolic Rate) - فرمول‌های به‌روز و دقیق (2024)
    // Validation: اطمینان از مقادیر معتبر
    let bmr = 0;
    if (w > 0 && h > 0 && a > 0 && w <= 500 && h <= 300 && a <= 150 && !isNaN(w) && !isNaN(h) && !isNaN(a)) {
      // 1. Mifflin-St Jeor (دقیق‌ترین برای افراد عادی - استاندارد طلایی 2024)
      // فرمول: BMR = 10 × وزن(kg) + 6.25 × قد(cm) - 5 × سن(سال) + (جنسیت)
      const mifflin = 10 * w + 6.25 * h - 5 * a + (isMale ? 5 : -161);
      if (isNaN(mifflin) || mifflin <= 0 || mifflin > 10000) {
        bmr = 0;
      } else {
        // 2. Harris-Benedict (اصلاح شده 1984 - برای مقایسه)
        const harrisBenedict = isMale 
          ? 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)
          : 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
        
        if (isNaN(harrisBenedict) || harrisBenedict <= 0 || harrisBenedict > 10000) {
          bmr = Math.max(0, Math.round(mifflin));
        } else {
          // 3. Katch-McArdle (برای افراد با درصد چربی مشخص - دقیق‌ترین)
          // فرمول: BMR = 370 + (21.6 × توده بدون چربی)
          let katch = 0;
          const bodyFatInput = parseFloat(String(formData.bodyFat ?? '')) || 0;
          if (bodyFatInput > 0 && bodyFatInput < 100 && !isNaN(bodyFatInput)) {
            const leanMass = w * (1 - bodyFatInput / 100);
            if (leanMass > 0 && leanMass <= w && !isNaN(leanMass)) {
              katch = 370 + (21.6 * leanMass);
              if (isNaN(katch) || katch <= 0 || katch > 10000) {
                katch = 0;
              }
            }
          }
          
          // 4. Cunningham (برای ورزشکاران با توده عضلانی بالا - 1980)
          // فرمول: BMR = 500 + (22 × توده بدون چربی)
          let cunningham = 0;
          if (bodyFatInput > 0 && bodyFatInput < 100 && !isNaN(bodyFatInput)) {
            const leanMass = w * (1 - bodyFatInput / 100);
            if (leanMass > 0 && leanMass <= w && !isNaN(leanMass)) {
              cunningham = 500 + (22 * leanMass);
              if (isNaN(cunningham) || cunningham <= 0 || cunningham > 10000) {
                cunningham = 0;
              }
            }
          }
          
          // میانگین‌گیری هوشمند بر اساس داده‌های موجود
          // اگر درصد چربی موجود باشد: Katch (40%) + Cunningham (20%) + Mifflin (25%) + Harris (15%)
          // اگر درصد چربی موجود نباشد: Mifflin (60%) + Harris (40%)
          if (katch > 0 && cunningham > 0 && !isNaN(katch) && !isNaN(cunningham)) {
            bmr = Math.max(0, Math.round((mifflin * 0.25 + harrisBenedict * 0.15 + katch * 0.40 + cunningham * 0.20)));
          } else if (katch > 0 && !isNaN(katch)) {
            bmr = Math.max(0, Math.round((mifflin * 0.35 + harrisBenedict * 0.25 + katch * 0.40)));
          } else {
            bmr = Math.max(0, Math.round((mifflin * 0.60 + harrisBenedict * 0.40)));
          }
        }
      }
    }
    
    // Validation نهایی: اطمینان از BMR معتبر
    if (bmr <= 0 || isNaN(bmr) || bmr > 10000) {
      bmr = 0;
    }

    // تعدیل ضریب فعالیت بر اساس تعداد روزهای تمرین
    // Validation: اطمینان از activityFactor معتبر
    let validActivityFactor = activityFactor;
    if (isNaN(activityFactor) || activityFactor < 1.2 || activityFactor > 2.5) {
      validActivityFactor = 1.55; // مقدار پیش‌فرض
    }
    
    let baseActivityFactor = validActivityFactor;
    if (trainingDays >= 6) baseActivityFactor = Math.max(validActivityFactor, 1.725);
    else if (trainingDays >= 4) baseActivityFactor = Math.max(validActivityFactor, 1.55);
    else if (trainingDays >= 2) baseActivityFactor = Math.max(validActivityFactor, 1.375);
    else baseActivityFactor = Math.max(validActivityFactor, 1.2);
    
    // Validation: اطمینان از baseActivityFactor معتبر
    if (isNaN(baseActivityFactor) || baseActivityFactor < 1.2 || baseActivityFactor > 2.5) {
      baseActivityFactor = 1.55;
    }
    
    // تعدیل TDEE بر اساس هدف ورزشکار
    let adjustedActivityFactor = baseActivityFactor;
    switch (goal) {
      case 'weight-loss':
        // برای کاهش وزن، TDEE کمی کمتر (کاهش 5-10%)
        adjustedActivityFactor = Math.max(1.2, baseActivityFactor * 0.92);
        break;
      case 'muscle-gain':
        // برای عضله‌سازی، TDEE بیشتر (افزایش 8-12%)
        adjustedActivityFactor = Math.min(2.5, baseActivityFactor * 1.10);
        break;
      case 'weight-gain':
        // برای افزایش وزن، TDEE بیشتر (افزایش 10-15%)
        adjustedActivityFactor = Math.min(2.5, baseActivityFactor * 1.12);
        break;
      case 'recomp':
        // برای ریکامپ، TDEE نزدیک به پایه (کاهش 2-5%)
        adjustedActivityFactor = Math.max(1.2, baseActivityFactor * 0.97);
        break;
      default:
        // maintenance: TDEE پایه
        adjustedActivityFactor = baseActivityFactor;
    }
    
    // Validation: اطمینان از adjustedActivityFactor معتبر
    if (isNaN(adjustedActivityFactor) || adjustedActivityFactor < 1.2 || adjustedActivityFactor > 2.5) {
      adjustedActivityFactor = baseActivityFactor;
    }

    // TDEE (Total Daily Energy Expenditure) - بر اساس هدف ورزشکار
    const tdee = bmr > 0 ? Math.max(0, Math.round(bmr * adjustedActivityFactor)) : 0;
    
    // Validation: اطمینان از TDEE معتبر
    let validTDEE = tdee;
    if (tdee <= 0 || isNaN(tdee) || tdee > 20000) {
      // اگر TDEE نامعتبر است، از BMR استفاده کن
      validTDEE = bmr > 0 ? Math.round(bmr * 1.55) : 0;
    }

    // محاسبه کالری هدف بر اساس هدف تغذیه‌ای
    // Validation: اطمینان از tdee معتبر
    if (validTDEE <= 0 || isNaN(validTDEE)) {
      return { 
        bmi, bmiCategory, bmiColor, 
        whr, whrRisk, whrColor, 
        bmr, tdee: 0, bodyFatPercent: 0, leanBodyMass: 0,
        idealWeightMin: 0, idealWeightMax: 0, idealWeight: 0,
        targetCalories: 0, calorieAdjustment: 0,
        protein: 0, fat: 0, carbs: 0, waterNeed: 0,
        adjustedActivityFactor: 0
      };
    }
    
    let targetCalories = validTDEE;
    let calorieAdjustment = 0;
    switch (goal) {
      case 'weight-loss': {
        calorieAdjustment = -500; // کسری 500 کالری برای کاهش نیم کیلو در هفته
        // حداقل کالری برای حفظ سلامت: BMR یا 1200 کالری (هر کدام بیشتر باشد)
        const minCalories = Math.max(bmr, 1200);
        targetCalories = Math.max(minCalories, validTDEE - 500);
        break;
      }
      case 'weight-gain': {
        calorieAdjustment = 400; // مازاد 400 کالری
        targetCalories = Math.min(10000, validTDEE + 400); // حداکثر 10000 کالری
        break;
      }
      case 'muscle-gain': {
        calorieAdjustment = 300; // مازاد 300 کالری با پروتئین بالا
        targetCalories = Math.min(10000, validTDEE + 300); // حداکثر 10000 کالری
        break;
      }
      case 'recomp': {
        calorieAdjustment = 0; // حفظ کالری با تغییر ترکیب بدن
        targetCalories = validTDEE;
        break;
      }
      default: {
        targetCalories = validTDEE;
      }
    }
    
    // Validation نهایی: اطمینان از targetCalories معتبر
    if (targetCalories <= 0 || isNaN(targetCalories) || targetCalories > 20000) {
      targetCalories = validTDEE; // fallback به TDEE
    }

    // Body Fat % - فرمول‌های به‌روز (Navy Formula 2024 + Deurenberg)
    let bodyFatPercent = parseFloat(String(formData.bodyFat ?? '')) || 0;
    if (bodyFatPercent === 0 && waist > 0 && neck > 0 && h > 0) {
      const waistNeckDiff = waist - neck;
      if (waistNeckDiff > 0 && !isNaN(waistNeckDiff)) {
        if (isMale) {
          // فرمول Navy برای مردان (به‌روز شده)
          // فرمول: %BF = 495 / (1.0324 - 0.19077 × log10(کمر - گردن) + 0.15456 × log10(قد)) - 450
          const logWaistNeck = Math.log10(waistNeckDiff);
          const logHeight = Math.log10(h);
          if (!isNaN(logWaistNeck) && !isNaN(logHeight) && logWaistNeck > 0 && logHeight > 0) {
            const denominator = 1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight;
            if (denominator > 0 && !isNaN(denominator)) {
              bodyFatPercent = (495 / denominator) - 450;
            }
          }
        } else if (hip > 0 && !isNaN(hip)) {
          // فرمول Navy برای زنان (به‌روز شده)
          // فرمول: %BF = 495 / (1.29579 - 0.35004 × log10(کمر + لگن - گردن) + 0.22100 × log10(قد)) - 450
          const waistHipNeck = waist + hip - neck;
          if (waistHipNeck > 0 && !isNaN(waistHipNeck)) {
            const logWaistHipNeck = Math.log10(waistHipNeck);
            const logHeight = Math.log10(h);
            if (!isNaN(logWaistHipNeck) && !isNaN(logHeight) && logWaistHipNeck > 0 && logHeight > 0) {
              const denominator = 1.29579 - 0.35004 * logWaistHipNeck + 0.22100 * logHeight;
              if (denominator > 0 && !isNaN(denominator)) {
                bodyFatPercent = (495 / denominator) - 450;
              }
            }
          }
        }
        
        // فرمول Deurenberg (برای مقایسه و اعتبارسنجی)
        // فرمول: %BF = 1.2 × (BMI) + 0.23 × (سن) - 10.8 × (جنسیت) - 5.4
        if (bodyFatPercent > 0 && !isNaN(bodyFatPercent)) {
          const heightM = h / 100;
          if (heightM > 0 && !isNaN(heightM)) {
            const bmiVal = w / (heightM * heightM);
            if (!isNaN(bmiVal) && bmiVal > 0) {
              const deurenberg = 1.2 * bmiVal + 0.23 * a - 10.8 * (isMale ? 1 : 0) - 5.4;
              if (!isNaN(deurenberg) && deurenberg > 0 && deurenberg < 100) {
                // میانگین Navy و Deurenberg برای دقت بیشتر
                bodyFatPercent = (bodyFatPercent * 0.7 + deurenberg * 0.3);
              }
            }
          }
        }
        
        if (!isNaN(bodyFatPercent) && bodyFatPercent > 0) {
          // محدود کردن به محدوده منطقی (3-50% برای مردان، 10-50% برای زنان)
          const minBF = isMale ? 3 : 10;
          bodyFatPercent = Math.max(minBF, Math.min(50, bodyFatPercent));
        } else {
          bodyFatPercent = 0;
        }
      }
    }
    bodyFatPercent = bodyFatPercent > 0 && !isNaN(bodyFatPercent) ? Number(bodyFatPercent.toFixed(1)) : 0;

    // توده عضلانی بدون چربی (LBM)
    const leanBodyMass = bodyFatPercent > 0 && w > 0 ? Math.max(0, Math.round(w * (1 - bodyFatPercent / 100))) : 0;

    // Ideal Weight Range (BMI 18.5-24.9)
    const heightM = h > 0 ? h / 100 : 0;
    const idealWeightMin = heightM > 0 && !isNaN(heightM) ? Math.max(0, Math.round(18.5 * heightM * heightM)) : 0;
    const idealWeightMax = heightM > 0 && !isNaN(heightM) ? Math.max(0, Math.round(24.9 * heightM * heightM)) : 0;
    
    // وزن ایده‌آل با فرمول‌های به‌روز (2024)
    let idealWeight = 0;
    if (h > 0 && h <= 300 && !isNaN(h)) {
      const heightInches = h / 2.54;
      
      // 1. Devine Formula (1974) - برای محاسبه دوز دارو
      const devine = isMale 
        ? 50 + 2.3 * (heightInches - 60)
        : 45.5 + 2.3 * (heightInches - 60);
      
      // 2. Robinson Formula (1983) - برای BMI
      const robinson = isMale
        ? 52 + 1.9 * (heightInches - 60)
        : 49 + 1.7 * (heightInches - 60);
      
      // 3. Miller Formula (1983) - برای دقت بیشتر
      const miller = isMale
        ? 56.2 + 1.41 * (heightInches - 60)
        : 53.1 + 1.36 * (heightInches - 60);
      
      // 4. Hamwi Formula (1964) - برای محاسبه وزن ایده‌آل
      const hamwi = isMale
        ? 48 + 2.7 * (heightInches - 60)
        : 45.5 + 2.2 * (heightInches - 60);
      
      // میانگین‌گیری از تمام فرمول‌ها برای دقت بیشتر
      if (!isNaN(devine) && !isNaN(robinson) && !isNaN(miller) && !isNaN(hamwi) && 
          devine > 0 && robinson > 0 && miller > 0 && hamwi > 0) {
        idealWeight = Math.max(0, Math.round((devine * 0.25 + robinson * 0.30 + miller * 0.25 + hamwi * 0.20)));
      } else if (!isNaN(devine) && !isNaN(robinson) && devine > 0 && robinson > 0) {
        idealWeight = Math.max(0, Math.round((devine + robinson) / 2));
      }
    }

    // محاسبه ماکروها بر اساس هدف - فرمول‌های به‌روز (تحقیقات 2024)
    // Validation: اطمینان از مقادیر معتبر
    let protein = 0, carbs = 0, fat = 0;
    
    if (targetCalories <= 0 || w <= 0 || isNaN(targetCalories) || isNaN(w)) {
      // اگر مقادیر معتبر نیستند، ماکروها را صفر می‌کنیم
    } else {
      // محاسبه توده بدون چربی برای تنظیمات دقیق‌تر
      const leanBodyMass = bodyFatPercent > 0 ? w * (1 - bodyFatPercent / 100) : w * 0.85; // فرض 15% چربی اگر مشخص نباشد
      
      switch (goal) {
        case 'weight-loss': {
          // پروتئین: 2.3-2.6g/kg وزن بدن (یا 3.0-3.3g/kg توده بدون چربی) - تحقیقات 2024
          // برای حفظ حداکثر عضله در کسری کالری
          protein = Math.max(0, Math.round(Math.max(w * 2.4, leanBodyMass * 3.1)));
          // چربی: 25-30% کالری (حداقل 0.6g/kg برای سلامت هورمونی)
          const minFat = Math.max(0, Math.round(w * 0.6)); // حداقل چربی
          fat = Math.max(minFat, Math.round(targetCalories * 0.27 / 9));
          // کربوهیدرات: باقیمانده (کم برای کاهش وزن)
          const remainingCaloriesWL = targetCalories - (protein * 4) - (fat * 9);
          carbs = Math.max(0, Math.round(remainingCaloriesWL / 4));
          break;
        }
        case 'muscle-gain': {
          // پروتئین: 2.0-2.2g/kg وزن بدن (یا 2.5-2.8g/kg توده بدون چربی) - تحقیقات 2024
          protein = Math.max(0, Math.round(Math.max(w * 2.1, leanBodyMass * 2.6)));
          // چربی: 25-30% کالری (برای تولید تستوسترون و هورمون‌های آنابولیک)
          fat = Math.max(0, Math.round(targetCalories * 0.28 / 9));
          // کربوهیدرات: باقیمانده (بالا برای انرژی و ریکاوری)
          const remainingCaloriesMG = targetCalories - (protein * 4) - (fat * 9);
          carbs = Math.max(0, Math.round(remainingCaloriesMG / 4));
          break;
        }
        case 'weight-gain': {
          // پروتئین: 1.6-1.8g/kg وزن بدن (برای افزایش وزن سالم)
          protein = Math.max(0, Math.round(w * 1.7));
          // چربی: 30-35% کالری (برای کالری متراکم)
          fat = Math.max(0, Math.round(targetCalories * 0.32 / 9));
          // کربوهیدرات: باقیمانده (بالا برای افزایش وزن)
          const remainingCaloriesWG = targetCalories - (protein * 4) - (fat * 9);
          carbs = Math.max(0, Math.round(remainingCaloriesWG / 4));
          break;
        }
        case 'recomp': {
          // پروتئین: 2.5-3.0g/kg وزن بدن (یا 3.2-3.7g/kg توده بدون چربی) - تحقیقات 2024
          // برای ریکامپ نیاز به پروتئین خیلی بالا
          protein = Math.max(0, Math.round(Math.max(w * 2.7, leanBodyMass * 3.4)));
          // چربی: 30-35% کالری (برای سلامت هورمونی در کسری کالری)
          fat = Math.max(0, Math.round(targetCalories * 0.32 / 9));
          // کربوهیدرات: باقیمانده (متوسط برای ریکامپ)
          const remainingCaloriesRC = targetCalories - (protein * 4) - (fat * 9);
          carbs = Math.max(0, Math.round(remainingCaloriesRC / 4));
          break;
        }
        default: { // maintenance
          // پروتئین: 1.8-2.0g/kg وزن بدن (برای حفظ عضله)
          protein = Math.max(0, Math.round(w * 1.9));
          // چربی: 28-32% کالری (تعادل)
          fat = Math.max(0, Math.round(targetCalories * 0.30 / 9));
          // کربوهیدرات: باقیمانده
          const remainingCaloriesDef = targetCalories - (protein * 4) - (fat * 9);
          carbs = Math.max(0, Math.round(remainingCaloriesDef / 4));
        }
      }
      
      // Validation نهایی: اطمینان از اینکه مجموع کالری‌ها منطقی است
      const calculatedCalories = (protein * 4) + (carbs * 4) + (fat * 9);
      if (Math.abs(calculatedCalories - targetCalories) > targetCalories * 0.1 && targetCalories > 0) {
        // اگر اختلاف بیشتر از 10% باشد، ماکروها را تنظیم کن
        const adjustment = targetCalories / calculatedCalories;
        protein = Math.max(0, Math.round(protein * adjustment));
        carbs = Math.max(0, Math.round(carbs * adjustment));
        fat = Math.max(0, Math.round(fat * adjustment));
      }
    }

    // نیاز آبی روزانه (لیتر) - فرمول به‌روز (2024)
    // فرمول پایه: 35ml/kg وزن بدن
    // برای ورزشکاران: +500-1000ml برای هر ساعت تمرین
    // برای آب و هوای گرم: +500ml
    let waterNeed = 0;
    if (w > 0 && !isNaN(w)) {
      const baseWater = w * 0.035; // 35ml/kg (به‌روز شده از 33ml/kg)
      // اضافه کردن آب برای روزهای تمرین
      const exerciseWater = trainingDays > 0 ? (trainingDays * 0.5) : 0; // 500ml برای هر روز تمرین
      waterNeed = Number((baseWater + exerciseWater).toFixed(1));
    }

    return { 
      bmi, bmiCategory, bmiColor, 
      whr, whrRisk, whrColor, 
      bmr, tdee: validTDEE, bodyFatPercent, leanBodyMass,
      idealWeightMin, idealWeightMax, idealWeight,
      targetCalories, calorieAdjustment,
      protein, fat, carbs, waterNeed,
      adjustedActivityFactor
    };
  }, [formData.weight, formData.height, formData.age, formData.gender, formData.activity, formData.measurements, formData.nutritionGoals, formData.days, formData.bodyFat]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id.startsWith('m-')) {
        const field = id.split('-')[1];
        setFormData(prev => ({
            ...prev,
            measurements: { ...prev.measurements, [field]: value }
        }));
    } else {
        setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleInjury = (inj: string) => {
      setFormData(prev => {
          const newInj = prev.injuries.includes(inj) 
            ? prev.injuries.filter(i => i !== inj) 
            : [...prev.injuries, inj];
          return { ...prev, injuries: newInj };
      });
  };

  const handleMedicalCondition = (cond: string) => {
    setFormData(prev => {
      const current = prev.medicalConditions || [];
      const updated = current.includes(cond) 
        ? current.filter(c => c !== cond)
        : [...current, cond];
      return { ...prev, medicalConditions: updated };
      });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
        toast.error('نام الزامی است');
        return;
    }
    if (formData.age && (+formData.age <= 0 || +formData.age > 100)) {
        toast.error('سن وارد شده معتبر نیست');
        return;
    }
    if (formData.height && (+formData.height < 100 || +formData.height > 230)) {
        toast.error('قد وارد شده غیرواقعی است');
        return;
    }
    if (formData.weight && (+formData.weight < 30 || +formData.weight > 250)) {
        toast.error('وزن وارد شده غیرواقعی است');
        return;
    }
    onSave(formData);
  };

  const tabs = [
    { id: 'identity', label: 'مشخصات فردی', icon: <UserIcon size={16} /> },
    { id: 'anthropometry', label: 'آنتروپومتری', icon: <Ruler size={16} /> },
    { id: 'medical', label: 'پزشکی', icon: <Heart size={16} /> },
    { id: 'financial', label: 'مالی', icon: <DollarSign size={16} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-all duration-500" onClick={onClose} style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}></div>
      <div className="relative glass-panel w-full max-w-6xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[92vh] animate-fade-in border border-[var(--glass-border)]">
        
        {/* هدر */}
        <div className="p-6 border-b border-[var(--glass-border)] flex justify-between items-center bg-gradient-to-l from-[var(--accent-color)]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-[var(--accent-color)]/30 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-[var(--accent-color)]/40">
              {formData.name ? formData.name.charAt(0) : '👤'}
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--text-primary)]">
                {initialData ? 'ویرایش پرونده' : 'پرونده جدید'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                {formData.name || 'ورزشکار جدید'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-red-500 text-2xl transition hover:rotate-90"
            aria-label="بستن پنجره"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* تب‌ها */}
        <div className="px-3 sm:px-6 pt-4 border-b border-[var(--glass-border)] flex gap-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-t-xl transition-all duration-500 flex items-center gap-2 text-sm font-bold whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-color)]/30 border-b-2 border-[var(--accent-color)] scale-105'
                  : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/10 hover:text-[var(--accent-color)] hover:scale-102'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* محتوا */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* تب مشخصات فردی */}
            {activeTab === 'identity' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                  <label className="text-xs text-slate-500 block font-bold">نام و نام خانوادگی *</label>
                        <input id="name" value={formData.name} onChange={handleChange} className="input-glass border-r-4 border-r-[var(--accent-color)]" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs md:text-sm text-[var(--text-secondary)] block font-semibold">شماره تماس</label>
                        <input 
                          id="phone" 
                          type="tel"
                          value={formData.phone} 
                          onChange={handleChange} 
                          className="input-glass"
                          aria-label="شماره تماس"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs md:text-sm text-[var(--text-secondary)] block font-semibold">ایمیل</label>
                        <input 
                          id="email" 
                          type="email" 
                          value={formData.email || ''} 
                          onChange={handleChange} 
                          className="input-glass"
                          aria-label="ایمیل"
                        />
                    </div>
                </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                        <label className="text-xs text-slate-500 block">سن</label>
                  <input id="age" type="number" value={formData.age} onChange={handleChange} className="input-glass text-center text-lg font-bold" />
                    </div>
                <div className="space-y-1">
                        <label className="text-xs text-slate-500 block">جنسیت</label>
                        <select id="gender" value={formData.gender} onChange={handleChange} className="input-glass">
                    <option value="male">آقا</option>
                    <option value="female">خانم</option>
                        </select>
                    </div>
                <div className="space-y-1">
                        <label className="text-xs text-slate-500 block">وضعیت تأهل</label>
                        <select id="maritalStatus" value={formData.maritalStatus || 'single'} onChange={handleChange} className="input-glass">
                            <option value="single">مجرد</option>
                            <option value="married">متأهل</option>
                        </select>
                    </div>
                <div className="space-y-1">
                        <label className="text-xs text-slate-500 block">تحصیلات</label>
                        <select id="education" value={formData.education || ''} onChange={handleChange} className="input-glass">
                    <option value="">انتخاب...</option>
                            <option value="diploma">دیپلم</option>
                            <option value="associate">فوق دیپلم</option>
                            <option value="bachelor">لیسانس</option>
                            <option value="master">فوق لیسانس</option>
                            <option value="phd">دکترا</option>
                        </select>
                    </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 block">شغل</label>
                  <input id="job" value={formData.job} onChange={handleChange} className="input-glass" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-slate-500 block">آدرس</label>
                  <input id="address" value={formData.address || ''} onChange={handleChange} className="input-glass" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 block">سطح تمرینی</label>
                  <select id="level" value={formData.level} onChange={handleChange} className="input-glass">
                    <option value="beginner">مبتدی (0-6 ماه)</option>
                    <option value="intermediate">متوسط (6-24 ماه)</option>
                    <option value="advanced">پیشرفته (2-5 سال)</option>
                    <option value="pro">حرفه‌ای (+5 سال)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 block">کیفیت خواب</label>
                  <select id="sleep" value={formData.sleep} onChange={handleChange} className="input-glass">
                    <option value="excellent">عالی (8+ ساعت)</option>
                    <option value="good">خوب (7-8 ساعت)</option>
                    <option value="fair">متوسط (5-7 ساعت)</option>
                    <option value="poor">ضعیف (&lt;5 ساعت)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 block font-bold">تعداد روز تمرین در هفته</label>
                  <select id="days" value={formData.days || ''} onChange={handleChange} className="input-glass font-bold text-[var(--accent-color)]">
                    <option value="">انتخاب...</option>
                    <option value="1">1 روز</option>
                    <option value="2">2 روز</option>
                    <option value="3">3 روز</option>
                    <option value="4">4 روز</option>
                    <option value="5">5 روز</option>
                    <option value="6">6 روز</option>
                    <option value="7">7 روز</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 block font-bold">ضریب فعالیت روزانه</label>
                  <select id="activity" value={formData.activity} onChange={handleChange} className="input-glass text-xs">
                    <option value="1.2">کم‌تحرک (شغل نشسته)</option>
                    <option value="1.375">سبک (پیاده‌روی کم)</option>
                    <option value="1.55">متوسط (فعالیت معمول)</option>
                    <option value="1.725">سنگین (شغل فیزیکی)</option>
                    <option value="1.9">خیلی سنگین (ورزشکار)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 block font-bold">🎯 هدف تغذیه</label>
                  <select id="nutritionGoals" value={formData.nutritionGoals || ''} onChange={handleChange} className="input-glass border-r-4 border-r-emerald-500">
                    <option value="">انتخاب...</option>
                    <option value="weight-loss">🔥 کاهش وزن</option>
                    <option value="weight-gain">📈 افزایش وزن</option>
                    <option value="muscle-gain">💪 عضله‌سازی</option>
                    <option value="maintenance">⚖️ حفظ وزن</option>
                    <option value="recomp">🔄 ریکامپ (کاهش چربی + افزایش عضله)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 block">سابقه ورزشی (سال)</label>
                  <input id="exp" type="number" value={formData.exp || ''} onChange={handleChange} className="input-glass text-center" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 block">استعمال دخانیات</label>
                  <select id="smoke" value={formData.smoke} onChange={handleChange} className="input-glass">
                    <option value="no">خیر</option>
                    <option value="yes">بله</option>
                    <option value="quit">ترک کرده</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* تب آنتروپومتری */}
          {activeTab === 'anthropometry' && (
            <div className="space-y-6">
              {/* قد و وزن اصلی */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 block font-bold flex items-center gap-1">
                    <Ruler size={12} /> قد (cm)
                  </label>
                  <input id="height" type="number" value={formData.height} onChange={handleChange} className="input-glass text-center text-xl font-black text-[var(--accent-color)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 block font-bold flex items-center gap-1">
                    <Scale size={12} /> وزن فعلی (kg)
                  </label>
                  <input id="weight" type="number" value={formData.weight} onChange={handleChange} className="input-glass text-center text-xl font-black text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 block">وزن هدف (kg)</label>
                  <input id="targetWeight" type="number" value={formData.targetWeight || ''} onChange={handleChange} className="input-glass text-center font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 block">درصد چربی (%)</label>
                  <input id="bodyFat" type="number" value={formData.bodyFat || ''} onChange={handleChange} className="input-glass text-center font-bold" />
                </div>
              </div>

              {/* کارت‌های محاسبات */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-4 rounded-2xl bg-gradient-to-br from-[var(--accent-color)]/10 to-[var(--accent-secondary)]/5 border border-[var(--accent-color)]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator size={16} className="text-[var(--accent-color)]" />
                    <span className="text-xs text-slate-400 font-bold">BMI</span>
                  </div>
                  <div className={`text-2xl font-black ${calculations.bmiColor}`}>{calculations.bmi || '-'}</div>
                  <div className={`text-xs ${calculations.bmiColor}`}>{calculations.bmiCategory}</div>
                </div>

                <div className="glass-card p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={16} className="text-purple-500" />
                    <span className="text-xs text-slate-400 font-bold">WHR</span>
                  </div>
                  <div className={`text-2xl font-black ${calculations.whrColor}`}>{calculations.whr || '-'}</div>
                  <div className={`text-xs ${calculations.whrColor}`}>ریسک: {calculations.whrRisk || '-'}</div>
                </div>

                <div className="glass-card p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-purple-500" />
                    <span className="text-xs text-slate-400 font-bold">BMR</span>
                  </div>
                  <div className="text-2xl font-black text-purple-500">{calculations.bmr || '-'}</div>
                  <div className="text-xs text-slate-400">کالری پایه</div>
                </div>

                <div className="glass-card p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={16} className="text-emerald-500" />
                    <span className="text-xs text-slate-400 font-bold">TDEE</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-500">{calculations.tdee || '-'}</div>
                  <div className="text-xs text-slate-400">کالری روزانه</div>
                </div>
              </div>

              {/* اطلاعات تکمیلی محاسبات */}
              {calculations.tdee > 0 && (
                <div className="space-y-4">
                  {/* کالری هدف */}
                  <div className="glass-card p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-emerald-500">🎯 کالری هدف روزانه</span>
                      <span className="text-2xl font-black text-emerald-500">{calculations.targetCalories}</span>
                    </div>
                    {calculations.calorieAdjustment !== 0 && (
                      <div className="text-xs text-slate-400">
                        TDEE: {calculations.tdee} {calculations.calorieAdjustment > 0 ? '+' : ''}{calculations.calorieAdjustment} = {calculations.targetCalories}
                      </div>
                    )}
                  </div>

                  {/* ماکروها */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="glass-card p-3 rounded-xl text-center bg-blue-500/5 border border-blue-500/20">
                      <div className="text-xs text-slate-400 mb-1">پروتئین</div>
                      <div className="text-xl font-black text-blue-500">{calculations.protein}g</div>
                      <div className="text-[10px] text-slate-500">{Math.round(calculations.protein * 4)} کالری</div>
                    </div>
                    <div className="glass-card p-3 rounded-xl text-center bg-yellow-500/5 border border-yellow-500/20">
                      <div className="text-xs text-slate-400 mb-1">کربوهیدرات</div>
                      <div className="text-xl font-black text-yellow-500">{calculations.carbs}g</div>
                      <div className="text-[10px] text-slate-500">{Math.round(calculations.carbs * 4)} کالری</div>
                    </div>
                    <div className="glass-card p-3 rounded-xl text-center bg-red-500/5 border border-red-500/20">
                      <div className="text-xs text-slate-400 mb-1">چربی</div>
                      <div className="text-xl font-black text-red-500">{calculations.fat}g</div>
                      <div className="text-[10px] text-slate-500">{Math.round(calculations.fat * 9)} کالری</div>
                    </div>
                  </div>

                  {/* اطلاعات تکمیلی */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                    <div className="glass-card p-2 rounded-lg">
                      <div className="text-[10px] text-slate-400">وزن ایده‌آل</div>
                      <div className="font-bold text-sm text-[var(--text-primary)]">{calculations.idealWeight || '-'} kg</div>
                    </div>
                    <div className="glass-card p-2 rounded-lg">
                      <div className="text-[10px] text-slate-400">محدوده سالم</div>
                      <div className="font-bold text-sm text-[var(--text-primary)]">{calculations.idealWeightMin}-{calculations.idealWeightMax} kg</div>
                    </div>
                    <div className="glass-card p-2 rounded-lg">
                      <div className="text-[10px] text-slate-400">توده بدون چربی</div>
                      <div className="font-bold text-sm text-purple-500">{calculations.leanBodyMass || '-'} kg</div>
                    </div>
                    <div className="glass-card p-2 rounded-lg">
                      <div className="text-[10px] text-slate-400">درصد چربی</div>
                      <div className="font-bold text-sm text-purple-500">{calculations.bodyFatPercent || '-'}%</div>
                    </div>
                    <div className="glass-card p-2 rounded-lg">
                      <div className="text-[10px] text-slate-400">نیاز آبی</div>
                      <div className="font-bold text-sm text-blue-500">{calculations.waterNeed || '-'} لیتر</div>
                    </div>
                    </div>
                </div>
            )}

              {/* سایزگیری بدن */}
              <div>
                <h4 className="text-purple-500 font-bold text-sm border-b border-[var(--glass-border)] pb-2 mb-4 flex items-center gap-2">
                  <Ruler size={16} /> سایزگیری بدن (cm)
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                    { key: 'neck', label: 'گردن', emoji: '🔵' },
                    { key: 'shoulder', label: 'شانه', emoji: '💪' },
                    { key: 'chest', label: 'سینه', emoji: '🫁' },
                    { key: 'arm', label: 'بازو', emoji: '💪' },
                    { key: 'waist', label: 'کمر', emoji: '⭕' },
                    { key: 'hip', label: 'لگن', emoji: '🔴' },
                    { key: 'thigh', label: 'ران', emoji: '🦵' },
                    { key: 'calf', label: 'ساق', emoji: '🦶' },
                    { key: 'wrist', label: 'مچ دست', emoji: '✋' },
                  ].map(p => (
                    <div key={p.key} className="space-y-1">
                      <label className="text-[10px] text-slate-500 block text-center">{p.emoji} {p.label}</label>
                            <input 
                        id={`m-${p.key}`} 
                        type="number"
                        value={formData.measurements?.[p.key] || ''} 
                                onChange={handleChange} 
                        className="input-glass text-center px-1 font-bold" 
                            />
                        </div>
                    ))}
                </div>
                </div>
              </div>
            )}

          {/* تب پزشکی */}
            {activeTab === 'medical' && (
            <div className="space-y-6">
              {/* آسیب‌دیدگی‌ها */}
              <div className="bg-red-500/5 p-4 rounded-2xl border border-red-500/20">
                <label className="text-xs text-red-500 block mb-3 font-bold flex items-center gap-2">
                  ⚠️ آسیب‌دیدگی‌ها و مشکلات اسکلتی-عضلانی
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-[var(--text-secondary)]">
                        {['دیسک کمر', 'دیسک گردن', 'زانو درد', 'شانه درد', 'سیاتیک', 'قوز پشتی', 'لوردوز', 'کایفوز', 'اسکولیوز', 'آرنج درد', 'مچ درد', 'مچ پا درد', 'کمر درد مزمن', 'گردن درد', 'شانه یخ‌زده', 'سندرم تونل کارپال'].map(inj => (
                    <label key={inj} className="flex items-center gap-2 cursor-pointer hover:text-red-500 transition p-1 rounded hover:bg-red-500/10">
                                <input 
                                    type="checkbox" 
                                    checked={formData.injuries.includes(inj)} 
                                    onChange={() => handleInjury(inj)} 
                        className="accent-red-500 w-4 h-4 rounded" 
                                />
                                {inj}
                            </label>
                        ))}
                    </div>
                </div>

              {/* بیماری‌ها */}
              <div className="bg-yellow-500/5 p-4 rounded-2xl border border-yellow-500/20">
                <label className="text-xs text-yellow-600 block mb-3 font-bold flex items-center gap-2">
                  🏥 بیماری‌ها و شرایط پزشکی
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-[var(--text-secondary)]">
                  {['دیابت نوع 1', 'دیابت نوع 2', 'فشار خون', 'کلسترول بالا', 'بیماری قلبی', 'آسم', 'آرتریت', 'پوکی استخوان', 'کم‌خونی', 'مشکلات تیروئید', 'مشکلات کلیوی', 'مشکلات کبدی', 'سندرم روده تحریک‌پذیر', 'ریفلاکس معده'].map(cond => (
                    <label key={cond} className="flex items-center gap-2 cursor-pointer hover:text-yellow-500 transition p-1 rounded hover:bg-yellow-500/10">
                                <input 
                                    type="checkbox" 
                                    checked={(formData.medicalConditions || []).includes(cond)} 
                        onChange={() => handleMedicalCondition(cond)} 
                        className="accent-yellow-500 w-4 h-4 rounded" 
                                />
                                {cond}
                            </label>
                        ))}
                    </div>
                </div>

              {/* داروها و حساسیت */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                  <label className="text-xs text-slate-500 block">داروهای مصرفی</label>
                        <textarea 
                            id="medications" 
                            value={formData.medications || ''} 
                            onChange={handleChange} 
                            className="input-glass h-20" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 block">حساسیت‌های غذایی</label>
                        <textarea 
                            id="allergy" 
                            value={formData.allergy} 
                            onChange={handleChange} 
                            className="input-glass h-20" 
                        />
                    </div>
                </div>

              {/* ترجیحات تغذیه */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 block">نوع رژیم غذایی</label>
                        <select id="dietType" value={formData.dietType || ''} onChange={handleChange} className="input-glass">
                    <option value="">انتخاب...</option>
                    <option value="normal">عادی</option>
                    <option value="vegetarian">گیاهخوار</option>
                            <option value="vegan">وگان</option>
                            <option value="keto">کتوژنیک</option>
                            <option value="paleo">پالئو</option>
                            <option value="halal">حلال</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 block">مصرف آب روزانه (لیتر)</label>
                  <input type="number" id="waterIntake" value={formData.waterIntake || ''} onChange={handleChange} className="input-glass" />
                </div>
                    <div className="space-y-1">
                  <label className="text-xs text-slate-500 block">تعداد وعده روزانه</label>
                        <select id="mealFrequency" value={formData.mealFrequency || ''} onChange={handleChange} className="input-glass">
                    <option value="">انتخاب...</option>
                            <option value="3">3 وعده</option>
                            <option value="4">4 وعده</option>
                            <option value="5">5 وعده</option>
                            <option value="6">6 وعده</option>
                        </select>
                    </div>
                </div>
              </div>
            )}

          {/* تب مالی */}
            {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                  <label className="text-xs text-slate-500 block font-bold">شروع اشتراک</label>
                  <input 
                    type="date" 
                    className="input-glass" 
                    value={formData.financial?.startDate} 
                    onChange={e => setFormData({...formData, financial: {...formData.financial, startDate: e.target.value}})} 
                  />
                        </div>
                        <div className="space-y-1">
                  <label className="text-xs text-slate-500 block font-bold">مدت (ماه)</label>
                  <input 
                    type="number" 
                    className="input-glass text-center font-bold" 
                    value={formData.financial?.duration} 
                    onChange={e => setFormData({...formData, financial: {...formData.financial, duration: parseInt(e.target.value) || 1}})} 
                  />
                        </div>
                        <div className="space-y-1">
                  <label className="text-xs text-slate-500 block font-bold">مبلغ (تومان)</label>
                  <input 
                    type="number" 
                    className="input-glass text-center font-bold text-emerald-500" 
                    value={formData.financial?.amount} 
                    onChange={e => setFormData({...formData, financial: {...formData.financial, amount: e.target.value}})} 
                  />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-slate-500 block">یادداشت‌های خصوصی مربی</label>
                <textarea 
                  id="notes" 
                  value={formData.notes} 
                  onChange={handleChange} 
                  className="input-glass h-32" 
                />
              </div>
                </div>
          )}
        </div>

        {/* فوتر */}
        <div className="p-3 sm:p-4 md:p-6 border-t border-[var(--glass-border)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--glass-bg)]">
          <button onClick={onClose} className="btn-glass bg-slate-500/10 text-slate-400 hover:bg-slate-500/20">
            انصراف
          </button>
                <button onClick={handleSubmit} className="btn-glass text-white py-2.5 sm:py-3 px-6 sm:px-10 text-base sm:text-lg w-full sm:w-auto" style={{ background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))` }}>
            ✓ ذخیره پرونده
                </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
