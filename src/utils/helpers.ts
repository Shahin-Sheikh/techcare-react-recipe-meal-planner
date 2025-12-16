import type { Ingredient, Recipe, RecipeDetails } from "@/types";

/**
 * Transform API Recipe to RecipeDetails
 */
export function transformRecipe(apiRecipe: Recipe): RecipeDetails {
  const ingredients: Ingredient[] = [];

  // Extract ingredients and measures from dynamic fields
  for (let i = 1; i <= 20; i++) {
    const ingredient = apiRecipe[`strIngredient${i}`];
    const measure = apiRecipe[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }

  return {
    id: apiRecipe.idMeal,
    name: apiRecipe.strMeal,
    category: apiRecipe.strCategory,
    area: apiRecipe.strArea,
    instructions: apiRecipe.strInstructions,
    thumbnail: apiRecipe.strMealThumb,
    tags: apiRecipe.strTags
      ? apiRecipe.strTags.split(",").map((tag) => tag.trim())
      : [],
    youtubeUrl: apiRecipe.strYoutube,
    ingredients,
  };
}

/**
 * Format date for meal plan keys (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Get week dates starting from Monday
 */
export function getWeekDates(startDate: Date = new Date()): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);

  // Get Monday of current week
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  current.setDate(diff);

  // Get 7 days from Monday
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Get day name from date
 */
export function getDayName(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

/**
 * Get formatted date string for display (e.g., "Mon, Jan 20")
 */
export function getDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Merge duplicate ingredients from shopping list
 */
export function mergeIngredients(ingredients: Ingredient[]): Ingredient[] {
  const merged = new Map<string, Ingredient>();

  ingredients.forEach((ingredient) => {
    const key = ingredient.name.toLowerCase();

    if (merged.has(key)) {
      const existing = merged.get(key)!;
      // Combine measures if different
      if (existing.measure !== ingredient.measure) {
        existing.measure = `${existing.measure}, ${ingredient.measure}`;
      }
    } else {
      merged.set(key, { ...ingredient });
    }
  });

  return Array.from(merged.values());
}
