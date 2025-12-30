/**
 * Food Data Helper
 * Converts new Food structure to old format for compatibility
 * This maintains backward compatibility with existing components
 */

import { foods, Food } from './foods';

// Old format interface (for compatibility)
export interface FoodInfo {
  u: string;
  b: number;
  c: number;
  p: number;
  ch: number;
  f: number;
  unit?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

// Convert new Food array to old format structure
export function getFoodDataInOldFormat(): Record<string, Record<string, FoodInfo>> {
  const result: Record<string, Record<string, FoodInfo>> = {};
  
  foods.forEach(food => {
    if (!result[food.category]) {
      result[food.category] = {};
    }
    
    result[food.category][food.name] = {
      u: food.unit,
      b: food.baseAmount,
      c: food.calories,
      p: food.protein,
      ch: food.carbs,
      f: food.fat,
      unit: food.unit,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat
    };
  });
  
  return result;
}

// Get food by name (case-insensitive)
export function getFoodByName(name: string): Food | undefined {
  return foods.find(f => 
    f.name.toLowerCase() === name.toLowerCase() ||
    f.nameEn?.toLowerCase() === name.toLowerCase()
  );
}

// Get foods by category
export function getFoodsByCategory(category: string): Food[] {
  return foods.filter(f => f.category === category);
}

// Get foods by meal timing
export function getFoodsByMealTiming(timing: 'pre-workout' | 'post-workout' | 'anytime' | 'morning' | 'evening'): Food[] {
  return foods.filter(f => 
    f.mealTiming?.includes(timing) || 
    f.mealTiming?.includes('anytime')
  );
}

// Get foods by macro ratio
export function getFoodsByMacroRatio(ratio: 'high-protein' | 'high-carb' | 'high-fat' | 'balanced'): Food[] {
  return foods.filter(f => f.macroRatio === ratio);
}

// Search foods
export function searchFoods(query: string): Food[] {
  const lowerQuery = query.toLowerCase();
  return foods.filter(f => 
    f.name.toLowerCase().includes(lowerQuery) ||
    f.nameEn?.toLowerCase().includes(lowerQuery) ||
    f.category.toLowerCase().includes(lowerQuery) ||
    f.subcategory?.toLowerCase().includes(lowerQuery)
  );
}

// Get recommended foods for goal
export function getRecommendedFoodsForGoal(
  goal: 'muscle_gain' | 'fat_loss' | 'maintenance' | 'performance',
  mealTiming?: 'pre-workout' | 'post-workout' | 'anytime'
): Food[] {
  let filtered = foods;
  
  // Filter by goal
  if (goal === 'muscle_gain') {
    filtered = filtered.filter(f => 
      f.macroRatio === 'high-protein' || 
      (f.protein > 15 && f.calories > 100)
    );
  } else if (goal === 'fat_loss') {
    filtered = filtered.filter(f => 
      f.satietyIndex && f.satietyIndex >= 6 ||
      (f.fiber && f.fiber > 3) ||
      f.macroRatio === 'high-protein'
    );
  } else if (goal === 'performance') {
    filtered = filtered.filter(f => 
      f.macroRatio === 'high-carb' ||
      f.digestibility === 'fast'
    );
  }
  
  // Filter by meal timing if provided
  if (mealTiming) {
    filtered = filtered.filter(f => 
      f.mealTiming?.includes(mealTiming) ||
      f.mealTiming?.includes('anytime')
    );
  }
  
  return filtered;
}

// Export for backward compatibility
export const foodData = getFoodDataInOldFormat();

