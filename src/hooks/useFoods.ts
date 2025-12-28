import { useQuery } from '@tanstack/react-query';
import { foodsApi, Food } from '../services/api';

// Fallback data when API is not available
const fallbackFoods: Food[] = [
  {
    id: 1,
    food_id: "food_chicken_breast",
    name: "Chicken Breast (Skinless)",
    category: "protein",
    subcategory: "poultry",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    benefits: "High protein, low fat, excellent bioavailability"
  },
  {
    id: 2,
    food_id: "food_salmon",
    name: "Atlantic Salmon (Wild)",
    category: "protein",
    subcategory: "fish",
    calories: 206,
    protein: 25,
    carbs: 0,
    fat: 11,
    fiber: 0,
    benefits: "Ultra-high omega-3, anti-inflammatory, heart health"
  },
  {
    id: 3,
    food_id: "food_white_rice",
    name: "White Rice (Cooked)",
    category: "carbohydrate",
    subcategory: "grains",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    benefits: "Quick-digesting carb for glycogen replenishment"
  }
];

export function useFoods(filters?: {
  category?: string;
  search?: string;
  protein_type?: string;
}) {
  return useQuery({
    queryKey: ['foods', filters],
    queryFn: async (): Promise<Food[]> => {
      try {
        const data = await foodsApi.getAll(filters);
        if (!data || data.length === 0) {
          console.warn('No foods data from API, using fallback data');
          return fallbackFoods;
        }
        return data;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.warn('useFoods API error, using fallback data:', errorMessage);
        return fallbackFoods;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
}

export function useFoodCategories() {
  return useQuery({
    queryKey: ['food-categories'],
    queryFn: async (): Promise<string[]> => {
      try {
        return await foodsApi.getCategories();
      } catch (err: unknown) {
        console.warn('useFoodCategories API error:', err);
        // Return unique categories from fallback data
        return [...new Set(fallbackFoods.map(f => f.category).filter(Boolean))];
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
}