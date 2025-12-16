"""
Pydantic models for FlexPro AI Service
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator


class ClientProfile(BaseModel):
    """Client profile for workout/diet generation"""
    user_id: str = Field(..., description="User ID")
    age: int = Field(..., ge=10, le=120, description="Age in years")
    gender: str = Field(..., regex="^(male|female)$", description="Gender")
    height: float = Field(..., gt=0, le=300, description="Height in cm")
    weight: float = Field(..., gt=0, le=500, description="Weight in kg")
    fitness_level: str = Field(..., regex="^(beginner|intermediate|advanced)$", description="Fitness level")
    goal: str = Field(..., regex="^(strength|hypertrophy|fat_loss|maintenance)$", description="Fitness goal")
    days_per_week: int = Field(..., ge=1, le=7, description="Training days per week")
    activity_level: str = Field(..., regex="^(sedentary|light|moderate|active|very_active)$", description="Activity level")
    injuries: Optional[List[str]] = Field(default_factory=list, description="List of injuries")
    equipment_access: Optional[List[str]] = Field(default_factory=list, description="Available equipment")
    allergies: Optional[List[str]] = Field(default_factory=list, description="Food allergies")


class WorkoutPlan(BaseModel):
    """Generated workout plan"""
    split_type: str = Field(..., description="Type of split (full_body, upper_lower, push_pull_legs, etc.)")
    weeks: int = Field(default=4, description="Number of weeks")
    workouts: Dict[str, List[Dict[str, Any]]] = Field(..., description="Workouts by day")


class DietPlan(BaseModel):
    """Generated diet plan"""
    total_calories: float = Field(..., description="Total daily calories")
    macros: Dict[str, float] = Field(..., description="Macronutrient breakdown (protein, carbs, fat in grams)")
    meals: List[Dict[str, Any]] = Field(..., description="Meals with foods and portions")


class NutritionInfo(BaseModel):
    """Nutrition information for scraped foods"""
    name: str = Field(..., description="Food name")
    category: str = Field(..., description="Food category")
    calories_per_100g: float = Field(..., gt=0, description="Calories per 100g")
    protein_per_100g: float = Field(..., ge=0, description="Protein per 100g")
    carbs_per_100g: float = Field(..., ge=0, description="Carbs per 100g")
    fat_per_100g: float = Field(..., ge=0, description="Fat per 100g")
    fiber_per_100g: Optional[float] = Field(None, ge=0, description="Fiber per 100g")
    source: str = Field(..., description="Data source")


class ScrapingResult(BaseModel):
    """Result of scraping operation"""
    foods_added: int = Field(..., description="Number of foods added")
    foods_updated: int = Field(..., description="Number of foods updated")
    errors: List[str] = Field(default_factory=list, description="List of errors encountered")


# Request/Response models
class WorkoutGenerationRequest(BaseModel):
    """Request model for workout generation"""
    client_profile: ClientProfile


class WorkoutGenerationResponse(BaseModel):
    """Response model for workout generation"""
    success: bool
    workout_plan: Optional[WorkoutPlan]
    message: str


class DietGenerationRequest(BaseModel):
    """Request model for diet generation"""
    client_profile: ClientProfile


class DietGenerationResponse(BaseModel):
    """Response model for diet generation"""
    success: bool
    diet_plan: Optional[DietPlan]
    message: str


class ScrapingRequest(BaseModel):
    """Request model for data scraping"""
    source_url: str = Field(..., description="URL to scrape data from")
    categories: Optional[List[str]] = Field(None, description="Categories to scrape")


class ScrapingResponse(BaseModel):
    """Response model for data scraping"""
    success: bool
    result: ScrapingResult
    message: str