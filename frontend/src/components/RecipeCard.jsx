import React from 'react';
import { Clock, Users, ChevronRight, Check } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
  if (!recipe) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-8 text-white relative">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">{recipe.title}</h2>
        {recipe.cuisine && (
          <span className="inline-block bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider mb-4">
            {recipe.cuisine}
          </span>
        )}
        <div className="flex flex-wrap gap-4 text-sm font-medium">
          <div className="flex items-center"><Clock className="w-4 h-4 mr-1.5 opacity-80"/> Prep: {recipe.prep_time}</div>
          <div className="flex items-center"><Clock className="w-4 h-4 mr-1.5 opacity-80"/> Cook: {recipe.cook_time}</div>
          <div className="flex items-center"><Users className="w-4 h-4 mr-1.5 opacity-80"/> Serves: {recipe.servings}</div>
          <div className="flex items-center">
            <span className="opacity-80 mr-1.5">Diff:</span> 
            <span className="capitalize">{recipe.difficulty}</span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
        {/* Ingredients */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-2"/> Ingredients
          </h3>
          <ul className="space-y-3">
            {Array.isArray(recipe.ingredients) ? (
              recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-start text-gray-700 bg-gray-50 p-2 rounded-lg">
                  <span className="font-semibold w-24 text-gray-900">
                    {ing.quantity || ''} {ing.unit || ''}
                  </span>
                  <span className="flex-1">{ing.item || ''}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No ingredients listed.</li>
            )}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <ChevronRight className="w-5 h-5 text-blue-500 mr-2"/> Instructions
          </h3>
          <ol className="space-y-4">
            {Array.isArray(recipe.instructions) ? (
              recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm mr-3">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 pt-1 leading-relaxed">{step}</p>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No instructions listed.</li>
            )}
          </ol>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-6 border-t">
         {/* Nutrition */}
         {recipe.nutrition_estimate && (
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Nutrition</h4>
              <div className="flex gap-4 text-sm text-gray-700">
                <div><span className="block font-bold text-gray-900">{recipe.nutrition_estimate.calories}</span> Cal</div>
                <div><span className="block font-bold text-gray-900">{recipe.nutrition_estimate.protein}</span> Pro</div>
                <div><span className="block font-bold text-gray-900">{recipe.nutrition_estimate.carbs}</span> Carb</div>
                <div><span className="block font-bold text-gray-900">{recipe.nutrition_estimate.fat}</span> Fat</div>
              </div>
            </div>
         )}
         
         {/* Substitutions */}
         {recipe.substitutions && recipe.substitutions.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Substitutions</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {recipe.substitutions.map((sub, i) => <li key={i}>{sub}</li>)}
              </ul>
            </div>
         )}
      </div>
    </div>
  );
};

export default RecipeCard;
