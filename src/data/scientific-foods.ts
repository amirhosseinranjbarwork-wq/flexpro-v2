/**
 * SCIENTIFIC FOOD DATABASE
 * Comprehensive nutritional data with micronutrients and metabolic information
 */

import {
  Food,
  FoodCategory,
  ProteinType,
  FoodTiming,
  GlycemicIndex,
  DigestibilityScore,
  DietaryRestriction
} from '../types/ultimate-nutrition';

// ============================================================================
// PROTEIN SOURCES
// ============================================================================

const proteinFoods: Food[] = [
  {
    id: 'food_chicken_breast',
    name: 'Chicken Breast (Skinless)',
    category: FoodCategory.PROTEIN,
    servingSize: 100,
    servingUnit: '100g',
    calories: 165,
    macros: {
      protein: 31,
      carbohydrates: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      saturatedFat: 1.0,
      monounsaturatedFat: 1.2,
      polyunsaturatedFat: 0.8
    },
    micros: {
      vitamins: {
        vitaminB3: 14.8,
        vitaminB6: 0.9,
        vitaminB12: 0.3
      },
      minerals: {
        phosphorus: 228,
        selenium: 27.6,
        zinc: 1.0
      }
    },
    proteinType: ProteinType.COMPLETE,
    aminoAcids: {
      leucine: 2480,
      isoleucine: 1480,
      valine: 1580,
      totalBCAA: 5540,
      totalEAA: 13200
    },
    proteinDigestibility: 0.97,
    digestionSpeed: DigestibilityScore.MODERATE,
    idealTiming: [FoodTiming.ANYTIME, FoodTiming.POST_WORKOUT],
    restrictions: [DietaryRestriction.GLUTEN_FREE, DietaryRestriction.DAIRY_FREE],
    allergens: [],
    benefits: [
      'High protein, low fat',
      'Rich in leucine for muscle protein synthesis',
      'Excellent bioavailability',
      'Versatile cooking options'
    ],
    tags: ['lean_protein', 'muscle_building', 'staple', 'versatile'],
    popularityScore: 95
  },
  {
    id: 'food_salmon',
    name: 'Atlantic Salmon (Wild)',
    category: FoodCategory.PROTEIN,
    servingSize: 100,
    servingUnit: '100g',
    calories: 206,
    macros: {
      protein: 25,
      carbohydrates: 0,
      fat: 11,
      fiber: 0,
      sugar: 0,
      saturatedFat: 2.2,
      monounsaturatedFat: 3.8,
      polyunsaturatedFat: 3.9,
      omega3: 2.5,
      omega6: 0.2
    },
    micros: {
      vitamins: {
        vitaminD: 10.9,
        vitaminB12: 3.2,
        vitaminB3: 8.5,
        vitaminB6: 0.6
      },
      minerals: {
        selenium: 41.4,
        phosphorus: 252,
        potassium: 363,
        magnesium: 29
      }
    },
    proteinType: ProteinType.COMPLETE,
    aminoAcids: {
      leucine: 2100,
      isoleucine: 1200,
      valine: 1350,
      totalBCAA: 4650,
      totalEAA: 11500
    },
    proteinDigestibility: 0.95,
    digestionSpeed: DigestibilityScore.MODERATE,
    idealTiming: [FoodTiming.ANYTIME, FoodTiming.POST_WORKOUT],
    restrictions: [DietaryRestriction.GLUTEN_FREE, DietaryRestriction.DAIRY_FREE, DietaryRestriction.PALEO],
    allergens: ['fish'],
    benefits: [
      'Ultra-high omega-3 fatty acids (EPA & DHA)',
      'Anti-inflammatory properties',
      'Heart and brain health',
      'High vitamin D content'
    ],
    tags: ['omega3', 'healthy_fats', 'premium', 'anti_inflammatory'],
    popularityScore: 90
  },
  {
    id: 'food_eggs_whole',
    name: 'Whole Eggs',
    category: FoodCategory.PROTEIN,
    servingSize: 100,
    servingUnit: '2 large eggs',
    calories: 143,
    macros: {
      protein: 12.6,
      carbohydrates: 0.7,
      fat: 9.5,
      fiber: 0,
      sugar: 0.4,
      saturatedFat: 3.1,
      monounsaturatedFat: 3.7,
      polyunsaturatedFat: 1.9
    },
    micros: {
      vitamins: {
        vitaminA: 160,
        vitaminD: 2.0,
        vitaminE: 1.1,
        vitaminB2: 0.46,
        vitaminB12: 1.1,
        vitaminB5: 1.4,
        vitaminB7: 20
      },
      minerals: {
        selenium: 30.8,
        phosphorus: 198,
        iron: 1.8,
        zinc: 1.3
      }
    },
    proteinType: ProteinType.COMPLETE,
    aminoAcids: {
      leucine: 1075,
      isoleucine: 680,
      valine: 850,
      totalBCAA: 2605,
      totalEAA: 6200
    },
    proteinDigestibility: 0.97,
    digestionSpeed: DigestibilityScore.MODERATE,
    idealTiming: [FoodTiming.BREAKFAST, FoodTiming.ANYTIME],
    restrictions: [DietaryRestriction.GLUTEN_FREE, DietaryRestriction.DAIRY_FREE, DietaryRestriction.PALEO],
    allergens: ['eggs'],
    benefits: [
      'Highest biological value protein',
      'Rich in choline (brain health)',
      'Contains all essential vitamins except C',
      'Affordable and versatile'
    ],
    tags: ['complete_protein', 'bioavailable', 'breakfast', 'affordable'],
    popularityScore: 98
  },
  {
    id: 'food_greek_yogurt',
    name: 'Greek Yogurt (Non-fat)',
    category: FoodCategory.DAIRY,
    servingSize: 170,
    servingUnit: '1 container (170g)',
    calories: 100,
    macros: {
      protein: 17,
      carbohydrates: 6,
      fat: 0.7,
      fiber: 0,
      sugar: 4,
      saturatedFat: 0.4
    },
    micros: {
      vitamins: {
        vitaminB12: 1.3,
        vitaminB2: 0.4
      },
      minerals: {
        calcium: 200,
        phosphorus: 240,
        potassium: 240,
        sodium: 65
      }
    },
    proteinType: ProteinType.COMPLETE,
    aminoAcids: {
      leucine: 1700,
      isoleucine: 950,
      valine: 1100,
      totalBCAA: 3750,
      totalEAA: 7800
    },
    proteinDigestibility: 0.95,
    digestionSpeed: DigestibilityScore.SLOW,
    idealTiming: [FoodTiming.ANYTIME, FoodTiming.BEFORE_BED],
    restrictions: [DietaryRestriction.GLUTEN_FREE],
    allergens: ['dairy'],
    benefits: [
      'High protein, low calorie',
      'Probiotic benefits for gut health',
      'Slow-digesting casein protein',
      'High calcium content'
    ],
    tags: ['high_protein', 'probiotics', 'slow_digesting', 'convenient'],
    popularityScore: 92
  },
  {
    id: 'food_lean_beef',
    name: 'Lean Ground Beef (93/7)',
    category: FoodCategory.PROTEIN,
    servingSize: 100,
    servingUnit: '100g',
    calories: 176,
    macros: {
      protein: 21,
      carbohydrates: 0,
      fat: 10,
      fiber: 0,
      sugar: 0,
      saturatedFat: 4.5,
      monounsaturatedFat: 4.5,
      polyunsaturatedFat: 0.4
    },
    micros: {
      vitamins: {
        vitaminB12: 2.4,
        vitaminB3: 5.8,
        vitaminB6: 0.4
      },
      minerals: {
        iron: 2.5,
        zinc: 5.3,
        selenium: 19.5,
        phosphorus: 200
      }
    },
    proteinType: ProteinType.COMPLETE,
    aminoAcids: {
      leucine: 1750,
      isoleucine: 950,
      valine: 1050,
      totalBCAA: 3750,
      totalEAA: 9100
    },
    proteinDigestibility: 0.92,
    digestionSpeed: DigestibilityScore.MODERATE,
    idealTiming: [FoodTiming.ANYTIME, FoodTiming.POST_WORKOUT],
    restrictions: [DietaryRestriction.GLUTEN_FREE, DietaryRestriction.DAIRY_FREE, DietaryRestriction.PALEO],
    allergens: [],
    benefits: [
      'High in heme iron (most bioavailable)',
      'Rich in creatine and carnosine',
      'Excellent zinc for testosterone',
      'High in B vitamins'
    ],
    tags: ['red_meat', 'iron_rich', 'creatine', 'zinc'],
    popularityScore: 85
  },
  {
    id: 'food_tofu_firm',
    name: 'Firm Tofu',
    category: FoodCategory.PROTEIN,
    servingSize: 100,
    servingUnit: '100g',
    calories: 76,
    macros: {
      protein: 8,
      carbohydrates: 1.9,
      fat: 4.8,
      fiber: 0.3,
      sugar: 0.7,
      saturatedFat: 0.7,
      monounsaturatedFat: 1.1,
      polyunsaturatedFat: 2.7
    },
    micros: {
      vitamins: {
        vitaminB1: 0.08,
        vitaminB2: 0.05
      },
      minerals: {
        calcium: 350,
        iron: 5.4,
        magnesium: 30,
        phosphorus: 97
      }
    },
    proteinType: ProteinType.COMPLETE,
    proteinDigestibility: 0.90,
    digestionSpeed: DigestibilityScore.MODERATE,
    idealTiming: [FoodTiming.ANYTIME],
    restrictions: [
      DietaryRestriction.VEGAN,
      DietaryRestriction.VEGETARIAN,
      DietaryRestriction.GLUTEN_FREE,
      DietaryRestriction.DAIRY_FREE
    ],
    allergens: ['soy'],
    benefits: [
      'Plant-based complete protein',
      'High in calcium',
      'Low calorie, versatile',
      'Contains phytoestrogens (beneficial)'
    ],
    tags: ['plant_protein', 'vegan', 'low_calorie', 'versatile'],
    popularityScore: 75
  }
];

// ============================================================================
// CARBOHYDRATE SOURCES
// ============================================================================

const carbohydrateFoods: Food[] = [
  {
    id: 'food_white_rice',
    name: 'White Rice (Cooked)',
    category: FoodCategory.GRAIN,
    servingSize: 100,
    servingUnit: '1/2 cup cooked',
    calories: 130,
    macros: {
      protein: 2.7,
      carbohydrates: 28,
      fat: 0.3,
      fiber: 0.4,
      sugar: 0.1
    },
    micros: {
      vitamins: {
        vitaminB1: 0.02,
        vitaminB3: 0.4
      },
      minerals: {
        manganese: 0.5,
        selenium: 11.2
      }
    },
    glycemicIndex: 73,
    glycemicLoad: 20,
    insulinIndex: 79,
    digestionSpeed: DigestibilityScore.FAST,
    idealTiming: [FoodTiming.POST_WORKOUT, FoodTiming.ANYTIME],
    restrictions: [
      DietaryRestriction.GLUTEN_FREE,
      DietaryRestriction.VEGAN,
      DietaryRestriction.VEGETARIAN
    ],
    allergens: [],
    benefits: [
      'Quick-digesting carb for post-workout',
      'Low in fiber (easy on digestion)',
      'Hypoallergenic',
      'Affordable staple'
    ],
    tags: ['fast_carb', 'post_workout', 'staple', 'easy_digest'],
    popularityScore: 95
  },
  {
    id: 'food_sweet_potato',
    name: 'Sweet Potato (Baked)',
    category: FoodCategory.CARBOHYDRATE,
    servingSize: 100,
    servingUnit: '1 medium (100g)',
    calories: 90,
    macros: {
      protein: 2,
      carbohydrates: 21,
      fat: 0.2,
      fiber: 3.3,
      sugar: 6.5
    },
    micros: {
      vitamins: {
        vitaminA: 961,
        vitaminC: 19.6,
        vitaminB6: 0.3,
        vitaminB5: 0.9
      },
      minerals: {
        potassium: 475,
        manganese: 0.5,
        copper: 0.2,
        magnesium: 27
      }
    },
    glycemicIndex: 63,
    glycemicLoad: 13,
    digestionSpeed: DigestibilityScore.MODERATE,
    idealTiming: [FoodTiming.ANYTIME, FoodTiming.PRE_WORKOUT],
    restrictions: [
      DietaryRestriction.GLUTEN_FREE,
      DietaryRestriction.VEGAN,
      DietaryRestriction.VEGETARIAN,
      DietaryRestriction.PALEO
    ],
    allergens: [],
    benefits: [
      'Extremely high in vitamin A (beta-carotene)',
      'Moderate GI with good fiber content',
      'High potassium for hydration',
      'Antioxidant-rich'
    ],
    tags: ['complex_carb', 'nutrient_dense', 'antioxidants', 'paleo'],
    popularityScore: 88
  },
  {
    id: 'food_oatmeal',
    name: 'Oatmeal (Rolled Oats, Dry)',
    category: FoodCategory.GRAIN,
    servingSize: 50,
    servingUnit: '1/2 cup dry',
    calories: 190,
    macros: {
      protein: 6.7,
      carbohydrates: 34,
      fat: 3.4,
      fiber: 5,
      sugar: 0.5,
      saturatedFat: 0.6,
      monounsaturatedFat: 1.1,
      polyunsaturatedFat: 1.2
    },
    micros: {
      vitamins: {
        vitaminB1: 0.4,
        vitaminB5: 0.7
      },
      minerals: {
        manganese: 2.5,
        phosphorus: 245,
        magnesium: 88,
        iron: 2.6,
        zinc: 2.1
      }
    },
    glycemicIndex: 55,
    glycemicLoad: 19,
    digestionSpeed: DigestibilityScore.SLOW,
    idealTiming: [FoodTiming.BREAKFAST, FoodTiming.PRE_WORKOUT],
    restrictions: [DietaryRestriction.VEGAN, DietaryRestriction.VEGETARIAN],
    allergens: ['gluten'],
    benefits: [
      'High in beta-glucan fiber (heart health)',
      'Slow-digesting, sustained energy',
      'Rich in minerals',
      'Promotes satiety'
    ],
    tags: ['slow_carb', 'breakfast', 'fiber_rich', 'heart_healthy'],
    popularityScore: 93
  },
  {
    id: 'food_quinoa',
    name: 'Quinoa (Cooked)',
    category: FoodCategory.GRAIN,
    servingSize: 100,
    servingUnit: '1/2 cup cooked',
    calories: 120,
    macros: {
      protein: 4.4,
      carbohydrates: 21,
      fat: 1.9,
      fiber: 2.8,
      sugar: 0.9
    },
    micros: {
      vitamins: {
        vitaminE: 0.6,
        vitaminB2: 0.1
      },
      minerals: {
        manganese: 0.6,
        phosphorus: 152,
        magnesium: 64,
        iron: 1.5
      }
    },
    proteinType: ProteinType.COMPLETE,
    glycemicIndex: 53,
    glycemicLoad: 11,
    digestionSpeed: DigestibilityScore.MODERATE,
    idealTiming: [FoodTiming.ANYTIME],
    restrictions: [
      DietaryRestriction.GLUTEN_FREE,
      DietaryRestriction.VEGAN,
      DietaryRestriction.VEGETARIAN
    ],
    allergens: [],
    benefits: [
      'Complete protein (rare for plant foods)',
      'Gluten-free grain alternative',
      'High in minerals',
      'Low glycemic index'
    ],
    tags: ['complete_protein', 'gluten_free', 'superfood', 'versatile'],
    popularityScore: 78
  },
  {
    id: 'food_banana',
    name: 'Banana',
    category: FoodCategory.FRUIT,
    servingSize: 120,
    servingUnit: '1 medium banana',
    calories: 105,
    macros: {
      protein: 1.3,
      carbohydrates: 27,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14
    },
    micros: {
      vitamins: {
        vitaminC: 10.3,
        vitaminB6: 0.4
      },
      minerals: {
        potassium: 422,
        magnesium: 32,
        manganese: 0.3
      }
    },
    glycemicIndex: 51,
    glycemicLoad: 14,
    digestionSpeed: DigestibilityScore.FAST,
    idealTiming: [FoodTiming.PRE_WORKOUT, FoodTiming.POST_WORKOUT],
    restrictions: [
      DietaryRestriction.VEGAN,
      DietaryRestriction.VEGETARIAN,
      DietaryRestriction.GLUTEN_FREE,
      DietaryRestriction.DAIRY_FREE
    ],
    allergens: [],
    benefits: [
      'High in potassium (prevents cramps)',
      'Quick energy source',
      'Convenient and portable',
      'Natural electrolyte replacement'
    ],
    tags: ['quick_carb', 'potassium', 'pre_workout', 'convenient'],
    popularityScore: 97
  },
  {
    id: 'food_whole_wheat_bread',
    name: 'Whole Wheat Bread',
    category: FoodCategory.GRAIN,
    servingSize: 30,
    servingUnit: '1 slice',
    calories: 80,
    macros: {
      protein: 4,
      carbohydrates: 14,
      fat: 1,
      fiber: 2,
      sugar: 2
    },
    micros: {
      vitamins: {
        vitaminB1: 0.1,
        vitaminB3: 1.4
      },
      minerals: {
        iron: 1.2,
        magnesium: 23,
        selenium: 13
      }
    },
    glycemicIndex: 69,
    glycemicLoad: 10,
    digestionSpeed: DigestibilityScore.MODERATE,
    idealTiming: [FoodTiming.ANYTIME, FoodTiming.BREAKFAST],
    restrictions: [DietaryRestriction.VEGAN, DietaryRestriction.VEGETARIAN],
    allergens: ['gluten'],
    benefits: [
      'Higher fiber than white bread',
      'Moderate protein content',
      'Fortified with B vitamins',
      'Convenient carb source'
    ],
    tags: ['whole_grain', 'fiber', 'convenient'],
    popularityScore: 85
  }
];

// ============================================================================
// HEALTHY FATS
// ============================================================================

const fatFoods: Food[] = [
  {
    id: 'food_avocado',
    name: 'Avocado',
    category: FoodCategory.HEALTHY_FAT,
    servingSize: 100,
    servingUnit: '1/2 medium avocado',
    calories: 160,
    macros: {
      protein: 2,
      carbohydrates: 8.5,
      fat: 15,
      fiber: 6.7,
      sugar: 0.7,
      saturatedFat: 2.1,
      monounsaturatedFat: 10,
      polyunsaturatedFat: 1.8
    },
    micros: {
      vitamins: {
        vitaminK: 21,
        vitaminE: 2.1,
        vitaminC: 10,
        vitaminB5: 1.4,
        vitaminB6: 0.3
      },
      minerals: {
        potassium: 485,
        magnesium: 29,
        copper: 0.2
      }
    },
    glycemicIndex: 15,
    digestionSpeed: DigestibilityScore.SLOW,
    idealTiming: [FoodTiming.ANYTIME],
    restrictions: [
      DietaryRestriction.VEGAN,
      DietaryRestriction.VEGETARIAN,
      DietaryRestriction.KETO,
      DietaryRestriction.PALEO,
      DietaryRestriction.GLUTEN_FREE
    ],
    allergens: [],
    benefits: [
      'Rich in heart-healthy monounsaturated fats',
      'High in potassium (more than bananas)',
      'Excellent fiber content',
      'Promotes nutrient absorption'
    ],
    tags: ['healthy_fats', 'heart_health', 'keto', 'nutrient_dense'],
    popularityScore: 90
  },
  {
    id: 'food_almonds',
    name: 'Almonds (Raw)',
    category: FoodCategory.NUT_SEED,
    servingSize: 28,
    servingUnit: '1 oz (about 23 almonds)',
    calories: 164,
    macros: {
      protein: 6,
      carbohydrates: 6,
      fat: 14,
      fiber: 3.5,
      sugar: 1.2,
      saturatedFat: 1.1,
      monounsaturatedFat: 9,
      polyunsaturatedFat: 3.5
    },
    micros: {
      vitamins: {
        vitaminE: 7.3,
        vitaminB2: 0.3
      },
      minerals: {
        magnesium: 76,
        phosphorus: 136,
        calcium: 76,
        iron: 1.1,
        zinc: 0.9
      }
    },
    glycemicIndex: 0,
    digestionSpeed: DigestibilityScore.SLOW,
    idealTiming: [FoodTiming.ANYTIME, FoodTiming.BETWEEN_MEALS],
    restrictions: [
      DietaryRestriction.VEGAN,
      DietaryRestriction.VEGETARIAN,
      DietaryRestriction.GLUTEN_FREE,
      DietaryRestriction.KETO,
      DietaryRestriction.PALEO
    ],
    allergens: ['tree nuts'],
    benefits: [
      'Very high in vitamin E (antioxidant)',
      'Good source of magnesium',
      'Promotes satiety',
      'Heart-healthy fats'
    ],
    tags: ['healthy_fats', 'snack', 'vitamin_e', 'portable'],
    popularityScore: 92
  },
  {
    id: 'food_olive_oil',
    name: 'Extra Virgin Olive Oil',
    category: FoodCategory.HEALTHY_FAT,
    servingSize: 15,
    servingUnit: '1 tablespoon',
    calories: 119,
    macros: {
      protein: 0,
      carbohydrates: 0,
      fat: 13.5,
      fiber: 0,
      sugar: 0,
      saturatedFat: 1.9,
      monounsaturatedFat: 10,
      polyunsaturatedFat: 1.4
    },
    micros: {
      vitamins: {
        vitaminE: 2.0,
        vitaminK: 8.1
      },
      minerals: {}
    },
    glycemicIndex: 0,
    digestionSpeed: DigestibilityScore.MODERATE,
    idealTiming: [FoodTiming.WITH_MEALS],
    restrictions: [
      DietaryRestriction.VEGAN,
      DietaryRestriction.VEGETARIAN,
      DietaryRestriction.GLUTEN_FREE,
      DietaryRestriction.KETO,
      DietaryRestriction.PALEO
    ],
    allergens: [],
    benefits: [
      'Rich in oleic acid (anti-inflammatory)',
      'High in polyphenols (antioxidants)',
      'Supports heart health',
      'Mediterranean diet staple'
    ],
    tags: ['healthy_fats', 'anti_inflammatory', 'cooking_oil', 'mediterranean'],
    popularityScore: 95
  },
  {
    id: 'food_peanut_butter',
    name: 'Natural Peanut Butter',
    category: FoodCategory.NUT_SEED,
    servingSize: 32,
    servingUnit: '2 tablespoons',
    calories: 190,
    macros: {
      protein: 8,
      carbohydrates: 7,
      fat: 16,
      fiber: 2,
      sugar: 3,
      saturatedFat: 3,
      monounsaturatedFat: 8,
      polyunsaturatedFat: 4
    },
    micros: {
      vitamins: {
        vitaminE: 2.9,
        vitaminB3: 4.3
      },
      minerals: {
        magnesium: 49,
        phosphorus: 107,
        potassium: 189,
        zinc: 0.9
      }
    },
    glycemicIndex: 14,
    digestionSpeed: DigestibilityScore.SLOW,
    idealTiming: [FoodTiming.ANYTIME, FoodTiming.BETWEEN_MEALS],
    restrictions: [DietaryRestriction.VEGAN, DietaryRestriction.VEGETARIAN],
    allergens: ['peanuts'],
    benefits: [
      'Calorie-dense for bulking',
      'Good protein content',
      'Rich in healthy fats',
      'Affordable and convenient'
    ],
    tags: ['calorie_dense', 'bulking', 'protein', 'affordable'],
    popularityScore: 93
  }
];

// ============================================================================
// VEGETABLES
// ============================================================================

const vegetables: Food[] = [
  {
    id: 'food_broccoli',
    name: 'Broccoli (Cooked)',
    category: FoodCategory.VEGETABLE,
    servingSize: 100,
    servingUnit: '1 cup',
    calories: 35,
    macros: {
      protein: 2.4,
      carbohydrates: 7,
      fat: 0.4,
      fiber: 3.3,
      sugar: 1.4
    },
    micros: {
      vitamins: {
        vitaminC: 64.9,
        vitaminK: 141.1,
        vitaminA: 62.4,
        vitaminB9: 108
      },
      minerals: {
        potassium: 293,
        calcium: 40,
        iron: 0.7,
        magnesium: 21
      }
    },
    glycemicIndex: 15,
    digestionSpeed: DigestibilityScore.MODERATE,
    idealTiming: [FoodTiming.ANYTIME, FoodTiming.WITH_MEALS],
    restrictions: [
      DietaryRestriction.VEGAN,
      DietaryRestriction.VEGETARIAN,
      DietaryRestriction.GLUTEN_FREE,
      DietaryRestriction.KETO,
      DietaryRestriction.PALEO
    ],
    allergens: [],
    benefits: [
      'Very high in vitamin C and K',
      'Contains sulforaphane (anti-cancer)',
      'High fiber, low calorie',
      'Supports detoxification'
    ],
    tags: ['low_calorie', 'nutrient_dense', 'fiber', 'cruciferous'],
    popularityScore: 88
  },
  {
    id: 'food_spinach',
    name: 'Spinach (Raw)',
    category: FoodCategory.VEGETABLE,
    servingSize: 100,
    servingUnit: '3 cups raw',
    calories: 23,
    macros: {
      protein: 2.9,
      carbohydrates: 3.6,
      fat: 0.4,
      fiber: 2.2,
      sugar: 0.4
    },
    micros: {
      vitamins: {
        vitaminK: 482.9,
        vitaminA: 469.2,
        vitaminC: 28.1,
        vitaminB9: 194
      },
      minerals: {
        iron: 2.7,
        magnesium: 79,
        potassium: 558,
        calcium: 99
      }
    },
    glycemicIndex: 15,
    digestionSpeed: DigestibilityScore.FAST,
    idealTiming: [FoodTiming.ANYTIME],
    restrictions: [
      DietaryRestriction.VEGAN,
      DietaryRestriction.VEGETARIAN,
      DietaryRestriction.GLUTEN_FREE,
      DietaryRestriction.KETO,
      DietaryRestriction.PALEO
    ],
    allergens: [],
    benefits: [
      'Extremely nutrient-dense per calorie',
      'High in iron (plant-based)',
      'Nitrate content (blood flow)',
      'Versatile in cooking'
    ],
    tags: ['low_calorie', 'nutrient_dense', 'iron', 'leafy_green'],
    popularityScore: 90
  },
  {
    id: 'food_bell_pepper',
    name: 'Red Bell Pepper',
    category: FoodCategory.VEGETABLE,
    servingSize: 100,
    servingUnit: '1 medium pepper',
    calories: 31,
    macros: {
      protein: 1,
      carbohydrates: 6,
      fat: 0.3,
      fiber: 2.1,
      sugar: 4.2
    },
    micros: {
      vitamins: {
        vitaminC: 127.7,
        vitaminA: 157,
        vitaminB6: 0.3
      },
      minerals: {
        potassium: 211,
        phosphorus: 26
      }
    },
    glycemicIndex: 15,
    digestionSpeed: DigestibilityScore.MODERATE,
    idealTiming: [FoodTiming.ANYTIME],
    restrictions: [
      DietaryRestriction.VEGAN,
      DietaryRestriction.VEGETARIAN,
      DietaryRestriction.GLUTEN_FREE,
      DietaryRestriction.KETO,
      DietaryRestriction.PALEO
    ],
    allergens: [],
    benefits: [
      'Highest vitamin C content of common vegetables',
      'Rich in antioxidants',
      'Low calorie',
      'Sweet taste without high sugar'
    ],
    tags: ['vitamin_c', 'antioxidants', 'low_calorie', 'colorful'],
    popularityScore: 82
  }
];

// ============================================================================
// FRUITS
// ============================================================================

const fruits: Food[] = [
  {
    id: 'food_blueberries',
    name: 'Blueberries',
    category: FoodCategory.FRUIT,
    servingSize: 148,
    servingUnit: '1 cup',
    calories: 84,
    macros: {
      protein: 1.1,
      carbohydrates: 21,
      fat: 0.5,
      fiber: 3.6,
      sugar: 15
    },
    micros: {
      vitamins: {
        vitaminC: 14.4,
        vitaminK: 28.6,
        vitaminB6: 0.1
      },
      minerals: {
        manganese: 0.5,
        potassium: 114
      }
    },
    glycemicIndex: 53,
    glycemicLoad: 11,
    digestionSpeed: DigestibilityScore.FAST,
    idealTiming: [FoodTiming.ANYTIME, FoodTiming.POST_WORKOUT],
    restrictions: [
      DietaryRestriction.VEGAN,
      DietaryRestriction.VEGETARIAN,
      DietaryRestriction.GLUTEN_FREE,
      DietaryRestriction.PALEO
    ],
    allergens: [],
    benefits: [
      'Highest antioxidant content of common fruits',
      'Supports brain health',
      'Anti-inflammatory',
      'May improve insulin sensitivity'
    ],
    tags: ['antioxidants', 'brain_health', 'low_gi', 'berries'],
    popularityScore: 88
  },
  {
    id: 'food_apple',
    name: 'Apple (with skin)',
    category: FoodCategory.FRUIT,
    servingSize: 182,
    servingUnit: '1 medium apple',
    calories: 95,
    macros: {
      protein: 0.5,
      carbohydrates: 25,
      fat: 0.3,
      fiber: 4.4,
      sugar: 19
    },
    micros: {
      vitamins: {
        vitaminC: 8.4
      },
      minerals: {
        potassium: 195
      }
    },
    glycemicIndex: 36,
    glycemicLoad: 9,
    digestionSpeed: DigestibilityScore.MODERATE,
    idealTiming: [FoodTiming.ANYTIME, FoodTiming.BETWEEN_MEALS],
    restrictions: [
      DietaryRestriction.VEGAN,
      DietaryRestriction.VEGETARIAN,
      DietaryRestriction.GLUTEN_FREE,
      DietaryRestriction.PALEO
    ],
    allergens: [],
    benefits: [
      'High fiber content (especially pectin)',
      'Low glycemic index despite sweetness',
      'Promotes gut health',
      'Convenient and portable'
    ],
    tags: ['fiber', 'low_gi', 'convenient', 'gut_health'],
    popularityScore: 95
  }
];

// ============================================================================
// EXPORT ALL FOODS
// ============================================================================

export const SCIENTIFIC_FOODS: Food[] = [
  ...proteinFoods,
  ...carbohydrateFoods,
  ...fatFoods,
  ...vegetables,
  ...fruits
];

// Helper functions
export const getFoodsByCategory = (category: FoodCategory): Food[] => {
  return SCIENTIFIC_FOODS.filter(food => food.category === category);
};

export const getFoodsByTiming = (timing: FoodTiming): Food[] => {
  return SCIENTIFIC_FOODS.filter(food => food.idealTiming.includes(timing));
};

export const getHighProteinFoods = (minProtein: number = 20): Food[] => {
  return SCIENTIFIC_FOODS.filter(food => food.macros.protein >= minProtein);
};

export const searchFoods = (query: string): Food[] => {
  const lowerQuery = query.toLowerCase();
  return SCIENTIFIC_FOODS.filter(food =>
    food.name.toLowerCase().includes(lowerQuery) ||
    food.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    food.benefits.some(benefit => benefit.toLowerCase().includes(lowerQuery))
  );
};

export default SCIENTIFIC_FOODS;
