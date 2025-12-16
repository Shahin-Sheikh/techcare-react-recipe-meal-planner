import type {
  CategoriesResponse,
  Category,
  RecipeBasic,
  RecipeDetails,
  RecipeDetailsResponse,
  RecipesSearchResponse,
} from "@/types";
import { transformRecipe } from "../utils/helpers";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

/**
 * Handle API errors consistently
 */
function handleApiError(error: unknown): never {
  if (error instanceof Error) {
    throw new Error(`API Error: ${error.message}`);
  }
  throw new Error("An unknown error occurred");
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Search recipes by name
 */
export async function searchRecipes(query: string): Promise<RecipeBasic[]> {
  if (!query.trim()) {
    return [];
  }

  const data = await fetchApi<RecipesSearchResponse>(
    `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
  );

  if (!data.meals) {
    return [];
  }

  return data.meals.map((meal) => ({
    id: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory,
    thumbnail: meal.strMealThumb,
  }));
}

/**
 * Get recipe details by ID
 */
export async function getRecipeDetails(
  id: string
): Promise<RecipeDetails | null> {
  const data = await fetchApi<RecipeDetailsResponse>(
    `${BASE_URL}/lookup.php?i=${id}`
  );

  if (!data.meals || data.meals.length === 0) {
    return null;
  }

  return transformRecipe(data.meals[0]);
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  const data = await fetchApi<CategoriesResponse>(`${BASE_URL}/categories.php`);

  return data.categories;
}

/**
 * Filter recipes by category
 */
export async function filterByCategory(
  category: string
): Promise<RecipeBasic[]> {
  if (!category || category === "all") {
    return [];
  }

  const data = await fetchApi<RecipesSearchResponse>(
    `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
  );

  if (!data.meals) {
    return [];
  }

  return data.meals.map((meal) => ({
    id: meal.idMeal,
    name: meal.strMeal,
    category: category,
    thumbnail: meal.strMealThumb,
  }));
}

/**
 * Get multiple recipe details in parallel using Promise.all
 * Used for shopping list generation
 */
export async function getMultipleRecipeDetails(
  ids: string[]
): Promise<RecipeDetails[]> {
  const promises = ids.map((id) => getRecipeDetails(id));
  const results = await Promise.all(promises);

  // Filter out null results
  return results.filter((recipe): recipe is RecipeDetails => recipe !== null);
}
