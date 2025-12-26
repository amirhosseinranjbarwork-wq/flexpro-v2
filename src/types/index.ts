export * from './types';
export * from './training';

// Re-export specific items from database to avoid conflicts with training types
export type {
  Json,
  Exercise,
  Food,
  ExerciseSearchParams,
  ExerciseSearchResult,
  FoodSearchParams,
  FoodSearchResult,
  PaginatedResponse,
  WorkoutPlanItem,
  WorkoutPlan,
  Profile,
  Database,
} from './database';

export type {
  ExerciseCategory as DBExerciseCategory,
  ExerciseType as DBExerciseType,
  ExerciseMechanics,
  EquipmentType as DBEquipmentType,
  DifficultyLevel as DBDifficultyLevel,
} from './database';
