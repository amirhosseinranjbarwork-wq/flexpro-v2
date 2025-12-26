// ============================================
// Scientific Training Types for FlexPro v2
// Comprehensive Workout Builder Type System
// ============================================

// ========== Core Exercise Type Discriminator ==========
export type ExerciseType = 'resistance' | 'cardio' | 'plyometric' | 'corrective';

// ========== Training System Types ==========
export type TrainingSystemType =
  // Standard Systems
  | 'straight_set'        // Basic set/rep pattern
  | 'superset'            // 2 exercises back-to-back
  | 'triset'              // 3 exercises back-to-back
  | 'giant_set'           // 4+ exercises back-to-back
  | 'circuit'             // Multiple exercises with minimal rest
  // Intensity Techniques
  | 'drop_set'            // Progressive weight reduction
  | 'rest_pause'          // Brief rest within set
  | 'cluster_set'         // Mini-sets with intra-set rest
  | 'myo_reps'            // Activation set + mini-sets
  // Volume Systems
  | 'german_volume'       // 10x10 methodology
  | 'fst7'                // 7 sets, 30-45s rest (fascia stretch)
  | '5x5'                 // Stronglifts 5x5
  | 'pyramid'             // Progressive weight change
  | 'reverse_pyramid'     // Decreasing sets
  // Time Under Tension
  | 'tempo'               // Controlled tempo pattern
  | 'isometric'           // Static holds
  | 'eccentric'           // Negative emphasis
  | 'pause_rep'           // Mid-rep pauses
  // Special Techniques
  | 'blood_flow_restriction' // BFR training
  | '21s'                 // 7+7+7 partial reps
  | 'mechanical_drop'     // Change leverage, same weight
  | 'pre_exhaust'         // Isolation before compound
  | 'post_exhaust';       // Compound before isolation

// ========== Muscle Groups ==========
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'abs'
  | 'obliques'
  | 'lower_back'
  | 'traps'
  | 'hip_flexors'
  | 'adductors'
  | 'abductors'
  | 'full_body';

// Persian muscle names mapping
export const MUSCLE_GROUP_NAMES: Record<MuscleGroup, string> = {
  chest: 'سینه',
  back: 'پشت',
  shoulders: 'شانه',
  biceps: 'جلو بازو',
  triceps: 'پشت بازو',
  forearms: 'ساعد',
  quadriceps: 'چهارسر ران',
  hamstrings: 'پشت ران',
  glutes: 'سرینی',
  calves: 'ساق پا',
  abs: 'شکم',
  obliques: 'مایل شکم',
  lower_back: 'کمر',
  traps: 'ذوزنقه',
  hip_flexors: 'خم کننده لگن',
  adductors: 'نزدیک کننده ران',
  abductors: 'دور کننده ران',
  full_body: 'کل بدن',
};

// ========== Equipment Types ==========
export type EquipmentType =
  | 'barbell'
  | 'dumbbell'
  | 'kettlebell'
  | 'cable'
  | 'machine'
  | 'smith_machine'
  | 'bodyweight'
  | 'resistance_bands'
  | 'trx'
  | 'medicine_ball'
  | 'stability_ball'
  | 'foam_roller'
  | 'box'
  | 'bench'
  | 'pull_up_bar'
  | 'dip_station'
  | 'treadmill'
  | 'bike'
  | 'rower'
  | 'elliptical'
  | 'stairmaster'
  | 'battle_ropes'
  | 'sled'
  | 'landmine'
  | 'none';

export const EQUIPMENT_NAMES: Record<EquipmentType, string> = {
  barbell: 'هالتر',
  dumbbell: 'دمبل',
  kettlebell: 'کتل‌بل',
  cable: 'کابل',
  machine: 'دستگاه',
  smith_machine: 'اسمیت',
  bodyweight: 'وزن بدن',
  resistance_bands: 'کش مقاومتی',
  trx: 'TRX',
  medicine_ball: 'مدیسین بال',
  stability_ball: 'توپ تعادل',
  foam_roller: 'فوم رولر',
  box: 'باکس',
  bench: 'نیمکت',
  pull_up_bar: 'میله بارفیکس',
  dip_station: 'دیپ',
  treadmill: 'تردمیل',
  bike: 'دوچرخه',
  rower: 'روئینگ',
  elliptical: 'الیپتیکال',
  stairmaster: 'پله‌رو',
  battle_ropes: 'طناب جنگی',
  sled: 'اسلد',
  landmine: 'لندماین',
  none: 'بدون تجهیزات',
};

// ========== Difficulty Levels ==========
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export const DIFFICULTY_NAMES: Record<DifficultyLevel, string> = {
  beginner: 'مبتدی',
  intermediate: 'متوسط',
  advanced: 'پیشرفته',
  elite: 'حرفه‌ای',
};

// ========== Base Exercise Definition ==========
export interface BaseExercise {
  id: string;
  name: string;
  name_en?: string;
  type: ExerciseType;
  primary_muscle: MuscleGroup;
  secondary_muscles?: MuscleGroup[];
  equipment: EquipmentType;
  difficulty: DifficultyLevel;
  description?: string;
  instructions?: string[];
  video_url?: string;
  gif_url?: string;
  image_url?: string;
  tips?: string[];
  common_mistakes?: string[];
  variations?: string[];
  is_unilateral?: boolean;
  is_compound?: boolean;
}

// ========== RPE Scale (Rate of Perceived Exertion) ==========
export type RPE = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const RPE_DESCRIPTIONS: Record<RPE, string> = {
  1: 'استراحت کامل',
  2: 'بسیار آسان',
  3: 'آسان',
  4: 'نسبتاً آسان',
  5: 'متوسط',
  6: 'کمی سخت',
  7: 'سخت',
  8: 'خیلی سخت - ۲ تکرار تا شکست',
  9: 'بسیار سخت - ۱ تکرار تا شکست',
  10: 'حداکثر تلاش - شکست عضلانی',
};

// ========== RIR (Reps In Reserve) ==========
export type RIR = 0 | 1 | 2 | 3 | 4 | 5;

export const RIR_DESCRIPTIONS: Record<RIR, string> = {
  0: 'شکست عضلانی (Failure)',
  1: '۱ تکرار مانده تا شکست',
  2: '۲ تکرار مانده تا شکست',
  3: '۳ تکرار مانده تا شکست',
  4: '۴ تکرار مانده تا شکست',
  5: '۵+ تکرار مانده تا شکست',
};

// ========== Tempo Pattern ==========
// Format: "Eccentric-Pause-Concentric-Pause" (e.g., "3-1-2-0")
export interface TempoPattern {
  eccentric: number;    // فاز منفی (پایین آوردن)
  pause_bottom: number; // مکث پایین
  concentric: number;   // فاز مثبت (بالا بردن)
  pause_top: number;    // مکث بالا
}

export function parseTempoString(tempo: string): TempoPattern | null {
  const parts = tempo.split('-').map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return null;
  return {
    eccentric: parts[0],
    pause_bottom: parts[1],
    concentric: parts[2],
    pause_top: parts[3],
  };
}

export function formatTempo(tempo: TempoPattern): string {
  return `${tempo.eccentric}-${tempo.pause_bottom}-${tempo.concentric}-${tempo.pause_top}`;
}

// Calculate TUT (Time Under Tension) for a set
export function calculateTUT(tempo: TempoPattern, reps: number): number {
  const repTime = tempo.eccentric + tempo.pause_bottom + tempo.concentric + tempo.pause_top;
  return repTime * reps;
}

// ========== Heart Rate Zones for Cardio ==========
export type HeartRateZone = 1 | 2 | 3 | 4 | 5;

export interface HeartRateZoneInfo {
  zone: HeartRateZone;
  name: string;
  name_en: string;
  percentage: string;
  description: string;
  benefit: string;
}

export const HEART_RATE_ZONES: HeartRateZoneInfo[] = [
  {
    zone: 1,
    name: 'استراحت فعال',
    name_en: 'Recovery',
    percentage: '50-60%',
    description: 'ریکاوری و گرم کردن',
    benefit: 'بهبود گردش خون، ریکاوری فعال',
  },
  {
    zone: 2,
    name: 'چربی‌سوزی',
    name_en: 'Fat Burn',
    percentage: '60-70%',
    description: 'استقامت پایه و چربی‌سوزی',
    benefit: 'حداکثر استفاده از چربی، استقامت',
  },
  {
    zone: 3,
    name: 'هوازی',
    name_en: 'Aerobic',
    percentage: '70-80%',
    description: 'بهبود ظرفیت هوازی',
    benefit: 'تقویت قلب، افزایش VO2max',
  },
  {
    zone: 4,
    name: 'آستانه بی‌هوازی',
    name_en: 'Anaerobic Threshold',
    percentage: '80-90%',
    description: 'بهبود آستانه لاکتات',
    benefit: 'افزایش توان، سرعت',
  },
  {
    zone: 5,
    name: 'حداکثر تلاش',
    name_en: 'VO2 Max',
    percentage: '90-100%',
    description: 'تمرین اینتروال شدید',
    benefit: 'حداکثر عملکرد، توان بی‌هوازی',
  },
];

// ========== Cardio Methods ==========
export type CardioMethod =
  | 'liss'              // Low Intensity Steady State
  | 'miss'              // Moderate Intensity Steady State
  | 'hiit'              // High Intensity Interval Training
  | 'tabata'            // 20s work / 10s rest x 8
  | 'emom'              // Every Minute On the Minute
  | 'amrap'             // As Many Rounds As Possible
  | 'fartlek'           // Variable pace training
  | 'tempo_run'         // Sustained threshold effort
  | 'intervals'         // Work/rest intervals
  | 'circuit_cardio';   // Cardio circuit

export const CARDIO_METHOD_INFO: Record<CardioMethod, { name: string; description: string }> = {
  liss: { name: 'LISS - استقامت کم شدت', description: 'تمرین مداوم با شدت پایین (۳۰-۶۰ دقیقه)' },
  miss: { name: 'MISS - استقامت متوسط', description: 'تمرین مداوم با شدت متوسط (۲۰-۴۵ دقیقه)' },
  hiit: { name: 'HIIT - تناوبی پرشدت', description: 'اینتروال‌های شدید با استراحت‌های کوتاه' },
  tabata: { name: 'تاباتا', description: '۲۰ ثانیه کار / ۱۰ ثانیه استراحت × ۸ راند' },
  emom: { name: 'EMOM', description: 'هر دقیقه یک حرکت مشخص' },
  amrap: { name: 'AMRAP', description: 'بیشترین راند ممکن در زمان مشخص' },
  fartlek: { name: 'فارتلک', description: 'تغییر سرعت بر اساس احساس' },
  tempo_run: { name: 'دویدن تمپو', description: 'دویدن با شدت آستانه' },
  intervals: { name: 'اینتروال', description: 'تناوب کار و استراحت' },
  circuit_cardio: { name: 'سیرکویت کاردیو', description: 'حرکات متوالی با استراحت کم' },
};

// ========== Plyometric Intensity Levels ==========
export type PlyometricIntensity = 'low' | 'moderate' | 'high' | 'very_high' | 'shock';

export const PLYOMETRIC_INTENSITY_INFO: Record<PlyometricIntensity, { name: string; examples: string }> = {
  low: { name: 'کم', examples: 'پرش در جا، اسکیپ، جامپینگ جک' },
  moderate: { name: 'متوسط', examples: 'باکس جامپ کوتاه، پرش افقی' },
  high: { name: 'بالا', examples: 'دپث جامپ، باکس جامپ بلند' },
  very_high: { name: 'خیلی بالا', examples: 'پرش تک پا، باندینگ' },
  shock: { name: 'شوک', examples: 'دپث جامپ ارتفاع بالا، ری‌باند جامپ' },
};

// ========== Corrective Exercise Types ==========
export type CorrectiveExerciseType =
  | 'foam_rolling'        // Self-Myofascial Release
  | 'static_stretch'      // Static stretching
  | 'dynamic_stretch'     // Dynamic stretching
  | 'activation'          // Muscle activation
  | 'mobility'            // Joint mobility
  | 'stability'           // Core/joint stability
  | 'breathing'           // Breathing exercises
  | 'pnf_stretch'         // PNF stretching
  | 'active_release'      // Active release technique
  | 'neural_flossing';    // Neural mobilization

export type ContractionType =
  | 'isometric'           // Static hold
  | 'isotonic'            // Movement with constant load
  | 'eccentric'           // Lengthening under tension
  | 'concentric'          // Shortening under tension
  | 'pnf_contract_relax'  // PNF contract-relax
  | 'pnf_hold_relax';     // PNF hold-relax

export const CORRECTIVE_TYPE_INFO: Record<CorrectiveExerciseType, { name: string; description: string }> = {
  foam_rolling: { name: 'فوم رولینگ', description: 'آزادسازی میوفاشیال' },
  static_stretch: { name: 'کشش ایستا', description: 'نگه‌داری کشش ۲۰-۳۰ ثانیه' },
  dynamic_stretch: { name: 'کشش پویا', description: 'کشش با حرکت کنترل شده' },
  activation: { name: 'فعال‌سازی', description: 'فعال‌سازی عضلات ضعیف' },
  mobility: { name: 'تحرک مفصلی', description: 'بهبود دامنه حرکتی' },
  stability: { name: 'ثبات', description: 'تقویت ثبات مفصل/کور' },
  breathing: { name: 'تنفسی', description: 'تمرینات تنفسی و دیافراگم' },
  pnf_stretch: { name: 'کشش PNF', description: 'کشش عصبی-عضلانی تسهیلی' },
  active_release: { name: 'آزادسازی فعال', description: 'تکنیک ART' },
  neural_flossing: { name: 'فلاسینگ عصبی', description: 'تحرک عصبی' },
};

// ========== Workout Set Types (Discriminated Union) ==========

// Base interface for all set types
export interface BaseWorkoutSet {
  id: string;
  order_index: number;
  exercise_id?: string;
  exercise_name: string;
  exercise_name_secondary?: string;
  exercise_name_tertiary?: string;
  exercise_name_quaternary?: string;
  target_muscle: MuscleGroup;
  secondary_muscles?: MuscleGroup[];
  equipment?: EquipmentType;
  gif_url?: string;
  notes?: string;
  completed?: boolean;
  completed_at?: string;
}

// ========== RESISTANCE WORKOUT SET ==========
export interface ResistanceWorkoutSet extends BaseWorkoutSet {
  type: 'resistance';
  training_system: TrainingSystemType;
  sets: number;
  reps: string;                    // Can be "8-12", "10", "AMRAP", etc.
  weight?: number;                 // in kg
  weight_unit?: 'kg' | 'lb' | 'percent_1rm';
  rpe?: RPE;
  rir?: RIR;
  tempo?: string;                  // "3-1-2-0" format
  rest_seconds: number;
  // Advanced parameters
  percent_1rm?: number;            // Percentage of 1RM
  min_reps?: number;
  max_reps?: number;
  target_reps?: number;
  // Drop set specific
  drop_count?: number;
  drop_percentage?: number;        // Percentage to reduce each drop
  // Rest-pause specific
  rest_pause_seconds?: number;     // Intra-set rest
  // Cluster set specific
  cluster_reps?: number;           // Reps per mini-set
  cluster_rest?: number;           // Rest between mini-sets
  // Blood Flow Restriction
  bfr_pressure?: number;           // mmHg
  bfr_cuff_width?: 'narrow' | 'wide';
}

// ========== CARDIO WORKOUT SET ==========
export interface CardioWorkoutSet extends BaseWorkoutSet {
  type: 'cardio';
  cardio_method: CardioMethod;
  duration_minutes: number;
  target_heart_rate_zone: HeartRateZone;
  // HIIT/Interval specific
  work_duration_seconds?: number;
  rest_duration_seconds?: number;
  intervals?: number;
  // Steady state
  target_speed?: number;           // km/h
  target_incline?: number;         // percentage
  target_resistance?: number;      // 1-20 scale
  target_cadence?: number;         // RPM
  // Distance based
  target_distance_km?: number;
  // Heart rate
  target_hr_min?: number;
  target_hr_max?: number;
  // Calories
  target_calories?: number;
}

// ========== PLYOMETRIC WORKOUT SET ==========
export interface PlyometricWorkoutSet extends BaseWorkoutSet {
  type: 'plyometric';
  sets: number;
  contacts: number;               // تعداد برخورد با زمین
  intensity: PlyometricIntensity;
  rest_seconds: number;
  // Box jump specific
  box_height_cm?: number;
  landing_type?: 'step_down' | 'jump_down' | 'rebound';
  // Depth jump specific
  drop_height_cm?: number;
  rebound_target?: 'height' | 'distance' | 'speed';
  // Progressive
  height_increment?: number;      // Increase per set
  // Unilateral
  is_single_leg?: boolean;
  // Ground contact time
  target_contact_time_ms?: number;
  // Teaching progressions
  progression_level?: 1 | 2 | 3 | 4 | 5;
}

// ========== CORRECTIVE WORKOUT SET ==========
export interface CorrectiveWorkoutSet extends BaseWorkoutSet {
  type: 'corrective';
  corrective_type: CorrectiveExerciseType;
  contraction_type?: ContractionType;
  // Duration/Reps
  sets?: number;
  reps?: number;
  hold_seconds?: number;          // Duration of each hold
  duration_seconds?: number;      // Total duration
  // Foam rolling specific
  passes?: number;                // Number of passes
  pressure?: 'light' | 'moderate' | 'deep';
  // Stretching specific
  stretch_side?: 'left' | 'right' | 'both';
  target_rom?: number;            // Target range of motion in degrees
  // NASM corrective specific
  nasm_phase?: 'inhibit' | 'lengthen' | 'activate' | 'integrate';
  movement_dysfunction?: string;
  // Breathing
  breath_count?: number;
  inhale_seconds?: number;
  exhale_seconds?: number;
  breath_hold_seconds?: number;
  // Corrective notes
  cues?: string[];                // Coaching cues
  common_compensations?: string[];
}

// ========== Union Type for All Workout Sets ==========
export type WorkoutSet =
  | ResistanceWorkoutSet
  | CardioWorkoutSet
  | PlyometricWorkoutSet
  | CorrectiveWorkoutSet;

// ========== Type Guards ==========
export function isResistanceSet(set: WorkoutSet): set is ResistanceWorkoutSet {
  return set.type === 'resistance';
}

export function isCardioSet(set: WorkoutSet): set is CardioWorkoutSet {
  return set.type === 'cardio';
}

export function isPlyometricSet(set: WorkoutSet): set is PlyometricWorkoutSet {
  return set.type === 'plyometric';
}

export function isCorrectiveSet(set: WorkoutSet): set is CorrectiveWorkoutSet {
  return set.type === 'corrective';
}

// ========== Workout Day Structure ==========
export interface WorkoutDay {
  id: string;
  day_number: number;
  name?: string;                  // e.g., "Push Day", "روز سینه و سرشانه"
  focus?: MuscleGroup[];          // Primary muscles targeted
  warmup: WorkoutSet[];           // Warm-up exercises
  main_workout: WorkoutSet[];     // Main workout
  cooldown: WorkoutSet[];         // Cool-down exercises
  total_volume?: number;          // Calculated total sets
  estimated_duration_minutes?: number;
  notes?: string;
}

// ========== Workout Program Structure ==========
export interface WorkoutProgram {
  id: string;
  name: string;
  description?: string;
  coach_id: string;
  client_id: string;
  // Program details
  goal: ProgramGoal;
  level: DifficultyLevel;
  days_per_week: number;
  duration_weeks?: number;
  phase?: TrainingPhase;
  // Workout days
  days: Record<number, WorkoutDay>;  // day_number -> WorkoutDay
  // Metadata
  created_at: string;
  updated_at: string;
  is_template?: boolean;
  tags?: string[];
}

// ========== Program Goals ==========
export type ProgramGoal =
  | 'hypertrophy'         // حجم عضلانی
  | 'strength'            // قدرت
  | 'power'               // توان
  | 'endurance'           // استقامت
  | 'fat_loss'            // کاهش چربی
  | 'recomposition'       // ری‌کامپ
  | 'athletic_performance' // عملکرد ورزشی
  | 'rehabilitation'      // توانبخشی
  | 'general_fitness'     // آمادگی عمومی
  | 'sport_specific';     // ورزش خاص

export const PROGRAM_GOAL_INFO: Record<ProgramGoal, { name: string; description: string }> = {
  hypertrophy: { name: 'حجم عضلانی', description: 'افزایش سایز عضلات' },
  strength: { name: 'قدرت', description: 'افزایش قدرت حداکثری' },
  power: { name: 'توان', description: 'ترکیب قدرت و سرعت' },
  endurance: { name: 'استقامت عضلانی', description: 'افزایش تحمل عضلات' },
  fat_loss: { name: 'کاهش چربی', description: 'کاهش درصد چربی بدن' },
  recomposition: { name: 'ری‌کامپ', description: 'کاهش چربی و افزایش عضله همزمان' },
  athletic_performance: { name: 'عملکرد ورزشی', description: 'بهبود عملکرد آتلتیک' },
  rehabilitation: { name: 'توانبخشی', description: 'بازگشت از آسیب‌دیدگی' },
  general_fitness: { name: 'آمادگی عمومی', description: 'تناسب اندام کلی' },
  sport_specific: { name: 'ورزش خاص', description: 'آمادگی برای ورزش خاص' },
};

// ========== Training Phases (Periodization) ==========
export type TrainingPhase =
  | 'anatomical_adaptation' // سازگاری اولیه
  | 'hypertrophy'          // فاز حجم
  | 'strength'             // فاز قدرت
  | 'power'                // فاز توان
  | 'peaking'              // فاز اوج
  | 'deload'               // فاز استراحت فعال
  | 'maintenance';         // فاز نگهداری

export const TRAINING_PHASE_INFO: Record<TrainingPhase, { name: string; description: string; weeks: string }> = {
  anatomical_adaptation: { name: 'سازگاری اولیه', description: 'آماده‌سازی بدن برای تمرین', weeks: '۲-۴ هفته' },
  hypertrophy: { name: 'فاز حجم', description: 'تمرکز بر رشد عضلانی', weeks: '۴-۶ هفته' },
  strength: { name: 'فاز قدرت', description: 'افزایش قدرت حداکثری', weeks: '۳-۵ هفته' },
  power: { name: 'فاز توان', description: 'تبدیل قدرت به سرعت', weeks: '۲-۴ هفته' },
  peaking: { name: 'فاز اوج', description: 'رسیدن به عملکرد حداکثر', weeks: '۱-۲ هفته' },
  deload: { name: 'دیلود', description: 'ریکاوری و استراحت فعال', weeks: '۱ هفته' },
  maintenance: { name: 'نگهداری', description: 'حفظ سطح فعلی', weeks: 'متغیر' },
};

// ========== Workout Logging ==========
export interface WorkoutLog {
  id: string;
  workout_day_id: string;
  client_id: string;
  date: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  // Performance
  sets_completed: WorkoutSetLog[];
  total_volume_kg?: number;
  // Subjective measures
  overall_rpe?: RPE;
  energy_level?: 1 | 2 | 3 | 4 | 5;
  mood?: 1 | 2 | 3 | 4 | 5;
  sleep_quality?: 1 | 2 | 3 | 4 | 5;
  // Notes
  notes?: string;
  coach_feedback?: string;
}

export interface WorkoutSetLog {
  set_id: string;
  set_number: number;
  // Actual performance
  actual_reps?: number;
  actual_weight?: number;
  actual_rpe?: RPE;
  actual_duration_seconds?: number;
  // Completion
  completed: boolean;
  skipped_reason?: string;
  notes?: string;
}

// ========== Utility Functions ==========

// Generate unique ID
export function generateWorkoutSetId(): string {
  return `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create default resistance set
export function createDefaultResistanceSet(partial?: Partial<ResistanceWorkoutSet>): ResistanceWorkoutSet {
  return {
    id: generateWorkoutSetId(),
    type: 'resistance',
    order_index: 0,
    exercise_name: '',
    target_muscle: 'chest',
    training_system: 'straight_set',
    sets: 3,
    reps: '10',
    rest_seconds: 90,
    ...partial,
  };
}

// Create default cardio set
export function createDefaultCardioSet(partial?: Partial<CardioWorkoutSet>): CardioWorkoutSet {
  return {
    id: generateWorkoutSetId(),
    type: 'cardio',
    order_index: 0,
    exercise_name: '',
    target_muscle: 'full_body',
    cardio_method: 'liss',
    duration_minutes: 30,
    target_heart_rate_zone: 2,
    ...partial,
  };
}

// Create default plyometric set
export function createDefaultPlyometricSet(partial?: Partial<PlyometricWorkoutSet>): PlyometricWorkoutSet {
  return {
    id: generateWorkoutSetId(),
    type: 'plyometric',
    order_index: 0,
    exercise_name: '',
    target_muscle: 'quadriceps',
    sets: 3,
    contacts: 10,
    intensity: 'moderate',
    rest_seconds: 120,
    ...partial,
  };
}

// Create default corrective set
export function createDefaultCorrectiveSet(partial?: Partial<CorrectiveWorkoutSet>): CorrectiveWorkoutSet {
  return {
    id: generateWorkoutSetId(),
    type: 'corrective',
    order_index: 0,
    exercise_name: '',
    target_muscle: 'hip_flexors',
    corrective_type: 'foam_rolling',
    hold_seconds: 30,
    ...partial,
  };
}

// Calculate estimated workout duration
export function calculateEstimatedDuration(sets: WorkoutSet[]): number {
  let totalSeconds = 0;

  for (const set of sets) {
    switch (set.type) {
      case 'resistance': {
        // Average 30 seconds per set + rest
        const setTime = set.sets * 30;
        const restTime = (set.sets - 1) * set.rest_seconds;
        totalSeconds += setTime + restTime;
        break;
      }
      case 'cardio': {
        totalSeconds += set.duration_minutes * 60;
        break;
      }
      case 'plyometric': {
        // Average 20 seconds per set + rest
        const setTime = set.sets * 20;
        const restTime = (set.sets - 1) * set.rest_seconds;
        totalSeconds += setTime + restTime;
        break;
      }
      case 'corrective': {
        if (set.duration_seconds) {
          totalSeconds += set.duration_seconds;
        } else if (set.hold_seconds && set.sets) {
          totalSeconds += set.hold_seconds * set.sets;
        } else {
          totalSeconds += 60; // Default 1 minute
        }
        break;
      }
    }
  }

  return Math.ceil(totalSeconds / 60);
}

// Calculate total volume (for resistance only)
export function calculateTotalVolume(sets: ResistanceWorkoutSet[]): number {
  return sets.reduce((total, set) => {
    const reps = parseInt(set.reps) || 0;
    const weight = set.weight || 0;
    return total + (set.sets * reps * weight);
  }, 0);
}

// Export all types
export type {
  BaseExercise,
  BaseWorkoutSet,
  ResistanceWorkoutSet,
  CardioWorkoutSet,
  PlyometricWorkoutSet,
  CorrectiveWorkoutSet,
  WorkoutDay,
  WorkoutProgram,
  WorkoutLog,
  WorkoutSetLog,
  TempoPattern,
  HeartRateZoneInfo,
};
