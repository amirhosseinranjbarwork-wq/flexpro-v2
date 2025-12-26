/**
 * ULTIMATE EXERCISE DATABASE
 * Comprehensive, scientifically-structured exercise library
 */

import {
  Exercise,
  ExerciseCategory,
  MuscleGroup,
  Equipment,
  MovementPattern,
  DifficultyLevel,
  CardioZone,
  ResistanceExercise,
  CardioExercise,
  PlyometricExercise,
  PowerliftingExercise,
  StrongmanExercise,
  StretchingExercise,
  CorrectiveExercise
} from '../types/ultimate-training';

// ============================================================================
// RESISTANCE TRAINING - CHEST
// ============================================================================

const resistanceExercises: ResistanceExercise[] = [
  {
    id: 'ex_barbell_bench_press',
    name: 'Barbell Bench Press',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.CHEST],
    secondaryMuscles: [MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    equipment: [Equipment.BARBELL],
    movementPattern: MovementPattern.HORIZONTAL_PUSH,
    difficulty: DifficultyLevel.INTERMEDIATE,
    description: 'The king of upper body pressing movements. Lie on a flat bench and press the barbell from chest to full arm extension.',
    cues: [
      'Retract scapulae (squeeze shoulder blades together)',
      'Arch lower back slightly while keeping glutes on bench',
      'Bar path should be slightly diagonal toward face',
      'Touch chest at nipple line',
      'Drive feet into ground for leg drive'
    ],
    commonMistakes: [
      'Flaring elbows out too wide (45-degree angle is optimal)',
      'Bouncing bar off chest',
      'Not using leg drive',
      'Uneven bar path'
    ],
    tags: ['compound', 'mass_builder', 'powerlifting', 'strength'],
    defaultParameters: {
      sets: 4,
      reps: 6,
      tempo: '3-0-1-0',
      rest: 180,
      rpe: 8,
      rir: 2
    }
  },
  {
    id: 'ex_dumbbell_incline_press',
    name: 'Dumbbell Incline Press',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.CHEST],
    secondaryMuscles: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    equipment: [Equipment.DUMBBELL],
    movementPattern: MovementPattern.HORIZONTAL_PUSH,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Press dumbbells on a 30-45 degree incline bench to target upper chest.',
    cues: [
      'Set bench to 30-45 degrees',
      'Keep elbows at 45-degree angle from body',
      'Full range of motion - stretch at bottom',
      'Slight arch in dumbbells at top (hands slightly inward)'
    ],
    commonMistakes: [
      'Bench angle too steep (becomes shoulder dominant)',
      'Going too heavy and sacrificing form',
      'Not controlling the eccentric'
    ],
    tags: ['hypertrophy', 'upper_chest', 'dumbbell'],
    defaultParameters: {
      sets: 4,
      reps: 10,
      tempo: '3-0-1-1',
      rest: 120,
      rpe: 7
    }
  },
  {
    id: 'ex_cable_crossover',
    name: 'Cable Crossover',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.CHEST],
    secondaryMuscles: [MuscleGroup.SHOULDERS],
    equipment: [Equipment.CABLE],
    movementPattern: MovementPattern.HORIZONTAL_PUSH,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Isolation movement using cables to maximally stretch and contract the pecs.',
    cues: [
      'Slight forward lean',
      'Internally rotate shoulders at peak contraction',
      'Maintain elbow angle throughout (slight bend)',
      'Control the negative phase'
    ],
    commonMistakes: [
      'Using too much weight and losing tension',
      'Bending elbows excessively (becomes a press)',
      'Not achieving full stretch at start position'
    ],
    tags: ['isolation', 'pump', 'finisher', 'constant_tension'],
    defaultParameters: {
      sets: 3,
      reps: 15,
      tempo: '2-0-1-2',
      rest: 60,
      rpe: 8
    }
  },

  // BACK EXERCISES
  {
    id: 'ex_deadlift',
    name: 'Conventional Deadlift',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.BACK, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    secondaryMuscles: [MuscleGroup.TRAPS, MuscleGroup.FOREARMS, MuscleGroup.ABS],
    equipment: [Equipment.BARBELL],
    movementPattern: MovementPattern.HINGE,
    difficulty: DifficultyLevel.ADVANCED,
    description: 'The ultimate posterior chain developer. Hip hinge movement lifting the barbell from the floor to standing.',
    cues: [
      'Bar over mid-foot',
      'Hips higher than knees, shoulders higher than hips',
      'Neutral spine - brace core hard',
      'Push floor away with legs, then thrust hips forward',
      'Keep bar close to body throughout'
    ],
    commonMistakes: [
      'Rounding lower back',
      'Bar drifting away from body',
      'Squatting the weight instead of hinging',
      'Hyperextending at top'
    ],
    tags: ['compound', 'full_body', 'strength', 'powerlifting'],
    defaultParameters: {
      sets: 5,
      reps: 5,
      tempo: '2-0-2-0',
      rest: 240,
      rpe: 9,
      rir: 1
    }
  },
  {
    id: 'ex_pull_up',
    name: 'Pull-Up',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.BACK],
    secondaryMuscles: [MuscleGroup.BICEPS, MuscleGroup.FOREARMS],
    equipment: [Equipment.BODYWEIGHT],
    movementPattern: MovementPattern.VERTICAL_PULL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    description: 'Bodyweight vertical pulling exercise. Pull yourself up until chin clears bar.',
    cues: [
      'Start from dead hang with full arm extension',
      'Depress and retract scapulae',
      'Pull elbows down and back',
      'Think "pull bar to chest" not "chin to bar"',
      'Control descent'
    ],
    commonMistakes: [
      'Using momentum/kipping',
      'Not achieving full range of motion',
      'Shrugging shoulders at top',
      'Crossing legs excessively (affects stability)'
    ],
    tags: ['bodyweight', 'compound', 'back_width', 'calisthenics'],
    defaultParameters: {
      sets: 4,
      reps: '8-12',
      tempo: '2-0-1-1',
      rest: 150,
      rpe: 8
    }
  },
  {
    id: 'ex_barbell_row',
    name: 'Barbell Bent-Over Row',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.BACK],
    secondaryMuscles: [MuscleGroup.BICEPS, MuscleGroup.LOWER_BACK, MuscleGroup.TRAPS],
    equipment: [Equipment.BARBELL],
    movementPattern: MovementPattern.HORIZONTAL_PULL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    description: 'Fundamental horizontal pulling movement for back thickness.',
    cues: [
      'Hip hinge position - torso 45 degrees or parallel to ground',
      'Pull bar to lower chest/upper abs',
      'Keep elbows close to body',
      'Squeeze shoulder blades together at top',
      'Maintain neutral spine'
    ],
    commonMistakes: [
      'Standing too upright (reduces lat engagement)',
      'Using excessive body English',
      'Not retracting scapulae',
      'Jerking the weight'
    ],
    tags: ['compound', 'back_thickness', 'mass_builder'],
    defaultParameters: {
      sets: 4,
      reps: 8,
      tempo: '2-0-1-1',
      rest: 150,
      rpe: 8
    }
  },

  // SHOULDER EXERCISES
  {
    id: 'ex_overhead_press',
    name: 'Standing Overhead Press (OHP)',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.SHOULDERS],
    secondaryMuscles: [MuscleGroup.TRICEPS, MuscleGroup.TRAPS, MuscleGroup.ABS],
    equipment: [Equipment.BARBELL],
    movementPattern: MovementPattern.VERTICAL_PUSH,
    difficulty: DifficultyLevel.INTERMEDIATE,
    description: 'The king of shoulder builders. Press barbell from shoulders to overhead while standing.',
    cues: [
      'Grip slightly wider than shoulder width',
      'Brace core and squeeze glutes',
      'Press bar in slight arc - move head back slightly',
      'Lock out overhead with bar over mid-foot',
      'Shrug shoulders up at top'
    ],
    commonMistakes: [
      'Excessive lower back arching',
      'Not achieving full lockout',
      'Pressing bar too far forward',
      'Not bracing core'
    ],
    tags: ['compound', 'shoulder_mass', 'strength', 'functional'],
    defaultParameters: {
      sets: 4,
      reps: 6,
      tempo: '2-0-1-0',
      rest: 180,
      rpe: 8
    }
  },
  {
    id: 'ex_lateral_raise',
    name: 'Dumbbell Lateral Raise',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.SHOULDERS],
    secondaryMuscles: [],
    equipment: [Equipment.DUMBBELL],
    movementPattern: undefined,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Isolation exercise targeting the lateral (middle) deltoid head.',
    cues: [
      'Slight bend in elbows',
      'Lead with elbows, not hands',
      'Raise to shoulder height (not higher)',
      'Thumbs slightly down or neutral at top',
      'Control the descent'
    ],
    commonMistakes: [
      'Using too much weight and swinging',
      'Shrugging traps',
      'Raising too high (trap takeover)',
      'Not controlling eccentric'
    ],
    tags: ['isolation', 'shoulder_width', 'pump', 'side_delts'],
    defaultParameters: {
      sets: 4,
      reps: 15,
      tempo: '2-0-1-2',
      rest: 60,
      rpe: 8
    }
  },

  // LEG EXERCISES
  {
    id: 'ex_back_squat',
    name: 'Barbell Back Squat',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
    secondaryMuscles: [MuscleGroup.HAMSTRINGS, MuscleGroup.ABS, MuscleGroup.LOWER_BACK],
    equipment: [Equipment.BARBELL],
    movementPattern: MovementPattern.SQUAT,
    difficulty: DifficultyLevel.INTERMEDIATE,
    description: 'The king of leg exercises. Barbell positioned on upper back, squat to depth.',
    cues: [
      'Bar on upper traps (high bar) or rear delts (low bar)',
      'Feet shoulder width, toes slightly out',
      'Break at hips and knees simultaneously',
      'Keep chest up and core braced',
      'Depth: hip crease below knee (parallel or deeper)',
      'Drive through mid-foot'
    ],
    commonMistakes: [
      'Knees caving inward (valgus collapse)',
      'Heels lifting off ground',
      'Good morning squat (hips rise faster than shoulders)',
      'Not reaching proper depth'
    ],
    tags: ['compound', 'leg_mass', 'strength', 'powerlifting'],
    defaultParameters: {
      sets: 4,
      reps: 6,
      tempo: '3-0-1-0',
      rest: 240,
      rpe: 8,
      rir: 2
    }
  },
  {
    id: 'ex_romanian_deadlift',
    name: 'Romanian Deadlift (RDL)',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES],
    secondaryMuscles: [MuscleGroup.LOWER_BACK, MuscleGroup.FOREARMS],
    equipment: [Equipment.BARBELL],
    movementPattern: MovementPattern.HINGE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    description: 'Hip hinge movement emphasizing hamstring stretch and development.',
    cues: [
      'Start from standing with bar at hips',
      'Soft knee bend maintained throughout',
      'Push hips back while keeping back flat',
      'Lower until deep hamstring stretch (below knees)',
      'Drive hips forward to return'
    ],
    commonMistakes: [
      'Squatting instead of hinging',
      'Rounding lower back',
      'Bending knees too much',
      'Not achieving hamstring stretch'
    ],
    tags: ['hamstring', 'posterior_chain', 'hypertrophy'],
    defaultParameters: {
      sets: 4,
      reps: 10,
      tempo: '3-1-1-0',
      rest: 120,
      rpe: 8
    }
  },
  {
    id: 'ex_bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
    secondaryMuscles: [MuscleGroup.HAMSTRINGS],
    equipment: [Equipment.DUMBBELL],
    movementPattern: MovementPattern.LUNGE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    description: 'Unilateral leg exercise with rear foot elevated on bench.',
    cues: [
      'Rear foot on bench/box behind you',
      'Front foot far enough forward to keep shin vertical',
      'Descend straight down (not forward)',
      'Keep torso upright',
      'Drive through front heel'
    ],
    commonMistakes: [
      'Stance too short (knee travels too far forward)',
      'Leaning too far forward',
      'Not achieving depth',
      'Losing balance (start lighter)'
    ],
    tags: ['unilateral', 'quad_focus', 'glute_focus', 'stability'],
    defaultParameters: {
      sets: 3,
      reps: 12,
      tempo: '3-0-1-0',
      rest: 90,
      rpe: 8
    }
  },
  {
    id: 'ex_leg_curl',
    name: 'Lying Leg Curl',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.HAMSTRINGS],
    secondaryMuscles: [],
    equipment: [Equipment.MACHINE],
    movementPattern: undefined,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Isolation exercise for hamstrings. Curl pad to glutes while lying prone.',
    cues: [
      'Lie flat on machine with pad on lower calves',
      'Keep hips down on bench',
      'Curl pad toward glutes',
      'Squeeze hamstrings at top',
      'Control the eccentric'
    ],
    commonMistakes: [
      'Hips lifting off bench',
      'Using momentum',
      'Not achieving full contraction',
      'Partial range of motion'
    ],
    tags: ['isolation', 'hamstring', 'machine', 'pump'],
    defaultParameters: {
      sets: 4,
      reps: 12,
      tempo: '2-1-1-1',
      rest: 75,
      rpe: 8
    }
  },

  // ARM EXERCISES
  {
    id: 'ex_barbell_curl',
    name: 'Barbell Bicep Curl',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.BICEPS],
    secondaryMuscles: [MuscleGroup.FOREARMS],
    equipment: [Equipment.BARBELL],
    movementPattern: undefined,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Classic bicep builder. Curl barbell from arms extended to full contraction.',
    cues: [
      'Stand with feet hip-width',
      'Elbows tucked to sides',
      'Curl bar up without swinging',
      'Squeeze biceps at top',
      'Control the negative'
    ],
    commonMistakes: [
      'Swinging/using momentum',
      'Elbows moving forward',
      'Not fully extending arms at bottom',
      'Going too heavy'
    ],
    tags: ['isolation', 'biceps', 'arms', 'classic'],
    defaultParameters: {
      sets: 3,
      reps: 10,
      tempo: '2-1-1-0',
      rest: 90,
      rpe: 8
    }
  },
  {
    id: 'ex_close_grip_bench',
    name: 'Close-Grip Bench Press',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.TRICEPS],
    secondaryMuscles: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS],
    equipment: [Equipment.BARBELL],
    movementPattern: MovementPattern.HORIZONTAL_PUSH,
    difficulty: DifficultyLevel.INTERMEDIATE,
    description: 'Compound tricep exercise using narrow grip on bench press.',
    cues: [
      'Grip shoulder-width or slightly narrower',
      'Keep elbows tucked close to body',
      'Lower bar to lower chest',
      'Press up focusing on tricep engagement',
      'Maintain shoulder blade retraction'
    ],
    commonMistakes: [
      'Grip too narrow (wrist strain)',
      'Flaring elbows out',
      'Not achieving full lockout',
      'Bouncing bar off chest'
    ],
    tags: ['compound', 'triceps', 'strength', 'mass'],
    defaultParameters: {
      sets: 4,
      reps: 8,
      tempo: '2-0-1-0',
      rest: 120,
      rpe: 8
    }
  },
  {
    id: 'ex_cable_tricep_pushdown',
    name: 'Cable Tricep Pushdown',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.TRICEPS],
    secondaryMuscles: [],
    equipment: [Equipment.CABLE],
    movementPattern: undefined,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Isolation exercise for triceps using cable machine with rope or bar attachment.',
    cues: [
      'Stand upright with slight forward lean',
      'Keep elbows pinned to sides',
      'Push down until full tricep extension',
      'Squeeze triceps at bottom',
      'Control the return'
    ],
    commonMistakes: [
      'Elbows moving away from body',
      'Using shoulders/body English',
      'Not achieving full extension',
      'Going too heavy'
    ],
    tags: ['isolation', 'triceps', 'pump', 'constant_tension'],
    defaultParameters: {
      sets: 3,
      reps: 15,
      tempo: '2-1-1-0',
      rest: 60,
      rpe: 8
    }
  },

  // CORE EXERCISES
  {
    id: 'ex_hanging_leg_raise',
    name: 'Hanging Leg Raise',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.ABS],
    secondaryMuscles: [MuscleGroup.OBLIQUES, MuscleGroup.FOREARMS],
    equipment: [Equipment.BODYWEIGHT],
    movementPattern: undefined,
    difficulty: DifficultyLevel.ADVANCED,
    description: 'Advanced ab exercise. Hang from bar and raise legs to horizontal or higher.',
    cues: [
      'Dead hang from pull-up bar',
      'Initiate movement by tilting pelvis (posterior tilt)',
      'Raise legs with control',
      'Aim for legs parallel to ground or higher',
      'Avoid swinging'
    ],
    commonMistakes: [
      'Using momentum/swinging',
      'Not engaging abs (just using hip flexors)',
      'Partial range of motion',
      'Jerky movements'
    ],
    tags: ['bodyweight', 'abs', 'advanced', 'calisthenics'],
    defaultParameters: {
      sets: 3,
      reps: 12,
      tempo: '1-1-1-0',
      rest: 90,
      rpe: 9
    }
  },
  {
    id: 'ex_plank',
    name: 'Plank Hold',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.ABS],
    secondaryMuscles: [MuscleGroup.LOWER_BACK, MuscleGroup.SHOULDERS],
    equipment: [Equipment.BODYWEIGHT],
    movementPattern: MovementPattern.ANTI_ROTATION,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Isometric core exercise. Hold body in straight line from head to heels.',
    cues: [
      'Forearms on ground, elbows under shoulders',
      'Body in straight line - neutral spine',
      'Squeeze glutes and brace abs',
      'Breathe normally',
      'Don\'t let hips sag or pike up'
    ],
    commonMistakes: [
      'Hips sagging (lower back arching)',
      'Hips too high',
      'Holding breath',
      'Looking up (neck hyperextension)'
    ],
    tags: ['isometric', 'core_stability', 'bodyweight', 'beginner_friendly'],
    defaultParameters: {
      sets: 3,
      reps: 1,
      tempo: '60-0-0-0',
      rest: 60,
      rpe: 7,
      notes: 'Hold for 60 seconds per set'
    }
  }
];

// ============================================================================
// CARDIO EXERCISES
// ============================================================================

const cardioExercises: CardioExercise[] = [
  {
    id: 'ex_treadmill_running',
    name: 'Treadmill Running',
    category: ExerciseCategory.CARDIO,
    primaryMuscles: [MuscleGroup.FULL_BODY],
    secondaryMuscles: [MuscleGroup.CALVES, MuscleGroup.QUADS],
    equipment: [Equipment.TREADMILL],
    movementPattern: MovementPattern.LOCOMOTION,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Controlled indoor running for cardiovascular conditioning.',
    cues: [
      'Land mid-foot, not on heels',
      'Keep posture upright',
      'Arm swing natural and relaxed',
      'Breathe rhythmically',
      'Start with warmup pace'
    ],
    commonMistakes: [
      'Starting too fast',
      'Overstriding',
      'Holding onto handrails',
      'Looking down at feet'
    ],
    tags: ['cardio', 'endurance', 'fat_loss', 'conditioning'],
    defaultParameters: {
      duration: 30,
      zone: CardioZone.ZONE_2,
      speed: 10,
      incline: 1
    }
  },
  {
    id: 'ex_assault_bike',
    name: 'Assault Bike/Air Bike',
    category: ExerciseCategory.CARDIO,
    primaryMuscles: [MuscleGroup.FULL_BODY],
    secondaryMuscles: [],
    equipment: [Equipment.BIKE],
    movementPattern: MovementPattern.LOCOMOTION,
    difficulty: DifficultyLevel.ADVANCED,
    description: 'High-intensity cardio using air resistance bike with arm and leg drive.',
    cues: [
      'Push and pull with arms',
      'Powerful leg drive',
      'Maintain steady rhythm or sprint intervals',
      'Breathe hard - this is metabolic conditioning'
    ],
    commonMistakes: [
      'All arms, no legs',
      'Inconsistent pacing on intervals',
      'Slouching posture'
    ],
    tags: ['hiit', 'conditioning', 'metabolic', 'full_body'],
    defaultParameters: {
      duration: 20,
      zone: CardioZone.ZONE_4,
      intervals: {
        work: 30,
        rest: 30,
        rounds: 10
      }
    }
  },
  {
    id: 'ex_rowing_machine',
    name: 'Rowing Machine (Erg)',
    category: ExerciseCategory.CARDIO,
    primaryMuscles: [MuscleGroup.BACK, MuscleGroup.LEGS],
    secondaryMuscles: [MuscleGroup.ABS, MuscleGroup.SHOULDERS],
    equipment: [Equipment.ROWER],
    movementPattern: MovementPattern.HORIZONTAL_PULL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    description: 'Full-body cardio exercise mimicking rowing motion.',
    cues: [
      'Drive with legs first',
      'Then hip hinge and pull with arms',
      'Return in reverse order: arms, hips, legs',
      'Maintain flat back throughout',
      'Power comes from legs (60-70%)'
    ],
    commonMistakes: [
      'Pulling with arms first (should be legs)',
      'Rounding back',
      'Rushing the recovery phase',
      'Poor breathing rhythm'
    ],
    tags: ['cardio', 'full_body', 'low_impact', 'back_workout'],
    defaultParameters: {
      duration: 20,
      zone: CardioZone.ZONE_3,
      resistance: 5
    }
  },
  {
    id: 'ex_jump_rope',
    name: 'Jump Rope',
    category: ExerciseCategory.CARDIO,
    primaryMuscles: [MuscleGroup.CALVES],
    secondaryMuscles: [MuscleGroup.SHOULDERS, MuscleGroup.FOREARMS],
    equipment: [Equipment.NONE],
    movementPattern: MovementPattern.LOCOMOTION,
    difficulty: DifficultyLevel.INTERMEDIATE,
    description: 'Classic cardio exercise using a jump rope for footwork and conditioning.',
    cues: [
      'Jump on balls of feet',
      'Minimal ground contact time',
      'Wrist rotation for rope, not big arm swings',
      'Stay light and bouncy',
      'Keep knees slightly bent'
    ],
    commonMistakes: [
      'Jumping too high',
      'Using arms instead of wrists',
      'Landing on heels',
      'Inconsistent rhythm'
    ],
    tags: ['cardio', 'coordination', 'conditioning', 'portable'],
    defaultParameters: {
      duration: 15,
      zone: CardioZone.ZONE_3,
      intervals: {
        work: 60,
        rest: 30,
        rounds: 10
      }
    }
  }
];

// ============================================================================
// PLYOMETRIC EXERCISES
// ============================================================================

const plyometricExercises: PlyometricExercise[] = [
  {
    id: 'ex_box_jump',
    name: 'Box Jump',
    category: ExerciseCategory.PLYOMETRIC,
    primaryMuscles: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
    secondaryMuscles: [MuscleGroup.CALVES, MuscleGroup.ABS],
    equipment: [Equipment.NONE],
    movementPattern: undefined,
    difficulty: DifficultyLevel.INTERMEDIATE,
    description: 'Explosive jump onto elevated platform to develop power and athleticism.',
    cues: [
      'Start with quarter squat arm swing',
      'Explode up with powerful hip extension',
      'Land softly with knees bent',
      'Full hip and knee extension in air',
      'Step down - don\'t jump down (protects joints)'
    ],
    commonMistakes: [
      'Not achieving full hip extension',
      'Landing stiff-legged',
      'Using too high box (ego lifting)',
      'Jumping down instead of stepping down'
    ],
    tags: ['power', 'explosive', 'athletic', 'lower_body'],
    defaultParameters: {
      contacts: 30,
      sets: 5,
      height: 60,
      intensity: 'high',
      rest: 180
    }
  },
  {
    id: 'ex_depth_jump',
    name: 'Depth Jump',
    category: ExerciseCategory.PLYOMETRIC,
    primaryMuscles: [MuscleGroup.QUADS, MuscleGroup.GLUTES, MuscleGroup.CALVES],
    secondaryMuscles: [],
    equipment: [Equipment.NONE],
    movementPattern: undefined,
    difficulty: DifficultyLevel.ADVANCED,
    description: 'Advanced plyometric. Step off box, land and immediately jump for maximum height.',
    cues: [
      'Step off box (don\'t jump off)',
      'Land on balls of feet',
      'Minimize ground contact time',
      'Explode immediately into maximum vertical jump',
      'This is about reactive strength'
    ],
    commonMistakes: [
      'Box too high for athlete level',
      'Long ground contact time',
      'Not jumping maximally',
      'Landing heel-first'
    ],
    tags: ['advanced_plyometrics', 'reactive_strength', 'explosive_power', 'cns_demanding'],
    defaultParameters: {
      contacts: 15,
      sets: 3,
      height: 40,
      intensity: 'high',
      rest: 240,
      notes: 'Advanced exercise - ensure proper progression'
    }
  },
  {
    id: 'ex_medicine_ball_slam',
    name: 'Medicine Ball Slam',
    category: ExerciseCategory.PLYOMETRIC,
    primaryMuscles: [MuscleGroup.ABS, MuscleGroup.SHOULDERS],
    secondaryMuscles: [MuscleGroup.BACK, MuscleGroup.LEGS],
    equipment: [Equipment.MEDICINE_BALL],
    movementPattern: undefined,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Full-body power exercise slamming medicine ball to ground with maximal force.',
    cues: [
      'Hold ball overhead',
      'Engage core and full body',
      'Slam ball down with maximum power',
      'Hinge at hips as you slam',
      'Pick up and repeat explosively'
    ],
    commonMistakes: [
      'Using only arms (should be full body)',
      'Not engaging core',
      'Ball bouncing too high (use dead ball)',
      'Poor breathing rhythm'
    ],
    tags: ['power', 'core', 'conditioning', 'explosive', 'fun'],
    defaultParameters: {
      contacts: 40,
      sets: 4,
      intensity: 'high',
      rest: 90
    }
  },
  {
    id: 'ex_broad_jump',
    name: 'Standing Broad Jump',
    category: ExerciseCategory.PLYOMETRIC,
    primaryMuscles: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
    secondaryMuscles: [MuscleGroup.HAMSTRINGS, MuscleGroup.CALVES],
    equipment: [Equipment.NONE],
    movementPattern: undefined,
    difficulty: DifficultyLevel.INTERMEDIATE,
    description: 'Horizontal power jump for distance from standing position.',
    cues: [
      'Start with feet hip-width',
      'Swing arms back, load hips',
      'Powerful arm swing forward while extending hips',
      'Project body forward and up',
      'Land with knees bent to absorb force'
    ],
    commonMistakes: [
      'Jumping too vertical instead of horizontal',
      'Poor arm swing timing',
      'Landing stiff',
      'Not measuring/tracking distance'
    ],
    tags: ['power_testing', 'horizontal_power', 'athletic'],
    defaultParameters: {
      contacts: 20,
      sets: 4,
      intensity: 'high',
      rest: 120
    }
  }
];

// ============================================================================
// POWERLIFTING EXERCISES
// ============================================================================

const powerliftingExercises: PowerliftingExercise[] = [
  {
    id: 'ex_powerlifting_squat',
    name: 'Competition Squat (Powerlifting)',
    category: ExerciseCategory.POWERLIFTING,
    primaryMuscles: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
    secondaryMuscles: [MuscleGroup.HAMSTRINGS, MuscleGroup.LOWER_BACK, MuscleGroup.ABS],
    equipment: [Equipment.BARBELL],
    movementPattern: MovementPattern.SQUAT,
    difficulty: DifficultyLevel.ADVANCED,
    description: 'Competition-style squat meeting powerlifting federation standards.',
    cues: [
      'Low bar position on rear delts',
      'Wider stance (sumo-style common)',
      'Break at hips and knees',
      'Descend until hip crease below knee (federation requirement)',
      'Drive up maintaining bar path',
      'Complete lockout at top'
    ],
    commonMistakes: [
      'Not hitting depth',
      'Uneven bar path',
      'Knees caving',
      'Not waiting for commands (in comp)'
    ],
    tags: ['powerlifting', 'competition', 'maximal_strength', 'squat'],
    defaultParameters: {
      sets: 5,
      reps: 3,
      weight: 0,
      oneRepMaxPercent: 85,
      rest: 300,
      tempo: '3-0-X-0',
      notes: 'X = explosive concentric'
    }
  },
  {
    id: 'ex_powerlifting_bench',
    name: 'Competition Bench Press (Powerlifting)',
    category: ExerciseCategory.POWERLIFTING,
    primaryMuscles: [MuscleGroup.CHEST],
    secondaryMuscles: [MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    equipment: [Equipment.BARBELL],
    movementPattern: MovementPattern.HORIZONTAL_PUSH,
    difficulty: DifficultyLevel.ADVANCED,
    description: 'Competition-style bench press with pause on chest.',
    cues: [
      'Lie on bench with shoulder blade retraction',
      'Arch lower back (legal and safer)',
      'Unrack and stabilize',
      'Lower to chest with control',
      'Pause on chest (wait for press command in comp)',
      'Press explosively to lockout'
    ],
    commonMistakes: [
      'Bouncing off chest (must pause in comp)',
      'Butt leaving bench',
      'Uneven press',
      'Not waiting for commands'
    ],
    tags: ['powerlifting', 'competition', 'maximal_strength', 'bench'],
    defaultParameters: {
      sets: 5,
      reps: 3,
      weight: 0,
      oneRepMaxPercent: 85,
      rest: 300,
      pauseTime: 1,
      notes: 'Include 1-second pause on chest'
    }
  },
  {
    id: 'ex_powerlifting_deadlift',
    name: 'Competition Deadlift (Powerlifting)',
    category: ExerciseCategory.POWERLIFTING,
    primaryMuscles: [MuscleGroup.BACK, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    secondaryMuscles: [MuscleGroup.TRAPS, MuscleGroup.FOREARMS],
    equipment: [Equipment.BARBELL],
    movementPattern: MovementPattern.HINGE,
    difficulty: DifficultyLevel.ADVANCED,
    description: 'Competition-style deadlift to full lockout.',
    cues: [
      'Conventional or sumo stance',
      'Set up with bar over mid-foot',
      'Tension on bar before pulling',
      'Leg drive first, then hip extension',
      'Lockout fully - shoulders back, hips through',
      'Control descent (after down command in comp)'
    ],
    commonMistakes: [
      'Hitching (illegal in comp)',
      'Not achieving full lockout',
      'Rounding back',
      'Dropping bar (must control in some feds)'
    ],
    tags: ['powerlifting', 'competition', 'maximal_strength', 'deadlift'],
    defaultParameters: {
      sets: 5,
      reps: 2,
      weight: 0,
      oneRepMaxPercent: 87,
      rest: 300,
      withChains: false,
      withBands: false
    }
  }
];

// ============================================================================
// STRONGMAN EXERCISES
// ============================================================================

const strongmanExercises: StrongmanExercise[] = [
  {
    id: 'ex_farmers_walk',
    name: 'Farmer\'s Walk',
    category: ExerciseCategory.STRONGMAN,
    primaryMuscles: [MuscleGroup.FOREARMS, MuscleGroup.TRAPS],
    secondaryMuscles: [MuscleGroup.ABS, MuscleGroup.QUADS, MuscleGroup.CALVES],
    equipment: [Equipment.DUMBBELL, Equipment.KETTLEBELL],
    movementPattern: MovementPattern.CARRY,
    difficulty: DifficultyLevel.INTERMEDIATE,
    description: 'Loaded carry exercise holding heavy implements in each hand.',
    cues: [
      'Pick up weights with good deadlift form',
      'Stand tall with chest up',
      'Squeeze handles hard',
      'Walk with short, quick steps',
      'Keep core braced'
    ],
    commonMistakes: [
      'Leaning forward/backward',
      'Taking too long strides',
      'Shrugging shoulders',
      'Letting weights swing'
    ],
    tags: ['strongman', 'grip', 'functional', 'conditioning', 'carry'],
    defaultParameters: {
      distance: 30,
      weight: 0,
      rest: 120,
      sets: 4
    }
  },
  {
    id: 'ex_yoke_walk',
    name: 'Yoke Walk',
    category: ExerciseCategory.STRONGMAN,
    primaryMuscles: [MuscleGroup.FULL_BODY],
    secondaryMuscles: [MuscleGroup.TRAPS, MuscleGroup.QUADS, MuscleGroup.ABS],
    equipment: [Equipment.NONE],
    movementPattern: MovementPattern.CARRY,
    difficulty: DifficultyLevel.ADVANCED,
    description: 'Walk with heavy yoke apparatus on back/shoulders.',
    cues: [
      'Get under yoke and stand',
      'Keep chest up and core tight',
      'Short, fast steps',
      'Drive through legs',
      'Don\'t let yoke control you'
    ],
    commonMistakes: [
      'Slow, long steps (less stable)',
      'Leaning forward excessively',
      'Not bracing core',
      'Panicking under load'
    ],
    tags: ['strongman', 'carry', 'full_body', 'brutal'],
    defaultParameters: {
      distance: 20,
      weight: 0,
      rest: 180,
      sets: 3
    }
  },
  {
    id: 'ex_atlas_stone',
    name: 'Atlas Stone Lift',
    category: ExerciseCategory.STRONGMAN,
    primaryMuscles: [MuscleGroup.BACK, MuscleGroup.GLUTES, MuscleGroup.BICEPS],
    secondaryMuscles: [MuscleGroup.FULL_BODY],
    equipment: [Equipment.NONE],
    movementPattern: MovementPattern.HINGE,
    difficulty: DifficultyLevel.ELITE,
    description: 'Lift heavy spherical stone from ground to platform.',
    cues: [
      'Bear hug stone from ground',
      'Roll stone up thighs',
      'Explosive hip extension',
      'Press stone over platform edge',
      'Use tacky for grip'
    ],
    commonMistakes: [
      'Not using tacky (stone will slip)',
      'Poor lap technique',
      'Trying to curl stone instead of hip drive',
      'Not committing to the lift'
    ],
    tags: ['strongman', 'competition', 'full_body', 'iconic'],
    defaultParameters: {
      weight: 100,
      rest: 240,
      sets: 3,
      notes: 'Use tacky and proper atlas stone technique'
    }
  },
  {
    id: 'ex_tire_flip',
    name: 'Tire Flip',
    category: ExerciseCategory.STRONGMAN,
    primaryMuscles: [MuscleGroup.FULL_BODY],
    secondaryMuscles: [MuscleGroup.GLUTES, MuscleGroup.BACK, MuscleGroup.SHOULDERS],
    equipment: [Equipment.NONE],
    movementPattern: MovementPattern.HINGE,
    difficulty: DifficultyLevel.ADVANCED,
    description: 'Flip large heavy tire end-over-end.',
    cues: [
      'Deadlift tire up with power',
      'Get under tire quickly',
      'Drive with legs and push with arms',
      'Flip explosively',
      'Reset and repeat'
    ],
    commonMistakes: [
      'All arms, no legs',
      'Not getting under tire',
      'Poor initial deadlift',
      'Slow transition'
    ],
    tags: ['strongman', 'full_body', 'power', 'conditioning'],
    defaultParameters: {
      distance: 20,
      rest: 120,
      sets: 5,
      notes: 'Distance = total flips'
    }
  }
];

// ============================================================================
// STRETCHING/MOBILITY EXERCISES
// ============================================================================

const stretchingExercises: StretchingExercise[] = [
  {
    id: 'ex_hamstring_stretch',
    name: 'Standing Hamstring Stretch',
    category: ExerciseCategory.STRETCHING,
    primaryMuscles: [MuscleGroup.HAMSTRINGS],
    secondaryMuscles: [MuscleGroup.CALVES, MuscleGroup.LOWER_BACK],
    equipment: [Equipment.NONE],
    movementPattern: undefined,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Static stretch for hamstring flexibility.',
    cues: [
      'Stand and extend one leg forward on heel',
      'Hinge at hips keeping back flat',
      'Feel stretch in back of thigh',
      'Hold steady tension - no bouncing',
      'Breathe deeply into stretch'
    ],
    commonMistakes: [
      'Rounding back',
      'Bouncing (ballistic stretching)',
      'Holding breath',
      'Overstretching (pain vs discomfort)'
    ],
    tags: ['flexibility', 'static_stretch', 'hamstrings', 'recovery'],
    defaultParameters: {
      duration: 30,
      sets: 3,
      type: 'static'
    }
  },
  {
    id: 'ex_hip_flexor_stretch',
    name: 'Kneeling Hip Flexor Stretch',
    category: ExerciseCategory.STRETCHING,
    primaryMuscles: [MuscleGroup.QUADS],
    secondaryMuscles: [MuscleGroup.ABS],
    equipment: [Equipment.NONE],
    movementPattern: undefined,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Stretch for hip flexors and anterior chain, crucial for those who sit a lot.',
    cues: [
      'Kneel with one knee down, other foot forward',
      'Push hips forward',
      'Keep torso upright',
      'Squeeze glute of kneeling leg',
      'Feel stretch in front of hip'
    ],
    commonMistakes: [
      'Arching lower back',
      'Not pushing hips forward enough',
      'Leaning forward with torso'
    ],
    tags: ['flexibility', 'hip_mobility', 'desk_worker', 'important'],
    defaultParameters: {
      duration: 45,
      sets: 3,
      type: 'static'
    }
  },
  {
    id: 'ex_childs_pose',
    name: 'Child\'s Pose',
    category: ExerciseCategory.STRETCHING,
    primaryMuscles: [MuscleGroup.BACK],
    secondaryMuscles: [MuscleGroup.SHOULDERS, MuscleGroup.GLUTES],
    equipment: [Equipment.NONE],
    movementPattern: undefined,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Resting yoga pose that stretches back, shoulders and hips.',
    cues: [
      'Kneel and sit back on heels',
      'Extend arms forward on ground',
      'Lower forehead to ground',
      'Breathe deeply',
      'Relax into position'
    ],
    commonMistakes: [
      'Not sitting back enough',
      'Tense shoulders',
      'Holding breath'
    ],
    tags: ['recovery', 'flexibility', 'yoga', 'relaxation', 'back'],
    defaultParameters: {
      duration: 60,
      sets: 2,
      type: 'static'
    }
  },
  {
    id: 'ex_world_greatest_stretch',
    name: 'World\'s Greatest Stretch',
    category: ExerciseCategory.STRETCHING,
    primaryMuscles: [MuscleGroup.FULL_BODY],
    secondaryMuscles: [],
    equipment: [Equipment.NONE],
    movementPattern: undefined,
    difficulty: DifficultyLevel.INTERMEDIATE,
    description: 'Dynamic full-body mobility drill combining lunge, rotation, and hip opener.',
    cues: [
      'Start in deep lunge position',
      'Place hand inside front foot',
      'Rotate torso and reach other arm up',
      'Hold briefly then return',
      'Move slowly and controlled'
    ],
    commonMistakes: [
      'Rushing through movement',
      'Not achieving deep lunge',
      'Poor rotation',
      'Holding breath'
    ],
    tags: ['dynamic', 'mobility', 'warmup', 'full_body', 'comprehensive'],
    defaultParameters: {
      duration: 5,
      sets: 3,
      type: 'dynamic',
      notes: 'Duration is per side - move slowly through full ROM'
    }
  }
];

// ============================================================================
// CORRECTIVE EXERCISES
// ============================================================================

const correctiveExercises: CorrectiveExercise[] = [
  {
    id: 'ex_band_pull_apart',
    name: 'Band Pull-Apart',
    category: ExerciseCategory.CORRECTIVE,
    primaryMuscles: [MuscleGroup.BACK],
    secondaryMuscles: [MuscleGroup.SHOULDERS],
    equipment: [Equipment.BANDS],
    movementPattern: MovementPattern.HORIZONTAL_PULL,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Corrective exercise for scapular retraction and rear delt activation.',
    cues: [
      'Hold band at shoulder width',
      'Pull band apart to chest',
      'Focus on squeezing shoulder blades together',
      'Keep arms straight',
      'Control the return'
    ],
    commonMistakes: [
      'Using too heavy band',
      'Bending elbows',
      'Shrugging shoulders',
      'Rushing reps'
    ],
    tags: ['corrective', 'posture', 'shoulder_health', 'rear_delts', 'prehab'],
    defaultParameters: {
      sets: 3,
      reps: 20,
      focus: 'Scapular retraction and posterior shoulder health'
    }
  },
  {
    id: 'ex_wall_slide',
    name: 'Wall Slide',
    category: ExerciseCategory.CORRECTIVE,
    primaryMuscles: [MuscleGroup.SHOULDERS],
    secondaryMuscles: [MuscleGroup.BACK],
    equipment: [Equipment.NONE],
    movementPattern: MovementPattern.VERTICAL_PUSH,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Shoulder mobility and scapular control drill.',
    cues: [
      'Stand with back flat against wall',
      'Arms in goal post position',
      'Slide arms overhead maintaining wall contact',
      'Return to start with control',
      'Keep lower back flat on wall'
    ],
    commonMistakes: [
      'Lower back arching off wall',
      'Not maintaining arm contact with wall',
      'Moving too fast',
      'Shoulders elevating (shrugging)'
    ],
    tags: ['corrective', 'shoulder_mobility', 'posture', 'warmup', 'prehab'],
    defaultParameters: {
      sets: 3,
      reps: 15,
      focus: 'Overhead shoulder mobility and scapular control'
    }
  },
  {
    id: 'ex_glute_bridge',
    name: 'Glute Bridge',
    category: ExerciseCategory.CORRECTIVE,
    primaryMuscles: [MuscleGroup.GLUTES],
    secondaryMuscles: [MuscleGroup.HAMSTRINGS],
    equipment: [Equipment.BODYWEIGHT],
    movementPattern: MovementPattern.HINGE,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Glute activation exercise, critical for those with sitting jobs.',
    cues: [
      'Lie on back with knees bent, feet flat',
      'Squeeze glutes and lift hips',
      'Full hip extension at top',
      'Hold contraction',
      'Lower with control'
    ],
    commonMistakes: [
      'Using lower back instead of glutes',
      'Not achieving full hip extension',
      'Pushing through toes instead of heels',
      'Hyperextending lumbar spine'
    ],
    tags: ['corrective', 'glute_activation', 'lower_back_health', 'prehab'],
    defaultParameters: {
      sets: 3,
      reps: 20,
      focus: 'Glute activation and hip extension pattern'
    }
  },
  {
    id: 'ex_dead_bug',
    name: 'Dead Bug',
    category: ExerciseCategory.CORRECTIVE,
    primaryMuscles: [MuscleGroup.ABS],
    secondaryMuscles: [],
    equipment: [Equipment.BODYWEIGHT],
    movementPattern: MovementPattern.ANTI_ROTATION,
    difficulty: DifficultyLevel.BEGINNER,
    description: 'Core stability exercise teaching proper anti-extension control.',
    cues: [
      'Lie on back with arms up, knees at 90 degrees',
      'Extend opposite arm and leg',
      'Keep lower back pressed to floor',
      'Move slowly and controlled',
      'Breathe - don\'t hold breath'
    ],
    commonMistakes: [
      'Lower back arching off floor',
      'Moving too fast',
      'Not breathing properly',
      'Legs moving in wrong pattern'
    ],
    tags: ['corrective', 'core_stability', 'anti_extension', 'back_health', 'fundamental'],
    defaultParameters: {
      sets: 3,
      reps: 12,
      focus: 'Anti-extension core stability and spinal control',
      notes: 'Reps = per side (alternating)'
    }
  }
];

// ============================================================================
// OLYMPIC LIFTING
// ============================================================================

const olympicExercises: ResistanceExercise[] = [
  {
    id: 'ex_power_clean',
    name: 'Power Clean',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.FULL_BODY],
    secondaryMuscles: [MuscleGroup.TRAPS, MuscleGroup.SHOULDERS],
    equipment: [Equipment.BARBELL],
    movementPattern: MovementPattern.HINGE,
    difficulty: DifficultyLevel.ADVANCED,
    description: 'Explosive Olympic lifting movement - deadlift into front rack position.',
    cues: [
      'Start like deadlift - bar over mid-foot',
      'First pull controlled',
      'Explosive hip extension (second pull)',
      'Shrug and pull under bar',
      'Catch in quarter squat with elbows high'
    ],
    commonMistakes: [
      'Pulling with arms too early',
      'No hip extension',
      'Poor rack position (elbows down)',
      'Jumping forward'
    ],
    tags: ['olympic', 'power', 'explosive', 'athletic', 'technical'],
    defaultParameters: {
      sets: 5,
      reps: 3,
      tempo: '1-0-X-1',
      rest: 180,
      rpe: 7,
      notes: 'X = maximal explosive effort'
    }
  },
  {
    id: 'ex_snatch',
    name: 'Snatch',
    category: ExerciseCategory.RESISTANCE,
    primaryMuscles: [MuscleGroup.FULL_BODY],
    secondaryMuscles: [MuscleGroup.SHOULDERS, MuscleGroup.TRAPS],
    equipment: [Equipment.BARBELL],
    movementPattern: MovementPattern.HINGE,
    difficulty: DifficultyLevel.ELITE,
    description: 'Most technical Olympic lift - ground to overhead in one motion.',
    cues: [
      'Wide grip (snatch grip)',
      'First pull controlled',
      'Explosive triple extension',
      'Pull under bar aggressively',
      'Catch in overhead squat position'
    ],
    commonMistakes: [
      'Grip not wide enough',
      'Weak turnover',
      'Poor overhead position',
      'Bar path not vertical'
    ],
    tags: ['olympic', 'explosive', 'technical', 'mobility', 'elite'],
    defaultParameters: {
      sets: 5,
      reps: 2,
      tempo: '1-0-X-1',
      rest: 240,
      rpe: 7,
      notes: 'Highly technical - coaching recommended'
    }
  }
];

// ============================================================================
// EXPORT ALL EXERCISES
// ============================================================================

export const ULTIMATE_EXERCISES: Exercise[] = [
  ...resistanceExercises,
  ...cardioExercises,
  ...plyometricExercises,
  ...powerliftingExercises,
  ...strongmanExercises,
  ...stretchingExercises,
  ...correctiveExercises,
  ...olympicExercises
];

// Helper function to get exercises by category
export const getExercisesByCategory = (category: ExerciseCategory): Exercise[] => {
  return ULTIMATE_EXERCISES.filter(ex => ex.category === category);
};

// Helper function to get exercises by muscle group
export const getExercisesByMuscle = (muscle: MuscleGroup): Exercise[] => {
  return ULTIMATE_EXERCISES.filter(ex => 
    ex.primaryMuscles.includes(muscle) || ex.secondaryMuscles.includes(muscle)
  );
};

// Helper function to get exercises by equipment
export const getExercisesByEquipment = (equipment: Equipment): Exercise[] => {
  return ULTIMATE_EXERCISES.filter(ex => ex.equipment.includes(equipment));
};

// Helper function to search exercises
export const searchExercises = (query: string): Exercise[] => {
  const lowerQuery = query.toLowerCase();
  return ULTIMATE_EXERCISES.filter(ex =>
    ex.name.toLowerCase().includes(lowerQuery) ||
    ex.description.toLowerCase().includes(lowerQuery) ||
    ex.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export default ULTIMATE_EXERCISES;
