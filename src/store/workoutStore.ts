/**
 * Workout Builder Store
 * Zustand state management for the Scientific Workout Builder
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  ExerciseType,
  MuscleGroup,
  TrainingSystemType,
  CardioMethod,
  PlyometricIntensity,
  CorrectiveExerciseType,
  HeartRateZone,
  RPE,
  RIR,
} from '../types/training';
import type { DifficultyLevel, EquipmentType, ExerciseCategory } from '../types/database';

// ========== Types ==========

export interface ExerciseFromDB {
  id: string;
  name: string;
  muscle_group: string;
  sub_muscle_group?: string | null;
  equipment?: string;
  type: string;
  mechanics?: string;
  description?: string;
  instructions?: string;
  category?: ExerciseCategory;
  primary_muscle?: string;
  secondary_muscles?: string[];
  equipment_standardized?: EquipmentType;
  difficulty_level?: DifficultyLevel;
  default_rpe?: number;
  default_rir?: number;
  rest_interval_seconds?: number;
  tempo?: string;
  gif_url?: string;
  video_url?: string;
  image_url?: string;
}

export interface WorkoutExerciseInstance {
  instanceId: string;           // Unique ID for this instance in the workout
  exerciseId: string;           // Reference to the original exercise
  exercise: ExerciseFromDB;     // The exercise data
  exerciseType: ExerciseType;   // 'resistance' | 'cardio' | 'plyometric' | 'corrective'
  orderIndex: number;           // Position in the workout
  // Type-specific configuration
  config: ResistanceConfig | CardioConfig | PlyometricConfig | CorrectiveConfig;
}

// Configuration types for each exercise type
export interface ResistanceConfig {
  type: 'resistance';
  trainingSystem: TrainingSystemType;
  sets: number;
  reps: string;
  weight?: number;
  weightUnit: 'kg' | 'lb';
  rpe?: RPE;
  rir?: RIR;
  tempo?: string;
  restSeconds: number;
  notes?: string;
  // Advanced
  dropCount?: number;
  restPauseSeconds?: number;
  clusterReps?: number;
  clusterRest?: number;
}

export interface CardioConfig {
  type: 'cardio';
  method: CardioMethod;
  durationMinutes: number;
  targetZone: HeartRateZone;
  workSeconds?: number;
  restSeconds?: number;
  intervals?: number;
  targetSpeed?: number;
  targetIncline?: number;
  targetHeartRateMin?: number;
  targetHeartRateMax?: number;
  notes?: string;
}

export interface PlyometricConfig {
  type: 'plyometric';
  sets: number;
  contacts: number;
  intensity: PlyometricIntensity;
  restSeconds: number;
  boxHeightCm?: number;
  landingType?: 'step_down' | 'jump_down' | 'rebound';
  isSingleLeg?: boolean;
  notes?: string;
}

export interface CorrectiveConfig {
  type: 'corrective';
  correctiveType: CorrectiveExerciseType;
  sets?: number;
  reps?: number;
  holdSeconds?: number;
  durationSeconds?: number;
  passes?: number;
  pressure?: 'light' | 'moderate' | 'deep';
  stretchSide?: 'left' | 'right' | 'both';
  nasmPhase?: 'inhibit' | 'lengthen' | 'activate' | 'integrate';
  cues?: string[];
  notes?: string;
}

export type ExerciseConfig = ResistanceConfig | CardioConfig | PlyometricConfig | CorrectiveConfig;

// Filter state
export interface WorkoutFilters {
  search: string;
  muscleGroup: MuscleGroup | null;
  exerciseType: ExerciseType | null;
  category: ExerciseCategory | null;
  equipment: EquipmentType | null;
  difficulty: DifficultyLevel | null;
}

// Workout day structure
export interface WorkoutDayState {
  dayNumber: number;
  name?: string;
  exercises: WorkoutExerciseInstance[];
}

// ========== Store State ==========

interface WorkoutState {
  // Data
  availableExercises: ExerciseFromDB[];
  isLoadingExercises: boolean;
  
  // Current workout editing state
  currentDay: number;
  workoutDays: Record<number, WorkoutDayState>;
  
  // UI State
  filters: WorkoutFilters;
  selectedInstanceId: string | null;
  isDragging: boolean;
  
  // Computed
  filteredExercises: ExerciseFromDB[];
}

interface WorkoutActions {
  // Exercise loading
  setAvailableExercises: (exercises: ExerciseFromDB[]) => void;
  setLoadingExercises: (loading: boolean) => void;
  
  // Day management
  setCurrentDay: (day: number) => void;
  initializeDay: (dayNumber: number, name?: string) => void;
  
  // Exercise management
  addExerciseToWorkout: (exercise: ExerciseFromDB, exerciseType?: ExerciseType) => void;
  removeExercise: (instanceId: string) => void;
  duplicateExercise: (instanceId: string) => void;
  clearWorkout: () => void;
  
  // Configuration updates - Generic handler
  updateExerciseConfig: <K extends keyof ExerciseConfig>(
    instanceId: string,
    field: K,
    value: ExerciseConfig[K]
  ) => void;
  
  // Specific update methods for better type safety
  updateResistanceConfig: (instanceId: string, updates: Partial<ResistanceConfig>) => void;
  updateCardioConfig: (instanceId: string, updates: Partial<CardioConfig>) => void;
  updatePlyometricConfig: (instanceId: string, updates: Partial<PlyometricConfig>) => void;
  updateCorrectiveConfig: (instanceId: string, updates: Partial<CorrectiveConfig>) => void;
  
  // Reordering
  reorderExercises: (oldIndex: number, newIndex: number) => void;
  moveExercise: (instanceId: string, direction: 'up' | 'down') => void;
  
  // Filters
  setFilter: <K extends keyof WorkoutFilters>(key: K, value: WorkoutFilters[K]) => void;
  resetFilters: () => void;
  setSearchTerm: (term: string) => void;
  
  // Selection
  selectExercise: (instanceId: string | null) => void;
  setDragging: (isDragging: boolean) => void;
  
  // Computed getters
  getCurrentDayExercises: () => WorkoutExerciseInstance[];
  getExerciseInstance: (instanceId: string) => WorkoutExerciseInstance | undefined;
  getTotalSets: () => number;
  getEstimatedDuration: () => number;
}

// ========== Default Values ==========

const DEFAULT_FILTERS: WorkoutFilters = {
  search: '',
  muscleGroup: null,
  exerciseType: null,
  category: null,
  equipment: null,
  difficulty: null,
};

const createDefaultResistanceConfig = (exercise: ExerciseFromDB): ResistanceConfig => ({
  type: 'resistance',
  trainingSystem: 'straight_set',
  sets: 3,
  reps: '10',
  weightUnit: 'kg',
  rpe: exercise.default_rpe as RPE || 7,
  rir: exercise.default_rir as RIR || 2,
  tempo: exercise.tempo || '2-0-2-0',
  restSeconds: exercise.rest_interval_seconds || 90,
});

const createDefaultCardioConfig = (): CardioConfig => ({
  type: 'cardio',
  method: 'liss',
  durationMinutes: 30,
  targetZone: 2,
  restSeconds: 0,
});

const createDefaultPlyometricConfig = (): PlyometricConfig => ({
  type: 'plyometric',
  sets: 3,
  contacts: 10,
  intensity: 'moderate',
  restSeconds: 120,
});

const createDefaultCorrectiveConfig = (): CorrectiveConfig => ({
  type: 'corrective',
  correctiveType: 'foam_rolling',
  holdSeconds: 30,
  nasmPhase: 'inhibit',
});

// ========== Utility Functions ==========

const generateInstanceId = (): string => {
  return `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const determineExerciseType = (exercise: ExerciseFromDB): ExerciseType => {
  const category = exercise.category?.toLowerCase() || '';
  const type = exercise.type?.toLowerCase() || '';
  
  if (category === 'cardio' || type === 'cardio') return 'cardio';
  if (category === 'corrective' || type === 'corrective') return 'corrective';
  if (type === 'plyometric' || exercise.name?.toLowerCase().includes('جامپ') || exercise.name?.toLowerCase().includes('پرش')) {
    return 'plyometric';
  }
  return 'resistance';
};

const createDefaultConfig = (exercise: ExerciseFromDB, exerciseType: ExerciseType): ExerciseConfig => {
  switch (exerciseType) {
    case 'cardio':
      return createDefaultCardioConfig();
    case 'plyometric':
      return createDefaultPlyometricConfig();
    case 'corrective':
      return createDefaultCorrectiveConfig();
    case 'resistance':
    default:
      return createDefaultResistanceConfig(exercise);
  }
};

const filterExercises = (exercises: ExerciseFromDB[], filters: WorkoutFilters): ExerciseFromDB[] => {
  return exercises.filter(ex => {
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const nameMatch = ex.name?.toLowerCase().includes(search);
      const muscleMatch = ex.muscle_group?.toLowerCase().includes(search);
      const primaryMatch = ex.primary_muscle?.toLowerCase().includes(search);
      if (!nameMatch && !muscleMatch && !primaryMatch) return false;
    }
    
    // Muscle group filter
    if (filters.muscleGroup && ex.muscle_group !== filters.muscleGroup) {
      return false;
    }
    
    // Exercise type filter
    if (filters.exerciseType) {
      const exType = determineExerciseType(ex);
      if (exType !== filters.exerciseType) return false;
    }
    
    // Category filter
    if (filters.category && ex.category !== filters.category) {
      return false;
    }
    
    // Equipment filter
    if (filters.equipment && ex.equipment_standardized !== filters.equipment) {
      return false;
    }
    
    // Difficulty filter
    if (filters.difficulty && ex.difficulty_level !== filters.difficulty) {
      return false;
    }
    
    return true;
  });
};

// ========== Store ==========

export const useWorkoutStore = create<WorkoutState & WorkoutActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        availableExercises: [],
        isLoadingExercises: false,
        currentDay: 1,
        workoutDays: {
          1: { dayNumber: 1, exercises: [] },
          2: { dayNumber: 2, exercises: [] },
          3: { dayNumber: 3, exercises: [] },
          4: { dayNumber: 4, exercises: [] },
          5: { dayNumber: 5, exercises: [] },
          6: { dayNumber: 6, exercises: [] },
          7: { dayNumber: 7, exercises: [] },
        },
        filters: DEFAULT_FILTERS,
        selectedInstanceId: null,
        isDragging: false,
        filteredExercises: [],

        // ========== Exercise Loading ==========
        setAvailableExercises: (exercises) => set((state) => {
          state.availableExercises = exercises;
          state.filteredExercises = filterExercises(exercises, state.filters);
        }),
        
        setLoadingExercises: (loading) => set((state) => {
          state.isLoadingExercises = loading;
        }),

        // ========== Day Management ==========
        setCurrentDay: (day) => set((state) => {
          state.currentDay = day;
          // Initialize day if it doesn't exist
          if (!state.workoutDays[day]) {
            state.workoutDays[day] = { dayNumber: day, exercises: [] };
          }
        }),
        
        initializeDay: (dayNumber, name) => set((state) => {
          if (!state.workoutDays[dayNumber]) {
            state.workoutDays[dayNumber] = { dayNumber, name, exercises: [] };
          } else {
            state.workoutDays[dayNumber].name = name;
          }
        }),

        // ========== Exercise Management ==========
        addExerciseToWorkout: (exercise, exerciseType) => set((state) => {
          const day = state.currentDay;
          if (!state.workoutDays[day]) {
            state.workoutDays[day] = { dayNumber: day, exercises: [] };
          }
          
          const type = exerciseType || determineExerciseType(exercise);
          const config = createDefaultConfig(exercise, type);
          
          const newInstance: WorkoutExerciseInstance = {
            instanceId: generateInstanceId(),
            exerciseId: exercise.id,
            exercise,
            exerciseType: type,
            orderIndex: state.workoutDays[day].exercises.length,
            config,
          };
          
          state.workoutDays[day].exercises.push(newInstance);
        }),
        
        removeExercise: (instanceId) => set((state) => {
          const day = state.currentDay;
          const exercises = state.workoutDays[day]?.exercises || [];
          const index = exercises.findIndex(e => e.instanceId === instanceId);
          
          if (index !== -1) {
            state.workoutDays[day].exercises.splice(index, 1);
            // Re-index
            state.workoutDays[day].exercises.forEach((ex, i) => {
              ex.orderIndex = i;
            });
          }
          
          // Clear selection if removed
          if (state.selectedInstanceId === instanceId) {
            state.selectedInstanceId = null;
          }
        }),
        
        duplicateExercise: (instanceId) => set((state) => {
          const day = state.currentDay;
          const exercises = state.workoutDays[day]?.exercises || [];
          const original = exercises.find(e => e.instanceId === instanceId);
          
          if (original) {
            const duplicate: WorkoutExerciseInstance = {
              ...original,
              instanceId: generateInstanceId(),
              orderIndex: exercises.length,
              config: { ...original.config },
            };
            state.workoutDays[day].exercises.push(duplicate);
          }
        }),
        
        clearWorkout: () => set((state) => {
          const day = state.currentDay;
          if (state.workoutDays[day]) {
            state.workoutDays[day].exercises = [];
          }
          state.selectedInstanceId = null;
        }),

        // ========== Configuration Updates ==========
        updateExerciseConfig: (instanceId, field, value) => set((state) => {
          const day = state.currentDay;
          const exercise = state.workoutDays[day]?.exercises.find(
            e => e.instanceId === instanceId
          );
          if (exercise) {
            (exercise.config as Record<string, unknown>)[field as string] = value;
          }
        }),
        
        updateResistanceConfig: (instanceId, updates) => set((state) => {
          const day = state.currentDay;
          const exercise = state.workoutDays[day]?.exercises.find(
            e => e.instanceId === instanceId
          );
          if (exercise && exercise.config.type === 'resistance') {
            Object.assign(exercise.config, updates);
          }
        }),
        
        updateCardioConfig: (instanceId, updates) => set((state) => {
          const day = state.currentDay;
          const exercise = state.workoutDays[day]?.exercises.find(
            e => e.instanceId === instanceId
          );
          if (exercise && exercise.config.type === 'cardio') {
            Object.assign(exercise.config, updates);
          }
        }),
        
        updatePlyometricConfig: (instanceId, updates) => set((state) => {
          const day = state.currentDay;
          const exercise = state.workoutDays[day]?.exercises.find(
            e => e.instanceId === instanceId
          );
          if (exercise && exercise.config.type === 'plyometric') {
            Object.assign(exercise.config, updates);
          }
        }),
        
        updateCorrectiveConfig: (instanceId, updates) => set((state) => {
          const day = state.currentDay;
          const exercise = state.workoutDays[day]?.exercises.find(
            e => e.instanceId === instanceId
          );
          if (exercise && exercise.config.type === 'corrective') {
            Object.assign(exercise.config, updates);
          }
        }),

        // ========== Reordering ==========
        reorderExercises: (oldIndex, newIndex) => set((state) => {
          const day = state.currentDay;
          const exercises = state.workoutDays[day]?.exercises;
          
          if (exercises && oldIndex !== newIndex) {
            const [removed] = exercises.splice(oldIndex, 1);
            exercises.splice(newIndex, 0, removed);
            // Re-index
            exercises.forEach((ex, i) => {
              ex.orderIndex = i;
            });
          }
        }),
        
        moveExercise: (instanceId, direction) => set((state) => {
          const day = state.currentDay;
          const exercises = state.workoutDays[day]?.exercises;
          
          if (!exercises) return;
          
          const currentIndex = exercises.findIndex(e => e.instanceId === instanceId);
          if (currentIndex === -1) return;
          
          const newIndex = direction === 'up' 
            ? Math.max(0, currentIndex - 1)
            : Math.min(exercises.length - 1, currentIndex + 1);
          
          if (currentIndex !== newIndex) {
            const [removed] = exercises.splice(currentIndex, 1);
            exercises.splice(newIndex, 0, removed);
            exercises.forEach((ex, i) => {
              ex.orderIndex = i;
            });
          }
        }),

        // ========== Filters ==========
        setFilter: (key, value) => set((state) => {
          state.filters[key] = value;
          state.filteredExercises = filterExercises(state.availableExercises, state.filters);
        }),
        
        resetFilters: () => set((state) => {
          state.filters = DEFAULT_FILTERS;
          state.filteredExercises = state.availableExercises;
        }),
        
        setSearchTerm: (term) => set((state) => {
          state.filters.search = term;
          state.filteredExercises = filterExercises(state.availableExercises, state.filters);
        }),

        // ========== Selection ==========
        selectExercise: (instanceId) => set((state) => {
          state.selectedInstanceId = instanceId;
        }),
        
        setDragging: (isDragging) => set((state) => {
          state.isDragging = isDragging;
        }),

        // ========== Computed Getters ==========
        getCurrentDayExercises: () => {
          const state = get();
          return state.workoutDays[state.currentDay]?.exercises || [];
        },
        
        getExerciseInstance: (instanceId) => {
          const state = get();
          return state.workoutDays[state.currentDay]?.exercises.find(
            e => e.instanceId === instanceId
          );
        },
        
        getTotalSets: () => {
          const exercises = get().getCurrentDayExercises();
          return exercises.reduce((total, ex) => {
            if (ex.config.type === 'resistance') {
              return total + (ex.config as ResistanceConfig).sets;
            }
            if (ex.config.type === 'plyometric') {
              return total + (ex.config as PlyometricConfig).sets;
            }
            if (ex.config.type === 'corrective' && (ex.config as CorrectiveConfig).sets) {
              return total + ((ex.config as CorrectiveConfig).sets || 0);
            }
            return total;
          }, 0);
        },
        
        getEstimatedDuration: () => {
          const exercises = get().getCurrentDayExercises();
          let totalSeconds = 0;
          
          exercises.forEach(ex => {
            switch (ex.config.type) {
              case 'resistance': {
                const config = ex.config as ResistanceConfig;
                // ~30 seconds per set + rest between sets
                const setTime = config.sets * 30;
                const restTime = (config.sets - 1) * config.restSeconds;
                totalSeconds += setTime + restTime;
                break;
              }
              case 'cardio': {
                const config = ex.config as CardioConfig;
                totalSeconds += config.durationMinutes * 60;
                break;
              }
              case 'plyometric': {
                const config = ex.config as PlyometricConfig;
                // ~20 seconds per set + rest
                const setTime = config.sets * 20;
                const restTime = (config.sets - 1) * config.restSeconds;
                totalSeconds += setTime + restTime;
                break;
              }
              case 'corrective': {
                const config = ex.config as CorrectiveConfig;
                if (config.durationSeconds) {
                  totalSeconds += config.durationSeconds;
                } else if (config.holdSeconds && config.sets) {
                  totalSeconds += config.holdSeconds * config.sets;
                } else {
                  totalSeconds += 60; // Default 1 minute
                }
                break;
              }
            }
          });
          
          return Math.ceil(totalSeconds / 60);
        },
      })),
      {
        name: 'workout-builder-storage',
        partialize: (state) => ({
          workoutDays: state.workoutDays,
          currentDay: state.currentDay,
        }),
      }
    ),
    { name: 'WorkoutStore' }
  )
);

// ========== Selectors (for performance optimization) ==========

export const useCurrentDayExercises = () => 
  useWorkoutStore((state) => state.workoutDays[state.currentDay]?.exercises || []);

export const useFilters = () => 
  useWorkoutStore((state) => state.filters);

export const useFilteredExercises = () => 
  useWorkoutStore((state) => state.filteredExercises);

export const useSelectedInstance = () => 
  useWorkoutStore((state) => {
    if (!state.selectedInstanceId) return null;
    return state.workoutDays[state.currentDay]?.exercises.find(
      e => e.instanceId === state.selectedInstanceId
    ) || null;
  });

export const useWorkoutStats = () => 
  useWorkoutStore((state) => {
    const exercises = state.workoutDays[state.currentDay]?.exercises || [];
    const totalSets = exercises.reduce((total, ex) => {
      if (ex.config.type === 'resistance') return total + (ex.config as ResistanceConfig).sets;
      if (ex.config.type === 'plyometric') return total + (ex.config as PlyometricConfig).sets;
      if (ex.config.type === 'corrective' && (ex.config as CorrectiveConfig).sets) {
        return total + ((ex.config as CorrectiveConfig).sets || 0);
      }
      return total;
    }, 0);
    
    let totalSeconds = 0;
    exercises.forEach(ex => {
      switch (ex.config.type) {
        case 'resistance': {
          const config = ex.config as ResistanceConfig;
          totalSeconds += config.sets * 30 + (config.sets - 1) * config.restSeconds;
          break;
        }
        case 'cardio': {
          totalSeconds += (ex.config as CardioConfig).durationMinutes * 60;
          break;
        }
        case 'plyometric': {
          const config = ex.config as PlyometricConfig;
          totalSeconds += config.sets * 20 + (config.sets - 1) * config.restSeconds;
          break;
        }
        case 'corrective': {
          const config = ex.config as CorrectiveConfig;
          totalSeconds += config.durationSeconds || config.holdSeconds || 60;
          break;
        }
      }
    });
    
    return {
      exerciseCount: exercises.length,
      totalSets,
      estimatedMinutes: Math.ceil(totalSeconds / 60),
    };
  });

export default useWorkoutStore;
