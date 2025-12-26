/**
 * ULTIMATE SUPPLEMENT SYSTEM - TYPE DEFINITIONS
 * Evidence-based supplement database with dosing protocols
 */

// ============================================================================
// CORE ENUMS & TYPES
// ============================================================================

export enum SupplementCategory {
  PROTEIN = 'protein',
  AMINO_ACID = 'amino_acid',
  PRE_WORKOUT = 'pre_workout',
  POST_WORKOUT = 'post_workout',
  CREATINE = 'creatine',
  VITAMIN = 'vitamin',
  MINERAL = 'mineral',
  ADAPTOGEN = 'adaptogen',
  NOOTROPIC = 'nootropic',
  JOINT_SUPPORT = 'joint_support',
  SLEEP_RECOVERY = 'sleep_recovery',
  FAT_BURNER = 'fat_burner',
  HORMONE_SUPPORT = 'hormone_support',
  DIGESTIVE = 'digestive',
  GENERAL_HEALTH = 'general_health'
}

export enum SupplementTiming {
  MORNING = 'morning',
  PRE_WORKOUT = 'pre_workout', // 30-45 min before
  INTRA_WORKOUT = 'intra_workout',
  POST_WORKOUT = 'post_workout', // Within 2 hours
  WITH_MEALS = 'with_meals',
  BETWEEN_MEALS = 'between_meals',
  BEFORE_BED = 'before_bed',
  ANYTIME = 'anytime'
}

export enum EvidenceLevel {
  STRONG = 'strong', // Multiple high-quality RCTs
  MODERATE = 'moderate', // Some RCTs, mixed results
  PRELIMINARY = 'preliminary', // Limited studies
  INSUFFICIENT = 'insufficient', // Anecdotal or poor quality
  THEORETICAL = 'theoretical' // Mechanistic basis only
}

export enum SupplementForm {
  POWDER = 'powder',
  CAPSULE = 'capsule',
  TABLET = 'tablet',
  LIQUID = 'liquid',
  SOFTGEL = 'softgel',
  GUMMY = 'gummy',
  SUBLINGUAL = 'sublingual'
}

// ============================================================================
// DOSING PROTOCOLS
// ============================================================================

export interface DosingProtocol {
  standardDose: number; // in mg, g, or IU
  unit: 'mg' | 'g' | 'mcg' | 'IU' | 'serving';
  frequencyPerDay: number;
  timing: SupplementTiming[];
  
  // Advanced protocols
  loadingPhase?: {
    dose: number;
    duration: number; // days
  };
  cyclingProtocol?: {
    onPeriod: number; // days
    offPeriod: number; // days
  };
  
  // Bodyweight-based dosing
  dosePerKg?: number; // mg per kg bodyweight
  maxDose?: number; // upper safety limit
  minDose?: number; // minimum effective dose
  
  // Special instructions
  withFood?: boolean;
  withWater?: number; // ml
  avoidWith?: string[]; // Foods/drinks to avoid
  
  notes?: string;
}

// ============================================================================
// SCIENTIFIC DATA
// ============================================================================

export interface ScientificEvidence {
  primaryBenefits: string[];
  secondaryBenefits: string[];
  mechanisms: string[]; // How it works
  evidenceLevel: EvidenceLevel;
  studyReferences?: string[]; // PubMed IDs or DOIs
  metaAnalysisFindings?: string;
}

export interface SafetyProfile {
  sideEffects: string[];
  contraindications: string[];
  interactions: {
    supplement: string;
    effect: 'synergy' | 'antagonism' | 'caution';
    description: string;
  }[];
  pregnancySafe?: boolean;
  breastfeedingSafe?: boolean;
  ageRestrictions?: string;
  medicalConditionWarnings?: string[];
}

// ============================================================================
// SUPPLEMENT DEFINITION
// ============================================================================

export interface Supplement {
  id: string;
  name: string;
  commonNames: string[]; // Alternative names
  category: SupplementCategory;
  
  // Dosing
  dosing: DosingProtocol;
  forms: SupplementForm[];
  
  // Scientific backing
  evidence: ScientificEvidence;
  safety: SafetyProfile;
  
  // Performance & health goals
  goals: SupplementGoal[];
  
  // Synergies
  stacksWith: string[]; // IDs of complementary supplements
  
  // Practical info
  costEffectiveness: 'very_high' | 'high' | 'moderate' | 'low';
  tasteRating?: number; // 1-5 for powders
  mixability?: 'excellent' | 'good' | 'fair' | 'poor';
  
  // Metadata
  tags: string[];
  imageUrl?: string;
  affiliateLink?: string;
  
  // Popularity
  popularityScore?: number;
  scientificRating?: number; // Our internal evidence-based rating
}

// ============================================================================
// SUPPLEMENT GOALS & STACKS
// ============================================================================

export enum SupplementGoal {
  MUSCLE_GROWTH = 'muscle_growth',
  STRENGTH_GAIN = 'strength_gain',
  ENDURANCE = 'endurance',
  POWER_OUTPUT = 'power_output',
  RECOVERY = 'recovery',
  FAT_LOSS = 'fat_loss',
  FOCUS_ENERGY = 'focus_energy',
  SLEEP_QUALITY = 'sleep_quality',
  JOINT_HEALTH = 'joint_health',
  IMMUNE_SUPPORT = 'immune_support',
  HORMONE_OPTIMIZATION = 'hormone_optimization',
  CARDIOVASCULAR_HEALTH = 'cardiovascular_health',
  LONGEVITY = 'longevity',
  STRESS_MANAGEMENT = 'stress_management'
}

export interface SupplementStack {
  id: string;
  name: string;
  description: string;
  goal: SupplementGoal;
  supplements: {
    supplementId: string;
    supplement: Supplement;
    priority: 'essential' | 'recommended' | 'optional';
    reasoning: string;
  }[];
  totalMonthlyCost?: number;
  evidenceScore: number;
}

// ============================================================================
// USER SUPPLEMENT PLAN
// ============================================================================

export interface UserSupplement {
  supplementId: string;
  supplement: Supplement;
  dosing: DosingProtocol; // Can be customized from default
  startDate: Date;
  endDate?: Date; // For cycling
  active: boolean;
  reminderTimes?: string[]; // "08:00", "16:00"
  notes?: string;
}

export interface SupplementPlan {
  id: string;
  userId: string;
  name: string;
  goal: SupplementGoal[];
  supplements: UserSupplement[];
  totalMonthlyCost: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// INTERACTIONS & CHECKER
// ============================================================================

export interface SupplementInteraction {
  supplement1: string; // ID
  supplement2: string; // ID
  interactionType: 'synergy' | 'antagonism' | 'caution' | 'dangerous';
  description: string;
  recommendation: string;
  evidenceLevel: EvidenceLevel;
}

export interface InteractionCheck {
  safe: boolean;
  warnings: string[];
  synergies: string[];
  recommendations: string[];
}

// ============================================================================
// FILTER & SEARCH TYPES
// ============================================================================

export interface SupplementFilters {
  categories?: SupplementCategory[];
  goals?: SupplementGoal[];
  evidenceLevel?: EvidenceLevel[];
  maxCostPerMonth?: number;
  forms?: SupplementForm[];
  timing?: SupplementTiming[];
  searchQuery?: string;
}

// ============================================================================
// COMMON SUPPLEMENT COMPOUNDS (for type safety)
// ============================================================================

export enum CommonSupplements {
  // Creatine
  CREATINE_MONOHYDRATE = 'creatine_monohydrate',
  CREATINE_HCL = 'creatine_hcl',
  
  // Protein
  WHEY_ISOLATE = 'whey_isolate',
  WHEY_CONCENTRATE = 'whey_concentrate',
  CASEIN = 'casein',
  PLANT_PROTEIN = 'plant_protein',
  
  // Amino Acids
  BETA_ALANINE = 'beta_alanine',
  CITRULLINE_MALATE = 'citrulline_malate',
  LEUCINE = 'leucine',
  EAA = 'eaa',
  BCAA = 'bcaa',
  
  // Pre-workout compounds
  CAFFEINE = 'caffeine',
  THEANINE = 'theanine',
  TYROSINE = 'tyrosine',
  
  // Vitamins
  VITAMIN_D3 = 'vitamin_d3',
  VITAMIN_B_COMPLEX = 'vitamin_b_complex',
  MULTIVITAMIN = 'multivitamin',
  
  // Minerals
  MAGNESIUM = 'magnesium',
  ZINC = 'zinc',
  IRON = 'iron',
  
  // Joint support
  GLUCOSAMINE = 'glucosamine',
  CHONDROITIN = 'chondroitin',
  MSM = 'msm',
  COLLAGEN = 'collagen',
  
  // Omega fatty acids
  FISH_OIL = 'fish_oil',
  OMEGA_3 = 'omega_3',
  
  // Recovery
  ZMA = 'zma',
  MELATONIN = 'melatonin',
  ASHWAGANDHA = 'ashwagandha',
  
  // Performance
  CITRULLINE = 'citrulline',
  BETAINE = 'betaine',
  SODIUM_BICARBONATE = 'sodium_bicarbonate'
}
