import { useState, useEffect, useCallback } from "react";
import { useRecipes } from "./hooks/useRecipes";
import { getCategories } from "@/api/mealdb";
import { RecipeCard } from "./RecipeCard";
import { ErrorMessage, EmptyState } from "@/components/common";
import { debounce } from "@/utils/helpers";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChefHat } from "lucide-react";
import type { Category } from "@/types";

interface RecipeSearchProps {
  onRecipeClick: (id: string) => void;
}

export function RecipeSearch({
  onRecipeClick,
}: RecipeSearchProps): React.JSX.Element {
  const { recipes, loading, error, searchRecipes, filterByCategory } =
    useRecipes();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Load categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setCategoriesError("Failed to load categories");
      }
    }
    loadCategories();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      searchRecipes(query);
    }, 500),
    [searchRecipes]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedCategory("all");

    if (query.trim()) {
      debouncedSearch(query);
    }
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
    filterByCategory(category);
  };

  // Handle retry
  const handleRetry = () => {
    if (searchQuery) {
      searchRecipes(searchQuery);
    } else if (selectedCategory !== "all") {
      filterByCategory(selectedCategory);
    }
  };

  return (
    <div className="w-full">
      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search Recipes
            </label>
            <Input
              id="search"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for recipes (e.g., chicken, pasta)..."
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-64">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category.idCategory}
                    value={category.strCategory}
                  >
                    {category.strCategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoriesError && (
              <p className="text-xs text-red-600 mt-1">{categoriesError}</p>
            )}
          </div>
        </div>

        {/* Active filter indicator */}
        {(searchQuery || selectedCategory !== "all") && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Active filter:</span>
            {searchQuery && (
              <Badge variant="secondary">Search: "{searchQuery}"</Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary">Category: {selectedCategory}</Badge>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={handleRetry} />}

      {!loading &&
        !error &&
        recipes.length === 0 &&
        (searchQuery || selectedCategory !== "all") && (
          <EmptyState
            icon={<Search className="h-16 w-16 text-gray-400" />}
            title="No recipes found"
            message={
              searchQuery
                ? `No recipes match "${searchQuery}". Try a different search term.`
                : `No recipes found in ${selectedCategory} category.`
            }
          />
        )}

      {!loading &&
        !error &&
        recipes.length === 0 &&
        !searchQuery &&
        selectedCategory === "all" && (
          <EmptyState
            icon={<ChefHat className="h-16 w-16 text-gray-400" />}
            title="Start exploring recipes"
            message="Search for recipes by name or filter by category to get started!"
          />
        )}

      {!loading && !error && recipes.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Found {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => onRecipeClick(recipe.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
