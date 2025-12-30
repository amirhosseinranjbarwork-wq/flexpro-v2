/**
 * Professional Diet Parameters
 * Advanced parameters for diet planning and meal timing
 */

// ============================================================================
// MEAL TIMING PARAMETERS
// ============================================================================

export interface MealTimingParameters {
  // Meal type
  meal: 'صبحانه' | 'ناهار' | 'شام' | 'میان‌وعده' | 'پیش از تمرین' | 'بعد از تمرین';
  
  // Timing
  time?: string; // e.g., "08:00"
  relativeToWorkout?: 'pre' | 'post' | 'intra' | 'off'; // Relative to workout
  
  // Pre-workout parameters
  preWorkout?: {
    timing: number; // minutes before workout
    carbAmount: number; // grams
    proteinAmount: number; // grams
    fatAmount: number; // grams
    digestibility: 'fast' | 'medium' | 'slow';
  };
  
  // Post-workout parameters
  postWorkout?: {
    timing: number; // minutes after workout
    carbAmount: number; // grams (for glycogen replenishment)
    proteinAmount: number; // grams (for muscle repair)
    fatAmount: number; // grams (minimal)
    window: number; // minutes (anabolic window)
  };
  
  // Day type
  dayType: 'training' | 'rest' | 'cardio' | 'competition';
  
  // Macro adjustments based on day type
  macroAdjustments?: {
    training: { protein: number; carbs: number; fat: number }; // multipliers
    rest: { protein: number; carbs: number; fat: number };
    cardio: { protein: number; carbs: number; fat: number };
  };
}

// ============================================================================
// MACRO DISTRIBUTION PARAMETERS
// ============================================================================

export interface MacroDistributionParameters {
  // Total daily macros
  totalCalories: number;
  totalProtein: number; // grams
  totalCarbs: number; // grams
  totalFat: number; // grams
  
  // Distribution percentages
  proteinPercent: number; // % of total calories
  carbPercent: number; // % of total calories
  fatPercent: number; // % of total calories
  
  // Meal distribution
  mealDistribution: {
    صبحانه: { protein: number; carbs: number; fat: number };
    ناهار: { protein: number; carbs: number; fat: number };
    شام: { protein: number; carbs: number; fat: number };
    میان‌وعده?: { protein: number; carbs: number; fat: number };
  };
  
  // Goal-based adjustments
  goal: 'muscle_gain' | 'fat_loss' | 'maintenance' | 'recomp' | 'performance';
  
  goalAdjustments?: {
    muscle_gain: {
      proteinMultiplier: number; // e.g., 1.2x
      carbMultiplier: number;
      calorieSurplus: number; // calories above maintenance
    };
    fat_loss: {
      proteinMultiplier: number; // higher protein to preserve muscle
      carbMultiplier: number; // lower carbs
      calorieDeficit: number; // calories below maintenance
    };
    maintenance: {
      proteinMultiplier: number;
      carbMultiplier: number;
      calorieTarget: number; // maintenance calories
    };
  };
}

// ============================================================================
// FOOD SELECTION PARAMETERS
// ============================================================================

export interface FoodSelectionParameters {
  // Food properties
  mealTiming?: ('pre-workout' | 'post-workout' | 'anytime' | 'morning' | 'evening')[];
  macroRatio?: 'high-protein' | 'high-carb' | 'high-fat' | 'balanced';
  satietyIndex?: number; // 1-10
  digestibility?: 'fast' | 'medium' | 'slow';
  
  // Dietary restrictions
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  isKeto?: boolean;
  isPaleo?: boolean;
  
  // Allergens to avoid
  allergens?: string[];
  
  // Cost considerations
  costLevel?: 'low' | 'medium' | 'high';
  budget?: number; // daily budget in currency
  
  // Availability
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  availability?: 'common' | 'seasonal' | 'rare';
  
  // Nutritional priorities
  priorities?: Array<'protein' | 'fiber' | 'vitamins' | 'minerals' | 'antioxidants' | 'omega3'>;
}

// ============================================================================
// MEAL PLAN PARAMETERS
// ============================================================================

export interface MealPlanParameters {
  // Plan duration
  duration: number; // days
  
  // Meal frequency
  mealsPerDay: number; // typically 3-6
  
  // Calorie cycling
  calorieCycling?: {
    enabled: boolean;
    highDays: number[]; // days of week (0-6, Sunday = 0)
    lowDays: number[];
    highDayMultiplier: number; // e.g., 1.2x
    lowDayMultiplier: number; // e.g., 0.8x
  };
  
  // Carb cycling
  carbCycling?: {
    enabled: boolean;
    highCarbDays: number[]; // typically training days
    lowCarbDays: number[]; // typically rest days
    highCarbAmount: number; // grams
    lowCarbAmount: number; // grams
  };
  
  // Intermittent fasting
  intermittentFasting?: {
    enabled: boolean;
    protocol: '16:8' | '18:6' | '20:4' | 'OMAD' | '5:2';
    eatingWindow: { start: string; end: string }; // e.g., "12:00" to "20:00"
  };
  
  // Meal prep
  mealPrep?: {
    enabled: boolean;
    prepDays: number[]; // days of week for meal prep
    batchCooking: boolean;
  };
  
  // Hydration
  hydration?: {
    dailyWater: number; // liters
    preWorkout: number; // ml
    duringWorkout: number; // ml per hour
    postWorkout: number; // ml
  };
  
  // Supplements timing
  supplementTiming?: {
    preWorkout: string[]; // supplement names
    postWorkout: string[]; // supplement names
    withMeals: string[]; // supplement names
    beforeBed: string[]; // supplement names
  };
}

// ============================================================================
// NUTRITION TRACKING PARAMETERS
// ============================================================================

export interface NutritionTrackingParameters {
  // Tracking method
  method: 'calories' | 'macros' | 'points' | 'portions';
  
  // Macro targets
  targets: {
    calories: { min: number; max: number; target: number };
    protein: { min: number; max: number; target: number };
    carbs: { min: number; max: number; target: number };
    fat: { min: number; max: number; target: number };
    fiber?: { min: number; target: number };
    water?: { min: number; target: number };
  };
  
  // Flexibility
  flexibility: {
    calorieRange: number; // ± calories
    macroRange: number; // ± percentage
    cheatMeals?: number; // per week
  };
  
  // Progress tracking
  progressTracking?: {
    weekly: boolean;
    monthly: boolean;
    photos: boolean;
    measurements: boolean;
    bodyComposition: boolean;
  };
}

// ============================================================================
// UNIFIED DIET PARAMETERS
// ============================================================================

export interface DietParameters {
  mealTiming: MealTimingParameters;
  macroDistribution: MacroDistributionParameters;
  foodSelection: FoodSelectionParameters;
  mealPlan: MealPlanParameters;
  tracking: NutritionTrackingParameters;
}

// Default parameters
export const defaultDietParameters: DietParameters = {
  mealTiming: {
    meal: 'صبحانه',
    dayType: 'training',
    preWorkout: {
      timing: 60,
      carbAmount: 30,
      proteinAmount: 10,
      fatAmount: 5,
      digestibility: 'fast'
    },
    postWorkout: {
      timing: 30,
      carbAmount: 50,
      proteinAmount: 30,
      fatAmount: 5,
      window: 120
    }
  },
  macroDistribution: {
    totalCalories: 2000,
    totalProtein: 150,
    totalCarbs: 200,
    totalFat: 67,
    proteinPercent: 30,
    carbPercent: 40,
    fatPercent: 30,
    mealDistribution: {
      صبحانه: { protein: 30, carbs: 50, fat: 15 },
      ناهار: { protein: 40, carbs: 60, fat: 20 },
      شام: { protein: 40, carbs: 50, fat: 20 },
      میان‌وعده: { protein: 20, carbs: 20, fat: 10 }
    },
    goal: 'maintenance'
  },
  foodSelection: {
    mealTiming: ['anytime'],
    macroRatio: 'balanced',
    satietyIndex: 5,
    digestibility: 'medium',
    costLevel: 'medium'
  },
  mealPlan: {
    duration: 7,
    mealsPerDay: 4,
    hydration: {
      dailyWater: 2.5,
      preWorkout: 500,
      duringWorkout: 500,
      postWorkout: 500
    }
  },
  tracking: {
    method: 'macros',
    targets: {
      calories: { min: 1800, max: 2200, target: 2000 },
      protein: { min: 120, max: 180, target: 150 },
      carbs: { min: 150, max: 250, target: 200 },
      fat: { min: 50, max: 80, target: 67 },
      fiber: { min: 25, target: 30 },
      water: { min: 2, target: 2.5 }
    },
    flexibility: {
      calorieRange: 100,
      macroRange: 10,
      cheatMeals: 1
    }
  }
};

