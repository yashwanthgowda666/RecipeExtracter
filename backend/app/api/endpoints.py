from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

from ..core.db import get_db
from ..models.recipe import Recipe
from ..schemas.recipe import UrlInput, RecipeInfo, RecipeBase, MealPlanRequest
from ..services.scraper import scrape_my_page
from ..services.llm_extractor import ask_ai_for_recipe
from ..services.meal_planner import generate_shopping_list

router = APIRouter()

@router.post("/extract", response_model=RecipeInfo)
async def extract_recipe_details(payload: UrlInput, db: Session = Depends(get_db)):
    # let's see if we already have this one in our db
    existing_one = db.query(Recipe).filter(Recipe.url == payload.url).first()
    if existing_one:
        return existing_one

    try:
        # first we get the raw text from the website
        page_text = await scrape_my_page(payload.url)
        
        # then we ask our AI to pull out the details
        ai_data = await ask_ai_for_recipe(page_text)
        
        # validate it using pydantic
        checked_data = RecipeBase(**ai_data, url=payload.url)
        
        # create the database object
        my_recipe = Recipe(
            url=checked_data.url,
            title=checked_data.title,
            cuisine=checked_data.cuisine,
            prep_time=checked_data.prep_time,
            cook_time=checked_data.cook_time,
            total_time=checked_data.total_time,
            servings=checked_data.servings,
            difficulty=checked_data.difficulty,
            ingredients=[i.model_dump() for i in checked_data.ingredients],
            instructions=checked_data.instructions,
            nutrition_estimate=checked_data.nutrition_estimate.model_dump() if checked_data.nutrition_estimate else None,
            substitutions=checked_data.substitutions,
            shopping_list=checked_data.shopping_list,
            related_recipes=checked_data.related_recipes
        )
        
        # save it and refresh to get the id
        db.add(my_recipe)
        db.commit()
        db.refresh(my_recipe)
        return my_recipe
        
    except ValueError as ve:
        # this happens if validation fails or AI gives bad data
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as err:
        # generic error fallback
        db.rollback()
        msg = str(err)
        
        # log for debugging
        print(f"Oops, something went wrong: {msg}")
        
        if "blocking our scraper" in msg:
            raise HTTPException(status_code=503, detail=msg)
        elif "Status code: 404" in msg:
            raise HTTPException(status_code=404, detail="We couldn't find that recipe page. Is the URL correct?")
        elif "Status code:" in msg or "Could not get the page content" in msg:
            raise HTTPException(status_code=400, detail="The website is giving us trouble. Try another link?")
        else:
            raise HTTPException(status_code=500, detail="Something went wrong on our end. Please try again later.")


@router.get("/recipes", response_model=List[RecipeInfo])
def get_all_saved_recipes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # just return all the recipes we've saved so far
    return db.query(Recipe).order_by(Recipe.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/recipes/{id}", response_model=RecipeInfo)
def get_one_recipe(id: int, db: Session = Depends(get_db)):
    # find a specific recipe by its ID
    item = db.query(Recipe).filter(Recipe.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return item


@router.post("/meal-plan", response_model=Dict[str, List[str]])
def make_meal_plan(data: MealPlanRequest, db: Session = Depends(get_db)):
    # user picks some recipes, we combine their ingredients
    the_recipes = db.query(Recipe).filter(Recipe.id.in_(data.recipe_ids)).all()
    if not the_recipes:
        raise HTTPException(status_code=404, detail="No valid recipes found")
        
    # collect all ingredients from the chosen recipes
    ingredients_pool = [r.ingredients for r in the_recipes if r.ingredients]
    
    # merge them into a single shopping list
    return generate_shopping_list(ingredients_pool)
