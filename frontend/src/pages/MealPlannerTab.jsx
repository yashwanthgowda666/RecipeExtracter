import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAllRecipes, getShoppingList } from '../services/api';
import { ShoppingCart, CheckCircle, Loader2 } from 'lucide-react';

const MealPlannerTab = () => {
  // get the list of recipes we have
  const { data: recipes, isLoading: loading } = useQuery({
    queryKey: ['recipes'],
    queryFn: getAllRecipes
  });

  const [pickedIds, setPickedIds] = useState([]);

  const listMutation = useMutation({
    mutationFn: getShoppingList
  });

  const toggle = (id) => {
    // if already in list, remove it, else add it
    setPickedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const onGenerate = () => {
    if (pickedIds.length > 0) {
      listMutation.mutate(pickedIds);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Wait a second, loading recipes...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Shopping List Maker</h2>
          <p className="text-gray-500 mt-2">Pick the recipes you want to cook and we will make a list for you.</p>
        </div>
        <button
          onClick={onGenerate}
          disabled={pickedIds.length === 0 || listMutation.isPending}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:bg-green-300 flex items-center shadow-sm"
        >
          {listMutation.isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <ShoppingCart className="w-5 h-5 mr-2" />}
          Get Shopping List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recipes?.map(recipe => {
                 const isSelected = pickedIds.includes(recipe.id);
                 return (
                    <div 
                       key={recipe.id}
                       onClick={() => toggle(recipe.id)}
                       className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-500/20' : 'border-gray-200 bg-white hover:border-gray-300'
                       }`}
                    >
                       <div className="flex justify-between items-start">
                          <div>
                             <h4 className="font-bold text-gray-900">{recipe.title}</h4>
                             <p className="text-sm text-gray-500 mt-1">{recipe.difficulty} • {recipe.prep_time}</p>
                          </div>
                          {isSelected && <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />}
                       </div>
                    </div>
                 )
              })}
           </div>
        </div>

        <div className="lg:col-span-1">
          {listMutation.isSuccess && listMutation.data && (
            <div className="bg-white border text-gray-800 border-gray-200 rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center shadow-sm pb-4 border-b">
                 <ShoppingCart className="w-6 h-6 mr-2 text-green-600" />
                 Your List
              </h3>
              
              <div className="space-y-6">
                 {Object.entries(listMutation.data).map(([cat, items]) => (
                    <div key={cat}>
                       <h4 className="font-bold text-green-700 bg-green-50 px-2 py-1 rounded uppercase tracking-wider text-xs mb-3">
                          {cat}
                       </h4>
                       <ul className="space-y-2">
                          {items.map((item, idx) => (
                             <li key={idx} className="flex items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-2 flex-shrink-0"></span>
                                <span className="text-sm font-medium">{item}</span>
                             </li>
                          ))}
                       </ul>
                    </div>
                 ))}
                 
                 {Object.keys(listMutation.data).length === 0 && (
                    <p className="text-gray-500 text-sm">Nothing to buy!</p>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlannerTab;
