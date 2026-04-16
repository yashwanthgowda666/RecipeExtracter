import json
import logging

import httpx

from ..core.config import settings

logger = logging.getLogger(__name__)

# current stable model from google
MODEL_NAME = "gemini-2.5-flash"
GEMINI_API_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{MODEL_NAME}:generateContent"
)

import os

# Load prompt template once
PROMPT_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "prompts", "recipe_extraction.txt")
with open(PROMPT_PATH, "r", encoding="utf-8") as f:
    prompt_text = f.read()

async def ask_ai_for_recipe(text: str) -> dict:
    # this function sends our cleaned text to Gemini
    # it asks the AI to give us back a JSON object
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
        raise ValueError("Please add your GEMINI_API_KEY in the .env file")

    # prep the prompt with our text
    final_prompt = prompt_text.replace("{text}", text)
    
    # this is what we send to the google api
    payload = {
        "contents": [{"parts": [{"text": final_prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "responseMimeType": "application/json",
        },
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                GEMINI_API_URL,
                params={"key": settings.GEMINI_API_KEY},
                json=payload,
            )
            response.raise_for_status()
            res_data = response.json()

        # pull out the text part from the ai results
        ai_raw_text = res_data["candidates"][0]["content"]["parts"][0]["text"]

        # clean up any markdown if the ai added it
        if "```" in ai_raw_text:
            ai_raw_text = ai_raw_text.replace("```json", "").replace("```", "").strip()
                
        # turn the string into a python dict
        recipe_dict = json.loads(ai_raw_text)
        
        # if the ai tells us it's not a recipe, we should stop
        if not recipe_dict.get("is_recipe", True):
            error_msg = recipe_dict.get("error_message") or "That link doesn't seem to have a recipe."
            raise ValueError(error_msg)
            
        return recipe_dict

    except json.JSONDecodeError:
        print("Bad JSON from AI!")
        raise ValueError("AI returned invalid data format")
    except httpx.HTTPStatusError as e:
        # log it for us to see in the terminal
        print(f"API Error from Google: {e.response.text}")
        raise ValueError("Could not connect to Gemini AI. Check our API key or usage limit.")
    except Exception as e:
        print(f"General error in AI extraction: {e}")
        raise e
