import { useQuery } from '@tanstack/react-query';
import { supplementsApi, Supplement } from '../services/api';

// Fallback data when API is not available
const fallbackSupplements: Supplement[] = [
  {
    id: 1,
    supplement_id: "creatine_monohydrate",
    name: "Creatine Monohydrate",
    category: "creatine",
    standard_dose: 5,
    dose_unit: "g",
    frequency_per_day: 1,
    timing: ["anytime"],
    evidence_level: "strong",
    primary_benefits: ["Increases muscle creatine stores", "Enhances strength (3-5%)", "Supports lean mass gains"],
    secondary_benefits: ["Neuroprotective properties", "May support cognitive function"],
    mechanisms: ["Increases phosphocreatine for ATP regeneration", "Cellular hydration"],
    meta_analysis_findings: "500+ studies confirm efficacy. Meta-analyses show consistent ~5% strength gains",
    side_effects: ["Water retention (not fat)", "Mild GI distress"],
    contraindications: ["Kidney disease"],
    pregnancy_safe: false,
    breastfeeding_safe: false,
    goals: ["strength_gain", "muscle_growth", "power_output"],
    stacks_with: ["beta_alanine", "protein"],
    cost_effectiveness: "very_high",
    taste_rating: 3,
    mixability: "good",
    tags: ["most_researched", "highly_effective", "affordable", "essential"],
    popularity_score: 98,
    scientific_rating: 10
  },
  {
    id: 2,
    supplement_id: "whey_protein_isolate",
    name: "Whey Protein Isolate",
    category: "protein",
    standard_dose: 25,
    dose_unit: "g",
    frequency_per_day: 1,
    timing: ["post_workout"],
    evidence_level: "strong",
    primary_benefits: ["Rapid MPS elevation", "Highest leucine content", "Complete amino acid profile"],
    goals: ["muscle_growth", "recovery"],
    tags: ["fast_digesting", "high_leucine", "convenient"],
    popularity_score: 95,
    scientific_rating: 9
  },
  {
    id: 3,
    supplement_id: "fish_oil",
    name: "Fish Oil (EPA/DHA)",
    category: "general_health",
    standard_dose: 2000,
    dose_unit: "mg",
    frequency_per_day: 1,
    timing: ["with_meals"],
    evidence_level: "strong",
    primary_benefits: ["Anti-inflammatory", "Cardiovascular health", "Brain health"],
    goals: ["cardiovascular_health", "recovery", "joint_health"],
    tags: ["anti_inflammatory", "heart_health", "essential"],
    popularity_score: 88,
    scientific_rating: 9
  }
];

export function useSupplements(filters?: {
  category?: string;
  search?: string;
  evidence_level?: string;
  goal?: string;
  min_rating?: number;
}) {
  return useQuery({
    queryKey: ['supplements', filters],
    queryFn: async (): Promise<Supplement[]> => {
      try {
        const data = await supplementsApi.getAll(filters);
        if (!data || data.length === 0) {
          console.warn('No supplements data from API, using fallback data');
          return fallbackSupplements;
        }
        return data;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.warn('useSupplements API error, using fallback data:', errorMessage);
        return fallbackSupplements;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
}

export function useSupplementCategories() {
  return useQuery({
    queryKey: ['supplement-categories'],
    queryFn: async (): Promise<string[]> => {
      try {
        return await supplementsApi.getCategories();
      } catch (err: unknown) {
        console.warn('useSupplementCategories API error:', err);
        // Return unique categories from fallback data
        return [...new Set(fallbackSupplements.map(s => s.category).filter(Boolean))];
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
}

export function useTopRatedSupplements(limit: number = 10, minRating: number = 8) {
  return useQuery({
    queryKey: ['supplements-top-rated', limit, minRating],
    queryFn: async (): Promise<Supplement[]> => {
      try {
        return await supplementsApi.getTopRated(limit, minRating);
      } catch (err: unknown) {
        console.warn('useTopRatedSupplements API error:', err);
        // Return filtered fallback data
        return fallbackSupplements.filter(s =>
          s.scientific_rating && s.scientific_rating >= minRating
        ).sort((a, b) => (b.scientific_rating || 0) - (a.scientific_rating || 0)).slice(0, limit);
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
  });
}