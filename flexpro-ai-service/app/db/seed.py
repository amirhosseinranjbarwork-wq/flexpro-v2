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
    {
        "id": "food_chicken_breast",
        "name": "Chicken Breast (Skinless)",
        "category": "protein",
        "serving_size": 100,
        "serving_unit": "100g",
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fat": 3.6,
        "fiber": 0,
        "benefits": "High protein, low fat, excellent bioavailability",
        "tags": ["lean_protein", "muscle_building", "staple"]
    },
    {
        "id": "food_salmon",
        "name": "Atlantic Salmon (Wild)",
        "category": "protein",
        "serving_size": 100,
        "serving_unit": "100g",
        "calories": 206,
        "protein": 25,
        "carbs": 0,
        "fat": 11,
        "fiber": 0,
        "benefits": "Ultra-high omega-3, anti-inflammatory, heart health",
        "tags": ["omega3", "healthy_fats", "premium"]
    },
    {
        "id": "food_eggs_whole",
        "name": "Whole Eggs",
        "category": "protein",
        "serving_size": 100,
        "serving_unit": "2 large eggs",
        "calories": 143,
        "protein": 12.6,
        "carbs": 0.7,
        "fat": 9.5,
        "fiber": 0,
        "benefits": "Highest biological value protein, rich in choline",
        "tags": ["complete_protein", "bioavailable", "breakfast"]
    },
    {
        "id": "food_greek_yogurt",
        "name": "Greek Yogurt (Non-fat)",
        "category": "dairy",
        "serving_size": 170,
        "serving_unit": "1 container",
        "calories": 100,
        "protein": 17,
        "carbs": 6,
        "fat": 0.7,
        "fiber": 0,
        "benefits": "High protein, probiotics, slow-digesting casein",
        "tags": ["high_protein", "probiotics", "convenient"]
    },
    {
        "id": "food_white_rice",
        "name": "White Rice (Cooked)",
        "category": "carbohydrate",
        "serving_size": 100,
        "serving_unit": "1/2 cup cooked",
        "calories": 130,
        "protein": 2.7,
        "carbs": 28,
        "fat": 0.3,
        "fiber": 0.4,
        "benefits": "Quick-digesting carb for post-workout, easy on digestion",
        "tags": ["fast_carb", "post_workout", "staple"]
    },
    {
        "id": "food_sweet_potato",
        "name": "Sweet Potato (Baked)",
        "category": "carbohydrate",
        "serving_size": 100,
        "serving_unit": "1 medium",
        "calories": 90,
        "protein": 2,
        "carbs": 21,
        "fat": 0.2,
        "fiber": 3.3,
        "benefits": "High in vitamin A, moderate GI, antioxidant-rich",
        "tags": ["complex_carb", "nutrient_dense", "paleo"]
    },
    {
        "id": "food_oatmeal",
        "name": "Oatmeal (Rolled Oats)",
        "category": "grain",
        "serving_size": 50,
        "serving_unit": "1/2 cup dry",
        "calories": 190,
        "protein": 6.7,
        "carbs": 34,
        "fat": 3.4,
        "fiber": 5,
        "benefits": "High in beta-glucan fiber, slow-digesting, heart-healthy",
        "tags": ["slow_carb", "breakfast", "fiber_rich"]
    },
    {
        "id": "food_banana",
        "name": "Banana",
        "category": "fruit",
        "serving_size": 120,
        "serving_unit": "1 medium",
        "calories": 105,
        "protein": 1.3,
        "carbs": 27,
        "fat": 0.4,
        "fiber": 3.1,
        "benefits": "High in potassium, quick energy, convenient",
        "tags": ["quick_carb", "potassium", "pre_workout"]
    },
    {
        "id": "food_avocado",
        "name": "Avocado",
        "category": "healthy_fat",
        "serving_size": 100,
        "serving_unit": "1/2 medium",
        "calories": 160,
        "protein": 2,
        "carbs": 8.5,
        "fat": 15,
        "fiber": 6.7,
        "benefits": "Rich in monounsaturated fats, high potassium, promotes nutrient absorption",
        "tags": ["healthy_fats", "heart_health", "keto"]
    },
    {
        "id": "food_almonds",
        "name": "Almonds (Raw)",
        "category": "nut_seed",
        "serving_size": 28,
        "serving_unit": "1 oz (23 almonds)",
        "calories": 164,
        "protein": 6,
        "carbs": 6,
        "fat": 14,
        "fiber": 3.5,
        "benefits": "Very high in vitamin E, good magnesium source, promotes satiety",
        "tags": ["healthy_fats", "snack", "portable"]
    },
    {
        "id": "food_broccoli",
        "name": "Broccoli (Cooked)",
        "category": "vegetable",
        "serving_size": 100,
        "serving_unit": "1 cup",
        "calories": 35,
        "protein": 2.4,
        "carbs": 7,
        "fat": 0.4,
        "fiber": 3.3,
        "benefits": "Very high in vitamin C and K, contains sulforaphane, high fiber",
        "tags": ["low_calorie", "nutrient_dense", "cruciferous"]
    },
    {
        "id": "food_spinach",
        "name": "Spinach (Raw)",
        "category": "vegetable",
        "serving_size": 100,
        "serving_unit": "3 cups raw",
        "calories": 23,
        "protein": 2.9,
        "carbs": 3.6,
        "fat": 0.4,
        "fiber": 2.2,
        "benefits": "Extremely nutrient-dense, high in iron, nitrate content for blood flow",
        "tags": ["low_calorie", "iron", "leafy_green"]
    }
]

# ============================================================================
# SUPPLEMENTS DATA - Evidence-Based Recommendations
# ============================================================================

SUPPLEMENTS_DATA = [
    {
        "id": "supp_creatine_monohydrate",
        "name": "Creatine Monohydrate",
        "category": "creatine",
        "standard_dose": 5,
        "dose_unit": "g",
        "timing": "anytime",
        "evidence_level": "strong",
        "benefits": "Increases muscle creatine stores, enhances strength (3-5%), supports lean mass gains",
        "instructions": "5g daily, loading phase optional (20g for 5 days)",
        "tags": ["most_researched", "highly_effective", "affordable"]
    },
    {
        "id": "supp_whey_isolate",
        "name": "Whey Protein Isolate",
        "category": "protein",
        "standard_dose": 25,
        "dose_unit": "g",
        "timing": "post_workout",
        "evidence_level": "strong",
        "benefits": "Rapidly elevates muscle protein synthesis, highest leucine content, supports recovery",
        "instructions": "25g per serving, 0.25g/kg bodyweight optimal for MPS",
        "tags": ["fast_digesting", "high_leucine", "convenient"]
    },
    {
        "id": "supp_beta_alanine",
        "name": "Beta-Alanine",
        "category": "amino_acid",
        "standard_dose": 3.2,
        "dose_unit": "g",
        "timing": "anytime",
        "evidence_level": "strong",
        "benefits": "Increases muscle carnosine (up to 80%), buffers lactic acid, improves 60-240s exercise performance",
        "instructions": "3.2g daily split into 2 doses, timing irrelevant (works via saturation)",
        "tags": ["endurance", "buffering", "proven"]
    },
    {
        "id": "supp_citrulline",
        "name": "Citrulline Malate",
        "category": "pre_workout",
        "standard_dose": 8,
        "dose_unit": "g",
        "timing": "pre_workout",
        "evidence_level": "moderate",
        "benefits": "Increases nitric oxide, enhances blood flow and pump, may increase training volume by 10%",
        "instructions": "8g citrulline malate (6g pure citrulline), take 30-60 min pre-workout",
        "tags": ["nitric_oxide", "pump", "endurance"]
    },
    {
        "id": "supp_vitamin_d3",
        "name": "Vitamin D3",
        "category": "vitamin",
        "standard_dose": 2000,
        "dose_unit": "IU",
        "timing": "with_meals",
        "evidence_level": "strong",
        "benefits": "Supports bone health, immune function, may support testosterone, mood regulation",
        "instructions": "2000 IU daily with fats, dose based on blood levels (aim 40-60 ng/mL)",
        "tags": ["essential", "deficiency_common", "testosterone"]
    },
    {
        "id": "supp_fish_oil",
        "name": "Fish Oil (EPA/DHA)",
        "category": "general_health",
        "standard_dose": 2000,
        "dose_unit": "mg",
        "timing": "with_meals",
        "evidence_level": "strong",
        "benefits": "Powerful anti-inflammatory, supports heart health, may reduce DOMS, brain health",
        "instructions": "1-3g combined EPA+DHA daily with food",
        "tags": ["anti_inflammatory", "heart_health", "recovery"]
    },
    {
        "id": "supp_magnesium",
        "name": "Magnesium Glycinate",
        "category": "mineral",
        "standard_dose": 400,
        "dose_unit": "mg",
        "timing": "before_bed",
        "evidence_level": "strong",
        "benefits": "Supports muscle relaxation, improves sleep quality, reduces cramps, over 300 enzymatic reactions",
        "instructions": "400mg before bed, glycinate for sleep/recovery",
        "tags": ["recovery", "sleep", "essential"]
    },
    {
        "id": "supp_caffeine",
        "name": "Caffeine Anhydrous",
        "category": "pre_workout",
        "standard_dose": 200,
        "dose_unit": "mg",
        "timing": "pre_workout",
        "evidence_level": "strong",
        "benefits": "Increases alertness, enhances endurance (2-4%), reduces perceived exertion, may increase power",
        "instructions": "3-6mg/kg bodyweight, take 30-60 min pre-workout, avoid within 6 hours of sleep",
        "tags": ["stimulant", "proven", "performance"]
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
