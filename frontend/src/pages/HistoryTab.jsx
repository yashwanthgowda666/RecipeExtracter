import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { X } from 'lucide-react';

const HistoryTab = () => {
  // get all recipes we saved before
  const { data: recipes, isLoading, isError } = useQuery({
    queryKey: ['recipes'],
    queryFn: getAllRecipes
  });

  const [openedRecipe, setOpenedRecipe] = useState(null);

  if (isLoading) return <div className="text-center py-20 text-gray-500">Loading your recipes...</div>;
  if (isError) return <div className="text-center py-20 text-red-500">Oops, something went wrong while loading history.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Recipe History</h2>
        <p className="text-gray-500 mt-2">All the recipes you have extracted over time.</p>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cuisine</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recipes?.length === 0 && (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No recipes extracted yet.</td></tr>
            )}
            {recipes?.map((recipe) => (
              <tr key={recipe.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{recipe.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {recipe.cuisine || 'Not specified'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {recipe.difficulty}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setOpenedRecipe(recipe)}
                    className="text-orange-600 hover:text-orange-900 font-bold"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {openedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setOpenedRecipe(null)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all animate-in fade-in zoom-in duration-300">
            {/* Close Button Header */}
            <div className="sticky top-0 z-10 flex justify-end p-4 bg-white/80 backdrop-blur-md rounded-t-2xl">
              <button
                onClick={() => setOpenedRecipe(null)}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 text-gray-600 transition-colors shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Card Content */}
            <div className="p-1 px-4 pb-8">
              <RecipeCard recipe={openedRecipe} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
