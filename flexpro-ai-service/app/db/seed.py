"""
Database Seeding Script
Populates the SQLite database with initial exercise data
"""

import json
import sys
from pathlib import Path
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, init_db
from app.models.sql_models import Exercise, User, Food, WorkoutPlan
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def seed_exercises(db: Session, exercises_data: list = None):
    """
    Seed exercises table
    
    Args:
        db: Database session
        exercises_data: List of exercise dictionaries. If None, uses default exercises.
    """
    # Check if exercises already exist
    existing_count = db.query(Exercise).count()
    if existing_count > 0:
        print(f"Exercises table already has {existing_count} entries. Skipping seed.")
        return
    
    # Default exercises if none provided
    if exercises_data is None:
        exercises_data = get_default_exercises()
    
    print(f"Seeding {len(exercises_data)} exercises...")
    
    for exercise_data in exercises_data:
        # Extract basic fields
        exercise_id = exercise_data.get("id", "")
        name = exercise_data.get("name", "")
        category = exercise_data.get("category", "")
        
        # Extract muscle group (from primaryMuscles array or muscle_group field)
        primary_muscles = exercise_data.get("primaryMuscles", [])
        if primary_muscles and isinstance(primary_muscles, list) and len(primary_muscles) > 0:
            muscle_group = primary_muscles[0] if isinstance(primary_muscles[0], str) else primary_muscles[0].value if hasattr(primary_muscles[0], 'value') else str(primary_muscles[0])
        else:
            muscle_group = exercise_data.get("muscle_group", "")
        
        # Extract equipment
        equipment_list = exercise_data.get("equipment", [])
        if equipment_list and isinstance(equipment_list, list) and len(equipment_list) > 0:
            equipment = equipment_list[0] if isinstance(equipment_list[0], str) else equipment_list[0].value if hasattr(equipment_list[0], 'value') else str(equipment_list[0])
        else:
            equipment = exercise_data.get("equipment", "")
        
        exercise_type = exercise_data.get("type", "")
        difficulty = exercise_data.get("difficulty", "")
        
        # Store full exercise data as JSON
        scientific_data = {
            "id": exercise_id,
            "name": name,
            "category": category,
            "primaryMuscles": primary_muscles,
            "secondaryMuscles": exercise_data.get("secondaryMuscles", []),
            "equipment": equipment_list,
            "movementPattern": exercise_data.get("movementPattern", ""),
            "difficulty": difficulty,
            "description": exercise_data.get("description", ""),
            "cues": exercise_data.get("cues", []),
            "commonMistakes": exercise_data.get("commonMistakes", []),
            "tags": exercise_data.get("tags", []),
            "defaultParameters": exercise_data.get("defaultParameters", {}),
        }
        
        exercise = Exercise(
            exercise_id=exercise_id,
            name=name,
            category=category,
            muscle_group=muscle_group,
            equipment=equipment,
            type=exercise_type,
            difficulty=difficulty,
            scientific_data=scientific_data
        )
        
        db.add(exercise)
    
    db.commit()
    print(f"✅ Successfully seeded {len(exercises_data)} exercises")


def get_default_exercises():
    """
    Returns a list of default exercises to seed the database
    This is a minimal set - in production, load from JSON file exported from TypeScript
    """
    return [
        {
            "id": "ex_barbell_bench_press",
            "name": "Barbell Bench Press",
            "category": "resistance",
            "primaryMuscles": ["chest"],
            "secondaryMuscles": ["triceps", "shoulders"],
            "equipment": ["barbell"],
            "movementPattern": "horizontal_push",
            "difficulty": "intermediate",
            "description": "The king of upper body pressing movements.",
            "cues": ["Retract scapulae", "Arch lower back slightly"],
            "commonMistakes": ["Flaring elbows too wide"],
            "tags": ["compound", "mass_builder"],
            "defaultParameters": {"sets": 4, "reps": 6, "tempo": "3-0-1-0", "rest": 180}
        },
        {
            "id": "ex_deadlift",
            "name": "Conventional Deadlift",
            "category": "resistance",
            "primaryMuscles": ["back", "glutes", "hamstrings"],
            "secondaryMuscles": ["traps", "forearms"],
            "equipment": ["barbell"],
            "movementPattern": "hinge",
            "difficulty": "advanced",
            "description": "The ultimate posterior chain developer.",
            "cues": ["Bar over mid-foot", "Neutral spine"],
            "commonMistakes": ["Rounding lower back"],
            "tags": ["compound", "full_body", "strength"],
            "defaultParameters": {"sets": 5, "reps": 5, "tempo": "2-0-2-0", "rest": 240}
        },
        {
            "id": "ex_squat",
            "name": "Barbell Back Squat",
            "category": "resistance",
            "primaryMuscles": ["quads", "glutes"],
            "secondaryMuscles": ["hamstrings", "lower_back"],
            "equipment": ["barbell"],
            "movementPattern": "squat",
            "difficulty": "intermediate",
            "description": "The king of lower body movements.",
            "cues": ["Keep chest up", "Knees track over toes"],
            "commonMistakes": ["Knee valgus", "Forward lean"],
            "tags": ["compound", "legs", "strength"],
            "defaultParameters": {"sets": 4, "reps": 8, "tempo": "3-0-1-0", "rest": 180}
        }
    ]


def seed_from_json_file(db: Session, json_file_path: str):
    """
    Seed exercises from a JSON file exported from TypeScript
    
    Args:
        db: Database session
        json_file_path: Path to JSON file containing exercises
    """
    json_path = Path(json_file_path)
    if not json_path.exists():
        print(f"❌ JSON file not found: {json_file_path}")
        return
    
    print(f"Loading exercises from {json_file_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        exercises_data = json.load(f)
    
    if isinstance(exercises_data, list):
        seed_exercises(db, exercises_data)
    elif isinstance(exercises_data, dict) and "exercises" in exercises_data:
        seed_exercises(db, exercises_data["exercises"])
    else:
        print("❌ Invalid JSON format. Expected array of exercises or object with 'exercises' key.")


def seed_default_admin_user(db: Session):
    """Create a default admin user for testing"""
    existing_user = db.query(User).filter(User.username == "admin").first()
    if existing_user:
        print("Default admin user already exists. Skipping.")
        return
    
    admin_user = User(
        username="admin",
        email="admin@flexpro.com",
        password_hash=hash_password("admin123"),
        full_name="Admin User",
        role="coach",
        is_super_admin=1
    )
    
    db.add(admin_user)
    db.commit()
    print("✅ Created default admin user (username: admin, password: admin123)")


def main():
    """Main seeding function"""
    print("🌱 Starting database seeding...")
    
    # Initialize database (create tables)
    init_db()
    print("✅ Database initialized")
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Seed exercises
        # Check if JSON file path provided as command line argument
        if len(sys.argv) > 1:
            json_file = sys.argv[1]
            seed_from_json_file(db, json_file)
        else:
            # Use default exercises
            seed_exercises(db)
        
        # Seed default admin user
        seed_default_admin_user(db)
        
        print("✅ Database seeding completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during seeding: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()


