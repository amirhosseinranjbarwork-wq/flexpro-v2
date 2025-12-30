/**
 * Exercise Converter
 * Converts new exercise format to ultimate-training format
 */

import { exercises } from '../data/exercises';
import { Exercise, ExerciseCategory, MuscleGroup, Equipment, MovementPattern, DifficultyLevel } from '../types/ultimate-training';

// Map new muscle groups to ultimate-training MuscleGroup enum
const muscleGroupMap: Record<string, MuscleGroup> = {
  'سینه': MuscleGroup.CHEST,
  'پشت': MuscleGroup.BACK,
  'شانه': MuscleGroup.SHOULDERS,
  'بازو': MuscleGroup.BICEPS,
  'سه‌سر بازو': MuscleGroup.TRICEPS,
  'ساعد': MuscleGroup.FOREARMS,
  'چهارسر ران': MuscleGroup.QUADS,
  'همسترینگ': MuscleGroup.HAMSTRINGS,
  'باسن': MuscleGroup.GLUTES,
  'ساق پا': MuscleGroup.CALVES,
  'شکم': MuscleGroup.ABS,
  'مایل شکم': MuscleGroup.OBLIQUES,
  'کمر': MuscleGroup.LOWER_BACK,
  'ذوزنقه': MuscleGroup.TRAPS,
  'قلبی': MuscleGroup.FULL_BODY,
  'تمام بدن': MuscleGroup.FULL_BODY
};

// Map new equipment to ultimate-training Equipment enum
const equipmentMap: Record<string, Equipment> = {
  'وزن بدن': Equipment.BODYWEIGHT,
  'دمبل': Equipment.DUMBBELL,
  'هالتر': Equipment.BARBELL,
  'کابل': Equipment.CABLE,
  'دستگاه': Equipment.MACHINE,
  'کتل‌بل': Equipment.KETTLEBELL,
  'باند': Equipment.BANDS,
  'TRX': Equipment.TRX,
  'تردمیل': Equipment.TREADMILL,
  'دوچرخه': Equipment.BIKE,
  'روئینگ': Equipment.ROWER,
  'الپتیکال': Equipment.MACHINE,
  'استپر': Equipment.MACHINE,
  'اسکی فضایی': Equipment.MACHINE,
  'آیروبیک': Equipment.MACHINE,
  'طناب': Equipment.NONE,
  'جعبه': Equipment.NONE
};

// Map new type to ExerciseCategory
const typeToCategoryMap: Record<string, ExerciseCategory> = {
  'resistance': ExerciseCategory.RESISTANCE,
  'cardio': ExerciseCategory.CARDIO,
  'plyometric': ExerciseCategory.PLYOMETRIC,
  'corrective': ExerciseCategory.CORRECTIVE,
  'warmup': ExerciseCategory.STRETCHING,
  'cooldown': ExerciseCategory.STRETCHING
};

// Map new difficulty to DifficultyLevel
const difficultyMap: Record<string, DifficultyLevel> = {
  'beginner': DifficultyLevel.BEGINNER,
  'intermediate': DifficultyLevel.INTERMEDIATE,
  'advanced': DifficultyLevel.ADVANCED
};

// Helper to convert muscle group string to enum
function convertMuscleGroup(mg: string): MuscleGroup {
  return muscleGroupMap[mg] || MuscleGroup.FULL_BODY;
}

// Helper to convert equipment string to enum array
function convertEquipment(eq: string): Equipment[] {
  const mapped = equipmentMap[eq];
  return mapped ? [mapped] : [Equipment.NONE];
}

// Helper to determine movement pattern from exercise name and muscle group
function determineMovementPattern(exercise: typeof exercises[0]): MovementPattern | undefined {
  const name = exercise.name.toLowerCase();
  const muscleGroup = exercise.muscleGroup?.toLowerCase() || '';
  
  // Push patterns
  if (name.includes('پرس') || name.includes('press') || name.includes('push')) {
    if (muscleGroup.includes('شانه') || name.includes('بالا') || name.includes('overhead')) {
      return MovementPattern.VERTICAL_PUSH;
    }
    if (muscleGroup.includes('سینه') || name.includes('سینه') || name.includes('chest')) {
      return MovementPattern.HORIZONTAL_PUSH;
    }
  }
  
  // Pull patterns
  if (name.includes('کش') || name.includes('pull') || name.includes('row') || name.includes('لت')) {
    if (muscleGroup.includes('پشت') || name.includes('پشت') || name.includes('back')) {
      if (name.includes('بالا') || name.includes('overhead') || name.includes('pull-up')) {
        return MovementPattern.VERTICAL_PULL;
      }
      return MovementPattern.HORIZONTAL_PULL;
    }
  }
  
  // Lower body patterns
  if (name.includes('اسکوات') || name.includes('squat') || name.includes('چمباتمه')) {
    return MovementPattern.SQUAT;
  }
  if (name.includes('ددلیفت') || name.includes('deadlift') || name.includes('لانج') || name.includes('lunge')) {
    return MovementPattern.HINGE;
  }
  if (name.includes('لانج') || name.includes('lunge') || name.includes('قدم')) {
    return MovementPattern.LUNGE;
  }
  
  // Core patterns
  if (name.includes('چرخش') || name.includes('rotation') || name.includes('twist')) {
    return MovementPattern.ROTATION;
  }
  if (name.includes('پلانک') || name.includes('plank') || name.includes('stability')) {
    return MovementPattern.ANTI_ROTATION;
  }
  
  // Cardio patterns
  if (exercise.type === 'cardio') {
    return MovementPattern.LOCOMOTION;
  }
  
  return undefined;
}

/**
 * Convert new exercise format to ultimate-training Exercise format
 */
export function convertToUltimateExercise(exercise: typeof exercises[0]): Exercise {
  const primaryMuscles = exercise.primaryMuscles?.map(mg => convertMuscleGroup(mg)) || 
    (exercise.muscleGroup ? [convertMuscleGroup(exercise.muscleGroup)] : []);
  
  const secondaryMuscles = exercise.secondaryMuscles?.map(mg => convertMuscleGroup(mg)) || [];
  
  const equipment = convertEquipment(exercise.equipment);
  
  const category = typeToCategoryMap[exercise.type] || ExerciseCategory.RESISTANCE;
  
  const difficulty = difficultyMap[exercise.difficulty] || DifficultyLevel.INTERMEDIATE;
  
  const movementPattern = determineMovementPattern(exercise);
  
  // Determine tags based on exercise properties
  const tags: string[] = [];
  if (primaryMuscles.length > 1) tags.push('compound');
  if (equipment.includes(Equipment.BODYWEIGHT)) tags.push('bodyweight');
  if (exercise.type === 'cardio') tags.push('cardio');
  if (exercise.type === 'corrective') tags.push('corrective');
  if (exercise.type === 'warmup' || exercise.type === 'cooldown') tags.push('mobility');
  
  return {
    id: exercise.id,
    name: exercise.name,
    nameEn: exercise.nameEn || exercise.name,
    category,
    primaryMuscles,
    secondaryMuscles,
    equipment,
    movementPattern,
    difficulty,
    description: exercise.description || '',
    instructions: exercise.instructions || [],
    tips: exercise.tips || [],
    commonMistakes: exercise.commonMistakes || [],
    variations: exercise.variations || [],
    tags,
    caloriesPerHour: exercise.caloriesPerHour,
    preparationTime: exercise.preparationTime,
    executionTime: exercise.executionTime,
    restTime: exercise.restTime,
    // Default parameters
    defaultParameters: exercise.type === 'resistance' ? {
      sets: 3,
      reps: 10,
      rest: 90,
      weight: undefined
    } : exercise.type === 'cardio' ? {
      duration: 30,
      intensity: 'moderate' as const,
      targetZone: 2 as const
    } : undefined
  } as Exercise;
}

/**
 * Convert all exercises to ultimate-training format
 */
export function getAllUltimateExercises(): Exercise[] {
  return exercises.map(convertToUltimateExercise);
}

/**
 * Get exercises by category
 */
export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return getAllUltimateExercises().filter(ex => ex.category === category);
}

/**
 * Get exercises by muscle group
 */
export function getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Exercise[] {
  return getAllUltimateExercises().filter(ex => 
    ex.primaryMuscles.includes(muscleGroup) || 
    ex.secondaryMuscles.includes(muscleGroup)
  );
}

