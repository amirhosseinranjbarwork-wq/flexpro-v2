/**
 * Professional Exercise Parameters
 * Advanced parameters for different exercise types
 */

// ============================================================================
// RESISTANCE TRAINING PARAMETERS
// ============================================================================

export interface ResistanceParameters {
  // Basic parameters
  sets: number;
  reps: number | string; // Can be "8-12", "AMRAP", "MAX", etc.
  weight?: number; // in kg
  rest: number; // seconds between sets
  
  // Advanced parameters
  rpe?: number; // Rate of Perceived Exertion (1-10)
  rir?: number; // Reps in Reserve (0-5)
  tempo?: string; // e.g., "3-0-1-0" (eccentric-pause-concentric-pause)
  oneRepMaxPercent?: number; // % of 1RM (for strength programs)
  
  // Training systems
  system?: 'straight_set' | 'superset' | 'triset' | 'giant_set' | 'circuit' | 
           'drop_set' | 'rest_pause' | 'cluster_set' | 'myo_reps' | 
           'german_volume' | 'fst7' | '5x5' | 'pyramid' | 'reverse_pyramid' |
           'tempo' | 'isometric' | 'eccentric' | 'pause_rep' |
           'blood_flow_restriction' | '21s' | 'mechanical_drop' | 
           'pre_exhaust' | 'post_exhaust';
  
  // System-specific parameters
  dropSets?: {
    count: number; // Number of drops
    weightReduction: number; // Percentage or kg
  };
  
  restPause?: {
    intraSetRest: number; // seconds
    miniSets: number; // Number of mini-sets
  };
  
  clusterSet?: {
    repsPerCluster: number;
    intraClusterRest: number; // seconds
    clusters: number;
  };
  
  superset?: {
    exercise2Id?: string;
    exercise2Name?: string;
  };
  
  // Notes
  notes?: string;
  formCues?: string[];
  commonMistakes?: string[];
}

// ============================================================================
// CARDIO TRAINING PARAMETERS
// ============================================================================

export interface CardioParameters {
  // Basic parameters
  duration: number; // minutes
  intensity: 'low' | 'moderate' | 'high' | 'very_high';
  
  // Heart rate zones (1-5)
  targetZone?: 1 | 2 | 3 | 4 | 5;
  targetHeartRate?: number; // bpm
  maxHeartRatePercent?: number; // % of max HR
  
  // Training methods
  method?: 'liss' | 'hiit' | 'tabata' | 'intervals' | 'fartlek' | 'steady_state';
  
  // Interval parameters (for HIIT, Tabata, Intervals)
  intervals?: {
    workDuration: number; // seconds
    restDuration: number; // seconds
    rounds: number;
    workIntensity: 'high' | 'very_high' | 'max';
    restType: 'active' | 'passive';
  };
  
  // Equipment-specific parameters
  treadmill?: {
    speed?: number; // km/h
    incline?: number; // percentage
  };
  
  bike?: {
    resistance?: number; // 1-10 or watts
    rpm?: number; // revolutions per minute
  };
  
  rowing?: {
    resistance?: number; // 1-10
    strokeRate?: number; // strokes per minute
  };
  
  elliptical?: {
    resistance?: number; // 1-10
    strideRate?: number; // strides per minute
  };
  
  // Performance metrics
  distance?: number; // km or meters
  caloriesBurned?: number;
  averageSpeed?: number;
  averageHeartRate?: number;
  
  // Notes
  notes?: string;
  perceivedExertion?: number; // 1-10
}

// ============================================================================
// PLYOMETRIC TRAINING PARAMETERS
// ============================================================================

export interface PlyometricParameters {
  // Basic parameters
  sets: number;
  contacts: number; // Number of ground contacts per set
  intensity: 'low' | 'moderate' | 'high' | 'very_high' | 'shock';
  
  // Equipment-specific
  boxHeight?: number; // cm
  dropHeight?: number; // cm for depth jumps
  landingType?: 'soft' | 'stiff' | 'reactive';
  
  // Rest parameters
  rest: number; // seconds between sets
  intraSetRest?: number; // seconds between contacts
  
  // Notes
  notes?: string;
  progressionLevel?: 1 | 2 | 3 | 4 | 5;
}

// ============================================================================
// CORRECTIVE TRAINING PARAMETERS
// ============================================================================

export interface CorrectiveParameters {
  // Basic parameters
  sets: number;
  reps?: number;
  duration?: number; // seconds (for holds)
  
  // Corrective type
  correctiveType?: 'stretch' | 'strengthen' | 'activate' | 'inhibit' | 
                   'foam_roll' | 'mobility' | 'stability';
  
  // Stretch parameters
  stretchType?: 'static' | 'dynamic' | 'pnf' | 'ballistic';
  holdDuration?: number; // seconds for static stretches
  repetitions?: number; // for dynamic stretches
  
  // Strengthening parameters
  resistance?: 'bodyweight' | 'band' | 'dumbbell' | 'cable' | 'machine';
  weight?: number; // if using external resistance
  tempo?: string;
  
  // Focus area
  focus?: string; // e.g., "hip flexors", "upper back", etc.
  targetIssue?: string; // e.g., "kyphosis", "flat feet", etc.
  
  // NASM phases
  nasmPhase?: 'inhibit' | 'lengthen' | 'activate' | 'integrate';
  
  // Notes
  notes?: string;
  commonCompensations?: string[];
}

// ============================================================================
// WARMUP/COOLDOWN PARAMETERS
// ============================================================================

export interface WarmupCooldownParameters {
  // Duration
  duration: number; // minutes
  
  // Type
  type: 'warmup' | 'cooldown';
  
  // Warmup specific
  warmupType?: 'general' | 'specific' | 'dynamic' | 'activation';
  targetMuscles?: string[]; // For specific warmup
  
  // Cooldown specific
  cooldownType?: 'static_stretch' | 'light_cardio' | 'foam_roll' | 'breathing';
  
  // Stretch parameters (for cooldown)
  stretches?: Array<{
    name: string;
    duration: number; // seconds
    targetMuscle: string;
  }>;
  
  // Notes
  notes?: string;
}

// ============================================================================
// UNIFIED EXERCISE PARAMETERS
// ============================================================================

export type ExerciseParameters = 
  | ResistanceParameters 
  | CardioParameters 
  | PlyometricParameters 
  | CorrectiveParameters 
  | WarmupCooldownParameters;

// Helper function to determine parameter type
export function getParameterType(exerciseType: string): string {
  switch (exerciseType) {
    case 'resistance':
      return 'resistance';
    case 'cardio':
      return 'cardio';
    case 'plyometric':
      return 'plyometric';
    case 'corrective':
      return 'corrective';
    case 'warmup':
    case 'cooldown':
      return 'warmupCooldown';
    default:
      return 'resistance';
  }
}

// Default parameters for each type
export const defaultResistanceParameters: ResistanceParameters = {
  sets: 3,
  reps: 10,
  rest: 90,
  rpe: 7,
  rir: 2,
  system: 'straight_set'
};

export const defaultCardioParameters: CardioParameters = {
  duration: 30,
  intensity: 'moderate',
  targetZone: 2,
  method: 'steady_state'
};

export const defaultPlyometricParameters: PlyometricParameters = {
  sets: 3,
  contacts: 10,
  intensity: 'moderate',
  rest: 60
};

export const defaultCorrectiveParameters: CorrectiveParameters = {
  sets: 3,
  reps: 10,
  duration: 30,
  correctiveType: 'stretch',
  stretchType: 'static',
  holdDuration: 30
};

export const defaultWarmupCooldownParameters: WarmupCooldownParameters = {
  duration: 10,
  type: 'warmup',
  warmupType: 'general'
};

