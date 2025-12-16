import { useEffect, useState } from "react";
import { ErrorMessage } from "@/components/common";
import { getWeekDates, formatDate, getDisplayDate } from "@/utils/helpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Youtube } from "lucide-react";
import { useRecipeDetails } from "@/hooks/useRecipeDetails";
import { useMealPlan } from "@/hooks/useMealPlan";

interface RecipeDetailsModalProps {
  recipeId: string;
  onClose: () => void;
}

export function RecipeDetailsModal({
  recipeId,
  onClose,
}: RecipeDetailsModalProps): React.JSX.Element {
  const { recipe, loading, error, fetchRecipe } = useRecipeDetails();
  const { mealPlan, addMeal } = useMealPlan();
  const [showAddToMeal, setShowAddToMeal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    fetchRecipe(recipeId);
  }, [recipeId, fetchRecipe]);

  const weekDates = getWeekDates();

  const handleAddToMealPlan = () => {
    if (recipe && selectedDate) {
      addMeal(selectedDate, recipe);
      setShowAddToMeal(false);
      setSelectedDate("");
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        )}

        {error && (
          <ErrorMessage message={error} onRetry={() => fetchRecipe(recipeId)} />
        )}

        {!loading && !error && recipe && (
          <div>
            {/* Header */}
            <div className="mb-6">
              <img
                src={recipe.thumbnail}
                alt={recipe.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <DialogHeader>
                <DialogTitle className="text-3xl">{recipe.name}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge>{recipe.category}</Badge>
                <Badge variant="secondary">{recipe.area}</Badge>
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                onClick={() => setShowAddToMeal(!showAddToMeal)}
                className="mt-4"
              >
                Add to Meal Plan
              </Button>
            </div>

            {/* Add to Meal Plan Section */}
            {showAddToMeal && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Select a day:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-4">
                  {weekDates.map((date) => {
                    const dateKey = formatDate(date);
                    const isOccupied = !!mealPlan[dateKey];
                    return (
                      <Button
                        key={dateKey}
                        onClick={() => setSelectedDate(dateKey)}
                        disabled={isOccupied}
                        variant={
                          selectedDate === dateKey ? "default" : "outline"
                        }
                        className="flex flex-col h-auto py-3"
                      >
                        {getDisplayDate(date)}
                        {isOccupied && (
                          <div className="text-xs mt-1">Occupied</div>
                        )}
                      </Button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddToMealPlan}
                    disabled={!selectedDate}
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={() => setShowAddToMeal(false)}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Ingredients
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    <span className="font-medium text-gray-700">
                      {ingredient.name}
                    </span>
                    {ingredient.measure && (
                      <span className="ml-auto text-gray-600 text-sm">
                        {ingredient.measure}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Instructions
              </h3>
              <div className="prose max-w-none">
                {recipe.instructions.split("\n").map(
                  (paragraph, index) =>
                    paragraph.trim() && (
                      <p
                        key={index}
                        className="text-gray-700 mb-3 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    )
                )}
              </div>
            </div>

            {/* YouTube Link */}
            {recipe.youtubeUrl && (
              <div>
                <Button asChild variant="destructive">
                  <a
                    href={recipe.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Youtube className="h-5 w-5" />
                    Watch Video Tutorial
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
