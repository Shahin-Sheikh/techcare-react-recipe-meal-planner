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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Youtube, CalendarPlus, ChefHat, CheckCircle2 } from "lucide-react";
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
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-hidden p-0">
        {loading && (
          <div className="space-y-4 p-6">
            <Skeleton className="h-80 w-full rounded-xl" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        )}

        {error && (
          <div className="p-6">
            <ErrorMessage
              message={error}
              onRetry={() => fetchRecipe(recipeId)}
            />
          </div>
        )}

        {!loading && !error && recipe && (
          <div className="overflow-y-auto max-h-[92vh]">
            <div className="relative h-80 w-full overflow-hidden">
              <img
                src={recipe.thumbnail}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <DialogHeader>
                  <DialogTitle className="text-4xl font-bold mb-2 text-white">
                    {recipe.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-3 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-gray-900 hover:bg-white"
                  >
                    <ChefHat className="w-3.5 h-3.5 mr-1.5" />
                    {recipe.category}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="px-8 py-6">
              {recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {recipe.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <Button
                onClick={() => setShowAddToMeal(!showAddToMeal)}
                className="w-full sm:w-auto mb-6 bg-[#7BF1A8] hover:bg-[#67D890] text-gray-900 shadow-md hover:shadow-lg transition-all cursor-pointer"
                size="lg"
              >
                <CalendarPlus className="w-4 h-4 mr-2" />
                Add to Meal Plan
              </Button>

              {showAddToMeal && (
                <div className="mb-8 p-6 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                    <CalendarPlus className="w-5 h-5 text-blue-600" />
                    Select a day for your meal plan:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-5">
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
                          className={`flex flex-col h-auto py-3 transition-all cursor-pointer ${
                            selectedDate === dateKey
                              ? "bg-blue-300 hover:bg-blue-400 shadow-md"
                              : "hover:border-blue-400 hover:bg-blue-50"
                          }`}
                        >
                          <span className="font-medium">
                            {getDisplayDate(date)}
                          </span>
                          {isOccupied && (
                            <span className="text-xs mt-1 opacity-70">
                              Occupied
                            </span>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddToMealPlan}
                      disabled={!selectedDate}
                      className="bg-green-500 hover:bg-green-600 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Confirm
                    </Button>
                    <Button
                      onClick={() => setShowAddToMeal(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded-full" />
                  Ingredients
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-linear-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-lg border border-gray-200 hover:border-blue-200 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full group-hover:scale-125 transition-transform" />
                        <span className="font-medium text-gray-800">
                          {ingredient.name}
                        </span>
                      </div>
                      {ingredient.measure && (
                        <Badge
                          variant="secondary"
                          className="ml-2 bg-white text-gray-700"
                        >
                          {ingredient.measure}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded-full" />
                  Instructions
                </h3>
                <div className="space-y-4 bg-linear-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  {recipe.instructions.split("\n").map(
                    (paragraph, index) =>
                      paragraph.trim() && (
                        <div key={index} className="flex gap-4">
                          <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1 flex-1">
                            {paragraph}
                          </p>
                        </div>
                      )
                  )}
                </div>
              </div>

              {recipe.youtubeUrl && (
                <div className="pb-2">
                  <Button
                    asChild
                    variant="destructive"
                    size="lg"
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <a
                      href={recipe.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white flex items-center justify-center gap-2"
                    >
                      <Youtube className="h-5 w-5" />
                      Watch Video Tutorial
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
