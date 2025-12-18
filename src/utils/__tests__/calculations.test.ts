import { describe, it, expect } from 'vitest';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateActivityFactor,
  calculateTargetCalories,
  calculateBodyFat,
  calculateIdealWeight,
  calculateMacros,
  calculateWaterIntake,
  calculateFitnessMetrics,
  type MeasurementData
} from '../calculations';

describe('Fitness Calculations', () => {
  describe('calculateBMI', () => {
    it('should calculate BMI correctly', () => {
      const result = calculateBMI(70, 175);
      expect(result.bmi).toBeCloseTo(22.9, 1);
      expect(result.category).toBe('نرمال');
      expect(result.color).toBe('text-emerald-500');
    });

    it('should handle invalid inputs', () => {
      const result = calculateBMI(0, 175);
      expect(result.bmi).toBe(0);
      expect(result.category).toBe('نامعتبر');
    });

    it('should categorize BMI ranges correctly', () => {
      // Severe underweight (< 16)
      expect(calculateBMI(43, 175).category).toBe('لاغری شدید');
      // Moderate underweight (16-17)
      expect(calculateBMI(50, 175).category).toBe('لاغری متوسط');
      // Underweight (17-18.5)
      expect(calculateBMI(54, 175).category).toBe('کمبود وزن');
      // Normal
      expect(calculateBMI(65, 175).category).toBe('نرمال');
      // Overweight
      expect(calculateBMI(80, 175).category).toBe('اضافه وزن');
      // Obese
      expect(calculateBMI(100, 175).category).toBe('چاقی درجه 1');
    });
  });

  describe('calculateBMR', () => {
    const baseData: MeasurementData = {
      weight: 70,
      height: 175,
      age: 30,
      gender: 'male',
      activity: 1.55
    };

    it('should calculate BMR for male using Mifflin-St Jeor formula', () => {
      const bmr = calculateBMR(baseData);
      expect(bmr).toBeGreaterThan(1500);
      expect(bmr).toBeLessThan(2000);
    });

    it('should calculate BMR for female', () => {
      const femaleData = { ...baseData, gender: 'female' as const };
      const bmr = calculateBMR(femaleData);
      expect(bmr).toBeGreaterThan(1300);
      expect(bmr).toBeLessThan(1700);
    });

    it('should handle body fat percentage in calculation', () => {
      const dataWithBodyFat = { ...baseData, bodyFat: 15 };
      const bmr = calculateBMR(dataWithBodyFat);
      expect(bmr).toBeGreaterThan(0);
    });

    it('should return 0 for invalid inputs', () => {
      const invalidData = { ...baseData, weight: 0 };
      const bmr = calculateBMR(invalidData);
      expect(bmr).toBe(0);
    });
  });

  describe('calculateTDEE', () => {
    it('should calculate TDEE correctly', () => {
      const tdee = calculateTDEE(1700, 1.55);
      expect(tdee).toBeCloseTo(2635, 0);
    });

    it('should handle invalid BMR', () => {
      const tdee = calculateTDEE(0, 1.55);
      expect(tdee).toBe(0);
    });

    it('should handle invalid activity factor', () => {
      const tdee = calculateTDEE(1700, 0.5);
      expect(tdee).toBe(0); // Invalid activity factor returns 0
    });
  });

  describe('calculateActivityFactor', () => {
    it('should adjust activity factor based on training days', () => {
      expect(calculateActivityFactor(1.2, 6)).toBe(1.725); // Very active
      expect(calculateActivityFactor(1.2, 4)).toBe(1.55);  // Moderately active
      expect(calculateActivityFactor(1.2, 2)).toBe(1.375); // Lightly active
      expect(calculateActivityFactor(1.2, 0)).toBe(1.2);   // Sedentary
    });

    it('should adjust based on goal', () => {
      const baseActivity = 1.55;
      expect(calculateActivityFactor(baseActivity, 3, 'weight-loss')).toBeLessThan(baseActivity);
      expect(calculateActivityFactor(baseActivity, 3, 'muscle-gain')).toBeGreaterThan(baseActivity);
    });

    it('should constrain values within valid range', () => {
      // Invalid base activity gets reset to default (1.55)
      expect(calculateActivityFactor(3.0, 3)).toBe(1.55);
      expect(calculateActivityFactor(0.5, 3)).toBe(1.55); // Invalid gets reset to default
    });
  });

  describe('calculateTargetCalories', () => {
    it('should calculate maintenance calories', () => {
      const result = calculateTargetCalories(2500);
      expect(result.calories).toBe(2500);
      expect(result.adjustment).toBe(0);
    });

    it('should create deficit for weight loss', () => {
      const result = calculateTargetCalories(2500, 'weight-loss');
      expect(result.calories).toBeLessThan(2500);
      expect(result.adjustment).toBe(-500);
    });

    it('should create surplus for weight gain', () => {
      const result = calculateTargetCalories(2500, 'weight-gain');
      expect(result.calories).toBeGreaterThan(2500);
      expect(result.adjustment).toBe(400);
    });

    it('should create surplus for muscle gain', () => {
      const result = calculateTargetCalories(2500, 'muscle-gain');
      expect(result.calories).toBeGreaterThan(2500);
      expect(result.adjustment).toBe(300);
    });
  });

  describe('calculateBodyFat', () => {
    const baseData: MeasurementData = {
      weight: 70,
      height: 175,
      age: 30,
      gender: 'male',
      activity: 1.55,
      waist: 80,
      hip: 95,
      neck: 38
    };

    it('should return provided body fat percentage', () => {
      const dataWithBF = { ...baseData, bodyFat: 15 };
      expect(calculateBodyFat(dataWithBF)).toBe(15);
    });

    it('should calculate body fat using Navy formula for men', () => {
      const result = calculateBodyFat(baseData);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(50);
    });

    it('should calculate body fat for women', () => {
      const femaleData = { ...baseData, gender: 'female' as const };
      const result = calculateBodyFat(femaleData);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(50);
    });
  });

  describe('calculateIdealWeight', () => {
    it('should calculate ideal weight range', () => {
      const result = calculateIdealWeight(175, 'male');
      expect(result.min).toBeGreaterThan(50);
      expect(result.max).toBeLessThan(80);
      expect(result.ideal).toBeGreaterThan(result.min);
      expect(result.ideal).toBeLessThan(result.max);
    });

    it('should handle invalid height', () => {
      const result = calculateIdealWeight(0, 'male');
      expect(result.min).toBe(0);
      expect(result.max).toBe(0);
      expect(result.ideal).toBe(0);
    });
  });

  describe('calculateMacros', () => {
    it('should calculate macros for muscle gain', () => {
      const result = calculateMacros(70, 3000, 'muscle-gain');
      expect(result.protein).toBeCloseTo(168, 0); // 2.4g/kg
      expect(result.fat).toBeGreaterThan(0);
      expect(result.carbs).toBeGreaterThan(0);
      expect(result.protein * 4 + result.fat * 9 + result.carbs * 4).toBeCloseTo(3000, -50);
    });

    it('should calculate macros for weight loss', () => {
      const result = calculateMacros(70, 2200, 'weight-loss');
      expect(result.protein).toBeCloseTo(140, 0); // 2.0g/kg
      expect(result.fat).toBeGreaterThan(0);
      expect(result.carbs).toBeGreaterThan(0);
    });

    it('should handle invalid inputs', () => {
      const result = calculateMacros(0, 2000);
      expect(result.protein).toBe(0);
      expect(result.fat).toBe(0);
      expect(result.carbs).toBe(0);
    });
  });

  describe('calculateWaterIntake', () => {
    it('should calculate water intake based on weight', () => {
      const water = calculateWaterIntake(70, 1.55);
      expect(water).toBeCloseTo(2100, -100); // ~30ml/kg adjusted for activity
    });

    it('should adjust for activity level', () => {
      const sedentary = calculateWaterIntake(70, 1.2);
      const active = calculateWaterIntake(70, 1.725);
      expect(active).toBeGreaterThan(sedentary);
    });
  });

  describe('calculateFitnessMetrics', () => {
    const sampleData: MeasurementData = {
      weight: 70,
      height: 175,
      age: 30,
      gender: 'male',
      activity: 1.55,
      waist: 80,
      hip: 95,
      neck: 38,
      trainingDays: 4,
      goal: 'muscle-gain'
    };

    it('should calculate complete fitness metrics', () => {
      const result = calculateFitnessMetrics(sampleData);

      expect(result.bmi).toBeGreaterThan(0);
      expect(result.bmr).toBeGreaterThan(0);
      expect(result.tdee).toBeGreaterThan(result.bmr);
      expect(result.targetCalories).toBeGreaterThan(result.tdee);
      expect(result.protein).toBeGreaterThan(0);
      expect(result.fat).toBeGreaterThan(0);
      expect(result.carbs).toBeGreaterThan(0);
    });

    it('should handle all goal types', () => {
      const goals = ['weight-loss', 'weight-gain', 'muscle-gain', 'recomp', undefined];

      goals.forEach(goal => {
        const data = { ...sampleData, goal };
        const result = calculateFitnessMetrics(data);
        expect(result.targetCalories).toBeGreaterThan(0);
      });
    });
  });
});














