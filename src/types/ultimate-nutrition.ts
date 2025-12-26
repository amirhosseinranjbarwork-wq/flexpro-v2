/**
 * ULTIMATE NUTRITION SYSTEM - TYPE DEFINITIONS
 * Scientific nutrition database with micronutrients and metabolic data
 */

// ============================================================================
// CORE ENUMS & TYPES
// ============================================================================

export enum FoodCategory {
  PROTEIN = 'protein',
  CARBOHYDRATE = 'carbohydrate',
  HEALTHY_FAT = 'healthy_fat',
  VEGETABLE = 'vegetable',
  FRUIT = 'fruit',
  DAIRY = 'dairy',
  GRAIN = 'grain',
  LEGUME = 'legume',
  NUT_SEED = 'nut_seed',
  BEVERAGE = 'beverage',
  CONDIMENT = 'condiment',
  SUPPLEMENT_FOOD = 'supplement_food'
}

export enum ProteinType {
  COMPLETE = 'complete', // Contains all 9 essential amino acids
  INCOMPLETE = 'incomplete'
}

export enum FoodTiming {
  PRE_WORKOUT = 'pre_workout',
  POST_WORKOUT = 'post_workout',
  ANYTIME = 'anytime',
  BREAKFAST = 'breakfast',
  BEFORE_BED = 'before_bed'
}

export enum GlycemicIndex {
  LOW = 'low', // < 55
  MEDIUM = 'medium', // 55-69
  HIGH = 'high' // 70+
}

export enum DigestibilityScore {
  VERY_FAST = 'very_fast', // < 30 min (whey, simple sugars)
  FAST = 'fast', // 30-60 min
  MODERATE = 'moderate', // 1-2 hours
  SLOW = 'slow', // 2-4 hours (casein, complex carbs)
  VERY_SLOW = 'very_slow' // 4+ hours (high fiber, high fat)
}

export enum DietaryRestriction {
  VEGAN = 'vegan',
  VEGETARIAN = 'vegetarian',
  GLUTEN_FREE = 'gluten_free',
  DAIRY_FREE = 'dairy_free',
  LACTOSE_FREE = 'lactose_free',
  KETO = 'keto',
  PALEO = 'paleo',
  HALAL = 'halal',
  KOSHER = 'kosher'
}

// ============================================================================
// MACRONUTRIENT DATA
// ============================================================================

export interface Macronutrients {
  protein: number; // grams per 100g
  carbohydrates: number; // grams per 100g
  fat: number; // grams per 100g
  fiber: number; // grams per 100g
  sugar: number; // grams per 100g
  saturatedFat?: number; // grams per 100g
  transFat?: number; // grams per 100g
  monounsaturatedFat?: number; // grams per 100g
  polyunsaturatedFat?: number; // grams per 100g
  omega3?: number; // grams per 100g
  omega6?: number; // grams per 100g
}

// ============================================================================
// MICRONUTRIENT DATA
// ============================================================================

export interface Vitamins {
  vitaminA?: number; // mcg (Retinol Activity Equivalents)
  vitaminC?: number; // mg
  vitaminD?: number; // mcg
  vitaminE?: number; // mg
  vitaminK?: number; // mcg
  vitaminB1?: number; // mg (Thiamine)
  vitaminB2?: number; // mg (Riboflavin)
  vitaminB3?: number; // mg (Niacin)
  vitaminB5?: number; // mg (Pantothenic Acid)
  vitaminB6?: number; // mg
  vitaminB7?: number; // mcg (Biotin)
  vitaminB9?: number; // mcg (Folate)
  vitaminB12?: number; // mcg
}

export interface Minerals {
  calcium?: number; // mg
  iron?: number; // mg
  magnesium?: number; // mg
  phosphorus?: number; // mg
  potassium?: number; // mg
  sodium?: number; // mg
  zinc?: number; // mg
  copper?: number; // mg
  manganese?: number; // mg
  selenium?: number; // mcg
  iodine?: number; // mcg
  chromium?: number; // mcg
}

export interface Micronutrients {
  vitamins: Vitamins;
  minerals: Minerals;
}

// ============================================================================
// AMINO ACID PROFILE (for protein sources)
// ============================================================================

export interface AminoAcidProfile {
  leucine?: number; // mg per 100g (critical for MPS)
  isoleucine?: number; // mg per 100g
  valine?: number; // mg per 100g
  lysine?: number; // mg per 100g
  methionine?: number; // mg per 100g
  phenylalanine?: number; // mg per 100g
  threonine?: number; // mg per 100g
  tryptophan?: number; // mg per 100g
  histidine?: number; // mg per 100g
  totalBCAA?: number; // leucine + isoleucine + valine
  totalEAA?: number; // Total essential amino acids
}

// ============================================================================
// FOOD DEFINITION
// ============================================================================

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  servingSize: number; // grams
  servingUnit: string; // "100g", "1 cup", "1 piece", etc.
  
  // Caloric data
  calories: number; // kcal per serving
  
  // Macro and micro nutrients
  macros: Macronutrients;
  micros?: Micronutrients;
  
  // Protein-specific data
  proteinType?: ProteinType;
  aminoAcids?: AminoAcidProfile;
  proteinDigestibility?: number; // PDCAAS or DIAAS score (0-1)
  
  // Metabolic properties
  glycemicIndex?: number; // 0-100
  glycemicLoad?: number; // calculated
  insulinIndex?: number; // relative to white bread = 100
  digestionSpeed: DigestibilityScore;
  
  // Timing and usage
  idealTiming: FoodTiming[];
  
  // Dietary info
  restrictions: DietaryRestriction[];
  allergens: string[];
  
  // Additional metadata
  benefits: string[]; // Health/performance benefits
  tags: string[];
  notes?: string;
  
  // Visual
  imageUrl?: string;
  
  // Popularity and ratings
  popularityScore?: number; // for sorting
}

// ============================================================================
// MEAL STRUCTURE
// ============================================================================

export interface MealFood {
  foodId: string;
  food: Food;
  quantity: number; // in grams or servings
  unit: 'g' | 'serving';
}

export interface Meal {
  id: string;
  name: string;
  timing: FoodTiming;
  foods: MealFood[];
  totalCalories: number;
  totalMacros: Macronutrients;
  notes?: string;
}

export interface DailyNutritionPlan {
  id: string;
  name: string;
  date: Date;
  meals: Meal[];
  dailyTotals: {
    calories: number;
    macros: Macronutrients;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// ============================================================================
// NUTRITION CALCULATIONS
// ============================================================================

export interface NutritionGoals {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  proteinPerKg?: number; // g/kg bodyweight
  carbsPerKg?: number; // g/kg bodyweight
  fatPerKg?: number; // g/kg bodyweight
}

export interface MacroCalculationMethod {
  method: 'manual' | 'bodyweight_based' | 'tdee_percentage';
  bodyweight?: number; // kg
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extreme';
  goal?: 'cut' | 'maintain' | 'bulk';
}

// ============================================================================
// FILTER & SEARCH TYPES
// ============================================================================

export interface FoodFilters {
  categories?: FoodCategory[];
  restrictions?: DietaryRestriction[];
  minProtein?: number;
  maxCalories?: number;
  glycemicIndex?: GlycemicIndex[];
  timing?: FoodTiming[];
  searchQuery?: string;
}

export interface NutritionAnalytics {
  totalCalories: number;
  macroBreakdown: {
    protein: { grams: number; percentage: number };
    carbs: { grams: number; percentage: number };
    fat: { grams: number; percentage: number };
  };
  microDeficiencies: string[]; // Vitamins/minerals below RDA
  mealBalance: {
    mealName: string;
    caloriePercentage: number;
  }[];
  proteinDistribution: number[]; // grams per meal
  optimalProteinDistribution: boolean; // 20-40g per meal
}
