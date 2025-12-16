import { useState, useCallback } from "react";
import {
  searchRecipes as apiSearchRecipes,
  filterByCategory as apiFilterByCategory,
} from "@/api/mealdb";
import type { RecipeBasic, UseRecipesReturn } from "@/types";

/**
 * Custom hook for searching and filtering recipes
 * Handles loading states, errors, and provides search/filter functionality
 */
export function useRecipes(): UseRecipesReturn {
  const [recipes, setRecipes] = useState<RecipeBasic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchRecipes = useCallback(async (query: string) => {
    if (!query.trim()) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await apiSearchRecipes(query);
      setRecipes(results);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to search recipes";
      setError(errorMessage);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterByCategory = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);

    try {
      if (!category || category === "all") {
        setRecipes([]);
        return;
      }

      const results = await apiFilterByCategory(category);
      setRecipes(results);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to filter recipes";
      setError(errorMessage);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    recipes,
    loading,
    error,
    searchRecipes,
    filterByCategory,
  };
}
