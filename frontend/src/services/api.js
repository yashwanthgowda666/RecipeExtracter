import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

export const getRecipe = async (url) => {
  const res = await api.post('/extract', { url });
  return res.data;
};

export const getAllRecipes = async () => {
  const res = await api.get('/recipes');
  return res.data;
};

export const getSingleRecipe = async (id) => {
  const res = await api.get(`/recipes/${id}`);
  return res.data;
};

export const getShoppingList = async (ids) => {
  const res = await api.post('/meal-plan', { recipe_ids: ids });
  return res.data;
};
