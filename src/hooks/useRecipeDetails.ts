import { useState, useCallback } from "react";
import { getRecipeDetails as apiGetRecipeDetails } from "@/api/mealdb";
import type { RecipeDetails, UseRecipeDetailsReturn } from "@/types";

/**
 * Custom hook for fetching recipe details by ID
 * Handles loading states, errors, and caching
 */
export function useRecipeDetails(): UseRecipeDetailsReturn {
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipe = useCallback(async (id: string) => {
    if (!id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const recipeData = await apiGetRecipeDetails(id);

      if (!recipeData) {
        throw new Error("Recipe not found");
      }

      setRecipe(recipeData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch recipe details";
      setError(errorMessage);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    recipe,
    loading,
    error,
    fetchRecipe,
  };
}
