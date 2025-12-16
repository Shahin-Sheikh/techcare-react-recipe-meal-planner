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
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                Recipe Meal Planner
              </h1>
            </div>
            <nav className="flex space-x-1">
              <Button
                onClick={() => setCurrentView("search")}
                variant={currentView === "search" ? "default" : "ghost"}
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button
                onClick={() => setCurrentView("mealplan")}
                variant={currentView === "mealplan" ? "default" : "ghost"}
              >
                <Calendar className="h-4 w-4" />
                Meal Plan
              </Button>
              <Button
                onClick={() => setCurrentView("shopping")}
                variant={currentView === "shopping" ? "default" : "ghost"}
              >
                <ShoppingCart className="h-4 w-4" />
                Shopping List
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "search" && (
          <RecipeSearch onRecipeClick={handleRecipeClick} />
        )}
        {currentView === "mealplan" && (
          <MealPlanView onRecipeClick={handleRecipeClick} />
        )}
        {currentView === "shopping" && <ShoppingList />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Recipe data provided by{" "}
            <a
              href="https://www.themealdb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              TheMealDB
            </a>
          </p>
        </div>
      </footer>

      {/* Recipe Details Modal */}
      {selectedRecipeId && (
        <RecipeDetailsModal
          recipeId={selectedRecipeId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
