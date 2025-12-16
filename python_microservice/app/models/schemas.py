"""
Pydantic models for API requests and responses
"""

from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field, validator
from enum import Enum


class FitnessLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class FitnessGoal(str, Enum):
    WEIGHT_LOSS = "weight_loss"
    WEIGHT_GAIN = "weight_gain"
    MAINTENANCE = "maintenance"
    MUSCLE_GAIN = "muscle_gain"
    STRENGTH = "strength"
    ENDURANCE = "endurance"


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"


class EquipmentLevel(str, Enum):
    NONE = "none"
    BASIC = "basic"
    FULL_GYM = "full_gym"


class ClientProfile(BaseModel):
    """Client profile for workout/diet generation"""
    user_id: str = Field(..., description="Supabase user ID")
    age: int = Field(..., ge=10, le=120, description="Age in years")
    gender: Gender
    height: float = Field(..., gt=0, le=300, description="Height in cm")
    weight: float = Field(..., gt=0, le=500, description="Weight in kg")
    fitness_level: FitnessLevel
    goal: FitnessGoal
    days_per_week: int = Field(..., ge=1, le=7, description="Training days per week")
    injuries: List[str] = Field(default_factory=list, description="List of injuries to avoid")
    allergies: List[str] = Field(default_factory=list, description="Food allergies")
    equipment_access: EquipmentLevel = EquipmentLevel.BASIC
    preferred_split: Optional[str] = Field(None, description="Preferred training split")
    experience_years: Optional[int] = Field(None, ge=0, le=50, description="Years of training experience")

    @validator('injuries', 'allergies')
    def validate_string_lists(cls, v):
        """Ensure lists contain only strings"""
        if not all(isinstance(item, str) for item in v):
            raise ValueError('All items must be strings')
        return v


class WorkoutItem(BaseModel):
    """Individual workout exercise"""
    name: str
    sets: int
    reps: str  # Can be "8-12" or "5" etc.
    rest: str = "60s"
    notes: Optional[str] = None
    weight_percentage: Optional[float] = None  # Percentage of 1RM


class WorkoutDay(BaseModel):
    """Single day workout plan"""
    exercises: List[WorkoutItem]
    focus: str = "General"  # e.g., "Chest", "Legs", "Full Body"
    duration_estimate: int  # minutes


class WorkoutPlan(BaseModel):
    """Complete workout plan"""
    split_type: str  # e.g., "Full Body", "Push/Pull/Legs", "Upper/Lower"
    days_per_week: int
    weeks_duration: int = 4  # How long this plan lasts
    workouts: Dict[str, WorkoutDay]  # day_name -> workout
    notes: Optional[str] = None


class DietItem(BaseModel):
    """Individual food item in diet"""
    meal: str  # e.g., "Breakfast", "Lunch"
    name: str
    amount: float
    unit: str
    calories: float
    protein: float
    carbs: float
    fat: float


class Macronutrients(BaseModel):
    """Daily macronutrient targets"""
    calories: float
    protein: float  # grams
    carbs: float    # grams
    fat: float      # grams


class DietPlan(BaseModel):
    """Complete diet plan"""
    daily_calories: float
    macronutrients: Macronutrients
    meals: List[DietItem]
    meal_frequencies: Dict[str, int]  # meal_type -> frequency per day
    notes: Optional[str] = None


class GenerationResponse(BaseModel):
    """Response for generation endpoints"""
    success: bool
    data: Dict[str, Any]
    message: str
    generated_at: str


class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: str
    details: Optional[Dict[str, Any]] = None


# Union types for responses
WorkoutGenerationResponse = GenerationResponse
DietGenerationResponse = GenerationResponse