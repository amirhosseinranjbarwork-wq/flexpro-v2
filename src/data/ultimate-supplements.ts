/**
 * ULTIMATE SUPPLEMENT DATABASE
 * Evidence-based supplement database with precise dosing protocols
 */

import {
  Supplement,
  SupplementCategory,
  SupplementTiming,
  EvidenceLevel,
  SupplementForm,
  SupplementGoal,
  CommonSupplements
} from '../types/ultimate-supplements';

// ============================================================================
// CREATINE SUPPLEMENTS
// ============================================================================

const creatineSupplements: Supplement[] = [
  {
    id: CommonSupplements.CREATINE_MONOHYDRATE,
    name: 'Creatine Monohydrate',
    commonNames: ['Creatine', 'CM'],
    category: SupplementCategory.CREATINE,
    dosing: {
      standardDose: 5,
      unit: 'g',
      frequencyPerDay: 1,
      timing: [SupplementTiming.ANYTIME],
      loadingPhase: {
        dose: 20,
        duration: 5
      },
      withFood: false,
      withWater: 500,
      notes: 'Loading phase is optional. Standard 5g/day is equally effective over time.'
    },
    forms: [SupplementForm.POWDER, SupplementForm.CAPSULE],
    evidence: {
      primaryBenefits: [
        'Increases muscle creatine phosphate stores',
        'Enhances strength and power output (3-5% improvement)',
        'Supports lean muscle mass gains',
        'Improves high-intensity exercise performance'
      ],
      secondaryBenefits: [
        'May support cognitive function',
        'Neuroprotective properties',
        'Potential benefits for depression',
        'Reduces fatigue'
      ],
      mechanisms: [
        'Increases phosphocreatine stores for ATP regeneration',
        'Cellular hydration (pulls water into muscle cells)',
        'Upregulates satellite cell activity',
        'May reduce protein breakdown'
      ],
      evidenceLevel: EvidenceLevel.STRONG,
      metaAnalysisFindings: 'Over 500+ studies confirm efficacy. Meta-analyses show consistent ~5% strength gains and ~1-2kg lean mass increase over 4-12 weeks.'
    },
    safety: {
      sideEffects: ['Water retention (not fat)', 'Mild GI distress in some individuals'],
      contraindications: ['Kidney disease (consult physician)'],
      interactions: [
        {
          supplement: 'Caffeine',
          effect: 'caution',
          description: 'Some early research suggested antagonism, but recent studies show no interaction'
        }
      ],
      pregnancySafe: false,
      breastfeedingSafe: false,
      medicalConditionWarnings: ['Pre-existing kidney conditions should consult doctor']
    },
    goals: [
      SupplementGoal.STRENGTH_GAIN,
      SupplementGoal.MUSCLE_GROWTH,
      SupplementGoal.POWER_OUTPUT,
      SupplementGoal.ENDURANCE
    ],
    stacksWith: ['beta_alanine', 'protein', 'leucine'],
    costEffectiveness: 'very_high',
    tasteRating: 3,
    mixability: 'good',
    tags: ['most_researched', 'highly_effective', 'affordable', 'essential'],
    popularityScore: 98,
    scientificRating: 10
  },
  {
    id: CommonSupplements.CREATINE_HCL,
    name: 'Creatine HCl',
    commonNames: ['Creatine Hydrochloride', 'Con-Cret'],
    category: SupplementCategory.CREATINE,
    dosing: {
      standardDose: 1.5,
      unit: 'g',
      frequencyPerDay: 1,
      timing: [SupplementTiming.PRE_WORKOUT],
      withFood: false,
      withWater: 250,
      notes: 'Smaller dose than monohydrate due to higher bioavailability claims'
    },
    forms: [SupplementForm.POWDER, SupplementForm.CAPSULE],
    evidence: {
      primaryBenefits: [
        'Similar benefits to monohydrate',
        'May cause less water retention',
        'Better solubility'
      ],
      secondaryBenefits: ['Potentially less GI distress'],
      mechanisms: ['Same as creatine monohydrate'],
      evidenceLevel: EvidenceLevel.MODERATE,
      metaAnalysisFindings: 'Limited head-to-head research vs monohydrate. No clear superiority despite marketing claims.'
    },
    safety: {
      sideEffects: ['Minimal'],
      contraindications: ['Kidney disease'],
      interactions: [],
      pregnancySafe: false,
      breastfeedingSafe: false
    },
    goals: [
      SupplementGoal.STRENGTH_GAIN,
      SupplementGoal.MUSCLE_GROWTH,
      SupplementGoal.POWER_OUTPUT
    ],
    stacksWith: ['beta_alanine', 'citrulline'],
    costEffectiveness: 'moderate',
    tasteRating: 4,
    mixability: 'excellent',
    tags: ['alternative_form', 'less_bloat', 'more_expensive'],
    popularityScore: 65,
    scientificRating: 7
  }
];

// ============================================================================
// PROTEIN SUPPLEMENTS
// ============================================================================

const proteinSupplements: Supplement[] = [
  {
    id: CommonSupplements.WHEY_ISOLATE,
    name: 'Whey Protein Isolate',
    commonNames: ['WPI', 'Iso'],
    category: SupplementCategory.PROTEIN,
    dosing: {
      standardDose: 25,
      unit: 'g',
      frequencyPerDay: 2,
      timing: [SupplementTiming.POST_WORKOUT, SupplementTiming.BETWEEN_MEALS],
      dosePerKg: 0.25,
      withFood: false,
      withWater: 300,
      notes: 'Dose depends on total daily protein needs. 0.25g/kg per serving optimal for MPS.'
    },
    forms: [SupplementForm.POWDER],
    evidence: {
      primaryBenefits: [
        'Rapidly elevates muscle protein synthesis',
        'Highest leucine content (~11% by weight)',
        'Supports muscle recovery and growth',
        'Convenient protein source'
      ],
      secondaryBenefits: [
        'Supports immune function',
        'May aid in fat loss while preserving muscle',
        'Convenient for meeting protein goals'
      ],
      mechanisms: [
        'Provides essential amino acids for MPS',
        'High leucine content triggers mTOR pathway',
        'Fast digestion delivers amino acids quickly'
      ],
      evidenceLevel: EvidenceLevel.STRONG,
      metaAnalysisFindings: 'Meta-analyses confirm protein supplementation enhances muscle mass and strength gains when combined with resistance training.'
    },
    safety: {
      sideEffects: ['GI discomfort in lactose-intolerant individuals (minimal in isolate)', 'Acne in some individuals'],
      contraindications: ['Severe dairy allergy'],
      interactions: [],
      pregnancySafe: true,
      breastfeedingSafe: true
    },
    goals: [
      SupplementGoal.MUSCLE_GROWTH,
      SupplementGoal.RECOVERY,
      SupplementGoal.STRENGTH_GAIN
    ],
    stacksWith: ['creatine_monohydrate', 'leucine', 'carbohydrates'],
    costEffectiveness: 'high',
    tasteRating: 4,
    mixability: 'excellent',
    tags: ['fast_digesting', 'high_leucine', 'post_workout', 'convenient'],
    popularityScore: 95,
    scientificRating: 9
  },
  {
    id: CommonSupplements.CASEIN,
    name: 'Micellar Casein',
    commonNames: ['Casein', 'Night Protein'],
    category: SupplementCategory.PROTEIN,
    dosing: {
      standardDose: 30,
      unit: 'g',
      frequencyPerDay: 1,
      timing: [SupplementTiming.BEFORE_BED],
      withFood: false,
      withWater: 350,
      notes: 'Slow-digesting protein ideal before bed to prevent overnight catabolism'
    },
    forms: [SupplementForm.POWDER],
    evidence: {
      primaryBenefits: [
        'Slow, sustained amino acid release (up to 7 hours)',
        'Anti-catabolic effects during sleep',
        'High satiety factor',
        'Supports muscle protein synthesis overnight'
      ],
      secondaryBenefits: [
        'May be superior for fat loss diets (increased satiety)',
        'Supports dental health (casein peptides)'
      ],
      mechanisms: [
        'Forms gel in stomach, slowing digestion',
        'Provides steady amino acid supply',
        'Prevents muscle protein breakdown during fasted state'
      ],
      evidenceLevel: EvidenceLevel.STRONG,
      metaAnalysisFindings: 'Studies show casein before bed increases overnight MPS and may be superior to whey for this purpose.'
    },
    safety: {
      sideEffects: ['Bloating if consumed too close to bed', 'Lactose intolerance issues'],
      contraindications: ['Dairy allergy'],
      interactions: [],
      pregnancySafe: true,
      breastfeedingSafe: true
    },
    goals: [
      SupplementGoal.MUSCLE_GROWTH,
      SupplementGoal.RECOVERY,
      SupplementGoal.FAT_LOSS
    ],
    stacksWith: ['zma', 'magnesium', 'melatonin'],
    costEffectiveness: 'high',
    tasteRating: 3,
    mixability: 'fair',
    tags: ['slow_digesting', 'before_bed', 'anti_catabolic', 'satiety'],
    popularityScore: 75,
    scientificRating: 8
  }
];

// ============================================================================
// AMINO ACID SUPPLEMENTS
// ============================================================================

const aminoAcidSupplements: Supplement[] = [
  {
    id: CommonSupplements.BETA_ALANINE,
    name: 'Beta-Alanine',
    commonNames: ['BA', 'CarnoSyn'],
    category: SupplementCategory.AMINO_ACID,
    dosing: {
      standardDose: 3.2,
      unit: 'g',
      frequencyPerDay: 2,
      timing: [SupplementTiming.ANYTIME],
      withFood: true,
      notes: 'Split into 2 doses to minimize paresthesia (tingling). Timing irrelevant - works via muscle saturation.'
    },
    forms: [SupplementForm.POWDER, SupplementForm.CAPSULE, SupplementForm.TABLET],
    evidence: {
      primaryBenefits: [
        'Increases muscle carnosine levels (up to 80%)',
        'Buffers lactic acid during high-intensity exercise',
        'Improves performance in 60-240 second range exercise',
        'May increase training volume'
      ],
      secondaryBenefits: [
        'Potential anti-aging effects',
        'May support cognitive function in elderly'
      ],
      mechanisms: [
        'Combines with histidine to form carnosine in muscle',
        'Carnosine buffers hydrogen ions (delays fatigue)',
        'Most effective in Type II muscle fibers'
      ],
      evidenceLevel: EvidenceLevel.STRONG,
      metaAnalysisFindings: 'Meta-analyses show 2.85% improvement in exercise lasting 60-240 seconds. Effects after 4+ weeks of supplementation.'
    },
    safety: {
      sideEffects: ['Paresthesia (harmless tingling sensation)', 'Flushing in some individuals'],
      contraindications: [],
      interactions: [
        {
          supplement: 'creatine_monohydrate',
          effect: 'synergy',
          description: 'Synergistic effects on lean mass and body composition'
        }
      ],
      pregnancySafe: false,
      breastfeedingSafe: false
    },
    goals: [
      SupplementGoal.ENDURANCE,
      SupplementGoal.STRENGTH_GAIN,
      SupplementGoal.MUSCLE_GROWTH
    ],
    stacksWith: ['creatine_monohydrate', 'sodium_bicarbonate', 'citrulline'],
    costEffectiveness: 'high',
    tasteRating: 2,
    mixability: 'good',
    tags: ['endurance', 'buffering', 'high_intensity', 'proven'],
    popularityScore: 80,
    scientificRating: 9
  },
  {
    id: CommonSupplements.CITRULLINE_MALATE,
    name: 'Citrulline Malate',
    commonNames: ['CM', 'L-Citrulline'],
    category: SupplementCategory.PRE_WORKOUT,
    dosing: {
      standardDose: 8,
      unit: 'g',
      frequencyPerDay: 1,
      timing: [SupplementTiming.PRE_WORKOUT],
      withFood: false,
      withWater: 400,
      notes: '8g citrulline malate (2:1 ratio) = ~6g pure citrulline. Take 30-60 min pre-workout.'
    },
    forms: [SupplementForm.POWDER],
    evidence: {
      primaryBenefits: [
        'Increases nitric oxide production',
        'Enhances blood flow and "pump"',
        'Reduces fatigue during exercise',
        'May increase training volume by ~10%'
      ],
      secondaryBenefits: [
        'Supports ammonia clearance',
        'May reduce muscle soreness',
        'Potential cardiovascular benefits'
      ],
      mechanisms: [
        'Converts to arginine (better than direct arginine supplementation)',
        'Increases NO synthesis -> vasodilation',
        'Supports ATP production via malate',
        'Buffers ammonia (reduces fatigue)'
      ],
      evidenceLevel: EvidenceLevel.MODERATE,
      metaAnalysisFindings: 'Studies show 1-2 additional reps per set and reduced DOMS. Effects most pronounced in trained individuals.'
    },
    safety: {
      sideEffects: ['GI distress at high doses', 'Nausea if taken on empty stomach'],
      contraindications: [],
      interactions: [],
      pregnancySafe: false,
      breastfeedingSafe: false
    },
    goals: [
      SupplementGoal.ENDURANCE,
      SupplementGoal.POWER_OUTPUT,
      SupplementGoal.RECOVERY
    ],
    stacksWith: ['beta_alanine', 'caffeine', 'creatine_monohydrate'],
    costEffectiveness: 'moderate',
    tasteRating: 2,
    mixability: 'fair',
    tags: ['nitric_oxide', 'pump', 'endurance', 'pre_workout'],
    popularityScore: 85,
    scientificRating: 7
  },
  {
    id: CommonSupplements.LEUCINE,
    name: 'L-Leucine',
    commonNames: ['Leucine'],
    category: SupplementCategory.AMINO_ACID,
    dosing: {
      standardDose: 3,
      unit: 'g',
      frequencyPerDay: 3,
      timing: [SupplementTiming.WITH_MEALS, SupplementTiming.POST_WORKOUT],
      dosePerKg: 0.05,
      notes: 'Add to low-protein meals to reach ~2.5-3g leucine threshold for optimal MPS'
    },
    forms: [SupplementForm.POWDER, SupplementForm.CAPSULE],
    evidence: {
      primaryBenefits: [
        'Most potent amino acid for triggering MPS',
        'Activates mTOR pathway',
        'Preserves muscle during caloric deficit',
        'May improve body composition in elderly'
      ],
      secondaryBenefits: [
        'May help regulate blood sugar',
        'Supports wound healing'
      ],
      mechanisms: [
        'Directly activates mTOR signaling',
        'Threshold effect: ~2.5-3g needed per meal',
        'Stimulates protein synthesis independent of other aminos'
      ],
      evidenceLevel: EvidenceLevel.STRONG,
      metaAnalysisFindings: 'Leucine is the "trigger" for MPS. Adding leucine to low-protein meals increases MPS similar to higher protein dose.'
    },
    safety: {
      sideEffects: ['May reduce serotonin synthesis (competes for transport)', 'GI issues at very high doses'],
      contraindications: ['Maple syrup urine disease'],
      interactions: [],
      pregnancySafe: true,
      breastfeedingSafe: true
    },
    goals: [
      SupplementGoal.MUSCLE_GROWTH,
      SupplementGoal.RECOVERY,
      SupplementGoal.FAT_LOSS
    ],
    stacksWith: ['whey_isolate', 'creatine_monohydrate'],
    costEffectiveness: 'moderate',
    tasteRating: 1,
    mixability: 'good',
    tags: ['mtor_activator', 'muscle_building', 'leucine_threshold', 'science_backed'],
    popularityScore: 70,
    scientificRating: 9
  },
  {
    id: CommonSupplements.EAA,
    name: 'Essential Amino Acids (EAA)',
    commonNames: ['EAAs', 'Complete Aminos'],
    category: SupplementCategory.AMINO_ACID,
    dosing: {
      standardDose: 10,
      unit: 'g',
      frequencyPerDay: 2,
      timing: [SupplementTiming.INTRA_WORKOUT, SupplementTiming.BETWEEN_MEALS],
      notes: 'Useful during fasted training or as protein supplement alternative'
    },
    forms: [SupplementForm.POWDER, SupplementForm.CAPSULE],
    evidence: {
      primaryBenefits: [
        'Stimulates muscle protein synthesis',
        'Zero calorie protein alternative (technically ~40 cal)',
        'Prevents muscle breakdown during fasted training',
        'Faster absorption than whole protein'
      ],
      secondaryBenefits: [
        'No digestion required',
        'May reduce training-induced soreness'
      ],
      mechanisms: [
        'Provides all 9 essential amino acids',
        'Bypasses digestion (absorbed within 20 min)',
        'Stimulates MPS without insulin spike'
      ],
      evidenceLevel: EvidenceLevel.STRONG,
      metaAnalysisFindings: 'EAAs effectively stimulate MPS. May be superior to BCAAs due to complete amino profile.'
    },
    safety: {
      sideEffects: ['None significant', 'GI distress if consumed too quickly'],
      contraindications: [],
      interactions: [],
      pregnancySafe: true,
      breastfeedingSafe: true
    },
    goals: [
      SupplementGoal.MUSCLE_GROWTH,
      SupplementGoal.RECOVERY,
      SupplementGoal.FAT_LOSS
    ],
    stacksWith: ['citrulline', 'beta_alanine', 'electrolytes'],
    costEffectiveness: 'moderate',
    tasteRating: 4,
    mixability: 'excellent',
    tags: ['intra_workout', 'fasted_training', 'muscle_preservation', 'fast_absorbing'],
    popularityScore: 78,
    scientificRating: 8
  }
];

// ============================================================================
// VITAMINS & MINERALS
// ============================================================================

const vitaminSupplements: Supplement[] = [
  {
    id: CommonSupplements.VITAMIN_D3,
    name: 'Vitamin D3 (Cholecalciferol)',
    commonNames: ['Vitamin D', 'D3', 'Sunshine Vitamin'],
    category: SupplementCategory.VITAMIN,
    dosing: {
      standardDose: 2000,
      unit: 'IU',
      frequencyPerDay: 1,
      timing: [SupplementTiming.WITH_MEALS],
      maxDose: 10000,
      withFood: true,
      notes: 'Fat-soluble vitamin - take with meal containing fats. Dose depends on blood levels (aim for 40-60 ng/mL).'
    },
    forms: [SupplementForm.SOFTGEL, SupplementForm.CAPSULE, SupplementForm.LIQUID],
    evidence: {
      primaryBenefits: [
        'Supports bone health and calcium absorption',
        'Immune system function',
        'May support testosterone levels',
        'Mood regulation (especially in deficiency)'
      ],
      secondaryBenefits: [
        'May improve muscle strength',
        'Cardiovascular health',
        'May reduce inflammation',
        'Supports athletic performance'
      ],
      mechanisms: [
        'Acts as hormone regulating 200+ genes',
        'Enhances calcium/phosphorus absorption',
        'Modulates immune response',
        'Influences testosterone production'
      ],
      evidenceLevel: EvidenceLevel.STRONG,
      metaAnalysisFindings: 'Widespread deficiency (<30 ng/mL) in athletes. Supplementation improves levels and may enhance performance in deficient individuals.'
    },
    safety: {
      sideEffects: ['Rare at normal doses', 'Hypercalcemia at very high chronic doses'],
      contraindications: ['Hypercalcemia', 'Hyperparathyroidism'],
      interactions: [
        {
          supplement: 'Calcium',
          effect: 'synergy',
          description: 'Vitamin D enhances calcium absorption'
        },
        {
          supplement: 'Magnesium',
          effect: 'synergy',
          description: 'Magnesium required for vitamin D activation'
        }
      ],
      pregnancySafe: true,
      breastfeedingSafe: true
    },
    goals: [
      SupplementGoal.HORMONE_OPTIMIZATION,
      SupplementGoal.IMMUNE_SUPPORT,
      SupplementGoal.STRENGTH_GAIN,
      SupplementGoal.LONGEVITY
    ],
    stacksWith: ['magnesium', 'calcium', 'vitamin_k2', 'fish_oil'],
    costEffectiveness: 'very_high',
    mixability: undefined,
    tags: ['essential', 'deficiency_common', 'health', 'testosterone'],
    popularityScore: 90,
    scientificRating: 10
  },
  {
    id: CommonSupplements.MAGNESIUM,
    name: 'Magnesium (Glycinate/Citrate)',
    commonNames: ['Mg', 'Magnesium'],
    category: SupplementCategory.MINERAL,
    dosing: {
      standardDose: 400,
      unit: 'mg',
      frequencyPerDay: 1,
      timing: [SupplementTiming.BEFORE_BED],
      maxDose: 800,
      notes: 'Glycinate for sleep/recovery, citrate for general use. Avoid oxide form (poor absorption).'
    },
    forms: [SupplementForm.CAPSULE, SupplementForm.TABLET, SupplementForm.POWDER],
    evidence: {
      primaryBenefits: [
        'Supports muscle relaxation and recovery',
        'Improves sleep quality',
        'Reduces muscle cramps',
        'Over 300 enzymatic reactions'
      ],
      secondaryBenefits: [
        'May reduce anxiety',
        'Supports cardiovascular health',
        'May improve insulin sensitivity',
        'Supports bone health'
      ],
      mechanisms: [
        'Cofactor in ATP production',
        'NMDA receptor antagonist (calming)',
        'Muscle contraction/relaxation regulation',
        'Vitamin D activation'
      ],
      evidenceLevel: EvidenceLevel.STRONG,
      metaAnalysisFindings: 'Common deficiency in athletes. Supplementation improves sleep, reduces cramps, and may enhance performance.'
    },
    safety: {
      sideEffects: ['Diarrhea at high doses (especially citrate)', 'GI upset'],
      contraindications: ['Kidney disease'],
      interactions: [
        {
          supplement: 'Vitamin D',
          effect: 'synergy',
          description: 'Required for vitamin D activation'
        },
        {
          supplement: 'Calcium',
          effect: 'caution',
          description: 'Competes for absorption - separate timing by 2+ hours'
        }
      ],
      pregnancySafe: true,
      breastfeedingSafe: true
    },
    goals: [
      SupplementGoal.RECOVERY,
      SupplementGoal.SLEEP_QUALITY,
      SupplementGoal.STRESS_MANAGEMENT,
      SupplementGoal.CARDIOVASCULAR_HEALTH
    ],
    stacksWith: ['vitamin_d3', 'zinc', 'melatonin'],
    costEffectiveness: 'very_high',
    mixability: undefined,
    tags: ['recovery', 'sleep', 'deficiency_common', 'essential'],
    popularityScore: 85,
    scientificRating: 9
  },
  {
    id: CommonSupplements.ZMA,
    name: 'ZMA (Zinc, Magnesium, B6)',
    commonNames: ['ZMA'],
    category: SupplementCategory.MINERAL,
    dosing: {
      standardDose: 1,
      unit: 'serving',
      frequencyPerDay: 1,
      timing: [SupplementTiming.BEFORE_BED],
      withFood: false,
      notes: 'Take on empty stomach before bed. Typically contains 30mg zinc, 450mg magnesium, 10mg B6.'
    },
    forms: [SupplementForm.CAPSULE],
    evidence: {
      primaryBenefits: [
        'May support testosterone in deficient individuals',
        'Improves sleep quality',
        'Supports recovery',
        'Addresses common mineral deficiencies in athletes'
      ],
      secondaryBenefits: [
        'May enhance immune function',
        'Vivid dreams reported anecdotally',
        'Supports protein synthesis'
      ],
      mechanisms: [
        'Zinc supports testosterone production and immune function',
        'Magnesium promotes relaxation and sleep',
        'B6 enhances absorption and supports neurotransmitter synthesis'
      ],
      evidenceLevel: EvidenceLevel.MODERATE,
      metaAnalysisFindings: 'Mixed evidence. Benefits likely limited to those deficient in zinc/magnesium. Sleep benefits more consistent.'
    },
    safety: {
      sideEffects: ['Nausea if taken with food', 'Vivid dreams/nightmares in some'],
      contraindications: [],
      interactions: [
        {
          supplement: 'Calcium',
          effect: 'antagonism',
          description: 'Calcium impairs zinc/magnesium absorption'
        }
      ],
      pregnancySafe: false,
      breastfeedingSafe: false
    },
    goals: [
      SupplementGoal.RECOVERY,
      SupplementGoal.SLEEP_QUALITY,
      SupplementGoal.HORMONE_OPTIMIZATION
    ],
    stacksWith: ['vitamin_d3', 'fish_oil'],
    costEffectiveness: 'high',
    mixability: undefined,
    tags: ['sleep', 'recovery', 'testosterone', 'athlete_specific'],
    popularityScore: 75,
    scientificRating: 6
  }
];

// ============================================================================
// PERFORMANCE ENHANCERS
// ============================================================================

const performanceSupplements: Supplement[] = [
  {
    id: CommonSupplements.CAFFEINE,
    name: 'Caffeine Anhydrous',
    commonNames: ['Caffeine', 'Coffee Extract'],
    category: SupplementCategory.PRE_WORKOUT,
    dosing: {
      standardDose: 200,
      unit: 'mg',
      frequencyPerDay: 1,
      timing: [SupplementTiming.PRE_WORKOUT, SupplementTiming.MORNING],
      dosePerKg: 3,
      maxDose: 400,
      notes: 'Effective dose: 3-6mg/kg. Take 30-60 min pre-workout. Avoid within 6 hours of sleep.'
    },
    forms: [SupplementForm.CAPSULE, SupplementForm.TABLET, SupplementForm.POWDER],
    evidence: {
      primaryBenefits: [
        'Increases alertness and focus',
        'Enhances endurance performance (2-4%)',
        'Reduces perceived exertion',
        'May increase strength and power output'
      ],
      secondaryBenefits: [
        'Thermogenic effect (fat oxidation)',
        'Neuroprotective properties',
        'May reduce DOMS',
        'Improves cognitive function'
      ],
      mechanisms: [
        'Adenosine receptor antagonist (prevents fatigue signaling)',
        'Increases catecholamine release',
        'Enhances calcium release in muscles',
        'CNS stimulation'
      ],
      evidenceLevel: EvidenceLevel.STRONG,
      metaAnalysisFindings: 'One of the most effective ergogenic aids. Consistent 2-4% performance improvement across multiple modalities.'
    },
    safety: {
      sideEffects: ['Jitters', 'Anxiety', 'Insomnia', 'Increased heart rate', 'Tolerance with regular use'],
      contraindications: ['Cardiovascular conditions', 'Anxiety disorders', 'Pregnancy'],
      interactions: [
        {
          supplement: 'L-Theanine',
          effect: 'synergy',
          description: 'Theanine reduces jitters while maintaining focus'
        }
      ],
      pregnancySafe: false,
      breastfeedingSafe: false,
      medicalConditionWarnings: ['Heart conditions', 'High blood pressure', 'Anxiety disorders']
    },
    goals: [
      SupplementGoal.FOCUS_ENERGY,
      SupplementGoal.ENDURANCE,
      SupplementGoal.STRENGTH_GAIN,
      SupplementGoal.FAT_LOSS
    ],
    stacksWith: ['theanine', 'citrulline', 'beta_alanine'],
    costEffectiveness: 'very_high',
    tasteRating: 1,
    mixability: 'good',
    tags: ['stimulant', 'proven', 'performance', 'focus'],
    popularityScore: 95,
    scientificRating: 10
  },
  {
    id: CommonSupplements.SODIUM_BICARBONATE,
    name: 'Sodium Bicarbonate',
    commonNames: ['Baking Soda', 'Bicarb'],
    category: SupplementCategory.PRE_WORKOUT,
    dosing: {
      standardDose: 300,
      unit: 'mg',
      frequencyPerDay: 1,
      timing: [SupplementTiming.PRE_WORKOUT],
      dosePerKg: 0.3,
      notes: '0.3g/kg bodyweight. Take 60-90 min pre-workout. Split dose to reduce GI distress.'
    },
    forms: [SupplementForm.POWDER, SupplementForm.CAPSULE],
    evidence: {
      primaryBenefits: [
        'Buffers lactic acid buildup',
        'Improves high-intensity performance (1-10 min duration)',
        'May increase time to exhaustion',
        'Synergistic with beta-alanine'
      ],
      secondaryBenefits: [
        'May improve repeated sprint ability',
        'Potential benefits for intermittent sports'
      ],
      mechanisms: [
        'Increases blood bicarbonate levels',
        'Buffers extracellular hydrogen ions',
        'Allows higher intensity for longer duration'
      ],
      evidenceLevel: EvidenceLevel.MODERATE,
      metaAnalysisFindings: 'Meta-analyses show ~2% performance improvement in 1-10 minute high-intensity efforts.'
    },
    safety: {
      sideEffects: ['GI distress (common)', 'Diarrhea', 'Bloating', 'Nausea'],
      contraindications: ['Sodium-restricted diets', 'Hypertension'],
      interactions: [],
      pregnancySafe: false,
      breastfeedingSafe: false
    },
    goals: [
      SupplementGoal.ENDURANCE,
      SupplementGoal.POWER_OUTPUT
    ],
    stacksWith: ['beta_alanine', 'caffeine'],
    costEffectiveness: 'very_high',
    tasteRating: 1,
    mixability: 'excellent',
    tags: ['buffering', 'high_intensity', 'gi_issues_common', 'effective'],
    popularityScore: 45,
    scientificRating: 7
  }
];

// ============================================================================
// JOINT SUPPORT
// ============================================================================

const jointSupplements: Supplement[] = [
  {
    id: CommonSupplements.COLLAGEN,
    name: 'Collagen Peptides',
    commonNames: ['Collagen', 'Hydrolyzed Collagen'],
    category: SupplementCategory.JOINT_SUPPORT,
    dosing: {
      standardDose: 15,
      unit: 'g',
      frequencyPerDay: 1,
      timing: [SupplementTiming.ANYTIME],
      withFood: false,
      notes: 'Take with vitamin C for enhanced synthesis. Before activity may enhance collagen synthesis.'
    },
    forms: [SupplementForm.POWDER],
    evidence: {
      primaryBenefits: [
        'Supports joint health and cartilage',
        'May reduce joint pain in athletes',
        'Supports tendon and ligament health',
        'Improves skin elasticity'
      ],
      secondaryBenefits: [
        'May support bone health',
        'Hair and nail health',
        'Gut lining support'
      ],
      mechanisms: [
        'Provides glycine, proline, hydroxyproline',
        'Stimulates chondrocyte activity',
        'Supports collagen synthesis in tissues'
      ],
      evidenceLevel: EvidenceLevel.MODERATE,
      metaAnalysisFindings: 'Studies show reduced joint pain and improved functionality in athletes. Effects after 12+ weeks.'
    },
    safety: {
      sideEffects: ['None significant', 'Mild GI upset in some'],
      contraindications: [],
      interactions: [],
      pregnancySafe: true,
      breastfeedingSafe: true
    },
    goals: [
      SupplementGoal.JOINT_HEALTH,
      SupplementGoal.RECOVERY,
      SupplementGoal.LONGEVITY
    ],
    stacksWith: ['vitamin_c', 'glucosamine', 'fish_oil'],
    costEffectiveness: 'moderate',
    tasteRating: 3,
    mixability: 'excellent',
    tags: ['joint_health', 'connective_tissue', 'long_term', 'preventative'],
    popularityScore: 82,
    scientificRating: 7
  }
];

// ============================================================================
// OMEGA-3 FATTY ACIDS
// ============================================================================

const omega3Supplements: Supplement[] = [
  {
    id: CommonSupplements.FISH_OIL,
    name: 'Fish Oil (EPA/DHA)',
    commonNames: ['Omega-3', 'Fish Oil', 'Marine Oil'],
    category: SupplementCategory.GENERAL_HEALTH,
    dosing: {
      standardDose: 2000,
      unit: 'mg',
      frequencyPerDay: 1,
      timing: [SupplementTiming.WITH_MEALS],
      withFood: true,
      notes: 'Look for combined EPA+DHA content of 1-3g daily. Higher EPA for anti-inflammatory.'
    },
    forms: [SupplementForm.SOFTGEL, SupplementForm.LIQUID],
    evidence: {
      primaryBenefits: [
        'Powerful anti-inflammatory effects',
        'Supports cardiovascular health',
        'May reduce DOMS and enhance recovery',
        'Brain and cognitive health'
      ],
      secondaryBenefits: [
        'May support mood and reduce depression',
        'Joint health',
        'May improve insulin sensitivity',
        'Supports eye health'
      ],
      mechanisms: [
        'Incorporates into cell membranes',
        'Produces anti-inflammatory eicosanoids',
        'Reduces pro-inflammatory cytokines',
        'Supports neuron structure and function'
      ],
      evidenceLevel: EvidenceLevel.STRONG,
      metaAnalysisFindings: 'Strong evidence for cardiovascular benefits. Moderate evidence for recovery and DOMS reduction in athletes.'
    },
    safety: {
      sideEffects: ['Fish burps', 'Mild GI upset', 'Blood thinning at very high doses'],
      contraindications: ['Bleeding disorders', 'Upcoming surgery'],
      interactions: [
        {
          supplement: 'Vitamin E',
          effect: 'synergy',
          description: 'Vitamin E protects omega-3s from oxidation'
        }
      ],
      pregnancySafe: true,
      breastfeedingSafe: true
    },
    goals: [
      SupplementGoal.RECOVERY,
      SupplementGoal.CARDIOVASCULAR_HEALTH,
      SupplementGoal.JOINT_HEALTH,
      SupplementGoal.LONGEVITY
    ],
    stacksWith: ['vitamin_d3', 'curcumin', 'vitamin_e'],
    costEffectiveness: 'high',
    mixability: undefined,
    tags: ['anti_inflammatory', 'heart_health', 'essential', 'recovery'],
    popularityScore: 88,
    scientificRating: 9
  }
];

// ============================================================================
// SLEEP & RECOVERY
// ============================================================================

const sleepSupplements: Supplement[] = [
  {
    id: CommonSupplements.MELATONIN,
    name: 'Melatonin',
    commonNames: ['Sleep Hormone'],
    category: SupplementCategory.SLEEP_RECOVERY,
    dosing: {
      standardDose: 3,
      unit: 'mg',
      frequencyPerDay: 1,
      timing: [SupplementTiming.BEFORE_BED],
      minDose: 0.3,
      maxDose: 10,
      notes: 'Start with 0.5-1mg. Take 30-60 min before bed. Lower doses often more effective.'
    },
    forms: [SupplementForm.CAPSULE, SupplementForm.TABLET, SupplementForm.LIQUID, SupplementForm.SUBLINGUAL, SupplementForm.GUMMY],
    evidence: {
      primaryBenefits: [
        'Reduces sleep latency (time to fall asleep)',
        'Improves sleep quality',
        'Supports circadian rhythm',
        'Useful for jet lag and shift work'
      ],
      secondaryBenefits: [
        'Powerful antioxidant',
        'May support immune function',
        'Neuroprotective properties'
      ],
      mechanisms: [
        'Binds to melatonin receptors in brain',
        'Signals darkness and sleep time',
        'Synchronizes circadian rhythms',
        'Reduces core body temperature'
      ],
      evidenceLevel: EvidenceLevel.STRONG,
      metaAnalysisFindings: 'Meta-analyses confirm reduced sleep latency and improved sleep quality. Most effective for sleep disorders and jet lag.'
    },
    safety: {
      sideEffects: ['Grogginess next day (at high doses)', 'Vivid dreams', 'Headache in some'],
      contraindications: ['Autoimmune disorders', 'Epilepsy'],
      interactions: [
        {
          supplement: 'Magnesium',
          effect: 'synergy',
          description: 'Magnesium enhances natural melatonin production'
        }
      ],
      pregnancySafe: false,
      breastfeedingSafe: false
    },
    goals: [
      SupplementGoal.SLEEP_QUALITY,
      SupplementGoal.RECOVERY,
      SupplementGoal.STRESS_MANAGEMENT
    ],
    stacksWith: ['magnesium', 'theanine', 'casein'],
    costEffectiveness: 'very_high',
    mixability: undefined,
    tags: ['sleep', 'recovery', 'circadian', 'travel'],
    popularityScore: 85,
    scientificRating: 8
  },
  {
    id: CommonSupplements.ASHWAGANDHA,
    name: 'Ashwagandha (KSM-66)',
    commonNames: ['Withania Somnifera', 'Indian Ginseng'],
    category: SupplementCategory.ADAPTOGEN,
    dosing: {
      standardDose: 600,
      unit: 'mg',
      frequencyPerDay: 2,
      timing: [SupplementTiming.MORNING, SupplementTiming.BEFORE_BED],
      withFood: true,
      notes: 'Split dose morning and evening. Effects after 2-4 weeks. KSM-66 is most researched extract.'
    },
    forms: [SupplementForm.CAPSULE, SupplementForm.POWDER],
    evidence: {
      primaryBenefits: [
        'Reduces cortisol and stress',
        'Improves anxiety symptoms',
        'May increase testosterone (in stressed men)',
        'Supports strength and muscle gains'
      ],
      secondaryBenefits: [
        'Improves sleep quality',
        'May enhance endurance',
        'Neuroprotective',
        'May support thyroid function'
      ],
      mechanisms: [
        'Modulates HPA axis (stress response)',
        'Reduces cortisol levels',
        'GABAergic activity (calming)',
        'May increase luteinizing hormone'
      ],
      evidenceLevel: EvidenceLevel.STRONG,
      metaAnalysisFindings: 'Multiple RCTs show significant reductions in stress and cortisol. Some evidence for strength gains and testosterone in men.'
    },
    safety: {
      sideEffects: ['GI upset in some', 'Drowsiness', 'Thyroid hormone changes'],
      contraindications: ['Thyroid disorders (monitor)', 'Pregnancy', 'Autoimmune conditions'],
      interactions: [],
      pregnancySafe: false,
      breastfeedingSafe: false,
      medicalConditionWarnings: ['Thyroid conditions - may increase thyroid hormone']
    },
    goals: [
      SupplementGoal.STRESS_MANAGEMENT,
      SupplementGoal.RECOVERY,
      SupplementGoal.HORMONE_OPTIMIZATION,
      SupplementGoal.SLEEP_QUALITY
    ],
    stacksWith: ['magnesium', 'vitamin_d3', 'fish_oil'],
    costEffectiveness: 'moderate',
    tasteRating: 1,
    mixability: 'fair',
    tags: ['adaptogen', 'stress', 'cortisol', 'testosterone', 'recovery'],
    popularityScore: 78,
    scientificRating: 8
  }
];

// ============================================================================
// EXPORT ALL SUPPLEMENTS
// ============================================================================

export const ULTIMATE_SUPPLEMENTS: Supplement[] = [
  ...creatineSupplements,
  ...proteinSupplements,
  ...aminoAcidSupplements,
  ...vitaminSupplements,
  ...performanceSupplements,
  ...jointSupplements,
  ...omega3Supplements,
  ...sleepSupplements
];

// Helper functions
export const getSupplementsByCategory = (category: SupplementCategory): Supplement[] => {
  return ULTIMATE_SUPPLEMENTS.filter(sup => sup.category === category);
};

export const getSupplementsByGoal = (goal: SupplementGoal): Supplement[] => {
  return ULTIMATE_SUPPLEMENTS.filter(sup => sup.goals.includes(goal));
};

export const getSupplementsByTiming = (timing: SupplementTiming): Supplement[] => {
  return ULTIMATE_SUPPLEMENTS.filter(sup =>
    sup.dosing.timing.includes(timing)
  );
};

export const getTopRatedSupplements = (minRating: number = 8): Supplement[] => {
  return ULTIMATE_SUPPLEMENTS.filter(sup =>
    sup.scientificRating && sup.scientificRating >= minRating
  ).sort((a, b) => (b.scientificRating || 0) - (a.scientificRating || 0));
};

export const searchSupplements = (query: string): Supplement[] => {
  const lowerQuery = query.toLowerCase();
  return ULTIMATE_SUPPLEMENTS.filter(sup =>
    sup.name.toLowerCase().includes(lowerQuery) ||
    sup.commonNames.some(name => name.toLowerCase().includes(lowerQuery)) ||
    sup.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    sup.evidence.primaryBenefits.some(benefit => benefit.toLowerCase().includes(lowerQuery))
  );
};

export default ULTIMATE_SUPPLEMENTS;
