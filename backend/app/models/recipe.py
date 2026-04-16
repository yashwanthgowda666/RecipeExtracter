from sqlalchemy import Column, Integer, String, JSON, DateTime
from datetime import datetime
from ..core.db import Base

# This is the table where we store all our recipe information
class Recipe(Base):
    __tablename__ = 'recipes'

    # unique id for each recipe
    id = Column(Integer, primary_key=True, index=True)
    # the original link
    url = Column(String, unique=True, index=True, nullable=False)
    
    # basic recipe details
    title = Column(String, index=True)
    cuisine = Column(String)
    prep_time = Column(String)
    cook_time = Column(String)
    total_time = Column(String)
    servings = Column(Integer)
    difficulty = Column(String)
    
    # complex data stored as JSON buckets
    ingredients = Column(JSON)
    instructions = Column(JSON)
    nutrition_estimate = Column(JSON)
    substitutions = Column(JSON)
    shopping_list = Column(JSON)
    related_recipes = Column(JSON)
    
    # when was this added?
    created_at = Column(DateTime, default=datetime.utcnow)
