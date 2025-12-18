/**
 * Scientific Fitness Calculations Utility
 * Pure functions for BMI, BMR, TDEE, WHR, and nutritional calculations
 * All functions include comprehensive validation and error handling
 */

export interface MeasurementData {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activity: number;
  waist?: number;
  hip?: number;
  neck?: number;
  bodyFat?: number;
  trainingDays?: number;
  goal?: string;
}

export interface CalculationResult {
  bmi: number;
  bmiCategory: string;
  bmiColor: string;
  whr: number;
  whrRisk: string;
  whrColor: string;
  bmr: number;
  tdee: number;
  bodyFatPercent: number;
  leanBodyMass: number;
  idealWeightMin: number;
  idealWeightMax: number;
  idealWeight: number;
  targetCalories: number;
  calorieAdjustment: number;
  protein: number;
  fat: number;
  carbs: number;
  waterNeed: number;
  adjustedActivityFactor: number;
}

/**
 * Validates measurement inputs
 */
function validateMeasurements(data: MeasurementData): boolean {
  const { weight, height, age } = data;

  if (!weight || !height || !age) return false;
  if (weight <= 0 || weight > 500) return false;
  if (height <= 0 || height > 300) return false;
  if (age <= 0 || age > 150) return false;

  return true;
}

/**
 * Calculates BMI (Body Mass Index)
 */
export function calculateBMI(weight: number, height: number): { bmi: number; category: string; color: string } {
  const result = { bmi: 0, category: 'نامعتبر', color: 'text-slate-400' };

  if (!validateMeasurements({ weight, height, age: 1, gender: 'male', activity: 1.2 })) {
    return result;
  }

  const heightM = height / 100;
  const bmiVal = weight / (heightM * heightM);

  if (isNaN(bmiVal) || bmiVal <= 0 || bmiVal >= 100) {
    return result;
  }

  result.bmi = Number(bmiVal.toFixed(1));

  // BMI Categories (WHO standards)
  if (result.bmi < 16) { result.category = 'لاغری شدید'; result.color = 'text-red-500'; }
  else if (result.bmi < 17) { result.category = 'لاغری متوسط'; result.color = 'text-amber-500'; }
  else if (result.bmi < 18.5) { result.category = 'کمبود وزن'; result.color = 'text-yellow-500'; }
  else if (result.bmi < 25) { result.category = 'نرمال'; result.color = 'text-emerald-500'; }
  else if (result.bmi < 30) { result.category = 'اضافه وزن'; result.color = 'text-amber-500'; }
  else if (result.bmi < 35) { result.category = 'چاقی درجه 1'; result.color = 'text-red-400'; }
  else if (result.bmi < 40) { result.category = 'چاقی درجه 2'; result.color = 'text-red-500'; }
  else { result.category = 'چاقی مفرط'; result.color = 'text-red-600'; }

  return result;
}

/**
 * Calculates WHR (Waist-to-Hip Ratio)
 */
export function calculateWHR(waist: number, hip: number, gender: 'male' | 'female'): { whr: number; risk: string; color: string } {
  const result = { whr: 0, risk: 'نامعتبر', color: 'text-slate-400' };

  if (!waist || !hip || waist <= 0 || hip <= 0 || waist > 200 || hip > 200) {
    return result;
  }

  const whrVal = waist / hip;
  if (isNaN(whrVal) || whrVal <= 0 || whrVal >= 5) {
    return result;
  }

  result.whr = Number(whrVal.toFixed(2));

  // WHR Risk assessment based on gender
  if (gender === 'male') {
    if (result.whr < 0.9) { result.risk = 'کم (سالم)'; result.color = 'text-emerald-500'; }
    else if (result.whr < 1.0) { result.risk = 'متوسط'; result.color = 'text-yellow-500'; }
    else { result.risk = 'بالا (خطرناک)'; result.color = 'text-red-500'; }
  } else {
    if (result.whr < 0.8) { result.risk = 'کم (سالم)'; result.color = 'text-emerald-500'; }
    else if (result.whr < 0.85) { result.risk = 'متوسط'; result.color = 'text-yellow-500'; }
    else { result.risk = 'بالا (خطرناک)'; result.color = 'text-red-500'; }
  }

  return result;
}

/**
 * Calculates BMR using multiple validated formulas (2024 standards)
 */
export function calculateBMR(data: MeasurementData): number {
  const { weight, height, age, gender, bodyFat } = data;

  if (!validateMeasurements(data)) return 0;

  // 1. Mifflin-St Jeor (Gold standard 2024)
  const mifflin = 10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161);

  if (isNaN(mifflin) || mifflin <= 0 || mifflin > 10000) return 0;

  // 2. Harris-Benedict (Revised 1984)
  const harrisBenedict = gender === 'male'
    ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

  if (isNaN(harrisBenedict) || harrisBenedict <= 0 || harrisBenedict > 10000) {
    return Math.max(0, Math.round(mifflin));
  }

  // 3. Katch-McArdle (if body fat percentage is available)
  let katch = 0;
  if (bodyFat && bodyFat > 0 && bodyFat < 100) {
    const leanMass = weight * (1 - bodyFat / 100);
    if (leanMass > 0 && leanMass <= weight) {
      katch = 370 + (21.6 * leanMass);
      if (isNaN(katch) || katch <= 0 || katch > 10000) katch = 0;
    }
  }

  // 4. Cunningham (for athletes with high muscle mass)
  let cunningham = 0;
  if (bodyFat && bodyFat > 0 && bodyFat < 100) {
    const leanMass = weight * (1 - bodyFat / 100);
    if (leanMass > 0 && leanMass <= weight) {
      cunningham = 500 + (22 * leanMass);
      if (isNaN(cunningham) || cunningham <= 0 || cunningham > 10000) cunningham = 0;
    }
  }

  // Intelligent averaging based on available data
  let bmr = 0;
  if (katch > 0 && cunningham > 0) {
    // If body fat available: Katch (40%) + Cunningham (20%) + Mifflin (25%) + Harris (15%)
    bmr = Math.round((mifflin * 0.25 + harrisBenedict * 0.15 + katch * 0.40 + cunningham * 0.20));
  } else if (katch > 0) {
    // If only Katch available: Mifflin (35%) + Harris (25%) + Katch (40%)
    bmr = Math.round((mifflin * 0.35 + harrisBenedict * 0.25 + katch * 0.40));
  } else {
    // Default: Mifflin (60%) + Harris (40%)
    bmr = Math.round((mifflin * 0.60 + harrisBenedict * 0.40));
  }

  return Math.max(0, bmr);
}

/**
 * Calculates activity factor based on lifestyle and training frequency
 */
export function calculateActivityFactor(baseActivity: number, trainingDays: number, goal?: string): number {
  if (isNaN(baseActivity) || baseActivity < 1.2 || baseActivity > 2.5) {
    baseActivity = 1.55; // Default moderate activity
  }

  let activityFactor = baseActivity;

  // Adjust based on training frequency
  if (trainingDays >= 6) activityFactor = Math.max(activityFactor, 1.725);
  else if (trainingDays >= 4) activityFactor = Math.max(activityFactor, 1.55);
  else if (trainingDays >= 2) activityFactor = Math.max(activityFactor, 1.375);
  else activityFactor = Math.max(activityFactor, 1.2);

  // Adjust based on goal
  switch (goal) {
    case 'weight-loss':
      activityFactor = Math.max(1.2, activityFactor * 0.92); // 5-10% reduction
      break;
    case 'muscle-gain':
      activityFactor = Math.min(2.5, activityFactor * 1.10); // 8-12% increase
      break;
    case 'weight-gain':
      activityFactor = Math.min(2.5, activityFactor * 1.12); // 10-15% increase
      break;
    case 'recomp':
      activityFactor = Math.max(1.2, activityFactor * 0.97); // 2-5% reduction
      break;
    default:
      // maintenance: keep base activity factor
      break;
  }

  return Math.max(1.2, Math.min(2.5, activityFactor));
}

/**
 * Calculates TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(bmr: number, activityFactor: number): number {
  if (bmr <= 0 || activityFactor < 1.2 || activityFactor > 2.5) return 0;

  const tdee = Math.round(bmr * activityFactor);

  // Validation
  if (tdee <= 0 || isNaN(tdee) || tdee > 20000) {
    return Math.round(bmr * 1.55); // Fallback to moderate activity
  }

  return tdee;
}

/**
 * Calculates target calories based on goal
 */
export function calculateTargetCalories(tdee: number, goal?: string): { calories: number; adjustment: number } {
  if (tdee <= 0) return { calories: 0, adjustment: 0 };

  let targetCalories = tdee;
  let adjustment = 0;

  switch (goal) {
    case 'weight-loss':
      adjustment = -500; // 500 calorie deficit for 0.5kg/week loss
      const minCalories = Math.max(1200, tdee * 0.8); // Minimum 1200 or 80% of TDEE
      targetCalories = Math.max(minCalories, tdee + adjustment);
      break;
    case 'weight-gain':
      adjustment = 400; // 400 calorie surplus
      targetCalories = Math.min(10000, tdee + adjustment);
      break;
    case 'muscle-gain':
      adjustment = 300; // 300 calorie surplus with high protein
      targetCalories = Math.min(10000, tdee + adjustment);
      break;
    case 'recomp':
      adjustment = 0; // Maintain calories while changing body composition
      targetCalories = tdee;
      break;
    default:
      targetCalories = tdee;
  }

  return {
    calories: Math.max(0, Math.min(20000, targetCalories)),
    adjustment
  };
}

/**
 * Calculates body fat percentage using Navy and Deurenberg formulas
 */
export function calculateBodyFat(data: MeasurementData): number {
  const { weight, height, age, gender, waist, hip, neck, bodyFat } = data;

  // If body fat is directly provided, validate and return it
  if (bodyFat && bodyFat > 0 && bodyFat < 100) {
    return Number(bodyFat.toFixed(1));
  }

  // Calculate using Navy formula if measurements are available
  if (!waist || !neck || !height) return 0;

  const waistNeckDiff = waist - neck;
  if (waistNeckDiff <= 0) return 0;

  let calculatedBF = 0;

  if (gender === 'male') {
    // Navy formula for men
    const logWaistNeck = Math.log10(waistNeckDiff);
    const logHeight = Math.log10(height);

    if (!isNaN(logWaistNeck) && !isNaN(logHeight)) {
      const denominator = 1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight;
      if (denominator > 0) {
        calculatedBF = (495 / denominator) - 450;
      }
    }
  } else if (hip) {
    // Navy formula for women
    const waistHipNeck = waist + hip - neck;
    if (waistHipNeck > 0) {
      const logWaistHipNeck = Math.log10(waistHipNeck);
      const logHeight = Math.log10(height);

      if (!isNaN(logWaistHipNeck) && !isNaN(logHeight)) {
        const denominator = 1.29579 - 0.35004 * logWaistHipNeck + 0.22100 * logHeight;
        if (denominator > 0) {
          calculatedBF = (495 / denominator) - 450;
        }
      }
    }
  }

  // Validate Navy result and compare with Deurenberg
  if (calculatedBF > 0 && !isNaN(calculatedBF)) {
    // Deurenberg formula for validation
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    if (!isNaN(bmi) && bmi > 0) {
      const deurenberg = 1.2 * bmi + 0.23 * age - 10.8 * (gender === 'male' ? 1 : 0) - 5.4;

      if (!isNaN(deurenberg) && deurenberg > 0 && deurenberg < 100) {
        // Average Navy and Deurenberg for better accuracy
        calculatedBF = (calculatedBF * 0.7 + deurenberg * 0.3);
      }
    }

    // Constrain to reasonable ranges
    const minBF = gender === 'male' ? 3 : 10;
    calculatedBF = Math.max(minBF, Math.min(50, calculatedBF));
  }

  return calculatedBF > 0 && !isNaN(calculatedBF) ? Number(calculatedBF.toFixed(1)) : 0;
}

/**
 * Calculates ideal weight range based on BMI 18.5-24.9
 */
export function calculateIdealWeight(height: number, gender: 'male' | 'female'): { min: number; max: number; ideal: number } {
  if (!height || height <= 0 || height > 300) {
    return { min: 0, max: 0, ideal: 0 };
  }

  const heightM = height / 100;
  const minBMI = 18.5;
  const maxBMI = 24.9;
  const idealBMI = 22; // Middle of healthy range

  const min = Math.round(minBMI * heightM * heightM);
  const max = Math.round(maxBMI * heightM * heightM);
  const ideal = Math.round(idealBMI * heightM * heightM);

  return { min, max, ideal };
}

/**
 * Calculates macronutrient distribution
 */
export function calculateMacros(weight: number, targetCalories: number, goal?: string): { protein: number; fat: number; carbs: number } {
  if (targetCalories <= 0 || weight <= 0) {
    return { protein: 0, fat: 0, carbs: 0 };
  }

  let protein = 0;
  let fat = 0;
  let carbs = 0;

  switch (goal) {
    case 'muscle-gain':
      // High protein for muscle building: 2.2-2.5g per kg
      protein = Math.round(weight * 2.4);
      fat = Math.round((targetCalories * 0.25) / 9); // 25% fat
      carbs = Math.round((targetCalories - (protein * 4) - (fat * 9)) / 4);
      break;

    case 'weight-loss':
      // Moderate protein for fat loss: 1.8-2.2g per kg
      protein = Math.round(weight * 2.0);
      fat = Math.round((targetCalories * 0.25) / 9); // 25% fat
      carbs = Math.round((targetCalories - (protein * 4) - (fat * 9)) / 4);
      break;

    case 'weight-gain':
      // Moderate protein for weight gain: 1.8-2.0g per kg
      protein = Math.round(weight * 1.9);
      fat = Math.round((targetCalories * 0.30) / 9); // 30% fat
      carbs = Math.round((targetCalories - (protein * 4) - (fat * 9)) / 4);
      break;

    default: // maintenance or recomp
      // Balanced macros: 1.6-2.0g protein per kg
      protein = Math.round(weight * 1.8);
      fat = Math.round((targetCalories * 0.25) / 9); // 25% fat
      carbs = Math.round((targetCalories - (protein * 4) - (fat * 9)) / 4);
  }

  // Ensure carbs don't go negative
  if (carbs < 0) {
    carbs = Math.round(targetCalories * 0.4 / 4); // 40% carbs as fallback
    protein = Math.round((targetCalories - (carbs * 4) - (fat * 9)) / 4);
  }

  return { protein: Math.max(0, protein), fat: Math.max(0, fat), carbs: Math.max(0, carbs) };
}

/**
 * Calculates water intake recommendation
 */
export function calculateWaterIntake(weight: number, activity: number): number {
  if (weight <= 0) return 0;

  // Base: 30ml per kg body weight
  let waterML = weight * 30;

  // Adjust for activity level
  if (activity >= 1.725) waterML *= 1.3; // Very active
  else if (activity >= 1.55) waterML *= 1.2; // Moderately active
  else if (activity >= 1.375) waterML *= 1.1; // Lightly active

  return Math.round(waterML / 100) * 100; // Round to nearest 100ml
}

/**
 * Main calculation function that combines all metrics
 */
export function calculateFitnessMetrics(data: MeasurementData): CalculationResult {
  const { weight, height, age, gender, activity, waist, hip, neck, bodyFat, trainingDays, goal } = data;

  // BMI calculation
  const bmiResult = calculateBMI(weight, height);

  // WHR calculation
  const whrResult = calculateWHR(waist || 0, hip || 0, gender);

  // BMR calculation
  const bmr = calculateBMR(data);

  // Activity factor calculation
  const adjustedActivityFactor = calculateActivityFactor(activity, trainingDays || 3, goal);

  // TDEE calculation
  const tdee = calculateTDEE(bmr, adjustedActivityFactor);

  // Body fat calculation
  const bodyFatPercent = calculateBodyFat(data);

  // Lean body mass
  const leanBodyMass = bodyFatPercent > 0 && weight > 0 ? Math.round(weight * (1 - bodyFatPercent / 100)) : 0;

  // Ideal weight
  const idealWeight = calculateIdealWeight(height, gender);

  // Target calories
  const { calories: targetCalories, adjustment: calorieAdjustment } = calculateTargetCalories(tdee, goal);

  // Macronutrients
  const { protein, fat, carbs } = calculateMacros(weight, targetCalories, goal);

  // Water intake
  const waterNeed = calculateWaterIntake(weight, activity);

  return {
    bmi: bmiResult.bmi,
    bmiCategory: bmiResult.category,
    bmiColor: bmiResult.color,
    whr: whrResult.whr,
    whrRisk: whrResult.risk,
    whrColor: whrResult.color,
    bmr,
    tdee,
    bodyFatPercent,
    leanBodyMass,
    idealWeightMin: idealWeight.min,
    idealWeightMax: idealWeight.max,
    idealWeight: idealWeight.ideal,
    targetCalories,
    calorieAdjustment,
    protein,
    fat,
    carbs,
    waterNeed,
    adjustedActivityFactor
  };
}

















