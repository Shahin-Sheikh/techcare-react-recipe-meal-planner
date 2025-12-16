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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Weekly Meal Plan</h2>
        </div>
        {hasMeals && (
          <Button onClick={clearMealPlan} variant="destructive">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {weekDates.map((date) => {
            const dateKey = formatDate(date);
            const meal = mealPlan[dateKey];

            return (
              <Card
                key={dateKey}
                className={meal ? "border-blue-300 bg-blue-50" : ""}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{getDayName(date)}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {getDisplayDate(date)}
                  </p>
                </CardHeader>

                <CardContent>
                  {meal ? (
                    <div className="space-y-3">
                      <div
                        onClick={() => onRecipeClick(meal.id)}
                        className="cursor-pointer group"
                      >
                        <img
                          src={meal.thumbnail}
                          alt={meal.name}
                          className="w-full h-32 object-cover rounded-lg mb-2 group-hover:opacity-90 transition-opacity"
                        />
                        <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {meal.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {meal.category}
                        </p>
                      </div>
                      <Button
                        onClick={() => removeMeal(dateKey)}
                        variant="destructive"
                        size="sm"
                        className="w-full text-red-500 border rounded-md flex items-center justify-center"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-400">
                      <div className="text-center">
                        <p className="text-4xl mb-2">+</p>
                        <p className="text-sm">No meal planned</p>
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
