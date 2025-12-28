"""
SQLAlchemy Models for Local SQLite Database
Mirrors TypeScript interfaces from the frontend
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base


class User(Base):
    """User model for local authentication"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), nullable=False, default="client")  # 'coach' or 'client'
    coach_code = Column(String(50), unique=True, nullable=True)  # For coaches
    is_super_admin = Column(Integer, default=0)  # 0 or 1 (SQLite doesn't have boolean)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    workout_plans = relationship("WorkoutPlan", back_populates="user", cascade="all, delete-orphan")


class Exercise(Base):
    """Exercise model - stores exercise data"""
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    exercise_id = Column(String(100), unique=True, nullable=False, index=True)  # Original ID from TypeScript
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(50), nullable=True)  # resistance, cardio, etc.
    muscle_group = Column(String(100), nullable=True, index=True)
    sub_muscle_group = Column(String(100), nullable=True)
    equipment = Column(String(100), nullable=True)
    type = Column(String(50), nullable=True)
    difficulty = Column(String(50), nullable=True)
    
    # Store complex exercise data as JSON
    scientific_data = Column(JSON, nullable=True)  # Stores full exercise object as JSON
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Food(Base):
    """Food model - stores food/nutrition data"""
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    food_id = Column(String(100), unique=True, nullable=False, index=True)  # Original ID
    name = Column(String(255), nullable=False, index=True)
    name_en = Column(String(255), nullable=True)
    category = Column(String(100), nullable=True)
    subcategory = Column(String(100), nullable=True)

    # Basic nutrition
    calories = Column(Integer, nullable=True)
    protein = Column(Integer, nullable=True)
    carbs = Column(Integer, nullable=True)
    fat = Column(Integer, nullable=True)
    fiber = Column(Integer, nullable=True)

    # Store detailed nutrition data as JSON
    macros = Column(JSON, nullable=True)  # {protein, carbs, fat, etc.}
    micros = Column(JSON, nullable=True)  # vitamins, minerals
    amino_acids = Column(JSON, nullable=True)

    # Scientific data
    protein_type = Column(String(50), nullable=True)
    protein_digestibility = Column(Integer, nullable=True)  # 0-100 percentage
    digestion_speed = Column(String(50), nullable=True)
    glycemic_index = Column(Integer, nullable=True)

    # Additional fields
    benefits = Column(Text, nullable=True)
    ideal_timing = Column(JSON, nullable=True)  # ["pre_workout", "post_workout", etc.]
    restrictions = Column(JSON, nullable=True)  # ["gluten_free", "dairy_free", etc.]
    allergens = Column(JSON, nullable=True)
    tags = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Supplement(Base):
    """Supplement model - stores supplement data"""
    __tablename__ = "supplements"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    supplement_id = Column(String(100), unique=True, nullable=False, index=True)  # Original ID
    name = Column(String(255), nullable=False, index=True)
    common_names = Column(JSON, nullable=True)  # ["Creatine", "CM"]
    category = Column(String(100), nullable=True)

    # Dosing information
    standard_dose = Column(Integer, nullable=True)
    dose_unit = Column(String(20), nullable=True)
    frequency_per_day = Column(Integer, nullable=True)
    timing = Column(JSON, nullable=True)  # ["anytime", "pre_workout", etc.]

    # Loading phase (optional)
    loading_dose = Column(Integer, nullable=True)
    loading_duration = Column(Integer, nullable=True)  # days

    # Evidence and benefits
    evidence_level = Column(String(50), nullable=True)  # "strong", "moderate", "weak"
    primary_benefits = Column(JSON, nullable=True)
    secondary_benefits = Column(JSON, nullable=True)
    mechanisms = Column(JSON, nullable=True)
    meta_analysis_findings = Column(Text, nullable=True)

    # Safety
    side_effects = Column(JSON, nullable=True)
    contraindications = Column(JSON, nullable=True)
    interactions = Column(JSON, nullable=True)
    pregnancy_safe = Column(Integer, default=0)  # 0 or 1
    breastfeeding_safe = Column(Integer, default=0)  # 0 or 1

    # Practical info
    goals = Column(JSON, nullable=True)
    stacks_with = Column(JSON, nullable=True)
    cost_effectiveness = Column(String(50), nullable=True)
    taste_rating = Column(Integer, nullable=True)  # 1-5
    mixability = Column(String(50), nullable=True)
    tags = Column(JSON, nullable=True)

    # Ratings
    popularity_score = Column(Integer, nullable=True)  # 1-100
    scientific_rating = Column(Integer, nullable=True)  # 1-10

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class WorkoutPlan(Base):
    """Workout plan model - stores user workout plans"""
    __tablename__ = "workout_plans"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Store entire workout plan as JSON for flexibility
    # This matches the structure: { days: { 1: [...], 2: [...] }, ... }
    data = Column(JSON, nullable=False)

    plan_name = Column(String(255), nullable=True)
    plan_type = Column(String(50), nullable=True)  # 'training', 'nutrition', etc.

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="workout_plans")


