/**
 * Data Module Index
 * Centralized exports for all data files
 */

// Exercises
export { exercises, type Exercise } from './exercises';
export { resistanceExercises, riskyExercises } from './resistanceExercises';
export { cardioExercises } from './cardioExercises';
export { correctiveExercises } from './correctiveExercises';
export { warmupExercises, cooldownExercises } from './warmupCooldown';

// Foods
export { foods, type Food } from './foods';
export { 
  getFoodDataInOldFormat, 
  getFoodByName, 
  getFoodsByCategory, 
  getFoodsByMealTiming, 
  getFoodsByMacroRatio, 
  searchFoods, 
  getRecommendedFoodsForGoal,
  foodData 
} from './foodDataHelper';

// Supplements
export { supplements, type Supplement } from './supplements';

// Types
export type { 
  ResistanceParameters, 
  CardioParameters, 
  PlyometricParameters, 
  CorrectiveParameters, 
  WarmupCooldownParameters,
  ExerciseParameters 
} from '../types/exercise-parameters';

export type {
  MealTimingParameters,
  MacroDistributionParameters,
  FoodSelectionParameters,
  MealPlanParameters,
  NutritionTrackingParameters,
  DietParameters
} from '../types/diet-parameters';

export type {
  SupplementTimingParameters,
  SupplementDosingParameters,
  SupplementQualityParameters,
  SupplementSafetyParameters,
  SupplementEffectivenessParameters,
  SupplementCostParameters,
  SupplementParameters
} from '../types/supplement-parameters';

// Default parameters
export {
  defaultResistanceParameters,
  defaultCardioParameters,
  defaultPlyometricParameters,
  defaultCorrectiveParameters,
  defaultWarmupCooldownParameters
} from '../types/exercise-parameters';

export {
  defaultDietParameters
} from '../types/diet-parameters';

export {
  defaultSupplementParameters,
  getOptimalTiming,
  getOptimalDose
} from '../types/supplement-parameters';

