/**
 * WORKOUT STORE - Smart State Management
 * Zustand store for managing workout programs with smart suggestions
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Exercise,
  WorkoutDay,
  WorkoutExercise,
  WorkoutProgram,
  ExerciseFilters,
  WorkoutAnalytics,
  MuscleGroup,
  MovementPattern,
  ExerciseCategory
} from '../types/ultimate-training';
import { ULTIMATE_EXERCISES } from '../data/ultimate-exercises';
import { workoutsApi } from '../services/api';
import toast from 'react-hot-toast';

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface WorkoutStore {
  // Current state
  currentProgram: WorkoutProgram | null;
  activeDayId: string | null;
  selectedExercises: string[]; // IDs of selected exercises for quick add
  
  // Filters
  filters: ExerciseFilters;
  
  // UI state
  isLibraryOpen: boolean;
  isSidebarCollapsed: boolean;
  
  // Actions - Program
  createProgram: (name: string, goalType: WorkoutProgram['goalType']) => void;
  updateProgram: (updates: Partial<WorkoutProgram>) => void;
  deleteProgram: () => void;
  saveProgram: () => Promise<void>;
  loadProgram: (id: string) => Promise<void>;
  loadAllPrograms: () => Promise<WorkoutProgram[]>;
  
  // Actions - Days
  addDay: (name: string, focus: string) => void;
  updateDay: (dayId: string, updates: Partial<WorkoutDay>) => void;
  deleteDay: (dayId: string) => void;
  setActiveDay: (dayId: string) => void;
  copyDay: (dayId: string) => void;
  
  // Actions - Exercises
  addExerciseToDay: (dayId: string, exercise: Exercise, order?: number) => void;
  removeExerciseFromDay: (dayId: string, exerciseId: string) => void;
  updateExerciseParameters: (dayId: string, exerciseId: string, parameters: any) => void;
  reorderExercises: (dayId: string, exerciseId: string, newOrder: number) => void;
  createSuperset: (dayId: string, exercise1Id: string, exercise2Id: string) => void;
  removeSuperset: (dayId: string, exerciseId: string) => void;
  
  // Actions - Filters
  setFilters: (filters: ExerciseFilters) => void;
  resetFilters: () => void;
  
  // Actions - UI
  toggleLibrary: () => void;
  toggleSidebar: () => void;
  
  // Getters
  getFilteredExercises: () => Exercise[];
  getCurrentDay: () => WorkoutDay | null;
  getWorkoutAnalytics: (dayId: string) => WorkoutAnalytics;
  getSmartSuggestions: (dayId: string) => Exercise[];
}

// ============================================================================
// SMART SUGGESTION LOGIC
// ============================================================================

/**
 * Analyzes current day and suggests complementary exercises
 */
const generateSmartSuggestions = (day: WorkoutDay): Exercise[] => {
  if (!day || day.exercises.length === 0) {
    // No exercises yet - suggest compound movements
    return ULTIMATE_EXERCISES.filter(ex =>
      ex.tags.includes('compound') && 
      ex.category === ExerciseCategory.RESISTANCE
    ).slice(0, 10);
  }

  const currentExercises = day.exercises.map(we => we.exercise);
  const musclesWorked = new Set<MuscleGroup>();
  const patternsUsed = new Set<MovementPattern>();
  
  // Analyze what's been done
  currentExercises.forEach(ex => {
    ex.primaryMuscles.forEach(m => musclesWorked.add(m));
    if (ex.movementPattern) patternsUsed.add(ex.movementPattern);
  });

  // Determine suggestions based on balance
  const suggestions: Exercise[] = [];

  // 1. Balance push/pull
  const hasPush = patternsUsed.has(MovementPattern.HORIZONTAL_PUSH) || 
                  patternsUsed.has(MovementPattern.VERTICAL_PUSH);
  const hasPull = patternsUsed.has(MovementPattern.HORIZONTAL_PULL) || 
                  patternsUsed.has(MovementPattern.VERTICAL_PULL);

  if (hasPush && !hasPull) {
    // Suggest pulling exercises
    suggestions.push(...ULTIMATE_EXERCISES.filter(ex =>
      ex.movementPattern === MovementPattern.HORIZONTAL_PULL ||
      ex.movementPattern === MovementPattern.VERTICAL_PULL
    ));
  } else if (hasPull && !hasPush) {
    // Suggest pushing exercises
    suggestions.push(...ULTIMATE_EXERCISES.filter(ex =>
      ex.movementPattern === MovementPattern.HORIZONTAL_PUSH ||
      ex.movementPattern === MovementPattern.VERTICAL_PUSH
    ));
  }

  // 2. Suggest antagonist muscles
  if (musclesWorked.has(MuscleGroup.CHEST) && !musclesWorked.has(MuscleGroup.BACK)) {
    suggestions.push(...ULTIMATE_EXERCISES.filter(ex =>
      ex.primaryMuscles.includes(MuscleGroup.BACK)
    ));
  }
  
  if (musclesWorked.has(MuscleGroup.QUADS) && !musclesWorked.has(MuscleGroup.HAMSTRINGS)) {
    suggestions.push(...ULTIMATE_EXERCISES.filter(ex =>
      ex.primaryMuscles.includes(MuscleGroup.HAMSTRINGS)
    ));
  }

  if (musclesWorked.has(MuscleGroup.BICEPS) && !musclesWorked.has(MuscleGroup.TRICEPS)) {
    suggestions.push(...ULTIMATE_EXERCISES.filter(ex =>
      ex.primaryMuscles.includes(MuscleGroup.TRICEPS)
    ));
  }

  // 3. If working upper body, suggest core
  const upperBodyMuscles = [
    MuscleGroup.CHEST, MuscleGroup.BACK, MuscleGroup.SHOULDERS,
    MuscleGroup.BICEPS, MuscleGroup.TRICEPS
  ];
  const workingUpperBody = [...musclesWorked].some(m => upperBodyMuscles.includes(m));
  
  if (workingUpperBody && !musclesWorked.has(MuscleGroup.ABS)) {
    suggestions.push(...ULTIMATE_EXERCISES.filter(ex =>
      ex.primaryMuscles.includes(MuscleGroup.ABS)
    ));
  }

  // 4. Remove duplicates and already used exercises
  const usedIds = new Set(currentExercises.map(ex => ex.id));
  const uniqueSuggestions = suggestions
    .filter(ex => !usedIds.has(ex.id))
    .filter((ex, index, self) => 
      index === self.findIndex(e => e.id === ex.id)
    );

  return uniqueSuggestions.slice(0, 8);
};

// ============================================================================
// ANALYTICS CALCULATION
// ============================================================================

const calculateWorkoutAnalytics = (day: WorkoutDay): WorkoutAnalytics => {
  if (!day || day.exercises.length === 0) {
    return {
      totalExercises: 0,
      totalSets: 0,
      totalVolume: 0,
      estimatedDuration: 0,
      muscleBalance: [],
      intensityScore: 0
    };
  }

  let totalSets = 0;
  let totalVolume = 0;
  let estimatedDuration = 0;
  const muscleVolumes: Map<MuscleGroup, number> = new Map();

  day.exercises.forEach(we => {
    const params = we.parameters as any;
    
    // Calculate sets
    if ('sets' in params) {
      totalSets += params.sets || 0;
    }

    // Calculate volume (sets × reps × weight)
    if ('sets' in params && 'reps' in params && 'weight' in params) {
      const reps = typeof params.reps === 'number' ? params.reps : 10; // default
      const volume = params.sets * reps * (params.weight || 0);
      totalVolume += volume;
    }

    // Estimate duration
    if ('sets' in params && 'rest' in params) {
      const setTime = 30; // assume 30 sec per set
      const restTime = params.rest || 60;
      estimatedDuration += (setTime + restTime) * params.sets;
    } else if ('duration' in params) {
      estimatedDuration += params.duration * 60; // convert to seconds
    }

    // Track muscle groups
    we.exercise.primaryMuscles.forEach(muscle => {
      const current = muscleVolumes.get(muscle) || 0;
      const sets = ('sets' in params) ? params.sets : 1;
      muscleVolumes.set(muscle, current + sets);
    });
  });

  // Calculate muscle balance
  const totalMuscleSets = Array.from(muscleVolumes.values()).reduce((a, b) => a + b, 0);
  const muscleBalance = Array.from(muscleVolumes.entries()).map(([muscle, sets]) => ({
    muscleGroup: muscle,
    volumeLoad: sets,
    exerciseCount: day.exercises.filter(we =>
      we.exercise.primaryMuscles.includes(muscle)
    ).length,
    percentage: totalMuscleSets > 0 ? (sets / totalMuscleSets) * 100 : 0
  }));

  // Calculate intensity score (based on RPE/RIR)
  let intensityScore = 0;
  let intensityCount = 0;
  day.exercises.forEach(we => {
    const params = we.parameters as any;
    if ('rpe' in params) {
      intensityScore += params.rpe;
      intensityCount++;
    } else if ('rir' in params) {
      intensityScore += (10 - params.rir);
      intensityCount++;
    }
  });
  intensityScore = intensityCount > 0 ? intensityScore / intensityCount : 5;

  return {
    totalExercises: day.exercises.length,
    totalSets,
    totalVolume,
    estimatedDuration: Math.ceil(estimatedDuration / 60), // convert to minutes
    muscleBalance: muscleBalance.sort((a, b) => b.volumeLoad - a.volumeLoad),
    intensityScore
  };
};

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentProgram: null,
      activeDayId: null,
      selectedExercises: [],
      filters: {},
      isLibraryOpen: true,
      isSidebarCollapsed: false,

      // Program actions
      createProgram: (name, goalType) => {
        const newProgram: WorkoutProgram = {
          id: `prog_${Date.now()}`,
          name,
          description: '',
          weeklySchedule: [],
          goalType,
          duration: 12,
          difficulty: 'intermediate',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set({ currentProgram: newProgram });
      },

      updateProgram: (updates) => {
        const { currentProgram } = get();
        if (!currentProgram) return;
        
        set({
          currentProgram: {
            ...currentProgram,
            ...updates,
            updatedAt: new Date()
          }
        });
      },

      deleteProgram: () => {
        set({
          currentProgram: null,
          activeDayId: null
        });
      },

      // Save program to backend
      saveProgram: async () => {
        const { currentProgram } = get();
        if (!currentProgram) {
          toast.error('No program to save');
          return;
        }

        try {
          const programData = {
            name: currentProgram.name,
            description: currentProgram.description,
            goal_type: currentProgram.goalType,
            duration: currentProgram.duration,
            difficulty: currentProgram.difficulty,
            weekly_schedule: JSON.stringify(currentProgram.weeklySchedule)
          };

          let savedProgram;
          if (currentProgram.id) {
            // Update existing
            savedProgram = await workoutsApi.update(currentProgram.id, programData);
          } else {
            // Create new
            savedProgram = await workoutsApi.create(programData);
          }

          // Update store with saved program ID
          set({
            currentProgram: {
              ...currentProgram,
              id: savedProgram.id,
              updatedAt: new Date()
            }
          });

          toast.success('Program saved successfully!');
        } catch (error: any) {
          toast.error(error.detail || 'Failed to save program');
          throw error;
        }
      },

      // Load program from backend
      loadProgram: async (id: string) => {
        try {
          const program = await workoutsApi.getById(id);
          
          const loadedProgram: WorkoutProgram = {
            id: program.id,
            name: program.name,
            description: program.description || '',
            goalType: program.goal_type as any,
            duration: program.duration,
            difficulty: program.difficulty as any,
            weeklySchedule: JSON.parse(program.weekly_schedule as any),
            createdAt: new Date(program.created_at || ''),
            updatedAt: new Date(program.updated_at || '')
          };

          set({
            currentProgram: loadedProgram,
            activeDayId: loadedProgram.weeklySchedule[0]?.id || null
          });

          toast.success('Program loaded successfully!');
        } catch (error: any) {
          toast.error(error.detail || 'Failed to load program');
          throw error;
        }
      },

      // Load all programs
      loadAllPrograms: async () => {
        try {
          const programs = await workoutsApi.getAll();
          return programs.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            goalType: p.goal_type as any,
            duration: p.duration,
            difficulty: p.difficulty as any,
            weeklySchedule: JSON.parse(p.weekly_schedule as any),
            createdAt: new Date(p.created_at || ''),
            updatedAt: new Date(p.updated_at || '')
          }));
        } catch (error: any) {
          toast.error(error.detail || 'Failed to load programs');
          return [];
        }
      },

      // Day actions
      addDay: (name, focus) => {
        const { currentProgram } = get();
        if (!currentProgram) return;

        const newDay: WorkoutDay = {
          id: `day_${Date.now()}`,
          name,
          focus,
          exercises: [],
          notes: ''
        };

        set({
          currentProgram: {
            ...currentProgram,
            weeklySchedule: [...currentProgram.weeklySchedule, newDay],
            updatedAt: new Date()
          },
          activeDayId: newDay.id
        });
      },

      updateDay: (dayId, updates) => {
        const { currentProgram } = get();
        if (!currentProgram) return;

        set({
          currentProgram: {
            ...currentProgram,
            weeklySchedule: currentProgram.weeklySchedule.map(day =>
              day.id === dayId ? { ...day, ...updates } : day
            ),
            updatedAt: new Date()
          }
        });
      },

      deleteDay: (dayId) => {
        const { currentProgram, activeDayId } = get();
        if (!currentProgram) return;

        const newSchedule = currentProgram.weeklySchedule.filter(d => d.id !== dayId);
        
        set({
          currentProgram: {
            ...currentProgram,
            weeklySchedule: newSchedule,
            updatedAt: new Date()
          },
          activeDayId: activeDayId === dayId ? (newSchedule[0]?.id || null) : activeDayId
        });
      },

      setActiveDay: (dayId) => {
        set({ activeDayId: dayId });
      },

      copyDay: (dayId) => {
        const { currentProgram } = get();
        if (!currentProgram) return;

        const dayToCopy = currentProgram.weeklySchedule.find(d => d.id === dayId);
        if (!dayToCopy) return;

        const copiedDay: WorkoutDay = {
          ...dayToCopy,
          id: `day_${Date.now()}`,
          name: `${dayToCopy.name} (Copy)`,
          exercises: dayToCopy.exercises.map(ex => ({
            ...ex,
            exerciseId: `${ex.exerciseId}_copy_${Date.now()}`
          }))
        };

        set({
          currentProgram: {
            ...currentProgram,
            weeklySchedule: [...currentProgram.weeklySchedule, copiedDay],
            updatedAt: new Date()
          }
        });
      },

      // Exercise actions
      addExerciseToDay: (dayId, exercise, order) => {
        const { currentProgram } = get();
        if (!currentProgram) return;

        const day = currentProgram.weeklySchedule.find(d => d.id === dayId);
        if (!day) return;

        const newOrder = order ?? day.exercises.length;
        const newExercise: WorkoutExercise = {
          exerciseId: `${exercise.id}_${Date.now()}`,
          exercise,
          parameters: exercise.defaultParameters,
          order: newOrder
        };

        const updatedExercises = [...day.exercises];
        updatedExercises.splice(newOrder, 0, newExercise);
        
        // Reorder
        updatedExercises.forEach((ex, idx) => {
          ex.order = idx;
        });

        set({
          currentProgram: {
            ...currentProgram,
            weeklySchedule: currentProgram.weeklySchedule.map(d =>
              d.id === dayId ? { ...d, exercises: updatedExercises } : d
            ),
            updatedAt: new Date()
          }
        });
      },

      removeExerciseFromDay: (dayId, exerciseId) => {
        const { currentProgram } = get();
        if (!currentProgram) return;

        set({
          currentProgram: {
            ...currentProgram,
            weeklySchedule: currentProgram.weeklySchedule.map(day =>
              day.id === dayId
                ? {
                    ...day,
                    exercises: day.exercises
                      .filter(ex => ex.exerciseId !== exerciseId)
                      .map((ex, idx) => ({ ...ex, order: idx }))
                  }
                : day
            ),
            updatedAt: new Date()
          }
        });
      },

      updateExerciseParameters: (dayId, exerciseId, parameters) => {
        const { currentProgram } = get();
        if (!currentProgram) return;

        set({
          currentProgram: {
            ...currentProgram,
            weeklySchedule: currentProgram.weeklySchedule.map(day =>
              day.id === dayId
                ? {
                    ...day,
                    exercises: day.exercises.map(ex =>
                      ex.exerciseId === exerciseId
                        ? { ...ex, parameters: { ...ex.parameters, ...parameters } }
                        : ex
                    )
                  }
                : day
            ),
            updatedAt: new Date()
          }
        });
      },

      reorderExercises: (dayId, exerciseId, newOrder) => {
        const { currentProgram } = get();
        if (!currentProgram) return;

        const day = currentProgram.weeklySchedule.find(d => d.id === dayId);
        if (!day) return;

        const exercises = [...day.exercises];
        const oldIndex = exercises.findIndex(ex => ex.exerciseId === exerciseId);
        if (oldIndex === -1) return;

        const [movedExercise] = exercises.splice(oldIndex, 1);
        exercises.splice(newOrder, 0, movedExercise);
        
        // Update order numbers
        exercises.forEach((ex, idx) => {
          ex.order = idx;
        });

        set({
          currentProgram: {
            ...currentProgram,
            weeklySchedule: currentProgram.weeklySchedule.map(d =>
              d.id === dayId ? { ...d, exercises } : d
            ),
            updatedAt: new Date()
          }
        });
      },

      createSuperset: (dayId, exercise1Id, exercise2Id) => {
        const { currentProgram } = get();
        if (!currentProgram) return;

        set({
          currentProgram: {
            ...currentProgram,
            weeklySchedule: currentProgram.weeklySchedule.map(day =>
              day.id === dayId
                ? {
                    ...day,
                    exercises: day.exercises.map(ex => {
                      if (ex.exerciseId === exercise1Id) {
                        return { ...ex, supersetWith: exercise2Id, supersetType: 'superset' };
                      }
                      if (ex.exerciseId === exercise2Id) {
                        return { ...ex, supersetWith: exercise1Id, supersetType: 'superset' };
                      }
                      return ex;
                    })
                  }
                : day
            ),
            updatedAt: new Date()
          }
        });
      },

      removeSuperset: (dayId, exerciseId) => {
        const { currentProgram } = get();
        if (!currentProgram) return;

        const day = currentProgram.weeklySchedule.find(d => d.id === dayId);
        if (!day) return;

        const exercise = day.exercises.find(ex => ex.exerciseId === exerciseId);
        if (!exercise?.supersetWith) return;

        const pairedId = exercise.supersetWith;

        set({
          currentProgram: {
            ...currentProgram,
            weeklySchedule: currentProgram.weeklySchedule.map(d =>
              d.id === dayId
                ? {
                    ...d,
                    exercises: d.exercises.map(ex => {
                      if (ex.exerciseId === exerciseId || ex.exerciseId === pairedId) {
                        const { supersetWith, supersetType, ...rest } = ex;
                        return rest as WorkoutExercise;
                      }
                      return ex;
                    })
                  }
                : d
            ),
            updatedAt: new Date()
          }
        });
      },

      // Filter actions
      setFilters: (filters) => {
        set({ filters });
      },

      resetFilters: () => {
        set({ filters: {} });
      },

      // UI actions
      toggleLibrary: () => {
        set(state => ({ isLibraryOpen: !state.isLibraryOpen }));
      },

      toggleSidebar: () => {
        set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
      },

      // Getters
      getFilteredExercises: () => {
        const { filters } = get();
        // Ensure all exercises have required fields with defaults
        let exercises = ULTIMATE_EXERCISES.map(ex => ({
          ...ex,
          primaryMuscles: ex.primaryMuscles || [],
          secondaryMuscles: ex.secondaryMuscles || [],
          equipment: ex.equipment || [],
          tags: ex.tags || [],
          description: ex.description || ''
        }));

        if (filters.categories && filters.categories.length > 0) {
          exercises = exercises.filter(ex => filters.categories!.includes(ex.category));
        }

        if (filters.muscleGroups && filters.muscleGroups.length > 0) {
          exercises = exercises.filter(ex =>
            filters.muscleGroups!.some(mg =>
              (ex.primaryMuscles || []).includes(mg) || (ex.secondaryMuscles || []).includes(mg)
            )
          );
        }

        if (filters.equipment && filters.equipment.length > 0) {
          exercises = exercises.filter(ex =>
            filters.equipment!.some(eq => (ex.equipment || []).includes(eq))
          );
        }

        if (filters.movementPatterns && filters.movementPatterns.length > 0) {
          exercises = exercises.filter(ex =>
            ex.movementPattern && filters.movementPatterns!.includes(ex.movementPattern)
          );
        }

        if (filters.difficulty && filters.difficulty.length > 0) {
          exercises = exercises.filter(ex => filters.difficulty!.includes(ex.difficulty));
        }

        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          exercises = exercises.filter(ex =>
            ex.name.toLowerCase().includes(query) ||
            ex.description.toLowerCase().includes(query) ||
            ex.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }

        return exercises;
      },

      getCurrentDay: () => {
        const { currentProgram, activeDayId } = get();
        if (!currentProgram || !activeDayId) return null;
        return currentProgram.weeklySchedule.find(d => d.id === activeDayId) || null;
      },

      getWorkoutAnalytics: (dayId) => {
        const { currentProgram } = get();
        if (!currentProgram) {
          return {
            totalExercises: 0,
            totalSets: 0,
            totalVolume: 0,
            estimatedDuration: 0,
            muscleBalance: [],
            intensityScore: 0
          };
        }

        const day = currentProgram.weeklySchedule.find(d => d.id === dayId);
        if (!day) {
          return {
            totalExercises: 0,
            totalSets: 0,
            totalVolume: 0,
            estimatedDuration: 0,
            muscleBalance: [],
            intensityScore: 0
          };
        }

        return calculateWorkoutAnalytics(day);
      },

      getSmartSuggestions: (dayId) => {
        const { currentProgram } = get();
        if (!currentProgram) return [];

        const day = currentProgram.weeklySchedule.find(d => d.id === dayId);
        if (!day) return [];

        return generateSmartSuggestions(day);
      }
    }),
    {
      name: 'workout-storage',
      version: 1
    }
  )
);

export default useWorkoutStore;
