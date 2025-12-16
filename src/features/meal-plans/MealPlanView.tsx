import { useMealPlan } from "../../hooks/useMealPlan";
import {
  getWeekDates,
  formatDate,
  getDayName,
  getDisplayDate,
} from "@/utils/helpers";
import { EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

interface MealPlanViewProps {
  onRecipeClick: (id: string) => void;
}

export function MealPlanView({
  onRecipeClick,
}: MealPlanViewProps): React.JSX.Element {
  const { mealPlan, removeMeal, clearMealPlan } = useMealPlan();
  const weekDates = getWeekDates();

  const hasMeals = Object.keys(mealPlan).length > 0;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Weekly Meal Plan
          </h2>
        </div>
        {hasMeals && (
          <Button
            onClick={clearMealPlan}
            variant="destructive"
            size="sm"
            className="w-full sm:w-auto"
          >
            Clear All
          </Button>
        )}
      </div>

      {!hasMeals ? (
        <EmptyState
          icon={<CalendarDays className="h-16 w-16 text-gray-400" />}
          title="No meals planned yet"
          message="Search for recipes and click 'Add to Meal Plan' to get started!"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-3 sm:gap-4">
          {weekDates.map((date) => {
            const dateKey = formatDate(date);
            const meal = mealPlan[dateKey];

            return (
              <Card
                key={dateKey}
                className={meal ? "border-blue-300 bg-blue-50" : ""}
              >
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-base sm:text-lg">
                    {getDayName(date)}
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {getDisplayDate(date)}
                  </p>
                </CardHeader>

                <CardContent className="p-3 sm:p-4">
                  {meal ? (
                    <div className="space-y-2 sm:space-y-3">
                      <div
                        onClick={() => onRecipeClick(meal.id)}
                        className="cursor-pointer group"
                      >
                        <img
                          src={meal.thumbnail}
                          alt={meal.name}
                          className="w-full h-28 sm:h-32 object-cover rounded-lg mb-2 group-hover:opacity-90 transition-opacity"
                        />
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {meal.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {meal.category}
                        </p>
                      </div>
                      <Button
                        onClick={() => removeMeal(dateKey)}
                        variant="destructive"
                        size="sm"
                        className="w-full text-xs sm:text-sm text-red-500 border rounded-md flex items-center justify-center"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-28 sm:h-32 text-gray-400">
                      <div className="text-center">
                        <p className="text-3xl sm:text-4xl mb-2">+</p>
                        <p className="text-xs sm:text-sm">No meal planned</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
