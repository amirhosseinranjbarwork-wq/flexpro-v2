"""
Rich Data Seeding Script for FlexPro
Seeds exercises, foods, and supplements with scientific data
"""
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

# ============================================================================
# EXERCISES DATA - Converted from TypeScript ultimate-exercises.ts
# ============================================================================

EXERCISES_DATA = [
    # CHEST EXERCISES
    {
        "id": "ex_barbell_bench_press",
        "name": "Barbell Bench Press",
        "category": "resistance",
        "primary_muscles": ["chest"],
        "secondary_muscles": ["triceps", "shoulders"],
        "equipment": ["barbell"],
        "difficulty": "intermediate",
        "description": "The king of upper body pressing movements. Lie on a flat bench and press the barbell from chest to full arm extension.",
        "instructions": "Retract scapulae, arch lower back slightly, bar path diagonal toward face, touch chest at nipple line, drive feet into ground",
        "default_sets": 4,
        "default_reps": 6,
        "default_rest": 180,
        "rpe": 8,
        "tempo": "3-0-1-0",
        "tags": ["compound", "mass_builder", "powerlifting", "strength"]
    },
    {
        "id": "ex_dumbbell_incline_press",
        "name": "Dumbbell Incline Press",
        "category": "resistance",
        "primary_muscles": ["chest"],
        "secondary_muscles": ["shoulders", "triceps"],
        "equipment": ["dumbbell"],
        "difficulty": "beginner",
        "description": "Press dumbbells on a 30-45 degree incline bench to target upper chest.",
        "instructions": "Set bench to 30-45 degrees, keep elbows at 45-degree angle, full ROM, slight arch in dumbbells at top",
        "default_sets": 4,
        "default_reps": 10,
        "default_rest": 120,
        "rpe": 7,
        "tempo": "3-0-1-1",
        "tags": ["hypertrophy", "upper_chest", "dumbbell"]
    },
    {
        "id": "ex_cable_crossover",
        "name": "Cable Crossover",
        "category": "resistance",
        "primary_muscles": ["chest"],
        "secondary_muscles": ["shoulders"],
        "equipment": ["cable"],
        "difficulty": "beginner",
        "description": "Isolation movement using cables to maximally stretch and contract the pecs.",
        "instructions": "Slight forward lean, internally rotate shoulders at peak, maintain elbow angle, control negative",
        "default_sets": 3,
        "default_reps": 15,
        "default_rest": 60,
        "rpe": 8,
        "tempo": "2-0-1-2",
        "tags": ["isolation", "pump", "finisher", "constant_tension"]
    },
    
    # BACK EXERCISES
    {
        "id": "ex_deadlift",
        "name": "Conventional Deadlift",
        "category": "resistance",
        "primary_muscles": ["back", "glutes", "hamstrings"],
        "secondary_muscles": ["traps", "forearms", "abs"],
        "equipment": ["barbell"],
        "difficulty": "advanced",
        "description": "The ultimate posterior chain developer. Hip hinge movement lifting the barbell from the floor to standing.",
        "instructions": "Bar over mid-foot, hips higher than knees, neutral spine, push floor away, keep bar close",
        "default_sets": 5,
        "default_reps": 5,
        "default_rest": 240,
        "rpe": 9,
        "tempo": "2-0-2-0",
        "tags": ["compound", "full_body", "strength", "powerlifting"]
    },
    {
        "id": "ex_pull_up",
        "name": "Pull-Up",
        "category": "resistance",
        "primary_muscles": ["back"],
        "secondary_muscles": ["biceps", "forearms"],
        "equipment": ["bodyweight"],
        "difficulty": "intermediate",
        "description": "Bodyweight vertical pulling exercise. Pull yourself up until chin clears bar.",
        "instructions": "Dead hang start, depress and retract scapulae, pull elbows down and back, control descent",
        "default_sets": 4,
        "default_reps": 10,
        "default_rest": 150,
        "rpe": 8,
        "tempo": "2-0-1-1",
        "tags": ["bodyweight", "compound", "back_width", "calisthenics"]
    },
    {
        "id": "ex_barbell_row",
        "name": "Barbell Bent-Over Row",
        "category": "resistance",
        "primary_muscles": ["back"],
        "secondary_muscles": ["biceps", "lower_back", "traps"],
        "equipment": ["barbell"],
        "difficulty": "intermediate",
        "description": "Fundamental horizontal pulling movement for back thickness.",
        "instructions": "Hip hinge 45 degrees, pull to lower chest, keep elbows close, squeeze shoulder blades, maintain neutral spine",
        "default_sets": 4,
        "default_reps": 8,
        "default_rest": 150,
        "rpe": 8,
        "tempo": "2-0-1-1",
        "tags": ["compound", "back_thickness", "mass_builder"]
    },
    
    # SHOULDER EXERCISES
    {
        "id": "ex_overhead_press",
        "name": "Standing Overhead Press",
        "category": "resistance",
        "primary_muscles": ["shoulders"],
        "secondary_muscles": ["triceps", "traps", "abs"],
        "equipment": ["barbell"],
        "difficulty": "intermediate",
        "description": "The king of shoulder builders. Press barbell from shoulders to overhead while standing.",
        "instructions": "Grip slightly wider than shoulders, brace core, press in slight arc, lock out overhead, shrug at top",
        "default_sets": 4,
        "default_reps": 6,
        "default_rest": 180,
        "rpe": 8,
        "tempo": "2-0-1-0",
        "tags": ["compound", "shoulder_mass", "strength", "functional"]
    },
    {
        "id": "ex_lateral_raise",
        "name": "Dumbbell Lateral Raise",
        "category": "resistance",
        "primary_muscles": ["shoulders"],
        "secondary_muscles": [],
        "equipment": ["dumbbell"],
        "difficulty": "beginner",
        "description": "Isolation exercise targeting the lateral (middle) deltoid head.",
        "instructions": "Slight bend in elbows, lead with elbows, raise to shoulder height, thumbs slightly down, control descent",
        "default_sets": 4,
        "default_reps": 15,
        "default_rest": 60,
        "rpe": 8,
        "tempo": "2-0-1-2",
        "tags": ["isolation", "shoulder_width", "pump", "side_delts"]
    },
    
    # LEG EXERCISES
    {
        "id": "ex_back_squat",
        "name": "Barbell Back Squat",
        "category": "resistance",
        "primary_muscles": ["quads", "glutes"],
        "secondary_muscles": ["hamstrings", "abs", "lower_back"],
        "equipment": ["barbell"],
        "difficulty": "intermediate",
        "description": "The king of leg exercises. Barbell positioned on upper back, squat to depth.",
        "instructions": "Bar on upper traps or rear delts, feet shoulder width, break hips and knees together, chest up, drive through mid-foot",
        "default_sets": 4,
        "default_reps": 6,
        "default_rest": 240,
        "rpe": 8,
        "tempo": "3-0-1-0",
        "tags": ["compound", "leg_mass", "strength", "powerlifting"]
    },
    {
        "id": "ex_romanian_deadlift",
        "name": "Romanian Deadlift",
        "category": "resistance",
        "primary_muscles": ["hamstrings", "glutes"],
        "secondary_muscles": ["lower_back", "forearms"],
        "equipment": ["barbell"],
        "difficulty": "intermediate",
        "description": "Hip hinge movement emphasizing hamstring stretch and development.",
        "instructions": "Start from standing, soft knee bend, push hips back, lower until deep stretch, drive hips forward",
        "default_sets": 4,
        "default_reps": 10,
        "default_rest": 120,
        "rpe": 8,
        "tempo": "3-1-1-0",
        "tags": ["hamstring", "posterior_chain", "hypertrophy"]
    },
    {
        "id": "ex_bulgarian_split_squat",
        "name": "Bulgarian Split Squat",
        "category": "resistance",
        "primary_muscles": ["quads", "glutes"],
        "secondary_muscles": ["hamstrings"],
        "equipment": ["dumbbell"],
        "difficulty": "intermediate",
        "description": "Unilateral leg exercise with rear foot elevated on bench.",
        "instructions": "Rear foot on bench, front foot far enough forward, descend straight down, keep torso upright, drive through heel",
        "default_sets": 3,
        "default_reps": 12,
        "default_rest": 90,
        "rpe": 8,
        "tempo": "3-0-1-0",
        "tags": ["unilateral", "quad_focus", "glute_focus", "stability"]
    },
    
    # ARM EXERCISES
    {
        "id": "ex_barbell_curl",
        "name": "Barbell Bicep Curl",
        "category": "resistance",
        "primary_muscles": ["biceps"],
        "secondary_muscles": ["forearms"],
        "equipment": ["barbell"],
        "difficulty": "beginner",
        "description": "Classic bicep builder. Curl barbell from arms extended to full contraction.",
        "instructions": "Stand feet hip-width, elbows tucked, curl without swinging, squeeze at top, control negative",
        "default_sets": 3,
        "default_reps": 10,
        "default_rest": 90,
        "rpe": 8,
        "tempo": "2-1-1-0",
        "tags": ["isolation", "biceps", "arms", "classic"]
    },
    {
        "id": "ex_close_grip_bench",
        "name": "Close-Grip Bench Press",
        "category": "resistance",
        "primary_muscles": ["triceps"],
        "secondary_muscles": ["chest", "shoulders"],
        "equipment": ["barbell"],
        "difficulty": "intermediate",
        "description": "Compound tricep exercise using narrow grip on bench press.",
        "instructions": "Grip shoulder-width, keep elbows tucked, lower to lower chest, press focusing on triceps, maintain scapular retraction",
        "default_sets": 4,
        "default_reps": 8,
        "default_rest": 120,
        "rpe": 8,
        "tempo": "2-0-1-0",
        "tags": ["compound", "triceps", "strength", "mass"]
    },
    
    # CARDIO EXERCISES
    {
        "id": "ex_treadmill_running",
        "name": "Treadmill Running",
        "category": "cardio",
        "primary_muscles": ["full_body"],
        "secondary_muscles": ["calves", "quads"],
        "equipment": ["treadmill"],
        "difficulty": "beginner",
        "description": "Controlled indoor running for cardiovascular conditioning.",
        "instructions": "Land mid-foot, keep posture upright, natural arm swing, breathe rhythmically, start with warmup pace",
        "default_duration": 30,
        "intensity_zone": 2,
        "tags": ["cardio", "endurance", "fat_loss", "conditioning"]
    },
    {
        "id": "ex_jump_rope",
        "name": "Jump Rope",
        "category": "cardio",
        "primary_muscles": ["calves"],
        "secondary_muscles": ["shoulders", "forearms"],
        "equipment": ["none"],
        "difficulty": "intermediate",
        "description": "Classic cardio exercise using a jump rope for footwork and conditioning.",
        "instructions": "Jump on balls of feet, minimal ground contact, wrist rotation for rope, stay light, keep knees bent",
        "default_duration": 15,
        "intensity_zone": 3,
        "tags": ["cardio", "coordination", "conditioning", "portable"]
    },
    
    # CORE EXERCISES
    {
        "id": "ex_plank",
        "name": "Plank Hold",
        "category": "resistance",
        "primary_muscles": ["abs"],
        "secondary_muscles": ["lower_back", "shoulders"],
        "equipment": ["bodyweight"],
        "difficulty": "beginner",
        "description": "Isometric core exercise. Hold body in straight line from head to heels.",
        "instructions": "Forearms on ground, body in straight line, squeeze glutes, brace abs, breathe normally, don't let hips sag",
        "default_sets": 3,
        "default_reps": 1,
        "default_rest": 60,
        "rpe": 7,
        "tags": ["isometric", "core_stability", "bodyweight", "beginner_friendly"]
    }
]

# ============================================================================
# FOODS DATA - Nutritional Database
# ============================================================================

FOODS_DATA = [
    # PROTEIN SOURCES
    {
        "food_id": "food_chicken_breast",
        "name": "Chicken Breast (Skinless)",
        "category": "protein",
        "subcategory": "poultry",
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fat": 3.6,
        "fiber": 0,
        "macros": {"protein": 31, "carbohydrates": 0, "fat": 3.6, "fiber": 0, "sugar": 0},
        "micros": {"vitamins": {"vitaminB3": 14.8, "vitaminB6": 0.9, "vitaminB12": 0.3}, "minerals": {"phosphorus": 228, "selenium": 27.6, "zinc": 1.0}},
        "protein_type": "complete",
        "protein_digestibility": 97,
        "digestion_speed": "moderate",
        "ideal_timing": ["anytime", "post_workout"],
        "restrictions": ["gluten_free", "dairy_free"],
        "allergens": [],
        "benefits": "High protein, low fat, excellent bioavailability, rich in leucine for muscle protein synthesis",
        "tags": ["lean_protein", "muscle_building", "staple", "versatile"]
    },
    {
        "food_id": "food_salmon",
        "name": "Atlantic Salmon (Wild)",
        "category": "protein",
        "subcategory": "fish",
        "calories": 206,
        "protein": 25,
        "carbs": 0,
        "fat": 11,
        "fiber": 0,
        "macros": {"protein": 25, "carbohydrates": 0, "fat": 11, "omega3": 2.5, "omega6": 0.2},
        "micros": {"vitamins": {"vitaminD": 10.9, "vitaminB12": 3.2}, "minerals": {"selenium": 41.4, "phosphorus": 252}},
        "protein_type": "complete",
        "protein_digestibility": 95,
        "digestion_speed": "moderate",
        "ideal_timing": ["anytime", "post_workout"],
        "restrictions": ["gluten_free", "dairy_free"],
        "allergens": ["fish"],
        "benefits": "Ultra-high omega-3, anti-inflammatory, heart health, vitamin D, supports brain health",
        "tags": ["omega3", "healthy_fats", "premium", "brain_health"]
    },
    {
        "food_id": "food_turkey_breast",
        "name": "Turkey Breast (Skinless)",
        "category": "protein",
        "subcategory": "poultry",
        "calories": 135,
        "protein": 30,
        "carbs": 0,
        "fat": 1,
        "fiber": 0,
        "protein_type": "complete",
        "protein_digestibility": 96,
        "ideal_timing": ["anytime", "post_workout"],
        "restrictions": ["gluten_free", "dairy_free"],
        "allergens": [],
        "benefits": "Very high protein, extremely low fat, excellent for cutting",
        "tags": ["lean_protein", "cutting", "muscle_building"]
    },
    {
        "food_id": "food_beef_sirloin",
        "name": "Beef Sirloin (Lean)",
        "category": "protein",
        "subcategory": "red_meat",
        "calories": 250,
        "protein": 26,
        "carbs": 0,
        "fat": 15,
        "fiber": 0,
        "protein_type": "complete",
        "protein_digestibility": 94,
        "ideal_timing": ["anytime", "post_workout"],
        "restrictions": ["gluten_free", "dairy_free"],
        "allergens": [],
        "benefits": "High in zinc and iron, complete protein, supports testosterone production",
        "tags": ["red_meat", "zinc", "iron", "testosterone"]
    },
    {
        "food_id": "food_eggs_whole",
        "name": "Whole Eggs",
        "category": "protein",
        "subcategory": "eggs",
        "calories": 143,
        "protein": 12.6,
        "carbs": 0.7,
        "fat": 9.5,
        "fiber": 0,
        "macros": {"protein": 12.6, "carbohydrates": 0.7, "fat": 9.5, "cholesterol": 373},
        "micros": {"vitamins": {"vitaminB12": 0.6, "vitaminD": 1.1, "choline": 293}, "minerals": {"selenium": 15.4}},
        "protein_type": "complete",
        "protein_digestibility": 100,
        "digestion_speed": "moderate",
        "ideal_timing": ["breakfast", "anytime"],
        "restrictions": ["gluten_free", "dairy_free"],
        "allergens": ["eggs"],
        "benefits": "Highest biological value protein, rich in choline, complete amino acid profile",
        "tags": ["complete_protein", "bioavailable", "breakfast", "versatile"]
    },

    # DAIRY & ALTERNATIVES
    {
        "food_id": "food_greek_yogurt",
        "name": "Greek Yogurt (Non-fat)",
        "category": "dairy",
        "subcategory": "yogurt",
        "calories": 100,
        "protein": 17,
        "carbs": 6,
        "fat": 0.7,
        "fiber": 0,
        "protein_type": "complete",
        "protein_digestibility": 90,
        "ideal_timing": ["breakfast", "snack"],
        "restrictions": ["gluten_free"],
        "allergens": ["dairy"],
        "benefits": "High protein, probiotics, slow-digesting casein, convenient",
        "tags": ["high_protein", "probiotics", "convenient", "slow_digesting"]
    },
    {
        "food_id": "food_cottage_cheese",
        "name": "Low-Fat Cottage Cheese",
        "category": "dairy",
        "subcategory": "cheese",
        "calories": 90,
        "protein": 12,
        "carbs": 3,
        "fat": 2.3,
        "fiber": 0,
        "protein_type": "complete",
        "protein_digestibility": 95,
        "ideal_timing": ["anytime", "bedtime"],
        "restrictions": ["gluten_free"],
        "allergens": ["dairy"],
        "benefits": "Casein-rich, slow-digesting protein, calcium-rich",
        "tags": ["casein", "slow_digesting", "calcium"]
    },

    # CARBOHYDRATES
    {
        "food_id": "food_white_rice",
        "name": "White Rice (Cooked)",
        "category": "carbohydrate",
        "subcategory": "grains",
        "calories": 130,
        "protein": 2.7,
        "carbs": 28,
        "fat": 0.3,
        "fiber": 0.4,
        "glycemic_index": 73,
        "digestion_speed": "fast",
        "ideal_timing": ["post_workout", "with_protein"],
        "restrictions": ["gluten_free", "dairy_free"],
        "allergens": [],
        "benefits": "Quick-digesting carb for glycogen replenishment, easy on digestion",
        "tags": ["fast_carb", "post_workout", "glycogen_replenishment"]
    },
    {
        "food_id": "food_sweet_potato",
        "name": "Sweet Potato (Baked)",
        "category": "carbohydrate",
        "subcategory": "vegetables",
        "calories": 90,
        "protein": 2,
        "carbs": 21,
        "fat": 0.2,
        "fiber": 3.3,
        "glycemic_index": 63,
        "digestion_speed": "moderate",
        "ideal_timing": ["anytime", "post_workout"],
        "restrictions": ["gluten_free", "dairy_free", "vegan"],
        "allergens": [],
        "benefits": "High in vitamin A, moderate GI, antioxidant-rich, potassium-dense",
        "tags": ["complex_carb", "nutrient_dense", "potassium", "vitamin_a"]
    },
    {
        "food_id": "food_oatmeal",
        "name": "Oatmeal (Rolled Oats)",
        "category": "carbohydrate",
        "subcategory": "grains",
        "calories": 190,
        "protein": 6.7,
        "carbs": 34,
        "fat": 3.4,
        "fiber": 5,
        "glycemic_index": 55,
        "digestion_speed": "slow",
        "ideal_timing": ["breakfast", "pre_workout"],
        "restrictions": ["dairy_free", "vegan"],
        "allergens": [],
        "benefits": "High in beta-glucan fiber, slow-digesting, heart-healthy, good protein content",
        "tags": ["slow_carb", "breakfast", "fiber_rich", "beta_glucan"]
    },
    {
        "food_id": "food_quinoa",
        "name": "Quinoa (Cooked)",
        "category": "carbohydrate",
        "subcategory": "grains",
        "calories": 120,
        "protein": 4.4,
        "carbs": 21,
        "fat": 1.9,
        "fiber": 2.6,
        "glycemic_index": 53,
        "digestion_speed": "moderate",
        "ideal_timing": ["anytime", "post_workout"],
        "restrictions": ["gluten_free", "dairy_free", "vegan"],
        "allergens": [],
        "benefits": "Complete protein, high in minerals, good amino acid profile",
        "tags": ["complete_protein", "minerals", "pseudo_grain"]
    },

    # FRUITS
    {
        "food_id": "food_banana",
        "name": "Banana",
        "category": "fruit",
        "subcategory": "tropical",
        "calories": 105,
        "protein": 1.3,
        "carbs": 27,
        "fat": 0.4,
        "fiber": 3.1,
        "glycemic_index": 51,
        "digestion_speed": "fast",
        "ideal_timing": ["pre_workout", "post_workout", "snack"],
        "restrictions": ["gluten_free", "dairy_free", "vegan"],
        "allergens": [],
        "benefits": "High in potassium, convenient energy source, good for cramping",
        "tags": ["quick_carb", "potassium", "pre_workout", "convenient"]
    },
    {
        "food_id": "food_blueberries",
        "name": "Blueberries",
        "category": "fruit",
        "subcategory": "berries",
        "calories": 84,
        "protein": 1.1,
        "carbs": 21,
        "fat": 0.5,
        "fiber": 3.6,
        "glycemic_index": 53,
        "digestion_speed": "fast",
        "ideal_timing": ["anytime", "post_workout"],
        "restrictions": ["gluten_free", "dairy_free", "vegan"],
        "allergens": [],
        "benefits": "Highest antioxidant content, supports brain health, anti-inflammatory",
        "tags": ["antioxidants", "brain_health", "anti_inflammatory"]
    },
    {
        "food_id": "food_apple",
        "name": "Apple",
        "category": "fruit",
        "subcategory": "pome",
        "calories": 95,
        "protein": 0.5,
        "carbs": 25,
        "fat": 0.3,
        "fiber": 4.4,
        "glycemic_index": 39,
        "digestion_speed": "moderate",
        "ideal_timing": ["anytime", "snack"],
        "restrictions": ["gluten_free", "dairy_free", "vegan"],
        "allergens": [],
        "benefits": "High fiber, low GI, supports satiety, good for gut health",
        "tags": ["fiber", "low_gi", "satiety", "gut_health"]
    },

    # VEGETABLES
    {
        "food_id": "food_broccoli",
        "name": "Broccoli (Cooked)",
        "category": "vegetable",
        "subcategory": "cruciferous",
        "calories": 35,
        "protein": 2.4,
        "carbs": 7,
        "fat": 0.4,
        "fiber": 3.3,
        "glycemic_index": 15,
        "digestion_speed": "moderate",
        "ideal_timing": ["anytime", "with_meals"],
        "restrictions": ["gluten_free", "dairy_free", "vegan"],
        "allergens": [],
        "benefits": "Very high in vitamin C and K, sulforaphane, supports detoxification",
        "tags": ["vitamin_c", "vitamin_k", "detoxification", "cruciferous"]
    },
    {
        "food_id": "food_spinach",
        "name": "Spinach (Raw)",
        "category": "vegetable",
        "subcategory": "leafy_green",
        "calories": 23,
        "protein": 2.9,
        "carbs": 3.6,
        "fat": 0.4,
        "fiber": 2.2,
        "glycemic_index": 15,
        "digestion_speed": "fast",
        "ideal_timing": ["anytime"],
        "restrictions": ["gluten_free", "dairy_free", "vegan"],
        "allergens": [],
        "benefits": "Extremely nutrient-dense, high iron, nitrate for blood flow",
        "tags": ["nutrient_dense", "iron", "blood_flow", "leafy_green"]
    },
    {
        "food_id": "food_bell_pepper",
        "name": "Red Bell Pepper",
        "category": "vegetable",
        "subcategory": "nightshade",
        "calories": 31,
        "protein": 1,
        "carbs": 6,
        "fat": 0.3,
        "fiber": 2.1,
        "glycemic_index": 15,
        "digestion_speed": "moderate",
        "ideal_timing": ["anytime"],
        "restrictions": ["gluten_free", "dairy_free", "vegan"],
        "allergens": [],
        "benefits": "Highest vitamin C of vegetables, colorful phytonutrients",
        "tags": ["vitamin_c", "phytonutrients", "colorful", "low_calorie"]
    },

    # HEALTHY FATS
    {
        "food_id": "food_avocado",
        "name": "Avocado",
        "category": "healthy_fat",
        "subcategory": "fruit",
        "calories": 160,
        "protein": 2,
        "carbs": 8.5,
        "fat": 15,
        "fiber": 6.7,
        "glycemic_index": 15,
        "digestion_speed": "moderate",
        "ideal_timing": ["with_meals", "anytime"],
        "restrictions": ["gluten_free", "dairy_free", "vegan"],
        "allergens": [],
        "benefits": "Rich in monounsaturated fats, potassium, promotes nutrient absorption",
        "tags": ["monounsaturated_fats", "potassium", "nutrient_absorption"]
    },
    {
        "food_id": "food_almonds",
        "name": "Almonds (Raw)",
        "category": "healthy_fat",
        "subcategory": "nuts",
        "calories": 164,
        "protein": 6,
        "carbs": 6,
        "fat": 14,
        "fiber": 3.5,
        "glycemic_index": 0,
        "digestion_speed": "slow",
        "ideal_timing": ["snack", "anytime"],
        "restrictions": ["gluten_free", "dairy_free", "vegan"],
        "allergens": ["nuts"],
        "benefits": "Very high in vitamin E, magnesium, promotes satiety",
        "tags": ["vitamin_e", "magnesium", "satiety", "nuts"]
    },
    {
        "food_id": "food_olive_oil",
        "name": "Extra Virgin Olive Oil",
        "category": "healthy_fat",
        "subcategory": "oils",
        "calories": 119,
        "protein": 0,
        "carbs": 0,
        "fat": 13.5,
        "fiber": 0,
        "glycemic_index": 0,
        "digestion_speed": "moderate",
        "ideal_timing": ["with_meals"],
        "restrictions": ["gluten_free", "dairy_free", "vegan"],
        "allergens": [],
        "benefits": "Rich in oleic acid, polyphenols, anti-inflammatory",
        "tags": ["oleic_acid", "polyphenols", "anti_inflammatory", "cooking"]
    },
    {
        "food_id": "food_peanut_butter",
        "name": "Natural Peanut Butter",
        "category": "healthy_fat",
        "subcategory": "nut_butters",
        "calories": 190,
        "protein": 8,
        "carbs": 7,
        "fat": 16,
        "fiber": 2,
        "glycemic_index": 14,
        "digestion_speed": "slow",
        "ideal_timing": ["anytime", "between_meals"],
        "restrictions": ["gluten_free", "dairy_free", "vegan"],
        "allergens": ["peanuts"],
        "benefits": "Calorie-dense, good protein, healthy fats, affordable",
        "tags": ["calorie_dense", "affordable", "convenient", "protein"]
    }
]

# ============================================================================
# SUPPLEMENTS DATA - Evidence-Based Recommendations
# ============================================================================

SUPPLEMENTS_DATA = [
    # CREATINE SUPPLEMENTS
    {
        "supplement_id": "creatine_monohydrate",
        "name": "Creatine Monohydrate",
        "category": "creatine",
        "standard_dose": 5,
        "dose_unit": "g",
        "frequency_per_day": 1,
        "timing": ["anytime"],
        "evidence_level": "strong",
        "primary_benefits": ["Increases muscle creatine stores", "Enhances strength (3-5%)", "Supports lean mass gains"],
        "secondary_benefits": ["Neuroprotective properties", "May support cognitive function"],
        "mechanisms": ["Increases phosphocreatine for ATP regeneration", "Cellular hydration"],
        "meta_analysis_findings": "500+ studies confirm efficacy. Meta-analyses show consistent ~5% strength gains",
        "side_effects": ["Water retention (not fat)", "Mild GI distress"],
        "contraindications": ["Kidney disease"],
        "pregnancy_safe": False,
        "breastfeeding_safe": False,
        "goals": ["strength_gain", "muscle_growth", "power_output"],
        "stacks_with": ["beta_alanine", "protein"],
        "cost_effectiveness": "very_high",
        "taste_rating": 3,
        "mixability": "good",
        "tags": ["most_researched", "highly_effective", "affordable", "essential"],
        "popularity_score": 98,
        "scientific_rating": 10
    },

    # PROTEIN SUPPLEMENTS
    {
        "supplement_id": "whey_protein_isolate",
        "name": "Whey Protein Isolate",
        "category": "protein",
        "standard_dose": 25,
        "dose_unit": "g",
        "frequency_per_day": 1,
        "timing": ["post_workout"],
        "evidence_level": "strong",
        "primary_benefits": ["Rapid MPS elevation", "Highest leucine content", "Complete amino acid profile"],
        "secondary_benefits": ["Supports recovery", "Convenient protein source"],
        "mechanisms": ["Fast-digesting protein", "High leucine stimulates MPS"],
        "meta_analysis_findings": "Superior to casein for post-workout MPS",
        "goals": ["muscle_growth", "recovery"],
        "tags": ["fast_digesting", "high_leucine", "convenient"],
        "popularity_score": 95,
        "scientific_rating": 9
    },
    {
        "supplement_id": "casein_protein",
        "name": "Micellar Casein",
        "category": "protein",
        "standard_dose": 30,
        "dose_unit": "g",
        "frequency_per_day": 1,
        "timing": ["before_bed"],
        "evidence_level": "strong",
        "primary_benefits": ["Slow-digesting protein", "Anti-catabolic", "Sustained amino acid release"],
        "secondary_benefits": ["Supports overnight recovery"],
        "mechanisms": ["Forms gel in stomach", "Slow amino acid release"],
        "meta_analysis_findings": "Superior to whey for prolonged MPS during fasting",
        "goals": ["muscle_growth", "recovery"],
        "tags": ["slow_digesting", "anti_catabolic", "bedtime"],
        "popularity_score": 80,
        "scientific_rating": 8
    },

    # AMINO ACIDS
    {
        "supplement_id": "beta_alanine",
        "name": "Beta-Alanine",
        "category": "amino_acid",
        "standard_dose": 3.2,
        "dose_unit": "g",
        "frequency_per_day": 1,
        "timing": ["anytime"],
        "evidence_level": "strong",
        "primary_benefits": ["Increases muscle carnosine", "Buffers lactic acid", "Improves 60-240s performance"],
        "secondary_benefits": ["Reduces fatigue", "Synergistic with creatine"],
        "mechanisms": ["Increases intramuscular carnosine", "Buffers hydrogen ions"],
        "meta_analysis_findings": "Consistent 2-3% improvement in high-intensity performance",
        "side_effects": ["Harmless paresthesia (tingling)"],
        "goals": ["endurance", "power_output"],
        "tags": ["buffering", "endurance", "proven"],
        "popularity_score": 85,
        "scientific_rating": 9
    },

    # PRE-WORKOUT SUPPLEMENTS
    {
        "supplement_id": "citrulline_malate",
        "name": "Citrulline Malate",
        "category": "pre_workout",
        "standard_dose": 8,
        "dose_unit": "g",
        "frequency_per_day": 1,
        "timing": ["pre_workout"],
        "evidence_level": "moderate",
        "primary_benefits": ["Increases nitric oxide", "Enhances blood flow", "Reduces fatigue"],
        "secondary_benefits": ["May increase training volume"],
        "mechanisms": ["Converts to arginine", "NO production"],
        "meta_analysis_findings": "Meta-analyses show reduced fatigue and improved endurance",
        "goals": ["endurance", "pump", "performance"],
        "tags": ["nitric_oxide", "pump", "endurance"],
        "popularity_score": 75,
        "scientific_rating": 7
    },
    {
        "supplement_id": "caffeine",
        "name": "Caffeine Anhydrous",
        "category": "pre_workout",
        "standard_dose": 200,
        "dose_unit": "mg",
        "frequency_per_day": 1,
        "timing": ["pre_workout"],
        "evidence_level": "strong",
        "primary_benefits": ["Increases alertness", "Enhances endurance", "Reduces perceived exertion"],
        "secondary_benefits": ["May increase power output", "Thermogenic effect"],
        "mechanisms": ["Adenosine receptor antagonist", "CNS stimulation"],
        "meta_analysis_findings": "One of most effective ergogenic aids, 2-4% performance improvement",
        "side_effects": ["Jitters", "Anxiety", "Insomnia"],
        "contraindications": ["Cardiovascular conditions"],
        "goals": ["focus_energy", "endurance", "strength_gain"],
        "tags": ["stimulant", "proven", "performance"],
        "popularity_score": 95,
        "scientific_rating": 10
    },

    # VITAMINS & MINERALS
    {
        "supplement_id": "vitamin_d3",
        "name": "Vitamin D3",
        "category": "vitamin",
        "standard_dose": 2000,
        "dose_unit": "IU",
        "frequency_per_day": 1,
        "timing": ["with_meals"],
        "evidence_level": "strong",
        "primary_benefits": ["Supports bone health", "Immune function", "May support testosterone"],
        "secondary_benefits": ["Mood regulation", "Muscle function"],
        "mechanisms": ["Vitamin D receptor activation", "Calcium metabolism"],
        "meta_analysis_findings": "Strong evidence for deficiency correction and health benefits",
        "goals": ["hormone_optimization", "immune_health"],
        "tags": ["essential", "deficiency_common", "testosterone"],
        "popularity_score": 90,
        "scientific_rating": 9
    },
    {
        "supplement_id": "magnesium_glycinate",
        "name": "Magnesium Glycinate",
        "category": "mineral",
        "standard_dose": 400,
        "dose_unit": "mg",
        "frequency_per_day": 1,
        "timing": ["before_bed"],
        "evidence_level": "strong",
        "primary_benefits": ["Muscle relaxation", "Sleep quality", "Reduces cramps"],
        "secondary_benefits": ["300+ enzymatic reactions", "Stress reduction"],
        "mechanisms": ["Magnesium-dependent enzymes", "GABA receptor modulation"],
        "meta_analysis_findings": "Strong evidence for sleep and recovery benefits",
        "goals": ["recovery", "sleep_quality", "stress_management"],
        "tags": ["recovery", "sleep", "essential"],
        "popularity_score": 85,
        "scientific_rating": 8
    },

    # GENERAL HEALTH
    {
        "supplement_id": "fish_oil",
        "name": "Fish Oil (EPA/DHA)",
        "category": "general_health",
        "standard_dose": 2000,
        "dose_unit": "mg",
        "frequency_per_day": 1,
        "timing": ["with_meals"],
        "evidence_level": "strong",
        "primary_benefits": ["Anti-inflammatory", "Cardiovascular health", "Brain health"],
        "secondary_benefits": ["Joint health", "Mood support", "Recovery"],
        "mechanisms": ["Omega-3 incorporation", "Anti-inflammatory eicosanoids"],
        "meta_analysis_findings": "Strong cardiovascular benefits, moderate recovery effects",
        "goals": ["cardiovascular_health", "recovery", "joint_health"],
        "tags": ["anti_inflammatory", "heart_health", "essential"],
        "popularity_score": 88,
        "scientific_rating": 9
    },

    # JOINT SUPPORT
    {
        "supplement_id": "collagen_peptides",
        "name": "Collagen Peptides",
        "category": "joint_support",
        "standard_dose": 15,
        "dose_unit": "g",
        "frequency_per_day": 1,
        "timing": ["anytime"],
        "evidence_level": "moderate",
        "primary_benefits": ["Joint health", "Cartilage support", "Skin elasticity"],
        "secondary_benefits": ["Tendon health", "Gut lining"],
        "mechanisms": ["Collagen synthesis", "Chondrocyte activity"],
        "meta_analysis_findings": "Reduced joint pain in athletes after 12+ weeks",
        "goals": ["joint_health", "recovery"],
        "tags": ["joint_health", "connective_tissue", "long_term"],
        "popularity_score": 82,
        "scientific_rating": 7
    },

    # SLEEP & RECOVERY
    {
        "supplement_id": "melatonin",
        "name": "Melatonin",
        "category": "sleep_recovery",
        "standard_dose": 3,
        "dose_unit": "mg",
        "frequency_per_day": 1,
        "timing": ["before_bed"],
        "evidence_level": "strong",
        "primary_benefits": ["Reduces sleep latency", "Improves sleep quality", "Circadian rhythm"],
        "secondary_benefits": ["Antioxidant", "Immune support"],
        "mechanisms": ["Melatonin receptor binding", "Circadian synchronization"],
        "meta_analysis_findings": "Meta-analyses confirm reduced sleep latency and improved quality",
        "goals": ["sleep_quality", "recovery"],
        "tags": ["sleep", "recovery", "circadian"],
        "popularity_score": 85,
        "scientific_rating": 8
    },
    {
        "supplement_id": "ashwagandha",
        "name": "Ashwagandha (KSM-66)",
        "category": "adaptogen",
        "standard_dose": 600,
        "dose_unit": "mg",
        "frequency_per_day": 2,
        "timing": ["morning", "before_bed"],
        "evidence_level": "strong",
        "primary_benefits": ["Reduces cortisol", "Stress reduction", "May increase testosterone"],
        "secondary_benefits": ["Sleep quality", "Strength gains"],
        "mechanisms": ["HPA axis modulation", "Cortisol reduction"],
        "meta_analysis_findings": "Multiple RCTs show stress and cortisol reduction",
        "goals": ["stress_management", "hormone_optimization", "sleep_quality"],
        "tags": ["adaptogen", "stress", "cortisol", "testosterone"],
        "popularity_score": 78,
        "scientific_rating": 8
    }
]


def seed_database():
    """Seed the database with rich scientific data"""
    db = SessionLocal()
    
    try:
        # Import models
        from app.models.sql_models_extended import Exercise, Food, Supplement
        
        logger.info("Starting database seeding...")
        
        # Seed Exercises
        exercise_count = db.query(Exercise).count()
        if exercise_count == 0:
            logger.info(f"Seeding {len(EXERCISES_DATA)} exercises...")
            for ex_data in EXERCISES_DATA:
                exercise = Exercise(**ex_data)
                db.add(exercise)
            db.commit()
            logger.info(f"✓ Seeded {len(EXERCISES_DATA)} exercises")
        else:
            logger.info(f"Exercises already seeded ({exercise_count} found)")
        
        # Seed Foods
        food_count = db.query(Food).count()
        if food_count == 0:
            logger.info(f"Seeding {len(FOODS_DATA)} foods...")
            for food_data in FOODS_DATA:
                food = Food(**food_data)
                db.add(food)
            db.commit()
            logger.info(f"✓ Seeded {len(FOODS_DATA)} foods")
        else:
            logger.info(f"Foods already seeded ({food_count} found)")
        
        # Seed Supplements
        supplement_count = db.query(Supplement).count()
        if supplement_count == 0:
            logger.info(f"Seeding {len(SUPPLEMENTS_DATA)} supplements...")
            for supp_data in SUPPLEMENTS_DATA:
                supplement = Supplement(**supp_data)
                db.add(supplement)
            db.commit()
            logger.info(f"✓ Seeded {len(SUPPLEMENTS_DATA)} supplements")
        else:
            logger.info(f"Supplements already seeded ({supplement_count} found)")
        
        logger.info("✓ Database seeding completed successfully!")
        
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    logger.info("Running seed script...")
    Base.metadata.create_all(bind=engine)
    seed_database()
