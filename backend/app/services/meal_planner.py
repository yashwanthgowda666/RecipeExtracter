from typing import List, Dict
from ..schemas.recipe import Ingredient

def generate_shopping_list(all_ingredients_list: List[List[Dict]]) -> Dict[str, List[str]]:
    # This function takes all the ingredients from different recipes 
    # and puts them into one big list grouped by category.
    # It's a bit basic right now, just looking at keywords.
    
    shopping_list = {
        "Produce": [],
        "Dairy": [],
        "Meat": [],
        "Pantry": [],
        "Spices": [],
        "Other": []
    }
    
    # helper for putting things in buckets
    for recipe_ingredients in all_ingredients_list:
        for item_info in recipe_ingredients:
            # get the parts of each ingredient
            qty = item_info.get('quantity', '')
            unit = item_info.get('unit', '')
            name = item_info.get('item', '')
            
            pretty_name = f"{qty} {unit} {name}".strip()
            item_lower = name.lower()
            
            # check what category it belongs to
            if any(x in item_lower for x in ['milk', 'cheese', 'butter', 'cream', 'yogurt']):
                shopping_list["Dairy"].append(pretty_name)
            elif any(x in item_lower for x in ['chicken', 'beef', 'pork', 'fish', 'bacon', 'steak']):
                shopping_list["Meat"].append(pretty_name)
            elif any(x in item_lower for x in ['salt', 'pepper', 'sugar', 'flour', 'oil', 'vinegar', 'sauce', 'rice', 'pasta']):
                shopping_list["Pantry"].append(pretty_name)
            elif any(x in item_lower for x in ['garlic', 'onion', 'tomato', 'potato', 'carrot', 'pepper ', 'apple', 'lemon']):
                shopping_list["Produce"].append(pretty_name)
            elif any(x in item_lower for x in ['paprika', 'cumin', 'cinnamon', 'oregano']):
                shopping_list["Spices"].append(pretty_name)
            else:
                shopping_list["Other"].append(pretty_name)
                
    # don't return categories if they are empty
    return {category: items for category, items in shopping_list.items() if items}
