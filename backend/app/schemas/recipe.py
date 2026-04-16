from datetime import datetime
from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Literal, Dict

# this is for a single ingredient item
class Ingredient(BaseModel):
    quantity: str
    unit: str
    item: str

# nutrition info can be optional
class NutritionEstimate(BaseModel):
    calories: Optional[int] = None
    protein: Optional[str] = None
    carbs: Optional[str] = None
    fat: Optional[str] = None

# this is the base structure for all recipes
class RecipeBase(BaseModel):
    url: str
    title: str
    cuisine: str
    prep_time: str
    cook_time: str
    total_time: str
    servings: int
    difficulty: Literal["easy", "medium", "hard"]
    ingredients: List[Ingredient]
    instructions: List[str]
    nutrition_estimate: Optional[NutritionEstimate] = None
    substitutions: List[str]
    shopping_list: Dict[str, List[str]] 
    related_recipes: List[str]

# used when creating new ones
class RecipeCreate(RecipeBase):
    pass

# used when sending recipe info back to the frontend
class RecipeInfo(RecipeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# for handling url incoming from frontend
class UrlInput(BaseModel):
    url: str 
    
# for handling meal plan requests
class MealPlanRequest(BaseModel):
    recipe_ids: List[int]
