/**
 * ULTIMATE TRAINING SYSTEM - TYPE DEFINITIONS
 * Scientific, comprehensive type system for exercise prescription
 */

// ============================================================================
// CORE ENUMS & TYPES
// ============================================================================

export enum ExerciseCategory {
  RESISTANCE = 'resistance',
  CARDIO = 'cardio',
  PLYOMETRIC = 'plyometric',
  CORRECTIVE = 'corrective',
  STRETCHING = 'stretching',
  POWERLIFTING = 'powerlifting',
  STRONGMAN = 'strongman',
  MOBILITY = 'mobility',
  OLYMPIC = 'olympic'
}

export enum MuscleGroup {
  CHEST = 'chest',
  BACK = 'back',
  SHOULDERS = 'shoulders',
  BICEPS = 'biceps',
  TRICEPS = 'triceps',
  FOREARMS = 'forearms',
  QUADS = 'quads',
  HAMSTRINGS = 'hamstrings',
  GLUTES = 'glutes',
  CALVES = 'calves',
  ABS = 'abs',
  OBLIQUES = 'obliques',
  LOWER_BACK = 'lower_back',
  TRAPS = 'traps',
  FULL_BODY = 'full_body'
}

export enum Equipment {
  BARBELL = 'barbell',
  DUMBBELL = 'dumbbell',
  KETTLEBELL = 'kettlebell',
  CABLE = 'cable',
  MACHINE = 'machine',
  BODYWEIGHT = 'bodyweight',
  BANDS = 'bands',
  TRX = 'trx',
  SMITH_MACHINE = 'smith_machine',
  EZ_BAR = 'ez_bar',
  TRAP_BAR = 'trap_bar',
  SANDBAG = 'sandbag',
  MEDICINE_BALL = 'medicine_ball',
  SLED = 'sled',
  TREADMILL = 'treadmill',
  BIKE = 'bike',
  ROWER = 'rower',
  NONE = 'none'
}

export enum MovementPattern {
  HORIZONTAL_PUSH = 'horizontal_push',
  VERTICAL_PUSH = 'vertical_push',
  HORIZONTAL_PULL = 'horizontal_pull',
  VERTICAL_PULL = 'vertical_pull',
  SQUAT = 'squat',
  HINGE = 'hinge',
  LUNGE = 'lunge',
  CARRY = 'carry',
  ROTATION = 'rotation',
  ANTI_ROTATION = 'anti_rotation',
  LOCOMOTION = 'locomotion'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  ELITE = 'elite'
}

export enum CardioZone {
  ZONE_1 = 1, // 50-60% max HR - Recovery
  ZONE_2 = 2, // 60-70% max HR - Aerobic base
  ZONE_3 = 3, // 70-80% max HR - Tempo
  ZONE_4 = 4, // 80-90% max HR - Threshold
  ZONE_5 = 5  // 90-100% max HR - VO2 max
}

// ============================================================================
// EXERCISE PRESCRIPTION PARAMETERS
// ============================================================================

/**
 * Resistance Training Parameters
 * For bodybuilding, strength training, hypertrophy
 */
export interface ResistanceParameters {
  sets: number;
  reps: number | string; // e.g., "8-12" or "AMRAP"
  weight?: number; // in kg or lbs
  rpe?: number; // Rate of Perceived Exertion (1-10)
  rir?: number; // Reps in Reserve (0-5)
  tempo?: string; // e.g., "3-0-1-0" (eccentric-pause-concentric-pause)
  rest: number; // seconds
  oneRepMaxPercent?: number; // % of 1RM (for strength programs)
  dropSets?: number;
  restPause?: boolean;
  notes?: string;
}

/**
 * Cardio Training Parameters
 */
export interface CardioParameters {
  duration: number; // minutes or seconds
  distance?: number; // meters or km
  zone: CardioZone;
  incline?: number; // percentage
  speed?: number; // km/h or mph
  resistance?: number; // for bike/rower
  intervals?: {
    work: number; // seconds
    rest: number; // seconds
    rounds: number;
  };
  targetHeartRate?: number; // bpm
  notes?: string;
}

/**
 * Plyometric Training Parameters
 */
export interface PlyometricParameters {
  contacts: number; // Total ground contacts
  sets: number;
  height?: number; // cm for box jumps
  distance?: number; // meters for broad jumps
  intensity: 'low' | 'medium' | 'high';
  rest: number; // seconds (longer for CNS recovery)
  notes?: string;
}

/**
 * Powerlifting Parameters
 * Specialized for squat, bench, deadlift
 */
export interface PowerliftingParameters {
  sets: number;
  reps: number;
  weight: number;
  oneRepMaxPercent: number; // % of 1RM
  rest: number; // typically 3-5 minutes
  tempo?: string;
  withChains?: boolean;
  withBands?: boolean;
  pauseTime?: number; // seconds at bottom
  notes?: string;
}

/**
 * Strongman Parameters
 */
export interface StrongmanParameters {
  distance?: number; // meters for carries
  duration?: number; // seconds for holds
  weight?: number;
  rest: number;
  sets?: number;
  notes?: string;
}

/**
 * Stretching/Mobility Parameters
 */
export interface StretchingParameters {
  duration: number; // seconds per stretch
  sets: number;
  type: 'static' | 'dynamic' | 'pnf' | 'ballistic';
  notes?: string;
}

/**
 * Corrective Exercise Parameters
 */
export interface CorrectiveParameters {
  sets: number;
  reps?: number;
  duration?: number; // for holds
  focus: string; // e.g., "Scapular stability"
  notes?: string;
}

// Union type for all parameter types
export type ExerciseParameters =
  | ResistanceParameters
  | CardioParameters
  | PlyometricParameters
  | PowerliftingParameters
  | StrongmanParameters
  | StretchingParameters
  | CorrectiveParameters;

// ============================================================================
// EXERCISE DEFINITION
// ============================================================================

export interface ExerciseBase {
  id: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment[];
  movementPattern?: MovementPattern;
  difficulty: DifficultyLevel;
  description: string;
  cues: string[]; // Coaching cues
  commonMistakes: string[];
  videoUrl?: string;
  gifUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
}

export interface ResistanceExercise extends ExerciseBase {
  category: ExerciseCategory.RESISTANCE;
  defaultParameters: ResistanceParameters;
}

export interface CardioExercise extends ExerciseBase {
  category: ExerciseCategory.CARDIO;
  defaultParameters: CardioParameters;
}

export interface PlyometricExercise extends ExerciseBase {
  category: ExerciseCategory.PLYOMETRIC;
  defaultParameters: PlyometricParameters;
}

export interface PowerliftingExercise extends ExerciseBase {
  category: ExerciseCategory.POWERLIFTING;
  defaultParameters: PowerliftingParameters;
}

export interface StrongmanExercise extends ExerciseBase {
  category: ExerciseCategory.STRONGMAN;
  defaultParameters: StrongmanParameters;
}

export interface StretchingExercise extends ExerciseBase {
  category: ExerciseCategory.STRETCHING;
  defaultParameters: StretchingParameters;
}

export interface CorrectiveExercise extends ExerciseBase {
  category: ExerciseCategory.CORRECTIVE;
  defaultParameters: CorrectiveParameters;
}

export type Exercise =
  | ResistanceExercise
  | CardioExercise
  | PlyometricExercise
  | PowerliftingExercise
  | StrongmanExercise
  | StretchingExercise
  | CorrectiveExercise;

// ============================================================================
// WORKOUT STRUCTURE
// ============================================================================

export interface WorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  parameters: ExerciseParameters;
  supersetWith?: string; // ID of paired exercise
  supersetType?: 'superset' | 'giant_set' | 'circuit';
  order: number;
  notes?: string;
  completed?: boolean;
}

export interface WorkoutDay {
  id: string;
  name: string;
  focus: string; // e.g., "Push Day", "Lower Body"
  exercises: WorkoutExercise[];
  totalVolume?: number; // calculated
  estimatedDuration?: number; // minutes
  notes?: string;
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  weeklySchedule: WorkoutDay[];
  goalType: 'hypertrophy' | 'strength' | 'powerlifting' | 'endurance' | 'athletic' | 'general';
  duration: number; // weeks
  difficulty: DifficultyLevel;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// FILTER & SEARCH TYPES
// ============================================================================

export interface ExerciseFilters {
  categories?: ExerciseCategory[];
  muscleGroups?: MuscleGroup[];
  equipment?: Equipment[];
  movementPatterns?: MovementPattern[];
  difficulty?: DifficultyLevel[];
  searchQuery?: string;
}

export interface MuscleBalanceAnalysis {
  muscleGroup: MuscleGroup;
  volumeLoad: number;
  exerciseCount: number;
  percentage: number;
}

export interface WorkoutAnalytics {
  totalExercises: number;
  totalSets: number;
  totalVolume: number;
  estimatedDuration: number;
  muscleBalance: MuscleBalanceAnalysis[];
  intensityScore: number;
}
