import { useState, useEffect, useCallback } from "react";
import { useMealPlan } from "../../hooks/useMealPlan";
import { getMultipleRecipeDetails } from "@/api/mealdb";
import { mergeIngredients } from "@/utils/helpers";
import { ErrorMessage, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart } from "lucide-react";
import type { RecipeDetails, ShoppingListItem } from "@/types";

export function ShoppingList(): React.JSX.Element {
  const { mealPlan } = useMealPlan();
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generate shopping list from meal plan using parallel API calls
  const generateShoppingList = useCallback(async () => {
    const recipeIds = Object.values(mealPlan)
      .filter((recipe): recipe is RecipeDetails => recipe !== null)
      .map((recipe) => recipe.id);

    if (recipeIds.length === 0) {
      setShoppingList([]);
      return;
    }

    setLoading(true);
    setError(null);

    // Fetch all recipe details in parallel using Promise.all
    try {
      const recipes = await getMultipleRecipeDetails(recipeIds);

      const allIngredients = recipes.flatMap((recipe) => recipe.ingredients);

      const mergedIngredients = mergeIngredients(allIngredients);

      const items: ShoppingListItem[] = mergedIngredients.map(
        (ingredient, index) => ({
          id: `${index}-${ingredient.name}`,
          name: ingredient.name,
          measure: ingredient.measure,
          purchased: false,
        })
      );

      setShoppingList(items);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate shopping list";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [mealPlan]);

  useEffect(() => {
    generateShoppingList();
  }, [generateShoppingList]);

  const togglePurchased = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const clearCompleted = () => {
    setShoppingList((prev) => prev.filter((item) => !item.purchased));
  };

  const purchasedCount = shoppingList.filter((item) => item.purchased).length;
  const totalCount = shoppingList.length;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Shopping List</h2>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={generateShoppingList} />}

      {!loading && !error && shoppingList.length === 0 && (
        <EmptyState
          icon={<ShoppingCart className="h-16 w-16 text-gray-400" />}
          title="No shopping list yet"
          message="Add meals to your weekly plan to automatically generate a shopping list."
        />
      )}

      {!loading && !error && shoppingList.length > 0 && (
        <div>
          <div>
            <div className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress: {purchasedCount} of {totalCount} items
                </span>
                {purchasedCount > 0 && (
                  <Button
                    onClick={clearCompleted}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 border rounded-md"
                  >
                    Complete
                  </Button>
                )}
              </div>
              <Progress
                value={(purchasedCount / totalCount) * 100}
                className="h-3"
              />
            </div>
          </div>

          <div className="space-y-2">
            {shoppingList.map((item) => (
              <Card
                key={item.id}
                className={`${
                  item.purchased
                    ? "bg-green-50 border-green-200"
                    : "hover:border-blue-300"
                }`}
              >
                <CardContent className="flex items-center p-4">
                  <Checkbox
                    id={item.id}
                    checked={item.purchased}
                    onCheckedChange={() => togglePurchased(item.id)}
                  />
                  <label
                    htmlFor={item.id}
                    className="ml-4 flex-1 cursor-pointer"
                  >
                    <span
                      className={`font-medium ${
                        item.purchased
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.measure && (
                      <span
                        className={`ml-2 text-sm ${
                          item.purchased ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        ({item.measure})
                      </span>
                    )}
                  </label>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
