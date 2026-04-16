import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getRecipe } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { Search, Loader2, AlertCircle } from 'lucide-react';

const ExtractTab = () => {
  const [recipeUrl, setRecipeUrl] = useState('');

  const recipeMutation = useMutation({
    mutationFn: getRecipe,
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (recipeUrl) {
      recipeMutation.mutate(recipeUrl);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 pt-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Get Recipe Details from URL
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Just paste the link of the recipe blog you found. We will skip the long stories and find the actual recipe for you.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-6 w-6 text-gray-400" />
          <input
            type="url"
            value={recipeUrl}
            onChange={(e) => setRecipeUrl(e.target.value)}
            placeholder="https://example.com/recipe-link"
            required
            className="block w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm transition-all bg-white"
          />
          <button
            type="submit"
            disabled={recipeMutation.isPending}
            className="absolute right-2 top-2 bottom-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-xl transition-colors disabled:bg-orange-300 flex items-center"
          >
            {recipeMutation.isPending ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading...</>
            ) : (
              'Get Recipe'
            )}
          </button>
        </div>
      </form>

      {recipeMutation.isError && (
         <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl max-w-2xl mx-auto">
            <div className="flex text-red-800">
               <AlertCircle className="w-6 h-6 mr-2 opacity-80" />
               <p><strong>Error:</strong> {recipeMutation.error.response?.data?.detail || recipeMutation.error.message}</p>
            </div>
         </div>
      )}

      {recipeMutation.isSuccess && recipeMutation.data && (
        <div className="mt-12">
          <RecipeCard recipe={recipeMutation.data} />
        </div>
      )}
    </div>
  );
};

export default ExtractTab;
