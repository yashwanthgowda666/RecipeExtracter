import os
from pydantic_settings import BaseSettings

# Here we define all the settings for our app
# Pydantic will automatically load these from the .env file
class Settings(BaseSettings):
    PROJECT_NAME: str = "Recipe Extractor & Meal Planner"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./recipes.db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

# create an instance of the settings to use everywhere
settings = Settings()
