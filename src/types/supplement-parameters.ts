/**
 * Professional Supplement Parameters
 * Advanced parameters for supplement timing and dosing
 */

import { Supplement } from '../data/supplements';

// ============================================================================
// SUPPLEMENT TIMING PARAMETERS
// ============================================================================

export interface SupplementTimingParameters {
  // Timing relative to meals/workouts
  timing: 'pre-workout' | 'post-workout' | 'intra-workout' | 
          'morning' | 'midday' | 'evening' | 'before-bed' | 
          'with-meal' | 'empty-stomach' | 'anytime';
  
  // Specific timing
  timeOfDay?: string; // e.g., "08:00"
  relativeToMeal?: 'before' | 'with' | 'after';
  minutesBeforeMeal?: number;
  minutesAfterMeal?: number;
  
  // Workout-specific timing
  preWorkout?: {
    timing: number; // minutes before workout
    purpose: 'energy' | 'pump' | 'endurance' | 'focus' | 'strength';
  };
  
  postWorkout?: {
    timing: number; // minutes after workout
    purpose: 'recovery' | 'muscle-growth' | 'glycogen-replenishment' | 'hydration';
    window: number; // minutes (anabolic window)
  };
  
  // Cycling
  cycling?: {
    enabled: boolean;
    onDays: number; // days on
    offDays: number; // days off
    reason?: string; // e.g., "tolerance", "cost", "safety"
  };
  
  // Loading phase
  loadingPhase?: {
    enabled: boolean;
    duration: number; // days
    doseMultiplier: number; // e.g., 2x for creatine
  };
}

// ============================================================================
// SUPPLEMENT DOSING PARAMETERS
// ============================================================================

export interface SupplementDosingParameters {
  // Basic dosing
  amount: number;
  unit: string; // 'گرم', 'میلی‌گرم', 'IU', 'کپسول', 'اسکوپ', etc.
  frequency: 'daily' | 'twice-daily' | 'three-times-daily' | 
             'weekly' | 'as-needed' | 'pre-workout-only' | 
             'post-workout-only';
  
  // Advanced dosing
  splitDosing?: {
    enabled: boolean;
    doses: Array<{
      amount: number;
      timing: string;
    }>;
  };
  
  // Bodyweight-based dosing
  bodyweightBased?: {
    enabled: boolean;
    perKg: number; // amount per kg of bodyweight
    minAmount: number; // minimum amount
    maxAmount: number; // maximum amount
  };
  
  // Goal-based dosing
  goalBased?: {
    goal: 'muscle_gain' | 'fat_loss' | 'performance' | 'health' | 'recovery';
    adjustments: {
      muscle_gain?: number; // multiplier
      fat_loss?: number;
      performance?: number;
      health?: number;
      recovery?: number;
    };
  };
  
  // Stack combinations
  stack?: {
    enabled: boolean;
    supplements: Array<{
      name: string;
      amount: number;
      timing: string;
      synergy?: string; // e.g., "enhances absorption"
    }>;
  };
}

// ============================================================================
// SUPPLEMENT QUALITY PARAMETERS
// ============================================================================

export interface SupplementQualityParameters {
  // Quality standards
  qualityStandards?: string[]; // e.g., "NSF Certified", "USP Verified"
  
  // Third-party testing
  thirdPartyTested?: boolean;
  testingLab?: string;
  certificateUrl?: string;
  
  // Purity
  purity?: number; // percentage
  contaminants?: {
    heavyMetals?: boolean;
    pesticides?: boolean;
    microbes?: boolean;
  };
  
  // Form
  form?: 'powder' | 'capsule' | 'tablet' | 'liquid' | 'gel' | 'gummy';
  bioavailability?: 'low' | 'medium' | 'high';
  
  // Manufacturer
  manufacturer?: string;
  countryOfOrigin?: string;
  gmpCertified?: boolean;
}

// ============================================================================
// SUPPLEMENT SAFETY PARAMETERS
// ============================================================================

export interface SupplementSafetyParameters {
  // Contraindications
  contraindications?: string[]; // e.g., "pregnancy", "kidney disease"
  
  // Drug interactions
  drugInteractions?: Array<{
    drug: string;
    interaction: 'moderate' | 'severe';
    description: string;
  }>;
  
  // Side effects
  sideEffects?: Array<{
    effect: string;
    frequency: 'rare' | 'uncommon' | 'common';
    severity: 'mild' | 'moderate' | 'severe';
  }>;
  
  // Maximum safe dose
  maxSafeDose?: {
    daily: number;
    single: number;
    duration: number; // days
  };
  
  // Pregnancy/lactation
  pregnancySafe?: boolean;
  lactationSafe?: boolean;
  
  // Age restrictions
  ageRestrictions?: {
    min?: number;
    max?: number;
  };
}

// ============================================================================
// SUPPLEMENT EFFECTIVENESS PARAMETERS
// ============================================================================

export interface SupplementEffectivenessParameters {
  // Research rating (1-5)
  researchRating: 1 | 2 | 3 | 4 | 5;
  
  // Evidence level
  evidenceLevel?: 'strong' | 'moderate' | 'weak' | 'anecdotal';
  
  // Studies
  studies?: Array<{
    type: 'human' | 'animal' | 'in-vitro';
    participants?: number;
    duration?: number; // days
    results?: string;
  }>;
  
  // Expected benefits
  expectedBenefits?: string[];
  
  // Time to see results
  timeToResults?: {
    immediate: boolean; // e.g., pre-workout
    shortTerm: number; // days
    longTerm: number; // weeks/months
  };
  
  // Individual variability
  individualVariability?: 'low' | 'medium' | 'high';
}

// ============================================================================
// SUPPLEMENT COST PARAMETERS
// ============================================================================

export interface SupplementCostParameters {
  // Cost level
  costLevel: 'low' | 'medium' | 'high';
  
  // Price per serving
  pricePerServing?: number;
  currency?: string;
  
  // Value assessment
  valueRating?: 1 | 2 | 3 | 4 | 5; // 1 = poor value, 5 = excellent value
  
  // Cost per gram/mg
  costPerUnit?: number;
  
  // Bulk buying
  bulkDiscount?: {
    available: boolean;
    discountPercent?: number;
    minQuantity?: number;
  };
}

// ============================================================================
// UNIFIED SUPPLEMENT PARAMETERS
// ============================================================================

export interface SupplementParameters {
  supplement: Supplement;
  timing: SupplementTimingParameters;
  dosing: SupplementDosingParameters;
  quality: SupplementQualityParameters;
  safety: SupplementSafetyParameters;
  effectiveness: SupplementEffectivenessParameters;
  cost: SupplementCostParameters;
  
  // Personal notes
  personalNotes?: string;
  startDate?: string;
  endDate?: string;
  results?: string;
}

// Helper functions
export function getOptimalTiming(supplement: Supplement, goal: string): string[] {
  const timings: string[] = [];
  
  if (supplement.category === 'قبل تمرین' || supplement.type === 'پری ورک‌اوت') {
    timings.push('pre-workout');
  }
  
  if (supplement.category === 'پروتئین' && supplement.type.includes('وی')) {
    timings.push('post-workout', 'morning', 'between-meals');
  }
  
  if (supplement.category === 'پروتئین' && supplement.type.includes('کازئین')) {
    timings.push('before-bed', 'evening');
  }
  
  if (supplement.category === 'خواب و ریکاوری') {
    timings.push('before-bed', 'evening');
  }
  
  if (supplement.category === 'ویتامین و مینرال') {
    timings.push('with-meal', 'morning');
  }
  
  return timings.length > 0 ? timings : ['anytime'];
}

export function getOptimalDose(supplement: Supplement, bodyweight?: number): number {
  // Default dosing based on supplement type
  if (supplement.category === 'پروتئین') {
    return bodyweight ? bodyweight * 0.3 : 25; // 0.3g per kg bodyweight
  }
  
  if (supplement.category === 'قدرت و عملکرد' && supplement.type === 'کراتین') {
    return bodyweight ? bodyweight * 0.07 : 5; // 0.07g per kg bodyweight
  }
  
  if (supplement.category === 'آمینو اسید' && supplement.name.includes('BCAA')) {
    return bodyweight ? bodyweight * 0.1 : 5; // 0.1g per kg bodyweight
  }
  
  // Return default from supplement if available
  return supplement.dosage?.amount || 1;
}

// Default parameters
export const defaultSupplementParameters: Partial<SupplementParameters> = {
  timing: {
    timing: 'anytime',
    frequency: 'daily'
  },
  dosing: {
    amount: 1,
    unit: 'کپسول',
    frequency: 'daily'
  },
  quality: {
    thirdPartyTested: false,
    bioavailability: 'medium'
  },
  safety: {
    pregnancySafe: false,
    lactationSafe: false
  },
  effectiveness: {
    researchRating: 3,
    evidenceLevel: 'moderate'
  },
  cost: {
    costLevel: 'medium'
  }
};

