// Core Recipe interface matching TheMealDB API response
export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string;
  [key: string]: string | null;
}

// Transformed Recipe for internal use
export interface RecipeDetails {
  id: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  thumbnail: string;
  tags: string[];
  youtubeUrl: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  name: string;
  measure: string;
}

// Simplified Recipe for lists
export interface RecipeBasic {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
}

// Category from API
export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

// Meal Plan
export interface MealPlan {
  [date: string]: RecipeDetails | null;
}

// Shopping List
export interface ShoppingListItem {
  id: string;
  name: string;
  measure: string;
  purchased: boolean;
}

// API Response types
export interface RecipesSearchResponse {
  meals: Recipe[] | null;
}

export interface RecipeDetailsResponse {
  meals: Recipe[] | null;
}

export interface CategoriesResponse {
  categories: Category[];
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
}

// Hook return types
export interface UseRecipesReturn {
  recipes: RecipeBasic[];
  loading: boolean;
  error: string | null;
  searchRecipes: (query: string) => Promise<void>;
  filterByCategory: (category: string) => Promise<void>;
}

export interface UseRecipeDetailsReturn {
  recipe: RecipeDetails | null;
  loading: boolean;
  error: string | null;
  fetchRecipe: (id: string) => Promise<void>;
}

export interface UseMealPlanReturn {
  mealPlan: MealPlan;
  addMeal: (date: string, recipe: RecipeDetails) => void;
  removeMeal: (date: string) => void;
  clearMealPlan: () => void;
}

// Context types
export interface MealPlanState {
  mealPlan: MealPlan;
}

export type MealPlanAction =
  | { type: "ADD_MEAL"; payload: { date: string; recipe: RecipeDetails } }
  | { type: "REMOVE_MEAL"; payload: { date: string } }
  | { type: "CLEAR_MEAL_PLAN" }
  | { type: "LOAD_MEAL_PLAN"; payload: MealPlan };
