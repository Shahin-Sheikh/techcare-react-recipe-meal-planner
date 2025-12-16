import { Button } from "@/components/ui/button";
import { MealPlanView, ShoppingList } from "@/features/meal-plans";
import { RecipeDetailsModal, RecipeSearch } from "@/features/recipes";
import { Calendar, ChefHat, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";

type View = "search" | "mealplan" | "shopping";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<View>("search");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const handleRecipeClick = (id: string) => {
    setSelectedRecipeId(id);
  };

  const handleCloseModal = () => {
    setSelectedRecipeId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setCurrentView("search")}
            >
              <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <span className="ml-2 font-bold text-base sm:text-xl">
                Recipe Planner
              </span>
            </div>
            <nav className="flex space-x-1">
              <Button
                onClick={() => setCurrentView("search")}
                variant={currentView === "search" ? "default" : "ghost"}
                size="sm"
                className="cursor-pointer px-2 sm:px-4"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Search</span>
              </Button>
              <Button
                onClick={() => setCurrentView("mealplan")}
                variant={currentView === "mealplan" ? "default" : "ghost"}
                size="sm"
                className="cursor-pointer px-2 sm:px-4"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Meal Plan</span>
              </Button>
              <Button
                onClick={() => setCurrentView("shopping")}
                variant={currentView === "shopping" ? "default" : "ghost"}
                size="sm"
                className="cursor-pointer px-2 sm:px-4"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Shopping List</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {currentView === "search" && (
          <RecipeSearch onRecipeClick={handleRecipeClick} />
        )}
        {currentView === "mealplan" && (
          <MealPlanView onRecipeClick={handleRecipeClick} />
        )}
        {currentView === "shopping" && <ShoppingList />}
      </main>

      {selectedRecipeId && (
        <RecipeDetailsModal
          recipeId={selectedRecipeId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
