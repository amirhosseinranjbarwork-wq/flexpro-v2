/**
 * TrainingPanel Sub-components
 * Scientific Workout Builder System
 */

// Legacy components
export { default as WorkoutDayTabs } from './WorkoutDayTabs';
export { default as ExerciseRow } from './ExerciseRow';
export { default as AddExerciseForm } from './AddExerciseForm';
export { default as MobileExerciseCard } from './MobileExerciseCard';
export { default as WorkoutBuilder } from './WorkoutBuilder';

// New Scientific Workout Builder Components (3-Column DnD Interface)
export { default as TrainingLayout } from './TrainingLayout';
export { default as ExerciseLibrary } from './ExerciseLibrary';
export { default as WorkoutCanvas } from './WorkoutCanvas';
export { default as ExerciseConfigCard } from './ExerciseConfigCard';

// Form components
export * from './forms';

// Import types
export type { ReactNode } from 'react';
