"""
Extended SQLAlchemy Models for Exercises, Foods, and Supplements
Compatible with the seed.py data structure
"""

from sqlalchemy import Column, Integer, String, Text, Float, JSON, DateTime
from sqlalchemy.sql import func
from app.db.database import Base


class Exercise(Base):
    """Exercise model with scientific parameters"""
    __tablename__ = "exercises"

    id = Column(String, primary_key=True, index=True)  # e.g., 'ex_barbell_bench_press'
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(50), nullable=False)  # resistance, cardio, etc.
    primary_muscles = Column(JSON, nullable=False)  # List of muscle groups
    secondary_muscles = Column(JSON, default=[])  # List of muscle groups
    equipment = Column(JSON, nullable=False)  # List of equipment
    difficulty = Column(String(50), nullable=False)  # beginner, intermediate, advanced, elite
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    
    # Scientific parameters (varies by category)
    default_sets = Column(Integer, nullable=True)
    default_reps = Column(Integer, nullable=True)
    default_rest = Column(Integer, nullable=True)  # seconds
    rpe = Column(Integer, nullable=True)  # Rate of Perceived Exertion
    tempo = Column(String(20), nullable=True)  # e.g., '3-0-1-0'
    
    # Cardio parameters
    default_duration = Column(Integer, nullable=True)  # minutes
    intensity_zone = Column(Integer, nullable=True)  # 1-5
    
    tags = Column(JSON, default=[])
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Food(Base):
    """Food model with complete nutritional data"""
    __tablename__ = "foods"

    id = Column(String, primary_key=True, index=True)  # e.g., 'food_chicken_breast'
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False)  # protein, carbohydrate, etc.
    serving_size = Column(Float, nullable=False)
    serving_unit = Column(String(50), nullable=False)
    
    # Macronutrients
    calories = Column(Integer, nullable=False)
    protein = Column(Float, nullable=False)
    carbs = Column(Float, nullable=False)
    fat = Column(Float, nullable=False)
    fiber = Column(Float, default=0)
    
    # Additional info
    benefits = Column(Text, nullable=True)
    tags = Column(JSON, default=[])
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Supplement(Base):
    """Supplement model with evidence-based protocols"""
    __tablename__ = "supplements"

    id = Column(String, primary_key=True, index=True)  # e.g., 'supp_creatine_monohydrate'
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False)  # creatine, protein, etc.
    
    # Dosing protocol
    standard_dose = Column(Float, nullable=False)
    dose_unit = Column(String(20), nullable=False)  # g, mg, IU
    timing = Column(String(50), nullable=False)  # anytime, pre_workout, post_workout, etc.
    
    # Scientific evidence
    evidence_level = Column(String(50), nullable=False)  # strong, moderate, preliminary
    benefits = Column(Text, nullable=False)
    instructions = Column(Text, nullable=True)
    
    tags = Column(JSON, default=[])
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
